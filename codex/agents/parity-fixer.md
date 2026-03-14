# Parity Fixer — Codex CLI Agent

Run the full parity remediation workflow for a single block: check, triage, fix, verify.

## Project Context

This is a WordPress block theme (`henrys-digital-canvas`) migrated from a React SPA. Every block must match its source TSX page in structure, style, behavior, and content.

- **Theme dir**: `/home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas/`
- **React source root**: `/home/azureuser/henry-s-digital-canvas/src/`
- **Block dir pattern**: `<theme>/blocks/<block-name>/`
- **Source TSX pattern**: `<react-root>/pages/<PageName>.tsx`

## Block-to-TSX Mapping

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

## How To Run

The block name is provided in the user prompt. Look up its TSX source from the mapping above, then follow the pipeline below.

## Pipeline

### Step 1: Parity Check

Compare the block against its React source, following the full parity-checker process:

1. Read the source TSX page and trace ALL imported components, hooks, data files, and utilities
2. Read the block's `render.php`, `view.js`, `style.css`, and `block.json`
3. Read the React source for every shared component the page uses
4. Compare across all dimensions: layout, UI elements, interactive behavior, animations, data flow, extra features
5. Verify dependencies (icons in `hdc-shared-utils.js`, CSS tokens in `design-system.css`, REST fields in data contracts)
6. Produce a structured gap table with severity ratings

### Step 2: Evaluate Verdict

- **PARITY**: Report "Block is at parity" and stop.
- **MINOR_DRIFT**: Report drifts and ask user if they want to fix any. Stop if no.
- **NEEDS_WORK**: Continue to Step 3.

### Step 3: Review Working Tree

Before designing any fix, check for reusable patterns:

```bash
git status
git log --oneline -10
git diff --stat
```

Look for: animation/reveal systems, shared CSS patterns, utility functions added in sibling blocks, REST API or data contract changes, shared infrastructure changes (`hdc-shared-utils.js`, `design-system.css`).

### Step 4: Triage

**Fast-path** (direct implementation) when ALL true:
- No high-severity gaps
- Total gaps <= 12
- Changes touch <= 4 files

**Full plan** (design doc first) when ANY true:
- Any high-severity gap
- Total gaps > 12
- Changes touch > 4 files or require structural refactoring

#### Fast-path flow
1. Present gap list grouped by severity
2. For WP-only extras labeled "keep", default to keeping. Only ask about "ambiguous" or "remove" extras.
3. Get user approval, then implement.

#### Full plan flow
1. Present gap list, ask about ambiguous extras
2. Write design doc to `docs/plans/YYYY-MM-DD-<block-name>-parity-design.md`
3. Present implementation phases and ask user to approve
4. Implement phase by phase

### Step 5: Implement Fixes

For each fix (grouped by severity, medium first, then low):

1. **Verify shared dependencies exist** — icon names in `hdc-shared-utils.js`, CSS classes in `design-system.css`, REST fields in data contracts. Add any missing dependencies first.
2. **Make the edit** — match the React source exactly (check character-level: em dashes, curly quotes, Unicode).
3. **After all fixes**, validate syntax and run smoke tests:

```bash
# Validate JS syntax
node -c <theme>/blocks/<block>/view.js

# Validate JSON files
node -e "JSON.parse(require('fs').readFileSync('<file>','utf8'))"

# Run smoke tests
cd <theme> && npm run smoke:route && npm run smoke:api

# Flush caches
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache-enabler clear
```

### Step 6: Verify

1. Run `npm run smoke:route` and `npm run smoke:api` from the theme dir
2. Flush all caches (object cache + cache-enabler)
3. Verify the live page with curl:

```bash
# Check the page renders with expected content
curl -s https://wp.hperkins.com/<route>/ | grep -c '<expected-element>'
```

4. If the block's `render.php` passes data via `data-config`, verify the attribute includes new keys:

```bash
curl -s https://wp.hperkins.com/<route>/ | grep -oP 'hdc-<block>[^>]*data-config="\K[^"]*' | python3 -c "
import sys, html, json
d = json.loads(html.unescape(sys.stdin.read().strip()))
print(json.dumps(list(d.keys()), indent=2))
"
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `blocks/<name>/block.json` | Block metadata |
| `blocks/<name>/render.php` | Server-side render, passes data-config |
| `blocks/<name>/view.js` | Client-side JS (wp.element, vanilla JS) |
| `blocks/<name>/style.css` | Block styles |
| `data/home-content.json` | Home page data contract |
| `data/resume.json` | Resume data |
| `inc/data-contracts.php` | PHP data contract functions |
| `inc/rest-api.php` | REST API route registration |
| `assets/js/hdc-shared-utils.js` | Shared Lucide icons + utilities |
| `assets/css/design-system.css` | Token system + utility classes |

## Conventions

- PHP: WordPress coding standards (tabs, Yoda conditions, `hdc_` prefix)
- JS: `view.js` uses `wp.element.createElement` (aliased as `h`), no JSX
- CSS: BEM-style `.hdc-<block>__<element>--<modifier>` classes
- All theme functions prefixed `hdc_`
- Blocks use `henrys-digital-canvas/<block-name>` namespace
- Cache-bust via `hdc_asset_version()` which uses `filemtime()`
