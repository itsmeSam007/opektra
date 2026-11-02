# Opektra — Company Website

The public frontend has been redesigned as Opektra’s software engineering company website. It includes a frosted glass hero, scroll-driven Conektra product story, expandable product catalogue, About, Blog and direct email Contact pages.

- Local preview: http://localhost:13000
- Company domain: https://www.opektra.com
- Contact: admin@opektra.com
- Legal entity: Opektra Technologies Pvt Ltd · Kolkata, India
- Owner and privacy grievance contact: Soumen Karmakar · admin@opektra.com
- Current frontend notes: [frontend/OPEKTRA.md](frontend/OPEKTRA.md)
- Visual validation: [design-qa.md](design-qa.md)
- Legal content review and outstanding disclosures: [frontend/LEGAL_REVIEW.md](frontend/LEGAL_REVIEW.md)

Public company pages run without backend/CMS data. The existing backend/admin system is retained. The following documentation describes that legacy platform.

---

# Soumen Karmakar — Founder Portfolio Platform

Enterprise-grade founder portfolio platform positioning Soumen Karmakar as an AI SaaS entrepreneur. Built for enterprise customers, investors, strategic partners, and companies interested in licensing or acquiring software products.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | FastAPI, SQLAlchemy, PostgreSQL |
| Infrastructure | Docker, Docker Compose |

## Pages

- **Home** — Hero, flagship product spotlight, stats, testimonials, CTA
- **About** — Founder story, mission, vision
- **Products** — Full product suite listing
- **AI Customer Operations Platform** — Flagship product with interactive feature showcase, architecture diagrams, screenshots, inquiry forms
- **Portfolio** — Software products and platforms
- **Case Studies** — Enterprise deployment results
- **Technology Stack** — Production-grade tech overview
- **Travel Creator** — YouTube travel content integration
- **Blog** — CMS-managed insights
- **Testimonials** — Enterprise leader quotes
- **Open Source** — GitHub repositories and stats
- **Contact** — Contact forms
- **Enterprise Acquisition** — Licensing and acquisition process
- **Legal** — Privacy, Terms, Cookies, Licensing
- **Admin Dashboard** — Full CMS for all content

## Quick Start

See [context.md](context.md) for build phase status and sprint workflow. See [PORTS.md](PORTS.md) for local host port allocation (13000/18000/15432/16379).

### With Docker (recommended)

Local and production use separate Compose files, env files and data volumes.
See [DEPLOYMENT.md](DEPLOYMENT.md) for live deployment and backups.

```bash
./docker-local up -d --build
```

- Frontend: http://localhost:13000
- Backend API: http://localhost:18000
- API Docs: http://localhost:18000/docs
- Admin: http://localhost:13000/admin/login

**Default admin credentials:**
- Email: `admin@founderos.local` (Docker)
- Password: `admin123`

### Local Development

**Backend:**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Start PostgreSQL locally or use Docker for db only
uvicorn app.main:app --reload --port 18000
```

**Frontend:**

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Environment Variables

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:18000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:13000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Backend (`backend/.env`)

```
DATABASE_URL=postgresql://portfolio:portfolio@localhost:15432/portfolio
SECRET_KEY=your-secret-key
GITHUB_TOKEN=ghp_xxx
GITHUB_USERNAME=soumenkarmakar
YOUTUBE_API_KEY=AIza_xxx
YOUTUBE_CHANNEL_ID=UC_xxx
ADMIN_EMAIL=admin@soumenkarmakar.com
ADMIN_PASSWORD=secure-password
```

## Admin CMS

Access the admin panel at `/admin`. Manage:

- Products (including flagship platform)
- Blog posts
- Case studies
- Testimonials
- Portfolio items
- View demo/licensing/acquisition inquiries

## API Integrations

- **GitHub API** — Repositories and contributor stats (with fallback data)
- **YouTube Data API** — Travel creator videos (with fallback data)
- **Google Analytics** — Via `NEXT_PUBLIC_GA_ID`

## SEO

- Open Graph metadata on all pages
- JSON-LD structured data (Organization, SoftwareApplication)
- Dynamic sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- Canonical URLs

## Architecture

```
portfolio/
├── frontend/          # Next.js 15 App Router
│   ├── src/app/       # Pages (public + admin)
│   ├── src/components/# UI, layout, forms, product showcase
│   └── src/lib/       # API client, SEO, constants
├── backend/           # FastAPI CMS
│   └── app/
│       ├── api/       # REST endpoints
│       ├── models/    # SQLAlchemy models
│       └── schemas/   # Pydantic schemas
└── docker-compose.yml
```

## License

Proprietary. © 2026 Opektra Technologies Pvt Ltd. All rights reserved.
Third-party and open-source dependencies remain subject to their respective licences.
