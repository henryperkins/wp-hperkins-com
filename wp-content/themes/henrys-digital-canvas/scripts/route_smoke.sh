#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://wp.hperkins.com}"
WORK_DETAIL_REPO="${WORK_DETAIL_REPO:-henry-s-digital-canvas}"

routes=(
  "/|200|hdc-home-page"
  "/work/|200|hdc-work-showcase"
  "/work/${WORK_DETAIL_REPO}/|200|hdc-work-detail"
  "/resume/|200|hdc-resume-overview|Loading resume"
  "/resume/ats/|200|hdc-resume-ats|Loading ATS resume"
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
  IFS='|' read -r path expected marker forbidden <<<"$entry"
  tmp="$(mktemp)"
  status="$(curl -sS -L -o "$tmp" -w '%{http_code}' "${BASE_URL}${path}")"

  marker_ok="no"
  if rg -q "$marker" "$tmp"; then
    marker_ok="yes"
  fi

  forbidden_ok="yes"
  if [[ -n "${forbidden:-}" ]] && rg -q "$forbidden" "$tmp"; then
    forbidden_ok="no"
  fi

  if [[ "$status" == "$expected" && "$marker_ok" == "yes" && "$forbidden_ok" == "yes" ]]; then
    printf "PASS\t%-45s status=%s marker=%s\n" "$path" "$status" "$marker"
  else
    printf "FAIL\t%-45s status=%s expected=%s marker=%s marker_found=%s forbidden=%s forbidden_clear=%s\n" "$path" "$status" "$expected" "$marker" "$marker_ok" "${forbidden:-none}" "$forbidden_ok"
    failures=$((failures + 1))
  fi

  rm -f "$tmp"
done

if [[ $failures -gt 0 ]]; then
  printf "\nRoute smoke failed: %d issue(s).\n" "$failures"
  exit 1
fi

printf "\nRoute smoke passed.\n"
