"""RBAC tables and user role_id

Revision ID: 20260629_0002
Revises: 20260629_0001
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260629_0002"
down_revision = "20260629_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    insp = inspect(conn)
    tables = set(insp.get_table_names())

    if "permissions" not in tables:
        op.create_table(
            "permissions",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("code", sa.String(100), nullable=False, unique=True),
            sa.Column("description", sa.Text(), nullable=True),
        )

    if "roles" not in tables:
        op.create_table(
            "roles",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("name", sa.String(50), nullable=False, unique=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )

    if "role_permissions" not in tables:
        op.create_table(
            "role_permissions",
            sa.Column("role_id", sa.Integer(), sa.ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
            sa.Column("permission_id", sa.Integer(), sa.ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True),
        )

    user_cols = {c["name"] for c in insp.get_columns("users")}
    if "role_id" not in user_cols:
        op.add_column("users", sa.Column("role_id", sa.Integer(), sa.ForeignKey("roles.id"), nullable=True))
    if "last_login_at" not in user_cols:
        op.add_column("users", sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True))
    if "updated_at" not in user_cols:
        op.add_column("users", sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))


def downgrade() -> None:
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_column("updated_at")
        batch_op.drop_column("last_login_at")
        batch_op.drop_column("role_id")
    op.drop_table("role_permissions")
    op.drop_table("roles")
    op.drop_table("permissions")
