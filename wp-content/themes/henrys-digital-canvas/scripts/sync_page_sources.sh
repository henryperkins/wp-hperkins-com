#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
WP_ROOT="${WP_ROOT:-$(cd "${THEME_DIR}/../../.." && pwd)}"

wp --path="${WP_ROOT}" eval-file "${SCRIPT_DIR}/sync_page_sources.php"
