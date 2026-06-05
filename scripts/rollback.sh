#!/usr/bin/env bash
set -euo pipefail

echo "[rollback] deployment health-check failed, rolling back"
# Real projects would restore previous release here.
# Example: helm rollback expense-tracker --namespace staging

echo "[rollback] rollback command path completed"
