# Sprint 2 Report — Authentication

| Field | Value |
|-------|-------|
| **Sprint** | 2 — Authentication |
| **Status** | Complete |
| **Started** | 2026-06-29 |
| **Completed** | 2026-06-29 |
| **Docs** | `docs/08_API/Authentication_API.md`, `docs/11_Security/Authentication.md`, `docs/06_Modules/Authentication.md` |

---

## Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | JWT access + refresh token rotation | Done |
| 2 | RBAC middleware and permission decorators | Done |
| 3 | Admin login at `/admin/login` | Done |
| 4 | Seed default roles and super admin | Done |

---

## Deliverables

### Backend

| Item | Path | Notes |
|------|------|-------|
| Auth routes | `backend/app/api/routes/auth.py` | login, refresh, logout, me |
| RBAC models | `backend/app/models/__init__.py` | Role, Permission, role_permissions |
| RBAC seed | `backend/app/main.py` | `seed_rbac()` + super_admin bootstrap |
| Permission deps | `backend/app/api/deps.py` | `require_permission()` → 403 |
| Token security | `backend/app/core/security.py` | bcrypt rounds 12, Redis refresh store |
| RBAC constants | `backend/app/core/rbac.py` | Roles: super_admin, admin, editor, viewer |
| Alembic migration | `alembic/versions/20260629_0002_rbac.py` | roles, permissions, user.role_id |
| Tests | `backend/tests/test_auth.py` | me, validation, invalid login, bcrypt config |

### Frontend

| Item | Path | Notes |
|------|------|-------|
| Admin login page | `frontend/src/app/admin/login/page.tsx` | `/admin/login` per URL Authority |
| Auth provider | `frontend/src/components/admin/admin-auth-provider.tsx` | Session bootstrap + guard |
| In-memory access token | `frontend/src/lib/auth-session.ts` | No localStorage |
| Admin API client | `frontend/src/lib/admin-api.ts` | `credentials: include` for refresh cookie |
| API proxy | `frontend/next.config.ts` | `/api/v1/*` → backend (same-origin cookies) |
| Admin pages | `frontend/src/app/admin/*` | Migrated off `localStorage` |

---

## Acceptance Criteria

| Criterion | Result |
|-----------|--------|
| `POST /auth/login`, `/refresh`, `/logout`, `GET /auth/me` | Pass |
| RBAC denies unauthorized mutations with 403 | Pass (permission deps on write routes) |
| Inactive users cannot login | Pass |
| bcrypt cost ≥ 12 | Pass |
| No tokens in localStorage | Pass |
| Bootstrap admin seed with super_admin role | Pass |
| Login rate limit 10/min/IP | Pass (Redis) |
| Frontend build | Pass |

---

## Verification

```bash
docker compose up --build
# Login: http://localhost:13000/admin/login
# Default: admin@soumenkarmakar.com / admin123

curl -X POST http://localhost:18000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@soumenkarmakar.com","password":"admin123"}' \
  -c cookies.txt

cd backend && python3 -m pytest tests/ -q
cd frontend && npm run build
```

---

## Known Gaps / Deferred

| Item | Target |
|------|--------|
| UUID PKs for users/roles (docs vs integer ORM) | Future migration |
| Standardized error envelope `{"error":{...}}` | Sprint 3+ |
| Account lockout after N failures | v1.0 P1 |
| Password change endpoint | Sprint 7 |
| Full integration test with Docker + Redis | CI service container |

---

## Next Sprint

**Sprint 3 — CMS**: pages, blocks, draft/publish, revision history, admin content editor.
