"""RBAC permission codes and role definitions per Authentication_API.md."""

from typing import Final

# Permission codes
PERMISSIONS: Final[list[tuple[str, str]]] = [
    ("users:read", "List and view admin users"),
    ("users:write", "Create, update, and deactivate users"),
    ("roles:read", "View roles and permission matrix"),
    ("roles:write", "Manage roles and permissions"),
    ("settings:read", "View site settings"),
    ("products:read", "View products"),
    ("products:write", "Create, update, and delete products"),
    ("blog:read", "View blog posts"),
    ("blog:write", "Create, update, and delete blog posts"),
    ("portfolio:read", "View portfolio items"),
    ("portfolio:write", "Create, update, and delete portfolio items"),
    ("case_studies:read", "View case studies"),
    ("case_studies:write", "Create, update, and delete case studies"),
    ("testimonials:read", "View testimonials"),
    ("testimonials:write", "Create, update, and delete testimonials"),
    ("inquiries:read", "View contact and acquisition inquiries"),
    ("inquiries:write", "Manage inquiries and contact submissions"),
    ("contact:read", "View contact inbox"),
    ("contact:write", "Update and delete contact submissions"),
    ("settings:write", "Update site settings and integrations"),
    ("analytics:read", "View analytics dashboards"),
    ("cms:read", "View CMS pages and drafts"),
    ("cms:write", "Create and edit CMS pages and blocks"),
    ("cms:publish", "Publish or schedule CMS pages"),
    ("cms:delete", "Delete CMS pages"),
    ("travel:read", "View travel entries"),
    ("travel:write", "Create, update, and delete travel entries"),
    ("galleries:read", "View gallery albums"),
    ("galleries:write", "Create, update, and delete gallery albums"),
    ("media:read", "View media library"),
    ("media:write", "Upload and manage media assets"),
    ("audit:read", "View audit logs"),
    ("monitoring:read", "View system monitoring and health"),
]

ALL_PERMISSION_CODES: Final[frozenset[str]] = frozenset(code for code, _ in PERMISSIONS)

ROLE_DEFINITIONS: Final[dict[str, dict]] = {
    "super_admin": {
        "description": "Full platform access",
        "permissions": ALL_PERMISSION_CODES,
    },
    "admin": {
        "description": "All access except role management",
        "permissions": ALL_PERMISSION_CODES - {"roles:write"},
    },
    "editor": {
        "description": "Read all; write content modules only",
        "permissions": frozenset(
            code
            for code in ALL_PERMISSION_CODES
            if code.endswith(":read")
            or code
            in {
                "products:write",
                "blog:write",
                "portfolio:write",
                "case_studies:write",
                "testimonials:write",
                "cms:write",
                "travel:write",
                "galleries:write",
            }
        ),
    },
    "viewer": {
        "description": "Read-only access",
        "permissions": frozenset(code for code in ALL_PERMISSION_CODES if code.endswith(":read")),
    },
}
