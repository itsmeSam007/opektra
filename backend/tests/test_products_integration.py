"""Product create and publish integration tests."""

import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_product_create_and_publish(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    slug = f"test-product-{uuid.uuid4().hex[:8]}"

    create = client.post(
        "/api/v1/products",
        json={
            "slug": slug,
            "name": "Integration Test Product",
            "tagline": "Built for testing",
            "description": "A product created during integration tests.",
            "is_published": False,
        },
        headers=headers,
    )
    assert create.status_code == 201
    product_id = create.json()["id"]

    update = client.put(
        f"/api/v1/products/{product_id}",
        json={"is_published": True},
        headers=headers,
    )
    assert update.status_code == 200
    assert update.json()["is_published"] is True

    public = client.get(f"/api/v1/products/{slug}")
    assert public.status_code == 200
    assert public.json()["name"] == "Integration Test Product"
