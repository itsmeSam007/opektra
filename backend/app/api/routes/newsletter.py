import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.core.database import get_db
from app.core.rate_limit import check_form_rate_limit
from app.models import NewsletterSubscriber, User
from app.schemas import NewsletterSubscribeIn, NewsletterSubscriberOut
from app.services.email import send_newsletter_confirmation

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


def _client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


@router.post("/subscribe", status_code=status.HTTP_202_ACCEPTED)
def subscribe(data: NewsletterSubscribeIn, request: Request, db: Session = Depends(get_db)):
    if data.website:
        return {"ok": True, "message": "Check your email to confirm your subscription."}

    if not check_form_rate_limit(_client_ip(request), prefix="newsletter_rate:"):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")

    if not data.consent:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Consent is required")

    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == data.email).first()
    if existing and existing.status == "confirmed":
        return {"ok": True, "message": "You are already subscribed."}

    token = secrets.token_urlsafe(32)
    unsub = secrets.token_urlsafe(32)
    if existing:
        existing.status = "pending"
        existing.confirm_token = token
        existing.consent_at = datetime.now(timezone.utc)
        sub = existing
    else:
        sub = NewsletterSubscriber(
            email=data.email,
            status="pending",
            confirm_token=token,
            unsubscribe_token=unsub,
        )
        db.add(sub)

    db.commit()

    from app.core.config import settings

    confirm_url = f"{settings.SITE_URL}/newsletter/confirm?token={token}"
    send_newsletter_confirmation(data.email, confirm_url)
    return {"ok": True, "message": "Check your email to confirm your subscription."}


@router.get("/confirm")
def confirm(token: str, db: Session = Depends(get_db)):
    sub = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.confirm_token == token).first()
    if not sub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid or expired token")
    sub.status = "confirmed"
    sub.confirmed_at = datetime.now(timezone.utc)
    sub.confirm_token = None
    db.commit()
    return {"ok": True, "message": "Subscription confirmed. Thank you!"}


@router.get("/unsubscribe")
def unsubscribe(token: str, db: Session = Depends(get_db)):
    sub = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.unsubscribe_token == token).first()
    if not sub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid token")
    sub.status = "unsubscribed"
    db.commit()
    return {"ok": True, "message": "You have been unsubscribed."}


@router.get("/subscribers", response_model=list[NewsletterSubscriberOut])
def list_subscribers(
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("settings:read")),
):
    q = db.query(NewsletterSubscriber).order_by(NewsletterSubscriber.created_at.desc())
    if status_filter:
        q = q.filter(NewsletterSubscriber.status == status_filter)
    return [NewsletterSubscriberOut.model_validate(s) for s in q.limit(500).all()]
