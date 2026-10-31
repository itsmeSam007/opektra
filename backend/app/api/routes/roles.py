from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.core.audit import record_audit
from app.core.database import get_db
from app.core.rbac import ALL_PERMISSION_CODES, ROLE_DEFINITIONS
from app.models import Permission, Role, User
from app.schemas import PermissionOut, RoleOut, RoleUpdate

router = APIRouter(tags=["roles"])


def _role_out(role: Role) -> RoleOut:
    return RoleOut(
        id=role.id,
        name=role.name,
        description=role.description,
        permissions=sorted(p.code for p in role.permissions),
        created_at=role.created_at,
    )


@router.get("/roles", response_model=list[RoleOut])
def list_roles(db: Session = Depends(get_db), _: User = Depends(require_permission("roles:read"))):
    roles = db.query(Role).order_by(Role.name).all()
    return [_role_out(r) for r in roles]


@router.put("/roles/{role_id}", response_model=RoleOut)
def update_role(
    role_id: int,
    data: RoleUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current: User = Depends(require_permission("roles:write")),
):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    if role.name in ROLE_DEFINITIONS and data.permission_codes is not None:
        # Built-in roles: only allow permission subset updates within known codes
        invalid = set(data.permission_codes) - ALL_PERMISSION_CODES
        if invalid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unknown permissions: {invalid}")
        perms = db.query(Permission).filter(Permission.code.in_(data.permission_codes)).all()
        role.permissions = perms
    if data.description is not None:
        role.description = data.description
    record_audit(db, user=current, action="update", resource_type="role", resource_id=role.id, request=request)
    db.commit()
    db.refresh(role)
    return _role_out(role)


@router.get("/permissions", response_model=list[PermissionOut])
def list_permissions(db: Session = Depends(get_db), _: User = Depends(require_permission("roles:read"))):
    perms = db.query(Permission).order_by(Permission.code).all()
    return [PermissionOut.model_validate(p) for p in perms]
