#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "=== CI Verification ==="
echo "Workspace: $ROOT_DIR"
echo

echo ">> Production build"
npm run build:web
echo

echo ">> Verification"
if command -v grok >/dev/null 2>&1; then
  npm run verify
else
  echo "WARN: grok CLI not available — running verify:tooling only"
  npm run verify:tooling
fi

echo
echo "=== CI verification passed ==="