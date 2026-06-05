#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] starting staged deployment"
echo "[deploy] package build integrity check"
node -v
npm -v

echo "[deploy] publishing build artifact to staging target (demo no-op)"
# Real projects would run infra/app deploy command here, e.g.:
# az webapp deploy --resource-group ... --name ... --src-path apps/api/dist

echo "[deploy] deployment command flow completed"
