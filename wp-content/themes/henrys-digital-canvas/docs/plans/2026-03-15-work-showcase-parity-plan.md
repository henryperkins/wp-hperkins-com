# Work Showcase Parity Remediation Plan

> Manual implementation plan generated from `docs/plans/2026-03-15-work-showcase-parity-design.md` because the `writing-plans` skill is not available in this session.

**Goal:** bring `work-showcase` back to React parity by removing WP-only block metadata, refreshing curated data, and fixing the remaining featured-card, focus-area, pending-list, and Engineering Signals gaps.

**Primary files:**
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/block.json`
- `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php`

---

## Chunk 1: Data and Metadata Alignment

### Task 1: Refresh curated repo and case-study data

- [ ] Sync featured repo summaries in `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json` from `/home/azureuser/henry-s-digital-canvas/src/data/repos.ts`.
- [ ] Sync visible case-study entries in `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json` from `/home/azureuser/henry-s-digital-canvas/src/data/repo-case-study-details.ts`.
- [ ] Prioritize `ai-cli-web-funnel`, `ai-prompt-pro`, and any other currently featured repos whose visible text changed.

### Task 2: Remove WP-only block metadata extras

- [ ] Delete `repoCount`, `includeForks`, `includeArchived`, `openInNewTab`, `showSignalsPanel`, `showActivitySparkline`, and `sparklineWeeks` from `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/block.json`.
- [ ] Remove matching defaults and config keys from `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php`.
- [ ] Remove matching `parseConfig()` fields and any dependent prop plumbing from `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`.
- [ ] Remove any remaining `openInNewTab` props passed into child components.

### Task 3: Validate Chunk 1

- [ ] Run `node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`.
- [ ] Run `php -l wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php`.
- [ ] Run `cd wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api`.

---

## Chunk 2: Featured Case Studies and Interaction Parity

### Task 4: Align featured case study selection and render order

- [ ] Keep selection logic in `view.js` consistent with React `Work.tsx`: filter complete featured repos, sort by `featuredPriority`, then `updatedAt`, then slice to `FEATURED_CASE_STUDY_LIMIT`.
- [ ] Re-sort the selected featured set by `updatedAt` before rendering, matching `WorkFeaturedCaseStudies.tsx`.

### Task 5: Rebuild featured case study cards to match React density

- [ ] Update `FeaturedCaseStudies` in `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` so each card renders cover-first, then the title and summary, like the React component.
- [ ] Limit challenge/approach/result breakdowns to one visible item each.
- [ ] Limit highlights to two items.
- [ ] Reduce the architecture preview to the React-style lighter summary/first-bullet treatment.
- [ ] Replace the separate `View Case Study` CTA with direct card-level navigation to `/work/{repo}`.

### Task 6: Align focus-area interaction model

- [ ] Refactor `RoleGroups` so expansion is controlled by an explicit disclosure button, not the entire card.
- [ ] Keep `aria-controls` and `aria-expanded` on the disclosure control.
- [ ] Preserve the already-landed proportion-bar animation if it still works after the refactor.
- [ ] Update `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css` to support the button-based pattern and remove any now-unused whole-card interactive styling.

### Task 7: Fix pending repo navigation and filter/header polish

- [ ] Convert pending preview rows into links to `/work/{repo}`.
- [ ] Tighten filter/header copy and spacing in `view.js` and `style.css` so they better match React `WorkFiltersBar` and `WorkRepositoryLibrary`.

### Task 8: Validate Chunk 2

- [ ] Run `node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`.
- [ ] Run `cd wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api`.

---

## Chunk 3: Engineering Signals Parity

### Task 9: Fix signal scopes to match React

- [ ] Keep contributor stats, CI status, and repo proofs scoped to all public GitHub repos.
- [ ] Change language summary loading to use only recently updated public GitHub repos, matching React `Work.tsx`.

### Task 10: Port React summary and fallback logic

- [ ] Update `SignalsPanel` in `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` to match `WorkSignalsPanel.tsx` for loading, pending, unavailable, coverage, and fallback copy.
- [ ] Align commit summary readiness/computing/missing handling with the React implementation.
- [ ] Align CI summary and delivery-health messaging with the React implementation.
- [ ] Align language-summary fallback behavior and copy with the React implementation.
- [ ] Keep the existing proxy helpers unless a parity mismatch requires a local adjustment.

### Task 11: Validate Chunk 3

- [ ] Run `node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`.
- [ ] Run `cd wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api`.

---

## Chunk 4: Final Verification

### Task 12: Browser and cache verification

- [ ] Run `cd wp-content/themes/henrys-digital-canvas && npm run smoke:browser`.
- [ ] Run `wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush`.

### Task 13: Re-run parity check

- [ ] Re-run the `work-showcase` parity check.
- [ ] Confirm the block now reports `PARITY` or `MINOR_DRIFT`.
- [ ] If any drift remains, capture only the remaining deltas instead of reopening already fixed work.
