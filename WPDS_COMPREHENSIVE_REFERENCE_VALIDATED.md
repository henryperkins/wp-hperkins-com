# WordPress Design System (WPDS) - Comprehensive Reference (Validated)

Validated against local WordPress build:
- Version: `7.0-beta2-61777`
- Token source: `wp-includes/css/dist/theme/style-rtl.css`
- Theme runtime source: `wp-includes/js/dist/theme.js`

## 1. Token Categories with Actual Values

### 1.1 Border Radius
- `--wpds-border-radius-xs`: `1px`
- `--wpds-border-radius-sm`: `2px`
- `--wpds-border-radius-md`: `4px`
- `--wpds-border-radius-lg`: `8px`

### 1.2 Border Width
- `--wpds-border-width-xs`: `1px`
- `--wpds-border-width-sm`: `2px`
- `--wpds-border-width-md`: `4px`
- `--wpds-border-width-lg`: `8px`
- `--wpds-border-width-focus`: `2px` (becomes `1.5px` at `min-resolution: 192dpi`)

### 1.3 Dimension - Padding (Default / Compact / Comfortable)
- Default:
  - `xs 4px`, `sm 8px`, `md 12px`, `lg 16px`, `xl 20px`, `2xl 24px`, `3xl 32px`
- Compact:
  - `xs 4px`, `sm 4px`, `md 8px`, `lg 12px`, `xl 16px`, `2xl 20px`, `3xl 24px`
- Comfortable:
  - `xs 8px`, `sm 12px`, `md 16px`, `lg 20px`, `xl 24px`, `2xl 32px`, `3xl 40px`

### 1.4 Dimension - Gap (Default / Compact / Comfortable)
- Default:
  - `xs 4px`, `sm 8px`, `md 12px`, `lg 16px`, `xl 24px`, `2xl 32px`, `3xl 40px`
- Compact:
  - `xs 4px`, `sm 4px`, `md 8px`, `lg 12px`, `xl 20px`, `2xl 24px`, `3xl 32px`
- Comfortable:
  - `xs 8px`, `sm 12px`, `md 16px`, `lg 20px`, `xl 32px`, `2xl 40px`, `3xl 48px`

Density selectors are present:
- `[data-wpds-theme-provider-id][data-wpds-density=compact]`
- `[data-wpds-theme-provider-id][data-wpds-density=comfortable]`
- `[data-wpds-theme-provider-id][data-wpds-density=default]`

### 1.5 Elevation (Box Shadows)
- `--wpds-elevation-xs`
- `--wpds-elevation-sm`
- `--wpds-elevation-md`
- `--wpds-elevation-lg`

Values match your report in this build.

### 1.6 Typography
- Font families:
  - `--wpds-font-family-heading`
  - `--wpds-font-family-body`
  - `--wpds-font-family-mono`
- Font sizes:
  - `xs 11px`, `sm 12px`, `md 13px`, `lg 15px`, `xl 20px`, `2xl 32px`
- Line heights:
  - `xs 16px`, `sm 20px`, `md 24px`, `lg 28px`, `xl 32px`, `2xl 40px`
- Font weights:
  - `--wpds-font-weight-regular: 400`
  - `--wpds-font-weight-medium: 499`

### 1.7 Cursor
Correction for this local build:
- No `--wpds-cursor-*` token is present in `style-rtl.css` or elsewhere under `wp-includes/`.
- Treat cursor-token claims as version-dependent and not universally available.

### 1.8 Color Tokens
Your full color token inventory aligns with this local token file for:
- `bg` (`surface`, `interactive`, `track`, `thumb`)
- `fg` (`content`, `interactive`)
- `stroke` (`surface`, `interactive`, `focus`)

### 1.9 Naming Convention
The convention you documented is consistent with observed token IDs:
- `--wpds-color-<element>-<role>[-<tone>][-<emphasis>][-<state>]`

## 2. ThemeProvider API and Customization

## Confirmed from local `theme.js`
- `ThemeProvider` sets:
  - `data-wpds-theme-provider-id`
  - `data-wpds-root-provider`
  - `data-wpds-density`
- `ThemeProvider` defaults:
  - `color = {}`
  - `isRoot = false`
- Color seeds exposed via prop resolution:
  - `primary`, `bg`
- Seed defaults include:
  - `bg #f8f8f8`, `primary #3858e9`, `info #0090ff`, `success #4ab866`, `caution #f0d149`, `warning #f0b849`, `error #cc1818`
- Runtime computes ramps and injects scoped CSS per provider instance.

## Clarification
- `ThemeProvider` prop surface exposes only `color.primary` and `color.bg` overrides.
- Other seed colors are currently internal defaults in this build unless changed by internal APIs.

## 3. @wordpress/ui API Summaries

Your conceptual migration notes are coherent, but this local WordPress build does not provide a public `wp-includes/js/dist/ui.js` global entry. Treat `@wordpress/ui` as npm/package-level work, not a guaranteed browser global in core.

## 4. @wordpress/components API Summaries

Your legacy-vs-new split is directionally correct:
- `@wordpress/components` remains widely available in admin globals.
- Migration to WPDS tokenized primitives is gradual.

## 5. Applying Custom Branding

Recommended pattern remains:

```tsx
import { ThemeProvider } from '@wordpress/theme';
import '@wordpress/theme/design-tokens.css';

export function BrandedApp({ children }) {
  return (
    <ThemeProvider
      color={{
        primary: '#FF6600',
        bg: '#FFFFFF',
      }}
      density="default"
      isRoot
    >
      {children}
    </ThemeProvider>
  );
}
```

Font override example when needed:

```css
[data-wpds-theme-provider-id] {
  --wpds-font-family-heading: 'Your Brand Font', sans-serif;
  --wpds-font-family-body: 'Your Body Font', sans-serif;
}
```

## 6. Known Gaps and Limitations

Validated in this local build:
- No motion token family (`--wpds-motion-*` / `--wpds-transition-*`) in theme token CSS.
- No global breakpoint token family in token CSS.
- No global z-index token family in token CSS.
- ThemeProvider external color props remain constrained to `primary` + `bg`.

Version-dependent caveat:
- Cursor token absence in this build means cursor policy should not be documented as a guaranteed token unless scoped to a specific upstream revision.

## 7. Migration Path

Your coexistence strategy is solid:
1. Use WPDS tokens for new styling.
2. Wrap new surfaces with `ThemeProvider`.
3. Adopt `@wordpress/ui` where available in your build pipeline.
4. Keep `@wordpress/components` for non-migrated controls.
5. Migrate incrementally by feature, not big-bang.

## Boundaries (Intentionally Out of Scope)
- Data fetching, stores, REST wiring.
- i18n content strategy.
- backend/PHP behavior unrelated to UI contracts.

## Recap
This validated companion confirms most of your report against the local WordPress build and preserves your migration guidance. The key correction is cursor-token availability: it is not present in this local build, so keep that section version-scoped.
