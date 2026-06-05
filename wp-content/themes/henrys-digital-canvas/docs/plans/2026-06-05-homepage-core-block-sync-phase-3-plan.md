# Homepage Core-Block Sync — Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the interim custom Recent Writing block with a native core Query Loop backed by `reading_time` post meta, then delete the six retired homepage child blocks and update every verification referrer.

**Architecture:** Add a small post-meta module under `inc/home-core/` that registers and maintains `reading_time` for native `post` records using the existing `hdc_estimate_reading_time()` contract. Extend the existing Home pattern builder so the front-page record contains only core blocks plus the Phase-1 Selected Work query fragment. Once the page sync writes that markup, remove all six custom child block directories and update smoke/parity/referrer checks to forbid them.

**Tech Stack:** WordPress post meta, Block Bindings on `core/paragraph`, core Query Loop, WP-CLI, Playwright, existing theme smoke scripts.

---

## File Structure

| File | Responsibility |
|---|---|
| `inc/home-core/post-reading-time.php` | Register `reading_time` post meta, compute it on `save_post`, and backfill existing posts once. |
| `inc/home-core/bootstrap.php` | Require the new post reading-time module. |
| `inc/home-core/block-styles.php` | Register `is-style-hdc-article-row` for the Recent Writing row group. |
| `assets/css/home-core.css` | Add the article-row/query-loop CSS used by the core Recent Writing pattern. |
| `inc/home-core/home-patterns.php` | Add `hdc_home_recent_writing_pattern_markup()` and replace the interim `home-recent-writing` block in `hdc_home_pattern_markup()`. |
| `scripts/sync_page_sources.php` | Re-run only; it already writes `hdc_home_pattern_markup()` into the Home page record. |
| `functions.php` | Remove the six retired child block directories from `hdc_register_theme_blocks()`. |
| `blocks/home-{hero,selected-work,throughline,resume-snapshot,recent-writing,contact-cta}/` | Delete after the front page has been re-synced to core markup. |
| `scripts/api_smoke.sh` | Require core Recent Writing markers and forbid all six custom child block markers. |
| `scripts/no_important_audit.sh` | Remove deleted home child block directories from the audit list. |
| `scripts/playwright/browser-smoke.spec.cjs` | Update homepage Recent Writing assertions away from `data-hdc-home-recent-writing`. |
| `scripts/playwright/home-parity.spec.cjs` | Assert the core Recent Writing section and forbid loading/custom-block markers. |

---

## Task 1: Register and Maintain `reading_time` Post Meta

**Files:**
- Create: `inc/home-core/post-reading-time.php`
- Modify: `inc/home-core/bootstrap.php`
- Test: `tests/post-reading-time-test.php`

- [ ] **Step 1: Write the failing WP-CLI test**

Create `wp-content/themes/henrys-digital-canvas/tests/post-reading-time-test.php`:

```php
<?php
require_once __DIR__ . '/../functions.php';

$failures = 0;

function hdc_phase3_assert( $label, $condition ) {
	global $failures;
	if ( ! $condition ) {
		$failures++;
		echo "FAIL: {$label}\n";
		return;
	}
	echo "PASS: {$label}\n";
}

$registered = get_registered_meta_keys( 'post', 'post' );
hdc_phase3_assert( 'reading_time meta is registered for posts', isset( $registered['reading_time'] ) );
hdc_phase3_assert( 'reading_time meta is REST-visible', ! empty( $registered['reading_time']['show_in_rest'] ) );

$post_id = wp_insert_post(
	array(
		'post_type'    => 'post',
		'post_status'  => 'publish',
		'post_title'   => 'Reading Time Test',
		'post_content' => str_repeat( 'word ', 440 ),
	)
);

hdc_phase3_assert( 'test post inserted', $post_id > 0 );
hdc_phase3_assert( 'reading_time computed on save', '2 min read' === get_post_meta( $post_id, 'reading_time', true ) );

wp_update_post(
	array(
		'ID'           => $post_id,
		'post_content' => str_repeat( 'word ', 20 ),
	)
);

hdc_phase3_assert( 'reading_time recomputed on update', '1 min read' === get_post_meta( $post_id, 'reading_time', true ) );

wp_delete_post( $post_id, true );

if ( $failures > 0 ) {
	exit( 1 );
}

echo "post reading_time checks passed\n";
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
wp --path=/home/dev/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/tests/post-reading-time-test.php
```

