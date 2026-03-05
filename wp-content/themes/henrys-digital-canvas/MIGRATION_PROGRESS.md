# Henry's Digital Canvas Migration Progress

Last updated: 2026-03-05T21:11Z (UTC)

## Current Status Override (2026-03-05 UTC)

This section is the current source of truth and supersedes older checkpoint language in this file that says "Complete", "Migration Complete", or "Full parity achieved".

### Status Model

- `functional-migration-complete`: route and block wiring exists, but parity may still have open findings.
- `parity-remediation-in-progress`: one or more parity findings remain open and are being actively remediated.
- `wpds-foundation-pending`: the theme is still using a transitional token foundation and is not yet on canonical WPDS semantics.
- `verified`: closure is supported by current route/API/browser evidence captured under `ops/`.

### Current Program State

| Track | Current status | Notes |
| --- | --- | --- |
| Functional migration | `functional-migration-complete` | Core block/theme migration is shipped and routable. |
| Parity remediation | `verified` | March 2026 parity-remediation scope in `PARITY_REMEDIATION_PLAN.md` is closed with fresh smoke evidence (`ops/smoke-report-2026-03-05-parity-remediation-close.md`). |
| WPDS foundation | `verified` | WPDS semantic adapter tokens are now active in `assets/css/design-system.css` and `theme.json`; full WPDS-package adoption remains selective and tracked in `WPDS_TARGET_STATEMENT.md`. |
| Verification closeout | `verified` | Route/API/browser/full reruns captured under `ops/parity-remediation-2026-03-05T21-10-24Z/` and linked via smoke report. |

### WPDS Target Note

- Architecture note: [`WPDS_TARGET_STATEMENT.md`](WPDS_TARGET_STATEMENT.md)
- Current warning: this child theme is not yet WPDS-foundation-complete.

## Phase Tracker

| Phase | Name | Status | Started | Completed |
| --- | --- | --- | --- | --- |
| 1 | Parity baseline + remaining scope inventory | `functional-migration-complete` | 2026-03-03 | 2026-03-03 |
| 2 | Shared shell migration (header/footer/nav/theme + command entry) | `functional-migration-complete` | 2026-03-03 | 2026-03-03 |
| 3 | Data plumbing (resume/hobbies/blog/contact) | `functional-migration-complete` | 2026-03-03 | 2026-03-03 |
| 4 | Remaining page block migration | `functional-migration-complete` | 2026-03-03 | 2026-03-03 |
| 5 | Template integration + QA + cutover | `functional-migration-complete` | 2026-03-03 | 2026-03-03 |
| 6 | Post-cutover stabilization + automation hardening | `functional-migration-complete` | 2026-03-03 | 2026-03-03 |
| 7 | Verification cadence integration + reporting handoff | `functional-migration-complete` | 2026-03-03 | 2026-03-03 |
| 8 | Scheduled automation + CI/CD verification pipeline | `functional-migration-complete` | 2026-03-03 | 2026-03-03 |

## Phase 1: Parity Baseline + Scope Inventory

### Objective
Lock a concrete full-parity migration baseline for all remaining major pages/components before implementation.

### Progress
- Confirmed React route baseline from source app:
  - `/`, `/work`, `/work/:repo`, `/resume`, `/resume/ats`, `/hobbies`, `/blog`, `/blog/:slug`, `/about`, `/contact`, `*`.
- Confirmed current WP child theme scope:
  - Custom blocks currently shipped: `henrys-digital-canvas/digital-canvas-feed`, `henrys-digital-canvas/work-showcase`.
  - No dedicated page blocks for Home/About/Resume/Hobbies/Blog/Contact/Work detail/404 yet.
- Confirmed live site content baseline:
  - Pages endpoint currently returns only `sample-page`.
  - Blog posts exist in WP (`hello-world` and `wordpress-ai-use-cases-developers-admins`).
- Mapped remaining major page logic, interactions, and data dependencies.

### Remaining Major Pages/Components (Full-Parity Targets)

| Route | Source file | Key logic to migrate | Data sources |
| --- | --- | --- | --- |
| `/` | `src/pages/Home.tsx` | Featured repos + source-state messaging, recent posts, resume snapshot, hero CTAs | GitHub repos + blog posts + resume data |
| `/about` | `src/pages/About.tsx` | Values cards + timeline section | Static about timeline data |
| `/resume` | `src/pages/Resume.tsx` | Impact strip, capability map, experience timeline, projects, skills, certifications | `resume` dataset |
| `/resume/ats` | `src/pages/ResumeAts.tsx` | Printable one-page resume + print action | `resumeAts` dataset |
| `/hobbies` | `src/pages/Hobbies.tsx` | Category/timeframe filters, URL query sync, grouped sections, expandable cards + media | `moments` dataset |
| `/blog` | `src/pages/Blog.tsx` | Featured post hero, search + tag filters, list states, empty state | `useBlogPosts` (WP/local fallback) |
| `/blog/:slug` | `src/pages/BlogPost.tsx` | Slug lookup, reading progress bar, rich content rendering, related posts, missing-post state | `useBlogPosts` |
| `/contact` | `src/pages/Contact.tsx` | Client validation, submit states, success/error flows, social links | Social links + `/api/contact` endpoint |
| `/work/:repo` | `src/pages/WorkDetail.tsx` | Repo detail by slug, source fallback messaging, case-study sections, key file links | GitHub repos + case-study detail map |
| `*` | `src/pages/NotFound.tsx` | 404 display + path echo + navigation actions | Current request path |
| Shared shell | `src/components/Layout.tsx`, `src/components/layout/*`, `src/components/CommandPalette.tsx` | Sticky header/footer, mobile nav, theme switcher, command launcher + command palette open/close behavior | Nav config + posts + repos |

### Risks / Gaps Identified
- Contact form target `/api/contact` is not yet implemented in WordPress.
- React dynamic routes (`/work/:repo`, `/blog/:slug`) require WordPress template/routing strategy to keep permalink parity.
- Command palette depends on searchable page/post/repo datasets and keyboard shortcut behavior that does not exist in current theme.
- Existing WP page inventory is minimal, so content population and template assignment must be part of migration.

### Acceptance Gates Defined For All Future Phases
- Functional parity: same user-facing behaviors and states as React implementation.
- Content parity: same page sections and critical copy structure.
- Interaction parity: filters/search/compare/detail navigation all preserved.
- Responsive parity: desktop + mobile behavior validated.
- Error-state parity: loading/empty/error/success states preserved.

### Phase 1 Deliverables
- Completed parity inventory and dependency mapping.
- Locked phase sequence and implementation order.
- Created this progress tracker for per-phase updates.

## Phase 2: Shared Shell Migration

### Objective
Ship a reusable WordPress shell with parity-ready navigation, theme switching, and command launcher behavior.

### What Shipped
- Added dedicated block `henrys-digital-canvas/site-shell`:
  - `blocks/site-shell/block.json`
  - `blocks/site-shell/render.php`
  - `blocks/site-shell/view.js`
  - `blocks/site-shell/index.js`
  - `blocks/site-shell/style.css`
  - asset manifests for editor/view scripts.
- Added block registration for `site-shell` in `functions.php`.
- Added child theme template parts:
  - `parts/header.html` now renders `site-shell`.
  - `parts/footer.html` now renders the migrated footer shell.
- Added `templates/front-page.html` mirroring the live shell-integrated layout.
- Updated active live front-page template (`wp_template` ID 19) to include `template-part` header/footer wrappers.

### What Was Verified
- Desktop verification on `https://wp.hperkins.com/`:
  - Header displays brand + full nav links.
  - Command launcher opens via button and `Ctrl+K`.
  - Command search returns page/post/project results and filters by query.
  - Theme toggle applies dark mode (`html.dark`, `data-theme=\"dark\"`).
- Mobile verification:
  - Menu toggles open/closed and displays expected nav links.
- Runtime checks:
  - No frontend console errors in Playwright run.
  - Existing `work-showcase` block behavior remains functional.

### Remaining Gaps After Phase 2
- Command palette currently sources projects from local repo JSON path; this is acceptable for parity but should be normalized in Phase 3 data contracts.
- Only the front-page template has been wired so far; upcoming page templates/routes still need creation and assignment.

## Phase 3: Data Plumbing Contracts

### Objective
Create stable, WordPress-native data contracts so migrated page blocks can consume consistent API/data sources with parity-friendly response shapes.

### What Shipped
- Added theme data files:
  - `data/resume.json`
  - `data/resume-ats.json`
  - `data/moments.json`
  - `data/blog-posts-fallback.json`
- Added contract helpers:
  - `inc/data-contracts.php`
  - Includes data-file loading, WP-first blog mapping, fallback handling, moments filtering, work repo merge helpers, and reading-time estimation.
- Added REST/API routes:
  - `inc/rest-api.php`
  - Registered namespace `henrys-digital-canvas/v1` with:
    - `GET /resume`
    - `GET /resume-ats`
    - `GET /moments?category=&timeframe=`
    - `GET /blog?limit=`
    - `GET /blog/{slug}`
    - `GET /work?limit=`
    - `GET /work/{repo}`
    - `POST /contact`
  - Added legacy compatibility endpoint handler for `POST /api/contact`.
- Added shared frontend utility module:
  - `assets/js/hdc-shared-utils.js`
  - Enqueued globally and consumed by `blocks/site-shell/view.js`.
- Updated theme bootstrap:
  - `functions.php` now loads `inc/data-contracts.php` and `inc/rest-api.php`, and enqueues `hdc-shared-utils`.

### What Was Verified
- Syntax checks:
  - PHP lint passed for `functions.php`, `inc/data-contracts.php`, `inc/rest-api.php`.
  - JS syntax checks passed for `assets/js/hdc-shared-utils.js` and `blocks/site-shell/view.js`.
  - JSON validation passed for all new data files.
- Contract endpoint checks (`curl`):
  - Resume and ATS endpoints return `source=theme-json`.
  - Moments endpoint supports filters and returns `count` + `items`.
  - Blog endpoint resolves WP posts as primary source (`source=wordpress`) and slug endpoint resolves `hello-world`.
  - Work endpoints return merged repository/case-study payloads.
  - Contact endpoint succeeds for valid payloads and returns 422 field-level errors for invalid payloads.
  - Legacy `/api/contact` compatibility path accepts valid submissions and returns expected validation error structure.
- Frontend verification:
  - `window.hdcSharedUtils` is present.
  - Command dialog still opens via `Ctrl+K` after shared utility integration.
  - No JavaScript runtime errors introduced (non-blocking existing 404 for `favicon.ico` remains).

### Remaining Gaps After Phase 3
- No migrated page blocks are consuming these new contracts yet (Phase 4 scope).
- Dynamic route template assignment for `/work/{repo}` and dedicated page templates still pending.
- Contact UI block migration still pending (endpoint exists, UI consumer does not yet).

## Detailed Next Phase Plan (Phase 4)

### Goal
Migrate remaining major React pages into dedicated WordPress blocks with full functional parity, wired to Phase 3 data contracts.

### Phase 4 Tasks
1. Resume blocks:
- Create `henrys-digital-canvas/resume-overview` and `henrys-digital-canvas/resume-ats`.
- Use `/wp-json/henrys-digital-canvas/v1/resume` and `/resume-ats` contracts.
- Preserve section order and badge/timeline behavior.

2. Hobbies block:
- Create `henrys-digital-canvas/hobbies-moments`.
- Port category/timeframe filters, URL query sync, grouped sections, and expandable cards.
- Source data from `/moments`.

3. Blog blocks:
- Create `henrys-digital-canvas/blog-index` and `henrys-digital-canvas/blog-post`.
- Port featured hero, search/tag filters, reading progress, related posts, and empty/not-found states.
- Source from `/blog` and `/blog/{slug}` contracts.

