import json
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.core.cache import get_redis
from app.core.cache_ttl import PUBLIC_DETAIL_TTL, PUBLIC_LIST_TTL
from app.models import BlogPost
from app.schemas import BlogPostOut

BLOG_LIST_CACHE = "blog:list:published"
BLOG_CACHE_PREFIX = "blog:slug:"


def invalidate_blog_cache(slug: str | None = None) -> None:
    redis = get_redis()
    redis.delete(BLOG_LIST_CACHE)
    if slug:
        redis.delete(f"{BLOG_CACHE_PREFIX}{slug}")


def post_to_dict(p: BlogPost) -> dict[str, Any]:
    return {
        "id": p.id,
        "slug": p.slug,
        "title": p.title,
        "excerpt": p.excerpt,
        "content": p.content,
        "cover_image": p.cover_image,
        "tags": p.tags,
        "is_published": p.is_published,
        "published_at": p.published_at.isoformat() if p.published_at else None,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }


def _parse_post(row: dict[str, Any]) -> BlogPostOut:
    data = dict(row)
    for key in ("published_at", "created_at", "updated_at"):
        if data.get(key):
            data[key] = datetime.fromisoformat(data[key])
    return BlogPostOut(**data)


def list_published(db: Session) -> list[BlogPostOut]:
    cached = get_redis().get(BLOG_LIST_CACHE)
    if cached:
        return [_parse_post(row) for row in json.loads(cached)]

    posts = (
        db.query(BlogPost)
        .filter(BlogPost.is_published.is_(True))
        .order_by(BlogPost.published_at.desc().nullslast(), BlogPost.created_at.desc())
        .all()
    )
    rows = [post_to_dict(p) for p in posts]
    get_redis().setex(BLOG_LIST_CACHE, PUBLIC_LIST_TTL, json.dumps(rows))
    return [_parse_post(row) for row in rows]


def get_by_slug(db: Session, slug: str) -> BlogPostOut | None:
    cache_key = f"{BLOG_CACHE_PREFIX}{slug}"
    cached = get_redis().get(cache_key)
    if cached:
        return _parse_post(json.loads(cached))

    post = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.is_published.is_(True)).first()
    if not post:
        return None
    row = post_to_dict(post)
    get_redis().setex(cache_key, PUBLIC_DETAIL_TTL, json.dumps(row))
    return _parse_post(row)
