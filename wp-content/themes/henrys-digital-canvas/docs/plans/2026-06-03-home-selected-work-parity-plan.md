# Home Selected Work Source-Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `henrys-digital-canvas/home-selected-work` select its top-N featured repos exactly like `Home.tsx` (`filter(featured) → sort(featuredPriority asc, then updatedAt desc) → slice(repoCount)`), removing the hard-coded name allow-list and dead provenance config.

**Architecture:** Server render (`render.php`) serializes all `featured` repos (carrying `featuredPriority` + `whyItMatters`) into `data-config.initialRepos`; the vanilla-JS `view.js` sorts + slices client-side and merges live GitHub data via the shared `hdc-shared-utils.js` normalizer. Selected-work attributes are baked into the home page `post_content`, so a `sync:pages` + cache flush is required to publish.

**Tech Stack:** WordPress block API v3, PHP 8.5, vanilla `wp.element` (no JSX/build step for this block), WP-CLI, bash smoke scripts, Playwright. Verification uses this project's tools — `php -l`, `node -c`, JSON parse, `wp eval-file`, `npm run smoke:*`, browser checks, and the `parity-checker` agent — not pytest/TDD.

> **Design reference:** `docs/plans/2026-06-03-home-selected-work-parity-design.md`. Resolves the `2026-05-19` regression plan's Finding #5 by emitting *all featured* repos (tight payload) rather than the whole repo file.

> **Paths:** WP root + theme live under `/home/dev/...` (NOT `/home/ubuntu`, which does not exist in this environment). WP-CLI: `wp --path=/home/dev/wp-hperkins-com`. Theme dir: `/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas`. Source TSX: `/home/dev/henry-s-digital-canvas/src/pages/Home.tsx`. Run all `npm`/`php`/`node` commands from the theme dir unless noted.

---

## File Structure

| File | Change |
|------|--------|
| `blocks/work-showcase/data/repos.json` | Data fix: `flavor-agent` → `featured:true`, `featuredPriority:-1` (shared with work-showcase) |
| `assets/js/hdc-shared-utils.js` | `normalizeRepoItem` carries `featuredPriority`; confirm `compareReposByUpdatedAtDesc` is exported (shared) |
| `blocks/home-selected-work/render.php` | Emit all featured repos; add `featuredPriority`+`whyItMatters` to whitelist; drop name-filter + dead config |
| `blocks/home-selected-work/view.js` | Replace `selectFeaturedRepos` with source sort; clean `parseConfig`; update call site |
| `blocks/home-selected-work/view.asset.php` | Bump `version` |
| `blocks/home-selected-work/block.json` | Remove `featuredRepoNames`, `sourceLiveLabel`, `sourceFallbackLabel` attributes |
| `blocks/home-selected-work/index.js` | Remove editor controls for the dropped attributes |
| `data/home-content.json` | Remove dropped keys from `selectedWork` |

---

## Task 1: Fix featured-repo data drift in repos.json

**Files:**
- Modify: `blocks/work-showcase/data/repos.json` (shared with `work-showcase`)

- [ ] **Step 1: Inspect current vs source values**

Run: `node -e "const r=require('./blocks/work-showcase/data/repos.json'); const l=Array.isArray(r)?r:(r.repos||[]); console.log(JSON.stringify(l.find(x=>x.name==='flavor-agent'),null,1))"`
Source target (`/home/dev/henry-s-digital-canvas/src/data/repos.ts` lines 67–87): `flavor-agent` has `featured: true, featuredPriority: -1`. `tarot` already has `featuredPriority: 0` in both.

- [ ] **Step 2: Edit `flavor-agent`**

