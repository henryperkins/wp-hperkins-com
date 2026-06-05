# Homepage Core-Block Sync — Phase 1 Implementation Plan (Data layer + Selected Work)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a cron-synced `hdc_repo` custom post type and render the homepage's "Selected Work" section as a pure-core `core/query` loop whose card fields resolve from post meta via Block Bindings — proven server-side, with the live homepage left untouched until Phase 2.

**Architecture:** All new code lives under `inc/home-core/`. The merge/derivation/ranking/seed logic is factored into **pure, WordPress-free functions** in `repo-logic.php` so it can be unit-tested with bare `php` (the repo has no PHPUnit harness, and we will not add one). The WordPress-coupled pieces (CPT + meta registration, the WP-Cron sync, the `query_loop_block_query_vars` order filter, the Selected Work block markup + Block Bindings) are verified with `wp eval-file` integration checks — matching the repo's existing `wp eval` + smoke-script convention. Phase 1 ships the machinery and proves the Block-Bindings bet on a scratch page; it does **not** modify the live home page record (that is Phase 2).

**Tech Stack:** WordPress 7.1-alpha + Gutenberg 23.3 (Block Bindings / `core/post-meta` source / `query_loop_block_query_vars` are GA in stable core), PHP 8.5, WP-CLI, vanilla `php` CLI for unit tests. Source of truth for parity: `/home/dev/henry-s-digital-canvas/src/pages/Home.tsx`, `src/components/work/work-utils.ts`, `src/hooks/useGitHubRepos.ts`.

---

## Scope & relationship to the design phases

This plan implements **Phase 1 only** of `docs/plans/2026-06-04-homepage-core-block-sync-design.md` (rev. 3). The other phases are separate plans:

- **Phase 0 (Worker):** a cross-repo prerequisite, summarized below. The WP sync has a `name`-fallback, so Phase 1 works whether or not Phase 0 has shipped.
- **Phase 2 (static patterns + styling + assemble the "Home" pattern + retire the parent wrapper + update `sync_page_sources.php`):** future plan.
- **Phase 3 (Recent Writing + `reading_time` + delete the 6 custom blocks + referrer audit):** future plan.

**Definition of done for Phase 1:** `php tests/repo-logic-test.php` passes; `wp hdc seed-repos` and `wp hdc sync-repos` run cleanly; the `hdc_repo` CPT + all meta are registered with `show_in_rest`; the **binding-resolution test passes** (Selected Work card meta resolves to repo values, not empty/not the page's meta); the hourly cron event is scheduled; `npm run smoke:route` still passes (live homepage unchanged).

## WP-CLI path

This install lives at `/home/dev/wp-hperkins-com` (NOT the `/home/ubuntu` path in CLAUDE.md). Every `wp` command in this plan uses:

```bash
wp --path=/home/dev/wp-hperkins-com <command>
```

## Before you start

Create a feature branch (you are on `main`):

```bash
cd /home/dev/wp-hperkins-com
git checkout -b feat/home-core-sync-phase-1
```

All task commits land on this branch.

---

## Phase 0 prerequisite (Worker repo — `/home/dev/henry-s-digital-canvas`)

`sanitizeGitHubRepo()` (`worker/routes/github.ts:402-430`) does not expose the immutable numeric `id`. Add it (three edits in `worker/routes/github.ts`):

1. Add `id: number;` to the `GitHubRepoResponse` type.
2. Add `id?: unknown;` to the `GitHubRepoPayload` type.
3. Add this line to the object returned by `sanitizeGitHubRepo()`:
   ```ts
   id: Number.isFinite(payload.id as number) ? Number(payload.id) : 0,
   ```

Then, from the worker repo: add/extend a Vitest unit test asserting `sanitizeGitHubRepo({ id: 123, name: "x" }).id === 123` (`npm test`), deploy, and verify live:

```bash
curl -s 'https://hperkins.com/api/github/repos?per_page=1' | jq '.[0].id'
# Expected: a positive integer (e.g. 901234567), not null
```

**This is NOT a Phase-1 task.** Phase 1's sync (Task 14) falls back to a `name` match + warning when `github_id` is `0`, so it functions before Phase 0 ships. Track Phase 0 separately.

---

## Parity refinements to the design doc (read before coding)

While reading the source-of-truth merge (`useGitHubRepos.ts:104-170`), two fields behave differently than the design's original §4 tier table. **This plan implements the source-of-truth behavior** (parity is the project's hard constraint), and these are **now reconciled into the design doc** (rev. 4 — §4 footnotes ¹/², §5 step 3, §13):

1. **`description` is curated-preferred, not live-overwritten.** React: `localRepo?.description || repo.description || "Description coming soon."` — the curated `repos.json` description wins; the live API description is only a fallback. So the sync sets `description` from the API **only when the curated value is empty** (effectively on create), and never clobbers a curated description on update.
2. **`origin` becomes `"github"` whenever a repo is live-present.** React: `mapGitHubRepos` hardcodes `origin: "github"` for every repo returned by the API; only curated-only repos (absent from the API) keep their seeded origin. This matters for `source_badge`/`cta_label`/`badge_label` on the #1 featured card (`tarot`: seeded `origin:"curated"` + a `github.com` URL + `featuredPriority:0`). The sync sets `origin = 'github'` for live-present repos; curated-only repos keep their seeded origin.

Also reconciling §4 vs §6: the Selected Work heading uses the **Post Title** block, so the write path sets `post_title = display_name` (derived) and `post_name` (slug) `= name`. ("name lives in the slug; the title carries the display name.")

---

## File Structure

| File | Responsibility | Created in |
|---|---|---|
| `inc/home-core/bootstrap.php` | Single entry; `require_once`s the home-core tree (wired from `functions.php`). Requires are added incrementally so every commit leaves the site loadable. | Task 1 |
| `inc/home-core/repo-logic.php` | **Pure, WP-free** functions: GitHub-linked test, summary/badge/source-badge/cta/display-name derivations, API mapper, live↦curated merge, rank comparator, two-file seed merge. The unit-tested contract. | Tasks 1–7 |
| `inc/home-core/repo-cpt.php` | `register_post_type( hdc_repo )` + `register_post_meta()` for every key; meta-write helper, find-by-id/name helpers, derived-meta writer, the reconcile-ranks-and-statuses routine. | Task 8 |
| `inc/home-core/markup.php` | `hdc_selected_work_block_markup()` — the `core/query` fragment with `core/post-meta` bindings. | Task 9 |
| `inc/home-core/patterns.php` | Registers the `henrys-digital-canvas/selected-work` block pattern using the markup. | Task 9 |
| `inc/home-core/query-loop.php` | `query_loop_block_query_vars` filter → `orderby menu_order ASC` for the Selected Work loop. | Task 11 |
| `inc/home-core/styles.php` | `register_block_style( 'core/group', 'hdc-repo-card' )` + enqueue `home-core.css` (front + editor). | Task 12 |
| `inc/home-core/seed.php` | `hdc_repo_seed_from_json()` (one-time, idempotent) + `wp hdc seed-repos`. | Task 13 |
| `inc/home-core/sync.php` | `hdc_github_sync()` + soft-fail guard + hourly cron (schedule on `init`, clear on `switch_theme`) + `save_post_hdc_repo` reconcile + `wp hdc sync-repos`. | Task 14 |
| `assets/css/home-core.css` | `.is-style-hdc-repo-card` layout (net-new; Phase-2 polishes visuals) + hide-empty-badge rule. | Task 12 |
| `tests/repo-logic-test.php` | Standalone `php` unit suite for `repo-logic.php`. | Tasks 1–7 |
| `tests/registration-check.php` | `wp eval-file` check: CPT + every meta registered with `show_in_rest`. | Task 8 |
| `tests/selected-work-binding-test.php` | `wp eval-file` integration test: render the Selected Work markup against a fixture `hdc_repo` and assert bindings resolve. | Task 10 |
| `functions.php` | One added `require_once` line for the bootstrap. | Task 1 |

## Pure-logic contract (names are fixed; later tasks depend on them)

All in `inc/home-core/repo-logic.php`, all WP-free, operating on associative arrays:

```
hdc_repo_is_github_linked( array $repo ): bool
hdc_repo_summary( array $repo ): string
hdc_repo_badge_label( array $repo ): string
hdc_repo_source_badge( array $repo, bool $is_live ): string   // '' means "no badge"
hdc_repo_cta_label( array $repo ): string
hdc_repo_display_name( array $repo ): string
hdc_repo_should_keep_live( array $api_repo ): bool            // !fork && !archived
hdc_repo_map_api( array $api_repo ): array                    // worker shape -> normalized live fields
hdc_repo_merge_live_onto_curated( array $curated, array $live ): array
hdc_repo_updated_timestamp( array $repo ): int
hdc_repo_compare_for_rank( array $a, array $b ): int          // usort comparator
hdc_repo_rank_featured( array $repos ): array                 // filter featured -> sort -> reindex
hdc_repo_build_seed( array $repos_json, array $case_study_map ): array
```

---

## Task 1: Scaffold `inc/home-core/` + bootstrap wiring + the standalone test harness

**Files:**
- Create: `wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php`
- Create: `wp-content/themes/henrys-digital-canvas/inc/home-core/repo-logic.php`
- Create: `wp-content/themes/henrys-digital-canvas/tests/repo-logic-test.php`
- Modify: `wp-content/themes/henrys-digital-canvas/functions.php` (after line 125)

- [ ] **Step 1: Create the pure-logic file with its first function**

`inc/home-core/repo-logic.php` (NOTE: intentionally **no** `defined( 'ABSPATH' )` guard — this file must load under bare `php`):

```php
<?php
/**
 * Home Core — pure repo logic (WordPress-free).
 *
 * No WordPress functions may be called here. Faithful PHP ports of:
 *  - src/pages/Home.tsx (summary/badge/source-badge/cta derivations, selection)
 *  - src/components/work/work-utils.ts (getRepoDisplayName, compareReposByUpdatedAtDesc)
 *  - src/hooks/useGitHubRepos.ts (mapGitHubRepos merge precedence)
 *
 * Tested by tests/repo-logic-test.php under bare `php`.
 *
 * @package henrys-digital-canvas
 */

/**
 * Mirror of isGitHubLinkedRepo: origin === 'github' OR url contains 'github.com/'.
 */
function hdc_repo_is_github_linked( array $repo ): bool {
	if ( 'github' === ( isset( $repo['origin'] ) ? (string) $repo['origin'] : '' ) ) {
		return true;
	}
	$url = isset( $repo['url'] ) ? (string) $repo['url'] : '';
	return false !== strpos( $url, 'github.com/' );
}
```

- [ ] **Step 2: Create the standalone test harness with one failing assertion**

