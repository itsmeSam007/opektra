"""Travel and gallery tables

Revision ID: 20260629_0005
Revises: 20260629_0004
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260629_0005"
down_revision = "20260629_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = inspect(op.get_bind())
    tables = set(insp.get_table_names())

    if "travel_entries" not in tables:
        op.create_table(
            "travel_entries",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("slug", sa.String(200), nullable=False, unique=True),
            sa.Column("title", sa.String(300), nullable=False),
            sa.Column("location_name", sa.String(200), nullable=False),
            sa.Column("country_code", sa.String(2), nullable=True),
            sa.Column("latitude", sa.Float(), nullable=True),
            sa.Column("longitude", sa.Float(), nullable=True),
            sa.Column("category", sa.String(50), nullable=False, server_default="other"),
            sa.Column("excerpt", sa.Text(), nullable=False),
            sa.Column("content", sa.Text(), nullable=False),
            sa.Column("cover_image_url", sa.String(500), nullable=True),
            sa.Column("gallery_images", sa.Text(), nullable=False, server_default="[]"),
            sa.Column("visited_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("is_featured", sa.Boolean(), nullable=False, server_default="false"),
            sa.Column("is_published", sa.Boolean(), nullable=False, server_default="true"),
            sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
        op.create_index("ix_travel_entries_slug", "travel_entries", ["slug"])
        op.create_index("ix_travel_entries_category", "travel_entries", ["category"])

    if "gallery_albums" not in tables:
        op.create_table(
            "gallery_albums",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("slug", sa.String(200), nullable=False, unique=True),
            sa.Column("title", sa.String(300), nullable=False),
            sa.Column("description", sa.Text(), nullable=False, server_default=""),
            sa.Column("cover_image_url", sa.String(500), nullable=True),
            sa.Column("is_published", sa.Boolean(), nullable=False, server_default="true"),
            sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
        op.create_index("ix_gallery_albums_slug", "gallery_albums", ["slug"])

    if "gallery_album_items" not in tables:
        op.create_table(
            "gallery_album_items",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("album_id", sa.Integer(), sa.ForeignKey("gallery_albums.id", ondelete="CASCADE"), nullable=False),
            sa.Column("url", sa.String(500), nullable=False),
            sa.Column("alt_text", sa.String(300), nullable=False, server_default=""),
            sa.Column("caption", sa.String(500), nullable=False, server_default=""),
            sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        )
        op.create_index("ix_gallery_album_items_album_id", "gallery_album_items", ["album_id"])


def downgrade() -> None:
    op.drop_table("gallery_album_items")
    op.drop_table("gallery_albums")
    op.drop_table("travel_entries")
