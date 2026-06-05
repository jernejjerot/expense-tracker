#!/usr/bin/env bash
set -euo pipefail

TARGET_URL="${1:-https://example-staging.invalid/health}"

echo "[health-check] checking ${TARGET_URL}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${TARGET_URL}" || true)

if [[ "${HTTP_CODE}" != "200" ]]; then
  echo "[health-check] failed with code ${HTTP_CODE}"
  exit 1
fi

echo "[health-check] success"
