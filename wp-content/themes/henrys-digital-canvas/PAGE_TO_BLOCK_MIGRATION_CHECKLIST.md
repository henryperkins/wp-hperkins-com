# Henry's Digital Canvas Page-to-Block Migration Checklist

Last updated: 2026-03-08 (UTC)

## Purpose
Use this checklist whenever a source page changes in `/home/azureuser/henry-s-digital-canvas/src/pages/*` and the matching WordPress block or route wrapper must be brought back into parity.

## Source-Of-Truth Rules
- React page files in `/home/azureuser/henry-s-digital-canvas/src/pages/*` are the source of truth for route structure, copy, state behavior, and composition.
- Static WordPress routes own their block composition in page `post_content`, not in hardcoded theme templates.
- Wrapper templates in `templates/` should only mount header, footer, and `post-content`.
- Dynamic routes remain theme-template owned:
  - `page-work-detail.php`
  - `page-blog-detail.php`
- Shared shell behavior belongs to `blocks/site-shell/`, not to individual page blocks.

## Before You Edit
- Resolve the source page law in the React repo:
  - `npm run page-laws:resolve -- <route-or-source>`
- Read, in order:
  - `docs/page-laws/manifest.json`
  - `docs/page-laws/foundation.md`
  - the route law for the page
  - any referenced pattern laws
  - the source page under `src/pages/`
- Identify whether the change is:
  - block-only rendering/styling
  - data-contract/API shape
  - shared-shell behavior
  - static-route composition/default-block change

## Route Map
| Route | React source | WordPress owner | Primary files to update |
| --- | --- | --- | --- |
| `/` | `src/pages/Home.tsx` | `blocks/home-page/` | `render.php`, `view.js`, `style.css`, `block.json` |
| `/work` | `src/pages/Work.tsx` | `blocks/work-showcase/` | `render.php`, `view.js`, `style.css`, `block.json` |
| `/work/:repo` | `src/pages/WorkDetail.tsx` | `blocks/work-detail/` + `page-work-detail.php` | `render.php`, `view.js`, `style.css`, `block.json`, route template if needed |
| `/resume` | `src/pages/Resume.tsx` | `blocks/resume-overview/` | `render.php`, `view.js`, `style.css`, `block.json` |
| `/resume/ats` | `src/pages/ResumeAts.tsx` | `blocks/resume-ats/` | `render.php`, `view.js`, `style.css`, `block.json` |
| `/hobbies` | `src/pages/Hobbies.tsx` | `blocks/hobbies-moments/` | `render.php`, `view.js`, `style.css`, `block.json` |
| `/blog` | `src/pages/Blog.tsx` | `blocks/blog-index/` | `render.php`, `view.js`, `style.css`, `block.json` |
| `/blog/:slug` | `src/pages/BlogPost.tsx` | `blocks/blog-post/` + `page-blog-detail.php` | `render.php`, `view.js`, `style.css`, `block.json`, route template if needed |
| `/about` | `src/pages/About.tsx` | `blocks/about-timeline/` | `render.php`, `view.js`, `style.css`, `block.json` |
| `/contact` | `src/pages/Contact.tsx` | `blocks/contact-form/` | `render.php`, `view.js`, `style.css`, `block.json` |
| `404` | `src/pages/NotFound.tsx` | `blocks/not-found/` | `render.php`, `view.js`, `style.css`, `block.json` |
| Shared layout | `src/components/Layout.tsx` | `blocks/site-shell/` | `render.php`, `view.js`, `style.css`, `block.json`, shared utilities if needed |

## Static Route Ownership Checklist
Use this when the route still maps to the same block, but the page content/default mounted block changed.

- Confirm the wrapper template still uses `post-content`:
  - `templates/front-page.html`
  - `templates/page-about.html`
  - `templates/page-blog.html`
  - `templates/page-contact.html`
  - `templates/page-hobbies.html`
  - `templates/page-resume.html`
  - `templates/page-resume-ats.html`
  - `templates/page-ats.html`
  - `templates/page-work.html`
- If the mounted block name or default attributes changed for a static route, update:
  - `scripts/sync_page_sources.php`
- Re-apply the WordPress page content sync:
  - `npm run sync:pages`
- Reconfirm these options after syncing:
  - `show_on_front=page`
  - `page_on_front=<home page id>`
  - `page_for_posts=0`

## Block Update Checklist
- `render.php`
  - update server-side config passed into `data-config`
  - update fallback payload wiring when needed
  - keep root marker and accessibility scaffolding intact
- `view.js`
  - match React copy, state transitions, URL/query behavior, title updates, and empty/error/success states
  - keep internal route links aligned with WordPress permalinks
  - preserve source-vs-fallback messaging when the React page has it
- `style.css`
  - match source layout/states without bypassing theme tokens
  - preserve responsive and reduced-motion behavior
- `block.json`
  - update defaults only when the block inspector/default runtime contract changed
  - keep description/attribute names aligned with runtime behavior

## Data Contract Checklist
If the React page changed data shape, sources, or endpoint expectations, update these before block UI work:
- `inc/data-contracts.php`
- `inc/rest-api.php`
- any related data file under `data/`

Common contract-backed blocks:
- `home-page`
- `resume-overview`
- `resume-ats`
- `hobbies-moments`
- `blog-index`
- `blog-post`
- `contact-form`
- `work-detail`
- `work-showcase`
- `digital-canvas-feed`

## Shared Behavior Checklist
If the page change affects shared navigation, command search, theme toggle, or mobile menu behavior, update:
- `blocks/site-shell/render.php`
- `blocks/site-shell/view.js`
- `assets/js/hdc-shared-utils.js`

## Verification
Run from the theme directory unless noted otherwise.

### Syntax / File Checks
- `php -l <touched-php-file>`
- `node --check <touched-view-js-file>`
- `bash -n scripts/sync_page_sources.sh` if sync logic changed

### Content Sync Checks
- `npm run sync:pages` if any static-route mounted block/default changed
- `wp post get <page-id> --field=post_content`
- `wp option get show_on_front`
- `wp option get page_on_front`
- `wp option get page_for_posts`

### Route / Runtime Checks
- `npm run smoke:full`
- For targeted HTML verification, confirm the expected root marker exists:
  - `/` -> `data-hdc-home-root`
  - `/work/` -> `data-hdc-work-root`
  - `/resume/` -> `data-hdc-resume-overview-root`
  - `/resume/ats/` -> `data-hdc-resume-ats-root`
  - `/hobbies/` -> `data-hdc-hobbies-moments-root`
  - `/blog/` -> `data-hdc-blog-index-root`
  - `/about/` -> `data-hdc-about-timeline-root`
  - `/contact/` -> `data-hdc-contact-form-root`
  - `404` -> `data-hdc-not-found-root`

### Dynamic Route Checks
- `/work/{repo}` renders `data-hdc-work-detail-root`
- `/blog/{slug}` renders `data-hdc-blog-post-root`
- Missing slug/repo states preserve source behavior and do not introduce noisy console/runtime regressions

## Done Criteria
- React page and WordPress route match on:
  - copy
  - section structure
  - interactive behavior
  - loading/empty/error/success states
  - page title behavior
  - internal navigation/permalink behavior
- Static route page content and wrapper templates are not split into competing sources of truth.
- `npm run smoke:full` passes after the change.
