# Resume Overview Parity Fix — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the `resume-overview` WordPress block to full design and functional parity with the source React `Resume.tsx` component.

**Architecture:** Fix 11 gaps and remove 3 WP-only extras across 4 files (`view.js`, `style.css`, `render.php`, `data/resume.json`) plus copy 6 project cover images. Data sync is the foundation (Phase 1), then structural changes to the view layer (Phase 2–5), then polish (Phase 6). No build step — this is a createElement block using vanilla JS.

**Tech Stack:** WordPress block (PHP server render + `wp.element.createElement` client JS), CSS custom properties from `design-system.css` and `background-library.css`.

**Key paths:**
- Block dir: `wp-content/themes/henrys-digital-canvas/blocks/resume-overview/`
- Theme dir: `wp-content/themes/henrys-digital-canvas/`
- React source: `/home/azureuser/henry-s-digital-canvas/src/pages/Resume.tsx`
- React data: `/home/azureuser/henry-s-digital-canvas/src/data/resume-facts.ts`
- React visuals: `/home/azureuser/henry-s-digital-canvas/src/data/resume-visuals.ts`

---

## Phase 1: Sync resume.json data (Gap #14)

### Task 1: Update resume.json to match React resume-facts.ts

**Files:**
- Modify: `data/resume.json`

The WP JSON has drifted from the React source. Key differences: capability map categories ("Adoption & Retention" → "Customer Outcomes", "Technical Execution" → "Technical Delivery", "Leadership & Operations" → "Operations & Leadership"), projects (old set → Prompt Forge / HPerkins.com / WordPress Portfolio), summary text, differentiator text, impactStrip values, skill categories, and experience highlights.

- [ ] **Step 1: Regenerate resume.json from resume-facts.ts data**

Replace the entire `data/resume.json` content with data matching the React source. The JSON structure stays the same (same keys), but all values must match `resume-facts.ts`.

Key value changes:
- `summary`: Must combine `resumeSummaryStatements.currentWork` + space + `resumeSummaryStatements.publicProjectSet`
- `differentiator`: Must match `resumeProfile.differentiator`
- `capabilityMap`: 3 categories — "Customer Outcomes", "Technical Delivery", "Operations & Leadership" with items from `resumeCapabilityMap`
- `experience`: 8 entries from `resumeExperience` with updated highlights
- `projects`: 3 entries — "Prompt Forge", "HPerkins.com", "WordPress Portfolio (wp-hperkins-com)" from `resumeProjects`
- `skills`: 6 categories from `resumeSkills` — "Languages & Frontend", "AI & Automation", "WordPress & Web Delivery", "Support & Enablement", "Tools & Workflow", "Leadership & Operations"
- `impactStrip`: 5 entries from `resumeImpactStrip` — values "Since 2007", "3 projects", "End-to-end", "Cross-team", "WP + AI"
- `certifications`: Single entry from `resumeCertifications`
- `education`: 4 entries from `resumeEducation` (ASU expected May 2026, COD 2013, Columbia 2007-2008, Manteno 2001-2005)

- [ ] **Step 2: Validate JSON**

```bash
python3 -c "import json; json.load(open('data/resume.json')); print('Valid JSON')"
```

Expected: `Valid JSON`

- [ ] **Step 3: Verify REST endpoint returns updated data**

```bash
curl -s https://wp.hperkins.com/wp-json/henrys-digital-canvas/v1/resume | python3 -c "import sys,json; d=json.load(sys.stdin)['data']; print(d['capabilityMap'][0]['category'])"
```

Expected: `Customer Outcomes`

- [ ] **Step 4: Commit**

```bash
git add data/resume.json
git commit -m "fix(resume-overview): sync resume.json with React resume-facts.ts source data"
```

---

## Phase 2: Cinematic editorial hero (Gap #1) + hero actions (Gap #2) + remove extras (#15, #17)

### Task 2: Copy project cover images

**Files:**
- Create: `assets/images/resume/signature-work/` directory
- Create: 6 image files

- [ ] **Step 1: Create target directories and copy images**