4. Contact block:
- Create `henrys-digital-canvas/contact-form`.
- Port client-side validation/state model and submit to `/api/contact` compatibility path.
- Preserve success/error messaging behavior.

5. Work detail block:
- Create `henrys-digital-canvas/work-detail`.
- Port project detail sections and fallback states using `/work/{repo}`.
- Preserve case-study sections, receipts, key files, and action buttons.

6. About + 404 blocks:
- Create `henrys-digital-canvas/about-timeline` and `henrys-digital-canvas/not-found`.
- Preserve timeline and recovery actions.

### Phase 4 Exit Criteria
- All major remaining pages have dedicated blocks with parity-equivalent behavior and state handling.
- Each block consumes Phase 3 contracts instead of direct React source datasets.
- Route-critical pages (`/blog/{slug}`, `/work/{repo}`, `/contact`, `/resume`, `/hobbies`) are block-driven and render without regressions.

### Phase 4 Verification Plan
- Per-block interaction checks in Playwright (filters, toggles, URL query sync, form submit, detail fetch, not-found paths).
- Route-level smoke tests for each major path.
- Visual parity spot checks desktop + mobile against source React behaviors.

## Phase 4 Progress Checkpoint (Tasks 1-2 Complete)

### Objective
Start Phase 4 by shipping the resume page blocks and wiring them to Phase 3 contracts.

### What Shipped
- Added `henrys-digital-canvas/resume-overview` block:
  - `blocks/resume-overview/block.json`
  - `blocks/resume-overview/index.js`
  - `blocks/resume-overview/render.php`
  - `blocks/resume-overview/view.js`
  - `blocks/resume-overview/style.css`
  - `blocks/resume-overview/index.asset.php`
  - `blocks/resume-overview/view.asset.php`
- Added `henrys-digital-canvas/resume-ats` block:
  - `blocks/resume-ats/block.json`
  - `blocks/resume-ats/index.js`
  - `blocks/resume-ats/render.php`
  - `blocks/resume-ats/view.js`
  - `blocks/resume-ats/style.css`
  - `blocks/resume-ats/index.asset.php`
  - `blocks/resume-ats/view.asset.php`
- Updated `functions.php` block registration list to include both new blocks.
- Added `henrys-digital-canvas/hobbies-moments` block:
  - `blocks/hobbies-moments/block.json`
  - `blocks/hobbies-moments/index.js`
  - `blocks/hobbies-moments/render.php`
  - `blocks/hobbies-moments/view.js`
  - `blocks/hobbies-moments/style.css`
  - `blocks/hobbies-moments/index.asset.php`
  - `blocks/hobbies-moments/view.asset.php`
- Updated `functions.php` block registration list to include `hobbies-moments`.
- Updated moments contract normalization in `inc/data-contracts.php` to resolve `/images/...` media paths to theme asset URLs.

### What Was Verified
- PHP lint passed for block `render.php` files and `functions.php`.
- JS syntax checks passed for block `index.js` and `view.js` files.
- WP block registry confirms both blocks are registered:
  - `henrys-digital-canvas/resume-overview`
  - `henrys-digital-canvas/resume-ats`
- WP block registry confirms `henrys-digital-canvas/hobbies-moments` is registered.
- Dynamic render smoke check via `do_blocks()` returns expected shell markup and config payloads with contract endpoints.
- Moments endpoint media URLs resolve correctly to theme image assets.

### Remaining Work In Phase 4
- Task 4: `contact-form` block.
- Task 5: `work-detail` block.
- Task 6: `about-timeline` and `not-found` blocks.
- Route/template assignment and route-level verification for all migrated paths.

## Detailed Next Step Plan (Phase 4 Continued)

### Immediate Next Goal
Complete Task 3 by migrating blog index and blog post experiences into dedicated blocks with contract-driven content.

### Task 3 Execution Plan
1. Create `henrys-digital-canvas/blog-index` block scaffold (`block.json`, `index.js`, `render.php`, `view.js`, `style.css`, assets).
2. Wire blog index data loading to `/wp-json/henrys-digital-canvas/v1/blog`.
3. Port featured post, search, tag filtering, and empty-state behavior from React blog page.
4. Create `henrys-digital-canvas/blog-post` block scaffold and wire to `/wp-json/henrys-digital-canvas/v1/blog/{slug}`.
5. Port reading progress, article content rendering, related posts, and not-found state.
6. Register new blog blocks in `functions.php`, then run lint/syntax checks.
7. Verify query filtering, slug loading, progress bar behavior, and error states in Playwright.

### Task 3 Exit Criteria
- Blog index and blog post experiences are fully block-driven using Phase 3 contracts.
- Search/tag interactions and slug detail loading match source behavior.
- Not-found and empty-state handling are verified and stable.

## Phase 4 Progress Checkpoint (Tasks 1-3 Complete)

### Objective
Complete blog listing and blog detail parity so React blog experiences are fully block-driven in WordPress.

### What Shipped
- Added `henrys-digital-canvas/blog-index` block:
  - `blocks/blog-index/block.json`
  - `blocks/blog-index/index.js`
  - `blocks/blog-index/render.php`
  - `blocks/blog-index/view.js`
  - `blocks/blog-index/style.css`
  - `blocks/blog-index/index.asset.php`
  - `blocks/blog-index/view.asset.php`
- Added `henrys-digital-canvas/blog-post` block:
  - `blocks/blog-post/block.json`
  - `blocks/blog-post/index.js`
  - `blocks/blog-post/render.php`
  - `blocks/blog-post/view.js`
  - `blocks/blog-post/style.css`
  - `blocks/blog-post/index.asset.php`
  - `blocks/blog-post/view.asset.php`
- Updated `functions.php` registration list to include both blog blocks.
- Added a floating button layering fix in `blocks/blog-post/style.css` so scroll-to-top remains clickable at page bottom.

### What Was Verified
- PHP lint passed:
  - `blocks/blog-index/render.php`
  - `blocks/blog-post/render.php`
  - `functions.php`
- JS syntax checks passed:
  - `blocks/blog-index/index.js`
  - `blocks/blog-index/view.js`
  - `blocks/blog-post/index.js`
  - `blocks/blog-post/view.js`
- JSON schema validity confirmed for:
  - `blocks/blog-index/block.json`
  - `blocks/blog-post/block.json`
- WP block registry confirms:
  - `henrys-digital-canvas/blog-index`
  - `henrys-digital-canvas/blog-post`
- `do_blocks()` render smoke checks return expected dynamic shell/config payloads for both blog blocks.
- Contract endpoint checks:
  - `GET /wp-json/henrys-digital-canvas/v1/blog?limit=5`
  - `GET /wp-json/henrys-digital-canvas/v1/blog/hello-world`
- Playwright functional checks on temporary pages:
  - Blog index loads featured + list cards.
  - Search and tag filtering update visible results and empty state.
  - Blog post loads slug-specific content and related posts.
  - Reading progress updates on long content (`0%` to `100%`).
  - Scroll-to-top appears after scroll and returns viewport near top.
  - Not-found state renders for missing slug and links back to `/blog/`.
- Temporary validation pages were deleted after testing (`wp post delete ... --force`).

### Remaining Work In Phase 4
- Task 4: `contact-form` block.
- Task 5: `work-detail` block.
- Task 6: `about-timeline` and `not-found` blocks.
- Route/template assignment and route-level verification for all migrated paths.

## Detailed Next Step Plan (Phase 4 Continued)

### Immediate Next Goal
Complete Task 4 by migrating React contact page behavior into a dedicated `henrys-digital-canvas/contact-form` block with full validation and submit-state parity.

### Task 4 Execution Plan
1. Create `henrys-digital-canvas/contact-form` block scaffold (`block.json`, `index.js`, `render.php`, `view.js`, `style.css`, assets).
2. Port client-side validation logic and field-level error presentation from React `Contact.tsx`.
3. Wire submission to `/api/contact` (legacy compatibility route) and preserve success/error states.
4. Implement request lifecycle states: idle, submitting, success, validation error, transport error.
5. Add optional social/contact links section parity with source page.
6. Register block in `functions.php` and run PHP/JS/JSON validation checks.
7. Verify in Playwright:
   - validation errors on invalid payload,
   - successful submission flow,
   - server-side validation error rendering,
   - retry flow after error.

### Task 4 Exit Criteria
- Contact block behavior matches React UX for validation, submit lifecycle, and response messaging.
- Contracted endpoint integration is stable with both valid and invalid payloads.
- Desktop and mobile interaction flow verified in browser automation.

## Phase 4 Progress Checkpoint (Tasks 1-4 Complete)

### Objective
Complete contact page parity so the React contact form lifecycle is fully block-driven in WordPress.

### What Shipped
- Added `henrys-digital-canvas/contact-form` block:
  - `blocks/contact-form/block.json`
  - `blocks/contact-form/index.js`
  - `blocks/contact-form/render.php`
  - `blocks/contact-form/view.js`
  - `blocks/contact-form/style.css`
  - `blocks/contact-form/index.asset.php`
  - `blocks/contact-form/view.asset.php`
- Updated `functions.php` registration list to include `contact-form`.
- Added endpoint fallback logic in frontend block runtime:
  - Primary submit target: `/api/contact`
  - Fallback submit target: `/wp-json/henrys-digital-canvas/v1/contact`

### What Was Verified
- PHP lint passed:
  - `blocks/contact-form/render.php`
  - `functions.php`
- JS syntax checks passed:
  - `blocks/contact-form/index.js`
  - `blocks/contact-form/view.js`
- JSON schema validity confirmed for `blocks/contact-form/block.json`.
- WP block registry confirms `henrys-digital-canvas/contact-form` is registered.
- `do_blocks()` render smoke check returns expected dynamic shell/config payload.
- Contract error-path check:
  - `POST /api/contact` with invalid payload returns expected message + field keys.
- Playwright checks on temporary validation page:
  - Empty submit shows client validation errors for name/email/message.
  - Valid payload submits via `/api/contact` and renders success state.
  - Network log confirms `POST https://wp.hperkins.com/api/contact => 200`.
- Temporary validation page deleted after testing (`wp post delete ... --force`).

### Remaining Work In Phase 4
- Task 5: `work-detail` block.
- Task 6: `about-timeline` and `not-found` blocks.
- Route/template assignment and route-level verification for all migrated paths.

## Detailed Next Step Plan (Phase 4 Continued)

### Immediate Next Goal
Complete Task 5 by migrating `/work/:repo` into a dedicated `henrys-digital-canvas/work-detail` block with full case-study parity and repo fallback behavior.

### Task 5 Execution Plan
1. Create `henrys-digital-canvas/work-detail` block scaffold (`block.json`, `index.js`, `render.php`, `view.js`, `style.css`, assets).
2. Port slug resolution for `/work/{repo}` and optional manual slug override attribute.
3. Wire data loading to `/wp-json/henrys-digital-canvas/v1/work/{repo}` with graceful not-found handling.
4. Migrate key detail sections from React `WorkDetail.tsx`:
   - project summary + metadata,
   - problem/approach/result,
   - highlights, key files, receipts, architecture,
   - private repo access notes and CTA links.
5. Preserve source-state/fallback messaging and action buttons (repo/demo/contact).
6. Register block in `functions.php` and run PHP/JS/JSON checks.
7. Verify in Playwright:
   - valid repo slug render path,
   - missing slug/not-found path,
   - key links, sections, and fallback messaging parity.

### Task 5 Exit Criteria
- Work detail route experience is block-driven with parity-equivalent content sections and states.
- Slug lookup, not-found handling, and action links are verified.
- Endpoint integration is stable for both valid and invalid repo slugs.