Expected: fails because `reading_time` is not registered.

- [ ] **Step 3: Add the module and bootstrap require**

Create `inc/home-core/post-reading-time.php`:

```php
<?php
/**
 * Home Core — native post reading-time meta for Recent Writing.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

function hdc_home_core_register_reading_time_meta(): void {
	register_post_meta(
		'post',
		'reading_time',
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => '__return_true',
		)
	);
}
add_action( 'init', 'hdc_home_core_register_reading_time_meta' );

function hdc_home_core_compute_post_reading_time( int $post_id ): string {
	return hdc_estimate_reading_time( (string) get_post_field( 'post_content', $post_id ) );
}

function hdc_home_core_update_post_reading_time( int $post_id, WP_Post $post = null ): void {
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}

	$post = $post instanceof WP_Post ? $post : get_post( $post_id );
	if ( ! $post instanceof WP_Post || 'post' !== $post->post_type ) {
		return;
	}

	update_post_meta( $post_id, 'reading_time', hdc_home_core_compute_post_reading_time( $post_id ) );
}
add_action( 'save_post_post', 'hdc_home_core_update_post_reading_time', 20, 2 );

function hdc_home_core_backfill_reading_time_meta(): void {
	if ( get_option( 'hdc_post_reading_time_backfilled' ) ) {
		return;
	}

	$post_ids = get_posts(
		array(
			'fields'         => 'ids',
			'numberposts'    => -1,
			'post_status'    => 'any',
			'post_type'      => 'post',
			'posts_per_page' => -1,
		)
	);

	foreach ( $post_ids as $post_id ) {
		hdc_home_core_update_post_reading_time( (int) $post_id );
	}

	update_option( 'hdc_post_reading_time_backfilled', time(), false );
}
add_action( 'init', 'hdc_home_core_backfill_reading_time_meta', 30 );
```

In `inc/home-core/bootstrap.php`, add:

```php
require_once __DIR__ . '/post-reading-time.php';
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
wp --path=/home/dev/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/tests/post-reading-time-test.php
php -l wp-content/themes/henrys-digital-canvas/inc/home-core/post-reading-time.php
```

Expected: `post reading_time checks passed` and no syntax errors.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/post-reading-time.php \
        wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php \
        wp-content/themes/henrys-digital-canvas/tests/post-reading-time-test.php
git commit -m "feat(home): maintain reading time meta for posts"
```

---

## Task 2: Add the Core Recent Writing Pattern

**Files:**
- Modify: `inc/home-core/block-styles.php`
- Modify: `assets/css/home-core.css`
- Modify: `inc/home-core/home-patterns.php`

- [ ] **Step 1: Write the failing markup/render check**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$markup = function_exists( "hdc_home_recent_writing_pattern_markup" ) ? hdc_home_recent_writing_pattern_markup() : "";
echo false !== strpos( $markup, "\"postType\":\"post\"" ) ? "query-ok\n" : "QUERY-MISSING\n";
echo false !== strpos( $markup, "\"key\":\"reading_time\"" ) ? "binding-ok\n" : "BINDING-MISSING\n";
echo false === strpos( hdc_home_pattern_markup(), "wp:henrys-digital-canvas/home-recent-writing" ) ? "interim-removed\n" : "INTERIM-STILL-PRESENT\n";
'
```

Expected before implementation: missing function/binding and interim still present.

- [ ] **Step 2: Register the article row style**

In `inc/home-core/block-styles.php`, add `hdc-article-row` to the `core/group` style list:

```php
'hdc-article-row'  => __( 'HDC Article Row', 'henrys-digital-canvas' ),
```

- [ ] **Step 3: Add article-row CSS**

Append to `assets/css/home-core.css`:

```css
.hdc-home-page__section--writing > .wp-block-query.alignwide {
	margin-left: 0 !important;
	margin-right: 0 !important;
	max-width: none;
	width: 100%;
}

.hdc-home-page__section--writing .wp-block-post-template {
	display: grid;
	gap: 1rem;
	list-style: none;
	margin: 0;
	padding: 0;
}

.is-style-hdc-article-row {
	align-items: flex-start;
	background: hsl(var(--surface-1));
	border: 1px solid hsl(var(--border));
	border-radius: var(--radius-surface);
	display: flex;
	gap: 1rem;
	padding: 1rem;
	position: relative;
}

.is-style-hdc-article-row .wp-block-post-featured-image {
	flex: 0 0 7rem;
	margin: 0;
}

.is-style-hdc-article-row .wp-block-post-featured-image img {
	aspect-ratio: 1;
	border-radius: var(--radius-control);
	display: block;
	height: 7rem;
	object-fit: cover;
	width: 7rem;
}

.is-style-hdc-article-row .wp-block-post-featured-image:empty {
	display: none;
}

.is-style-hdc-article-row .hdc-home-page__post-body {
	display: grid;
	flex: 1 1 auto;
	gap: 0.35rem;
	min-width: 0;
}

.is-style-hdc-article-row .wp-block-post-excerpt {
	margin: 0;
}

.is-style-hdc-article-row .wp-block-post-excerpt__excerpt {
	margin: 0;
}

.is-style-hdc-article-row .hdc-home-page__post-meta {
	color: hsl(var(--text-subtle));
	font-size: 0.875rem;
	gap: 0.75rem;
}

@media (max-width: 639px) {
	.is-style-hdc-article-row {
		flex-direction: column;
	}
}
```

- [ ] **Step 4: Add `hdc_home_recent_writing_pattern_markup()` and use it**

In `inc/home-core/home-patterns.php`, add a builder that returns a core Query Loop section with:
- wrapper `id="recent-writing"` and classes `hdc-home-page__section hdc-home-page__section--writing`;
- header title `Recent Writing` and `/blog` link;
- `core/query` with `postType: "post"`, `perPage: 3`, `orderBy: "date"`, `order: "desc"`;
- `core/post-template` containing a `core/group` with class `is-style-hdc-article-row`;
- `core/post-featured-image`, linked `core/post-title`, `core/post-excerpt`, `core/post-date`, and a `core/paragraph` bound to post meta key `reading_time`;
- `core/query-no-results` with the existing empty-state copy.

Then replace:

```php
$recent_writing = '<!-- wp:henrys-digital-canvas/home-recent-writing {"blogCount":3} /-->';
```

with:

```php
$recent_writing = hdc_home_recent_writing_pattern_markup();
```

- [ ] **Step 5: Run the markup/render checks**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$markup = hdc_home_recent_writing_pattern_markup();
echo false !== strpos( $markup, "\"postType\":\"post\"" ) ? "query-ok\n" : "QUERY-MISSING\n";
echo false !== strpos( $markup, "\"key\":\"reading_time\"" ) ? "binding-ok\n" : "BINDING-MISSING\n";
echo false === strpos( hdc_home_pattern_markup(), "wp:henrys-digital-canvas/home-recent-writing" ) ? "interim-removed\n" : "INTERIM-STILL-PRESENT\n";
$rendered = apply_filters( "the_content", hdc_home_recent_writing_pattern_markup() );
echo false === strpos( $rendered, "Loading recent writing" ) ? "no-loading\n" : "LOADING-STILL-PRESENT\n";
'
```

Expected: all `*-ok`, `interim-removed`, and `no-loading`.

- [ ] **Step 6: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/block-styles.php \
        wp-content/themes/henrys-digital-canvas/assets/css/home-core.css \
        wp-content/themes/henrys-digital-canvas/inc/home-core/home-patterns.php
git commit -m "feat(home): replace Recent Writing with a core query pattern"
```

---

## Task 3: Sync the Front Page and Delete the Six Child Blocks

