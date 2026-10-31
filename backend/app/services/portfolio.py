import json
from typing import Any

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.cache import get_redis
from app.models import PortfolioItem

PORTFOLIO_LIST_CACHE = "portfolio:list:published"
PORTFOLIO_CACHE_PREFIX = "portfolio:slug:"
CACHE_TTL = 300


def invalidate_portfolio_cache(slug: str | None = None) -> None:
    redis = get_redis()
    redis.delete(PORTFOLIO_LIST_CACHE)
    if slug:
        redis.delete(f"{PORTFOLIO_CACHE_PREFIX}{slug}")


def item_to_dict(item: PortfolioItem) -> dict[str, Any]:
    return {
        "id": item.id,
        "slug": item.slug,
        "title": item.title,
        "category": item.category,
        "description": item.description,
        "technologies": item.technologies,
        "image_url": item.image_url,
        "project_url": item.project_url,
        "is_published": item.is_published,
        "sort_order": item.sort_order,
        "created_at": item.created_at.isoformat() if item.created_at else None,
    }


def list_items(
    db: Session,
    *,
    published_only: bool = True,
    category: str | None = None,
) -> list[PortfolioItem]:
    cache_key = PORTFOLIO_LIST_CACHE
    if published_only and not category:
        cached = get_redis().get(cache_key)
        if cached:
            return [_item_from_cache(row) for row in json.loads(cached)]

    q = db.query(PortfolioItem).order_by(PortfolioItem.sort_order, PortfolioItem.title)
    if published_only:
        q = q.filter(PortfolioItem.is_published.is_(True))
    if category:
        q = q.filter(PortfolioItem.category == category)
    items = q.all()

    if published_only and not category:
        get_redis().setex(cache_key, CACHE_TTL, json.dumps([item_to_dict(i) for i in items]))

    return items


def get_by_slug(db: Session, slug: str, *, published_only: bool = True) -> PortfolioItem | None:
    cache_key = f"{PORTFOLIO_CACHE_PREFIX}{slug}"
    if published_only:
        cached = get_redis().get(cache_key)
        if cached:
            return _item_from_cache(json.loads(cached))

    q = db.query(PortfolioItem).filter(PortfolioItem.slug == slug)
    if published_only:
        q = q.filter(PortfolioItem.is_published.is_(True))
    item = q.first()

    if item and published_only:
        get_redis().setex(cache_key, CACHE_TTL, json.dumps(item_to_dict(item)))

    return item


def _item_from_cache(row: dict[str, Any]) -> PortfolioItem:
    from datetime import datetime

    item = PortfolioItem(
        id=row["id"],
        slug=row["slug"],
        title=row["title"],
        category=row["category"],
        description=row["description"],
        technologies=row.get("technologies", ""),
        image_url=row.get("image_url"),
        project_url=row.get("project_url"),
        is_published=row.get("is_published", True),
        sort_order=row.get("sort_order", 0),
    )
    if row.get("created_at"):
        item.created_at = datetime.fromisoformat(row["created_at"])
    return item


def reorder_items(db: Session, item_ids: list[int]) -> None:
    for order, item_id in enumerate(item_ids):
        item = db.query(PortfolioItem).filter(PortfolioItem.id == item_id).first()
        if item:
            item.sort_order = order
    db.commit()
    invalidate_portfolio_cache()


def commit_item(db: Session, item: PortfolioItem, old_slug: str | None = None) -> PortfolioItem:
    try:
        db.commit()
        db.refresh(item)
    except IntegrityError as exc:
        db.rollback()
        if "slug" in str(exc.orig).lower() or "unique" in str(exc.orig).lower():
            raise HTTPException(status_code=409, detail="Portfolio slug already exists") from exc
        raise
    invalidate_portfolio_cache(old_slug)
    invalidate_portfolio_cache(item.slug)
    return item
