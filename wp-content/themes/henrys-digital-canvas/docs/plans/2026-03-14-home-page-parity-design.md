# Home Page Block Parity Design

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

**Date**: 2026-03-14
**Block**: `home-page`
**Source**: `Home.tsx`
**Verdict**: NEEDS_WORK (1 high, 3 medium, 2 low)

## Extras Decision

- Remove: block-level Open Graph and Twitter meta tags from `render.php`
- Remove: client-side `document.title` mutation from `view.js`

## Reusable Patterns Already In The Working Tree

- `assets/js/hdc-shared-utils.js` already contains the Lucide `quote` icon, so the throughline quote card does not need new shared icon work.
- `assets/css/design-system.css` already contains `.screen-reader-text`, so no additional accessibility utility work is needed.
- `inc/data-contracts.php` already merges `blocks/work-showcase/data/repos.json` with `blocks/work-showcase/data/repo-case-study-details.json` for the `/work` REST contract, so curated repo naming can be fixed at the work-data source instead of in a home-page-only map.

## Gap List

### High

| Gap | Where | React expected | WP current | Fix |
|-----|-------|----------------|------------|-----|
| Featured repo titles can drift from canonical display names | `blocks/home-page/view.js`, work data JSON | Home cards use `getRepoDisplayName(repo)` and render curated names like `Prompt Forge` | Home cards prefer a partial `repoTitles` map and fall back to slug humanization | Add canonical `displayName` values to the work data contract and make home-page prefer `repo.displayName` before any fallback |

### Medium

| Gap | Where | React expected | WP current | Fix |
|-----|-------|----------------|------------|-----|
| Recent Writing should render populated cards on first paint | `blocks/home-page/render.php`, `blocks/home-page/view.js` | React renders local data immediately, then refreshes | WP shows `Loading recent writing...` before fetch resolves | Embed initial blog payload in block config and revalidate in the background |
| Resume Snapshot should render populated content on first paint | `blocks/home-page/render.php`, `blocks/home-page/view.js` | React imports resume data synchronously | WP shows `Loading resume data...` before fetch resolves | Embed initial resume payload in block config and revalidate in the background |
| Date-only values can shift by timezone | `blocks/home-page/view.js` | React normalizes `YYYY-MM-DD` strings to noon before formatting | WP uses `new Date(rawDate)` directly | Add a date parser mirroring React's `parseRepoDate()` behavior and reuse it for repo/post formatting and sorting |

### Low

| Gap | Where | React expected | WP current | Fix |
|-----|-------|----------------|------------|-----|
| Loading and empty states are still simpler than React | `blocks/home-page/view.js`, `blocks/home-page/style.css` | React uses shaped skeletons and stronger empty-state treatment | WP still uses plain loading text for some sections and simpler fallback boxes | Upgrade section fallback markup and loading placeholders so they read as deliberate state UI |
| Empty hero eyebrow node should not render | `blocks/home-page/view.js` | Home hero omits the eyebrow entirely when empty | WP always renders an empty eyebrow `<p>` | Render the eyebrow only when the configured value is non-empty |

## Implementation Phases

### Phase 1: Canonical Work Data + Extras Cleanup

1. Add curated `displayName` values in `blocks/work-showcase/data/repo-case-study-details.json` for the homepage-featured repositories that have React display names.
2. Update `blocks/home-page/view.js` so normalized repo objects carry `displayName` through from work-contract data.
3. Change home-page title selection to prefer `repo.displayName`, then `repoTitles`, then slug humanization.
4. Remove the block-level OG/Twitter meta tags from `blocks/home-page/render.php`.
5. Remove the `document.title` effect from `blocks/home-page/view.js`.

### Phase 2: First-Paint Data Parity

1. In `blocks/home-page/render.php`, embed `initialPosts` from `hdc_get_blog_posts_data_contract( 3 )`.
2. In `blocks/home-page/render.php`, embed `initialResume` from `hdc_get_resume_data_contract()`.
3. In `blocks/home-page/view.js`, parse those payloads and initialize `postsState` and `resumeState` from config.
4. Keep the existing fetches as background revalidation; do not regress live refresh behavior.
5. If revalidation fails and initial data exists, preserve the initial payload instead of swapping to an empty state.

### Phase 3: Date Stability + State Polish

1. Add a `parseRepoDate`-style helper in `blocks/home-page/view.js` that appends `T12:00:00` to date-only strings.
2. Reuse that helper in `formatDate()` and `getUpdatedAtTimestamp()`.
3. Replace remaining plain-text loading/fallback UI with structured state markup closer to React's card and empty-state treatment.
4. Make hero eyebrow rendering conditional.

## File Impact Summary

| File | Purpose |
|------|---------|
| `blocks/home-page/render.php` | Remove body-level meta tags; embed initial posts and resume data in block config |
| `blocks/home-page/view.js` | Prefer `displayName`, remove title mutation, initialize state from config, normalize dates, polish fallback UI, skip empty eyebrow |
| `blocks/home-page/style.css` | Support richer loading and empty states if markup changes require styling |
| `blocks/work-showcase/data/repo-case-study-details.json` | Add canonical `displayName` values used by the shared work data contract |

Total: 4 files
