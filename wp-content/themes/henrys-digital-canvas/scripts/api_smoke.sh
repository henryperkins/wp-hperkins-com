#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://wp.hperkins.com}"
BLOG_LIMIT="${BLOG_LIMIT:-3}"
BLOG_DETAIL_SLUG="${BLOG_DETAIL_SLUG:-}"
WORK_DETAIL_REPO="${WORK_DETAIL_REPO:-henry-s-digital-canvas}"
GITHUB_USERNAME="${GITHUB_USERNAME:-henryperkins}"
GITHUB_SIGNAL_REPO="${GITHUB_SIGNAL_REPO:-wp-hperkins-com}"

if [[ -z "$BLOG_DETAIL_SLUG" ]]; then
  BLOG_DETAIL_SLUG="$(curl -sS -L "${BASE_URL}/wp-json/henrys-digital-canvas/v1/blog?limit=1" | jq -r '.posts[0].slug // empty')"
fi

if [[ -z "$BLOG_DETAIL_SLUG" ]]; then
  printf "FAIL\tCould not resolve a blog detail slug for smoke checks.\n"
  exit 1
fi

endpoints=(
  "/wp-json/henrys-digital-canvas/v1/resume|200"
  "/wp-json/henrys-digital-canvas/v1/resume-ats|200"
  "/wp-json/henrys-digital-canvas/v1/moments|200"
  "/wp-json/henrys-digital-canvas/v1/blog?limit=${BLOG_LIMIT}|200"
  "/wp-json/henrys-digital-canvas/v1/blog/${BLOG_DETAIL_SLUG}|200"
  "/wp-json/henrys-digital-canvas/v1/work?limit=3|200"
  "/wp-json/henrys-digital-canvas/v1/work/${WORK_DETAIL_REPO}|200"
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

legacy_github_endpoints=(
  "/api/github/repo-proofs?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}|200,403,503"
  "/api/github/ci-status?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}|200,403,503"
  "/api/github/language-summary?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}|200,403,503"
  "/api/github/contributor-stats?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}|200,403,503"
)

for entry in "${legacy_github_endpoints[@]}"; do
  IFS='|' read -r path accepted_csv <<<"$entry"
  status="$(curl -sS -L -o /dev/null -w '%{http_code}' "${BASE_URL}${path}")"

  if [[ ",${accepted_csv}," == *",${status},"* ]]; then
    printf "PASS\t%-70s status=%s accepted=%s\n" "$path" "$status" "$accepted_csv"
  else
    printf "FAIL\t%-70s status=%s accepted=%s\n" "$path" "$status" "$accepted_csv"
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
  (has("relatedPosts")) and
  (.featuredImageUrl == null or (.featuredImageUrl | type == "string")) and
  (.featuredImageAlt == null or (.featuredImageAlt | type == "string")) and
  (.featuredImageSrcSet == null or (.featuredImageSrcSet | type == "string")) and
  (.relatedPosts | type == "array") and
  (all(.relatedPosts[]?; has("slug") and has("title")))
' >/dev/null <<<"$blog_detail_payload"; then
  printf "PASS\t%-70s fields=featuredImageUrl,featuredImageAlt,featuredImageSrcSet,relatedPosts\n" "/wp-json/henrys-digital-canvas/v1/blog/${BLOG_DETAIL_SLUG}"
else
  printf "FAIL\t%-70s detail contract check failed\n" "/wp-json/henrys-digital-canvas/v1/blog/${BLOG_DETAIL_SLUG}"
  failures=$((failures + 1))
fi

language_summary_status="$(curl -sS -L -o /tmp/hdc-language-summary.json -w '%{http_code}' "${BASE_URL}/api/github/language-summary?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}")"
if [[ "$language_summary_status" == "200" ]]; then
  if jq -e --arg repo "${GITHUB_SIGNAL_REPO}" '
    (.username | type == "string") and
    (.analyzedRepoCount | type == "number") and
    (.analyzedRepoCount >= 1) and
    (.languageByteTotals | type == "array") and
    (.byteDataIncomplete | type == "boolean") and
    (.failedLanguageRequestCount | type == "number") and
    (.stale | type == "boolean")
  ' >/dev/null /tmp/hdc-language-summary.json; then
    printf "PASS\t%-70s fields=analyzedRepoCount,languageByteTotals,byteDataIncomplete\n" "/api/github/language-summary?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}"
  else
    printf "FAIL\t%-70s contract check failed\n" "/api/github/language-summary?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}"
    failures=$((failures + 1))
  fi
else
  printf "PASS\t%-70s contract-skipped=status=%s\n" "/api/github/language-summary?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}" "$language_summary_status"
fi

contributor_stats_status="$(curl -sS -L -o /tmp/hdc-contributor-stats.json -w '%{http_code}' "${BASE_URL}/api/github/contributor-stats?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}")"
if [[ "$contributor_stats_status" == "200" ]]; then
  if jq -e --arg repo "${GITHUB_SIGNAL_REPO}" '
    (.username | type == "string") and
    (.repoCount | type == "number") and
    (.stats | type == "array") and
    (.stats | length >= 1) and
    (any(.stats[]; .repo == $repo and (.status == "ready" or .status == "computing" or .status == "missing" or .status == "unavailable"))) and
    (all(.stats[]; has("repo") and has("status")))
  ' >/dev/null /tmp/hdc-contributor-stats.json; then
    printf "PASS\t%-70s fields=stats[].repo,stats[].status\n" "/api/github/contributor-stats?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}"
  else
    printf "FAIL\t%-70s contract check failed\n" "/api/github/contributor-stats?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}"
    failures=$((failures + 1))
  fi
else
  printf "PASS\t%-70s contract-skipped=status=%s\n" "/api/github/contributor-stats?username=${GITHUB_USERNAME}&repo=${GITHUB_SIGNAL_REPO}" "$contributor_stats_status"
fi

if [[ $failures -gt 0 ]]; then
  printf "\nAPI smoke failed: %d issue(s).\n" "$failures"
  exit 1
fi

printf "\nAPI smoke passed.\n"
