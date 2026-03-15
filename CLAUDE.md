# Henry's Digital Canvas — WordPress Site

## Project Overview

Personal technical portfolio site for Henry Perkins, migrated from a React SPA to a WordPress block theme. The site runs on **WordPress 7.0-beta** with **PHP 8.4** and **Gutenberg 22.x** (check `wp plugin get gutenberg --field=version`).

- **Live URL**: https://wp.hperkins.com
- **Theme**: `henrys-digital-canvas` — block theme, child of `twentytwentyfive`
- **Theme dir**: `wp-content/themes/henrys-digital-canvas/`

## Key Paths

| Path | Purpose |
|------|---------|
| `wp-content/themes/henrys-digital-canvas/` | Custom child theme (all active development) |
| `theme.json` (in theme dir) | Global settings/styles — uses WPDS-backed token values |
| `assets/css/design-system.css` | Token system + utility classes (WPDS semantic adapter) |
| `blocks/` | 13 custom Gutenberg blocks (`block.json` + `render.php` + `view.js`). Converted blocks have `src/` (JSX source) and `build/` (compiled output). |
| `templates/` | Block theme templates (`front-page.html`, `page-*.html`, `404.html`, etc.) |
| `parts/` | Template parts (`header.html`, `footer.html`) |
| `inc/data-contracts.php` | Data contract functions for REST endpoints |
| `inc/rest-api.php` | Custom REST API route registration |
| `functions.php` | Enqueues, block registration, rewrite rules, document titles |
| `scripts/` | Smoke tests, sync scripts, audits |
| `data/` | Static JSON data for data contracts |
| `styles/ember-dark.json` | Dark mode style variation |

## Custom Blocks

All blocks are registered via `register_block_type_from_metadata()` from `blocks/<name>/block.json`. Each block MUST be identical in design and function to its corresponding TSX page in the source React app.

**Source of truth**: `/home/azureuser/henry-s-digital-canvas/src/pages/`

| Block | Source TSX page |
|-------|-----------------|
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
| `digital-canvas-feed` | *(widget block, no dedicated page)* |
| `site-shell` | *(shared shell — maps to `App.tsx` layout/nav/theme switcher)* |

When modifying any block, always compare against the source TSX to maintain parity.

### Block Categories

- **createElement blocks** (11): Use `wp.element.createElement` — candidates for JSX conversion via wp-scripts
- **DOM-only blocks** (2): `site-shell` and `not-found` use pure DOM manipulation — stay as hand-written JS

Converted blocks use `*.asset.php` content hashes for cache-busting. Unconverted blocks use WordPress core's `filemtime()`.

## Source React App Reference

**Source root**: `/home/azureuser/henry-s-digital-canvas/src/`

### Template Part and Layout Mapping

| WP file | React source | Notes |
|---------|-------------|-------|
| `parts/header.html` | `components/Layout.tsx` + `components/layout/AppHeader.tsx` | Header part just mounts `site-shell` block, which reimplements AppHeader |
| `parts/footer.html` | `components/layout/AppFooter.tsx` | Static HTML in WP; React uses `SocialActions` + `InlineSeparated` components |
| `blocks/site-shell/` | `components/Layout.tsx` + `components/layout/AppHeader.tsx` + `components/ThemeSwitcher.tsx` + `components/CommandPalette.tsx` | Combines sticky header, nav, theme switcher, mobile sheet, and command palette |
| `page-work-detail.php` | React Router `<Route path="/work/:repo">` in `App.tsx` | Classic PHP template for dynamic `/work/{repo}` rewrite |
| `page-blog-detail.php` | React Router `<Route path="/blog/:slug">` in `App.tsx` | Classic PHP template for dynamic `/blog/{slug}` rewrite |
| `styles/ember-dark.json` | `components/theme-provider.tsx` + dark class in `index.css` | WP style variation = React's `next-themes` dark mode |

### Shared Component Mapping

