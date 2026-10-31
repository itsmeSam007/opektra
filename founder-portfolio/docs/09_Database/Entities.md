# Database Entities

| Field | Value |
|-------|-------|
| **Document ID** | DB-ENT-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Database** | PostgreSQL 16 |
| **Status** | Approved (Specification) |
| **Last Updated** | 2026-06-29 |
| **Related** | [ERD](./ERD.md) · [Relationships](./Relationships.md) · [Naming Convention](./Naming_Convention.md) |

---

## Purpose

Document every **database entity (table)** in FounderOS v1.0 with column definitions, types, constraints, and business meaning — the authoritative field reference for backend development and API schema design.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| All v1.0 PostgreSQL tables | Redis structures |
| Column types and nullability | ORM model class definitions |
| Default values and constraints | Seed data scripts |
| JSON field schemas | Migration history |

## Business Context

Explicit entity documentation prevents schema drift between API contracts, ORM models, and frontend types. Enterprise reviews require field-level PII classification.

## Goals

1. Define every column with type and business description.
2. Mark primary keys, unique keys, and foreign keys.
3. Document JSON column schemas inline.
4. Classify PII columns for compliance.
5. Cross-reference API response schemas in [08_API](../08_API/).

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ENT-001 | Every table has entity section | P0 |
| FR-ENT-002 | PK and UK documented per table | P0 |
| FR-ENT-003 | FK columns reference target table | P0 |
| FR-ENT-004 | JSON schemas documented | P0 |
| FR-ENT-005 | PII columns flagged | P1 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-ENT-001 | Max JSON column size | < 1 MB |
| NFR-ENT-002 | Charset | UTF-8 |
| NFR-ENT-003 | Timestamps | UTC `timestamptz` |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-ENT-001 | Backend dev | column type reference | I define correct ORM fields |
| US-ENT-002 | API designer | entity field names | schemas match DB |
| US-ENT-003 | Compliance | PII field list | GDPR scope is clear |

## UX Requirements

- Entity sections anchor-linked from ERD and API docs.
- Tables sortable by domain grouping in doc navigation.
- PII badge on sensitive columns.

## Technical Considerations

Entity tables below. Types use PostgreSQL notation. `PK` = primary key, `UK` = unique, `FK` = foreign key, `PII` = personally identifiable information.

---

### users

Administrator accounts for the FounderOS admin panel.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `email` | `VARCHAR(255)` | No | UK | Login email **PII** |
| `hashed_password` | `VARCHAR(255)` | No | — | bcrypt hash |
| `role_id` | `UUID` | No | FK → `roles.id` | Assigned role |
| `is_active` | `BOOLEAN` | No | DEFAULT `true` | Account active flag |
| `last_login_at` | `TIMESTAMPTZ` | Yes | — | Last successful login |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |
| `updated_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Last modified |

---

### roles

RBAC role definitions.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `name` | `VARCHAR(50)` | No | UK | `super_admin`, `admin`, `editor`, `viewer` |
| `description` | `TEXT` | Yes | — | Human-readable description |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |

---

### permissions

Granular permission strings.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `code` | `VARCHAR(100)` | No | UK | e.g., `content:write` |
| `description` | `TEXT` | Yes | — | Permission description |

---

### role_permissions

Many-to-many join between roles and permissions.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `role_id` | `INTEGER` | No | PK, FK → `roles.id` | Role reference |
| `permission_id` | `INTEGER` | No | PK, FK → `permissions.id` | Permission reference |

---

### site_settings

Key-value site configuration store.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `key` | `VARCHAR(100)` | No | UK | Setting key |
| `value` | `TEXT` | No | — | Setting value (encrypted if secret) |
| `value_type` | `VARCHAR(20)` | No | DEFAULT `'string'` | `string`, `integer`, `boolean`, `json`, `secret` |
| `is_secret` | `BOOLEAN` | No | DEFAULT `false` | Encrypted at rest if true |
| `group_name` | `VARCHAR(50)` | No | — | UI grouping category |
| `updated_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Last modified |

---

### products

