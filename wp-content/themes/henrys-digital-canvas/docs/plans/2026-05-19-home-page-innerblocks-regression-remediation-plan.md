# Home Page innerBlocks Regression Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the regressions introduced by the `feat/home-page-innerblocks` merge while preserving the core intent: the persisted front page remains an AI-readable `home-page` parent block with six explicit child blocks.

**Architecture:** Keep the new parent/child block model as canonical. Add deploy-safety behavior only for legacy self-closing `home-page` content, move shared home-page serialization into one runtime helper, tighten Selected Work's serialized fallback payload, and make the parity gates fail for actionable reasons instead of passing self-comparisons or pointing at an invalid source.

**Tech Stack:** WordPress Block API v3, PHP 8.5, WP-CLI, Bash smoke scripts, Playwright 1.58.x, no build step for block JavaScript.

---

## Findings Covered

1. **Parity gate self-compared by default.** `home-parity.spec.cjs` defaulted `SOURCE_BASE_URL` to `TARGET_BASE_URL`, so `RUN_HOME_PARITY=1` could pass without comparing distinct sources.
2. **Parity command documentation was incomplete.** Operators were not told to provide an explicit distinct `SOURCE_BASE_URL`.
3. **Old saved homepage content rendered an empty shell.** The new parent block only echoed `$content`, but legacy content was `<!-- wp:henrys-digital-canvas/home-page /-->`.
4. **Legacy fallback still needs full-bleed layout parity.** Empty legacy content has no `align: full` block attribute, so the wrapper can miss the `alignfull` class used by the full-bleed CSS.
5. **Selected Work serializes unrelated non-featured repos.** The old monolith embedded only featured repos. The split `home-selected-work` renderer embeds every repo from `blocks/work-showcase/data/repos.json` into `data-config.initialRepos`.
6. **Committed smoke evidence skipped the front-page shape gate.** The branch's committed smoke log says `RUN_FRONT_PAGE_SHAPE_CHECK=0`, so it did not prove the saved `post_content` inner-block shape.
7. **The example distinct source `https://hperkins.com` is not a valid structural parity source.** It currently renders only a client root (`id="root"`) before hydration from the server response and does not contain `.hdc-home-page__shell` or the section selectors expected by `home-parity.spec.cjs`.
8. **Selected Work card-count verification pointed at unrelated browser tests.** The existing browser smoke grep covered `/work/` signals and blog/recent-writing media, not the homepage Selected Work cards.
9. **The invalid-source parity preflight command excluded the preflight test.** A grep for `section "shell"` cannot prove the new `source URL exposes...` preflight runs.
10. **The stale-docs scan could false-positive on desired examples.** Searching for every `SOURCE_BASE_URL || ''` and every isolated `RUN_HOME_PARITY=1` line flags the hardened examples themselves.
11. **The smoke evidence command could append history after a failed run.** Without `pipefail`, a failing `npm run smoke:full` can be masked by a successful `tee`.

---

## File Structure

### Create

| Path | Responsibility |
|---|---|
| `wp-content/themes/henrys-digital-canvas/inc/home-page-blocks.php` | Shared serializer for the home-page child block tree and full parent block markup. Used by runtime fallback and page sync. |

### Modify

| Path | Change |
|---|---|
| `wp-content/themes/henrys-digital-canvas/functions.php` | Load the new shared home-page block serializer after `inc/data-contracts.php`. |
| `wp-content/themes/henrys-digital-canvas/blocks/home-page/render.php` | Render legacy self-closing content through the six child block renderers and force `alignfull` only for the legacy fallback path. |
| `wp-content/themes/henrys-digital-canvas/blocks/home-selected-work/render.php` | Serialize only the repos needed for the Selected Work fallback payload. |
| `wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php` | Reuse `hdc_build_home_page_block_markup()` from the shared helper. |
| `wp-content/themes/henrys-digital-canvas/scripts/api_smoke.sh` | Keep the DB shape gate and add a legacy fallback rendering assertion under `RUN_FRONT_PAGE_SHAPE_CHECK=1`. |
| `wp-content/themes/henrys-digital-canvas/scripts/browser_smoke.sh` | Require `SOURCE_BASE_URL` and a distinct `TARGET_BASE_URL` when `RUN_HOME_PARITY=1`. |
| `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs` | Add a targeted homepage Selected Work card-count smoke assertion. |
| `wp-content/themes/henrys-digital-canvas/scripts/playwright/home-parity.spec.cjs` | Require a distinct source URL and add a source preflight message that rejects invalid sources such as `https://hperkins.com`. |
| `wp-content/themes/henrys-digital-canvas/README.md` | Document explicit source/target parity commands, using the required `VALID_HOME_PARITY_SOURCE_URL` operator variable, and clarify what qualifies as a valid source. |
| `wp-content/themes/henrys-digital-canvas/docs/plans/2026-05-12-home-page-innerblocks-implementation-plan.md` | Bring the implementation plan's parity and smoke examples in line with the hardened gates. |

