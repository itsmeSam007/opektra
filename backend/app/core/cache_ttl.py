"""Shared Redis cache TTL constants (seconds)."""

# Hot public reads — align with Next.js ISR (3600s) where applicable
PUBLIC_LIST_TTL = 300
PUBLIC_DETAIL_TTL = 300
PUBLIC_SETTINGS_TTL = 300
SEARCH_TTL = 60
INTEGRATION_TTL = 60
