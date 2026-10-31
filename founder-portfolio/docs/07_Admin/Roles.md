# Admin Roles

| Field | Value |
|-------|-------|
| Admin Section ID | `ADM-ROLES` |
| Version | 1.0 |
| Status | Specification |
| Owner | Admin Platform |
| Last Updated | 2026-06-29 |

## Purpose

The Admin Roles section defines named role templates—Super Admin, Admin, Editor, Viewer—that bundle [Permissions](./Permissions.md) for assignment to [Users](./Users.md), establishing the RBAC model for FounderOS v1.0.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Predefined system roles (v1.0) | Custom role creation UI (v1.1) |
| Role-permission matrix view | Dynamic permission inheritance trees |
| Role description documentation | Organization-level roles (v2.0) |
| Read-only role list for non-super-admins | Role hierarchy (senior editor) |

## Business Context

Role-based access control enables founders to delegate content editing without granting integration or user management access—a common enterprise requirement for team operations.

## Goals

1. Ship four default roles covering v1.0 admin needs.
2. Document permission mapping per role clearly.
3. Prevent modification of system role core permissions in v1.0.
4. Support future custom roles without schema migration.
5. Display role capabilities in user assignment UI.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| ROLE-FR-01 | Define roles: `super_admin`, `admin`, `editor`, `viewer` | Must |
| ROLE-FR-02 | Display role list with description and user count | Must |
| ROLE-FR-03 | Permission matrix view per role | Must |
| ROLE-FR-04 | System roles non-deletable in v1.0 | Must |
| ROLE-FR-05 | Custom role CRUD (v1.1) | Could |
| ROLE-FR-06 | API endpoint to list roles | Must |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| ROLE-NFR-01 | Role lookup at auth | < 5 ms |
| ROLE-NFR-02 | Max roles v1.0 | 4 system + 0 custom |
| ROLE-NFR-03 | Max custom roles v1.1 | 20 |

## User Stories

| ID | As a… | I want to… | So that… |
|----|-------|-------------|----------|
| ROLE-US-01 | Super Admin | See what each role can do | I assign appropriate access |
| ROLE-US-02 | Super Admin | Assign Editor role to writer | They edit content only |
| ROLE-US-03 | Admin | Understand my own permissions | I know what I can change |
| ROLE-US-04 | Product owner | Plan custom roles for v1.1 | Enterprise deals are supported |

## UX Requirements

- Role list: card or table with name, description, assigned user count.
- Permission matrix: rows = permissions, columns = roles, checkmarks for grants.
- Read-only in v1.0 — no inline editing.
- Link from Users section role dropdown to role detail.
- Tooltip on each role summarizing key capabilities.

## Technical Considerations

### Default Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| `super_admin` | Full platform control | All permissions |
| `admin` | Site management | All except `users:write` |
| `editor` | Content publishing | `content:*`, `media:write` |
| `viewer` | Read-only admin | `*:read` only |

### Architecture

```mermaid
flowchart LR
    USER[users] --> ROLE[roles]
    ROLE --> PERM[role_permissions]
    PERM --> PERMISSIONS[permissions]
```

### Data Entities

| Entity | Table | Purpose |
|--------|-------|---------|
| Role | `roles` | Role definitions |
| RolePermission | `role_permissions` | M:N role to permission |

## Security Considerations

- Only `super_admin` can view full permission matrix.
- Role changes require `users:write`.
- JWT includes role claim; permissions resolved server-side.
- Cannot assign role higher than assigner's own role.

## Acceptance Criteria

- [ ] Four system roles seeded on deploy.
- [ ] Permission matrix matches [Permissions](./Permissions.md) doc.
- [ ] Editor cannot access Settings or Users sections.
- [ ] Viewer sees content but no edit buttons.
- [ ] Role list shows accurate user counts.

## Future Enhancements

| Version | Enhancement |
|---------|-------------|
| v1.1 | Custom role builder UI |
| v1.5 | Role cloning |
| v2.0 | Scoped roles (content-type specific) |

## Open Questions

| ID | Question | Owner | Status |
|----|----------|-------|--------|
| OQ-ROLE-01 | Single role per user vs. multiple in v1.1? | Product | Open |
| OQ-ROLE-02 | Separate `integrations_admin` role? | Product | Open |

## Related Documents

- [Users Admin](./Users.md)
- [Permissions Admin](./Permissions.md)
- [Authentication API](../08_API/Authentication_API.md)
