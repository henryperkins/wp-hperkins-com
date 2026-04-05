# Header & Footer Parity Design

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

**Date:** 2026-03-09
**Scope:** `blocks/site-shell/` (header) + `parts/footer.html` (footer)
**Verdict:** NEEDS_WORK (both)

## Source of Truth

| WP file | React source |
|---------|-------------|
| `blocks/site-shell/render.php` | `components/layout/AppHeader.tsx`, `components/ThemeSwitcher.tsx`, `components/CommandPalette.tsx` |
| `blocks/site-shell/view.js` | Same + `components/Layout.tsx` (keyboard guard) |
| `blocks/site-shell/style.css` | Tailwind utilities + `index.css` |
| `parts/footer.html` | `components/layout/AppFooter.tsx`, `components/SocialActions.tsx`, `components/SocialLinkButton.tsx`, `components/InlineSeparated.tsx` |

## Decisions

- **Tagline attribute** (WP-only): REMOVE for strict parity.
- **Command palette "Close" button** (WP-only): KEEP -- improves accessibility.
- **`updateFooterYear()` in site-shell view.js** (WP-only): KEEP -- harmless infrastructure.
- **`max-width: 1200px`**: NOT intentional. Fix to `1400px` in both header and footer.

---

## Phase 1 -- High-severity gaps (header)

### 1A. Command palette keyboard arrow navigation
- **Gap:** No up/down arrow key navigation between command palette items. React uses `cmdk` library behavior.
- **Fix:** In `view.js`, add arrow-key handler to the command palette: track a `highlightIndex`, update on ArrowUp/ArrowDown, scroll into view, select on Enter. Add `.is-highlighted` CSS class for visual feedback.
- **Files:** `view.js`, `style.css`

### 1B. `isEditableTarget` guard for Ctrl+K
- **Gap:** Ctrl+K shortcut fires even when focus is in INPUT/SELECT/TEXTAREA/contentEditable.
- **Fix:** In `view.js` keydown handler (~line 652), add early return when `e.target` is an editable element, matching `Layout.tsx:13-23`.
- **Files:** `view.js`

## Phase 2 -- Medium-severity gaps (header + footer)

### 2A. Theme switcher Sun/Moon SVG icons
- **Gap:** WP trigger shows text "Theme" only. React shows Sun/Moon SVG icons with rotate/scale dark-mode animation.
- **Fix:** In `render.php`, replace text trigger with Sun+Moon SVG icons (Lucide `Sun` and `Moon`, 16x16). Add CSS transitions: Sun visible in light, rotated+hidden in dark; Moon inverse. Add `sr-only` "Toggle theme" text.
- **Files:** `render.php`, `style.css`

### 2B. Nav link active/hover color tokens
- **Gap:** `.is-active` uses `--secondary`/`--foreground` instead of `--interactive-nav-active-surface`/`--interactive-nav-active-foreground`.
- **Fix:** Update `style.css` nav link rules to use the correct interactive tokens for both active and hover states.
- **Files:** `style.css`

### 2C. Footer: `<ul>/<li>` semantic list for social links
- **Gap:** Social links are bare `<a>` elements in a `<div>`. React wraps in `<ul>/<li>`.
- **Fix:** In `parts/footer.html`, wrap the three link `<a>` elements in `<ul class="hdc-footer-shell__links"><li>...</li></ul>`. Add CSS to reset list styles (`list-style: none; padding: 0; margin: 0; display: flex; gap: ...`).
- **Files:** `parts/footer.html`, `style.css`

### 2D. Footer: `text-shadow-inverse-strong` on text elements
- **Gap:** Identity name, meta text, and copyright text all lack `text-shadow` that React applies for legibility on the dark textured background.
- **Fix:** Add `text-shadow: var(--text-shadow-inverse-strong);` to `.hdc-footer-shell__identity`, `.hdc-footer-shell__meta`, and `.hdc-footer-shell__bottom`.
- **Files:** `style.css`

