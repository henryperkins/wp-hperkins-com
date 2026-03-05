#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
HISTORY_FILE="${THEME_DIR}/ops/smoke-history.log"
COUNT="${1:-10}"

if [[ ! -f "${HISTORY_FILE}" ]]; then
	printf "No smoke history found at %s\n" "${HISTORY_FILE}"
	exit 0
fi

if ! [[ "${COUNT}" =~ ^[0-9]+$ ]]; then
	printf "Count must be a positive integer.\n" >&2
	exit 1
fi

printf "Latest smoke cadence entries (%s)\n" "${HISTORY_FILE}"
tail -n "${COUNT}" "${HISTORY_FILE}"