---

## Task 1: Regression Tests First

**Files:**
- Read: `wp-content/themes/henrys-digital-canvas/blocks/home-page/render.php`
- Read: `wp-content/themes/henrys-digital-canvas/blocks/home-selected-work/render.php`
- Read: `wp-content/themes/henrys-digital-canvas/scripts/playwright/home-parity.spec.cjs`

- [ ] **Step 1: Verify legacy self-closing home-page content fails on the merge commit**

Run this from the WordPress root:

```bash
wp --path=/home/dev/wp-hperkins-com eval '
	$html = do_blocks( "<!-- wp:henrys-digital-canvas/home-page /-->" );
	foreach (
		array(
			"hdc-home-page__hero",
			"data-hdc-home-selected-work",
			"hdc-home-page__section--throughline",
			"data-hdc-home-resume-snapshot",
			"data-hdc-home-recent-writing",
			"hdc-home-page__cta-card",
		) as $marker
	) {
		if ( false === strpos( $html, $marker ) ) {
			fwrite( STDERR, "Missing marker: " . $marker . PHP_EOL );
			exit( 1 );
		}
	}
	echo "legacy home-page block renders all sections" . PHP_EOL;
'
```

Expected before the fallback fix: FAIL with `Missing marker: hdc-home-page__hero`.

- [ ] **Step 2: Verify legacy self-closing content lacks full-bleed alignment**

Run:

```bash
wp --path=/home/dev/wp-hperkins-com eval '
	$html = do_blocks( "<!-- wp:henrys-digital-canvas/home-page /-->" );
	echo strtok( $html, "\n" ) . PHP_EOL;
	if ( false === strpos( $html, "alignfull" ) ) {
		fwrite( STDERR, "Missing alignfull on legacy fallback wrapper" . PHP_EOL );
		exit( 1 );
	}
'
```

Expected before the alignment fix: FAIL with `Missing alignfull on legacy fallback wrapper`.

- [ ] **Step 3: Verify Selected Work exposes non-featured repos**

Run:

```bash
wp --path=/home/dev/wp-hperkins-com eval '
	$id   = (int) get_option( "page_on_front" );
	$html = apply_filters( "the_content", get_post_field( "post_content", $id ) );
	if ( ! preg_match( "/<section[^>]*data-config=\"([^\"]+)\"[^>]*data-hdc-home-selected-work[^>]*>/", $html, $matches ) ) {
		fwrite( STDERR, "Selected Work config not found" . PHP_EOL );
		exit( 1 );
	}
	$config = json_decode( html_entity_decode( $matches[1], ENT_QUOTES ), true );
	$repos     = is_array( $config["initialRepos"] ?? null ) ? $config["initialRepos"] : array();
	$requested = array_map(
		static function ( $name ) {
			return strtolower( sanitize_text_field( (string) $name ) );
		},
		is_array( $config["featuredRepoNames"] ?? null ) ? $config["featuredRepoNames"] : array()
	);
	$leaks = array_values(
		array_filter(
			$repos,
			static function ( $repo ) use ( $requested ) {
				$name = strtolower( sanitize_text_field( (string) ( $repo["name"] ?? "" ) ) );
				return empty( $repo["featured"] ) && ! in_array( $name, $requested, true );
			}
		)
	);
	if ( ! empty( $leaks ) ) {
		fwrite( STDERR, "Non-featured repos leaked: " . implode( ", ", array_column( $leaks, "name" ) ) . PHP_EOL );
		exit( 1 );
	}
	echo "Selected Work initialRepos contains only selected/featured fallback repos" . PHP_EOL;
'
```

Expected before the payload fix: FAIL with `Non-featured repos leaked: flavor-agent, codex, azure_chatapp`.

- [ ] **Step 4: Verify parity rejects an invalid source**

Run from the theme directory:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=https://wp.hperkins.com \
SOURCE_BASE_URL=https://hperkins.com \
TARGET_BASE_URL=https://wp.hperkins.com \
npx playwright test scripts/playwright/home-parity.spec.cjs \
	--config scripts/playwright/playwright.config.cjs \
	--workers=1 \
	--reporter=line \
	--grep 'section "shell"'
