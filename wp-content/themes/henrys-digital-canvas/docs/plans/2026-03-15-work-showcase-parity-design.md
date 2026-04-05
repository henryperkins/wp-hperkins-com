# Work Showcase Parity Remediation Design

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

**Date**: 2026-03-15
**Block**: `henrys-digital-canvas/work-showcase`
**Source of truth**: `/home/azureuser/henry-s-digital-canvas/src/pages/Work.tsx`
**Supporting React files**:
- `src/components/work/WorkFeaturedCaseStudies.tsx`
- `src/components/work/WorkRoleGroups.tsx`
- `src/components/work/WorkRepositoryLibrary.tsx`
- `src/components/work/WorkPendingReposPanel.tsx`
- `src/components/work/WorkSignalsPanel.tsx`
- `src/components/work/work-utils.ts`

## Current Verdict

`NEEDS_WORK`

The latest parity pass still finds high-severity gaps in featured case study rendering, Engineering Signals logic, and curated project data freshness. The block also has medium drift in focus-area interaction and pending-repo navigation, plus low-severity filter/header polish drift.

## User Directive

Remove all WordPress-only block metadata extras so the block defaults match the React page instead of exposing alternate editor-only states.

Remove these attributes and config paths:
- `repoCount`
- `includeForks`
- `includeArchived`
- `openInNewTab`
- `showSignalsPanel`
- `showActivitySparkline`
- `sparklineWeeks`

This cleanup applies to:
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/block.json`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`

## Reusable Patterns Already in the Tree

1. Recent `work-showcase` commits already landed the base infrastructure for this pass:
   - cover image loading
   - display-name support
   - chevron pagination controls
   - GitHub proxy plumbing for CI, contributor stats, language summary, and repo proofs
   - reveal/proportion-bar animation scaffolding

2. Recent sibling block work in `about-timeline`, `blog-post`, and `site-shell` reinforces the current reveal, hover, and focus treatment used across the theme. New UI changes should stay inside the existing WPDS-backed surface and interaction patterns instead of introducing a one-off visual system.

3. No new REST routes or shared icon additions are currently required. The remaining parity work is primarily block-local plus curated JSON refreshes.

## Keep vs Remove

### Keep

- The IntersectionObserver/CSS reveal implementation in `view.js` and `style.css` stays. It is an acceptable WordPress platform substitute for React `Reveal` and framer-motion behavior.

### Remove

- All seven WP-only block attributes listed in "User Directive".
- Any `openInNewTab` prop plumbing that still flows through render and component props.
- Any conditional behavior that exists only because those attributes exist.

## Gap Inventory

### High

1. **Featured case studies still diverge from React layout and interaction**
   - **Files**: `blocks/work-showcase/view.js`, `blocks/work-showcase/style.css`
   - **Why it matters**: React renders a cover-first card with updated-date ordering after selection, single-item case-study breakdowns, lighter architecture preview, and card-level navigation. WordPress still uses a denser editorial layout with two bullets per column and a separate CTA.

2. **Engineering Signals logic is not parity-accurate**
   - **Files**: `blocks/work-showcase/view.js`
   - **Why it matters**: React computes language volume from recently updated public GitHub repos only, while contributor, CI, and repo-proof signals use all public GitHub repos. The WordPress version currently mixes those scopes and simplifies several fallback and copy states, so visible numbers and card messaging can drift.

3. **Curated repo and case-study data is stale for visible featured projects**
   - **Files**: `blocks/work-showcase/data/repos.json`, `blocks/work-showcase/data/repo-case-study-details.json`
   - **Why it matters**: prominent featured repos such as `ai-cli-web-funnel` and `ai-prompt-pro` do not fully match the React source content, which changes the visible summaries and case-study framing.

### Medium

4. **Focus-area cards use the wrong disclosure model**
   - **Files**: `blocks/work-showcase/view.js`, `blocks/work-showcase/style.css`
   - **Why it matters**: React uses an explicit disclosure button with `aria-controls` and `aria-expanded`. WordPress currently turns the entire card into a button-like surface and uses badge-based toggles, which changes interaction and accessibility cues.

5. **Pending repository preview rows are not navigable**
   - **Files**: `blocks/work-showcase/view.js`
   - **Why it matters**: React links each pending row to `/work/{repo}`. WordPress currently renders static rows, removing an expected path into those case studies.

