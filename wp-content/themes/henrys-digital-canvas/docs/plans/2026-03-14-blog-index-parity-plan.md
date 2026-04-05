# Blog Index Parity Implementation Plan

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the `blog-index` WordPress block to full visual and functional parity with its source React component `Blog.tsx`.

**Architecture:** The blog-index block uses `wp.element.createElement` (aliased as `h`) for client-side rendering in `view.js`, with static CSS in `style.css` and block metadata in `block.json`. All icons come from `hdc-shared-utils.js` via `utils.renderLucideIcon(h, name, opts)`. The design system in `design-system.css` provides `.ember-surface`, `.focus-ring`, motion tokens, and color variables. No build step -- files are served directly.

**Tech Stack:** Vanilla JS (wp.element), CSS custom properties, WordPress block API, Lucide icons via shared utils

**Design doc:** `docs/plans/2026-03-14-blog-index-parity-design.md`

---

## File Structure

| File | Role | Action |
|------|------|--------|
| `assets/js/hdc-shared-utils.js` | Shared icon registry + utilities | Modify: add 2 icons |
| `blocks/blog-index/view.js` | Client-side React-like rendering | Modify: major changes across all phases |
| `blocks/blog-index/style.css` | Block styles | Modify: add hero, hover, animation, polish rules |
| `blocks/blog-index/block.json` | Block metadata | Modify: update description default |

All paths relative to `wp-content/themes/henrys-digital-canvas/`.

---

## Chunk 1: Dependencies, Extras Cleanup, and Hero Visual Identity

### Task 1: Add missing icons to shared utils

**Files:**
- Modify: `assets/js/hdc-shared-utils.js:119-136` (insert `inbox` between `house` and `laptop`)
- Modify: `assets/js/hdc-shared-utils.js:212-216` (insert `search` between `send` and `star`)

- [ ] **Step 1: Add `inbox` icon to LUCIDE_ICON_NODES**

Insert after the `house` entry (after line 127) and before `laptop` (line 128):

```js
		inbox: [
			[ 'polyline', { points: '22 12 16 12 14 15 10 15 8 12 2 12' } ],
			[ 'path', { d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' } ],
		],
```

- [ ] **Step 2: Add `search` icon to LUCIDE_ICON_NODES**

Insert after the `send` entry (after line 215) and before `star` (line 216):

```js
		search: [
			[ 'circle', { cx: '11', cy: '11', r: '8' } ],
			[ 'path', { d: 'm21 21-4.3-4.3' } ],
		],
```

- [ ] **Step 3: Validate syntax**

Run: `node -c assets/js/hdc-shared-utils.js`
Expected: no output (clean parse)

- [ ] **Step 4: Commit**

```bash
git add assets/js/hdc-shared-utils.js
git commit -m "feat(shared-utils): add search and inbox Lucide icons"
```

---

### Task 2: Remove debug source label and stale CSS

**Files:**
- Modify: `blocks/blog-index/view.js:360-362` (delete source render)
- Modify: `blocks/blog-index/style.css:14,47-51` (delete `.hdc-blog-index__source` rule)

- [ ] **Step 1: Remove source label render from view.js**

Delete lines 360-362 in the `BlogIndexApp` return. The current code:

```js
			state.source && state.source !== 'unknown'
				? h( 'p', { className: 'hdc-blog-index__source' }, 'Source: ' + state.source )
				: null
```

Remove all three lines entirely (the ternary and its null branch).

- [ ] **Step 2: Remove source CSS from style.css**

In `.hdc-blog-index__status, .hdc-blog-index__error, .hdc-blog-index__empty, .hdc-blog-index__source` (line 14), remove `, .hdc-blog-index__source` from the selector.

Delete the standalone `.hdc-blog-index__source` rule block (lines 47-51):

```css
.hdc-blog-index__source {
  font-size: 0.78rem;
  margin: 0.45rem 0 0;
  text-transform: uppercase;
}
```

- [ ] **Step 3: Validate syntax**

Run: `node -c blocks/blog-index/view.js`
Expected: no output (clean parse)