SaaS product catalog entries.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `slug` | `VARCHAR(200)` | No | UK | URL slug |
| `name` | `VARCHAR(200)` | No | — | Product name |
| `tagline` | `VARCHAR(500)` | Yes | — | Short tagline |
| `description` | `TEXT` | Yes | — | Full description |
| `features` | `TEXT` | Yes | — | JSON: `[{title, description, icon}]` |
| `domains` | `TEXT` | Yes | — | JSON: `["Financial Services", ...]` |
| `architecture` | `TEXT` | Yes | — | JSON: architecture diagram data |
| `screenshots` | `TEXT` | Yes | — | JSON: `["url1", "url2"]` |
| `is_flagship` | `BOOLEAN` | No | DEFAULT `false` | Featured on homepage |
| `is_published` | `BOOLEAN` | No | DEFAULT `false` | Public visibility |
| `sort_order` | `INTEGER` | No | DEFAULT `0` | Manual ordering |
| `meta_title` | `VARCHAR(70)` | Yes | — | SEO override |
| `meta_description` | `VARCHAR(160)` | Yes | — | SEO override |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |
| `updated_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Last modified |

---

### blog_posts

Long-form blog content.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `slug` | `VARCHAR(200)` | No | UK | URL slug |
| `title` | `VARCHAR(300)` | No | — | Post title |
| `excerpt` | `TEXT` | Yes | — | Summary for cards |
| `content` | `TEXT` | No | — | Markdown/HTML body |
| `cover_image` | `VARCHAR(500)` | Yes | — | Cover image URL |
| `tags` | `VARCHAR(500)` | Yes | — | Comma-separated tags |
| `is_published` | `BOOLEAN` | No | DEFAULT `false` | Public visibility |
| `published_at` | `TIMESTAMPTZ` | Yes | — | Publish timestamp |
| `meta_title` | `VARCHAR(70)` | Yes | — | SEO override |
| `meta_description` | `VARCHAR(160)` | Yes | — | SEO override |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |
| `updated_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Last modified |

---

### portfolio_items

Portfolio / project showcase entries.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `slug` | `VARCHAR(200)` | No | UK | URL slug |
| `title` | `VARCHAR(300)` | No | — | Project title |
| `category` | `VARCHAR(100)` | Yes | — | Category label |
| `description` | `TEXT` | Yes | — | Project description |
| `technologies` | `VARCHAR(500)` | Yes | — | Comma-separated tech stack |
| `image_url` | `VARCHAR(500)` | Yes | — | Thumbnail URL |
| `project_url` | `VARCHAR(500)` | Yes | — | External project link |
| `is_published` | `BOOLEAN` | No | DEFAULT `false` | Public visibility |
| `sort_order` | `INTEGER` | No | DEFAULT `0` | Manual ordering |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |

---

### case_studies

Client case study content.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `slug` | `VARCHAR(200)` | No | UK | URL slug |
| `title` | `VARCHAR(300)` | No | — | Case study title |
| `client` | `VARCHAR(200)` | Yes | — | Client name |
| `industry` | `VARCHAR(100)` | Yes | — | Industry vertical |
| `summary` | `TEXT` | Yes | — | Executive summary |
| `challenge` | `TEXT` | Yes | — | Challenge section |
| `solution` | `TEXT` | Yes | — | Solution section |
| `results` | `TEXT` | Yes | — | Results narrative |
| `metrics` | `TEXT` | Yes | — | JSON: `[{label, value}]` |
| `cover_image` | `VARCHAR(500)` | Yes | — | Cover image URL |
| `is_published` | `BOOLEAN` | No | DEFAULT `false` | Public visibility |
| `sort_order` | `INTEGER` | No | DEFAULT `0` | Manual ordering |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |

---

### testimonials

Customer testimonial quotes.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `name` | `VARCHAR(200)` | No | — | Person name |
| `role` | `VARCHAR(200)` | Yes | — | Job title |
| `company` | `VARCHAR(200)` | Yes | — | Company name |
| `content` | `TEXT` | No | — | Quote text |
| `avatar_url` | `VARCHAR(500)` | Yes | — | Avatar image URL |
| `is_published` | `BOOLEAN` | No | DEFAULT `false` | Public visibility |
| `sort_order` | `INTEGER` | No | DEFAULT `0` | Manual ordering |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |

---

### travel_entries

