#!/usr/bin/env bash
set -euo pipefail

# Deploy Convex functions from convex/functions/ to your Convex project.
# Usage: CONVEX_PROJECT_URL=... CONVEX_SERVER_KEY=... ./scripts/deploy-convex.sh

if [ -z "${CONVEX_PROJECT_URL-}" ]; then
  echo "ERROR: CONVEX_PROJECT_URL must be set in the environment"
  exit 1
fi

echo "Starting Convex deploy..."

# Ensure the Convex CLI is available via npx
npx convex --version >/dev/null 2>&1 || {
  echo "Convex CLI not found; installing temporarily via npx"
}

# Attempt to login (will be no-op if already authenticated)
# This may open a browser; if you're running in CI, ensure CONVEX_SERVER_KEY is set and use it instead.
if [ -n "${CONVEX_SERVER_KEY-}" ]; then
  echo "Using CONVEX_SERVER_KEY for authentication (non-interactive)"
  # The CLI supports using the token through environment; deploy should pick it up.
fi

# Deploy functions folder
npx convex deploy

echo "Convex deploy finished. Check your Convex dashboard to confirm functions are live."
