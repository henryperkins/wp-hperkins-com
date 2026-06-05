# Work Showcase Parity Remediation Design

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

**Date**: 2026-05-02
**Block**: `henrys-digital-canvas/work-showcase`
**Source of truth**: `/home/dev/henry-s-digital-canvas/src/pages/Work.tsx`
**Supporting React files**:
- `src/components/work/WorkFiltersBar.tsx`
- `src/components/work/WorkSignalsPanel.tsx`
- `src/components/work/WorkRepoCard.tsx`
- `src/components/work/WorkRepositoryLibrary.tsx`
- `src/components/work/WorkFeaturedCaseStudies.tsx`
- `src/components/work/WorkRoleGroups.tsx`
- `src/components/work/work-utils.ts`
- `src/data/repos.ts`, `src/data/repo-case-study-details.ts`

**Verdict**: `NEEDS_WORK` (3 high, 9 medium, 8 low; ~7 files)

## Predecessor

The previous remediation pass (`2026-03-15-work-showcase-parity-design.md`) closed the featured-card structure, focus-area disclosure, pending repo links, and split signal scopes. Those fixes are still present and are not redone here. This pass focuses on the second-tier filter UI, signals copy, and curated data drift introduced since then.

## User Decisions

- Keep all three WordPress-only extras flagged by the parity checker: editor `heading` and `description` attributes (defaults match React copy, so frontend output is unchanged), the editor preview `Notice`, and the runtime `work-visuals.json` fetch. None of these create alternate frontend states, so they are accepted platform adaptations.
- No removals or destructive edits are required this round.

## Reusable Patterns And Guardrails

- The shared Lucide icon registry lives at `assets/js/hdc-shared-utils.js`. The block already pulls icons from it; only `sliders-horizontal` needs to be added.
- The block already has a working URL-sync pattern (`buildWorkSearchParams`, `readInitialWorkState`) and a `useState` + `useEffect` shape that mirrors `Work.tsx`. New `role` and `signals` state must extend this same shape — do not introduce a parallel state container.
- WordPress writes URL state with `window.history.replaceState(...)` (not `setSearchParams`). Keep that pattern; do not introduce React Router.
- `site-shell/view.js` already uses `window.localStorage` for the theme key. Reuse that pattern (try/catch around access, no top-level reads at SSR/parse time) for the saved Refine view.
- `assets/css/design-system.css` already defines `--wpds-*` overlay tokens for ember and learning surfaces. New surface variants must be expressed as additional CSS custom-property mixes on the existing `--wpds-overlay-ember-*` family — do not add new color literals.
- The block uses Preact's `h`-style createElement output (`view.js` is hand-written, not JSX/wp-scripts). Continue that style; don't introduce JSX in this block.
- Block view scripts run only on pages where the block appears (via `viewScript` in `block.json`), so the keyboard listener and localStorage access are scoped without further gating.
- `style.css` and `view.js` are large and frequently touched. Implementation must make surgical edits rather than rewrites and validate each phase with `node -c` before moving on.

## Problem

The work-showcase block is functionally close to React but ships with several surface-area regressions that change behavior, not just polish:

1. The Refine UI (role + signals filters), saved-view restore, active-facet chip rail, "Showing X of Y" header, and keyboard shortcuts are entirely missing. Shared URLs containing `?role=` or `?signals=` silently drop those parameters, so links do not reproduce the intended view.
2. Engineering Signals fallback messaging is collapsed: the top-level degradation notice is absent, the language fallback explanation is absent, the delivery degradation list is absent, and stat values render generic `Unavailable` instead of source-specific labels (`Rate limited`, `Offline`).
3. The repository card nests a `LanguageBadge` inside a `Badge` parent — yielding a double-bordered control — and the empty-state copy is fixed regardless of which filter is active.
4. The curated `repos.json` and `repo-case-study-details.json` files have drifted from their React TS counterparts. The fallback path (when GitHub is rate limited or offline) shows older content than the source.
5. Smaller polish gaps: featured cover images lack explicit width/height (CLS risk), `data-contrast-probe` attributes are missing, copy diverges in two places, and the four React surface tones (`learningPaper`, `emberVeil`, `insetSoft`) have no CSS-side equivalents.

## Scope

### Phase 1: Refine UI, URL state, and active-facet chip rail

**Goal**: bring the React Refine drawer, saved view, active-facet pill row, "Showing X of Y" header, per-facet empty-state actions, and global keyboard shortcuts into the block.

#### 1a. Add the `sliders-horizontal` icon to the shared registry

