# WPDS Parity Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close all foundation token/utility gaps and port the background library CSS to achieve design system parity with the React source app.

**Architecture:** Edit `design-system.css` to add missing tokens, responsive header height, and utility classes. Create a new `background-library.css` file for named surface/backdrop classes. Copy 20 image assets. Enqueue new stylesheet in `functions.php`.

**Tech Stack:** CSS custom properties, WordPress theme enqueue API, Bash (file copy)

**Spec:** `docs/plans/2026-03-15-wpds-parity-polish-design.md`

---

## Task 1: Add Missing Tokens to `:root`

**Files:**
- Modify: `assets/css/design-system.css:79-105` (light root token block)

- [ ] **Step 1: Add `--overlay-blur-glass`, `--scroll-margin-anchor`, `--text-danger`, `--brand-linkedin` to light `:root`**

After line 80 (`--overlay-blur-subtle: 2px;`), add:

```css
  --overlay-blur-glass: 12px;
  --scroll-margin-anchor: calc(var(--layout-header-height) + 2.5rem);
```

After line 219 (`--text-accent: 38 92% 32%;`), add:

```css
  --text-danger: 0 72% 42%;
```

After line 255 (`--language-markdown: 160 60% 45%;`), add:

```css
  --brand-linkedin: 210 82% 40%;
```

After line 105 (`--radius-floating: var(--wpds-radius-floating);`), add:

```css
  --radius-indicator: calc(var(--radius) - 8px);
```

- [ ] **Step 2: Add resolved convenience tokens**

After line 180 (`--color-language-markdown: hsl(var(--language-markdown));`), add:

```css
  --color-text-danger: hsl(var(--text-danger));
  --color-brand-linkedin: hsl(var(--brand-linkedin));
```

- [ ] **Step 3: Verify no syntax errors**

Run: `cd wp-content/themes/henrys-digital-canvas && npm run smoke:route`
Expected: All route checks pass (CSS loaded without parse errors)

- [ ] **Step 4: Commit**

```bash
git add assets/css/design-system.css
git commit -m "feat(tokens): add missing light-mode tokens (brand-linkedin, blur-glass, scroll-margin-anchor, text-danger, radius-indicator)"
```

---

## Task 2: Add Missing Tokens to Dark Block

**Files:**
- Modify: `assets/css/design-system.css:366-475` (dark token block)

- [ ] **Step 1: Add dark-mode counterparts**

After line 367 (`--overlay-blur-subtle: 2px;`), add:

```css
  --overlay-blur-glass: 12px;
  --scroll-margin-anchor: calc(var(--layout-header-height) + 2.5rem);
```

After line 412 (`--text-accent: 38 92% 58%;`), add:

```css
  --text-danger: 2 85% 74%;
```

After line 445 (`--language-markdown: 160 64% 58%;`), add:

```css
  --brand-linkedin: 210 82% 52%;
```

Note: `--radius-indicator` is NOT added to dark block (inherits from `:root`).

- [ ] **Step 2: Commit**

```bash
git add assets/css/design-system.css
git commit -m "feat(tokens): add missing dark-mode tokens (brand-linkedin, blur-glass, scroll-margin-anchor, text-danger)"
```

---

## Task 3: Responsive Header Height

**Files:**
- Modify: `assets/css/design-system.css` (add media query after dark block, before keyframes)

- [ ] **Step 1: Add responsive breakpoint**

After the dark block closing `}` (line 486) and before `@keyframes accordion-down` (line 488), insert:

```css

@media (min-width: 768px) {
  :root,
  :root[data-theme="dark"],
  .dark,
  body.dark,
  body.is-dark-theme {
    --layout-header-height: 4rem;
  }
}

```

- [ ] **Step 2: Verify header renders correctly**

Run: `cd wp-content/themes/henrys-digital-canvas && npm run smoke:browser`
Expected: All browser checks pass

