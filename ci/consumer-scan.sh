#!/usr/bin/env bash
#
# consumer-scan.sh <breaking-changes.txt> <app-dir-1> [<app-dir-2> ...]
#
# Extracts "METHOD /path" entries from oasdiff's text output and greps each
# given app directory for any file referencing those paths — so we can tell
# the developer exactly which app + file will break, not just that the API
# contract changed. Supports multiple frontend apps in one repo (e.g. an
# admin panel and a student portal that both consume the same backend).
#
# Limitations (Tier 1, by design):
#   - Only catches string-literal usages, not dynamically built URLs
#     (e.g. `${basePath}/teacher/login` where basePath is a variable)
#   - Matches on path text, so a coincidental string match unrelated to an
#     actual API call is possible (rare in practice, but not impossible)
# This is meant to catch the common case fast, not be exhaustive — see the
# AST-based Tier 2 approach for lower false-positive/negative rates.

set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: consumer-scan.sh <breaking-changes.txt> <app-dir-1> [<app-dir-2> ...]" >&2
  exit 1
fi

BREAKING_FILE="$1"
shift
APP_DIRS=("$@")
OUTPUT_FILE="consumer-impact.md"

# Extract "METHOD /path" pairs from lines like: "in API POST /api/teacher/add"
mapfile -t REMOVED < <(grep -oP 'in API \K\S+ /\S+' "$BREAKING_FILE" | sort -u || true)

{
  echo "## 🔍 Consumer impact scan"
  echo ""
  echo "Searched the following apps for usages of the changed endpoints:"
  for dir in "${APP_DIRS[@]}"; do
    echo "- \`$dir\`"
  done
  echo ""
} > "$OUTPUT_FILE"

if [ ${#REMOVED[@]} -eq 0 ]; then
  echo "_No removed/renamed endpoint paths to check._" >> "$OUTPUT_FILE"
  exit 0
fi

found_any=false

for entry in "${REMOVED[@]}"; do
  method="${entry%% *}"
  path="${entry#* }"

  # Strip path params ({id}, {page}, etc.) so we match the static prefix
  search_path=$(echo "$path" | sed -E 's/\{[^}]+\}//g' | sed -E 's:/$::')

  # Also try the path without a leading /api, since frontend code often
  # calls a relative path against a configured base URL
  alt_path=$(echo "$search_path" | sed -E 's#^/api##')

  pattern=$(printf '%s\n%s\n' "$search_path" "$alt_path" | sed '/^$/d' | sort -u | paste -sd'|' -)

  endpoint_header_written=false

  for dir in "${APP_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
      continue
    fi

    matches=$(grep -rn -E "$pattern" \
      --include='*.js' --include='*.jsx' --include='*.ts' --include='*.tsx' \
      "$dir" 2>/dev/null || true)

    if [ -n "$matches" ]; then
      found_any=true
      if [ "$endpoint_header_written" = false ]; then
        {
          echo "### ⚠️ $method \`$path\`"
          echo ""
        } >> "$OUTPUT_FILE"
        endpoint_header_written=true
      fi
      {
        echo "**App: \`$dir\`**"
        echo '```'
        echo "$matches"
        echo '```'
        echo ""
      } >> "$OUTPUT_FILE"
    fi
  done
done

if [ "$found_any" = false ]; then
  echo "_No matching usages found — but this only catches string-literal paths, so double-check any dynamically-built request URLs by hand._" >> "$OUTPUT_FILE"
fi