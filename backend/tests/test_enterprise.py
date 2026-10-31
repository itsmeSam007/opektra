"""Sprint 8 enterprise API tests."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_search_requires_min_query():
    res = client.get("/api/v1/search?q=a")
    assert res.status_code == 422


def test_search_products():
    res = client.get("/api/v1/search?q=customer")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_contact_honeypot():
    res = client.post(
        "/api/v1/contact",
        json={
            "name": "Bot",
            "email": "bot@example.com",
            "message": "spam message here",
            "website": "http://spam.com",
        },
    )
    assert res.status_code == 200
    assert res.json()["ok"] is True


def test_inquiry_requires_nda_for_acquisition():
    res = client.post(
        "/api/v1/inquiries",
        json={
            "inquiry_type": "acquisition",
            "name": "Buyer",
            "email": "buyer@corp.com",
            "company": "Corp Inc",
            "message": "We want to acquire your platform product.",
            "nda_acknowledged": False,
        },
    )
    assert res.status_code == 400


def test_inquiry_acquisition_with_nda():
    res = client.post(
        "/api/v1/inquiries",
        json={
            "inquiry_type": "acquisition",
            "name": "Buyer",
            "email": "buyer@corp.com",
            "company": "Corp Inc",
            "message": "We want to acquire your platform product.",
            "nda_acknowledged": True,
        },
    )
    assert res.status_code == 200
    assert res.json()["ok"] is True


def test_newsletter_subscribe_requires_consent():
    res = client.post(
        "/api/v1/newsletter/subscribe",
        json={"email": "reader@example.com", "consent": False},
    )
    assert res.status_code == 400


def test_newsletter_subscribe():
    res = client.post(
        "/api/v1/newsletter/subscribe",
        json={"email": "reader@example.com", "consent": True, "website": ""},
    )
    assert res.status_code == 202
    assert "confirm" in res.json()["message"].lower()