Travel log content entries.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `slug` | `VARCHAR(200)` | No | UK | URL slug |
| `title` | `VARCHAR(300)` | No | — | Entry title |
| `location` | `VARCHAR(200)` | No | — | Place name |
| `category` | `VARCHAR(50)` | No | — | `adventure`, `food`, etc. |
| `content` | `TEXT` | Yes | — | Narrative body |
| `latitude` | `DECIMAL(10,7)` | Yes | — | Geo latitude |
| `longitude` | `DECIMAL(10,7)` | Yes | — | Geo longitude |
| `visited_at` | `DATE` | Yes | — | Visit date |
| `is_published` | `BOOLEAN` | No | DEFAULT `false` | Public visibility |
| `is_featured` | `BOOLEAN` | No | DEFAULT `false` | Hero feature flag |
| `sort_order` | `INTEGER` | No | DEFAULT `0` | Manual ordering |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |
| `updated_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Last modified |

---

### media_folders

Media library folder hierarchy.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `name` | `VARCHAR(200)` | No | — | Folder display name |
| `parent_id` | `INTEGER` | Yes | FK → `media_folders.id` | Parent folder (null = root) |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |

---

### media_assets

Uploaded media files metadata.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `filename` | `VARCHAR(255)` | No | — | Original filename |
| `stored_path` | `VARCHAR(500)` | No | UK | Internal storage path |
| `mime_type` | `VARCHAR(100)` | No | — | MIME type |
| `file_size` | `INTEGER` | No | — | Size in bytes |
| `width` | `INTEGER` | Yes | — | Image width px |
| `height` | `INTEGER` | Yes | — | Image height px |
| `alt_text` | `VARCHAR(500)` | Yes | — | Accessibility alt text |
| `caption` | `TEXT` | Yes | — | Display caption |
| `folder_id` | `INTEGER` | Yes | FK → `media_folders.id` | Parent folder |
| `uploaded_by` | `INTEGER` | Yes | FK → `users.id` | Uploading user |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Upload time |
| `updated_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Metadata updated |

---

### gallery_albums

