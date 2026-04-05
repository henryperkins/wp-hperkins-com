# Header & Footer Parity Remediation — Implementation Plan

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close all parity gaps between the WordPress site-shell block + footer template part and their React source components (AppHeader, ThemeSwitcher, CommandPalette, AppFooter).

**Architecture:** Five phases of edits across `view.js`, `style.css`, `render.php`, `block.json`, `parts/footer.html`, and `design-system.css`. Each phase is independently testable. No build step — all files are vanilla JS/CSS/PHP.

**Tech Stack:** Vanilla JS, CSS, PHP server render, WordPress block theme template parts

**Block directory:** `wp-content/themes/henrys-digital-canvas/blocks/site-shell/`
**Footer file:** `wp-content/themes/henrys-digital-canvas/parts/footer.html`
**Design system:** `wp-content/themes/henrys-digital-canvas/assets/css/design-system.css`

---

## Phase 1: High-Severity Header Gaps

### Task 1: Add `isEditableTarget` guard for Ctrl+K shortcut

**Files:**
- Modify: `blocks/site-shell/view.js:652-658`

**React reference:** `Layout.tsx:13-23` — `isEditableTarget()` checks INPUT/SELECT/TEXTAREA/contentEditable before intercepting Ctrl+K.

**Step 1: Add guard function**

Before the `setupCommandPalette` function (~line 442), add this helper:

```js
function isEditableTarget( target ) {
	if ( ! target || ! ( target instanceof HTMLElement ) ) {
		return false;
	}
	if ( target.isContentEditable ) {
		return true;
	}
	var tag = target.tagName;
	return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
}
```

**Step 2: Add early return in keydown handler**

In the keydown handler at line 652, add the guard after the `isShortcut` check:

```js
document.addEventListener( 'keydown', function ( event ) {
	var isShortcut = event.key.toLowerCase() === 'k' && ( event.ctrlKey || event.metaKey );
	if ( isShortcut ) {
		if ( isEditableTarget( event.target ) ) {
			return;
		}
		event.preventDefault();
		toggleDialog();
		return;
	}
	// ... rest unchanged
```

**Step 3: Verify manually**

Open the site, focus on the command palette search input, press Ctrl+K — it should NOT toggle the palette closed. Press Ctrl+K from a non-input context — it should still open.

**Step 4: Commit**

```bash
cd wp-content/themes/henrys-digital-canvas
git add blocks/site-shell/view.js
git commit -m "fix(site-shell): add isEditableTarget guard for Ctrl+K shortcut"
```

---

### Task 2: Add command palette keyboard arrow navigation

**Files:**
- Modify: `blocks/site-shell/view.js` (inside `setupCommandPalette`)
- Modify: `blocks/site-shell/style.css` (add `.is-highlighted` style)

**React reference:** `cmdk` library provides ArrowUp/ArrowDown to highlight items, Enter to navigate, automatic scroll-into-view.

**Step 1: Add highlight tracking state**

Inside `setupCommandPalette`, after the `state` object (~line 460), add:

```js
var highlightIndex = -1;
```

**Step 2: Add highlight helper functions**

After the `render` function (~line 640), add:

```js
function getAllVisibleItems() {
	return Array.prototype.slice.call(
		dialog.querySelectorAll( '.hdc-site-shell__command-item' )
	).filter( function ( el ) {
		return el.getClientRects().length > 0 && ! el.closest( '[hidden]' );
	} );
}

function setHighlight( items, index ) {
	items.forEach( function ( item, i ) {
		item.classList.toggle( 'is-highlighted', i === index );
	} );
	if ( index >= 0 && index < items.length ) {
		items[ index ].scrollIntoView( { block: 'nearest' } );
	}
}

function clearHighlight() {
	highlightIndex = -1;
	dialog.querySelectorAll( '.is-highlighted' ).forEach( function ( el ) {
		el.classList.remove( 'is-highlighted' );
	} );
}
```

**Step 3: Reset highlight on input change**

Modify the existing `input.addEventListener( 'input', render )` line (~line 650) to also clear highlight:

```js
input.addEventListener( 'input', function () {
	render();
	clearHighlight();
} );
```

