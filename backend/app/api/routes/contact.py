from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.core.database import get_db
from app.core.rate_limit import check_form_rate_limit
from app.models import ContactSubmission, Inquiry, Testimonial, User
from app.schemas import (
    ContactForm,
    ContactPatch,
    InquiryForm,
    InquiryPatch,
    TestimonialCreate,
    TestimonialOut,
    TestimonialUpdate,
)
from app.services.email import notify_new_contact, notify_new_inquiry

router = APIRouter(prefix="/testimonials", tags=["testimonials"])


def _client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def _honeypot_ok(website: str | None) -> bool:
    return not website


@router.get("", response_model=list[TestimonialOut])
def list_testimonials(published_only: bool = True, db: Session = Depends(get_db)):
    q = db.query(Testimonial).order_by(Testimonial.sort_order)
    if published_only:
        q = q.filter(Testimonial.is_published.is_(True))
    return [TestimonialOut.model_validate(t) for t in q.all()]


@router.post("", response_model=TestimonialOut)
def create_testimonial(
    data: TestimonialCreate, db: Session = Depends(get_db), _: User = Depends(require_permission("testimonials:write"))
):
    t = Testimonial(**data.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return TestimonialOut.model_validate(t)


@router.put("/{tid}", response_model=TestimonialOut)
def update_testimonial(
    tid: int, data: TestimonialUpdate, db: Session = Depends(get_db), _: User = Depends(require_permission("testimonials:write"))
):
    t = db.query(Testimonial).filter(Testimonial.id == tid).first()
    if not t:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(t, k, v)
    db.commit()
    db.refresh(t)
    return TestimonialOut.model_validate(t)


@router.delete("/{tid}")
def delete_testimonial(tid: int, db: Session = Depends(get_db), _: User = Depends(require_permission("testimonials:write"))):
    t = db.query(Testimonial).filter(Testimonial.id == tid).first()
    if not t:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(t)
    db.commit()
    return {"ok": True}


contact_router = APIRouter(prefix="/contact", tags=["contact"])


@contact_router.post("")
def submit_contact(data: ContactForm, request: Request, db: Session = Depends(get_db)):
    if not _honeypot_ok(data.website):
        return {"ok": True, "message": "Thank you. We will be in touch shortly."}

    if not check_form_rate_limit(_client_ip(request), prefix="contact_rate:"):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many submissions. Try again later.")

    payload = data.model_dump(exclude={"website"})
    sub = ContactSubmission(**payload)
    db.add(sub)
    db.commit()
    notify_new_contact(data.name, str(data.email), data.inquiry_type, data.message)
    return {"ok": True, "message": "Thank you. We will be in touch shortly."}


inquiry_router = APIRouter(prefix="/inquiries", tags=["inquiries"])

ACQUISITION_TYPES = frozenset({"acquisition", "m_and_a"})


@inquiry_router.post("")
def submit_inquiry(data: InquiryForm, request: Request, db: Session = Depends(get_db)):
    if not _honeypot_ok(data.website):
        return {"ok": True, "message": "Inquiry received. Our team will respond within 24 hours."}

    if not check_form_rate_limit(_client_ip(request), prefix="inquiry_rate:"):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many submissions. Try again later.")

    is_acquisition = data.inquiry_type in ACQUISITION_TYPES
    if is_acquisition and not data.nda_acknowledged:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NDA acknowledgment required for acquisition inquiries")

    inq = Inquiry(
        inquiry_type=data.inquiry_type,
        name=data.name,
        email=str(data.email),
        company=data.company,
        role=data.role,
        message=data.message,
        budget_range=data.budget_range,
        nda_acknowledged=data.nda_acknowledged,
        is_acquisition=is_acquisition,
    )
    db.add(inq)
    db.commit()
    notify_new_inquiry(
        inquiry_type=data.inquiry_type,
        name=data.name,
        email=str(data.email),
        company=data.company,
        message=data.message,
        is_acquisition=is_acquisition,
    )
    return {"ok": True, "message": "Inquiry received. Our team will respond within 24 hours."}


def _inquiry_dict(i: Inquiry) -> dict:
    return {
        "id": i.id,
        "inquiry_type": i.inquiry_type,
        "name": i.name,
        "email": i.email,
        "company": i.company,
        "role": i.role,
        "message": i.message,
        "budget_range": i.budget_range,
        "nda_acknowledged": i.nda_acknowledged,
        "is_acquisition": i.is_acquisition,
        "is_read": i.is_read,
        "created_at": i.created_at,
    }


@inquiry_router.get("")
def list_inquiries(
    is_read: bool | None = None,
    inquiry_type: str | None = None,
    acquisition_only: bool = Query(default=False),
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("inquiries:read")),
):
    q = db.query(Inquiry).order_by(Inquiry.created_at.desc())
    if is_read is not None:
        q = q.filter(Inquiry.is_read.is_(is_read))
    if inquiry_type:
        q = q.filter(Inquiry.inquiry_type == inquiry_type)
    if acquisition_only:
        q = q.filter(Inquiry.is_acquisition.is_(True))
    return [_inquiry_dict(i) for i in q.all()]


@inquiry_router.patch("/{inquiry_id}")
def patch_inquiry(
    inquiry_id: int,
    data: InquiryPatch,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("inquiries:write")),
):
    inq = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Not found")
    if data.is_read is not None:
        inq.is_read = data.is_read
    db.commit()
    return _inquiry_dict(inq)


@inquiry_router.delete("/{inquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("inquiries:write")),
):
    inq = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(inq)
    db.commit()


@contact_router.get("/submissions")
def list_contacts(
    is_read: bool | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("contact:read")),
):
    q = db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc())
    if is_read is not None:
        q = q.filter(ContactSubmission.is_read.is_(is_read))
    return [
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "company": s.company,
            "inquiry_type": s.inquiry_type,
            "message": s.message,
            "is_read": s.is_read,
            "created_at": s.created_at,
        }
        for s in q.all()
    ]


@contact_router.patch("/submissions/{submission_id}")
def patch_contact(
    submission_id: int,
    data: ContactPatch,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("contact:write")),
):
    sub = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Not found")
    if data.is_read is not None:
        sub.is_read = data.is_read
    db.commit()
    return {
        "id": sub.id,
        "name": sub.name,
        "email": sub.email,
        "company": sub.company,
        "inquiry_type": sub.inquiry_type,
        "message": sub.message,
        "is_read": sub.is_read,
        "created_at": sub.created_at,
    }


@contact_router.delete("/submissions/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    submission_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("contact:write")),
):
    sub = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(sub)
    db.commit()
