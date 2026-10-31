from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class CMSBlockIn(BaseModel):
    type: str = Field(min_length=1, max_length=100)
    order: int = 0
    data: dict[str, Any] = Field(default_factory=dict)
    visibility: str = "public"


class CMSBlockOut(CMSBlockIn):
    id: int


class CMSSeo(BaseModel):
    meta_title: str | None = None
    meta_description: str | None = None
    og_image: str | None = None


class CMSPageCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=200)
    title: str = Field(min_length=1, max_length=300)
    status: str = "draft"
    seo: CMSSeo = Field(default_factory=CMSSeo)
    blocks: list[CMSBlockIn] = Field(default_factory=list)


class CMSPageUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    status: str | None = None
    seo: CMSSeo | None = None
    blocks: list[CMSBlockIn] | None = None


class CMSPageOut(BaseModel):
    id: int
    slug: str
    title: str
    status: str
    seo: CMSSeo
    published_at: datetime | None
    scheduled_at: datetime | None
    blocks: list[CMSBlockOut]
    created_at: datetime
    updated_at: datetime


class CMSPageSummary(BaseModel):
    id: int
    slug: str
    title: str
    status: str
    updated_at: datetime


class CMSPublishRequest(BaseModel):
    scheduled_at: datetime | None = None


class CMSRevisionOut(BaseModel):
    id: int
    page_id: int
    created_at: datetime
    created_by: int | None


class CMSPreviewTokenOut(BaseModel):
    token: str
    expires_in: int = 3600
