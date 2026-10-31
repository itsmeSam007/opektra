#!/usr/bin/env bash
# OWASP ZAP baseline scan against local stack. Requires Docker.
set -euo pipefail

API_URL="${ZAP_TARGET:-http://localhost:18000/api/v1/health}"

echo "ZAP baseline scan target: $API_URL"

docker run --rm --network host \
  -v "$(pwd)/founder-portfolio/reports:/zap/wrk:rw" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t "$API_URL" -J zap-report.json -r zap-report.html || true

echo "Reports written to founder-portfolio/reports/ (if mount succeeded)"