**Step 4: Add arrow key handling in the keydown listener**

Inside the existing `document.addEventListener( 'keydown', ... )` handler, after the Escape block and before the Tab focus-trap block, add:

```js
if ( state.opened && ( event.key === 'ArrowDown' || event.key === 'ArrowUp' ) ) {
	event.preventDefault();
	var items = getAllVisibleItems();
	if ( items.length === 0 ) {
		return;
	}
	if ( event.key === 'ArrowDown' ) {
		highlightIndex = highlightIndex < items.length - 1 ? highlightIndex + 1 : 0;
	} else {
		highlightIndex = highlightIndex > 0 ? highlightIndex - 1 : items.length - 1;
	}
	setHighlight( items, highlightIndex );
	return;
}

if ( state.opened && event.key === 'Enter' && highlightIndex >= 0 ) {
	event.preventDefault();
	var enterItems = getAllVisibleItems();
	if ( highlightIndex < enterItems.length ) {
		enterItems[ highlightIndex ].click();
	}
	return;
}
```

**Step 5: Clear highlight on dialog close**

In the `closeDialog` function (~line 482), add `clearHighlight()`:

```js
function closeDialog() {
	dialog.hidden = true;
	document.body.classList.remove( 'hdc-command-open' );
	state.opened = false;
	clearHighlight();
}
```

**Step 6: Add `.is-highlighted` CSS**

In `style.css`, after the `.hdc-site-shell__command-item:hover` rule (~line 419), add:

```css
.hdc-site-shell__command-item.is-highlighted {
  background: hsl(var(--secondary));
}
```

**Step 7: Verify manually**

Open command palette (Ctrl+K), press ArrowDown — first item highlights. Press ArrowDown again — second item highlights. Press ArrowUp — first item highlights. Press Enter — navigates to highlighted item's URL.

**Step 8: Commit**

```bash
git add blocks/site-shell/view.js blocks/site-shell/style.css
git commit -m "feat(site-shell): add keyboard arrow navigation to command palette"
```

---

### Task 3: Run Phase 1 smoke test

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:full
```

Expected: all checks pass.

---

## Phase 2: Medium-Severity Gaps (Header + Footer)

### Task 4: Replace theme trigger text with Sun/Moon SVG icons

**Files:**
- Modify: `blocks/site-shell/render.php:131-134`
- Modify: `blocks/site-shell/style.css`
- Modify: `blocks/site-shell/view.js` (remove `trigger.textContent = 'Theme'` line)

**React reference:** `ThemeSwitcher.tsx:33-34` — Sun icon visible in light (rotated+hidden in dark), Moon icon inverse.

**Step 1: Replace theme trigger markup in render.php**

Replace lines 131-134:

```php
<button type="button" class="hdc-site-shell__theme-trigger focus-ring" data-hdc-theme-trigger>
	<?php esc_html_e( 'Theme', 'henrys-digital-canvas' ); ?>
</button>
```

With:

```php
<button type="button" class="hdc-site-shell__theme-trigger focus-ring" data-hdc-theme-trigger aria-label="<?php esc_attr_e( 'Change theme', 'henrys-digital-canvas' ); ?>">
	<svg class="hdc-site-shell__theme-icon hdc-site-shell__theme-icon--sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
		<circle cx="12" cy="12" r="4"></circle>
		<path d="M12 2v2"></path>
		<path d="M12 20v2"></path>
		<path d="m4.93 4.93 1.41 1.41"></path>
		<path d="m17.66 17.66 1.41 1.41"></path>
		<path d="M2 12h2"></path>
		<path d="M20 12h2"></path>
		<path d="m6.34 17.66-1.41 1.41"></path>
		<path d="m19.07 4.93-1.41 1.41"></path>
	</svg>
	<svg class="hdc-site-shell__theme-icon hdc-site-shell__theme-icon--moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
		<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
	</svg>
	<span class="screen-reader-text"><?php esc_html_e( 'Theme', 'henrys-digital-canvas' ); ?></span>
</button>
```

**Step 2: Add Sun/Moon icon CSS**

In `style.css`, after the `.hdc-site-shell__theme` rule (~line 178), add:

```css
.hdc-site-shell__theme-trigger {
  position: relative;
}