- [ ] **Step 4: Commit**

```bash
git add blocks/blog-index/view.js blocks/blog-index/style.css
git commit -m "fix(blog-index): remove debug source label from UI"
```

---

### Task 3: Add PageHero ember-surface band

**Files:**
- Modify: `blocks/blog-index/view.js:351-363` (restructure intro into hero section)
- Modify: `blocks/blog-index/style.css:1-45` (add hero band styles, adjust intro)

- [ ] **Step 1: Restructure intro markup in view.js**

Replace the current intro header (around lines 354-363, after source label removal) with a hero `<section>` wrapper. The full return statement's first child changes from:

```js
		h(
			'header',
			{ className: 'hdc-blog-index__intro' },
			h( 'p', { className: 'hdc-blog-index__eyebrow' }, 'Insights' ),
			h( 'h1', { className: 'hdc-blog-index__title' }, config.heading || 'Blog' ),
			config.description ? h( 'p', { className: 'hdc-blog-index__description' }, config.description ) : null
		),
```

To:

```js
		h(
			'section',
			{ className: 'hdc-blog-index__hero ember-surface' },
			h(
				'div',
				{ className: 'hdc-blog-index__hero-inner' },
				h(
					'header',
					{ className: 'hdc-blog-index__intro' },
					h( 'p', { className: 'hdc-blog-index__eyebrow' }, 'Writing' ),
					h( 'h1', { className: 'hdc-blog-index__title' }, config.heading || 'Blog' ),
					config.description ? h( 'p', { className: 'hdc-blog-index__description' }, config.description ) : null
				)
			)
		),
```

Note: this also fixes Gap #2 (eyebrow "Insights" → "Writing").

- [ ] **Step 2: Wrap remaining content in a shell div**

Everything after the hero section (featured card through newsletter CTA) needs a `.hdc-blog-index__content` wrapper for max-width + padding (previously handled by `.hdc-blog-index__shell` in `render.php`). Wrap the remaining children after the hero section:

```js
		h(
			'div',
			{ className: 'hdc-blog-index__content' },
			featured ? h( /* ...featured card... */ ) : null,
			h( /* ...header-row... */ ),
			h( /* ...filters... */ ),
			filtered.length === 0 ? h( /* ...empty state... */ ) : h( /* ...list... */ ),
			config.showNewsletterCta ? h( /* ...cta... */ ) : null
		)
```

- [ ] **Step 3: Add hero CSS to style.css**

Add these rules after the `.hdc-blog-index { display: block; }` rule (after line 3):

```css
.hdc-blog-index__hero {
  border-bottom: 1px solid hsl(var(--border));
}

.hdc-blog-index__hero-inner {
  margin: 0 auto;
  max-width: 64rem;
  padding: 3rem 1rem;
}

.hdc-blog-index__content {
  margin: 0 auto;
  max-width: 64rem;
  padding: 3rem 1rem 2rem;
}

@media (min-width: 768px) {
  .hdc-blog-index__hero-inner {
    padding: 3.5rem 1rem;
  }
}
```

- [ ] **Step 4: Update existing intro CSS**

Change `.hdc-blog-index__intro` (currently `margin-bottom: 1.2rem`) to `margin-bottom: 0` since the hero wrapper now handles spacing.

Remove the `.hdc-blog-index__shell` rule (lines 5-9) since it's replaced by `.hdc-blog-index__content`:

```css
/* DELETE this rule: */
.hdc-blog-index__shell {
  margin: 0 auto;
  max-width: 1120px;
  padding: 2rem 1rem;
}
```

- [ ] **Step 5: Validate syntax**

Run: `node -c blocks/blog-index/view.js`
Expected: no output (clean parse)

- [ ] **Step 6: Run smoke tests**

Run from theme dir: `npm run smoke:route`
Expected: all blog routes return 200

- [ ] **Step 7: Commit**

```bash
git add blocks/blog-index/view.js blocks/blog-index/style.css
git commit -m "feat(blog-index): add PageHero ember-surface band and fix eyebrow text"
```