Implementation:

- `assets/js/hdc-shared-utils.js`: add `sliders-horizontal` to `LUCIDE_ICON_NODES` using the canonical Lucide path set (three pairs of horizontal lines plus three short verticals), matching the icon used in `WorkFiltersBar.tsx`.

#### 1b. Extend URL state and parser helpers for `role` and `signals`

Implementation:

- `blocks/work-showcase/view.js`: add `ROLE_ORDER` (already present), `SIGNAL_ORDER`, and `SIGNAL_LABEL_MAP` constants matching `work-utils.ts`.
- `blocks/work-showcase/view.js`: add `parseWorkRole( value, validRoles )` and `parseWorkSignals( value )` to mirror the React parsers, including SIGNAL_ORDER-preserving normalization.
- `blocks/work-showcase/view.js`: extend `readInitialWorkState` to read `role` and `signals` from `URLSearchParams`.
- `blocks/work-showcase/view.js`: extend `buildWorkSearchParams` to write `role` and `signals` (omit when empty/null).
- `blocks/work-showcase/view.js`: add `getSignalBadges( repo )` matching `work-utils.ts` (uses curated `repo.signals` if present; falls back to inferred TypeScript/typed, docs topics, github/ci).

#### 1c. Add `activeRole` / `activeSignals` state and filter logic

Implementation:

- `blocks/work-showcase/view.js`: add `[ activeRole, setActiveRole ]` and `[ activeSignals, setActiveSignals ]` state to `WorkShowcaseApp`, initialised from `readInitialWorkState`.
- `blocks/work-showcase/view.js`: extend the `filtered` memo to also drop repos whose `repo.role !== activeRole` and repos that do not contain every signal in `activeSignals` (using `getSignalBadges`).
- `blocks/work-showcase/view.js`: gate `showFeaturedCaseStudies` and `showRoleGroups` on `!hasActiveBrowseFilters` (combined language/role/signals), matching React.
- `blocks/work-showcase/view.js`: extend the URL sync `useEffect` dependency list to include `activeRole` and `activeSignals` so filter changes write the URL.

#### 1d. Build the Refine drawer/collapsible panel and render it from `FiltersBar`

Implementation:

- `blocks/work-showcase/view.js`: add `isRefineOpen` state, default-true when initial URL has any role/signals param.
- `blocks/work-showcase/view.js`: extend `FiltersBar` props with `activeRole`, `activeSignals`, `isRefineOpen`, `onRefineOpenChange`, `onRoleChange`, `onSignalsChange`, `matchingRepoCount`, `totalRepoCount`, `onClearAllFilters`, `onClearLanguage`, `onClearRole`, `onClearSignals`, `canRestoreLastView`, `onRestoreLastView`, `savedViewSummary`.
- `blocks/work-showcase/view.js`: render a "Refine" button using the new `sliders-horizontal` icon, with active count badge in the label. Toggling it opens a `<div>` panel below the filter row when `isRefineOpen` (no portal, no native `<dialog>` — keep DOM-flow visibility as a CSS-driven collapsible, mirroring React's desktop `Collapsible`).
- `blocks/work-showcase/view.js`: inside the panel, render a "Role" segmented toggle (All roles + each role) using `aria-pressed` and a "Signals" fieldset of toggle chips for each `SIGNAL_ORDER` entry, matching the labels in `SIGNAL_LABEL_MAP`.
- `blocks/work-showcase/view.js`: render a "Your last view" button just left of the Refine button when `canRestoreLastView` is true, with `aria-label` showing the saved view summary.
- `blocks/work-showcase/style.css`: add styles for the Refine button (active count pill), the collapsible panel (border-top divider, padding), the role toggle group, and the signal chips. Use existing `.hdc-work-button` and `.hdc-work-chip` patterns where possible.

#### 1e. Add the active-facet chip rail and "Showing X of Y" header

Implementation:

- `blocks/work-showcase/view.js`: under the filter controls, render a row containing an `aria-live="polite"` paragraph (`Showing {filteredCount} of {totalCount}`) and, when any facet is active, a wrap row of pill buttons (`Language: TypeScript`, `Role: Systems`, `Signals: Tested, Typed`) plus a `Clear all` link.
- `blocks/work-showcase/view.js`: each chip's click handler calls the corresponding `onClear*` handler. Build `activeFacetActions` exactly like React (filter empties out null entries).
- `blocks/work-showcase/view.js`: add `data-contrast-probe="work-filters-active"` on the row container.
- `blocks/work-showcase/style.css`: add styles for the row container (rounded-surface border, subdued background) and the chip pills (use existing `.hdc-work-button` outline variant).

#### 1f. Saved-view localStorage persistence

Implementation:

- `blocks/work-showcase/view.js`: add `WORK_LAST_REFINE_VIEW_STORAGE_KEY = 'work-last-refine-view'`.
- `blocks/work-showcase/view.js`: add `readSavedWorkRefineView()` (try/catch JSON.parse, validate role and signals, return null if both empty) and `rememberSavedRefineView( role, signals )` (no-op when both empty, otherwise normalize and `setItem`).
- `blocks/work-showcase/view.js`: add `[ savedRefineView, setSavedRefineView ]` state seeded from URL params if any are active, else from localStorage.
- `blocks/work-showcase/view.js`: write to localStorage from each role/signals change handler.
- `blocks/work-showcase/view.js`: derive `canRestoreLastView` exactly like React (no active role/signals filter, saved view present, summary non-empty); derive `savedRefineViewSummary` (`Role` + `Signals: ...`).
- `blocks/work-showcase/view.js`: `handleRestoreLastView()` writes role+signals to URL state, opens the Refine panel, and resets pending repos.

#### 1g. Per-facet empty-state actions

Implementation:

- `blocks/work-showcase/view.js`: replace the hard-coded `View all projects` button with an `emptyStateActions` array mirroring React (`Clear role`, `Clear signals`, `Clear language` — order matters). When the array is empty, fall back to a single `View all projects` button calling `handleClearAllFilters`.
- `blocks/work-showcase/view.js`: change the `EmptyState` description to `hasActiveBrowseFilters ? 'No repositories matched the current filters.' : 'No repositories are available right now.'`.

#### 1h. Global keyboard shortcuts

Implementation:

- `blocks/work-showcase/view.js`: add a document-level `keydown` listener (mounted in a `useEffect` keyed on `hasActiveBrowseFilters`, `sort`, `view`).
- The listener short-circuits when the event is default-prevented, has a meta/ctrl/alt key, originates inside `[role='dialog']`, or originates from an editable target (`INPUT`, `SELECT`, `TEXTAREA`, contentEditable).
- `/` focuses the active language chip (`document.querySelector('[aria-label=\"Filter by language\"] [aria-pressed=\"true\"]')`).
- `r` (case-insensitive) sets `isRefineOpen` to true.
- `Escape` (only when `hasActiveBrowseFilters`) clears all browse filters via the URL state path.

### Phase 2: Engineering Signals notices and source-aware fallback labels

**Goal**: surface the top-level degradation notice, the language-fallback reason, and the delivery degradation messages, and replace generic `Unavailable` strings with source-specific labels.

#### 2a. Add degradation message helpers

Implementation:

- `blocks/work-showcase/view.js`: add small helpers (block-local; do not export) mirroring the React utility surface area:
  - `getGitHubSignalSourceLabel( source )` → `'Rate limited'` for `fallback-ratelimit`, `'Offline'` for `fallback-offline`, `'Unavailable'` for `fallback-error`, `null` otherwise.
  - `getGitHubSignalDegradationMessage( source, messages )` → returns the matching `messages.rateLimit | offline | error` string for fallback sources, `null` for `live` / `loading`.
  - `getPreferredGitHubSignalDegradedSource( sources )` → first non-live/non-loading source from the list (mirrors React's preference order).

#### 2b. Render the engineering signal notice paragraph

Implementation:

- `blocks/work-showcase/view.js`: in `SignalsPanel`, after `SectionIntro`, render an `engineeringSignalNotice` paragraph using `getGitHubSignalDegradationMessage(preferredSignalDegradedSource, { rateLimit: ..., offline: ..., error: ... })` with the exact React copy:
  - rateLimit: `Some engineering signals are temporarily unavailable due to GitHub rate limiting. Repository browse data may still be live.`
  - offline: `Some engineering signals are temporarily unavailable because you're offline. Repository browse data may still be cached.`
  - error: `Some engineering signals are temporarily unavailable right now. Repository browse data may still be live.`

#### 2c. Replace generic Unavailable strings with source labels

Implementation:

- `blocks/work-showcase/view.js`: in `SignalsPanel`, change the `commitValue` fallback path to `getGitHubSignalSourceLabel(props.contributorStatsSource) || 'Unavailable'`.
- Same change for `primaryLanguageLabel` (use `props.languageSummarySource`).
- Same change for `deliveryValue`'s degraded branch (use `getPreferredGitHubSignalDegradedSource([ ciStatusSource, repoProofSource ])`).

#### 2d. Render the language fallback reason in the language stat body

Implementation:

- `blocks/work-showcase/view.js`: when `languageBreakdown` is empty *and* size-weighted fallback would apply but is also empty, the existing "unavailable" message is rendered. Add a separate path for when size-weighted fallback IS applied (`isUsingSizeWeightedLanguageFallback`): build `languageSummaryItems` with `languageSummaryFallbackReason` (mirrors React: `GitHub byte totals are temporarily rate limited. Showing repo-size-weighted fallback data instead.` etc.) plus the existing weighted summary entries.

#### 2e. Render the delivery degradation messages list

Implementation:

- `blocks/work-showcase/view.js`: in the `deliveryItems` body branch, after `deliveryCoverageItems`, append a `deliveryDegradationMessages.map(...)` block that emits one `<p>` per message. Use the React copy for `ciStatusSource` and `repoProofSource` rate-limit/offline/error variants.

### Phase 3: Repository card structural rebuild and small copy fixes

**Goal**: align the repo card DOM with React, drop the double-bordered LanguageBadge nesting, fix the library empty-state copy, and add the contrast probes.

#### 3a. Rebuild the repo card head row

Implementation:

- `blocks/work-showcase/view.js`: in `RepoCard`, replace `h( Badge, { variant: 'secondary' }, h( LanguageBadge, { language: repo.language } ) )` with `h( LanguageBadge, { language: repo.language } )` (no `Badge` wrapper).
- `blocks/work-showcase/view.js`: keep the topic-row, h3 title link, description, metadata badge row, and footer in their existing relative order; ensure the footer still has `margin-top: auto` and the card is `display: flex; flex-direction: column; height: 100%`.
- `blocks/work-showcase/view.js`: change the title element from `h4` to `h3` to match React's `ContentCardTitle` semantic level (which renders as h3 inside this section).
- `blocks/work-showcase/view.js`: wrap the title link in classNames `hdc-work-repo-title-link` with focus-ring styles. The `<a>` itself remains the only clickable surface (matches React; the whole card is not clickable).

#### 3b. Add `width` and `height` to featured cover images

Implementation:

- `blocks/work-showcase/view.js`: in `FeaturedCaseStudies`, when `visualSet.cover` is present, pass `width: visualSet.cover.width` and `height: visualSet.cover.height` to the `<img>` element so the browser reserves layout space.

#### 3c. Fix Repository Library empty-state copy and ellipsis normalization

Implementation:

- `blocks/work-showcase/view.js`: change the `RepositoryLibrary` empty-state description from `These repositories are indexed, but detailed summaries are still being curated.` to `These repositories are available, but detailed summaries are still being curated.`.
- `blocks/work-showcase/view.js`: change `'Syncing from GitHub…'` (Unicode horizontal ellipsis) to `'Syncing from GitHub...'` (three ASCII dots) to match React.
- `blocks/work-showcase/view.js`: replace `'Loading...'` references in `SignalsPanel` with `'Loading…'` or vice versa — pick the React variant exactly. (React uses `Loading...`; verify and align.)

#### 3d. Add `data-contrast-probe` attributes

Implementation:

- `blocks/work-showcase/view.js`: add `data-contrast-probe` attributes on the elements React tags:
  - hero meta paragraph → `hero-meta-work`
  - signals panel section title → `ember-heading-work`
  - featured case studies section meta paragraph → `ember-meta-work-featured`
  - pending repos panel section body → `ember-body-work-pending`
  - active-facet chip row container → `work-filters-active` (already in 1e)

### Phase 4: Surface tones, signal stat density, and reveal polish

**Goal**: introduce CSS variants for the four React surfaces (`learningPaper`, `emberVeil`, `insetSoft`) and apply them to the matching WP elements.

#### 4a. Add surface-tone CSS variants

Implementation:

- `assets/css/design-system.css`: add three small reusable CSS classes (or modifier mixins) backed by existing WPDS overlay tokens:
  - `.surface-learning-paper` — light inset background appropriate for filter shells, role cards, repo cards, timeline cards.
  - `.surface-ember-veil` — soft ember tint appropriate for signals panel, featured case studies panel, pending repos panel.
  - `.surface-inset-soft` — slight inset shadow + tint for stat cards inside the signals panel.
- These classes must compose with the existing `--wpds-overlay-ember-*` and `--wpds-surface-*` tokens; do not introduce new color literals.

#### 4b. Apply surface tones to matching WP markup

Implementation:

- `blocks/work-showcase/view.js`: add `surface-learning-paper` to `.hdc-work-filters`, `.hdc-work-role-card`, `.hdc-work-repo-card`, and timeline cards.
- `blocks/work-showcase/view.js`: add `surface-ember-veil` to `.hdc-work-signals`, `.hdc-work-featured` (featured case studies panel), and `.hdc-work-pending`.
- `blocks/work-showcase/view.js`: add `surface-inset-soft` to each `.hdc-work-stat-card` inside `SignalsPanel`.
- `blocks/work-showcase/style.css`: trim any duplicated background/border treatment that the new utility class makes redundant.

### Phase 5: Curated data refresh

**Goal**: bring `repos.json` and `repo-case-study-details.json` back in sync with their React TS counterparts so the fallback path matches the source.

#### 5a. Refresh `repos.json` from `repos.ts`

Implementation:

- `blocks/work-showcase/data/repos.json`: regenerate from `/home/dev/henry-s-digital-canvas/src/data/repos.ts`, preserving the JSON-only structure (no TS imports). Include all curated fields used by the page, even if not currently consumed by `view.js`: `createdAt`, `homepage`, `hasPages`, `hasIssues`, `hasProjects`, `hasWiki`, `hasDiscussions`, `openIssuesAndPullRequests`, and `relatedPosts`. The block does not currently read all of these, but parity requires the data contract to be complete.
- Update all `updatedAt` values to match the TS source.
- Confirm the resulting JSON parses by running `node -e "JSON.parse(require('fs').readFileSync('blocks/work-showcase/data/repos.json','utf8'))"` and that `view.js`'s `mapGitHubRepos` still succeeds against the new shape.

#### 5b. Refresh `repo-case-study-details.json`

Implementation:

- `blocks/work-showcase/data/repo-case-study-details.json`: regenerate from `/home/dev/henry-s-digital-canvas/src/data/repo-case-study-details.ts`.
- Verify the schema (challenge / approach / result / highlights / architecture preview / proof links etc.) matches what `mergeRepoDetails` expects.
- Run the route smoke and a quick fallback-mode browser load to confirm visible content matches React.

## File Impact

- `wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js` — add `sliders-horizontal` icon node.
- `wp-content/themes/henrys-digital-canvas/assets/css/design-system.css` — add three surface-tone utility classes.
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` — new state, parsers, Refine UI, active-facet rail, keyboard shortcuts, signals notices, repo card adjustments, copy fixes, surface-tone classes.
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css` — Refine button/panel chrome, active-facet chip rail, removed redundant card chrome.
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php` — `data-contrast-probe="hero-meta-work"` on the hero meta paragraph (or move to `view.js` after mount; render.php is the simpler placement).
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json` — refresh.
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json` — refresh.

Total: 7 files.

## Out Of Scope

- Editor Inspector controls for `heading`/`description` stay in place (keep extras).
- Editor preview `Notice` stays in place.
- `work-visuals.json` runtime fetch stays in place (necessary architectural adaptation).
- Existing reveal observer + proportion-bar animation stay in place; do not replace with framer-motion-style logic.
- Existing fetch + cooldown helpers stay in place; do not introduce a hooks abstraction layer.
- `<a href="/work/{repo}/">` (MPA-style) navigation stays — do not introduce React Router.
- No new REST routes or proxy endpoints. Existing `loadRepoProofs`, `loadCIStatus`, `loadContributorStats`, `loadLanguageSummary` are reused unchanged.
- Block-internal `index.js` editor preview is not touched.

## Verification

After each phase:

- `node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`
- `node -e "JSON.parse(require('fs').readFileSync('wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json','utf8'))"` (after Phase 5a)
- `node -e "JSON.parse(require('fs').readFileSync('wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json','utf8'))"` (after Phase 5b)
- `php -l wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php` (after any render.php edit)

Full verification (from theme dir):

- `npm run smoke:route`
- `npm run smoke:api`
- `wp --path=/home/dev/wp-hperkins-com cache flush`
- Visit `/work` and check: language chip → URL writes `?language=`; click Refine → role and signal chips visible; pick a role → URL writes `?role=`; refresh → state restored; press `r` → panel opens; press `/` → active language chip focused; press `Escape` with active filters → all filters clear; "Your last view" appears after clearing; engineering signals notice appears when GitHub is rate limited (simulate via offline DevTools).
- Re-run the parity checker for `work-showcase` and confirm result is `PARITY` or `MINOR_DRIFT` with only the three accepted WP-only extras remaining.
