import json
from datetime import datetime
from typing import Any

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.cache import get_redis
from app.models import CaseStudy

CASE_STUDY_LIST_CACHE = "case_studies:list:published"
CASE_STUDY_CACHE_PREFIX = "case_study:slug:"
CACHE_TTL = 300


def invalidate_case_study_cache(slug: str | None = None) -> None:
    redis = get_redis()
    redis.delete(CASE_STUDY_LIST_CACHE)
    if slug:
        redis.delete(f"{CASE_STUDY_CACHE_PREFIX}{slug}")


def study_to_dict(study: CaseStudy) -> dict[str, Any]:
    return {
        "id": study.id,
        "slug": study.slug,
        "title": study.title,
        "client": study.client,
        "industry": study.industry,
        "summary": study.summary,
        "challenge": study.challenge,
        "solution": study.solution,
        "results": study.results,
        "metrics": json.loads(study.metrics or "[]"),
        "cover_image": study.cover_image,
        "related_product_slug": study.related_product_slug,
        "gallery_images": json.loads(study.gallery_images or "[]"),
        "is_published": study.is_published,
        "sort_order": study.sort_order,
        "created_at": study.created_at.isoformat() if study.created_at else None,
    }


def list_studies(db: Session, *, published_only: bool = True) -> list[CaseStudy]:
    if published_only:
        cached = get_redis().get(CASE_STUDY_LIST_CACHE)
        if cached:
            return [_study_from_cache(row) for row in json.loads(cached)]

    q = db.query(CaseStudy).order_by(CaseStudy.sort_order, CaseStudy.title)
    if published_only:
        q = q.filter(CaseStudy.is_published.is_(True))
    studies = q.all()

    if published_only:
        get_redis().setex(CASE_STUDY_LIST_CACHE, CACHE_TTL, json.dumps([study_to_dict(s) for s in studies]))

    return studies


def get_by_slug(db: Session, slug: str, *, published_only: bool = True) -> CaseStudy | None:
    cache_key = f"{CASE_STUDY_CACHE_PREFIX}{slug}"
    if published_only:
        cached = get_redis().get(cache_key)
        if cached:
            return _study_from_cache(json.loads(cached))

    q = db.query(CaseStudy).filter(CaseStudy.slug == slug)
    if published_only:
        q = q.filter(CaseStudy.is_published.is_(True))
    study = q.first()

    if study and published_only:
        get_redis().setex(cache_key, CACHE_TTL, json.dumps(study_to_dict(study)))

    return study


def _study_from_cache(row: dict[str, Any]) -> CaseStudy:
    study = CaseStudy(
        id=row["id"],
        slug=row["slug"],
        title=row["title"],
        client=row["client"],
        industry=row["industry"],
        summary=row["summary"],
        challenge=row["challenge"],
        solution=row["solution"],
        results=row["results"],
        metrics=json.dumps(row.get("metrics", [])),
        cover_image=row.get("cover_image"),
        related_product_slug=row.get("related_product_slug"),
        gallery_images=json.dumps(row.get("gallery_images", [])),
        is_published=row.get("is_published", True),
        sort_order=row.get("sort_order", 0),
    )
    if row.get("created_at"):
        study.created_at = datetime.fromisoformat(row["created_at"])
    return study


def commit_study(db: Session, study: CaseStudy, old_slug: str | None = None) -> CaseStudy:
    try:
        db.commit()
        db.refresh(study)
    except IntegrityError as exc:
        db.rollback()
        if "slug" in str(exc.orig).lower() or "unique" in str(exc.orig).lower():
            raise HTTPException(status_code=409, detail="Case study slug already exists") from exc
        raise
    invalidate_case_study_cache(old_slug)
    invalidate_case_study_cache(study.slug)
    return study
