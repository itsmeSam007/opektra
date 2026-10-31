import json
from collections.abc import Callable
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models import User

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    email = decode_access_token(credentials.credentials)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(User).filter(User.email == email, User.is_active.is_(True)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_permission(permission: str) -> Callable:
    def checker(user: User = Depends(get_current_user)) -> User:
        if not user.has_permission(permission):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return checker


def parse_json_field(value: str, default: Any = None) -> Any:
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return default if default is not None else value


def serialize_json_field(value: Any) -> str:
    return json.dumps(value)
