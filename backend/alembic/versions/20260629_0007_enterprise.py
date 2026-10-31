"""Enterprise: newsletter subscribers + inquiry NDA field

Revision ID: 20260629_0007
Revises: 20260629_0006
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260629_0007"
down_revision = "20260629_0006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = inspect(op.get_bind())
    tables = set(insp.get_table_names())

    if "inquiries" in tables:
        cols = {c["name"] for c in insp.get_columns("inquiries")}
        if "nda_acknowledged" not in cols:
            op.add_column(
                "inquiries",
                sa.Column("nda_acknowledged", sa.Boolean(), nullable=False, server_default="false"),
            )
        if "is_acquisition" not in cols:
            op.add_column(
                "inquiries",
                sa.Column("is_acquisition", sa.Boolean(), nullable=False, server_default="false"),
            )

    if "newsletter_subscribers" not in tables:
        op.create_table(
            "newsletter_subscribers",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("email", sa.String(255), nullable=False, unique=True),
            sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
            sa.Column("confirm_token", sa.String(64), nullable=True, unique=True),
            sa.Column("unsubscribe_token", sa.String(64), nullable=False, unique=True),
            sa.Column("consent_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("confirmed_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )


def downgrade() -> None:
    op.drop_table("newsletter_subscribers")
    op.drop_column("inquiries", "is_acquisition")
    op.drop_column("inquiries", "nda_acknowledged")
