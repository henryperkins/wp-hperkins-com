#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_BROWSER_SMOKE="${RUN_BROWSER_SMOKE:-1}"

"${SCRIPT_DIR}/route_smoke.sh"
"${SCRIPT_DIR}/api_smoke.sh"

if [[ "${RUN_BROWSER_SMOKE}" == "1" ]]; then
	"${SCRIPT_DIR}/browser_smoke.sh"
else
	printf "Browser smoke skipped (RUN_BROWSER_SMOKE=%s).\n" "${RUN_BROWSER_SMOKE}"
fi

printf "\nFull smoke suite passed.\n"
