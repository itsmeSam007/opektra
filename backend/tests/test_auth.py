"""Authentication endpoint tests."""

from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_me_requires_auth():
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_login_validation_short_password():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "short"},
    )
    assert response.status_code == 422


@patch("app.api.routes.auth.check_login_rate_limit", return_value=True)
def test_login_invalid_credentials(mock_rate):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": "wrongpass1"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


@patch("app.api.routes.auth.check_login_rate_limit", return_value=True)
def test_login_accepts_local_dev_email(mock_rate):
    """Docker admin uses admin@founderos.local — must not 422."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@founderos.local", "password": "admin123"},
    )
    assert response.status_code != 422


def test_security_uses_bcrypt_rounds_12():
    from app.core import security

    assert "bcrypt__rounds=12" in open(security.__file__).read()
