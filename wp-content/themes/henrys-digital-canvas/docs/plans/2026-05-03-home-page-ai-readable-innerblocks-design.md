# Home Page AI-Readable innerBlocks Design

**Date**: 2026-05-03
**Block**: `henrys-digital-canvas/home-page` (parent) + 6 new child blocks
**Source of truth**: `https://hperkins.com/` (live React site)
**Supporting source files**:
- `wp-content/themes/henrys-digital-canvas/blocks/home-page/render.php` (current monolith)
- `wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js` (~46KB, current monolith)
- `wp-content/themes/henrys-digital-canvas/blocks/home-page/style.css` (~18KB)
- `wp-content/themes/henrys-digital-canvas/data/home-content.json` (default content)
- `wp-content/themes/henrys-digital-canvas/inc/data-contracts.php` → `hdc_get_home_content_data_contract()`
- `wp-content/themes/henrys-digital-canvas/scripts/sync_page_sources.php` (front-page record seed)

**Verdict**: NEW WORK (no predecessor — this is the first innerBlocks split in this theme)

## Goal

Restructure the `home-page` block from a single monolithic block (no editor-side attributes) into a parent block with six structured child section blocks. Each child exposes its content as native Gutenberg attributes and gets its style/layout via native block `supports`. The result:

- An AI consumer reading the front page (via `wp.data` in the editor or `GET /wp/v2/pages/{id}` headlessly) sees a structured, well-named attribute tree per section instead of an opaque shell with a `data-config` JSON blob.
- An editor (human or AI) can customize any section's copy, links, layout, spacing, border, color, and typography through standard Inspector panels.
- The default state of the front page mirrors `https://hperkins.com/` exactly. Customization is layered on top; absent any overrides, the rendered page matches the live React site.

## Hard Invariants

1. **Mirror hperkins.com by default.** With no editor overrides applied, the rendered front page must match `https://hperkins.com/` in DOM structure, class names, computed styles (padding, margin, border, font-size, line-height, color, background-color, text-align, layout properties), and visible text. Verified by an automated parity test (see Testing Strategy).
2. **Customization is layered, never destructive.** Block `supports` attributes default to undefined / inherited so base CSS wins out of the box. Content attribute defaults are seeded from `data/home-content.json`. Customizations only apply when an editor explicitly sets a value.
3. **No `!important` in section CSS** on any property covered by native `supports` (padding, margin, border, color, background-color, font-size, line-height, font-family, font-weight, text-align). Block-supports inline styles must always win.
4. **AI write path is incidental, not custom.** No bespoke endpoints. Standard Gutenberg APIs (`updateBlockAttributes`, `POST /wp/v2/pages/{id}` with rebuilt block markup) are sufficient and tested only for shape, not for AI-tool integration.

## User Decisions

- Architecture: **Option C** (innerBlocks split into a parent + 6 children) — confirmed.
- Granularity: full content tree exposed as attributes (~50 fields total across 6 children). All content fields editable in Inspector panels — no fields locked to JSON only.
- Defaults: **JSON-seeded for the front page; hand-maintained for new insertions.** `data/home-content.json` is the source of truth for default values. The sync script (`scripts/sync_page_sources.php`) inlines values from the JSON directly into the front-page post_content. Each child's `block.json` defaults and the parent's `template` config are hand-maintained — initially seeded from `home-content.json` at implementation time, with documented convention to update them when the JSON changes. Auto-sync of `block.json` defaults from `home-content.json` is future work.
- Style supports: native, whole-set per child (`align`, `color`, `spacing`, `border`, `typography`, `dimensions`). No `shadow`, no `aspectRatio` (not present on hperkins.com).
- Template lock: `'all'` for v1 (children cannot be added, removed, or reordered). Relaxation to `'insert'` is future work.
- AI write path: enabled (no extra effort to permit, since attributes are first-class).

## Architecture

`home-page` becomes a parent block whose only job is to mount six child blocks. Each child owns its section's content, layout, and behavior.

```
henrys-digital-canvas/home-page             (parent — wrapper only)
├── henrys-digital-canvas/home-hero
├── henrys-digital-canvas/home-selected-work
├── henrys-digital-canvas/home-throughline
├── henrys-digital-canvas/home-resume-snapshot
├── henrys-digital-canvas/home-recent-writing
└── henrys-digital-canvas/home-contact-cta
```

### Parent block: `home-page`

- `block.json`:
  - `template` declares the 6 children in order, each with content attribute defaults inlined.
  - `templateLock: "all"`.
  - No content attributes of its own.
  - `supports`: `align: ["full"]` only (whole-page alignment). No spacing/border on the wrapper — those belong to children.
