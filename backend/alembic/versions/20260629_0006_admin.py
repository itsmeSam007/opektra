"""Admin: audit logs, media assets, analytics events

Revision ID: 20260629_0006
Revises: 20260629_0005
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260629_0006"
down_revision = "20260629_0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = inspect(op.get_bind())
    tables = set(insp.get_table_names())

    if "audit_logs" not in tables:
        op.create_table(
            "audit_logs",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
            sa.Column("action", sa.String(50), nullable=False),
            sa.Column("resource_type", sa.String(50), nullable=False),
            sa.Column("resource_id", sa.String(100), nullable=True),
            sa.Column("details", sa.Text(), nullable=True),
            sa.Column("ip_address", sa.String(45), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
        op.create_index("ix_audit_logs_created_at", "audit_logs", ["created_at"])
        op.create_index("ix_audit_logs_resource_type", "audit_logs", ["resource_type"])

    if "media_assets" not in tables:
        op.create_table(
            "media_assets",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("filename", sa.String(255), nullable=False),
            sa.Column("url", sa.String(500), nullable=False),
            sa.Column("alt_text", sa.String(500), nullable=False),
            sa.Column("caption", sa.Text(), nullable=True),
            sa.Column("mime_type", sa.String(100), nullable=False),
            sa.Column("size_bytes", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("folder", sa.String(100), nullable=False, server_default="uploads"),
            sa.Column("uploaded_by_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
        op.create_index("ix_media_assets_folder", "media_assets", ["folder"])

    if "analytics_events" not in tables:
        op.create_table(
            "analytics_events",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("event_type", sa.String(50), nullable=False, server_default="page_view"),
            sa.Column("path", sa.String(500), nullable=False),
            sa.Column("visitor_hash", sa.String(64), nullable=True),
            sa.Column("event_metadata", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
        op.create_index("ix_analytics_events_created_at", "analytics_events", ["created_at"])
        op.create_index("ix_analytics_events_path", "analytics_events", ["path"])


def downgrade() -> None:
    op.drop_table("analytics_events")
    op.drop_table("media_assets")
    op.drop_table("audit_logs")
