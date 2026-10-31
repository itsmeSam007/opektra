import json
import secrets
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.core.cache import get_redis
from app.core.cms_blocks import VALID_BLOCK_TYPES
from app.models import CMSBlock, CMSPage, CMSRevision

CMS_CACHE_PREFIX = "cms:page:"
PREVIEW_PREFIX = "cms:preview:"
MAX_REVISIONS = 10


def invalidate_page_cache(slug: str) -> None:
    get_redis().delete(f"{CMS_CACHE_PREFIX}{slug}")


def cache_published_page(slug: str, payload: dict[str, Any]) -> None:
    get_redis().setex(f"{CMS_CACHE_PREFIX}{slug}", 300, json.dumps(payload))


def get_cached_page(slug: str) -> dict[str, Any] | None:
    raw = get_redis().get(f"{CMS_CACHE_PREFIX}{slug}")
    if not raw:
        return None
    return json.loads(raw)


def create_preview_token(page_id: int) -> str:
    token = secrets.token_urlsafe(24)
    get_redis().setex(f"{PREVIEW_PREFIX}{token}", 3600, str(page_id))
    return token


def resolve_preview_token(token: str) -> int | None:
    raw = get_redis().get(f"{PREVIEW_PREFIX}{token}")
    return int(raw) if raw else None


def page_to_dict(page: CMSPage) -> dict[str, Any]:
    return {
        "id": page.id,
        "slug": page.slug,
        "title": page.title,
        "status": page.status,
        "seo": json.loads(page.seo or "{}"),
        "published_at": page.published_at.isoformat() if page.published_at else None,
        "scheduled_at": page.scheduled_at.isoformat() if page.scheduled_at else None,
        "blocks": [
            {
                "id": b.id,
                "type": b.block_type,
                "order": b.sort_order,
                "data": json.loads(b.data or "{}"),
                "visibility": b.visibility,
            }
            for b in sorted(page.blocks, key=lambda x: x.sort_order)
        ],
        "created_at": page.created_at.isoformat(),
        "updated_at": page.updated_at.isoformat(),
    }


def save_revision(db: Session, page: CMSPage, user_id: int | None) -> None:
    snapshot = json.dumps(page_to_dict(page))
    db.add(CMSRevision(page_id=page.id, snapshot=snapshot, created_by=user_id))
    db.flush()

    revisions = (
        db.query(CMSRevision)
        .filter(CMSRevision.page_id == page.id)
        .order_by(CMSRevision.created_at.desc())
        .all()
    )
    for old in revisions[MAX_REVISIONS:]:
        db.delete(old)


def sync_blocks(db: Session, page: CMSPage, blocks: list[dict[str, Any]]) -> None:
    page.blocks.clear()
    db.flush()
    for idx, block in enumerate(blocks):
        block_type = block.get("type", "rich_text")
        if block_type not in VALID_BLOCK_TYPES:
            block_type = "rich_text"
        page.blocks.append(
            CMSBlock(
                block_type=block_type,
                sort_order=block.get("order", idx),
                data=json.dumps(block.get("data", {})),
                visibility=block.get("visibility", "public"),
            )
        )


def publish_page(db: Session, page: CMSPage, scheduled_at: datetime | None = None) -> CMSPage:
    now = datetime.now(timezone.utc)
    if scheduled_at and scheduled_at > now:
        page.status = "scheduled"
        page.scheduled_at = scheduled_at
    else:
        page.status = "published"
        page.published_at = now
        page.scheduled_at = None
        invalidate_page_cache(page.slug)
        cache_published_page(page.slug, page_to_dict(page))
    return page
