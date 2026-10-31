import secrets
import uuid
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.cache import get_redis
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)
ALGORITHM = "HS256"
REFRESH_COOKIE_NAME = "founderos_refresh"
REFRESH_REDIS_PREFIX = "refresh:"
LOGIN_RATE_PREFIX = "login_rate:"


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire, "iat": now, "type": "access"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload.get("sub")
    except JWTError:
        return None


def create_refresh_token(user_id: int) -> tuple[str, str]:
    """Return (opaque token for cookie, jti for redis key suffix)."""
    jti = str(uuid.uuid4())
    token = secrets.token_urlsafe(32)
    redis_key = f"{REFRESH_REDIS_PREFIX}{jti}"
    ttl = settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400
    get_redis().setex(redis_key, ttl, str(user_id))
    # Store mapping token->jti for lookup on refresh
    get_redis().setex(f"{REFRESH_REDIS_PREFIX}token:{token}", ttl, jti)
    return token, jti


def get_user_id_from_refresh_token(token: str) -> int | None:
    jti = get_redis().get(f"{REFRESH_REDIS_PREFIX}token:{token}")
    if not jti:
        return None
    user_id = get_redis().get(f"{REFRESH_REDIS_PREFIX}{jti}")
    if not user_id:
        return None
    return int(user_id)


def revoke_refresh_token(token: str) -> None:
    jti = get_redis().get(f"{REFRESH_REDIS_PREFIX}token:{token}")
    if jti:
        get_redis().delete(f"{REFRESH_REDIS_PREFIX}{jti}")
        get_redis().delete(f"{REFRESH_REDIS_PREFIX}token:{token}")


def check_login_rate_limit(client_ip: str) -> bool:
    """Return True if request is allowed."""
    redis = get_redis()
    key = f"{LOGIN_RATE_PREFIX}{client_ip}"
    count = redis.incr(key)
    if count == 1:
        redis.expire(key, settings.LOGIN_RATE_WINDOW_SECONDS)
    return count <= settings.LOGIN_RATE_LIMIT


def refresh_cookie_params() -> dict:
    secure = settings.APP_ENV == "production"
    return {
        "key": REFRESH_COOKIE_NAME,
        "httponly": True,
        "secure": secure,
        "samesite": "none" if secure else "lax",
        "path": "/",
    }
