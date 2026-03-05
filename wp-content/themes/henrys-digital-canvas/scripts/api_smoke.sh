#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://wp.hperkins.com}"

endpoints=(
  "/wp-json/henrys-digital-canvas/v1/resume|200"
  "/wp-json/henrys-digital-canvas/v1/resume-ats|200"
  "/wp-json/henrys-digital-canvas/v1/moments|200"
  "/wp-json/henrys-digital-canvas/v1/blog?limit=3|200"
  "/wp-json/henrys-digital-canvas/v1/blog/hello-world|200"
  "/wp-json/henrys-digital-canvas/v1/work?limit=3|200"
  "/wp-json/henrys-digital-canvas/v1/work/lakefront-digital-portfolio|200"
)

failures=0
printf "API smoke against %s\n" "$BASE_URL"

for entry in "${endpoints[@]}"; do
  IFS='|' read -r path expected <<<"$entry"
  status="$(curl -sS -L -o /dev/null -w '%{http_code}' "${BASE_URL}${path}")"
  if [[ "$status" == "$expected" ]]; then
    printf "PASS\t%-70s status=%s\n" "$path" "$status"
  else
    printf "FAIL\t%-70s status=%s expected=%s\n" "$path" "$status" "$expected"
    failures=$((failures + 1))
  fi
done

if [[ $failures -gt 0 ]]; then
  printf "\nAPI smoke failed: %d issue(s).\n" "$failures"
  exit 1
fi

printf "\nAPI smoke passed.\n"
