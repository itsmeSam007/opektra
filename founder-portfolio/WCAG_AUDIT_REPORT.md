# WCAG 2.1 AA Audit Report — Sprint 10

| Field | Value |
|-------|-------|
| **Date** | 2026-06-29 |
| **Scope** | P0 public pages + admin login |
| **Tool** | axe-core via `@axe-core/playwright` |
| **Standard** | WCAG 2.1 Level AA |

---

## Automated Results (P0 Pages)

| Page | Critical | Serious | Status |
|------|----------|---------|--------|
| `/` | 0 | — | Pass |
| `/products` | 0 | — | Pass |
| `/contact` | 0 | — | Pass |
| `/admin/login` | 0 | — | Pass |

**Gate:** Zero critical violations on P0 pages (FR-A11Y-001).

---

## CI Integration

- **Job:** `e2e` workflow → `e2e/tests/a11y.spec.ts`
- **Tags:** `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`
- **Run locally:** `docker compose up -d && cd e2e && npm install && npm run test:a11y`

---

## Manual Checklist (Quarterly)

- [ ] Keyboard-only navigation on home, products, contact, admin dashboard
- [ ] VoiceOver (macOS) heading structure on blog and case study detail
- [ ] NVDA (Windows) form error announcements on contact and inquiry forms
- [ ] `prefers-reduced-motion` — verify hero animations respect OS setting
- [ ] Focus trap on admin dialogs (media picker, delete confirmations)
- [ ] Color contrast spot-check on accent buttons and muted text

---

## Known Gaps

| Item | Severity | Sprint |
|------|----------|--------|
| Third-party YouTube embed internals | N/A (out of scope) | — |
| Full admin CMS keyboard audit | P1 | Post-v1 |
| PDF accessibility | Out of scope | — |

---

## Sign-off

Automated WCAG 2.1 AA gate **passed** for P0 pages. Manual quarterly audit scheduled per NFR-A11Y-002.
