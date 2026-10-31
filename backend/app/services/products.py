import json
from datetime import datetime
from typing import Any

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.cache import get_redis
from app.models import Product

PRODUCT_LIST_CACHE = "products:list:published"
PRODUCT_CACHE_PREFIX = "product:slug:"
CACHE_TTL = 300


def invalidate_product_cache(slug: str | None = None) -> None:
    redis = get_redis()
    redis.delete(PRODUCT_LIST_CACHE)
    if slug:
        redis.delete(f"{PRODUCT_CACHE_PREFIX}{slug}")


def product_to_dict(p: Product) -> dict[str, Any]:
    return {
        "id": p.id,
        "slug": p.slug,
        "name": p.name,
        "tagline": p.tagline,
        "description": p.description,
        "features": json.loads(p.features or "[]"),
        "domains": json.loads(p.domains or "[]"),
        "architecture": json.loads(p.architecture or "{}"),
        "screenshots": json.loads(p.screenshots or "[]"),
        "is_flagship": p.is_flagship,
        "is_published": p.is_published,
        "sort_order": p.sort_order,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }


def list_products(db: Session, *, published_only: bool = True) -> list[Product]:
    if published_only:
        cached = get_redis().get(PRODUCT_LIST_CACHE)
        if cached:
            rows = json.loads(cached)
            return [_product_from_cache(row) for row in rows]

    q = db.query(Product).order_by(Product.is_flagship.desc(), Product.sort_order, Product.name)
    if published_only:
        q = q.filter(Product.is_published.is_(True))
    products = q.all()

    if published_only:
        get_redis().setex(PRODUCT_LIST_CACHE, CACHE_TTL, json.dumps([product_to_dict(p) for p in products]))

    return products


def get_product_by_slug(db: Session, slug: str, *, published_only: bool = True) -> Product | None:
    cache_key = f"{PRODUCT_CACHE_PREFIX}{slug}"
    if published_only:
        cached = get_redis().get(cache_key)
        if cached:
            return _product_from_cache(json.loads(cached))

    q = db.query(Product).filter(Product.slug == slug)
    if published_only:
        q = q.filter(Product.is_published.is_(True))
    product = q.first()

    if product and published_only:
        get_redis().setex(cache_key, CACHE_TTL, json.dumps(product_to_dict(product)))

    return product


def _product_from_cache(row: dict[str, Any]) -> Product:
    p = Product(
        id=row["id"],
        slug=row["slug"],
        name=row["name"],
        tagline=row["tagline"],
        description=row["description"],
        features=json.dumps(row.get("features", [])),
        domains=json.dumps(row.get("domains", [])),
        architecture=json.dumps(row.get("architecture", {})),
        screenshots=json.dumps(row.get("screenshots", [])),
        is_flagship=row.get("is_flagship", False),
        is_published=row.get("is_published", True),
        sort_order=row.get("sort_order", 0),
    )
    if row.get("created_at"):
        p.created_at = datetime.fromisoformat(row["created_at"])
    if row.get("updated_at"):
        p.updated_at = datetime.fromisoformat(row["updated_at"])
    return p


def clear_other_flagships(db: Session, product_id: int | None = None) -> None:
    q = db.query(Product).filter(Product.is_flagship.is_(True))
    if product_id is not None:
        q = q.filter(Product.id != product_id)
    for other in q.all():
        other.is_flagship = False


def set_flagship(db: Session, product_id: int) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    clear_other_flagships(db, product_id)
    product.is_flagship = True
    db.commit()
    db.refresh(product)
    invalidate_product_cache(product.slug)
    return product


def commit_product(db: Session, product: Product, old_slug: str | None = None) -> Product:
    try:
        db.commit()
        db.refresh(product)
    except IntegrityError as exc:
        db.rollback()
        if "slug" in str(exc.orig).lower() or "unique" in str(exc.orig).lower():
            raise HTTPException(status_code=409, detail="Product slug already exists") from exc
        raise
    invalidate_product_cache(old_slug)
    invalidate_product_cache(product.slug)
    return product
