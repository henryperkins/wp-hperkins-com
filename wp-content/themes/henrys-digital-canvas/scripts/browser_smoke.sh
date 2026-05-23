#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BASE_URL="${BASE_URL:-https://wp.hperkins.com}"
SPEC_PATH="${BROWSER_SMOKE_SPEC:-${THEME_DIR}/scripts/playwright/browser-smoke.spec.cjs}"
PARITY_SPEC_PATH="${HOME_PARITY_SPEC:-${THEME_DIR}/scripts/playwright/home-parity.spec.cjs}"
CONFIG_PATH="${BROWSER_SMOKE_CONFIG:-${THEME_DIR}/scripts/playwright/playwright.config.cjs}"
TARGET_BASE_URL="${TARGET_BASE_URL:-${BASE_URL}}"

normalize_base_url() {
	local value="${1:-}"
	while [[ "${value}" == */ ]]; do
		value="${value%/}"
	done
	printf "%s" "${value}"
}

if ! command -v npx >/dev/null 2>&1; then
	printf "npx is required for browser smoke checks.\n" >&2
	exit 1
fi

for spec in "${SPEC_PATH}" "${PARITY_SPEC_PATH}"; do
	if [[ ! -f "${spec}" ]]; then
		printf "Browser smoke spec not found: %s\n" "${spec}" >&2
		exit 1
	fi
done

if [[ ! -f "${CONFIG_PATH}" ]]; then
	printf "Playwright config not found: %s\n" "${CONFIG_PATH}" >&2
	exit 1
fi

printf "Browser smoke against %s\n" "${BASE_URL}"

if [[ "${RUN_HOME_PARITY:-0}" == "1" ]]; then
	if [[ -z "${SOURCE_BASE_URL:-}" ]]; then
		printf "RUN_HOME_PARITY=1 requires SOURCE_BASE_URL so the parity gate cannot self-compare.\n" >&2
		exit 1
	fi

	if [[ "$(normalize_base_url "${SOURCE_BASE_URL}")" == "$(normalize_base_url "${TARGET_BASE_URL}")" ]]; then
		printf "RUN_HOME_PARITY=1 requires SOURCE_BASE_URL to differ from TARGET_BASE_URL (%s).\n" "${TARGET_BASE_URL}" >&2
		exit 1
	fi
fi

cd "${THEME_DIR}"
# CI wrappers can inject conflicting color env vars; prefer Playwright defaults.
unset NO_COLOR || true

BASE_URL="${BASE_URL}" npx playwright test "${SPEC_PATH}" --config "${CONFIG_PATH}" --workers=1 --reporter=line "$@"

if [[ "${RUN_HOME_PARITY:-0}" == "1" ]]; then
	printf "\nHome parity check against %s vs %s\n" "${TARGET_BASE_URL}" "${SOURCE_BASE_URL}"
	BASE_URL="${BASE_URL}" SOURCE_BASE_URL="${SOURCE_BASE_URL}" TARGET_BASE_URL="${TARGET_BASE_URL}" npx playwright test "${PARITY_SPEC_PATH}" --config "${CONFIG_PATH}" --workers=1 --reporter=line
fi

printf "\nBrowser smoke passed.\n"
