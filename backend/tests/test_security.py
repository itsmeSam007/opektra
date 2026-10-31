"""Security and RBAC integration tests."""

from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_invalid_bearer_token_rejected():
    res = client.get("/api/v1/users", headers={"Authorization": "Bearer invalid-token"})
    assert res.status_code == 401


def test_malformed_auth_header():
    res = client.get("/api/v1/users", headers={"Authorization": "NotBearer token"})
    assert res.status_code == 401


def test_settings_admin_requires_permission(admin_token):
    res = client.get("/api/v1/settings", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200


def test_cms_write_requires_auth():
    res = client.post(
        "/api/v1/cms/pages",
        json={"slug": "unauth", "title": "X", "status": "draft", "blocks": []},
    )
    assert res.status_code == 401


def test_contact_valid_submission():
    res = client.post(
        "/api/v1/contact",
        json={
            "name": "Jane Doe",
            "email": "jane@example.com",
            "message": "I would like a product demo please.",
            "inquiry_type": "general",
            "website": "",
        },
    )
    assert res.status_code == 200
    assert res.json()["ok"] is True


@patch("app.api.routes.auth.check_login_rate_limit", return_value=True)
def test_login_success_with_seeded_admin(mock_rate):
    from app.core.config import settings

    res = client.post(
        "/api/v1/auth/login",
        json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD},
    )
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_health_no_sensitive_data():
    res = client.get("/api/v1/health")
    data = res.json()
    assert "secret" not in str(data).lower()
    assert "password" not in str(data).lower()
