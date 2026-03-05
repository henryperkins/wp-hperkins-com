#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-ops/stylebook-audit}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
MERGED_JSON="${OUT_DIR}/merged-global-styles-${STAMP}.json"
BLOCKS_TXT="${OUT_DIR}/merged-block-keys-${STAMP}.txt"
LEAKS_TXT="${OUT_DIR}/parent-token-leaks-${STAMP}.txt"

PARENT_TOKEN_REGEX='wp--preset--color--accent-|wp--preset--color--contrast|wp--preset--font-family--fira-code|wp--preset--font-family--manrope|wp--preset--spacing--[0-9]{2}|wp--preset--font-size--(small|medium|large|x-large|xx-large)'

if ! command -v wp >/dev/null 2>&1; then
	echo "wp-cli is required but not found in PATH." >&2
	exit 2
fi

mkdir -p "${OUT_DIR}"

wp eval 'echo wp_json_encode( wp_get_global_styles(), JSON_PRETTY_PRINT );' --allow-root > "${MERGED_JSON}"
wp eval '$blocks = array_keys( wp_get_global_styles()["blocks"] ?? array() ); sort( $blocks ); foreach ( $blocks as $block ) { echo $block . PHP_EOL; }' --allow-root > "${BLOCKS_TXT}"

if rg -n "${PARENT_TOKEN_REGEX}" "${MERGED_JSON}" > "${LEAKS_TXT}"; then
	echo "Parent-style token references are still present."
	echo "Merged styles: ${MERGED_JSON}"
	echo "Leaks file: ${LEAKS_TXT}"
	echo "Block keys: ${BLOCKS_TXT}"
	exit 1
fi

echo "No parent-style token leaks detected."
echo "Merged styles: ${MERGED_JSON}"
echo "Block keys: ${BLOCKS_TXT}"