`tests/repo-logic-test.php`:

```php
<?php
/**
 * Standalone unit tests for inc/home-core/repo-logic.php.
 * Run from the theme dir:  php tests/repo-logic-test.php
 * No WordPress, no DB, no composer required.
 */

require __DIR__ . '/../inc/home-core/repo-logic.php';

$tests_run    = 0;
$tests_failed = 0;

function hdc_check( string $label, $actual, $expected ): void {
	global $tests_run, $tests_failed;
	$tests_run++;
	$a = var_export( $actual, true );
	$e = var_export( $expected, true );
	if ( $a === $e ) {
		echo "ok   - {$label}\n";
		return;
	}
	$tests_failed++;
	echo "FAIL - {$label}\n     expected: {$e}\n     actual:   {$a}\n";
}

// --- hdc_repo_is_github_linked ---
hdc_check( 'github-linked: origin github', hdc_repo_is_github_linked( array( 'origin' => 'github' ) ), true );
hdc_check( 'github-linked: curated origin + github url', hdc_repo_is_github_linked( array( 'origin' => 'curated', 'url' => 'https://github.com/henryperkins/tarot' ) ), true );
hdc_check( 'github-linked: curated, no github url', hdc_repo_is_github_linked( array( 'origin' => 'curated', 'url' => 'https://example.com/x' ) ), false );

echo "\n{$tests_run} checks, {$tests_failed} failures\n";
exit( $tests_failed > 0 ? 1 : 0 );
```

- [ ] **Step 3: Run the suite to verify it passes (3 checks)**

Run: `cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas && php tests/repo-logic-test.php`
Expected: ends with `3 checks, 0 failures` and exit code 0.

- [ ] **Step 4: Create the bootstrap and wire it into functions.php**

`inc/home-core/bootstrap.php`:

```php
<?php
/**
 * Home Core bootstrap — loads the synced hdc_repo CPT + Selected Work tree.
 *
 * Pure (WP-free) logic lives in repo-logic.php. Further requires are added by
 * later tasks as each file is created, so every commit stays loadable.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/repo-logic.php';
```

In `functions.php`, immediately after line 125 (`require_once get_stylesheet_directory() . '/inc/rest-api.php';`), add:

```php
require_once get_stylesheet_directory() . '/inc/home-core/bootstrap.php';
```

- [ ] **Step 5: Verify WordPress still loads (no fatal)**

Run: `wp --path=/home/dev/wp-hperkins-com eval 'echo function_exists("hdc_repo_is_github_linked") ? "loaded\n" : "MISSING\n";'`
Expected: `loaded`

- [ ] **Step 6: Commit**

```bash
cd /home/dev/wp-hperkins-com
git add wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php \
        wp-content/themes/henrys-digital-canvas/inc/home-core/repo-logic.php \
        wp-content/themes/henrys-digital-canvas/tests/repo-logic-test.php \
        wp-content/themes/henrys-digital-canvas/functions.php
git commit -m "feat(home-core): scaffold inc/home-core tree + pure-logic test harness"
```

---

## Task 2: Pure logic — `hdc_repo_summary`

**Files:**
- Modify: `inc/home-core/repo-logic.php`
- Test: `tests/repo-logic-test.php`

- [ ] **Step 1: Add the failing tests**

In `tests/repo-logic-test.php`, before the final `echo`, add:

```php
// --- hdc_repo_summary (whyItMatters ?? description; '' treated as unset per WP meta) ---
hdc_check( 'summary: why_it_matters wins', hdc_repo_summary( array( 'why_it_matters' => 'Because X.', 'description' => 'Desc.' ) ), 'Because X.' );
hdc_check( 'summary: empty why falls back to description', hdc_repo_summary( array( 'why_it_matters' => '', 'description' => 'Desc.' ) ), 'Desc.' );
hdc_check( 'summary: missing why falls back to description', hdc_repo_summary( array( 'description' => 'Desc.' ) ), 'Desc.' );
hdc_check( 'summary: both empty -> empty', hdc_repo_summary( array() ), '' );
```

- [ ] **Step 2: Run to verify the new tests fail**

Run: `php tests/repo-logic-test.php`
Expected: FAIL lines for the summary checks with `Call to undefined function hdc_repo_summary()` (fatal) — that is the red state.

- [ ] **Step 3: Implement `hdc_repo_summary`**

Append to `inc/home-core/repo-logic.php`:

```php
/**
 * Mirror of getHomeRepoSummary: whyItMatters ?? description.
 * WP post meta is '' when unset, so an empty why_it_matters falls back to description.
 */
function hdc_repo_summary( array $repo ): string {
	$why = isset( $repo['why_it_matters'] ) ? trim( (string) $repo['why_it_matters'] ) : '';
	if ( '' !== $why ) {
		return $why;
	}
	return isset( $repo['description'] ) ? (string) $repo['description'] : '';
}
```

- [ ] **Step 4: Run to verify all pass**

Run: `php tests/repo-logic-test.php`
Expected: ends with `7 checks, 0 failures`.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/repo-logic.php \
        wp-content/themes/henrys-digital-canvas/tests/repo-logic-test.php
git commit -m "feat(home-core): port getHomeRepoSummary to PHP"
```

---

## Task 3: Pure logic — `hdc_repo_badge_label`, `hdc_repo_source_badge`, `hdc_repo_cta_label`

**Files:**
- Modify: `inc/home-core/repo-logic.php`
- Test: `tests/repo-logic-test.php`

- [ ] **Step 1: Add the failing tests**

Add before the final `echo` in `tests/repo-logic-test.php`:

```php
// --- hdc_repo_badge_label ---
hdc_check( 'badge: private', hdc_repo_badge_label( array( 'access' => 'private' ) ), 'Private case study' );
hdc_check( 'badge: github-linked -> open source', hdc_repo_badge_label( array( 'access' => 'public', 'origin' => 'github' ) ), 'Open source' );
hdc_check( 'badge: curated url github -> open source', hdc_repo_badge_label( array( 'access' => 'public', 'origin' => 'curated', 'url' => 'https://github.com/x/y' ) ), 'Open source' );
hdc_check( 'badge: curated -> curated project', hdc_repo_badge_label( array( 'access' => 'public', 'origin' => 'curated', 'url' => '' ) ), 'Curated project' );

// --- hdc_repo_source_badge (is_live flag mirrors Home.tsx source === 'live') ---
hdc_check( 'source: private -> none', hdc_repo_source_badge( array( 'access' => 'private', 'origin' => 'github' ), true ), '' );
hdc_check( 'source: live + github -> Live GitHub', hdc_repo_source_badge( array( 'access' => 'public', 'origin' => 'github' ), true ), 'Live GitHub' );
hdc_check( 'source: live + non-github origin -> none', hdc_repo_source_badge( array( 'access' => 'public', 'origin' => 'curated', 'url' => 'https://github.com/x/y' ), true ), '' );
hdc_check( 'source: snapshot + github-linked -> GitHub snapshot', hdc_repo_source_badge( array( 'access' => 'public', 'origin' => 'curated', 'url' => 'https://github.com/x/y' ), false ), 'GitHub snapshot' );
hdc_check( 'source: snapshot + not linked -> none', hdc_repo_source_badge( array( 'access' => 'public', 'origin' => 'curated', 'url' => '' ), false ), '' );

// --- hdc_repo_cta_label ---
hdc_check( 'cta: github public -> View project', hdc_repo_cta_label( array( 'origin' => 'github', 'access' => 'public' ) ), 'View project' );
hdc_check( 'cta: github private -> View case study', hdc_repo_cta_label( array( 'origin' => 'github', 'access' => 'private' ) ), 'View case study' );
hdc_check( 'cta: curated -> View case study', hdc_repo_cta_label( array( 'origin' => 'curated', 'access' => 'public' ) ), 'View case study' );
```

- [ ] **Step 2: Run to verify the new tests fail**

Run: `php tests/repo-logic-test.php`
Expected: fatal `Call to undefined function hdc_repo_badge_label()`.

- [ ] **Step 3: Implement the three functions**

Append to `inc/home-core/repo-logic.php`:

```php
/**
 * Mirror of getHomeRepoBadge.
 */
function hdc_repo_badge_label( array $repo ): string {
	if ( 'private' === ( isset( $repo['access'] ) ? (string) $repo['access'] : '' ) ) {
		return 'Private case study';
	}
	if ( hdc_repo_is_github_linked( $repo ) ) {
		return 'Open source';
	}
	return 'Curated project';
}

/**
 * Mirror of getHomeRepoSourceBadge. Returns '' instead of null so it stores as
 * empty post meta (the card CSS hides empty badge elements).
 *
 * @param bool $is_live True when the sync's last result was live (source === 'live').
 */
function hdc_repo_source_badge( array $repo, bool $is_live ): string {
	if ( 'private' === ( isset( $repo['access'] ) ? (string) $repo['access'] : '' ) ) {
		return '';
	}
	if ( $is_live ) {
		return ( 'github' === ( isset( $repo['origin'] ) ? (string) $repo['origin'] : '' ) ) ? 'Live GitHub' : '';
	}
	return hdc_repo_is_github_linked( $repo ) ? 'GitHub snapshot' : '';
}

/**
 * Mirror of getHomeRepoCtaLabel.
 */
function hdc_repo_cta_label( array $repo ): string {
	$origin = isset( $repo['origin'] ) ? (string) $repo['origin'] : '';
	$access = isset( $repo['access'] ) ? (string) $repo['access'] : '';
	if ( 'github' === $origin && 'private' !== $access ) {
		return 'View project';
	}
	return 'View case study';
}
```

- [ ] **Step 4: Run to verify all pass**

Run: `php tests/repo-logic-test.php`
Expected: ends with `19 checks, 0 failures`.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/repo-logic.php \
        wp-content/themes/henrys-digital-canvas/tests/repo-logic-test.php
git commit -m "feat(home-core): port badge/source-badge/cta derivations to PHP"
```

---

## Task 4: Pure logic — `hdc_repo_display_name`

**Files:**
- Modify: `inc/home-core/repo-logic.php`
- Test: `tests/repo-logic-test.php`

- [ ] **Step 1: Add the failing tests**

Add before the final `echo`:

```php
// --- hdc_repo_display_name (getRepoDisplayName: curated displayName, else title-case slug; tokens <=3 chars uppercased) ---
hdc_check( 'display: curated wins', hdc_repo_display_name( array( 'display_name' => 'HPerkins.com', 'name' => 'henry-s-digital-canvas' ) ), 'HPerkins.com' );
hdc_check( 'display: derive title-case', hdc_repo_display_name( array( 'name' => 'my-cool-project' ) ), 'My Cool Project' );
hdc_check( 'display: short tokens uppercased', hdc_repo_display_name( array( 'name' => 'ai-cli-web-funnel' ) ), 'AI CLI Web Funnel' );
hdc_check( 'display: underscores split too', hdc_repo_display_name( array( 'name' => 'data_sync' ) ), 'Data Sync' );
```

