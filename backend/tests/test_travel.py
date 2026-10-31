"""Travel and gallery API tests."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_travel_public():
    response = client.get("/api/v1/travel")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_public_settings():
    response = client.get("/api/v1/settings/public")
    assert response.status_code == 200
    data = response.json()
    assert "module_travel_enabled" in data
    assert "module_media_enabled" in data


def test_list_galleries_public():
    response = client.get("/api/v1/galleries")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_youtube_videos():
    response = client.get("/api/v1/integrations/youtube/videos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_github_repos():
    response = client.get("/api/v1/integrations/github/repos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