**Files:**
- Modify: `functions.php`
- Delete: `blocks/home-hero/`
- Delete: `blocks/home-selected-work/`
- Delete: `blocks/home-throughline/`
- Delete: `blocks/home-resume-snapshot/`
- Delete: `blocks/home-recent-writing/`
- Delete: `blocks/home-contact-cta/`

- [ ] **Step 1: Sync the Home page record**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
npm run sync:pages
wp --path=/home/dev/wp-hperkins-com eval '
$pid = (int) get_option( "page_on_front" );
$content = get_post_field( "post_content", $pid );
echo false !== strpos( $content, "\"postType\":\"post\"" ) ? "recent-query-in-db\n" : "RECENT-QUERY-MISSING\n";
echo false === strpos( $content, "wp:henrys-digital-canvas/home-recent-writing" ) ? "custom-recent-gone\n" : "CUSTOM-RECENT-STILL-PRESENT\n";
'
```

Expected: `recent-query-in-db` and `custom-recent-gone`.

- [ ] **Step 2: Remove the six child block registrations**

In `functions.php`, delete these entries from `$block_directories`:

```php
get_stylesheet_directory() . '/blocks/home-hero',
get_stylesheet_directory() . '/blocks/home-selected-work',
get_stylesheet_directory() . '/blocks/home-throughline',
get_stylesheet_directory() . '/blocks/home-resume-snapshot',
get_stylesheet_directory() . '/blocks/home-recent-writing',
get_stylesheet_directory() . '/blocks/home-contact-cta',
```

- [ ] **Step 3: Delete the six child block directories**

```bash
git rm -r wp-content/themes/henrys-digital-canvas/blocks/home-hero \
          wp-content/themes/henrys-digital-canvas/blocks/home-selected-work \
          wp-content/themes/henrys-digital-canvas/blocks/home-throughline \
          wp-content/themes/henrys-digital-canvas/blocks/home-resume-snapshot \
          wp-content/themes/henrys-digital-canvas/blocks/home-recent-writing \
          wp-content/themes/henrys-digital-canvas/blocks/home-contact-cta
```

- [ ] **Step 4: Verify deletion and front-page rendering**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$registry = WP_Block_Type_Registry::get_instance();
foreach ( array( "home-hero", "home-selected-work", "home-throughline", "home-resume-snapshot", "home-recent-writing", "home-contact-cta" ) as $slug ) {
	$name = "henrys-digital-canvas/" . $slug;
	echo $registry->is_registered( $name ) ? "STILL REGISTERED $name\n" : "deregistered $name\n";
}
$pid = (int) get_option( "page_on_front" );
$html = apply_filters( "the_content", get_post_field( "post_content", $pid ) );
echo false !== strpos( $html, "is-style-home-hero" ) ? "hero-renders\n" : "HERO-MISSING\n";
echo false !== strpos( $html, "is-style-hdc-repo-card" ) ? "selected-work-renders\n" : "SELECTED-WORK-MISSING\n";
echo false !== strpos( $html, "hdc-home-page__section--writing" ) ? "recent-writing-renders\n" : "RECENT-WRITING-MISSING\n";
'
```

Expected: every child block `deregistered`, and the three render markers present.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/functions.php
git commit -m "refactor(home): delete retired homepage child blocks"
```

---

## Task 4: Update Referrer Audits, Smoke Checks, and Parity Specs

**Files:**
- Modify: `scripts/api_smoke.sh`
- Modify: `scripts/no_important_audit.sh`
- Modify: `scripts/playwright/browser-smoke.spec.cjs`
- Modify: `scripts/playwright/home-parity.spec.cjs`

- [ ] **Step 1: Update forbidden/required smoke markers**

In `scripts/api_smoke.sh`:
- replace required serialized marker `wp:henrys-digital-canvas/home-recent-writing` with core Query markers such as `"postType":"post"` and `"key":"reading_time"`;
- add `wp:henrys-digital-canvas/home-recent-writing` to the forbidden serialized markers.

In `scripts/no_important_audit.sh`, remove the six deleted home block slugs from the audited block directory list.

- [ ] **Step 2: Update Playwright homepage assertions**

In `scripts/playwright/browser-smoke.spec.cjs` and `scripts/playwright/home-parity.spec.cjs`:
- replace `[data-hdc-home-recent-writing]` selectors with `#recent-writing.hdc-home-page__section`;
- assert the section does not contain `Loading recent writing`;
- when posts exist, assert `.is-style-hdc-article-row` rows render; when no posts exist, assert the empty-state text `Recent writing is updating` renders.