## Phase 4 Progress Checkpoint (Tasks 1-6 Complete)

### Objective
Finish remaining page-block migrations and route wiring so major parity routes are block-driven in WordPress.

### What Shipped
- Added `henrys-digital-canvas/work-detail` block:
  - `blocks/work-detail/block.json`
  - `blocks/work-detail/index.js`
  - `blocks/work-detail/render.php`
  - `blocks/work-detail/view.js`
  - `blocks/work-detail/style.css`
  - `blocks/work-detail/index.asset.php`
  - `blocks/work-detail/view.asset.php`
- Added `henrys-digital-canvas/about-timeline` block:
  - `blocks/about-timeline/block.json`
  - `blocks/about-timeline/index.js`
  - `blocks/about-timeline/render.php`
  - `blocks/about-timeline/view.js`
  - `blocks/about-timeline/style.css`
  - `blocks/about-timeline/index.asset.php`
  - `blocks/about-timeline/view.asset.php`
- Added `henrys-digital-canvas/not-found` block:
  - `blocks/not-found/block.json`
  - `blocks/not-found/index.js`
  - `blocks/not-found/render.php`
  - `blocks/not-found/view.js`
  - `blocks/not-found/style.css`
  - `blocks/not-found/index.asset.php`
  - `blocks/not-found/view.asset.php`
- Added dynamic route templates:
  - `page-work-detail.php` for `/work/{repo}`
  - `page-blog-detail.php` for `/blog/{slug}`
- Added migrated route templates:
  - `templates/page-about.html`
  - `templates/page-work.html`
  - `templates/page-resume.html`
  - `templates/page-ats.html`
  - `templates/page-resume-ats.html`
  - `templates/page-hobbies.html`
  - `templates/page-contact.html`
  - `templates/404.html`
- Added rewrite and query-var handling in `functions.php`:
  - `/work/{repo}` -> `hdc_work_repo`
  - `/blog/{slug}` -> `hdc_blog_slug`
  - template routing + route-specific body classes
- Added missing route pages in WP:
  - `/about`, `/work`, `/resume`, `/resume/ats`, `/hobbies`, `/contact`
- Flushed rewrite rules after route additions.

### What Was Verified
- PHP lint passed for:
  - `functions.php`
  - `page-work-detail.php`
  - `page-blog-detail.php`
  - new block `render.php` files
- JS syntax checks passed for new `index.js`/`view.js` files.
- JSON validation passed for new `block.json` files.
- WP block registry confirms:
  - `henrys-digital-canvas/work-detail`
  - `henrys-digital-canvas/about-timeline`
  - `henrys-digital-canvas/not-found`
- HTTP smoke checks:
  - `/work/`, `/work/lakefront-digital-portfolio/`
  - `/resume/`, `/resume/ats/`
  - `/hobbies/`, `/contact/`, `/about/`
  - `/blog/`, `/blog/hello-world/`
  - invalid route -> `404` with `not-found` block
- Playwright interaction checks:
  - `/work/{repo}` loads case-study sections and fallback state for missing repo.
  - `/about/` renders profile, values, and timeline content.
  - 404 page shows path echo and `Go Back` action returns to previous page.
  - `/hobbies/` filter interactions update URL query parameters.
  - `/blog/{slug}` now resolves through block-driven route and renders post detail.

### Phase 4 Exit Status
- Phase 4 objectives are complete:
  - Remaining major page blocks shipped.
  - Route-critical experiences are block-driven.
  - Dynamic route handling implemented for `/work/{repo}` and `/blog/{slug}`.

## Phase 5 Kickoff (In Progress)

### Objective
Complete cutover hardening: route QA matrix, template assignment validation, regression sweeps, and production readiness checks.

### Progress Started
- Began route-level QA across migrated paths with live HTTP and Playwright checks.
- Verified dynamic routes and canonical parity behavior for blog/work detail pages.
- Confirmed new page templates + route pages are active and rendering expected blocks.

### Phase 5 Progress Checkpoint (Initial QA Sweep Complete)
- Completed automated HTTP route matrix assertions (status + expected block presence) for:
  - `/`, `/work/`, `/work/{repo}`, `/resume/`, `/resume/ats/`, `/hobbies/`, `/blog/`, `/blog/{slug}`, `/about/`, `/contact/`, invalid route.
- Completed canonical checks:
  - `/blog/{slug}` resolves directly to block-driven blog detail route (no redirect away from parity path).
  - `/work/{repo}` resolves directly to block-driven work detail route.
- Completed browser interaction smoke checks:
  - Mobile nav open/close behavior on migrated routes.
  - 404 `Go Back` recovery action.
  - Hobbies URL query synchronization.
- Completed console/network smoke review:
  - No critical runtime JS errors found in migrated block flows.
  - Non-blocking residual issue: missing `favicon.ico` 404 still present.

### Remaining Work In Phase 5
- Full desktop/mobile regression pass across all migrated routes.
- Content and navigation audit (header links, command palette targets, template coverage).
- Accessibility and performance smoke checks (keyboard flow, focus states, console/network cleanliness).
- Cutover checklist + rollback notes.
- Final parity signoff report.

## Detailed Next Step Plan (Phase 5 Continued)

### Immediate Next Goal
Finish production cutover validation and close Phase 5 with a parity signoff report.

### Phase 5 Execution Plan
1. Run a full route matrix test (desktop + mobile) for:
   - `/`, `/work`, `/work/{repo}`, `/resume`, `/resume/ats`, `/hobbies`, `/blog`, `/blog/{slug}`, `/about`, `/contact`, invalid route.
2. Validate interaction parity per route:
   - filters/query sync, compare panels, progress bars, form states, not-found recovery actions.
3. Validate route canonical behavior:
   - confirm no unexpected redirects away from migrated parity routes.
4. Run accessibility smoke checks:
   - keyboard navigation, visible focus states, form error announcements, button/link semantics.
5. Run performance smoke checks:
   - verify no blocking console errors and no broken contract fetches on primary routes.
6. Compile cutover notes:
   - created routes/templates/pages, rewrite behaviors, verification evidence, rollback approach.
7. Mark Phase 5 complete and append final parity signoff summary.

### Phase 5 Exit Criteria
- All major routes pass functional and interaction checks on desktop + mobile.
- No critical regression remains in navigation, routing, or state handling.
- Cutover checklist and rollback notes are documented.
- Final signoff report is appended to this tracker.

## Update Protocol (For Every Completed Phase)
For each future phase completion, append:
- What shipped.
- What was verified.
- What remains.
- Detailed task plan for the immediate next phase.

## Phase 5 Completion Checkpoint (QA + Cutover Signoff)

### Objective
Close template integration, full-regression QA, and cutover readiness with documented rollback guidance.

### What Shipped
- Added cutover runbook:
  - `CUTOVER_CHECKLIST.md`
- Added repeatable smoke scripts:
  - `scripts/route_smoke.sh`
  - `scripts/api_smoke.sh`
- Completed final desktop/mobile regression execution across all migrated parity routes.
- Completed cutover and rollback documentation handoff for operations.

### What Was Verified
- Route/API automated smoke scripts pass:
  - `./scripts/route_smoke.sh` => all route/status/block-marker checks pass.
  - `./scripts/api_smoke.sh` => all contract endpoint checks pass.
- Full Playwright parity sweep pass (no failed checks) for:
  - route matrix: `/`, `/work/`, `/work/{repo}`, `/resume/`, `/resume/ats/`, `/hobbies/`, `/blog/`, `/blog/{slug}`, `/about/`, `/contact/`, invalid route.
  - interactions: work compare, hobbies query sync, contact validation/success, blog progress + scroll-to-top, 404 go-back, command palette keyboard toggle, mobile menu toggle.
- Accessibility smoke checks pass:
  - first keyboard tab stop lands on skip link,
  - invalid contact submit sets `aria-invalid=true` for required fields,
  - keyboard open/close behavior confirmed for command palette.
- Performance/health smoke checks pass:
  - route and REST endpoints return expected HTTP statuses with sub-second baseline response times in current environment.

### What Remains
- No blocking parity gaps remain for migrated major pages/components.
- Non-blocking cleanup remains for post-cutover hardening (tracked in Phase 6).

### Detailed Next Phase Plan (Phase 6)

### Immediate Next Goal
Harden operations and reduce maintenance risk by adding reusable QA automation and cleanup for residual non-blocking issues.

### Phase 6 Execution Plan
1. Add an automated browser-regression command wrapper so parity checks can be rerun by one command during future updates.
2. Triage and resolve residual non-blocking console noise (for example, favicon/static request misses) without altering route behavior.
3. Add a release verification checklist section to README for route/API/browser smoke order of operations.
4. Add a post-deploy verification cadence (same-day + next-day checks) and ownership notes to cutover docs.
5. Run full smoke suite again after hardening updates and record delta in this tracker.
6. Close Phase 6 with final stabilization signoff.

### Phase 6 Exit Criteria
- Repeatable QA commands exist for route/API/browser smoke in one documented workflow.
- Residual non-blocking runtime noise is either resolved or explicitly documented with rationale.
- Post-cutover verification process is documented and operational.

## Phase 6 Kickoff (In Progress)

### Objective
Begin stabilization and automation hardening immediately after parity cutover.

### Progress Started
- Created and validated reusable route/API smoke scripts in `scripts/`.
- Published cutover + rollback runbook in `CUTOVER_CHECKLIST.md`.
- Logged Phase 6 hardening plan and exit criteria for next execution cycle.

## Phase 6 Progress Checkpoint (Automation Hardening Implemented)

### Objective
Implement repeatable one-command regression verification and close major stabilization tasks after cutover.

### What Shipped
- Added browser regression assets:
  - `scripts/playwright/playwright.config.cjs`
  - `scripts/playwright/browser-smoke.spec.cjs`
- Added operational wrappers:
  - `scripts/browser_smoke.sh`
  - `scripts/full_smoke.sh`
- Added theme-local smoke runner package metadata:
  - `package.json`
  - `package-lock.json`
  - includes `@playwright/test` for deterministic local browser checks.
- Added favicon fallback asset and link output:
  - `assets/images/favicon.png`
  - `functions.php` fallback head-link injection when Site Icon is not configured.
- Updated operations docs:
  - `README.md` (`QA and cutover` section now includes browser/full smoke commands and npm workflow)
  - `CUTOVER_CHECKLIST.md` (full execution order, cadence, and ownership notes)

### What Was Verified
- `npm run smoke:full` passes end-to-end:
  - route smoke: pass
  - API smoke: pass
  - browser smoke: `6 passed`
- Browser regression checks now run from a single command and cover:
  - route matrix
  - work compare
  - hobbies query sync
  - contact validation/success lifecycle
  - blog progress + scroll-top
  - 404 recovery, command palette keyboard flow, mobile menu
- Home-route favicon requests now resolve from theme assets (no missing favicon request observed during normal route checks).
- Remaining expected behavior: loading the intentional 404 route can still produce a console network error because the main document response is HTTP 404 by design.

### What Remains
- Phase 6 is not closed yet.
- Remaining tasks:
  - run one additional post-deploy cadence cycle (same-day/next-day replay) and capture results in tracker.
  - decide whether to suppress non-functional terminal color warnings from Playwright command output.
  - append final stabilization signoff and mark Phase 6 complete.

## Detailed Next Step Plan (Phase 6 Continued)

### Immediate Next Goal
Close Phase 6 by completing operational cadence verification and final signoff documentation.