### Low

6. **Filter/header polish still trails React**
   - **Files**: `blocks/work-showcase/view.js`, `blocks/work-showcase/style.css`
   - **Why it matters**: the main behavior is present, but the control copy, spacing, and summary treatment still feel simpler than the source page.

## Scope

Expected touched files for this pass:
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/block.json`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php`

Because there are high-severity gaps and the user chose to remove all WP-only block extras, this remains a **full-plan** remediation.

## Implementation Phases

### Phase 1: Data and Metadata Alignment

**Goal**: remove WordPress-only configurability and refresh the curated data that drives visible content.

#### 1a. Sync curated repo summaries

Refresh visible repo metadata in `blocks/work-showcase/data/repos.json` from the React source `src/data/repos.ts`, with priority on featured repos surfaced on the work page.

#### 1b. Sync case-study detail content

Refresh `blocks/work-showcase/data/repo-case-study-details.json` from `src/data/repo-case-study-details.ts`, especially for:
- `ai-cli-web-funnel`
- `ai-prompt-pro`
- any other currently featured repos whose why/problem/approach/result/highlights changed

#### 1c. Remove all WP-only block attributes

- Delete the seven extra attributes from `block.json`.
- Remove matching defaults/config keys from `render.php`.
- Remove `parseConfig()` handling and downstream prop plumbing from `view.js`.

After this phase, the block should always behave like the React page defaults:
- default GitHub include/exclude behavior is fixed in code
- Engineering Signals always renders
- sparkline behavior follows the React source instead of editor toggles

### Phase 2: Featured Case Studies and Supporting Interaction Parity

**Goal**: bring the most visible layout and navigation surfaces back in line with React.

#### 2a. Featured case study selection and display ordering

Keep the React selection rule from `Work.tsx`:
- filter to featured repos with complete case-study triptychs
- sort by `featuredPriority`, then `updatedAt`
- slice to `FEATURED_CASE_STUDY_LIMIT`

Then match `WorkFeaturedCaseStudies.tsx` by re-sorting the selected set by `updatedAt` for display.

#### 2b. Featured case study card structure

Update the WordPress card so it matches React more closely:
- cover image before the title
- top row with badges on the left and updated date on the right
- display title via `getRepoDisplayName()`
- case-study breakdown limited to one item each for challenge, approach, and result
- highlights limited to two items
- architecture preview reduced to summary or first bullet instead of the current heavier box
- direct card-level navigation to `/work/{repo}` instead of a separate "View Case Study" CTA

#### 2c. Focus-area disclosure behavior

Refactor `RoleGroups` to use an explicit disclosure button pattern matching `WorkRoleGroups.tsx`:
- keep the card itself as a normal article/surface
- move expansion to a dedicated button
- use `aria-controls` and `aria-expanded`
- keep the current proportion-bar animation if it continues to behave correctly

#### 2d. Pending repository links and filter/header polish

- Convert pending preview rows into links to `/work/{repo}`.
- Tighten filter summary copy, spacing, and control treatment to better match React `WorkFiltersBar` and `WorkRepositoryLibrary`.

### Phase 3: Engineering Signals Parity

**Goal**: make the visible stats and fallback messaging match the React implementation.

#### 3a. Split signal scopes correctly

Match React data scope exactly:
- contributor stats, CI status, and repo proofs use all public GitHub repos
- language summary uses only recently updated public GitHub repos

#### 3b. Port React summary logic and copy

Align `SignalsPanel` with `WorkSignalsPanel.tsx` for:
- commit summary readiness/computing/missing states
- CI breakdown including `passing`, `failing`, `running`, `none`, `neutral`, and unavailable coverage states as needed
- language summary fallback wording and metadata-weighted fallback behavior
- delivery/community copy, release summary, and coverage lines

#### 3c. Keep existing signal infrastructure where valid

Do not reintroduce removed features or create new proxy endpoints. Reuse the currently landed fetch helpers and state maps unless a React parity mismatch requires a block-local adjustment.

## Verification

Run after each phase where relevant:

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
php -l wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api
```

Final verification:

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:browser
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

Then re-run the parity checker for `work-showcase` and confirm the result improves to `PARITY` or `MINOR_DRIFT`.
