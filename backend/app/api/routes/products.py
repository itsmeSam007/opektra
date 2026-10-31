from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import parse_json_field, require_permission, serialize_json_field
from app.core.database import get_db
from app.models import Product, User
from app.schemas import ProductCreate, ProductOut, ProductUpdate
from app.services import products as product_service

products_router = APIRouter(prefix="/products", tags=["products"])


def _product_out(p: Product) -> ProductOut:
    return ProductOut(
        id=p.id,
        slug=p.slug,
        name=p.name,
        tagline=p.tagline,
        description=p.description,
        features=parse_json_field(p.features, []),
        domains=parse_json_field(p.domains, []),
        architecture=parse_json_field(p.architecture, {}),
        screenshots=parse_json_field(p.screenshots, []),
        is_flagship=p.is_flagship,
        is_published=p.is_published,
        sort_order=p.sort_order,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


@products_router.get("", response_model=list[ProductOut])
def list_products(published_only: bool = True, db: Session = Depends(get_db)):
    return [_product_out(p) for p in product_service.list_products(db, published_only=published_only)]


@products_router.get("/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    p = product_service.get_product_by_slug(db, slug, published_only=True)
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return _product_out(p)


@products_router.post("", response_model=ProductOut, status_code=201)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("products:write")),
):
    if data.is_flagship:
        product_service.clear_other_flagships(db)
    p = Product(
        slug=data.slug,
        name=data.name,
        tagline=data.tagline,
        description=data.description,
        features=serialize_json_field(data.features),
        domains=serialize_json_field(data.domains),
        architecture=serialize_json_field(data.architecture),
        screenshots=serialize_json_field(data.screenshots),
        is_flagship=data.is_flagship,
        is_published=data.is_published,
        sort_order=data.sort_order,
    )
    db.add(p)
    product_service.commit_product(db, p)
    return _product_out(p)


@products_router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("products:write")),
):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    old_slug = p.slug
    updates = data.model_dump(exclude_unset=True)
    if updates.get("is_flagship"):
        product_service.clear_other_flagships(db, product_id)
    for field, value in updates.items():
        if field in ("features", "domains", "architecture", "screenshots"):
            setattr(p, field, serialize_json_field(value))
        else:
            setattr(p, field, value)
    product_service.commit_product(db, p, old_slug=old_slug)
    return _product_out(p)


@products_router.patch("/{product_id}/flagship", response_model=ProductOut)
def set_flagship(
    product_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("products:write")),
):
    p = product_service.set_flagship(db, product_id)
    return _product_out(p)


@products_router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("products:write")),
):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    slug = p.slug
    db.delete(p)
    db.commit()
    product_service.invalidate_product_cache(slug)
    return {"ok": True}
