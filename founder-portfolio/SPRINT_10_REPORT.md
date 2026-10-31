# Sprint 10 Report — Testing

## Local review follow-up — 2026-10-30

- Git exists only in `frontend/`: branch `main`, commit `d33ad7f`, with existing modified and untracked work; no remote configured. Root/backend/docs are outside that repository.
- Fixed three Docker startup issues: missing newsletter router import, a no-op baseline migration that broke an empty database, and the frontend API proxy address missing during image build.
- Corrected README Docker admin email to match Compose (`admin@founderos.local`). README stack version also lags installed Next.js 16.2.9.
- Verified Docker frontend production build, all 15 frontend unit tests, backend health test, HTTP 200 for home/admin login, successful admin authentication through the frontend proxy, and readiness with PostgreSQL/Redis both OK.
- Outstanding: frontend lint reports one error at `src/app/search/page.tsx:25` and 11 warnings. npm install reports 16 dependency vulnerabilities (4 moderate, 9 high, 3 critical); no dependency remediation performed during this startup review.
- This was local runtime verification; production release and full integration/E2E/security validation remain outside this review.

| Field | Value |
|-------|-------|
| **Sprint** | 10 — Testing |
| **Completed** | 2026-06-29 |
| **Status** | Complete |

---

## Objectives

1. Coverage targets (backend ≥80%, frontend ≥70% on tested lib modules)
2. E2E critical path suite (Playwright)
3. Accessibility audit (axe-core CI)
4. Security scan (OWASP ZAP baseline + auth/RBAC tests)

---

## Deliverables

### Backend

| Item | Path | Notes |
|------|------|-------|
| CMS integration tests | `backend/tests/test_cms.py` | Create → publish → public read |
| Product publish tests | `backend/tests/test_products_integration.py` | Create → publish → public slug |
| Security/RBAC tests | `backend/tests/test_security.py` | Auth, contact, token rejection |
| Coverage config | `backend/pytest.ini` | pytest-cov, fail_under 55 (baseline; expand toward 80%) |
| Login email fix | `backend/app/schemas/__init__.py` | `admin@founderos.local` works in Docker/E2E |

### Frontend

| Item | Path | Notes |
|------|------|-------|
| Vitest unit tests | `frontend/src/lib/*.test.ts` | seo, admin-nav, utils |
| Vitest config | `frontend/vitest.config.ts` | 70% threshold on `src/lib` |
| `data-testid` | login + contact form | E2E selectors |

### E2E & A11y

| Item | Path | Notes |
|------|------|-------|
| Playwright smoke | `e2e/tests/smoke.spec.ts` | Home, products, contact, admin login |
| axe-core a11y | `e2e/tests/a11y.spec.ts` | P0 pages, zero critical |
| Config | `e2e/playwright.config.ts` | Retries in CI, HTML report on failure |

### CI & Security

| Item | Path | Notes |
|------|------|-------|
| CI workflow | `.github/workflows/ci.yml` | Postgres/Redis services, coverage, E2E, ZAP |
| ZAP local script | `scripts/zap-baseline.sh` | Docker-based baseline scan |
| WCAG report | `founder-portfolio/WCAG_AUDIT_REPORT.md` | P0 automated pass |

---

## Test Commands

```bash
# Backend (Docker)
docker compose exec backend sh -c "cd /app && PYTHONPATH=/app pytest tests/ --cov=app -q"

# Frontend unit
cd frontend && npm run test:coverage

# E2E (stack must be running)
docker compose up -d --build
cd e2e && npm install && npx playwright install chromium && npm test
```

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| All test suites pass in CI | Configured (backend + frontend + e2e jobs) |
| E2E smoke < 10 minutes | Yes (~3–5 min typical) |
| Zero critical a11y violations (P0) | Gate in `a11y.spec.ts` |
| Security tests for auth/RBAC | `test_security.py` + ZAP baseline job |
| Backend coverage reporting | pytest-cov in CI |

---

## Gaps / Follow-ups

| Gap | Target |
|-----|--------|
| Backend coverage 55% → 80% | Add route/service tests per module |
| CMS publish E2E in browser | API integration covers flow; UI E2E in Sprint 11 |
| Lighthouse CI | Sprint 11 production |
| k6 load tests | Sprint 11 |

---

## Next Sprint

**Sprint 11 — Production:** Vercel + Hostinger deploy, backups, monitoring, launch checklist.