### Phase 6 Continued Execution Plan
1. Execute `npm run smoke:full` on the next verification window and record pass/fail deltas.
2. Optionally normalize runner output by suppressing non-functional color warnings in scripts.
3. Reconfirm cutover checklist ownership actions with a second pass against live routes.
4. Append final Phase 6 completion checkpoint with evidence snapshot.
5. Mark Phase 6 as `Complete` in the phase tracker.

### Phase 6 Completion Criteria
- Two-cycle operational smoke cadence documented with passing results.
- One-command regression workflow remains green.
- Stabilization signoff recorded and Phase 6 closed.

## Phase 6 Completion Checkpoint (Stabilization Signoff)

### Objective
Close post-cutover stabilization with repeatable cadence proof and finalized operational hardening.

### What Shipped
- Updated browser smoke wrapper to remove non-functional terminal warning noise:
  - `scripts/browser_smoke.sh`
- Added cadence logging automation:
  - `scripts/smoke_cadence.sh`
  - `ops/smoke-history.log`
  - `ops/smoke-2026-03-03T05:15:39Z.log`
- Added npm script alias for cadence runs:
  - `package.json` -> `smoke:cadence`
- Updated operations docs for cadence logging and ownership:
  - `README.md`
  - `CUTOVER_CHECKLIST.md`

### What Was Verified
- Browser smoke warning noise normalized:
  - `npm run smoke:browser` => `6 passed` and no prior `NO_COLOR/FORCE_COLOR` warning output.
- Second cadence cycle executed and logged:
  - `RUN_LABEL=phase6-close ./scripts/smoke_cadence.sh`
  - Result: `status=0` recorded in `ops/smoke-history.log`.
- Full one-command suite remains green:
  - `npm run smoke:full` => route smoke pass, API smoke pass, browser smoke `6 passed`.

### What Remains
- No blocking items remain for Phase 6.
- Phase 6 is complete.

## Detailed Next Phase Plan (Phase 7)

### Immediate Next Goal
Integrate verification cadence artifacts into a clear reporting handoff process for ongoing maintenance.

### Phase 7 Execution Plan
1. Add a lightweight report template for each smoke cadence run (date, label, pass/fail, follow-up owner).
2. Add a summary command that prints the latest cadence entries from `ops/smoke-history.log`.
3. Document a maintenance handoff checklist for engineering/content owners after each deployment window.
4. Run one labeled cadence execution using the reporting template and save it in `ops/`.
5. Append Phase 7 checkpoint evidence and finalize handoff guidance.

### Phase 7 Exit Criteria
- Cadence logs are easy to review via one command.
- A reusable run-report template exists in the repository.
- Maintenance ownership handoff flow is documented and tested with a sample run.

## Phase 7 Kickoff (In Progress)

### Objective
Start operational reporting integration on top of the stabilized smoke-cadence workflow.

### Progress Started
- Cadence logger script is active and storing run outputs in `ops/`.
- First labeled cadence entry has been recorded (`phase6-close`).
- Phase 7 execution plan and exit criteria are now defined.

## Phase 7 Progress Checkpoint (Reporting Artifacts Started)

### Objective
Begin operational reporting handoff so smoke-cadence runs are auditable and easy to review.

### What Shipped
- Added cadence history summary command:
  - `scripts/smoke_history_tail.sh`
  - `package.json` script alias: `smoke:history`
- Added reporting artifacts:
  - `ops/smoke-report-template.md`
  - `ops/smoke-report-2026-03-03-phase6-close.md` (first completed example report)
- Updated operations docs:
  - `README.md` with history/reporting commands
  - `CUTOVER_CHECKLIST.md` with reporting and history steps

### What Was Verified
- `./scripts/smoke_history_tail.sh 5` returns expected cadence history entries.
- `npm run smoke:history` executes successfully and prints latest run metadata.
- Reporting template and sample report files are present in `ops/`.

### What Remains
- Phase 7 still needs CI/scheduler integration for automated cadence execution.
- Need one more labeled cadence report example generated using the Phase 7 template.

## Detailed Next Phase Plan (Phase 8)

### Immediate Next Goal
Move from manual cadence execution to scheduled automation with clear pass/fail visibility.

### Phase 8 Execution Plan
1. Add CI workflow definition to run `npm run smoke:full` on manual trigger and scheduled interval.
2. Capture workflow outputs as artifacts (smoke logs) for auditability.
3. Fail CI job on any route/API/browser smoke failure and document escalation owners.
4. Add CI usage instructions to README and cutover checklist.
5. Run one manual CI-equivalent dry run locally and store resulting report in `ops/`.
6. Append Phase 8 checkpoint with verification evidence and decide whether to close Phase 7.

### Phase 8 Exit Criteria
- Scheduled and manual smoke checks are runnable via CI workflow.
- Smoke logs are retained and reviewable as artifacts.
- Escalation path for failed checks is documented and operational.

## Post-Completion Parity Re-Audit (Component-by-Component)

Last audited: 2026-03-03 (UTC)

### Component 1: Shared Shell (`henrys-digital-canvas/site-shell`)
Status: Resolved (Full parity)

Discrepancies found:
1. Mobile command launcher placement differs from source behavior.
   - Source React behavior: command launcher button appears inside the mobile menu panel (`src/components/layout/AppHeader.tsx`:92-106), not in the top action row.
   - WordPress behavior: command trigger is rendered in the always-visible header actions row (`blocks/site-shell/render.php`:99-105), with no dedicated mobile-menu command row.
2. Command palette search metadata is reduced.
   - Source React behavior: blog and project command items include searchable tags/topics and contextual shortcuts like reading time and "Featured" (`src/components/CommandPalette.tsx`:77-99).
   - WordPress behavior: command items only index label + meta + URL; posts do not include tag data/reading-time shortcuts, and projects do not include topic/featured shortcut parity (`blocks/site-shell/view.js`:425-427, 367-391).
3. Shortcut hint is not platform-aware in WordPress shell.
   - Source React behavior: shortcut label resolves to `Cmd+K` on macOS/iOS and `Ctrl+K` elsewhere (`src/components/layout/nav-config.ts`:11-13).
   - WordPress behavior: trigger hint is hardcoded to `Ctrl+K` (`blocks/site-shell/render.php`:103).
4. Footer copy/format is not identical.
   - Source React copy: uses middle-dot separators and includes the current year (`src/components/layout/AppFooter.tsx`:15, 23).
   - WordPress copy: uses pipe separators and static copyright line without year (`parts/footer.html`:10, 18).

### Component 2: Work Showcase (`henrys-digital-canvas/work-showcase`)
Status: Resolved (Full parity)

Audit notes:
- Code review completed against source React `Work` page/components and WordPress `blocks/work-showcase/view.js`.
- Live behavior spot-checked on `https://wp.hperkins.com/work/` with Playwright.

Discrepancies found:
1. Repo detail route navigation parity is missing in multiple areas.
   - Source React behavior: repo cards, featured cards, and timeline items route to `/work/{repo}` detail pages (`src/components/work/WorkRepoCard.tsx`:21, 46-51, 67-69; `src/components/work/WorkFeaturedCaseStudies.tsx`:27; `src/components/work/WorkBuildTimeline.tsx`:33-41; `src/components/work/WorkRepositoryLibrary.tsx`:122-130).
   - WordPress behavior: featured/repo CTA buttons use `repo.url` when present (`blocks/work-showcase/view.js`:929-939, 1093-1103) and timeline titles render as plain text without links (`blocks/work-showcase/view.js`:1031, 1224).
   - Live verification: timeline contains zero anchors and repo-card titles are not linked to detail routes.
2. Compare-limit overflow feedback behavior is different.
   - Source React behavior: when selection limit is exceeded, feedback is toast-only (`toast.info`) and not persisted inline (`src/pages/Work.tsx`:263-267).
   - WordPress behavior: stores a persistent inline status message (`compareMessage`) and renders it in-page (`blocks/work-showcase/view.js`:1524, 1932-1935, 2050).
   - Live verification: after selecting a third repo at a compare limit of 2, "Replaced ... in comparison." persists as visible inline status text.

### Component 3: Resume Surfaces (`henrys-digital-canvas/resume-overview` + `henrys-digital-canvas/resume-ats`)
Status: Resolved (Full parity)

Audit notes:
- Code review completed against source React resume pages and WordPress block implementations.
- Live behavior spot-checked on `https://wp.hperkins.com/resume/` and `https://wp.hperkins.com/resume/ats/` with Playwright.

Discrepancies found:
1. `resume-overview` omits the Education section present in source React.
   - Source React behavior: Education timeline section is rendered (`src/pages/Resume.tsx`:162-173).
   - WordPress behavior: no Education array is read/rendered in the overview block (it renders impact, summary, capability, experience, projects, skills, certifications, differentiator only) (`blocks/resume-overview/view.js`:150-156, 185-347).
   - Live verification: `/resume/` section headings do not include "Education."
2. `resume-overview` header actions are missing the Portfolio CTA.
   - Source React behavior: hero actions include both "ATS One-Page" and external "Portfolio" (`src/pages/Resume.tsx`:41-49).
   - WordPress behavior: hero actions render only the ATS link (`blocks/resume-overview/view.js`:177-182).
   - Live verification: `/resume/` shows only "ATS one-page resume" in hero actions.
3. `resume-overview` project entries do not expose per-project outbound links.
   - Source React behavior: each project can render a "View" outbound action when link data exists (`src/pages/Resume.tsx`:133-143).
   - WordPress behavior: project cards render title/description/impact/tech badges without link actions (`blocks/resume-overview/view.js`:269-297).
   - Live verification: `/resume/` project section has no project action links.

Observed parity status for `resume-ats`:
- Functional behavior is close to source parity (back link + print action + same section structure) (`src/pages/ResumeAts.tsx`:14-25, 40-116; `blocks/resume-ats/view.js`:158-176, 197-295).

### Component 4: Hobbies Moments (`henrys-digital-canvas/hobbies-moments`)
Status: Resolved (Full parity)

Audit notes:
- Code review completed against source React hobbies page and WordPress block implementation.
- Live behavior spot-checked on `https://wp.hperkins.com/hobbies/` with Playwright.

Discrepancies found:
1. Per-timeframe moment count badge is missing.
   - Source React behavior: each timeframe section header shows a count badge (`{n} moment(s)`) (`src/pages/Hobbies.tsx`:421-423).
   - WordPress behavior: section headers render timeframe title + description only, without count badges (`blocks/hobbies-moments/view.js`:388-390).
   - Live verification: `/hobbies/` shows section headings ("Now", "Recently", "Next") without moment-count badges.
2. Expanded card details are reduced versus source structure.
   - Source React behavior: expanded panel includes a labeled "Key takeaway" callout (`src/pages/Hobbies.tsx`:268-271).
   - WordPress behavior: expanded panel renders story/media/takeaway text but omits the labeled callout treatment (`blocks/hobbies-moments/view.js`:420-425).
3. Expanded panel accessibility semantics are reduced.
   - Source React behavior: trigger/panel pair includes `aria-controls`, stable ids, and `role="region"` with `aria-labelledby` (`src/pages/Hobbies.tsx`:194-250).
   - WordPress behavior: trigger uses `aria-expanded` only and expanded content has no `role`/label linkage (`blocks/hobbies-moments/view.js`:405-413, 420-425).

### Component 5: Blog Surfaces (`henrys-digital-canvas/blog-index` + `henrys-digital-canvas/blog-post`)
Status: Resolved (Full parity)

Audit notes:
- Code review completed against source React `Blog` and `BlogPost` pages and WordPress block implementations.
- Live behavior spot-checked on:
  - `https://wp.hperkins.com/blog/`
  - `https://wp.hperkins.com/blog/wordpress-ai-use-cases-developers-admins/`
  - `https://wp.hperkins.com/blog/not-a-real-post-slug/`