```

Expected before the preflight hardening: FAIL inside the section test with `source .hdc-home-page__shell must exist`.

Do not use this `--grep 'section "shell"'` command to verify the hardened preflight; it intentionally excludes the preflight test. Task 6 Step 5 reruns the same invalid source with `--grep 'source URL exposes'` and must fail with `SOURCE_BASE_URL is not a valid home parity source`.

---

## Task 2: Shared Home-Page Serialization Helper

**Files:**
- Create: `wp-content/themes/henrys-digital-canvas/inc/home-page-blocks.php`
- Modify: `wp-content/themes/henrys-digital-canvas/functions.php`
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php`

- [ ] **Step 1: Create the shared serializer**

Add `wp-content/themes/henrys-digital-canvas/inc/home-page-blocks.php`:

```php
<?php
/**
 * Helpers for serializing the home page inner-block tree.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Serialize a self-closing Henry's Digital Canvas child block.
 *
 * @param string $block_slug Child block slug without the namespace.
 * @param array  $attributes Block attributes.
 * @return string Serialized block comment.
 */
function hdc_serialize_home_page_child_block( $block_slug, array $attributes ) {
	$serialized_attributes = empty( $attributes ) ? '' : ' ' . serialize_block_attributes( $attributes );

	return sprintf(
		'<!-- wp:henrys-digital-canvas/%s%s /-->',
		$block_slug,
		$serialized_attributes
	);
}

/**
 * Build the home page child block tree with explicit child attrs.
 *
 * @return string Serialized child block markup.
 */
function hdc_build_home_page_child_block_markup() {
	$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
	$hero     = isset( $contract['hero'] ) && is_array( $contract['hero'] ) ? $contract['hero'] : array();
	$work     = isset( $contract['selectedWork'] ) && is_array( $contract['selectedWork'] ) ? $contract['selectedWork'] : array();
	$through  = isset( $contract['throughline'] ) && is_array( $contract['throughline'] ) ? $contract['throughline'] : array();
	$resume   = isset( $contract['resumeSnapshot'] ) && is_array( $contract['resumeSnapshot'] ) ? $contract['resumeSnapshot'] : array();
	$writing  = isset( $contract['recentWriting'] ) && is_array( $contract['recentWriting'] ) ? $contract['recentWriting'] : array();
	$contact  = isset( $contract['contactCta'] ) && is_array( $contract['contactCta'] ) ? $contract['contactCta'] : array();

	return implode(
		"\n\n",
		array(
			hdc_serialize_home_page_child_block( 'home-hero', $hero ),
			hdc_serialize_home_page_child_block(
				'home-selected-work',
				array(
					'title'                    => $work['title'] ?? '',
					'actionLabel'              => $work['actionLabel'] ?? '',
					'actionHref'               => $work['actionHref'] ?? '',
					'featuredRepoNames'        => $work['featuredRepoNames'] ?? array(),
					'loadingLabel'             => $work['loadingLabel'] ?? '',
					'sourceLiveLabel'          => $work['sourceLiveLabel'] ?? '',
					'sourceFallbackLabel'      => $work['sourceFallbackLabel'] ?? '',
					'emptyTitle'               => $work['emptyTitle'] ?? '',
					'emptyDescriptionLive'     => $work['emptyDescriptionLive'] ?? '',
					'emptyDescriptionFallback' => $work['emptyDescriptionFallback'] ?? '',
					'repoCount'                => 3,
				)
			),
			hdc_serialize_home_page_child_block( 'home-throughline', $through ),
			hdc_serialize_home_page_child_block( 'home-resume-snapshot', $resume ),
			hdc_serialize_home_page_child_block(
				'home-recent-writing',
				array(
					'title'            => $writing['title'] ?? '',
					'actionLabel'      => $writing['actionLabel'] ?? '',
					'actionHref'       => $writing['actionHref'] ?? '',
					'emptyTitle'       => $writing['emptyTitle'] ?? '',
					'emptyDescription' => $writing['emptyDescription'] ?? '',
					'blogCount'        => 3,
				)
			),
			hdc_serialize_home_page_child_block( 'home-contact-cta', $contact ),
		)
	);
}

/**
 * Build the home page parent + child block tree with explicit child attrs.
 *
 * @return string Serialized block markup.
 */
function hdc_build_home_page_block_markup() {
	return sprintf(
		"<!-- wp:henrys-digital-canvas/home-page %s -->\n%s\n<!-- /wp:henrys-digital-canvas/home-page -->",
		serialize_block_attributes( array( 'align' => 'full' ) ),
		hdc_build_home_page_child_block_markup()
	);
}
```

- [ ] **Step 2: Load the helper after data contracts**

In `wp-content/themes/henrys-digital-canvas/functions.php`, keep this order:

