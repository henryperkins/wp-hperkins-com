# Blog Index Block Parity Design

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

**Date**: 2026-03-14
**Block**: `blog-index`
**Source**: `Blog.tsx`
**Verdict**: NEEDS_WORK (1 high, 5 medium, 9 low)

## Extras Decision

- **Remove**: visible "Source: wordpress/local" debug label (view.js:360-362) -- React never shows data source to users
- **Keep**: inline fallback JSON `data-fallback-payload` -- acceptable MPA performance optimization
- **Keep**: configurable heading/description block attributes -- standard WP editability pattern

## Reusable Patterns Already In The Working Tree

- `assets/css/design-system.css` already defines `.ember-surface` with `::before`/`::after` pseudo-elements, gradient overlays, and noise textures. Both the hero band and featured card can simply add this class.
- `assets/css/design-system.css` already defines `--shadow-glow`, `--shadow-control`, `--text-accent`, `--motion-duration-hover`, `--motion-ease-standard`, `.focus-ring`, and `.screen-reader-text` utility classes.
- `assets/js/hdc-shared-utils.js` already has `arrow-right` and `clock` icons in `LUCIDE_ICON_NODES`. Only `search` and `inbox` icons need adding.
- `blocks/home-page/view.js` implements a reveal system with `IntersectionObserver` + `.hdc-reveal` class + CSS keyframes. The blog-index block will replicate this pattern with block-scoped keyframe names and class names to avoid collisions.

## Gap List

### Phase 1: Shared Dependencies + Extras Cleanup

| # | Gap | Severity | What to do |
|---|-----|----------|------------|
| D1 | `search` icon missing from LUCIDE_ICON_NODES | dep | Add Lucide `search` SVG path data to `assets/js/hdc-shared-utils.js` |
| D2 | `inbox` icon missing from LUCIDE_ICON_NODES | dep | Add Lucide `inbox` SVG path data to `assets/js/hdc-shared-utils.js` |
| E1 | "Source: wordpress/local" debug label visible | remove | Delete the conditional `state.source` render at view.js:360-362 and the `.hdc-blog-index__source` CSS rule |

Files: `assets/js/hdc-shared-utils.js`, `blocks/blog-index/view.js`, `blocks/blog-index/style.css`

### Phase 2: Hero + Featured Visual Identity (high)

| # | Gap | React | WP current | Fix |
|---|-----|-------|-----------|-----|
| 1 | PageHero ember-surface band missing | `<PageHero surface="emberBand" divider="default">` renders `<section class="ember-surface border-b border-border">` with warm gradient bg | Flat `<header>` with no surface treatment | Wrap the intro in a `<section class="hdc-blog-index__hero ember-surface">` with `border-bottom: 1px solid hsl(var(--border))`. Move eyebrow/title/description inside. Apply `max-width: 64rem` inner container with band spacing (`padding: 3rem 1rem` / `md: 3.5rem 1rem`) |
| 11 | Featured card missing ember surface | `ContentCard surface="ember"` applies `.ember-surface` class | Flat `background: hsl(var(--card))` | Add `ember-surface` class to `.hdc-blog-index__featured`, set `border-radius: var(--radius-emphasis)`, add `overflow: hidden; isolation: isolate` via the existing `.ember-surface` utility |

Files: `blocks/blog-index/view.js`, `blocks/blog-index/style.css`

### Phase 3: Accessibility + Interaction (medium)

