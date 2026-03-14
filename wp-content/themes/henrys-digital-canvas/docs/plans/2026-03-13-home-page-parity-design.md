# Home Page Block Parity Design

**Date**: 2026-03-13
**Block**: `home-page`
**Source**: `Home.tsx`
**Verdict**: NEEDS_WORK (1 high, 5 medium, 9 low)

## Extras Decision

- Keep: dynamic resume fetch, repoTitles map, configurable section labels, actionLinks array (5 items)
- Remove: hero eyebrow (not in React), orphaned resume-latest CSS, folder-open icon on secondary hero button
- Fix ambiguous: switch secondary hero button icon to `arrow-right`

## Phase 1: Dependencies (shared infrastructure)

| Item | Fix | File |
|------|-----|------|
| `quote` icon | Add Lucide `quote` SVG node data to `LUCIDE_ICON_NODES` | `assets/js/hdc-shared-utils.js` |
| `.screen-reader-text` | Add visually-hidden utility class with clip-rect pattern | `assets/css/design-system.css` |

## Phase 2: Data sync (JSON content)

All changes to `data/home-content.json`:

| Field | Current | Target (from React) |
|-------|---------|---------------------|
| `hero.eyebrow` | `"Technical consultant for customer-facing teams"` | `""` (empty string - React has no eyebrow) |
| `hero.title` | `"Henry T. Perkins"` | `"Retail floors. WordPress themes. Cloud platforms. Agentic AI."` |
| `hero.description` | `"I help support and product teams..."` | `"I've been learning to talk to machines since 2007 \u2014 now they're starting to talk back."` |
| `hero.primaryCtaLabel` | `"Work with me"` | `"Explore Prompt Forge"` |
| `hero.primaryCtaHref` | `"/contact/"` | `"/work/ai-prompt-pro/"` |
| `hero.secondaryCtaLabel` | `"View case studies"` | `"Work With Me"` |
| `hero.secondaryCtaHref` | `"/work/"` | `"/contact/"` |
| `resumeSnapshot.label` | `"Public projects"` | `"Public proof of work"` |
| `resumeSnapshot.items` | `["AI Prompt Pro", "Henry's Digital Canvas", "wp-hperkins-com"]` | `["Prompt Forge", "HPerkins.com", "wp-hperkins-com"]` |
| `resumeSnapshot.bestFitTitle` | `"Where I plug in fastest"` | `"Where I contribute fastest"` |
| `resumeSnapshot.focusAreas[0]` | `"Escalation triage, onboarding, and customer enablement"` | `"Customer-facing implementation, onboarding, and technical support flows"` |
| `resumeSnapshot.focusAreas[1]` | `"API integrations, debugging, and technical documentation"` | `"API integrations, debugging, and documentation that reduce support friction"` |
| `resumeSnapshot.focusAreas[2]` | `"AI workflow prototypes with safe handoff and support guardrails"` | `"AI workflow prototypes grounded in WordPress and durable web delivery"` |
| `contactCta.description` | `"I work best on customer-facing systems..."` | `"I help teams turn customer issues into shipped fixes \u2014 integrations, documentation, and AI-assisted triage \u2014 so delivery stays calm and outcomes are measurable."` |

Changes to `data/resume.json` (first 8 lines):

| Field | Current | Target (from `resume-facts.ts`) |
|-------|---------|----------------------------------|
| `headline` | `"Customer-Facing Technical Consultant & Community Builder"` | `"Technical Consultant: AI, WordPress, and Developer Enablement"` |
| `subheadline` | `"I blend technical support, developer enablement..."` | `"Where tech meets tenacity \u2014 and Java isn\u2019t just coffee."` |
| `targetRoles` | `["Customer Success Engineer", "Technical Support / Solutions", "Developer Community Enablement"]` | `["Solutions Engineer", "Developer Support / Enablement", "WordPress & AI Consultant"]` |

## Phase 3: Throughline section (HIGH)

Add the missing `#throughline` section between Selected Work and Resume Snapshot.

### Data (add to `home-content.json`)

```json
"throughline": {
  "title": "From the floor to the frontier.",
  "paragraphs": [
    "In 2007, I was coaching high school students in Chicago on how to tell a story clearly. By 2009, I was troubleshooting hardware on a retail floor at Micro Center. By 2012, I was managing a developer community at PageLines and supporting WordPress.com users at Automattic \u2014 the company behind WordPress itself.",
    "Then I ran coffee operations. Starbucks, Sodexo \u2014 high-volume, high-stakes, no-margin-for-error environments where the system either works at 6 AM or it doesn\u2019t. I learned more about process, escalation, and team coaching on those shifts than in any technical role I\u2019ve ever held.",
    "Now I build AI agents and intelligent workflows. I design prompt systems. I ship React apps on Cloudflare. And I consult for teams that need someone who can scope the project, write the code, document the process, and explain it to a stakeholder who doesn\u2019t care about the stack \u2014 they just need it to work.",
    "The tools have changed five times over. The instinct hasn\u2019t."
  ],
  "quote": {
    "text": "He\u2019s always there when his community needs him.",
    "attribution": "PageLines recommendation",
    "eyebrow": "A former colleague"
  }
}
```

