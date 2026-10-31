# Settings API

| Field | Value |
|-------|-------|
| **Document ID** | API-SETTINGS-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Base Path** | `/api/v1/settings` |
| **Status** | Approved (Specification) |
| **Last Updated** | 2026-06-29 |
| **Related** | [Settings Module](../06_Modules/Settings.md) · [Settings Admin](../07_Admin/Settings.md) · [Entities](../09_Database/Entities.md#site_settings) |

---

## Purpose

Define the REST API contract for **site-wide configuration** — public branding settings, authenticated admin CRUD, and secret management for integrations.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Public safe settings subset | Infrastructure env vars (DATABASE_URL) |
| Admin get/set by key or bulk | Settings version history |
| Secret encryption and masking | Multi-tenant namespaces (v2.0) |
| Cache invalidation on update | DNS / domain management |

## Business Context

Settings API is the configuration backbone for white-label FounderOS deployments. It separates public branding data from protected integration credentials.

## Goals

1. Expose non-secret settings for frontend branding.
2. Encrypt secrets at rest in PostgreSQL.
3. Support env var overrides for deployment secrets.
4. Validate setting types on write.
5. Invalidate Redis cache on mutation.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SET-001 | `GET /settings/public` no auth | P0 |
| FR-SET-002 | `GET /settings` admin list all | P0 |
| FR-SET-003 | `GET /settings/{key}` admin get one | P0 |
| FR-SET-004 | `PUT /settings/{key}` admin upsert | P0 |
| FR-SET-005 | `PUT /settings` bulk update | P1 |
| FR-SET-006 | Mask secret values in responses | P0 |
| FR-SET-007 | Type validation on write | P0 |
| FR-SET-008 | Cache public settings 5 min | P1 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SET-001 | Public GET p95 (cached) | < 30 ms |
| NFR-SET-002 | Admin PUT p95 | < 200 ms |
| NFR-SET-003 | Max value size | 64 KB |
| NFR-SET-004 | Max keys | 200 |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-SET-001 | Frontend | to fetch public branding | header/footer render |
| US-SET-002 | Admin | to update site name | branding changes live |
| US-SET-003 | Admin | to set YouTube API key securely | integrations work |
| US-SET-004 | Editor | to be denied settings write | I cannot change secrets |

## UX Requirements

- Settings Admin consumes list and bulk PUT endpoints.
- Public site fetches `/settings/public` at build or runtime.
- Secret fields show `********` after save in admin UI.

## Technical Considerations

### API Conventions

See [Authentication API](./Authentication_API.md).

| Convention | Value |
|------------|-------|
| Public keys | `site_name`, `logo_url`, `favicon_url`, `primary_color`, `site_tagline` |
| Secret keys | `github_token`, `youtube_api_key`, `email_api_key` |
| Env override | `SETTINGS_{KEY}` or documented per-key (e.g., `YOUTUBE_API_KEY`) |

### Endpoints

| Method | Path | Auth | Permission | Description |
|--------|------|------|------------|-------------|
| `GET` | `/api/v1/settings/public` | Public | — | Public-safe settings only |
| `GET` | `/api/v1/settings` | Bearer | `settings:read` | List all settings (secrets masked) |
| `GET` | `/api/v1/settings/{key}` | Bearer | `settings:read` | Get single setting |
| `PUT` | `/api/v1/settings/{key}` | Bearer | `settings:write` | Upsert single setting |
| `PUT` | `/api/v1/settings` | Bearer | `settings:write` | Bulk upsert settings |
| `DELETE` | `/api/v1/settings/{key}` | Bearer | `settings:write` | Delete optional setting |
| `GET` | `/api/v1/settings/schema` | Bearer | `settings:read` | Setting definitions registry |
| `POST` | `/api/v1/settings/cache/invalidate` | Bearer | `settings:write` | Clear public settings cache |

### Query Parameters — `GET /settings`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `group` | string | — | Filter: `general`, `branding`, `integrations`, `seo`, `email` |
| `include_secrets` | boolean | `false` | Return masked secrets (never plaintext) |

### Request Body — `PUT /settings/{key}`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | string | Yes | Setting value (JSON string for `json` type) |
| `value_type` | string | No | `string`, `integer`, `boolean`, `json`, `secret` |

### Request Body — `PUT /settings` (bulk)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `settings` | object[] | Yes | Array of `{ key, value, value_type? }` |

### Schemas

#### `PublicSettingsOut`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `site_name` | string | No | Site display name |
| `site_tagline` | string | Yes | Tagline |
| `logo_url` | string | Yes | Logo URL |
| `favicon_url` | string | Yes | Favicon URL |
| `primary_color` | string | Yes | Hex color |
| `contact_email` | string | Yes | Public contact email |

#### `SettingOut`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `key` | string | No | Setting key |
| `value` | string | No | Value or masked secret |
| `value_type` | string | No | Type enum |
| `group` | string | No | Category group |
| `is_secret` | boolean | No | Secret flag |
| `description` | string | Yes | Human description |
| `updated_at` | datetime | No | Last update |

#### `SettingSchemaOut`

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Setting key |
| `value_type` | string | Expected type |
| `group` | string | Category |
| `is_secret` | boolean | Secret flag |
| `required` | boolean | Required for operation |
| `default` | string | Default value |
| `description` | string | Help text |

### Registered Settings (v1.0)

| Key | Group | Type | Secret |
|-----|-------|------|--------|
| `site_name` | general | string | No |
| `site_tagline` | general | string | No |
| `contact_email` | general | string | No |
| `timezone` | general | string | No |
| `logo_url` | branding | string | No |
| `favicon_url` | branding | string | No |
| `primary_color` | branding | string | No |
| `github_username` | integrations | string | No |
| `github_token` | integrations | secret | Yes |
| `youtube_api_key` | integrations | secret | Yes |
| `youtube_channel_id` | integrations | string | No |
| `youtube_video_limit` | integrations | integer | No |
| `default_meta_title` | seo | string | No |
| `default_meta_description` | seo | string | No |
| `default_og_image` | seo | string | No |
| `robots_txt` | seo | string | No |
| `email_from_name` | email | string | No |
| `email_from_address` | email | string | No |
| `notification_recipients` | email | json | No |

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| `200` | — | Successful read/update |
| `400` | `VALIDATION_ERROR` | Invalid type or value |
| `401` | `UNAUTHORIZED` | Missing token on admin route |
| `403` | `PERMISSION_DENIED` | Missing `settings:read`/`write` |
| `404` | `NOT_FOUND` | Unknown key on GET/DELETE |

## Security Considerations

- Secrets encrypted AES-256 before DB storage.
- `GET /settings/public` whitelist only — no secret keys.
- Env var overrides take precedence; not writable via API.
- `settings:write` limited to admin and super_admin.
- Never log secret values.
- Rate limit mutations: 30/hour/user.

## Acceptance Criteria

- [ ] Public endpoint returns only whitelisted keys.
- [ ] Secret write stores encrypted; read returns masked.
- [ ] Type validation rejects non-boolean for boolean key.
- [ ] Bulk PUT updates multiple keys atomically.
- [ ] Cache invalidate refreshes public settings within 5 min.
- [ ] Schema endpoint lists all registered keys.

## Future Enhancements

| Version | Enhancement |
|---------|-------------|
| v1.1 | Settings change audit log |
| v1.5 | Import/export JSON |
| v2.0 | Per-tenant settings namespace |

## Open Questions

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| OQ-SET-API-01 | Bulk PUT transactional all-or-nothing? | Medium | Backend |
| OQ-SET-API-02 | Expose `settings/schema` publicly? | Low | Security |

---

**See also:** [Settings Module](../06_Modules/Settings.md) · [GitHub API](./GitHub_API.md) · [YouTube API](./YouTube_API.md)
