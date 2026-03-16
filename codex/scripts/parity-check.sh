#!/usr/bin/env bash
# Run a parity check on a single block via Codex CLI.
#
# Usage:
#   ./codex/scripts/parity-check.sh <block-name>
#   ./codex/scripts/parity-check.sh home-page
#   ./codex/scripts/parity-check.sh --all        # batch mode (all blocks)
#
# Requires: codex CLI installed (npm i -g @openai/codex)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

if [[ "${1:-}" == "" ]]; then
  echo "Usage: $0 <block-name>  or  $0 --all"
  echo ""
  echo "Available blocks:"
  echo "  home-page, about-timeline, work-showcase, work-detail,"
  echo "  resume-overview, resume-ats, hobbies-moments, blog-index,"
  echo "  blog-post, contact-form, not-found, site-shell"
  exit 1
fi

if [[ "$1" == "--all" ]]; then
  AGENT="$SCRIPT_DIR/../agents/batch-parity.md"
  PROMPT="Run parity checks on all blocks and produce the aggregated report."
else
  BLOCK="$1"
  AGENT="$SCRIPT_DIR/../agents/parity-checker.md"
  PROMPT="Run a parity check on the '$BLOCK' block. Compare it against its source React TSX component."
fi

echo "==> Parity check: ${1}"
echo "==> Agent: $AGENT"
echo ""

CODEX_ARGS=(exec -C "$PROJECT_ROOT" --skip-git-repo-check --color never)

if [[ -n "${CODEX_OUTPUT_FILE:-}" ]]; then
  CODEX_ARGS+=( -o "$CODEX_OUTPUT_FILE" )
fi

exec codex "${CODEX_ARGS[@]}" - < <(
  cat "$AGENT"
  printf '\n\n%s\n' "$PROMPT"
)
