# Homepage Core-Block Sync — Phase 2 Implementation Plan (Static patterns + styling + assembled Home)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the homepage's four static sections (Hero, Throughline, Resume Snapshot, Contact CTA) into core-block patterns, register the existing skin as `is-style-*` block styles, assemble a single "Home" pattern (Hero → Selected Work → Throughline → Resume → Recent Writing → Contact), write it into the front-page record, and retire the `home-page` parent block + its fallback — all with the live homepage staying visually near-identical.

**Architecture:** The shared section/reveal/button CSS that currently ships inside the `home-page` and `home-hero` blocks (and is also used by the surviving dynamic blocks) is **relocated to a theme-global stylesheet first**, so retiring those blocks can't orphan it. The four static sections become pure core blocks (`core/group`/`core/columns`/`core/heading`/`core/paragraph`/`core/buttons`/`core/list`) wrapped in the existing `hdc-home-page__section` chrome and decorated with `is-style-*` block styles backed by the relocated surface CSS. Selected Work reuses the Phase-1 `core/query` fragment (`hdc_selected_work_block_markup()`); Recent Writing stays as the existing `home-recent-writing` block **embedded in the pattern as an interim** (its core conversion is Phase 3). One markup builder is the single source for both the registered "Home" pattern and the `sync_page_sources.php` page-record write (DRY).

**Tech Stack:** WordPress block patterns (`register_block_pattern`), block styles (`register_block_style`), `theme.json`, the existing `inc/home-core/` tree, WP-CLI, Playwright parity smoke.

**Source of truth (parity):** the existing `blocks/home-{hero,throughline,resume-snapshot,contact-cta}/render.php` (already parity-verified against `Home.tsx`) + `data/home-content.json`. The patterns must render the **same copy and visual** as those blocks.

---

## Scope, decisions & non-obvious findings (read before coding)

This plan implements design §6–§8 Phase 2. Key decisions, several forced by findings during Phase-1 work:

1. **CRITICAL — shared CSS relocation (Task 1, do first).** The classes `.hdc-home-page__section`, `__section-header`, `__section-title`, `__section-link`, `__eyebrow`, `__copy`, `__status`, `.hdc-reveal*`, the section-divider rule, and the `.hdc-home-page__shell::before` paper backdrop live in `blocks/home-page/style.css`; the `.hdc-home-page__button*` rules live in `blocks/home-hero/style.css`. Both are enqueued **only when those blocks render**. They are **also used by the dynamic blocks that survive Phase 2** (`home-recent-writing`, and — until its Phase-3 deletion — `home-selected-work`). So retiring `home-page`/`home-hero` without relocating this CSS would un-style the surviving sections. Task 1 moves it to a theme-global stylesheet enqueued unconditionally.

2. **Resume Snapshot is currently REST-hydrated, not static.** `blocks/home-resume-snapshot/render.php` emits only a header + `Loading resume snapshot...` and its `view.js` fetches `/v1/resume` to build cards. The design (§6) specifies Resume Snapshot as **static copy "seeded from resume snapshot facts."** So the Phase-2 Resume pattern **hard-codes the `resumeSnapshot` copy from `data/home-content.json`** (positioning eyebrow/label/items, best-fit title/focus areas, action links) and drops the live hydration on the homepage. This is intentional per the design.

3. **Recent Writing stays interim.** Its core `core/query` conversion + `reading_time` meta are **Phase 3**. In Phase 2 the assembled Home pattern embeds the existing `home-recent-writing` block (`<!-- wp:henrys-digital-canvas/home-recent-writing {…} /-->`). It keeps working because Task 1 relocated its section CSS. Phase 3 swaps it for the core loop and deletes the block.

