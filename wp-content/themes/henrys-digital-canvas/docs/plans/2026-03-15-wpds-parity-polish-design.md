# WPDS Parity Polish Design

**Date**: 2026-03-15
**Scope**: Foundation token/utility gaps + background library port
**Source of truth**: `/home/azureuser/henry-s-digital-canvas/src/index.css` and `src/styles/background-library.css`

## Problem

The WordPress theme's design system (`assets/css/design-system.css`) has drifted from the React source app's token system. A token sync audit found 28 mismatches (4 real missing tokens, 24 cosmetic gradient whitespace) and a utility sync audit found 9 missing utility classes. The background library CSS (10 named surface/backdrop classes) has not been ported at all.

## Section 1: Foundation Token & Utility Parity

### 1a. Missing Tokens

Add to both `:root` and `[data-theme="dark"]` blocks in `design-system.css`:

| Token | Light Value | Dark Value | Category |
|-------|-------------|------------|----------|
| `--brand-linkedin` | `210 82% 40%` | `210 82% 52%` | Brand |
| `--overlay-blur-glass` | `12px` | `12px` | Blur |
| `--scroll-margin-anchor` | `calc(var(--layout-header-height) + 2.5rem)` | same | Layout |
| `--text-danger` | `0 72% 42%` | `2 85% 74%` | Text |
| `--radius-indicator` | `calc(var(--radius) - 8px)` | inherited (`:root` only, not in dark block) | Radius |

### 1b. Missing Resolved Color Convenience Tokens

Add to the `:root` block alongside existing `--color-*` resolved tokens (lines ~111-188 in design-system.css):

- `--color-text-danger: hsl(var(--text-danger));`
- `--color-brand-linkedin: hsl(var(--brand-linkedin));`

### 1b-2. Update `.glass` to Use New Token

Once `--overlay-blur-glass` is added, update the existing `.glass` utility (design-system.css) from hardcoded `blur(12px)` to `blur(var(--overlay-blur-glass))` to match the React source and avoid a dead token.

### 1c. Responsive Header Height

React bumps `--layout-header-height` to `4rem` at `>=768px`. WP is fixed at `3.5rem`.

Add a `@media (min-width: 768px)` block that sets `--layout-header-height: 4rem` for both light and dark roots. Place it after the dark-mode block, before the resolved-color block.

### 1d. Missing Utility Classes (9)

Add to the utility section of `design-system.css`:

| Utility | Definition |
|---------|-----------|
| `rounded-indicator` | `border-radius: var(--radius-indicator);` |
| `scroll-mt-anchor` | `scroll-margin-top: var(--scroll-margin-anchor);` |
| `shadow-control` | `box-shadow: var(--shadow-control);` (note: `--shadow-control` token already exists) |
| `text-accent-sm` | `font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; color: hsl(var(--text-accent));` |
| `text-card-title-compact` | `font-size: 1rem; font-weight: 600; line-height: 1.25; color: hsl(var(--foreground)); @media (min-width: 640px) { font-size: 1.125rem; line-height: 1.75rem; }` (note: 640px is Tailwind's `sm:` breakpoint, new to WP stylesheet) |
| `text-heading-accent` | `font-size: 0.875rem; line-height: 1.25rem; font-weight: 600; color: hsl(var(--text-accent));` |
| `text-heading-sm` | `font-size: 0.875rem; line-height: 1.25rem; font-weight: 600; color: hsl(var(--foreground));` |
| `text-stat-compact` | `font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; font-family: var(--font-mono); letter-spacing: -0.025em; color: hsl(var(--foreground));` |
| `text-stat-value` | `font-size: 1.5rem; line-height: 2rem; font-weight: 600; color: hsl(var(--foreground));` |

## Section 2: Background Library

### 2a. New File

Create `assets/css/background-library.css` ported from `src/styles/background-library.css`.

### 2b. Adaptations

1. **Image paths**: `/images/backgrounds/...` becomes `../images/backgrounds/...`; `/images/resume/capabilities/...` becomes `../images/resume/capabilities/...`.
2. **Dark selectors**: `.dark .foo` becomes `body.dark .foo, body.is-dark-theme .foo, :root[data-theme="dark"] .foo`. Editor selectors (`.editor-styles-wrapper[data-theme="dark"]`, `.editor-styles-wrapper.is-dark-theme`) are intentionally excluded -- background library surfaces will not render in the block editor.
3. **Print override**: Add background-library surface classes to the print `@media` block in `design-system.css` that hides decorative elements. Selectors to hide:
   ```css
   .hero-backdrop-editorial-amber,
   .hero-backdrop-resume-profile,
   .footer-backdrop-editorial-network,
   .surface-library-ember-veil::before,
   .surface-library-ember-topography::before,
   .surface-library-dev-signal::before,
   .surface-library-music-harmonics::before,
   .surface-library-learning-paper::before,
   .resume-capability-surface::before
   ```

### 2c. Image Assets (14 files to copy)

From `~/henry-s-digital-canvas/public/images/backgrounds/` to `assets/images/backgrounds/`:
- `theme-footer-editorial-network.webp` + `-960` variant
- `theme-hero-editorial-amber.webp` + `-960` variant
- `theme-hero-resume-profile.webp` + `-960` variant
- `theme-surface-dev-signal-grid.webp` + `-960` variant
- `theme-surface-ember-topography.webp` + `-960` variant
- `theme-surface-ember-veil.webp` + `-960` variant
- `theme-surface-music-harmonics.webp` + `-960` variant

(learning-paper pair already exists in WP theme)

From `~/henry-s-digital-canvas/public/images/resume/capabilities/` to `assets/images/resume/capabilities/` (6 files):
- `capability-customer-outcomes.webp` + `-960` variant
- `capability-technical-delivery.webp` + `-960` variant
- `capability-operations-leadership.webp` + `-960` variant

### 2d. Enqueue

Add `background-library.css` to `functions.php` asset enqueue, loaded after `design-system.css`.

### 2e. Classes Ported (10 + 1 base)

- `hero-backdrop-editorial-amber`
- `hero-backdrop-resume-profile`
- `footer-backdrop-editorial-network`
- `surface-library-ember-veil`
- `surface-library-ember-topography`
- `surface-library-dev-signal`
- `surface-library-music-harmonics`
- `surface-library-learning-paper`
- `resume-capability-surface` (shared base)
- `resume-capability-customer`
- `resume-capability-technical`
- `resume-capability-operations`

Each with responsive `max-width: 768px` image swaps and light/dark variants.

## Out of Scope

- Gradient whitespace normalization (cosmetic only, no visual impact)
- Hobbies page/card token systems (deferred to hobbies block parity pass)
- surfaces.css content (already ported into design-system.css)

## Verification

After implementation:
1. `npm run smoke:full` passes
2. Token sync audit: only gradient-whitespace mismatches remain
3. Utility sync audit: 0 missing utilities
4. Visual check: background surfaces render in both light and dark modes
