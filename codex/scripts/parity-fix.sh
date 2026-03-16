#!/usr/bin/env bash
# Run the full parity fix pipeline on a single block via Codex CLI.
#
# Usage:
#   ./codex/scripts/parity-fix.sh <block-name>
#   ./codex/scripts/parity-fix.sh home-page
#
# Requires: codex CLI installed (npm i -g @openai/codex)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

if [[ "${1:-}" == "" ]]; then
  echo "Usage: $0 <block-name>"
  echo ""
  echo "Available blocks:"
  echo "  home-page, about-timeline, work-showcase, work-detail,"
  echo "  resume-overview, resume-ats, hobbies-moments, blog-index,"
  echo "  blog-post, contact-form, not-found, site-shell"
  exit 1
fi

BLOCK="$1"
AGENT="$SCRIPT_DIR/../agents/parity-fixer.md"

echo "==> Parity fix: $BLOCK"
echo "==> Agent: $AGENT"
echo ""

PROMPT="Run the full parity fix pipeline on the '$BLOCK' block. Check it against its source React TSX, triage the gaps, implement fixes, validate with syntax checks and smoke tests, then verify."

CODEX_ARGS=(exec -C "$PROJECT_ROOT" --skip-git-repo-check --color never)

if [[ -n "${CODEX_OUTPUT_FILE:-}" ]]; then
  CODEX_ARGS+=( -o "$CODEX_OUTPUT_FILE" )
fi

exec codex "${CODEX_ARGS[@]}" - < <(
  cat "$AGENT"
  printf '\n\n%s\n' "$PROMPT"
)