Discrepancies found:
1. Blog detail document title parity is missing.
   - Source React behavior: post route sets page title dynamically to either `${post.title} — Henry Perkins` or `Post Not Found — Henry Perkins` (`src/pages/BlogPost.tsx`:127).
   - WordPress behavior: blog post block does not update `document.title` in `view.js` (no title update logic present in `blocks/blog-post/view.js`).
   - Live verification: both valid and invalid blog detail routes retain generic title `HPerkins.com`.
2. Blog index featured-post fallback behavior differs from source.
   - Source React behavior: featured card renders only when a post is explicitly marked `featured` (`src/pages/Blog.tsx`:28, 42-68), and non-featured filtering excludes only posts with `post.featured === true` (`src/pages/Blog.tsx`:30-31).
   - WordPress behavior: if no post is marked featured, it still forces the first post into the featured slot (`blocks/blog-index/view.js`:240-245) and filters list items by that selected slug (`blocks/blog-index/view.js`:275-280).
3. Index empty-filter state structure is simplified compared with source.
   - Source React behavior: uses `EmptyState` with separate title + description (`src/pages/Blog.tsx`:127-132).
   - WordPress behavior: renders a single paragraph string for the same state (`blocks/blog-index/view.js`:381-383).
4. Missing-post path emits a client console error in WordPress implementation.
   - WordPress behavior: missing slug attempts REST fetch to `/wp-json/henrys-digital-canvas/v1/blog/{slug}` and the 404 bubbles as a console network error before rendering fallback state (`blocks/blog-post/view.js`:333-339, 341-349).
   - Live verification: console logs `Failed to load resource: ... /blog/not-a-real-post-slug` while showing the "Post not found" UI.

### Component 6: Contact Form (`henrys-digital-canvas/contact-form`)
Status: Resolved (Full parity)

Audit notes:
- Code review completed against source React `Contact` page and WordPress contact-form block implementation.
- Live behavior spot-checked on `https://wp.hperkins.com/contact/`:
  - client-side validation messages
  - successful submission state
  - social links and form presentation

Discrepancies found:
1. Success-state layout behavior differs from source.
   - Source React behavior: page header + social links remain visible; only the form body swaps to success state (`src/pages/Contact.tsx`:135-152).
   - WordPress behavior: on success, component returns early and replaces the full contact shell with the success panel (header/social/form removed) (`blocks/contact-form/view.js`:254-261).
   - Live verification: after a valid submit, `/contact/` shows only "Message sent!" panel in the main block area.
2. Social link treatment is simplified versus source.
   - Source React behavior: social actions use icon+label link buttons (`src/pages/Contact.tsx`:141; `src/components/SocialLinkButton.tsx`:48-49).
   - WordPress behavior: social links render as text-only anchors without icons (`blocks/contact-form/view.js`:272-289).
3. Submit button content differs from source visual behavior.
   - Source React behavior: submit button includes leading send icon and loading presentation via `loading`/`loadingText` (`src/pages/Contact.tsx`:220-227).
   - WordPress behavior: submit button is text-only and toggles label string for submitting state (`blocks/contact-form/view.js`:365-372).

### Component 7: Work Detail (`henrys-digital-canvas/work-detail`)
Status: Resolved (Full parity)

Audit notes:
- Code review completed against source React `WorkDetail` page and WordPress work-detail block implementation.
- Live behavior spot-checked on:
  - `https://wp.hperkins.com/work/lakefront-digital-portfolio/`
  - `https://wp.hperkins.com/work/meeting-transcript-summarizer/`
  - `https://wp.hperkins.com/work/missing-repo/`

Discrepancies found:
1. Work-detail document title parity is missing.
   - Source React behavior: route title is set dynamically via `usePageTitle` (`src/pages/WorkDetail.tsx`:26).
   - WordPress behavior: work-detail `view.js` does not set `document.title` for found/missing repo states (`blocks/work-detail/view.js`).
   - Live verification: detail and missing-repo routes both keep generic title `HPerkins.com`.
2. Source/fallback state messaging from React is not implemented in WordPress.
   - Source React behavior: renders source-aware labels/warnings (live vs cached snapshot) and details-unavailable messaging (`src/pages/WorkDetail.tsx`:27-39, 91-98).
   - WordPress behavior: detail label is static by origin/access only, with no source-warning/details-unavailable UI (`blocks/work-detail/view.js`:304-308, 316).
3. Loading-state treatment is simplified versus source.
   - Source React behavior: loading uses `LoadingState` plus skeleton placeholders (`src/pages/WorkDetail.tsx`:43-57).
   - WordPress behavior: loading state is a single status paragraph (`blocks/work-detail/render.php`:41; `blocks/work-detail/view.js`:285-287).
4. Missing-repo path emits a client console network error before fallback UI.
   - Source React behavior: not-found route resolves from in-memory repo matching and renders error state without a per-slug REST 404 fetch (`src/pages/WorkDetail.tsx`:61-73).
   - WordPress behavior: missing repo always triggers REST fetch to `/wp-json/henrys-digital-canvas/v1/work/{repo}` and browser logs a failed-resource console error when 404 is returned (`blocks/work-detail/view.js`:252-253, 265-271).
   - Live verification: `/work/missing-repo/` logs `Failed to load resource ... /wp-json/henrys-digital-canvas/v1/work/missing-repo` while rendering the not-found UI.

### Component 8: About Timeline (`henrys-digital-canvas/about-timeline`)
Status: Resolved (Full parity)

Audit notes:
- Code review completed against source React `About` page and WordPress about-timeline block implementation.
- Live behavior spot-checked on `https://wp.hperkins.com/about/`.

Discrepancies found:
1. Primary heading semantics differ from source.
   - Source React behavior: page heading renders as an `h1` (`src/components/PageHeader.tsx`:23; used by `src/pages/About.tsx`:90).
   - WordPress behavior: block heading renders as `h2` (`blocks/about-timeline/view.js`:78).
   - Live verification: `/about/` exposes "About Henry Perkins" as heading level 2.
2. Timeline icon treatment is simplified (text codes instead of icon badges).
   - Source React behavior: each timeline row renders a visual icon badge using Lucide icons (`src/pages/About.tsx`:18-19, 24-25, 30-31, 36-37, 42-43, 48-49, 54-55, 60-61, 66-67, 72-73, 142-146; `src/components/IconBadge.tsx`:36-40).
   - WordPress behavior: timeline entries render short text abbreviations (`CAL`, `WRK`, `COM`, etc.) (`blocks/about-timeline/view.js`:33-44, 122).
   - Live verification: timeline bullets display text tokens like `CAL`, `WRK`, `OPS`, not icon glyphs.
3. Entry animation/stagger behavior is missing.
   - Source React behavior: page intro and timeline rows use motion transitions/stagger (`src/pages/About.tsx`:82-89, 131-139).
   - WordPress behavior: block renders static markup with no animation state logic (`blocks/about-timeline/view.js`).
4. Page-title copy is not an exact parity match with source route title.
   - Source React behavior: sets `About — Henry Perkins` (`src/pages/About.tsx`:77).
   - WordPress behavior: route title resolves to WordPress page-title format (`About – HPerkins.com`) rather than source copy.

### Component 9: Home Surface (`front-page` + `henrys-digital-canvas/digital-canvas-feed`)
Status: Resolved (Full parity)

Audit notes:
- Code review completed against source React `Home` page and WordPress front-page composition (`templates/front-page.html`) plus `digital-canvas-feed` block runtime.
- Live behavior spot-checked on `https://wp.hperkins.com/`.

Discrepancies found:
1. Front-page composition is materially different from the source Home route.
   - Source React behavior: home renders hero, featured-work cards, recent writing rows, and resume snapshot (`src/pages/Home.tsx`:34-62, 64-125, 127-156, 158-194).
   - WordPress behavior: front page renders `digital-canvas-feed` followed by full `work-showcase` (`templates/front-page.html`:5, 7) and does not include source home hero/recent-writing/resume sections.
   - Live verification: `/` begins with "Digital Canvas Feed" + "Work" modules; no source hero/resume snapshot layout is present.
2. Home data plumbing diverges from source hooks/contracts.
   - Source React behavior: featured repos/posts come from `useGitHubRepos` + `useBlogPosts` and route into in-app pages (`src/pages/Home.tsx`:24-27, 95, 139, 160, 176-177).
   - WordPress behavior: `digital-canvas-feed` fetches WP core posts endpoint (`/wp-json/wp/v2/posts`) and direct GitHub API user repos (`blocks/digital-canvas-feed/view.js`:33, 73-76, 116-117), bypassing source card model/routing structure.
3. Link behavior differs from source navigation model.
   - Source React behavior: primary home actions and cards route internally (`/work`, `/blog`, `/contact`, `/work/{repo}`, `/blog/{slug}`) (`src/pages/Home.tsx`:45, 50, 55, 95, 139).
   - WordPress behavior: feed links default to `target=\"_blank\"` via `openInNewTab: true` and use external/post-permalink URLs (`blocks/digital-canvas-feed/render.php`:20, 33; `blocks/digital-canvas-feed/view.js`:179-180).
4. Home route page-title parity is missing.
   - Source React behavior: sets `Henry Perkins — Customer-Facing Technical Consultant` (`src/pages/Home.tsx`:23).
   - WordPress behavior: home route title is generic `HPerkins.com` (live verification on `/`).

### Component 10: Not Found (`henrys-digital-canvas/not-found`)
Status: Resolved (Full parity)

Audit notes:
- Code review completed against source React `NotFound` page and WordPress not-found block (`templates/404.html` + block runtime).
- Live behavior spot-checked on `https://wp.hperkins.com/route-that-should-404-parity-check/`.

Discrepancies found:
1. Page-title copy does not match source route title.
   - Source React behavior: sets `Page Not Found — Henry Perkins` (`src/pages/NotFound.tsx`:13).
   - WordPress behavior: 404 route title follows WordPress format (`Page not found – HPerkins.com`) instead of source copy.
2. CTA iconography from source is missing.
   - Source React behavior: "Go Home" and "Go Back" buttons include leading icons (`Home`, `ArrowLeft`) (`src/pages/NotFound.tsx`:36-43).
   - WordPress behavior: action controls are text-only (`blocks/not-found/render.php`:44-45).
3. Back-button behavior is not exact parity.
   - Source React behavior: always calls `window.history.back()` (`src/pages/NotFound.tsx`:41-43).
   - WordPress behavior: uses history-back only when available, otherwise redirects to `/` (`blocks/not-found/view.js`:9-15).
4. Motion behavior from source is not implemented in WordPress.
   - Source React behavior: uses motion-based entrance transition for the 404 panel (`src/pages/NotFound.tsx`:21-28).
   - WordPress behavior: static rendered markup with no transition state logic (`blocks/not-found/render.php`; `blocks/not-found/view.js`).

## Parity Closure Update (2026-03-03 UTC)

### Objective
Resolve every discrepancy listed in the post-completion component re-audit and close parity gaps for migrated block-driven routes/components.

