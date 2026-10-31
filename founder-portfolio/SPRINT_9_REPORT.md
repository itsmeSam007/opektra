# Sprint 9 Report — Optimization

| Field | Value |
|-------|-------|
| **Sprint** | 9 — Optimization |
| **Status** | Complete (foundation) |
| **Started** | 2026-06-29 |
| **Completed** | 2026-06-29 |
| **Docs** | `04_Architecture/Caching_Strategy.md`, `10_SEO/`, `13_Deployment/Cloudflare.md` |

---

## Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | Performance optimization pass | Done |
| 2 | SEO hardening (sitemap, robots, JSON-LD, canonical) | Done |
| 3 | CDN and cache tuning | Done |
| 4 | Image optimization pipeline | Done (WebP on upload) |

---

## Deliverables

### Backend

| Item | Path |
|------|------|
| Cache TTL constants | `app/core/cache_ttl.py` |
| Blog Redis cache (list + slug) | `app/services/blog.py`, `app/api/routes/blog.py` |
| Search query cache (60s) | `app/api/routes/search.py` |
| Public settings cache (300s) | `app/api/routes/settings.py` |
| Hot endpoint TTL 300s | `app/services/{products,travel,portfolio,case_studies,galleries}.py` |
| WebP conversion on media upload | `app/services/images.py`, Pillow in `requirements.txt` |
| Tests | `tests/test_optimization.py` |

### Frontend

| Item | Path |
|------|------|
| Dynamic sitemap (static + entities) | `app/sitemap.ts` |
| Staging noindex robots | `app/robots.ts`, `NEXT_PUBLIC_NOINDEX` |
| JSON-LD: BlogPosting, Breadcrumb, WebSite, Review | `lib/seo.ts`, `components/seo/json-ld.tsx` |
| Blog + product + testimonials structured data | page updates |
| Enhanced 404 with search link | `app/not-found.tsx` |
| Next.js perf: font swap, optimizePackageImports, AVIF/WebP | `layout.tsx`, `next.config.ts` |
| ISR revalidate home + generateStaticParams | `page.tsx`, `products/[slug]`, `blog/[slug]` |
| Cloudflare cache rules reference | `deploy/cloudflare-cache-rules.json` |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Sitemap includes dynamic entities; no admin URLs | Pass |
| Canonical URLs via `createMetadata` alternates | Pass |
| JSON-LD on products, blog, case studies, testimonials | Pass |
| Redis cache on blog, search, public settings | Pass |
| WebP conversion on image upload | Pass |
| 404 page | Pass |
| Staging noindex via env | Pass |
| Lighthouse ≥ 90 / SEO ≥ 95 | Manual verify recommended |

---

## Verification

```bash
docker compose up -d --build
docker compose exec backend sh -c "cd /app && PYTHONPATH=/app pytest tests/test_optimization.py -q"
docker compose exec frontend npm run build && docker compose restart frontend

curl http://localhost:13000/sitemap.xml
curl http://localhost:13000/robots.txt
curl "http://localhost:18000/api/v1/search?q=customer"
```

---

## Known Gaps / Carry-Forward

| Gap | Notes |
|-----|-------|
| Lighthouse CI not automated | Add in Sprint 10 |
| k6 load test for API p95 | Deferred to Sprint 10 |
| Sitemap on-demand revalidation webhook | Manual rebuild for now |
| R2 media CDN | Cloudflare doc reference only |

---

## Next Sprint

**Sprint 10 — Testing:** coverage targets, E2E, a11y audit, security review.
