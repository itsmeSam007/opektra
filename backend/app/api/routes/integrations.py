import json

import httpx
from fastapi import APIRouter

from app.core.cache import get_redis
from app.core.config import settings

router = APIRouter(prefix="/integrations", tags=["integrations"])

GITHUB_CACHE = "integrations:github:repos"
GITHUB_STATS_CACHE = "integrations:github:stats"
YOUTUBE_CACHE = "integrations:youtube:videos"
CACHE_TTL = 60


def _get_cached(key: str):
    raw = get_redis().get(key)
    return json.loads(raw) if raw else None


def _set_cached(key: str, data) -> None:
    get_redis().setex(key, CACHE_TTL, json.dumps(data))


@router.get("/github/repos")
async def github_repos():
    cached = _get_cached(GITHUB_CACHE)
    if cached is not None:
        return cached
    headers = {"Accept": "application/vnd.github.v3+json"}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"https://api.github.com/users/{settings.GITHUB_USERNAME}/repos",
            params={"sort": "updated", "per_page": 12},
            headers=headers,
            timeout=15,
        )
        if resp.status_code != 200:
            return _fallback_repos()
        repos = resp.json()
        result = [
            {
                "name": r["name"],
                "description": r.get("description") or "",
                "html_url": r["html_url"],
                "stargazers_count": r["stargazers_count"],
                "language": r.get("language"),
                "topics": r.get("topics", []),
                "updated_at": r["updated_at"],
            }
            for r in repos
            if not r.get("fork", False)
        ]
        _set_cached(GITHUB_CACHE, result)
        return result


@router.get("/github/stats")
async def github_stats():
    cached = _get_cached(GITHUB_STATS_CACHE)
    if cached is not None:
        return cached
    headers = {"Accept": "application/vnd.github.v3+json"}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"https://api.github.com/users/{settings.GITHUB_USERNAME}",
            headers=headers,
            timeout=15,
        )
        if resp.status_code != 200:
            return {"public_repos": 0, "followers": 0, "public_gists": 0}
        u = resp.json()
        result = {
            "public_repos": u.get("public_repos", 0),
            "followers": u.get("followers", 0),
            "public_gists": u.get("public_gists", 0),
            "avatar_url": u.get("avatar_url"),
            "bio": u.get("bio"),
        }
        _set_cached(GITHUB_STATS_CACHE, result)
        return result


@router.get("/youtube/videos")
async def youtube_videos():
    cached = _get_cached(YOUTUBE_CACHE)
    if cached is not None:
        return cached
    if not settings.YOUTUBE_API_KEY or not settings.YOUTUBE_CHANNEL_ID:
        return _fallback_videos()
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "key": settings.YOUTUBE_API_KEY,
                "channelId": settings.YOUTUBE_CHANNEL_ID,
                "part": "snippet",
                "order": "date",
                "maxResults": 12,
                "type": "video",
            },
            timeout=15,
        )
        if resp.status_code != 200:
            return _fallback_videos()
        items = resp.json().get("items", [])
        result = [
            {
                "id": i["id"]["videoId"],
                "title": i["snippet"]["title"],
                "description": i["snippet"]["description"][:200],
                "thumbnail": i["snippet"]["thumbnails"]["medium"]["url"],
                "published_at": i["snippet"]["publishedAt"],
                "url": f"https://www.youtube.com/watch?v={i['id']['videoId']}",
            }
            for i in items
        ]
        _set_cached(YOUTUBE_CACHE, result)
        return result


def _fallback_repos():
    return [
        {
            "name": "ai-customer-ops",
            "description": "Enterprise AI Customer Operations Platform",
            "html_url": "https://github.com/soumenkarmakar/ai-customer-ops",
            "stargazers_count": 42,
            "language": "Python",
            "topics": ["ai", "saas", "enterprise"],
            "updated_at": "2025-06-01T00:00:00Z",
        },
        {
            "name": "portfolio-platform",
            "description": "Founder portfolio and product licensing platform",
            "html_url": "https://github.com/soumenkarmakar/portfolio-platform",
            "stargazers_count": 18,
            "language": "TypeScript",
            "topics": ["nextjs", "fastapi"],
            "updated_at": "2025-06-15T00:00:00Z",
        },
    ]


def _fallback_videos():
    return [
        {
            "id": "demo1",
            "title": "Exploring the Swiss Alps — Travel Creator Series",
            "description": "Cinematic travel content from the heart of Europe.",
            "thumbnail": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=640",
            "published_at": "2025-05-01T00:00:00Z",
            "url": "https://youtube.com",
        },
        {
            "id": "demo2",
            "title": "Tokyo Nights — Urban Exploration",
            "description": "Neon-lit streets and hidden gems in Japan's capital.",
            "thumbnail": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=640",
            "published_at": "2025-04-15T00:00:00Z",
            "url": "https://youtube.com",
        },
    ]
