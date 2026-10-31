import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.api.deps import require_permission
from app.core.cms_blocks import CMS_BLOCK_TYPES
from app.core.database import get_db
from app.models import CMSPage, CMSRevision, User
from app.schemas.cms import (
    CMSBlockIn,
    CMSBlockOut,
    CMSPageCreate,
    CMSPageOut,
    CMSPageSummary,
    CMSPageUpdate,
    CMSPreviewTokenOut,
    CMSPublishRequest,
    CMSRevisionOut,
    CMSSeo,
)
from app.services import cms as cms_service

router = APIRouter(prefix="/cms", tags=["cms"])


def _page_out(page: CMSPage) -> CMSPageOut:
    seo = json.loads(page.seo or "{}")
    return CMSPageOut(
        id=page.id,
        slug=page.slug,
        title=page.title,
        status=page.status,
        seo=CMSSeo(**seo),
        published_at=page.published_at,
        scheduled_at=page.scheduled_at,
        blocks=[
            CMSBlockOut(
                id=b.id,
                type=b.block_type,
                order=b.sort_order,
                data=json.loads(b.data or "{}"),
                visibility=b.visibility,
            )
            for b in sorted(page.blocks, key=lambda x: x.sort_order)
        ],
        created_at=page.created_at,
        updated_at=page.updated_at,
    )


def _load_page(db: Session, page_id: int) -> CMSPage:
    page = (
        db.query(CMSPage)
        .options(joinedload(CMSPage.blocks))
        .filter(CMSPage.id == page_id, CMSPage.is_deleted.is_(False))
        .first()
    )
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.get("/pages", response_model=list[CMSPageSummary])
def list_pages(
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("cms:read")),
):
    pages = (
        db.query(CMSPage)
        .filter(CMSPage.is_deleted.is_(False))
        .order_by(CMSPage.updated_at.desc())
        .all()
    )
    return [
        CMSPageSummary(id=p.id, slug=p.slug, title=p.title, status=p.status, updated_at=p.updated_at)
        for p in pages
    ]


@router.get("/pages/id/{page_id}", response_model=CMSPageOut)
def get_page_by_id(
    page_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("cms:read")),
):
    return _page_out(_load_page(db, page_id))


@router.get("/pages/{slug}", response_model=CMSPageOut)
def get_page(
    slug: str,
    preview_token: str | None = Query(None),
    db: Session = Depends(get_db),
):
    preview_page_id = cms_service.resolve_preview_token(preview_token) if preview_token else None

    if preview_page_id:
        page = (
            db.query(CMSPage)
            .options(joinedload(CMSPage.blocks))
            .filter(CMSPage.id == preview_page_id, CMSPage.is_deleted.is_(False))
            .first()
        )
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")
        return _page_out(page)

    cached = cms_service.get_cached_page(slug)
    if cached and cached.get("status") == "published":
        return CMSPageOut(**cached)

    page = (
        db.query(CMSPage)
        .options(joinedload(CMSPage.blocks))
        .filter(
            CMSPage.slug == slug,
            CMSPage.is_deleted.is_(False),
            CMSPage.status == "published",
        )
        .first()
    )
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    payload = cms_service.page_to_dict(page)
    cms_service.cache_published_page(slug, payload)
    return _page_out(page)


@router.post("/pages", response_model=CMSPageOut)
def create_page(
    data: CMSPageCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("cms:write")),
):
    if db.query(CMSPage).filter(CMSPage.slug == data.slug, CMSPage.is_deleted.is_(False)).first():
        raise HTTPException(status_code=409, detail="Slug already exists")

    page = CMSPage(
        slug=data.slug,
        title=data.title,
        status=data.status,
        seo=json.dumps(data.seo.model_dump()),
    )
    db.add(page)
    db.flush()
    cms_service.sync_blocks(db, page, [b.model_dump() for b in data.blocks])
    cms_service.save_revision(db, page, user.id)
    db.commit()
    return _page_out(_load_page(db, page.id))


@router.put("/pages/{page_id}", response_model=CMSPageOut)
def update_page(
    page_id: int,
    data: CMSPageUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("cms:write")),
):
    page = _load_page(db, page_id)

    if data.slug and data.slug != page.slug:
        if db.query(CMSPage).filter(CMSPage.slug == data.slug, CMSPage.id != page_id).first():
            raise HTTPException(status_code=409, detail="Slug already exists")
        cms_service.invalidate_page_cache(page.slug)
        page.slug = data.slug

    if data.title is not None:
        page.title = data.title
    if data.status is not None:
        page.status = data.status
    if data.seo is not None:
        page.seo = json.dumps(data.seo.model_dump())
    if data.blocks is not None:
        cms_service.sync_blocks(db, page, [b.model_dump() for b in data.blocks])

    cms_service.save_revision(db, page, user.id)
    if page.status == "published":
        cms_service.invalidate_page_cache(page.slug)
        cms_service.cache_published_page(page.slug, cms_service.page_to_dict(page))

    db.commit()
    db.refresh(page)
    return _page_out(page)


@router.delete("/pages/{page_id}")
def delete_page(
    page_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("cms:delete")),
):
    page = _load_page(db, page_id)
    page.is_deleted = True
    cms_service.invalidate_page_cache(page.slug)
    db.commit()
    return {"ok": True}


@router.post("/pages/{page_id}/publish", response_model=CMSPageOut)
def publish_page(
    page_id: int,
    body: CMSPublishRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("cms:publish")),
):
    page = _load_page(db, page_id)
    cms_service.publish_page(db, page, body.scheduled_at)
    cms_service.save_revision(db, page, user.id)
    db.commit()
    db.refresh(page)
    return _page_out(page)


@router.get("/pages/{page_id}/revisions", response_model=list[CMSRevisionOut])
def list_revisions(
    page_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("cms:read")),
):
    _load_page(db, page_id)
    revisions = (
        db.query(CMSRevision)
        .filter(CMSRevision.page_id == page_id)
        .order_by(CMSRevision.created_at.desc())
        .limit(10)
        .all()
    )
    return [
        CMSRevisionOut(id=r.id, page_id=r.page_id, created_at=r.created_at, created_by=r.created_by)
        for r in revisions
    ]


@router.post("/pages/{page_id}/revisions/{revision_id}/restore", response_model=CMSPageOut)
def restore_revision(
    page_id: int,
    revision_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("cms:write")),
):
    page = _load_page(db, page_id)
    revision = (
        db.query(CMSRevision)
        .filter(CMSRevision.id == revision_id, CMSRevision.page_id == page_id)
        .first()
    )
    if not revision:
        raise HTTPException(status_code=404, detail="Revision not found")

    snapshot = json.loads(revision.snapshot)
    page.title = snapshot["title"]
    page.status = snapshot["status"]
    page.seo = json.dumps(snapshot.get("seo", {}))
    cms_service.sync_blocks(db, page, snapshot.get("blocks", []))
    cms_service.save_revision(db, page, user.id)
    cms_service.invalidate_page_cache(page.slug)
    db.commit()
    db.refresh(page)
    return _page_out(page)


@router.post("/preview-token", response_model=CMSPreviewTokenOut)
def issue_preview_token(
    page_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("cms:read")),
):
    _load_page(db, page_id)
    token = cms_service.create_preview_token(page_id)
    return CMSPreviewTokenOut(token=token)


@router.get("/block-types")
def list_block_types(_: User = Depends(require_permission("cms:read"))):
    return [{"type": key, **meta} for key, meta in CMS_BLOCK_TYPES.items()]
