#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WP_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

WP_LOCAL_HOST="${WP_LOCAL_HOST:-127.0.0.1}"
WP_LOCAL_PORT="${WP_LOCAL_PORT:-8890}"
WP_LOCAL_URL="${WP_LOCAL_URL:-http://localhost:${WP_LOCAL_PORT}}"

# WP-CLI 2.12 emits its own deprecation notices on PHP 8.5; keep command
# output readable while preserving regular errors.
export WP_CLI_PHP_ARGS="${WP_CLI_PHP_ARGS:--d error_reporting=6143}"

if ! command -v wp >/dev/null 2>&1; then
	printf "ERROR: wp command not found.\n" >&2
	exit 1
fi

if ! wp --path="${WP_ROOT}" core is-installed >/dev/null 2>&1; then
	printf "ERROR: WordPress is not installed. Run codex/scripts/setup-native-wordpress.sh first.\n" >&2
	exit 1
fi

wp --path="${WP_ROOT}" option update home "${WP_LOCAL_URL}" >/dev/null
wp --path="${WP_ROOT}" option update siteurl "${WP_LOCAL_URL}" >/dev/null
wp --path="${WP_ROOT}" rewrite flush >/dev/null

printf "Starting WordPress at %s\n" "${WP_LOCAL_URL}"
printf "Press Ctrl+C to stop.\n"

exec wp --path="${WP_ROOT}" server --host="${WP_LOCAL_HOST}" --port="${WP_LOCAL_PORT}"
