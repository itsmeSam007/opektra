# Sprint 4 Report — Products

| Field | Value |
|-------|-------|
| **Sprint** | 4 — Products |
| **Status** | Complete (foundation) |
| **Started** | 2026-06-29 |
| **Completed** | 2026-06-29 |
| **Docs** | `docs/06_Modules/Product_Manager.md`, `docs/08_API/Products_API.md`, `docs/05_Pages/Products.md` |

---

## Prerequisites Fixed (same session)

`docker compose up -d` failed because Alembic migrations were never applied on startup; existing Postgres volumes lacked `users.role_id`.

| Fix | File |
|-----|------|
| Run `alembic upgrade head` before uvicorn | `backend/scripts/start.sh`, `backend/Dockerfile` |
| Migrations on app startup (dev volume mount) | `backend/app/core/migrations.py`, `app/main.py` |
| Idempotent RBAC + CMS migrations | `alembic/versions/20260629_0002_rbac.py`, `0003_cms.py` |
| Use `sh scripts/start.sh` (bind-mount exec bit) | `backend/Dockerfile` |

---

## Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | Product CRUD and publishing | Done |
| 2 | Flagship product designation | Done |
| 3 | Public products list and detail pages | Done |
| 4 | Product JSON-LD schema | Done (existing) |
| 5 | CMS block type `product-showcase` | Done |

---

## Deliverables

### Backend

| Item | Path |
|------|------|
| Product service (cache, flagship, slug conflict) | `backend/app/services/products.py` |
| Products API (list, get, CRUD, PATCH flagship) | `backend/app/api/routes/products.py` |
| Redis cache TTL 60s + invalidation | `products.py` service |
| CMS block registry | `backend/app/core/cms_blocks.py` |
| Block type validation + `/cms/block-types` | `cms.py` service + route |
| Product API tests | `backend/tests/test_products.py` |

### Frontend

| Item | Path |
|------|------|
| ISR revalidate 3600s | `frontend/src/app/products/page.tsx`, `[slug]/page.tsx` |
| Flagship-first sort, empty state, enterprise CTA | `products/page.tsx` |
| Admin publish/flagship toggles | `admin/products/page.tsx` |
| CMS `product-showcase` block component | `components/cms/product-showcase-block.tsx` |
| Flagship badge only when `is_flagship` | `components/product/product-showcase.tsx` |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Only published products on public routes | Pass |
| One flagship enforced on create/update/PATCH | Pass |
| Product detail renders features, architecture, screenshots | Pass |
| JSON-LD Product schema on detail page | Pass |
| Redis cache invalidates on mutation | Pass |
| `docker compose up -d --build` succeeds | Pass |

---

## Verification

```bash
docker compose up -d --build
curl http://localhost:18000/api/v1/health
curl http://localhost:18000/api/v1/products
open http://localhost:13000/products
open http://localhost:13000/admin/products
```

**Admin:** `admin@founderos.local` / `admin123`

---

## Known Gaps (carry-forward)

- Integer PKs in API vs UUID in docs
- Admin product editor is basic (no tabbed Features/Architecture/Screenshots UI)
- Drag-sort `sort_order` not implemented in admin UI
- Pagination/search query params deferred (P1 in API spec)
- Lighthouse ≥ 90 on `/products` not measured in CI

---

## Next Sprint

**Sprint 5 — Portfolio:** `docs/06_Modules/Portfolio_Manager.md`, portfolio + case study pages.