| # | Gap | React | WP current | Fix |
|---|-----|-------|-----------|-----|
| 2 | Eyebrow says "Insights" | `eyebrow="Writing"` | `'Insights'` (view.js:357) | Change string to `'Writing'` |
| 3 | FilterChipGroup missing radiogroup ARIA | Container: `role="radiogroup"` `aria-label="Filter blog posts by tag"`. Each chip: `role="radio"` `aria-checked` `tabIndex` (roving) | Plain `<button>` elements, no ARIA | Add `role="radiogroup"` + `aria-label` to chip container div. Add `role="radio"`, `aria-checked={isActive}`, `data-state`, and roving `tabIndex` (0 for active, -1 for others) to each chip button |
| 4 | FilterChipGroup missing keyboard navigation | `onKeyDown`: ArrowRight/Down = next (wrapping), ArrowLeft/Up = prev (wrapping), Home = first, End = last. Focus follows selection. | No keyboard handler | Add `onKeyDown` event handler to each chip that implements arrow key navigation with wrapping, Home/End support, and focus management via refs |
| 5 | Dates use `<span>` instead of `<time>` | `<time dateTime={dateTime}>{dateLabel}</time>` in ContentMetaRow | `h('span', {}, formatDateLabel(...))` | Replace `h('span', ...)` with `h('time', { dateTime: rawDate }, formatDateLabel(rawDate))` for both featured meta and card meta date elements |
| 6 | No hover/transition/focus-visible on cards or chips | Cards: `transition-[border-color,background-color,box-shadow,transform] duration-[--motion-duration-hover]`, `hover:border-interactive-border-hover`, `hover:bg-surface-hover` (rows), `hover:shadow-glow` (featured). Chips: `data-[state=on]:border-border data-[state=on]:bg-card data-[state=on]:shadow-control`. All interactive: `focus-ring` | Zero `transition`, `:hover`, or `:focus-visible` rules | Add transition declarations, hover states, and focus-visible ring to `.hdc-blog-index__featured`, `.hdc-blog-index__card`, `.hdc-blog-index__chip`, CTA buttons. Match React's active chip styling (`bg-card + shadow-control` instead of current `bg-primary`) |

Files: `blocks/blog-index/view.js`, `blocks/blog-index/style.css`

### Phase 4: Visual Polish (low)

| # | Gap | React | WP current | Fix |
|---|-----|-------|-----------|-----|
| 7 | Search icon missing | `<Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-text-meta">` | Plain `<input type="search">` | Wrap search input in a `position: relative` container, prepend a search SVG icon via `utils.createLucideIcon('search', 16)`, position absolutely at left, add `padding-left` to input |
| 8 | Featured meta missing Clock + ArrowRight icons | `<Clock size={12}>` before date, `<ArrowRight size={14}>` + "Read" text in accent color after reading time | Plain text: date span, readingTime span, "Read -->" | Add Clock icon before date, replace "Read -->" with styled "Read" + ArrowRight icon in `hsl(var(--text-accent))` |
| 9 | EmptyState missing SurfaceCard + icon badge | `<EmptyState>` wraps content in `<SurfaceCard padding="xl">` with `<IconBadge size="lg"><Inbox /></IconBadge>`, centered `<h2>` + `<p>` | Plain `<div>` with `<h4>` + `<p>`, no icon, minimal styling | Restructure empty state: border + rounded-surface wrapper, add centered Inbox icon badge (48px circle bg, 20px icon), upgrade heading to `<h2>`, add `text-align: center` and relaxed padding |
| 10 | Excerpt missing line-clamp | `line-clamp-3 sm:line-clamp-2` on ContentCardExcerpt | No line clamping | Add `display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden` to `.hdc-blog-index__card-excerpt`, with `@media (min-width: 640px)` override to `line-clamp: 2` |
| 12 | No onError handler for broken images | `onError={hideBrokenImage}` sets `display: none` | No onError handler | Add `onError` function prop to all `<img>` elements: `function(e) { e.target.style.display = 'none'; }` |
| 14 | `block.json` description text drifted | "Writing on customer-facing engineering, AI workflows, WordPress delivery, and support-to-implementation systems." | "Notes on engineering systems, product craft, and learning in public." | Update `block.json` default description to match React |
| 15 | CTA description text drifted | "Follow me on LinkedIn for new posts and project updates." | "I do not run a newsletter yet. The best way to catch new posts is to follow me on LinkedIn." | Update CTA description string in view.js to match React |

Files: `blocks/blog-index/view.js`, `blocks/blog-index/style.css`, `blocks/blog-index/block.json`

### Phase 5: Reveal Animations (low)

| # | Gap | React | WP current | Fix |
|---|-----|-------|-----------|-----|
| 13 | No entrance animations | Hero: `<Reveal preset="fadeUpSoft">`. Featured: `<Reveal>` (default fadeUp). Section header: `<Reveal delay={fast/2}>`. Each post card: `<Reveal index={i} preset="fadeUpSoft" step={fast/3}>` (staggered). All respect `prefers-reduced-motion`. | No animations at all | Add IntersectionObserver-based reveal system (replicating home-page pattern with block-scoped names). Define `@keyframes hdc-blog-reveal-fade-up` and `hdc-blog-reveal-fade-up-soft`. Apply `.hdc-blog-reveal` class with `--reveal-index` CSS variable for stagger. Add `prefers-reduced-motion` media query to disable. |