- [ ] **Step 3: Commit**

```bash
git add assets/css/design-system.css
git commit -m "feat(tokens): responsive header height 4rem at >=768px to match React source"
```

---

## Task 4: Update `.glass` to Use Token

**Files:**
- Modify: `assets/css/design-system.css:930-933`

- [ ] **Step 1: Replace hardcoded blur with token**

Change:

```css
.glass {
  backdrop-filter: blur(12px) saturate(1.2);
  background: hsl(var(--card) / 0.7);
}
```

To:

```css
.glass {
  backdrop-filter: blur(var(--overlay-blur-glass)) saturate(1.2);
  background: hsl(var(--card) / 0.7);
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/design-system.css
git commit -m "fix(tokens): use --overlay-blur-glass token in .glass utility"
```

---

## Task 5: Add 9 Missing Utility Classes

**Files:**
- Modify: `assets/css/design-system.css` (utility section, after existing utilities)

- [ ] **Step 1: Add radius and layout utilities**

After line 644 (`.rounded-floating { border-radius: var(--radius-floating); }`), add:

```css
.rounded-indicator { border-radius: var(--radius-indicator); }
```

After line 662 (`.pb-safe-area-bottom { padding-bottom: var(--space-safe-area-bottom); }`), add:

```css
.scroll-mt-anchor { scroll-margin-top: var(--scroll-margin-anchor); }
```

- [ ] **Step 2: Add shadow utility**

After line 651 (`.shadow-floating { box-shadow: var(--shadow-floating); }`), add:

```css
.shadow-control { box-shadow: var(--shadow-control); }
```

- [ ] **Step 3: Add typography utilities**

After the `.text-heading-base` block (line ~837), add all 7 typography utilities:

```css
.text-heading-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.text-heading-accent {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: hsl(var(--text-accent));
}

.text-accent-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: hsl(var(--text-accent));
}

.text-card-title-compact {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  color: hsl(var(--foreground));
}

.text-stat-value {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.text-stat-compact {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: -0.025em;
  color: hsl(var(--foreground));
}
```

- [ ] **Step 4: Add responsive breakpoint for `text-card-title-compact`**

Inside the existing `@media (min-width: 768px)` block at line ~1020, OR add a new `@media (min-width: 640px)` block near it:

```css
@media (min-width: 640px) {
  .text-card-title-compact {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}
```

- [ ] **Step 5: Run audits to verify**

Run: `cd wp-content/themes/henrys-digital-canvas && bash ./scripts/utility_sync_audit.sh ~/henry-s-digital-canvas/src/index.css`
Expected: `Missing utilities: 0`

- [ ] **Step 6: Commit**

```bash
git add assets/css/design-system.css
git commit -m "feat(utilities): add 9 missing utility classes (rounded-indicator, scroll-mt-anchor, shadow-control, text-*)"
```

---

## Task 6: Copy Image Assets

**Files:**
- Create dirs: `assets/images/backgrounds/`, `assets/images/resume/capabilities/`
- Copy 20 image files from React source

- [ ] **Step 1: Copy background images (14 files)**

```bash
cd wp-content/themes/henrys-digital-canvas
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-footer-editorial-network.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-footer-editorial-network-960.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-hero-editorial-amber.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-hero-editorial-amber-960.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-hero-resume-profile.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-hero-resume-profile-960.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-surface-dev-signal-grid.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-surface-dev-signal-grid-960.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-surface-ember-topography.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-surface-ember-topography-960.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-surface-ember-veil.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-surface-ember-veil-960.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-surface-music-harmonics.webp assets/images/backgrounds/
cp ~/henry-s-digital-canvas/public/images/backgrounds/theme-surface-music-harmonics-960.webp assets/images/backgrounds/
```

- [ ] **Step 2: Copy capability images (6 files)**