In `blocks/work-showcase/data/repos.json`, locate the `flavor-agent` object and set `"featured": true` and add `"featuredPriority": -1` (match the file's existing key style/placement, mirroring how `tarot` carries `"featuredPriority": 0`). Do **not** add `featuredPriority` to other repos — only `flavor-agent` and `tarot` carry it in source; the rest sort by `updatedAt`.

- [ ] **Step 3: Validate JSON + confirm values**

Run: `node -e "const r=require('./blocks/work-showcase/data/repos.json'); const l=Array.isArray(r)?r:(r.repos||[]); ['flavor-agent','tarot'].forEach(n=>{const x=l.find(y=>y.name===n); console.log(n, x.featured, x.featuredPriority)})"`
Expected: `flavor-agent true -1` and `tarot true 0`.

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json
git commit -m "data(home-selected-work): align flavor-agent featured/priority with source repos.ts"
```

---

## Task 2: Carry featuredPriority through the shared normalizer

**Files:**
- Modify: `assets/js/hdc-shared-utils.js` (`normalizeRepoItem` ~785–832; exports ~1019)

- [ ] **Step 1: Add `featuredPriority` to the `normalizeRepoItem` return object**

In the object returned by `normalizeRepoItem` (currently ends with `featured`, `access`, `origin`, `whyItMatters`, `url`), add a `featuredPriority` field right after `featured:`:

```js
			featured: !! localRepo.featured || !! sourceRepo.featured,
			featuredPriority:
				typeof localRepo.featuredPriority === 'number'
					? localRepo.featuredPriority
					: typeof sourceRepo.featuredPriority === 'number'
					? sourceRepo.featuredPriority
					: undefined,
```

(`whyItMatters` is already carried — no change needed there.)

- [ ] **Step 2: Confirm `compareReposByUpdatedAtDesc` is exported on `window.hdcSharedUtils`**

Run: `grep -n "compareReposByUpdatedAtDesc" assets/js/hdc-shared-utils.js`
It is defined ~line 835. Check the exports object (the `window.hdcSharedUtils = { ... }` / returned object near the file end) includes `compareReposByUpdatedAtDesc`. If it is **not** exported, add it to the exports list (it is needed by Task 4). If already exported, no change.

- [ ] **Step 3: Syntax check**

Run: `node -c assets/js/hdc-shared-utils.js`
Expected: no output (valid).

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js
git commit -m "feat(shared-utils): carry featuredPriority through normalizeRepoItem"
```

---

## Task 3: Emit all featured repos from render.php (drop allow-list + dead config)

**Files:**
- Modify: `blocks/home-selected-work/render.php`

- [ ] **Step 1: Remove the name-list plumbing (lines ~23–37)**

Delete the `$attr_repos` / `$default_repos` / `$repos` / `$requested_repo_names` block entirely. The repo candidate pool no longer depends on names.

- [ ] **Step 2: Replace the snapshot filter + whitelist (lines ~48–82)**

Replace the `array_map` callback so it (a) keeps only featured repos and (b) carries `featuredPriority` + `whyItMatters`:

```php
$initial_repos = array_values(
	array_filter(
		array_map(
			static function ( $repo ) {
				if ( ! is_array( $repo ) || empty( $repo['name'] ) || empty( $repo['featured'] ) ) {
					return null;
				}

				return array(
					'name'             => sanitize_text_field( (string) $repo['name'] ),
					'displayName'      => sanitize_text_field( (string) ( $repo['displayName'] ?? '' ) ),
					'description'      => sanitize_text_field( (string) ( $repo['description'] ?? '' ) ),
					'whyItMatters'     => sanitize_text_field( (string) ( $repo['whyItMatters'] ?? '' ) ),
					'language'         => sanitize_text_field( (string) ( $repo['language'] ?? '' ) ),
					'updatedAt'        => sanitize_text_field( (string) ( $repo['updatedAt'] ?? '' ) ),
					'url'              => esc_url_raw( (string) ( $repo['url'] ?? '' ) ),
					'topics'           => isset( $repo['topics'] ) && is_array( $repo['topics'] )
						? array_values( array_map( 'sanitize_text_field', $repo['topics'] ) )
						: array(),
					'featured'         => true,
					'featuredPriority' => isset( $repo['featuredPriority'] ) && is_numeric( $repo['featuredPriority'] ) ? (int) $repo['featuredPriority'] : null,
					'origin'           => sanitize_text_field( (string) ( $repo['origin'] ?? 'curated' ) ),
					'access'           => sanitize_text_field( (string) ( $repo['access'] ?? 'public' ) ),
				);
			},
			$initial_repos
		)
	)
);
```

- [ ] **Step 3: Remove dropped keys from `$config` (lines ~84–100)**

Delete the `'featuredRepoNames' => $repos,`, `'sourceLiveLabel' => $pick( 'sourceLiveLabel' ),`, and `'sourceFallbackLabel' => $pick( 'sourceFallbackLabel' ),` lines from the `$config` array. Leave `title`, `actionLabel`, `actionHref`, `loadingLabel`, `emptyTitle`, `emptyDescriptionLive`, `emptyDescriptionFallback`, `repoCount`, `initialRepos`, `githubUsername`, `githubProxyUrl`, `workEndpoint`.

- [ ] **Step 4: Lint**

Run: `php -l blocks/home-selected-work/render.php`
Expected: `No syntax errors detected`.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/home-selected-work/render.php
git commit -m "feat(home-selected-work): serialize all featured repos with featuredPriority/whyItMatters"
```

---

## Task 4: Replace the client selection algorithm

**Files:**
- Modify: `blocks/home-selected-work/view.js` (`parseConfig` ~46–88; `selectFeaturedRepos` ~158–198; its call site ~510–530)
- Modify: `blocks/home-selected-work/view.asset.php`

- [ ] **Step 1: Clean `parseConfig`**

Remove the `featuredRepoNames`, `sourceLiveLabel`, and `sourceFallbackLabel` lines from the object returned by `parseConfig` (lines ~50, ~55–56). Keep everything else (`repoCount`, `initialRepos`, `githubUsername`, `githubProxyUrl`, `workEndpoint`, empty-state copy, `loadingLabel`).

- [ ] **Step 2: Reference `compareReposByUpdatedAtDesc` from utils**

Near the top of the IIFE where other `utils.*` helpers are aliased, add:

```js
	const compareReposByUpdatedAtDesc = utils.compareReposByUpdatedAtDesc;
```

(Confirmed exported in Task 2 Step 2.)

- [ ] **Step 3: Replace `selectFeaturedRepos` with the source algorithm**

Replace the entire `selectFeaturedRepos` function (currently `( repos, featuredRepoNames, repoCount )`) with:

```js
	function selectFeaturedRepos( repos, repoCount ) {
		const featured = ensureArray( repos ).filter( function ( repo ) {
			return repo && repo.featured;
		} );

		const sorted = featured.slice().sort( function ( a, b ) {
			const pa =
				typeof a.featuredPriority === 'number'
					? a.featuredPriority
					: Number.MAX_SAFE_INTEGER;
			const pb =
				typeof b.featuredPriority === 'number'
					? b.featuredPriority
					: Number.MAX_SAFE_INTEGER;
			if ( pa !== pb ) {
				return pa - pb;
			}
			return compareReposByUpdatedAtDesc( a, b );
		} );

		return sorted.slice( 0, repoCount );
	}
```

- [ ] **Step 4: Update the call site**

Run: `grep -n "selectFeaturedRepos(" blocks/home-selected-work/view.js`
At the call site (passes 3 args), change `selectFeaturedRepos( <repos>, config.featuredRepoNames, config.repoCount )` to `selectFeaturedRepos( <repos>, config.repoCount )`. Also grep for and remove any remaining `config.sourceLiveLabel` / `config.sourceFallbackLabel` / `config.featuredRepoNames` reads:
`grep -n "sourceLiveLabel\|sourceFallbackLabel\|featuredRepoNames" blocks/home-selected-work/view.js` → expected: no matches after edits.

- [ ] **Step 5: Syntax check**

Run: `node -c blocks/home-selected-work/view.js`
Expected: no output (valid).

- [ ] **Step 6: Bump the view asset version**

In `blocks/home-selected-work/view.asset.php`, change `'version' => '<current>'` to `'20260603.1'` (cache-bust; the block ships a manually-pinned version).

- [ ] **Step 7: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/home-selected-work/view.js wp-content/themes/henrys-digital-canvas/blocks/home-selected-work/view.asset.php
git commit -m "feat(home-selected-work): sort featured repos by priority then updatedAt (source parity)"
```

---

## Task 5: Remove dropped attributes from block.json + editor

**Files:**
- Modify: `blocks/home-selected-work/block.json`
- Modify: `blocks/home-selected-work/index.js`

- [ ] **Step 1: Remove attributes from block.json**

Run: `grep -n "featuredRepoNames\|sourceLiveLabel\|sourceFallbackLabel" blocks/home-selected-work/block.json`
Delete those three attribute entries from the `attributes` object. Keep `repoCount`, `repoEndpoint`/`workEndpoint`, `title`, `actionLabel`, `actionHref`, `loadingLabel`, `emptyTitle`, `emptyDescriptionLive`, `emptyDescriptionFallback`.

- [ ] **Step 2: Validate block.json**

Run: `node -e "const d=require('./blocks/home-selected-work/block.json'); console.log(Object.keys(d.attributes).join(','))"`
Expected: list with **no** `featuredRepoNames`/`sourceLiveLabel`/`sourceFallbackLabel`.

- [ ] **Step 3: Remove editor controls in index.js**

Run: `grep -n "featuredRepoNames\|sourceLiveLabel\|sourceFallbackLabel\|Featured repo\|Source live\|Source fallback" blocks/home-selected-work/index.js`
Remove the InspectorControls fields (and any `attributes`/`setAttributes` references) for the three dropped attributes. Leave the `repoCount` RangeControl and other controls intact.

- [ ] **Step 4: Syntax check**

Run: `node -c blocks/home-selected-work/index.js`
Expected: no output (valid).

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/home-selected-work/block.json wp-content/themes/henrys-digital-canvas/blocks/home-selected-work/index.js
git commit -m "chore(home-selected-work): drop featuredRepoNames + dead source-label attributes"
```

---

## Task 6: Remove dropped keys from the data contract

**Files:**
- Modify: `data/home-content.json` (`selectedWork` object)

- [ ] **Step 1: Remove keys**

In `data/home-content.json` → `selectedWork`, delete `featuredRepoNames`, `sourceLiveLabel`, and `sourceFallbackLabel`. Keep `title`, `actionLabel`, `actionHref`, `loadingLabel`, `emptyTitle`, `emptyDescriptionLive`, `emptyDescriptionFallback`.

- [ ] **Step 2: Validate JSON**

Run: `node -e "const d=require('./data/home-content.json'); console.log(Object.keys(d.selectedWork).join(','))"`
Expected: list with **no** `featuredRepoNames`/`sourceLiveLabel`/`sourceFallbackLabel`.

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/data/home-content.json
git commit -m "chore(home-content): drop selectedWork allow-list + dead source labels"
```

---

## Task 7: Integration — publish, smoke, and regression-verify

**Files:** none (operational)

- [ ] **Step 1: WP-side render check**

Run:
```bash
wp --path=/home/dev/wp-hperkins-com eval '$h=do_blocks("<!-- wp:henrys-digital-canvas/home-selected-work /-->"); echo (strpos($h,"data-config")!==false?"renders\n":"FAIL\n"); echo (strpos($h,"featuredRepoNames")===false?"no allow-list config\n":"allow-list STILL present\n");'
```
Expected: `renders` and `no allow-list config`.

- [ ] **Step 2: Re-sync pages + flush caches** (selected-work attributes are baked into the home `post_content`)

```bash
npm run sync:pages
wp --path=/home/dev/wp-hperkins-com cache flush
```
Then confirm the stale allow-list is gone from the page record:
`wp --path=/home/dev/wp-hperkins-com post get 4 --field=post_content | grep -c featuredRepoNames`
Expected: `0`.

- [ ] **Step 3: Smoke tests**

Run: `npm run smoke:route && npm run smoke:api`
Expected: both end with `passed.` and no FAIL lines.

- [ ] **Step 4: Browser order check**

```bash
wp --path=/home/dev/wp-hperkins-com cache flush
```
Then load `https://wp.hperkins.com/` in Playwright and evaluate the selected-work card order:
```js
() => Array.from(document.querySelectorAll('#selected-work .hdc-home-page__work-card .hdc-home-page__card-title, #selected-work .hdc-home-page__work-card h3')).map(n => n.textContent.trim())
```
Expected: 3 cards; order begins with **flavor-agent**, then **tarot**, then the most-recently-updated featured repo. Also confirm 0 console errors.

> Note: the live GitHub merge can re-order by `updatedAt` for repos without a `featuredPriority`, but `flavor-agent` (-1) and `tarot` (0) must always lead in that order.

- [ ] **Step 5: Regression guard — re-run parity-checkers**

Dispatch the `parity-checker` agent for **`home-selected-work`** (expect PARITY or MINOR_DRIFT) and for **`work-showcase`** (must show no regression from the shared `normalizeRepoItem` + `repos.json` changes). Browser-check `/work/` renders its grid with no console errors.

- [ ] **Step 6: Final commit (if any operational notes/cadence logged)**

```bash
git add -A
git commit -m "ops(home-selected-work): resync pages + record parity verification"
```

---

## Self-Review Notes

- **Spec coverage:** H1 (Task 4), H2 (Task 2), M2 (Task 3 Step 2), M3 (Task 3 Steps 1–2), M4 (Task 1), L6 whyItMatters (Tasks 2+3 — normalizer already carries it; render.php now does too), dead config removal (Tasks 3,5,6). Accepted drift (L7 href, L9 skeleton) intentionally untouched.
- **Shared-surface risk:** Tasks 1 + 2 touch `work-showcase`'s data + normalizer — Task 7 Step 5 is the mandatory regression gate.
- **Baked-attribute trap:** Task 7 Step 2 re-syncs `post_content`; without it the old `featuredRepoNames` persists on the live page (same failure mode hit in Batch B's contact copy).
