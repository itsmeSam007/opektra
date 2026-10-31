import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.core.audit import record_audit
from app.core.config import settings
from app.core.database import get_db
from app.models import MediaAsset, User
from app.schemas import MediaAssetOut, MediaAssetUpdate
from app.services.images import optimize_upload

router = APIRouter(prefix="/media", tags=["media"])

MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_MIME_PREFIXES = ("image/", "application/pdf")


def _ensure_media_root() -> Path:
    root = Path(settings.MEDIA_ROOT)
    root.mkdir(parents=True, exist_ok=True)
    return root


def _asset_url(filename: str) -> str:
    return f"{settings.API_V1_PREFIX}/media/files/{filename}"


@router.get("", response_model=list[MediaAssetOut])
def list_media(
    folder: str | None = None,
    mime_prefix: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("media:read")),
):
    q = db.query(MediaAsset).order_by(MediaAsset.created_at.desc())
    if folder:
        q = q.filter(MediaAsset.folder == folder)
    if mime_prefix:
        q = q.filter(MediaAsset.mime_type.startswith(mime_prefix))
    return [MediaAssetOut.model_validate(a) for a in q.limit(200).all()]


@router.post("", response_model=MediaAssetOut, status_code=status.HTTP_201_CREATED)
async def upload_media(
    request: Request,
    file: UploadFile = File(...),
    alt_text: str = Form(..., min_length=1),
    caption: str | None = Form(default=None),
    folder: str = Form(default="uploads"),
    db: Session = Depends(get_db),
    current: User = Depends(require_permission("media:write")),
):
    if not alt_text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="alt_text is required")

    content_type = file.content_type or "application/octet-stream"
    if not any(content_type.startswith(p) for p in ALLOWED_MIME_PREFIXES):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File type not allowed")

    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")

    ext = Path(file.filename or "upload").suffix or ".bin"
    data, content_type, ext = optimize_upload(data, content_type, ext)
    stored_name = f"{uuid.uuid4().hex}{ext}"
    dest_dir = _ensure_media_root() / folder
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / stored_name
    dest_path.write_bytes(data)

    asset = MediaAsset(
        filename=stored_name,
        url=_asset_url(f"{folder}/{stored_name}"),
        alt_text=alt_text.strip(),
        caption=caption,
        mime_type=content_type,
        size_bytes=len(data),
        folder=folder,
        uploaded_by_id=current.id,
    )
    db.add(asset)
    db.flush()
    record_audit(
        db,
        user=current,
        action="upload",
        resource_type="media",
        resource_id=asset.id,
        details={"filename": stored_name},
        request=request,
    )
    db.commit()
    db.refresh(asset)
    return MediaAssetOut.model_validate(asset)


@router.put("/{asset_id}", response_model=MediaAssetOut)
def update_media(
    asset_id: int,
    data: MediaAssetUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current: User = Depends(require_permission("media:write")),
):
    asset = db.query(MediaAsset).filter(MediaAsset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    if data.alt_text is not None:
        if not data.alt_text.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="alt_text cannot be empty")
        asset.alt_text = data.alt_text.strip()
    if data.caption is not None:
        asset.caption = data.caption
    if data.folder is not None:
        asset.folder = data.folder
    record_audit(db, user=current, action="update", resource_type="media", resource_id=asset.id, request=request)
    db.commit()
    db.refresh(asset)
    return MediaAssetOut.model_validate(asset)


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    asset_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current: User = Depends(require_permission("media:write")),
):
    asset = db.query(MediaAsset).filter(MediaAsset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    file_path = Path(settings.MEDIA_ROOT) / asset.folder / asset.filename
    if file_path.exists():
        file_path.unlink()
    record_audit(db, user=current, action="delete", resource_type="media", resource_id=asset.id, request=request)
    db.delete(asset)
    db.commit()


@router.get("/files/{folder}/{filename}")
def serve_media_file(folder: str, filename: str):
    path = Path(settings.MEDIA_ROOT) / folder / filename
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    return FileResponse(path)
