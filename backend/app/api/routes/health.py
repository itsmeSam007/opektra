from fastapi import APIRouter
from sqlalchemy import text

from app.core.cache import ping_redis
from app.core.database import engine

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {"status": "healthy", "service": "founderos-api"}


@router.get("/ready")
def ready():
    db_ok = False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    redis_ok = ping_redis()
    status = "ready" if db_ok and redis_ok else "degraded"
    return {
        "status": status,
        "checks": {
            "database": "ok" if db_ok else "error",
            "redis": "ok" if redis_ok else "error",
        },
    }
