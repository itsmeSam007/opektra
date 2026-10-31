from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import parse_json_field, require_permission, serialize_json_field
from app.core.database import get_db
from app.models import CaseStudy, User
from app.schemas import CaseStudyCreate, CaseStudyOut, CaseStudyUpdate
from app.services import case_studies as case_study_service

router = APIRouter(prefix="/case-studies", tags=["case-studies"])


def _out(c: CaseStudy) -> CaseStudyOut:
    return CaseStudyOut(
        id=c.id,
        slug=c.slug,
        title=c.title,
        client=c.client,
        industry=c.industry,
        summary=c.summary,
        challenge=c.challenge,
        solution=c.solution,
        results=c.results,
        metrics=parse_json_field(c.metrics, []),
        cover_image=c.cover_image,
        related_product_slug=c.related_product_slug,
        gallery_images=parse_json_field(c.gallery_images, []),
        is_published=c.is_published,
        sort_order=c.sort_order,
        created_at=c.created_at,
    )


@router.get("", response_model=list[CaseStudyOut])
def list_case_studies(published_only: bool = True, db: Session = Depends(get_db)):
    return [_out(c) for c in case_study_service.list_studies(db, published_only=published_only)]


@router.get("/{slug}", response_model=CaseStudyOut)
def get_case_study(slug: str, db: Session = Depends(get_db)):
    study = case_study_service.get_by_slug(db, slug, published_only=True)
    if not study:
        raise HTTPException(status_code=404, detail="Case study not found")
    return _out(study)


@router.post("", response_model=CaseStudyOut, status_code=201)
def create_case_study(
    data: CaseStudyCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("case_studies:write")),
):
    payload = data.model_dump()
    payload["metrics"] = serialize_json_field(payload.pop("metrics"))
    payload["gallery_images"] = serialize_json_field(payload.pop("gallery_images"))
    study = CaseStudy(**payload)
    db.add(study)
    case_study_service.commit_study(db, study)
    return _out(study)


@router.put("/{case_id}", response_model=CaseStudyOut)
def update_case_study(
    case_id: int,
    data: CaseStudyUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("case_studies:write")),
):
    study = db.query(CaseStudy).filter(CaseStudy.id == case_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Case study not found")
    old_slug = study.slug
    updates = data.model_dump(exclude_unset=True)
    if "metrics" in updates:
        updates["metrics"] = serialize_json_field(updates["metrics"])
    if "gallery_images" in updates:
        updates["gallery_images"] = serialize_json_field(updates["gallery_images"])
    for k, v in updates.items():
        setattr(study, k, v)
    case_study_service.commit_study(db, study, old_slug=old_slug)
    return _out(study)


@router.delete("/{case_id}")
def delete_case_study(
    case_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("case_studies:write")),
):
    study = db.query(CaseStudy).filter(CaseStudy.id == case_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Case study not found")
    slug = study.slug
    db.delete(study)
    db.commit()
    case_study_service.invalidate_case_study_cache(slug)
    return {"ok": True}