```bash
cd wp-content/themes/henrys-digital-canvas
mkdir -p assets/images/resume/signature-work
cp /home/azureuser/henry-s-digital-canvas/public/images/work/case-studies/promptforge-cover.webp assets/images/work/case-studies/
cp /home/azureuser/henry-s-digital-canvas/public/images/work/case-studies/promptforge-cover-960.webp assets/images/work/case-studies/
cp /home/azureuser/henry-s-digital-canvas/public/images/work/case-studies/digital-canvas-cover.webp assets/images/work/case-studies/
cp /home/azureuser/henry-s-digital-canvas/public/images/work/case-studies/digital-canvas-cover-960.webp assets/images/work/case-studies/
cp /home/azureuser/henry-s-digital-canvas/public/images/resume/signature-work/wordpress-portfolio-cover.webp assets/images/resume/signature-work/
cp /home/azureuser/henry-s-digital-canvas/public/images/resume/signature-work/wordpress-portfolio-cover-960.webp assets/images/resume/signature-work/
```

- [ ] **Step 2: Commit images**

```bash
git add assets/images/work/case-studies/promptforge-cover*.webp assets/images/work/case-studies/digital-canvas-cover*.webp assets/images/resume/signature-work/wordpress-portfolio-cover*.webp
git commit -m "feat(resume-overview): add project cover images for signature work section"
```

### Task 3: Rewrite hero section in view.js

**Files:**
- Modify: `blocks/resume-overview/view.js`

The hero must become a cinematic editorial section matching `PageHero surface="cinematicEditorial"` with:
- `hero-backdrop-resume-profile` backdrop (already in `background-library.css`)
- `hero-backdrop-overlay` overlay
- `noise` texture class
- Inverse tone typography (white text on dark)
- Bottom divider border
- Three action buttons: "ATS Resume" → `/resume/ats/`, Printer icon → PDF, "Contact" → `/contact/`

Also remove the `portfolioUrl` from `parseConfig()` since "Portfolio" action is being removed.

- [ ] **Step 1: Remove `portfolioUrl` from parseConfig**

In `parseConfig()`, remove the `portfolioUrl` line. Also remove it from the `config` object in `render.php`.

- [ ] **Step 2: Rewrite the hero `<header>` in `ResumeOverviewApp`**

Replace the current hero block (lines ~313–360 in the current view.js) with the cinematic editorial pattern:

```js
h(
  'section',
  { className: 'hdc-resume-overview__hero noise' },
  h(
    'div',
    { className: 'hero-backdrop-resume-profile', 'aria-hidden': 'true' },
    h( 'div', { className: 'hero-backdrop-overlay' } )
  ),
  h( 'div', { className: 'hdc-resume-overview__hero-gradient hero-gradient-layer', 'aria-hidden': 'true' } ),
  h(
    'div',
    { className: 'hdc-resume-overview__hero-shell' },
    h(
      'div',
      { className: 'hdc-resume-overview__hero-content' },
      h( 'p', { className: 'hdc-resume-overview__eyebrow' }, config.heading || 'Resume' ),
      h( 'h1', { className: 'hdc-resume-overview__title' }, ensureString( data.headline, 'Resume' ) ),
      h( 'p', { className: 'hdc-resume-overview__subtitle' }, ensureString( data.subheadline, '' ) ),
      targetRoles.length
        ? h(
          'div',
          { className: 'hdc-resume-overview__roles' },
          targetRoles.map( function ( role ) {
            return h( 'span', { className: 'hdc-resume-overview__badge', key: role }, role );
          } )
        )
        : null
    ),
    h(
      'div',
      { className: 'hdc-resume-overview__actions' },
      config.showAtsLink
        ? h( 'a', { className: 'hdc-resume-overview__action hdc-resume-overview__action--inverse-glass', href: config.atsUrl }, 'ATS Resume' )
        : null,
      h(
        'a',
        {
          className: 'hdc-resume-overview__action hdc-resume-overview__action--inverse-glass hdc-resume-overview__action--icon-only',
          href: '/documents/henry-perkins-ats-resume.pdf',
          target: '_blank',
          rel: 'noopener noreferrer',
          'aria-label': 'Open ATS Resume PDF',
          title: 'Open ATS Resume PDF',
        },
        renderLucideIcon( h, 'printer', { className: 'hdc-resume-overview__action-icon-svg', size: 16 } )
      ),
      h( 'a', { className: 'hdc-resume-overview__action hdc-resume-overview__action--primary', href: '/contact/' }, 'Contact' )
    )
  )
),
```