---

### Task 4: Add ember surface to featured card

**Files:**
- Modify: `blocks/blog-index/view.js:364-396` (add ember-surface class to featured link)
- Modify: `blocks/blog-index/style.css:66-76` (update featured card styles)

- [ ] **Step 1: Add ember-surface class to featured element in view.js**

Change the featured card's className from:

```js
className: 'hdc-blog-index__featured',
```

To:

```js
className: 'hdc-blog-index__featured ember-surface',
```

- [ ] **Step 2: Update featured CSS**

Replace the `.hdc-blog-index__featured` rule with:

```css
.hdc-blog-index__featured {
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-emphasis);
  color: inherit;
  display: block;
  margin: 0 0 1.4rem;
  padding: 1.5rem;
  text-decoration: none;
}
```

Remove `background: hsl(var(--card))` and `box-shadow: var(--shadow-surface-1)` since `.ember-surface` provides its own background. Remove `border-radius: var(--radius-surface)` in favor of `var(--radius-emphasis)`.

Add responsive padding:

```css
@media (min-width: 640px) {
  .hdc-blog-index__featured {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .hdc-blog-index__featured {
    padding: 2.5rem;
  }
}
```

- [ ] **Step 3: Validate and commit**

Run: `node -c blocks/blog-index/view.js`

```bash
git add blocks/blog-index/view.js blocks/blog-index/style.css
git commit -m "feat(blog-index): add ember surface to featured card"
```

---

## Chunk 2: Accessibility and Interaction

### Task 5: Add ARIA radiogroup pattern and keyboard navigation to filter chips

**Files:**
- Modify: `blocks/blog-index/view.js:416-434` (rewrite chip rendering)

- [ ] **Step 1: Add a chipRefs array using useRef**

At the top of `BlogIndexApp`, after the existing `useState` calls (around line 192), add:

```js
const chipRefs = element.useRef( [] );
```

Note: `element.useRef` is available from `wp.element` (already destructured at top of file). Add `useRef` to the destructuring at line 9 if it's not already there:

```js
const useRef = element.useRef;
```

- [ ] **Step 2: Create a keyboard navigation handler**

Add this function inside `BlogIndexApp`, before the return statement:

```js
function handleChipKeyDown( event, index, options ) {
	var next = -1;

	if ( event.key === 'ArrowRight' || event.key === 'ArrowDown' ) {
		event.preventDefault();
		next = ( index + 1 ) % options.length;
	} else if ( event.key === 'ArrowLeft' || event.key === 'ArrowUp' ) {
		event.preventDefault();
		next = ( index - 1 + options.length ) % options.length;
	} else if ( event.key === 'Home' ) {
		event.preventDefault();
		next = 0;
	} else if ( event.key === 'End' ) {
		event.preventDefault();
		next = options.length - 1;
	}

	if ( next >= 0 ) {
		setActiveTag( options[ next ] );
		if ( chipRefs.current[ next ] ) {
			chipRefs.current[ next ].focus();
		}
	}
}
```

- [ ] **Step 3: Rewrite the chips container with ARIA attributes**

Replace the current chip container (lines 416-434):

```js
			h(
				'div',
				{ className: 'hdc-blog-index__chips' },
				allTags.map( function ( tag ) {
					const isActive = tag === activeTag;
					return h(
						'button',
						{
							type: 'button',
							className: 'hdc-blog-index__chip' + ( isActive ? ' is-active' : '' ),
							onClick: function () {
								setActiveTag( tag );
							},
							key: 'tag-' + tag,
						},
						tag
					);
				} )
			)
```

With:

```js
			h(
				'div',
				{
					className: 'hdc-blog-index__chips',
					role: 'radiogroup',
					'aria-label': 'Filter blog posts by tag',
				},
				allTags.map( function ( tag, tagIndex ) {
					const isActive = tag === activeTag;
					return h(
						'button',
						{
							type: 'button',
							role: 'radio',
							'aria-checked': isActive,
							'data-state': isActive ? 'on' : 'off',
							tabIndex: isActive ? 0 : -1,
							className: 'hdc-blog-index__chip' + ( isActive ? ' is-active' : '' ),
							onClick: function () {
								setActiveTag( tag );
							},
							onKeyDown: function ( event ) {
								handleChipKeyDown( event, tagIndex, allTags );
							},
							ref: function ( node ) {
								chipRefs.current[ tagIndex ] = node;
							},
							key: 'tag-' + tag,
						},
						tag
					);
				} )
			)
```

- [ ] **Step 4: Validate syntax**

Run: `node -c blocks/blog-index/view.js`
Expected: no output (clean parse)

- [ ] **Step 5: Commit**

```bash
git add blocks/blog-index/view.js
git commit -m "feat(blog-index): add ARIA radiogroup pattern and keyboard nav to filter chips"
```

---

### Task 6: Replace date spans with semantic time elements

**Files:**
- Modify: `blocks/blog-index/view.js:389-395` (featured meta dates)
- Modify: `blocks/blog-index/view.js:486-491` (card meta dates)

- [ ] **Step 1: Update featured meta date**

In the featured meta section (around line 392), replace:

```js
h( 'span', {}, formatDateLabel( featured.date ) ),
```

With:

```js
h( 'time', { dateTime: featured.date }, formatDateLabel( featured.date ) ),
```

- [ ] **Step 2: Update card meta date**

In the card meta section (around line 489), replace:

```js
h( 'span', {}, formatDateLabel( post.date ) ),
```

With:

```js
h( 'time', { dateTime: post.date }, formatDateLabel( post.date ) ),
```

- [ ] **Step 3: Validate and commit**

Run: `node -c blocks/blog-index/view.js`

```bash
git add blocks/blog-index/view.js
git commit -m "fix(blog-index): use semantic time elements for dates"
```

---

### Task 7: Add hover, transition, and focus-visible styles

**Files:**
- Modify: `blocks/blog-index/view.js` (add `focus-ring` class to interactive elements)
- Modify: `blocks/blog-index/style.css` (add transition/hover/focus rules, restyle active chips)

- [ ] **Step 1: Add focus-ring class to featured link in view.js**

Change the featured card's className from:

```js
className: 'hdc-blog-index__featured ember-surface',
```

To:

```js
className: 'hdc-blog-index__featured ember-surface focus-ring',
```

- [ ] **Step 2: Add focus-ring class to post card links in view.js**

Change each card's className from:

```js
className: 'hdc-blog-index__card' + ( post.featuredImageUrl ? ' has-thumbnail' : '' ),
```

To:

```js
className: 'hdc-blog-index__card focus-ring' + ( post.featuredImageUrl ? ' has-thumbnail' : '' ),
```

- [ ] **Step 3: Add transition and hover CSS for featured card**

Add after the `.hdc-blog-index__featured` base rule:

```css
.hdc-blog-index__featured {
  transition: border-color var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease),
              box-shadow var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease);
}

.hdc-blog-index__featured:hover {
  box-shadow: var(--shadow-glow);
}
```

Note: merge the `transition` property into the base `.hdc-blog-index__featured` rule rather than creating a duplicate selector.

- [ ] **Step 4: Add transition and hover CSS for post cards**

Add after the `.hdc-blog-index__card` base rule:

```css
.hdc-blog-index__card {
  transition: border-color var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease),
              background-color var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease),
              box-shadow var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease);
}

.hdc-blog-index__card:hover {
  background: hsl(var(--surface-hover));
  border-color: hsl(var(--interactive-border-hover, var(--border)));
}
```

Again, merge `transition` into the base rule.

- [ ] **Step 5: Restyle active chips to match React's filterChip pattern**

Replace the `.hdc-blog-index__chip.is-active` rule (lines 184-188):

```css
/* BEFORE: */
.hdc-blog-index__chip.is-active {
  background: hsl(var(--primary));
  border-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

With:

```css
.hdc-blog-index__chip {
  transition: border-color var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease),
              background-color var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease),
              box-shadow var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease);
}

