from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from app.api.deps import require_permission
from app.core.database import get_db
from app.models import GalleryAlbum, User
from app.schemas import (
    GalleryAlbumCreate,
    GalleryAlbumItemIn,
    GalleryAlbumOut,
    GalleryAlbumItemOut,
    GalleryAlbumUpdate,
    GalleryReorderRequest,
)
from app.services import galleries as gallery_service

router = APIRouter(prefix="/galleries", tags=["galleries"])


def _album_out(album: GalleryAlbum) -> GalleryAlbumOut:
    return GalleryAlbumOut(
        id=album.id,
        slug=album.slug,
        title=album.title,
        description=album.description,
        cover_image_url=album.cover_image_url,
        is_published=album.is_published,
        sort_order=album.sort_order,
        items=[
            GalleryAlbumItemOut(
                id=i.id,
                url=i.url,
                alt_text=i.alt_text,
                caption=i.caption,
                sort_order=i.sort_order,
            )
            for i in sorted(album.items, key=lambda x: x.sort_order)
        ],
        created_at=album.created_at,
        updated_at=album.updated_at,
    )


@router.get("", response_model=list[GalleryAlbumOut])
def list_galleries(published_only: bool = True, db: Session = Depends(get_db)):
    return [_album_out(a) for a in gallery_service.list_albums(db, published_only=published_only)]


@router.get("/{slug}", response_model=GalleryAlbumOut)
def get_gallery(slug: str, db: Session = Depends(get_db)):
    album = gallery_service.get_album_by_slug(db, slug, published_only=True)
    if not album:
        raise HTTPException(status_code=404, detail="Gallery not found")
    return _album_out(album)


@router.post("", response_model=GalleryAlbumOut, status_code=201)
def create_gallery(
    data: GalleryAlbumCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("galleries:write")),
):
    payload = data.model_dump()
    items = payload.pop("items", [])
    album = GalleryAlbum(**payload)
    db.add(album)
    db.flush()
    gallery_service.sync_items(db, album, [i.model_dump() if hasattr(i, "model_dump") else i for i in items])
    gallery_service.commit_album(db, album)
    album = gallery_service.get_album_by_slug(db, album.slug, published_only=False)
    return _album_out(album)


@router.put("/{album_id}", response_model=GalleryAlbumOut)
def update_gallery(
    album_id: int,
    data: GalleryAlbumUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("galleries:write")),
):
    album = (
        db.query(GalleryAlbum)
        .options(joinedload(GalleryAlbum.items))
        .filter(GalleryAlbum.id == album_id)
        .first()
    )
    if not album:
        raise HTTPException(status_code=404, detail="Gallery not found")
    old_slug = album.slug
    updates = data.model_dump(exclude_unset=True)
    items = updates.pop("items", None)
    for k, v in updates.items():
        setattr(album, k, v)
    if items is not None:
        gallery_service.sync_items(db, album, [i if isinstance(i, dict) else i for i in items])
    gallery_service.commit_album(db, album, old_slug=old_slug)
    album = gallery_service.get_album_by_slug(db, album.slug, published_only=False)
    return _album_out(album)


@router.put("/{album_id}/items/reorder")
def reorder_gallery_items(
    album_id: int,
    data: GalleryReorderRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("galleries:write")),
):
    gallery_service.reorder_items(db, album_id, data.item_ids)
    return {"ok": True}


@router.delete("/{album_id}")
def delete_gallery(
    album_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("galleries:write")),
):
    album = db.query(GalleryAlbum).filter(GalleryAlbum.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Gallery not found")
    slug = album.slug
    db.delete(album)
    db.commit()
    gallery_service.invalidate_gallery_cache(slug)
    return {"ok": True}