.hdc-site-shell__theme-icon {
  display: block;
  transition: transform var(--motion-duration-fast) var(--motion-ease-standard),
    opacity var(--motion-duration-fast) var(--motion-ease-standard);
}

.hdc-site-shell__theme-icon--sun {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

.hdc-site-shell__theme-icon--moon {
  left: 50%;
  opacity: 0;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%) rotate(90deg) scale(0);
}

.dark .hdc-site-shell__theme-icon--sun {
  opacity: 0;
  transform: rotate(-90deg) scale(0);
}

.dark .hdc-site-shell__theme-icon--moon {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0deg) scale(1);
}
```

Also update the shared trigger rule to make theme trigger square (icon-only button). Find the existing `.hdc-site-shell__theme-trigger` properties inside the shared rule at line 144-160, and add after it:

```css
.hdc-site-shell__theme-trigger {
  justify-content: center;
  padding: 0;
  width: 2.75rem;
}
```

**Step 3: Remove `trigger.textContent = 'Theme'` from view.js**

In `view.js`, inside the `updateThemeUI` function (~line 327), change:

```js
trigger.textContent = 'Theme';
```

To remove this line entirely (the trigger now has SVG icons, not text). Keep the `setAttribute` calls below it.

**Step 4: Commit**

```bash
git add blocks/site-shell/render.php blocks/site-shell/style.css blocks/site-shell/view.js
git commit -m "feat(site-shell): replace text theme trigger with Sun/Moon SVG icons"
```

---

### Task 5: Fix nav link active/hover color tokens

**Files:**
- Modify: `blocks/site-shell/style.css:120-126`

**React reference:** NavLinkPill uses `interactive-nav-active-surface`/`interactive-nav-active-foreground` for active state and `interactive-nav-hover-surface`/`interactive-nav-hover-foreground` for hover. These tokens are already defined in `design-system.css:226-229` (light) and `416-420` (dark).

**Step 1: Split hover and active into separate rules**

Replace lines 120-126:

```css
.hdc-site-shell__nav-link:hover,
.hdc-site-shell__mobile-link:hover,
.hdc-site-shell__nav-link.is-active,
.hdc-site-shell__mobile-link.is-active {
  background: hsl(var(--secondary));
  color: hsl(var(--foreground));
}
```

With:

```css
.hdc-site-shell__nav-link:hover,
.hdc-site-shell__mobile-link:hover {
  background: hsl(var(--interactive-nav-hover-surface));
  color: hsl(var(--interactive-nav-hover-foreground));
}

.hdc-site-shell__nav-link.is-active,
.hdc-site-shell__mobile-link.is-active {
  background: hsl(var(--interactive-nav-active-surface));
  color: hsl(var(--interactive-nav-active-foreground));
}
```

**Step 2: Commit**

```bash
git add blocks/site-shell/style.css
git commit -m "fix(site-shell): use correct interactive nav tokens for active/hover states"
```

---

### Task 6: Footer — wrap social links in `<ul>/<li>` list

**Files:**
- Modify: `parts/footer.html:18-41`
- Modify: `blocks/site-shell/style.css` (footer link styles, add `<ul>` reset)

**React reference:** `SocialActions.tsx:19` — `<ul className="flex flex-wrap items-center gap-4">`

**Step 1: Update footer.html**

Replace lines 18-41 (the `<div class="hdc-footer-shell__links">` and its contents):

```html
<ul class="hdc-footer-shell__links">
	<li>
		<a class="hdc-footer-shell__link focus-ring-inverse" href="https://github.com/henryperkins" target="_blank" rel="noopener noreferrer">
			<svg class="hdc-footer-shell__link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
				<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
				<path d="M9 18c-4.51 2-5-2-7-2"></path>
			</svg>
			<span>GitHub</span>
		</a>
	</li>
	<li>
		<a class="hdc-footer-shell__link focus-ring-inverse" href="https://linkedin.com/in/henryperkins" target="_blank" rel="noopener noreferrer">
			<svg class="hdc-footer-shell__link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
				<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
				<rect width="4" height="12" x="2" y="9"></rect>
				<circle cx="4" cy="4" r="2"></circle>
			</svg>
			<span>LinkedIn</span>
		</a>
	</li>
	<li>
		<a class="hdc-footer-shell__link focus-ring-inverse" href="mailto:henry@lakefrontdigital.io">
			<svg class="hdc-footer-shell__link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
				<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
				<rect x="2" y="4" width="20" height="16" rx="2"></rect>
			</svg>
			<span>Email</span>
		</a>
	</li>
