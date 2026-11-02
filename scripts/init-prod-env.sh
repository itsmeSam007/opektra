#!/bin/sh
# Create server-only secrets without printing them or overwriting an existing env.
set -eu
umask 077
opektra_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
opektra_target=${OPEKTRA_PROD_ENV_FILE:-$opektra_root/.env.prod}

if [ -e "$opektra_target" ] || [ -L "$opektra_target" ]; then
  printf 'Production env already exists; preserved: %s\n' "$opektra_target" >&2
  exit 1
fi
command -v openssl >/dev/null 2>&1 || {
  printf 'Install OpenSSL before generating production secrets.\n' >&2
  exit 1
}
opektra_tmp=$(mktemp "${opektra_target}.XXXXXX")
trap 'rm -f "$opektra_tmp"' EXIT HUP INT TERM
while IFS= read -r opektra_line || [ -n "$opektra_line" ]; do
  case "$opektra_line" in
    POSTGRES_PASSWORD=|SECRET_KEY=|ADMIN_PASSWORD=)
      opektra_secret=$(openssl rand -hex 32)
      printf '%s%s\n' "$opektra_line" "$opektra_secret"
      ;;
    *) printf '%s\n' "$opektra_line" ;;
  esac
done < "$opektra_root/.env.prod.example" > "$opektra_tmp"
# Atomic no-overwrite creation, including if another process created the target.
ln "$opektra_tmp" "$opektra_target"
printf 'Created private production env: %s\nReview domain/email settings before deployment. Secrets were not printed.\n' "$opektra_target"
