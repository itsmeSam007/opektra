from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.core.database import get_db
from app.models import PortfolioItem, User
from app.schemas import PortfolioItemCreate, PortfolioItemOut, PortfolioItemUpdate
from app.services import portfolio as portfolio_service

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


class PortfolioReorderRequest(BaseModel):
    item_ids: list[int]


@router.get("", response_model=list[PortfolioItemOut])
def list_portfolio(
    published_only: bool = True,
    category: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return [
        PortfolioItemOut.model_validate(p)
        for p in portfolio_service.list_items(db, published_only=published_only, category=category)
    ]


@router.patch("/reorder")
def reorder_portfolio(
    data: PortfolioReorderRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("portfolio:write")),
):
    portfolio_service.reorder_items(db, data.item_ids)
    return {"ok": True}


@router.get("/{slug}", response_model=PortfolioItemOut)
def get_portfolio_item(slug: str, db: Session = Depends(get_db)):
    item = portfolio_service.get_by_slug(db, slug, published_only=True)
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    return PortfolioItemOut.model_validate(item)


@router.post("", response_model=PortfolioItemOut, status_code=201)
def create_item(
    data: PortfolioItemCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("portfolio:write")),
):
    item = PortfolioItem(**data.model_dump())
    db.add(item)
    portfolio_service.commit_item(db, item)
    return PortfolioItemOut.model_validate(item)


@router.put("/{item_id}", response_model=PortfolioItemOut)
def update_item(
    item_id: int,
    data: PortfolioItemUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("portfolio:write")),
):
    item = db.query(PortfolioItem).filter(PortfolioItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    old_slug = item.slug
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    portfolio_service.commit_item(db, item, old_slug=old_slug)
    return PortfolioItemOut.model_validate(item)


@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("portfolio:write")),
):
    item = db.query(PortfolioItem).filter(PortfolioItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    slug = item.slug
    db.delete(item)
    db.commit()
    portfolio_service.invalidate_portfolio_cache(slug)
    return {"ok": True}