### 2E. Footer: `focus-ring-inverse` on social links
- **Gap:** Footer links use `focus-ring` (light outer ring) instead of `focus-ring-inverse` (dark outer ring matching footer surface).
- **Fix:** In `parts/footer.html`, change class `focus-ring` to `focus-ring-inverse` on each `.hdc-footer-shell__link`.
- **Files:** `parts/footer.html`

### 2F. Container max-width 1200px -> 1400px
- **Gap:** Both header `.hdc-site-shell__inner` and footer inner container use `max-width: 1200px`. React uses `1400px`.
- **Fix:** Update `max-width` to `1400px` in both header and footer container rules.
- **Files:** `style.css`

## Phase 3 -- Low-severity gaps (header)

### 3A. Mobile menu slide animation
- **Gap:** Menu appears/disappears instantly via `[hidden]` toggle. React uses slide-in-from-top.
- **Fix:** Add CSS `transform: translateY(-100%)` default, `translateY(0)` when open, with transition. Remove `[hidden]` approach in favor of visibility+transform.
- **Files:** `style.css`, `view.js`

### 3B. Command palette open/close animation
- **Gap:** Command palette appears/disappears instantly.
- **Fix:** Add CSS scale+fade transition on `.hdc-site-shell__command-panel` (opacity 0 + scale 0.95 -> opacity 1 + scale 1).
- **Files:** `style.css`

### 3C. Theme dropdown open/close animation
- **Gap:** Theme menu appears/disappears instantly.
- **Fix:** Add CSS scale+fade transition on `.hdc-site-shell__theme-menu` matching Radix DropdownMenu animation (zoom-in-95).
- **Files:** `style.css`

### 3D. Menu trigger SVG icons
- **Gap:** Uses Unicode `hamburger` / `x` text. React uses Lucide `Menu`/`X` SVG icons (16x16).
- **Fix:** Replace text with inline SVG markup in `render.php`.
- **Files:** `render.php`

### 3E. Mac shortcut symbol
- **Gap:** Shows "Cmd+K" instead of unicode symbol.
- **Fix:** Change Apple platform label from `'Cmd+K'` to `'\u2318K'` in `view.js`.
- **Files:** `view.js`

## Phase 4 -- Low-severity gaps (footer)

### 4A. Social link backdrop blur
- **Gap:** React `socialInverseGlass` includes `backdrop-overlay-subtle`. WP omits it.
- **Fix:** Add `backdrop-filter: blur(var(--overlay-blur-subtle))` to `.hdc-footer-shell__link`.
- **Files:** `style.css`

### 4B. Social link default text color (muted)
- **Gap:** WP uses `inverse-foreground` (bright). React uses `inverse-muted-foreground` by default, `inverse-foreground` on hover.
- **Fix:** Change default `color` to `hsl(var(--inverse-muted-foreground))`, add `hsl(var(--inverse-foreground))` on hover.
- **Files:** `style.css`

### 4C. Social link font-weight
- **Gap:** WP uses `font-weight: 600`. React uses `font-normal` (400).
- **Fix:** Change to `font-weight: 400`.
- **Files:** `style.css`

### 4D. Footer container horizontal padding
- **Gap:** WP uses `padding-inline: 1rem`. React uses `2rem`.
- **Fix:** Change to `padding-inline: 2rem` (covered by max-width fix in 2F, but padding also needs adjustment).
- **Files:** `style.css`

### 4E. Responsive image swap for footer backdrop
- **Gap:** React swaps to `-960.webp` images at `max-width: 768px`. WP only adjusts position.
- **Fix:** Add `@media (max-width: 768px)` rule in `design-system.css` to swap to smaller image variants if available.
- **Files:** `design-system.css`

## Phase 5 -- Cleanup

### 5A. Remove tagline attribute
- **Gap:** WP-only `tagline` attribute not in React.
- **Fix:** Remove `tagline` from `block.json` attributes, remove conditional tagline rendering from `render.php`, remove `.hdc-site-shell__tagline` styles from `style.css`.
- **Files:** `block.json`, `render.php`, `style.css`

## Smoke Test

After each phase, run `npm run smoke:full` from theme dir.

## Verification

After all phases, re-run parity checker for both site-shell and footer to confirm PARITY or MINOR_DRIFT.
