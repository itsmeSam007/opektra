"""Registered CMS block types for validation and admin UI."""

from typing import Any, Final

CMS_BLOCK_TYPES: Final[dict[str, dict[str, Any]]] = {
    "rich_text": {
        "label": "Rich Text",
        "fields": ["html"],
    },
    "hero": {
        "label": "Hero",
        "fields": ["title", "subtitle", "cta_label", "cta_href"],
    },
    "product-showcase": {
        "label": "Product Showcase",
        "fields": ["product_slug", "show_features", "show_architecture"],
        "description": "Embed a published product by slug",
    },
    "portfolio-grid": {
        "label": "Portfolio Grid",
        "fields": ["category", "limit"],
        "description": "Embed published portfolio items, optionally filtered by category",
    },
    "travel-featured": {
        "label": "Featured Travel",
        "fields": ["entry_slug"],
        "description": "Highlight a published travel entry by slug",
    },
}

VALID_BLOCK_TYPES: Final[frozenset[str]] = frozenset(CMS_BLOCK_TYPES.keys())