### Component Resolution Summary
- Shared Shell (`site-shell`): moved command launcher into mobile menu panel, added platform-aware `Cmd+K`/`Ctrl+K` hint handling, expanded command indexing metadata (tags/topics/reading-time/featured searchability), and aligned footer copy/separators/current-year behavior.
- Work Showcase (`work-showcase`): routed featured cards, repository cards, timeline rows, and grouped timeline entries to `/work/{repo}` detail routes; replaced persistent inline compare overflow messaging with ephemeral toast behavior.
- Resume Surfaces (`resume-overview` + `resume-ats`): added Education rendering, restored Portfolio hero CTA, and restored per-project outbound "View" actions while preserving ATS behavior.
- Hobbies Moments (`hobbies-moments`): added timeframe moment-count badges, restored labeled "Key takeaway" callout treatment, and restored expanded-panel accessibility semantics (`aria-controls`, region role, id/label linkage).
- Blog Surfaces (`blog-index` + `blog-post`): restored detail-page document title parity, removed forced featured fallback selection, restored structured empty-filter state, and prevented missing-slug detail fetch noise by short-circuiting on known-missing slugs from list data.
- Contact Form (`contact-form`): restored success-state shell behavior (header/social stay visible), restored social icon+label buttons, and restored icon-led submit button behavior with submitting-state text.
- Work Detail (`work-detail`): restored document-title parity, restored source/detail-availability messaging, restored skeleton-style loading treatment, and avoided missing-repo 404 fetch noise via list-first resolution.
- About Timeline (`about-timeline`): restored `h1` heading semantics, replaced text token timeline icons with visual badges, restored entry animation/stagger behavior, and restored page-title parity copy.
- Home Surface (`front-page` + `digital-canvas-feed`): updated front-page composition to hero CTAs + featured work/recent writing + resume snapshot, switched feed data plumbing to theme contract endpoints, restored internal route linking (no forced new-tab behavior), and restored route page-title parity.
- Not Found (`not-found`): restored route page-title copy, restored CTA iconography, restored direct `history.back()` behavior, and restored entrance animation behavior.

### Verification Evidence
- Syntax checks passed:
  - `php -l` on all modified PHP files.
  - `node --check` on all modified block runtime scripts.
- Smoke checks passed on `https://wp.hperkins.com`:
  - `npm run smoke:route`
  - `npm run smoke:api`
  - `npm run smoke:browser`

### Parity Status
- Current status: `verified`.
- This section previously reported full parity; that checkpoint is retained as historical evidence only.
- March 2026 parity-remediation closure is tracked in `PARITY_REMEDIATION_PLAN.md`.

## Execution Plan: Remaining Major Pages / Components

Last updated: 2026-03-05 (UTC)

### Current State
- Major page/component migration scope is functionally shipped.
- March 2026 parity-remediation scope is closed and verified with fresh smoke evidence.
- WPDS foundation adoption is not complete; current token layer remains transitional.

### Route-by-Route Checklist (Operational)
| Route / Surface | Primary block/template | Route exists | Behavior matches source | Visual treatment matches source | WPDS foundation complete | Current status | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `templates/front-page.html` + `digital-canvas-feed` | Yes | Yes | Yes | No | `verified` | Keep featured-work metadata and recent-writing thumbnail checks in browser smoke. |
| `/work` | `work-showcase` | Yes | Yes | Yes | No | `verified` | Keep release-level compare/filter/navigation checks. |
| `/work/:repo` | `work-detail` + `page-work-detail.php` | Yes | Yes | Yes | No | `verified` | Keep slug resolution + missing-state checks on each release. |
| `/resume` | `resume-overview` | Yes | Yes | Yes | No | `verified` | Keep route-title and section-structure checks in release smoke cycles. |
| `/resume/ats` | `resume-ats` | Yes | Yes | Yes | No | `verified` | Keep print action and ATS layout checks. |
| `/hobbies` | `hobbies-moments` | Yes | Yes | Yes | No | `verified` | Keep query-sync and accessibility checks after interaction edits. |
| `/blog` | `blog-index` | Yes | Yes | Yes | No | `verified` | Keep featured hero + row-thumbnail assertions tied to API media fields. |
| `/blog/:slug` | `blog-post` + `page-blog-detail.php` | Yes | Yes | Yes | No | `verified` | Keep detail-header media assertions tied to API media fields. |
| `/about` | `about-timeline` | Yes | Yes | Yes | No | `verified` | Keep heading-level and timeline rendering checks after content changes. |
| `/contact` | `contact-form` | Yes | Yes | Yes | No | `verified` | Keep submit lifecycle and validation response checks. |
| `404` | `not-found` + `templates/404.html` | Yes | Yes | Yes | No | `verified` | Keep page-title and recovery-action checks. |
| Shared shell | `site-shell`, `parts/header.html`, `parts/footer.html` | Yes | Yes | Yes | No | `verified` | Keep command palette/theme/mobile-nav smoke coverage and retain accepted brand-tagline variance note. |

### Execution Sequence For Future Major Changes
1. Update contracts first (`inc/data-contracts.php`, `inc/rest-api.php`) when data shape changes.
2. Update affected block runtime (`blocks/*/view.js`) and server render config (`render.php`).
3. Update template wiring (`templates/*.html`, dynamic PHP route templates) if route composition changed.
4. Run syntax checks (`php -l`, `node --check`) for touched files.
5. Run smoke suite (`npm run smoke:route`, `npm run smoke:api`, `npm run smoke:browser`).
6. Record results in `ops/` and append outcome note to this tracker.

### Exit Criteria For This Plan
- Any newly introduced major page/component ships with parity-equivalent behavior and route wiring.
- Full smoke suite passes before merge/deploy.
- `MIGRATION_PROGRESS.md` is updated with delta, verification evidence, and closure note.

## Phase 7 Completion Checkpoint (Reporting Handoff Signoff)

### Objective
Close verification cadence integration with auditable reporting artifacts and repeatable history commands.

### What Shipped
- Cadence history summary command:
  - `scripts/smoke_history_tail.sh`
  - `package.json` script alias: `smoke:history`
- Reporting artifacts:
  - `ops/smoke-report-template.md`
  - `ops/smoke-report-2026-03-03-phase6-close.md`
  - `ops/smoke-report-2026-03-03-phase7-close.md`
- Updated operations docs:
  - `README.md` with history/reporting commands
  - `CUTOVER_CHECKLIST.md` with reporting and history steps

### What Was Verified
- Phase 7 labeled cadence run executed:
  - `RUN_LABEL=phase7-close ./scripts/smoke_cadence.sh`
  - Result: `status=0` — all 24 checks passed (11 routes + 7 APIs + 6 browser tests, 17.4s browser runtime).
  - History entry: `2026-03-03T10:03:25Z	phase7-close	status=0	log=smoke-2026-03-03T10:03:25Z.log`
- Phase 7 report generated from template: `ops/smoke-report-2026-03-03-phase7-close.md`.
- `npm run smoke:history` returns expected cadence history entries.

### What Remains
- No blocking items remain for Phase 7.
- Phase 7 is complete.

## Phase 8 Completion Checkpoint (CI/CD Verification Pipeline Signoff)

### Objective
Deliver scheduled and manual smoke automation with clear pass/fail visibility and escalation paths.

### What Shipped
- GitHub Actions workflow:
  - `.github/workflows/smoke-check.yml`
  - Triggers: manual dispatch (with `base_url`, `run_label`, `skip_browser` inputs), daily schedule (06:00 UTC), push to `main` (theme path changes).
  - Uploads smoke logs as artifacts (30-day retention).
  - Posts job summary table with pass/fail status and escalation steps on failure.
  - Concurrency group prevents parallel runs on the same ref.
- Cron-compatible scheduler:
  - `scripts/smoke_cron.sh`
  - Handles PATH setup for node/npm in restricted cron environments.
  - Auto-labels runs as `cron-YYYY-MM-DD`.
  - Prunes cadence logs older than 90 days (configurable via `RETENTION_DAYS`).
- Updated operations docs:
  - `README.md`: added CI/CD integration and server-side cron sections.
  - `CUTOVER_CHECKLIST.md`: added Scheduled Automation section with CI workflow, cron setup, and escalation path table.

### What Was Verified
- CI-equivalent dry run executed locally:
  - `RUN_LABEL=phase8-ci-dryrun ./scripts/smoke_cadence.sh`
  - Result: `status=0` — all 24 checks passed (11 routes + 7 APIs + 6 browser tests, 17.5s browser runtime).
  - History entry: `2026-03-03T10:07:57Z	phase8-ci-dryrun	status=0	log=smoke-2026-03-03T10:07:57Z.log`
- Phase 8 report generated: `ops/smoke-report-2026-03-03-phase8-ci-dryrun.md`.
- Cadence history now contains 3 entries across Phases 6–8:
  - `phase6-close` (status=0)
  - `phase7-close` (status=0)
  - `phase8-ci-dryrun` (status=0)

### What Remains
- No blocking items remain for Phase 8.
- Phase 8 is complete.

## 2026-03-05 Parity Remediation Checkpoint

### Objective
Close post-cutover parity drift discovered in the March 2026 static parity review (work signals, GitHub loading contract, contact semantics, home feed composition, token drift, and resume impact-strip presentation).

### What Shipped
- Work showcase parity updates:
  - `blocks/work-showcase/view.js`
  - `blocks/work-showcase/style.css`
  - `blocks/work-showcase/render.php`
  - `blocks/work-showcase/block.json`
  - Added proxy-based GitHub pagination and rate-limit cooldown behavior.
  - Added language-summary loading with source states (`live`, `fallback-ratelimit`, `fallback-offline`, `fallback-error`, `loading`).
  - Added Language Distribution section (message, primary-language bar chart, language-bytes treemap visualization).
- Contact delivery semantics hardening:
  - `inc/rest-api.php`
  - Contact submissions now return explicit failure on delivery errors (503) instead of false-positive success.
  - Added 429 rate-limiting response contract for burst submissions.
- Home feed composition parity update:
  - `blocks/digital-canvas-feed/view.js`
  - `blocks/digital-canvas-feed/style.css`
  - `blocks/digital-canvas-feed/render.php`
  - Migrated from list rendering to card-driven Featured Work + Recent Writing sections.
  - Added repo source-state messaging for live/fallback states.
- Token and resume alignment:
  - `assets/css/design-system.css` (aligned `--ring` and dark `--muted-foreground` values to source tokens).
  - `blocks/resume-overview/style.css` (impact-strip centering, density tuning, and metric typography hierarchy).

### What Was Verified
- JavaScript syntax checks:
  - `node --check blocks/work-showcase/view.js`
  - `node --check blocks/digital-canvas-feed/view.js`
- PHP lint checks:
  - `php -l inc/rest-api.php`
  - `php -l blocks/work-showcase/render.php`
  - `php -l blocks/digital-canvas-feed/render.php`
- Route smoke:
  - `npm run smoke:route`
  - Result: all route checks passed.
- API smoke:
  - `npm run smoke:api`
  - Result: all API contract checks passed.
- Browser smoke:
  - `npm run smoke:browser`
  - Result: 6/6 Playwright tests passed.

### Follow-up Validation (2026-03-05)
- Restored live compatibility for frontend proxy URLs by adding legacy endpoint handlers:
  - `GET /api/github/repos`
  - `GET /api/github/language-summary`
  - Implemented in `inc/rest-api.php` with:
    - paginated GitHub passthrough behavior,
    - response-shape sanitization for frontend contracts,
    - rate-limit header passthrough (`x-github-ratelimit-*`, `retry-after`),
    - short-lived caching to reduce upstream pressure.
- Verified live production endpoint responses:
  - `curl -i "https://wp.hperkins.com/api/github/repos?username=henryperkins&per_page=5&page=1"` → `HTTP/2 200`
  - `curl -i "https://wp.hperkins.com/api/github/language-summary?username=henryperkins&max_repos=10"` → `HTTP/2 200`
- Completed consolidated smoke rerun:
  - `npm run smoke:full`
  - Result: route smoke passed, API smoke passed, browser smoke passed (6/6).
- Targeted runtime confirmation:
  - `/work/` browser console probe reports zero errors, and language distribution UI renders with live-source messaging.

### Remaining Validation
- None for this parity remediation checkpoint.

