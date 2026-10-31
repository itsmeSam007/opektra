"""Shared pytest fixtures."""

import pytest

from app.core.database import SessionLocal
from app.core.migrations import run_migrations
from app.core.security import create_access_token
from app.models import User


@pytest.fixture(scope="session", autouse=True)
def apply_migrations():
    run_migrations()


@pytest.fixture
def admin_token():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.is_active.is_(True)).first()
        assert user is not None, "No active admin user in database"
        return create_access_token(user.email)
    finally:
        db.close()