```bash
mkdir -p assets/images/resume/capabilities
cp ~/henry-s-digital-canvas/public/images/resume/capabilities/capability-customer-outcomes.webp assets/images/resume/capabilities/
cp ~/henry-s-digital-canvas/public/images/resume/capabilities/capability-customer-outcomes-960.webp assets/images/resume/capabilities/
cp ~/henry-s-digital-canvas/public/images/resume/capabilities/capability-technical-delivery.webp assets/images/resume/capabilities/
cp ~/henry-s-digital-canvas/public/images/resume/capabilities/capability-technical-delivery-960.webp assets/images/resume/capabilities/
cp ~/henry-s-digital-canvas/public/images/resume/capabilities/capability-operations-leadership.webp assets/images/resume/capabilities/
cp ~/henry-s-digital-canvas/public/images/resume/capabilities/capability-operations-leadership-960.webp assets/images/resume/capabilities/
```

- [ ] **Step 3: Verify files exist**

```bash
ls -la assets/images/backgrounds/*.webp | wc -l  # expect 16 (14 new + 2 existing)
ls -la assets/images/resume/capabilities/*.webp | wc -l  # expect 6
```

- [ ] **Step 4: Commit**

```bash
git add assets/images/backgrounds/ assets/images/resume/
git commit -m "assets: copy 20 background/capability images from React source for background library"
```

---

## Task 7: Create Background Library CSS

**Files:**
- Create: `assets/css/background-library.css`

- [ ] **Step 1: Create the file**

Port from `~/henry-s-digital-canvas/src/styles/background-library.css` with these adaptations:
- Image paths: `/images/` becomes `../images/`
- Dark selectors: `.dark .foo` becomes `body.dark .foo, body.is-dark-theme .foo, :root[data-theme="dark"] .foo`