- [ ] **Step 3: Run the referrer scan**

```bash
rg -n "home-hero|home-selected-work|home-throughline|home-resume-snapshot|home-recent-writing|home-contact-cta|wp:henrys-digital-canvas/home" wp-content/themes/henrys-digital-canvas --glob '!docs/plans/**'
```

Expected: no live code refs to the six deleted block names except historical text in deleted-file diffs is impossible because deleted files are gone.

- [ ] **Step 4: Run the smoke/parity gates**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
bash -n scripts/api_smoke.sh scripts/browser_smoke.sh scripts/route_smoke.sh scripts/no_important_audit.sh
BASE_URL=https://wp.hperkins.com npm run smoke:route
RUN_FRONT_PAGE_SHAPE_CHECK=1 BASE_URL=https://wp.hperkins.com npm run smoke:api
npx wp-scripts lint-js scripts/playwright/home-parity.spec.cjs scripts/playwright/browser-smoke.spec.cjs
RUN_HOME_PARITY=1 BASE_URL=https://wp.hperkins.com npm run smoke:browser
```

Expected: all pass; browser smoke may keep its existing one skipped test.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/scripts/api_smoke.sh \
        wp-content/themes/henrys-digital-canvas/scripts/no_important_audit.sh \
        wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs \
        wp-content/themes/henrys-digital-canvas/scripts/playwright/home-parity.spec.cjs
git commit -m "test(home): forbid retired homepage child blocks"
```

---

## Task 5: Final Phase 3 Verification

- [ ] **Step 1: Run aggregate syntax and home-core checks**

```bash
php wp-content/themes/henrys-digital-canvas/tests/repo-logic-test.php
wp --path=/home/dev/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/tests/registration-check.php
wp --path=/home/dev/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/tests/selected-work-binding-test.php
wp --path=/home/dev/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/tests/post-reading-time-test.php
```

Expected: all checks pass.

- [ ] **Step 2: Run final front-page shape check**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$pid = (int) get_option( "page_on_front" );
$content = get_post_field( "post_content", $pid );
$forbidden = array(
	"wp:henrys-digital-canvas/home-hero",
	"wp:henrys-digital-canvas/home-selected-work",
	"wp:henrys-digital-canvas/home-throughline",
	"wp:henrys-digital-canvas/home-resume-snapshot",
	"wp:henrys-digital-canvas/home-recent-writing",
	"wp:henrys-digital-canvas/home-contact-cta",
);
foreach ( $forbidden as $marker ) {
	echo false === strpos( $content, $marker ) ? "absent $marker\n" : "STILL PRESENT $marker\n";
}
echo false !== strpos( $content, "\"key\":\"reading_time\"" ) ? "reading-time-binding-present\n" : "READING-TIME-BINDING-MISSING\n";
'
```

Expected: every deleted child marker absent; reading-time binding present.

- [ ] **Step 3: Commit any final fixes**

Only commit if the verification reveals a needed fix.

---

## Self-Review

- **Spec coverage:** Recent Writing becomes a core Query Loop; `reading_time` is registered, maintained, and backfilled; all six child blocks are deleted; referrer checks and parity smoke are updated.
- **Placeholder scan:** No `TBD` or open implementation placeholders; each task has concrete files and commands.
- **Type/name consistency:** Meta key is consistently `reading_time`; style name is consistently `hdc-article-row`; deleted block slugs match the six Phase-3 child block directories.

## Execution Handoff

Plan complete and saved to `wp-content/themes/henrys-digital-canvas/docs/plans/2026-06-05-homepage-core-block-sync-phase-3-plan.md`. Execute inline with `superpowers:executing-plans` in the current branch; the plan uses frequent commits and the final deploy gate remains outside Phase 3.