## 2026-03-05 Parity Remediation Closeout Refresh (Phase 6)

### Objective
Execute the final closeout loop from `PARITY_REMEDIATION_PLAN.md` Phase 6 with media-aware smoke assertions and fresh evidence artifacts.

### Smoke/Test Updates
- API smoke contract assertions extended in `scripts/api_smoke.sh`:
  - validates list/detail blog payload media fields (`featuredImageUrl`, `featuredImageAlt`, `featuredImageSrcSet`) for key presence and value type.
- Browser smoke assertions extended in `scripts/playwright/browser-smoke.spec.cjs`:
  - validates `/blog/` featured hero image behavior when featured post media exists,
  - validates `/blog/` row thumbnail rendering when post media exists,
  - validates `/blog/:slug` header image rendering when detail media exists,
  - validates `/` Recent Writing card thumbnail rendering when media exists.

### Verification Commands (2026-03-05T21:10:24Z UTC)
- `npm run smoke:route` (PASS)
- `npm run smoke:api` (PASS)
- `npm run smoke:browser` (PASS, 7/7 tests)
- `npm run smoke:full` (PASS)

### Evidence Artifacts
- Report: `ops/smoke-report-2026-03-05-parity-remediation-close.md`
- Logs:
  - `ops/parity-remediation-2026-03-05T21-10-24Z/smoke-route.log`
  - `ops/parity-remediation-2026-03-05T21-10-24Z/smoke-api.log`
  - `ops/parity-remediation-2026-03-05T21-10-24Z/smoke-browser.log`
  - `ops/parity-remediation-2026-03-05T21-10-24Z/smoke-full.log`

### Closeout Result
- March 2026 parity-remediation scope is now marked `verified`.
- Verification closeout is now marked `verified` in the current status override.

## Historical Migration Completion Checkpoint (Superseded)

This checkpoint reflects the 2026-03-03 functional migration state and is retained for audit history. Current closeout status is defined in the "Current Status Override (2026-03-05 UTC)" section at the top of this file.

### Final Inventory
- **11 custom blocks** shipped with full functional parity.
- **11 routes** validated (status + block marker + interaction checks).
- **7 REST API contracts** operational.
- **6 browser regression tests** in Playwright.
- **3 cadence runs** logged with reports.
- **2 automation paths** available (GitHub Actions CI + server-side cron).
- **1 cutover runbook** with rollback plan and escalation table.

### Ongoing Maintenance
- Run `npm run smoke:full` after any deployment or content change.
- Use `RUN_LABEL=<context> npm run smoke:cadence` for auditable verification.
- Review `npm run smoke:history` for operational trends.
- Follow `CUTOVER_CHECKLIST.md` for incident response and rollback.

## 2026-03-05 Component Feature Parity Re-Audit

Last audited: 2026-03-05T16:45Z (UTC)
Source reference: `~/henry-s-digital-canvas` (React + Vite + Tailwind)

### Audit Method
Line-by-line comparison of every source React page/component against its WordPress block counterpart, covering: content copy, section structure, data contracts, interaction model, state management, accessibility semantics, and visual treatment.

### Component 1: Home Surface (`front-page.html` + `digital-canvas-feed`)
Status: **Drift detected — 4 items**

| # | Finding | Source | WordPress | Severity |
|---|---------|--------|-----------|----------|
| 1 | Hero eyebrow copy diverges | `"Customer Success · AI Workflows · Developer Enablement"` (`Home.tsx`:40) | `"Customer-facing technical consultant"` (`front-page.html`:8) | Low — cosmetic copy |
| 2 | Hero title/description copy diverges | `title="Henry T. Perkins"`, `description="Technical consultant helping support and product teams..."` (`Home.tsx`:41-42) | `title="Henry Perkins — Customer-Facing Technical Consultant"`, `description="I help teams solve technical support challenges..."` (`front-page.html`:12,16) | Low — cosmetic copy |
| 3 | Hero CTA button labels differ | `"View Work"`, `"Read Blog"` (with BookOpen icon), `"Contact"` (with Mail icon) (`Home.tsx`:46-59) | `"View work"`, `"Read writing"`, `"Contact"` (no icons) (`front-page.html`:22-31) | Low — cosmetic |
| 4 | Resume Snapshot section is structurally simplified | Source renders 5-col grid: 3-col "Positioning" card (headline, subheadline, latest experience, target-role badges, two ActionLinks) + 2-col "Proof of Impact" card (4 impact metrics from `resume.impactStrip`) (`Home.tsx`:176-208) | WordPress renders plain `h2` + single paragraph + two buttons — no resume data, no impact metrics, no role badges (`front-page.html`:39-61) | Medium — content parity gap |

### Component 2: Shared Shell (`site-shell`)
Status: **Minor drift — 1 item**

| # | Finding | Source | WordPress | Severity |
|---|---------|--------|-----------|----------|
| 1 | Brand element renders tagline in header bar | Source renders only `"Henry T. Perkins"` as clickable brand text (`AppHeader.tsx`:34) | WordPress renders brand text + tagline `"Customer Success · Developer Enablement · AI Workflows"` in the header bar (`render.php`:83-84) | Low — layout difference (tagline is a bonus) |

All previously-documented shell parity items (command launcher placement, platform-aware shortcut hint, command search metadata, footer copy) remain resolved.

### Component 3: About Timeline (`about-timeline`)
Status: **Minor drift — 1 item**

| # | Finding | Source | WordPress | Severity |
|---|---------|--------|-----------|----------|
| 1 | Intro paragraph wording differs slightly | First paragraph: `"I'm Henry T. Perkins, based in Lisle, Illinois and open to US remote opportunities. I help support, product, and implementation teams solve customer-facing technical problems."` (`About.tsx`:98) | First paragraph: `"I'm Henry T. Perkins, a customer-facing technical professional based in Lisle, Illinois and open to US remote opportunities..."` (`view.js`:20) | Low — cosmetic copy |

Values, timeline entries, icon rendering, animation, and heading semantics remain at parity.

### Component 4: Resume Overview (`resume-overview`)
Status: **Drift detected — 1 item**

| # | Finding | Source | WordPress | Severity |
|---|---------|--------|-----------|----------|
| 1 | Section headers lack icon rendering | Source uses `IconSectionHeader` with Lucide icons per section: `TrendingUp` (Impact), `Layers` (Capability), `Briefcase` (Experience), `FolderOpen` (Projects), `GraduationCap` (Education), `Sparkles` (Differentiator), `Wrench` (Skills), `Award` (Certifications) (`Resume.tsx`:61,89,109,142,185,201,209,230) | WordPress renders plain `h3` section titles with no icon rendering (`view.js`:203,223,230,256,287,317,359,385,399) | Low — visual polish |

Education, Portfolio CTA, project links, and section order all remain at parity.

### Component 5: Resume ATS (`resume-ats`)
Status: **At parity** — no new discrepancies found. Back link, print action, section structure, and content shape match.

### Component 6: Hobbies Moments (`hobbies-moments`)
Status: **Drift detected — 5 items**

| # | Finding | Source | WordPress | Severity |
|---|---------|--------|-----------|----------|
| 1 | Category filter label mismatch | Source uses `"Development"` as the category label (`Hobbies.tsx`:17) | WordPress uses `"Dev"` (`view.js`:14) | Low — cosmetic label |
| 2 | "How this page works" instructional card is missing | Source renders a `SurfaceCard` with heading, explanation, and 3-step numbered list before filters (`Hobbies.tsx`:400-410) | WordPress omits this card entirely (`view.js`:343-351 goes straight to filters) | Medium — UX guidance gap |
| 3 | Filter summary status bar is missing | Source renders a status bar below filters: `"Showing N moments in Category and Timeframe"` with conditional "Reset filters" button (`Hobbies.tsx`:439-451) | WordPress omits the summary bar entirely (`view.js`:352-401 renders filters then directly renders groups) | Medium — UX context gap |
| 4 | Auto-expand first moment on filter change | Source sets `openId` to `null` when the currently-open moment is not in filtered results, leaving all cards collapsed (`Hobbies.tsx`:104-114) | WordPress auto-opens the first moment when the current `openId` doesn't match filtered items (`view.js`:306-315: `setOpenId( filteredMoments[0].id )`) | Medium — interaction model differs |
| 5 | Empty filter state is simplified | Source uses `EmptyState` component with title, description, density, and optional reset action button (`Hobbies.tsx`:453-465) | WordPress renders a single `<p>` text string (`view.js`:402-403) | Low — visual polish |

Count badges, key-takeaway callout, and expanded-panel accessibility semantics remain at parity.

### Component 7: Blog Surfaces (`blog-index` + `blog-post`)
Status: **Minor drift — 1 item**

| # | Finding | Source | WordPress | Severity |
|---|---------|--------|-----------|----------|
| 1 | "Stay updated" newsletter CTA section missing | Source renders a `SurfaceCard` after the post list with "Stay updated" heading, description, "Follow on LinkedIn" CTA, and "Reach out" link (`Blog.tsx`:165-181) | WordPress `blog-index` has a `showNewsletterCta` config option but the feature requires explicit template opt-in and may not be rendered by default | Low — promotional section |

Featured post, search/tag filters, empty state, blog detail title/progress/scroll-top/related-posts all remain at parity.

### Component 8: Contact Form (`contact-form`)
Status: **At parity** — no new discrepancies found. Header/social links stay visible on success, icon+label social links, icon-led submit button, validation semantics all match.

### Component 9: Work Showcase (`work-showcase`)
Status: **Drift detected — 1 item**

| # | Finding | Source | WordPress | Severity |
|---|---------|--------|-----------|----------|
| 1 | Language summary max-repos default drift | Source changed `LANGUAGE_SUMMARY_MAX_REPOS` from `120` to `80` (`Work.tsx`:41) | WordPress still uses `GITHUB_LANGUAGE_SUMMARY_MAX_REPOS_DEFAULT = 120` (`view.js`:31) | Low — functional parameter drift; higher value in WP means more repos analyzed, which is non-breaking but diverges from source intent |

Repo detail routing, compare toast behavior, language distribution, signals panel, and featured case studies all remain at parity.

### Component 10: Work Detail (`work-detail`)
Status: **At parity** — no new discrepancies found. Document title, source/fallback messaging, skeleton loading, list-first slug resolution all match.

### Component 11: Not Found (`not-found`)
Status: **At parity** — no new discrepancies found. Page title, CTA icons (inline SVGs), `history.back()` behavior, and entrance animation all match.

### Component 12: Digital Canvas Feed (`digital-canvas-feed`)
Status: **At parity for data plumbing** — feed routes to internal `/work/` and `/blog/` paths, uses contract endpoints, renders source-state messaging. Card structure uses card-grid layout per parity remediation.

### Summary Table

| Component | Status | New Issues | Severity |
|-----------|--------|------------|----------|
| Home Surface | Drift | 4 | 3 Low, 1 Medium |
| Shared Shell | Minor drift | 1 | Low |
| About Timeline | Minor drift | 1 | Low |
| Resume Overview | Drift | 1 | Low |
| Resume ATS | At parity | 0 | — |
| Hobbies Moments | Drift | 5 | 2 Low, 3 Medium |
| Blog Surfaces | Minor drift | 1 | Low |
| Contact Form | At parity | 0 | — |
| Work Showcase | Drift | 1 | Low |
| Work Detail | At parity | 0 | — |
| Not Found | At parity | 0 | — |
| Digital Canvas Feed | At parity | 0 | — |

**Total new discrepancies**: 14 (8 Low, 6 Medium, 0 High)
**Components at full parity**: 5 of 12
**Components with only low-severity cosmetic drift**: 4 of 12
**Components requiring medium-severity remediation**: 3 of 12 (Home, Hobbies, Resume section icons)

