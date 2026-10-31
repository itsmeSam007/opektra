"""Case study gallery and related product fields

Revision ID: 20260629_0004
Revises: 20260629_0003
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260629_0004"
down_revision = "20260629_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = inspect(op.get_bind())
    cols = {c["name"] for c in insp.get_columns("case_studies")}
    if "related_product_slug" not in cols:
        op.add_column("case_studies", sa.Column("related_product_slug", sa.String(200), nullable=True))
    if "gallery_images" not in cols:
        op.add_column("case_studies", sa.Column("gallery_images", sa.Text(), nullable=False, server_default="[]"))


def downgrade() -> None:
    op.drop_column("case_studies", "gallery_images")
    op.drop_column("case_studies", "related_product_slug")
