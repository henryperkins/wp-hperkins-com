# Batch Parity Runner — Codex CLI Agent

Run parity checks across all theme blocks sequentially and produce an aggregated gap report sorted by severity.

## Project Context

- **Theme dir**: `/home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas/`
- **React source root**: `/home/azureuser/henry-s-digital-canvas/src/`

## Block List (12 total)

| Block | Source TSX |
|-------|-----------|
| `home-page` | `Home.tsx` |
| `about-timeline` | `About.tsx` |
| `work-showcase` | `Work.tsx` |
| `work-detail` | `WorkDetail.tsx` |
| `resume-overview` | `Resume.tsx` |
| `resume-ats` | `ResumeAts.tsx` |
| `hobbies-moments` | `Hobbies.tsx` |
| `blog-index` | `Blog.tsx` |
| `blog-post` | `BlogPost.tsx` |
| `contact-form` | `Contact.tsx` |
| `not-found` | `NotFound.tsx` |
| `site-shell` | `App.tsx` + `components/layout/AppHeader.tsx` + `components/ThemeSwitcher.tsx` |

Skip `digital-canvas-feed` (widget block, no dedicated TSX page).

## Process

For each block in the list above:

1. Read the source TSX page, trace imported components
2. Read the block's `render.php`, `view.js`, `style.css`, `block.json`
3. Read shared React components the page uses
4. Compare across: layout, UI elements, interactive behavior, animations, data flow, extras
5. Produce a verdict (PARITY / MINOR_DRIFT / NEEDS_WORK) with gap counts

Work through blocks one at a time. For each, collect:
- **Verdict**: PARITY / MINOR_DRIFT / NEEDS_WORK
- **Missing features count** (by severity)
- **Minor drifts count**
- **Extra features count** (WP-only)
- **Top 3 gaps** by severity (brief description)

## Output

### Summary Table

```markdown
| Block | Verdict | Missing (H/M/L) | Drifts | Extras | Top Gap |
|-------|---------|------------------|--------|--------|---------|
| home-page | PARITY | 0/0/0 | 3 | 2 keep | -- |
| ... | ... | ... | ... | ... | ... |
```

### Counts

```
Blocks at PARITY: N
Blocks at MINOR_DRIFT: N
Blocks at NEEDS_WORK: N
```

### Blocks Needing Work (detail)

For each NEEDS_WORK block, list all missing features with severity and a one-line fix description.

### Recommended Fix Order

Order by: (1) page traffic importance, (2) gap count.

Priority order: home > work-showcase > site-shell > about > resume-overview > work-detail > blog-index > blog-post > resume-ats > hobbies > contact > not-found

### Save Report

Write the full report to:
```
<theme>/docs/parity-report-YYYY-MM-DD.md
```
