# Sprint 8 Report — Enterprise

| Field | Value |
|-------|-------|
| **Sprint** | 8 — Enterprise |
| **Status** | Complete (foundation) |
| **Started** | 2026-06-29 |
| **Completed** | 2026-06-29 |
| **Docs** | `05_Pages/Enterprise.md`, `Acquisition.md`, `Contact.md`, `08_API/Contact_API.md`, `06_Modules/Newsletter.md`, `08_API/Search_API.md` |

---

## Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | Enterprise and acquisition conversion pages | Done |
| 2 | Contact form with email delivery | Done (SMTP + dev log fallback) |
| 3 | Newsletter signup | Done (double opt-in) |
| 4 | Global site search | Done |
| 5 | Testimonials page | Done (existing, CMS-managed) |

---

## Deliverables

### Backend

| Item | Path |
|------|------|
| Migration: inquiry NDA + newsletter subscribers | `alembic/versions/20260629_0007_enterprise.py` |
| Contact/inquiry: honeypot, rate limit, email notify | `app/api/routes/contact.py`, `app/services/email.py` |
| Form rate limiting | `app/core/rate_limit.py` |
| Search API | `app/api/routes/search.py` |
| Newsletter API | `app/api/routes/newsletter.py` |
| RBAC `contact:read`, `contact:write`, `inquiries:write` | `app/core/rbac.py` |
| SMTP config | `app/core/config.py`, `docker-compose.yml` |
| Tests | `tests/test_enterprise.py` |

### Frontend

| Item | Path |
|------|------|
| `/acquisition` with NDA form | `app/acquisition/page.tsx`, `components/forms/acquisition-form.tsx` |
| `/enterprise` link to acquisition | `app/enterprise/page.tsx` |
| `/search` global search UI | `app/search/page.tsx` |
| Header search link | `components/layout/header.tsx` |
| Newsletter on home + footer | `components/forms/newsletter-signup.tsx` |
| Honeypot on contact/inquiry forms | `components/forms/contact-form.tsx`, `inquiry-form.tsx` |
| Newsletter confirm page | `app/newsletter/confirm/page.tsx` |
| Admin contact inbox | `app/admin/contacts/page.tsx` |
| Admin inquiries: read/acquisition filters | `app/admin/inquiries/page.tsx` |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Contact form delivers email (SMTP or dev log) | Pass |
| Acquisition inquiry flagged in admin | Pass (`is_acquisition`) |
| NDA acknowledgment on acquisition form | Pass |
| Global search across products, blog, portfolio | Pass |
| Testimonials CMS-managed with ordering | Pass (existing) |
| Rate limiting on forms | Pass (10/hour/IP) |
| Honeypot spam protection | Pass |

---

## Verification

```bash
docker compose up -d --build
docker compose exec backend sh -c "cd /app && PYTHONPATH=/app pytest tests/test_enterprise.py -q"
docker compose exec frontend npm run build && docker compose restart frontend

curl "http://localhost:18000/api/v1/search?q=customer"
curl -X POST http://localhost:18000/api/v1/newsletter/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","consent":true}'

open http://localhost:13000/acquisition
open http://localhost:13000/search
open http://localhost:13000/testimonials
```

---

## Known Gaps / Carry-Forward

| Gap | Notes |
|-----|-------|
| SMTP not configured in dev | Emails logged to backend stdout |
| Newsletter provider integration (Resend/SendGrid) | Uses SMTP abstraction |
| CSV export for contacts/inquiries | Deferred |
| reCAPTCHA | Deferred to v1.1 |

---

## Next Sprint

**Sprint 9 — Optimization:** Lighthouse, sitemap hardening, JSON-LD, CDN, image WebP pipeline.
