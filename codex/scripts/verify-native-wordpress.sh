#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WP_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
THEME_DIR="${WP_ROOT}/wp-content/themes/henrys-digital-canvas"

WP_LOCAL_PORT="${WP_LOCAL_PORT:-8890}"
WP_LOCAL_URL="${WP_LOCAL_URL:-http://localhost:${WP_LOCAL_PORT}}"
REQUIRED_PAGES=(home work resume hobbies blog about contact)

# WP-CLI 2.12 emits its own deprecation notices on PHP 8.5; keep command
# substitution output parseable while preserving regular errors.
export WP_CLI_PHP_ARGS="${WP_CLI_PHP_ARGS:--d error_reporting=6143}"

fail() {
	printf "FAIL: %s\n" "$*" >&2
	exit 1
}

pass() {
	printf "PASS: %s\n" "$*"
}

require_command() {
	if ! command -v "$1" >/dev/null 2>&1; then
		fail "Required command not found: $1"
	fi
}

run_wp() {
	wp --path="${WP_ROOT}" "$@"
}

require_command wp
require_command curl
require_command npm

run_wp core is-installed >/dev/null
pass "WordPress database is installed"

run_wp theme is-active henrys-digital-canvas >/dev/null
pass "henrys-digital-canvas theme is active"

home_url="$(run_wp option get home)"
site_url="$(run_wp option get siteurl)"

if [[ "${home_url}" != "${WP_LOCAL_URL}" || "${site_url}" != "${WP_LOCAL_URL}" ]]; then
	fail "home/siteurl mismatch: home=${home_url} siteurl=${site_url} expected=${WP_LOCAL_URL}"
fi
pass "home and siteurl match ${WP_LOCAL_URL}"

for page_slug in "${REQUIRED_PAGES[@]}"; do
	page_id="$(run_wp post list --post_type=page --name="${page_slug}" --field=ID --format=ids)"
	if [[ -z "${page_id}" ]]; then
		fail "Required page is missing: ${page_slug}"
	fi
	pass "Page exists: ${page_slug} (ID ${page_id})"
done

status="$(curl -sS -L -o /tmp/hdc-local-blog.json -w '%{http_code}' "${WP_LOCAL_URL}/wp-json/henrys-digital-canvas/v1/blog?limit=1")"
if [[ "${status}" != "200" ]]; then
	fail "Blog REST endpoint returned status ${status}"
fi
pass "Blog REST endpoint returned 200"

(
	cd "${THEME_DIR}"
	BASE_URL="${WP_LOCAL_URL}" npm run smoke:route
)
pass "Route smoke passed"

(
	cd "${THEME_DIR}"
	BASE_URL="${WP_LOCAL_URL}" npm run smoke:api
)
pass "API smoke passed"

printf "\nNative WordPress verification passed for %s\n" "${WP_LOCAL_URL}"
