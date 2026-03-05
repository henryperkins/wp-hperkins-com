#!/usr/bin/env bash
# smoke_cron.sh — Cron-compatible wrapper for smoke cadence runs.
#
# This script sets up the environment needed to run the full smoke suite
# from a cron job (where PATH, working directory, and node may not be
# available by default).
#
# Usage:
#   Add to crontab:
#     # Daily at 06:00 UTC
#     0 6 * * * /path/to/henrys-digital-canvas/scripts/smoke_cron.sh
#
#     # Every Monday at 06:00 UTC
#     0 6 * * 1 /path/to/henrys-digital-canvas/scripts/smoke_cron.sh
#
#   Override defaults:
#     RUN_LABEL=deploy-hotfix BASE_URL=https://staging.example.com \
#       /path/to/henrys-digital-canvas/scripts/smoke_cron.sh
#
# Log rotation:
#   Cadence logs older than 90 days are automatically pruned on each run.
#   Adjust RETENTION_DAYS below to change the retention window.

set -euo pipefail

RETENTION_DAYS="${RETENTION_DAYS:-90}"

# Resolve theme root relative to this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
THEME_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Ensure node/npm are available (common cron PATH issue)
for NODE_DIR in /usr/local/bin /usr/bin "$HOME/.nvm/versions/node"/*/bin; do
  if [ -d "$NODE_DIR" ] && command -v "$NODE_DIR/node" >/dev/null 2>&1; then
    export PATH="$NODE_DIR:$PATH"
    break
  fi
done

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node not found in PATH. Cannot run smoke suite." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found in PATH. Cannot run smoke suite." >&2
  exit 1
fi

# Set working directory to theme root
cd "$THEME_DIR"

# Default label includes ISO date for cron-triggered runs
export RUN_LABEL="${RUN_LABEL:-cron-$(date -u +%Y-%m-%d)}"

# Run cadence
./scripts/smoke_cadence.sh
EXIT_CODE=$?

# Prune old cadence logs (keep last RETENTION_DAYS days)
if [ -d "$THEME_DIR/ops" ]; then
  find "$THEME_DIR/ops" -name 'smoke-20*.log' -type f -mtime +"$RETENTION_DAYS" -delete 2>/dev/null || true
fi

exit $EXIT_CODE