```php
require_once get_stylesheet_directory() . '/inc/data-contracts.php';
require_once get_stylesheet_directory() . '/inc/home-page-blocks.php';
require_once get_stylesheet_directory() . '/inc/rest-api.php';
```

- [ ] **Step 3: Use the helper from the page sync script**

Near the top of `wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php`, after the `ABSPATH` guard, add:

```php
require_once dirname( __DIR__ ) . '/inc/data-contracts.php';
require_once dirname( __DIR__ ) . '/inc/home-page-blocks.php';
```

Then delete the local `hdc_build_home_page_block_markup()` function from `scripts/sync_page_sources.php`. The `$page_configs` entry for `home` must still call `hdc_build_home_page_block_markup()`.

- [ ] **Step 4: Verify helper syntax and serialized shape**

Run:

```bash
php -l wp-content/themes/henrys-digital-canvas/inc/home-page-blocks.php
php -l wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php
wp --path=/home/dev/wp-hperkins-com eval '
	$blocks = parse_blocks( hdc_build_home_page_block_markup() );
	$parent = $blocks[0] ?? array();
	if ( "henrys-digital-canvas/home-page" !== ( $parent["blockName"] ?? "" ) ) {
		fwrite( STDERR, "Unexpected parent block" . PHP_EOL );
		exit( 1 );
	}
	if ( "full" !== ( $parent["attrs"]["align"] ?? null ) ) {
		fwrite( STDERR, "Expected parent align=full" . PHP_EOL );
		exit( 1 );
	}
	if ( 6 !== count( $parent["innerBlocks"] ?? array() ) ) {
		fwrite( STDERR, "Expected 6 home children" . PHP_EOL );
		exit( 1 );
	}
	echo implode(
		PHP_EOL,
		array_map(
			static function ( $block ) {
				return $block["blockName"];
			},
			$parent["innerBlocks"]
		)
	) . PHP_EOL;
'
```

Expected: PHP syntax passes and the six child block names print in this order:

```text
henrys-digital-canvas/home-hero
henrys-digital-canvas/home-selected-work
henrys-digital-canvas/home-throughline
henrys-digital-canvas/home-resume-snapshot
henrys-digital-canvas/home-recent-writing
henrys-digital-canvas/home-contact-cta
```

---

## Task 3: Legacy Runtime Fallback with Full-Bleed Parity

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/home-page/render.php`

- [ ] **Step 1: Add fallback state before wrapper attributes**

Replace the wrapper setup in `blocks/home-page/render.php` with:

```php
$home_content       = $content;
$is_legacy_fallback = '' === trim( $home_content );
$wrapper_classes    = 'hdc-home-page';

if ( $is_legacy_fallback ) {
	$wrapper_classes .= ' alignfull';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $wrapper_classes,
	)
);

if ( $is_legacy_fallback && function_exists( 'hdc_build_home_page_child_block_markup' ) ) {
	$home_content = do_blocks( hdc_build_home_page_child_block_markup() );
}
```

Keep the output line as:

```php
<?php echo $home_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
```

- [ ] **Step 2: Verify legacy content renders sections and `alignfull`**

Run:

```bash
php -l wp-content/themes/henrys-digital-canvas/blocks/home-page/render.php
wp --path=/home/dev/wp-hperkins-com eval '
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
			fwrite( STDERR, "Missing marker: " . $marker . PHP_EOL );
			exit( 1 );
		}
	}
	echo "legacy home-page fallback renders full-bleed child sections" . PHP_EOL;
'
```

Expected: PASS.

- [ ] **Step 3: Verify canonical synced content still renders from saved children**

Run:

```bash
wp --path=/home/dev/wp-hperkins-com eval '
	$id   = (int) get_option( "page_on_front" );
	$html = apply_filters( "the_content", get_post_field( "post_content", $id ) );
	foreach (
		array(
			"hdc-home-page__hero",
			"data-hdc-home-selected-work",
			"hdc-home-page__section--throughline",
			"data-hdc-home-resume-snapshot",
			"data-hdc-home-recent-writing",
			"hdc-home-page__cta-card",
		) as $marker
	) {
		if ( false === strpos( $html, $marker ) ) {
			fwrite( STDERR, "Missing marker: " . $marker . PHP_EOL );
			exit( 1 );
		}
	}
	echo "front page renders all home sections" . PHP_EOL;
