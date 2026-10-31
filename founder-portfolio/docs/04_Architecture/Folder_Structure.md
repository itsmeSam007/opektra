# Folder Structure

| Field | Value |
|-------|-------|
| **Document ID** | ARCH-004 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Status** | Approved |
| **Last Updated** | 2026-06-29 |
| **Related** | [Frontend Architecture](./Frontend_Architecture.md) · [Backend Architecture](./Backend_Architecture.md) |

---

## Purpose

Document the canonical repository and application folder structure for FounderOS v1.0, enabling consistent navigation for engineers, AI agents, and white-label implementers.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Documentation repo (`founder-portfolio/`) layout | Third-party `node_modules` |
| Application repos (`frontend/`, `backend/`) layout | Build artifacts (`.next`, `__pycache__`) |
| Naming conventions and file placement rules | Git hooks configuration |

## Business Context

A predictable folder structure reduces onboarding time and enables modular licensing — each module's code and docs live in identifiable locations. White-label deployments fork the application repos while referencing the documentation suite.

## Goals

1. **Discoverability** — Any engineer finds code/docs in &lt; 2 minutes.
2. **Separation** — Docs, frontend, backend are distinct top-level concerns.
3. **Convention over configuration** — Next.js App Router and FastAPI patterns followed strictly.
4. **Module alignment** — Folder names map to feature modules in `06_Modules`.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-FS-001 | Documentation lives under `founder-portfolio/docs/` | P0 |
| FR-FS-002 | Frontend uses Next.js App Router `app/` directory | P0 |
| FR-FS-003 | Backend follows FastAPI `app/` package layout | P0 |
| FR-FS-004 | Shared components in `frontend/src/components/` | P0 |
| FR-FS-005 | API client and utilities in `frontend/src/lib/` | P0 |
| FR-FS-006 | Docker Compose at repository root | P0 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-FS-001 | Max nesting depth (components) | 3 levels |
| NFR-FS-002 | File naming | kebab-case for files, PascalCase for React components |
| NFR-FS-003 | Python modules | snake_case |
| NFR-FS-004 | Documentation numbering | `NN_Category/` prefix |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-FS-001 | New engineer | a folder map | I navigate the codebase quickly |
| US-FS-002 | AI agent | explicit placement rules | generated code lands in correct dirs |
| US-FS-003 | White-label implementer | clear separation of config vs. code | I customize without breaking structure |

## UX Requirements

Folder structure supports **developer experience**:

- Co-locate page-specific components near routes when not reused.
- Shared primitives in `components/ui/` (shadcn).
- One file per route (`page.tsx`) in App Router.

## Technical Considerations

### Repository Root

```
portfolio/                              # Monorepo root
├── docker-compose.yml                  # Local dev orchestration
├── founder-portfolio/                  # Documentation suite (this repo)
│   ├── README.md
│   ├── PRODUCT_REQUIREMENTS.md
│   └── docs/
│       ├── 00_Project/
│       ├── 01_Brand/
│       ├── 02_UX/
│       ├── 03_Design_System/
│       ├── 04_Architecture/            # ← You are here
│       ├── 05_Pages/
│       ├── 06_Modules/
│       ├── 07_Admin/
│       ├── 08_API/
│       ├── 09_Database/
│       ├── 10_SEO/
│       ├── 11_Security/
│       ├── 12_Testing/
│       ├── 13_Deployment/
│       └── 14_Future/
├── frontend/                           # Next.js 15 application
└── backend/                            # FastAPI application
```

### Frontend Structure

```
frontend/
├── Dockerfile
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── .env.local.example
└── src/
    ├── app/                            # Next.js App Router
    │   ├── layout.tsx                  # Root layout
    │   ├── page.tsx                    # Home (/)
    │   ├── globals.css
    │   ├── about/page.tsx
    │   ├── products/
    │   │   ├── page.tsx
    │   │   └── [slug]/page.tsx
    │   ├── portfolio/page.tsx
    │   ├── case-studies/
    │   │   ├── page.tsx
    │   │   └── [slug]/page.tsx
    │   ├── blog/
    │   │   ├── page.tsx
    │   │   └── [slug]/page.tsx
    │   ├── travel/page.tsx
    │   ├── testimonials/page.tsx
    │   ├── open-source/page.tsx
    │   ├── contact/page.tsx
    │   ├── enterprise/page.tsx
    │   ├── technology/page.tsx
    │   ├── legal/
    │   │   ├── privacy/page.tsx
    │   │   ├── terms/page.tsx
    │   │   ├── cookies/page.tsx
    │   │   └── licensing/page.tsx
    │   └── not-found.tsx               # 404
    ├── components/
    │   ├── layout/
    │   │   ├── header.tsx
    │   │   ├── footer.tsx
    │   │   └── section.tsx
    │   ├── ui/                         # shadcn/ui primitives
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   └── ...
    │   ├── forms/
    │   │   ├── contact-form.tsx
    │   │   └── inquiry-form.tsx
    │   ├── seo/
    │   │   └── analytics.tsx
    │   ├── motion/
    │   │   └── fade-in.tsx
    │   └── product/
    │       └── product-showcase.tsx
    └── lib/
        ├── api.ts                      # API client
        ├── seo.ts                      # Metadata helpers
        ├── constants.ts                # Site config, nav
        └── utils.ts                    # cn() helper
```

