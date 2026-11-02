import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.admin_dashboard import router as admin_dashboard_router
from app.api.routes.search import router as search_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.logs import router as logs_router
from app.api.routes.newsletter import router as newsletter_router
from app.api.routes.media import router as media_router
from app.api.routes.roles import router as roles_router
from app.api.routes.users import router as users_router
from app.api.routes.galleries import router as galleries_router
from app.api.routes.settings import router as settings_router
from app.api.routes.travel import router as travel_router
from app.api.routes.blog import router as blog_router
from app.api.routes.case_studies import router as case_studies_router
from app.api.routes.contact import contact_router, inquiry_router
from app.api.routes.contact import router as testimonials_router
from app.api.routes.cms import router as cms_router
from app.api.routes.health import router as health_router
from app.api.routes.integrations import router as integrations_router
from app.api.routes.portfolio import router as portfolio_router
from app.api.routes.auth import router as auth_router
from app.api.routes.products import products_router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.migrations import run_migrations
from app.core.rbac import PERMISSIONS, ROLE_DEFINITIONS
from app.core.security import get_password_hash
from app.models import (
    BlogPost,
    CaseStudy,
    GalleryAlbum,
    CMSBlock,
    CMSPage,
    Permission,
    PortfolioItem,
    Product,
    Role,
    SiteSettings,
    Testimonial,
    TravelEntry,
    User,
)

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(products_router, prefix=settings.API_V1_PREFIX)
app.include_router(blog_router, prefix=settings.API_V1_PREFIX)
app.include_router(case_studies_router, prefix=settings.API_V1_PREFIX)
app.include_router(testimonials_router, prefix=settings.API_V1_PREFIX)
app.include_router(contact_router, prefix=settings.API_V1_PREFIX)
app.include_router(inquiry_router, prefix=settings.API_V1_PREFIX)
app.include_router(portfolio_router, prefix=settings.API_V1_PREFIX)
app.include_router(integrations_router, prefix=settings.API_V1_PREFIX)
app.include_router(cms_router, prefix=settings.API_V1_PREFIX)
app.include_router(travel_router, prefix=settings.API_V1_PREFIX)
app.include_router(galleries_router, prefix=settings.API_V1_PREFIX)
app.include_router(settings_router, prefix=settings.API_V1_PREFIX)
app.include_router(users_router, prefix=settings.API_V1_PREFIX)
app.include_router(roles_router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics_router, prefix=settings.API_V1_PREFIX)
app.include_router(logs_router, prefix=settings.API_V1_PREFIX)
app.include_router(media_router, prefix=settings.API_V1_PREFIX)
app.include_router(admin_dashboard_router, prefix=settings.API_V1_PREFIX)
app.include_router(search_router, prefix=settings.API_V1_PREFIX)
app.include_router(newsletter_router, prefix=settings.API_V1_PREFIX)
app.include_router(health_router, prefix=settings.API_V1_PREFIX)


