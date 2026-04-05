# Henry's Digital Canvas WordPress Migration

## What was migrated

- Semantic color tokens (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, status colors)
- Tailwind-compatible alias tokens from the source system (`--color-*`) for direct portability of existing token references
- Typography tokens and families (Playfair Display, Source Serif 4, JetBrains Mono)
- Radius, shadow, layer, focus, and motion contract variables
- Source motion keyframes/animation variables (`accordion-*`, `fade-in`, `slide-in`) and `container` utility class
- Utility classes used in the source design system:
  - `focus-ring`, `focus-ring-inverse`
  - `rounded-control`, `rounded-surface`, `rounded-emphasis`, `rounded-pill`
  - `shadow-surface`, `shadow-emphasis`, `shadow-cta-hero`
  - `touch-target`, `glass`, `noise`, `prose-custom`
  - `ember-surface`, `ember-surface-strong`
  - `hero-backdrop`, `hero-backdrop-overlay`, `footer-cinematic`, `footer-backdrop`, `footer-backdrop-overlay`
- Block theme global presets/styles in `theme.json`
- A block style variation: `styles/ember-dark.json`

## Theme structure

- `theme.json`: Gutenberg presets + global style defaults
- `assets/css/design-system.css`: migrated token system and utility classes
- `blocks/home-page/`: route-owned home page block (`henrys-digital-canvas/home-page`) for the hero, featured work, resume snapshot, and recent writing
- `blocks/digital-canvas-feed/`: custom React-powered Gutenberg block (`henrys-digital-canvas/digital-canvas-feed`)
- `blocks/work-showcase/`: custom React-powered Gutenberg block (`henrys-digital-canvas/work-showcase`)
- `blocks/site-shell/`: shared shell block (`henrys-digital-canvas/site-shell`) for sticky header, theme switcher, mobile nav, and command launcher
- `blocks/resume-overview/`: resume page block (`henrys-digital-canvas/resume-overview`) using `/wp-json/henrys-digital-canvas/v1/resume`
- `blocks/resume-ats/`: ATS resume block (`henrys-digital-canvas/resume-ats`) using `/wp-json/henrys-digital-canvas/v1/resume-ats`
- `blocks/hobbies-moments/`: hobbies timeline block (`henrys-digital-canvas/hobbies-moments`) using `/wp-json/henrys-digital-canvas/v1/moments`
- `blocks/blog-index/`: blog listing block (`henrys-digital-canvas/blog-index`) using `/wp-json/henrys-digital-canvas/v1/blog`
- `blocks/blog-post/`: blog detail block (`henrys-digital-canvas/blog-post`) using `/wp-json/henrys-digital-canvas/v1/blog/{slug}`
- `blocks/contact-form/`: contact page block (`henrys-digital-canvas/contact-form`) posting to `/api/contact` with REST fallback
- `blocks/work-detail/`: work detail block (`henrys-digital-canvas/work-detail`) using `/wp-json/henrys-digital-canvas/v1/work/{repo}`
- `blocks/about-timeline/`: about page block (`henrys-digital-canvas/about-timeline`) for profile narrative, values, and timeline
- `blocks/not-found/`: 404 block (`henrys-digital-canvas/not-found`) with path echo and recovery actions
- `parts/header.html`: child theme header template part that mounts `site-shell`
- `parts/footer.html`: child theme footer template part aligned with migrated visual shell
- `templates/front-page.html`: front-page wrapper that renders the Home page record via `post-content`
- `templates/home.html`: posts-index fallback wrapper; `/blog/` remains page-backed while `page_for_posts` stays unset
- `templates/index.html`: generic block template entrypoint that renders `post-content`
- `templates/page-*.html`: wrapper templates for migrated static routes (`about`, `blog`, `work`, `resume`, `resume-ats`, `ats`, `hobbies`, `contact`) so page records, not templates, own the block composition
- `templates/single.html`: native WordPress single-post template with migrated single-post styling
- `templates/404.html`: dedicated 404 template using the `not-found` block
- `page-work-detail.php`: dynamic route template for `/work/{repo}`
- `page-blog-detail.php`: dynamic route template for `/blog/{slug}`
- `scripts/sync_page_sources.sh`: repeatable WP-CLI migration that syncs static page `post_content`, unsets the native posts-page override, and removes stale Site Editor template overrides
- `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`: route-owner map and repeatable checklist for syncing React page changes into WordPress blocks
- `styles/ember-dark.json`: dark style variation for Site Editor
- `functions.php`: enqueues parent stylesheet, fonts, and migrated design system CSS in frontend + editor

