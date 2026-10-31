"""Portfolio API tests."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_portfolio_public():
    response = client.get("/api/v1/portfolio")
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)


def test_list_portfolio_category_filter():
    response = client.get("/api/v1/portfolio", params={"category": "Enterprise SaaS"})
    assert response.status_code == 200
    items = response.json()
    assert all(i.get("category") == "Enterprise SaaS" for i in items)


def test_create_portfolio_requires_auth():
    response = client.post(
        "/api/v1/portfolio",
        json={
            "slug": "test-portfolio",
            "title": "Test",
            "category": "SaaS",
            "description": "Test description",
        },
    )
    assert response.status_code == 401