.hdc-blog-index__chip:hover {
  border-color: hsl(var(--border));
  background: hsl(var(--card));
}

.hdc-blog-index__chip.is-active,
.hdc-blog-index__chip[data-state="on"] {
  background: hsl(var(--card));
  border-color: hsl(var(--border));
  box-shadow: var(--shadow-control);
  color: hsl(var(--foreground));
}
```

Again, merge `transition` into the base `.hdc-blog-index__chip` rule rather than duplicating the selector.

- [ ] **Step 6: Add CTA button hover transitions**

Add to the `.hdc-blog-index__cta-primary, .hdc-blog-index__cta-secondary` shared rule:

```css
  transition: background-color var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease),
              border-color var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease),
              box-shadow var(--motion-duration-hover, 160ms) var(--motion-ease-standard, ease);
```

Add hover rules:

```css
.hdc-blog-index__cta-primary:hover {
  filter: brightness(1.08);
}

.hdc-blog-index__cta-secondary:hover {
  background: hsl(var(--surface-hover));
  border-color: hsl(var(--interactive-border-hover, var(--border)));
}
```

- [ ] **Step 7: Validate syntax and commit**

Run: `node -c blocks/blog-index/view.js`

```bash
git add blocks/blog-index/view.js blocks/blog-index/style.css
git commit -m "feat(blog-index): add hover transitions and focus-visible rings"
```

---

### Task 8: Run smoke tests for Chunk 2

- [ ] **Step 1: Run route and API smoke tests**

Run from theme dir:

```bash
npm run smoke:route && npm run smoke:api
```

Expected: all checks pass

- [ ] **Step 2: Flush caches**

```bash
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

---

## Chunk 3: Visual Polish

### Task 9: Add search icon to search input

**Files:**
- Modify: `blocks/blog-index/view.js:406-415` (wrap input, add icon)
- Modify: `blocks/blog-index/style.css:148-163` (add search icon positioning)

- [ ] **Step 1: Wrap search input in a relative container with icon**

Replace the current search input (the `h('input', ...)` block):

```js
			h( 'input', {
				type: 'search',
				className: 'hdc-blog-index__search',
				placeholder: 'Search posts\u2026',
				value: search,
				onChange: function ( event ) {
					setSearch( ensureString( event.target.value, '' ) );
				},
				'aria-label': 'Search blog posts',
			} ),
```

With:

```js
			h(
				'div',
				{ className: 'hdc-blog-index__search-wrap' },
				utils.renderLucideIcon
					? utils.renderLucideIcon( h, 'search', { size: 16, className: 'hdc-blog-index__search-icon' } )
					: null,
				h( 'input', {
					type: 'search',
					className: 'hdc-blog-index__search',
					placeholder: 'Search posts\u2026',
					value: search,
					onChange: function ( event ) {
						setSearch( ensureString( event.target.value, '' ) );
					},
					'aria-label': 'Search blog posts',
				} )
			),
```

- [ ] **Step 2: Add search wrapper and icon CSS**

Add these rules near the existing `.hdc-blog-index__search` rule:

```css
.hdc-blog-index__search-wrap {
  max-width: 560px;
  position: relative;
  width: 100%;
}

.hdc-blog-index__search-icon {
  color: hsl(var(--text-meta));
  left: 0.75rem;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

Update `.hdc-blog-index__search` to add left padding and remove `max-width` / `width` (now on wrapper):

```css
.hdc-blog-index__search {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-control);
  color: hsl(var(--foreground));
  font-size: 0.9rem;
  padding: 0.62rem 0.72rem 0.62rem 2.25rem;
  width: 100%;
}
```

- [ ] **Step 3: Validate and commit**

Run: `node -c blocks/blog-index/view.js`

```bash
git add blocks/blog-index/view.js blocks/blog-index/style.css
git commit -m "feat(blog-index): add search icon to search input"
```

---

### Task 10: Add Clock and ArrowRight icons to featured meta

**Files:**
- Modify: `blocks/blog-index/view.js:389-395` (featured meta section)
- Modify: `blocks/blog-index/style.css:121-133` (featured meta/read styles)

- [ ] **Step 1: Update featured meta markup**

Replace the entire featured meta div:

```js
				h(
					'div',
					{ className: 'hdc-blog-index__featured-meta' },
					h( 'span', {}, formatDateLabel( featured.date ) ),
					h( 'span', {}, featured.readingTime || '' ),
					h( 'span', { className: 'hdc-blog-index__featured-read' }, 'Read \u2192' )
				)
