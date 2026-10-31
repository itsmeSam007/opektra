# Users API

| Field | Value |
|-------|-------|
| **Document ID** | API-USERS-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Base Path** | `/api/v1/users` |
| **Status** | Approved |
| **Last Updated** | 2026-06-29 |
| **Related** | [Authentication API](./Authentication_API.md) · [Entities](../09_Database/Entities.md) |

---

## Purpose

Define admin user, role, and permission management for RBAC.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| v1.0 REST endpoints listed below | GraphQL (v2.0) |
| Pydantic request/response schemas | Implementation code |
| RBAC permission requirements | Webhook callbacks (v1.5) |

## Business Context

FounderOS is a modular white-label platform. This API enables the Next.js 15 frontend and admin panel to manage users content with consistent contracts across tenants.

## Goals

1. Provide typed, versioned REST endpoints under `/api/v1`.
2. Enforce RBAC on all mutation operations.
3. Meet p95 latency targets per SRS.
4. Support OpenAPI 3.1 auto-generation from FastAPI.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | All endpoints follow [Authentication API](./Authentication_API.md) conventions | P0 |
| FR-002 | Public reads return only published content where applicable | P0 |
| FR-003 | Mutations require Bearer token and module permission | P0 |
| FR-004 | Errors use standard error envelope | P0 |
| FR-005 | List endpoints support pagination | P1 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | p95 latency | < 200 ms |
| NFR-002 | Rate limit (public) | 100 req/min/IP |
| NFR-003 | Max payload | 1 MB JSON |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-001 | Admin | CRUD via API | I manage content in admin UI |
| US-002 | Visitor | read published data | public pages render |
| US-003 | Developer | OpenAPI spec | I generate clients |

## UX Requirements

- Admin UI reflects API validation errors inline.
- Public pages show skeleton loaders during fetch.
- Optimistic updates in admin where safe.

## Technical Considerations

### API Conventions

See [Authentication API](./Authentication_API.md) for versioning, pagination, filtering, sorting, and error format.

### Endpoints

| Method | Path | Auth | Permission | Description |
|--------|------|------|------------|-------------|
| `GET` | `/api/v1/users` | Bearer | users.read | List users |
| `POST` | `/api/v1/users` | Bearer | users.write | Create/invite user |
| `GET` | `/api/v1/users/{id}` | Bearer | users.read | Get user |
| `PUT` | `/api/v1/users/{id}` | Bearer | users.write | Update user |
| `DELETE` | `/api/v1/users/{id}` | Bearer | users.write | Deactivate user |
| `GET` | `/api/v1/roles` | Bearer | roles.read | List roles |
| `POST` | `/api/v1/roles` | Bearer | roles.write | Create custom role |
| `PUT` | `/api/v1/roles/{id}` | Bearer | roles.write | Update role permissions |
| `GET` | `/api/v1/permissions` | Bearer | roles.read | List all permissions |

### Standard Response Fields

All resource responses include: `id` (UUID), `created_at`, `updated_at`. Soft-deleted records return `404` on public routes.

### Permissions

Predefined roles: `super_admin`, `admin`, `editor`, `viewer`. Custom roles supported with granular permission assignment.

### Cache Invalidation

On create/update/delete/publish, invalidate Redis keys prefixed with resource name. CDN ISR revalidation triggered via Next.js on-demand revalidation hook.

## Security Considerations

- Validate all inputs with Pydantic v2 schemas.
- Sanitize HTML fields to prevent XSS.
- Rate-limit public POST endpoints.
- Audit log all admin mutations per [Audit](../11_Security/Audit.md).

## Acceptance Criteria

- [ ] All endpoints implemented per this contract
- [ ] OpenAPI documents all operations
- [ ] Integration tests cover happy path and 401/403
- [ ] Public endpoints exclude unpublished records
- [ ] Pagination works on list endpoints

## Future Enhancements

| Version | Enhancement |
|---------|-------------|
| v1.5 | Webhooks on publish events |
| v2.0 | Multi-tenant row scoping |

## Open Questions

| ID | Question | Owner |
|----|----------|-------|
| OQ-001 | Batch operations for admin? | Backend — defer v1.1 |

## Dependencies

- [Authentication API](./Authentication_API.md)
- [API Architecture](../04_Architecture/API_Architecture.md)
- [PRODUCT_REQUIREMENTS.md](../../PRODUCT_REQUIREMENTS.md)

## Glossary

| Term | Definition |
|------|------------|
| RBAC | Role-Based Access Control |
| ISR | Incremental Static Regeneration |
