"""FounderOS baseline schema — Sprint 0.

Revision ID: 20260629_0001
Revises:
Create Date: 2026-06-29
"""

from typing import Sequence, Union

from alembic import op

revision: str = "20260629_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Bootstrap the metadata-managed baseline before later revisions inspect it.
    # checkfirst preserves existing installations that predate Alembic.
    from app.core.database import Base
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=op.get_bind(), checkfirst=True)


def downgrade() -> None:
    pass