```

With:

```js
				h(
					'div',
					{ className: 'hdc-blog-index__featured-meta' },
					utils.renderLucideIcon
						? utils.renderLucideIcon( h, 'clock', { size: 12 } )
						: null,
					h( 'time', { dateTime: featured.date }, formatDateLabel( featured.date ) ),
					h( 'span', {}, featured.readingTime || '' ),
					h(
						'span',
						{ className: 'hdc-blog-index__featured-read' },
						'Read ',
						utils.renderLucideIcon
							? utils.renderLucideIcon( h, 'arrow-right', { size: 14 } )
							: null
					)
				)
```

- [ ] **Step 2: Update featured-read CSS**

Replace the `.hdc-blog-index__featured-read` rule:

```css
.hdc-blog-index__featured-read {
  align-items: center;
  color: hsl(var(--text-accent));
  display: inline-flex;
  font-weight: 700;
  gap: 0.25rem;
}
```

- [ ] **Step 3: Validate and commit**

Run: `node -c blocks/blog-index/view.js`

```bash
git add blocks/blog-index/view.js blocks/blog-index/style.css
git commit -m "feat(blog-index): add clock and arrow icons to featured meta"
```

---

### Task 11: Restructure empty state with icon badge

**Files:**
- Modify: `blocks/blog-index/view.js:436-446` (empty state markup)
- Modify: `blocks/blog-index/style.css:53-64` (empty state styles)

- [ ] **Step 1: Rewrite empty state markup**

Replace the current empty state:

```js
			h(
				'div',
				{ className: 'hdc-blog-index__empty-state' },
				h( 'h4', { className: 'hdc-blog-index__empty-title' }, 'No posts found' ),
				h(
					'p',
					{ className: 'hdc-blog-index__empty' },
					'Try a different keyword or clear active filters.'
				)
			)
```

With:

```js
			h(
				'div',
				{ className: 'hdc-blog-index__empty-state' },
				h(
					'div',
					{ className: 'hdc-blog-index__empty-icon-badge' },
					utils.renderLucideIcon
						? utils.renderLucideIcon( h, 'inbox', { size: 20 } )
						: null
				),
				h( 'h2', { className: 'hdc-blog-index__empty-title' }, 'No posts found' ),
				h(
					'p',
					{ className: 'hdc-blog-index__empty-description' },
					'Try a different keyword or clear active filters.'
				)
			)
```

- [ ] **Step 2: Update empty state CSS**

Replace the existing `.hdc-blog-index__empty-state` and `.hdc-blog-index__empty-title` rules:

```css
.hdc-blog-index__empty-state {
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-surface);
  margin-top: 0.7rem;
  padding: 3rem 2rem;
  text-align: center;
}

.hdc-blog-index__empty-icon-badge {
  align-items: center;
  background: hsl(var(--secondary));
  border-radius: 9999px;
  color: hsl(var(--text-meta));
  display: inline-flex;
  height: 3rem;
  justify-content: center;
  margin: 0 auto 0.75rem;
  width: 3rem;
}

