#!/usr/bin/env bash
#
# wait-for-http.sh <url> <timeout_seconds>
#
# Polls a URL every 2s until it returns success or the timeout is hit.
# On timeout, dumps app.log (if present) so the CI failure is debuggable
# instead of just saying "timed out."

set -euo pipefail

URL="${1:?Usage: wait-for-http.sh <url> <timeout_seconds>}"
TIMEOUT="${2:-60}"
ELAPSED=0

echo "Waiting for $URL to become available (timeout ${TIMEOUT}s)..."

until curl -sf "$URL" > /dev/null 2>&1; do
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "Timed out waiting for $URL after ${TIMEOUT}s"
    echo "---- app.log ----"
    cat app.log 2>/dev/null || echo "(no app.log found)"
    exit 1
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

echo "$URL responded after ${ELAPSED}s"
