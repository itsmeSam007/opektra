import json
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.core.database import get_db
from app.models import AuditLog, User
from app.schemas import AuditLogOut

router = APIRouter(prefix="/logs", tags=["logs"])


def _mask_email(email: str | None) -> str | None:
    if not email or "@" not in email:
        return email
    local, domain = email.split("@", 1)
    if len(local) <= 2:
        return f"{local[0]}*@{domain}"
    return f"{local[0]}***{local[-1]}@{domain}"


def _log_out(entry: AuditLog) -> AuditLogOut:
    details = None
    if entry.details:
        try:
            details = json.loads(entry.details)
        except json.JSONDecodeError:
            details = {"raw": entry.details}
    return AuditLogOut(
        id=entry.id,
        user_id=entry.user_id,
        user_email=_mask_email(entry.user.email if entry.user else None),
        action=entry.action,
        resource_type=entry.resource_type,
        resource_id=entry.resource_id,
        details=details,
        ip_address=entry.ip_address,
        created_at=entry.created_at,
    )


@router.get("/audit", response_model=list[AuditLogOut])
def list_audit_logs(
    days: int = Query(default=30, ge=1, le=90),
    action: str | None = None,
    resource_type: str | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("audit:read")),
):
    since = datetime.now(timezone.utc) - timedelta(days=days)
    q = db.query(AuditLog).filter(AuditLog.created_at >= since)
    if action:
        q = q.filter(AuditLog.action == action)
    if resource_type:
        q = q.filter(AuditLog.resource_type == resource_type)
    entries = q.order_by(AuditLog.created_at.desc()).offset(offset).limit(limit).all()
    return [_log_out(e) for e in entries]