.hdc-blog-index__empty-title {
  color: hsl(var(--foreground));
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.hdc-blog-index__empty-description {
  color: hsl(var(--text-body));
  font-size: 0.9rem;
  margin: 0;
}
```

- [ ] **Step 3: Validate and commit**

Run: `node -c blocks/blog-index/view.js`

```bash
git add blocks/blog-index/view.js blocks/blog-index/style.css
git commit -m "feat(blog-index): add icon badge to empty state"
```

---

### Task 12: Add excerpt line-clamp, broken image handler, and text fixes

**Files:**
- Modify: `blocks/blog-index/style.css:228-233` (add line-clamp to excerpt)
- Modify: `blocks/blog-index/view.js:376-384,458-470` (add onError to images)
- Modify: `blocks/blog-index/view.js:502-503` (fix CTA description)
- Modify: `blocks/blog-index/block.json:24` (fix description default)

- [ ] **Step 1: Add line-clamp CSS to card excerpt**

Update `.hdc-blog-index__card-excerpt`:

```css
.hdc-blog-index__card-excerpt {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  color: hsl(var(--text-body));
  display: -webkit-box;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0.35rem 0 0;
  overflow: hidden;
}

@media (min-width: 640px) {
  .hdc-blog-index__card-excerpt {
    -webkit-line-clamp: 2;
  }
}
```

- [ ] **Step 2: Add onError handler to all images**

Create a `hideBrokenImage` function near the top of the IIFE (after `buildImageAlt`):

```js
function hideBrokenImage( event ) {
	if ( event && event.target ) {
		event.target.style.display = 'none';
	}
}
```

Add `onError: hideBrokenImage` to both `<img>` elements:

For the featured image (around line 376-384), add to the props object:

```js
onError: hideBrokenImage,
```

For the card thumbnail (around line 462-470), add to the props object:

```js
onError: hideBrokenImage,
```

- [ ] **Step 3: Fix CTA description text**

Change the CTA description (around line 502-503) from:

```js
'I do not run a newsletter yet. The best way to catch new posts is to follow me on LinkedIn.'
```

To:

```js
'Follow me on LinkedIn for new posts and project updates.'
```

- [ ] **Step 4: Fix block.json description default**

In `block.json`, change line 8:

```json
"description": "Blog listing with featured post hero, search, tag filters, and newsletter CTA.",
```

This is the block description (admin UI), not the content description. The content description default on line 24 should change from:

```json
"default": "Notes on engineering systems, product craft, and learning in public."
```

To:

```json
"default": "Writing on customer-facing engineering, AI workflows, WordPress delivery, and support-to-implementation systems."
```

- [ ] **Step 5: Validate and commit**

Run: `node -c blocks/blog-index/view.js`

```bash
git add blocks/blog-index/view.js blocks/blog-index/style.css blocks/blog-index/block.json
git commit -m "fix(blog-index): add line-clamp, broken image handler, and fix drifted text"
```

---

### Task 13: Run smoke tests for Chunk 3

- [ ] **Step 1: Run full smoke suite**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api
```

Expected: all checks pass

- [ ] **Step 2: Flush caches**

```bash
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

---

## Chunk 4: Reveal Animations

### Task 14: Add IntersectionObserver-based reveal system

**Files:**
- Modify: `blocks/blog-index/view.js` (add `initBlogReveals` function + `useEffect` call)
- Modify: `blocks/blog-index/style.css` (add keyframes + reveal classes + reduced-motion)

- [ ] **Step 1: Add reveal CSS at the end of style.css**

Add before the closing `@media (min-width: 900px)` block (or at the end of file before it):

```css
/* ── Reveal animations ── */

@keyframes hdc-blog-reveal-fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hdc-blog-reveal-fade-up-soft {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hdc-blog-reveal {
  opacity: 0;
}

.hdc-blog-reveal.is-visible {
  animation: hdc-blog-reveal-fade-up var(--motion-duration-medium, 260ms) var(--motion-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1)) forwards;
  animation-delay: calc(var(--reveal-index, 0) * calc(var(--motion-duration-fast, 160ms) / 3));
}

.hdc-blog-reveal.hdc-blog-reveal--fade-up-soft.is-visible {
  animation-name: hdc-blog-reveal-fade-up-soft;
}

@media (prefers-reduced-motion: reduce) {
  .hdc-blog-reveal {
    opacity: 1;
  }

  .hdc-blog-reveal.is-visible {
    animation: none;
  }
}
```

- [ ] **Step 2: Add `initBlogReveals` function to view.js**

Add this function inside the IIFE, before `BlogIndexApp` (around line 183):

```js
var blogRevealObserver = null;

function initBlogReveals() {
	if ( blogRevealObserver ) {
		blogRevealObserver.disconnect();
		blogRevealObserver = null;
	}

	var elements = document.querySelectorAll( '.hdc-blog-reveal:not(.is-visible)' );
	if ( ! elements.length ) {
		return;
	}

	if ( typeof IntersectionObserver === 'undefined' ) {
		elements.forEach( function ( el ) {
			el.classList.add( 'is-visible' );
		} );
		return;
	}

	blogRevealObserver = new IntersectionObserver(
		function ( entries ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					entry.target.classList.add( 'is-visible' );
					blogRevealObserver.unobserve( entry.target );
				}
			} );
		},
		{ threshold: 0.1 }
	);

	elements.forEach( function ( el ) {
		var rect = el.getBoundingClientRect();
		var isAboveFold = rect.top < window.innerHeight && rect.bottom > 0;
		if ( isAboveFold ) {
			el.classList.add( 'is-visible' );
		} else {
			blogRevealObserver.observe( el );
		}
	} );
}
```

- [ ] **Step 3: Add `useEffect` to trigger reveals after data loads**

Inside `BlogIndexApp`, add a `useEffect` that runs after `state.loading` becomes false:

```js
useEffect( function () {
	if ( ! state.loading && state.posts.length > 0 ) {
		// Allow React to flush DOM updates before observing
		requestAnimationFrame( function () {
			initBlogReveals();
		} );
	}
}, [ state.loading, state.posts.length ] );
```

- [ ] **Step 4: Add reveal classes to rendered elements**

Add reveal classes to these elements in the return statement:

**Hero section** — change className:
```js
className: 'hdc-blog-index__hero ember-surface hdc-blog-reveal hdc-blog-reveal--fade-up-soft'
```
Add style prop: `style: { '--reveal-index': 0 }`

**Featured card** — change className:
```js
className: 'hdc-blog-index__featured ember-surface focus-ring hdc-blog-reveal'
```
Add style prop: `style: { '--reveal-index': 0 }`

**Section header row** — change:
```js
{ className: 'hdc-blog-index__header-row hdc-blog-reveal', style: { '--reveal-index': 0 } }
```

**Each post card** — in the `filtered.map` callback, change className and add style. The `filtered.map( function ( post )` needs an index parameter:
```js
filtered.map( function ( post, postIndex ) {
```
Then the card element:
```js
className: 'hdc-blog-index__card focus-ring hdc-blog-reveal hdc-blog-reveal--fade-up-soft' + ( post.featuredImageUrl ? ' has-thumbnail' : '' ),
style: { '--reveal-index': postIndex },
```

- [ ] **Step 5: Validate syntax**

Run: `node -c blocks/blog-index/view.js`
Expected: no output (clean parse)

- [ ] **Step 6: Run full smoke suite**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npm run smoke:full
```

Expected: all route, API, and browser checks pass

- [ ] **Step 7: Flush caches**

```bash
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

- [ ] **Step 8: Commit**

```bash
git add blocks/blog-index/view.js blocks/blog-index/style.css
git commit -m "feat(blog-index): add scroll-triggered reveal animations"
```

---

## Chunk 5: Final Verification

### Task 15: Re-run parity checker

- [ ] **Step 1: Run parity checker agent**

Use the `parity-checker` subagent with the same prompt as the initial check. Expected verdict: **PARITY** or **MINOR_DRIFT** (with only acceptable platform differences remaining).

- [ ] **Step 2: Take Playwright screenshot for visual confirmation**

Run: `npm run smoke:browser`

Verify the blog page shows:
- Warm ember gradient hero band with "Writing" eyebrow
- Featured card with ember surface background
- Filter chips with card+shadow active state
- Search input with magnifying glass icon
- Post cards with hover effects
- Staggered entrance animations

- [ ] **Step 3: Final commit if any adjustments needed**

If the parity checker or visual review identifies remaining issues, fix them and commit.