## React block usage

- Insert block: `Digital Canvas Feed`
- Block name: `henrys-digital-canvas/digital-canvas-feed`
- Location: `widgets` category
- Configurable in inspector:
  - heading
  - show/hide blog posts and GitHub repositories
  - post/repo counts
  - GitHub username
  - optional custom posts endpoint
  - open links in new tab

The block is dynamic (`render.php`) and mounts a React frontend view (`view.js`) to fetch live data.

- Insert block: `Home Page`
- Block name: `henrys-digital-canvas/home-page`
- Purpose:
  - route-owned homepage hero and primary CTAs
  - selected work, recent writing, and resume snapshot surfaces
  - contract-backed home content wired for page parity

- Insert block: `Work Showcase`
- Block name: `henrys-digital-canvas/work-showcase`
- Location: `widgets` category
- Configurable in inspector:
  - heading + description
  - GitHub username
  - repository count
  - compare limit
  - include forks/archived toggles
  - open links in new tab

The block is dynamic (`render.php`) and mounts a React frontend view (`view.js`) with:
- live GitHub sync + local fallback states (`live`, `fallback-ratelimit`, `fallback-offline`, `fallback-error`)
- curated case-study detail merge from local JSON
- language filtering, grid/timeline views, and sorting (`stars`, `updated`)
- engineering signals panel (recent updates, active languages, 8-week activity sparkline)
- featured case studies, role-group sections, build timeline, and paginated repository library
- pending repositories panel for entries awaiting curated descriptions
- floating compare bar + compare side sheet with signals/topics/receipts/learning details

- Insert block: `Site Shell`
- Block name: `henrys-digital-canvas/site-shell`
- Purpose:
  - sticky site header + nav parity
  - theme switching (`light` / `dark` / `system`)
  - command launcher with `Ctrl+K` search across pages, posts, and projects

- Insert block: `Resume Overview`
- Block name: `henrys-digital-canvas/resume-overview`
- Purpose:
  - interactive resume sections mapped from theme data contracts
  - optional CTA link to ATS page

- Insert block: `Resume ATS`
- Block name: `henrys-digital-canvas/resume-ats`
- Purpose:
  - print-first ATS one-page layout
  - optional print button and link back to interactive resume

- Insert block: `Hobbies Moments`
- Block name: `henrys-digital-canvas/hobbies-moments`
- Purpose:
  - category/timeframe filters with URL query sync
  - grouped moment cards with expandable stories and optional media

- Insert block: `Blog Index`
- Block name: `henrys-digital-canvas/blog-index`
- Purpose:
  - featured post hero + post library view
  - search and tag filtering with empty-state handling
  - optional LinkedIn/contact CTA card

- Insert block: `Blog Post`
- Block name: `henrys-digital-canvas/blog-post`
- Purpose:
  - slug-driven article rendering from contract endpoint
  - reading progress indicator + scroll-to-top action
  - related-posts and not-found states

- Insert block: `Contact Form`
- Block name: `henrys-digital-canvas/contact-form`
- Purpose:
  - client-side validation parity (name/email/message)
  - submit lifecycle states (`idle`, `submitting`, `success`, `error`)
  - posts payload to `/api/contact` with fallback to REST contact contract

- Insert block: `Work Detail`
- Block name: `henrys-digital-canvas/work-detail`
- Purpose:
  - `/work/{repo}` detail parity with case-study sections
  - slug inference + optional slug override
  - not-found fallback for missing repos

- Insert block: `About Timeline`
- Block name: `henrys-digital-canvas/about-timeline`
- Purpose:
  - profile narrative section parity
  - values card section
  - chronological career/education timeline

- Insert block: `Not Found`
- Block name: `henrys-digital-canvas/not-found`
- Purpose:
  - 404 page with current path echo
  - recovery actions (home + history back)

## Usage notes