</ul>
```

**Step 2: Update CSS for `<ul>` list reset**

In `style.css`, update the existing `.hdc-footer-shell__links` rule (~line 518) to add list reset:

```css
.hdc-footer-shell .hdc-footer-shell__links {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
}
```

**Step 3: Commit**

```bash
git add parts/footer.html blocks/site-shell/style.css
git commit -m "fix(footer): wrap social links in semantic ul/li list, use focus-ring-inverse"
```

---

### Task 7: Footer — add `text-shadow-inverse-strong` to text elements

**Files:**
- Modify: `blocks/site-shell/style.css:490-560`

**React reference:** `AppFooter.tsx:15-16,28` — all three text elements have `text-shadow-inverse-strong` class. The token `--text-shadow-inverse-strong` is already defined in `design-system.css:296`.

**Step 1: Add text-shadow to identity**

In `style.css`, add to `.hdc-footer-shell .hdc-footer-shell__identity` (~line 490):

```css
text-shadow: var(--text-shadow-inverse-strong);
```

**Step 2: Add text-shadow to meta**

Add to `.hdc-footer-shell .hdc-footer-shell__meta` (~line 498):

```css
text-shadow: var(--text-shadow-inverse-strong);
```

**Step 3: Add text-shadow to bottom/copyright**

Add to `.hdc-footer-shell .hdc-footer-shell__bottom` (~line 553):

```css
text-shadow: var(--text-shadow-inverse-strong);
```

**Step 4: Commit**

```bash
git add blocks/site-shell/style.css
git commit -m "fix(footer): add text-shadow-inverse-strong to identity, meta, and copyright"
```

---

### Task 8: Fix container max-width 1200px -> 1400px

**Files:**
- Modify: `blocks/site-shell/style.css:28` (header inner)
- Modify: `blocks/site-shell/style.css:254` (mobile shell)
- Modify: `blocks/site-shell/style.css:471` (footer inner)

**Step 1: Update header inner max-width**

Change `.hdc-site-shell__inner` line 28:

```css
max-width: 1400px;
```

**Step 2: Update mobile shell max-width**

Change `.hdc-site-shell__mobile-shell` line 254:

```css
max-width: 1400px;
```

**Step 3: Update footer inner max-width**

Change `.hdc-footer-shell .hdc-footer-shell__inner` line 471:

```css
max-width: 1400px;
```

**Step 4: Update footer inner horizontal padding**

Change `.hdc-footer-shell .hdc-footer-shell__inner` line 472 padding from `2.5rem 1rem 2rem` to:

```css
padding: 2.5rem 2rem 2rem;
```

**Step 5: Commit**

```bash
git add blocks/site-shell/style.css
git commit -m "fix(site-shell): update container max-width to 1400px, footer padding to 2rem"
```

---

### Task 9: Run Phase 2 smoke test

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:full
```

Expected: all checks pass.

---

## Phase 3: Low-Severity Header Gaps

### Task 10: Add mobile menu slide animation

**Files:**
- Modify: `blocks/site-shell/style.css:230-239` (mobile menu)
- Modify: `blocks/site-shell/style.css:241-247` (mobile backdrop)
- Modify: `blocks/site-shell/view.js` (replace `hidden` toggling with class-based visibility)

**React reference:** Radix Sheet slides in from top with `slide-in-from-top` / `slide-out-to-top`.

**Step 1: Update mobile menu CSS**

Replace the `.hdc-site-shell__mobile` rule (~line 230):

