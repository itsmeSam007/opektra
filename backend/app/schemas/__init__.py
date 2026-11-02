from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    # str (not EmailStr) so dev accounts like admin@founderos.local work in Docker/E2E
    email: str = Field(min_length=3)
    password: str = Field(min_length=8)


class UserOut(BaseModel):
    id: int
    # Responses must also support the local Docker accounts accepted at login.
    email: str
    is_active: bool
    roles: list[str]
    permissions: list[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    slug: str
    name: str
    tagline: str
    description: str
    features: list[dict[str, Any]] = []
    domains: list[str] = []
    architecture: dict[str, Any] = {}
    screenshots: list[str] = []
    is_flagship: bool = False
    is_published: bool = True
    sort_order: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    slug: str | None = None
    name: str | None = None
    tagline: str | None = None
    description: str | None = None
    features: list[dict[str, Any]] | None = None
    domains: list[str] | None = None
    architecture: dict[str, Any] | None = None
    screenshots: list[str] | None = None
    is_flagship: bool | None = None
    is_published: bool | None = None
    sort_order: int | None = None


class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BlogPostBase(BaseModel):
    slug: str
    title: str
    excerpt: str
    content: str
    cover_image: str | None = None
    tags: str = ""
    is_published: bool = False


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image: str | None = None
    tags: str | None = None
    is_published: bool | None = None


class BlogPostOut(BlogPostBase):
    id: int
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CaseStudyBase(BaseModel):
    slug: str
    title: str
    client: str
    industry: str
    summary: str
    challenge: str
    solution: str
    results: str
    metrics: list[dict[str, str]] = []
    cover_image: str | None = None
    related_product_slug: str | None = None
    gallery_images: list[dict[str, str]] = []
    is_published: bool = True
    sort_order: int = 0


class CaseStudyCreate(CaseStudyBase):
    pass


class CaseStudyUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    client: str | None = None
    industry: str | None = None
    summary: str | None = None
    challenge: str | None = None
    solution: str | None = None
    results: str | None = None
    metrics: list[dict[str, str]] | None = None
    cover_image: str | None = None
    related_product_slug: str | None = None
    gallery_images: list[dict[str, str]] | None = None
    is_published: bool | None = None
    sort_order: int | None = None


class CaseStudyOut(CaseStudyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TestimonialBase(BaseModel):
    name: str
    role: str
    company: str
    content: str
    avatar_url: str | None = None
    is_published: bool = True
    sort_order: int = 0


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    company: str | None = None
    content: str | None = None
    avatar_url: str | None = None
    is_published: bool | None = None
    sort_order: int | None = None


class TestimonialOut(TestimonialBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PortfolioItemBase(BaseModel):
    slug: str
    title: str
    category: str
    description: str
    technologies: str = ""
    image_url: str | None = None
    project_url: str | None = None
    is_published: bool = True
    sort_order: int = 0


class PortfolioItemCreate(PortfolioItemBase):
    pass


class PortfolioItemUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    category: str | None = None
    description: str | None = None
    technologies: str | None = None
    image_url: str | None = None
    project_url: str | None = None
    is_published: bool | None = None
    sort_order: int | None = None


class PortfolioItemOut(PortfolioItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ContactForm(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    email: EmailStr
    company: str | None = None
    inquiry_type: str = "general"
    message: str = Field(min_length=10, max_length=10000)
    website: str | None = None


class InquiryForm(BaseModel):
    inquiry_type: str
    name: str = Field(min_length=2, max_length=200)
    email: EmailStr
    company: str = Field(min_length=2, max_length=200)
    role: str | None = None
    message: str = Field(min_length=10, max_length=10000)
    budget_range: str | None = None
    nda_acknowledged: bool = False
    website: str | None = None


class InquiryPatch(BaseModel):
    is_read: bool | None = None


class ContactPatch(BaseModel):
    is_read: bool | None = None


class NewsletterSubscribeIn(BaseModel):
    email: EmailStr
    consent: bool = False
    website: str | None = None


class NewsletterSubscriberOut(BaseModel):
    id: int
    email: str
    status: str
    consent_at: datetime
    confirmed_at: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class SearchResultOut(BaseModel):
    type: str
    title: str
    slug: str
    excerpt: str
    url: str


class SiteSettingOut(BaseModel):
    key: str
    value: str

    class Config:
        from_attributes = True


class SiteSettingUpdate(BaseModel):
    value: str


class GalleryImageItem(BaseModel):
    url: str
    alt: str
    caption: str = ""


class TravelEntryBase(BaseModel):
    slug: str
    title: str
    location_name: str
    country_code: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    category: str = "other"
    excerpt: str
    content: str
    cover_image_url: str | None = None
    gallery_images: list[GalleryImageItem] = []
    visited_at: datetime
    is_featured: bool = False
    is_published: bool = True
    sort_order: int = 0


class TravelEntryCreate(TravelEntryBase):
    pass


class TravelEntryUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    location_name: str | None = None
    country_code: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    category: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image_url: str | None = None
    gallery_images: list[GalleryImageItem] | None = None
    visited_at: datetime | None = None
    is_featured: bool | None = None
    is_published: bool | None = None
    sort_order: int | None = None


class TravelEntryOut(TravelEntryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GalleryAlbumItemOut(BaseModel):
    id: int
    url: str
    alt_text: str
    caption: str
    sort_order: int

    class Config:
        from_attributes = True


class GalleryAlbumItemIn(BaseModel):
    url: str
    alt_text: str
    caption: str = ""
    sort_order: int = 0


class GalleryAlbumBase(BaseModel):
    slug: str
    title: str
    description: str = ""
    cover_image_url: str | None = None
    is_published: bool = True
    sort_order: int = 0


class GalleryAlbumCreate(GalleryAlbumBase):
    items: list[GalleryAlbumItemIn] = []


class GalleryAlbumUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    description: str | None = None
    cover_image_url: str | None = None
    is_published: bool | None = None
    sort_order: int | None = None
    items: list[GalleryAlbumItemIn] | None = None


class GalleryAlbumOut(GalleryAlbumBase):
    id: int
    items: list[GalleryAlbumItemOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GalleryReorderRequest(BaseModel):
    item_ids: list[int]


class PublicSettingsOut(BaseModel):
    module_travel_enabled: bool = True
    module_media_enabled: bool = True
    site_title: str | None = None
    site_description: str | None = None
    founder_name: str | None = None
    primary_color: str | None = None


class SettingOut(BaseModel):
    key: str
    value: str
    value_type: str = "string"
    is_secret: bool = False
    updated_at: datetime | None = None


class SettingUpsert(BaseModel):
    value: str
    value_type: str = "string"


class SettingsBulkUpsert(BaseModel):
    settings: list[dict[str, str]]


class PermissionOut(BaseModel):
    id: int
    code: str
    description: str | None = None

    class Config:
        from_attributes = True


class RoleOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    permissions: list[str]
    created_at: datetime

    class Config:
        from_attributes = True


class RoleUpdate(BaseModel):
    description: str | None = None
    permission_codes: list[str] | None = None


class UserAdminOut(BaseModel):
    id: int
    email: str
    is_active: bool
    role: str | None = None
    role_id: int | None = None
    last_login_at: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role_id: int | None = None


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8)
    role_id: int | None = None
    is_active: bool | None = None


class AuditLogOut(BaseModel):
    id: int
    user_id: int | None = None
    user_email: str | None = None
    action: str
    resource_type: str
    resource_id: str | None = None
    details: dict[str, Any] | None = None
    ip_address: str | None = None
    created_at: datetime


class MediaAssetOut(BaseModel):
    id: int
    filename: str
    url: str
    alt_text: str
    caption: str | None = None
    mime_type: str
    size_bytes: int
    folder: str
    created_at: datetime

    class Config:
        from_attributes = True


class MediaAssetUpdate(BaseModel):
    alt_text: str | None = None
    caption: str | None = None
    folder: str | None = None


class AnalyticsEventIn(BaseModel):
    event_type: str = "page_view"
    path: str = Field(max_length=500)
    visitor_hash: str | None = Field(default=None, max_length=64)


class AnalyticsSummaryOut(BaseModel):
    total_pageviews: int
    unique_visitors: int
    period_days: int


class PageviewPoint(BaseModel):
    date: str
    count: int


class TopPageOut(BaseModel):
    path: str
    views: int


class DashboardStatsOut(BaseModel):
    unread_inquiries: int
    unread_contacts: int
    total_users: int
    recent_publishes: list[dict[str, Any]]
    integration_status: dict[str, Any]
    system_health: dict[str, Any]