### Backend Structure

```
backend/
├── Dockerfile
├── requirements.txt
└── app/
    ├── main.py                         # App entry, routers, seed
    ├── core/
    │   ├── config.py                   # Pydantic Settings
    │   ├── database.py                 # Engine, SessionLocal, Base
    │   └── security.py                 # JWT, password hashing
    ├── api/
    │   ├── deps.py                     # Dependency injection
    │   └── routes/
    │       ├── products.py             # Auth + products CRUD
    │       ├── blog.py
    │       ├── case_studies.py
    │       ├── portfolio.py
    │       ├── contact.py              # Testimonials, contact, inquiries
    │       └── integrations.py         # GitHub, YouTube
    ├── models/
    │   └── __init__.py                 # All SQLAlchemy models
    └── schemas/
        └── __init__.py                 # All Pydantic schemas
```

### Documentation Numbering Convention

| Prefix | Category | Example |
|--------|----------|---------|
| `00_` | Project | Vision, personas, roadmap |
| `01_` | Brand | Guidelines, logo usage |
| `02_` | UX | IA, navigation, flows |
| `03_` | Design System | Tokens, components |
| `04_` | Architecture | System, API, DB |
| `05_` | Pages | Per-page specifications |
| `06_` | Modules | Feature module specs |
| `07_` | Admin | Admin panel specs |
| `08_` | API | Endpoint contracts |
| `09_` | Database | Schema, ERD |
| `10_` | SEO | Technical SEO |
| `11_` | Security | Controls, compliance |
| `12_` | Testing | QA strategy |
| `13_` | Deployment | DevOps guides |
| `14_` | Future | Roadmap, extensibility |

### Route-to-Page Doc Mapping

| App Route | Page Doc |
|-----------|----------|
| `/` | [Home.md](../05_Pages/Home.md) |
| `/about` | [About.md](../05_Pages/About.md) |
| `/products` | [Products.md](../05_Pages/Products.md) |
| `/products/[slug]` | [Product_Details.md](../05_Pages/Product_Details.md) |
| `/portfolio` | [Portfolio.md](../05_Pages/Portfolio.md) |
| `/case-studies` | [Case_Studies.md](../05_Pages/Case_Studies.md) |
| `/blog` | [Blog.md](../05_Pages/Blog.md) |
| `/travel` | [Travel.md](../05_Pages/Travel.md) |
| `/open-source` | [Open_Source.md](../05_Pages/Open_Source.md) |
| `/testimonials` | [Testimonials.md](../05_Pages/Testimonials.md) |
| `/contact` | [Contact.md](../05_Pages/Contact.md) |
| `/enterprise` | [Enterprise.md](../05_Pages/Enterprise.md) |
| `/legal/privacy` | [Privacy.md](../05_Pages/Privacy.md) |
| `/legal/terms` | [Terms.md](../05_Pages/Terms.md) |
| `/legal/cookies` | [Cookie.md](../05_Pages/Cookie.md) |
| `not-found` | [404.md](../05_Pages/404.md) |

## Security Considerations

- `.env`, `.env.local` — never committed; listed in `.gitignore`.
- `SECRET_KEY`, API keys — backend environment only.
- Admin credentials — seed defaults for dev only; override in production.

## Acceptance Criteria

- [ ] All folders documented match actual or planned repository layout.
- [ ] Route-to-doc mapping is complete for v1.0 pages.
- [ ] Naming conventions documented and enforced in code review.
- [ ] New modules add folders in both `06_Modules` docs and application code.

## Future Enhancements

| Enhancement | Notes |
|-------------|-------|
| `packages/shared-types` monorepo package | Shared TS/Python types |
| `infra/` Terraform modules | IaC for VPS provisioning |
| `e2e/` Playwright tests | Top-level test directory |

## Open Questions

| ID | Question | Owner | Status |
|----|----------|-------|--------|
| OQ-FS-001 | Monorepo tool (Turborepo/Nx) or keep flat structure? | Architecture | Open |
| OQ-FS-002 | Separate `media/` page route vs. module-only? | Product | Open |

---

## Related Documents

- [Frontend Architecture](./Frontend_Architecture.md)
- [Backend Architecture](./Backend_Architecture.md)
- [System Architecture](./System_Architecture.md)
- [05_Pages](../05_Pages/Home.md)
