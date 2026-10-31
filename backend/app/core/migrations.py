from pathlib import Path

from alembic import command
from alembic.config import Config


def run_migrations() -> None:
    root = Path(__file__).resolve().parents[2]
    cfg = Config(str(root / "alembic.ini"))
    command.upgrade(cfg, "head")
