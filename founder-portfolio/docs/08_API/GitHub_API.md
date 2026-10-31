# GitHub API

| Field | Value |
|-------|-------|
| **Document ID** | API-GITHUB-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Base Path** | `/api/v1/integrations/github` |
| **Status** | Approved (Specification) |
| **Last Updated** | 2026-06-29 |
| **Related** | [GitHub Module](../06_Modules/GitHub.md) · [Settings API](./Settings_API.md) · [YouTube API](./YouTube_API.md) |

---

## Purpose

Define the REST API contract for **GitHub integration** — public repository listing, aggregate statistics, and cache management for the Open Source page and CMS blocks.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Public repo listing (cached) | Private repository access |
| Aggregate stats endpoint | GitHub OAuth App flows |
| Cache invalidation (admin) | Webhook receivers |
| Optional PAT for rate limits | Issue/PR APIs |

## Business Context

FounderOS surfaces open-source credibility via automated GitHub sync. This API proxies GitHub REST data with Redis caching to respect rate limits and improve response times.

## Goals

1. Return public repository metadata sorted by relevance.
2. Aggregate stars, forks, and language breakdown.
3. Cache responses with configurable TTL.
4. Degrade gracefully when GitHub is unavailable.
5. Allow admin cache invalidation after profile changes.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-GH-001 | List public repos for configured username | P0 |
| FR-GH-002 | Return aggregate stats | P0 |
| FR-GH-003 | Serve from Redis cache within TTL | P0 |
| FR-GH-004 | Admin invalidate cache endpoint | P1 |
| FR-GH-005 | Return empty array when username unset | P0 |
| FR-GH-006 | Optional PAT for 5000/hr rate limit | P1 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-GH-001 | Cached response p95 | < 50 ms |
| NFR-GH-002 | Uncached fetch p95 | < 2 s |
| NFR-GH-003 | Cache TTL | 1800 s (30 min) |
| NFR-GH-004 | Max repos returned | 30 |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-GH-001 | Visitor | to browse founder's public repos | I evaluate open-source work |
| US-GH-002 | Visitor | to see total stars | I gauge project popularity |
| US-GH-003 | Admin | to refresh cache manually | new repos appear immediately |
| US-GH-004 | Frontend | fast cached responses | the page loads quickly |

## UX Requirements

- Public page consumes repos and stats endpoints only.
- Loading skeleton while fetching; stale cache preferred over error.
- Repo cards link externally to GitHub.
- Admin refresh shows last sync timestamp.

## Technical Considerations

### API Conventions

See [Authentication API](./Authentication_API.md).

| Convention | Value |
|------------|-------|
| Default sort | `stargazers_count:desc` |
| Cache key prefix | `github:repos:{username}` |
| Upstream API | GitHub REST v3 |

### Endpoints

| Method | Path | Auth | Permission | Description |
|--------|------|------|------------|-------------|
| `GET` | `/api/v1/integrations/github/repos` | Public | — | List public repositories |
| `GET` | `/api/v1/integrations/github/stats` | Public | — | Aggregate GitHub statistics |
| `POST` | `/api/v1/integrations/github/cache/invalidate` | Bearer | `integrations:manage` | Clear Redis cache |

### Query Parameters — `GET /integrations/github/repos`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `sort` | string | `stars` | Sort: `stars`, `updated`, `name` |
| `limit` | integer | `30` | Max repos (1–30) |
| `exclude_forks` | boolean | `true` | Exclude forked repos |

### Schemas

#### `GitHubRepoOut`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | integer | No | GitHub repo ID |
| `name` | string | No | Repository name |
| `full_name` | string | No | `owner/repo` |
| `description` | string | Yes | Repo description |
| `html_url` | string | No | GitHub URL |
| `language` | string | Yes | Primary language |
| `stargazers_count` | integer | No | Star count |
| `forks_count` | integer | No | Fork count |
| `updated_at` | datetime | No | Last update ISO 8601 |
| `topics` | string[] | No | GitHub topics |

#### `GitHubStatsOut`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `public_repo_count` | integer | No | Total public repos |
| `total_stars` | integer | No | Sum of stargazers |
| `total_forks` | integer | No | Sum of forks |
| `top_languages` | object[] | No | `{ language, count }` |
| `cached_at` | datetime | No | Cache timestamp |
| `username` | string | No | Configured GitHub username |

#### `POST /cache/invalidate` Response

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | Always `true` on success |
| `invalidated_keys` | string[] | Cleared cache keys |

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| `200` | — | Empty array if username not configured |
| `401` | `UNAUTHORIZED` | Missing/invalid token (invalidate only) |
| `403` | `PERMISSION_DENIED` | Missing `integrations:manage` |
| `502` | `UPSTREAM_ERROR` | GitHub unreachable, no stale cache |
| `429` | `RATE_LIMITED` | GitHub rate limit exceeded, no cache |

## Security Considerations

- PAT stored encrypted in `site_settings`; never exposed in responses.
- Only public GitHub endpoints called in v1.0.
- Sanitize `description` before HTML rendering.
- Rate limit public endpoints: 60 req/min/IP.
- Invalidate endpoint requires Bearer token.

## Acceptance Criteria

- [ ] Repos endpoint returns up to 30 public repos sorted by stars.
- [ ] Stats endpoint aggregates counts correctly.
- [ ] Second request within TTL served from cache.
- [ ] Unconfigured username returns `200` with empty arrays.
- [ ] Invalidate clears cache; next request fetches fresh data.
- [ ] 502 only when upstream fails and no stale cache exists.

## Future Enhancements

| Version | Enhancement |
|---------|-------------|
| v1.1 | Featured repo pinning |
| v1.2 | Contribution graph embed data |
| v2.0 | GitHub App OAuth for private stats |

## Open Questions

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| OQ-GH-API-01 | Include archived repos? | Low | Product |
| OQ-GH-API-02 | Store repo snapshot in DB for offline? | Medium | Backend |

---

**See also:** [GitHub Module](../06_Modules/GitHub.md) · [Settings API](./Settings_API.md)