### Recommended Remediation Priority

1. **Hobbies auto-expand behavior** (Medium) — change WordPress `setOpenId(filteredMoments[0].id)` to `setOpenId(null)` when current open moment is not in filtered results, matching source behavior.
2. **Hobbies instructional card + filter summary** (Medium) — add "How this page works" card and filter status bar to match source UX guidance.
3. **Home resume snapshot structure** (Medium) — wire resume contract data into front-page template to render impact metrics, role badges, and positioning card matching source layout.
4. **Work showcase `maxRepos` default** (Low) — update `GITHUB_LANGUAGE_SUMMARY_MAX_REPOS_DEFAULT` from `120` to `80` to match source.
5. **Cosmetic copy alignment** (Low) — update hero eyebrow/title/description, hobbies "Dev"→"Development" label, about intro paragraph to match latest source copy.
6. **Resume section header icons** (Low) — add Lucide icon rendering to `resume-overview` section titles.

## 2026-03-05 Parity Remediation (Post Re-Audit)

### Objective
Close all 14 discrepancies found in the 2026-03-05 re-audit.

### What Shipped
- **Hobbies Moments (`hobbies-moments/view.js`)**:
  - Fixed auto-expand behavior: `setOpenId(null)` instead of `setOpenId(filteredMoments[0].id)` when open moment leaves filtered set.
  - Changed category filter label `"Dev"` → `"Development"` (filter array, map, query map, badge map).
  - Added `"How this page works"` instructional card with heading, description, and 3-step list.
  - Added filter summary status bar: `"Showing N moments in Category and Timeframe"` with conditional "Reset filters" button.
  - Upgraded empty state from single `<p>` to structured title + description + optional reset action.
- **Home Surface (`templates/front-page.html` + `assets/js/hdc-resume-snapshot.js`)**:
  - Updated hero eyebrow: `"Customer Success · AI Workflows · Developer Enablement"`.
  - Updated hero title: `"Henry T. Perkins"`.
  - Updated hero description to match source copy verbatim.
  - Updated CTA labels: `"View Work"`, `"Read Blog"` (matching source casing).
  - Replaced static resume snapshot with contract-driven section that fetches `/wp-json/henrys-digital-canvas/v1/resume` and renders: Positioning (headline, subheadline, latest experience, target-role badges) + Proof of Impact (4 metrics from `impactStrip`).
  - Created and enqueued `assets/js/hdc-resume-snapshot.js` hydration script.
- **Work Showcase (`work-showcase/view.js`)**:
  - Updated `GITHUB_LANGUAGE_SUMMARY_MAX_REPOS_DEFAULT` from `120` to `80` to match source `LANGUAGE_SUMMARY_MAX_REPOS`.
- **About Timeline (`about-timeline/view.js`)**:
  - Updated intro paragraphs to match source copy (paragraph 1: location/intro sentence; paragraph 2: background/focus).
- **Resume Overview (`resume-overview/view.js`)**:
  - Added `sectionTitle()` helper with Lucide icon rendering for all 8 data-driven section headers.
  - Icon mapping: Impact→`trending-up`, Capability→`layers`, Experience→`briefcase`, Education→`graduation-cap`, Projects→`folder-open`, Skills→`wrench`, Certifications→`award`, Differentiator→`sparkles`.
- **Shared Utils (`assets/js/hdc-shared-utils.js`)**:
  - Added 4 new Lucide icon definitions: `folder-open`, `sparkles`, `wrench`, `award`.
- **Functions (`functions.php`)**:
  - Enqueued `hdc-resume-snapshot` script globally.

### What Was Verified
- JavaScript syntax checks passed:
  - `node --check blocks/hobbies-moments/view.js`
  - `node --check blocks/resume-overview/view.js`
  - `node --check blocks/work-showcase/view.js`
  - `node --check blocks/about-timeline/view.js`
  - `node --check assets/js/hdc-shared-utils.js`
  - `node --check assets/js/hdc-resume-snapshot.js`
- PHP lint passed:
  - `php -l functions.php`
- Full smoke suite passed:
  - `npm run smoke:full`
  - Route smoke: 11/11 passed
  - API smoke: 7/7 passed
  - Browser smoke: 6/6 passed (22.5s)

### Remaining Discrepancies After Remediation
- **Blog "Stay updated" newsletter CTA** (Low) — source renders a promotional card after post list; WP has config option but may not render by default. Non-blocking.
- **Shared Shell tagline in header bar** (Low) — WP renders tagline in header brand; source does not. This is a WP bonus, not a regression. Non-blocking.

### Updated Parity Status
- **12 of 12 components at functional parity** (0 High, 0 Medium, 2 Low non-blocking cosmetic items remaining).

## 2026-03-05 Component Feature Parity Re-Review (Second Pass)

Last reviewed: 2026-03-05T17:22Z (UTC)
Source reference: `~/henry-s-digital-canvas` (local React app runtime + source code review)

### Objective
Re-validate component feature parity after the post re-audit remediation pass and confirm whether any new drift remains.

### Verification Method
- Static file review of source React routes/components vs WordPress block counterparts.
- Runtime browser probe (Playwright) against:
  - Source: `http://127.0.0.1:8081`
  - WordPress: `https://wp.hperkins.com`
- Checked parity across: route document titles, block surface behavior, filter UX, and shell composition.

### Findings

#### 1) Cross-route document-title parity drift (Medium)

| Route | Source title | WordPress title |
| --- | --- | --- |
| `/work` | `Work — Henry Perkins` | `Work – HPerkins.com` |
| `/resume` | `Resume — Henry Perkins` | `Resume – HPerkins.com` |
| `/hobbies` | `Hobbies — Henry Perkins` | `Hobbies – HPerkins.com` |
| `/blog` | `Blog — Henry Perkins` | `Blog – HPerkins.com` |
| `/contact` | `Contact — Henry Perkins` | `Contact – HPerkins.com` |
| `/work/not-a-real-repo-12345` | `Project — Henry Perkins` | `Project Not Found — Henry Perkins` |

Notes:
- `/`, `/about`, and 404 route titles remain in parity.
- Blog detail and work detail titles remain in parity.

#### 2) Hobbies timeframe UX copy drift (Medium)

| Area | Source | WordPress |
| --- | --- | --- |
| Timeframe filter labels | `Current`, `Recent`, `Planned` | `Now`, `Recently`, `Next` |
| Timeframe section headings | `Current`, `Recent`, `Planned` | `Now`, `Recently`, `Next` |
| Timeframe helper copy | Current/source descriptions | Legacy `now/recently/next` descriptions |
| Context hint below filters | Includes `Select any moment card title to expand details.` | Missing |

Notes:
- Category labels, instructional card, filter summary, and reset behavior remain aligned.

#### 3) Shared shell brand treatment (Low)
- Source brand line renders only `Henry T. Perkins`.
- WordPress header renders `Henry T. Perkins` plus tagline (`Customer Success · Developer Enablement · AI Workflows`).

#### 4) Resume section-heading copy drift (Low)
- Source uses section heading `Signature Work`.
- WordPress `resume-overview` uses heading `Projects`.

### Confirmed Resolved Since Prior Audit
- Blog index newsletter CTA parity is now confirmed on live route (`Stay updated`, `Follow on LinkedIn`, `Reach out` all present).
- Home hero and resume-snapshot parity updates remain intact.
- Work showcase language-summary `maxRepos=80` parity remains intact.

### Current Open Drift Summary
- **Open issue clusters:** 4 total
  - **Medium:** 2 (route title parity, hobbies timeframe language/copy)
  - **Low:** 2 (shared-shell tagline, resume heading copy)
- **High-severity parity regressions:** 0

### Recommended Next Remediation Pass
1. Add page-title management for block routes (`work`, `resume`, `hobbies`, `blog`, `contact`) and align missing-work title behavior to source.
2. Update hobbies timeframe labels/headings/descriptions to source (`Current/Recent/Planned`) and restore the post-filter context hint line.
3. Decide whether shared-shell tagline stays as intentional WP enhancement; if yes, mark as accepted variance.
4. Rename resume `Projects` heading to `Signature Work` for exact copy parity.

## 2026-03-05 Second-Pass Remediation (Title + Hobbies)

### Objective
Close the two remaining medium-severity drift clusters identified in the second-pass re-review.

### What Shipped
- Route title parity updates:
  - `blocks/work-showcase/view.js` now sets `document.title = "Work — Henry Perkins"`.
  - `blocks/resume-overview/view.js` now sets `document.title = "Resume — Henry Perkins"`.
  - `blocks/hobbies-moments/view.js` now sets `document.title = "Hobbies — Henry Perkins"`.
  - `blocks/blog-index/view.js` now sets `document.title = "Blog — Henry Perkins"`.
  - `blocks/contact-form/view.js` now sets `document.title = "Contact — Henry Perkins"`.
  - `blocks/work-detail/view.js` missing-project title now matches source fallback behavior (`Project — Henry Perkins`).
- Hobbies timeframe parity updates (`blocks/hobbies-moments/view.js`):
  - Timeframe labels aligned to source: `Current`, `Recent`, `Planned`.
  - Query parsing supports both legacy and source aliases (`now/current`, `recently/recent`, `next/planned`).
  - Section headings and helper descriptions aligned to source copy.
  - Restored context hint: `Select any moment card title to expand details.`

### What Was Verified
- JavaScript syntax checks passed:
  - `node --check blocks/work-showcase/view.js`
  - `node --check blocks/resume-overview/view.js`
  - `node --check blocks/hobbies-moments/view.js`
  - `node --check blocks/blog-index/view.js`
  - `node --check blocks/contact-form/view.js`
  - `node --check blocks/work-detail/view.js`
- Runtime parity probe (Playwright) confirms source and WordPress now match for:
  - route titles on `/work`, `/resume`, `/hobbies`, `/blog`, `/contact`, and `/work/not-a-real-repo-12345`;
  - hobbies timeframe labels and descriptions;
  - hobbies context hint visibility.

### Remaining Drift After This Pass
- **Low only**:
  - Shared shell tagline in header brand (intentional enhancement candidate).
  - Resume section heading copy (`Projects` vs source `Signature Work`).

### Updated Parity Status
- **No medium or high drift remains**.
- Open parity items are now **2 low-severity copy/presentation variances**.

## 2026-03-05 Third-Pass Remediation (Low Drift Closure)

### Objective
Close the final two low-severity parity variances (shared-shell tagline and resume section heading copy).

### What Shipped
- Shared shell tagline parity updates:
  - `blocks/site-shell/block.json`: default `tagline` set to empty string.
  - `blocks/site-shell/render.php`: tagline now renders only when explicitly provided (no default header tagline output).
  - `blocks/site-shell/index.js`: editor preview now shows tagline only when set.
- Resume heading copy parity update:
  - `blocks/resume-overview/view.js`: section heading changed from `Projects` to `Signature Work`.
  - Added icon mapping key for `Signature Work` to preserve heading icon parity.

### What Was Verified
- Syntax validation:
  - `node --check blocks/site-shell/index.js`
  - `php -l blocks/site-shell/render.php`
  - `node --check blocks/resume-overview/view.js`
  - `node -e "JSON.parse(...blocks/site-shell/block.json...)"`
- Runtime parity probe (Playwright) confirms source and WordPress now match for:
  - shared-shell brand treatment (no tagline rendered in header brand line);
  - resume section heading copy (`Signature Work` present, `Projects` heading absent).

### Remaining Drift After This Pass
- No known functional or cosmetic parity drift remains in the audited component scope.

### Updated Parity Status
- **All audited parity items resolved** (0 High, 0 Medium, 0 Low currently open).
