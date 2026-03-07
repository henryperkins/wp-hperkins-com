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


def merge_mode(light_vars, dark_overrides):
    return {
        "light": light_vars,
        "dark": {**light_vars, **dark_overrides},
    }


def normalize(value):
    if value is None:
        return None
    return re.sub(r"\s+", " ", value).strip()


VAR_PATTERN = re.compile(r"var\(--([a-z0-9-]+)\)")


def resolve_expression(value, variables, stack=()):
    if value is None:
        return None

    def replace(match):
        token = match.group(1)
        if token in stack or token not in variables:
            return match.group(0)
        return resolve_expression(variables[token], variables, stack + (token,))

    current = value
    for _ in range(len(variables) + 5):
        updated = VAR_PATTERN.sub(replace, current)
        if updated == current:
            break
        current = updated

    return normalize(current)


source_css = read(source_css_path)
design_css = read(design_css_path)
theme_json = json.loads(read(theme_json_path))
dark_json = json.loads(read(dark_json_path))

source_modes = merge_mode(
    extract_vars(
        source_css,
        r"@layer base\s*\{\s*:root\s*\{(.*?)\n\s*\.dark\s*\{",
        "source light",
    ),
    extract_vars(
        source_css,
        r"\.dark\s*\{(.*?)\n\s*color-scheme:\s*dark;",
        "source dark",
    ),
)
design_modes = merge_mode(
    extract_vars(
        design_css,
        r":root,\s*\n\.editor-styles-wrapper\s*\{(.*?)\n\s*color-scheme:\s*light;",
        "design-system light",
    ),
    extract_vars(
        design_css,
        r":root\[data-theme=\"dark\"\],.*?\.editor-styles-wrapper\.is-dark-theme\s*\{(.*?)\n\s*color-scheme:\s*dark;",
        "design-system dark",
    ),
)

mismatches = []
check_count = 0


def expect_resolved(label, actual, expected, actual_vars, expected_vars):
    global check_count
    check_count += 1
    resolved_actual = resolve_expression(actual, actual_vars)
    resolved_expected = resolve_expression(expected, expected_vars)
    if resolved_actual != resolved_expected:
        mismatches.append((label, resolved_actual, resolved_expected))


design_tokens = sorted(source_modes["light"].keys())

for mode in ("light", "dark"):
    for token in design_tokens:
        expect_resolved(
            f"design-system {mode} --{token}",
            design_modes[mode].get(token),
            source_modes[mode].get(token),
            design_modes[mode],
            source_modes[mode],
        )

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

light_palette = {
    item["slug"]: item["color"]
    for item in theme_json["settings"]["color"]["palette"]
}

for slug in palette_slugs:
    expect_resolved(
        f"theme.json light palette {slug}",
        light_palette.get(slug),
        f"hsl(var(--{slug}))",
        design_modes["light"],
        source_modes["light"],
    )

light_gradients = {
    item["slug"]: item["gradient"]
    for item in theme_json["settings"]["color"]["gradients"]
}
for slug, token in (
    ("surface-hero", "gradient-surface-hero"),
    ("surface-card", "gradient-surface-card"),
    ("surface-emphasis", "gradient-surface-emphasis"),
):
    expect_resolved(
        f"theme.json light gradient {slug}",
        light_gradients.get(slug),
        f"var(--{token})",
        design_modes["light"],
        source_modes["light"],
    )

for label, actual, expected in (
    (
        "theme.json light styles.color.background",
        theme_json["styles"]["color"]["background"],
        "hsl(var(--background))",
    ),
    (
        "theme.json light styles.color.text",
        theme_json["styles"]["color"]["text"],
        "hsl(var(--foreground))",
    ),
    (
        "theme.json light styles.elements.link.color.text",
        theme_json["styles"]["elements"]["link"]["color"]["text"],
        "hsl(var(--link))",
    ),
    (
        "theme.json light styles.elements.link:hover.color.text",
        theme_json["styles"]["elements"]["link"][":hover"]["color"]["text"],
        "hsl(var(--link-hover))",
    ),
    (
        "theme.json light styles.elements.button.color.background",
        theme_json["styles"]["elements"]["button"]["color"]["background"],
        "hsl(var(--primary))",
    ),
    (
        "theme.json light styles.elements.button.color.text",
        theme_json["styles"]["elements"]["button"]["color"]["text"],
        "hsl(var(--primary-foreground))",
    ),
):
    expect_resolved(
        label,
        actual,
        expected,
        design_modes["light"],
        source_modes["light"],
    )

dark_settings_palette = {
    item["slug"]: item["color"]
    for item in dark_json.get("settings", {}).get("color", {}).get("palette", [])
}
for slug in palette_slugs:
    expect_resolved(
        f"ember-dark palette {slug}",
        dark_settings_palette.get(slug),
        f"hsl(var(--{slug}))",
        design_modes["dark"],
        source_modes["dark"],
    )

dark_gradients = {
    item["slug"]: item["gradient"]
    for item in dark_json.get("settings", {}).get("color", {}).get("gradients", [])
}
for slug, token in (
    ("surface-hero", "gradient-surface-hero"),
    ("surface-card", "gradient-surface-card"),
    ("surface-emphasis", "gradient-surface-emphasis"),
):
    expect_resolved(
        f"ember-dark gradient {slug}",
        dark_gradients.get(slug),
        f"var(--{token})",
        design_modes["dark"],
        source_modes["dark"],
    )

for label, actual, expected in (
    (
        "ember-dark styles.color.background",
        dark_json["styles"]["color"]["background"],
        "hsl(var(--background))",
    ),
    (
        "ember-dark styles.color.text",
        dark_json["styles"]["color"]["text"],
        "hsl(var(--foreground))",
    ),
    (
        "ember-dark styles.elements.link.color.text",
        dark_json["styles"]["elements"]["link"]["color"]["text"],
        "hsl(var(--link))",
    ),
    (
        "ember-dark styles.elements.link:hover.color.text",
        dark_json["styles"]["elements"]["link"][":hover"]["color"]["text"],
        "hsl(var(--link-hover))",
    ),
    (
        "ember-dark styles.elements.button.color.background",
        dark_json["styles"]["elements"]["button"]["color"]["background"],
        "hsl(var(--primary))",
    ),
    (
        "ember-dark styles.elements.button.color.text",
        dark_json["styles"]["elements"]["button"]["color"]["text"],
        "hsl(var(--primary-foreground))",
    ),
):
    expect_resolved(
        label,
        actual,
        expected,
        design_modes["dark"],
        source_modes["dark"],
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
    f"- Checks: `{check_count}`",
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
