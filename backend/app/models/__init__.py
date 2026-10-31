from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Table, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column("permission_id", Integer, ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True),
)


class Permission(Base):
    __tablename__ = "permissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    permissions: Mapped[list["Permission"]] = relationship(secondary=role_permissions, lazy="joined")
    users: Mapped[list["User"]] = relationship(back_populates="role")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("roles.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    role: Mapped["Role | None"] = relationship(back_populates="users", lazy="joined")

    def permission_codes(self) -> set[str]:
        if not self.role:
            return set()
        return {p.code for p in self.role.permissions}

    def has_permission(self, code: str) -> bool:
        return code in self.permission_codes()


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    value: Mapped[str] = mapped_column(Text)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    tagline: Mapped[str] = mapped_column(String(500))
    description: Mapped[str] = mapped_column(Text)
    features: Mapped[str] = mapped_column(Text, default="[]")
    domains: Mapped[str] = mapped_column(Text, default="[]")
    architecture: Mapped[str] = mapped_column(Text, default="{}")
    screenshots: Mapped[str] = mapped_column(Text, default="[]")
    is_flagship: Mapped[bool] = mapped_column(Boolean, default=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    excerpt: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    cover_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tags: Mapped[str] = mapped_column(String(500), default="")
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CaseStudy(Base):
    __tablename__ = "case_studies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    client: Mapped[str] = mapped_column(String(200))
    industry: Mapped[str] = mapped_column(String(100))
    summary: Mapped[str] = mapped_column(Text)
    challenge: Mapped[str] = mapped_column(Text)
    solution: Mapped[str] = mapped_column(Text)
    results: Mapped[str] = mapped_column(Text)
    metrics: Mapped[str] = mapped_column(Text, default="[]")
    cover_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    related_product_slug: Mapped[str | None] = mapped_column(String(200), nullable=True)
    gallery_images: Mapped[str] = mapped_column(Text, default="[]")
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(200))
    company: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class PortfolioItem(Base):
    __tablename__ = "portfolio_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    category: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    technologies: Mapped[str] = mapped_column(String(500), default="")
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    project_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(255))
    company: Mapped[str | None] = mapped_column(String(200), nullable=True)
    inquiry_type: Mapped[str] = mapped_column(String(50))
    message: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Inquiry(Base):
    __tablename__ = "inquiries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    inquiry_type: Mapped[str] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(255))
    company: Mapped[str] = mapped_column(String(200))
    role: Mapped[str | None] = mapped_column(String(200), nullable=True)
    message: Mapped[str] = mapped_column(Text)
    budget_range: Mapped[str | None] = mapped_column(String(100), nullable=True)
    nda_acknowledged: Mapped[bool] = mapped_column(Boolean, default=False)
    is_acquisition: Mapped[bool] = mapped_column(Boolean, default=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class CMSPage(Base):
    __tablename__ = "cms_pages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    status: Mapped[str] = mapped_column(String(20), default="draft", index=True)
    seo: Mapped[str] = mapped_column(Text, default="{}")
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    blocks: Mapped[list["CMSBlock"]] = relationship(
        back_populates="page", cascade="all, delete-orphan", order_by="CMSBlock.sort_order"
    )
    revisions: Mapped[list["CMSRevision"]] = relationship(back_populates="page", cascade="all, delete-orphan")


class CMSBlock(Base):
    __tablename__ = "cms_blocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    page_id: Mapped[int] = mapped_column(Integer, ForeignKey("cms_pages.id", ondelete="CASCADE"), index=True)
    block_type: Mapped[str] = mapped_column(String(100))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    data: Mapped[str] = mapped_column(Text, default="{}")
    visibility: Mapped[str] = mapped_column(String(20), default="public")

    page: Mapped["CMSPage"] = relationship(back_populates="blocks")


class CMSRevision(Base):
    __tablename__ = "cms_revisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    page_id: Mapped[int] = mapped_column(Integer, ForeignKey("cms_pages.id", ondelete="CASCADE"), index=True)
    snapshot: Mapped[str] = mapped_column(Text)
    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    page: Mapped["CMSPage"] = relationship(back_populates="revisions")


class TravelEntry(Base):
    __tablename__ = "travel_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    location_name: Mapped[str] = mapped_column(String(200))
    country_code: Mapped[str | None] = mapped_column(String(2), nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    category: Mapped[str] = mapped_column(String(50), default="other", index=True)
    excerpt: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    cover_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    gallery_images: Mapped[str] = mapped_column(Text, default="[]")
    visited_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class GalleryAlbum(Base):
    __tablename__ = "gallery_albums"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    description: Mapped[str] = mapped_column(Text, default="")
    cover_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    items: Mapped[list["GalleryAlbumItem"]] = relationship(
        back_populates="album", cascade="all, delete-orphan", order_by="GalleryAlbumItem.sort_order"
    )


class GalleryAlbumItem(Base):
    __tablename__ = "gallery_album_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    album_id: Mapped[int] = mapped_column(Integer, ForeignKey("gallery_albums.id", ondelete="CASCADE"), index=True)
    url: Mapped[str] = mapped_column(String(500))
    alt_text: Mapped[str] = mapped_column(String(300), default="")
    caption: Mapped[str] = mapped_column(String(500), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    album: Mapped["GalleryAlbum"] = relationship(back_populates="items")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(50))
    resource_type: Mapped[str] = mapped_column(String(50), index=True)
    resource_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)

    user: Mapped["User | None"] = relationship(lazy="joined")


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    filename: Mapped[str] = mapped_column(String(255))
    url: Mapped[str] = mapped_column(String(500))
    alt_text: Mapped[str] = mapped_column(String(500))
    caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    mime_type: Mapped[str] = mapped_column(String(100))
    size_bytes: Mapped[int] = mapped_column(Integer, default=0)
    folder: Mapped[str] = mapped_column(String(100), default="uploads", index=True)
    uploaded_by_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    event_type: Mapped[str] = mapped_column(String(50), default="page_view")
    path: Mapped[str] = mapped_column(String(500), index=True)
    visitor_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    event_metadata: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    confirm_token: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    unsubscribe_token: Mapped[str] = mapped_column(String(64), unique=True)
    consent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