- [ ] **Step 2: Run to verify fail**

Run: `php tests/repo-logic-test.php`
Expected: fatal `Call to undefined function hdc_repo_display_name()`.

- [ ] **Step 3: Implement `hdc_repo_display_name`**

Append to `inc/home-core/repo-logic.php`:

```php
/**
 * Mirror of getRepoDisplayName: prefer curated display name; else split the
 * kebab/snake slug into tokens, uppercasing tokens of length <= 3 and
 * capitalizing the rest.
 */
function hdc_repo_display_name( array $repo ): string {
	$display = isset( $repo['display_name'] ) ? trim( (string) $repo['display_name'] ) : '';
	if ( '' !== $display ) {
		return $display;
	}

	$name   = isset( $repo['name'] ) ? (string) $repo['name'] : '';
	$tokens = preg_split( '/[-_]/', $name );
	$tokens = array_values( array_filter( (array) $tokens, static function ( $token ) {
		return '' !== $token;
	} ) );
	$tokens = array_map(
		static function ( $token ) {
			if ( strlen( $token ) <= 3 ) {
				return strtoupper( $token );
			}
			return strtoupper( substr( $token, 0, 1 ) ) . substr( $token, 1 );
		},
		$tokens
	);

	return implode( ' ', $tokens );
}
```

- [ ] **Step 4: Run to verify all pass**

Run: `php tests/repo-logic-test.php`
Expected: ends with `23 checks, 0 failures`.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/repo-logic.php \
        wp-content/themes/henrys-digital-canvas/tests/repo-logic-test.php
git commit -m "feat(home-core): port getRepoDisplayName to PHP"
```

---

## Task 5: Pure logic — API mapper, fork/archive filter, and live↦curated merge

**Files:**
- Modify: `inc/home-core/repo-logic.php`
- Test: `tests/repo-logic-test.php`

- [ ] **Step 1: Add the failing tests (incl. the `tarot`-style curated-origin + live-present case)**

Add before the final `echo`:

```php
// --- hdc_repo_should_keep_live (drop forks/archived) ---
hdc_check( 'keep: normal repo', hdc_repo_should_keep_live( array( 'fork' => false, 'archived' => false ) ), true );
hdc_check( 'keep: fork dropped', hdc_repo_should_keep_live( array( 'fork' => true, 'archived' => false ) ), false );
hdc_check( 'keep: archived dropped', hdc_repo_should_keep_live( array( 'fork' => false, 'archived' => true ) ), false );

// --- hdc_repo_map_api (worker shape -> normalized live fields; pushed_at -> updated_at date) ---
$api = array(
	'id'               => 42,
	'name'             => 'tarot',
	'description'      => 'live desc',
	'language'         => 'JavaScript',
	'stargazers_count' => 5,
	'forks_count'      => 2,
	'pushed_at'        => '2026-05-01T12:34:56Z',
	'html_url'         => 'https://github.com/henryperkins/tarot',
	'topics'           => array( 'ai', 'tarot', 7 ),
);
$mapped = hdc_repo_map_api( $api );
hdc_check( 'map: github_id', $mapped['github_id'], 42 );
hdc_check( 'map: stars from stargazers_count', $mapped['stars'], 5 );
hdc_check( 'map: forks from forks_count', $mapped['forks'], 2 );
hdc_check( 'map: updated_at = pushed_at date', $mapped['updated_at'], '2026-05-01' );
hdc_check( 'map: url from html_url', $mapped['url'], 'https://github.com/henryperkins/tarot' );
hdc_check( 'map: topics strings only', $mapped['topics'], array( 'ai', 'tarot' ) );
hdc_check( 'map: missing pushed_at -> epoch date', hdc_repo_map_api( array( 'name' => 'x' ) )['updated_at'], '1970-01-01' );

// --- hdc_repo_merge_live_onto_curated ---
$curated = array(
	'name'              => 'tarot',
	'origin'            => 'curated',          // seeded value
	'access'            => 'public',
	'featured'          => true,
	'featured_priority' => 0,
	'why_it_matters'    => 'Reading UX.',
	'display_name'      => 'Tarot',
	'description'       => 'curated desc',     // curated wins over live
	'language'          => 'JavaScript',
	'stars'             => 0,
	'forks'             => 0,
	'updated_at'        => '2026-04-04',
	'url'               => 'https://github.com/henryperkins/tarot',
	'topics'            => array( 'old' ),
);
$merged = hdc_repo_merge_live_onto_curated( $curated, $mapped );
hdc_check( 'merge: origin forced github when live-present', $merged['origin'], 'github' );
hdc_check( 'merge: description stays curated', $merged['description'], 'curated desc' );
hdc_check( 'merge: stars/forks/url/updated from live', array( $merged['stars'], $merged['forks'], $merged['updated_at'] ), array( 5, 2, '2026-05-01' ) );
hdc_check( 'merge: topics replaced by non-empty live', $merged['topics'], array( 'ai', 'tarot' ) );
hdc_check( 'merge: curated featured/access untouched', array( $merged['featured'], $merged['access'], $merged['why_it_matters'] ), array( true, 'public', 'Reading UX.' ) );
hdc_check( 'merge: empty curated description falls back to live', hdc_repo_merge_live_onto_curated( array( 'description' => '' ) + $curated, $mapped )['description'], 'live desc' );
```

- [ ] **Step 2: Run to verify fail**

Run: `php tests/repo-logic-test.php`
Expected: fatal `Call to undefined function hdc_repo_should_keep_live()`.

- [ ] **Step 3: Implement the three functions**

Append to `inc/home-core/repo-logic.php`:

```php
/**
 * Mirror of mapGitHubRepos' fork/archived filter.
 */
function hdc_repo_should_keep_live( array $api_repo ): bool {
	return empty( $api_repo['fork'] ) && empty( $api_repo['archived'] );
}

/**
 * Normalize one worker /api/github/repos entry to the live fields we store.
 * pushed_at (date-only) -> updated_at, stargazers_count -> stars, etc.
 */
function hdc_repo_map_api( array $api_repo ): array {
	$pushed_at  = isset( $api_repo['pushed_at'] ) ? (string) $api_repo['pushed_at'] : '';
	$updated_at = '' !== $pushed_at ? substr( $pushed_at, 0, 10 ) : '1970-01-01';

	$topics = array();
	if ( isset( $api_repo['topics'] ) && is_array( $api_repo['topics'] ) ) {
		foreach ( $api_repo['topics'] as $topic ) {
			if ( is_string( $topic ) && '' !== $topic ) {
				$topics[] = $topic;
			}
		}
	}

	return array(
		'github_id'   => ( isset( $api_repo['id'] ) && is_numeric( $api_repo['id'] ) ) ? (int) $api_repo['id'] : 0,
		'name'        => isset( $api_repo['name'] ) ? (string) $api_repo['name'] : '',
		'description' => ( isset( $api_repo['description'] ) && is_string( $api_repo['description'] ) ) ? $api_repo['description'] : '',
		'language'    => ( isset( $api_repo['language'] ) && is_string( $api_repo['language'] ) ) ? $api_repo['language'] : '',
		'stars'       => isset( $api_repo['stargazers_count'] ) ? (int) $api_repo['stargazers_count'] : 0,
		'forks'       => isset( $api_repo['forks_count'] ) ? (int) $api_repo['forks_count'] : 0,
		'updated_at'  => $updated_at,
		'url'         => isset( $api_repo['html_url'] ) ? (string) $api_repo['html_url'] : '',
		'topics'      => $topics,
	);
}

/**
 * Merge live (API) fields onto a curated record, mirroring mapGitHubRepos
 * precedence. origin becomes 'github' (live-present); curated description wins;
 * language live ?? curated ?? 'Unknown'; topics live-if-non-empty; curated
 * featured/featured_priority/access/why_it_matters/display_name are untouched.
 */
function hdc_repo_merge_live_onto_curated( array $curated, array $live ): array {
	$merged = $curated;

	$merged['origin']     = 'github';
	$merged['stars']      = (int) ( $live['stars'] ?? 0 );
	$merged['forks']      = (int) ( $live['forks'] ?? 0 );
	$merged['url']        = (string) ( $live['url'] ?? ( $curated['url'] ?? '' ) );
	$merged['updated_at'] = (string) ( $live['updated_at'] ?? ( $curated['updated_at'] ?? '' ) );

	$live_lang    = (string) ( $live['language'] ?? '' );
	$curated_lang = (string) ( $curated['language'] ?? '' );
	$merged['language'] = '' !== $live_lang ? $live_lang : ( '' !== $curated_lang ? $curated_lang : 'Unknown' );

	if ( isset( $live['topics'] ) && is_array( $live['topics'] ) && ! empty( $live['topics'] ) ) {
		$merged['topics'] = $live['topics'];
	}

	$curated_desc = (string) ( $curated['description'] ?? '' );
	$merged['description'] = '' !== $curated_desc ? $curated_desc : (string) ( $live['description'] ?? '' );

	if ( ! empty( $live['github_id'] ) ) {
		$merged['github_id'] = (int) $live['github_id'];
	}

	return $merged;
}
```

- [ ] **Step 4: Run to verify all pass**

Run: `php tests/repo-logic-test.php`
Expected: ends with `39 checks, 0 failures`.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/repo-logic.php \
        wp-content/themes/henrys-digital-canvas/tests/repo-logic-test.php
git commit -m "feat(home-core): port mapGitHubRepos merge precedence to PHP"
```

---

## Task 6: Pure logic — rank comparator + `hdc_repo_rank_featured`

**Files:**
- Modify: `inc/home-core/repo-logic.php`
- Test: `tests/repo-logic-test.php`

- [ ] **Step 1: Add the failing tests (covers the common no-priority path + tiebreak)**

Add before the final `echo`:

```php
// --- ranking: priority asc (missing -> last), then updated_at desc, then name asc ---
$repos = array(
	array( 'name' => 'zeta',  'featured' => true,  'featured_priority' => null, 'updated_at' => '2026-01-01' ),
	array( 'name' => 'alpha', 'featured' => true,  'featured_priority' => null, 'updated_at' => '2026-01-01' ), // tie w/ zeta -> alpha first
	array( 'name' => 'top',   'featured' => true,  'featured_priority' => 0,    'updated_at' => '2020-01-01' ), // explicit priority wins
	array( 'name' => 'newer', 'featured' => true,  'featured_priority' => null, 'updated_at' => '2026-09-09' ), // newest among no-priority
	array( 'name' => 'skip',  'featured' => false, 'featured_priority' => 1,    'updated_at' => '2099-01-01' ), // not featured
);
$ranked = array_map( static function ( $r ) { return $r['name']; }, hdc_repo_rank_featured( $repos ) );
hdc_check( 'rank: order', $ranked, array( 'top', 'newer', 'alpha', 'zeta' ) );
hdc_check( 'rank: drops non-featured', in_array( 'skip', $ranked, true ), false );

// --- updated timestamp helper ---
hdc_check( 'ts: valid date', hdc_repo_updated_timestamp( array( 'updated_at' => '2026-01-01' ) ) > 0, true );
hdc_check( 'ts: empty -> 0', hdc_repo_updated_timestamp( array( 'updated_at' => '' ) ), 0 );
```

- [ ] **Step 2: Run to verify fail**

Run: `php tests/repo-logic-test.php`
Expected: fatal `Call to undefined function hdc_repo_rank_featured()`.

- [ ] **Step 3: Implement the comparator, timestamp helper, and ranker**

Append to `inc/home-core/repo-logic.php`:

```php
/**
 * Parse updated_at to a sortable Unix timestamp (0 when empty/invalid),
 * mirroring getRepoUpdatedTimestamp's NaN -> 0 behavior.
 */
function hdc_repo_updated_timestamp( array $repo ): int {
	$updated = isset( $repo['updated_at'] ) ? (string) $repo['updated_at'] : '';
	if ( '' === $updated ) {
		return 0;
	}
	$ts = strtotime( $updated );
	return false === $ts ? 0 : (int) $ts;
}

/**
 * usort comparator mirroring Home.tsx featured sort + compareReposByUpdatedAtDesc:
 * featuredPriority ascending (missing -> PHP_INT_MAX), then updated_at descending,
 * then name ascending.
 */
function hdc_repo_compare_for_rank( array $a, array $b ): int {
	$pa = ( isset( $a['featured_priority'] ) && '' !== $a['featured_priority'] && is_numeric( $a['featured_priority'] ) )
		? (int) $a['featured_priority'] : PHP_INT_MAX;
	$pb = ( isset( $b['featured_priority'] ) && '' !== $b['featured_priority'] && is_numeric( $b['featured_priority'] ) )
		? (int) $b['featured_priority'] : PHP_INT_MAX;
	if ( $pa !== $pb ) {
		return $pa <=> $pb;
	}

	$ta = hdc_repo_updated_timestamp( $a );
	$tb = hdc_repo_updated_timestamp( $b );
	if ( $ta !== $tb ) {
		return $tb <=> $ta; // descending
	}

	return strcmp( (string) ( $a['name'] ?? '' ), (string) ( $b['name'] ?? '' ) );
}

/**
 * Mirror of Home.tsx: filter featured, sort by the comparator. (Caller slices to 3.)
 */
function hdc_repo_rank_featured( array $repos ): array {
	$featured = array_values( array_filter( $repos, static function ( $r ) {
		return is_array( $r ) && ! empty( $r['featured'] );
	} ) );
	usort( $featured, 'hdc_repo_compare_for_rank' );
	return $featured;
}
```

- [ ] **Step 4: Run to verify all pass**

Run: `php tests/repo-logic-test.php`
Expected: ends with `43 checks, 0 failures`.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/repo-logic.php \
        wp-content/themes/henrys-digital-canvas/tests/repo-logic-test.php
git commit -m "feat(home-core): port featured-repo ranking comparator to PHP"
```

---

## Task 7: Pure logic — two-file seed merge (`hdc_repo_build_seed`)

**Files:**
- Modify: `inc/home-core/repo-logic.php`
- Test: `tests/repo-logic-test.php`

- [ ] **Step 1: Add the failing tests (why_it_matters comes from case-study map, not repos.json)**

Add before the final `echo`:

```php
// --- seed merge: repos.json supplies curated+snapshot; case-study map supplies why_it_matters + (winning) displayName ---
$repos_json = array(
	array(
		'name' => 'henry-s-digital-canvas', 'description' => 'Portfolio.', 'language' => 'TypeScript',
		'stars' => 1, 'forks' => 0, 'updatedAt' => '2026-04-04', 'url' => 'https://github.com/henryperkins/henry-s-digital-canvas',
		'topics' => array( 'portfolio' ), 'featured' => true, 'featuredPriority' => 0, 'origin' => 'curated', 'access' => 'public',
		// note: NO whyItMatters and NO displayName in repos.json
	),
	array( 'name' => 'bare', 'origin' => 'github', 'access' => 'public' ), // minimal entry
);
$case_study_map = array(
	'henry-s-digital-canvas' => array( 'displayName' => 'HPerkins.com', 'whyItMatters' => 'Proof surface.' ),
);
$seed = hdc_repo_build_seed( $repos_json, $case_study_map );
hdc_check( 'seed: count', count( $seed ), 2 );
hdc_check( 'seed: why_it_matters from case-study map', $seed[0]['why_it_matters'], 'Proof surface.' );
hdc_check( 'seed: display_name from case-study map (wins)', $seed[0]['display_name'], 'HPerkins.com' );
hdc_check( 'seed: snapshot stars/updated from repos.json', array( $seed[0]['stars'], $seed[0]['updated_at'] ), array( 1, '2026-04-04' ) );
hdc_check( 'seed: featured + priority', array( $seed[0]['featured'], $seed[0]['featured_priority'] ), array( true, 0 ) );
hdc_check( 'seed: minimal entry has empty why', $seed[1]['why_it_matters'], '' );
hdc_check( 'seed: minimal entry priority null', $seed[1]['featured_priority'], null );
hdc_check( 'seed: minimal entry origin preserved', $seed[1]['origin'], 'github' );
```

- [ ] **Step 2: Run to verify fail**

Run: `php tests/repo-logic-test.php`
Expected: fatal `Call to undefined function hdc_repo_build_seed()`.

- [ ] **Step 3: Implement `hdc_repo_build_seed`**

Append to `inc/home-core/repo-logic.php`:

```php
/**
 * Build the one-time seed records by merging repos.json (curated + a live
 * snapshot) with repo-case-study-details.json (keyed by repo name; supplies
 * why_it_matters and the winning display_name). Mirrors React's mergeRepoDetails,
 * where case-study details are spread last.
 *
 * @param array $repos_json     Decoded blocks/work-showcase/data/repos.json (list).
 * @param array $case_study_map Decoded repo-case-study-details.json (object keyed by name).
 * @return array<int,array> Seed records.
 */
function hdc_repo_build_seed( array $repos_json, array $case_study_map ): array {
	$seed = array();

	foreach ( $repos_json as $repo ) {
		if ( ! is_array( $repo ) || empty( $repo['name'] ) ) {
			continue;
		}
		$name    = (string) $repo['name'];
		$details = ( isset( $case_study_map[ $name ] ) && is_array( $case_study_map[ $name ] ) ) ? $case_study_map[ $name ] : array();

		$display_name = '';
		if ( ! empty( $details['displayName'] ) ) {
			$display_name = (string) $details['displayName'];
		} elseif ( ! empty( $repo['displayName'] ) ) {
			$display_name = (string) $repo['displayName'];
		}

		$topics = ( isset( $repo['topics'] ) && is_array( $repo['topics'] ) )
			? array_values( array_filter( $repo['topics'], 'is_string' ) )
			: array();

		$seed[] = array(
			'name'              => $name,
			// curated
			'featured'          => ! empty( $repo['featured'] ),
			'featured_priority' => ( isset( $repo['featuredPriority'] ) && is_numeric( $repo['featuredPriority'] ) ) ? (int) $repo['featuredPriority'] : null,
			'origin'            => isset( $repo['origin'] ) ? (string) $repo['origin'] : 'curated',
			'access'            => isset( $repo['access'] ) ? (string) $repo['access'] : 'public',
			'display_name'      => $display_name,
			'why_it_matters'    => ! empty( $details['whyItMatters'] ) ? (string) $details['whyItMatters'] : '',
			// initial live snapshot from repos.json
			'description'       => isset( $repo['description'] ) ? (string) $repo['description'] : '',
			'language'          => isset( $repo['language'] ) ? (string) $repo['language'] : '',
			'stars'             => isset( $repo['stars'] ) ? (int) $repo['stars'] : 0,
			'forks'             => isset( $repo['forks'] ) ? (int) $repo['forks'] : 0,
			'updated_at'        => isset( $repo['updatedAt'] ) ? (string) $repo['updatedAt'] : '',
			'url'               => isset( $repo['url'] ) ? (string) $repo['url'] : '',
			'topics'            => $topics,
		);
	}

	return $seed;
}
```

- [ ] **Step 4: Run to verify all pass**

Run: `php tests/repo-logic-test.php`
Expected: ends with `51 checks, 0 failures`.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/repo-logic.php \
        wp-content/themes/henrys-digital-canvas/tests/repo-logic-test.php
git commit -m "feat(home-core): port two-file seed merge to PHP"
```

---

## Task 8: Register the `hdc_repo` CPT + all meta + shared WP helpers

**Files:**
- Create: `inc/home-core/repo-cpt.php`
- Create: `tests/registration-check.php`
- Modify: `inc/home-core/bootstrap.php`

- [ ] **Step 1: Write the CPT + meta registration + helpers**

`inc/home-core/repo-cpt.php`:

```php
<?php
/**
 * Home Core — hdc_repo CPT + meta registration + shared write/reconcile helpers.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the non-public, admin-visible hdc_repo CPT.
 */
function hdc_repo_register_post_type(): void {
	register_post_type(
		'hdc_repo',
		array(
			'labels'       => array(
				'name'          => __( 'Repos', 'henrys-digital-canvas' ),
				'singular_name' => __( 'Repo', 'henrys-digital-canvas' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => true,
			'show_in_rest' => true,
			'menu_icon'    => 'dashicons-archive',
			'supports'     => array( 'title', 'custom-fields' ),
			'has_archive'  => false,
			'rewrite'      => false,
		)
	);
}
add_action( 'init', 'hdc_repo_register_post_type' );

/**
 * Register all hdc_repo meta with show_in_rest + sanitizers.
 */
function hdc_repo_register_meta(): void {
	$string_keys = array(
		'why_it_matters',
		'display_name',
		'origin',
		'access',
		'description',
		'language',
		'updated_at',
		'summary',
		'badge_label',
		'source_badge',
		'cta_label',
		'last_sync_source',
	);
	foreach ( $string_keys as $key ) {
		register_post_meta(
			'hdc_repo',
			$key,
			array(
				'single'            => true,
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
	}

	register_post_meta(
		'hdc_repo',
		'url',
		array(
			'single'            => true,
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'esc_url_raw',
		)
	);

	$int_keys = array( 'github_id', 'featured_priority', 'stars', 'forks' );
	foreach ( $int_keys as $key ) {
		register_post_meta(
			'hdc_repo',
			$key,
			array(
				'single'            => true,
				'type'              => 'integer',
				'show_in_rest'      => true,
				'sanitize_callback' => 'absint',
			)
		);
	}

	register_post_meta(
		'hdc_repo',
		'featured',
		array(
			'single'            => true,
			'type'              => 'boolean',
			'show_in_rest'      => true,
			'sanitize_callback' => 'rest_sanitize_boolean',
		)
	);

	register_post_meta(
		'hdc_repo',
		'topics',
		array(
			'single'            => true,
			'type'              => 'array',
			'show_in_rest'      => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array( 'type' => 'string' ),
				),
			),
			'sanitize_callback' => 'hdc_repo_sanitize_topics',
		)
	);
}
add_action( 'init', 'hdc_repo_register_meta' );

/**
 * Sanitize the topics array meta.
 *
 * @param mixed $value Raw value.
 * @return array<int,string>
 */
function hdc_repo_sanitize_topics( $value ): array {
	if ( ! is_array( $value ) ) {
		return array();
	}
	return array_values( array_map( 'sanitize_text_field', array_filter( $value, 'is_string' ) ) );
}

/**
 * Find an hdc_repo post id by immutable github_id (0 = not found).
 */
function hdc_repo_find_by_github_id( int $github_id ): int {
	if ( $github_id <= 0 ) {
		return 0;
	}
	$found = get_posts(
		array(
			'post_type'        => 'hdc_repo',
			'post_status'      => 'any',
			'numberposts'      => 1,
			'fields'           => 'ids',
			'meta_key'         => 'github_id',
			'meta_value'       => $github_id,
			'suppress_filters' => false,
		)
	);
	return $found ? (int) $found[0] : 0;
}

/**
 * Fallback lookup by repo name (slug). Used until github_id is present.
 */
function hdc_repo_find_by_name( string $name ): int {
	$name = sanitize_title( $name );
	if ( '' === $name ) {
		return 0;
	}
	$page = get_page_by_path( $name, OBJECT, 'hdc_repo' );
	return $page ? (int) $page->ID : 0;
}

/**
 * Write derived meta (summary/badge_label/source_badge/cta_label) for a repo,
 * plus title/slug. Shared by seed + sync.
 *
 * @param int   $post_id Target post.
 * @param array $repo    Merged repo record (curated + live).
 * @param bool  $is_live Whether the source was a live sync (affects source_badge).
 */
function hdc_repo_write_derived( int $post_id, array $repo, bool $is_live ): void {
	$display = hdc_repo_display_name( $repo );

	wp_update_post(
		array(
			'ID'         => $post_id,
			'post_title' => $display,
			'post_name'  => sanitize_title( (string) ( $repo['name'] ?? '' ) ),
		)
	);

	update_post_meta( $post_id, 'display_name', $display );
	update_post_meta( $post_id, 'summary', hdc_repo_summary( $repo ) );
	update_post_meta( $post_id, 'badge_label', hdc_repo_badge_label( $repo ) );
	update_post_meta( $post_id, 'source_badge', hdc_repo_source_badge( $repo, $is_live ) );
	update_post_meta( $post_id, 'cta_label', hdc_repo_cta_label( $repo ) );
}

/**
 * Re-entrancy guard so the bulk wp_update_post() calls in reconcile()/sync()/seed()
 * do not re-trigger the save_post_hdc_repo handler (which would recurse into
 * reconcile() forever). Plain begin/end (no try/finally): a leaked counter only
 * suppresses further hdc_repo saves within the same request — harmless, and it
 * resets on the next request.
 */
function hdc_repo_suppress_begin(): void {
	$GLOBALS['hdc_repo_suppress_save'] = ( $GLOBALS['hdc_repo_suppress_save'] ?? 0 ) + 1;
}
function hdc_repo_suppress_end(): void {
	if ( ! empty( $GLOBALS['hdc_repo_suppress_save'] ) ) {
		$GLOBALS['hdc_repo_suppress_save']--;
	}
}
function hdc_repo_is_suppressing(): bool {
	return ! empty( $GLOBALS['hdc_repo_suppress_save'] );
}

/**
 * Recompute menu_order rank + post_status for every hdc_repo from curated
 * featured/featured_priority. Featured -> publish + rank 0..N; else draft.
 * Shared by cron, seed, and the save_post hook. Suppresses save_post recursion.
 */
function hdc_repo_reconcile(): void {
	hdc_repo_suppress_begin();
	$ids = get_posts(
		array(
			'post_type'        => 'hdc_repo',
			'post_status'      => 'any',
			'numberposts'      => -1,
			'fields'           => 'ids',
			'suppress_filters' => false,
		)
	);

	$rows = array();
	foreach ( $ids as $id ) {
		$id     = (int) $id;
		$rows[] = array(
			'id'                => $id,
			'name'              => (string) get_post_field( 'post_name', $id ),
			'featured'          => (bool) get_post_meta( $id, 'featured', true ),
			'featured_priority' => get_post_meta( $id, 'featured_priority', true ),
			'updated_at'        => (string) get_post_meta( $id, 'updated_at', true ),
		);
	}

	$featured_ranked = hdc_repo_rank_featured( $rows );
	$featured_ids    = array();
	foreach ( array_values( $featured_ranked ) as $rank => $row ) {
		$id                 = (int) $row['id'];
		$featured_ids[ $id ] = true;
		wp_update_post(
			array(
				'ID'          => $id,
				'menu_order'  => $rank,
				'post_status' => 'publish',
			)
		);
	}

	foreach ( $rows as $row ) {
		$id = (int) $row['id'];
		if ( ! isset( $featured_ids[ $id ] ) ) {
			wp_update_post(
				array(
					'ID'          => $id,
					'post_status' => 'draft',
				)
			);
		}
	}

	hdc_repo_suppress_end();
}
```

- [ ] **Step 2: Add the require to the bootstrap**

In `inc/home-core/bootstrap.php`, after the `repo-logic.php` require, add:

```php
require_once __DIR__ . '/repo-cpt.php';
```

- [ ] **Step 3: Write the registration-check integration test**

`tests/registration-check.php`:

```php
<?php
/**
 * Integration check: hdc_repo CPT + every meta registered with show_in_rest.
 * Run: wp --path=/home/dev/wp-hperkins-com eval-file \
 *        wp-content/themes/henrys-digital-canvas/tests/registration-check.php
 */

$failures = 0;

if ( ! post_type_exists( 'hdc_repo' ) ) {
	echo "FAIL - hdc_repo CPT not registered\n";
	$failures++;
} else {
	echo "ok   - hdc_repo CPT registered\n";
}

$expected_meta = array(
	'github_id', 'featured', 'featured_priority', 'why_it_matters', 'display_name',
	'origin', 'access', 'description', 'language', 'stars', 'forks', 'updated_at',
	'url', 'topics', 'summary', 'badge_label', 'source_badge', 'cta_label', 'last_sync_source',
);
$registered = get_registered_meta_keys( 'post', 'hdc_repo' );
foreach ( $expected_meta as $key ) {
	if ( isset( $registered[ $key ] ) && ! empty( $registered[ $key ]['show_in_rest'] ) ) {
		echo "ok   - meta {$key} registered + show_in_rest\n";
	} else {
		echo "FAIL - meta {$key} missing or not show_in_rest\n";
		$failures++;
	}
}

echo "\n{$failures} failures\n";
```

- [ ] **Step 4: Run the registration check**

Run: `wp --path=/home/dev/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/tests/registration-check.php`
Expected: every line `ok`, ending with `0 failures`.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/repo-cpt.php \
        wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php \
        wp-content/themes/henrys-digital-canvas/tests/registration-check.php
git commit -m "feat(home-core): register hdc_repo CPT + meta + reconcile/write helpers"
```

---

## Task 9: Selected Work block markup + pattern registration

**Files:**
- Create: `inc/home-core/markup.php`
- Create: `inc/home-core/patterns.php`
- Modify: `inc/home-core/bootstrap.php`

- [ ] **Step 1: Write the markup function**

`inc/home-core/markup.php`:

```php
<?php
/**
 * Home Core — Selected Work block markup (core/query + core/post-meta bindings).
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Return the Selected Work core/query fragment. Card fields bind to hdc_repo
 * post meta via the core/post-meta source; ordering is enforced by the
 * query_loop_block_query_vars filter (Task 11). The heading uses Post Title
 * (the write path stores display_name as the title).
 */
