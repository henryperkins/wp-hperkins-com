# Blog Index Parity Remediation Design

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

**Date**: 2026-04-03
**Block**: `blog-index`
**Source of truth**: `/home/azureuser/henry-s-digital-canvas/src/pages/Blog.tsx`
**Verdict**: `NEEDS_WORK` (2 high, 3 medium, 3 low)

## User Decisions

- Remove `heading` and `description` block attributes for strict React parity.
- Remove the unused `Show LinkedIn + contact CTA` editor toggle.
- Keep the inline fallback JSON path and fallback URL behavior.

## Reusable Patterns And Guardrails

- `blocks/home-page/view.js` already shows the preferred pattern for keeping page chrome mounted while swapping only the inner loading, error, and empty content.
- `blocks/blog-post/view.js` and `blocks/blog-post/style.css` already use the desired state-card density, icon badge treatment, and retry affordance.
- Shared blog REST contracts already expose `featured`, `tags`, `readingTime`, `featuredImageAlt`, and `featuredImageSrcSet`; no REST or data-contract changes are required.
- Shared Lucide icons already include `loader-2`, `alert-circle`, `inbox`, `search`, `clock`, `arrow-right`, `linkedin`, and `mail`; no `assets/js/hdc-shared-utils.js` work is required.
- `blocks/blog-index/style.css` already has local uncommitted changes in the worktree. Implementation must make surgical edits and avoid clobbering unrelated style work.

## Problem

The current WordPress block matches React reasonably well on the happy path, but it still diverges in the most visible resilience states: loading, fetch failure, and zero-post cases. It also builds archive filter tags from all posts instead of archive posts only, which lets the featured post create filter chips that resolve to an empty archive state React never exposes.

## Scope

### Phase 1: Structural Parity

#### 1. Keep the page hero and shell mounted in every state

React always renders the page hero and the main section shell, then swaps only the content region between `LoadingState`, `ErrorState`, and the loaded archive. The WordPress block currently early-returns standalone loading, error, and no-post cards, which changes the page hierarchy and first-paint layout.

Implementation:

- `blocks/blog-index/render.php`: replace the bare `Loading posts...` shell with SSR markup that already renders the hero wrapper and a content-region loading state placeholder.
- `blocks/blog-index/render.php`: stop sourcing hero copy from block attributes and output the fixed React copy instead.
- `blocks/blog-index/view.js`: remove the early returns for loading, error, and zero-post states; always render the hero, browse card, archive region, and CTA shell.
- `blocks/blog-index/style.css`: make sure the state cards are styled as in-section content rather than whole-page replacements.

#### 2. Derive archive tags from archive posts only

React computes tag chips from `archivePosts`, excluding the featured post. The WordPress block currently derives tags from all posts, so users can choose a tag that exists only on the featured post and land on an empty archive.

Implementation:

- `blocks/blog-index/view.js`: derive `archivePosts` from non-featured posts.
- `blocks/blog-index/view.js`: build `allTags` from `archivePosts` only.
- `blocks/blog-index/view.js`: keep the existing active-tag reset effect so removed tags fall back to `All`.

### Phase 2: Copy And Semantics

#### 3. Align archive summary, browse description, and empty-state copy

React uses contextual copy for featured-only, no-post, filtered-no-results, and archive-updating cases. The WordPress block currently falls back to static or misleading text such as `0 archive posts ready to read`.

Implementation:

- `blocks/blog-index/view.js`: mirror React's `archiveSummaryLabel` logic, including `Featured post only` and `No published posts yet`.
- `blocks/blog-index/view.js`: mirror React's `browseDescription` logic for search, active tag, featured-only, and no-post states.
- `blocks/blog-index/view.js`: mirror React's `emptyStateTitle` and `emptyStateDescription` branching.

#### 4. Align loading and error copy

The block already has a retry affordance, but the visible messaging is still drifted from the source component.

Implementation:

- `blocks/blog-index/view.js`: use `Please wait while the latest posts are prepared.` for loading.
- `blocks/blog-index/view.js`: use `The blog index could not be loaded right now. Try again in a moment.` for error.
- Keep the current retry button behavior.

#### 5. Rebuild ItemList JSON-LD from currently listed posts

React builds ItemList schema from the posts that are actually being shown to the user: featured plus the currently visible archive slice. The WordPress block currently emits schema for all fetched posts and only includes `position` plus `url`.

Implementation:

- `blocks/blog-index/view.js`: compute `listedPosts = featured ? [ featured, ...visiblePosts ] : visiblePosts`.
- `blocks/blog-index/view.js`: emit JSON-LD only for `listedPosts`.
- Include `name`, `description`, `image`, `position`, and absolute `url`, matching the React `buildBlogItemListJsonLd()` shape.

### Phase 3: Low-Severity Polish And Strict Extras Cleanup

#### 6. Align date and image fallback text

Implementation:

- `blocks/blog-index/view.js`: change invalid date fallback from the raw source string to `Date unavailable`, matching React `safeFormatDate()`.
- `blocks/blog-index/view.js`: change the featured image alt fallback to `Featured image for ${title}`.

#### 7. Reduce archive row thumbnail density drift

Implementation:

- `blocks/blog-index/view.js`: align row image `sizes` with React's `(min-width: 640px) 112px, 96px`.
- `blocks/blog-index/style.css`: reduce row thumbnail sizing and layout proportions so the row cards read closer to React's `ContentCardImage` treatment without rewriting the whole card structure.

#### 8. Remove WordPress-only editor extras

Implementation:

- `blocks/blog-index/block.json`: remove `heading` and `description` attributes.
- `blocks/blog-index/index.js`: remove the inspector text controls and the dead CTA toggle; leave a simple informational editor preview.
- `blocks/blog-index/render.php`: stop reading `$attributes` for hero copy.

## File Impact

- `blocks/blog-index/view.js`
- `blocks/blog-index/render.php`
- `blocks/blog-index/style.css`
- `blocks/blog-index/index.js`
- `blocks/blog-index/block.json`

Total: 5 files

## Out Of Scope

- Inline fallback payload and fallback URL stay in place as accepted WordPress-only resilience behavior.
- Existing reveal animations, featured/share CTA structure, and REST plumbing stay in place unless implementation uncovers a direct parity blocker.

## Verification

After each implementation chunk:

- `node -c blocks/blog-index/view.js`
- `node -c blocks/blog-index/index.js`
- `php -l blocks/blog-index/render.php`

Full verification:

- `npm run smoke:route`
- `npm run smoke:api`
- `wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush`
- `npm run smoke:browser`
- Re-run the parity checker for `blog-index`; expected result is `PARITY` or `MINOR_DRIFT` with only accepted WordPress extras remaining.
