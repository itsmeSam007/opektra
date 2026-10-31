from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import parse_json_field, require_permission, serialize_json_field
from app.core.database import get_db
from app.models import TravelEntry, User
from app.schemas import TravelEntryCreate, TravelEntryOut, TravelEntryUpdate
from app.services import travel as travel_service

router = APIRouter(prefix="/travel", tags=["travel"])


def _gallery_out(raw: list) -> list[dict]:
    return [
        {"url": i.get("url", ""), "alt": i.get("alt", i.get("alt_text", "")), "caption": i.get("caption", "")}
        for i in raw
    ]


def _out(entry: TravelEntry) -> TravelEntryOut:
    return TravelEntryOut(
        id=entry.id,
        slug=entry.slug,
        title=entry.title,
        location_name=entry.location_name,
        country_code=entry.country_code,
        latitude=entry.latitude,
        longitude=entry.longitude,
        category=entry.category,
        excerpt=entry.excerpt,
        content=entry.content,
        cover_image_url=entry.cover_image_url,
        gallery_images=_gallery_out(parse_json_field(entry.gallery_images, [])),
        visited_at=entry.visited_at,
        is_featured=entry.is_featured,
        is_published=entry.is_published,
        sort_order=entry.sort_order,
        created_at=entry.created_at,
        updated_at=entry.updated_at,
    )


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    rows = (
        db.query(TravelEntry.category)
        .filter(TravelEntry.is_published.is_(True))
        .distinct()
        .all()
    )
    return [{"category": r[0]} for r in rows if r[0]]


@router.get("", response_model=list[TravelEntryOut])
def list_travel(
    published_only: bool = True,
    category: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return [_out(e) for e in travel_service.list_entries(db, published_only=published_only, category=category)]


@router.get("/{slug}", response_model=TravelEntryOut)
def get_travel(slug: str, db: Session = Depends(get_db)):
    entry = travel_service.get_by_slug(db, slug, published_only=True)
    if not entry:
        raise HTTPException(status_code=404, detail="Travel entry not found")
    return _out(entry)


@router.post("", response_model=TravelEntryOut, status_code=201)
def create_travel(
    data: TravelEntryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("travel:write")),
):
    payload = data.model_dump()
    gallery = payload.pop("gallery_images", [])
    payload["gallery_images"] = serialize_json_field(
        [{"url": g["url"], "alt": g.get("alt", ""), "caption": g.get("caption", "")} for g in gallery]
    )
    entry = TravelEntry(**payload)
    db.add(entry)
    travel_service.commit_entry(db, entry)
    return _out(entry)


@router.put("/{entry_id}", response_model=TravelEntryOut)
def update_travel(
    entry_id: int,
    data: TravelEntryUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("travel:write")),
):
    entry = db.query(TravelEntry).filter(TravelEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Travel entry not found")
    old_slug = entry.slug
    updates = data.model_dump(exclude_unset=True)
    if "gallery_images" in updates:
        gallery = updates.pop("gallery_images")
        updates["gallery_images"] = serialize_json_field(
            [{"url": g["url"], "alt": g.get("alt", ""), "caption": g.get("caption", "")} for g in gallery]
        )
    for k, v in updates.items():
        setattr(entry, k, v)
    travel_service.commit_entry(db, entry, old_slug=old_slug)
    return _out(entry)


@router.delete("/{entry_id}")
def delete_travel(
    entry_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("travel:write")),
):
    entry = db.query(TravelEntry).filter(TravelEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Travel entry not found")
    slug = entry.slug
    db.delete(entry)
    db.commit()
    travel_service.invalidate_travel_cache(slug)
    return {"ok": True}
