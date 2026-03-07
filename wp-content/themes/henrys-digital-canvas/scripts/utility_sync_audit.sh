#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

SOURCE_CSS="${1:-${SOURCE_CSS:-$HOME/henry-s-digital-canvas/src/index.css}}"
OUT_DIR="${2:-ops/stylebook-audit}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
REPORT_FILE="${OUT_DIR}/utility-sync-audit-${STAMP}.md"

if [[ ! -f "${SOURCE_CSS}" ]]; then
	printf "Source CSS not found: %s\n" "${SOURCE_CSS}" >&2
	exit 2
fi

mkdir -p "${OUT_DIR}"

python3 - "${SOURCE_CSS}" "${THEME_DIR}/assets/css/design-system.css" "${REPORT_FILE}" <<'PY'
import pathlib
import re
import sys

source_css_path = pathlib.Path(sys.argv[1])
theme_css_path = pathlib.Path(sys.argv[2])
report_path = pathlib.Path(sys.argv[3])

source_css = source_css_path.read_text(encoding="utf-8")
theme_css = theme_css_path.read_text(encoding="utf-8")

source_utilities = re.findall(r"^@utility\s+([A-Za-z0-9_-]+)\s*\{", source_css, re.M)
theme_selectors = {
    match.group(1)
    for match in re.finditer(r"^\.([A-Za-z0-9_-]+)(?=[\s:{.,])", theme_css, re.M)
}

missing_utilities = sorted({name for name in source_utilities if name not in theme_selectors})

source_keyframes = sorted(set(re.findall(r"^@keyframes\s+([A-Za-z0-9_-]+)\s*\{", source_css, re.M)))
theme_keyframes = sorted(set(re.findall(r"^@keyframes\s+([A-Za-z0-9_-]+)\s*\{", theme_css, re.M)))
missing_keyframes = sorted(set(source_keyframes) - set(theme_keyframes))

status = "PASS" if not missing_utilities and not missing_keyframes else "FAIL"

lines = [
    "# Utility Sync Audit",
    "",
    f"- Status: **{status}**",
    f"- Source CSS: `{source_css_path}`",
    f"- Theme CSS: `{theme_css_path}`",
    f"- Utility count: `{len(source_utilities)}`",
    f"- Missing utilities: `{len(missing_utilities)}`",
    f"- Missing keyframes: `{len(missing_keyframes)}`",
    "",
]

if missing_utilities:
    lines.extend(["## Missing Utilities", ""])
    lines.extend([f"- `{name}`" for name in missing_utilities])
    lines.append("")

if missing_keyframes:
    lines.extend(["## Missing Keyframes", ""])
    lines.extend([f"- `{name}`" for name in missing_keyframes])
    lines.append("")

report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"REPORT_FILE={report_path}")

if status != "PASS":
    sys.exit(1)
PY

echo "Utility sync audit passed."
echo "Report: ${REPORT_FILE}"
