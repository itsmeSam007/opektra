"""Product API tests."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_products_public():
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    products = response.json()
    assert isinstance(products, list)
    if products:
        assert all(p.get("is_published") for p in products)


def test_get_product_not_found():
    response = client.get("/api/v1/products/nonexistent-product-slug")
    assert response.status_code == 404


def test_create_product_requires_auth():
    response = client.post(
        "/api/v1/products",
        json={
            "slug": "test-product",
            "name": "Test",
            "tagline": "Test tagline",
            "description": "Test description",
        },
    )
    assert response.status_code == 401
