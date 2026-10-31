import hashlib
import json

from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.cache import get_redis
from app.core.cache_ttl import SEARCH_TTL
from app.core.database import get_db
from app.models import BlogPost, CaseStudy, CMSPage, PortfolioItem, Product, TravelEntry
from app.schemas import SearchResultOut

router = APIRouter(prefix="/search", tags=["search"])


def _add(
    results: list[SearchResultOut],
    *,
    type_: str,
    title: str,
    slug: str,
    excerpt: str,
    url: str,
) -> None:
    results.append(SearchResultOut(type=type_, title=title, slug=slug, excerpt=excerpt, url=url))


@router.get("", response_model=list[SearchResultOut])
def search(
    q: str = Query(min_length=2, max_length=200),
    type_filter: str | None = Query(default=None, alias="type"),
    limit: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    type_ = type_filter
    cache_key = f"search:{hashlib.sha256(f'{q}:{type_}:{limit}'.encode()).hexdigest()[:16]}"
    cached = get_redis().get(cache_key)
    if cached:
        return [SearchResultOut(**row) for row in json.loads(cached)]

    term = f"%{q}%"
    results: list[SearchResultOut] = []

    if type_ in (None, "product"):
        for p in (
            db.query(Product)
            .filter(Product.is_published.is_(True))
            .filter(or_(Product.name.ilike(term), Product.tagline.ilike(term), Product.description.ilike(term)))
            .limit(limit)
        ):
            _add(results, type_="product", title=p.name, slug=p.slug, excerpt=p.tagline, url=f"/products/{p.slug}")

    if type_ in (None, "blog"):
        for b in (
            db.query(BlogPost)
            .filter(BlogPost.is_published.is_(True))
            .filter(or_(BlogPost.title.ilike(term), BlogPost.excerpt.ilike(term)))
            .limit(limit)
        ):
            _add(results, type_="blog", title=b.title, slug=b.slug, excerpt=b.excerpt, url=f"/blog/{b.slug}")

    if type_ in (None, "portfolio"):
        for item in (
            db.query(PortfolioItem)
            .filter(PortfolioItem.is_published.is_(True))
            .filter(or_(PortfolioItem.title.ilike(term), PortfolioItem.description.ilike(term)))
            .limit(limit)
        ):
            _add(
                results,
                type_="portfolio",
                title=item.title,
                slug=item.slug,
                excerpt=item.description[:160],
                url=f"/portfolio#{item.slug}",
            )

    if type_ in (None, "case_study"):
        for cs in (
            db.query(CaseStudy)
            .filter(CaseStudy.is_published.is_(True))
            .filter(or_(CaseStudy.title.ilike(term), CaseStudy.summary.ilike(term)))
            .limit(limit)
        ):
            _add(
                results,
                type_="case_study",
                title=cs.title,
                slug=cs.slug,
                excerpt=cs.summary,
                url=f"/case-studies/{cs.slug}",
            )

    if type_ in (None, "travel"):
        for t in (
            db.query(TravelEntry)
            .filter(TravelEntry.is_published.is_(True))
            .filter(or_(TravelEntry.title.ilike(term), TravelEntry.excerpt.ilike(term)))
            .limit(limit)
        ):
            _add(results, type_="travel", title=t.title, slug=t.slug, excerpt=t.excerpt, url=f"/travel/{t.slug}")

    if type_ in (None, "page"):
        for page in (
            db.query(CMSPage)
            .filter(CMSPage.status == "published", CMSPage.is_deleted.is_(False))
            .filter(or_(CMSPage.title.ilike(term), CMSPage.slug.ilike(term)))
            .limit(limit)
        ):
            path = f"/{page.slug}" if page.slug != "home" else "/"
            _add(results, type_="page", title=page.title, slug=page.slug, excerpt=page.slug, url=path)

    trimmed = results[:limit]
    get_redis().setex(cache_key, SEARCH_TTL, json.dumps([r.model_dump() for r in trimmed]))
    return trimmed
