#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BASE_URL="${BASE_URL:-https://wp.hperkins.com}"
SPEC_PATH="${BROWSER_SMOKE_SPEC:-${THEME_DIR}/scripts/playwright/browser-smoke.spec.cjs}"
CONFIG_PATH="${BROWSER_SMOKE_CONFIG:-${THEME_DIR}/scripts/playwright/playwright.config.cjs}"

if ! command -v npx >/dev/null 2>&1; then
	printf "npx is required for browser smoke checks.\n" >&2
	exit 1
fi

if [[ ! -f "${SPEC_PATH}" ]]; then
	printf "Browser smoke spec not found: %s\n" "${SPEC_PATH}" >&2
	exit 1
fi

if [[ ! -f "${CONFIG_PATH}" ]]; then
	printf "Playwright config not found: %s\n" "${CONFIG_PATH}" >&2
	exit 1
fi

printf "Browser smoke against %s\n" "${BASE_URL}"

cd "${THEME_DIR}"
# CI wrappers can inject conflicting color env vars; prefer Playwright defaults.
unset NO_COLOR || true

BASE_URL="${BASE_URL}" npx playwright test "${SPEC_PATH}" --config "${CONFIG_PATH}" --workers=1 --reporter=line "$@"

printf "\nBrowser smoke passed.\n"