```css
.hdc-site-shell__mobile {
  background: hsl(var(--background));
  border-top: 1px solid hsl(var(--border));
  box-shadow: var(--shadow-floating);
  inset: var(--layout-header-end) 0 0;
  opacity: 0;
  overflow: auto;
  overscroll-behavior: contain;
  pointer-events: none;
  position: fixed;
  transform: translateY(-1rem);
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-standard),
    transform var(--motion-duration-fast) var(--motion-ease-standard),
    visibility 0s linear var(--motion-duration-fast);
  visibility: hidden;
  z-index: var(--layer-overlay);
}

.hdc-site-shell.is-mobile-open .hdc-site-shell__mobile {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-standard),
    transform var(--motion-duration-fast) var(--motion-ease-standard),
    visibility 0s linear 0s;
  visibility: visible;
}
```

**Step 2: Update mobile backdrop CSS**

Replace the `.hdc-site-shell__mobile-backdrop` rule (~line 241):

```css
.hdc-site-shell__mobile-backdrop {
  background: hsl(0 0% 0% / 0.32);
  backdrop-filter: blur(2px);
  inset: var(--layout-header-end) 0 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-standard),
    visibility 0s linear var(--motion-duration-fast);
  visibility: hidden;
  z-index: calc(var(--layer-overlay) - 1);
}

.hdc-site-shell.is-mobile-open .hdc-site-shell__mobile-backdrop {
  opacity: 1;
  pointer-events: auto;
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-standard),
    visibility 0s linear 0s;
  visibility: visible;
}
```

**Step 3: Update view.js — remove `hidden` toggling for mobile menu**

In `view.js`, update `openMenu` (~line 189): remove `mobileMenu.hidden = false;` and `backdrop.hidden = false;` lines. The CSS transition handles visibility via the `is-mobile-open` class which `updateTriggerState` already toggles.

In `closeMenu` (~line 169): remove `mobileMenu.hidden = true;` and `backdrop.hidden = true;` lines.

In `isMenuOpen` (~line 139): change from checking `mobileMenu.hidden` to:

```js
function isMenuOpen() {
	return root.classList.contains( 'is-mobile-open' );
}
```

Remove `hidden` from the menu trigger's `updateTriggerState(false)` initial call — the CSS now handles the hidden state via visibility.

**Step 4: Update render.php — remove `hidden` attribute from mobile elements**

In `render.php`, remove `hidden` from the `<section ... data-hdc-mobile-menu ... hidden>` element (~line 168) and from `<div ... data-hdc-mobile-backdrop hidden>` (~line 158). The CSS now handles visibility.

**Step 5: Update the 900px media query**

In `style.css`, inside `@media (min-width: 900px)` (~line 576-580), update the mobile menu hiding:

```css
.hdc-site-shell__menu-trigger,
.hdc-site-shell__mobile,
.hdc-site-shell__mobile-backdrop {
  display: none !important;
}
```

**Step 6: Commit**

```bash
git add blocks/site-shell/style.css blocks/site-shell/view.js blocks/site-shell/render.php
git commit -m "feat(site-shell): add mobile menu slide-in animation"
```

---

### Task 11: Add command palette open/close animation

**Files:**
- Modify: `blocks/site-shell/style.css:337-361` (command dialog + panel)

**Step 1: Update command wrapper CSS**

Replace/update `.hdc-site-shell__command` (~line 337):

```css
.hdc-site-shell__command {
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-standard),
    visibility 0s linear var(--motion-duration-fast);
  visibility: hidden;
  z-index: var(--layer-modal);
}

.hdc-site-shell__command:not([hidden]) {
  opacity: 1;
  pointer-events: auto;
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-standard),
    visibility 0s linear 0s;
  visibility: visible;
}
```

**Step 2: Update command panel CSS**

Add scale transition to `.hdc-site-shell__command-panel` (~line 349):

```css
.hdc-site-shell__command-panel {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-surface);
  box-shadow: var(--shadow-overlay);
  left: 50%;
  max-height: min(70vh, 34rem);
  max-width: min(92vw, 44rem);
  overflow: auto;
  position: relative;
  top: 12vh;
  transform: translateX(-50%) scale(0.95);
  transition: transform var(--motion-duration-fast) var(--motion-ease-standard);
  width: 100%;
}

.hdc-site-shell__command:not([hidden]) .hdc-site-shell__command-panel {
  transform: translateX(-50%) scale(1);
}
```

