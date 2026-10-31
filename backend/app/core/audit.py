import json
from typing import Any

from fastapi import Request
from sqlalchemy.orm import Session

from app.models import AuditLog, User


def record_audit(
    db: Session,
    *,
    user: User | None,
    action: str,
    resource_type: str,
    resource_id: str | int | None = None,
    details: dict[str, Any] | None = None,
    request: Request | None = None,
) -> AuditLog:
    ip = None
    if request and request.client:
        ip = request.client.host
    entry = AuditLog(
        user_id=user.id if user else None,
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id) if resource_id is not None else None,
        details=json.dumps(details) if details else None,
        ip_address=ip,
    )
    db.add(entry)
    db.flush()
    return entry
