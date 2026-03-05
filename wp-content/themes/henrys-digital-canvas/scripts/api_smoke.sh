#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://wp.hperkins.com}"
BLOG_LIMIT="${BLOG_LIMIT:-3}"
BLOG_DETAIL_SLUG="${BLOG_DETAIL_SLUG:-wordpress-ai-use-cases-developers-admins}"

endpoints=(
  "/wp-json/henrys-digital-canvas/v1/resume|200"
  "/wp-json/henrys-digital-canvas/v1/resume-ats|200"
  "/wp-json/henrys-digital-canvas/v1/moments|200"
  "/wp-json/henrys-digital-canvas/v1/blog?limit=${BLOG_LIMIT}|200"
  "/wp-json/henrys-digital-canvas/v1/blog/${BLOG_DETAIL_SLUG}|200"
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

blog_list_payload="$(curl -sS -L "${BASE_URL}/wp-json/henrys-digital-canvas/v1/blog?limit=${BLOG_LIMIT}")"
if jq -e '
  (.posts | type == "array") and
  (.posts | length > 0) and
  (all(.posts[]; has("featuredImageUrl") and has("featuredImageAlt") and has("featuredImageSrcSet"))) and
  (all(.posts[]; (.featuredImageUrl == null or (.featuredImageUrl | type == "string")) and (.featuredImageAlt == null or (.featuredImageAlt | type == "string")) and (.featuredImageSrcSet == null or (.featuredImageSrcSet | type == "string"))))
' >/dev/null <<<"$blog_list_payload"; then
  printf "PASS\t%-70s fields=featuredImageUrl,featuredImageAlt,featuredImageSrcSet\n" "/wp-json/henrys-digital-canvas/v1/blog?limit=${BLOG_LIMIT}"
else
  printf "FAIL\t%-70s media field contract check failed\n" "/wp-json/henrys-digital-canvas/v1/blog?limit=${BLOG_LIMIT}"
  failures=$((failures + 1))
fi

blog_detail_payload="$(curl -sS -L "${BASE_URL}/wp-json/henrys-digital-canvas/v1/blog/${BLOG_DETAIL_SLUG}")"
if jq -e '
  (.slug | type == "string") and
  (has("featuredImageUrl") and has("featuredImageAlt") and has("featuredImageSrcSet")) and
  (.featuredImageUrl == null or (.featuredImageUrl | type == "string")) and
  (.featuredImageAlt == null or (.featuredImageAlt | type == "string")) and
  (.featuredImageSrcSet == null or (.featuredImageSrcSet | type == "string"))
' >/dev/null <<<"$blog_detail_payload"; then
  printf "PASS\t%-70s fields=featuredImageUrl,featuredImageAlt,featuredImageSrcSet\n" "/wp-json/henrys-digital-canvas/v1/blog/${BLOG_DETAIL_SLUG}"
else
  printf "FAIL\t%-70s media field contract check failed\n" "/wp-json/henrys-digital-canvas/v1/blog/${BLOG_DETAIL_SLUG}"
  failures=$((failures + 1))
fi

if [[ $failures -gt 0 ]]; then
  printf "\nAPI smoke failed: %d issue(s).\n" "$failures"
  exit 1
fi

printf "\nAPI smoke passed.\n"
