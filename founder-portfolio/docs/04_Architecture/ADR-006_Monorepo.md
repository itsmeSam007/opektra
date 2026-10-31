# ADR-006: Monorepo Structure

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-29 |
| **Deciders** | Principal Software Architect, CTO |

## Context

SRS open question OQ-03 asked whether FounderOS should use a monorepo or separate frontend/backend repositories.

## Decision

Use a **monorepo** at the repository root:

```
portfolio/
├── docker-compose.yml
├── .env.example
├── founder-portfolio/    # Documentation suite
├── frontend/             # Next.js 15
└── backend/              # FastAPI
```

## Rationale

- Single PR can update API contract docs and implementation together
- Docker Compose at root orchestrates full stack for local dev
- Documentation suite remains isolated in `founder-portfolio/`
- White-label licensees can fork one repository

## Consequences

- CI runs matrix jobs for `frontend/` and `backend/`
- Vercel deploys from `frontend/` subdirectory
- Hostinger VPS deploys `backend/` Docker image

## Related

- [Folder_Structure.md](./Folder_Structure.md)
- [IMPLEMENTATION_ROADMAP.md](../../IMPLEMENTATION_ROADMAP.md) Sprint 0
