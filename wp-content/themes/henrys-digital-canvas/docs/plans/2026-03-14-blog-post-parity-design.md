# Blog Post Block Parity Design

**Date**: 2026-03-14
**Block**: `blog-post`
**Source**: `BlogPost.tsx`
**Verdict**: NEEDS_WORK (2 high, 3 medium, 1 low)

## Extras Decision

- Keep: `showProgress` and `showScrollTop` block attributes. They are acceptable WP controls as long as routed usage keeps both enabled.
- Keep: slug inference from the attribute, query string, body classes, and pathname. It is a pragmatic WP routing adaptation and does not harm parity.

## Reusable Patterns Already In The Working Tree

- `blocks/blog-index/render.php` and `blocks/blog-index/view.js` already use `data-fallback-payload` to render local blog data immediately and revalidate in the background. Reuse that same first-paint fallback pattern for `blog-post`.
- `assets/js/hdc-shared-utils.js` already provides `parseDate()`, `estimateReadingTimeLabel()`, and the shared Lucide nodes used by this block (`arrow-left`, `clock`, `check`, `copy`, `chevron-up`), so no new date or copy-icon infrastructure is required.
- `assets/css/design-system.css` already includes `.screen-reader-text`, which can support hidden copy/status text if the code-block toolbar is upgraded.
- Recent blog-contract work in commit `f9acaef9` already touched `blocks/blog-post/*`, `blocks/blog-index/*`, `data/blog-posts-fallback.json`, and `inc/data-contracts.php`; implementation should reuse that contract rather than introduce a block-local payload shape.
- Current uncommitted work is isolated to `blocks/site-shell/*`; there are no sibling block parity fixes in flight that `blog-post` needs to mirror.

## Gap List

### High

| Gap | Where | React expected | WP current | Fix |
|-----|-------|----------------|------------|-----|
| HTML-backed code blocks do not use the article code-block UI | `blocks/blog-post/view.js`, `blocks/blog-post/style.css` | Both markdown and HTML `pre > code` nodes render the same toolbar, language label, copy control, and highlighted output | Only markdown-created `.hdc-blog-post__code` blocks get enhanced; HTML-backed posts render plain `pre > code` | Normalize HTML `pre > code` into the same upgraded DOM used by markdown code blocks before or immediately after render, then run one enhancement path for both |
| Loading and not-found states are materially simpler than source | `blocks/blog-post/render.php`, `blocks/blog-post/view.js`, `blocks/blog-post/style.css` | Structured state card with iconography, heading hierarchy, descriptive copy, and button-style CTA | Plain loading paragraph and a simpler error card with a text link | Replace both states with deliberate card UI and preserve React-like loading vs not-found semantics |

### Medium

| Gap | Where | React expected | WP current | Fix |
|-----|-------|----------------|------------|-----|
| Placeholder-first post lookup behavior | `blocks/blog-post/render.php`, `blocks/blog-post/view.js` | Local placeholder posts render immediately while remote data resolves | Block waits on fetch before showing any article content | Embed inline fallback payload, initialize state from it, then revalidate detail and list fetches in the background |
| Markdown jump-nav ignores headings inside code fences | `blocks/blog-post/view.js` | Heading extraction parses only text segments | Raw line scan can capture `##` and `###` inside fenced blocks | Introduce a shared markdown segment parser and reuse it for both heading extraction and content rendering |
| Markdown code-block UI is only approximate | `blocks/blog-post/view.js`, `blocks/blog-post/style.css` | Toolbar-on-top layout, normalized language label, highlighted output, and success or error copy feedback | Bottom-right button, narrower language normalization, and no explicit copy-failure feedback | Refactor markdown and HTML code blocks onto one shared code-block renderer and feedback state model |

### Low

| Gap | Where | React expected | WP current | Fix |
|-----|-------|----------------|------------|-----|
| Featured-image fallback alt copy differs | `blocks/blog-post/view.js` | `Featured image for {title}` | `{title} featured image` | Update fallback string to match the source copy |

## Implementation Phases

### Phase 1: First-paint lookup parity and state gating

1. In `blocks/blog-post/render.php`, embed the local blog fallback payload via `data-fallback-payload`, reusing the `blog-index` pattern.
2. In `blocks/blog-post/view.js`, parse that payload and initialize `posts` and `post` state from inline data when available.
3. Preserve React's lookup semantics: show loading while placeholder data is still resolving a missing slug, but show not-found only after remote and detail resolution settles.
4. Keep remote detail fetches as background revalidation; if revalidation fails and inline data contains the post, keep the inline post instead of dropping to error.

### Phase 2: Unified code-block renderer for markdown and HTML

1. Add a markdown segment parser in `blocks/blog-post/view.js` that explicitly tracks fenced code blocks; reuse it for heading extraction and markdown rendering.
2. Replace the current markdown `pre` markup with a shared code-block shell that matches the React toolbar hierarchy more closely: top toolbar, normalized language label, copy button, and visually isolated scroll area.
3. For HTML-backed posts, transform each `pre > code` node into the same code-block shell, deriving language from `language-*` and `lang-*` class names before the HTML is injected or immediately after render.
4. Upgrade copy handling to include success and failure states, with fallback copy behavior when `navigator.clipboard` is unavailable.
5. Run one syntax-highlighting pass against both markdown and HTML code blocks so the two content paths stay behaviorally identical.

### Phase 3: Loading and not-found state parity

1. Replace the loading paragraph in `render.php` and `view.js` with structured state-card markup closer to the React `LoadingState`.
2. Replace the simplified error card with a state card that preserves the current copy but upgrades hierarchy, spacing, and CTA treatment to match the source page more closely.
3. Keep the implementation block-local and token-based, reusing existing WPDS-backed theme variables from `design-system.css`.
4. Add any missing accessibility hooks such as hidden status text and clear button labels.

### Phase 4: Drift cleanup

1. Update `buildImageAlt()` to match the React fallback copy exactly.
2. Re-run jump-nav generation against markdown posts with fenced headings to confirm only visible section headings appear.
3. Verify HTML-backed posts with `<pre><code class="language-javascript">...</code></pre>` now show the same upgraded code UI as markdown posts.

## File Impact Summary

| File | Purpose |
|------|---------|
| `blocks/blog-post/render.php` | Embed inline fallback payload and improve the server-rendered loading placeholder shell |
| `blocks/blog-post/view.js` | Add placeholder-first lookup flow, shared markdown parser, unified code-block rendering, copy fallback and error states, and alt-text fix |
| `blocks/blog-post/style.css` | Style the upgraded state cards and shared code-block UI |
| `assets/js/hdc-shared-utils.js` | Optional only if extra state-card icons are added through the shared icon helper |

Total planned touch points: 3 required files, 1 optional shared helper file.

## Verification

After each phase:

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js
```

After implementation:

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

Final check:

- Browser-check the live blog post route and an HTML-backed post with a code block.
- Re-run parity checker and target `PARITY` or `MINOR_DRIFT`.
