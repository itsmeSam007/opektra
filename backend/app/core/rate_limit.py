from app.core.cache import get_redis
from app.core.config import settings


def check_form_rate_limit(client_ip: str, prefix: str = "form_rate:") -> bool:
    """Return True if form submission is allowed (10/hour/IP default)."""
    redis = get_redis()
    key = f"{prefix}{client_ip}"
    count = redis.incr(key)
    if count == 1:
        redis.expire(key, settings.FORM_RATE_WINDOW_SECONDS)
    return count <= settings.FORM_RATE_LIMIT
