# Henry's Digital Canvas WPDS Target Statement

Last updated: 2026-03-05T21:02Z (UTC)

## Purpose

Define what "WPDS remediation" means for this WordPress child theme so parity work can ship without implying that WPDS foundation migration is already complete.

## Current Reality

- The current token layer in `assets/css/design-system.css` is custom and transitional.
- The theme should not be described as WPDS-foundation-complete yet.

## Target Architecture

### 1. Foundation token source of truth

- New foundation tokens should be introduced as `--wpds-*` semantic tokens.
- Existing custom aliases can remain temporarily, but must map from `--wpds-*` tokens.

### 1a. Token mapping table (transitional adapter)

| Foundation role | Transitional alias(es) | WPDS semantic source |
| --- | --- | --- |
| Surface backgrounds | `--background`, `--card`, `--popover`, `--secondary`, `--muted` | `--wpds-color-surface-canvas`, `--wpds-color-surface-card`, `--wpds-color-surface-popover`, `--wpds-color-surface-subtle`, `--wpds-color-surface-muted` |
| Content foregrounds | `--foreground`, `--text-strong`, `--text-body`, `--text-subtle`, `--text-meta` | `--wpds-color-text-primary`, `--wpds-color-text-secondary`, `--wpds-color-text-muted`, `--wpds-color-text-meta` |
| Muted foreground alias | `--muted-foreground` | `--wpds-color-text-muted-foreground` |
| Interactive fills and strokes | `--primary`, `--accent`, `--link`, `--link-hover`, `--border`, `--input` | `--wpds-color-accent`, `--wpds-color-accent-strong`, `--wpds-color-link`, `--wpds-color-link-hover`, `--wpds-color-border-subtle` |
| Focus ring | `--ring`, `--focus-ring-width`, `--focus-ring-offset` | `--wpds-color-focus-ring`, `--wpds-focus-ring-width`, `--wpds-focus-ring-offset` |
| Border radius | `--radius`, `--radius-control`, `--radius-surface`, `--radius-emphasis`, `--radius-pill`, `--radius-floating` | `--wpds-radius-base`, `--wpds-radius-control`, `--wpds-radius-surface`, `--wpds-radius-emphasis`, `--wpds-radius-pill`, `--wpds-radius-floating` |
| Spacing scale | `--wp--preset--spacing--{2xs,xs,sm,md,lg,xl,2xl}` | `--wpds-space-{2xs,xs,sm,md,lg,xl,2xl}` |
| Typography stack | `--font-serif`, `--font-sans`, `--font-mono`, corresponding `theme.json` font-family presets | `--wpds-font-serif`, `--wpds-font-sans`, `--wpds-font-mono` |

### 2. Theme-level integration requirements

- `theme.json` presets and global styles should reference WPDS-backed values.
- New token work should not bypass WPDS semantic naming.

### 3. Component adoption strategy

- `@wordpress/theme` semantic-token alignment is required for foundation-level styling.
- `@wordpress/ui` and `@wordpress/components` adoption is selective, starting with:
  - editor-side controls,
  - React-powered interactive block shells where bundling already exists.
- Static template markup does not need forced package adoption for optics.

### 4. Transition guardrails

- Any new root-level custom token must include a mapping note back to WPDS semantics.
- New foundation work should use WPDS semantic naming first and aliases second.

## Definition Of Done For "WPDS Foundation Complete"

- `--wpds-*` semantic tokens exist as documented source-of-truth tokens.
- Local token aliases are adapter-only and explicitly mapped.
- `theme.json` is aligned to WPDS-backed token values.
- Focus-ring and interactive-state styling use WPDS semantic rules across key controls.
- Migration status in `MIGRATION_PROGRESS.md` is moved from `wpds-foundation-pending` only after route/API/browser verification evidence is captured.
