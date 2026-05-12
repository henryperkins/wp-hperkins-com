# Home Page innerBlocks Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `henrys-digital-canvas/home-page` from a monolithic shell block into a parent block + 6 structured child section blocks, each exposing native Gutenberg attributes + Inspector panels + block `supports`, while preserving exact DOM/class/CSS parity with the current frontend.

**Architecture:** The parent block becomes a thin wrapper that emits `<section class="hdc-home-page alignfull">` and echoes `$content` (rendered children). Six child blocks (`home-hero`, `home-selected-work`, `home-throughline`, `home-resume-snapshot`, `home-recent-writing`, `home-contact-cta`) own their section's content as attributes, render server-side with the same `hdc-home-page__*` class names the current monolith emits, and (for the three dynamic sections) carry their own scoped `view.js` slice. The migration script rewrites the front page's `post_content` to include the parent + 6 children inline with attribute defaults seeded from `data/home-content.json`. `templateLock: "all"` for v1.

**Tech Stack:**
- WordPress 6.9.4 / Gutenberg 23.x / PHP 8.5
- Block API v3, `register_block_type_from_metadata`, `InnerBlocks` (`window.wp.blockEditor`)
- `wp.element.createElement` (no JSX, no build step — matches existing theme convention)
- Playwright 1.58.x for parity tests
- Bash + grep for the `!important` audit

**Spec:** `wp-content/themes/henrys-digital-canvas/docs/plans/2026-05-03-home-page-ai-readable-innerblocks-design.md`

---

## File Structure

### New files (theme-relative)

| Path | Responsibility |
|---|---|
| `blocks/home-hero/block.json` | Static hero metadata + 7 content attrs + supports |
| `blocks/home-hero/index.js` | Hero `edit()` with InspectorControls |
| `blocks/home-hero/render.php` | Server render with `hdc-home-page__hero*` classes |
| `blocks/home-hero/style.css` | Hero-scoped CSS extracted from `home-page/style.css` |
| `blocks/home-hero/index.asset.php` | Editor script asset manifest |
| `blocks/home-selected-work/{block.json,index.js,render.php,style.css,view.js,index.asset.php,view.asset.php}` | Dynamic Selected Work section |
| `blocks/home-throughline/{block.json,index.js,render.php,style.css,index.asset.php}` | Static Throughline section |
| `blocks/home-resume-snapshot/{block.json,index.js,render.php,style.css,view.js,index.asset.php,view.asset.php}` | Dynamic Resume Snapshot section |
| `blocks/home-recent-writing/{block.json,index.js,render.php,style.css,view.js,index.asset.php,view.asset.php}` | Dynamic Recent Writing section |
| `blocks/home-contact-cta/{block.json,index.js,render.php,style.css,index.asset.php}` | Static Contact CTA section |
| `scripts/playwright/home-parity.spec.cjs` | DOM/computed-style parity test vs `https://hperkins.com/` |
| `scripts/no_important_audit.sh` | Greps new child `style.css` files for `!important` on supports-covered properties |

### Modified files

| Path | Change |
|---|---|
| `blocks/home-page/block.json` | Strip content, add `template` + `templateLock: "all"`, `supports.align: ["full"]` only |
| `blocks/home-page/render.php` | Slim to opening `<section>`, `<?php echo $content; ?>`, closing tag |
| `blocks/home-page/index.js` | Replace edit/save with `InnerBlocks` + `InnerBlocks.Content` |
| `blocks/home-page/view.js` | **Delete** — logic moves to per-child view scripts |
| `blocks/home-page/view.asset.php` | **Delete** |
| `blocks/home-page/style.css` | Trim to outer wrapper / shared utility rules only |
| `blocks/home-page/index.asset.php` | Update version string |
| `assets/js/hdc-shared-utils.js` | Add lifted utility functions (`ensureString`, `ensureArray`, `ensureObject`, `normalizeTextList`, `clamp`, `stripHtml`, `formatDate`, `parseStableDate`, `getUpdatedAtTimestamp`, `humanizeRepoName`, `withQuery`, `normalizeAppPath`, `normalizePostsEndpoint`, `resolveRequestUrl`, `isRateLimitError`, `isOfflineError`, `normalizeRepoItem`, `mapGitHubRepos`, `compareReposByUpdatedAtDesc`, `normalizePostItem`, `normalizePostsPayload`, `normalizeResumeData`, `initRevealObserver`) + auto-bootstrap on DOMContentLoaded |
| `functions.php` | Add 6 child block directories to `hdc_register_theme_blocks` |
| `scripts/sync_page_sources.php` | Emit parent + 6 children inline with attribute defaults |
| `scripts/api_smoke.sh` | Add REST-shape check on front page `content.raw` (verify 6 child blocks + attribute keys present) |
| `scripts/full_smoke.sh` | Invoke `no_important_audit.sh` |
| `scripts/playwright/browser-smoke.spec.cjs` | Update home page selectors (additive — class names preserved) |

---

## Task 1: Branch + baseline smoke + pin baseline SHA

**Files:** none (git operations only)

- [ ] **Step 1: Confirm clean working tree on a feature branch**

```bash
git -C /home/dev/wp-hperkins-com status --short
git -C /home/dev/wp-hperkins-com checkout -b feat/home-page-innerblocks
```

Expected: a clean tree on `feat/home-page-innerblocks`. If pre-existing modifications exist, stash or branch from them deliberately.

- [ ] **Step 2: Pin the baseline SHA**

Every line-number reference in this plan that points into `blocks/home-page/view.js` (e.g., "view.js lines 24–70", "view.js lines 965–1065") is **relative to the SHA at branch checkpoint**. Record it now:

```bash
git -C /home/dev/wp-hperkins-com rev-parse HEAD > /tmp/home-page-innerblocks-baseline-sha.txt
git -C /home/dev/wp-hperkins-com rev-parse HEAD
```

Use this SHA throughout execution. When a later task says "lift view.js lines NNN–MMM", run:

```bash
SHA="$(cat /tmp/home-page-innerblocks-baseline-sha.txt)"
git -C /home/dev/wp-hperkins-com show "${SHA}:wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js" | sed -n 'NNN,MMMp'
```

This insulates the executor from line drift if interim refactors (Task 6 Step 4) shift positions inside `view.js` before later tasks slice from it. If you skip this step and the line ranges no longer match, fall back to `git log -p -S '<unique-substring>' -- blocks/home-page/view.js` to locate the function in the baseline commit.

- [ ] **Step 3: Run baseline smoke to confirm current state is green**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
npm install   # ensure Playwright + wp-scripts ready
BASE_URL=http://209.97.147.66 npm run smoke:full
```

Expected: PASS. If this fails before any change, stop and fix the baseline.

- [ ] **Step 4: Commit (no files yet — branch checkpoint only)**

Skip commit; branch alone is the checkpoint.

---

## Task 2: Add `no_important_audit.sh` (TDD: red-state first)

**Files:**
- Create: `wp-content/themes/henrys-digital-canvas/scripts/no_important_audit.sh`

- [ ] **Step 1: Write the audit script**

```bash
#!/usr/bin/env bash
set -euo pipefail

# Verifies the home-page child blocks do not use `!important` on properties
# that block-supports inline styles would otherwise override.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

CHILDREN=(
	home-hero
	home-selected-work
	home-throughline
	home-resume-snapshot
	home-recent-writing
	home-contact-cta
)

# Properties covered by `supports` for these children; if a child sets any
# of these as `!important`, user customization in the editor cannot win.
SUPPORTS_PROPS_REGEX='(padding|margin|border(-(top|right|bottom|left|color|style|width|radius))?|background(-color|-image)?|color|font-(size|family|weight)|line-height|text-align|min-height|gap|row-gap|column-gap)'

leaks=0
for child in "${CHILDREN[@]}"; do
	css="${THEME_DIR}/blocks/${child}/style.css"
	if [[ ! -f "${css}" ]]; then
		printf "Missing: %s (will be created in later tasks)\n" "${css}" >&2
		continue
	fi
	hits=$(grep -nE "^[^/]*\\b${SUPPORTS_PROPS_REGEX}\\b\\s*:.+!important" "${css}" || true)
	if [[ -n "${hits}" ]]; then
		printf "[FAIL] %s contains !important on supports-covered properties:\n%s\n" "${css}" "${hits}" >&2
		leaks=$((leaks + 1))
	fi
done

if (( leaks > 0 )); then
	printf "\nno_important_audit.sh: %d file(s) contain disallowed !important.\n" "${leaks}" >&2
	exit 1
fi

printf "no_important_audit.sh: clean.\n"
```

- [ ] **Step 2: Make executable + run**

```bash
chmod +x wp-content/themes/henrys-digital-canvas/scripts/no_important_audit.sh
wp-content/themes/henrys-digital-canvas/scripts/no_important_audit.sh
```

Expected: prints "Missing: ..." for each of the 6 yet-to-exist `style.css` files and exits 0 (no failures because no files contain leaks).

- [ ] **Step 3: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/scripts/no_important_audit.sh
git -C /home/dev/wp-hperkins-com commit -m "test(home-page): add no_important_audit.sh for child block CSS

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Wire `no_important_audit.sh` into `smoke:full`

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/full_smoke.sh`

- [ ] **Step 1: Edit `full_smoke.sh` to add the audit call between route smoke and api smoke**

Current contents (lines 1–16) end with `printf "\nFull smoke suite passed.\n"`. Insert the audit invocation **before** the route smoke so a CSS regression fails fast.

New contents:

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_BROWSER_SMOKE="${RUN_BROWSER_SMOKE:-1}"

"${SCRIPT_DIR}/no_important_audit.sh"
"${SCRIPT_DIR}/route_smoke.sh"
"${SCRIPT_DIR}/api_smoke.sh"

if [[ "${RUN_BROWSER_SMOKE}" == "1" ]]; then
	"${SCRIPT_DIR}/browser_smoke.sh"
else
	printf "Browser smoke skipped (RUN_BROWSER_SMOKE=%s).\n" "${RUN_BROWSER_SMOKE}"
fi

printf "\nFull smoke suite passed.\n"
```

- [ ] **Step 2: Run `smoke:full` to confirm audit is wired**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=http://209.97.147.66 RUN_BROWSER_SMOKE=0 npm run smoke:full
```

Expected: PASS with "no_important_audit.sh: clean." printed.

