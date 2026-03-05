#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

SOURCE_CSS="${1:-${SOURCE_CSS:-$HOME/henry-s-digital-canvas/src/index.css}}"
OUT_DIR="${2:-ops/stylebook-audit}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
REPORT_FILE="${OUT_DIR}/token-sync-audit-${STAMP}.md"

if [[ ! -f "${SOURCE_CSS}" ]]; then
	printf "Source CSS not found: %s\n" "${SOURCE_CSS}" >&2
	exit 2
fi

if ! command -v python3 >/dev/null 2>&1; then
	echo "python3 is required but not found in PATH." >&2
	exit 2
fi

mkdir -p "${OUT_DIR}"

python3 - "${SOURCE_CSS}" "${THEME_DIR}/assets/css/design-system.css" "${THEME_DIR}/theme.json" "${THEME_DIR}/styles/ember-dark.json" "${REPORT_FILE}" <<'PY'
import json
import pathlib
import re
import sys


source_css_path = pathlib.Path(sys.argv[1])
design_css_path = pathlib.Path(sys.argv[2])
theme_json_path = pathlib.Path(sys.argv[3])
dark_json_path = pathlib.Path(sys.argv[4])
report_path = pathlib.Path(sys.argv[5])


def read(path):
    return path.read_text(encoding="utf-8")


def extract_vars(text, pattern, name):
    match = re.search(pattern, text, re.S)
    if not match:
        raise RuntimeError(f"Could not parse {name} token block.")
    block = match.group(1)
    return {k: v.strip() for k, v in re.findall(r"--([a-z0-9-]+)\s*:\s*([^;]+);", block)}


source_css = read(source_css_path)
design_css = read(design_css_path)
theme_json = json.loads(read(theme_json_path))
dark_json = json.loads(read(dark_json_path))

source_light = extract_vars(
    source_css,
    r"@layer base\s*\{\s*:root\s*\{(.*?)\n\s*\.dark\s*\{",
    "source light",
)
source_dark = extract_vars(
    source_css,
    r"\.dark\s*\{(.*?)\n\s*color-scheme:\s*dark;",
    "source dark",
)
design_light = extract_vars(
    design_css,
    r":root,\s*\n\.editor-styles-wrapper\s*\{(.*?)\n\s*color-scheme:\s*light;",
    "design-system light",
)
design_dark = extract_vars(
    design_css,
    r":root\[data-theme=\"dark\"\],.*?\.editor-styles-wrapper\.is-dark-theme\s*\{(.*?)\n\s*color-scheme:\s*dark;",
    "design-system dark",
)

mismatches = []


def expect(label, actual, expected):
    if actual != expected:
        mismatches.append((label, actual, expected))


core_tokens = [
    "background",
    "foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "muted",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "card",
    "card-foreground",
    "border",
    "link",
    "link-hover",
    "text-strong",
    "text-body",
    "text-subtle",
    "text-meta",
    "success",
    "warning",
    "info",
    "destructive",
]

for token in core_tokens:
    expect(
        f"design-system light --{token}",
        design_light.get(token),
        source_light.get(token),
    )
    expect(
        f"design-system dark --{token}",
        design_dark.get(token),
        source_dark.get(token),
    )

light_palette = {
    item["slug"]: item["color"]
    for item in theme_json["settings"]["color"]["palette"]
}
palette_slugs = [
    "background",
    "foreground",
    "primary",
    "secondary",
    "accent",
    "link",
    "link-hover",
    "muted",
    "card",
    "border",
    "success",
    "warning",
    "info",
    "destructive",
]

for slug in palette_slugs:
    expect(
        f"theme.json light palette {slug}",
        light_palette.get(slug),
        f"hsl({source_light.get(slug)})",
    )

light_gradients = {
    item["slug"]: item["gradient"]
    for item in theme_json["settings"]["color"]["gradients"]
}
expect(
    "theme.json light gradient surface-hero",
    light_gradients.get("surface-hero"),
    source_light.get("gradient-surface-hero"),
)
expect(
    "theme.json light gradient surface-card",
    light_gradients.get("surface-card"),
    source_light.get("gradient-surface-card"),
)
expect(
    "theme.json light gradient surface-emphasis",
    light_gradients.get("surface-emphasis"),
    source_light.get("gradient-surface-emphasis"),
)

dark_settings_palette = {
    item["slug"]: item["color"]
    for item in dark_json.get("settings", {}).get("color", {}).get("palette", [])
}
for slug in palette_slugs:
    expect(
        f"ember-dark palette {slug}",
        dark_settings_palette.get(slug),
        f"hsl({source_dark.get(slug)})",
    )

dark_gradients = {
    item["slug"]: item["gradient"]
    for item in dark_json.get("settings", {}).get("color", {}).get("gradients", [])
}
expect(
    "ember-dark gradient surface-hero",
    dark_gradients.get("surface-hero"),
    source_dark.get("gradient-surface-hero"),
)
expect(
    "ember-dark gradient surface-card",
    dark_gradients.get("surface-card"),
    source_dark.get("gradient-surface-card"),
)
expect(
    "ember-dark gradient surface-emphasis",
    dark_gradients.get("surface-emphasis"),
    source_dark.get("gradient-surface-emphasis"),
)

expect(
    "ember-dark styles.color.background",
    dark_json["styles"]["color"]["background"],
    f"hsl({source_dark['background']})",
)
expect(
    "ember-dark styles.color.text",
    dark_json["styles"]["color"]["text"],
    f"hsl({source_dark['foreground']})",
)
expect(
    "ember-dark styles.elements.link.color.text",
    dark_json["styles"]["elements"]["link"]["color"]["text"],
    f"hsl({source_dark['link']})",
)
expect(
    "ember-dark styles.elements.link:hover.color.text",
    dark_json["styles"]["elements"]["link"][":hover"]["color"]["text"],
    f"hsl({source_dark['link-hover']})",
)
expect(
    "ember-dark styles.elements.button.color.background",
    dark_json["styles"]["elements"]["button"]["color"]["background"],
    f"hsl({source_dark['primary']})",
)
expect(
    "ember-dark styles.elements.button.color.text",
    dark_json["styles"]["elements"]["button"]["color"]["text"],
    f"hsl({source_dark['primary-foreground']})",
)

status = "PASS" if not mismatches else "FAIL"

lines = [
    "# Token Sync Audit",
    "",
    f"- Status: **{status}**",
    f"- Source CSS: `{source_css_path}`",
    f"- Design system CSS: `{design_css_path}`",
    f"- Theme JSON: `{theme_json_path}`",
    f"- Dark variation JSON: `{dark_json_path}`",
    f"- Checks: `{len(core_tokens) * 2 + len(palette_slugs) * 2 + 3 + 3 + 6}`",
    f"- Mismatches: `{len(mismatches)}`",
    "",
]

if mismatches:
    lines.extend(
        [
            "## Mismatches",
            "",
            "| Check | Actual | Expected |",
            "| --- | --- | --- |",
        ]
    )
    for label, actual, expected in mismatches:
        lines.append(
            f"| `{label}` | `{'' if actual is None else actual}` | `{'' if expected is None else expected}` |"
        )

report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

print(f"REPORT_FILE={report_path}")
if mismatches:
    sys.exit(1)
PY

if [[ $? -eq 0 ]]; then
	echo "Token sync audit passed."
	echo "Report: ${REPORT_FILE}"
fi