function hdc_selected_work_block_markup(): string {
	return <<<'HTML'
<!-- wp:query {"queryId":1,"query":{"perPage":3,"pages":0,"offset":0,"postType":"hdc_repo","order":"asc","orderBy":"menu_order","inherit":false},"namespace":"hdc/selected-work","align":"wide"} -->
<div class="wp-block-query alignwide">
<!-- wp:post-template -->
<!-- wp:group {"className":"is-style-hdc-repo-card","layout":{"type":"constrained"}} -->
<div class="wp-block-group is-style-hdc-repo-card">
<!-- wp:group {"className":"hdc-repo-card__meta","layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group hdc-repo-card__meta">
<!-- wp:paragraph {"className":"hdc-repo-card__lang","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"language"}}}}} -->
<p class="hdc-repo-card__lang"></p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-repo-card__badge","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"badge_label"}}}}} -->
<p class="hdc-repo-card__badge"></p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-repo-card__source","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"source_badge"}}}}} -->
<p class="hdc-repo-card__source"></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:post-title {"level":3,"isLink":false} /-->
<!-- wp:paragraph {"className":"hdc-repo-card__summary","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"summary"}}}}} -->
<p class="hdc-repo-card__summary"></p>
<!-- /wp:paragraph -->
<!-- wp:group {"className":"hdc-repo-card__footer","layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group hdc-repo-card__footer">
<!-- wp:paragraph {"className":"hdc-repo-card__updated","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"updated_at"}}}}} -->
<p class="hdc-repo-card__updated"></p>
<!-- /wp:paragraph -->
<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button {"metadata":{"bindings":{"text":{"source":"core/post-meta","args":{"key":"cta_label"}},"url":{"source":"core/post-meta","args":{"key":"url"}}}}} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button"></a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
<!-- /wp:post-template -->
<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>Featured work is being refreshed for the homepage. Use View all work to browse the full project library.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
HTML;
}
```

- [ ] **Step 2: Write the pattern registration**

`inc/home-core/patterns.php`:

```php
<?php
/**
 * Home Core — register the Selected Work block pattern.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the Selected Work pattern (insertable; reused by the binding test
 * and, in Phase 2, by the assembled "Home" pattern).
 */
function hdc_register_selected_work_pattern(): void {
	if ( ! function_exists( 'register_block_pattern' ) ) {
		return;
	}
	register_block_pattern(
		'henrys-digital-canvas/selected-work',
		array(
			'title'      => __( 'Selected Work (synced repos)', 'henrys-digital-canvas' ),
			'categories' => array( 'featured' ),
			'content'    => hdc_selected_work_block_markup(),
		)
	);
}
add_action( 'init', 'hdc_register_selected_work_pattern' );
```

- [ ] **Step 3: Add both requires to the bootstrap**

In `inc/home-core/bootstrap.php`, after the `repo-cpt.php` require, add:

```php
require_once __DIR__ . '/markup.php';
require_once __DIR__ . '/patterns.php';
```

- [ ] **Step 4: Verify the markup parses into blocks and the pattern registers**

Run:
```bash
wp --path=/home/dev/wp-hperkins-com eval '
$blocks = parse_blocks( hdc_selected_work_block_markup() );
echo $blocks[0]["blockName"] === "core/query" ? "query-ok\n" : "QUERY-FAIL\n";
$reg = WP_Block_Patterns_Registry::get_instance();
echo $reg->is_registered( "henrys-digital-canvas/selected-work" ) ? "pattern-ok\n" : "PATTERN-FAIL\n";
'
```
Expected:
```
query-ok
pattern-ok
```

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/markup.php \
        wp-content/themes/henrys-digital-canvas/inc/home-core/patterns.php \
        wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php
git commit -m "feat(home-core): add Selected Work block markup + pattern"
```

---

## Task 10: Binding-resolution test — THE de-risking gate (run before building more)

> Per the design (§10/§11), this is "the one to prove, not assume." If it fails, **stop** and rethink the bindings approach before continuing to Tasks 11–14.

**Files:**
- Create: `tests/selected-work-binding-test.php`

- [ ] **Step 1: Write the integration test**

`tests/selected-work-binding-test.php`:

```php
<?php
/**
 * Binding-resolution test: render the Selected Work markup against a fixture
 * hdc_repo and assert each core/post-meta binding resolves to the repo's values
 * (not empty, not the page's meta).
 *
 * Run: wp --path=/home/dev/wp-hperkins-com eval-file \
 *        wp-content/themes/henrys-digital-canvas/tests/selected-work-binding-test.php
 */

$failures = 0;

// 1) Create a published fixture repo with known meta.
$post_id = wp_insert_post(
	array(
		'post_type'   => 'hdc_repo',
		'post_status' => 'publish',
		'post_title'  => 'Tarot',
		'post_name'   => 'tarot-binding-fixture',
		'menu_order'  => 0,
	),
	true
);

if ( is_wp_error( $post_id ) ) {
	echo 'FAIL - could not create fixture: ' . $post_id->get_error_message() . "\n";
	echo "\n1 failures\n";
	return;
}

$meta = array(
	'summary'      => 'BINDING_SUMMARY_MARKER reading UX.',
	'language'     => 'JavaScript',
	'badge_label'  => 'Open source',
	'source_badge' => 'Live GitHub',
	'cta_label'    => 'View project',
	'updated_at'   => '2026-05-01',
	'url'          => 'https://github.com/henryperkins/tarot',
);
foreach ( $meta as $k => $v ) {
	update_post_meta( $post_id, $k, $v );
}

// 2) Render the markup the way the front end will (do_blocks runs the loop + bindings).
$html = do_blocks( hdc_selected_work_block_markup() );

// 3) Assertions: each bound value must appear in the output.
$checks = array(
	'summary resolves'      => 'BINDING_SUMMARY_MARKER reading UX.',
	'language resolves'     => 'JavaScript',
	'badge resolves'        => 'Open source',
	'source badge resolves' => 'Live GitHub',
	'cta text resolves'     => 'View project',
	'url resolves'          => 'https://github.com/henryperkins/tarot',
	'title resolves'        => 'Tarot',
);
foreach ( $checks as $label => $needle ) {
	if ( false !== strpos( $html, $needle ) ) {
		echo "ok   - {$label}\n";
	} else {
		echo "FAIL - {$label} (not found in rendered HTML)\n";
		$failures++;
	}
}

// 4) Negative: the summary paragraph must not be empty.
if ( false !== strpos( $html, '<p class="hdc-repo-card__summary"></p>' ) ) {
	echo "FAIL - summary paragraph rendered EMPTY (binding did not resolve)\n";
	$failures++;
} else {
	echo "ok   - summary paragraph is not empty\n";
}

// 5) Cleanup.
wp_delete_post( $post_id, true );

echo "\n{$failures} failures\n";
```

- [ ] **Step 2: Run the binding-resolution test**

Run: `wp --path=/home/dev/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/tests/selected-work-binding-test.php`
Expected: all `ok`, ending with `0 failures`.

If any binding shows as empty: confirm the meta key is registered with `show_in_rest` (Task 8), confirm the binding `args.key` matches the meta key exactly, and confirm the install is on Gutenberg ≥ 23.3 (`wp --path=/home/dev/wp-hperkins-com plugin get gutenberg --field=version`). Do not proceed until green.

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/tests/selected-work-binding-test.php
git commit -m "test(home-core): prove Selected Work post-meta bindings resolve in loop context"
```

---

## Task 11: `query_loop_block_query_vars` order filter (menu_order ASC)

**Files:**
- Create: `inc/home-core/query-loop.php`
- Modify: `inc/home-core/bootstrap.php`

- [ ] **Step 1: Write the filter**

`inc/home-core/query-loop.php`:

```php
<?php
/**
 * Home Core — order the Selected Work query loop by menu_order (the synced rank).
 * Core's Query Loop UI exposes only date/title ordering, so we set it server-side.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Force orderby=menu_order ASC for the Selected Work loop. Keyed on the query
 * namespace, with a robust post_type fallback (hdc_repo is queried nowhere else).
 *
 * @param array         $query The query vars built from the block.
 * @param WP_Block|null $block The Post Template block (carries query context).
 * @return array
 */
function hdc_selected_work_query_vars( $query, $block = null ) {
	$namespace = '';
	if ( $block instanceof WP_Block && isset( $block->context['query']['namespace'] ) ) {
		$namespace = (string) $block->context['query']['namespace'];
	}
	$is_selected_work = ( 'hdc/selected-work' === $namespace )
		|| ( isset( $query['post_type'] ) && 'hdc_repo' === $query['post_type'] );

	if ( $is_selected_work ) {
		$query['orderby'] = 'menu_order';
		$query['order']   = 'ASC';
	}
	return $query;
}
add_filter( 'query_loop_block_query_vars', 'hdc_selected_work_query_vars', 10, 2 );
```

- [ ] **Step 2: Add the require to the bootstrap**

In `inc/home-core/bootstrap.php`, after the `patterns.php` require, add:

```php
require_once __DIR__ . '/query-loop.php';
```

- [ ] **Step 3: Write a temporary ordering assertion (inline eval)**

Run this end-to-end check (creates 3 featured repos with deliberately reversed menu_order, renders, asserts the rendered order matches menu_order ASC):

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$ids = array();
$rows = array( array("Gamma",2), array("Alpha",0), array("Beta",1) );
foreach ( $rows as $r ) {
	$id = wp_insert_post( array( "post_type"=>"hdc_repo","post_status"=>"publish","post_title"=>$r[0],"menu_order"=>$r[1] ), true );
	update_post_meta( $id, "summary", "s-".$r[0] );
	update_post_meta( $id, "cta_label", "View" );
	update_post_meta( $id, "url", "https://e.com/".$r[0] );
	$ids[] = $id;
}
$html = do_blocks( hdc_selected_work_block_markup() );
$pa = strpos($html,"Alpha"); $pb = strpos($html,"Beta"); $pg = strpos($html,"Gamma");
echo ( $pa !== false && $pa < $pb && $pb < $pg ) ? "order-ok\n" : "ORDER-FAIL\n";
foreach ( $ids as $id ) { wp_delete_post( $id, true ); }
'
```
Expected: `order-ok` (Alpha[0] → Beta[1] → Gamma[2]).

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/query-loop.php \
        wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php
git commit -m "feat(home-core): order Selected Work loop by synced menu_order rank"
```

---

## Task 12: Block style + card CSS

**Files:**
- Create: `inc/home-core/styles.php`
- Create: `assets/css/home-core.css`
- Modify: `inc/home-core/bootstrap.php`

> Phase 1 ships a functional card layout. Full visual parity with the React card (gradients, surface tokens) is polished in Phase 2; this CSS only needs the card to be legible and to hide empty badge slots.

- [ ] **Step 1: Write the CSS**

`assets/css/home-core.css`:

```css
/* Home Core — Selected Work repo card (Phase 1 baseline; Phase 2 refines visuals). */
.is-style-hdc-repo-card {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1.25rem;
	border: 1px solid hsl(var(--wpds-color-border, var(--border)) / 0.7);
	border-radius: var(--wpds-radius-lg, 0.75rem);
	background: hsl(var(--wpds-color-surface-card, var(--card)));
	height: 100%;
}

.hdc-repo-card__meta {
	gap: 0.5rem;
	align-items: center;
	font-size: 0.8125rem;
	color: hsl(var(--wpds-color-text-muted, var(--muted-foreground)));
}

.hdc-repo-card__badge,
.hdc-repo-card__source,
.hdc-repo-card__lang,
.hdc-repo-card__updated {
	margin: 0;
}

/* Hide empty bound badges/labels (source_badge stores '' when there is no badge). */
.hdc-repo-card__badge:empty,
.hdc-repo-card__source:empty,
.hdc-repo-card__lang:empty,
.hdc-repo-card__updated:empty {
	display: none;
}

.hdc-repo-card__summary {
	margin: 0;
	flex: 1 1 auto;
}

.hdc-repo-card__footer {
	align-items: center;
	gap: 0.5rem;
	margin-top: auto;
}
```

- [ ] **Step 2: Write the registration/enqueue**

`inc/home-core/styles.php`:

```php
<?php
/**
 * Home Core — register the repo-card block style + enqueue card CSS.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the is-style-hdc-repo-card block style for core/group.
 */
function hdc_home_core_register_block_styles(): void {
	register_block_style(
		'core/group',
		array(
			'name'  => 'hdc-repo-card',
			'label' => __( 'HDC Repo Card', 'henrys-digital-canvas' ),
		)
	);
}
add_action( 'init', 'hdc_home_core_register_block_styles' );

/**
 * Enqueue the card CSS on the front end and in the editor.
 */
function hdc_home_core_enqueue_styles(): void {
	wp_enqueue_style(
		'hdc-home-core',
		get_stylesheet_directory_uri() . '/assets/css/home-core.css',
		array(),
		hdc_asset_version( '/assets/css/home-core.css' )
	);
}
add_action( 'wp_enqueue_scripts', 'hdc_home_core_enqueue_styles', 20 );
add_action( 'enqueue_block_assets', 'hdc_home_core_enqueue_styles', 20 );
```

- [ ] **Step 3: Add the require to the bootstrap**

In `inc/home-core/bootstrap.php`, after the `query-loop.php` require, add:

```php
require_once __DIR__ . '/styles.php';
```

- [ ] **Step 4: Verify the style registers and the CSS file is enqueueable**

Run:
```bash
wp --path=/home/dev/wp-hperkins-com eval '
$styles = WP_Block_Styles_Registry::get_instance()->get_registered_styles_for_block( "core/group" );
echo isset( $styles["hdc-repo-card"] ) ? "style-ok\n" : "STYLE-FAIL\n";
echo file_exists( get_stylesheet_directory() . "/assets/css/home-core.css" ) ? "css-ok\n" : "CSS-FAIL\n";
'
```
Expected:
```
style-ok
css-ok
```

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/styles.php \
        wp-content/themes/henrys-digital-canvas/assets/css/home-core.css \
        wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php
git commit -m "feat(home-core): register repo-card block style + baseline card CSS"
```

---

## Task 13: One-time seed + `wp hdc seed-repos`

**Files:**
- Create: `inc/home-core/seed.php`
- Modify: `inc/home-core/bootstrap.php`

- [ ] **Step 1: Write the seed + WP-CLI command**

`inc/home-core/seed.php`:

```php
<?php
/**
 * Home Core — one-time seed of hdc_repo from repos.json + repo-case-study-details.json.
 * Idempotent: upserts by repo name, never clobbers an existing post's curated meta.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Seed (or top-up) hdc_repo posts from the theme's JSON data files.
 *
 * @return array{created:int,skipped:int}
 */
function hdc_repo_seed_from_json(): array {
	$repos_json    = hdc_read_theme_json_file( '/blocks/work-showcase/data/repos.json', array() );
	$case_study    = hdc_read_theme_json_file( '/blocks/work-showcase/data/repo-case-study-details.json', array() );
	$repos_json    = is_array( $repos_json ) ? $repos_json : array();
	$case_study    = is_array( $case_study ) ? $case_study : array();

	$seed_records  = hdc_repo_build_seed( $repos_json, $case_study );
	$created       = 0;
	$skipped       = 0;

	hdc_repo_suppress_begin(); // bulk inserts/writes below must not fire save_post per repo.
	foreach ( $seed_records as $record ) {
		$existing = hdc_repo_find_by_name( (string) $record['name'] );
		if ( $existing ) {
			$skipped++;
			continue; // never re-seed / clobber curated meta.
		}

		$post_id = wp_insert_post(
			array(
				'post_type'   => 'hdc_repo',
				'post_status' => $record['featured'] ? 'publish' : 'draft',
				'post_title'  => (string) $record['name'],
				'post_name'   => sanitize_title( (string) $record['name'] ),
			),
			true
		);
		if ( is_wp_error( $post_id ) ) {
			continue;
		}
		$post_id = (int) $post_id;

		// Curated meta.
		update_post_meta( $post_id, 'featured', $record['featured'] ? 1 : 0 );
		if ( null !== $record['featured_priority'] ) {
			update_post_meta( $post_id, 'featured_priority', (int) $record['featured_priority'] );
		}
		update_post_meta( $post_id, 'origin', (string) $record['origin'] );
		update_post_meta( $post_id, 'access', (string) $record['access'] );
		update_post_meta( $post_id, 'why_it_matters', (string) $record['why_it_matters'] );

		// Initial live snapshot.
		update_post_meta( $post_id, 'description', (string) $record['description'] );
		update_post_meta( $post_id, 'language', (string) $record['language'] );
		update_post_meta( $post_id, 'stars', (int) $record['stars'] );
		update_post_meta( $post_id, 'forks', (int) $record['forks'] );
		update_post_meta( $post_id, 'updated_at', (string) $record['updated_at'] );
		update_post_meta( $post_id, 'url', esc_url_raw( (string) $record['url'] ) );
		update_post_meta( $post_id, 'topics', hdc_repo_sanitize_topics( $record['topics'] ) );
		update_post_meta( $post_id, 'last_sync_source', 'seed' );

		// Derived meta + title/slug. Seeded data is a snapshot, not live.
		$record['display_name'] = (string) $record['display_name'];
		hdc_repo_write_derived( $post_id, $record, false );

		$created++;
	}

	hdc_repo_reconcile();
	hdc_repo_suppress_end();

	return array(
		'created' => $created,
		'skipped' => $skipped,
	);
}

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command(
		'hdc seed-repos',
		function () {
			$result = hdc_repo_seed_from_json();
			WP_CLI::success( sprintf( 'Seed complete: %d created, %d skipped.', $result['created'], $result['skipped'] ) );
		}
	);
}
```

- [ ] **Step 2: Add the require to the bootstrap**

In `inc/home-core/bootstrap.php`, after the `styles.php` require, add:

```php
require_once __DIR__ . '/seed.php';
```

- [ ] **Step 3: Run the seed and verify it created repos with curated why_it_matters**

Run:
```bash
wp --path=/home/dev/wp-hperkins-com hdc seed-repos
wp --path=/home/dev/wp-hperkins-com post list --post_type=hdc_repo --post_status=any --format=count
```
Expected: `Success: Seed complete: N created, 0 skipped.` (N ≈ 23) and the count matches N.

Then verify a known curated summary landed (the portfolio repo has a curated `whyItMatters`):
```bash
wp --path=/home/dev/wp-hperkins-com eval '
$id = hdc_repo_find_by_name( "henry-s-digital-canvas" );
echo $id ? get_post_meta( $id, "why_it_matters", true ) . "\n" : "NOT FOUND\n";
'
```
Expected: the curated sentence beginning `This portfolio is the public proof surface...` (NOT empty).

- [ ] **Step 4: Verify re-running is idempotent (skips, no clobber)**

Run: `wp --path=/home/dev/wp-hperkins-com hdc seed-repos`
Expected: `Success: Seed complete: 0 created, N skipped.`

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/seed.php \
        wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php
git commit -m "feat(home-core): seed hdc_repo from repos.json + case-study-details + wp hdc seed-repos"
```

---

## Task 14: Cron sync + soft-fail guard + reconcile-on-save + `wp hdc sync-repos`

**Files:**
- Create: `inc/home-core/sync.php`
- Modify: `inc/home-core/bootstrap.php`

- [ ] **Step 1: Write the sync, cron, save_post hook, and WP-CLI command**

`inc/home-core/sync.php`:

```php
<?php
/**
 * Home Core — hourly WP-Cron sync from hperkins.com + reconcile-on-save + WP-CLI.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

const HDC_SYNC_EVENT = 'hdc_sync_repos';

/**
 * Schedule the hourly sync event if missing.
 */
function hdc_repo_schedule_sync(): void {
	if ( ! wp_next_scheduled( HDC_SYNC_EVENT ) ) {
		wp_schedule_event( time() + 60, 'hourly', HDC_SYNC_EVENT );
	}
}
add_action( 'init', 'hdc_repo_schedule_sync' );
add_action( HDC_SYNC_EVENT, 'hdc_github_sync' );

/**
 * Clear the event when the theme is switched away.
 */
function hdc_repo_clear_sync(): void {
	$timestamp = wp_next_scheduled( HDC_SYNC_EVENT );
	if ( $timestamp ) {
		wp_unschedule_event( $timestamp, HDC_SYNC_EVENT );
	}
}
add_action( 'switch_theme', 'hdc_repo_clear_sync' );

/**
 * Pull live repos from the worker and reconcile the CPT.
 *
 * @return array{source:string,count:int}
 */
function hdc_github_sync(): array {
	$owner    = hdc_get_configured_github_owner();
	$endpoint = add_query_arg(
		array(
			'per_page' => 100,
			'username' => $owner,
		),
		hdc_get_portfolio_origin() . '/api/github/repos'
	);

	$response = wp_remote_get( $endpoint, array( 'timeout' => 5 ) );

	$live = null;
	if ( ! is_wp_error( $response ) && 200 === (int) wp_remote_retrieve_response_code( $response ) ) {
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( is_array( $decoded ) ) {
			$live = $decoded;
		}
	}

	// Soft-fail guard: error/timeout/non-200/unparseable OR empty live array.
	if ( null === $live || array() === $live ) {
		return hdc_repo_record_fallback( null === $live ? 'fallback' : 'fallback-empty' );
	}

	$kept  = array_values( array_filter( $live, 'hdc_repo_should_keep_live' ) );
	if ( array() === $kept ) {
		return hdc_repo_record_fallback( 'fallback-empty' );
	}

	hdc_repo_suppress_begin(); // bulk writes below must not fire save_post per repo.
	foreach ( $kept as $api_repo ) {
		if ( ! is_array( $api_repo ) ) {
			continue;
		}
		$mapped = hdc_repo_map_api( $api_repo );

		$post_id = hdc_repo_find_by_github_id( (int) $mapped['github_id'] );
		if ( ! $post_id ) {
			$post_id = hdc_repo_find_by_name( (string) $mapped['name'] );
			if ( $post_id && (int) $mapped['github_id'] > 0 ) {
				update_post_meta( $post_id, 'github_id', (int) $mapped['github_id'] );
			} elseif ( ! $post_id && 0 === (int) $mapped['github_id'] ) {
				// Worker not yet redeployed with id and no name match — warn + skip create
				// to avoid duplicate posts on the next id-bearing run.
				if ( defined( 'WP_CLI' ) && WP_CLI ) {
					WP_CLI::warning( sprintf( 'No github_id and no name match for "%s"; skipped.', $mapped['name'] ) );
				}
				continue;
			}
		}

		$is_create = ! $post_id;
		if ( $is_create ) {
			$post_id = wp_insert_post(
				array(
					'post_type'   => 'hdc_repo',
					'post_status' => 'draft', // reconcile() promotes featured -> publish; new API repos are not curated/featured.
					'post_title'  => (string) $mapped['name'],
					'post_name'   => sanitize_title( (string) $mapped['name'] ),
				),
				true
			);
			if ( is_wp_error( $post_id ) ) {
				continue;
			}
			$post_id = (int) $post_id;
			update_post_meta( $post_id, 'github_id', (int) $mapped['github_id'] );
			// Defaults for a brand-new (uncurated) repo.
			update_post_meta( $post_id, 'origin', 'github' );
			update_post_meta( $post_id, 'access', 'public' );
			update_post_meta( $post_id, 'featured', 0 );
		}

		// Build the merged record (curated meta read from the post + live).
		$curated = hdc_repo_read_curated( $post_id );
		$merged  = hdc_repo_merge_live_onto_curated( $curated, $mapped );

		// Write Live fields (origin overwritten to github; description curated-preferred handled in merge).
		update_post_meta( $post_id, 'origin', (string) $merged['origin'] );
		update_post_meta( $post_id, 'stars', (int) $merged['stars'] );
		update_post_meta( $post_id, 'forks', (int) $merged['forks'] );
		update_post_meta( $post_id, 'url', esc_url_raw( (string) $merged['url'] ) );
		update_post_meta( $post_id, 'updated_at', (string) $merged['updated_at'] );
		update_post_meta( $post_id, 'language', (string) $merged['language'] );
		update_post_meta( $post_id, 'topics', hdc_repo_sanitize_topics( $merged['topics'] ) );
		// description only on create (curated wins thereafter).
		if ( $is_create ) {
			update_post_meta( $post_id, 'description', (string) $merged['description'] );
		}
		update_post_meta( $post_id, 'last_sync_source', 'live' );

		hdc_repo_write_derived( $post_id, $merged, true );
	}

	hdc_repo_reconcile();
	hdc_repo_suppress_end();

	$status = array(
		'time'   => time(),
		'source' => 'live',
		'count'  => count( $kept ),
	);
	update_option( 'hdc_repo_sync_status', $status, false );

	return array(
		'source' => 'live',
		'count'  => count( $kept ),
	);
}

/**
 * Read the curated + current meta of a post into the array shape the pure
 * merge/derive functions expect.
 */
function hdc_repo_read_curated( int $post_id ): array {
	return array(
		'name'              => (string) get_post_field( 'post_name', $post_id ),
		'origin'            => (string) get_post_meta( $post_id, 'origin', true ),
		'access'            => (string) get_post_meta( $post_id, 'access', true ),
		'featured'          => (bool) get_post_meta( $post_id, 'featured', true ),
		'featured_priority' => get_post_meta( $post_id, 'featured_priority', true ),
		'why_it_matters'    => (string) get_post_meta( $post_id, 'why_it_matters', true ),
		'display_name'      => (string) get_post_meta( $post_id, 'display_name', true ),
		'description'       => (string) get_post_meta( $post_id, 'description', true ),
		'language'          => (string) get_post_meta( $post_id, 'language', true ),
		'url'               => (string) get_post_meta( $post_id, 'url', true ),
		'updated_at'        => (string) get_post_meta( $post_id, 'updated_at', true ),
	);
}

/**
 * Handle a failed/empty sync: keep Live tier, downgrade source_badge to its
 * snapshot variant, record status, and exit.
 *
 * @param string $source 'fallback' or 'fallback-empty'.
 * @return array{source:string,count:int}
 */
function hdc_repo_record_fallback( string $source ): array {
	$ids = get_posts(
		array(
			'post_type'        => 'hdc_repo',
			'post_status'      => 'any',
			'numberposts'      => -1,
			'fields'           => 'ids',
			'suppress_filters' => false,
		)
	);
	foreach ( $ids as $id ) {
		$id      = (int) $id;
		$curated = hdc_repo_read_curated( $id );
		// Recompute source_badge in the non-live (snapshot) branch.
		update_post_meta( $id, 'source_badge', hdc_repo_source_badge( $curated, false ) );
		update_post_meta( $id, 'last_sync_source', $source );
	}

	update_option(
		'hdc_repo_sync_status',
		array(
			'time'   => time(),
			'source' => $source,
			'count'  => 0,
		),
		false
	);

	return array(
		'source' => $source,
		'count'  => 0,
	);
}

/**
 * When a repo is edited in admin, immediately reconcile ranks + statuses and
 * recompute its derived meta from current curated + live values.
 *
 * @param int     $post_id Post id.
 * @param WP_Post $post    Post object.
 * @param bool    $update  Whether this is an update.
 */
function hdc_repo_on_save( int $post_id, $post, bool $update ): void {
	if ( hdc_repo_is_suppressing() ) {
		return; // a sync/seed/reconcile is running; it handles derivation + reconcile.
	}
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}
	if ( 'hdc_repo' !== get_post_type( $post_id ) ) {
		return;
	}

	hdc_repo_suppress_begin();
	$status  = get_option( 'hdc_repo_sync_status', array() );
	$is_live = is_array( $status ) && 'live' === ( $status['source'] ?? '' );
	$merged  = hdc_repo_read_curated( $post_id );
	hdc_repo_write_derived( $post_id, $merged, $is_live );
	hdc_repo_reconcile();
	hdc_repo_suppress_end();
}
add_action( 'save_post_hdc_repo', 'hdc_repo_on_save', 20, 3 );

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command(
		'hdc sync-repos',
		function () {
			$result = hdc_github_sync();
			WP_CLI::success( sprintf( 'Sync complete: source=%s, count=%d.', $result['source'], $result['count'] ) );
		}
	);
}
```

- [ ] **Step 2: Add the require to the bootstrap**

In `inc/home-core/bootstrap.php`, after the `seed.php` require, add:

```php
require_once __DIR__ . '/sync.php';
```

- [ ] **Step 3: Verify the cron event is scheduled**

Run: `wp --path=/home/dev/wp-hperkins-com cron event list --fields=hook,next_run_relative | grep hdc_sync_repos`
Expected: a row for `hdc_sync_repos` with a next run within the hour.

- [ ] **Step 4: Run a real sync and verify status + that curated meta survived**

Run:
```bash
wp --path=/home/dev/wp-hperkins-com hdc sync-repos
wp --path=/home/dev/wp-hperkins-com option get hdc_repo_sync_status --format=json
```
Expected: `Success: Sync complete: source=live, count=N.` and a JSON status with `"source":"live"`.
(If the worker is unreachable, expect `source=fallback` — that is the guard working; the seeded cards remain.)

Verify the curated `why_it_matters` was NOT clobbered by the live sync:
```bash
wp --path=/home/dev/wp-hperkins-com eval '
$id = hdc_repo_find_by_name( "henry-s-digital-canvas" );
echo $id ? ( get_post_meta($id,"why_it_matters",true) !== "" ? "curated-intact\n" : "CLOBBERED\n" ) : "NOT FOUND\n";
'
```
Expected: `curated-intact`.

- [ ] **Step 5: Verify featured repos are published + ranked, others drafted**

Run:
```bash
wp --path=/home/dev/wp-hperkins-com post list --post_type=hdc_repo --post_status=publish --meta_key=featured --format=table --fields=ID,post_title,menu_order
```
Expected: only featured repos, `menu_order` values 0,1,2,… in rank order.

- [ ] **Step 6: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/sync.php \
        wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php
git commit -m "feat(home-core): hourly cron sync + soft-fail guard + reconcile-on-save + wp hdc sync-repos"
```