Files: `blocks/blog-index/view.js`, `blocks/blog-index/style.css`

## Implementation Phases

### Phase 1: Shared Dependencies + Extras Cleanup

1. Add `search` icon SVG path data to `LUCIDE_ICON_NODES` in `assets/js/hdc-shared-utils.js`:
   ```js
   search: [
     ['circle', { cx: '11', cy: '11', r: '8' }],
     ['path', { d: 'm21 21-4.3-4.3' }],
   ],
   ```
2. Add `inbox` icon SVG path data to `LUCIDE_ICON_NODES`:
   ```js
   inbox: [
     ['polyline', { points: '22 12 16 12 14 15 10 15 8 12 2 12' }],
     ['path', { d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' }],
   ],
   ```
3. Remove `state.source` render from `view.js` (lines 360-362).
4. Remove `.hdc-blog-index__source` CSS rule from `style.css` (lines 47-51).

### Phase 2: Hero + Featured Visual Identity

1. In `view.js`, restructure the intro section: wrap in `h('section', { className: 'hdc-blog-index__hero ember-surface' }, h('div', { className: 'hdc-blog-index__hero-inner' }, ...eyebrow, title, description))`.
2. In `style.css`, add `.hdc-blog-index__hero` with `border-bottom: 1px solid hsl(var(--border))` and `.hdc-blog-index__hero-inner` with `max-width: 64rem; margin: 0 auto; padding: 3rem 1rem`.
3. Update `.hdc-blog-index__intro` to `margin-bottom: 0` (spacing now handled by hero wrapper).
4. Add `ember-surface` class to `.hdc-blog-index__featured` element in `view.js`.
5. In `style.css`, update `.hdc-blog-index__featured` to use `border-radius: var(--radius-emphasis)` and `padding: 1.5rem` (sm: `2rem`, lg: `2.5rem`).

### Phase 3: Accessibility + Interaction

