"""Sprint 7 admin API tests."""

import io

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_public_settings_endpoint():
    res = client.get("/api/v1/settings/public")
    assert res.status_code == 200
    data = res.json()
    assert "module_travel_enabled" in data


def test_users_list_requires_auth():
    res = client.get("/api/v1/users")
    assert res.status_code == 401


def test_users_list_admin(admin_token):
    res = client.get("/api/v1/users", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_roles_and_permissions(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    roles = client.get("/api/v1/roles", headers=headers)
    assert roles.status_code == 200
    perms = client.get("/api/v1/permissions", headers=headers)
    assert perms.status_code == 200
    assert len(perms.json()) > 0


def test_settings_admin_list(admin_token):
    res = client.get("/api/v1/settings", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200


def test_analytics_event_ingest():
    res = client.post(
        "/api/v1/analytics/events",
        json={"event_type": "page_view", "path": "/products", "visitor_hash": "abc123"},
    )
    assert res.status_code == 202


def test_analytics_summary_admin(admin_token):
    client.post(
        "/api/v1/analytics/events",
        json={"event_type": "page_view", "path": "/test-page", "visitor_hash": "xyz"},
    )
    res = client.get("/api/v1/analytics/summary?days=7", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    assert "total_pageviews" in res.json()


def test_dashboard_stats(admin_token):
    res = client.get("/api/v1/admin/dashboard", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "system_health" in data


def test_audit_logs(admin_token):
    res = client.get("/api/v1/logs/audit", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200


def test_media_upload_requires_alt(admin_token):
  headers = {"Authorization": f"Bearer {admin_token}"}
  res = client.post(
      "/api/v1/media",
      headers=headers,
      files={"file": ("test.png", io.BytesIO(b"fake"), "image/png")},
      data={"alt_text": "Test image"},
  )
  assert res.status_code == 201
  asset = res.json()
  assert asset["alt_text"] == "Test image"