- [ ] **Step 3: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/scripts/full_smoke.sh
git -C /home/dev/wp-hperkins-com commit -m "test(home-page): wire no_important_audit.sh into smoke:full

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Create `home-parity.spec.cjs` (TDD: red against children-that-don't-exist-yet)

**Files:**
- Create: `wp-content/themes/henrys-digital-canvas/scripts/playwright/home-parity.spec.cjs`

- [ ] **Step 1: Write the parity spec**

```javascript
// scripts/playwright/home-parity.spec.cjs
const { test, expect } = require('@playwright/test');

const SOURCE_BASE_URL = process.env.SOURCE_BASE_URL || 'https://hperkins.com';
const TARGET_BASE_URL = process.env.TARGET_BASE_URL || process.env.BASE_URL || 'https://wp.hperkins.com';

// One BEM section root per child block. These class roots MUST be emitted
// by the child render.php files for parity to hold.
const SECTIONS = [
	{ name: 'hero', selector: '.hdc-home-page__hero' },
	{ name: 'selected-work', selector: '.hdc-home-page__section.hdc-home-page__section--work, .hdc-home-page__work-grid' },
	{ name: 'throughline', selector: '.hdc-home-page__throughline-grid' },
	{ name: 'resume-snapshot', selector: '.hdc-home-page__resume-stack' },
	{ name: 'recent-writing', selector: '.hdc-home-page__post-stack' },
	{ name: 'contact-cta', selector: '.hdc-home-page__cta-card' },
];

const COMPUTED_PROPS = [
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'margin-top',
	'margin-bottom',
	'border-top-width',
	'border-radius',
	'background-color',
	'color',
	'font-size',
	'line-height',
	'text-align',
	'display',
];

async function describeSection(page, selector) {
	return page.locator(selector).first().evaluate((node, props) => {
		if (!node) {
			return { exists: false };
		}
		const style = window.getComputedStyle(node);
		const computed = {};
		for (const prop of props) {
			computed[prop] = style.getPropertyValue(prop);
		}
		return {
			exists: true,
			tagName: node.tagName.toLowerCase(),
			classList: Array.from(node.classList).sort(),
			text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
			computed,
		};
	}, COMPUTED_PROPS);
}

test.describe('home page parity vs hperkins.com', () => {
	test.beforeAll(async () => {
		test.info().annotations.push({
			type: 'source',
			description: `source=${SOURCE_BASE_URL} target=${TARGET_BASE_URL}`,
		});
	});

	for (const section of SECTIONS) {
		test(`section "${section.name}" matches source DOM + computed styles`, async ({ browser }) => {
			const sourceContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
			const targetContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
			const sourcePage = await sourceContext.newPage();
			const targetPage = await targetContext.newPage();

			await sourcePage.goto(`${SOURCE_BASE_URL}/`, { waitUntil: 'networkidle' });
			await targetPage.goto(`${TARGET_BASE_URL}/`, { waitUntil: 'networkidle' });

			const sourceInfo = await describeSection(sourcePage, section.selector);
			const targetInfo = await describeSection(targetPage, section.selector);

			expect(targetInfo.exists, `target ${section.selector} must exist`).toBe(true);
			expect(sourceInfo.exists, `source ${section.selector} must exist`).toBe(true);
			expect(targetInfo.tagName).toBe(sourceInfo.tagName);
			expect(targetInfo.classList).toEqual(sourceInfo.classList);

			for (const prop of COMPUTED_PROPS) {
				expect(
					targetInfo.computed[prop],
					`section ${section.name} property ${prop} (target vs source)`
				).toBe(sourceInfo.computed[prop]);
			}

			await sourceContext.close();
			await targetContext.close();
		});
	}
});
```

- [ ] **Step 2: Run it standalone (expect FAIL — children don't exist yet)**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=http://209.97.147.66 npx playwright test scripts/playwright/home-parity.spec.cjs --config scripts/playwright/playwright.config.cjs --reporter=line
```

Expected: most tests fail because the current monolith emits identical class names today — so the parity test against `hperkins.com` may actually PASS for several sections. Either outcome is acceptable at this stage; the test exists to gate the migration. Document the baseline assertion counts in the commit message.

- [ ] **Step 3: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/scripts/playwright/home-parity.spec.cjs
git -C /home/dev/wp-hperkins-com commit -m "test(home-page): add cross-site parity spec (DOM + computed styles)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Wire `home-parity.spec.cjs` into `smoke:browser`

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/browser_smoke.sh`

- [ ] **Step 1: Edit `browser_smoke.sh` to run the parity spec after the main smoke**

Update the script so it also runs `home-parity.spec.cjs`. New contents:

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BASE_URL="${BASE_URL:-https://wp.hperkins.com}"
SPEC_PATH="${BROWSER_SMOKE_SPEC:-${THEME_DIR}/scripts/playwright/browser-smoke.spec.cjs}"
PARITY_SPEC_PATH="${HOME_PARITY_SPEC:-${THEME_DIR}/scripts/playwright/home-parity.spec.cjs}"
CONFIG_PATH="${BROWSER_SMOKE_CONFIG:-${THEME_DIR}/scripts/playwright/playwright.config.cjs}"

if ! command -v npx >/dev/null 2>&1; then
	printf "npx is required for browser smoke checks.\n" >&2
	exit 1
fi

for spec in "${SPEC_PATH}" "${PARITY_SPEC_PATH}"; do
	if [[ ! -f "${spec}" ]]; then
		printf "Browser smoke spec not found: %s\n" "${spec}" >&2
		exit 1
	fi
done

if [[ ! -f "${CONFIG_PATH}" ]]; then
	printf "Playwright config not found: %s\n" "${CONFIG_PATH}" >&2
	exit 1
fi

printf "Browser smoke against %s\n" "${BASE_URL}"

cd "${THEME_DIR}"
unset NO_COLOR || true

BASE_URL="${BASE_URL}" npx playwright test "${SPEC_PATH}" --config "${CONFIG_PATH}" --workers=1 --reporter=line "$@"

if [[ "${RUN_HOME_PARITY:-1}" == "1" ]]; then
	printf "\nHome parity check against %s vs %s\n" "${BASE_URL}" "${SOURCE_BASE_URL:-https://hperkins.com}"
	BASE_URL="${BASE_URL}" npx playwright test "${PARITY_SPEC_PATH}" --config "${CONFIG_PATH}" --workers=1 --reporter=line
fi

printf "\nBrowser smoke passed.\n"
```

- [ ] **Step 2: Run browser smoke to confirm wiring**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=http://209.97.147.66 RUN_HOME_PARITY=0 npm run smoke:browser
```

Expected: PASS (skipping parity spec by default while we iterate; flip `RUN_HOME_PARITY=1` once children land).

- [ ] **Step 3: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/scripts/browser_smoke.sh
git -C /home/dev/wp-hperkins-com commit -m "test(home-page): wire home-parity.spec.cjs into smoke:browser (opt-in via RUN_HOME_PARITY)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Lift shared utilities into `hdc-shared-utils.js`

Why: each new child `view.js` will need `ensureString`, `clamp`, etc. — duplicating them in three places is waste. Lift them to the existing shared module before extraction so per-child view scripts are smaller and consistent.

**Additionally critical:** `initRevealObserver` (currently in `home-page/view.js` lines 24–70) is invoked at `view.js:1177` after the React tree mounts and is the only code path that adds `.is-visible` to `.hdc-reveal` elements. Every child `render.php` emits `hdc-reveal hdc-reveal--*` classes on its section wrapper, so dropping `view.js` in Task 14 without lifting this observer would silently break the homepage scroll-reveal animation. Lift it here, auto-bootstrap from the IIFE so it fires on every page that ships `.hdc-reveal` elements, and re-run after each dynamic child hydrates its placeholder content (Tasks 10/11/12 view scripts call `utils.initRevealObserver()` after replacing children).

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js`

- [ ] **Step 1: Inspect current shape**

Read `assets/js/hdc-shared-utils.js`. Confirm the IIFE pattern: `( function ( global ) { ... global.hdcSharedUtils = { ... }; } )( window );`. Identify the existing `renderLucideIcon` export (line ~450). Confirm `hdc-shared-utils` is enqueued globally on every frontend page in `functions.php` (line ~80 — `wp_enqueue_script( 'hdc-shared-utils', ... )`). The auto-bootstrap in Step 4 relies on this enqueue.

- [ ] **Step 2: Lift functions verbatim from `blocks/home-page/view.js`**

Copy the function definitions from these line ranges (currently in `blocks/home-page/view.js`) into the IIFE body of `hdc-shared-utils.js`:

- `ensureString` — view.js lines 75–82
- `ensureArray` — view.js lines 84–86
- `normalizeTextList` — view.js lines 88–94
- `ensureObject` — view.js lines 96–98
- `clamp` — view.js lines 100–102
- `stripHtml` — view.js lines 104–113
- `withQuery` — view.js lines 115–118
- `normalizeAppPath` — view.js lines 120–148
- `normalizePostsEndpoint` — view.js lines 150–172
- `resolveRequestUrl` — view.js lines 174–190
- `parseStableDate` — view.js lines 192–205
- `formatDate` — view.js lines 207–219
- `getUpdatedAtTimestamp` — view.js lines 221–226
- `humanizeRepoName` — view.js lines 228–240
- `isRateLimitError` — view.js lines 488–499
- `isOfflineError` — view.js lines 501–521
- `normalizeRepoItem` — view.js lines 360–426
- `compareReposByUpdatedAtDesc` — view.js lines 428–438
- `mapGitHubRepos` — view.js lines 440–486
- `normalizePostItem` — view.js lines 523–556
- `normalizePostsPayload` — view.js lines 558–568
- `normalizeResumeData` — view.js lines 570–766
- `initRevealObserver` — view.js lines 24–70 (lift both the `let revealObserver = null;` module-level state and the function — the closure relationship must be preserved)

Place them above the `global.hdcSharedUtils = { ... }` export block.

- [ ] **Step 3: Expand the export block**

Edit the export block to add each lifted function as a property:

```javascript
global.hdcSharedUtils = {
	renderLucideIcon: renderLucideIcon,
	ensureString: ensureString,
	ensureArray: ensureArray,
	normalizeTextList: normalizeTextList,
	ensureObject: ensureObject,
	clamp: clamp,
	stripHtml: stripHtml,
	withQuery: withQuery,
	normalizeAppPath: normalizeAppPath,
	normalizePostsEndpoint: normalizePostsEndpoint,
	resolveRequestUrl: resolveRequestUrl,
	parseStableDate: parseStableDate,
	formatDate: formatDate,
	getUpdatedAtTimestamp: getUpdatedAtTimestamp,
	humanizeRepoName: humanizeRepoName,
	isRateLimitError: isRateLimitError,
	isOfflineError: isOfflineError,
	normalizeRepoItem: normalizeRepoItem,
	compareReposByUpdatedAtDesc: compareReposByUpdatedAtDesc,
	mapGitHubRepos: mapGitHubRepos,
	normalizePostItem: normalizePostItem,
	normalizePostsPayload: normalizePostsPayload,
	normalizeResumeData: normalizeResumeData,
	initRevealObserver: initRevealObserver,
};
```

- [ ] **Step 3a: Auto-bootstrap `initRevealObserver` from the IIFE**

After the export block, add a one-time bootstrap so any page that ships `.hdc-reveal` elements gets the observer attached without each block having to call it. Insert at the bottom of the IIFE, before the closing `} )( window );`:

```javascript
if ( typeof document !== 'undefined' ) {
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initRevealObserver );
	} else {
		initRevealObserver();
	}
}
```

Rationale: static children (hero, throughline, contact-cta) render their `.hdc-reveal` markup server-side, so it exists at `DOMContentLoaded`. Dynamic children (selected-work, resume-snapshot, recent-writing) replace their placeholder content after fetch resolves and must re-call `window.hdcSharedUtils.initRevealObserver()` to attach the observer to the freshly-mounted `.hdc-reveal` descendants. Tasks 10/11/12 view scripts do this (see Step 6 of each).

- [ ] **Step 4: Update `blocks/home-page/view.js` to consume the shared exports (interim — file is deleted in Task 14)**

Inside the IIFE preamble in `view.js`, after the existing `if ( window.hdcSharedUtils && ... renderLucideIcon ... )` block (around lines 17–22), add a hoist for the new utilities:

```javascript
const sharedUtils = window.hdcSharedUtils || {};
const ensureString = sharedUtils.ensureString || function ( value, fallback ) {
	if ( typeof value !== 'string' ) {
		return fallback;
	}
	const trimmed = value.trim();
	return trimmed || fallback;
};
const ensureArray = sharedUtils.ensureArray || function ( value ) {
	return Array.isArray( value ) ? value : [];
};
// ... mirror the same `sharedUtils.NAME || function () { ... }` shim for every other lifted function
```

Then delete the original local definitions of those functions inside `view.js` (the ones cited by line range in Step 2).

**Specifically for `initRevealObserver`:** delete the local `let revealObserver = null;` (line 24) AND the `function initRevealObserver() { ... }` body (lines 26–70) from `view.js`. Replace the existing call `initRevealObserver();` at view.js:1177 with `( sharedUtils.initRevealObserver || function () {} )();`. After Step 3a the IIFE auto-bootstrap will have already run once on `DOMContentLoaded`; the call at 1177 (after React mount) is a re-scan that picks up `.hdc-reveal` elements that the React tree just attached.

This is an interim refactor — `view.js` still works, exercising the new shared exports through the production runtime.

- [ ] **Step 5: Run full smoke to verify nothing regressed**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=http://209.97.147.66 npm run smoke:full
```

Expected: PASS. If a function reference is missing in `view.js`, the page will throw at runtime; the browser smoke catches that.

- [ ] **Step 6: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js
git -C /home/dev/wp-hperkins-com commit -m "refactor(shared-utils): lift home-page utilities into hdc-shared-utils

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Create `home-hero` block (static)

**Files:**
- Create: `wp-content/themes/henrys-digital-canvas/blocks/home-hero/block.json`
- Create: `wp-content/themes/henrys-digital-canvas/blocks/home-hero/index.js`
- Create: `wp-content/themes/henrys-digital-canvas/blocks/home-hero/index.asset.php`
- Create: `wp-content/themes/henrys-digital-canvas/blocks/home-hero/render.php`
- Create: `wp-content/themes/henrys-digital-canvas/blocks/home-hero/style.css`