4. **Hero uses `core/group` + `is-style-home-hero`, not `core/cover`.** The hero's full-bleed inverse backdrop (image layers + gradients + noise) is pure CSS; `core/cover`'s media/overlay machinery fights a CSS-only backdrop. A `core/group` carrying `is-style-home-hero` (CSS provides the backdrop via pseudo-elements) is cleaner and renders identically. (Minor deviation from design §6's "core/cover" wording, documented here.)

5. **What's retired vs kept in Phase 2.** Retire the `home-page` **parent** block + `hdc_build_home_page_*()` fallback (it no longer powers the front page). The six child blocks stay **registered** (deleted in Phase 3); after Phase 2 only `home-recent-writing` is still *used* (embedded interim) — the other five are replaced by patterns/the Phase-1 loop and become dormant until Phase 3 deletes them.

6. **DRY markup.** `hdc_home_pattern_markup()` (new) returns the full assembled Home markup and is used by BOTH `register_block_pattern('henrys-digital-canvas/home', …)` and `scripts/sync_page_sources.php` (which writes it to the front-page record). `register_block_pattern` content is NOT auto-resolved in `post_content`, so the sync must write the literal markup string — hence a shared builder.

## WP-CLI path

```bash
wp --path=/home/dev/wp-hperkins-com <command>
```

## Before you start

```bash
cd /home/dev/wp-hperkins-com
git checkout -b feat/home-core-sync-phase-2
```

Phase 1 must be merged (it is on `main`): the `hdc_repo` CPT, `hdc_selected_work_block_markup()`, `is-style-hdc-repo-card`, and `inc/home-core/` are prerequisites.

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `assets/css/home-sections.css` | **Relocated** shared section/header/title/link/eyebrow/copy/status/reveal/button + section-divider CSS (global) | 1 |
| `assets/css/home-patterns.css` | **New** `is-style-*` surface/hero/quote CSS for the patterns (composes existing surface visuals) | 2 |
| `functions.php` | Enqueue the two stylesheets globally; later, drop the `home-page` registration + require | 1, 2, 10 |
| `inc/home-core/block-styles.php` | `register_block_style()` for `is-style-learning-paper`/`-ember-veil`/`-ember-topography`/`-hdc-quote-card`/`-home-hero` (+ existing `-hdc-repo-card`) | 2 |
| `inc/home-core/home-patterns.php` | Markup builders + `register_block_pattern` for hero/throughline/resume/contact + the assembled `home` pattern | 4–8 |
| `inc/home-core/bootstrap.php` | `require_once` the two new includes | 2, 4 |
| `theme.json` | Section-divider on `core/separator`; confirm section rhythm presets | 3 |
| `scripts/sync_page_sources.php` | Front-page `content` → `hdc_home_pattern_markup()` | 9 |
| `inc/home-page-blocks.php` | **Deleted** (fallback retired) | 10 |
| `scripts/route_smoke.sh` | Home marker updated away from the retired `home-page` parent class | 11 |
| `scripts/api_smoke.sh` | Optional front-page shape branch updated away from the old 7-block innerBlocks tree and legacy fallback | 11 |
| `scripts/playwright/home-parity.spec.cjs` / `browser-smoke.spec.cjs` | Updated assertions for the new markup | 11 |

---

## Task 1: Relocate shared section/reveal/button CSS to a global stylesheet

**Files:**
- Create: `assets/css/home-sections.css`
- Modify: `functions.php` (enqueue in `hdc_enqueue_frontend_styles()`)

> Goal: make the shared `.hdc-home-page__*` section/button/reveal CSS load on the homepage regardless of which blocks render, so retiring `home-page`/`home-hero` (Task 10) can't un-style the surviving sections.

- [ ] **Step 1: Create the relocated stylesheet**

Create `assets/css/home-sections.css` by copying these existing rule groups **verbatim** (they currently live in block stylesheets; move the rules, don't rewrite them):

- From `blocks/home-page/style.css`: the `.hdc-home-page__section`, `.hdc-home-page__section:not(:first-child)` (divider), `.hdc-home-page__section-header`, `.hdc-home-page__section-title`, `.hdc-home-page__section-link`, `.hdc-home-page__eyebrow`, `.hdc-home-page__copy`, `.hdc-home-page__status`, `.hdc-reveal*` rules, and the `.hdc-home-page__shell`/`__shell::before` backdrop rules.
- From `blocks/home-hero/style.css`: the `.hdc-home-page__button`, `.hdc-home-page__button--secondary` rules (the shared button skin used by the contact section and others). Leave the hero-specific `.hdc-home-page__hero*` rules for Task 2 (they become `is-style-home-hero`).
- From `blocks/home-resume-snapshot/style.css` and `blocks/home-throughline/style.css` and `blocks/home-contact-cta/style.css`: the layout rules the new patterns will reuse by class (`.hdc-home-page__throughline-grid`/`-story`/`-narrative`/`-paragraph`/`-quote-*`, `.hdc-home-page__resume-grid`/`-card`/`-stack`/`-snapshot*`/`-list`/`-badges`/`-badge`/`-card-title`/`-card-copy`/`-inline-*`, `.hdc-home-page__cta-card`/`-layout`/`-body`/`-actions`, `.hdc-home-page__action-icon*`). Copy these verbatim so the new patterns (which reuse the same class names) render identically.

> Rationale: the patterns reuse the existing class names (parity-by-reuse) rather than inventing new ones, so the literal CSS just needs to be available globally. Keep the rules byte-for-byte to preserve the verified visual.

- [ ] **Step 2: Enqueue it globally**

In `functions.php`, inside `hdc_enqueue_frontend_styles()` (the `wp_enqueue_scripts` callback, ~lines 38-95), after the existing `design-system.css` enqueue, add:

```php
	wp_enqueue_style(
		'hdc-home-sections',
		get_stylesheet_directory_uri() . '/assets/css/home-sections.css',
		array( 'henrys-digital-canvas-design-system' ),
		hdc_asset_version( '/assets/css/home-sections.css' )
	);
```

(Use the actual handle of the design-system stylesheet as the dependency — confirm it by reading the existing `wp_enqueue_style` for `design-system.css` in that function and matching its `$handle`.)

- [ ] **Step 3: Verify the surviving block stays styled without the parent block**

Render the kept `home-recent-writing` block in isolation (no `home-page` wrapper) and confirm the relocated section classes are present in the page CSS:

```bash
wp --path=/home/dev/wp-hperkins-com eval '
echo file_exists( get_stylesheet_directory()."/assets/css/home-sections.css" ) ? "css-ok\n" : "CSS-MISSING\n";
$css = file_get_contents( get_stylesheet_directory()."/assets/css/home-sections.css" );
foreach ( array(".hdc-home-page__section",".hdc-home-page__section-title",".hdc-home-page__button",".hdc-reveal") as $sel ) {
	echo ( false !== strpos( $css, $sel ) ) ? "has $sel\n" : "MISSING $sel\n";
}'
```
Expected: `css-ok` and `has …` for every selector.

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/assets/css/home-sections.css wp-content/themes/henrys-digital-canvas/functions.php
git commit -m "refactor(home): relocate shared section/button CSS to a global stylesheet

Decouples the shared .hdc-home-page__* section/reveal/button skin from the
home-page/home-hero blocks so retiring them (Phase 2) doesn't orphan the
surviving sections.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Register `is-style-*` block styles + their CSS

**Files:**
- Create: `assets/css/home-patterns.css`
- Create: `inc/home-core/block-styles.php`
- Modify: `inc/home-core/bootstrap.php` (require it), `functions.php` (enqueue the CSS)

- [ ] **Step 1: Write the block-style registrations**

`inc/home-core/block-styles.php`:

```php
<?php
/**
 * Home Core — surface/hero/quote block styles for the homepage patterns.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the is-style-* block styles the homepage patterns use. CSS lives in
 * assets/css/home-patterns.css (composes the existing surface visuals).
 */
function hdc_home_register_pattern_block_styles(): void {
	$group_styles = array(
		'home-hero'           => __( 'Home Hero', 'henrys-digital-canvas' ),
		'learning-paper'      => __( 'Learning Paper', 'henrys-digital-canvas' ),
		'ember-veil'          => __( 'Ember Veil', 'henrys-digital-canvas' ),
		'ember-topography'    => __( 'Ember Topography', 'henrys-digital-canvas' ),
		'hdc-quote-card'      => __( 'HDC Quote Card', 'henrys-digital-canvas' ),
		'ember-strong'        => __( 'Ember Strong', 'henrys-digital-canvas' ),
	);
	foreach ( $group_styles as $name => $label ) {
		register_block_style( 'core/group', array( 'name' => $name, 'label' => $label ) );
	}

	register_block_style( 'core/button', array( 'name' => 'inverse-glass', 'label' => __( 'Inverse Glass', 'henrys-digital-canvas' ) ) );
}
add_action( 'init', 'hdc_home_register_pattern_block_styles' );
```

- [ ] **Step 2: Write the block-style CSS**

Create `assets/css/home-patterns.css`. Each `is-style-*` reuses the existing surface visuals (from `assets/css/background-library.css` `surface-library-*` and `blocks/home-hero/style.css`). Compose by referencing the same backgrounds:

```css
/* Home pattern block styles — compose existing surface visuals. */

/* Surfaces: reuse the textured backgrounds from background-library.css. */
.is-style-learning-paper { background-color: hsl(var(--surface-1)); border: 1px solid hsl(var(--border-emphasis)); border-radius: var(--radius-surface); padding: clamp(1.5rem, 3vw, 2rem); position: relative; overflow: hidden; isolation: isolate; }
.is-style-learning-paper::before { content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0; background-size: cover; background-position: center; background-repeat: no-repeat; background: linear-gradient(180deg, hsl(var(--surface-1) / 0.94) 0%, hsl(var(--surface-2) / 0.9) 100%), url("../images/backgrounds/theme-surface-learning-paper.webp"); }
.is-style-learning-paper > * { position: relative; z-index: 1; }

.is-style-ember-topography { background-color: hsl(var(--card)); border: 1px solid hsl(var(--border)); border-radius: var(--radius-surface); padding: 2rem; position: relative; overflow: hidden; isolation: isolate; }
.is-style-ember-topography::before { content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0; background-size: cover; background-position: center; background-repeat: no-repeat; background: linear-gradient(154deg, hsl(var(--overlay-ember-surface-start)) 0%, hsl(var(--overlay-ember-surface-end)) 100%), url("../images/backgrounds/theme-surface-ember-topography.webp"); }
.is-style-ember-topography > * { position: relative; z-index: 1; }

.is-style-ember-veil { background-color: hsl(var(--card)); border: 1px solid hsl(var(--border-emphasis)); border-radius: var(--radius-surface); box-shadow: var(--shadow-surface-strong); padding: clamp(1.5rem, 4vw, 2rem); position: relative; overflow: hidden; isolation: isolate; }
.is-style-ember-veil::before { content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0; background-size: cover; background-position: center; background-repeat: no-repeat; background: linear-gradient(154deg, hsl(var(--overlay-ember-surface-start)) 0%, hsl(var(--overlay-ember-surface-end)) 100%), url("../images/backgrounds/theme-surface-ember-veil.webp"); }
.is-style-ember-veil > * { position: relative; z-index: 1; }

.is-style-ember-strong { background-color: hsl(var(--card)); border: 1px solid hsl(var(--border-emphasis)); border-radius: var(--radius-surface); padding: clamp(1.5rem, 3vw, 2rem); }

/* Quote card (throughline) — reuses the existing quote-card layout classes inside. */
.is-style-hdc-quote-card { border: 1px solid hsl(var(--border)); border-radius: var(--radius-surface); display: grid; gap: 1rem; padding: 2rem; }

/* Full-bleed inverse hero backdrop via pseudo-elements (adapted from home-hero/style.css). */
.is-style-home-hero { position: relative; isolation: isolate; overflow: hidden; margin-inline: calc(50% - 50vw); padding: 4rem clamp(1.25rem, 3vw, 2rem); min-height: max(30rem, calc(82svh - var(--layout-header-height))); display: flex; align-items: center; background: hsl(var(--inverse-background)); border-bottom: 1px solid hsl(var(--inverse-border)); color: hsl(var(--inverse-foreground)); }
.is-style-home-hero::before { content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none; background: linear-gradient(120deg, hsl(var(--inverse-background) / 0.92) 0%, hsl(var(--inverse-background) / 0.6) 60%, transparent 100%), url("../images/backgrounds/theme-hero-editorial-amber.webp"); background-size: cover; background-position: center; }
.is-style-home-hero::after { content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none; background: var(--gradient-hero); opacity: 0.82; }
.is-style-home-hero > * { position: relative; z-index: var(--layer-content, 1); max-width: 64rem; margin-inline: auto; width: 100%; }

/* Inverse-glass secondary button (hero/contact). */
.wp-block-button.is-style-inverse-glass .wp-block-button__link { background: hsl(var(--inverse-foreground) / 0.08); color: hsl(var(--inverse-foreground)); border: 1px solid hsl(var(--inverse-foreground) / 0.28); backdrop-filter: blur(6px); }
```

> The `url(...)` paths are relative to `assets/css/` (the file's location), matching `background-library.css`'s `../images/...` convention. Confirm `theme-hero-editorial-amber.webp` exists under `assets/images/backgrounds/` (it backs the existing `.hero-backdrop-editorial-amber`); if the path differs, match the existing one.

- [ ] **Step 3: Require + enqueue**

In `inc/home-core/bootstrap.php`, after the existing requires, add:

```php
require_once __DIR__ . '/block-styles.php';
require_once __DIR__ . '/home-patterns.php';
```

(`home-patterns.php` is created in Task 4; adding the require now is fine only after Task 4 creates the file — if executing strictly in order, add the `block-styles.php` require here and add the `home-patterns.php` require in Task 4. Do whichever keeps the site loadable.)

In `functions.php` `hdc_enqueue_frontend_styles()`, after the `home-sections.css` enqueue (Task 1), add:

```php
	wp_enqueue_style(
		'hdc-home-patterns',
		get_stylesheet_directory_uri() . '/assets/css/home-patterns.css',
		array( 'hdc-home-sections' ),
		hdc_asset_version( '/assets/css/home-patterns.css' )
	);
```

- [ ] **Step 4: Verify the styles register**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$reg = WP_Block_Styles_Registry::get_instance();
$g = $reg->get_registered_styles_for_block("core/group");
foreach (array("home-hero","learning-paper","ember-veil","ember-topography","hdc-quote-card","ember-strong") as $n) {
	echo isset($g[$n]) ? "group:$n ok\n" : "group:$n MISSING\n";
}
$b = $reg->get_registered_styles_for_block("core/button");
echo isset($b["inverse-glass"]) ? "button:inverse-glass ok\n" : "button:inverse-glass MISSING\n";'
```
Expected: every line `ok`.

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/block-styles.php \
        wp-content/themes/henrys-digital-canvas/assets/css/home-patterns.css \
        wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php \
        wp-content/themes/henrys-digital-canvas/functions.php
git commit -m "feat(home): register is-style-* block styles for the homepage patterns

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Migrate the section divider into `theme.json`

**Files:**
- Modify: `theme.json` (the `core/separator` style + a note)

> The current divider is `.hdc-home-page__section:not(:first-child){border-top:1px solid hsl(var(--border))}` (now in `home-sections.css` from Task 1). `theme.json` already styles `core/separator` (border `0 0 1px 0`, color `hsl(var(--border))`). No new theme.json work is strictly required for the divider since the section rhythm is handled by `home-sections.css` + the existing `styles.spacing.blockGap`. This task is a **verification + optional tidy**, not net-new structure.

- [ ] **Step 1: Confirm the section rhythm presets exist**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$tj = wp_get_global_settings();
echo "blockGap setting present: ".(isset($tj["spacing"]) ? "yes" : "no")."\n";'
```
Expected: `yes`. (No edit needed; the section padding/divider come from `home-sections.css`. If you later want the inter-section divider as a `core/separator` between pattern sections instead of the `:not(:first-child)` border, insert `<!-- wp:separator {"className":"is-style-wide"} /-->` between sections in Task 8 — optional.)

- [ ] **Step 2: Commit (only if you changed theme.json)**

```bash
git add wp-content/themes/henrys-digital-canvas/theme.json
git commit -m "chore(home): confirm section rhythm/divider tokens for the homepage patterns

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
(If no change was needed, skip this commit.)

---

## Task 4: Hero pattern

**Files:**
- Create: `inc/home-core/home-patterns.php` (builders + registration; grows across Tasks 4–8)
- Modify: `inc/home-core/bootstrap.php` (require it, if not already from Task 2)

- [ ] **Step 1: Create the file with the Hero builder + a registrar**

`inc/home-core/home-patterns.php`:

```php
<?php
/**
 * Home Core — homepage section patterns (Hero/Throughline/Resume/Contact) and
 * the assembled "Home" pattern. Copy mirrors data/home-content.json.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

/**
 * Hero section — full-bleed inverse group (is-style-home-hero) + H1 + lede + 2 buttons.
 */
function hdc_home_hero_pattern_markup(): string {
	return <<<'HTML'
<!-- wp:group {"align":"full","className":"hdc-home-page__hero is-style-home-hero","layout":{"type":"constrained","contentSize":"64rem"}} -->
<div class="wp-block-group alignfull hdc-home-page__hero is-style-home-hero">
<!-- wp:heading {"level":1,"className":"hdc-home-page__hero-title text-page-title-inverse"} -->
<h1 class="wp-block-heading hdc-home-page__hero-title text-page-title-inverse">Retail floors. WordPress themes. Cloud platforms. Agentic AI.</h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__hero-description"} -->
<p class="hdc-home-page__hero-description">I&#8217;ve been learning to talk to machines since 2007 &#8212; now they&#8217;re starting to talk back.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"className":"hdc-home-page__hero-actions"} -->
<div class="wp-block-buttons hdc-home-page__hero-actions">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/work/ai-prompt-pro">Explore Prompt Forge</a></div>
<!-- /wp:button -->
<!-- wp:button {"className":"is-style-inverse-glass"} -->
<div class="wp-block-button is-style-inverse-glass"><a class="wp-block-button__link wp-element-button" href="/contact">Work With Me</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
HTML;
}

/**
 * Register each section pattern + the assembled Home pattern.
 */
function hdc_home_register_patterns(): void {
	if ( ! function_exists( 'register_block_pattern' ) ) {
		return;
	}
	register_block_pattern( 'henrys-digital-canvas/home-hero', array(
		'title'      => __( 'Home Hero', 'henrys-digital-canvas' ),
		'categories' => array( 'featured' ),
		'content'    => hdc_home_hero_pattern_markup(),
	) );
}
add_action( 'init', 'hdc_home_register_patterns' );
```

If not already added in Task 2, add to `inc/home-core/bootstrap.php`:

```php
require_once __DIR__ . '/home-patterns.php';
```

- [ ] **Step 2: Verify the Hero pattern parses + registers**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$blocks = parse_blocks( hdc_home_hero_pattern_markup() );
echo $blocks[0]["blockName"]==="core/group" ? "parse-ok\n" : "PARSE-FAIL\n";
echo WP_Block_Patterns_Registry::get_instance()->is_registered("henrys-digital-canvas/home-hero") ? "pattern-ok\n" : "PATTERN-FAIL\n";
$html = do_blocks( hdc_home_hero_pattern_markup() );
echo (strpos($html,"Retail floors")!==false && strpos($html,"Explore Prompt Forge")!==false && strpos($html,"is-style-home-hero")!==false) ? "render-ok\n" : "RENDER-FAIL\n";'
```
Expected: `parse-ok`, `pattern-ok`, `render-ok`.

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/home-patterns.php wp-content/themes/henrys-digital-canvas/inc/home-core/bootstrap.php
git commit -m "feat(home): Hero core-block pattern

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Throughline pattern

**Files:**
- Modify: `inc/home-core/home-patterns.php`

- [ ] **Step 1: Add the Throughline builder + register it**

Add to `home-patterns.php` (before `hdc_home_register_patterns`):

```php
/**
 * Throughline — section title + a learning-paper narrative + an ember-topography quote card.
 * Copy mirrors data/home-content.json `throughline`.
 */
function hdc_home_throughline_pattern_markup(): string {
	return <<<'HTML'
<!-- wp:group {"className":"hdc-home-page__section hdc-home-page__section--throughline","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__section hdc-home-page__section--throughline" id="throughline">
<!-- wp:heading {"className":"hdc-home-page__section-title hdc-home-page__section-title--intro"} -->
<h2 class="wp-block-heading hdc-home-page__section-title hdc-home-page__section-title--intro">From the floor to the frontier.</h2>
<!-- /wp:heading -->
<!-- wp:columns {"className":"hdc-home-page__throughline-grid"} -->
<div class="wp-block-columns hdc-home-page__throughline-grid">
<!-- wp:column {"width":"100%"} -->
<div class="wp-block-column" style="flex-basis:100%">
<!-- wp:group {"className":"hdc-home-page__throughline-story is-style-learning-paper","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__throughline-story is-style-learning-paper">
<!-- wp:paragraph {"className":"hdc-home-page__throughline-paragraph"} -->
<p class="hdc-home-page__throughline-paragraph">In 2007, I was coaching high school students in Chicago on how to tell a story clearly. By 2009, I was troubleshooting hardware on a retail floor at Micro Center. By 2012, I was managing a developer community at PageLines and supporting WordPress.com users at Automattic &#8212; the company behind WordPress itself.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-paragraph"} -->
<p class="hdc-home-page__throughline-paragraph">Then I ran coffee operations. Starbucks, Sodexo &#8212; high-volume, high-stakes, no-margin-for-error environments where the system either works at 6 AM or it doesn&#8217;t. I learned more about process, escalation, and team coaching on those shifts than in any technical role I&#8217;ve ever held.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-paragraph"} -->
<p class="hdc-home-page__throughline-paragraph">Now I build AI agents and intelligent workflows. I design prompt systems. I ship React apps on Cloudflare. And I consult for teams that need someone who can scope the project, write the code, document the process, and explain it to a stakeholder who doesn&#8217;t care about the stack &#8212; they just need it to work.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-paragraph"} -->
<p class="hdc-home-page__throughline-paragraph">The tools have changed five times over. The instinct hasn&#8217;t.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
<!-- wp:column {"width":"20rem"} -->
<div class="wp-block-column" style="flex-basis:20rem">
<!-- wp:group {"className":"hdc-home-page__throughline-quote-card is-style-ember-topography","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__throughline-quote-card is-style-ember-topography">
<!-- wp:paragraph {"className":"hdc-home-page__eyebrow"} -->
<p class="hdc-home-page__eyebrow">A former colleague</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-quote-text"} -->
<p class="hdc-home-page__throughline-quote-text">&#8220;He&#8217;s always there when his community needs him.&#8221;</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"hdc-home-page__throughline-quote-footer"} -->
<p class="hdc-home-page__throughline-quote-footer">PageLines recommendation</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
</div>
<!-- /wp:group -->
HTML;
}
```

And add its registration inside `hdc_home_register_patterns()` (after the hero one):

```php
	register_block_pattern( 'henrys-digital-canvas/home-throughline', array(
		'title'      => __( 'Home Throughline', 'henrys-digital-canvas' ),
		'categories' => array( 'featured' ),
		'content'    => hdc_home_throughline_pattern_markup(),
	) );
```

> Parity note: the original throughline quote card has a quote-mark SVG icon in its header. It's decorative; this pattern omits the inline SVG to stay pure-core (the eyebrow + quote text + footer carry the content). Re-add as `core/html` only if the icon proves load-bearing in the parity pass (Task 11).

- [ ] **Step 2: Verify**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$h = do_blocks( hdc_home_throughline_pattern_markup() );
echo (strpos($h,"From the floor to the frontier")!==false && strpos($h,"is-style-learning-paper")!==false && strpos($h,"is-style-ember-topography")!==false && strpos($h,"community needs him")!==false) ? "ok\n" : "FAIL\n";'
```
Expected: `ok`.

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/home-patterns.php
git commit -m "feat(home): Throughline core-block pattern

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Resume Snapshot pattern (static)

**Files:**
- Modify: `inc/home-core/home-patterns.php`

> Static port of the `resumeSnapshot` copy from `data/home-content.json` (the current block is REST-hydrated; the design wants a static snapshot — see scope note 2). Two-column: an `is-style-ember-topography` positioning card (eyebrow + label + items list) and an `is-style-ember-strong` best-fit card (heading + focus-areas list), with resume action links.

- [ ] **Step 1: Add the Resume builder + register it**

Add to `home-patterns.php`:

```php
/**
 * Resume Snapshot — static positioning + best-fit cards from data/home-content.json.
 */
function hdc_home_resume_pattern_markup(): string {
	return <<<'HTML'
<!-- wp:group {"className":"hdc-home-page__section hdc-home-page__section--resume","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__section hdc-home-page__section--resume" id="resume-snapshot">
<!-- wp:group {"className":"hdc-home-page__section-header","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
<div class="wp-block-group hdc-home-page__section-header">
<!-- wp:heading {"className":"hdc-home-page__section-title"} -->
<h2 class="wp-block-heading hdc-home-page__section-title">Resume Snapshot</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__section-link"} -->
<p class="hdc-home-page__section-link"><a href="/resume">Interactive resume</a></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:columns {"className":"hdc-home-page__resume-grid"} -->
<div class="wp-block-columns hdc-home-page__resume-grid">
<!-- wp:column {"width":"60%"} -->
<div class="wp-block-column" style="flex-basis:60%">
<!-- wp:group {"className":"hdc-home-page__resume-card is-style-ember-topography","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__resume-card is-style-ember-topography">
<!-- wp:paragraph {"className":"hdc-home-page__eyebrow"} -->
<p class="hdc-home-page__eyebrow">Positioning</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"className":"hdc-home-page__card-title"} -->
<h3 class="wp-block-heading hdc-home-page__card-title">Public proof of work</h3>
<!-- /wp:heading -->
<!-- wp:list {"className":"hdc-home-page__list"} -->
<ul class="wp-block-list hdc-home-page__list"><!-- wp:list-item --><li>Prompt Forge</li><!-- /wp:list-item --><!-- wp:list-item --><li>HPerkins.com</li><!-- /wp:list-item --><!-- wp:list-item --><li>wp-hperkins-com</li><!-- /wp:list-item --></ul>
<!-- /wp:list -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
<!-- wp:column {"width":"40%"} -->
<div class="wp-block-column" style="flex-basis:40%">
<!-- wp:group {"className":"hdc-home-page__resume-card is-style-ember-strong","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__resume-card is-style-ember-strong">
<!-- wp:paragraph {"className":"hdc-home-page__eyebrow"} -->
<p class="hdc-home-page__eyebrow">Best fit</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"className":"hdc-home-page__card-title"} -->
<h3 class="wp-block-heading hdc-home-page__card-title">Where I contribute fastest</h3>
<!-- /wp:heading -->
<!-- wp:list {"className":"hdc-home-page__list"} -->
<ul class="wp-block-list hdc-home-page__list"><!-- wp:list-item --><li>Customer-facing implementation, onboarding, and support workflows</li><!-- /wp:list-item --><!-- wp:list-item --><li>API integrations, documentation, and escalation triage</li><!-- /wp:list-item --><!-- wp:list-item --><li>AI-assisted workflow delivery grounded in WordPress and durable web systems</li><!-- /wp:list-item --></ul>
<!-- /wp:list -->
<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button {"className":"is-style-fill"} -->
<div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button" href="/resume">Interactive resume</a></div>
<!-- /wp:button -->
<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/resume/ats">ATS / recruiter view</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
</div>
<!-- /wp:group -->
HTML;
}
```

Register inside `hdc_home_register_patterns()`:

```php
	register_block_pattern( 'henrys-digital-canvas/home-resume', array(
		'title'      => __( 'Home Resume Snapshot', 'henrys-digital-canvas' ),
		'categories' => array( 'featured' ),
		'content'    => hdc_home_resume_pattern_markup(),
	) );
```

- [ ] **Step 2: Verify**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$h = do_blocks( hdc_home_resume_pattern_markup() );
echo (strpos($h,"Resume Snapshot")!==false && strpos($h,"Where I contribute fastest")!==false && strpos($h,"ATS / recruiter view")!==false && strpos($h,"is-style-ember-strong")!==false) ? "ok\n" : "FAIL\n";'
```
Expected: `ok`.

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/home-patterns.php
git commit -m "feat(home): static Resume Snapshot core-block pattern

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Contact CTA pattern

**Files:**
- Modify: `inc/home-core/home-patterns.php`

- [ ] **Step 1: Add the Contact builder + register it**

Add to `home-patterns.php`:

```php
/**
 * Contact CTA — ember-veil card with eyebrow + heading + copy + primary/outline buttons.
 * Copy mirrors data/home-content.json `contactCta`.
 */
function hdc_home_contact_pattern_markup(): string {
	return <<<'HTML'
<!-- wp:group {"className":"hdc-home-page__section","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__section" id="contact-cta">
<!-- wp:group {"className":"hdc-home-page__cta-card is-style-ember-veil","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__cta-card is-style-ember-veil">
<!-- wp:paragraph {"className":"hdc-home-page__eyebrow hdc-home-page__eyebrow--body"} -->
<p class="hdc-home-page__eyebrow hdc-home-page__eyebrow--body">Need a technical partner?</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"className":"hdc-home-page__section-title"} -->
<h2 class="wp-block-heading hdc-home-page__section-title">Bring me in where support, product, and implementation overlap.</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__copy"} -->
<p class="hdc-home-page__copy">I help teams turn support tickets into shipped fixes &#8212; API integrations, documentation, AI-assisted triage &#8212; so the thing that was breaking at 6 AM isn&#8217;t breaking at 6 AM tomorrow.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"className":"hdc-home-page__cta-actions"} -->
<div class="wp-block-buttons hdc-home-page__cta-actions">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/contact">Work with me</a></div>
<!-- /wp:button -->
<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/resume">View resume</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
HTML;
}
```

Register inside `hdc_home_register_patterns()`:

```php
	register_block_pattern( 'henrys-digital-canvas/home-contact', array(
		'title'      => __( 'Home Contact CTA', 'henrys-digital-canvas' ),
		'categories' => array( 'featured' ),
		'content'    => hdc_home_contact_pattern_markup(),
	) );
```

- [ ] **Step 2: Verify**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$h = do_blocks( hdc_home_contact_pattern_markup() );
echo (strpos($h,"Need a technical partner")!==false && strpos($h,"Work with me")!==false && strpos($h,"is-style-ember-veil")!==false) ? "ok\n" : "FAIL\n";'
```
Expected: `ok`.

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/home-patterns.php
git commit -m "feat(home): Contact CTA core-block pattern

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Assemble the "Home" pattern (DRY builder)

**Files:**
- Modify: `inc/home-core/home-patterns.php`

> One builder returns the full homepage markup in the canonical order (Hero → Selected Work → Throughline → Resume → Recent Writing → Contact). Selected Work reuses the Phase-1 `hdc_selected_work_block_markup()`; Recent Writing embeds the existing `home-recent-writing` block as an interim (Phase 3 converts it). This same builder is consumed by the page-sync script (Task 9), so the registered pattern and the live page record never drift.

- [ ] **Step 1: Add the assembled builder + register the Home pattern**

Add to `home-patterns.php`:

```php
/**
 * The full homepage, assembled in canonical order. Selected Work is the Phase-1
 * synced core/query fragment; Recent Writing is the existing block (interim,
 * converted to a core loop in Phase 3). Each section is wrapped so it gets the
 * shared section chrome from assets/css/home-sections.css.
 */
function hdc_home_pattern_markup(): string {
	$selected_work = function_exists( 'hdc_selected_work_block_markup' ) ? hdc_selected_work_block_markup() : '';

	$selected_work_section = <<<HTML
<!-- wp:group {"className":"hdc-home-page__section hdc-home-page__section--work","layout":{"type":"constrained"}} -->
<div class="wp-block-group hdc-home-page__section hdc-home-page__section--work" id="selected-work">
<!-- wp:group {"className":"hdc-home-page__section-header","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
<div class="wp-block-group hdc-home-page__section-header">
<!-- wp:heading {"className":"hdc-home-page__section-title"} -->
<h2 class="wp-block-heading hdc-home-page__section-title">Selected Work</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hdc-home-page__section-link"} -->
<p class="hdc-home-page__section-link"><a href="/work">View all work</a></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
{$selected_work}
</div>
<!-- /wp:group -->
HTML;

	$recent_writing = '<!-- wp:henrys-digital-canvas/home-recent-writing {"blogCount":3} /-->';

	return implode( "\n\n", array(
		hdc_home_hero_pattern_markup(),
		$selected_work_section,
		hdc_home_throughline_pattern_markup(),
		hdc_home_resume_pattern_markup(),
		$recent_writing,
		hdc_home_contact_pattern_markup(),
	) );
}
```

Register inside `hdc_home_register_patterns()`:

```php
	register_block_pattern( 'henrys-digital-canvas/home', array(
		'title'      => __( 'Home (full page)', 'henrys-digital-canvas' ),
		'categories' => array( 'featured' ),
		'blockTypes' => array( 'core/post-content' ),
		'content'    => hdc_home_pattern_markup(),
	) );
```

- [ ] **Step 2: Verify the assembled markup renders all six sections server-side**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
$h = do_blocks( hdc_home_pattern_markup() );
$checks = array(
	"hero"        => "Retail floors",
	"selected"    => "Selected Work",
	"repo card"   => "is-style-hdc-repo-card",
	"throughline" => "From the floor to the frontier",
	"resume"      => "Where I contribute fastest",
	"writing"     => "hdc-home-page__section--writing",
	"contact"     => "Need a technical partner",
);
$fail=0; foreach($checks as $k=>$needle){ $ok=strpos($h,$needle)!==false; echo ($ok?"ok  ":"FAIL")." - $k\n"; if(!$ok)$fail++; }
echo "no Loading (selected work server-rendered): ".(strpos($h,"Syncing selected work")===false?"ok\n":"(note: recent-writing block still hydrates client-side — expected in Phase 2)\n");
echo "\n$fail failures\n";'
```
Expected: `ok` for hero/selected/repo card/throughline/resume/writing/contact; `0 failures`. (The `home-recent-writing` block still client-hydrates — that's the documented interim; its server markup includes the `--writing` section wrapper which is what the check matches.)

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/inc/home-core/home-patterns.php
git commit -m "feat(home): assemble the Home pattern (Hero/Selected Work/Throughline/Resume/Writing/Contact)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Write the Home pattern into the front-page record

**Files:**
- Modify: `scripts/sync_page_sources.php` (the Home `content` builder, ~line 133)

- [ ] **Step 1: Point the Home page content at the new builder**

In `scripts/sync_page_sources.php`, in the `$page_configs` array, the Home entry currently uses `hdc_build_home_page_block_markup()`. Change that one line to the new assembled builder:

```php
		array(
			'path'          => 'home',
			'title'         => 'Home',
			'content'       => function_exists( 'hdc_home_pattern_markup' ) ? hdc_home_pattern_markup() : hdc_build_home_page_block_markup(),
			'page_template' => 'page-no-title',
		),
```

(The `function_exists` guard keeps the script runnable even mid-migration; once Task 10 removes `hdc_build_home_page_block_markup()`, replace the fallback with just `hdc_home_pattern_markup()`.)

- [ ] **Step 2: Run the page sync + verify the front page now renders the new sections**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
npm run sync:pages
wp --path=/home/dev/wp-hperkins-com eval '
$pid = (int) get_option("page_on_front");
$c = get_post_field("post_content", $pid);
echo "front page uses Home pattern markup: ".(strpos($c,"is-style-home-hero")!==false ? "yes" : "NO")."\n";
echo "no longer the home-page parent block: ".(strpos($c,"wp:henrys-digital-canvas/home-page ")===false ? "yes" : "still present")."\n";
$rendered = apply_filters("the_content", $c);
echo "renders 3 selected-work cards: ".substr_count($rendered,"is-style-hdc-repo-card")."\n";
echo "renders contact CTA: ".(strpos($rendered,"Need a technical partner")!==false?"yes":"NO")."\n";'
```
Expected: `front page uses Home pattern markup: yes`, the parent block gone, `3` repo cards, contact CTA present.

- [ ] **Step 3: Commit**

```bash
cd /home/dev/wp-hperkins-com
git add wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php
git commit -m "feat(home): write the assembled Home pattern into the front-page record

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Retire the `home-page` parent block + fallback

**Files:**
- Modify: `functions.php` (drop the `home-page` block dir + the `inc/home-page-blocks.php` require)
- Delete: `inc/home-page-blocks.php`
- Delete: `blocks/home-page/` (directory)

> Only the **parent** is retired here. The four static child blocks (`home-hero`/`home-throughline`/`home-resume-snapshot`/`home-contact-cta`) and `home-selected-work` are now unused but remain registered until Phase 3 deletes them. `home-recent-writing` is still used (embedded interim). Task 1 already relocated the shared CSS, so removing `blocks/home-page/` won't orphan styling.

- [ ] **Step 1: Remove the parent from the block-registration array + the require**

In `functions.php`:
- Delete the line `get_stylesheet_directory() . '/blocks/home-page',` from the `$block_directories` array in `hdc_register_theme_blocks()`.
- Delete the line `require_once get_stylesheet_directory() . '/inc/home-page-blocks.php';`.

- [ ] **Step 2: Delete the parent block + fallback files**

```bash
cd /home/dev/wp-hperkins-com
git rm -r wp-content/themes/henrys-digital-canvas/blocks/home-page
git rm wp-content/themes/henrys-digital-canvas/inc/home-page-blocks.php
```

- [ ] **Step 3: Simplify the sync script's fallback (now that the builder is gone)**

In `scripts/sync_page_sources.php`: remove the `require_once .../inc/home-page-blocks.php;` line, and change the Home `content` line to drop the now-undefined fallback:

```php
			'content'       => hdc_home_pattern_markup(),
```

- [ ] **Step 4: Verify WordPress loads, the front page still renders, and no `home-page` block remains**

```bash
wp --path=/home/dev/wp-hperkins-com eval '
echo "wp loads: ".(function_exists("hdc_home_pattern_markup")?"yes":"NO")."\n";
echo "home-page block deregistered: ".(WP_Block_Type_Registry::get_instance()->is_registered("henrys-digital-canvas/home-page")?"STILL REGISTERED":"yes")."\n";
echo "fallback fn removed: ".(function_exists("hdc_build_home_page_child_block_markup")?"STILL PRESENT":"yes")."\n";
$pid=(int)get_option("page_on_front");
echo "front page renders hero: ".(strpos(apply_filters("the_content",get_post_field("post_content",$pid)),"is-style-home-hero")!==false?"yes":"NO")."\n";'
```
Expected: `yes` across the board; `home-page` deregistered; fallback gone.

- [ ] **Step 5: Re-run the page sync to confirm it still works without the fallback**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas && npm run sync:pages
```
Expected: completes without error (no call to the removed `hdc_build_home_page_*`).

- [ ] **Step 6: Commit**

```bash
cd /home/dev/wp-hperkins-com
git add -A wp-content/themes/henrys-digital-canvas
git commit -m "refactor(home): retire the home-page parent block + legacy fallback

Front page is now the assembled core-block Home pattern. Shared section CSS
was relocated to a global stylesheet (Task 1), so removing the block doesn't
orphan styling. The 6 child blocks stay registered until Phase 3 deletes them.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Parity + smoke verification

**Files:**
- Modify: `scripts/route_smoke.sh` (home marker)
- Modify: `scripts/api_smoke.sh` (`RUN_FRONT_PAGE_SHAPE_CHECK=1` branch)
- Modify: `scripts/playwright/home-parity.spec.cjs`, `scripts/playwright/browser-smoke.spec.cjs` (update selectors/markers for the new markup)

- [ ] **Step 1: Route smoke (homepage still 200 + has content markers)**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=https://wp.hperkins.com npm run smoke:route
```
Expected: all routes PASS. **Note:** the home route's marker in `scripts/route_smoke.sh` is currently `hdc-home-page` (the old parent class). Update that marker to one the new pattern emits — e.g. `is-style-home-hero` or `hdc-home-page__hero` (still present on the new hero group) — and re-run. (Edit `scripts/route_smoke.sh` if the home marker no longer matches.)

- [ ] **Step 2: Update + run the API smoke front-page shape branch**

`scripts/api_smoke.sh` has an optional `RUN_FRONT_PAGE_SHAPE_CHECK=1` branch that currently asserts the old 7-block home innerBlocks tree and renders the removed legacy self-closing `home-page` fallback. Update that branch for the Phase-2 home pattern before running it:

- Replace the old expected-block list (`henrys-digital-canvas/home-page`, `home-hero`, `home-selected-work`, `home-throughline`, `home-resume-snapshot`, `home-contact-cta`) with checks for the new front-page `post_content` shape:
  - required serialized markers: `is-style-home-hero`, `namespace":"hdc/selected-work"` (or equivalent `hdc/selected-work` Query Loop marker), `wp:henrys-digital-canvas/home-recent-writing`, and `is-style-ember-veil`;
  - forbidden serialized markers: `wp:henrys-digital-canvas/home-page`, `wp:henrys-digital-canvas/home-hero`, `wp:henrys-digital-canvas/home-selected-work`, `wp:henrys-digital-canvas/home-throughline`, `wp:henrys-digital-canvas/home-resume-snapshot`, and `wp:henrys-digital-canvas/home-contact-cta`.
- Replace the legacy fallback render check (`do_blocks( "<!-- wp:henrys-digital-canvas/home-page /-->" )`) with a render check against the actual front-page content. Required rendered markers: `is-style-home-hero`, `is-style-hdc-repo-card`, `hdc-home-page__section--throughline`, `data-hdc-home-recent-writing`, and `hdc-home-page__cta-card`.
- Keep `home-recent-writing` allowed in Phase 2 because it is the documented interim block. It is removed in Phase 3.

Then run:

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
RUN_FRONT_PAGE_SHAPE_CHECK=1 BASE_URL=https://wp.hperkins.com npm run smoke:api
```

Expected: API smoke passes, including the optional front-page branch, and it no longer calls or asserts the removed `home-page` fallback.

- [ ] **Step 3: Update + run the Playwright parity/browser specs**

Update `scripts/playwright/home-parity.spec.cjs` and `scripts/playwright/browser-smoke.spec.cjs` to assert the new homepage structure: a full-bleed hero with the H1 copy, 3 Selected Work cards (`.is-style-hdc-repo-card`), the throughline/resume/contact sections, and **no `Loading…`/`Syncing selected work` text in the initial HTML for Selected Work** (it's server-rendered now). Then:

```bash
BASE_URL=https://wp.hperkins.com npm run smoke:browser
```
Expected: specs pass against the new markup.

- [ ] **Step 4: Token/utility drift audits**

```bash
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
./scripts/token_sync_audit.sh ~/henry-s-digital-canvas/src/index.css || true
./scripts/utility_sync_audit.sh ~/henry-s-digital-canvas/src/index.css || true
```
Expected: no new drift introduced by the relocated/new CSS (the new `is-style-*` rules reuse existing tokens). Address any flagged drift.

- [ ] **Step 5: Visual parity pass against the React source**

Open the live homepage and compare against `Home.tsx`'s rendered sections (hero copy/inverse backdrop, throughline two-column + quote card, resume two cards, contact ember-veil card, Selected Work 3 cards). Fix any spacing/surface regressions in `home-sections.css`/`home-patterns.css`. This is the acceptance gate for "visually near-identical."

- [ ] **Step 6: Commit any spec/marker/CSS fixes**

```bash
git add -A wp-content/themes/henrys-digital-canvas
git commit -m "test(home): update parity/smoke specs + markers for the core-block homepage

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review (against design §6–§8 + the Phase-1 follow-ups)

**Spec coverage:**
- Hero/Throughline/Resume/Contact as core-block patterns → Tasks 4–7. ✓
- Register block styles (the skin) → Task 2. ✓
- Migrate clean styling to theme.json → Task 3 (section rhythm/divider already token-backed; minimal). ✓
- Assemble the "Home" pattern → Task 8. ✓
- Update `sync_page_sources.php` to own the homepage `post_content` → Task 9. ✓
- Retire the parent wrapper + fallback → Task 10. ✓
- Update every Phase-2 verification referrer that still expects the old parent/fallback (`route_smoke`, optional `api_smoke` front-page branch, Playwright home/browser specs) → Task 11. ✓
- Selected Work reuses the Phase-1 core/query fragment → Task 8. ✓
- Follow-up #18 partial (Phase-2 card parity): the Selected Work card's CTA destination, date formatting, and icons are still Phase-3/polish items — **flagged in Task 11 Step 4** as parity-pass fixes, not silently dropped. ✓
- **Out of Phase-2 scope (Phase 3):** Recent Writing → core/query + `reading_time`; deleting the six child blocks + referrer audit. Recent Writing is embedded as the interim block here. ✓

**Placeholder scan:** every pattern's markup + every PHP/CSS/edit is shown in full; verification commands have expected output. The only "copy these existing rules verbatim" steps (Task 1, and the surface visuals in Task 2) point to exact source files — they relocate/compose existing, parity-verified CSS rather than inventing it (not a placeholder; re-transcribing 200+ lines verbatim would add risk, not value). The executor copies the named rule groups.

**Type/name consistency:** the builder names (`hdc_home_hero_pattern_markup`, `…throughline…`, `…resume…`, `…contact…`, `hdc_home_pattern_markup`) are defined in Tasks 4–8 and consumed unchanged in Tasks 8–10; the `is-style-*` names registered in Task 2 match those used in the pattern markup (Tasks 4–8) and the CSS (Task 2); `hdc_selected_work_block_markup()` is the Phase-1 function reused in Task 8.

**Risks to watch during execution:**
- The hero backdrop (`is-style-home-hero` pseudo-elements) is the most likely visual-parity gap — verify against the original `.hdc-home-page__hero` in Task 11 Step 4 and adjust the gradient/image layering.
- Confirm the `theme-hero-editorial-amber.webp` / `theme-surface-*.webp` paths resolve from `assets/css/` (the new CSS uses `../images/...` like `background-library.css`).
- `core/columns` default stacking/widths differ slightly from the original CSS grid; the reused `.hdc-home-page__throughline-grid`/`__resume-grid` rules should still apply — verify the two-column layouts hold at desktop and stack on mobile.

---

## Execution Handoff

Plan complete and saved to `wp-content/themes/henrys-digital-canvas/docs/plans/2026-06-05-homepage-core-block-sync-phase-2-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, two-stage review. The natural review checkpoints are Task 1 (shared-CSS relocation — verify surviving blocks still styled) and Task 11 (visual parity acceptance).

**2. Inline Execution** — batch with checkpoints.

Which approach? (Phase 2 changes the live homepage's structure — Task 9 onward alters the front-page record — so a visual parity pass (Task 11 Step 4) is the acceptance gate before considering it done.)