def seed_rbac(db):
    permission_by_code: dict[str, Permission] = {}
    for code, description in PERMISSIONS:
        perm = db.query(Permission).filter(Permission.code == code).first()
        if not perm:
            perm = Permission(code=code, description=description)
            db.add(perm)
            db.flush()
        permission_by_code[code] = perm

    role_by_name: dict[str, Role] = {}
    for name, definition in ROLE_DEFINITIONS.items():
        role = db.query(Role).filter(Role.name == name).first()
        if not role:
            role = Role(name=name, description=definition["description"])
            db.add(role)
            db.flush()
        role.permissions = [permission_by_code[code] for code in definition["permissions"] if code in permission_by_code]
        role_by_name[name] = role

    db.flush()
    return role_by_name


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        roles = seed_rbac(db)

        admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                role_id=roles["super_admin"].id,
                is_active=True,
            )
            db.add(admin)
        elif admin.role_id is None:
            admin.role_id = roles["super_admin"].id

        # Production needs the administrator and permissions, not the legacy
        # portfolio examples used to populate a developer's empty database.
        if settings.APP_ENV == "production":
            db.commit()
            return

        if not db.query(Product).first():
            flagship_features = [
                {
                    "title": "AI-Powered Ticket Routing",
                    "description": "Intelligent classification and routing of customer inquiries with 94% accuracy.",
                    "icon": "route",
                },
                {
                    "title": "Omnichannel Inbox",
                    "description": "Unified view across email, chat, social, and voice channels.",
                    "icon": "inbox",
                },
                {
                    "title": "Knowledge Base AI",
                    "description": "RAG-powered knowledge retrieval with automatic article suggestions.",
                    "icon": "brain",
                },
                {
                    "title": "Workflow Automation",
                    "description": "Visual workflow builder for complex customer operation processes.",
                    "icon": "workflow",
                },
                {
                    "title": "Analytics & Insights",
                    "description": "Real-time dashboards with predictive CSAT and churn indicators.",
                    "icon": "chart",
                },
                {
                    "title": "Enterprise SSO & RBAC",
                    "description": "SAML, OIDC, and granular role-based access control.",
                    "icon": "shield",
                },
            ]
            db.add(
                Product(
                    slug="ai-customer-operations",
                    name="AI Customer Operations Platform",
                    tagline="Enterprise-grade AI for customer support, success, and operations at scale.",
                    description=(
                        "A comprehensive AI-powered platform that transforms how enterprises manage "
                        "customer operations. From intelligent ticket routing to predictive analytics, "
                        "our platform reduces resolution time by 60% while improving customer satisfaction."
                    ),
                    features=json.dumps(flagship_features),
                    domains=json.dumps(
                        [
                            "Financial Services",
                            "Healthcare",
                            "E-Commerce",
                            "SaaS",
                            "Telecommunications",
                            "Insurance",
                        ]
                    ),
                    architecture=json.dumps(
                        {
                            "layers": [
                                {"name": "Presentation", "components": ["Next.js Dashboard", "Mobile SDK", "Embed Widget"]},
                                {"name": "API Gateway", "components": ["Kong", "Rate Limiting", "Auth"]},
                                {"name": "Services", "components": ["Ticket Service", "AI Engine", "Workflow Engine", "Analytics"]},
                                {"name": "Data", "components": ["PostgreSQL", "Redis", "Elasticsearch", "S3"]},
                                {"name": "AI/ML", "components": ["LLM Gateway", "Vector DB", "Model Registry"]},
                            ]
                        }
                    ),
                    screenshots=json.dumps(
                        [
                            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200",
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
                        ]
                    ),
                    is_flagship=True,
                    sort_order=0,
                )
            )
            db.add(
                Product(
                    slug="workflow-automation-suite",
                    name="Workflow Automation Suite",
                    tagline="Visual process automation for enterprise operations.",
                    description="Drag-and-drop workflow builder with 200+ integrations.",
                    features=json.dumps([]),
                    domains=json.dumps(["Operations", "HR", "Finance"]),
                    architecture=json.dumps({}),
                    screenshots=json.dumps([]),
                    sort_order=1,
                )
            )

        if not db.query(Testimonial).first():
            testimonials = [
                Testimonial(
                    name="Sarah Chen",
                    role="VP of Customer Success",
                    company="TechFlow Inc.",
                    content="The AI Customer Operations Platform reduced our average resolution time by 58%. The ROI was evident within the first quarter.",
                    sort_order=0,
                ),
                Testimonial(
                    name="Marcus Williams",
                    role="CTO",
                    company="GlobalServe",
                    content="We evaluated six vendors. Soumen's platform stood out for its architecture, extensibility, and the team's deep AI expertise.",
                    sort_order=1,
                ),
                Testimonial(
                    name="Elena Rodriguez",
                    role="Head of Operations",
                    company="FinanceHub",
                    content="Licensing this platform accelerated our digital transformation by 18 months. Enterprise-grade from day one.",
                    sort_order=2,
                ),
            ]
            db.add_all(testimonials)

        if not db.query(CaseStudy).first():
            db.add(
                CaseStudy(
                    slug="techflow-customer-ops",
                    title="TechFlow Reduces Support Costs by 45%",
                    client="TechFlow Inc.",
                    industry="SaaS",
                    summary="How TechFlow transformed their customer operations with AI-powered automation.",
                    challenge="TechFlow's support team was overwhelmed with 50,000+ monthly tickets across 12 channels.",
                    solution="Deployed the AI Customer Operations Platform with custom workflow automation and knowledge base AI.",
                    results="45% cost reduction, 58% faster resolution, 23% CSAT improvement in 6 months.",
                    metrics=json.dumps(
                        [
                            {"label": "Cost Reduction", "value": "45%"},
                            {"label": "Resolution Time", "value": "-58%"},
                            {"label": "CSAT Improvement", "value": "+23%"},
                        ]
                    ),
                    cover_image="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200",
                    related_product_slug="ai-customer-operations",
                    gallery_images=json.dumps(
                        [
                            {
                                "url": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200",
                                "alt": "TechFlow support team dashboard",
                            },
                            {
                                "url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
                                "alt": "Analytics overview after AI deployment",
                            },
                            {
                                "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
                                "alt": "Workflow automation builder in production",
                            },
                        ]
                    ),
                )
            )

        if not db.query(BlogPost).first():
            db.add(
                BlogPost(
                    slug="building-enterprise-ai-saas",
                    title="Building Enterprise AI SaaS: Lessons from the Trenches",
                    excerpt="Key insights from building and licensing AI products to Fortune 500 companies.",
                    content="<p>Building enterprise AI SaaS requires a fundamentally different approach...</p>",
                    tags="ai,saas,enterprise",
                    is_published=True,
                )
            )

        if not db.query(PortfolioItem).first():
            db.add_all(
                [
                    PortfolioItem(
                        slug="ai-customer-ops",
                        title="AI Customer Operations Platform",
                        category="Enterprise SaaS",
                        description="Flagship AI platform for customer operations.",
                        technologies="Python,FastAPI,Next.js,PostgreSQL,Redis",
                        image_url="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
                        project_url="https://example.com",
                        sort_order=0,
                    ),
                    PortfolioItem(
                        slug="analytics-dashboard",
                        title="Real-time Analytics Dashboard",
                        category="Data Platform",
                        description="Enterprise analytics with predictive insights.",
                        technologies="React,D3.js,Python,ClickHouse",
                        image_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
                        sort_order=1,
                    ),
                ]
            )

        if not db.query(SiteSettings).first():
            settings_data = {
                "site_title": "Soumen Karmakar — AI SaaS Founder",
                "site_description": "Enterprise AI software products available for licensing, purchase, and acquisition.",
                "founder_name": "Soumen Karmakar",
                "founder_title": "Founder & CEO",
                "founder_bio": "AI SaaS entrepreneur building enterprise software products for global businesses.",
                "contact_email": "hello@soumenkarmakar.com",
                "linkedin_url": "https://linkedin.com/in/soumenkarmakar",
                "twitter_url": "https://twitter.com/soumenkarmakar",
                "github_url": "https://github.com/soumenkarmakar",
            }
            for key, value in settings_data.items():
                db.add(SiteSettings(key=key, value=value))

        seo_defaults = {
            "seo_site_url": "https://soumenkarmakar.com",
            "seo_title_suffix": " | Soumen Karmakar",
            "seo_default_description": "Enterprise AI software products for licensing and acquisition.",
            "seo_og_image": "",
            "seo_robots_txt": "User-agent: *\nAllow: /\nSitemap: https://soumenkarmakar.com/sitemap.xml",
            "seo_staging_noindex": "false",
        }
        for key, value in seo_defaults.items():
            if not db.query(SiteSettings).filter(SiteSettings.key == key).first():
                db.add(SiteSettings(key=key, value=value))

        for key, value in [("module_travel_enabled", "true"), ("module_media_enabled", "true")]:
            if not db.query(SiteSettings).filter(SiteSettings.key == key).first():
                db.add(SiteSettings(key=key, value=value))

        if not db.query(TravelEntry).first():
            from datetime import datetime, timezone

            db.add(
                TravelEntry(
                    slug="swiss-alps-zermatt",
                    title="Zermatt & the Matterhorn",
                    location_name="Zermatt, Switzerland",
                    country_code="CH",
                    latitude=46.0207,
                    longitude=7.7491,
                    category="adventure",
                    excerpt="Alpine hiking and cinematic landscapes in the Swiss Alps.",
                    content=(
                        "A week exploring Zermatt — glacier trails, mountain railways, "
                        "and sunrise views of the Matterhorn."
                    ),
                    cover_image_url="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200",
                    gallery_images=json.dumps(
                        [
                            {"url": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200", "alt": "Matterhorn peak at sunrise"},
                            {"url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", "alt": "Alpine village in Zermatt"},
                        ]
                    ),
                    visited_at=datetime(2025, 5, 12, tzinfo=timezone.utc),
                    is_featured=True,
                    sort_order=0,
                )
            )
            db.add(
                TravelEntry(
                    slug="tokyo-neon-nights",
                    title="Tokyo Neon Nights",
                    location_name="Tokyo, Japan",
                    country_code="JP",
                    latitude=35.6762,
                    longitude=139.6503,
                    category="urban",
                    excerpt="Urban exploration through Shibuya, Shinjuku, and hidden alleyways.",
                    content="Night photography and street food across Tokyo's vibrant districts.",
                    cover_image_url="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
                    gallery_images=json.dumps(
                        [
                            {"url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200", "alt": "Tokyo city lights at night"},
                        ]
                    ),
                    visited_at=datetime(2025, 4, 20, tzinfo=timezone.utc),
                    sort_order=1,
                )
            )

        if not db.query(GalleryAlbum).first():
            from app.services.galleries import sync_items

            album = GalleryAlbum(
                slug="press-and-events",
                title="Press & Events",
                description="Brand photography, conference appearances, and press assets.",
                cover_image_url="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
                sort_order=0,
            )
            db.add(album)
            db.flush()
            sync_items(
                db,
                album,
                [
                    {
                        "url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
                        "alt_text": "Conference keynote stage",
                        "caption": "Enterprise AI Summit 2025",
                    },
                    {
                        "url": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
                        "alt_text": "Team workshop session",
                        "caption": "Product strategy workshop",
                    },
                ],
            )

        if not db.query(CMSPage).filter(CMSPage.slug == "home").first():
            import json as _json

            from app.services.cms import sync_blocks

            home = CMSPage(
                slug="home",
                title="Home",
                status="published",
                seo=_json.dumps(
                    {
                        "meta_title": "Soumen Karmakar — AI SaaS Founder",
                        "meta_description": "Enterprise AI software products for licensing and acquisition.",
                    }
                ),
            )
            db.add(home)
            db.flush()
            sync_blocks(
                db,
                home,
                [
                    {
                        "type": "hero",
                        "order": 0,
                        "data": {
                            "headline": "Building Enterprise AI Products",
                            "subheadline": "Founder-led software for global businesses.",
                        },
                    }
                ],
            )

            for legal_slug, legal_title in [
                ("legal/privacy", "Privacy Policy"),
                ("legal/terms", "Terms of Service"),
                ("legal/cookies", "Cookie Policy"),
            ]:
                if not db.query(CMSPage).filter(CMSPage.slug == legal_slug).first():
                    page = CMSPage(
                        slug=legal_slug,
                        title=legal_title,
                        status="published",
                        seo=_json.dumps({"meta_title": legal_title}),
                    )
                    db.add(page)
                    db.flush()
                    sync_blocks(
                        db,
                        page,
                        [
                            {
                                "type": "rich_text",
                                "order": 0,
                                "data": {"html": f"<p>{legal_title} content managed via CMS.</p>"},
                            }
                        ],
                    )

        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    run_migrations()
    seed_database()
