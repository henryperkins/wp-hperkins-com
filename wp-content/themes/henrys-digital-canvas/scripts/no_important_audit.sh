#!/usr/bin/env bash
set -euo pipefail

# Verifies the home-page child blocks do not use `!important` on properties
# that block-supports inline styles would otherwise override.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

CHILDREN=(
	home-hero
	home-selected-work
	home-throughline
	home-resume-snapshot
	home-recent-writing
	home-contact-cta
)

# Properties covered by `supports` for these children; if a child sets any
# of these as `!important`, user customization in the editor cannot win.
SUPPORTS_PROPS_REGEX='(padding|margin|border(-(top|right|bottom|left|color|style|width|radius))?|background(-color|-image)?|color|font-(size|family|weight)|line-height|text-align|min-height|gap|row-gap|column-gap)'

leaks=0
for child in "${CHILDREN[@]}"; do
	css="${THEME_DIR}/blocks/${child}/style.css"
	if [[ ! -f "${css}" ]]; then
		printf "Missing: %s (will be created in later tasks)\n" "${css}" >&2
		continue
	fi
	hits=$(grep -nE "^[^/]*\\b${SUPPORTS_PROPS_REGEX}\\b\\s*:.+!important" "${css}" || true)
	if [[ -n "${hits}" ]]; then
		printf "[FAIL] %s contains !important on supports-covered properties:\n%s\n" "${css}" "${hits}" >&2
		leaks=$((leaks + 1))
	fi
done

if (( leaks > 0 )); then
	printf "\nno_important_audit.sh: %d file(s) contain disallowed !important.\n" "${leaks}" >&2
	exit 1
fi

printf "no_important_audit.sh: clean.\n"