Photo gallery albums.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `slug` | `VARCHAR(200)` | No | UK | URL slug |
| `title` | `VARCHAR(300)` | No | — | Album title |
| `description` | `TEXT` | Yes | — | Album description |
| `cover_media_id` | `INTEGER` | Yes | FK → `media_assets.id` | Cover image |
| `is_published` | `BOOLEAN` | No | DEFAULT `false` | Public visibility |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Record created |
| `updated_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Last modified |

---

### gallery_album_items

Ordered media items within albums.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `album_id` | `INTEGER` | No | PK, FK → `gallery_albums.id` | Album reference |
| `media_asset_id` | `INTEGER` | No | PK, FK → `media_assets.id` | Media reference |
| `sort_order` | `INTEGER` | No | DEFAULT `0` | Display order |

---

### travel_entry_media

Gallery images linked to travel entries.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `travel_entry_id` | `INTEGER` | No | PK, FK → `travel_entries.id` | Travel entry |
| `media_asset_id` | `INTEGER` | No | PK, FK → `media_assets.id` | Media asset |
| `sort_order` | `INTEGER` | No | DEFAULT `0` | Display order |

---

### contact_submissions

General contact form submissions.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `name` | `VARCHAR(200)` | No | — | Submitter name **PII** |
| `email` | `VARCHAR(255)` | No | — | Email **PII** |
| `company` | `VARCHAR(200)` | Yes | — | Company name |
| `inquiry_type` | `VARCHAR(50)` | No | DEFAULT `'general'` | Inquiry category |
| `message` | `TEXT` | No | — | Message body |
| `is_read` | `BOOLEAN` | No | DEFAULT `false` | Admin read flag |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Submission time |

---

### inquiries

Enterprise inquiry form submissions.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `inquiry_type` | `VARCHAR(50)` | No | DEFAULT `'enterprise'` | Inquiry category |
| `name` | `VARCHAR(200)` | No | — | Contact name **PII** |
| `email` | `VARCHAR(255)` | No | — | Email **PII** |
| `company` | `VARCHAR(200)` | No | — | Company name |
| `role` | `VARCHAR(200)` | No | — | Job title |
| `message` | `TEXT` | No | — | Inquiry details |
| `budget_range` | `VARCHAR(100)` | Yes | — | Budget bracket |
| `is_read` | `BOOLEAN` | No | DEFAULT `false` | Admin read flag |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Submission time |

---

### newsletter_subscribers

Email newsletter subscribers.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `email` | `VARCHAR(255)` | No | UK | Subscriber email **PII** |
| `status` | `VARCHAR(20)` | No | DEFAULT `'pending'` | `pending`, `confirmed`, `unsubscribed` |
| `consent_at` | `TIMESTAMPTZ` | Yes | — | GDPR consent timestamp |
| `confirm_token` | `VARCHAR(100)` | Yes | UK | Double opt-in token |
| `unsubscribe_token` | `VARCHAR(100)` | Yes | UK | Unsubscribe token |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Subscription initiated |
| `confirmed_at` | `TIMESTAMPTZ` | Yes | — | Confirmation time |

---

### search_documents

Denormalized full-text search index.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `content_type` | `VARCHAR(50)` | No | — | `blog`, `product`, etc. |
| `content_id` | `INTEGER` | No | — | Source entity ID |
| `title` | `VARCHAR(300)` | No | — | Searchable title |
| `body_text` | `TEXT` | Yes | — | Stripped plain text |
| `url` | `VARCHAR(500)` | No | UK | Public URL path |
| `search_vector` | `TSVECTOR` | Yes | — | PostgreSQL FTS vector |
| `published_at` | `TIMESTAMPTZ` | Yes | — | For recency ranking |

---

### analytics_events

Raw first-party analytics events.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `event_type` | `VARCHAR(50)` | No | — | `page_view`, `conversion` |
| `path` | `VARCHAR(500)` | No | — | URL path |
| `referrer` | `VARCHAR(500)` | Yes | — | Referrer host |
| `conversion_type` | `VARCHAR(50)` | Yes | — | Conversion subtype |
| `visitor_hash` | `VARCHAR(64)` | Yes | — | Daily salted hash |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Event timestamp |

---

### analytics_daily_rollups

Pre-aggregated daily analytics metrics.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `rollup_date` | `DATE` | No | UK | Aggregation date |
| `page_views` | `INTEGER` | No | DEFAULT `0` | Total page views |
| `unique_visitors` | `INTEGER` | No | DEFAULT `0` | Unique visitor count |
| `conversions` | `INTEGER` | No | DEFAULT `0` | Total conversions |
| `conversions_by_type` | `TEXT` | Yes | — | JSON: `{contact_submit: N, ...}` |
| `top_pages` | `TEXT` | Yes | — | JSON: top paths snapshot |

---

### notifications

In-app admin notifications.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `user_id` | `UUID` | No | FK → `users.id` | Target admin user |
| `notification_type` | `VARCHAR(50)` | No | — | Event type code |
| `title` | `VARCHAR(200)` | No | — | Short title |
| `message` | `TEXT` | Yes | — | Notification body |
| `link_url` | `VARCHAR(500)` | Yes | — | Admin deep link |
| `is_read` | `BOOLEAN` | No | DEFAULT `false` | Read status |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Created time |

---

### app_logs

Structured application log storage.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `UUID` | No | PK, DEFAULT `gen_random_uuid()` | Primary key |
| `level` | `VARCHAR(20)` | No | — | `DEBUG`, `INFO`, `WARNING`, `ERROR` |
| `module` | `VARCHAR(100)` | No | — | Source module tag |
| `message` | `TEXT` | No | — | Log message |
| `context` | `TEXT` | Yes | — | JSON metadata (no secrets) |
| `created_at` | `TIMESTAMPTZ` | No | DEFAULT `now()` | Log timestamp |

## Security Considerations

- PII tables: `users`, `contact_submissions`, `inquiries`, `newsletter_subscribers`.
- `site_settings.value` encrypted when `is_secret=true`.
- `hashed_password` never logged or returned via API.
- `confirm_token` and `unsubscribe_token` are single-use secrets.
- Retention policies per [Database Architecture](../04_Architecture/Database_Architecture.md).

## Acceptance Criteria

- [ ] Every SQLAlchemy model has matching entity section.
- [ ] All UK and FK columns documented.
- [ ] JSON column schemas include examples.
- [ ] PII columns flagged in all relevant tables.
- [ ] API schemas in 08_API align with entity fields.

## Future Enhancements

| Version | Entity |
|---------|--------|
| v1.1 | `integration_cache_meta`, `content_revisions` |
| v1.5 | `notification_preferences` |
| v2.0 | `tenants` + `tenant_id` on all tables |

## Open Questions

| ID | Question | Owner | Status |
|----|----------|-------|--------|
| OQ-ENT-01 | JSONB vs TEXT for JSON columns? | Backend | Open |
| OQ-ENT-02 | `media_assets` in v1.0 release? | Product | Open |

## Related Documents

- [ERD](./ERD.md)
- [Relationships](./Relationships.md)
- [Indexes](./Indexes.md)
