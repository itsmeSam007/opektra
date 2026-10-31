from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.core.cache import get_redis
from app.models import GalleryAlbum, GalleryAlbumItem

GALLERY_LIST_CACHE = "galleries:list:published"
GALLERY_CACHE_PREFIX = "gallery:slug:"
CACHE_TTL = 300


def invalidate_gallery_cache(slug: str | None = None) -> None:
    redis = get_redis()
    redis.delete(GALLERY_LIST_CACHE)
    if slug:
        redis.delete(f"{GALLERY_CACHE_PREFIX}{slug}")


def list_albums(db: Session, *, published_only: bool = True) -> list[GalleryAlbum]:
    q = (
        db.query(GalleryAlbum)
        .options(joinedload(GalleryAlbum.items))
        .order_by(GalleryAlbum.sort_order, GalleryAlbum.title)
    )
    if published_only:
        q = q.filter(GalleryAlbum.is_published.is_(True))
    return q.all()


def get_album_by_slug(db: Session, slug: str, *, published_only: bool = True) -> GalleryAlbum | None:
    q = db.query(GalleryAlbum).options(joinedload(GalleryAlbum.items)).filter(GalleryAlbum.slug == slug)
    if published_only:
        q = q.filter(GalleryAlbum.is_published.is_(True))
    return q.first()


def sync_items(db: Session, album: GalleryAlbum, items: list[dict]) -> None:
    album.items.clear()
    db.flush()
    for idx, item in enumerate(items):
        album.items.append(
            GalleryAlbumItem(
                url=item["url"],
                alt_text=item.get("alt_text", item.get("alt", "")),
                caption=item.get("caption", ""),
                sort_order=item.get("sort_order", idx),
            )
        )


def reorder_items(db: Session, album_id: int, item_ids: list[int]) -> None:
    album = db.query(GalleryAlbum).filter(GalleryAlbum.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Gallery album not found")
    for order, item_id in enumerate(item_ids):
        item = db.query(GalleryAlbumItem).filter(
            GalleryAlbumItem.id == item_id, GalleryAlbumItem.album_id == album_id
        ).first()
        if item:
            item.sort_order = order
    db.commit()
    invalidate_gallery_cache(album.slug)


def commit_album(db: Session, album: GalleryAlbum, old_slug: str | None = None) -> GalleryAlbum:
    try:
        db.commit()
        db.refresh(album)
    except IntegrityError as exc:
        db.rollback()
        if "slug" in str(exc.orig).lower() or "unique" in str(exc.orig).lower():
            raise HTTPException(status_code=409, detail="Gallery slug already exists") from exc
        raise
    invalidate_gallery_cache(old_slug)
    invalidate_gallery_cache(album.slug)
    return album