- [ ] **Step 3: Remove impactStrip section and "Impact at a Glance" from SECTION_ICONS**

Remove the entire `impactStrip.length ? h('section', ...)` conditional block (Gap #15 removal). Remove the `impactStrip` jump link from `sectionLinks`. Remove `'Impact at a Glance': 'trending-up'` from `SECTION_ICONS`.

- [ ] **Step 4: Remove "Skills" jump link**

Remove the `skills.length` conditional that pushes `{ href: '#resume-skills', label: 'Skills' }` to `sectionLinks`. The skills section will be merged into capability cards in Phase 3.

- [ ] **Step 5: Validate syntax**

```bash
node -c blocks/resume-overview/view.js
```

Expected: no syntax errors

- [ ] **Step 6: Commit**

```bash
git add blocks/resume-overview/view.js blocks/resume-overview/render.php
git commit -m "feat(resume-overview): cinematic editorial hero with correct action buttons

Replaces plain header with cinematic hero (backdrop image, noise, inverse tone).
Fixes hero actions: ATS Resume + Printer PDF + Contact (removes Portfolio).
Removes Impact at a Glance section (not in React source).
Removes Skills jump link (skills will merge into capability cards)."
```

### Task 4: Add hero CSS styles

**Files:**
- Modify: `blocks/resume-overview/style.css`

- [ ] **Step 1: Rewrite hero styles for cinematic editorial treatment**

Replace the existing `.hdc-resume-overview__hero` block with inverse-tone cinematic hero styles:

```css
.hdc-resume-overview__hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: 4rem 2rem 3.5rem;
  border-bottom: 1px solid hsl(var(--inverse-border) / 0.3);
}

.hdc-resume-overview__hero-gradient {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.hdc-resume-overview__hero-shell {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0 auto;
  max-width: 64rem;
}

.hdc-resume-overview__hero-content {
  display: grid;
  gap: 0.75rem;
  max-width: 42rem;
}

/* Inverse-tone hero typography */
.hdc-resume-overview__hero .hdc-resume-overview__eyebrow {
  color: hsl(var(--inverse-muted-foreground));
}

.hdc-resume-overview__hero .hdc-resume-overview__title {
  color: hsl(var(--inverse-foreground));
  text-shadow: var(--text-shadow-hero-title);
}

.hdc-resume-overview__hero .hdc-resume-overview__subtitle {
  color: hsl(var(--inverse-muted-foreground));
  text-shadow: var(--text-shadow-hero-body);
}

.hdc-resume-overview__hero .hdc-resume-overview__badge {
  background: hsl(var(--inverse-surface));
  border-color: hsl(var(--inverse-border) / 0.3);
  color: hsl(var(--inverse-foreground));
}
```

- [ ] **Step 2: Add inverse-glass and primary action button styles**

```css
.hdc-resume-overview__action--inverse-glass {
  background: hsl(var(--inverse-surface));
  border-color: hsl(var(--inverse-border) / 0.3);
  color: hsl(var(--inverse-foreground));
  backdrop-filter: blur(var(--overlay-blur-glass)) saturate(1.2);
}

.hdc-resume-overview__action--inverse-glass:hover,
.hdc-resume-overview__action--inverse-glass:focus-visible {
  background: hsl(var(--inverse-surface-hover));
  border-color: hsl(var(--inverse-border) / 0.5);
  color: hsl(var(--inverse-foreground));
}

.hdc-resume-overview__action--primary {
  background: hsl(var(--primary));
  border-color: transparent;
  color: hsl(var(--primary-foreground));
  box-shadow: var(--shadow-cta-hero);
}

.hdc-resume-overview__action--primary:hover,
.hdc-resume-overview__action--primary:focus-visible {
  background: hsl(var(--primary) / 0.9);
  border-color: transparent;
  color: hsl(var(--primary-foreground));
}

.hdc-resume-overview__action--icon-only {
  padding: 0;
  width: 2.25rem;
}

.hdc-resume-overview__hero .hdc-resume-overview__action:focus-visible {
  box-shadow:
    0 0 0 var(--focus-ring-width) hsl(var(--ring)),
    0 0 0 calc(var(--focus-ring-width) + var(--focus-ring-offset)) hsl(var(--inverse-background));
}
```

- [ ] **Step 3: Add responsive hero styles**

```css
@media (min-width: 768px) {
  .hdc-resume-overview__hero {
    padding: 5rem 2rem 4rem;
  }

  .hdc-resume-overview__hero-shell {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}
```

- [ ] **Step 4: Remove the now-unused `__hero-copy` class**

Delete `.hdc-resume-overview__hero-copy` from style.css (replaced by `__hero-content`).

- [ ] **Step 5: Commit**

```bash
git add blocks/resume-overview/style.css
git commit -m "style(resume-overview): cinematic editorial hero with inverse-glass action buttons"
```

---

## Phase 3: Merge skills into capability cards (Gap #3) + capability polish (Gaps #4, #7, #8) + remove standalone Skills section (#16)

### Task 5: Add RESUME_CAPABILITY_SKILL_GROUPS mapping and merge skills into capability cards

**Files:**
- Modify: `blocks/resume-overview/view.js`

- [ ] **Step 1: Add the skill-group mapping constant**

After `SECTION_ICONS`, add:

```js
var RESUME_CAPABILITY_SKILL_GROUPS = {
  'Customer Outcomes': ['Support & Enablement'],
  'Technical Delivery': ['Languages & Frontend', 'AI & Automation', 'WordPress & Web Delivery'],
  'Operations & Leadership': ['Tools & Workflow', 'Leadership & Operations'],
};
```

- [ ] **Step 2: Add capability surface class lookup**

```js
var CAPABILITY_SURFACE_CLASSES = {
  'Customer Outcomes': 'resume-capability-surface resume-capability-customer',
  'Technical Delivery': 'resume-capability-surface resume-capability-technical',
  'Operations & Leadership': 'resume-capability-surface resume-capability-operations',
};
```

- [ ] **Step 3: Build `combinedCapabilityCards` inside `ResumeOverviewApp`**

After extracting `skills` from data, add:

```js
var skillsByCategory = {};
skills.forEach( function ( cat ) {
  skillsByCategory[ cat.category ] = cat;
} );

var combinedCapabilityCards = capabilityMap.map( function ( column ) {
  var groupNames = RESUME_CAPABILITY_SKILL_GROUPS[ column.category ] || [];
  return {
    category: column.category,
    items: ensureArray( column.items ),
    skillGroups: groupNames
      .map( function ( name ) { return skillsByCategory[ name ]; } )
      .filter( Boolean ),
  };
} );
```

- [ ] **Step 4: Rewrite capability map section to use combinedCapabilityCards**

Replace the current capability map rendering with:

```js
combinedCapabilityCards.length
  ? h(
    'section',
    { className: 'hdc-resume-overview__section', id: 'resume-capability-map' },
    sectionTitle( 'Capability Map' ),
    h( 'span', { id: 'resume-skills', 'aria-hidden': 'true', className: 'hdc-resume-overview__skills-anchor' } ),
    h(
      'div',
      { className: 'hdc-resume-overview__capability' },
      combinedCapabilityCards.map( function ( column, index ) {
        var surfaceClass = CAPABILITY_SURFACE_CLASSES[ column.category ] || '';
        return h(
          'article',
          {
            className: 'hdc-resume-overview__card surface-inset-soft' + ( surfaceClass ? ' ' + surfaceClass : '' ),
            key: column.category || 'capability-' + String( index ),
          },
          h( 'h3', { className: 'hdc-resume-overview__entry-title' }, column.category || 'Capability' ),
          h(
            'ul',
            { className: 'hdc-resume-overview__list' },
            column.items.map( function ( item, itemIndex ) {
              return h( 'li', { key: String( item ) + '-' + String( itemIndex ) }, String( item ) );
            } )
          ),
          column.skillGroups.length
            ? h(
              'div',
              { className: 'hdc-resume-overview__capability-skills' },
              column.skillGroups.map( function ( group ) {
                return h(
                  'div',
                  { key: group.category, className: 'hdc-resume-overview__capability-skill-group' },
                  h( 'h4', { className: 'hdc-resume-overview__capability-skill-heading' }, group.category ),
                  h(
                    'div',
                    { className: 'hdc-resume-overview__chips' },
                    ensureArray( group.items ).map( function ( item, itemIndex ) {
                      return h( 'span', { className: 'hdc-resume-overview__badge', key: String( item ) + '-' + String( itemIndex ) }, String( item ) );
                    } )
                  )
                );
              } )
            )
            : null
        );
      } )
    )
  )
  : null,
```

- [ ] **Step 5: Remove the standalone Skills section**

Delete the entire `skills.length ? h('section', { id: 'resume-skills' }, ...)` block. Also remove `'Skills': 'wrench'` from `SECTION_ICONS`.

- [ ] **Step 6: Add capability card styles**

Add to `style.css`:

```css
.hdc-resume-overview__card.surface-inset-soft {
  transition: border-color var(--motion-duration-fast) var(--motion-ease-standard);
}

.hdc-resume-overview__card.surface-inset-soft:hover {
  border-color: hsl(var(--interactive-border-hover));
}

.hdc-resume-overview__capability-skills {
  border-top: 1px solid hsl(var(--border));
  margin-top: 1.25rem;
  padding-top: 1rem;
}

.hdc-resume-overview__capability-skill-group + .hdc-resume-overview__capability-skill-group {
  margin-top: 1rem;
}

.hdc-resume-overview__capability-skill-heading {
  color: hsl(var(--text-accent));
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  margin: 0 0 0.5rem;
}

.hdc-resume-overview__skills-anchor {
  display: block;
  scroll-margin-top: calc(6rem + var(--layout-admin-bar-offset));
}
```

- [ ] **Step 7: Validate and commit**

```bash
node -c blocks/resume-overview/view.js
git add blocks/resume-overview/view.js blocks/resume-overview/style.css
git commit -m "feat(resume-overview): merge skills into capability map cards with surface classes

Implements RESUME_CAPABILITY_SKILL_GROUPS mapping (Gap #3).
Adds per-column surface classes from background-library.css (Gap #4).
Adds interactive hover transition on capability cards (Gap #7).
Applies surface-inset-soft tone to capability cards (Gap #8).
Removes standalone Skills section (Extra #16)."
```

---

## Phase 4: Signature Work images (Gap #5) + Evidence label (Gap #6) + Experience sort (Gap #10)

### Task 6: Add project cover images and fix Evidence label

**Files:**
- Modify: `blocks/resume-overview/view.js`
- Modify: `blocks/resume-overview/style.css`

- [ ] **Step 1: Add project visual lookup**

After `CAPABILITY_SURFACE_CLASSES`, add:

```js
var PROJECT_VISUALS = {
  'Prompt Forge': {
    alt: 'Prompt Forge signature work cover showing structured builder flows and routed signal lines',
    src: hdcThemeUri + '/assets/images/work/case-studies/promptforge-cover.webp',
    srcSet: hdcThemeUri + '/assets/images/work/case-studies/promptforge-cover-960.webp 960w, ' + hdcThemeUri + '/assets/images/work/case-studies/promptforge-cover.webp 1536w',
  },
  'HPerkins.com': {
    alt: 'HPerkins.com signature work cover showing editorial panels and linked runtime structure',
    src: hdcThemeUri + '/assets/images/work/case-studies/digital-canvas-cover.webp',
    srcSet: hdcThemeUri + '/assets/images/work/case-studies/digital-canvas-cover-960.webp 960w, ' + hdcThemeUri + '/assets/images/work/case-studies/digital-canvas-cover.webp 1536w',
  },
  'WordPress Portfolio (wp-hperkins-com)': {
    alt: 'WordPress Portfolio signature work cover showing structured publishing panels and content-delivery pathways',
    src: hdcThemeUri + '/assets/images/resume/signature-work/wordpress-portfolio-cover.webp',
    srcSet: hdcThemeUri + '/assets/images/resume/signature-work/wordpress-portfolio-cover-960.webp 960w, ' + hdcThemeUri + '/assets/images/resume/signature-work/wordpress-portfolio-cover.webp 1536w',
  },
};
```

Note: `hdcThemeUri` must be passed from `render.php` via the data-config attribute. Add `themeUri` to the config object in render.php:
```php
'themeUri' => esc_url_raw( get_stylesheet_directory_uri() ),
```
And read it in `parseConfig()`:
```js
themeUri: ensureString( parsed.themeUri, '' ),
```
Then set `var hdcThemeUri = config.themeUri;` at the top of `ResumeOverviewApp`.

- [ ] **Step 2: Add project cover image to each project card**

In the projects rendering, before the project header div, add:

```js
projectVisual
  ? h( 'img', {
    alt: projectVisual.alt,
    className: 'hdc-resume-overview__project-cover',
    decoding: 'async',
    loading: 'lazy',
    sizes: '(min-width: 1280px) 768px, 100vw',
    src: projectVisual.src,
    srcSet: projectVisual.srcSet,
  } )
  : null,
```

Where `var projectVisual = PROJECT_VISUALS[ ensureString( project && project.name, '' ) ];` is defined at the start of the map callback.

- [ ] **Step 3: Fix "Impact:" → "Evidence:" label**

Change line `'Impact: ' + ensureString( project && project.impact, '' )` to:

```js
h( Fragment, null,
  h( 'span', { className: 'hdc-resume-overview__evidence-label' }, 'Evidence:' ),
  ' ' + ensureString( project && project.impact, '' )
)
```

- [ ] **Step 4: Add project cover image CSS**

```css
.hdc-resume-overview__project-cover {
  aspect-ratio: 16 / 7;
  border-bottom: 1px solid hsl(var(--border));
  display: block;
  object-fit: cover;
  width: 100%;
}

.hdc-resume-overview__project-body {
  padding: 1rem;
}

.hdc-resume-overview__evidence-label {
  font-weight: 500;
}
```

Also update `.hdc-resume-overview__card--ember` project cards to use `padding: 0` on the card and wrap the text content in a `__project-body` div with padding.

- [ ] **Step 5: Validate and commit**

```bash
node -c blocks/resume-overview/view.js
git add blocks/resume-overview/view.js blocks/resume-overview/style.css blocks/resume-overview/render.php
git commit -m "feat(resume-overview): add project cover images and fix Evidence label

Adds responsive cover images to Signature Work cards (Gap #5).
Changes 'Impact:' to 'Evidence:' label prefix (Gap #6).
Passes themeUri from render.php for image path resolution."
```

### Task 7: Sort experience newest-first

**Files:**
- Modify: `blocks/resume-overview/view.js`

- [ ] **Step 1: Add parsePeriodStart and sortExperienceDescending helpers**

After `ensureString()`, add:

```js
var MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parsePeriodStart( period ) {
  var start = ( period || '' ).split( '-' )[0].trim();
  var monthYear = start.match( /^([A-Za-z]{3})\s+(\d{4})$/ );
  if ( monthYear ) {
    return Number( monthYear[2] ) * 12 + ( MONTHS[ monthYear[1].toLowerCase() ] || 0 );
  }
  var yearOnly = start.match( /^(\d{4})$/ );
  if ( yearOnly ) {
    return Number( yearOnly[1] ) * 12;
  }
  return 0;
}

function sortExperienceDescending( entries ) {
  return entries.slice().sort( function ( a, b ) {
    return parsePeriodStart( b.period ) - parsePeriodStart( a.period );
  } );
}
```

- [ ] **Step 2: Apply sort before rendering experience**

After `const experience = ensureArray( data.experience );`, add:

```js
var sortedExperience = sortExperienceDescending( experience );
```

Then replace `experience.map(` with `sortedExperience.map(` in the experience section.

- [ ] **Step 3: Validate and commit**

```bash
node -c blocks/resume-overview/view.js
git add blocks/resume-overview/view.js
git commit -m "feat(resume-overview): sort experience entries newest-first (Gap #10)"
```

---

## Phase 5: Jump nav active state tracking (Gap #9)

### Task 8: Add IntersectionObserver to SectionJumpNav

**Files:**
- Modify: `blocks/resume-overview/view.js`
- Modify: `blocks/resume-overview/style.css`

Pattern reference: `blocks/blog-post/view.js` lines 985–1083.

- [ ] **Step 1: Add active state tracking to SectionJumpNav**

Rewrite the `SectionJumpNav` component to include `useState` for `activeHref` and `useEffect` with IntersectionObserver:

```js
function SectionJumpNav( props ) {
  var items = props.items;
  var initialHref = items.length ? items[0].href : '';
  var activeState = useState( function () {
    return window.location.hash || initialHref;
  } );
  var activeHref = activeState[0];
  var setActiveHref = activeState[1];

  useEffect( function () {
    if ( typeof IntersectionObserver === 'undefined' || ! items.length ) {
      return undefined;
    }

    var headingEls = [];
    items.forEach( function ( item ) {
      var id = item.href.replace( /^#/, '' );
      var el = document.getElementById( id );
      if ( el ) {
        headingEls.push( el );
      }
    } );

    if ( ! headingEls.length ) {
      return undefined;
    }

    var observer = new IntersectionObserver(
      function ( entries ) {
        entries.forEach( function ( entry ) {
          if ( entry.isIntersecting ) {
            setActiveHref( '#' + entry.target.id );
          }
        } );
      },
      { rootMargin: '-100px 0px -66% 0px', threshold: 0 }
    );

    headingEls.forEach( function ( el ) {
      observer.observe( el );
    } );

    function onHashChange() {
      setActiveHref( window.location.hash || initialHref );
    }

    window.addEventListener( 'hashchange', onHashChange );

    return function () {
      observer.disconnect();
      window.removeEventListener( 'hashchange', onHashChange );
    };
  }, [ items ] );

  if ( ! items.length ) {
    return null;
  }

  return h(
    'section',
    { className: 'hdc-resume-overview__jump-nav' },
    h(
      'div',
      { className: 'hdc-resume-overview__card hdc-resume-overview__jump-nav-panel' },
      h( 'p', { className: 'hdc-resume-overview__card-label' }, 'Jump to resume sections' ),
      props.description ? h( 'p', { className: 'hdc-resume-overview__text' }, props.description ) : null,
      h(
        'nav',
        { className: 'hdc-resume-overview__jump-nav-nav', 'aria-label': 'Jump to resume sections' },
        h(
          'ul',
          { className: 'hdc-resume-overview__jump-nav-list' },
          items.map( function ( item ) {
            var isActive = activeHref === item.href;
            return h(
              'li',
              { className: 'hdc-resume-overview__jump-nav-item', key: item.href },
              h(
                'a',
                {
                  className: 'hdc-resume-overview__jump-nav-link' + ( isActive ? ' hdc-resume-overview__jump-nav-link--active' : '' ),
                  href: item.href,
                  'aria-current': isActive ? 'true' : undefined,
                },
                item.label
              )
            );
          } )
        )
      )
    )
  );
}
```

- [ ] **Step 2: Add active jump-nav link CSS**

```css
.hdc-resume-overview__jump-nav-link--active {
  background: hsl(var(--interactive-nav-active-surface));
  border-color: hsl(var(--interactive-border-active));
  color: hsl(var(--interactive-nav-active-foreground));
  box-shadow: var(--shadow-surface-1);
}
```

- [ ] **Step 3: Validate and commit**

```bash
node -c blocks/resume-overview/view.js
git add blocks/resume-overview/view.js blocks/resume-overview/style.css
git commit -m "feat(resume-overview): add IntersectionObserver active state to jump nav (Gap #9)"
```

---

## Phase 6: Smoke test and verify

### Task 9: Run smoke tests and flush caches

- [ ] **Step 1: Flush caches**

```bash
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

- [ ] **Step 2: Run route smoke**

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route
```

Expected: all 11 routes PASS

- [ ] **Step 3: Run API smoke**

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:api
```

Expected: all endpoints PASS, `/resume` returns updated data

- [ ] **Step 4: Browser-verify the live page**

Navigate to `https://wp.hperkins.com/resume/` and verify:
- Cinematic hero with backdrop image and inverse-tone text
- Three action buttons: "ATS Resume", printer icon, "Contact"
- No "Impact at a Glance" section
- Capability Map cards show merged skill badges below divider
- Per-column surface decorations visible (customer=warm, technical=cool, operations=accent)
- Signature Work cards have cover images
- "Evidence:" label on project impact lines
- Experience sorted newest-first (Lakefront Digital at top)
- Jump nav highlights current section on scroll
- No standalone Skills section
- Dark mode toggle works correctly

- [ ] **Step 5: Final commit if any touch-ups needed**

```bash
git add -A
git commit -m "fix(resume-overview): post-verification polish"
```
