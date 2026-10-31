from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_permission
from app.core.audit import record_audit
from app.core.database import get_db
from app.core.security import get_password_hash
from app.models import Permission, Role, User
from app.schemas import RoleOut, RoleUpdate, UserAdminOut, UserCreate, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


def _user_out(user: User) -> UserAdminOut:
    return UserAdminOut(
        id=user.id,
        email=user.email,
        is_active=user.is_active,
        role=user.role.name if user.role else None,
        role_id=user.role_id,
        last_login_at=user.last_login_at,
        created_at=user.created_at,
    )


@router.get("", response_model=list[UserAdminOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_permission("users:read"))):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [_user_out(u) for u in users]


@router.post("", response_model=UserAdminOut, status_code=status.HTTP_201_CREATED)
def create_user(
    data: UserCreate,
    request: Request,
    db: Session = Depends(get_db),
    current: User = Depends(require_permission("users:write")),
):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role_id=data.role_id,
        is_active=True,
    )
    db.add(user)
    db.flush()
    record_audit(db, user=current, action="create", resource_type="user", resource_id=user.id, request=request)
    db.commit()
    db.refresh(user)
    return _user_out(user)


@router.get("/{user_id}", response_model=UserAdminOut)
def get_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(require_permission("users:read"))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _user_out(user)


@router.put("/{user_id}", response_model=UserAdminOut)
def update_user(
    user_id: int,
    data: UserUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current: User = Depends(require_permission("users:write")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if data.email is not None:
        existing = db.query(User).filter(User.email == data.email, User.id != user_id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        user.email = data.email
    if data.password is not None:
        user.hashed_password = get_password_hash(data.password)
    if data.role_id is not None:
        user.role_id = data.role_id
    if data.is_active is not None:
        user.is_active = data.is_active
    record_audit(db, user=current, action="update", resource_type="user", resource_id=user.id, request=request)
    db.commit()
    db.refresh(user)
    return _user_out(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_user(
    user_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current: User = Depends(require_permission("users:write")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.id == current.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate yourself")
    user.is_active = False
    record_audit(db, user=current, action="deactivate", resource_type="user", resource_id=user.id, request=request)
    db.commit()
