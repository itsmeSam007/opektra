# YouTube API

| Field | Value |
|-------|-------|
| **Document ID** | API-YOUTUBE-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Base Path** | `/api/v1/integrations/youtube` |
| **Status** | Approved (Specification) |
| **Last Updated** | 2026-06-29 |
| **Related** | [YouTube Module](../06_Modules/YouTube.md) · [Settings API](./Settings_API.md) · [GitHub API](./GitHub_API.md) |

---

## Purpose

Define the REST API contract for **YouTube Data API v3 integration** — channel video listing, embed metadata, and cache management for public media pages and CMS blocks.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Latest videos from configured channel | Video upload |
| Video metadata (title, thumbnail, dates) | YouTube Analytics API |
| Redis-cached responses | Comment sync |
| Admin cache invalidation | Playlist management API |

## Business Context

Video content is central for creator-founder personas. This API provides server-side YouTube fetching with caching so API keys never reach the browser.

## Goals

1. Return latest N videos from configured channel ID.
2. Include embed-ready video IDs and thumbnail URLs.
3. Cache responses to minimize YouTube quota usage.
4. Return empty results gracefully when unconfigured.
5. Support admin-triggered cache refresh.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-YT-001 | List latest channel videos | P0 |
| FR-YT-002 | Include title, description, thumbnail, published_at | P0 |
| FR-YT-003 | Redis cache with 30 min TTL | P0 |
| FR-YT-004 | Admin cache invalidation | P1 |
| FR-YT-005 | Configurable video limit (default 6) | P0 |
| FR-YT-006 | Return 200 empty array if unconfigured | P0 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-YT-001 | Cached p95 | < 50 ms |
| NFR-YT-002 | Uncached p95 | < 3 s |
| NFR-YT-003 | Cache TTL | 1800 s |
| NFR-YT-004 | Max video limit | 50 |
| NFR-YT-005 | YouTube quota per refresh | < 5 units |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-YT-001 | Visitor | to see latest YouTube videos | I watch founder content |
| US-YT-002 | Frontend | embed URLs from API | players render correctly |
| US-YT-003 | Admin | to refresh video cache | new uploads appear |
| US-YT-004 | DevOps | minimal API quota usage | costs stay low |

## UX Requirements

- Video grid on `/media` and Media page.
- Thumbnail lazy-load; click opens embed modal or inline player.
- Empty state when channel not configured.
- Admin shows `cached_at` in integration status.

## Technical Considerations

### API Conventions

See [Authentication API](./Authentication_API.md).

| Convention | Value |
|------------|-------|
| Upstream | YouTube Data API v3 |
| Embed base URL | `https://www.youtube-nocookie.com/embed/{video_id}` |
| Cache key | `youtube:videos:{channel_id}:{limit}` |

### Endpoints

| Method | Path | Auth | Permission | Description |
|--------|------|------|------------|-------------|
| `GET` | `/api/v1/integrations/youtube/videos` | Public | — | List latest channel videos |
| `GET` | `/api/v1/integrations/youtube/videos/{video_id}` | Public | — | Get single video metadata |
| `POST` | `/api/v1/integrations/youtube/cache/invalidate` | Bearer | `integrations:manage` | Clear video cache |

### Query Parameters — `GET /integrations/youtube/videos`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | integer | `6` | Number of videos (1–50) |
| `force_refresh` | boolean | `false` | Bypass cache (admin contexts only) |

### Schemas

#### `YouTubeVideoOut`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | string | No | YouTube video ID |
| `title` | string | No | Video title |
| `description` | string | Yes | Truncated description (500 chars) |
| `thumbnail_url` | string | No | High-res thumbnail URL |
| `published_at` | datetime | No | Publish timestamp |
| `duration` | string | Yes | ISO 8601 duration (PT4M13S) |
| `view_count` | integer | Yes | View count if available |
| `embed_url` | string | No | nocookie embed URL |

#### `YouTubeVideosListOut`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `items` | YouTubeVideoOut[] | No | Video list |
| `channel_id` | string | Yes | Source channel |
| `cached_at` | datetime | No | Cache timestamp |
| `total` | integer | No | Items returned |

#### `POST /cache/invalidate` Response

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | Success flag |
| `invalidated_keys` | string[] | Cleared keys |

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| `200` | — | Empty `items` if channel/API key unset |
| `401` | `UNAUTHORIZED` | Invalidate without token |
| `403` | `PERMISSION_DENIED` | Missing `integrations:manage` |
| `404` | `NOT_FOUND` | Video ID not found on channel |
| `502` | `UPSTREAM_ERROR` | YouTube API failure, no stale cache |
| `429` | `RATE_LIMITED` | Quota exceeded |

## Security Considerations

- YouTube API key server-side only; env override `YOUTUBE_API_KEY`.
- Never return API key in any response.
- CSP allows `youtube-nocookie.com` for embeds.
- Public endpoint rate limited: 60 req/min/IP.
- `force_refresh` ignored for unauthenticated public requests.

## Acceptance Criteria

- [ ] Videos endpoint returns metadata for configured channel.
- [ ] `embed_url` uses youtube-nocookie domain.
- [ ] Cache hit on second request within TTL.
- [ ] Unconfigured channel returns `200` with empty `items`.
- [ ] Invalidate forces fresh YouTube fetch.
- [ ] Single video endpoint returns 404 for invalid ID.

## Future Enhancements

| Version | Enhancement |
|---------|-------------|
| v1.1 | Persist videos in DB for offline |
| v1.2 | Playlist-specific feed |
| v2.0 | YouTube Analytics metrics |

## Open Questions

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| OQ-YT-API-01 | Truncate description length in API? | Low | API |
| OQ-YT-API-02 | Include Shorts filter toggle? | Medium | Product |

---

**See also:** [YouTube Module](../06_Modules/YouTube.md) · [Travel API](./Travel_API.md)