---

## Task 15: Phase-1 integration verification

**Files:** none (verification only).

- [ ] **Step 1: Re-run the pure unit suite**

Run: `cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas && php tests/repo-logic-test.php`
Expected: `51 checks, 0 failures`.

- [ ] **Step 2: Re-run the registration + binding-resolution checks**

Run:
```bash
wp --path=/home/dev/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/tests/registration-check.php
wp --path=/home/dev/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/tests/selected-work-binding-test.php
```
Expected: both end with `0 failures`.

- [ ] **Step 3: Confirm the live homepage is unchanged (Phase 1 must not touch it)**

Run: `cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas && BASE_URL=https://wp.hperkins.com npm run smoke:route`
Expected: route smoke passes (home still renders the existing `hdc-home-page` markup — Phase 1 did not modify the page record).

- [ ] **Step 4: Confirm clean object-cache + no PHP notices in the sync path**

Run: `wp --path=/home/dev/wp-hperkins-com hdc sync-repos --debug 2>&1 | grep -iE "notice|warning|deprecated" || echo "no notices"`
Expected: `no notices`.

- [ ] **Step 5: Final Phase-1 commit (docs/status)**

If you keep a running status doc, note Phase 1 complete. Otherwise:

```bash
git status
# working tree clean (all task commits already made)
```

