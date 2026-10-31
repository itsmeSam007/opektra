# FounderOS — Build Context

> **Living document.** Read this file + linked specs **before** starting any task. Update this file + sprint report **after** each task completes.

| Field | Value |
|-------|-------|
| **Project** | FounderOS (Founder Portfolio Platform) |
| **Repo** | `/portfolio` monorepo |
| **Docs** | `founder-portfolio/` |
| **Last Updated** | 2026-06-29 |
| **Current Sprint** | 11 — Production (next) |

---

## Workflow Rules

1. **Before each task:** Read `context.md` → read sprint-specific docs listed below → read `IMPLEMENTATION_ROADMAP.md` acceptance criteria.
2. **After each task:** Update task status in this file → update `founder-portfolio/SPRINT_N_REPORT.md` → note any doc/code drift.
3. **URL conflicts:** `founder-portfolio/URL_AUTHORITY.md` wins — `/media` is canonical (not `/technology`).
4. **Ports:** `PORTS.md` — never use 3000/8000/5432/6379 on host.

---

## Build Phases

| Phase | Sprint | Focus | Status | Started | Completed |
|-------|--------|-------|--------|---------|-----------|
| Reconciliation | −1 | Documentation audit & fix | **Complete** | 2026-06-15 | 2026-06-28 |
| Foundation | 0 | Docker, CI, health, Alembic | **Complete** | 2026-06-29 | 2026-06-29 |
| Design System | 1 | Tokens, shadcn/ui, theme, layout | **Complete** | 2026-06-29 | 2026-06-29 |
| Authentication | 2 | JWT, refresh, RBAC, admin login | **Complete** | 2026-06-29 | 2026-06-29 |
| CMS | 3 | Pages, blocks, publish workflow | **Complete** | 2026-06-29 | 2026-06-29 |
| Products | 4 | Product CRUD & public pages | **Complete** | 2026-06-29 | 2026-06-29 |
| Portfolio | 5 | Portfolio & case studies | **Complete** | 2026-06-29 | 2026-06-29 |
| Travel | 6 | Travel, media, GitHub, YouTube | **Complete** | 2026-06-29 | 2026-06-29 |
| Admin | 7 | Full admin panel (11 sections) | **Complete** | 2026-06-29 | 2026-06-29 |
| Enterprise | 8 | Contact, newsletter, search | **Complete** | 2026-06-29 | 2026-06-29 |
| Optimization | 9 | Performance, SEO, CDN | **Complete** | 2026-06-29 | 2026-06-29 |
| Testing | 10 | Coverage, E2E, a11y, security | **Complete** | 2026-06-29 | 2026-06-29 |
| Production | 11 | Deploy, backup, monitoring | Pending | — | — |

---

## Opektra frontend — 2026-10-30

The public frontend is now Opektra’s company website, following the user-selected pearl / petrol software engineering design. Conektra is an independently branded product spotlight; the Products page renders an expandable product collection. Domain: https://www.opektra.com. Confirmed email: admin@opektra.com. No phone number supplied.

Public company pages are frontend-only and use local content. New company portal/CMS work is not in scope. The existing backend/admin source is retained. See `frontend/OPEKTRA.md`, `frontend/AGENTS.md` and `design-qa.md` for current implementation, design constraints and validation. Prior sprint records below describe the legacy founder platform.

## Local Development

```bash
docker compose up -d --build
# Frontend:  http://localhost:13000
# Sitemap:   http://localhost:13000/sitemap.xml
# Robots:    http://localhost:13000/robots.txt
# Staging noindex: NEXT_PUBLIC_NOINDEX=true
```

**Default admin:** `admin@founderos.local` / `admin123` (Docker)

---

## Sprint 10 — Testing (Completed 2026-06-29)

### Tasks

| # | Task | Status | Completed |
|---|------|--------|-----------|
| 10.1 | Backend integration + security tests, pytest-cov | Done | 2026-06-29 |
| 10.2 | Frontend Vitest (seo, admin-nav, utils) | Done | 2026-06-29 |
| 10.3 | Playwright smoke + axe-core a11y | Done | 2026-06-29 |
| 10.4 | CI: Postgres/Redis, coverage, E2E, ZAP | Done | 2026-06-29 |
| 10.5 | Login email fix + data-testid for E2E | Done | 2026-06-29 |

---

## Sprint 11 — Production (Next)

### Docs to read before starting

| Doc | Path |
|-----|------|
| Deployment | `founder-portfolio/docs/13_Deployment/` |
| This file | `context.md` |

---

## Completed Sprint Reports

| Sprint | Report | Completed |
|--------|--------|-----------|
| 0–9 | `founder-portfolio/SPRINT_N_REPORT.md` | 2026-06-29 |
| 10 | `founder-portfolio/SPRINT_10_REPORT.md` | 2026-06-29 |

---

## Key Decisions

| ID | Decision | Date |
|----|----------|------|
| TEST-001 | LoginRequest uses `str` email (supports `.local` dev accounts) | 2026-06-29 |
| TEST-002 | Backend cov fail_under 55 baseline; target 80% post-v1 | 2026-06-29 |
| TEST-003 | E2E smoke: home, products, contact, admin login | 2026-06-29 |
| TEST-004 | axe-core zero critical on P0 pages in CI | 2026-06-29 |

---

## Changelog (context.md)

| Date | Change |
|------|--------|
| 2026-10-30 | Local project review and Docker startup verified; fixed missing newsletter router import, empty-database baseline initialization, and build-time Docker API proxy. See Sprint 10 follow-up notes. Production sprint remains pending. |
| 2026-06-29 | Sprint 10 Testing completed |
| 2026-06-29 | Sprint 9 Optimization completed |