| React component | WP equivalent | Used by |
|----------------|--------------|---------|
| `components/layout/AppHeader.tsx` | `blocks/site-shell/render.php` + `view.js` | All pages (via `parts/header.html`) |
| `components/layout/AppFooter.tsx` | `parts/footer.html` (static HTML) | All pages |
| `components/layout/nav-config.ts` | Nav items array in `site-shell/render.php` | Header nav |
| `components/layout/NavLinkPill.tsx` | Nav link markup in `site-shell/render.php` + active-state JS in `view.js` | Header nav |
| `components/ThemeSwitcher.tsx` | Theme toggle in `site-shell/render.php` + `view.js` | Header |
| `components/CommandPalette.tsx` | Command palette in `site-shell/view.js` | Header (Ctrl+K) |
| `components/ScrollToTop.tsx` | *(not ported — no SPA navigation)* | N/A in WP |
| `components/SiteContainer.tsx` | `.app-container` class in `design-system.css` | Layout wrapper |
| `components/PageHero.tsx` | Hero markup in each block's `render.php` + `style.css` | Home, About, etc. |
| `components/PageSection.tsx` | Section markup in each block's `render.php` | All page blocks |
| `components/PageHeader.tsx` | Header markup in each block's `render.php` | Most page blocks |
| `components/SocialActions.tsx` | Inline SVG links in `parts/footer.html` | Footer |
| `components/InlineSeparated.tsx` | `<span>` + separator spans in `parts/footer.html` | Footer meta line |
| `components/SocialLinkButton.tsx` | `<a>` + inline SVG in `parts/footer.html` | Footer social links |
| `components/Reveal.tsx` | CSS animations in `design-system.css` | Scroll reveal effects |
| `components/Sparkline.tsx` | Inline SVG in `work-showcase/view.js` | Work signals panel |
| `components/ui/*` (shadcn) | Reimplemented in block `style.css` + `view.js` | Various blocks |

### Data Source Mapping

| React data file | WP data file | Served via |
|----------------|-------------|-----------|
| `data/about-content.ts` | `data/about-content.json` | `inc/data-contracts.php` → `hdc_get_about_content_data_contract()` |
| `data/social-links.ts` | `data/social-links.json` | `inc/data-contracts.php` → footer + blocks |
| `data/resume.ts` | `data/resume.json` | REST `GET /resume` |
| `data/resume-ats.ts` | `data/resume-ats.json` | REST `GET /resume-ats` |
| `data/moments.ts` | `data/moments.json` | REST `GET /moments` |
| `data/blog-posts.ts` | `data/blog-posts-fallback.json` + WP posts | REST `GET /blog`, `GET /blog/{slug}` |
| `data/repos.ts` | `blocks/work-showcase/data/repos.json` | Block-local data + GitHub API |
| `data/repo-case-study-details.ts` | `blocks/work-showcase/data/repo-case-study-details.json` | Block-local data |
| *(home content in JSX)* | `data/home-content.json` | `inc/data-contracts.php` → `hdc_get_home_content_data_contract()` |
| *(contact content in JSX)* | `data/contact-content.json` | `inc/data-contracts.php` → `hdc_get_contact_content_data_contract()` |

### Template Structure

All page templates (`templates/front-page.html`, `templates/page-*.html`, `templates/index.html`, `templates/home.html`) share the same thin wrapper pattern:
```
header part → <main> → wp:post-content → </main> → footer part
```
This mirrors React's `Layout.tsx`: `<AppHeader> → <main>{children}</main> → <AppFooter>`

