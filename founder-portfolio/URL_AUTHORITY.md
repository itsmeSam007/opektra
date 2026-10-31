# URL Authority — FounderOS v1.0

| Field | Value |
|-------|-------|
| **Document ID** | AUTH-URL-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Status** | **LOCKED** — Authoritative route reference |
| **Last Updated** | 2026-06-29 |
| **Owner** | Product & Architecture |

---

## Purpose

This document is the **single source of truth** for all public and admin URL paths in FounderOS v1.0. When any specification conflicts with this document, **this document wins**. Update this file first, then propagate changes to PROJECT_SCOPE, Sitemap, Navigation, and page specs.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| All v1.0 public routes | API endpoint paths (see `08_API/`) |
| Admin panel routes | Multi-tenant subdomain routing (v2.0) |
| Legal page paths | Third-party embed URLs |
| Dynamic slug patterns | Locale prefixes (v1.5) |

## Business Context

Inconsistent URLs break SEO canonicals, navigation, sitemap generation, and analytics. A single authority prevents parallel implementation teams from building incompatible routing.

## Goals

1. Eliminate route conflicts across documentation.
2. Enable programmatic sitemap and robots.txt generation.
3. Support white-label tenants with identical URL skeleton.

## Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-URL-001 | All public pages SHALL use routes defined in this document |
| FR-URL-002 | Legal pages SHALL use `/legal/*` prefix |
| FR-URL-003 | Admin routes SHALL be prefixed `/admin` |
| FR-URL-004 | Media hub page SHALL be `/media` (not `/technology`) |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-URL-001 | URL max length | 2048 characters |
| NFR-URL-002 | Slug charset | `a-z0-9-` only |

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-URL-001 | As a developer, I have one route table | P0 |
| US-URL-002 | As SEO lead, canonicals match this doc | P0 |

## UX Requirements

- Navigation labels may differ from URL slugs (e.g., "Enterprise" → `/enterprise`).
- Breadcrumbs derive from this hierarchy.

## Technical Considerations

### Public Routes (Static)

| Page | Route | Page Spec |
|------|-------|-----------|
| Home | `/` | [Home.md](docs/05_Pages/Home.md) |
| About | `/about` | [About.md](docs/05_Pages/About.md) |
| Products | `/products` | [Products.md](docs/05_Pages/Products.md) |
| Portfolio | `/portfolio` | [Portfolio.md](docs/05_Pages/Portfolio.md) |
| Case Studies | `/case-studies` | [Case_Studies.md](docs/05_Pages/Case_Studies.md) |
| Blog | `/blog` | [Blog.md](docs/05_Pages/Blog.md) |
| Travel | `/travel` | [Travel.md](docs/05_Pages/Travel.md) |
| Media | `/media` | [Media.md](docs/05_Pages/Media.md) |
| Open Source | `/open-source` | [Open_Source.md](docs/05_Pages/Open_Source.md) |
| Testimonials | `/testimonials` | [Testimonials.md](docs/05_Pages/Testimonials.md) |
| Contact | `/contact` | [Contact.md](docs/05_Pages/Contact.md) |
| Enterprise | `/enterprise` | [Enterprise.md](docs/05_Pages/Enterprise.md) |
| Acquisition | `/acquisition` | [Acquisition.md](docs/05_Pages/Acquisition.md) |
| Privacy | `/legal/privacy` | [Privacy.md](docs/05_Pages/Privacy.md) |
| Terms | `/legal/terms` | [Terms.md](docs/05_Pages/Terms.md) |
| Cookies | `/legal/cookies` | [Cookie.md](docs/05_Pages/Cookie.md) |
| Licensing | `/legal/licensing` | [Licensing.md](docs/05_Pages/Licensing.md) |
| Search | `/search` | Search module |
| 404 | `/not-found` | [404.md](docs/05_Pages/404.md) |

### Dynamic Routes

| Pattern | Source |
|---------|--------|
| `/products/[slug]` | Product Manager |
| `/case-studies/[slug]` | Portfolio Manager |
| `/blog/[slug]` | Blog Manager |
| `/travel/[slug]` | Travel Manager |
| `/blog/category/[slug]` | Blog categories |

### Admin Routes

| Route | Section |
|-------|---------|
| `/admin` | Redirect to login or dashboard |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard |
| `/admin/users` | Users |
| `/admin/roles` | Roles |
| `/admin/permissions` | Permissions |
| `/admin/content/*` | CMS |
| `/admin/media` | Media |
| `/admin/seo` | SEO |
| `/admin/settings` | Settings |
| `/admin/logs` | Logs |
| `/admin/analytics` | Analytics |
| `/admin/monitoring` | Monitoring |

### API Inventory (v1.0)

| API Document | Base Path |
|--------------|-----------|
| Authentication_API | `/api/v1/auth` |
| Users_API | `/api/v1/users` |
| CMS_API | `/api/v1/cms` |
| Products_API | `/api/v1/products` |
| Portfolio_API | `/api/v1/portfolio` |
| Blog_API | `/api/v1/blog` |
| Travel_API | `/api/v1/travel` |
| Gallery_API | `/api/v1/galleries` |
| Media_API | `/api/v1/media` |
| GitHub_API | `/api/v1/integrations/github` |
| YouTube_API | `/api/v1/integrations/youtube` |
| Contact_API | `/api/v1/contact` |
| Newsletter_API | `/api/v1/newsletter` |
| Search_API | `/api/v1/search` |
| SEO_API | `/api/v1/seo` |
| Analytics_API | `/api/v1/analytics` |
| Settings_API | `/api/v1/settings` |
| Notifications_API | `/api/v1/notifications` |

**Health check:** `GET /api/v1/health`

### Local Development Ports (Host)

Dedicated ports avoid conflicts with other projects. See [PORTS.md](../../PORTS.md).

| Service | Host port | URL |
|---------|-----------|-----|
| Frontend | 13000 | http://localhost:13000 |
| API | 18000 | http://localhost:18000 |
| PostgreSQL | 15432 | localhost:15432 |
| Redis | 16379 | localhost:16379 |

## Security Considerations

- Admin routes excluded from `sitemap.xml` and disallowed in `robots.txt`.
- Acquisition page may use `noindex` per tenant setting.

## Acceptance Criteria

- [ ] PROJECT_SCOPE route table matches this document
- [ ] Sitemap.md matches this document
- [ ] All page specs declare routes from this document
- [ ] Zero route conflicts in documentation scan

## Future Enhancements

- Locale prefix `/[locale]/...` in v1.5
- Custom domain mapping per tenant in v1.5

## Open Questions

| ID | Question | Decision |
|----|----------|----------|
| OQ-URL-01 | Dedicated `/search` page vs header-only | **Dedicated `/search`** |

## Dependencies

- [PROJECT_SCOPE.md](PROJECT_SCOPE.md)
- [docs/02_UX/Sitemap.md](docs/02_UX/Sitemap.md)
- [docs/02_UX/Navigation.md](docs/02_UX/Navigation.md)

## Glossary

| Term | Definition |
|------|------------|
| Slug | URL-safe identifier for dynamic content |
| Canonical | Preferred URL for SEO deduplication |
