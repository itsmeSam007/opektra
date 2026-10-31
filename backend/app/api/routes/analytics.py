from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.core.database import get_db
from app.models import AnalyticsEvent, User
from app.schemas import AnalyticsEventIn, AnalyticsSummaryOut, PageviewPoint, TopPageOut

router = APIRouter(prefix="/analytics", tags=["analytics"])

ALLOWED_EVENT_TYPES = {"page_view", "conversion"}


@router.post("/events", status_code=status.HTTP_202_ACCEPTED)
def ingest_event(data: AnalyticsEventIn, db: Session = Depends(get_db)):
    if data.event_type not in ALLOWED_EVENT_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid event type")
    if data.path.startswith("/admin"):
        return {"accepted": False, "reason": "admin routes excluded"}
    event = AnalyticsEvent(
        event_type=data.event_type,
        path=data.path,
        visitor_hash=data.visitor_hash,
    )
    db.add(event)
    db.commit()
    return {"accepted": True}


def _period_start(days: int) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=days)


@router.get("/summary", response_model=AnalyticsSummaryOut)
def analytics_summary(
    days: int = Query(default=7, ge=1, le=90),
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("analytics:read")),
):
    since = _period_start(days)
    q = db.query(AnalyticsEvent).filter(
        AnalyticsEvent.created_at >= since,
        AnalyticsEvent.event_type == "page_view",
    )
    total = q.count()
    unique = (
        db.query(func.count(func.distinct(AnalyticsEvent.visitor_hash)))
        .filter(
            AnalyticsEvent.created_at >= since,
            AnalyticsEvent.event_type == "page_view",
            AnalyticsEvent.visitor_hash.isnot(None),
        )
        .scalar()
        or 0
    )
    return AnalyticsSummaryOut(total_pageviews=total, unique_visitors=unique, period_days=days)


@router.get("/pageviews", response_model=list[PageviewPoint])
def pageviews_series(
    days: int = Query(default=7, ge=1, le=90),
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("analytics:read")),
):
    since = _period_start(days)
    rows = (
        db.query(
            func.date_trunc("day", AnalyticsEvent.created_at).label("day"),
            func.count(AnalyticsEvent.id).label("cnt"),
        )
        .filter(AnalyticsEvent.created_at >= since, AnalyticsEvent.event_type == "page_view")
        .group_by("day")
        .order_by("day")
        .all()
    )
    return [PageviewPoint(date=row.day.date().isoformat(), count=row.cnt) for row in rows]


@router.get("/top-pages", response_model=list[TopPageOut])
def top_pages(
    days: int = Query(default=7, ge=1, le=90),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("analytics:read")),
):
    since = _period_start(days)
    rows = (
        db.query(AnalyticsEvent.path, func.count(AnalyticsEvent.id).label("views"))
        .filter(AnalyticsEvent.created_at >= since, AnalyticsEvent.event_type == "page_view")
        .group_by(AnalyticsEvent.path)
        .order_by(func.count(AnalyticsEvent.id).desc())
        .limit(limit)
        .all()
    )
    return [TopPageOut(path=row.path, views=row.views) for row in rows]
