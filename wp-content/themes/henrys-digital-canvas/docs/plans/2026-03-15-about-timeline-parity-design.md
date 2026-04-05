# About Timeline Parity Remediation Design

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

**Date**: 2026-03-15
**Block**: `henrys-digital-canvas/about-timeline`
**Source of truth**: `/home/azureuser/henry-s-digital-canvas/src/pages/About.tsx`
**Supporting source**: `/home/azureuser/henry-s-digital-canvas/src/data/about-content.ts`
**Verdict**: `NEEDS_WORK`
**Path**: Full plan

## Audit Summary

The current WordPress `about-timeline` block preserves the intro, values, and timeline at a high level, but it is not at parity with the React About page. The largest issues are structural:

1. The React `PageHero` band is missing entirely.
2. The React capabilities grid is missing entirely.
3. The About data contract is stale and does not expose the source metadata or capability content.

This is full-plan work because there are high-severity gaps and the likely change set crosses more than four files.

## Working Tree Notes

Current repo state already includes unrelated local changes and an untracked earlier draft at `docs/plans/2026-03-14-about-timeline-parity-design.md`. This plan does not overwrite that file.

Reusable nearby work:

- `blog-index` added a reusable reveal pattern that is closer to the React motion approach than the current hard-coded About CSS animations.
- The theme already has a metadata pipeline for the homepage and blog detail routes in `functions.php`.
- `assets/css/design-system.css` already includes the tokens and utility classes needed for an ember-band hero and surface-card styling.

## Gap Summary

### Missing Features

| # | Feature | Severity | Location | Fix |
|---|---------|----------|----------|-----|
| 1 | Hero band with eyebrow, description, divider, and ember surface | High | `About.tsx:53-70` vs `blocks/about-timeline/view.js:113-119` and `render.php:21-31` | Replace the plain `h1` layout with a true About hero fed by the data contract. |
| 2 | Capabilities section and capability cards | High | `About.tsx:96-120`, `about-content.ts:41-96` vs `blocks/about-timeline/view.js:183-255` and `data/about-content.json:1-110` | Add the missing section, content contract, icon labels, and card UI. |
| 3 | Source intro copy is stale in paragraphs 1 and 3 | Medium | `about-content.ts:47-51` vs `data/about-content.json:8-12` | Update intro text to match the React source exactly. |
| 4 | LinkedIn badge subtitle and accessible label do not match source copy | Medium | `LinkedInBadge.tsx` subtitle vs `data/about-content.json:13-20` and `view.js:146-179` | Sync the subtitle/content contract and keep the same external link behavior. |
| 5 | 2012 timeline labels are too coarse | Medium | `about-content.ts:113-128` vs `data/about-content.json:50-64` | Update `periodLabel`/`periodDateTime` to `May-Oct 2012` and `Oct-Nov 2012`. |
| 6 | About metadata contract is missing from the theme head output | Medium | `About.tsx:24-45` vs `functions.php:329-331` and `functions.php:419-488` | Add About metadata fields to the data contract and output them in `wp_head`. |
| 7 | Avatar falls back only when the URL is absent, not when the image fails | Low | `ProfileAvatar.tsx` vs `view.js:123-131` | Add image-error fallback to initials. |
| 8 | Motion choreography does not match the source or reduced-motion behavior | Low | `About.tsx:53-80`, `About.tsx:138-147` vs `style.css:232-238` | Replace always-on CSS animation with the repo reveal pattern and horizontal timeline stagger. |

### Missing Dependencies

| # | Dependency | Needed by gap(s) | Fix |
|---|-----------|-------------------|-----|
| 1 | `bot` icon in `assets/js/hdc-shared-utils.js` | 2 | Add the Lucide node so the AI capability card matches the React source. |
| 2 | `notebook-pen` icon in `assets/js/hdc-shared-utils.js` | 2 | Add the Lucide node so the documentation capability card matches the React source. |

### Extra Features In WP

| # | Feature | Recommendation | Notes |
|---|---------|----------------|-------|
| 1 | `heading` attribute and editor text control | Remove | The React source has a fixed hero title. A mutable block heading pushes the block away from source-of-truth parity. |
| 2 | `showValues` attribute and editor toggle | Keep | Default output still matches the source; this is a harmless editor-only escape hatch when left enabled. |
| 3 | `showTimeline` attribute and editor toggle | Keep | Same rationale as `showValues`. |
| 4 | Server render loading placeholder | Keep | Acceptable WordPress hydration scaffolding; not user-visible after mount. |

### Minor Drifts

- Client-side hydration instead of direct SPA render is acceptable for the platform.
- The current data-config bootstrapping approach is acceptable as long as the rendered UI and metadata match the source.

## Expected File Scope

- `wp-content/themes/henrys-digital-canvas/blocks/about-timeline/render.php`
- `wp-content/themes/henrys-digital-canvas/blocks/about-timeline/view.js`
- `wp-content/themes/henrys-digital-canvas/blocks/about-timeline/style.css`
- `wp-content/themes/henrys-digital-canvas/data/about-content.json`
- `wp-content/themes/henrys-digital-canvas/functions.php`
- `wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js`
- `wp-content/themes/henrys-digital-canvas/blocks/about-timeline/block.json`
- `wp-content/themes/henrys-digital-canvas/blocks/about-timeline/index.js`

## Phases

### Phase 1: Sync the About data contract

Update `data/about-content.json` so it contains:

- `heroDescription`
- `metadata.title`
- `metadata.description`
- `metadata.canonical`
- `metadata.openGraph`
- `metadata.twitter`
- `sectionLabels.capabilities`
- `capabilities[]` with `title`, `icon`, and `description[]`
- corrected intro copy
- corrected LinkedIn subtitle field
- corrected 2012 timeline labels

### Phase 2: Rebuild the block structure for parity

Update `render.php` and `view.js` so the live output follows the React page order:

1. Hero band
2. Intro/profile section
3. Capabilities section
4. Values section
5. Timeline section

Specific requirements:

- Use the fixed source title `About Henry Perkins`
- Render the `About` eyebrow and hero description
- Preserve the current values/timeline toggles unless the extras decision changes
- Add the LinkedIn badge subtitle and avatar fallback behavior

### Phase 3: Align styling and motion

Update `style.css` to mirror the React composition more closely:

- ember-surface hero treatment
- section spacing consistent with `PageSection`
- capability card presentation aligned with `SurfaceCard`
- timeline rows aligned with `TimelineRow`
- reveal behavior based on the existing repo observer pattern
- reduced-motion-safe animation behavior

### Phase 4: Theme metadata parity

Extend `functions.php` so the About route outputs:

- `<meta name="description">`
- canonical link
- Open Graph tags
- Twitter tags

This should use the About JSON metadata contract rather than block hydration.

### Phase 5: Cleanup block-only drift

- Remove `document.title` mutation from `view.js`
- Remove the `heading` attribute and editor control if the recommended extras decision is accepted
- Keep `showValues` and `showTimeline` as default-on editor toggles

## Validation

After implementation:

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/about-timeline/view.js
node -e "JSON.parse(require('fs').readFileSync('wp-content/themes/henrys-digital-canvas/data/about-content.json','utf8'))"
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache-enabler clear
```

Then verify `/about/` for:

- hero eyebrow/title/description
- capabilities card content and icons
- updated intro and LinkedIn subtitle copy
- corrected 2012 timeline labels
- avatar fallback behavior
- metadata tags in the rendered head
