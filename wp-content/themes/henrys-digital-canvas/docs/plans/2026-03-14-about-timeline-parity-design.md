# About Timeline Parity Remediation Design

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

**Date**: 2026-03-14
**Block**: `henrys-digital-canvas/about-timeline`
**Source of truth**: `/home/azureuser/henry-s-digital-canvas/src/pages/About.tsx` and `/home/azureuser/henry-s-digital-canvas/src/data/about-content.ts`
**Verdict**: NEEDS_WORK (2 high, 3 medium, 2 low)

## Problem

The current WordPress `about-timeline` block preserves the broad About-page structure, but it falls short of the React source in three areas:

1. It omits two source sections entirely: the `PageHero` intro band and the capabilities card grid.
2. It uses stale or simplified content in the intro, LinkedIn badge, and timeline date labels.
3. It does not match the source page's metadata, reduced-motion behavior, avatar fallback, or reveal choreography.

Because the remediation includes high-severity gaps and likely touches theme-level metadata plus shared UI utilities, this should follow the full-plan path instead of a direct fast-path edit.

## Reusable Patterns Already In The Repo

- **Hero band pattern**: recent `blog-index` work added an ember-surface hero with eyebrow/title/description framing that can be adapted for the About hero.
- **Reveal system**: `blog-index/view.js` already uses an `IntersectionObserver`-based reveal pipeline with a `prefers-reduced-motion` CSS fallback. Reuse the same platform approach instead of adding a new animation system.
- **Theme metadata pipeline**: `functions.php` already outputs route titles and homepage canonical/OG/Twitter metadata. Extend that theme-level metadata pattern for the About page instead of mutating `document.title` in block JS.
- **Shared icon utility**: `assets/js/hdc-shared-utils.js` already contains `wrench`, `linkedin`, `calendar`, `users`, `heart`, `graduation-cap`, `briefcase`, and `code`; capability parity will likely require adding `bot` and `notebook-pen`.

## Extras Decision

Pending user confirmation for ambiguous WP-only extras:

- `heading` block attribute
- `showValues` block attribute
- `showTimeline` block attribute

Recommended default:

- Remove `heading` so the hero title always matches the React source of truth.
- Keep `showValues` and `showTimeline` as editor-only toggles because their defaults preserve parity and they do not introduce visible drift unless intentionally changed.
- Remove the current client-side `document.title` mutation regardless, because metadata/title parity belongs at the theme layer.

## Scope

Expected files touched:

- `wp-content/themes/henrys-digital-canvas/blocks/about-timeline/render.php`
- `wp-content/themes/henrys-digital-canvas/blocks/about-timeline/view.js`
- `wp-content/themes/henrys-digital-canvas/blocks/about-timeline/style.css`
- `wp-content/themes/henrys-digital-canvas/data/about-content.json`
- `wp-content/themes/henrys-digital-canvas/functions.php`
- `wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js`
- Possibly `wp-content/themes/henrys-digital-canvas/blocks/about-timeline/block.json` depending on the extras decision

## Phase 1: Content And Metadata Contract

**Files**: `data/about-content.json`, `render.php`, `functions.php`

### 1a. Sync source copy and structured content

Update the About data contract so the WP block can render the same UI and metadata the React page uses.

Add or update:

- `heroDescription`
- `metadata` object matching the React `ABOUT_METADATA` contract (`title`, `description`, `canonical`, `openGraph`, `twitter`)
- `sectionLabels.capabilities`
- `capabilities[]` with 3 cards:
  - title
  - icon name
  - description paragraphs array
- `profile.cardTitle` so it matches the React LinkedIn badge subtitle
- intro paragraph 1 and 3 so they match `aboutIntro`
- timeline `periodLabel` and `periodDateTime` for 2012 entries (`May-Oct 2012`, `2012-05`; `Oct-Nov 2012`, `2012-10`)

### 1b. Move About metadata to the theme layer

Add a theme-level About metadata output path in `functions.php` that mirrors the existing homepage metadata function and uses the new About data contract metadata fields.

Requirements:

- Output `<meta name="description">`
- Output canonical URL
- Output Open Graph tags
- Output Twitter tags
- Keep server-rendered title parity via existing route-title logic
- Remove reliance on block hydration for metadata correctness

## Phase 2: Structural UI Parity

**Files**: `render.php`, `view.js`, `block.json` (conditional)

### 2a. Replace the plain heading with the real hero band

Implement a true About hero that mirrors the source page's `PageHero` framing:

- eyebrow text `About`
- title `About Henry Perkins`
- hero description from the data contract
- ember-surface band treatment
- divider/band spacing consistent with the source page's top framing

### 2b. Add the missing capabilities section

Render the full `AI all day. Everything else too.` section between intro and values.

Per-card requirements:

- icon badge
- `What I do` label
- card title
- multi-paragraph body copy
- ember/surface-card styling aligned to the React source

### 2c. Tighten intro/profile parity

Update the intro/profile section so it behaves like the React `ProfileAvatar` and `LinkedInBadge` pair.

Requirements:

- image fallback to initials on load failure
- LinkedIn badge subtitle matches source copy
- preserve external-link behavior and accessible labeling
- retain current loading placeholder in `render.php` as acceptable hydration scaffolding

### 2d. Decide ambiguous editor-only extras

Apply the user-selected decision for `heading`, `showValues`, and `showTimeline`.

If `heading` is removed:

- delete the attribute from `block.json`
- stop reading it in `render.php`
- use source-of-truth hero content from the data contract only

If `showValues` / `showTimeline` are kept:

- keep their existing defaults and render guards
- do not expose them in a way that changes default live output

## Phase 3: Visual And Motion Parity

**Files**: `view.js`, `style.css`, `assets/js/hdc-shared-utils.js`

### 3a. Rebuild section styling around migrated shared patterns

Align the block more closely with the React composition represented by `SectionIntro`, `SurfaceCard`, `TimelineRow`, and `LinkedInBadge`.

Targets:

- section spacing rhythm
- card padding and emphasis
- heading hierarchy
- timeline row alignment and meta placement
- hover/focus affordances on the LinkedIn badge

### 3b. Align reveal choreography and reduced-motion behavior

Reuse the repo's current reveal pattern rather than the existing always-on CSS animation.

Requirements:

- `IntersectionObserver`-based reveal classes
- `prefers-reduced-motion` fallback
- hero and section content reveal in source-like order
- timeline rows animate from horizontal offset (`x`) rather than vertical slide-up (`y`)
- stagger timing consistent with current theme motion tokens

### 3c. Add missing capability icons to shared utils

If absent, add the Lucide node definitions needed for About capability cards:

- `bot`
- `notebook-pen`

Use the existing `renderLucideIcon()` shared path instead of block-local SVG duplication.

## Phase 4: Cleanup

**Files**: `view.js`, `block.json` (conditional)

- Remove block-level `document.title` mutation from `view.js`
- Remove any obsolete CSS tied to the old plain-title layout or legacy animation approach
- Remove any config fields that become redundant after moving to the synced data contract

## Verification

After implementation:

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/about-timeline/view.js
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

Then:

- Browser-check the live `/about/` page for hero band, capabilities cards, timeline date labels, reveal timing, and avatar fallback behavior.
- Re-run the parity checker to confirm the verdict improves to `PARITY` or `MINOR_DRIFT`.
