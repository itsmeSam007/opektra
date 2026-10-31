"""Case studies API tests."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_case_studies_public():
    response = client.get("/api/v1/case-studies")
    assert response.status_code == 200
    studies = response.json()
    assert isinstance(studies, list)
    if studies:
        assert all(s.get("is_published") for s in studies)


def test_get_case_study_not_found():
    response = client.get("/api/v1/case-studies/nonexistent-case-study")
    assert response.status_code == 404


def test_create_case_study_requires_auth():
    response = client.post(
        "/api/v1/case-studies",
        json={
            "slug": "test-case",
            "title": "Test",
            "client": "Client",
            "industry": "SaaS",
            "summary": "Summary",
            "challenge": "Challenge",
            "solution": "Solution",
            "results": "Results",
        },
    )
    assert response.status_code == 401
