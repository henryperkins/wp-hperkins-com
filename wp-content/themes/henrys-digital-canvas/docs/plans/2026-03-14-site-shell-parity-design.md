# Site Shell Parity Design

**Date**: 2026-03-14
**Block**: `site-shell`
**Sources**: `Layout.tsx`, `AppHeader.tsx`, `ThemeSwitcher.tsx`, `CommandPalette.tsx`, `nav-config.ts`
**Verdict**: NEEDS_WORK (1 high, 4 medium, 2 low)

## Extras Decision

- Remove: dynamically fetched WP pages from the command palette; keep only the curated React page list (`navItems` + `ATS Resume`)
- Remove: `updateFooterYear()` from `blocks/site-shell/view.js`; footer ownership stays with `parts/footer.html`

## Reusable Patterns Already In The Working Tree

- `assets/css/design-system.css` already includes `.screen-reader-text`, so the block can add stricter accessible controls without new global utility work.
- `assets/js/hdc-shared-utils.js` already contains `layout-grid`, `file-text`, `folder-git-2`, and `laptop`, which cover the icons needed for command-palette items and the system theme option.
- `docs/plans/2026-03-09-header-footer-parity-design.md` already captures the earlier header parity work, especially the keyboard guard and icon parity decisions, so this pass can focus on the remaining behavioral gaps instead of reopening resolved work.

## Gap List

### High

| Gap | Where | React expected | WP current | Fix |
|-----|-------|----------------|------------|-----|
| Desktop/mobile header switch happens at the wrong width | `blocks/site-shell/style.css`, `blocks/site-shell/view.js` | Desktop nav/actions appear at Tailwind `md`; mobile sheet is only used below that breakpoint | WP keeps the mobile shell active until `900px` | Change the shell breakpoint logic to `768px` in both CSS and JS, and align brand sizing with the React header around tablet widths |

### Medium

| Gap | Where | React expected | WP current | Fix |
|-----|-------|----------------|------------|-----|
| Theme switcher behaves like a radio dropdown menu | `blocks/site-shell/render.php`, `blocks/site-shell/view.js`, `blocks/site-shell/style.css` | Trigger opens a menu with radio-style theme items, proper checked state, keyboard navigation, and focus management | WP uses a lighter custom popover without menu semantics | Add `role="menu"` / `role="menuitemradio"`, checked-state UI, arrow-key navigation, and selected-item focus when opened |
| Command palette header chrome differs | `blocks/site-shell/render.php`, `blocks/site-shell/style.css` | Search icon leading the input; no visible Close button; same empty-state copy as React | WP uses an input plus a visible Close button and custom empty text | Replace the dismiss button with a search-icon input row and update empty copy to `No results found.` |
| Command result rows are heavier than React | `blocks/site-shell/view.js`, `blocks/site-shell/style.css` | Pages are plain label rows; posts show only reading time as shortcut; projects show only `Featured` when applicable | WP renders per-row metadata and caps each group to 8 items | Remove the 8-item cap, keep richer search keywords internally, and render only the shortcut information React exposes |
| Mobile sheet close affordance is incomplete | `blocks/site-shell/render.php`, `blocks/site-shell/view.js`, `blocks/site-shell/style.css` | Sheet includes an in-panel close control in addition to backdrop/trigger closing | WP relies on the header trigger and backdrop only | Add an in-panel close button and preserve focus handling when the sheet closes |

### Low

| Gap | Where | React expected | WP current | Fix |
|-----|-------|----------------|------------|-----|
| Brand scale is slightly small | `blocks/site-shell/style.css` | Brand mark/title step up earlier and read more prominently on larger small screens | WP keeps a smaller title until the oversized `900px` breakpoint | Move the larger brand treatment to smaller breakpoints so the identity matches React sooner |
| Command palette empty-state copy drifts | `blocks/site-shell/render.php` | `No results found.` | `No matching commands found.` | Update the copy while changing the command header markup |

## Implementation Phases

### Phase 1: Responsive Header + Mobile Sheet

1. Move the shell desktop breakpoint from `900px` to `768px` in `blocks/site-shell/style.css`.
2. Update `setupMobileMenu()` in `blocks/site-shell/view.js` to use the same `768px` breakpoint on resize.
3. Add an in-panel mobile close button in `blocks/site-shell/render.php` and wire it into the existing close flow.
4. Adjust mobile-sheet spacing and brand sizing so tablet/header proportions match the React source.

### Phase 2: Theme Switcher Semantics

1. Add menu IDs/labels plus `role="menu"` and `role="menuitemradio"` semantics in `blocks/site-shell/render.php`.
2. Update `setupThemeToggle()` to manage checked state, roving focus, arrow-key navigation, and Escape behavior.
3. Polish the menu visuals in `blocks/site-shell/style.css` so the active state reads like the React dropdown radio items.

### Phase 3: Command Palette Strict Parity

1. Remove the dynamic `pagesEndpoint` fetch path and keep only the curated React page list.
2. Replace the command header with a search-icon input row and remove the visible Close button.
3. Keep search matching rich by using tags/topics/language in search text only, while rendering lean rows with shortcuts only.
4. Remove the per-group item cap and update the empty-state copy to match React.

### Phase 4: Cleanup

1. Remove `updateFooterYear()` from `blocks/site-shell/view.js`.
2. Keep the rest of the footer untouched; footer ownership remains outside the block.
3. Re-run parity verification after smoke tests to confirm the remaining drift is gone or reduced to acceptable minor differences.

## File Impact Summary

| File | Purpose |
|------|---------|
| `blocks/site-shell/render.php` | Add stricter mobile-sheet close control, theme menu semantics, and command palette header markup |
| `blocks/site-shell/view.js` | Align breakpoint handling, theme keyboard/menu behavior, command palette data/rendering, and remove footer-year side effect |
| `blocks/site-shell/style.css` | Align breakpoints, menu visuals, command palette chrome, and mobile close-button styling |

Total: 3 implementation files
