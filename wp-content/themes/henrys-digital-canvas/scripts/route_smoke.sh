#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://wp.hperkins.com}"

routes=(
  "/|200|hdc-digital-canvas-feed"
  "/work/|200|hdc-work-app"
  "/work/lakefront-digital-portfolio/|200|hdc-work-detail"
  "/resume/|200|hdc-resume-overview"
  "/resume/ats/|200|hdc-resume-ats"
  "/hobbies/|200|hdc-hobbies-moments"
  "/blog/|200|hdc-blog-index"
  "/blog/wordpress-ai-use-cases-developers-admins/|200|hdc-blog-post"
  "/about/|200|hdc-about-timeline"
  "/contact/|200|hdc-contact-form"
  "/route-should-not-exist/|404|hdc-not-found"
)

failures=0
printf "Route smoke against %s\n" "$BASE_URL"

for entry in "${routes[@]}"; do
  IFS='|' read -r path expected marker <<<"$entry"
  tmp="$(mktemp)"
  status="$(curl -sS -L -o "$tmp" -w '%{http_code}' "${BASE_URL}${path}")"

  marker_ok="no"
  if rg -q "$marker" "$tmp"; then
    marker_ok="yes"
  fi

  if [[ "$status" == "$expected" && "$marker_ok" == "yes" ]]; then
    printf "PASS\t%-45s status=%s marker=%s\n" "$path" "$status" "$marker"
  else
    printf "FAIL\t%-45s status=%s expected=%s marker=%s marker_found=%s\n" "$path" "$status" "$expected" "$marker" "$marker_ok"
    failures=$((failures + 1))
  fi

  rm -f "$tmp"
done

if [[ $failures -gt 0 ]]; then
  printf "\nRoute smoke failed: %d issue(s).\n" "$failures"
  exit 1
fi

printf "\nRoute smoke passed.\n"
