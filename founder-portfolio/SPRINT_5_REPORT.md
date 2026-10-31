# Sprint 5 Report — Portfolio & Case Studies

| Field | Value |
|-------|-------|
| **Sprint** | 5 — Portfolio |
| **Status** | Complete (foundation) |
| **Started** | 2026-06-29 |
| **Completed** | 2026-06-29 |
| **Docs** | `docs/06_Modules/Portfolio_Manager.md`, `docs/08_API/Portfolio_API.md`, `docs/05_Pages/Portfolio.md`, `docs/05_Pages/Case_Studies.md` |

---

## Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | Portfolio items and case studies | Done |
| 2 | Category filtering | Done |
| 3 | Gallery integration for case study media | Done |
| 4 | Related products linking | Done |

---

## Deliverables

### Backend

| Item | Path |
|------|------|
| Portfolio service (cache, category filter, reorder) | `backend/app/services/portfolio.py` |
| Case study service (cache, gallery, related product) | `backend/app/services/case_studies.py` |
| Migration: `related_product_slug`, `gallery_images` | `alembic/versions/20260629_0004_case_study_fields.py` |
| Portfolio API: GET slug, category filter, PATCH reorder | `backend/app/api/routes/portfolio.py` |
| Case studies API: gallery + related product fields | `backend/app/api/routes/case_studies.py` |
| CMS block `portfolio-grid` | `backend/app/core/cms_blocks.py` |
| Tests | `tests/test_portfolio.py`, `tests/test_case_studies.py` |

### Frontend

| Item | Path |
|------|------|
| Portfolio grid with category filter chips | `components/portfolio/portfolio-grid.tsx` |
| ISR `/portfolio` (3600s) | `app/portfolio/page.tsx` |
| Case study gallery lightbox with alt text | `components/case-studies/case-study-gallery.tsx` |
| Case study detail: gallery + related product CTA | `app/case-studies/[slug]/page.tsx` |
| `generateStaticParams` + Article JSON-LD | `case-studies/[slug]/page.tsx`, `lib/seo.ts` |
| Admin publish toggles + gallery JSON editor | `admin/portfolio`, `admin/case-studies` |
| CMS `PortfolioGridBlock` | `components/cms/portfolio-grid-block.tsx` |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Portfolio grid with category filter | Pass |
| Case study detail: challenge, solution, results, metrics | Pass |
| Unpublished items return 404 | Pass |
| Gallery images render with alt text | Pass |
| Related product link on case study detail | Pass |
| Cross-links to products work | Pass |

---

## Verification

```bash
docker compose up -d --build
curl http://localhost:18000/api/v1/portfolio
curl http://localhost:18000/api/v1/case-studies/techflow-customer-ops
open http://localhost:13000/portfolio
open http://localhost:13000/case-studies
```

**Note:** Existing Postgres volumes created before this sprint keep prior case study rows without gallery/related-product seed data. Run `docker compose down -v && docker compose up -d --build` for a fresh seed, or edit via `/admin/case-studies`.

---

## Known Gaps (carry-forward)

- Admin drag-reorder UI not implemented (API `PATCH /portfolio/reorder` exists)
- Portfolio item detail pages deferred (external `project_url` only)
- Industry filter on case studies listing deferred (P1)
- E2E smoke test not in CI yet

---

## Next Sprint

**Sprint 6 — Travel:** `docs/06_Modules/Travel_Manager.md`, `docs/05_Pages/Travel.md`, `docs/05_Pages/Media.md`
