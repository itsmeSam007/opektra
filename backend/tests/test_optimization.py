"""Sprint 9 optimization tests."""

from fastapi.testclient import TestClient

from app.main import app
from app.services.images import optimize_upload

client = TestClient(app)


def test_search_cached():
    r1 = client.get("/api/v1/search?q=customer")
    r2 = client.get("/api/v1/search?q=customer")
    assert r1.status_code == 200
    assert r2.status_code == 200
    assert r1.json() == r2.json()


def test_public_settings_cached():
    r1 = client.get("/api/v1/settings/public")
    r2 = client.get("/api/v1/settings/public")
    assert r1.status_code == 200
    assert r2.json() == r1.json()


def test_blog_list():
    res = client.get("/api/v1/blog")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_optimize_upload_png_to_webp():
    # Minimal valid 1x1 PNG
    png = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01"
        b"\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
    )
    data, mime, ext = optimize_upload(png, "image/png", ".png")
    assert ext == ".webp"
    assert mime == "image/webp"
    assert len(data) > 0


def test_optimize_upload_pdf_passthrough():
    pdf = b"%PDF-1.4 test"
    data, mime, ext = optimize_upload(pdf, "application/pdf", ".pdf")
    assert data == pdf
    assert mime == "application/pdf"
