import json
from datetime import datetime
from typing import Any

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.cache import get_redis
from app.models import TravelEntry

TRAVEL_LIST_CACHE = "travel:list:published"
TRAVEL_CACHE_PREFIX = "travel:slug:"
CACHE_TTL = 300


def invalidate_travel_cache(slug: str | None = None) -> None:
    redis = get_redis()
    redis.delete(TRAVEL_LIST_CACHE)
    if slug:
        redis.delete(f"{TRAVEL_CACHE_PREFIX}{slug}")


def entry_to_dict(entry: TravelEntry) -> dict[str, Any]:
    return {
        "id": entry.id,
        "slug": entry.slug,
        "title": entry.title,
        "location_name": entry.location_name,
        "country_code": entry.country_code,
        "latitude": entry.latitude,
        "longitude": entry.longitude,
        "category": entry.category,
        "excerpt": entry.excerpt,
        "content": entry.content,
        "cover_image_url": entry.cover_image_url,
        "gallery_images": json.loads(entry.gallery_images or "[]"),
        "visited_at": entry.visited_at.isoformat() if entry.visited_at else None,
        "is_featured": entry.is_featured,
        "is_published": entry.is_published,
        "sort_order": entry.sort_order,
        "created_at": entry.created_at.isoformat() if entry.created_at else None,
        "updated_at": entry.updated_at.isoformat() if entry.updated_at else None,
    }


def list_entries(
    db: Session,
    *,
    published_only: bool = True,
    category: str | None = None,
) -> list[TravelEntry]:
    if published_only and not category:
        cached = get_redis().get(TRAVEL_LIST_CACHE)
        if cached:
            return [_entry_from_cache(row) for row in json.loads(cached)]

    q = db.query(TravelEntry).order_by(TravelEntry.visited_at.desc(), TravelEntry.sort_order)
    if published_only:
        q = q.filter(TravelEntry.is_published.is_(True))
    if category:
        q = q.filter(TravelEntry.category == category)
    entries = q.all()

    if published_only and not category:
        get_redis().setex(TRAVEL_LIST_CACHE, CACHE_TTL, json.dumps([entry_to_dict(e) for e in entries]))

    return entries


def get_by_slug(db: Session, slug: str, *, published_only: bool = True) -> TravelEntry | None:
    cache_key = f"{TRAVEL_CACHE_PREFIX}{slug}"
    if published_only:
        cached = get_redis().get(cache_key)
        if cached:
            return _entry_from_cache(json.loads(cached))

    q = db.query(TravelEntry).filter(TravelEntry.slug == slug)
    if published_only:
        q = q.filter(TravelEntry.is_published.is_(True))
    entry = q.first()

    if entry and published_only:
        get_redis().setex(cache_key, CACHE_TTL, json.dumps(entry_to_dict(entry)))

    return entry


def _entry_from_cache(row: dict[str, Any]) -> TravelEntry:
    entry = TravelEntry(
        id=row["id"],
        slug=row["slug"],
        title=row["title"],
        location_name=row["location_name"],
        country_code=row.get("country_code"),
        latitude=row.get("latitude"),
        longitude=row.get("longitude"),
        category=row.get("category", "other"),
        excerpt=row["excerpt"],
        content=row["content"],
        cover_image_url=row.get("cover_image_url"),
        gallery_images=json.dumps(row.get("gallery_images", [])),
        is_featured=row.get("is_featured", False),
        is_published=row.get("is_published", True),
        sort_order=row.get("sort_order", 0),
    )
    if row.get("visited_at"):
        entry.visited_at = datetime.fromisoformat(row["visited_at"])
    if row.get("created_at"):
        entry.created_at = datetime.fromisoformat(row["created_at"])
    if row.get("updated_at"):
        entry.updated_at = datetime.fromisoformat(row["updated_at"])
    return entry


def commit_entry(db: Session, entry: TravelEntry, old_slug: str | None = None) -> TravelEntry:
    try:
        db.commit()
        db.refresh(entry)
    except IntegrityError as exc:
        db.rollback()
        if "slug" in str(exc.orig).lower() or "unique" in str(exc.orig).lower():
            raise HTTPException(status_code=409, detail="Travel slug already exists") from exc
        raise
    invalidate_travel_cache(old_slug)
    invalidate_travel_cache(entry.slug)
    return entry
