import json

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.core.audit import record_audit
from app.core.cache import get_redis
from app.core.cache_ttl import PUBLIC_SETTINGS_TTL
from app.core.database import get_db
from app.models import SiteSettings, User
from app.schemas import PublicSettingsOut, SettingOut, SettingUpsert, SettingsBulkUpsert

router = APIRouter(prefix="/settings", tags=["settings"])

PUBLIC_KEYS = frozenset(
    {
        "site_title",
        "site_description",
        "founder_name",
        "founder_title",
        "founder_bio",
        "contact_email",
        "linkedin_url",
        "twitter_url",
        "github_url",
        "primary_color",
        "module_travel_enabled",
        "module_media_enabled",
    }
)
SECRET_KEYS = frozenset({"github_token", "youtube_api_key", "email_api_key", "smtp_password"})
SEO_KEYS = frozenset(
    {
        "seo_site_url",
        "seo_title_suffix",
        "seo_default_description",
        "seo_og_image",
        "seo_twitter_handle",
        "seo_robots_txt",
        "seo_staging_noindex",
    }
)


def _setting_bool(value: str, default: bool = True) -> bool:
    return value.lower() in ("true", "1", "yes")


def _get_setting(db: Session, key: str) -> str | None:
    row = db.query(SiteSettings).filter(SiteSettings.key == key).first()
    return row.value if row else None


def _mask_value(key: str, value: str) -> str:
    if key in SECRET_KEYS and value:
        return "********"
    return value


def _setting_out(row: SiteSettings) -> SettingOut:
    return SettingOut(
        key=row.key,
        value=_mask_value(row.key, row.value),
        value_type="secret" if row.key in SECRET_KEYS else "string",
        is_secret=row.key in SECRET_KEYS,
        updated_at=row.updated_at,
    )


@router.get("/public", response_model=PublicSettingsOut)
def public_settings(db: Session = Depends(get_db)):
    cache_key = "settings:public"
    cached = get_redis().get(cache_key)
    if cached:
        return PublicSettingsOut(**json.loads(cached))

    payload = PublicSettingsOut(
        module_travel_enabled=_setting_bool(_get_setting(db, "module_travel_enabled") or "true"),
        module_media_enabled=_setting_bool(_get_setting(db, "module_media_enabled") or "true"),
        site_title=_get_setting(db, "site_title"),
        site_description=_get_setting(db, "site_description"),
        founder_name=_get_setting(db, "founder_name"),
        primary_color=_get_setting(db, "primary_color"),
    )
    get_redis().setex(cache_key, PUBLIC_SETTINGS_TTL, json.dumps(payload.model_dump()))
    return payload


@router.get("", response_model=list[SettingOut])
def list_settings(
    group: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("settings:read")),
):
    rows = db.query(SiteSettings).order_by(SiteSettings.key).all()
    if group == "branding":
        keys = {"site_title", "site_description", "founder_name", "founder_title", "founder_bio", "primary_color"}
        rows = [r for r in rows if r.key in keys]
    elif group == "integrations":
        keys = SECRET_KEYS | {"github_url", "linkedin_url", "twitter_url"}
        rows = [r for r in rows if r.key in keys]
    elif group == "seo":
        rows = [r for r in rows if r.key in SEO_KEYS]
    elif group == "general":
        keys = PUBLIC_KEYS - SEO_KEYS - {"primary_color"}
        rows = [r for r in rows if r.key in keys]
    return [_setting_out(r) for r in rows]


@router.get("/{key}", response_model=SettingOut)
def get_setting(key: str, db: Session = Depends(get_db), _: User = Depends(require_permission("settings:read"))):
    row = db.query(SiteSettings).filter(SiteSettings.key == key).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Setting not found")
    return _setting_out(row)


@router.put("/{key}", response_model=SettingOut)
def upsert_setting(
    key: str,
    data: SettingUpsert,
    request: Request,
    db: Session = Depends(get_db),
    current: User = Depends(require_permission("settings:write")),
):
    if len(data.value) > 65536:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Value too large")
    row = db.query(SiteSettings).filter(SiteSettings.key == key).first()
    if not row:
        row = SiteSettings(key=key, value=data.value)
        db.add(row)
    else:
        if data.value == "********" and key in SECRET_KEYS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide new secret value")
        row.value = data.value
    record_audit(db, user=current, action="update", resource_type="setting", resource_id=key, request=request)
    get_redis().delete("settings:public")
    db.commit()
    db.refresh(row)
    return _setting_out(row)


@router.put("", response_model=list[SettingOut])
def bulk_upsert_settings(
    data: SettingsBulkUpsert,
    request: Request,
    db: Session = Depends(get_db),
    current: User = Depends(require_permission("settings:write")),
):
    results: list[SettingOut] = []
    for item in data.settings:
        key = item.get("key")
        value = item.get("value")
        if not key or value is None:
            continue
        row = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if not row:
            row = SiteSettings(key=key, value=value)
            db.add(row)
        elif value != "********" or key not in SECRET_KEYS:
            row.value = value
        results.append(row)
    record_audit(db, user=current, action="bulk_update", resource_type="settings", request=request)
    get_redis().delete("settings:public")
    db.commit()
    for row in results:
        db.refresh(row)
    return [_setting_out(r) for r in results]
