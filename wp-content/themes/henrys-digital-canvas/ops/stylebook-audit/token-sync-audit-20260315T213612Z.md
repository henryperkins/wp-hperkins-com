# Token Sync Audit

- Status: **FAIL**
- Source CSS: `/home/azureuser/henry-s-digital-canvas/src/index.css`
- Design system CSS: `/home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas/assets/css/design-system.css`
- Theme JSON: `/home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas/theme.json`
- Dark variation JSON: `/home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas/styles/ember-dark.json`
- Checks: `328`
- Mismatches: `28`

## Mismatches

| Check | Actual | Expected |
| --- | --- | --- |
| `design-system light --brand-linkedin` | `` | `210 82% 40%` |
| `design-system light --gradient-accent` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `design-system light --gradient-avatar-monogram` | `radial-gradient(circle at 30% 30%, hsl(38 92% 50% / 0.3), transparent 60%), linear-gradient(135deg, hsl(20 14% 12%) 0%, hsl(20 10% 8%) 100%)` | `radial-gradient( circle at 30% 30%, hsl(38 92% 50% / 0.3), transparent 60% ), linear-gradient(135deg, hsl(20 14% 12%) 0%, hsl(20 10% 8%) 100%)` |
| `design-system light --gradient-card` | `linear-gradient(145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100%)` | `linear-gradient( 145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100% )` |
| `design-system light --gradient-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50% )` |
| `design-system light --gradient-surface-card` | `linear-gradient(145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100%)` | `linear-gradient( 145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100% )` |
| `design-system light --gradient-surface-emphasis` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `design-system light --gradient-surface-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50% )` |
| `design-system light --overlay-blur-glass` | `` | `12px` |
| `design-system light --scroll-margin-anchor` | `` | `calc(3.5rem + 2.5rem)` |
| `design-system light --text-danger` | `` | `0 72% 42%` |
| `design-system dark --brand-linkedin` | `` | `210 82% 52%` |
| `design-system dark --gradient-accent` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `design-system dark --gradient-avatar-monogram` | `radial-gradient(circle at 30% 30%, hsl(38 92% 50% / 0.28), transparent 60%), linear-gradient(135deg, hsl(22 16% 16%) 0%, hsl(20 10% 10%) 100%)` | `radial-gradient( circle at 30% 30%, hsl(38 92% 50% / 0.28), transparent 60% ), linear-gradient(135deg, hsl(22 16% 16%) 0%, hsl(20 10% 10%) 100%)` |
| `design-system dark --gradient-card` | `linear-gradient(145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100%)` | `linear-gradient( 145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100% )` |
| `design-system dark --gradient-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50% )` |
| `design-system dark --gradient-surface-card` | `linear-gradient(145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100%)` | `linear-gradient( 145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100% )` |
| `design-system dark --gradient-surface-emphasis` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `design-system dark --gradient-surface-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50% )` |
| `design-system dark --overlay-blur-glass` | `` | `12px` |
| `design-system dark --scroll-margin-anchor` | `` | `calc(3.5rem + 2.5rem)` |
| `design-system dark --text-danger` | `` | `2 85% 74%` |
| `theme.json light gradient surface-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50% )` |
| `theme.json light gradient surface-card` | `linear-gradient(145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100%)` | `linear-gradient( 145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100% )` |
| `theme.json light gradient surface-emphasis` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `ember-dark gradient surface-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50% )` |
| `ember-dark gradient surface-card` | `linear-gradient(145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100%)` | `linear-gradient( 145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100% )` |
| `ember-dark gradient surface-emphasis` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
