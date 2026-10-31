# Contact API

| Field | Value |
|-------|-------|
| **Document ID** | API-CONTACT-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Base Path** | `/api/v1/contact` |
| **Status** | Approved (Specification) |
| **Last Updated** | 2026-06-29 |
| **Related** | [Contact Manager](../06_Modules/Contact_Manager.md) · [Entities](../09_Database/Entities.md#contact_submissions) |

---

## Purpose

Define the REST API contract for **inbound lead capture and admin inbox management** — public contact and enterprise inquiry forms plus authenticated submission administration.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Public contact form submit | CRM webhook sync (v1.2) |
| Public enterprise inquiry submit | Email reply threading |
| Admin list/detail/update/delete | reCAPTCHA (v1.1) |
| CSV export (admin) | Lead scoring |

## Business Context

Contact and inquiry endpoints are the primary conversion APIs for FounderOS sites. Reliable capture and admin visibility directly impact revenue for founder customers.

## Goals

1. Transactionally persist form submissions.
2. Protect public endpoints from spam and abuse.
3. Provide paginated admin inbox with read/unread workflow.
4. Trigger notifications on new submissions.
5. Support GDPR export and deletion.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CNT-001 | `POST /contact` public submit | P0 |
| FR-CNT-002 | `POST /inquiries` public enterprise submit | P0 |
| FR-CNT-003 | Admin list contact submissions | P0 |
| FR-CNT-004 | Admin list inquiries | P0 |
| FR-CNT-005 | Mark read/unread | P0 |
| FR-CNT-006 | Delete submission | P1 |
| FR-CNT-007 | Honeypot validation | P0 |
| FR-CNT-008 | Rate limiting per IP | P0 |
| FR-CNT-009 | CSV export | P1 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-CNT-001 | Submit p95 | < 300 ms |
| NFR-CNT-002 | Admin list p95 | < 150 ms |
| NFR-CNT-003 | Rate limit | 10 submits/hour/IP |
| NFR-CNT-004 | Max message length | 10,000 chars |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-CNT-001 | Visitor | to submit contact form | the founder receives my message |
| US-CNT-002 | Enterprise buyer | to submit inquiry with budget | sales qualifies my lead |
| US-CNT-003 | Admin | to list unread submissions | I prioritize responses |
| US-CNT-004 | Admin | to export contacts | I import to CRM |

## UX Requirements

- Public forms POST to these endpoints; show success without exposing IDs.
- Admin inbox consumes list and detail endpoints.
- Unread filter via `is_read=false` query param.

## Technical Considerations

### API Conventions

See [Authentication API](./Authentication_API.md).

| Convention | Value |
|------------|-------|
| Public submit | No auth; honeypot + rate limit |
| Admin routes | Bearer + `contact:read` / `contact:write` |
| Inquiry types | `general`, `enterprise`, `partnership`, `press` |

### Endpoints

| Method | Path | Auth | Permission | Description |
|--------|------|------|------------|-------------|
| `POST` | `/api/v1/contact` | Public | — | Submit contact form |
| `POST` | `/api/v1/inquiries` | Public | — | Submit enterprise inquiry |
| `GET` | `/api/v1/contact/submissions` | Bearer | `contact:read` | List contact submissions |
| `GET` | `/api/v1/contact/submissions/{id}` | Bearer | `contact:read` | Get submission detail |
| `PATCH` | `/api/v1/contact/submissions/{id}` | Bearer | `contact:write` | Update read status |
| `DELETE` | `/api/v1/contact/submissions/{id}` | Bearer | `contact:write` | Delete submission |
| `GET` | `/api/v1/inquiries` | Bearer | `contact:read` | List inquiries |
| `GET` | `/api/v1/inquiries/{id}` | Bearer | `contact:read` | Get inquiry detail |
| `PATCH` | `/api/v1/inquiries/{id}` | Bearer | `contact:write` | Update read status |
| `DELETE` | `/api/v1/inquiries/{id}` | Bearer | `contact:write` | Delete inquiry |
| `GET` | `/api/v1/contact/submissions/export` | Bearer | `contact:read` | Export contacts CSV |
| `GET` | `/api/v1/inquiries/export` | Bearer | `contact:read` | Export inquiries CSV |

### Request Body — `POST /contact`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Submitter name (max 200) |
| `email` | string | Yes | Valid email format |
| `company` | string | No | Company name |
| `inquiry_type` | string | No | Default `general` |
| `message` | string | Yes | Message body |
| `website` | string | No | Honeypot — must be empty |

### Request Body — `POST /inquiries`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Contact name |
| `email` | string | Yes | Work email |
| `company` | string | Yes | Company name |
| `role` | string | Yes | Job title |
| `message` | string | Yes | Inquiry details |
| `budget_range` | string | No | e.g., `$10k–$50k` |
| `inquiry_type` | string | No | Default `enterprise` |
| `website` | string | No | Honeypot — must be empty |

### Query Parameters — `GET /contact/submissions` and `GET /inquiries`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `is_read` | boolean | — | Filter by read status |
| `inquiry_type` | string | — | Filter by type |
| `created_after` | datetime | — | Submitted on or after |
| `created_before` | datetime | — | Submitted on or before |
| `page` | integer | `1` | Page number |
| `page_size` | integer | `25` | Items per page |
| `sort` | string | `created_at:desc` | Sort expression |

### Schemas

#### `ContactSubmissionOut`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | integer | No | Primary key |
| `name` | string | No | Submitter name |
| `email` | string | No | Email address |
| `company` | string | Yes | Company |
| `inquiry_type` | string | No | Inquiry category |
| `message` | string | No | Message body |
| `is_read` | boolean | No | Read status |
| `created_at` | datetime | No | Submission time |

#### `InquiryOut`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | integer | No | Primary key |
| `inquiry_type` | string | No | Inquiry category |
| `name` | string | No | Contact name |
| `email` | string | No | Email |
| `company` | string | No | Company |
| `role` | string | No | Job title |
| `message` | string | No | Details |
| `budget_range` | string | Yes | Budget bracket |
| `is_read` | boolean | No | Read status |
| `created_at` | datetime | No | Submission time |

#### `POST` Success Response `201`

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | Always `true` |
| `message` | string | "Thank you for your submission" |

Note: Response intentionally omits submission `id` to prevent enumeration.

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| `201` | — | Valid submission (or honeypot silent success) |
| `400` | `VALIDATION_ERROR` | Invalid email or missing required field |
| `401` | `UNAUTHORIZED` | Admin route without token |
| `403` | `PERMISSION_DENIED` | Missing contact permission |
| `404` | `NOT_FOUND` | Submission ID not found |
| `429` | `RATE_LIMITED` | IP rate limit exceeded |

## Security Considerations

- Honeypot field `website` — non-empty returns 201 without insert.
- Rate limit public POST endpoints.
- Admin endpoints require `contact:read` / `contact:write`.
- No public GET for submission content.
- Sanitize all text fields; validate email format.
- CSV export audit logged (v1.1).

## Acceptance Criteria

- [ ] Valid contact POST returns 201 and persists row.
- [ ] Honeypot POST returns 201 without DB insert.
- [ ] Admin list paginates and filters by `is_read`.
- [ ] PATCH updates `is_read` status.
- [ ] Notification triggered on valid submit.
- [ ] Export returns CSV with correct headers.

## Future Enhancements

| Version | Enhancement |
|---------|-------------|
| v1.1 | reCAPTCHA v3 |
| v1.2 | HubSpot webhook |
| v1.5 | Idempotency-Key header |

## Open Questions

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| OQ-CNT-API-01 | Store submitter IP for abuse? | Medium | Legal |
| OQ-CNT-API-02 | Unified vs. separate list endpoints? | Low | API |

---

**See also:** [Contact Manager](../06_Modules/Contact_Manager.md) · [Content Admin](../07_Admin/Content.md)