- [ ] **Step 1: Create `blocks/home-hero/block.json`**

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "henrys-digital-canvas/home-hero",
	"title": "Home — Hero",
	"category": "widgets",
	"icon": "admin-home",
	"description": "Hero section of the home page. Eyebrow, headline, description, primary + secondary CTAs.",
	"textdomain": "henrys-digital-canvas",
	"parent": [ "henrys-digital-canvas/home-page" ],
	"supports": {
		"html": false,
		"align": [ "wide", "full" ],
		"spacing": { "padding": true, "margin": true, "blockGap": true },
		"border": { "color": true, "radius": true, "style": true, "width": true },
		"color": { "background": true, "text": true, "gradients": true, "link": true },
		"typography": {
			"fontSize": true,
			"lineHeight": true,
			"textAlign": true,
			"fontFamily": true,
			"fontWeight": true
		},
		"dimensions": { "minHeight": true }
	},
	"attributes": {
		"eyebrow":            { "type": "string", "default": "",                                                                       "role": "content" },
		"title":              { "type": "string", "default": "Retail floors. WordPress themes. Cloud platforms. Agentic AI.",          "role": "content" },
		"description":       { "type": "string", "default": "I've been learning to talk to machines since 2007 — now they're starting to talk back.", "role": "content" },
		"primaryCtaLabel":   { "type": "string", "default": "Explore Prompt Forge",                                                    "role": "content" },
		"primaryCtaHref":    { "type": "string", "default": "/work/ai-prompt-pro",                                                     "role": "content" },
		"secondaryCtaLabel": { "type": "string", "default": "Work With Me",                                                            "role": "content" },
		"secondaryCtaHref":  { "type": "string", "default": "/contact",                                                                "role": "content" }
	},
	"editorScript": "file:./index.js",
	"render": "file:./render.php",
	"style": "file:./style.css",
	"editorStyle": "file:./style.css"
}
```

- [ ] **Step 2: Create `blocks/home-hero/index.asset.php`**

```php
<?php
return array(
	'dependencies' => array( 'wp-block-editor', 'wp-blocks', 'wp-components', 'wp-element', 'wp-i18n' ),
	'version'      => '20260512.1',
);
```

- [ ] **Step 3: Create `blocks/home-hero/index.js` (Inspector + editor preview)**

```javascript
( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const Fragment = element.Fragment;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const TextareaControl = components.TextareaControl;

	blocks.registerBlockType( 'henrys-digital-canvas/home-hero', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-home-page__hero hdc-home-hero-editor',
			} );

			function inputFor( label, key, isTextarea ) {
				const Control = isTextarea ? TextareaControl : TextControl;
				return el( Control, {
					label: __( label, 'henrys-digital-canvas' ),
					value: attrs[ key ],
					onChange: function ( next ) {
						const update = {};
						update[ key ] = next;
						setAttributes( update );
					},
				} );
			}

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __( 'Hero copy', 'henrys-digital-canvas' ), initialOpen: true },
						inputFor( 'Eyebrow', 'eyebrow', false ),
						inputFor( 'Title', 'title', true ),
						inputFor( 'Description', 'description', true )
					),
					el(
						PanelBody,
						{ title: __( 'Primary CTA', 'henrys-digital-canvas' ), initialOpen: false },
						inputFor( 'Primary CTA label', 'primaryCtaLabel', false ),
						inputFor( 'Primary CTA href', 'primaryCtaHref', false )
					),
					el(
						PanelBody,
						{ title: __( 'Secondary CTA', 'henrys-digital-canvas' ), initialOpen: false },
						inputFor( 'Secondary CTA label', 'secondaryCtaLabel', false ),
						inputFor( 'Secondary CTA href', 'secondaryCtaHref', false )
					)
				),
				el(
					'div',
					blockProps,
					attrs.eyebrow && el( 'p', { className: 'hdc-home-page__hero-eyebrow' }, attrs.eyebrow ),
					el( 'h1', { className: 'hdc-home-page__hero-title' }, attrs.title ),
					el( 'p', { className: 'hdc-home-page__hero-description' }, attrs.description ),
					el(
						'div',
						{ className: 'hdc-home-page__hero-actions' },
						el( 'span', { className: 'hdc-home-page__button hdc-home-page__button--hero' }, attrs.primaryCtaLabel ),
						el( 'span', { className: 'hdc-home-page__button hdc-home-page__button--hero-secondary' }, attrs.secondaryCtaLabel )
					)
				)
			);
		},
		save: function Save() {
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.element,
	window.wp.i18n
);
```

- [ ] **Step 4: Create `blocks/home-hero/render.php`**

Server-side rendering must preserve the *exact* DOM and class names the current monolith emits for the hero section. Read `blocks/home-page/view.js` lines 1556–1657 to see the live shape, and `blocks/home-page/style.css` lines 64–227 for the CSS hooks. Match those.

```php
<?php
/**
 * Server render for henrys-digital-canvas/home-hero.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract  = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults  = isset( $contract['hero'] ) && is_array( $contract['hero'] ) ? $contract['hero'] : array();

$pick = function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$eyebrow            = $pick( 'eyebrow' );
$title              = $pick( 'title' );
$description        = $pick( 'description' );
$primary_cta_label  = $pick( 'primaryCtaLabel' );
$primary_cta_href   = $pick( 'primaryCtaHref' );
$secondary_cta_lbl  = $pick( 'secondaryCtaLabel' );
$secondary_cta_href = $pick( 'secondaryCtaHref' );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__hero noise hdc-reveal hdc-reveal--fade-in',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="hero-backdrop-editorial-amber" aria-hidden="true">
		<div class="hero-backdrop-overlay"></div>
	</div>
	<div class="hdc-home-page__hero-gradient hero-gradient-layer" aria-hidden="true"></div>
	<div class="hdc-home-page__hero-shell">
		<div class="hdc-home-page__hero-content">
			<?php if ( '' !== $eyebrow ) : ?>
				<p class="hdc-home-page__hero-eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
			<?php endif; ?>
			<h1 class="hdc-home-page__hero-title"><?php echo esc_html( $title ); ?></h1>
			<p class="hdc-home-page__hero-description"><?php echo esc_html( $description ); ?></p>
			<div class="hdc-home-page__hero-actions">
				<?php if ( '' !== $primary_cta_label ) : ?>
					<a class="hdc-home-page__button hdc-home-page__button--hero focus-ring" href="<?php echo esc_url( $primary_cta_href ); ?>">
						<?php echo esc_html( $primary_cta_label ); ?>
					</a>
				<?php endif; ?>
				<?php if ( '' !== $secondary_cta_lbl ) : ?>
					<a class="hdc-home-page__button hdc-home-page__button--hero-secondary focus-ring" href="<?php echo esc_url( $secondary_cta_href ); ?>">
						<?php echo esc_html( $secondary_cta_lbl ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
```

Cross-reference `blocks/home-page/view.js` lines 1556–1657 — if the live `<a>` markup uses different attributes (e.g., `rel`, `target`, icon spans), copy them verbatim. The arrow icon currently emitted by `renderActionArrow()` (view.js line 295) is NOT in the hero actions — confirm against the live page before adding any.

- [ ] **Step 5: Create `blocks/home-hero/style.css` by extracting hero selectors**

Move selectors from `blocks/home-page/style.css` whose specificity is rooted in `.hdc-home-page__hero*` into this new file. The extraction set is, approximately, lines 64–227 of `blocks/home-page/style.css`. Specifically:

- `.hdc-home-page__hero { ... }`
- `.hdc-home-page__hero-gradient { ... }`
- `.hdc-home-page__hero-shell { ... }`
- `.hdc-home-page__hero-content { ... }`
- `.hdc-home-page__hero-eyebrow { ... }`
- `.hdc-home-page__hero-title { ... }`
- `.hdc-home-page__hero-description { ... }`
- `.hdc-home-page__hero-actions { ... }`
- `.hdc-home-page__button { ... }` and all `--hero`, `--hero-secondary` variants

**Do not delete from `home-page/style.css` yet** — keep the originals there until Task 23, so the monolith keeps working during the migration.

If any rule uses `!important` on a property in this set: `padding|margin|border*|background-color|color|font-size|line-height|font-family|font-weight|text-align|min-height|gap`, remove the `!important`. The audit will fail otherwise.

- [ ] **Step 6: Smoke**

```bash
# style.css extraction can't be validated until the block is registered + the front page uses it.
# Just confirm the audit doesn't trip on what we wrote.
wp-content/themes/henrys-digital-canvas/scripts/no_important_audit.sh
```

Expected: prints "no_important_audit.sh: clean." or only lists missing files for siblings.

- [ ] **Step 7: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/blocks/home-hero
git -C /home/dev/wp-hperkins-com commit -m "feat(home-hero): scaffold static hero child block

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Create `home-contact-cta` block (static)

Same shape as Task 7 (static, no `view.js`). Reference markup: `blocks/home-page/view.js` lines 1941–2014; CSS: `blocks/home-page/style.css` selectors under `.hdc-home-page__cta-card`, `.hdc-home-page__cta-layout`, `.hdc-home-page__cta-body`, `.hdc-home-page__cta-actions`.

**Files:**
- Create: `blocks/home-contact-cta/{block.json,index.asset.php,index.js,render.php,style.css}`

- [ ] **Step 1: `blocks/home-contact-cta/block.json`**

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "henrys-digital-canvas/home-contact-cta",
	"title": "Home — Contact CTA",
	"category": "widgets",
	"icon": "email",
	"description": "Closing CTA on the home page. Eyebrow, headline, description, primary + secondary CTAs.",
	"textdomain": "henrys-digital-canvas",
	"parent": [ "henrys-digital-canvas/home-page" ],
	"supports": {
		"html": false,
		"align": [ "wide", "full" ],
		"spacing": { "padding": true, "margin": true, "blockGap": true },
		"border": { "color": true, "radius": true, "style": true, "width": true },
		"color": { "background": true, "text": true, "gradients": true, "link": true },
		"typography": { "fontSize": true, "lineHeight": true, "textAlign": true, "fontFamily": true, "fontWeight": true },
		"dimensions": { "minHeight": true }
	},
	"attributes": {
		"eyebrow":            { "type": "string", "default": "Need a technical partner?",                                                                        "role": "content" },
		"title":              { "type": "string", "default": "Bring me in where support, product, and implementation overlap.",                                  "role": "content" },
		"description":       { "type": "string", "default": "I help teams turn customer issues into shipped fixes — integrations, documentation, and AI-assisted triage — so delivery stays calm and outcomes are measurable.", "role": "content" },
		"primaryCtaLabel":   { "type": "string", "default": "Work with me",  "role": "content" },
		"primaryCtaHref":    { "type": "string", "default": "/contact",      "role": "content" },
		"secondaryCtaLabel": { "type": "string", "default": "View resume",   "role": "content" },
		"secondaryCtaHref":  { "type": "string", "default": "/resume",       "role": "content" }
	},
	"editorScript": "file:./index.js",
	"render": "file:./render.php",
	"style": "file:./style.css",
	"editorStyle": "file:./style.css"
}
```

- [ ] **Step 2: `blocks/home-contact-cta/index.asset.php`**

```php
<?php
return array(
	'dependencies' => array( 'wp-block-editor', 'wp-blocks', 'wp-components', 'wp-element', 'wp-i18n' ),
	'version'      => '20260512.1',
);
```

- [ ] **Step 3: `blocks/home-contact-cta/index.js`**

```javascript
( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const Fragment = element.Fragment;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const TextareaControl = components.TextareaControl;

	blocks.registerBlockType( 'henrys-digital-canvas/home-contact-cta', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-home-page__cta-card hdc-home-contact-cta-editor surface-library-ember-veil',
			} );

			function inputFor( label, key, isTextarea ) {
				const Control = isTextarea ? TextareaControl : TextControl;
				return el( Control, {
					label: __( label, 'henrys-digital-canvas' ),
					value: attrs[ key ],
					onChange: function ( next ) {
						const update = {};
						update[ key ] = next;
						setAttributes( update );
					},
				} );
			}

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __( 'Contact CTA copy', 'henrys-digital-canvas' ), initialOpen: true },
						inputFor( 'Eyebrow', 'eyebrow', false ),
						inputFor( 'Title', 'title', true ),
						inputFor( 'Description', 'description', true )
					),
					el(
						PanelBody,
						{ title: __( 'Primary CTA', 'henrys-digital-canvas' ), initialOpen: false },
						inputFor( 'Primary CTA label', 'primaryCtaLabel', false ),
						inputFor( 'Primary CTA href', 'primaryCtaHref', false )
					),
					el(
						PanelBody,
						{ title: __( 'Secondary CTA', 'henrys-digital-canvas' ), initialOpen: false },
						inputFor( 'Secondary CTA label', 'secondaryCtaLabel', false ),
						inputFor( 'Secondary CTA href', 'secondaryCtaHref', false )
					)
				),
				el(
					'div',
					blockProps,
					el(
						'div',
						{ className: 'hdc-home-page__cta-layout' },
						el(
							'div',
							{ className: 'hdc-home-page__cta-body' },
							attrs.eyebrow && el( 'p', { className: 'hdc-home-page__eyebrow' }, attrs.eyebrow ),
							el( 'h2', { className: 'hdc-home-page__section-title' }, attrs.title ),
							el( 'p', { className: 'hdc-home-page__copy' }, attrs.description )
						),
						el(
							'div',
							{ className: 'hdc-home-page__cta-actions' },
							el( 'span', { className: 'hdc-home-page__button' }, attrs.primaryCtaLabel ),
							el( 'span', { className: 'hdc-home-page__button hdc-home-page__button--secondary' }, attrs.secondaryCtaLabel )
						)
					)
				)
			);
		},
		save: function Save() {
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.element,
	window.wp.i18n
);
```

- [ ] **Step 4: `blocks/home-contact-cta/render.php`**

```php
<?php
/**
 * Server render for henrys-digital-canvas/home-contact-cta.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['contactCta'] ) && is_array( $contract['contactCta'] ) ? $contract['contactCta'] : array();

$pick = function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$eyebrow = $pick( 'eyebrow' );
$title   = $pick( 'title' );
$desc    = $pick( 'description' );
$plabel  = $pick( 'primaryCtaLabel' );
$phref   = $pick( 'primaryCtaHref' );
$slabel  = $pick( 'secondaryCtaLabel' );
$shref   = $pick( 'secondaryCtaHref' );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__cta-card surface-library-ember-veil hdc-reveal hdc-reveal--fade-in',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="hdc-home-page__cta-layout">
		<div class="hdc-home-page__cta-body">
			<?php if ( '' !== $eyebrow ) : ?>
				<p class="hdc-home-page__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
			<?php endif; ?>
			<h2 class="hdc-home-page__section-title"><?php echo esc_html( $title ); ?></h2>
			<p class="hdc-home-page__copy"><?php echo esc_html( $desc ); ?></p>
		</div>
		<div class="hdc-home-page__cta-actions">
			<?php if ( '' !== $plabel ) : ?>
				<a class="hdc-home-page__button focus-ring" href="<?php echo esc_url( $phref ); ?>">
					<?php echo esc_html( $plabel ); ?>
				</a>
			<?php endif; ?>
			<?php if ( '' !== $slabel ) : ?>
				<a class="hdc-home-page__button hdc-home-page__button--secondary focus-ring" href="<?php echo esc_url( $shref ); ?>">
					<?php echo esc_html( $slabel ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>
</section>
```

Confirm against `blocks/home-page/view.js` lines 1941–2014 — copy any additional DOM (icons, helper spans) that the live markup contains.

- [ ] **Step 5: `blocks/home-contact-cta/style.css` — extract `.hdc-home-page__cta-*` selectors from `blocks/home-page/style.css`.** Same rule as Task 7: do not delete from the monolith until Task 23.

- [ ] **Step 6: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/blocks/home-contact-cta
git -C /home/dev/wp-hperkins-com commit -m "feat(home-contact-cta): scaffold static contact CTA child block

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Create `home-throughline` block (static, repeater + nested quote)

Reference markup: `blocks/home-page/view.js` lines 1710–1808. Note the `paragraphs` repeater and the `quote` object.

**Files:**
- Create: `blocks/home-throughline/{block.json,index.asset.php,index.js,render.php,style.css}`

- [ ] **Step 1: `block.json` — paragraphs is `string[]`, quote is an object**

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "henrys-digital-canvas/home-throughline",
	"title": "Home — Throughline",
	"category": "widgets",
	"icon": "format-quote",
	"description": "Narrative paragraphs and pull quote on the home page.",
	"textdomain": "henrys-digital-canvas",
	"parent": [ "henrys-digital-canvas/home-page" ],
	"supports": {
		"html": false,
		"align": [ "wide", "full" ],
		"spacing": { "padding": true, "margin": true, "blockGap": true },
		"border": { "color": true, "radius": true, "style": true, "width": true },
		"color": { "background": true, "text": true, "gradients": true, "link": true },
		"typography": { "fontSize": true, "lineHeight": true, "textAlign": true, "fontFamily": true, "fontWeight": true },
		"dimensions": { "minHeight": true }
	},
	"attributes": {
		"title":      { "type": "string", "default": "From the floor to the frontier.", "role": "content" },
		"paragraphs": {
			"type": "array",
			"default": [
				"In 2007, I was coaching high school students in Chicago on how to tell a story clearly. By 2009, I was troubleshooting hardware on a retail floor at Micro Center. By 2012, I was managing a developer community at PageLines and supporting WordPress.com users at Automattic — the company behind WordPress itself.",
				"Then I ran coffee operations. Starbucks, Sodexo — high-volume, high-stakes, no-margin-for-error environments where the system either works at 6 AM or it doesn't. I learned more about process, escalation, and team coaching on those shifts than in any technical role I've ever held.",
				"Now I build AI agents and intelligent workflows. I design prompt systems. I ship React apps on Cloudflare. And I consult for teams that need someone who can scope the project, write the code, document the process, and explain it to a stakeholder who doesn't care about the stack — they just need it to work.",
				"The tools have changed five times over. The instinct hasn't."
			],
			"role": "content"
		},
		"quote": {
			"type": "object",
			"default": {
				"text": "He's always there when his community needs him.",
				"attribution": "PageLines recommendation",
				"eyebrow": "A former colleague"
			},
			"role": "content"
		}
	},
	"editorScript": "file:./index.js",
	"render": "file:./render.php",
	"style": "file:./style.css",
	"editorStyle": "file:./style.css"
}
```

- [ ] **Step 2: `index.asset.php`** — same shape as Task 7 Step 2.

- [ ] **Step 3: `index.js` — paragraphs repeater + quote sub-fields**

```javascript
( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const Fragment = element.Fragment;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const TextareaControl = components.TextareaControl;
	const Button = components.Button;

	blocks.registerBlockType( 'henrys-digital-canvas/home-throughline', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-home-page__throughline-grid hdc-home-throughline-editor',
			} );

			const paragraphs = Array.isArray( attrs.paragraphs ) ? attrs.paragraphs : [];
			const quote = attrs.quote && typeof attrs.quote === 'object' ? attrs.quote : { text: '', attribution: '', eyebrow: '' };

			function updateParagraph( index, next ) {
				const cloned = paragraphs.slice();
				cloned[ index ] = next;
				setAttributes( { paragraphs: cloned } );
			}

			function addParagraph() {
				setAttributes( { paragraphs: paragraphs.concat( [ '' ] ) } );
			}

			function removeParagraph( index ) {
				setAttributes( { paragraphs: paragraphs.filter( function ( _, i ) { return i !== index; } ) } );
			}

			function updateQuote( field, next ) {
				const merged = Object.assign( {}, quote );
				merged[ field ] = next;
				setAttributes( { quote: merged } );
			}

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __( 'Throughline', 'henrys-digital-canvas' ), initialOpen: true },
						el( TextControl, {
							label: __( 'Title', 'henrys-digital-canvas' ),
							value: attrs.title,
							onChange: function ( title ) { setAttributes( { title: title } ); },
						} )
					),
					el(
						PanelBody,
						{ title: __( 'Paragraphs', 'henrys-digital-canvas' ), initialOpen: false },
						paragraphs.map( function ( paragraph, index ) {
							return el(
								'div',
								{ key: 'p-' + index, style: { marginBottom: '12px' } },
								el( TextareaControl, {
									label: __( 'Paragraph ' + ( index + 1 ), 'henrys-digital-canvas' ),
									value: paragraph,
									onChange: function ( next ) { updateParagraph( index, next ); },
								} ),
								el( Button, {
									variant: 'tertiary',
									isDestructive: true,
									onClick: function () { removeParagraph( index ); },
								}, __( 'Remove', 'henrys-digital-canvas' ) )
							);
						} ),
						el( Button, {
							variant: 'secondary',
							onClick: addParagraph,
						}, __( 'Add paragraph', 'henrys-digital-canvas' ) )
					),
					el(
						PanelBody,
						{ title: __( 'Quote', 'henrys-digital-canvas' ), initialOpen: false },
						el( TextControl, {
							label: __( 'Eyebrow', 'henrys-digital-canvas' ),
							value: quote.eyebrow,
							onChange: function ( next ) { updateQuote( 'eyebrow', next ); },
						} ),
						el( TextareaControl, {
							label: __( 'Quote text', 'henrys-digital-canvas' ),
							value: quote.text,
							onChange: function ( next ) { updateQuote( 'text', next ); },
						} ),
						el( TextControl, {
							label: __( 'Attribution', 'henrys-digital-canvas' ),
							value: quote.attribution,
							onChange: function ( next ) { updateQuote( 'attribution', next ); },
						} )
					)
				),
				el(
					'div',
					blockProps,
					el( 'h2', { className: 'hdc-home-page__section-title hdc-home-page__section-title--intro' }, attrs.title ),
					el(
						'div',
						{ className: 'hdc-home-page__throughline-story' },
						paragraphs.map( function ( p, i ) {
							return el( 'p', { key: 'p-' + i, className: 'hdc-home-page__throughline-paragraph' }, p );
						} )
					),
					el(
						'aside',
						{ className: 'hdc-home-page__throughline-quote-card' },
						quote.eyebrow && el( 'p', { className: 'hdc-home-page__throughline-quote-header' }, quote.eyebrow ),
						el( 'blockquote', { className: 'hdc-home-page__throughline-blockquote' },
							el( 'p', { className: 'hdc-home-page__throughline-quote-text' }, quote.text ),
							el( 'footer', { className: 'hdc-home-page__throughline-quote-footer' }, quote.attribution )
						)
					)
				)
			);
		},
		save: function Save() {
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.element,
	window.wp.i18n
);
```

- [ ] **Step 4: `render.php` (throughline)**

```php
<?php
/**
 * Server render for henrys-digital-canvas/home-throughline.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['throughline'] ) && is_array( $contract['throughline'] ) ? $contract['throughline'] : array();

$title       = '';
$paragraphs  = array();
$quote_text  = '';
$quote_attr  = '';
$quote_brow  = '';

if ( isset( $attributes['title'] ) && '' !== trim( wp_strip_all_tags( (string) $attributes['title'] ) ) ) {
	$title = (string) $attributes['title'];
} elseif ( isset( $defaults['title'] ) ) {
	$title = (string) $defaults['title'];
}

$attr_paragraphs = isset( $attributes['paragraphs'] ) && is_array( $attributes['paragraphs'] ) ? $attributes['paragraphs'] : array();
$default_paras   = isset( $defaults['paragraphs'] ) && is_array( $defaults['paragraphs'] ) ? $defaults['paragraphs'] : array();
$paragraphs      = ! empty( $attr_paragraphs ) ? $attr_paragraphs : $default_paras;
$paragraphs      = array_values(
	array_filter(
		array_map(
			static function ( $paragraph ) {
				$value = trim( wp_strip_all_tags( (string) $paragraph ) );
				return '' !== $value ? $value : null;
			},
			$paragraphs
		)
	)
);

$attr_quote    = isset( $attributes['quote'] ) && is_array( $attributes['quote'] ) ? $attributes['quote'] : array();
$default_quote = isset( $defaults['quote'] ) && is_array( $defaults['quote'] ) ? $defaults['quote'] : array();
$pick_quote    = static function ( $key ) use ( $attr_quote, $default_quote ) {
	$value = isset( $attr_quote[ $key ] ) ? trim( wp_strip_all_tags( (string) $attr_quote[ $key ] ) ) : '';
	if ( '' !== $value ) {
		return $value;
	}
	return isset( $default_quote[ $key ] ) ? (string) $default_quote[ $key ] : '';
};

$quote_text = $pick_quote( 'text' );
$quote_attr = $pick_quote( 'attribution' );
$quote_brow = $pick_quote( 'eyebrow' );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__section hdc-home-page__section--throughline hdc-reveal hdc-reveal--fade-in',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="hdc-home-page__throughline-grid">
		<div class="hdc-home-page__throughline-story">
			<h2 class="hdc-home-page__section-title hdc-home-page__section-title--intro"><?php echo esc_html( $title ); ?></h2>
			<div class="hdc-home-page__throughline-narrative">
				<?php foreach ( $paragraphs as $paragraph ) : ?>
					<p class="hdc-home-page__throughline-paragraph"><?php echo esc_html( $paragraph ); ?></p>
				<?php endforeach; ?>
			</div>
		</div>
		<?php if ( '' !== $quote_text ) : ?>
			<aside class="hdc-home-page__throughline-quote-card">
				<?php if ( '' !== $quote_brow ) : ?>
					<p class="hdc-home-page__throughline-quote-header"><?php echo esc_html( $quote_brow ); ?></p>
				<?php endif; ?>
				<blockquote class="hdc-home-page__throughline-blockquote">
					<p class="hdc-home-page__throughline-quote-text"><?php echo esc_html( $quote_text ); ?></p>
					<footer class="hdc-home-page__throughline-quote-footer"><?php echo esc_html( $quote_attr ); ?></footer>
				</blockquote>
			</aside>
		<?php endif; ?>
	</div>
</section>
```

- [ ] **Step 5: `style.css` — extract `.hdc-home-page__throughline-*` and `.hdc-home-page__section--intro` selectors**

- [ ] **Step 6: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/blocks/home-throughline
git -C /home/dev/wp-hperkins-com commit -m "feat(home-throughline): scaffold static throughline child block (paragraphs repeater)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Create `home-selected-work` block (dynamic, has `view.js`)

Reference: section header + grid in `blocks/home-page/view.js` lines 1658–1709, plus `WorkCard` (lines 965–1065) and GitHub fetch logic (lines 580–760). Repo data normalization moved to `hdcSharedUtils` in Task 6.

**Files:**
- Create: `blocks/home-selected-work/{block.json,index.asset.php,view.asset.php,index.js,render.php,style.css,view.js}`

- [ ] **Step 1: `block.json`**

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "henrys-digital-canvas/home-selected-work",
	"title": "Home — Selected Work",
	"category": "widgets",
	"icon": "portfolio",
	"description": "Selected GitHub repositories and curated case studies, fetched live with fallback.",
	"textdomain": "henrys-digital-canvas",
	"parent": [ "henrys-digital-canvas/home-page" ],
	"supports": {
		"html": false,
		"align": [ "wide", "full" ],
		"spacing": { "padding": true, "margin": true, "blockGap": true },
		"border": { "color": true, "radius": true, "style": true, "width": true },
		"color": { "background": true, "text": true, "gradients": true, "link": true },
		"typography": { "fontSize": true, "lineHeight": true, "textAlign": true, "fontFamily": true, "fontWeight": true },
		"dimensions": { "minHeight": true }
	},
	"attributes": {
		"title":                    { "type": "string", "default": "Selected Work",                                                                            "role": "content" },
		"actionLabel":             { "type": "string", "default": "View all work",                                                                            "role": "content" },
		"actionHref":              { "type": "string", "default": "/work",                                                                                    "role": "content" },
		"featuredRepoNames":       { "type": "array",  "default": [ "tarot", "ai-cli-web-funnel", "dj-judas" ],                                               "role": "content" },
		"loadingLabel":            { "type": "string", "default": "Syncing selected work...",                                                                  "role": "content" },
		"sourceLiveLabel":         { "type": "string", "default": "Selected work blends live GitHub builds with private client case studies.",                "role": "content" },
		"sourceFallbackLabel":     { "type": "string", "default": "Selected work blends private client case studies with a cached GitHub snapshot.",          "role": "content" },
		"emptyTitle":              { "type": "string", "default": "Selected work is updating",                                                                 "role": "content" },
		"emptyDescriptionLive":     { "type": "string", "default": "Featured work is being refreshed for the homepage. Use View all work to browse the full project library.", "role": "content" },
		"emptyDescriptionFallback": { "type": "string", "default": "Featured work is not available in this snapshot. Use View all work to browse the full project library.",   "role": "content" },
		"repoCount":               { "type": "number", "default": 3 }
	},
	"editorScript": "file:./index.js",
	"viewScript": "file:./view.js",
	"render": "file:./render.php",
	"style": "file:./style.css",
	"editorStyle": "file:./style.css"
}
```

- [ ] **Step 2: `index.asset.php`** — identical to Task 7 Step 2.

- [ ] **Step 3: `view.asset.php`**

```php
<?php
return array(
	'dependencies' => array( 'wp-element', 'hdc-shared-utils' ),
	'version'      => filemtime( __DIR__ . '/view.js' ),
);
```

- [ ] **Step 4: `index.js` — Inspector with featured repos repeater + numeric repo count**

```javascript
( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const Fragment = element.Fragment;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const TextareaControl = components.TextareaControl;
	const RangeControl = components.RangeControl;
	const Button = components.Button;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/home-selected-work', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-home-page__section hdc-home-page__section--work hdc-home-selected-work-editor',
			} );

			const repoNames = Array.isArray( attrs.featuredRepoNames ) ? attrs.featuredRepoNames : [];

			function updateRepoName( index, next ) {
				const cloned = repoNames.slice();
				cloned[ index ] = next.trim();
				setAttributes( { featuredRepoNames: cloned } );
			}

			function addRepoName() {
				setAttributes( { featuredRepoNames: repoNames.concat( [ '' ] ) } );
			}

			function removeRepoName( index ) {
				setAttributes( { featuredRepoNames: repoNames.filter( function ( _, i ) { return i !== index; } ) } );
			}

			function textInput( label, key, isTextarea ) {
				const Control = isTextarea ? TextareaControl : TextControl;
				return el( Control, {
					label: __( label, 'henrys-digital-canvas' ),
					value: attrs[ key ],
					onChange: function ( next ) {
						const update = {};
						update[ key ] = next;
						setAttributes( update );
					},
				} );
			}

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __( 'Heading', 'henrys-digital-canvas' ), initialOpen: true },
						textInput( 'Section title', 'title', false ),
						textInput( 'Action label', 'actionLabel', false ),
						textInput( 'Action href', 'actionHref', false )
					),
					el(
						PanelBody,
						{ title: __( 'Featured repositories', 'henrys-digital-canvas' ), initialOpen: false },
						el( RangeControl, {
							label: __( 'Repos to display', 'henrys-digital-canvas' ),
							value: attrs.repoCount,
							min: 1,
							max: 6,
							onChange: function ( repoCount ) { setAttributes( { repoCount: repoCount } ); },
						} ),
						repoNames.map( function ( name, index ) {
							return el(
								'div',
								{ key: 'repo-' + index, style: { marginBottom: '8px' } },
								el( TextControl, {
									label: __( 'Repo #' + ( index + 1 ), 'henrys-digital-canvas' ),
									value: name,
									onChange: function ( next ) { updateRepoName( index, next ); },
								} ),
								el( Button, {
									variant: 'tertiary',
									isDestructive: true,
									onClick: function () { removeRepoName( index ); },
								}, __( 'Remove', 'henrys-digital-canvas' ) )
							);
						} ),
						el( Button, { variant: 'secondary', onClick: addRepoName }, __( 'Add repo', 'henrys-digital-canvas' ) )
					),
					el(
						PanelBody,
						{ title: __( 'Empty + status copy', 'henrys-digital-canvas' ), initialOpen: false },
						textInput( 'Loading label', 'loadingLabel', false ),
						textInput( 'Source label (live)', 'sourceLiveLabel', true ),
						textInput( 'Source label (fallback)', 'sourceFallbackLabel', true ),
						textInput( 'Empty title', 'emptyTitle', false ),
						textInput( 'Empty description (live)', 'emptyDescriptionLive', true ),
						textInput( 'Empty description (fallback)', 'emptyDescriptionFallback', true )
					)
				),
				el(
					'div',
					blockProps,
					el( Notice, { status: 'info', isDismissible: false },
						__( 'Live: fetches selected repos from GitHub (with fallback). Editor shows a placeholder list.', 'henrys-digital-canvas' )
					),
					el( 'h2', { className: 'hdc-home-page__section-title' }, attrs.title ),
					el(
						'p',
						{ className: 'hdc-home-page__editor-meta' },
						__( 'Featured: ', 'henrys-digital-canvas' ) + repoNames.join( ', ' )
					)
				)
			);
		},
		save: function Save() {
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.element,
	window.wp.i18n
);
```

- [ ] **Step 5: `render.php` — emits the section shell + a `data-config` JSON for the view.js**

```php
<?php
/**
 * Server render for henrys-digital-canvas/home-selected-work.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['selectedWork'] ) && is_array( $contract['selectedWork'] ) ? $contract['selectedWork'] : array();

$pick = function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$attr_repos = isset( $attributes['featuredRepoNames'] ) && is_array( $attributes['featuredRepoNames'] ) ? $attributes['featuredRepoNames'] : array();
$default_repos = isset( $defaults['featuredRepoNames'] ) && is_array( $defaults['featuredRepoNames'] ) ? $defaults['featuredRepoNames'] : array();
$repos = ! empty( $attr_repos ) ? $attr_repos : $default_repos;
$repos = array_values( array_filter( array_map( 'sanitize_text_field', $repos ) ) );

$repo_count = isset( $attributes['repoCount'] ) ? (int) $attributes['repoCount'] : 3;
$repo_count = max( 1, min( 6, $repo_count ) );

$initial_repos = function_exists( 'hdc_read_theme_json_file' )
	? hdc_read_theme_json_file( '/blocks/work-showcase/data/repos.json', array() )
	: array();
if ( ! is_array( $initial_repos ) ) {
	$initial_repos = array();
}
$initial_repos = array_values(
	array_filter(
		array_map(
			static function ( $repo ) {
				if ( ! is_array( $repo ) || empty( $repo['name'] ) || empty( $repo['featured'] ) ) {
					return null;
				}
				return array(
					'name'        => sanitize_text_field( (string) $repo['name'] ),
					'displayName' => sanitize_text_field( (string) ( $repo['displayName'] ?? '' ) ),
					'description' => sanitize_text_field( (string) ( $repo['description'] ?? '' ) ),
					'language'    => sanitize_text_field( (string) ( $repo['language'] ?? '' ) ),
					'updatedAt'   => sanitize_text_field( (string) ( $repo['updatedAt'] ?? '' ) ),
					'url'         => esc_url_raw( (string) ( $repo['url'] ?? '' ) ),
					'topics'      => isset( $repo['topics'] ) && is_array( $repo['topics'] )
						? array_values( array_map( 'sanitize_text_field', $repo['topics'] ) )
						: array(),
					'featured'    => true,
					'origin'      => sanitize_text_field( (string) ( $repo['origin'] ?? 'curated' ) ),
					'access'      => sanitize_text_field( (string) ( $repo['access'] ?? 'public' ) ),
				);
			},
			$initial_repos
		)
	)
);

$config = array(
	'title'                    => $pick( 'title' ),
	'actionLabel'             => $pick( 'actionLabel' ),
	'actionHref'              => esc_url_raw( $pick( 'actionHref' ) ),
	'featuredRepoNames'       => $repos,
	'loadingLabel'            => $pick( 'loadingLabel' ),
	'sourceLiveLabel'         => $pick( 'sourceLiveLabel' ),
	'sourceFallbackLabel'     => $pick( 'sourceFallbackLabel' ),
	'emptyTitle'              => $pick( 'emptyTitle' ),
	'emptyDescriptionLive'     => $pick( 'emptyDescriptionLive' ),
	'emptyDescriptionFallback' => $pick( 'emptyDescriptionFallback' ),
	'repoCount'               => $repo_count,
	'initialRepos'            => $initial_repos,
	'githubUsername'          => function_exists( 'hdc_get_configured_github_owner' ) ? hdc_get_configured_github_owner() : '',
	'githubProxyUrl'          => '/api/github/repos',
	'workEndpoint'            => esc_url_raw( rest_url( 'henrys-digital-canvas/v1/work' ) ),
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__section hdc-home-page__section--work hdc-reveal hdc-reveal--fade-in',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>" data-hdc-home-selected-work>
	<header class="hdc-home-page__section-header">
		<h2 class="hdc-home-page__section-title"><?php echo esc_html( $config['title'] ); ?></h2>
		<?php if ( '' !== $config['actionLabel'] ) : ?>
			<a class="hdc-home-page__section-link focus-ring" href="<?php echo esc_url( $config['actionHref'] ); ?>">
				<?php echo esc_html( $config['actionLabel'] ); ?>
			</a>
		<?php endif; ?>
	</header>
	<div class="hdc-home-page__work-grid" data-hdc-home-selected-work-grid>
		<p class="hdc-home-page__status"><?php echo esc_html( $config['loadingLabel'] ); ?></p>
	</div>
</section>
```

- [ ] **Step 6: `view.js` — extracted from `blocks/home-page/view.js`**

The current monolith renders the whole homepage as a single React tree. The extracted `view.js` should:
1. Read `data-config` from `[data-hdc-home-selected-work]`.
2. Use shared helpers from `window.hdcSharedUtils` (`ensureString`, `ensureArray`, `clamp`, `normalizeRepoItem`, `mapGitHubRepos`, `compareReposByUpdatedAtDesc`, `humanizeRepoName`, `formatDate`, `isRateLimitError`, `isOfflineError`).
3. Re-use the existing `WorkCard` rendering logic (lines 965–1065) — copy into this file.
4. Fetch from `config.githubProxyUrl` with pagination (REPO_PROXY_PAGE_SIZE/REPO_PROXY_MAX_PAGES); on failure, fall back to `config.initialRepos`.
5. Replace the loading placeholder content of `[data-hdc-home-selected-work-grid]` with the rendered grid.

```javascript
( function ( wp ) {
	if ( ! wp || ! wp.element || ! window.hdcSharedUtils ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const utils = window.hdcSharedUtils;
	const ensureString = utils.ensureString;
	const ensureArray = utils.ensureArray;
	const ensureObject = utils.ensureObject;
	const clamp = utils.clamp;
	const normalizeRepoItem = utils.normalizeRepoItem;
	const compareReposByUpdatedAtDesc = utils.compareReposByUpdatedAtDesc;
	const mapGitHubRepos = utils.mapGitHubRepos;
	const humanizeRepoName = utils.humanizeRepoName;
	const formatDate = utils.formatDate;
	const isRateLimitError = utils.isRateLimitError;
	const isOfflineError = utils.isOfflineError;
	const renderLucideIcon = utils.renderLucideIcon || function () { return null; };

	const REPO_PROXY_PAGE_SIZE = 100;
	const REPO_PROXY_MAX_PAGES = 20;

	function parseConfig( section ) {
		let parsed = {};
		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}
		return {
			title: ensureString( parsed.title, 'Selected Work' ),
			actionLabel: ensureString( parsed.actionLabel, '' ),
			actionHref: ensureString( parsed.actionHref, '' ),
			featuredRepoNames: ensureArray( parsed.featuredRepoNames ),
			loadingLabel: ensureString( parsed.loadingLabel, '' ),
			sourceLiveLabel: ensureString( parsed.sourceLiveLabel, '' ),
			sourceFallbackLabel: ensureString( parsed.sourceFallbackLabel, '' ),
			emptyTitle: ensureString( parsed.emptyTitle, '' ),
			emptyDescriptionLive: ensureString( parsed.emptyDescriptionLive, '' ),
			emptyDescriptionFallback: ensureString( parsed.emptyDescriptionFallback, '' ),
			repoCount: clamp( Number.parseInt( parsed.repoCount, 10 ) || 3, 1, 6 ),
			initialRepos: ensureArray( parsed.initialRepos ),
			githubUsername: ensureString( parsed.githubUsername, 'henryperkins' ),
			githubProxyUrl: ensureString( parsed.githubProxyUrl, '/api/github/repos' ),
			workEndpoint: ensureString( parsed.workEndpoint, '/wp-json/henrys-digital-canvas/v1/work' ),
		};
	}

	// Copy WorkCard from blocks/home-page/view.js lines 965-1065 (verbatim).
	// Copy fetchGithubRepos and helpers it depends on from blocks/home-page/view.js
	//   approximate lines 580-760, scoped to only the selected-work code path.
	// Mount: for each [data-hdc-home-selected-work] node, parse config, fetch,
	// replace [data-hdc-home-selected-work-grid] children with the rendered grid.

	function mountSelectedWork( section ) {
		const config = parseConfig( section );
		const grid = section.querySelector( '[data-hdc-home-selected-work-grid]' );
		if ( ! grid ) {
			return;
		}
		// Implementation note for executor: paste the existing render path
		// from view.js lines 1365-1387 (selectedWorkContent) and pair it
		// with the fetch path from view.js lines 580-700. Use createRoot
		// (with legacyRender fallback) on the grid element.
		//
		// After replacing grid children, call:
		//   if ( typeof utils.initRevealObserver === 'function' ) { utils.initRevealObserver(); }
		// so the freshly-mounted `.hdc-reveal` cards get the IntersectionObserver attached.
	}

	function init() {
		document.querySelectorAll( '[data-hdc-home-selected-work]' ).forEach( mountSelectedWork );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )( window.wp );
```

**Executor note:** in step 6 you must copy the literal `WorkCard`, fetch loop, and grid render code from the monolith. Use the exact lines cited, sliced from the **pinned baseline SHA recorded in Task 1 Step 2** — not from the current working-tree `view.js` (Task 6 Step 4 modifies it in flight). Do NOT inline an "approximation" — verbatim copy with utility names rebound to `utils.*`. Example slice command:

```bash
SHA="$(cat /tmp/home-page-innerblocks-baseline-sha.txt)"
git -C /home/dev/wp-hperkins-com show "${SHA}:wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js" | sed -n '965,1065p'   # WorkCard
git -C /home/dev/wp-hperkins-com show "${SHA}:wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js" | sed -n '580,760p'    # fetch loop
git -C /home/dev/wp-hperkins-com show "${SHA}:wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js" | sed -n '1365,1387p'  # selectedWorkContent
```

- [ ] **Step 7: `style.css` — extract `.hdc-home-page__work-grid`, `.hdc-home-page__work-card`, `.hdc-home-page__work-meta`, `.hdc-home-page__work-origin`, `.hdc-home-page__skeleton*`, `.hdc-home-page__section-header`, `.hdc-home-page__section-link`, `.hdc-home-page__action-icon*`, `.hdc-home-page__retry`, `.hdc-home-page__badge*` selectors from `blocks/home-page/style.css`.**

- [ ] **Step 8: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/blocks/home-selected-work
git -C /home/dev/wp-hperkins-com commit -m "feat(home-selected-work): scaffold dynamic selected work child block

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Create `home-resume-snapshot` block (dynamic, has `view.js`)

Reference: section header + body in `blocks/home-page/view.js` lines 1389–1517 (snapshot composition) and 1809–1904 (section header). CSS: `.hdc-home-page__resume-*` selectors.

**Files:**
- Create: `blocks/home-resume-snapshot/{block.json,index.asset.php,view.asset.php,index.js,render.php,style.css,view.js}`

- [ ] **Step 1: `block.json`** — declare all 11 attributes including `positioningEyebrow`, `label`, `items` (string[]), `bestFitEyebrow`, `bestFitTitle`, `focusAreas` (string[]), `actionLinks` (array of `{label,href}`). Same `supports` block as Task 7 Step 1.

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "henrys-digital-canvas/home-resume-snapshot",
	"title": "Home — Resume Snapshot",
	"category": "widgets",
	"icon": "id-alt",
	"description": "Resume snapshot card on the home page. Pulls live resume data via REST.",
	"textdomain": "henrys-digital-canvas",
	"parent": [ "henrys-digital-canvas/home-page" ],
	"supports": {
		"html": false,
		"align": [ "wide", "full" ],
		"spacing": { "padding": true, "margin": true, "blockGap": true },
		"border": { "color": true, "radius": true, "style": true, "width": true },
		"color": { "background": true, "text": true, "gradients": true, "link": true },
		"typography": { "fontSize": true, "lineHeight": true, "textAlign": true, "fontFamily": true, "fontWeight": true },
		"dimensions": { "minHeight": true }
	},
	"attributes": {
		"title":              { "type": "string", "default": "Resume Snapshot",                                                                            "role": "content" },
		"actionLabel":       { "type": "string", "default": "Interactive resume",                                                                          "role": "content" },
		"actionHref":        { "type": "string", "default": "/resume",                                                                                     "role": "content" },
		"positioningEyebrow": { "type": "string", "default": "Positioning",                                                                                "role": "content" },
		"label":              { "type": "string", "default": "Public proof of work",                                                                       "role": "content" },
		"items":              { "type": "array",  "default": [ "Prompt Forge", "HPerkins.com", "wp-hperkins-com" ],                                       "role": "content" },
		"bestFitEyebrow":     { "type": "string", "default": "Best fit",                                                                                   "role": "content" },
		"bestFitTitle":       { "type": "string", "default": "Where I contribute fastest",                                                                  "role": "content" },
		"focusAreas":         {
			"type": "array",
			"default": [
				"Customer-facing implementation, onboarding, and support workflows",
				"API integrations, documentation, and escalation triage",
				"AI-assisted workflow delivery grounded in WordPress and durable web systems"
			],
			"role": "content"
		},
		"actionLinks":        {
			"type": "array",
			"default": [
				{ "label": "Interactive resume", "href": "/resume" },
				{ "label": "ATS / recruiter view", "href": "/resume/ats" }
			],
			"role": "content"
		},
		"resumeEndpoint":     { "type": "string", "default": "" }
	},
	"editorScript": "file:./index.js",
	"viewScript": "file:./view.js",
	"render": "file:./render.php",
	"style": "file:./style.css",
	"editorStyle": "file:./style.css"
}
```

- [ ] **Step 2: `index.asset.php`**

```php
<?php
return array(
	'dependencies' => array( 'wp-block-editor', 'wp-blocks', 'wp-components', 'wp-element', 'wp-i18n' ),
	'version'      => '20260512.1',
);
```

- [ ] **Step 3: `view.asset.php`**

```php
<?php
return array(
	'dependencies' => array( 'wp-element', 'hdc-shared-utils' ),
	'version'      => filemtime( __DIR__ . '/view.js' ),
);
```

- [ ] **Step 4: `index.js`**

```javascript
( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const Fragment = element.Fragment;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const TextareaControl = components.TextareaControl;
	const Button = components.Button;
	const Notice = components.Notice;

	function asArray( value ) {
		return Array.isArray( value ) ? value : [];
	}

	function asObject( value ) {
		return value && typeof value === 'object' ? value : {};
	}

	function renderStringRepeater( labelPrefix, attrKey, attrs, setAttributes ) {
		const list = asArray( attrs[ attrKey ] );
		return el(
			Fragment,
			{},
			list.map( function ( item, index ) {
				return el(
					'div',
					{ key: attrKey + '-' + index, style: { marginBottom: '8px' } },
					el( TextareaControl, {
						label: __( labelPrefix + ' ' + ( index + 1 ), 'henrys-digital-canvas' ),
						value: item,
						onChange: function ( next ) {
							const cloned = list.slice();
							cloned[ index ] = next;
							const update = {};
							update[ attrKey ] = cloned;
							setAttributes( update );
						},
					} ),
					el( Button, {
						variant: 'tertiary',
						isDestructive: true,
						onClick: function () {
							const update = {};
							update[ attrKey ] = list.filter( function ( _, i ) { return i !== index; } );
							setAttributes( update );
						},
					}, __( 'Remove', 'henrys-digital-canvas' ) )
				);
			} ),
			el( Button, {
				variant: 'secondary',
				onClick: function () {
					const update = {};
					update[ attrKey ] = list.concat( [ '' ] );
					setAttributes( update );
				},
			}, __( 'Add ' + labelPrefix.toLowerCase(), 'henrys-digital-canvas' ) )
		);
	}

	function renderActionLinksRepeater( attrs, setAttributes ) {
		const list = asArray( attrs.actionLinks );

		function updateField( index, field, value ) {
			const cloned = list.map( function ( item, i ) {
				if ( i !== index ) {
					return item;
				}
				const merged = Object.assign( {}, asObject( item ) );
				merged[ field ] = value;
				return merged;
			} );
			setAttributes( { actionLinks: cloned } );
		}

		return el(
			Fragment,
			{},
			list.map( function ( link, index ) {
				const item = asObject( link );
				return el(
					'div',
					{ key: 'al-' + index, style: { marginBottom: '8px' } },
					el( TextControl, {
						label: __( 'Link ' + ( index + 1 ) + ' label', 'henrys-digital-canvas' ),
						value: item.label || '',
						onChange: function ( next ) { updateField( index, 'label', next ); },
					} ),
					el( TextControl, {
						label: __( 'Link ' + ( index + 1 ) + ' href', 'henrys-digital-canvas' ),
						value: item.href || '',
						onChange: function ( next ) { updateField( index, 'href', next ); },
					} ),
					el( Button, {
						variant: 'tertiary',
						isDestructive: true,
						onClick: function () {
							setAttributes( {
								actionLinks: list.filter( function ( _, i ) { return i !== index; } ),
							} );
						},
					}, __( 'Remove', 'henrys-digital-canvas' ) )
				);
			} ),
			el( Button, {
				variant: 'secondary',
				onClick: function () {
					setAttributes( { actionLinks: list.concat( [ { label: '', href: '' } ] ) } );
				},
			}, __( 'Add link', 'henrys-digital-canvas' ) )
		);
	}

	blocks.registerBlockType( 'henrys-digital-canvas/home-resume-snapshot', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-home-page__section hdc-home-page__section--resume hdc-home-resume-snapshot-editor',
			} );

			function input( label, key, isTextarea ) {
				const Control = isTextarea ? TextareaControl : TextControl;
				return el( Control, {
					label: __( label, 'henrys-digital-canvas' ),
					value: attrs[ key ],
					onChange: function ( next ) {
						const update = {};
						update[ key ] = next;
						setAttributes( update );
					},
				} );
			}

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el( PanelBody, { title: __( 'Heading', 'henrys-digital-canvas' ), initialOpen: true },
						input( 'Section title', 'title', false ),
						input( 'Action label', 'actionLabel', false ),
						input( 'Action href', 'actionHref', false )
					),
					el( PanelBody, { title: __( 'Positioning', 'henrys-digital-canvas' ), initialOpen: false },
						input( 'Eyebrow', 'positioningEyebrow', false ),
						input( 'Label', 'label', false ),
						renderStringRepeater( 'Item', 'items', attrs, setAttributes )
					),
					el( PanelBody, { title: __( 'Best fit', 'henrys-digital-canvas' ), initialOpen: false },
						input( 'Eyebrow', 'bestFitEyebrow', false ),
						input( 'Title', 'bestFitTitle', false ),
						renderStringRepeater( 'Focus area', 'focusAreas', attrs, setAttributes )
					),
					el( PanelBody, { title: __( 'Action links', 'henrys-digital-canvas' ), initialOpen: false },
						renderActionLinksRepeater( attrs, setAttributes )
					),
					el( PanelBody, { title: __( 'Advanced', 'henrys-digital-canvas' ), initialOpen: false },
						input( 'Resume endpoint (override)', 'resumeEndpoint', false )
					)
				),
				el(
					'div',
					blockProps,
					el( Notice, { status: 'info', isDismissible: false },
						__( 'Live: fetches resume snapshot via REST. Editor shows a placeholder list.', 'henrys-digital-canvas' )
					),
					el( 'h2', { className: 'hdc-home-page__section-title' }, attrs.title ),
					el( 'p', { className: 'hdc-home-page__editor-meta' }, __( 'Items: ', 'henrys-digital-canvas' ) + asArray( attrs.items ).join( ', ' ) )
				)
			);
		},
		save: function Save() {
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.element,
	window.wp.i18n
);
```

- [ ] **Step 5: `render.php`**

```php
<?php
/**
 * Server render for henrys-digital-canvas/home-resume-snapshot.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['resumeSnapshot'] ) && is_array( $contract['resumeSnapshot'] ) ? $contract['resumeSnapshot'] : array();

$pick_string = function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$pick_string_list = function ( $key ) use ( $attributes, $defaults ) {
	$source = isset( $attributes[ $key ] ) && is_array( $attributes[ $key ] ) && ! empty( $attributes[ $key ] )
		? $attributes[ $key ]
		: ( isset( $defaults[ $key ] ) && is_array( $defaults[ $key ] ) ? $defaults[ $key ] : array() );
	return array_values(
		array_filter(
			array_map(
				static function ( $item ) {
					$value = trim( wp_strip_all_tags( (string) $item ) );
					return '' !== $value ? $value : null;
				},
				$source
			)
		)
	);
};

$pick_action_links = function () use ( $attributes, $defaults ) {
	$source = isset( $attributes['actionLinks'] ) && is_array( $attributes['actionLinks'] ) && ! empty( $attributes['actionLinks'] )
		? $attributes['actionLinks']
		: ( isset( $defaults['actionLinks'] ) && is_array( $defaults['actionLinks'] ) ? $defaults['actionLinks'] : array() );
	$normalized = array();
	foreach ( $source as $item ) {
		if ( ! is_array( $item ) ) {
			continue;
		}
		$label = trim( wp_strip_all_tags( (string) ( $item['label'] ?? '' ) ) );
		$href  = trim( (string) ( $item['href'] ?? '' ) );
		if ( '' === $label || '' === $href ) {
			continue;
		}
		$normalized[] = array(
			'label' => $label,
			'href'  => esc_url_raw( $href ),
		);
	}
	return $normalized;
};

$resume_endpoint = isset( $attributes['resumeEndpoint'] ) ? trim( (string) $attributes['resumeEndpoint'] ) : '';
if ( '' === $resume_endpoint ) {
	$resume_endpoint = esc_url_raw( rest_url( 'henrys-digital-canvas/v1/resume' ) );
}

$initial_resume = function_exists( 'hdc_get_resume_data_contract' ) ? hdc_get_resume_data_contract() : array();
if ( ! is_array( $initial_resume ) ) {
	$initial_resume = array();
}

$config = array(
	'title'               => $pick_string( 'title' ),
	'actionLabel'        => $pick_string( 'actionLabel' ),
	'actionHref'         => esc_url_raw( $pick_string( 'actionHref' ) ),
	'positioningEyebrow' => $pick_string( 'positioningEyebrow' ),
	'label'               => $pick_string( 'label' ),
	'items'               => $pick_string_list( 'items' ),
	'bestFitEyebrow'     => $pick_string( 'bestFitEyebrow' ),
	'bestFitTitle'       => $pick_string( 'bestFitTitle' ),
	'focusAreas'         => $pick_string_list( 'focusAreas' ),
	'actionLinks'        => $pick_action_links(),
	'resumeEndpoint'     => $resume_endpoint,
	'initialResume'      => $initial_resume,
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__section hdc-home-page__section--resume hdc-reveal hdc-reveal--fade-in',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>" data-hdc-home-resume-snapshot>
	<header class="hdc-home-page__section-header">
		<h2 class="hdc-home-page__section-title"><?php echo esc_html( $config['title'] ); ?></h2>
		<?php if ( '' !== $config['actionLabel'] ) : ?>
			<a class="hdc-home-page__section-link focus-ring" href="<?php echo esc_url( $config['actionHref'] ); ?>">
				<?php echo esc_html( $config['actionLabel'] ); ?>
			</a>
		<?php endif; ?>
	</header>
	<div class="hdc-home-page__resume-stack" data-hdc-home-resume-stack>
		<p class="hdc-home-page__status"><?php esc_html_e( 'Loading resume snapshot…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
```

- [ ] **Step 6: `view.js`**

Reuse the same shape as Task 10 Step 6. Slice the source from the **pinned baseline SHA (Task 1 Step 2)** so line numbers are stable. The render function should:
1. Read config.
2. Try `fetch(config.resumeEndpoint)`. On non-200, fall back to `config.initialResume`.
3. Hydrate the `.hdc-home-page__resume-stack` element by re-rendering the snapshot card markup the monolith currently produces (view.js lines 1389–1517 at baseline SHA).
4. After replacing stack children, call `if ( typeof utils.initRevealObserver === 'function' ) { utils.initRevealObserver(); }` so any `.hdc-reveal` descendants the snapshot card emits get the observer attached.

```bash
SHA="$(cat /tmp/home-page-innerblocks-baseline-sha.txt)"
git -C /home/dev/wp-hperkins-com show "${SHA}:wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js" | sed -n '1389,1517p'  # resume snapshot card
```

- [ ] **Step 7: `style.css` — extract `.hdc-home-page__resume-*`, `.hdc-home-page__inline-links`, `.hdc-home-page__badges`, `.hdc-home-page__inline-dot` selectors.**

- [ ] **Step 8: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/blocks/home-resume-snapshot
git -C /home/dev/wp-hperkins-com commit -m "feat(home-resume-snapshot): scaffold dynamic resume snapshot child block

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Create `home-recent-writing` block (dynamic, has `view.js`)

Reference: `PostCard` (lines 1066–1129), recent writing section (lines 1519–1549, 1905–1940). CSS: `.hdc-home-page__post-*` selectors.

**Files:**
- Create: `blocks/home-recent-writing/{block.json,index.asset.php,view.asset.php,index.js,render.php,style.css,view.js}`

- [ ] **Step 1: `block.json`** — 7 attrs (title, actionLabel, actionHref, emptyTitle, emptyDescription, blogCount, blogEndpoint), supports block identical to Task 7 Step 1.

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "henrys-digital-canvas/home-recent-writing",
	"title": "Home — Recent Writing",
	"category": "widgets",
	"icon": "feedback",
	"description": "Recent blog posts on the home page, fetched via REST.",
	"textdomain": "henrys-digital-canvas",
	"parent": [ "henrys-digital-canvas/home-page" ],
	"supports": {
		"html": false,
		"align": [ "wide", "full" ],
		"spacing": { "padding": true, "margin": true, "blockGap": true },
		"border": { "color": true, "radius": true, "style": true, "width": true },
		"color": { "background": true, "text": true, "gradients": true, "link": true },
		"typography": { "fontSize": true, "lineHeight": true, "textAlign": true, "fontFamily": true, "fontWeight": true },
		"dimensions": { "minHeight": true }
	},
	"attributes": {
		"title":           { "type": "string", "default": "Recent Writing",                                                                                              "role": "content" },
		"actionLabel":    { "type": "string", "default": "All posts",                                                                                                   "role": "content" },
		"actionHref":     { "type": "string", "default": "/blog",                                                                                                       "role": "content" },
		"emptyTitle":     { "type": "string", "default": "Recent writing is updating",                                                                                  "role": "content" },
		"emptyDescription": { "type": "string", "default": "Recent posts aren't available in the homepage feed. Visit All posts to browse the full index.",            "role": "content" },
		"blogCount":      { "type": "number", "default": 3 },
		"blogEndpoint":   { "type": "string", "default": "" }
	},
	"editorScript": "file:./index.js",
	"viewScript": "file:./view.js",
	"render": "file:./render.php",
	"style": "file:./style.css",
	"editorStyle": "file:./style.css"
}
```

- [ ] **Step 2: `index.asset.php`**

```php
<?php
return array(
	'dependencies' => array( 'wp-block-editor', 'wp-blocks', 'wp-components', 'wp-element', 'wp-i18n' ),
	'version'      => '20260512.1',
);
```

- [ ] **Step 3: `view.asset.php`**

```php
<?php
return array(
	'dependencies' => array( 'wp-element', 'hdc-shared-utils' ),
	'version'      => filemtime( __DIR__ . '/view.js' ),
);
```

- [ ] **Step 4: `index.js`**

```javascript
( function ( blocks, blockEditor, components, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! components || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const Fragment = element.Fragment;
	const __ = i18n.__;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const TextControl = components.TextControl;
	const TextareaControl = components.TextareaControl;
	const RangeControl = components.RangeControl;
	const Notice = components.Notice;

	blocks.registerBlockType( 'henrys-digital-canvas/home-recent-writing', {
		edit: function Edit( props ) {
			const attrs = props.attributes;
			const setAttributes = props.setAttributes;
			const blockProps = useBlockProps( {
				className: 'hdc-home-page__section hdc-home-page__section--writing hdc-home-recent-writing-editor hdc-feed-section',
			} );

			function input( label, key, isTextarea ) {
				const Control = isTextarea ? TextareaControl : TextControl;
				return el( Control, {
					label: __( label, 'henrys-digital-canvas' ),
					value: attrs[ key ],
					onChange: function ( next ) {
						const update = {};
						update[ key ] = next;
						setAttributes( update );
					},
				} );
			}

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el( PanelBody, { title: __( 'Heading', 'henrys-digital-canvas' ), initialOpen: true },
						input( 'Section title', 'title', false ),
						input( 'Action label', 'actionLabel', false ),
						input( 'Action href', 'actionHref', false )
					),
					el( PanelBody, { title: __( 'Feed', 'henrys-digital-canvas' ), initialOpen: false },
						el( RangeControl, {
							label: __( 'Posts to display', 'henrys-digital-canvas' ),
							value: attrs.blogCount,
							min: 1,
							max: 6,
							onChange: function ( blogCount ) { setAttributes( { blogCount: blogCount } ); },
						} )
					),
					el( PanelBody, { title: __( 'Empty state', 'henrys-digital-canvas' ), initialOpen: false },
						input( 'Empty title', 'emptyTitle', false ),
						input( 'Empty description', 'emptyDescription', true )
					),
					el( PanelBody, { title: __( 'Advanced', 'henrys-digital-canvas' ), initialOpen: false },
						input( 'Blog endpoint (override)', 'blogEndpoint', false )
					)
				),
				el(
					'div',
					blockProps,
					el( Notice, { status: 'info', isDismissible: false },
						__( 'Live: fetches blog posts via REST. Editor shows a placeholder summary.', 'henrys-digital-canvas' )
					),
					el( 'h2', { className: 'hdc-home-page__section-title' }, attrs.title ),
					el( 'p', { className: 'hdc-home-page__editor-meta' }, __( 'Showing the ', 'henrys-digital-canvas' ) + attrs.blogCount + __( ' most recent posts.', 'henrys-digital-canvas' ) )
				)
			);
		},
		save: function Save() {
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.element,
	window.wp.i18n
);
```

- [ ] **Step 5: `render.php`**

```php
<?php
/**
 * Server render for henrys-digital-canvas/home-recent-writing.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contract = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
$defaults = isset( $contract['recentWriting'] ) && is_array( $contract['recentWriting'] ) ? $contract['recentWriting'] : array();

$pick = function ( $key ) use ( $attributes, $defaults ) {
	$value = isset( $attributes[ $key ] ) ? wp_strip_all_tags( (string) $attributes[ $key ] ) : '';
	if ( '' !== trim( $value ) ) {
		return $value;
	}
	return isset( $defaults[ $key ] ) ? (string) $defaults[ $key ] : '';
};

$blog_count = isset( $attributes['blogCount'] ) ? (int) $attributes['blogCount'] : 3;
$blog_count = max( 1, min( 6, $blog_count ) );

$blog_endpoint = isset( $attributes['blogEndpoint'] ) ? trim( (string) $attributes['blogEndpoint'] ) : '';
if ( '' === $blog_endpoint ) {
	$blog_endpoint = esc_url_raw( add_query_arg( 'limit', $blog_count, rest_url( 'henrys-digital-canvas/v1/blog' ) ) );
}

$initial_posts = function_exists( 'hdc_get_blog_posts_data_contract' ) ? hdc_get_blog_posts_data_contract( $blog_count ) : array();
if ( isset( $initial_posts['posts'] ) && is_array( $initial_posts['posts'] ) ) {
	$initial_posts['posts'] = array_values(
		array_map(
			static function ( $post ) {
				if ( ! is_array( $post ) ) {
					return array();
				}
				return array(
					'id'                  => isset( $post['id'] ) ? (int) $post['id'] : 0,
					'slug'                => sanitize_title( (string) ( $post['slug'] ?? '' ) ),
					'title'               => html_entity_decode( sanitize_text_field( (string) ( $post['title'] ?? '' ) ), ENT_QUOTES, 'UTF-8' ),
					'excerpt'             => sanitize_text_field( (string) ( $post['excerpt'] ?? '' ) ),
					'date'                => sanitize_text_field( (string) ( $post['date'] ?? '' ) ),
					'readingTime'         => sanitize_text_field( (string) ( $post['readingTime'] ?? '' ) ),
					'url'                 => esc_url_raw( (string) ( $post['url'] ?? '' ) ),
					'featuredImageUrl'    => esc_url_raw( (string) ( $post['featuredImageUrl'] ?? '' ) ),
					'featuredImageAlt'    => sanitize_text_field( (string) ( $post['featuredImageAlt'] ?? '' ) ),
					'featuredImageSrcSet' => trim( wp_strip_all_tags( (string) ( $post['featuredImageSrcSet'] ?? '' ) ) ),
				);
			},
			$initial_posts['posts']
		)
	);
}

$config = array(
	'title'           => $pick( 'title' ),
	'actionLabel'    => $pick( 'actionLabel' ),
	'actionHref'     => esc_url_raw( $pick( 'actionHref' ) ),
	'emptyTitle'     => $pick( 'emptyTitle' ),
	'emptyDescription' => $pick( 'emptyDescription' ),
	'blogCount'      => $blog_count,
	'blogEndpoint'   => $blog_endpoint,
	'initialPosts'   => is_array( $initial_posts ) ? $initial_posts : array(),
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page__section hdc-home-page__section--writing hdc-feed-section hdc-reveal hdc-reveal--fade-in',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>" data-hdc-home-recent-writing>
	<header class="hdc-home-page__section-header">
		<h2 class="hdc-home-page__section-title"><?php echo esc_html( $config['title'] ); ?></h2>
		<?php if ( '' !== $config['actionLabel'] ) : ?>
			<a class="hdc-home-page__section-link focus-ring" href="<?php echo esc_url( $config['actionHref'] ); ?>">
				<?php echo esc_html( $config['actionLabel'] ); ?>
			</a>
		<?php endif; ?>
	</header>
	<div class="hdc-home-page__post-stack" data-hdc-home-recent-writing-stack>
		<p class="hdc-home-page__status"><?php esc_html_e( 'Loading recent writing…', 'henrys-digital-canvas' ); ?></p>
	</div>
</section>
```

The class string preserves `hdc-feed-section` so the existing `browser-smoke.spec.cjs` assertion at line 293 (`page.locator('.hdc-feed-section').filter({ hasText: 'Recent Writing' })`) continues to match without spec edits.

- [ ] **Step 6: `view.js` — extracted from `blocks/home-page/view.js`**

Slice the source from the **pinned baseline SHA (Task 1 Step 2)** so line numbers are stable. The extracted view script must:
1. Read `[data-hdc-home-recent-writing]` `data-config`.
2. Use `window.hdcSharedUtils.normalizePostsPayload`, `ensureString`, `ensureArray`, `clamp`, `stripHtml`, `formatDate`.
3. Re-use the existing `PostCard` rendering logic from `blocks/home-page/view.js` lines 1066–1129 at baseline SHA (verbatim copy with utility names rebound to `utils.*`).
4. `fetch(config.blogEndpoint)`; on non-200 or empty results, render `config.initialPosts` if present, else the empty state from `config.emptyTitle` + `config.emptyDescription`.
5. Replace the loading placeholder content of `[data-hdc-home-recent-writing-stack]` with the rendered cards.

```bash
SHA="$(cat /tmp/home-page-innerblocks-baseline-sha.txt)"
git -C /home/dev/wp-hperkins-com show "${SHA}:wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js" | sed -n '1066,1129p'  # PostCard
git -C /home/dev/wp-hperkins-com show "${SHA}:wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js" | sed -n '700,760p'    # recent-writing fetch branch
```

Boilerplate skeleton (paste the actual render/fetch from the line ranges above into the marked spots):

```javascript
( function ( wp ) {
	if ( ! wp || ! wp.element || ! window.hdcSharedUtils ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const utils = window.hdcSharedUtils;

	function parseConfig( section ) {
		let parsed = {};
		try { parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' ); } catch ( error ) { parsed = {}; }
		return {
			title: utils.ensureString( parsed.title, 'Recent Writing' ),
			emptyTitle: utils.ensureString( parsed.emptyTitle, '' ),
			emptyDescription: utils.ensureString( parsed.emptyDescription, '' ),
			blogCount: utils.clamp( Number.parseInt( parsed.blogCount, 10 ) || 3, 1, 6 ),
			blogEndpoint: utils.ensureString( parsed.blogEndpoint, '' ),
			initialPosts: parsed.initialPosts || {},
		};
	}

	// PostCard: paste verbatim from blocks/home-page/view.js lines 1066-1129,
	// renaming any local `ensureString`/`stripHtml`/`formatDate` references to `utils.X`.

	// fetchRecentPosts: paste verbatim from blocks/home-page/view.js lines ~700-760
	// (the recent-writing fetch branch), scoped to one section.

	function mount( section ) {
		const config = parseConfig( section );
		const stack = section.querySelector( '[data-hdc-home-recent-writing-stack]' );
		if ( ! stack ) {
			return;
		}
		// Render: use createRoot(stack) || legacyRender; show <ul> of PostCard;
		// on fetch failure, fall back to config.initialPosts.posts, then to empty state.
		//
		// After replacing stack children, call:
		//   if ( typeof utils.initRevealObserver === 'function' ) { utils.initRevealObserver(); }
		// so the freshly-mounted `.hdc-reveal` post cards get the observer attached.
		// PostCard at view.js:1096 sets className 'hdc-home-page__post-card focus-ring hdc-reveal hdc-reveal--slide-left'.
	}

	function init() {
		document.querySelectorAll( '[data-hdc-home-recent-writing]' ).forEach( mount );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )( window.wp );
```

- [ ] **Step 7: `style.css` — extract `.hdc-home-page__post-stack`, `.hdc-home-page__post-card`, `.hdc-home-page__post-thumb-wrap`, `.hdc-home-page__post-body`, `.hdc-home-page__post-meta`, `.hdc-home-page__card-date*`, `.hdc-home-page__card-copy`, and any feed-section selectors from `blocks/home-page/style.css`.**

- [ ] **Step 8: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/blocks/home-recent-writing
git -C /home/dev/wp-hperkins-com commit -m "feat(home-recent-writing): scaffold dynamic recent writing child block

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: Register the 6 new child blocks in `functions.php`

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/functions.php`

- [ ] **Step 1: Edit `hdc_register_theme_blocks` to add the 6 directories**

Locate the `$block_directories = array( ... );` at line ~132. Append:

```php
get_stylesheet_directory() . '/blocks/home-hero',
get_stylesheet_directory() . '/blocks/home-selected-work',
get_stylesheet_directory() . '/blocks/home-throughline',
get_stylesheet_directory() . '/blocks/home-resume-snapshot',
get_stylesheet_directory() . '/blocks/home-recent-writing',
get_stylesheet_directory() . '/blocks/home-contact-cta',
```

- [ ] **Step 2: Verify with WP-CLI that all 7 blocks are registered**

```bash
wp --path=/home/ubuntu/wp-hperkins-com eval 'foreach ( array(
    "henrys-digital-canvas/home-page",
    "henrys-digital-canvas/home-hero",
    "henrys-digital-canvas/home-selected-work",
    "henrys-digital-canvas/home-throughline",
    "henrys-digital-canvas/home-resume-snapshot",
    "henrys-digital-canvas/home-recent-writing",
    "henrys-digital-canvas/home-contact-cta"
) as $name ) { echo $name . " => " . ( WP_Block_Type_Registry::get_instance()->is_registered( $name ) ? "registered" : "MISSING" ) . PHP_EOL; }'
```

Expected: all 7 print `registered`. The front page still renders the old monolith (post_content unchanged) so visual output is unaffected.

- [ ] **Step 3: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/functions.php
git -C /home/dev/wp-hperkins-com commit -m "feat(home-page): register 6 new home-page child blocks

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: Cutover — slim parent + update sync script + run sync (single commit)

Why one commit: between slimming the parent and running `sync:pages`, the front page renders empty. Combine the changes so HEAD is never broken.

**Files:**
- Modify: `blocks/home-page/block.json`
- Modify: `blocks/home-page/render.php`
- Modify: `blocks/home-page/index.js`
- Modify: `blocks/home-page/index.asset.php`
- Modify: `blocks/home-page/style.css`
- Delete: `blocks/home-page/view.js`
- Delete: `blocks/home-page/view.asset.php`
- Modify: `scripts/sync_page_sources.php`

- [ ] **Step 1: Replace `blocks/home-page/block.json`**

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "henrys-digital-canvas/home-page",
	"title": "Home Page",
	"category": "widgets",
	"icon": "admin-home",
	"description": "Route-owned homepage wrapper. Children: hero, selected-work, throughline, resume-snapshot, recent-writing, contact-cta.",
	"textdomain": "henrys-digital-canvas",
	"supports": {
		"html": false,
		"align": [ "full" ]
	},
	"editorScript": "file:./index.js",
	"render": "file:./render.php",
	"style": "file:./style.css",
	"editorStyle": "file:./style.css"
}
```

**Deliberate deviation from the 2026-05-03 design spec:** the design spec (lines 56–62) calls for `template` and `templateLock` keys on the parent `block.json`. Those are NOT recognized fields in WordPress's `block.json` schema (see `https://schemas.wp.org/trunk/block.json` and `register_block_type_from_metadata()` source — `template`/`templateLock` are arguments to JS `<InnerBlocks>` and to `register_post_type( 'template' => ... )`, not block metadata). Putting them in `block.json` would be silently ignored. The plan correctly places them in JS (`index.js` Step 3 below) where they're passed to `useInnerBlocksProps`. Reviewers comparing this plan against the design spec should treat this as a corrected over-specification, not a missed requirement.

- [ ] **Step 2: Replace `blocks/home-page/render.php`**

```php
<?php
/**
 * Server render for the home-page wrapper. Inner content is rendered children.
 *
 * @package HenrysDigitalCanvas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'hdc-home-page alignfull',
	)
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</section>
```

- [ ] **Step 3: Replace `blocks/home-page/index.js`**

The parent is a dynamic block. `render.php` emits the outer `<section>`, so `save()` returns only `<InnerBlocks.Content />` — the children's serialized markup. The wrapper element is added at render time.

```javascript
( function ( blocks, blockEditor, element, i18n ) {
	if ( ! blocks || ! blockEditor || ! element || ! i18n ) {
		return;
	}

	const el = element.createElement;
	const useBlockProps = blockEditor.useBlockProps;
	const useInnerBlocksProps = blockEditor.useInnerBlocksProps || blockEditor.__experimentalUseInnerBlocksProps;
	const InnerBlocks = blockEditor.InnerBlocks;

	const TEMPLATE = [
		[ 'henrys-digital-canvas/home-hero', {} ],
		[ 'henrys-digital-canvas/home-selected-work', {} ],
		[ 'henrys-digital-canvas/home-throughline', {} ],
		[ 'henrys-digital-canvas/home-resume-snapshot', {} ],
		[ 'henrys-digital-canvas/home-recent-writing', {} ],
		[ 'henrys-digital-canvas/home-contact-cta', {} ],
	];

	const ALLOWED_BLOCKS = TEMPLATE.map( function ( pair ) { return pair[ 0 ]; } );

	blocks.registerBlockType( 'henrys-digital-canvas/home-page', {
		edit: function Edit() {
			const blockProps = useBlockProps( {
				className: 'hdc-home-page alignfull',
			} );
			const innerBlocksProps = useInnerBlocksProps( blockProps, {
				template: TEMPLATE,
				templateLock: 'all',
				allowedBlocks: ALLOWED_BLOCKS,
				renderAppender: false,
			} );
			return el( 'section', innerBlocksProps );
		},
		save: function Save() {
			return el( InnerBlocks.Content, {} );
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.element,
	window.wp.i18n
);
```

**Why `useInnerBlocksProps` instead of `<InnerBlocks>` as a child:** the modern pattern merges wrapper attrs and inner-blocks integration onto the same DOM element. The older `el('section', blockProps, el(InnerBlocks, ...))` pattern emits the editor DOM as `<section class="hdc-home-page"><div class="block-editor-inner-blocks">…</div></section>` — an extra wrapper that doesn't exist on the frontend (`render.php` echoes `$content` directly between `<section>` and `</section>`). Using `useInnerBlocksProps( blockProps, ... )` collapses both onto the `<section>`, keeping the editor DOM closer to the frontend DOM so computed-style parity in `home-parity.spec.cjs` won't surprise you.

- [ ] **Step 4: Update `blocks/home-page/index.asset.php` version string**

```php
<?php
return array(
	'dependencies' => array( 'wp-block-editor', 'wp-blocks', 'wp-element', 'wp-i18n' ),
	'version'      => '20260512.2',
);
```

- [ ] **Step 5: Delete `blocks/home-page/view.js` and `blocks/home-page/view.asset.php`**

```bash
rm /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js
rm /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/blocks/home-page/view.asset.php
```

- [ ] **Step 6: Trim `blocks/home-page/style.css`**

Keep only outer wrapper selectors and selectors that are genuinely shared across sections (e.g., `.hdc-home-page`, `.hdc-home-page__shell` if still used, `.hdc-home-page__status`, `.hdc-home-page__copy`, `.hdc-home-page__empty`). Move everything else into the appropriate child `style.css` (already done in Tasks 7–12; this step deletes the now-duplicate rules from the monolith).

Read `blocks/home-page/style.css` line-by-line; if a selector's specificity is rooted in any of `__hero|__section|__work|__resume|__post|__throughline|__cta|__button|__card|__badge|__skeleton|__inline|__action-icon|__section-header|__section-link`, it has been migrated and should be deleted from this file.

- [ ] **Step 7: Update `scripts/sync_page_sources.php`**

Modify the home page entry to emit the parent + 6 children inline. Replace the existing entry at line ~127–132 with a generator that reads `data/home-content.json`:

```php
function hdc_build_home_page_block_markup() {
	$contract  = function_exists( 'hdc_get_home_content_data_contract' ) ? hdc_get_home_content_data_contract() : array();
	$hero      = isset( $contract['hero'] ) && is_array( $contract['hero'] ) ? $contract['hero'] : array();
	$work      = isset( $contract['selectedWork'] ) && is_array( $contract['selectedWork'] ) ? $contract['selectedWork'] : array();
	$through   = isset( $contract['throughline'] ) && is_array( $contract['throughline'] ) ? $contract['throughline'] : array();
	$resume    = isset( $contract['resumeSnapshot'] ) && is_array( $contract['resumeSnapshot'] ) ? $contract['resumeSnapshot'] : array();
	$writing   = isset( $contract['recentWriting'] ) && is_array( $contract['recentWriting'] ) ? $contract['recentWriting'] : array();
	$contact   = isset( $contract['contactCta'] ) && is_array( $contract['contactCta'] ) ? $contract['contactCta'] : array();

	$encode = static function ( $value ) {
		return wp_json_encode( $value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
	};

	$hero_attrs = $encode( $hero );
	$work_attrs = $encode(
		array(
			'title'                    => $work['title'] ?? '',
			'actionLabel'             => $work['actionLabel'] ?? '',
			'actionHref'              => $work['actionHref'] ?? '',
			'featuredRepoNames'       => $work['featuredRepoNames'] ?? array(),
			'loadingLabel'            => $work['loadingLabel'] ?? '',
			'sourceLiveLabel'         => $work['sourceLiveLabel'] ?? '',
			'sourceFallbackLabel'     => $work['sourceFallbackLabel'] ?? '',
			'emptyTitle'              => $work['emptyTitle'] ?? '',
			'emptyDescriptionLive'     => $work['emptyDescriptionLive'] ?? '',
			'emptyDescriptionFallback' => $work['emptyDescriptionFallback'] ?? '',
			'repoCount'               => 3,
		)
	);
	$through_attrs = $encode( $through );
	$resume_attrs  = $encode( $resume );
	$writing_attrs = $encode(
		array(
			'title'           => $writing['title'] ?? '',
			'actionLabel'    => $writing['actionLabel'] ?? '',
			'actionHref'     => $writing['actionHref'] ?? '',
			'emptyTitle'     => $writing['emptyTitle'] ?? '',
			'emptyDescription' => $writing['emptyDescription'] ?? '',
			'blogCount'      => 3,
		)
	);
	$contact_attrs = $encode( $contact );

	return sprintf(
		"<!-- wp:henrys-digital-canvas/home-page -->\n<!-- wp:henrys-digital-canvas/home-hero %s /-->\n\n<!-- wp:henrys-digital-canvas/home-selected-work %s /-->\n\n<!-- wp:henrys-digital-canvas/home-throughline %s /-->\n\n<!-- wp:henrys-digital-canvas/home-resume-snapshot %s /-->\n\n<!-- wp:henrys-digital-canvas/home-recent-writing %s /-->\n\n<!-- wp:henrys-digital-canvas/home-contact-cta %s /-->\n<!-- /wp:henrys-digital-canvas/home-page -->",
		$hero_attrs,
		$work_attrs,
		$through_attrs,
		$resume_attrs,
		$writing_attrs,
		$contact_attrs
	);
}
```

And then replace the `'home'` entry in `$page_configs`:

```php
array(
	'path'          => 'home',
	'title'         => 'Home',
	'content'       => hdc_build_home_page_block_markup(),
	'page_template' => 'page-no-title',
),
```

The parent block is dynamic — its post_content between the parent delimiters is just the children's serialized markers. The `<section>` wrapper is emitted at render time by `home-page/render.php`. Each child's `%s` slot gets the JSON-encoded attribute object (e.g., `{"eyebrow":"","title":"..."}`) which Gutenberg parses back into `$attributes` for that child's render.

- [ ] **Step 8: Run sync + cache flush**

```bash
cd /home/dev/wp-hperkins-com
wp --path=/home/ubuntu/wp-hperkins-com eval-file wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php
wp --path=/home/ubuntu/wp-hperkins-com cache flush
wp --path=/home/ubuntu/wp-hperkins-com rewrite flush
```

Expected: prints "Synced page home -> ID N", then "Configured front page -> ID N", then "Flushed rewrite rules.", then "Static page source sync complete." No error output.

If the project is on the `wp.hperkins.com` host, also purge cache-enabler from `wp-admin → Cache Enabler → Settings → Clear Cache Now`. If WP-CLI for cache-enabler is available: `wp --path=/home/ubuntu/wp-hperkins-com cache-enabler clear`.

- [ ] **Step 9: Visually verify**

```bash
curl -sS http://209.97.147.66/ | grep -oE 'wp-block-henrys-digital-canvas-home-(page|hero|selected-work|throughline|resume-snapshot|recent-writing|contact-cta)' | sort -u
```

Expected: prints exactly the 7 class names. If any are missing, the inner block markup is malformed or a render.php has an error.

- [ ] **Step 9a: Measure page-weight delta vs the monolith**

The monolith embeds a single `data-config` JSON blob with `initialPosts`, `initialRepos`, `initialResume`. After the split, three separate dynamic-section `data-config` payloads carry their own preloads. The net delta is usually small (de-duplication wasn't happening in the monolith either) but should be measured and noted in the commit message. **Capture this on the previous commit (HEAD~1) before running this task, then re-measure after Step 9:**

```bash
# Before — checkout the previous commit (or stash this task's changes) and capture:
curl -sS --compressed -o /tmp/home-before.html http://209.97.147.66/
stat -c '%s' /tmp/home-before.html
gzip -c /tmp/home-before.html | wc -c

# After — at HEAD with cutover applied:
curl -sS --compressed -o /tmp/home-after.html http://209.97.147.66/
stat -c '%s' /tmp/home-after.html
gzip -c /tmp/home-after.html | wc -c

# Diff and document
python3 -c "
import os
b_raw  = os.path.getsize('/tmp/home-before.html')
a_raw  = os.path.getsize('/tmp/home-after.html')
import subprocess
b_gz = int(subprocess.check_output('gzip -c /tmp/home-before.html | wc -c', shell=True))
a_gz = int(subprocess.check_output('gzip -c /tmp/home-after.html | wc -c', shell=True))
print(f'raw:  {b_raw}  -> {a_raw}  ({(a_raw-b_raw)/b_raw*100:+.1f}%)')
print(f'gzip: {b_gz}  -> {a_gz}  ({(a_gz-b_gz)/b_gz*100:+.1f}%)')
"
```

Add the raw and gzipped before/after numbers to the cutover commit message (Step 11). Expected change is in the ±5% range; anything beyond ±15% gzipped warrants investigation — likely a duplicated preload that should be hoisted to the shared shell instead of per-section.

- [ ] **Step 10: Run smoke**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=http://209.97.147.66 RUN_HOME_PARITY=1 npm run smoke:full
```

Expected: PASS. If `home-parity.spec.cjs` flags a property mismatch, iterate on the offending child's `render.php`/`style.css`.

- [ ] **Step 11: Commit (single cutover commit)**

```bash
cd /home/dev/wp-hperkins-com
git add wp-content/themes/henrys-digital-canvas/blocks/home-page \
        wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php
git rm wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js \
       wp-content/themes/henrys-digital-canvas/blocks/home-page/view.asset.php
git commit -m "feat(home-page): cut over to innerBlocks parent + 6 children

The home-page block is now a thin wrapper that mounts six child blocks
(hero, selected-work, throughline, resume-snapshot, recent-writing,
contact-cta). All section content is now exposed as block attributes
with native Inspector controls and supports. The monolithic view.js is
deleted; dynamic logic moved to per-child view scripts.

Page-weight delta on /:
- raw HTML:  <BEFORE> -> <AFTER>  (<PCT>%)
- gzipped:   <BEFORE> -> <AFTER>  (<PCT>%)

(Captured in Step 9a; substitute real numbers before committing.)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 15: Extend `api_smoke.sh` with REST shape check

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/api_smoke.sh`

- [ ] **Step 1: Read the current script to find where REST assertions live**

```bash
grep -nE "rest_url|wp-json|content\.raw|jq" /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/scripts/api_smoke.sh | head -10
```

If the script uses `jq` and `curl` patterns, add this block at the end (before the final pass print):

```bash
printf "REST shape check: front page innerBlocks tree (DB read via WP-CLI)\n"
FRONT_PAGE_ID="$(wp --path=/home/ubuntu/wp-hperkins-com option get page_on_front 2>/dev/null || echo 0)"
if [[ "${FRONT_PAGE_ID}" -eq 0 ]]; then
	printf "[FAIL] page_on_front is not set; cannot run innerBlocks shape check.\n" >&2
	exit 1
fi

# context=edit requires authentication; default path uses WP-CLI to grab the raw content directly.
CONTENT="$(wp --path=/home/ubuntu/wp-hperkins-com post get "${FRONT_PAGE_ID}" --field=post_content)"

EXPECTED_BLOCKS=(
	"wp:henrys-digital-canvas/home-page"
	"wp:henrys-digital-canvas/home-hero"
	"wp:henrys-digital-canvas/home-selected-work"
	"wp:henrys-digital-canvas/home-throughline"
	"wp:henrys-digital-canvas/home-resume-snapshot"
	"wp:henrys-digital-canvas/home-recent-writing"
	"wp:henrys-digital-canvas/home-contact-cta"
)

for block in "${EXPECTED_BLOCKS[@]}"; do
	if ! printf '%s' "${CONTENT}" | grep -q "${block}"; then
		printf "[FAIL] front page post_content is missing block %s\n" "${block}" >&2
		exit 1
	fi
done

printf "REST shape check (DB): all 7 home-page blocks present in post_content.\n"

# Optional authenticated REST assertion — verifies the *actual* AI read surface,
# not just the database row. Gated by RUN_REST_SHAPE_CHECK_AUTHENTICATED so the
# default smoke can run without secrets. Requires:
#   - WP_REST_USER, WP_REST_APP_PASSWORD env vars (an Application Password
#     created in wp-admin → Users → Profile → Application Passwords).
#   - The user account must have edit_posts capability on the front page.
if [[ "${RUN_REST_SHAPE_CHECK_AUTHENTICATED:-0}" == "1" ]]; then
	if [[ -z "${WP_REST_USER:-}" || -z "${WP_REST_APP_PASSWORD:-}" ]]; then
		printf "[FAIL] RUN_REST_SHAPE_CHECK_AUTHENTICATED=1 but WP_REST_USER / WP_REST_APP_PASSWORD not set.\n" >&2
		exit 1
	fi

	REST_BASE="${BASE_URL:-http://209.97.147.66}"
	REST_URL="${REST_BASE}/wp-json/wp/v2/pages/${FRONT_PAGE_ID}?context=edit"

	REST_BODY="$(
		curl -sS --fail \
			--user "${WP_REST_USER}:${WP_REST_APP_PASSWORD}" \
			"${REST_URL}"
	)" || {
		printf "[FAIL] REST fetch failed: %s\n" "${REST_URL}" >&2
		exit 1
	}

	# content.raw is what wp.blocks.parse() / parse_blocks() consume.
	REST_RAW="$(printf '%s' "${REST_BODY}" | jq -r '.content.raw // empty')"
	if [[ -z "${REST_RAW}" ]]; then
		printf "[FAIL] REST response has no content.raw (may be missing context=edit permission).\n" >&2
		exit 1
	fi

	for block in "${EXPECTED_BLOCKS[@]}"; do
		if ! printf '%s' "${REST_RAW}" | grep -q "${block}"; then
			printf "[FAIL] REST content.raw is missing block %s\n" "${block}" >&2
			exit 1
		fi
	done

	printf "REST shape check (authenticated): all 7 home-page blocks present in content.raw.\n"
fi
```

The default WP-CLI path validates "the DB row has the right blocks." The optional `RUN_REST_SHAPE_CHECK_AUTHENTICATED=1` path validates "an AI consumer calling the documented `GET /wp/v2/pages/{id}?context=edit` endpoint sees the same tree" — which is the contract the design spec actually promises. Add a section to the theme's README noting the env vars when production-ready.

- [ ] **Step 2: Run**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=http://209.97.147.66 npm run smoke:api
```

Expected: prints "REST shape check: all 7 home-page blocks present in post_content."

- [ ] **Step 3: Commit**

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/scripts/api_smoke.sh
git -C /home/dev/wp-hperkins-com commit -m "test(home-page): add REST shape check for innerBlocks tree

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 16: Update `browser-smoke.spec.cjs` selectors (additive — most class names preserved)

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`

- [ ] **Step 1: Read the home-related assertions**

```bash
grep -nE "hdc-home-page|hdc-feed-section|Recent Writing" /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs
```

Line 92 has `{ path: '/', selector: '.hdc-home-page', status: 200 }` — still valid (wrapper class preserved).

Line 293 has `recentWritingSection = page.locator('.hdc-feed-section').filter({ hasText: 'Recent Writing' }).first();` — confirm that `.hdc-feed-section` is still emitted by the new `home-recent-writing` render.php. **If it isn't**, either:
- (a) Add `hdc-feed-section` to the wrapper class string in `home-recent-writing/render.php`, OR
- (b) Update this selector to use the new class (e.g., `.wp-block-henrys-digital-canvas-home-recent-writing`).

Choose option (a) for maximum compatibility — preserve class names where the monolith uses them.

- [ ] **Step 2: Re-run browser smoke**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=http://209.97.147.66 npm run smoke:browser
```

Expected: PASS.

- [ ] **Step 3: Commit** (only if any edit was needed)

```bash
git -C /home/dev/wp-hperkins-com add wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs wp-content/themes/henrys-digital-canvas/blocks/home-recent-writing
git -C /home/dev/wp-hperkins-com commit -m "test(home-page): preserve .hdc-feed-section class in home-recent-writing for smoke compatibility

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 17: Manual editor smoke (verification gate)

This task is human-mediated — the executor (or you, after subagent execution) must open the WP admin block editor and verify the editor experience.

**Files:** none.

- [ ] **Step 1: Open the front page in the block editor**

`http://209.97.147.66/wp-admin/post.php?post=<FRONT_PAGE_ID>&action=edit`

- [ ] **Step 2: Verify**

- Parent `Home Page` block is visible.
- All 6 children appear inside in this order: Hero, Selected Work, Throughline, Resume Snapshot, Recent Writing, Contact CTA.
- Children cannot be removed, reordered, or duplicated (`templateLock: 'all'`).
- Selecting each child opens an Inspector with the expected content panels AND a Styles tab with the WordPress core Color/Spacing/Border/Typography/Dimensions controls.
- Editing a title in a child saves and reflects on the frontend (refresh `/`).

- [ ] **Step 3: Confirm via `wp post get`**

```bash
wp --path=/home/ubuntu/wp-hperkins-com post get $(wp --path=/home/ubuntu/wp-hperkins-com option get page_on_front) --field=post_content | head -20
```

Expected: shows the 7 nested `<!-- wp:henrys-digital-canvas/* -->` markers with JSON attribute payloads on each child line.

---

## Task 18: Manual frontend visual smoke at three breakpoints

**Files:** none.

- [ ] **Step 1: Open `http://209.97.147.66/` and `https://hperkins.com/` side-by-side**

- [ ] **Step 2: Compare at 1280px, 768px, 375px viewports**

Walk down the page section-by-section. Check spacing, font-size, color, background, border, hover states. Flag any drift; iterate on the offending child's `render.php`/`style.css`.

- [ ] **Step 3: Confirm no console errors on the target**

Open DevTools console. The page should be free of JS errors.

- [ ] **Step 4: Confirm the dynamic sections hydrate**

- Selected Work: shows 3 repo cards (or the empty state if the API is down).
- Resume Snapshot: shows the snapshot card (or fallback).
- Recent Writing: shows 3 post cards (or the empty state).

---

## Task 19: Final smoke + cache flush + close out

**Files:** none.

- [ ] **Step 1: Run the full smoke suite**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=http://209.97.147.66 RUN_HOME_PARITY=1 npm run smoke:full
```

Expected: PASS end-to-end. If anything fails, do not proceed.

- [ ] **Step 2: Flush WP caches**

```bash
wp --path=/home/ubuntu/wp-hperkins-com cache flush
wp --path=/home/ubuntu/wp-hperkins-com rewrite flush
```

Then purge cache-enabler from admin (or via WP-CLI if available).

- [ ] **Step 3: Update smoke history**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
npm run smoke:cadence
```

This appends a row to `ops/smoke-history.log`.

- [ ] **Step 4: Final commit (if anything was tweaked above)** — otherwise skip.

---

## Acceptance Criteria

A merge of this branch into `main` passes only when ALL are green:

1. `npm run smoke:full` (route + api + browser + parity + no-important) passes with `RUN_HOME_PARITY=1`.
2. WP-CLI confirms `page_on_front` is set and `post_content` contains all 7 home-page blocks.
3. `no_important_audit.sh` is clean.
4. `scripts/stylebook_audit.sh` does not regress (no new parent-token leakage).
5. Manual editor UI smoke passes (Task 17).
6. Manual frontend visual smoke passes at 1280/768/375px (Task 18).
7. Browser console is clean on `/`.
8. Scroll-reveal animations fire on `/`: after scrolling past each section, the section's root `.hdc-reveal` element has gained the `.is-visible` class. Spot-check via DevTools (`document.querySelectorAll('.hdc-reveal.is-visible').length`) or extend `home-parity.spec.cjs` with an `await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')` step followed by a wait for `.is-visible` to be present on each section root.

## Out of Scope

Listed for the executor so they don't expand scope:

- Per-attribute reset-to-default buttons in Inspector.
- An admin action to re-seed from JSON without WP-CLI.
- Reordering or removing sections (`templateLock: 'all'`).
- Schema deprecations (no old shape to support).
- JSX conversion of child blocks (stays on `wp.element.createElement`).
- Auto-sync of `block.json` defaults from `data/home-content.json`.
- Extending this pattern to `about-timeline`, `contact-form`, etc. — separate plans.
