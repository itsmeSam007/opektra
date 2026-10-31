"""CMS tables

Revision ID: 20260629_0003
Revises: 20260629_0002
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260629_0003"
down_revision = "20260629_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = inspect(op.get_bind())
    tables = set(insp.get_table_names())

    if "cms_pages" not in tables:
        op.create_table(
            "cms_pages",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("slug", sa.String(200), nullable=False, unique=True),
            sa.Column("title", sa.String(300), nullable=False),
            sa.Column("status", sa.String(20), nullable=False, server_default="draft"),
            sa.Column("seo", sa.Text(), nullable=False, server_default="{}"),
            sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default="false"),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
        op.create_index("ix_cms_pages_slug", "cms_pages", ["slug"])
        op.create_index("ix_cms_pages_status", "cms_pages", ["status"])

    if "cms_blocks" not in tables:
        op.create_table(
            "cms_blocks",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("page_id", sa.Integer(), sa.ForeignKey("cms_pages.id", ondelete="CASCADE"), nullable=False),
            sa.Column("block_type", sa.String(100), nullable=False),
            sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("data", sa.Text(), nullable=False, server_default="{}"),
            sa.Column("visibility", sa.String(20), nullable=False, server_default="public"),
        )
        op.create_index("ix_cms_blocks_page_id", "cms_blocks", ["page_id"])

    if "cms_revisions" not in tables:
        op.create_table(
            "cms_revisions",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("page_id", sa.Integer(), sa.ForeignKey("cms_pages.id", ondelete="CASCADE"), nullable=False),
            sa.Column("snapshot", sa.Text(), nullable=False),
            sa.Column("created_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
        op.create_index("ix_cms_revisions_page_id", "cms_revisions", ["page_id"])


def downgrade() -> None:
    op.drop_table("cms_revisions")
    op.drop_table("cms_blocks")
    op.drop_table("cms_pages")
