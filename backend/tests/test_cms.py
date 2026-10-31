"""CMS API integration tests."""

import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _page_payload(slug: str | None = None):
    slug = slug or f"test-page-{uuid.uuid4().hex[:8]}"
    return {
        "slug": slug,
        "title": "Test CMS Page",
        "status": "draft",
        "seo": {"meta_title": "Test", "meta_description": "Desc"},
        "blocks": [{"type": "hero", "order": 0, "data": {"headline": "Hello"}, "visibility": "public"}],
    }


def test_cms_pages_require_auth():
    res = client.get("/api/v1/cms/pages")
    assert res.status_code == 401


def test_cms_create_publish_flow(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = _page_payload()

    create = client.post("/api/v1/cms/pages", json=payload, headers=headers)
    assert create.status_code == 200
    page = create.json()
    page_id = page["id"]
    assert page["status"] == "draft"

    publish = client.post(f"/api/v1/cms/pages/{page_id}/publish", json={}, headers=headers)
    assert publish.status_code == 200
    assert publish.json()["status"] == "published"

    public = client.get(f"/api/v1/cms/pages/{payload['slug']}")
    assert public.status_code == 200
    assert public.json()["title"] == "Test CMS Page"


def test_cms_block_types(admin_token):
    res = client.get("/api/v1/cms/block-types", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    types = res.json()
    assert isinstance(types, list)
    assert any(t.get("type") == "hero" for t in types)
