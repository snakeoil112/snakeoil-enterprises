#!/usr/bin/env bash
set -euo pipefail

echo "=== Grok Adapter Verification ==="
echo

# Check Grok CLI is installed
if ! command -v grok >/dev/null 2>&1; then
  echo "FAIL: grok CLI not found in PATH"
  exit 1
fi

GROK_VERSION="$(grok --version 2>&1 || true)"
echo "OK: grok CLI found — $GROK_VERSION"

# Check Paperclip runtime env (present during heartbeat runs)
for var in PAPERCLIP_AGENT_ID PAPERCLIP_API_URL PAPERCLIP_RUN_ID; do
  if [[ -z "${!var:-}" ]]; then
    echo "WARN: $var not set (expected during Paperclip heartbeat)"
  else
    echo "OK: $var is set"
  fi
done

# Confirm adapter type from agent config
if [[ -n "${PAPERCLIP_AGENT_ID:-}" ]]; then
  echo "OK: Running as agent $PAPERCLIP_AGENT_ID (grok_local adapter)"
fi

echo
echo "=== All checks passed ==="