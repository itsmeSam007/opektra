from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.cache import ping_redis
from app.core.config import settings as app_settings
from app.core.database import engine, get_db
from app.models import BlogPost, ContactSubmission, Inquiry, Product, User
from app.schemas import DashboardStatsOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard", response_model=DashboardStatsOut)
def dashboard_stats(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    unread_inquiries = db.query(Inquiry).filter(Inquiry.is_read.is_(False)).count()
    unread_contacts = db.query(ContactSubmission).filter(ContactSubmission.is_read.is_(False)).count()
    total_users = db.query(User).filter(User.is_active.is_(True)).count()

    recent: list[dict] = []
    for post in (
        db.query(BlogPost).filter(BlogPost.is_published.is_(True)).order_by(BlogPost.updated_at.desc()).limit(3)
    ):
        recent.append({"type": "blog", "title": post.title, "slug": post.slug})
    for product in (
        db.query(Product).filter(Product.is_published.is_(True)).order_by(Product.updated_at.desc()).limit(2)
    ):
        recent.append({"type": "product", "title": product.name, "slug": product.slug})
    recent = recent[:5]

    db_ok = False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False
    redis_ok = ping_redis()

    return DashboardStatsOut(
        unread_inquiries=unread_inquiries,
        unread_contacts=unread_contacts,
        total_users=total_users,
        recent_publishes=recent,
        integration_status={
            "github": {"configured": bool(app_settings.GITHUB_USERNAME)},
            "youtube": {"configured": bool(app_settings.YOUTUBE_API_KEY)},
        },
        system_health={
            "status": "ready" if db_ok and redis_ok else "degraded",
            "database": "ok" if db_ok else "error",
            "redis": "ok" if redis_ok else "error",
        },
    )