1. Change eyebrow text from `'Insights'` to `'Writing'` in `view.js`.
2. Add `role="radiogroup"` and `aria-label="Filter blog posts by tag"` to the chips container div.
3. For each chip button, add: `role: 'radio'`, `'aria-checked': isActive`, `'data-state': isActive ? 'on' : 'off'`, `tabIndex: isActive ? 0 : -1`.
4. Store chip button refs in a `chipRefs` array (using a closure-based ref pattern since we're using `wp.element`).
5. Add `onKeyDown` handler to each chip implementing:
   - ArrowRight/ArrowDown: `(index + 1) % length`
   - ArrowLeft/ArrowUp: `(index - 1 + length) % length`
   - Home: index 0
   - End: index `length - 1`
   - Each arrow key: `preventDefault()`, call `setActiveTag(nextOption)`, focus the next button ref.
6. Replace `h('span', {}, formatDateLabel(post.date))` with `h('time', { dateTime: post.date }, formatDateLabel(post.date))` in both featured meta (line 392) and card meta (line 489).
7. In `style.css`, add transition + hover + focus-visible rules:
   - `.hdc-blog-index__featured`: `transition: border-color, background-color, box-shadow, transform` `var(--motion-duration-hover)` `var(--motion-ease-standard)`. `:hover` → `box-shadow: var(--shadow-glow)`. `.focus-ring` class in markup.
   - `.hdc-blog-index__card`: same transition. `:hover` → `background: hsl(var(--surface-hover)); border-color: hsl(var(--interactive-border-hover))`. `.focus-ring` class.
   - `.hdc-blog-index__chip`: transition. Restyle `.is-active` / `[data-state="on"]` from `bg-primary` to `background: hsl(var(--card)); border-color: hsl(var(--border)); box-shadow: var(--shadow-control)` matching React's filterChip active state.
   - CTA buttons: `transition: background-color, border-color, box-shadow var(--motion-duration-hover)`. `:hover` with slight brightness shift.
8. Add `focus-ring` class to featured link and card links in `view.js`.

### Phase 4: Visual Polish

1. Wrap search input in a relative container div. Prepend search icon via `utils.createLucideIcon('search', 16)` with `className: 'hdc-blog-index__search-icon'`. Add CSS: `position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: hsl(var(--text-meta)); pointer-events: none`. Add `padding-left: 2.25rem` to the input.
2. In featured meta, add Clock icon (size 12) before date, and replace `'Read -->'` with `h('span', { className: 'hdc-blog-index__featured-read' }, 'Read ', utils.createLucideIcon('arrow-right', 14))` styled with `color: hsl(var(--text-accent))` and `display: inline-flex; align-items: center; gap: 0.25rem`.
3. Restructure empty state to use SurfaceCard pattern: centered layout with Inbox icon badge (rounded-full bg with secondary background, icon inside), `<h2>` title, `<p>` description, padding `2rem`.
4. Add line-clamp CSS to `.hdc-blog-index__card-excerpt`.
5. Add `onError` prop to all `<img>` elements: `function(e) { e.target.style.display = 'none'; }`.
6. Update `block.json` description default to match React.
7. Update CTA description string in `view.js` to match React.

### Phase 5: Reveal Animations

1. Add `initBlogReveals()` function to `view.js` using IntersectionObserver pattern (copied from home-page, adapted):
   - Observe `.hdc-blog-reveal` elements
   - Above-fold elements get `is-visible` immediately
   - Below-fold elements animate on intersection
   - Disconnect observer after all elements revealed
2. Add reveal classes to rendered elements:
   - Hero section: `hdc-blog-reveal hdc-blog-reveal--fade-up-soft` with `--reveal-index: 0`
   - Featured card: `hdc-blog-reveal` with `--reveal-index: 0`
   - Section header: `hdc-blog-reveal` with `--reveal-index: 0` (separate observer group)
   - Each post card: `hdc-blog-reveal hdc-blog-reveal--fade-up-soft` with `--reveal-index: i` and smaller step
3. Add CSS keyframes and rules in `style.css`:
   ```css
   @keyframes hdc-blog-reveal-fade-up {
     from { opacity: 0; transform: translateY(20px); }
     to { opacity: 1; transform: translateY(0); }
   }
   @keyframes hdc-blog-reveal-fade-up-soft {
     from { opacity: 0; transform: translateY(12px); }
     to { opacity: 1; transform: translateY(0); }
   }
   .hdc-blog-reveal { opacity: 0; }
   .hdc-blog-reveal.is-visible {
     animation: hdc-blog-reveal-fade-up var(--motion-duration-medium) var(--motion-ease-standard) forwards;
     animation-delay: calc(var(--reveal-index, 0) * calc(var(--motion-duration-fast) / 3));
   }
   .hdc-blog-reveal.hdc-blog-reveal--fade-up-soft.is-visible {
     animation-name: hdc-blog-reveal-fade-up-soft;
   }
   ```
4. Add `prefers-reduced-motion` media query:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .hdc-blog-reveal { opacity: 1; }
     .hdc-blog-reveal.is-visible { animation: none; }
   }
   ```
5. Call `initBlogReveals()` after React render completes (in a `useEffect` that fires after initial data load).

## File Impact Summary

| File | Changes |
|------|---------|
| `assets/js/hdc-shared-utils.js` | Add `search` and `inbox` icons to LUCIDE_ICON_NODES |
| `blocks/blog-index/view.js` | Restructure hero, add ember-surface classes, fix eyebrow text, add ARIA radiogroup + keyboard nav, use `<time>` elements, add search/clock/arrow-right/inbox icons, restructure empty state, add focus-ring classes, add onError handlers, fix text content, add reveal system |
| `blocks/blog-index/style.css` | Add hero band styles, update featured to emphasis radius, add transitions/hover/focus-visible, restyle active chips, add search icon positioning, add line-clamp, add reveal keyframes + reduced-motion, remove source rule |
| `blocks/blog-index/block.json` | Update default description text |

**Total: 4 files**

## Smoke Test Checkpoints

- After Phase 1: `node -c blocks/blog-index/view.js` + `npm run smoke:route`
- After Phase 3: `npm run smoke:route` + `npm run smoke:api` + manual keyboard test of chip navigation
- After Phase 5: `npm run smoke:full` + Playwright screenshot comparison
- Final: re-run parity checker to confirm PARITY or MINOR_DRIFT
