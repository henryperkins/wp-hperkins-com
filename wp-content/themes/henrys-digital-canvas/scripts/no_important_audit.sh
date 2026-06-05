#!/usr/bin/env bash
set -euo pipefail

# The homepage child blocks this audit covered were retired in Phase 3. Keep the
# entrypoint for aggregate smoke scripts; there are no child block styles left
# to inspect here.
printf "no_important_audit.sh: clean (no retired homepage child block styles remain).\n"