The only exception is `templates/404.html`, which directly mounts `henrys-digital-canvas/not-found` instead of `post-content` (since there's no page record for 404).

### React Hooks → WP Equivalents

React hooks are replaced by: GitHub API fetches in block `view.js` files (work-showcase, work-detail), REST endpoints in `view.js` (blog-index), `hdc_override_document_title()` in `functions.php` (page titles), and CSS media queries + `matchMedia` (mobile detection). See source `hooks/` dir for specifics.

## Custom REST API Endpoints

All under `/wp-json/henrys-digital-canvas/v1/`:

- `GET /resume`, `GET /resume-ats`, `GET /moments`
- `GET /blog`, `GET /blog/{slug}`
- `GET /work`, `GET /work/{repo}`
- `POST /contact`

## Dynamic Routes

- `/work/{repo}` — rewrite rule to `hdc_work_repo` query var, uses `page-work-detail.php`
- `/blog/{slug}` — rewrite rule to `hdc_blog_slug` query var, uses `page-blog-detail.php`

## Design Token Rules (WPDS)

- New CSS custom properties MUST use `--wpds-*` semantic naming
- Existing aliases (e.g. `--background`, `--primary`) are transitional adapters mapped FROM `--wpds-*` tokens
- `theme.json` presets reference WPDS-backed values
- See `WPDS_TARGET_STATEMENT.md` for the full mapping table and definition of done
- Dark mode tokens are in `design-system.css` under `[data-theme="dark"]`

## Smoke Tests

Run from the theme directory (`wp-content/themes/henrys-digital-canvas/`):

```bash
npm run smoke:full          # Route + API + browser (Playwright)
npm run smoke:route         # HTTP route checks only
npm run smoke:api           # REST API contract checks
npm run smoke:browser       # Playwright visual checks
npm run smoke:cadence       # Cadence logger run
npm run smoke:history       # Last 10 cadence entries
```

First-time browser smoke setup: `npm install` (installs Playwright).

Override target: `BASE_URL=https://example.com ./scripts/full_smoke.sh`

Additional audit scripts:
- `./scripts/stylebook_audit.sh` — checks for parent-token leakage in merged global styles
- `./scripts/token_sync_audit.sh ~/henry-s-digital-canvas/src/index.css` — detects token drift from source
- `./scripts/utility_sync_audit.sh ~/henry-s-digital-canvas/src/index.css` — detects utility/keyframe drift

## WP-CLI

Always use the path flag:

```bash
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com <command>
```

## Dev Setup

```bash
cd wp-content/themes/henrys-digital-canvas && npm install
```

Blocks use server-side rendering. Converted blocks (those with a `src/` directory) use `@wordpress/scripts` to compile JSX source to production JS:

```bash
cd wp-content/themes/henrys-digital-canvas && npm run build   # production build
cd wp-content/themes/henrys-digital-canvas && npm run start   # dev watcher
```

Unconverted blocks still use hand-written vanilla JS `view.js` files with no build step.
Build artifacts (`blocks/*/build/`) are committed to git — there is no CI/CD pipeline.

## Page Ownership Model

- Static route block composition lives in WordPress **page records** (`post_content`), not in templates
- Templates (`front-page.html`, `page-*.html`) are thin wrappers: header + `post-content` + footer
- `/blog/` is page-backed; `page_for_posts` is intentionally unset
- After changing which block powers a route, rerun: `npm run sync:pages`

## Migration Status

All 8 migration phases are `functional-migration-complete`. Parity remediation and WPDS foundation are `verified`. Full status in `MIGRATION_PROGRESS.md`.

## Active Plugins

ai, ai-provider-for-openai, cache-enabler, gutenberg, hdc-ai-media-modal, jetpack, mailpoet, mailpoet-premium, mcp-adapter, redis-cache, google-site-kit, wordpress-beta-tester

## MCP Servers

The WordPress MCP Adapter is configured in `.claude/settings.json` and exposes WP operations via the `mcp-adapter` plugin.

## Gotchas

- After adding/changing rewrite rules, flush with: `wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com rewrite flush`
- After theme/plugin changes, clear caches: `wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush` (object cache) + purge cache-enabler from admin
- `page-ats.html` and `page-resume-ats.html` both exist — `page-ats.html` may be a legacy duplicate
- Classic PHP templates (`page-work-detail.php`, `page-blog-detail.php`) bypass the block template system — they're the only non-`.html` templates
- Block `view.js` files are enqueued via `viewScript` in `block.json` — they only load on pages where the block appears

## Code Conventions

- PHP: WordPress coding standards (tabs, Yoda conditions, snake_case functions prefixed `hdc_`)
- All theme functions are prefixed `hdc_` to avoid collisions
- Blocks use `henrys-digital-canvas/<block-name>` namespace
- Sanitize all query vars and user input (see `sanitize_text_field`, `sanitize_title` usage in `functions.php`)
- Cache-busting via `hdc_asset_version()` which uses file `filemtime()`