---

## Self-Review (performed against design rev. 3, §§4–6, 9–12)

**Spec coverage:**
- CPT + meta (incl. `github_id`, `topics` array) → Task 8. ✓
- Two-file seed (`repos.json` + `repo-case-study-details.json`) → Tasks 7, 13. ✓
- `hdc_github_sync()` + soft-fail guard (incl. empty-`200`) → Task 14. ✓
- Cron + `switch_theme` cleanup + `wp hdc sync-repos` (+ `seed-repos`) → Tasks 13, 14. ✓
- Exact comparator (missing-priority→last, updatedAt desc, name tiebreak) → Task 6. ✓
- Selected Work `core/query` + `core/post-meta` bindings + `is-style-hdc-repo-card` → Tasks 9, 12. ✓
- `namespace` order filter → Task 11. ✓
- Binding-resolution test **first** → Task 10 (gated before 11–14). ✓
- Reconcile-on-save (no hour lag) → Task 14. ✓
- Derived labels incl. `source_badge` live vs fallback → Tasks 3, 14. ✓
- Parity refinements (description curated-preferred; origin live-or-curated) → documented + Task 5. ✓
- **Out of Phase-1 scope (Phase 2/3):** swapping the live home page record, `theme.json`/visual parity polish, Recent Writing + `reading_time`, retiring the 6 blocks, Playwright homepage assertions. Noted in scope. ✓

**Placeholder scan:** no TBD/TODO; every code step shows complete code; every command shows expected output. ✓

**Type/name consistency:** the pure-logic contract names (`hdc_repo_*`) are used identically in Tasks 2–7 and consumed unchanged in Tasks 8 (`hdc_repo_write_derived`, `hdc_repo_reconcile`), 13 (`hdc_repo_build_seed`, `hdc_repo_sanitize_topics`), and 14 (`hdc_repo_map_api`, `hdc_repo_merge_live_onto_curated`, `hdc_repo_read_curated`). Meta keys match between Task 8 registration, the binding `args.key`s in Task 9, and the writers in Tasks 13–14. ✓

---

## Execution Handoff

Plan complete and saved to `wp-content/themes/henrys-digital-canvas/docs/plans/2026-06-04-homepage-core-block-sync-phase-1-plan.md` (the project's established plan location, alongside the design doc). Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. The binding-resolution gate (Task 10) is the natural hard checkpoint.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints for review.

Which approach? (Or: have me draft the Phase 0 / Phase 2 / Phase 3 plans next.)
