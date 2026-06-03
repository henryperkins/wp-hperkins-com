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
  printf "Front-page shape check: innerBlocks tree (DB read via WP-CLI)\n"
  WP_ROOT="${WP_ROOT:-/home/dev/wp-hperkins-com}"
  FRONT_PAGE_ID="$(wp --path="${WP_ROOT}" option get page_on_front 2>/dev/null || echo 0)"
  if [[ "${FRONT_PAGE_ID}" -eq 0 ]]; then
    printf "[FAIL] page_on_front is not set; cannot run innerBlocks shape check.\n" >&2
    exit 1
  fi

  EXPECTED_BLOCKS=(
    "henrys-digital-canvas/home-page"
    "henrys-digital-canvas/home-hero"
    "henrys-digital-canvas/home-selected-work"
    "henrys-digital-canvas/home-throughline"
    "henrys-digital-canvas/home-resume-snapshot"
    "henrys-digital-canvas/home-recent-writing"
    "henrys-digital-canvas/home-contact-cta"
  )

  declare -A REQUIRED_ATTRS=(
    ["henrys-digital-canvas/home-page"]="align"
    ["henrys-digital-canvas/home-hero"]="eyebrow title description primaryCtaLabel primaryCtaHref secondaryCtaLabel secondaryCtaHref"
    ["henrys-digital-canvas/home-selected-work"]="title actionLabel actionHref loadingLabel emptyTitle emptyDescriptionLive emptyDescriptionFallback repoCount"
    ["henrys-digital-canvas/home-throughline"]="title paragraphs quote"
    ["henrys-digital-canvas/home-resume-snapshot"]="title actionLabel actionHref positioningEyebrow label items bestFitEyebrow bestFitTitle focusAreas actionLinks"
    ["henrys-digital-canvas/home-recent-writing"]="title actionLabel actionHref emptyTitle emptyDescription blogCount"
    ["henrys-digital-canvas/home-contact-cta"]="eyebrow title description primaryCtaLabel primaryCtaHref secondaryCtaLabel secondaryCtaHref"
  )

  hdc_assert_home_shape_json() {
    local shape_json="$1"
    local label="$2"
    local block
    local attr

    for block in "${EXPECTED_BLOCKS[@]}"; do
      if ! jq -e --arg block "${block}" 'has($block)' >/dev/null <<<"${shape_json}"; then
        printf "[FAIL] %s is missing block %s\n" "${label}" "${block}" >&2
        exit 1
      fi

      for attr in ${REQUIRED_ATTRS[${block}]}; do
        if ! jq -e --arg block "${block}" --arg attr "${attr}" '(.[$block] // []) | index($attr) != null' >/dev/null <<<"${shape_json}"; then
          printf "[FAIL] %s block %s is missing attribute %s\n" "${label}" "${block}" "${attr}" >&2
          exit 1
        fi
      done
    done
  }

  DB_SHAPE_JSON="$(
    wp --path="${WP_ROOT}" eval '
      $front_page_id = (int) get_option( "page_on_front" );
      $content       = (string) get_post_field( "post_content", $front_page_id );
      $shape         = array();
      $walk          = function ( $blocks ) use ( &$walk, &$shape ) {
        foreach ( $blocks as $block ) {
          if ( ! empty( $block["blockName"] ) ) {
            $attrs = isset( $block["attrs"] ) && is_array( $block["attrs"] ) ? $block["attrs"] : array();
            $shape[ $block["blockName"] ] = array_keys( $attrs );
          }
          if ( ! empty( $block["innerBlocks"] ) && is_array( $block["innerBlocks"] ) ) {
            $walk( $block["innerBlocks"] );
          }
        }
      };
      $walk( parse_blocks( $content ) );
      echo wp_json_encode( $shape );
    '
  )"

  hdc_assert_home_shape_json "${DB_SHAPE_JSON}" "DB post_content"
  printf "Front-page shape check (DB): all 7 home-page blocks and required attributes present in post_content.\n"

  wp --path="${WP_ROOT}" eval '
    $html = do_blocks( "<!-- wp:henrys-digital-canvas/home-page /-->" );
    foreach (
      array(
        "alignfull",
        "hdc-home-page__hero",
        "data-hdc-home-selected-work",
        "hdc-home-page__section--throughline",
        "data-hdc-home-resume-snapshot",
        "data-hdc-home-recent-writing",
        "hdc-home-page__cta-card",
      ) as $marker
    ) {
      if ( false === strpos( $html, $marker ) ) {
        fwrite( STDERR, "[FAIL] Legacy home-page fallback is missing marker " . $marker . PHP_EOL );
        exit( 1 );
      }
    }
  '
  printf "Front-page legacy fallback check: self-closing home-page renders full-bleed home sections.\n"

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

    REST_RAW_B64="$(printf '%s' "${REST_RAW}" | base64 -w 0)"
    REST_SHAPE_JSON="$(
      REST_RAW_B64="${REST_RAW_B64}" wp --path="${WP_ROOT}" eval '
        $content = (string) base64_decode( (string) getenv( "REST_RAW_B64" ) );
        $shape   = array();
        $walk    = function ( $blocks ) use ( &$walk, &$shape ) {
          foreach ( $blocks as $block ) {
            if ( ! empty( $block["blockName"] ) ) {
              $attrs = isset( $block["attrs"] ) && is_array( $block["attrs"] ) ? $block["attrs"] : array();
              $shape[ $block["blockName"] ] = array_keys( $attrs );
            }
            if ( ! empty( $block["innerBlocks"] ) && is_array( $block["innerBlocks"] ) ) {
              $walk( $block["innerBlocks"] );
            }
          }
        };
        $walk( parse_blocks( $content ) );
        echo wp_json_encode( $shape );
      '
    )"

    hdc_assert_home_shape_json "${REST_SHAPE_JSON}" "REST content.raw"
    printf "Front-page shape check (authenticated): all 7 home-page blocks and required attributes present in content.raw.\n"
  fi
else
  printf "Front-page shape check skipped (RUN_FRONT_PAGE_SHAPE_CHECK=%s).\n" "${RUN_FRONT_PAGE_SHAPE_CHECK:-0}"
fi

if [[ $failures -gt 0 ]]; then
  printf "\nAPI smoke failed: %d issue(s).\n" "$failures"
  exit 1
fi

printf "\nAPI smoke passed.\n"
