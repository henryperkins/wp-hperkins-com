# Token Sync Audit

- Status: **FAIL**
- Source CSS: `/home/azureuser/henry-s-digital-canvas/src/index.css`
- Design system CSS: `/home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas/assets/css/design-system.css`
- Theme JSON: `/home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas/theme.json`
- Dark variation JSON: `/home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas/styles/ember-dark.json`
- Checks: `524`
- Mismatches: `216`

## Mismatches

| Check | Actual | Expected |
| --- | --- | --- |
| `design-system light --gradient-accent` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `design-system light --gradient-avatar-monogram` | `radial-gradient(circle at 30% 30%, hsl(38 92% 50% / 0.3), transparent 60%), linear-gradient(135deg, hsl(20 14% 12%) 0%, hsl(20 10% 8%) 100%)` | `radial-gradient( circle at 30% 30%, hsl(38 92% 50% / 0.3), transparent 60% ), linear-gradient(135deg, hsl(20 14% 12%) 0%, hsl(20 10% 8%) 100%)` |
| `design-system light --gradient-card` | `linear-gradient(145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100%)` | `linear-gradient( 145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100% )` |
| `design-system light --gradient-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50% )` |
| `design-system light --gradient-surface-card` | `linear-gradient(145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100%)` | `linear-gradient( 145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100% )` |
| `design-system light --gradient-surface-emphasis` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `design-system light --gradient-surface-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50% )` |
| `design-system light --hobbies-artifact-border` | `` | `hsl(30 22% 78% / 0.72)` |
| `design-system light --hobbies-artifact-highlight` | `` | `hsl(0 0% 100% / 0.42)` |
| `design-system light --hobbies-artifact-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.72), 0 16px 28px hsl(28 24% 56% / 0.08)` |
| `design-system light --hobbies-artifact-shadow-tint` | `` | `hsl(30 22% 58% / 0.08)` |
| `design-system light --hobbies-artifact-surface` | `` | `linear-gradient( 180deg, hsl(0 0% 100% / 0.7), hsl(36 36% 95% / 0.44) )` |
| `design-system light --hobbies-badge-border` | `` | `hsl(0 0% 100% / 0.78)` |
| `design-system light --hobbies-badge-highlight` | `` | `hsl(0 0% 100% / 0.84)` |
| `design-system light --hobbies-badge-surface` | `` | `hsl(0 0% 100% / 0.8)` |
| `design-system light --hobbies-card-copy-color` | `` | `hsl(20 12% 26%)` |
| `design-system light --hobbies-card-hover-border` | `` | `hsl(30 28% 68% / 0.4)` |
| `design-system light --hobbies-card-open-border` | `` | `hsl(36 64% 48% / 0.28)` |
| `design-system light --hobbies-card-shell-border` | `` | `hsl(30 20% 82% / 0.74)` |
| `design-system light --hobbies-card-shell-highlight` | `` | `hsl(0 0% 100% / 0.56)` |
| `design-system light --hobbies-card-shell-open-shadow` | `` | `0 12px 32px -14px hsl(20 20% 15% / 0.2)` |
| `design-system light --hobbies-card-shell-shadow` | `` | `0 4px 24px -4px hsl(20 20% 15% / 0.08)` |
| `design-system light --hobbies-card-strong-color` | `` | `hsl(20 18% 20%)` |
| `design-system light --hobbies-card-title-color` | `` | `hsl(20 16% 14%)` |
| `design-system light --hobbies-card-title-hover-color` | `` | `hsl(38 92% 32%)` |
| `design-system light --hobbies-detail-divider` | `` | `hsl(30 22% 76% / 0.78)` |
| `design-system light --hobbies-detail-editorial` | `` | `linear-gradient( 180deg, hsl(48 34% 90% / 0.48) 0%, hsl(0 0% 100% / 0.08) 100% )` |
| `design-system light --hobbies-detail-media-rich` | `` | `linear-gradient( 180deg, hsl(38 78% 92% / 0.58) 0%, hsl(0 0% 100% / 0.08) 100% )` |
| `design-system light --hobbies-dev-accent` | `` | `hsl(190 64% 40%)` |
| `design-system light --hobbies-dev-accent-glow` | `` | `hsl(190 76% 46% / 0.14)` |
| `design-system light --hobbies-dev-accent-glow-strong` | `` | `hsl(190 76% 46% / 0.2)` |
| `design-system light --hobbies-dev-accent-soft` | `` | `hsl(192 44% 30%)` |
| `design-system light --hobbies-footer-divider` | `` | `hsl(30 22% 76% / 0.62)` |
| `design-system light --hobbies-footer-label-color` | `` | `hsl(20 8% 40%)` |
| `design-system light --hobbies-footer-status-color` | `` | `hsl(30 18% 38%)` |
| `design-system light --hobbies-glimpse-border` | `` | `hsl(30 22% 78% / 0.62)` |
| `design-system light --hobbies-glimpse-highlight` | `` | `hsl(0 0% 100% / 0.66)` |
| `design-system light --hobbies-glimpse-surface` | `` | `linear-gradient( 180deg, hsl(0 0% 100% / 0.56) 0%, hsl(36 26% 96% / 0.34) 100% )` |
| `design-system light --hobbies-hero-fade` | `` | `hsl(36 44% 94% / 0.96)` |
| `design-system light --hobbies-jump-nav-link-active-border` | `` | `hsl(36 72% 50% / 0.24)` |
| `design-system light --hobbies-jump-nav-link-active-foreground` | `` | `hsl(38 92% 32%)` |
| `design-system light --hobbies-jump-nav-link-active-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.82), 0 8px 18px hsl(30 20% 56% / 0.08)` |
| `design-system light --hobbies-jump-nav-link-active-surface` | `` | `linear-gradient( 180deg, hsl(0 0% 100% / 0.92) 0%, hsl(36 52% 94% / 0.96) 100% )` |
| `design-system light --hobbies-jump-nav-link-border` | `` | `hsl(30 24% 78% / 0.72)` |
| `design-system light --hobbies-jump-nav-link-foreground` | `` | `hsl(20 12% 26%)` |
| `design-system light --hobbies-jump-nav-link-hover-border` | `` | `hsl(30 28% 68% / 0.28)` |
| `design-system light --hobbies-jump-nav-link-hover-foreground` | `` | `hsl(20 16% 14%)` |
| `design-system light --hobbies-jump-nav-link-hover-surface` | `` | `hsl(0 0% 100% / 0.86)` |
| `design-system light --hobbies-jump-nav-link-surface` | `` | `hsl(0 0% 100% / 0.76)` |
| `design-system light --hobbies-jump-nav-title` | `` | `hsl(28 16% 38%)` |
| `design-system light --hobbies-learning-accent` | `` | `hsl(46 58% 42%)` |
| `design-system light --hobbies-learning-accent-glow` | `` | `hsl(46 58% 42% / 0.14)` |
| `design-system light --hobbies-learning-accent-glow-strong` | `` | `hsl(46 58% 42% / 0.2)` |
| `design-system light --hobbies-learning-accent-soft` | `` | `hsl(40 28% 30%)` |
| `design-system light --hobbies-media-detail-filter` | `` | `saturate(0.96) brightness(0.98)` |
| `design-system light --hobbies-media-placeholder-color` | `` | `hsl(20 16% 14%)` |
| `design-system light --hobbies-media-placeholder-note` | `` | `hsl(20 12% 26%)` |
| `design-system light --hobbies-media-preview-filter` | `` | `saturate(0.92) brightness(1.02)` |
| `design-system light --hobbies-music-accent` | `` | `hsl(34 82% 46%)` |
| `design-system light --hobbies-music-accent-glow` | `` | `hsl(34 86% 52% / 0.14)` |
| `design-system light --hobbies-music-accent-glow-strong` | `` | `hsl(34 86% 52% / 0.2)` |
| `design-system light --hobbies-music-accent-soft` | `` | `hsl(28 44% 32%)` |
| `design-system light --hobbies-note-badge-border` | `` | `hsl(30 26% 74% / 0.8)` |
| `design-system light --hobbies-note-badge-foreground` | `` | `hsl(30 30% 32%)` |
| `design-system light --hobbies-note-badge-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.86), 0 10px 24px hsl(30 26% 56% / 0.1)` |
| `design-system light --hobbies-note-badge-surface` | `` | `hsl(0 0% 100% / 0.86)` |
| `design-system light --hobbies-note-border` | `` | `hsl(30 26% 76% / 0.74)` |
| `design-system light --hobbies-note-copy` | `` | `hsl(20 12% 26%)` |
| `design-system light --hobbies-note-divider` | `` | `hsl(30 24% 72% / 0.72)` |
| `design-system light --hobbies-note-overlay` | `` | `linear-gradient(180deg, hsl(0 0% 100% / 0.58) 0%, transparent 18%), radial-gradient(72% 70% at 84% 10%, hsl(34 82% 56% / 0.16), transparent 58%), radial-gradient(68% 74% at 10% 90%, hsl(192 72% 54% / 0.1), transparent 54%)` |
| `design-system light --hobbies-note-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.84), 0 24px 46px hsl(30 28% 56% / 0.12)` |
| `design-system light --hobbies-note-story` | `` | `hsl(20 12% 26%)` |
| `design-system light --hobbies-note-surface` | `` | `linear-gradient( 180deg, hsl(0 0% 100% / 0.96) 0%, hsl(36 42% 95% / 0.98) 100% )` |
| `design-system light --hobbies-note-takeaway` | `` | `hsl(28 28% 28%)` |
| `design-system light --hobbies-note-title` | `` | `hsl(20 16% 14%)` |
| `design-system light --hobbies-page-bg-end` | `` | `hsl(34 48% 92%)` |
| `design-system light --hobbies-page-bg-start` | `` | `hsl(36 54% 97%)` |
| `design-system light --hobbies-page-cool-glow` | `` | `hsl(196 62% 54% / 0.08)` |
| `design-system light --hobbies-page-grain-line` | `` | `hsl(34 22% 72% / 0.08)` |
| `design-system light --hobbies-page-paper-glow` | `` | `hsl(0 0% 100% / 0.58)` |
| `design-system light --hobbies-page-warm-glow` | `` | `hsl(32 82% 54% / 0.18)` |
| `design-system light --hobbies-pill-border` | `` | `hsl(30 22% 74% / 0.54)` |
| `design-system light --hobbies-pill-color` | `` | `hsl(20 8% 40%)` |
| `design-system light --hobbies-pill-highlight` | `` | `hsl(0 0% 100% / 0.62)` |
| `design-system light --hobbies-pill-hover-border` | `` | `hsl(36 70% 48% / 0.24)` |
| `design-system light --hobbies-pill-hover-color` | `` | `hsl(38 92% 32%)` |
| `design-system light --hobbies-pill-hover-surface` | `` | `hsl(36 60% 93% / 0.74)` |
| `design-system light --hobbies-pill-surface` | `` | `hsl(0 0% 100% / 0.54)` |
| `design-system light --hobbies-preview-takeaway-border` | `` | `hsl(30 22% 74% / 0.6)` |
| `design-system light --hobbies-preview-takeaway-color` | `` | `hsl(20 18% 22%)` |
| `design-system light --hobbies-preview-takeaway-label` | `` | `hsl(20 8% 40%)` |
| `design-system light --hobbies-preview-takeaway-surface` | `` | `hsl(36 58% 96% / 0.78)` |
| `design-system light --hobbies-section-count-border` | `` | `hsl(30 24% 76% / 0.76)` |
| `design-system light --hobbies-section-count-color` | `` | `hsl(30 30% 32%)` |
| `design-system light --hobbies-section-count-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.86), 0 10px 24px hsl(30 26% 56% / 0.1)` |
| `design-system light --hobbies-section-count-surface` | `` | `hsl(0 0% 100% / 0.86)` |
| `design-system light --hobbies-section-description-color` | `` | `hsl(20 12% 26%)` |
| `design-system light --hobbies-section-eyebrow-color` | `` | `hsl(30 42% 32%)` |
| `design-system light --hobbies-section-rule-fade` | `` | `hsl(30 18% 72% / 0.28)` |
| `design-system light --hobbies-section-surface` | `` | `hsl(36 44% 95%)` |
| `design-system light --hobbies-section-title-color` | `` | `hsl(20 16% 14%)` |
| `design-system light --hobbies-story-border` | `` | `hsl(30 22% 78% / 0.76)` |
| `design-system light --hobbies-story-highlight` | `` | `hsl(0 0% 100% / 0.76)` |
| `design-system light --hobbies-story-surface` | `` | `linear-gradient( 180deg, hsl(0 0% 100% / 0.82) 0%, hsl(36 26% 96% / 0.62) 100% )` |
| `design-system light --hobbies-takeaway-surface` | `` | `linear-gradient( 180deg, hsl(36 60% 96% / 0.92) 0%, hsl(36 24% 95% / 0.76) 100% )` |
| `design-system dark --gradient-accent` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `design-system dark --gradient-avatar-monogram` | `radial-gradient(circle at 30% 30%, hsl(38 92% 50% / 0.28), transparent 60%), linear-gradient(135deg, hsl(22 16% 16%) 0%, hsl(20 10% 10%) 100%)` | `radial-gradient( circle at 30% 30%, hsl(38 92% 50% / 0.28), transparent 60% ), linear-gradient(135deg, hsl(22 16% 16%) 0%, hsl(20 10% 10%) 100%)` |
| `design-system dark --gradient-card` | `linear-gradient(145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100%)` | `linear-gradient( 145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100% )` |
| `design-system dark --gradient-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50% )` |
| `design-system dark --gradient-surface-card` | `linear-gradient(145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100%)` | `linear-gradient( 145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100% )` |
| `design-system dark --gradient-surface-emphasis` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `design-system dark --gradient-surface-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50% )` |
| `design-system dark --hobbies-artifact-border` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-artifact-highlight` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-artifact-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.05), 0 16px 28px hsl(0 0% 0% / 0.18)` |
| `design-system dark --hobbies-artifact-shadow-tint` | `` | `hsl(0 0% 0% / 0.22)` |
| `design-system dark --hobbies-artifact-surface` | `` | `linear-gradient( 180deg, hsl(0 0% 100% / 0.05), hsl(0 0% 100% / 0.01) )` |
| `design-system dark --hobbies-badge-border` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-badge-highlight` | `` | `hsl(0 0% 100% / 0.05)` |
| `design-system dark --hobbies-badge-surface` | `` | `hsl(0 0% 100% / 0.05)` |
| `design-system dark --hobbies-card-copy-color` | `` | `hsl(34 12% 80%)` |
| `design-system dark --hobbies-card-hover-border` | `` | `hsl(36 34% 44% / 0.24)` |
| `design-system dark --hobbies-card-open-border` | `` | `hsl(36 72% 58% / 0.34)` |
| `design-system dark --hobbies-card-shell-border` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-card-shell-highlight` | `` | `hsl(0 0% 100% / 0.06)` |
| `design-system dark --hobbies-card-shell-open-shadow` | `` | `0 12px 32px -14px hsl(0 0% 0% / 0.46)` |
| `design-system dark --hobbies-card-shell-shadow` | `` | `0 4px 24px -4px hsl(0 0% 0% / 0.3)` |
| `design-system dark --hobbies-card-strong-color` | `` | `hsl(0 0% 100% / 0.92)` |
| `design-system dark --hobbies-card-title-color` | `` | `hsl(0 0% 100% / 0.96)` |
| `design-system dark --hobbies-card-title-hover-color` | `` | `hsl(0 0% 100%)` |
| `design-system dark --hobbies-detail-divider` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-detail-editorial` | `` | `linear-gradient( 180deg, hsl(48 14% 20% / 0.14) 0%, hsl(0 0% 100% / 0.01) 100% )` |
| `design-system dark --hobbies-detail-media-rich` | `` | `linear-gradient( 180deg, hsl(38 18% 18% / 0.18) 0%, hsl(0 0% 100% / 0.01) 100% )` |
| `design-system dark --hobbies-dev-accent` | `` | `hsl(188 76% 60%)` |
| `design-system dark --hobbies-dev-accent-glow` | `` | `hsl(188 76% 60% / 0.1)` |
| `design-system dark --hobbies-dev-accent-glow-strong` | `` | `hsl(188 76% 60% / 0.16)` |
| `design-system dark --hobbies-dev-accent-soft` | `` | `hsl(188 46% 76%)` |
| `design-system dark --hobbies-footer-divider` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-footer-label-color` | `` | `hsl(36 18% 66%)` |
| `design-system dark --hobbies-footer-status-color` | `` | `hsl(36 16% 72%)` |
| `design-system dark --hobbies-glimpse-border` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-glimpse-highlight` | `` | `hsl(0 0% 100% / 0.05)` |
| `design-system dark --hobbies-glimpse-surface` | `` | `linear-gradient( 180deg, hsl(0 0% 100% / 0.04) 0%, hsl(0 0% 100% / 0.015) 100% )` |
| `design-system dark --hobbies-hero-fade` | `` | `hsl(220 30% 4% / 0.92)` |
| `design-system dark --hobbies-jump-nav-link-active-border` | `` | `hsl(36 78% 56% / 0.34)` |
| `design-system dark --hobbies-jump-nav-link-active-foreground` | `` | `hsl(42 48% 94%)` |
| `design-system dark --hobbies-jump-nav-link-active-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.08), 0 10px 18px hsl(0 0% 0% / 0.18)` |
| `design-system dark --hobbies-jump-nav-link-active-surface` | `` | `linear-gradient( 180deg, hsl(224 20% 16% / 0.84) 0%, hsl(222 18% 13% / 0.78) 100% )` |
| `design-system dark --hobbies-jump-nav-link-border` | `` | `hsl(34 22% 32% / 0.4)` |
| `design-system dark --hobbies-jump-nav-link-foreground` | `` | `hsl(37 47% 80%)` |
| `design-system dark --hobbies-jump-nav-link-hover-border` | `` | `hsl(34 72% 52% / 0.3)` |
| `design-system dark --hobbies-jump-nav-link-hover-foreground` | `` | `hsl(39 71% 95%)` |
| `design-system dark --hobbies-jump-nav-link-hover-surface` | `` | `hsl(222 18% 13% / 0.66)` |
| `design-system dark --hobbies-jump-nav-link-surface` | `` | `hsl(222 18% 11% / 0.5)` |
| `design-system dark --hobbies-jump-nav-title` | `` | `hsl(34 32% 76%)` |
| `design-system dark --hobbies-learning-accent` | `` | `hsl(50 54% 60%)` |
| `design-system dark --hobbies-learning-accent-glow` | `` | `hsl(50 54% 60% / 0.1)` |
| `design-system dark --hobbies-learning-accent-glow-strong` | `` | `hsl(50 54% 60% / 0.16)` |
| `design-system dark --hobbies-learning-accent-soft` | `` | `hsl(50 28% 76%)` |
| `design-system dark --hobbies-media-detail-filter` | `` | `saturate(0.98) brightness(0.9)` |
| `design-system dark --hobbies-media-placeholder-color` | `` | `hsl(0 0% 100% / 0.92)` |
| `design-system dark --hobbies-media-placeholder-note` | `` | `hsl(36 18% 74%)` |
| `design-system dark --hobbies-media-preview-filter` | `` | `saturate(0.94) brightness(0.82)` |
| `design-system dark --hobbies-music-accent` | `` | `hsl(38 82% 60%)` |
| `design-system dark --hobbies-music-accent-glow` | `` | `hsl(38 82% 60% / 0.1)` |
| `design-system dark --hobbies-music-accent-glow-strong` | `` | `hsl(38 82% 60% / 0.16)` |
| `design-system dark --hobbies-music-accent-soft` | `` | `hsl(38 52% 78%)` |
| `design-system dark --hobbies-note-badge-border` | `` | `hsl(34 24% 38% / 0.44)` |
| `design-system dark --hobbies-note-badge-foreground` | `` | `hsl(36 34% 84%)` |
| `design-system dark --hobbies-note-badge-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.06), 0 8px 18px hsl(0 0% 0% / 0.18)` |
| `design-system dark --hobbies-note-badge-surface` | `` | `hsl(222 16% 12% / 0.82)` |
| `design-system dark --hobbies-note-border` | `` | `hsl(34 24% 28% / 0.64)` |
| `design-system dark --hobbies-note-copy` | `` | `hsl(37 47% 80%)` |
| `design-system dark --hobbies-note-divider` | `` | `hsl(34 20% 34% / 0.54)` |
| `design-system dark --hobbies-note-overlay` | `` | `linear-gradient(180deg, hsl(0 0% 100% / 0.05) 0%, transparent 18%), radial-gradient(72% 70% at 84% 10%, hsl(34 82% 56% / 0.1), transparent 58%)` |
| `design-system dark --hobbies-note-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.04), 0 22px 42px hsl(0 0% 0% / 0.22)` |
| `design-system dark --hobbies-note-story` | `` | `hsl(37 47% 80%)` |
| `design-system dark --hobbies-note-surface` | `` | `linear-gradient( 180deg, hsl(221 18% 11% / 0.96) 0%, hsl(220 16% 9% / 0.98) 100% )` |
| `design-system dark --hobbies-note-takeaway` | `` | `hsl(37 47% 80%)` |
| `design-system dark --hobbies-note-title` | `` | `hsl(39 71% 95%)` |
| `design-system dark --hobbies-page-bg-end` | `` | `hsl(220 34% 3%)` |
| `design-system dark --hobbies-page-bg-start` | `` | `hsl(222 34% 5%)` |
| `design-system dark --hobbies-page-cool-glow` | `` | `hsl(196 76% 50% / 0.04)` |
| `design-system dark --hobbies-page-grain-line` | `` | `hsl(36 14% 44% / 0.04)` |
| `design-system dark --hobbies-page-paper-glow` | `` | `hsl(0 0% 100% / 0.06)` |
| `design-system dark --hobbies-page-warm-glow` | `` | `hsl(32 88% 56% / 0.08)` |
| `design-system dark --hobbies-pill-border` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-pill-color` | `` | `hsl(36 24% 80%)` |
| `design-system dark --hobbies-pill-highlight` | `` | `hsl(0 0% 100% / 0.04)` |
| `design-system dark --hobbies-pill-hover-border` | `` | `hsl(36 70% 56% / 0.28)` |
| `design-system dark --hobbies-pill-hover-color` | `` | `hsl(0 0% 100%)` |
| `design-system dark --hobbies-pill-hover-surface` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-pill-surface` | `` | `hsl(0 0% 100% / 0.04)` |
| `design-system dark --hobbies-preview-takeaway-border` | `` | `hsl(0 0% 100% / 0.08)` |
| `design-system dark --hobbies-preview-takeaway-color` | `` | `hsl(0 0% 100% / 0.92)` |
| `design-system dark --hobbies-preview-takeaway-label` | `` | `hsl(36 16% 68%)` |
| `design-system dark --hobbies-preview-takeaway-surface` | `` | `hsl(0 0% 100% / 0.05)` |
| `design-system dark --hobbies-section-count-border` | `` | `hsl(34 24% 38% / 0.44)` |
| `design-system dark --hobbies-section-count-color` | `` | `hsl(36 34% 84%)` |
| `design-system dark --hobbies-section-count-shadow` | `` | `inset 0 1px 0 hsl(0 0% 100% / 0.06), 0 8px 18px hsl(0 0% 0% / 0.18)` |
| `design-system dark --hobbies-section-count-surface` | `` | `hsl(222 16% 12% / 0.82)` |
| `design-system dark --hobbies-section-description-color` | `` | `hsl(37 47% 80%)` |
| `design-system dark --hobbies-section-eyebrow-color` | `` | `hsl(34 44% 70%)` |
| `design-system dark --hobbies-section-rule-fade` | `` | `hsl(34 12% 44% / 0.08)` |
| `design-system dark --hobbies-section-surface` | `` | `hsl(220 28% 5%)` |
| `design-system dark --hobbies-section-title-color` | `` | `hsl(39 71% 95%)` |
| `design-system dark --hobbies-story-border` | `` | `hsl(0 0% 100% / 0.07)` |
| `design-system dark --hobbies-story-highlight` | `` | `hsl(0 0% 100% / 0.04)` |
| `design-system dark --hobbies-story-surface` | `` | `linear-gradient( 180deg, hsl(0 0% 100% / 0.03) 0%, hsl(0 0% 100% / 0.01) 100% )` |
| `design-system dark --hobbies-takeaway-surface` | `` | `linear-gradient( 180deg, hsl(0 0% 100% / 0.04) 0%, hsl(0 0% 100% / 0.015) 100% )` |
| `theme.json light gradient surface-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.14) 0%, transparent 50% )` |
| `theme.json light gradient surface-card` | `linear-gradient(145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100%)` | `linear-gradient( 145deg, hsl(0 0% 100%) 0%, hsl(36 25% 94%) 100% )` |
| `theme.json light gradient surface-emphasis` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
| `ember-dark gradient surface-hero` | `linear-gradient(135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50%)` | `linear-gradient( 135deg, hsl(38 92% 50% / 0.08) 0%, transparent 50% )` |
| `ember-dark gradient surface-card` | `linear-gradient(145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100%)` | `linear-gradient( 145deg, hsl(20 10% 10%) 0%, hsl(20 10% 6%) 100% )` |
| `ember-dark gradient surface-emphasis` | `linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100%)` | `linear-gradient( 135deg, hsl(38 92% 50%) 0%, hsl(28 85% 55%) 100% )` |
