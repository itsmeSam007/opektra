#!/bin/sh
# Forward Compose subcommands without sourcing env files or printing secrets.
set -eu
opektra_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
opektra_mode=${1:-}
if [ "$#" -gt 0 ]; then shift; fi

case "$opektra_mode" in
  local)
    opektra_project=portfolio
    opektra_env=${OPEKTRA_LOCAL_ENV_FILE:-$opektra_root/.env.local}
    # Local defaults are sufficient; never implicitly load .env or .env.prod.
    if [ ! -f "$opektra_env" ]; then
      if [ -n "${OPEKTRA_LOCAL_ENV_FILE:-}" ]; then
        printf 'Local env file does not exist: %s\n' "$opektra_env" >&2
        exit 1
      fi
      opektra_env=/dev/null
    fi
    ;;
  prod)
    opektra_project=opektra-prod
    opektra_env=${OPEKTRA_PROD_ENV_FILE:-$opektra_root/.env.prod}
    if [ ! -f "$opektra_env" ]; then
      printf 'Create .env.prod from .env.prod.example and fill in production secrets first.\n' >&2
      exit 1
    fi
    ;;
  *)
    printf 'Usage: docker-local|docker-prod <compose command> [options]\n' >&2
    exit 2
    ;;
esac

if [ "$#" -eq 0 ]; then set -- ps; fi
exec docker compose \
  --project-directory "$opektra_root" \
  --env-file "$opektra_env" \
  --project-name "$opektra_project" \
  --file "$opektra_root/docker-compose.$opektra_mode.yml" "$@"
