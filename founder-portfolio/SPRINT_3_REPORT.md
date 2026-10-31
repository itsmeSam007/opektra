# Sprint 3 Report — CMS

| Field | Value |
|-------|-------|
| **Sprint** | 3 — CMS |
| **Status** | Complete (foundation) |
| **Started** | 2026-06-29 |
| **Completed** | 2026-06-29 |
| **Docs** | `docs/06_Modules/CMS.md`, `docs/08_API/CMS_API.md`, `docs/07_Admin/Content.md` |

---

## Prerequisites Fixed (same session)

Docker frontend build was timing out during `npm run build` because API fetches hung with no backend at build time.

| Fix | File |
|-----|------|
| Fetch timeout (8s) + fail-fast build URL | `frontend/src/lib/api-base.ts` |
| Exclude `.env.local` from image | `frontend/.dockerignore` |
| `DOCKER_BUILD=1` in Dockerfile | `frontend/Dockerfile` |
| Server uses `API_PROXY_URL`; browser uses `/api/v1` | `api-base.ts`, `admin-api.ts` |

---

## Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | Page + Block content model | Done |
| 2 | Draft/publish + revision history (10 max) | Done |
| 3 | CMS API per contract | Done |
| 4 | Admin content editor UI | Done (basic) |
| 5 | Redis cache invalidation on publish | Done |

---

## Deliverables

### Backend

| Item | Path |
|------|------|
| Models | `CMSPage`, `CMSBlock`, `CMSRevision` in `app/models/__init__.py` |
| CMS service | `app/services/cms.py` — revisions, cache, preview tokens |
| API routes | `app/api/routes/cms.py` — full endpoint set |
| Schemas | `app/schemas/cms.py` |
| RBAC | `cms:read`, `cms:write`, `cms:publish`, `cms:delete` |
| Migration | `alembic/versions/20260629_0003_cms.py` |
| Seed | Home + legal pages in `seed_database()` |

### Frontend

| Item | Path |
|------|------|
| Content list | `admin/content/page.tsx` |
| Page editor | `admin/content/[id]/page.tsx` |
| Dashboard link | CMS card on admin dashboard |

### API Endpoints

| Method | Path |
|--------|------|
| GET | `/api/v1/cms/pages` |
| GET | `/api/v1/cms/pages/id/{id}` |
| GET | `/api/v1/cms/pages/{slug}` |
| POST | `/api/v1/cms/pages` |
| PUT | `/api/v1/cms/pages/{id}` |
| DELETE | `/api/v1/cms/pages/{id}` |
| POST | `/api/v1/cms/pages/{id}/publish` |
| GET | `/api/v1/cms/pages/{id}/revisions` |
| POST | `/api/v1/cms/pages/{id}/revisions/{rev_id}/restore` |
| POST | `/api/v1/cms/preview-token` |

---

## Acceptance Criteria

| Criterion | Result |
|-----------|--------|
| Draft content not visible on public slug route | Pass |
| Publish caches page in Redis | Pass |
| Revision history capped at 10 | Pass |
| RBAC on mutations | Pass |
| Admin CMS UI functional | Pass |
| Docker frontend build | Pass |

---

## Known Gaps / Deferred

| Item | Target |
|------|--------|
| Block registry for domain modules | Sprint 4+ |
| Drag-and-drop block reorder UI | Sprint 7 |
| On-demand Next.js ISR revalidation hook | Sprint 9 |
| UUID PKs per Entities.md | Future migration |
| Rich block editor (not single textarea) | Sprint 7 |

---

## Next Sprint

**Sprint 4 — Products**: Product CRUD alignment with CMS blocks, flagship enforcement, JSON-LD.