```css
/* Background library — named backdrop and surface classes.
   Ported from React source src/styles/background-library.css.
   Loaded after design-system.css (depends on its tokens). */

.hero-backdrop-editorial-amber {
  background:
    linear-gradient(112deg, hsl(var(--overlay-scrim-medium)) 0%, hsl(var(--overlay-scrim-strong)) 100%),
    url("../images/backgrounds/theme-hero-editorial-amber.webp");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.hero-backdrop-resume-profile {
  background:
    linear-gradient(112deg, hsl(var(--overlay-scrim-medium)) 0%, hsl(var(--overlay-scrim-strong)) 100%),
    url("../images/backgrounds/theme-hero-resume-profile.webp");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.footer-backdrop-editorial-network {
  background:
    linear-gradient(180deg, hsl(var(--overlay-scrim-medium)) 0%, hsl(var(--overlay-scrim-strong)) 100%),
    url("../images/backgrounds/theme-footer-editorial-network.webp");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.surface-library-ember-veil,
.surface-library-ember-topography,
.surface-library-dev-signal,
.surface-library-music-harmonics,
.surface-library-learning-paper {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.surface-library-ember-veil > *,
.surface-library-ember-topography > *,
.surface-library-dev-signal > *,
.surface-library-music-harmonics > *,
.surface-library-learning-paper > * {
  position: relative;
  z-index: 1;
}

.surface-library-ember-veil::before,
.surface-library-ember-topography::before,
.surface-library-dev-signal::before,
.surface-library-music-harmonics::before,
.surface-library-learning-paper::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.surface-library-ember-veil {
  background-color: hsl(var(--card));
  border-color: hsl(var(--border-emphasis));
  box-shadow: var(--shadow-surface-strong);
}

.surface-library-ember-veil::before {
  background:
    linear-gradient(154deg, hsl(var(--overlay-ember-surface-start)) 0%, hsl(var(--overlay-ember-surface-end)) 100%),
    url("../images/backgrounds/theme-surface-ember-veil.webp");
}

.surface-library-ember-topography {
  background-color: hsl(var(--card));
}

.surface-library-ember-topography::before {
  background:
    linear-gradient(154deg, hsl(var(--overlay-ember-surface-start)) 0%, hsl(var(--overlay-ember-surface-end)) 100%),
    url("../images/backgrounds/theme-surface-ember-topography.webp");
  background-position: center center, 28% center;
}

.surface-library-dev-signal {
  background-color: hsl(var(--inverse-background));
}

.surface-library-dev-signal::before {
  background:
    linear-gradient(180deg, hsl(var(--inverse-background) / 0.94) 0%, hsl(var(--card) / 0.82) 100%),
    radial-gradient(68% 60% at 18% 18%, hsl(var(--info) / 0.16), transparent 60%),
    url("../images/backgrounds/theme-surface-dev-signal-grid.webp");
  background-blend-mode: normal, screen, normal;
}

body.dark .surface-library-dev-signal::before,
body.is-dark-theme .surface-library-dev-signal::before,
:root[data-theme="dark"] .surface-library-dev-signal::before {
  background:
    linear-gradient(180deg, hsl(var(--inverse-background) / 0.97) 0%, hsl(var(--background) / 0.9) 100%),
    radial-gradient(68% 60% at 18% 18%, hsl(var(--info) / 0.18), transparent 62%),
    url("../images/backgrounds/theme-surface-dev-signal-grid.webp");
  background-blend-mode: normal, screen, normal;
}

.surface-library-music-harmonics {
  background-color: hsl(var(--inverse-background));
}

.surface-library-music-harmonics::before {
  background:
    linear-gradient(180deg, hsl(var(--overlay-scrim-medium)) 0%, hsl(var(--overlay-scrim-strong)) 100%),
    radial-gradient(68% 58% at 78% 34%, hsl(var(--overlay-brand-amber)), transparent 62%),
    url("../images/backgrounds/theme-surface-music-harmonics.webp");
  background-blend-mode: normal, screen, normal;
}

.surface-library-learning-paper {
  background-color: hsl(var(--surface-1));
}

.surface-library-learning-paper::before {
  background:
    linear-gradient(180deg, hsl(var(--surface-1) / 0.94) 0%, hsl(var(--surface-2) / 0.9) 100%),
    radial-gradient(72% 56% at 84% 20%, hsl(var(--warning) / 0.12), transparent 60%),
    url("../images/backgrounds/theme-surface-learning-paper.webp");
  background-blend-mode: normal, multiply, normal;
}

body.dark .surface-library-learning-paper::before,
body.is-dark-theme .surface-library-learning-paper::before,
:root[data-theme="dark"] .surface-library-learning-paper::before {
  background:
    linear-gradient(180deg, hsl(var(--background) / 0.94) 0%, hsl(var(--surface-2) / 0.9) 100%),
    radial-gradient(72% 56% at 84% 20%, hsl(var(--warning) / 0.08), transparent 60%),
    url("../images/backgrounds/theme-surface-learning-paper.webp");
  background-blend-mode: normal, screen, normal;
  filter: saturate(0.82) brightness(0.5);
}

/* Resume capability surfaces */

.resume-capability-surface {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.resume-capability-surface > * {
  position: relative;
  z-index: 1;
}

.resume-capability-surface::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.resume-capability-customer::before {
  background:
    linear-gradient(180deg, hsl(var(--surface-1) / 0.96) 0%, hsl(var(--surface-2) / 0.92) 100%),
    radial-gradient(72% 56% at 86% 18%, hsl(var(--warning) / 0.12), transparent 60%),
    url("../images/resume/capabilities/capability-customer-outcomes.webp");
  background-blend-mode: normal, multiply, normal;
}

body.dark .resume-capability-customer::before,
body.is-dark-theme .resume-capability-customer::before,
:root[data-theme="dark"] .resume-capability-customer::before {
  background:
    linear-gradient(180deg, hsl(var(--background) / 0.95) 0%, hsl(var(--surface-2) / 0.92) 100%),
    radial-gradient(72% 56% at 86% 18%, hsl(var(--warning) / 0.08), transparent 60%),
    url("../images/resume/capabilities/capability-customer-outcomes.webp");
  background-blend-mode: normal, screen, normal;
  filter: saturate(0.86) brightness(0.62);
}

.resume-capability-technical::before {
  background:
    linear-gradient(180deg, hsl(var(--surface-1) / 0.96) 0%, hsl(var(--surface-2) / 0.92) 100%),
    radial-gradient(72% 56% at 86% 18%, hsl(var(--info) / 0.12), transparent 60%),
    url("../images/resume/capabilities/capability-technical-delivery.webp");
  background-blend-mode: normal, multiply, normal;
}

body.dark .resume-capability-technical::before,
body.is-dark-theme .resume-capability-technical::before,
:root[data-theme="dark"] .resume-capability-technical::before {
  background:
    linear-gradient(180deg, hsl(var(--background) / 0.95) 0%, hsl(var(--surface-2) / 0.92) 100%),
    radial-gradient(72% 56% at 86% 18%, hsl(var(--info) / 0.1), transparent 60%),
    url("../images/resume/capabilities/capability-technical-delivery.webp");
  background-blend-mode: normal, screen, normal;
  filter: saturate(0.86) brightness(0.62);
}

.resume-capability-operations::before {
  background:
    linear-gradient(180deg, hsl(var(--surface-1) / 0.96) 0%, hsl(var(--surface-2) / 0.92) 100%),
    radial-gradient(72% 56% at 86% 18%, hsl(var(--accent) / 0.12), transparent 60%),
    url("../images/resume/capabilities/capability-operations-leadership.webp");
  background-blend-mode: normal, multiply, normal;
}

body.dark .resume-capability-operations::before,
body.is-dark-theme .resume-capability-operations::before,
:root[data-theme="dark"] .resume-capability-operations::before {
  background:
    linear-gradient(180deg, hsl(var(--background) / 0.95) 0%, hsl(var(--surface-2) / 0.92) 100%),
    radial-gradient(72% 56% at 86% 18%, hsl(var(--accent) / 0.09), transparent 60%),
    url("../images/resume/capabilities/capability-operations-leadership.webp");
  background-blend-mode: normal, screen, normal;
  filter: saturate(0.86) brightness(0.62);
}

/* Responsive: swap to smaller images on mobile */

@media (max-width: 768px) {
  .hero-backdrop-editorial-amber {
    background-image:
      linear-gradient(112deg, hsl(var(--overlay-scrim-medium)) 0%, hsl(var(--overlay-scrim-strong)) 100%),
      url("../images/backgrounds/theme-hero-editorial-amber-960.webp");
  }

  .hero-backdrop-resume-profile {
    background-image:
      linear-gradient(112deg, hsl(var(--overlay-scrim-medium)) 0%, hsl(var(--overlay-scrim-strong)) 100%),
      url("../images/backgrounds/theme-hero-resume-profile-960.webp");
  }

  .footer-backdrop-editorial-network {
    background-image:
      linear-gradient(180deg, hsl(var(--overlay-scrim-medium)) 0%, hsl(var(--overlay-scrim-strong)) 100%),
      url("../images/backgrounds/theme-footer-editorial-network-960.webp");
  }

  .surface-library-ember-veil::before {
    background-image:
      linear-gradient(154deg, hsl(var(--overlay-ember-surface-start)) 0%, hsl(var(--overlay-ember-surface-end)) 100%),
      url("../images/backgrounds/theme-surface-ember-veil-960.webp");
  }

  .surface-library-ember-topography::before {
    background-image:
      linear-gradient(154deg, hsl(var(--overlay-ember-surface-start)) 0%, hsl(var(--overlay-ember-surface-end)) 100%),
      url("../images/backgrounds/theme-surface-ember-topography-960.webp");
  }

  .surface-library-dev-signal::before {
    background-image:
      linear-gradient(180deg, hsl(var(--inverse-background) / 0.94) 0%, hsl(var(--card) / 0.82) 100%),
      radial-gradient(68% 60% at 18% 18%, hsl(var(--info) / 0.16), transparent 60%),
      url("../images/backgrounds/theme-surface-dev-signal-grid-960.webp");
  }

  body.dark .surface-library-dev-signal::before,
  body.is-dark-theme .surface-library-dev-signal::before,
  :root[data-theme="dark"] .surface-library-dev-signal::before {
    background-image:
      linear-gradient(180deg, hsl(var(--inverse-background) / 0.97) 0%, hsl(var(--background) / 0.9) 100%),
      radial-gradient(68% 60% at 18% 18%, hsl(var(--info) / 0.18), transparent 62%),
      url("../images/backgrounds/theme-surface-dev-signal-grid-960.webp");
  }

  .surface-library-music-harmonics::before {
    background-image:
      linear-gradient(180deg, hsl(var(--overlay-scrim-medium)) 0%, hsl(var(--overlay-scrim-strong)) 100%),
      radial-gradient(68% 58% at 78% 34%, hsl(var(--overlay-brand-amber)), transparent 62%),
      url("../images/backgrounds/theme-surface-music-harmonics-960.webp");
  }

  .surface-library-learning-paper::before {
    background-image:
      linear-gradient(180deg, hsl(var(--surface-1) / 0.94) 0%, hsl(var(--surface-2) / 0.9) 100%),
      radial-gradient(72% 56% at 84% 20%, hsl(var(--warning) / 0.12), transparent 60%),
      url("../images/backgrounds/theme-surface-learning-paper-960.webp");
  }

  body.dark .surface-library-learning-paper::before,
  body.is-dark-theme .surface-library-learning-paper::before,
  :root[data-theme="dark"] .surface-library-learning-paper::before {
    background-image:
      linear-gradient(180deg, hsl(var(--background) / 0.94) 0%, hsl(var(--surface-2) / 0.9) 100%),
      radial-gradient(72% 56% at 84% 20%, hsl(var(--warning) / 0.08), transparent 60%),
      url("../images/backgrounds/theme-surface-learning-paper-960.webp");
  }

  .resume-capability-customer::before {
    background-image:
      linear-gradient(180deg, hsl(var(--surface-1) / 0.96) 0%, hsl(var(--surface-2) / 0.92) 100%),
      radial-gradient(72% 56% at 86% 18%, hsl(var(--warning) / 0.12), transparent 60%),
      url("../images/resume/capabilities/capability-customer-outcomes-960.webp");
  }

  body.dark .resume-capability-customer::before,
  body.is-dark-theme .resume-capability-customer::before,
  :root[data-theme="dark"] .resume-capability-customer::before {
    background-image:
      linear-gradient(180deg, hsl(var(--background) / 0.95) 0%, hsl(var(--surface-2) / 0.92) 100%),
      radial-gradient(72% 56% at 86% 18%, hsl(var(--warning) / 0.08), transparent 60%),
      url("../images/resume/capabilities/capability-customer-outcomes-960.webp");
  }

  .resume-capability-technical::before {
    background-image:
      linear-gradient(180deg, hsl(var(--surface-1) / 0.96) 0%, hsl(var(--surface-2) / 0.92) 100%),
      radial-gradient(72% 56% at 86% 18%, hsl(var(--info) / 0.12), transparent 60%),
      url("../images/resume/capabilities/capability-technical-delivery-960.webp");
  }

  body.dark .resume-capability-technical::before,
  body.is-dark-theme .resume-capability-technical::before,
  :root[data-theme="dark"] .resume-capability-technical::before {
    background-image:
      linear-gradient(180deg, hsl(var(--background) / 0.95) 0%, hsl(var(--surface-2) / 0.92) 100%),
      radial-gradient(72% 56% at 86% 18%, hsl(var(--info) / 0.1), transparent 60%),
      url("../images/resume/capabilities/capability-technical-delivery-960.webp");
  }

  .resume-capability-operations::before {
    background-image:
      linear-gradient(180deg, hsl(var(--surface-1) / 0.96) 0%, hsl(var(--surface-2) / 0.92) 100%),
      radial-gradient(72% 56% at 86% 18%, hsl(var(--accent) / 0.12), transparent 60%),
      url("../images/resume/capabilities/capability-operations-leadership-960.webp");
  }

  body.dark .resume-capability-operations::before,
  body.is-dark-theme .resume-capability-operations::before,
  :root[data-theme="dark"] .resume-capability-operations::before {
    background-image:
      linear-gradient(180deg, hsl(var(--background) / 0.95) 0%, hsl(var(--surface-2) / 0.92) 100%),
      radial-gradient(72% 56% at 86% 18%, hsl(var(--accent) / 0.09), transparent 60%),
      url("../images/resume/capabilities/capability-operations-leadership-960.webp");
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/background-library.css
git commit -m "feat: add background-library.css with 10 named surface/backdrop classes"
```

