from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import (
    REFRESH_COOKIE_NAME,
    check_login_rate_limit,
    create_access_token,
    create_refresh_token,
    get_user_id_from_refresh_token,
    refresh_cookie_params,
    revoke_refresh_token,
    verify_password,
)
from app.models import User
from app.schemas import LoginRequest, Token, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_refresh_cookie(response: Response, token: str) -> None:
    params = refresh_cookie_params()
    max_age = 60 * 60 * 24 * 7  # 7 days default
    response.set_cookie(value=token, max_age=max_age, **params)


def _clear_refresh_cookie(response: Response) -> None:
    params = refresh_cookie_params()
    response.delete_cookie(key=params["key"], path=params["path"])


@router.post("/login", response_model=Token)
def login(data: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    if not check_login_rate_limit(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts",
            headers={"Retry-After": "60"},
        )

    user = db.query(User).filter(User.email == data.email).first()
    if not user or not user.is_active or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user.last_login_at = datetime.now(timezone.utc)
    db.commit()

    access_token = create_access_token(user.email)
    refresh_token, _ = create_refresh_token(user.id)
    _set_refresh_cookie(response, refresh_token)
    return Token(access_token=access_token)


@router.post("/refresh", response_model=Token)
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user_id = get_user_id_from_refresh_token(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
    if not user:
        revoke_refresh_token(token)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    revoke_refresh_token(token)
    access_token = create_access_token(user.email)
    new_refresh, _ = create_refresh_token(user.id)
    _set_refresh_cookie(response, new_refresh)
    return Token(access_token=access_token)


@router.post("/logout")
def logout(request: Request, response: Response):
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if token:
        revoke_refresh_token(token)
    _clear_refresh_cookie(response)
    return {"ok": True}


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    role_name = current_user.role.name if current_user.role else None
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        is_active=current_user.is_active,
        roles=[role_name] if role_name else [],
        permissions=sorted(current_user.permission_codes()),
        created_at=current_user.created_at,
    )