- `render.php`: opens `<section class="hdc-home-page alignfull">`, echoes `$content` (the rendered children, supplied by core's dynamic-block render args), closes the section. No `data-config` JSON, no shell placeholder, no resume/posts/repos preload. Approximately 10 lines.
- `index.js`: `edit()` returns `<InnerBlocks template={...} templateLock="all" allowedBlocks={[...the 6...]} />`. `save()` returns `<InnerBlocks.Content />`.
- **`view.js`: deleted.** All client logic moves to per-child view scripts.

### Child blocks (common shape)

Each child has:
- `block.json` with: `parent: ["henrys-digital-canvas/home-page"]`, `apiVersion: 3`, content attributes, `supports`, `editorScript`, `render`, `style`, `editorStyle`, optional `viewScript`.
- `index.js` with an `edit()` function that:
  - Renders an `InspectorControls` tree of `PanelBody` panels for the section's content fields.
  - Renders an editor preview using current attribute values (static sections show real preview; dynamic sections show a placeholder list referencing the attributes).
  - Uses `wp.element.createElement` (not JSX), matching the rest of this theme's converted blocks.
- `render.php` that:
  - Reads `$attributes['fieldName']` with explicit fallback to `hdc_get_home_content_data_contract()` for empty/missing values (defense-in-depth against corrupt attribute saves).
  - Calls `get_block_wrapper_attributes()` for the wrapper element to merge in block-supports styles.
  - Emits the same DOM and class names the current monolithic block emits for that section. Parity preserved by construction.
- `style.css` extracted from `home-page/style.css` for that section's selectors. No `!important` on supports-covered properties.
- `viewScript` (only on dynamic children) lifted from the current `home-page/view.js`, scoped to that section.

### `supports` block (common across all 6 children)

```json
"supports": {
  "html": false,
  "align": ["wide", "full"],
  "spacing": { "padding": true, "margin": true, "blockGap": true },
  "border": { "color": true, "radius": true, "style": true, "width": true },
  "color": { "background": true, "text": true, "gradients": true, "link": true },
  "typography": {
    "fontSize": true, "lineHeight": true, "textAlign": true,
    "fontFamily": true, "fontWeight": true
  },
  "dimensions": { "minHeight": true }
}
```

## Components (per-child attribute schemas)

Defaults shown are seeded from `data/home-content.json` at sync time.

### 1. `home-hero` — static, no `view.js`

| Attribute | Type | Default source |
|---|---|---|
| `eyebrow` | string | `home.hero.eyebrow` |
| `title` | string | `home.hero.title` |
| `description` | string | `home.hero.description` |
| `primaryCtaLabel` | string | `home.hero.primaryCtaLabel` |
| `primaryCtaHref` | string | `home.hero.primaryCtaHref` |
| `secondaryCtaLabel` | string | `home.hero.secondaryCtaLabel` |
| `secondaryCtaHref` | string | `home.hero.secondaryCtaHref` |

### 2. `home-selected-work` — dynamic, has `view.js`

| Attribute | Type | Default source |
|---|---|---|
| `title` | string | `home.selectedWork.title` |
| `actionLabel` | string | `home.selectedWork.actionLabel` |
| `actionHref` | string | `home.selectedWork.actionHref` |
| `featuredRepoNames` | string[] | `home.selectedWork.featuredRepoNames` |
| `loadingLabel` | string | `home.selectedWork.loadingLabel` |
| `sourceLiveLabel` | string | `home.selectedWork.sourceLiveLabel` |
| `sourceFallbackLabel` | string | `home.selectedWork.sourceFallbackLabel` |
| `emptyTitle` | string | `home.selectedWork.emptyTitle` |
| `emptyDescriptionLive` | string | `home.selectedWork.emptyDescriptionLive` |
| `emptyDescriptionFallback` | string | `home.selectedWork.emptyDescriptionFallback` |
| `repoCount` | number | 3 |

`view.js` lifted from current `home-page/view.js` selected-work logic: GitHub API fetch with proxy fallback to `/api/github/repos`, with final fallback to inlined `initialRepos` from server render.

### 3. `home-throughline` — static, no `view.js`

| Attribute | Type | Default source |
|---|---|---|
| `title` | string | `home.throughline.title` |
| `paragraphs` | string[] (repeater) | `home.throughline.paragraphs` |
| `quote` | object `{ text, attribution, eyebrow }` | `home.throughline.quote` |

`paragraphs` exposed as a repeater (one `TextareaControl` per paragraph + add/remove buttons) so the AI sees each paragraph as a discrete addressable item.

### 4. `home-resume-snapshot` — dynamic, has `view.js`

| Attribute | Type | Default source |
|---|---|---|
| `title` | string | `home.resumeSnapshot.title` |
| `actionLabel` | string | `home.resumeSnapshot.actionLabel` |
| `actionHref` | string | `home.resumeSnapshot.actionHref` |
| `positioningEyebrow` | string | `home.resumeSnapshot.positioningEyebrow` |
| `label` | string | `home.resumeSnapshot.label` |
| `items` | string[] (repeater) | `home.resumeSnapshot.items` |
| `bestFitEyebrow` | string | `home.resumeSnapshot.bestFitEyebrow` |
| `bestFitTitle` | string | `home.resumeSnapshot.bestFitTitle` |
| `focusAreas` | string[] (repeater) | `home.resumeSnapshot.focusAreas` |
| `actionLinks` | object[] `{ label, href }[]` | `home.resumeSnapshot.actionLinks` |
| `resumeEndpoint` | string (Advanced) | REST URL for `/resume` endpoint |

### 5. `home-recent-writing` — dynamic, has `view.js`

| Attribute | Type | Default source |
|---|---|---|
| `title` | string | `home.recentWriting.title` |
| `actionLabel` | string | `home.recentWriting.actionLabel` |
| `actionHref` | string | `home.recentWriting.actionHref` |
| `emptyTitle` | string | `home.recentWriting.emptyTitle` |
| `emptyDescription` | string | `home.recentWriting.emptyDescription` |
| `blogCount` | number | 3 |
| `blogEndpoint` | string (Advanced) | REST URL for `/blog` endpoint |

### 6. `home-contact-cta` — static, no `view.js`

| Attribute | Type | Default source |
|---|---|---|
| `eyebrow` | string | `home.contactCta.eyebrow` |
| `title` | string | `home.contactCta.title` |
| `description` | string | `home.contactCta.description` |
| `primaryCtaLabel` | string | `home.contactCta.primaryCtaLabel` |
| `primaryCtaHref` | string | `home.contactCta.primaryCtaHref` |
| `secondaryCtaLabel` | string | `home.contactCta.secondaryCtaLabel` |
| `secondaryCtaHref` | string | `home.contactCta.secondaryCtaHref` |

### Deliberately omitted

- Page metadata (title, OG, Twitter cards) stays in `home-content.json` and is served by `hdc_override_document_title()`. Document-level, not block-level.
- The dynamic data itself (post records, repo records, resume content) — REST-driven; no attribute surface.

## Data Flow

### Authoring path

1. Sync seed: `scripts/sync_page_sources.php` reads `data/home-content.json` and emits the front-page block markup as the parent + 6 children with content attributes inlined into each child's block delimiter. Run via `npm run sync:pages`.
2. First-time insertion (any new page): the parent's `template` config in `block.json` provides the 6 children with hand-maintained default attribute values; each child's `block.json` defaults serve as additional fallbacks. Both are seeded from `home-content.json` at implementation time and updated by hand when the JSON changes (auto-sync is future work). The sync script does not modify source files; it writes only the front-page post_content.
3. Editor persistence: `setAttributes` → core serializes to post_content as standard block markup with attribute JSON in each block delimiter.

### Render path

1. Front-page request → `templates/front-page.html` → `wp:post-content` → core block renderer.
2. `home-page/render.php` opens the outer wrapper, echoes inner content (children).
3. Each child's `render.php` runs in turn. Reads its own attributes, falls back to `hdc_get_home_content_data_contract()` for any empty values, emits identical DOM/classes to the current monolithic output for that section.
4. Static children emit final HTML server-side. Dynamic children emit a placeholder + per-block `data-config` JSON consumed by their per-block `view.js`.

### AI read path

- **Editor**: `wp.data.select('core/block-editor').getBlocks()` returns the parent block with its children, each with full `attributes` object. Attribute names match `block.json`.
- **Headless**: `GET /wp/v2/pages/{front-page-id}?context=edit` returns `content.raw`. Parse with `wp.blocks.parse()` (browser) or `parse_blocks()` (PHP) to get the same tree.

### AI write path

- **Editor**: `wp.data.dispatch('core/block-editor').updateBlockAttributes(clientId, partialAttrs)`.
- **Headless**: `POST /wp/v2/pages/{id}` with rebuilt `content` from a tree (using `wp.blocks.serialize()` or `serialize_blocks()`).

### Dynamic data flow (unchanged from today, relocated)

- `home-selected-work/view.js`: reads `attrs.featuredRepoNames` + `attrs.repoCount` from data-config, fetches GitHub repos, renders cards.
- `home-recent-writing/view.js`: reads `attrs.blogCount`, calls `GET /wp-json/henrys-digital-canvas/v1/blog?limit={n}`, renders cards.
- `home-resume-snapshot/view.js`: reads `attrs.resumeEndpoint`, hydrates the snapshot panel.

These three view scripts are extracted slices of `home-page/view.js` along section seams. No new client logic.

### Migration flow (one-time)

1. Update `scripts/sync_page_sources.php` to emit the new parent + 6 children markup for the front page.
2. Run `wp --path=/home/ubuntu/wp-hperkins-com eval-file scripts/sync_page_sources.php` (`npm run sync:pages`). Front page record's `post_content` is rewritten.
3. Run `home-parity.spec.cjs`. Fix any drift, iterate until green.
4. Cache flush + cache-enabler purge per CLAUDE.md gotchas.

## Error Handling and Edge Cases

### Missing or empty attribute values

Each `render.php` reads attributes with explicit fallbacks. Order of precedence:
1. `$attributes['title']` if set and non-empty after `wp_strip_all_tags()` + `trim()`.
2. JSON contract value (`hdc_get_home_content_data_contract()` → `home.<section>.<field>`) — runtime read, not just sync-time seed.
3. Empty string (never `null` or `undefined` printed).

### Block deprecation

Adding attributes to children that previously had none is a structural addition, not a deprecation. Existing front-page post_content is replaced by the migration in one shot. Future schema changes are out of scope for this spec; when they arrive each will need a `deprecated` array in the child's `index.js` mapping old → new attribute names.

### `parent` constraint enforcement

Children declare `parent: ["henrys-digital-canvas/home-page"]`. Gutenberg's inserter hides them outside the parent. Pasted markup or REST writes that place a child elsewhere render safely (the child still produces its section HTML); no strict refusal that would create worse failure modes.

### Dynamic data loading failures

Per-block `view.js` carries over the current fallback patterns:
- GitHub rate-limit / 5xx → proxy `/api/github/repos` → inlined `initialRepos`.
- Blog REST 500 → render `emptyTitle` + `emptyDescription` from attributes.
- Resume REST 500 → render inlined `initialResume` from server-side render.

### Block supports vs. base CSS specificity

Native supports emit inline `style="..."` on the wrapper. Inline beats stylesheet, so user overrides naturally win. Constraint enforced in implementation: section CSS files must not use `!important` on supports-covered properties. Verified by `scripts/no_important_audit.sh`.

### `theme.json` interactions

The theme's existing `theme.json` defines presets (color palette, font sizes, spacing scale). Block supports auto-wire those presets into controls. No new presets added by this work. The parity test catches any unexpected default that gets pulled in.

### JSON contract drift after migration

Editing `data/home-content.json` after migration does not auto-update the front page's serialized attributes. Re-run `npm run sync:pages` to re-seed. Documented in this spec; admin-side automation is future work.

### Customization vs. parity test

Parity test runs against a freshly-seeded front page (post-`npm run sync:pages`), not against arbitrary editor state. Customizations made in production do not break the local parity test because the test always starts from defaults.

### Editor preview vs. frontend

Static children: `edit()` renders a real preview using attribute values.
Dynamic children: `edit()` shows a Notice + section title + a placeholder list referencing key attributes (e.g., `Selected Work — 3 featured repos: tarot, ai-cli-web-funnel, dj-judas`) so the AI/editor sees enough to reason about the section without rendering live data.

## Testing Strategy

### New tests

- **`scripts/playwright/home-parity.spec.cjs`** — load `https://hperkins.com/` and `${BASE_URL}/` in parallel. Per section, compare visible text content (normalized whitespace), computed styles for `padding`, `margin`, `border*`, `font-size`, `line-height`, `color`, `background-color`, `text-align`, `display`, `flex/grid` properties, and DOM structure (tagName + class list) at the section root. Failure prints section, property, both sides. Added to `npm run smoke:browser`.
- **`scripts/no_important_audit.sh`** — greps the new child block `style.css` files for `!important` on supports-covered properties. Fails the smoke if any leak. Folded into `npm run smoke:full`.
- **REST shape check in `scripts/api_smoke.sh`** — extend existing API smoke to call `GET /wp/v2/pages/{front-page-id}?context=edit` (auth via app password), parse `content.raw`, verify the block tree contains the 6 expected child blocks with attribute keys matching what each `block.json` declares. AI-readability gate.

### Updated tests

- **`scripts/playwright/browser-smoke.spec.cjs`** — update selectors to navigate the new innerBlocks DOM (parent wrapper + 6 sections). Small change since DOM/classes are preserved by construction.
- **`scripts/api_smoke.sh`** — extended above.

### Manual gates

- Open the front page in `wp-admin` block editor: verify all 6 children appear, each with content fields in Inspector and a Styles tab with native controls.
- Open the front page on the frontend: visually compare against `https://hperkins.com/` side-by-side at desktop (≥1280px), tablet (768px), and mobile (375px) breakpoints.
- Run `wp eval-file scripts/sync_page_sources.php` twice; diff resulting post_content; must be identical (idempotency).

### Acceptance criteria

A merge passes only when all of the following are green:
1. `npm run smoke:full` (route + api + browser).
2. `home-parity.spec.cjs` against `https://hperkins.com/` after running `npm run sync:pages`.
3. `no_important_audit.sh`.
4. Existing `scripts/stylebook_audit.sh` (must not regress on parent-token leakage).
5. WP cache flush + cache-enabler purge.
6. Manual editor-UI smoke (above).
7. Manual frontend visual smoke at three breakpoints.

### Not tested

- AI tool integration end-to-end. The AI lives outside this theme; we only verify attributes are present, named correctly, and surfaced via REST.
- Editor save/load round-trips (Gutenberg core).
- Cross-browser beyond Chromium (matches current convention).

## Out of Scope (v1)

Named so they don't sneak in:

- Per-attribute "reset to default" buttons in Inspector.
- An admin action to re-seed from JSON without WP-CLI.
- Reordering or removing sections (`templateLock: 'all'`).
- Schema deprecations (no old shape to support yet).
- Compiling child blocks to JSX via wp-scripts. Children stay on `wp.element.createElement` matching the rest of this theme. JSX conversion is a separate refactor decision.
- Extending this pattern to other route-owned blocks (`about-timeline`, `contact-form`, `resume-overview`, `hobbies-moments`). Validate the pattern on `home-page` first.
- Auto-sync of `block.json` defaults and the parent's `template` config from `home-content.json`. v1 hand-maintains these with a documented convention; a code-gen step is future work.

## Open Risks

- **AI plugin compatibility**: if the eventual AI consumer expects flat attributes only (no nested objects), `home-throughline.quote` and `home-resume-snapshot.actionLinks` would need restructuring. Mitigation: exercise the AI tool against the seeded front page before declaring done; restructure if needed.
- **`theme.json` defaults**: enabling `supports.color.background` could pull an unexpected default from theme.json. Caught by parity test if the default-state background diverges from hperkins.com.
- **CSS coupling**: `home-page/style.css` is large and likely has selectors that span sections. Splitting into per-section files may surface implicit coupling. Mitigation: parity test catches visual drift; implementation plan will include a conservative split (keep shared selectors in a single file referenced by both children if needed).
- **`view.js` extraction**: the 46KB `home-page/view.js` is monolithic; splitting along section seams may surface shared utilities. Mitigation: shared helpers move to `assets/js/hdc-shared-utils.js` (already used by other blocks per the work-showcase parity design).

## Files Affected

### New files

- `blocks/home-hero/{block.json,index.js,render.php,style.css}`
- `blocks/home-selected-work/{block.json,index.js,render.php,style.css,view.js}`
- `blocks/home-throughline/{block.json,index.js,render.php,style.css}`
- `blocks/home-resume-snapshot/{block.json,index.js,render.php,style.css,view.js}`
- `blocks/home-recent-writing/{block.json,index.js,render.php,style.css,view.js}`
- `blocks/home-contact-cta/{block.json,index.js,render.php,style.css}`
- `scripts/playwright/home-parity.spec.cjs`
- `scripts/no_important_audit.sh`

### Modified files

- `blocks/home-page/block.json` — declare `template` + `templateLock: "all"`, register innerBlocks support.
- `blocks/home-page/index.js` — replace edit/save with `<InnerBlocks>` / `<InnerBlocks.Content>`.
- `blocks/home-page/render.php` — slim to wrapper + `$content`.
- `blocks/home-page/style.css` — keep only outer wrapper rules; section-specific CSS migrates to children.
- `blocks/home-page/view.js` — delete (extracted to children).
- `functions.php` — register the 6 new child blocks via `register_block_type_from_metadata()`.
- `scripts/sync_page_sources.php` — emit new parent + 6 children markup for front-page.
- `scripts/api_smoke.sh` — REST-shape verification.
- `scripts/playwright/browser-smoke.spec.cjs` — update selectors for the new DOM (additive, since classes preserved).

### Configuration / no behavior change

- `package.json` — no new npm scripts (parity spec runs under existing `smoke:browser`; audit runs under existing `smoke:full`).