- The theme is a child of `twentytwentyfive`.
- Static route block composition belongs in the WordPress page records (`post_content`) for `home`, `work`, `resume`, `resume/ats`, `hobbies`, `blog`, `about`, and `contact`.
- Wrapper templates should only mount header/footer and `post-content`; rerun `npm run sync:pages` after changing which custom block powers one of those routes.
- `/blog/` is intentionally page-backed rather than using the native posts-page setting, so `page_for_posts` should remain unset.
- For image-backed cinematic surfaces, the assets live in `assets/images/`.
- Data contracts (Phase 3) are available at:
  - `GET /wp-json/henrys-digital-canvas/v1/resume`
  - `GET /wp-json/henrys-digital-canvas/v1/resume-ats`
  - `GET /wp-json/henrys-digital-canvas/v1/moments`
  - `GET /wp-json/henrys-digital-canvas/v1/blog`
  - `GET /wp-json/henrys-digital-canvas/v1/blog/{slug}`
  - `GET /wp-json/henrys-digital-canvas/v1/work`
  - `GET /wp-json/henrys-digital-canvas/v1/work/{repo}`
  - `POST /wp-json/henrys-digital-canvas/v1/contact`
  - `POST /api/contact` (legacy compatibility alias)
- If Site Editor changes seem ignored, check:
  - active style variation selection
  - user-level global style customizations overriding theme defaults
- Dark mode parity:
  - the migrated stylesheet now mirrors source dark-token overrides for status colors, language chips, overlays, shadows, and motion variables

## QA and cutover

- Page/block parity checklist: `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`
- Cutover runbook: `docs/CUTOVER_CHECKLIST.md`
- Repeatable smoke scripts:
  - `npm run sync:pages`
  - `./scripts/route_smoke.sh`
  - `./scripts/api_smoke.sh`
  - `./scripts/browser_smoke.sh`
  - `./scripts/full_smoke.sh`
  - `./scripts/stylebook_audit.sh` (fails if merged global styles still contain parent-token leakage)
  - `./scripts/token_sync_audit.sh ~/henry-s-digital-canvas/src/index.css` (fails if child theme tokens drift from source `index.css`)
  - `./scripts/utility_sync_audit.sh ~/henry-s-digital-canvas/src/index.css` (fails if shared utility/keyframe exports drift from source `index.css`)
  - `./scripts/smoke_cadence.sh`
  - `./scripts/smoke_history_tail.sh <count>`
  - `./scripts/smoke_cron.sh` (cron-compatible wrapper with log rotation)
- Scripts default to `https://wp.hperkins.com`; override with `BASE_URL` when needed:
  - `BASE_URL=https://example.com ./scripts/route_smoke.sh`
  - `BASE_URL=https://example.com ./scripts/full_smoke.sh`
- Node-based one-command runner:
  - `npm run smoke:full`
- Cadence logger runner:
  - `RUN_LABEL=post-deploy npm run smoke:cadence`
- Cadence history summary:
  - `npm run smoke:history`
- Cadence report template:
  - `ops/smoke-report-template.md`
- First-time setup for browser smoke:
  - `npm install`

### CI/CD integration (GitHub Actions)

A workflow is available at `.github/workflows/smoke-check.yml`:

- **Triggers**: manual dispatch, daily schedule (06:00 UTC), push to `main` (theme path changes)
- **Manual run with options**:
  - `base_url`: target site URL (default: `https://wp.hperkins.com`)
  - `run_label`: cadence label for the run
  - `skip_browser`: skip Playwright tests for faster feedback
- **Artifacts**: smoke logs are uploaded and retained for 30 days
- **Job summary**: pass/fail table with escalation instructions on failure
- **Escalation**: failed runs include steps to reproduce locally and link to rollback plan

### Server-side cron scheduling

For environments without CI/CD, use the cron wrapper directly:

```bash
# Daily at 06:00 UTC
0 6 * * * /path/to/henrys-digital-canvas/scripts/smoke_cron.sh

# Weekly on Monday at 06:00 UTC
0 6 * * 1 /path/to/henrys-digital-canvas/scripts/smoke_cron.sh
```

The cron script handles PATH setup for node/npm, auto-labels runs with the current date, and prunes cadence logs older than 90 days (configurable via `RETENTION_DAYS`).