**Step 3: Commit**

```bash
git add blocks/site-shell/style.css
git commit -m "feat(site-shell): add command palette fade+scale animation"
```

---

### Task 12: Add theme dropdown open/close animation

**Files:**
- Modify: `blocks/site-shell/style.css:182-195` (theme menu)

**Step 1: Update theme menu CSS**

Replace `.hdc-site-shell__theme-menu` rule (~line 182):

```css
.hdc-site-shell__theme-menu {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-control);
  box-shadow: var(--shadow-surface-2);
  display: grid;
  gap: 0.2rem;
  min-width: 7rem;
  opacity: 0;
  padding: 0.35rem;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: calc(100% + 0.35rem);
  transform: scale(0.95);
  transform-origin: top right;
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-standard),
    transform var(--motion-duration-fast) var(--motion-ease-standard),
    visibility 0s linear var(--motion-duration-fast);
  visibility: hidden;
  z-index: var(--layer-overlay);
}

.hdc-site-shell__theme-menu:not([hidden]) {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-standard),
    transform var(--motion-duration-fast) var(--motion-ease-standard),
    visibility 0s linear 0s;
  visibility: visible;
}
```

**Step 2: Commit**

```bash
git add blocks/site-shell/style.css
git commit -m "feat(site-shell): add theme dropdown zoom animation"
```

---

### Task 13: Replace menu trigger text with SVG icons

**Files:**
- Modify: `blocks/site-shell/render.php:152` (menu trigger icon)
- Modify: `blocks/site-shell/view.js:153` (toggle icon content)
- Modify: `blocks/site-shell/style.css:218-224` (icon sizing)

**React reference:** `AppHeader.tsx:83` — `<Menu size={16}>` and `<X size={16}>` Lucide SVGs.

**Step 1: Update render.php trigger icon**

Replace line 152 (`<span ... data-hdc-menu-icon ...>☰</span>`):

```php
<span class="hdc-site-shell__menu-trigger-icon" data-hdc-menu-icon aria-hidden="true">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" data-hdc-menu-icon-open>
		<line x1="4" x2="20" y1="12" y2="12"></line>
		<line x1="4" x2="20" y1="6" y2="6"></line>
		<line x1="4" x2="20" y1="18" y2="18"></line>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" data-hdc-menu-icon-close style="display:none">
		<path d="M18 6 6 18"></path>
		<path d="m6 6 12 12"></path>
	</svg>
</span>
```

**Step 2: Update view.js icon toggling**

In `updateTriggerState` (~line 152-153), replace:

```js
if ( triggerIcon ) {
	triggerIcon.textContent = open ? 'x' : '☰';
}
```

With:

```js
if ( triggerIcon ) {
	var openIcon = triggerIcon.querySelector( '[data-hdc-menu-icon-open]' );
	var closeIcon = triggerIcon.querySelector( '[data-hdc-menu-icon-close]' );
	if ( openIcon ) {
		openIcon.style.display = open ? 'none' : '';
	}
	if ( closeIcon ) {
		closeIcon.style.display = open ? '' : 'none';
	}
}
```

**Step 3: Update CSS icon sizing**

Replace `.hdc-site-shell__menu-trigger-icon` (~line 218):

```css
.hdc-site-shell__menu-trigger-icon {
  align-items: center;
  display: inline-flex;
  height: 1rem;
  justify-content: center;
  width: 1rem;
}

.hdc-site-shell__menu-trigger-icon svg {
  display: block;
}
```

**Step 4: Commit**

```bash
git add blocks/site-shell/render.php blocks/site-shell/view.js blocks/site-shell/style.css
git commit -m "feat(site-shell): replace Unicode menu trigger with Lucide SVG icons"
```

---

### Task 14: Fix Mac shortcut symbol

**Files:**
- Modify: `blocks/site-shell/view.js:53`

**Step 1: Change label**

In `updateShortcutHints` (~line 53), change:

```js
var label = isApplePlatform() ? 'Cmd+K' : 'Ctrl+K';
```

To:

```js
var label = isApplePlatform() ? '\u2318K' : 'Ctrl+K';
```

**Step 2: Commit**

