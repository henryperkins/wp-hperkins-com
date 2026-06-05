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

if [[ "${RUN_FRONT_PAGE_SHAPE_CHECK:-0}" == "1" ]]; then
  printf "Front-page shape check: core-block Home pattern (DB read via WP-CLI)\n"
  WP_ROOT="${WP_ROOT:-/home/dev/wp-hperkins-com}"
  FRONT_PAGE_ID="$(wp --path="${WP_ROOT}" option get page_on_front 2>/dev/null || echo 0)"
  if [[ "${FRONT_PAGE_ID}" -eq 0 ]]; then
    printf "[FAIL] page_on_front is not set; cannot run front-page shape check.\n" >&2
    exit 1
  fi

  REQUIRED_SERIALIZED_MARKERS=(
    "is-style-home-hero"
    "\"namespace\":\"hdc/selected-work\""
    "wp:henrys-digital-canvas/home-recent-writing"
    "is-style-ember-veil"
  )

  FORBIDDEN_SERIALIZED_MARKERS=(
    "wp:henrys-digital-canvas/home-page"
    "wp:henrys-digital-canvas/home-hero"
    "wp:henrys-digital-canvas/home-selected-work"
    "wp:henrys-digital-canvas/home-throughline"
    "wp:henrys-digital-canvas/home-resume-snapshot"
    "wp:henrys-digital-canvas/home-contact-cta"
  )

  REQUIRED_RENDERED_MARKERS=(
    "is-style-home-hero"
    "is-style-hdc-repo-card"
    "hdc-home-page__section--throughline"
    "data-hdc-home-recent-writing"
    "hdc-home-page__cta-card"
  )

  hdc_assert_contains_marker() {
    local haystack="$1"
    local marker="$2"
    local label="$3"

    if ! rg -F -q -- "${marker}" <<<"${haystack}"; then
      printf "[FAIL] %s is missing marker %s\n" "${label}" "${marker}" >&2
      exit 1
    fi
  }

  hdc_assert_missing_marker() {
    local haystack="$1"
    local marker="$2"
    local label="$3"

    if rg -F -q -- "${marker}" <<<"${haystack}"; then
      printf "[FAIL] %s still contains retired marker %s\n" "${label}" "${marker}" >&2
      exit 1
    fi
  }

  hdc_assert_serialized_home_pattern() {
    local content="$1"
    local label="$2"
    local marker

    for marker in "${REQUIRED_SERIALIZED_MARKERS[@]}"; do
      hdc_assert_contains_marker "${content}" "${marker}" "${label}"
    done

    for marker in "${FORBIDDEN_SERIALIZED_MARKERS[@]}"; do
      hdc_assert_missing_marker "${content}" "${marker}" "${label}"
    done
  }

  hdc_assert_rendered_home_pattern() {
    local html="$1"
    local label="$2"
    local marker

    for marker in "${REQUIRED_RENDERED_MARKERS[@]}"; do
      hdc_assert_contains_marker "${html}" "${marker}" "${label}"
    done
  }

  DB_CONTENT_B64="$(
    wp --path="${WP_ROOT}" eval '
      $front_page_id = (int) get_option( "page_on_front" );
      $content       = (string) get_post_field( "post_content", $front_page_id );
      echo base64_encode( $content );
    '
  )"
  DB_CONTENT="$(printf '%s' "${DB_CONTENT_B64}" | base64 -d)"
  hdc_assert_serialized_home_pattern "${DB_CONTENT}" "DB post_content"
  printf "Front-page serialized shape check (DB): core Home markers present and retired child markers absent.\n"

  DB_RENDERED_B64="$(
    wp --path="${WP_ROOT}" eval '
      $front_page_id = (int) get_option( "page_on_front" );
      $content       = (string) get_post_field( "post_content", $front_page_id );
      echo base64_encode( apply_filters( "the_content", $content ) );
    '
  )"
  DB_RENDERED="$(printf '%s' "${DB_RENDERED_B64}" | base64 -d)"
  hdc_assert_rendered_home_pattern "${DB_RENDERED}" "rendered front-page content"
  printf "Front-page render check: core Home pattern renders hero, selected work, writing, and contact markers.\n"

  if [[ "${RUN_REST_SHAPE_CHECK_AUTHENTICATED:-0}" == "1" ]]; then
    if [[ -z "${WP_REST_USER:-}" || -z "${WP_REST_APP_PASSWORD:-}" ]]; then
      printf "[FAIL] RUN_REST_SHAPE_CHECK_AUTHENTICATED=1 but WP_REST_USER / WP_REST_APP_PASSWORD not set.\n" >&2
      exit 1
    fi

    REST_BASE="${BASE_URL:-https://wp.hperkins.com}"
    REST_URL="${REST_BASE}/wp-json/wp/v2/pages/${FRONT_PAGE_ID}?context=edit"

    REST_BODY="$(
      curl -sS --fail \
        --user "${WP_REST_USER}:${WP_REST_APP_PASSWORD}" \
        "${REST_URL}"
    )" || {
      printf "[FAIL] REST fetch failed: %s\n" "${REST_URL}" >&2
      exit 1
    }

    REST_RAW="$(printf '%s' "${REST_BODY}" | jq -r '.content.raw // empty')"
    if [[ -z "${REST_RAW}" ]]; then
      printf "[FAIL] REST response has no content.raw (may be missing context=edit permission).\n" >&2
      exit 1
    fi

    hdc_assert_serialized_home_pattern "${REST_RAW}" "REST content.raw"
    printf "Front-page shape check (authenticated): core Home markers present and retired child markers absent in content.raw.\n"
  fi
else
  printf "Front-page shape check skipped (RUN_FRONT_PAGE_SHAPE_CHECK=%s).\n" "${RUN_FRONT_PAGE_SHAPE_CHECK:-0}"
fi

if [[ $failures -gt 0 ]]; then
  printf "\nAPI smoke failed: %d issue(s).\n" "$failures"
  exit 1
fi

printf "\nAPI smoke passed.\n"
