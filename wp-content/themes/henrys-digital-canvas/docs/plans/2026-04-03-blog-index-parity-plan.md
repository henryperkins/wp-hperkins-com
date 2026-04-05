# Blog Index Parity Remediation Plan

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

> Manual implementation plan generated from `docs/plans/2026-04-03-blog-index-parity-design.md` because the `writing-plans` skill is not available in this session.

**Goal:** bring `blog-index` back to React parity by fixing shell/state handling, archive tag derivation, contextual copy, ItemList schema, and the remaining low-severity content drifts while removing the editor-only block extras the user chose to drop.

**Primary files:**

- `wp-content/themes/henrys-digital-canvas/blocks/blog-index/view.js`
- `wp-content/themes/henrys-digital-canvas/blocks/blog-index/render.php`
- `wp-content/themes/henrys-digital-canvas/blocks/blog-index/style.css`
- `wp-content/themes/henrys-digital-canvas/blocks/blog-index/index.js`
- `wp-content/themes/henrys-digital-canvas/blocks/blog-index/block.json`

---

## Chunk 1: Editor Cleanup And SSR Shell Alignment

### Task 1: Remove WordPress-only editor extras

- [ ] Delete `heading` and `description` attributes from `wp-content/themes/henrys-digital-canvas/blocks/blog-index/block.json`.
- [ ] Remove the matching `TextControl` inspector fields from `wp-content/themes/henrys-digital-canvas/blocks/blog-index/index.js`.
- [ ] Remove the dead `Show LinkedIn + contact CTA` toggle and any unused imports from `wp-content/themes/henrys-digital-canvas/blocks/blog-index/index.js`.
- [ ] Keep a simple editor preview with the fixed React hero title and description.

### Task 2: Move SSR output to the React-style page shell

- [ ] Update `wp-content/themes/henrys-digital-canvas/blocks/blog-index/render.php` so SSR renders the hero wrapper and a content-region loading state instead of a bare `Loading posts...` line.
- [ ] Hard-code the React hero copy in `render.php` now that the block attributes are being removed.
- [ ] Preserve `data-config`, `data-fallback-payload`, and the current endpoint/fallback wiring.

### Task 3: Validate Chunk 1

- [ ] Run `node -c wp-content/themes/henrys-digital-canvas/blocks/blog-index/index.js`.
- [ ] Run `php -l wp-content/themes/henrys-digital-canvas/blocks/blog-index/render.php`.

---

## Chunk 2: View Logic Parity

### Task 4: Keep the page shell mounted through loading, error, and zero-post states

- [ ] Refactor `wp-content/themes/henrys-digital-canvas/blocks/blog-index/view.js` so loading, error, and zero-post states render inside the main page section rather than replacing the whole page shell.
- [ ] Keep the current retry behavior, reveal initialization, and fallback-loading flow intact unless they directly block parity.
- [ ] Reuse the existing state-card treatment already established in sibling blocks.

### Task 5: Align archive data shaping and copy

- [ ] Derive `archivePosts` from non-featured posts only.
- [ ] Build `allTags` from `archivePosts` only.
- [ ] Keep `visibleCount` reset behavior on search and tag changes.
- [ ] Mirror React's `archiveSummaryLabel`, `browseDescription`, `emptyStateTitle`, and `emptyStateDescription` logic.
- [ ] Align loading and error descriptions with the React copy.

### Task 6: Align ItemList schema and fallback text

- [ ] Compute `visiblePosts` and `listedPosts` exactly as React does.
- [ ] Emit ItemList JSON-LD from `listedPosts`, not all fetched posts.
- [ ] Include `name`, `description`, `image`, `position`, and absolute `url` in the schema items.
- [ ] Change invalid date fallback text to `Date unavailable`.
- [ ] Change image alt fallback text to `Featured image for ${title}`.

### Task 7: Validate Chunk 2

- [ ] Run `node -c wp-content/themes/henrys-digital-canvas/blocks/blog-index/view.js`.

---

## Chunk 3: Style Drift And Verification

### Task 8: Reduce row-thumbnail and state-spacing drift

- [ ] Update `wp-content/themes/henrys-digital-canvas/blocks/blog-index/style.css` so the row-thumbnail sizing reads closer to React's `112px / 96px` responsive treatment.
- [ ] Make sure loading, error, and empty cards sit cleanly inside the page section without collapsing hero spacing.
- [ ] Preserve unrelated local edits already present in `blocks/blog-index/style.css`.

### Task 9: Run end-to-end verification

- [ ] Run `node -c wp-content/themes/henrys-digital-canvas/blocks/blog-index/view.js`.
- [ ] Run `node -c wp-content/themes/henrys-digital-canvas/blocks/blog-index/index.js`.
- [ ] Run `php -l wp-content/themes/henrys-digital-canvas/blocks/blog-index/render.php`.
- [ ] Run `cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api`.
- [ ] Run `cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npm run smoke:browser`.
- [ ] Run `wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush`.
- [ ] Re-run the parity checker for `blog-index`; expected result is `PARITY` or `MINOR_DRIFT` with only accepted WordPress extras remaining.