```bash
git add blocks/site-shell/view.js
git commit -m "fix(site-shell): use Unicode command symbol for Mac shortcut hint"
```

---

### Task 15: Run Phase 3 smoke test

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:full
```

Expected: all checks pass.

---

## Phase 4: Low-Severity Footer Gaps

### Task 16: Footer link styling refinements

**Files:**
- Modify: `blocks/site-shell/style.css:526-543` (footer link rules)

**React reference:** `button.tsx:34` — `socialInverseGlass` variant: `text-inverse-muted-foreground`, `backdrop-overlay-subtle`, `font-normal`, hover `text-inverse-foreground`.

**Step 1: Update `.hdc-footer-shell__link` rule**

Replace the `.hdc-footer-shell .hdc-footer-shell__link` rule (~line 526):

```css
.hdc-footer-shell .hdc-footer-shell__link {
  -webkit-backdrop-filter: blur(var(--overlay-blur-subtle));
  backdrop-filter: blur(var(--overlay-blur-subtle));
  background: transparent;
  border: 1px solid hsl(var(--inverse-border));
  border-radius: var(--radius-pill);
  color: hsl(var(--inverse-muted-foreground));
  display: inline-flex;
  font-size: 0.8rem;
  font-weight: 400;
  gap: 0.45rem;
  line-height: 1;
  min-height: 2.4rem;
  padding: 0.55rem 0.85rem;
  text-decoration: none;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease-standard),
    border-color var(--motion-duration-fast) var(--motion-ease-standard),
    color var(--motion-duration-fast) var(--motion-ease-standard);
}
```

**Step 2: Update hover to include text color change**

Replace the `.hdc-footer-shell .hdc-footer-shell__link:hover` rule (~line 549):

```css
.hdc-footer-shell .hdc-footer-shell__link:hover {
  background: hsl(var(--inverse-surface-hover));
  color: hsl(var(--inverse-foreground));
}
```

**Step 3: Commit**

```bash
git add blocks/site-shell/style.css
git commit -m "fix(footer): align social link styling with React socialInverseGlass variant"
```

---

### Task 17: Run Phase 4 smoke test

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:full
```

Expected: all checks pass.

---

## Phase 5: Cleanup

### Task 18: Remove tagline attribute

**Files:**
- Modify: `blocks/site-shell/block.json:25-28` (remove tagline attribute)
- Modify: `blocks/site-shell/render.php:14,99-101` (remove tagline default and conditional render)
- Modify: `blocks/site-shell/style.css:83-89` (remove tagline styles)
- Modify: `blocks/site-shell/style.css:610-612` (remove mobile tagline hide rule)

**Step 1: Remove from block.json**

Remove lines 25-28 (the `"tagline"` attribute entry):

```json
"tagline": {
	"type": "string",
	"default": ""
},
```

**Step 2: Remove from render.php**

Remove line 14 (`'tagline' => ''` from defaults array).

Remove lines 99-101 (the tagline conditional block):

```php
<?php if ( '' !== trim( (string) $attrs['tagline'] ) ) : ?>
	<span class="hdc-site-shell__tagline"><?php echo esc_html( sanitize_text_field( $attrs['tagline'] ) ); ?></span>
<?php endif; ?>
```

**Step 3: Remove from style.css**

Remove the `.hdc-site-shell__tagline` rule (~line 83-89):

```css
.hdc-site-shell__tagline {
  color: hsl(var(--text-meta));
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}
```

Remove the `@media (max-width: 899px)` rule for tagline (~line 610-612):

```css
.hdc-site-shell__tagline {
  display: none;
}
```

Also remove the `.hdc-site-shell-editor__tagline` editor style (~line 459-463) if present.

**Step 4: Commit**

```bash
git add blocks/site-shell/block.json blocks/site-shell/render.php blocks/site-shell/style.css
git commit -m "chore(site-shell): remove WP-only tagline attribute for strict parity"
```

---

### Task 19: Final smoke test

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:full
```

Expected: all checks pass.

---

### Task 20: Re-run parity checker

Re-run the parity-checker agent for both site-shell and footer to confirm verdict is PARITY or MINOR_DRIFT.