---

## Task 8: Enqueue Background Library & Add Print Overrides

**Files:**
- Modify: `functions.php:55-60` (frontend enqueue)
- Modify: `assets/css/design-system.css:1210-1219` (print block)

- [ ] **Step 1: Add enqueue in functions.php**

After the `hdc-design-system` enqueue block (after line 60), add:

```php
	wp_enqueue_style(
		'hdc-background-library',
		get_stylesheet_directory_uri() . '/assets/css/background-library.css',
		array( 'hdc-design-system' ),
		hdc_asset_version( '/assets/css/background-library.css' )
	);
```

- [ ] **Step 2: Add background library classes to print override in design-system.css**

In the `@media print` block, extend the `display: none !important` selector list. Change:

```css
  .noise::before,
  .ember-surface::before,
  .ember-surface::after,
  .hero-backdrop,
  .hero-backdrop-overlay,
  .footer-backdrop,
  .footer-backdrop-overlay,
  .footer-cinematic::after {
    display: none !important;
  }
```

To:

```css
  .noise::before,
  .ember-surface::before,
  .ember-surface::after,
  .hero-backdrop,
  .hero-backdrop-overlay,
  .footer-backdrop,
  .footer-backdrop-overlay,
  .footer-cinematic::after,
  .hero-backdrop-editorial-amber,
  .hero-backdrop-resume-profile,
  .footer-backdrop-editorial-network,
  .surface-library-ember-veil::before,
  .surface-library-ember-topography::before,
  .surface-library-dev-signal::before,
  .surface-library-music-harmonics::before,
  .surface-library-learning-paper::before,
  .resume-capability-surface::before {
    display: none !important;
  }
```

- [ ] **Step 3: Commit**

```bash
git add functions.php assets/css/design-system.css
git commit -m "feat: enqueue background-library.css and add print overrides for surface classes"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Run token sync audit**

```bash
cd wp-content/themes/henrys-digital-canvas
bash ./scripts/token_sync_audit.sh ~/henry-s-digital-canvas/src/index.css
```

Expected: Only gradient-whitespace mismatches remain (no real token gaps).

- [ ] **Step 2: Run utility sync audit**

```bash
bash ./scripts/utility_sync_audit.sh ~/henry-s-digital-canvas/src/index.css
```

Expected: `Missing utilities: 0`

- [ ] **Step 3: Run full smoke test**

```bash
npm run smoke:full
```

Expected: All checks pass.

- [ ] **Step 4: Commit plan file**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com
git add wp-content/themes/henrys-digital-canvas/docs/plans/2026-03-15-wpds-parity-polish-plan.md
git commit -m "docs: add WPDS parity polish implementation plan"
```