'
```

Expected: PASS.

---

## Task 4: Trim Selected Work Fallback Payload

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/home-selected-work/render.php`
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`

- [ ] **Step 1: Add a small normalized-name helper**

After `$repos` is sanitized, add:

```php
$requested_repo_names = array_values(
	array_filter(
		array_map(
			static function ( $repo_name ) {
				return strtolower( sanitize_text_field( (string) $repo_name ) );
			},
			$repos
		)
	)
);
```

- [ ] **Step 2: Filter the embedded repo snapshot**

Inside the `array_map()` callback that currently starts with:

```php
static function ( $repo ) {
	if ( ! is_array( $repo ) || empty( $repo['name'] ) ) {
		return null;
	}
	return array(
```

Change it to capture `$requested_repo_names` and filter unrelated non-featured repos:

```php
static function ( $repo ) use ( $requested_repo_names ) {
	if ( ! is_array( $repo ) || empty( $repo['name'] ) ) {
		return null;
	}

	$repo_name    = sanitize_text_field( (string) $repo['name'] );
	$is_requested = in_array( strtolower( $repo_name ), $requested_repo_names, true );
	$is_featured  = ! empty( $repo['featured'] );

	if ( ! $is_requested && ! $is_featured ) {
		return null;
	}

	return array(
		'name'        => $repo_name,
```

Leave the rest of the returned shape unchanged. This preserves the old "featured repos only" fallback behavior while still allowing `featuredRepoNames` to explicitly select a repo whose catalog flag is not `featured`.

- [ ] **Step 3: Verify non-featured repos are no longer serialized**

Run the command from Task 1 Step 3 again.

Expected: PASS with:

```text
Selected Work initialRepos contains only selected/featured fallback repos
```

- [ ] **Step 4: Add a targeted Selected Work browser smoke assertion**

In `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`, after the `route matrix renders expected blocks` test, add:

```js
	test('home selected work renders exactly the configured cards', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		const selectedWork = page.locator('[data-hdc-home-selected-work]');
		await expect(selectedWork).toHaveCount(1, { timeout: 10000 });

		const rawConfig = await selectedWork.getAttribute('data-config');
		const config = JSON.parse(rawConfig || '{}');
		const expectedCardCount = Number.isFinite(Number(config.repoCount))
			? Number(config.repoCount)
			: 3;
		const cards = selectedWork.locator(
			'.hdc-home-page__work-card:not(.hdc-home-page__work-card--skeleton)'
		);

		await expect
			.poll(async () => cards.count(), { timeout: 20000 })
			.toBe(expectedCardCount);

		const cardTitles = await cards
			.locator('.hdc-home-page__card-title')
			.allTextContents();
		expect(cardTitles.map((title) => title.trim()).filter(Boolean)).toHaveLength(
			expectedCardCount
		);
	});
```

This test must target the homepage Selected Work block itself. Do not rely on the existing `work signals panel` or `blog and home media` tests; they do not count `[data-hdc-home-selected-work]` cards.

- [ ] **Step 5: Verify Selected Work still displays the configured three cards**

Run:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
npx playwright test scripts/playwright/browser-smoke.spec.cjs \
	--config scripts/playwright/playwright.config.cjs \
	--workers=1 \
	--reporter=line \
	--grep 'home selected work renders exactly the configured cards'
```

Expected: PASS. The test reads `data-config.repoCount` from the homepage Selected Work section and verifies that exactly three non-skeleton `.hdc-home-page__work-card` elements render.

---

## Task 5: Harden Front-Page Shape and Fallback Smoke Gates

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/api_smoke.sh`
- Modify: `wp-content/themes/henrys-digital-canvas/ops/smoke-history.log`
- Create or replace: `wp-content/themes/henrys-digital-canvas/ops/smoke-<timestamp>.log`

- [ ] **Step 1: Add the legacy fallback assertion under `RUN_FRONT_PAGE_SHAPE_CHECK=1`**

After the existing DB shape assertion prints `Front-page shape check (DB): all 7 home-page blocks...`, add:

```bash
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
```

- [ ] **Step 2: Run syntax checks**

Run:

```bash
bash -n wp-content/themes/henrys-digital-canvas/scripts/api_smoke.sh
bash -n wp-content/themes/henrys-digital-canvas/scripts/full_smoke.sh
```

Expected: both commands exit 0.

- [ ] **Step 3: Regenerate smoke evidence with the shape gate enabled**

Run:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
set -o pipefail
timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
if RUN_FRONT_PAGE_SHAPE_CHECK=1 \
	RUN_HOME_PARITY=0 \
	BASE_URL=https://wp.hperkins.com \
	npm run smoke:full 2>&1 | tee "ops/smoke-${timestamp}.log"; then
	printf '%s %s\n' "${timestamp}" "RUN_FRONT_PAGE_SHAPE_CHECK=1 RUN_HOME_PARITY=0 npm run smoke:full" >> ops/smoke-history.log
else
	smoke_status="$?"
	printf 'Smoke failed; not appending ops/smoke-history.log. See ops/smoke-%s.log.\n' "${timestamp}" >&2
	exit "${smoke_status}"
fi
```

Expected log evidence includes:

```text
Front-page shape check (DB): all 7 home-page blocks and required attributes present in post_content.
Front-page legacy fallback check: self-closing home-page renders full-bleed home sections.
Full smoke suite passed.
```

Do not commit a smoke log that says `Front-page shape check skipped`.

---

## Task 6: Make Home Parity Source Handling Actionable

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/playwright/home-parity.spec.cjs`
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/browser_smoke.sh`

- [ ] **Step 1: Require explicit distinct source/target URLs in the Playwright spec**

At the top of `home-parity.spec.cjs`, use:

```js
const TARGET_BASE_URL =
	process.env.TARGET_BASE_URL ||
	process.env.BASE_URL ||
	'https://wp.hperkins.com';
const SOURCE_BASE_URL = process.env.SOURCE_BASE_URL || '';

function normalizeBaseUrl( value ) {
	return String( value || '' ).replace( /\/+$/, '' );
}
```

Inside `test.describe( 'home page structural parity', () => {`, add this `beforeAll`:

```js
test.beforeAll( async () => {
	const normalizedSource = normalizeBaseUrl( SOURCE_BASE_URL );
	const normalizedTarget = normalizeBaseUrl( TARGET_BASE_URL );

	if ( ! normalizedSource ) {
		throw new Error(
			'SOURCE_BASE_URL is required for home parity checks.'
		);
	}

	if ( normalizedSource === normalizedTarget ) {
		throw new Error(
			`SOURCE_BASE_URL must differ from TARGET_BASE_URL (${ TARGET_BASE_URL }).`
		);
	}

	test.info().annotations.push( {
		type: 'source',
		description: `source=${ SOURCE_BASE_URL } target=${ TARGET_BASE_URL }`,
	} );
} );
```

- [ ] **Step 2: Add a source preflight test**

Before the per-section loop, add:

```js
test( 'source URL exposes the expected home parity DOM', async ( { page } ) => {
	await page.goto( `${ SOURCE_BASE_URL }/`, { waitUntil: 'networkidle' } );

	for ( const section of SECTIONS ) {
		const count = await page.locator( section.sourceSelector ).count();
		expect(
			count,
			`SOURCE_BASE_URL is not a valid home parity source: missing ${ section.sourceSelector } for ${ section.name }`
		).toBeGreaterThan( 0 );
	}
} );
```

This makes `SOURCE_BASE_URL=https://hperkins.com` fail with a clear source-validity message instead of burying the problem inside a target comparison.

- [ ] **Step 3: Require source/target distinction in the shell wrapper**

In `scripts/browser_smoke.sh`, define `TARGET_BASE_URL` near `BASE_URL`:

```bash
TARGET_BASE_URL="${TARGET_BASE_URL:-${BASE_URL}}"
```

Add:

```bash
normalize_base_url() {
	local value="${1:-}"
	while [[ "${value}" == */ ]]; do
		value="${value%/}"
	done
	printf "%s" "${value}"
}
```

Before running Playwright, add:

```bash
if [[ "${RUN_HOME_PARITY:-0}" == "1" ]]; then
	if [[ -z "${SOURCE_BASE_URL:-}" ]]; then
		printf "RUN_HOME_PARITY=1 requires SOURCE_BASE_URL so the parity gate cannot self-compare.\n" >&2
		exit 1
	fi

	if [[ "$(normalize_base_url "${SOURCE_BASE_URL}")" == "$(normalize_base_url "${TARGET_BASE_URL}")" ]]; then
		printf "RUN_HOME_PARITY=1 requires SOURCE_BASE_URL to differ from TARGET_BASE_URL (%s).\n" "${TARGET_BASE_URL}" >&2
		exit 1
	fi
fi
```

Run the parity command with explicit env:

```bash
BASE_URL="${BASE_URL}" SOURCE_BASE_URL="${SOURCE_BASE_URL}" TARGET_BASE_URL="${TARGET_BASE_URL}" npx playwright test "${PARITY_SPEC_PATH}" --config "${CONFIG_PATH}" --workers=1 --reporter=line
```

- [ ] **Step 4: Verify missing and self-comparing sources fail fast**

Run:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
RUN_HOME_PARITY=1 BASE_URL=https://wp.hperkins.com ./scripts/browser_smoke.sh
```

Expected: FAIL with `RUN_HOME_PARITY=1 requires SOURCE_BASE_URL`.

Run:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
RUN_HOME_PARITY=1 BASE_URL=https://wp.hperkins.com SOURCE_BASE_URL=https://wp.hperkins.com ./scripts/browser_smoke.sh
```

Expected: FAIL with `SOURCE_BASE_URL to differ from TARGET_BASE_URL`.

- [ ] **Step 5: Verify invalid distinct source fails with the preflight message**

Run:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=https://wp.hperkins.com \
SOURCE_BASE_URL=https://hperkins.com \
TARGET_BASE_URL=https://wp.hperkins.com \
npx playwright test scripts/playwright/home-parity.spec.cjs \
	--config scripts/playwright/playwright.config.cjs \
	--workers=1 \
	--reporter=line \
	--grep 'source URL exposes'
```

Expected: FAIL with `SOURCE_BASE_URL is not a valid home parity source`.

---

## Task 7: Document the Correct Parity Workflow

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/README.md`
- Modify: `wp-content/themes/henrys-digital-canvas/docs/plans/2026-05-12-home-page-innerblocks-implementation-plan.md`

- [ ] **Step 1: Add the README parity command**

In the README QA/smoke section, add this text. Use four backticks in this plan so the nested README snippet stays intact:

````markdown
### Home parity

Home parity is intentionally opt-in because it requires a real pre-innerBlocks source that exposes the expected home-page DOM. The source must not be the target and must not be `https://hperkins.com` unless that host is serving the expected `.hdc-home-page__*` section markup.

```bash
VALID_HOME_PARITY_SOURCE_URL="${VALID_HOME_PARITY_SOURCE_URL:?Set this to a pre-innerBlocks origin that renders .hdc-home-page__shell}"
RUN_HOME_PARITY=1 \
SOURCE_BASE_URL="${VALID_HOME_PARITY_SOURCE_URL}" \
TARGET_BASE_URL=https://wp.hperkins.com \
./scripts/browser_smoke.sh
```

`TARGET_BASE_URL` defaults to `BASE_URL`. `SOURCE_BASE_URL` is required when `RUN_HOME_PARITY=1`; the smoke wrapper rejects missing, identical, or invalid sources.
````

- [ ] **Step 2: Update the implementation plan examples**

In `docs/plans/2026-05-12-home-page-innerblocks-implementation-plan.md`, replace any examples that run home parity without `SOURCE_BASE_URL` and `TARGET_BASE_URL` with:

```bash
VALID_HOME_PARITY_SOURCE_URL="${VALID_HOME_PARITY_SOURCE_URL:?Set this to a pre-innerBlocks origin that renders .hdc-home-page__shell}"
RUN_HOME_PARITY=1 \
SOURCE_BASE_URL="${VALID_HOME_PARITY_SOURCE_URL}" \
TARGET_BASE_URL=https://wp.hperkins.com \
npm run smoke:browser
```

Replace any stale default-source text with:

```text
Home parity requires an explicit, distinct source URL. The source must expose the expected `.hdc-home-page__*` section DOM; `https://hperkins.com` is not a valid source while it only serves the client root.
```

- [ ] **Step 3: Verify docs have no stale self-compare examples**

Run:

```bash
node <<'NODE'
const fs = require('fs');

const files = [
	'wp-content/themes/henrys-digital-canvas/README.md',
	'wp-content/themes/henrys-digital-canvas/docs/plans/2026-05-12-home-page-innerblocks-implementation-plan.md',
];
let failed = false;
const fencePattern = new RegExp('`{3}(?:bash|sh)\\n([\\s\\S]*?)`{3}', 'g');
const staleDefaultPattern =
	/SOURCE_BASE_URL\s*=\s*process\.env\.SOURCE_BASE_URL\s*\|\|\s*(TARGET_BASE_URL|['"]https:\/\/hperkins\.com['"])|SOURCE_BASE_URL:-(\$\{?TARGET_BASE_URL|\$\{?BASE_URL|https:\/\/hperkins\.com)/;

for (const file of files) {
	const text = fs.readFileSync(file, 'utf8');

	text.split(/\r?\n/).forEach((line, index) => {
		if (staleDefaultPattern.test(line)) {
			console.error(`${file}:${index + 1}: stale SOURCE_BASE_URL default`);
			failed = true;
		}
	});

	for (const match of text.matchAll(fencePattern)) {
		const block = match[1];
		if (!block.includes('RUN_HOME_PARITY=1')) {
			continue;
		}
		if (!/(SOURCE_BASE_URL|VALID_HOME_PARITY_SOURCE_URL)/.test(block)) {
			console.error(`${file}: parity command missing SOURCE_BASE_URL`);
			console.error(block.trim());
			failed = true;
		}
	}
}

process.exit(failed ? 1 : 0);
NODE
```

Expected: no Node diagnostics.

---

## Task 8: Final Verification Matrix

**Files:** all modified files from prior tasks.

- [ ] **Step 1: PHP and Bash syntax**

Run:

```bash
php -l wp-content/themes/henrys-digital-canvas/inc/home-page-blocks.php
php -l wp-content/themes/henrys-digital-canvas/blocks/home-page/render.php
php -l wp-content/themes/henrys-digital-canvas/blocks/home-selected-work/render.php
php -l wp-content/themes/henrys-digital-canvas/functions.php
php -l wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php
bash -n wp-content/themes/henrys-digital-canvas/scripts/api_smoke.sh
bash -n wp-content/themes/henrys-digital-canvas/scripts/browser_smoke.sh
bash -n wp-content/themes/henrys-digital-canvas/scripts/full_smoke.sh
```

Expected: all pass.

- [ ] **Step 2: JS lint**

Run:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
npx wp-scripts lint-js \
	scripts/playwright/home-parity.spec.cjs \
	scripts/playwright/browser-smoke.spec.cjs \
	--max-warnings=0
```

Expected: pass with zero warnings.

- [ ] **Step 3: Runtime regression checks**

Run the WP-CLI and browser checks from:
- Task 2 Step 4
- Task 3 Step 2
- Task 3 Step 3
- Task 4 Step 3
- Task 4 Step 5

Expected: all pass.

- [ ] **Step 4: Full smoke with shape gate enabled**

Run:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
RUN_FRONT_PAGE_SHAPE_CHECK=1 \
RUN_HOME_PARITY=0 \
BASE_URL=https://wp.hperkins.com \
./scripts/full_smoke.sh
```

Expected:

```text
Front-page shape check (DB): all 7 home-page blocks and required attributes present in post_content.
Front-page legacy fallback check: self-closing home-page renders full-bleed home sections.
10 passed
Full smoke suite passed.
```

- [ ] **Step 5: Parity guard checks**

Run:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
RUN_HOME_PARITY=1 BASE_URL=https://wp.hperkins.com ./scripts/browser_smoke.sh
RUN_HOME_PARITY=1 BASE_URL=https://wp.hperkins.com SOURCE_BASE_URL=https://wp.hperkins.com ./scripts/browser_smoke.sh
BASE_URL=https://wp.hperkins.com SOURCE_BASE_URL=https://hperkins.com TARGET_BASE_URL=https://wp.hperkins.com npx playwright test scripts/playwright/home-parity.spec.cjs --config scripts/playwright/playwright.config.cjs --workers=1 --reporter=line --grep 'source URL exposes'
```

Expected: each command fails for the intended guard reason. These are negative tests; record the failure messages in the implementation notes, not as a failed verification.

- [ ] **Step 6: Positive parity run only with a valid source**

Run this only when a valid pre-innerBlocks source is available:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
VALID_HOME_PARITY_SOURCE_URL="${VALID_HOME_PARITY_SOURCE_URL:?Set this to a pre-innerBlocks origin that renders .hdc-home-page__shell}"
RUN_HOME_PARITY=1 \
SOURCE_BASE_URL="${VALID_HOME_PARITY_SOURCE_URL}" \
TARGET_BASE_URL=https://wp.hperkins.com \
./scripts/browser_smoke.sh
```

Expected: parity passes. If no valid source exists, do not mark parity as passed; report it as blocked by missing valid source and rely on the target smoke, DB shape, and fallback checks.

- [ ] **Step 7: Diff hygiene**

Run:

```bash
git -C /home/dev/wp-hperkins-com diff --check
git -C /home/dev/wp-hperkins-com status --short
```

Expected: no whitespace errors. Status should include only intentional source, docs, smoke log, and plan changes. Remove generated Playwright `test-results/` artifacts before commit.

---

## Completion Criteria

- The persisted front page still contains the parent `home-page` block plus the six explicit child blocks.
- Legacy self-closing `home-page` content renders the six child sections and preserves `alignfull`.
- `home-selected-work` no longer serializes unrelated non-featured repo records into homepage HTML.
- Browser smoke has a targeted homepage Selected Work card-count assertion and proves the configured three cards render.
- `RUN_FRONT_PAGE_SHAPE_CHECK=1` proves both the DB inner-block shape and the legacy fallback path.
- `RUN_HOME_PARITY=1` cannot self-compare and rejects invalid distinct sources with a clear message.
- Documentation shows only explicit distinct-source parity commands.
- Smoke history is appended only after `npm run smoke:full` exits successfully under `pipefail`.
- Final smoke evidence does not contain `Front-page shape check skipped`.
