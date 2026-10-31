# Analytics API

| Field | Value |
|-------|-------|
| **Document ID** | API-ANALYTICS-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Base Path** | `/api/v1/analytics` |
| **Status** | Approved (Specification) |
| **Last Updated** | 2026-06-29 |
| **Related** | [Analytics Module](../06_Modules/Analytics.md) · [Analytics Admin](../07_Admin/Analytics.md) |

---

## Purpose

Define the REST API contract for **first-party analytics** — event ingestion from the public site and aggregated metrics queries for the admin dashboard.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Page view event beacon | Third-party analytics proxy |
| Conversion event ingestion | Session replay data |
| Daily rollup aggregation | Real-time WebSocket stream |
| Admin summary and chart endpoints | Custom SQL queries |

## Business Context

FounderOS provides privacy-conscious analytics without mandatory external tooling. This API separates lightweight public ingestion from authenticated reporting queries.

## Goals

1. Accept page view and conversion events asynchronously.
2. Aggregate daily rollups for fast dashboard queries.
3. Exclude admin routes from tracking.
4. Hash visitor identifiers — no raw PII.
5. Enforce `analytics:read` on all report endpoints.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ANA-001 | `POST /events` ingest page_view | P0 |
| FR-ANA-002 | Ingest conversion events | P0 |
| FR-ANA-003 | `GET /summary` stat cards | P0 |
| FR-ANA-004 | `GET /pageviews` time series | P0 |
| FR-ANA-005 | `GET /top-pages` ranked paths | P0 |
| FR-ANA-006 | `GET /conversions` breakdown | P0 |
| FR-ANA-007 | Daily rollup background job | P0 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-ANA-001 | Event ingest p95 | < 50 ms |
| NFR-ANA-002 | Summary query p95 | < 500 ms |
| NFR-ANA-003 | Raw event retention | 90 days |
| NFR-ANA-004 | Rollup retention | 2 years |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-ANA-001 | Public site | to send page view events | traffic is tracked |
| US-ANA-002 | Founder | to query 30-day summary | I see growth trends |
| US-ANA-003 | Admin | to see top pages | I optimize content |
| US-ANA-004 | Privacy officer | no PII in events | we stay compliant |

## UX Requirements

- Public beacon: fire-and-forget; no UI blocking.
- Admin dashboard consumes summary, pageviews, top-pages, conversions.
- Date range passed as query params on all report endpoints.

## Technical Considerations

### API Conventions

See [Authentication API](./Authentication_API.md).

| Convention | Value |
|------------|-------|
| Public ingest | No auth; rate limited |
| Report endpoints | Bearer + `analytics:read` |
| Date format | ISO 8601 (`YYYY-MM-DD`) |
| Timezone | UTC for storage; display in tenant TZ |

### Endpoints

| Method | Path | Auth | Permission | Description |
|--------|------|------|------------|-------------|
| `POST` | `/api/v1/analytics/events` | Public | — | Ingest analytics event |
| `POST` | `/api/v1/analytics/events/batch` | Public | — | Ingest up to 10 events |
| `GET` | `/api/v1/analytics/summary` | Bearer | `analytics:read` | Summary stat cards |
| `GET` | `/api/v1/analytics/pageviews` | Bearer | `analytics:read` | Page views time series |
| `GET` | `/api/v1/analytics/top-pages` | Bearer | `analytics:read` | Top pages by views |
| `GET` | `/api/v1/analytics/conversions` | Bearer | `analytics:read` | Conversion breakdown |
| `GET` | `/api/v1/analytics/export` | Bearer | `analytics:read` | Export summary CSV |

### Request Body — `POST /analytics/events`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event_type` | string | Yes | `page_view`, `conversion` |
| `path` | string | Yes | URL path (no query string) |
| `referrer` | string | No | Document referrer host |
| `conversion_type` | string | Conditional | Required if `event_type=conversion` |
| `content_type` | string | No | `blog`, `product`, etc. |
| `timestamp` | datetime | No | Client time; server defaults to now |

#### Conversion Types

| Value | Trigger |
|-------|---------|
| `contact_submit` | Contact form success |
| `inquiry_submit` | Enterprise inquiry success |
| `newsletter_subscribe` | Newsletter confirmed |

### Query Parameters — Report Endpoints

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `start_date` | date | 30 days ago | Range start (inclusive) |
| `end_date` | date | today | Range end (inclusive) |
| `compare` | boolean | `false` | Include previous period stats |
| `limit` | integer | `20` | Top pages limit |

### Schemas

#### `AnalyticsSummaryOut`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `page_views` | integer | No | Total page views |
| `unique_visitors` | integer | No | Hashed visitor count |
| `conversions` | integer | No | Total conversions |
| `page_views_change_pct` | float | Yes | vs. previous period |
| `unique_visitors_change_pct` | float | Yes | vs. previous period |
| `conversions_change_pct` | float | Yes | vs. previous period |
| `start_date` | date | No | Query range start |
| `end_date` | date | No | Query range end |

#### `PageViewsSeriesOut`

| Field | Type | Description |
|-------|------|-------------|
| `data` | object[] | `{ date, page_views, unique_visitors }` |
| `start_date` | date | Range start |
| `end_date` | date | Range end |

#### `TopPageOut`

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | URL path |
| `page_views` | integer | View count |
| `unique_visitors` | integer | Unique count |

#### `ConversionsOut`

| Field | Type | Description |
|-------|------|-------------|
| `total` | integer | All conversions |
| `by_type` | object[] | `{ conversion_type, count }` |

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| `202` | — | Event accepted (async processing) |
| `400` | `VALIDATION_ERROR` | Invalid event_type or path |
| `401` | `UNAUTHORIZED` | Report without token |
| `403` | `PERMISSION_DENIED` | Missing `analytics:read` |
| `429` | `RATE_LIMITED` | Ingest rate limit exceeded |

## Security Considerations

- Strip query strings from paths — may contain tokens.
- Hash visitor ID server-side; never accept client visitor ID.
- Block ingest for `/admin` paths.
- Rate limit ingest: 120 events/min/IP.
- Report endpoints admin-only.
- No PII in event payload.

## Acceptance Criteria

- [ ] Page view event stored within 5 seconds.
- [ ] Summary returns correct totals for date range.
- [ ] Top pages ordered by views descending.
- [ ] Conversion breakdown matches event counts.
- [ ] Admin paths rejected at ingest.
- [ ] Compare mode returns change percentages.

## Future Enhancements

| Version | Enhancement |
|---------|-------------|
| v1.1 | UTM parameter tracking |
| v1.5 | Content-type dimension on all reports |
| v2.0 | External analytics export |

## Open Questions

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| OQ-ANA-API-01 | 202 vs 204 for event ingest response? | Low | API |
| OQ-ANA-API-02 | Client-side batch vs. single events? | Medium | Frontend |

---

**See also:** [Analytics Module](../06_Modules/Analytics.md) · [Dashboard Admin](../07_Admin/Dashboard.md)