### Markup (view.js)

Insert a new section between the Selected Work and Resume Snapshot sections:

```
<section class="hdc-home-page__section" id="throughline">
  <div class="hdc-reveal hdc-reveal--fade-in" style="--reveal-index: 0">
    <h2 class="hdc-home-page__section-title hdc-home-page__section-title--intro">
      {throughline.title}
    </h2>
  </div>
  <div class="hdc-home-page__throughline-grid">
    <div class="hdc-home-page__throughline-narrative">
      {paragraphs.map(p => <p class="hdc-home-page__throughline-paragraph">{p}</p>)}
    </div>
    <div class="hdc-reveal" style="--reveal-index: 1">
      <div class="hdc-home-page__throughline-quote-card">
        <div class="hdc-home-page__throughline-quote-header">
          {renderLucideIcon(h, 'quote', { size: 18 })}
          <span class="hdc-home-page__eyebrow">{quote.eyebrow}</span>
        </div>
        <blockquote class="hdc-home-page__throughline-blockquote">
          <p class="hdc-home-page__throughline-quote-text">"{quote.text}"</p>
          <footer class="hdc-home-page__throughline-quote-footer">{quote.attribution}</footer>
        </blockquote>
      </div>
    </div>
  </div>
</section>
```

### Config parsing

Add `throughline: ensureObject(parsed.throughline)` to `parseConfig()`.

### CSS (style.css)

```css
.hdc-home-page__section-title--intro {
  font-size: clamp(1.75rem, 3vw, 2.2rem);
  max-width: 24ch;
}

.hdc-home-page__throughline-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .hdc-home-page__throughline-grid {
    grid-template-columns: minmax(0, 1fr) 20rem;
  }
}

.hdc-home-page__throughline-narrative {
  display: grid;
  gap: 1.25rem;
}

.hdc-home-page__throughline-paragraph {
  color: hsl(var(--text-body));
  line-height: 1.7;
  margin: 0;
}

.hdc-home-page__throughline-quote-card {
  background: hsl(var(--surface-learning-paper, var(--surface-3)));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-surface);
  display: grid;
  gap: 1rem;
  height: fit-content;
  padding: 1.75rem;
}

.hdc-home-page__throughline-quote-header {
  align-items: center;
  color: hsl(var(--text-subtle));
  display: flex;
  gap: 0.75rem;
}

.hdc-home-page__throughline-blockquote {
  display: grid;
  gap: 1rem;
  margin: 0;
}

.hdc-home-page__throughline-quote-text {
  color: hsl(var(--text-accent));
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
}

.hdc-home-page__throughline-quote-footer {
  color: hsl(var(--text-subtle));
  font-size: 0.85rem;
  margin: 0;
}
```

## Phase 4: Code fixes (view.js)

| # | Fix | Location |
|---|-----|----------|
| 1 | Change `'Selected build'` to `'Curated project'` | `getHomeRepoBadge()` line ~183 |
| 2 | Change `'View build'` to `'View project'` | `getHomeRepoCtaLabel()` line ~188 |
| 3 | Change `renderLucideIcon(h, 'folder-open', ...)` to `renderLucideIcon(h, 'arrow-right', ...)` on secondary hero button | Line ~648 |
| 4 | Remove folder-open icon position (move arrow-right to after text, matching React pattern) | Lines ~648-649 |
| 5 | Fix InlineSeparated: replace `.join(' \u00b7 ')` with inline-flex dot separator spans | Line ~790 |

## Phase 5: Cleanup (style.css)

Remove orphaned CSS classes that are no longer rendered:
- `.hdc-home-page__resume-latest` (lines 405-408)
- `.hdc-home-page__resume-latest-title` (lines 410-414)
- `.hdc-home-page__resume-latest-meta` (lines 416-419)

## File Impact Summary

| File | Changes |
|------|---------|
| `data/home-content.json` | Hero, resume snapshot, contact CTA content + new throughline section |
| `data/resume.json` | headline, subheadline, targetRoles |
| `blocks/home-page/view.js` | Throughline section render, badge/CTA text, icon fix, InlineSeparated fix, parseConfig |
| `blocks/home-page/style.css` | Throughline CSS, remove orphaned resume-latest CSS |
| `assets/js/hdc-shared-utils.js` | Add `quote` icon |
| `assets/css/design-system.css` | Add `.screen-reader-text` utility |

Total: 6 files
