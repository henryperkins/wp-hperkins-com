# Parity Report -- 2026-03-17

Full batch parity check of the `henrys-digital-canvas` WordPress block theme against the React SPA source at `/home/azureuser/henry-s-digital-canvas/src/pages/`.

---

## Summary Table

| Block | Verdict | Missing | Drifts | Extras | Top Gap |
|-------|---------|---------|--------|--------|---------|
| home-page | PARITY | 0 | 2 | 1 | Source-badge variant for "GitHub snapshot" not shown on repo cards |
| about-timeline | PARITY | 0 | 1 | 0 | SurfaceCard `learningPaper` background texture on intro section uses generic `ember-surface` |
| work-showcase | MINOR_DRIFT | 2 | 3 | 0 | WorkBuildTimeline shipped-timeline section not rendered |
| work-detail | MINOR_DRIFT | 3 | 2 | 0 | Participation sparkline (12-week commit chart) not rendered |
| resume-overview | MINOR_DRIFT | 1 | 2 | 0 | Hero visual backdrop image not applied to cinematic hero |
| resume-ats | PARITY | 0 | 1 | 0 | Download PDF button uses different icon (missing Download lucide icon) |
| hobbies-moments | NEEDS_WORK | 5 | 3 | 0 | Cinematic hero with backdrop image missing; section-level backgrounds missing |
| blog-index | MINOR_DRIFT | 2 | 2 | 0 | BlogShareActions panel (copy link + LinkedIn/email share) missing from CTA section |
| blog-post | MINOR_DRIFT | 2 | 3 | 0 | BlogCommentsSection not rendered |
| contact-form | PARITY | 0 | 1 | 1 | Minor label drift on turnstile unavailable message |
| not-found | PARITY | 0 | 1 | 0 | Missing "View Work" third button (React has 3 buttons, WP has 2) |
| site-shell | PARITY | 0 | 2 | 1 | Command palette searches blog posts and projects live (WP extra: fetches from REST endpoints) |

---

## Counts

- Blocks at PARITY: 6 (home-page, about-timeline, resume-ats, contact-form, not-found, site-shell)
- Blocks at MINOR_DRIFT: 5 (work-showcase, work-detail, resume-overview, blog-index, blog-post)
- Blocks at NEEDS_WORK: 1 (hobbies-moments)

---

## Detailed Block Analysis

### home-page -- PARITY

**React source**: `Home.tsx` (377 lines)
**WP block**: `render.php` + `style.css` (797 lines) + `view.js` (1147 lines)

All five sections are present: cinematic hero, selected work (with GitHub live/fallback), throughline narrative + quote card, resume snapshot (with live REST fetch), recent writing (with post cards), and contact CTA.

| Area | Status | Notes |
|------|--------|-------|
| Cinematic hero | Match | Full-bleed inverse hero with eyebrow, title, description, two CTA buttons |
| Selected Work grid | Match | 3-column featured repos with origin icons, badges, date, CTA label |
| Throughline section | Match | Narrative paragraphs + quote card with `learningPaper` surface emulation |
| Resume Snapshot | Match | Positioning card + best-fit card, target roles badges, inline action links |
| Recent Writing | Match | Post cards with thumbnails, srcSet, reading time, date |
| Contact CTA | Match | Ember-veil surface card with two action buttons |
| Skeleton loading states | Match | Work grid, post stack, and resume snapshot all have skeleton states |
| Empty states | Match | Both selected work and recent writing have empty state components |
| Reveal animations | Match | IntersectionObserver-based reveal with fade-in, fade-up, slide-left presets |

**Drifts (2)**:
1. Source-badge variant for `"GitHub snapshot"` vs `"Live GitHub"` not rendered as a second `Badge` on repo cards (minor -- the primary badge is present).
2. React uses `format(parseRepoDate(...), "MMM d, yyyy")` from date-fns; WP uses `toLocaleDateString()` which may produce slightly different formatting depending on browser locale.

**Extras (1)**:
1. WP block renders a source-provenance label below the Selected Work header ("Synced from GitHub" / "Cached snapshot") which is not shown in React.

---

### about-timeline -- PARITY

**React source**: `About.tsx` (183 lines)
**WP block**: `render.php` + `style.css` (462 lines) + `view.js` (516 lines)

All four sections are present: hero band, profile intro with avatar + LinkedIn badge, capability cards, value cards, and career timeline.

| Area | Status | Notes |
|------|--------|-------|
| Hero band | Match | Eyebrow, page title, description, ember-band surface |
| Profile intro | Match | Avatar with Gravatar image + fallback initials, intro paragraphs |
| LinkedIn badge | Match | Card-style link with avatar, name, subtitle, LinkedIn icon |
| Capability cards | Match | 3-column grid with icon, eyebrow, title, description paragraphs |
| Value cards | Match | 3-column grid with title and description |
| Career timeline | Match | Ordered list with icon badges, titles, period labels, detail text |
| Reveal animations | Match | CSS-based scroll reveal with IntersectionObserver |

**Drifts (1)**:
1. React wraps the intro section in a `SurfaceCard` with `surface="learningPaper"`; WP uses the generic `ember-surface` class without the paper-texture background layer. The visual difference is subtle (a background texture overlay).

---

### work-showcase -- MINOR_DRIFT

**React source**: `Work.tsx` (522 lines) + 8 child components
**WP block**: `render.php` + `style.css` (1217 lines) + `view.js` (36,000+ tokens)

The WP block is the most complex in the theme. It reimplements the full Work page including filters bar, signals panel, repository library with pagination, featured case studies, role groups, and pending repos panel.

| Area | Status | Notes |
|------|--------|-------|
| Hero band | Match | Eyebrow, title, description, source label, source warning |
| Filters bar | Match | Language filter chips, sort toggle (stars/updated), view toggle (grid/timeline) |
| Signals panel | Match | CI status, contributor stats, language summary, repo proofs, sparklines |
| Featured case studies | Match | Problem/approach/result breakdown cards |
| Role groups | Match | Grouped repo cards by role with descriptions |
| Repository library (grid) | Match | Paginated grid with proof badges, CI status indicators |
| Repository library (timeline) | Match | Timeline view sorted by update date |
| Pending repos panel | Match | Expandable panel with uncurated repo previews |
| Empty state | Match | "No projects found" with reset filter action |

**Missing (2)**:
1. `WorkBuildTimeline` -- the React page renders a shipped-timeline section (top 8 shipped repos) when view is "grid" and filter is "All". The WP block does not render this section.
2. The source-warning text for `fallback-offline` ("You're offline...") is handled but the React version also shows a small warning badge in the hero meta; WP only shows the text.

**Drifts (3)**:
1. React uses `useSearchParams` for URL-driven filter/sort/view state with `replace: true`; WP uses internal state without URL persistence, so bookmarking a filtered view does not work.
2. The `RECENT_UPDATE_WINDOW_DAYS` (30 days) constant and related `isUpdatedWithin` logic for the signals panel is present in WP but uses a slightly different timestamp comparison.
3. `detailsUnavailable` message from `useGitHubRepos` is handled differently -- React shows it inline in the filters bar; WP shows it as a separate status message.

---

### work-detail -- MINOR_DRIFT

**React source**: `WorkDetail.tsx` (871 lines)
**WP block**: `render.php` + `style.css` + `view.js` (50,000+ tokens)

The WP block implements the full project detail page including summary card, proof signals, case study breakdown, highlights, receipts, architecture, code tour, shipped change, availability, and "what I learned" sections.

| Area | Status | Notes |
|------|--------|-------|
| Summary card | Match | Back link, badges, language, role, license, stats, topics, CTA buttons |
| Cover image | Match | Full-width cover with srcSet |
| Section jump nav | Match | Sticky sidebar with jump links |
| Proof signals | Match | Community health, releases, CI status, community files |
| Why It Matters | Match | Ember-veil surface card |
| Case study breakdown | Match | Problem, approach, result sections |
| Highlights | Match | Badge chips with optional highlight image |
| Receipts | Match | Stacked cards with label, value, and optional source link |
| Architecture | Match | Summary, bullet list, diagram image |
| Code Tour | Partial | Key files are rendered but CodeTourQuickLook (file preview with syntax highlighting) is not implemented |
| Shipped change | Match | Ember-topography surface card |
| Availability | Match | Plain card |
| What I Learned | Match | Ember-topography surface card |
| Loading state | Match | Skeleton with loading message |
| Error state | Match | "Project not found" with back-to-work button |

**Missing (3)**:
1. **Participation sparkline** -- React renders a 12-week commit activity sparkline chart with bar heights and active-week summary. WP does not render this visualization (the participation data fetch exists but the sparkline component is absent).
2. **CodeTourQuickLook** -- React lazy-loads a file preview component with syntax highlighting, file tree, and browsable file list. WP renders the file list as plain links without the preview/syntax highlighting.
3. **Repository visual set** -- React uses `getRepoVisualSet(data?.name)` to load project-specific logo, cover, highlights, and architecture images. WP has partial support (cover images are handled) but logo and per-section images are not consistently rendered.

**Drifts (2)**:
1. React uses `framer-motion` for entrance animations; WP has no entrance animation on the detail page.
2. The `SectionJumpNav` in React is wrapped in a `SurfaceCard` with `surface="learningPaper"`; WP uses a simpler bordered card.

---

### resume-overview -- MINOR_DRIFT

**React source**: `Resume.tsx` (397 lines)
**WP block**: `render.php` + `style.css` + `view.js` (large)

The WP block renders all seven resume sections: summary, capability map (with merged skill groups), experience, signature work, education, differentiator, and certifications. It includes the sticky jump nav sidebar.

| Area | Status | Notes |
|------|--------|-------|
| Cinematic hero | Partial | Hero title, description, and target-role badges are rendered; inverse tone and backdrop are present |
| Jump nav sidebar | Match | Sticky sidebar with section links |
| Professional summary | Match | Ember-strong surface card |
| Capability map | Match | 3-column grid with merged skill groups and badge chips |
| Experience | Match | Sorted timeline entries with highlights |
| Signature Work | Match | Project cards with images, descriptions, evidence, tech badges |
| Education | Match | Timeline entries |
| Differentiator | Match | Ember surface card with sparkles icon |
| Certifications | Match | List in learning-paper surface card |

**Missing (1)**:
1. **Hero backdrop image** -- React uses `resumeHeroVisual.backdropClassName` to apply a background image to the cinematic hero. The WP block renders the inverse hero but without the visual backdrop image class.

**Drifts (2)**:
1. React hero has an ATS Resume button, a PDF print button (with Printer icon), and a Contact button. WP has the ATS Resume and Contact buttons but the PDF print button is styled differently (it links to the PDF but does not use the Printer icon).
2. React sorts experience entries by `parsePeriodStart` (newest first). WP sorts using the same logic but the comparison function implementation may differ slightly in edge cases.

---

### resume-ats -- PARITY

**React source**: `ResumeAts.tsx` (163 lines)
**WP block**: `render.php` + `style.css` + `view.js`

All seven ATS sections are present: header with contact info, summary, selected evidence, experience, projects, education, skills, and certifications. The sticky jump nav sidebar is included.

| Area | Status | Notes |
|------|--------|-------|
| Navigation buttons | Match | "Interactive Resume" back link and "Download PDF" button |
| Jump nav sidebar | Match | Sticky sidebar with section links |
| Header | Match | Name, headline, contact line |
| All 7 sections | Match | Summary, evidence, experience, projects, education, skills, certifications |
| Print styles | Match | `print:hidden` classes on nav elements |

**Drifts (1)**:
1. React uses the `Download` lucide icon on the PDF button; WP uses a generic download arrow SVG that is visually similar but not identical.

---

### hobbies-moments -- NEEDS_WORK

**React source**: `Hobbies.tsx` (241 lines) + `CategoryMomentsGrid` + `hobbies-config`
**WP block**: `render.php` + `style.css` + `view.js`

The React Hobbies page is architecturally different from the WP block. React uses category-based sections with dedicated backgrounds, a cinematic hero, and a complex grid system. The WP block uses a simpler filter-based layout.

| Area | Status | Notes |
|------|--------|-------|
| Hero | MISSING | React uses a cinematic hero with `surface="cinematic"`, inverse tone, backdrop image, and supporting text. WP renders a simpler hero band. |
| Jump nav | Partial | React has a sticky jump nav that scrolls with the page ("Browse by medium"). WP has filter chips instead. |
| Section backgrounds | MISSING | React renders each category (dev, music, learning) in a dedicated full-width section with unique background styling. WP renders all moments in a single flat list. |
| Category sections | MISSING | React groups moments by category with section intros (eyebrow, title, description, count badge). WP uses filter chips to toggle visibility. |
| Moments grid | Partial | Both render moment cards with title, story, takeaway. React uses `CategoryMomentsGrid` with different grid modes per category. WP uses a uniform grid. |
| Upcoming items | MISSING | React renders "Next up" cards with dashed border for planned experiments. WP does not distinguish upcoming/planned items visually. |
| Closing note | MISSING | React renders a closing-note card at the bottom. WP does not. |
| Background lazy-loading | MISSING | React uses IntersectionObserver to lazily load section backgrounds (`backgroundReadyIds`). WP has no equivalent. |

**Missing (5)**:
1. Cinematic hero with inverse tone, backdrop image, and supporting text
2. Category-specific full-width section backgrounds (dev, music, learning each have unique gradients/textures)
3. Per-category section intros with eyebrow, title, description, and count badge
4. "Next up" upcoming experiment cards with dashed borders
5. Closing note card at bottom

**Drifts (3)**:
1. React uses category-based page structure; WP uses filter-based flat layout
2. React uses `framer-motion` whileInView animations with staggered delays; WP has no scroll animations
3. React jump nav targets section IDs (e.g., `#hobbies-dev`); WP filter chips change visible content without scrolling

---

### blog-index -- MINOR_DRIFT

**React source**: `Blog.tsx` (430 lines)
**WP block**: `render.php` + `style.css` + `view.js`

The WP block implements the full blog index with featured post hero, archive browser with search/filter, paginated post list, and CTA section.

| Area | Status | Notes |
|------|--------|-------|
| Hero band | Match | Eyebrow, title, description, meta line with post count and latest date |
| Featured post | Match | Full-width featured card with image, title, excerpt, meta row |
| Archive browser | Match | Surface card with search input, tag filter chips, summary badges |
| Post list | Match | Row cards with thumbnails, titles, excerpts, tag badges, meta rows |
| Load more | Match | "Load more" button for pagination |
| Empty state | Match | "No posts found" empty state |
| Error/Loading states | Match | Loading spinner and error with retry button |
| JSON-LD | Match | Blog ItemList structured data injected |

**Missing (2)**:
1. **BlogShareActions panel** -- React renders a share panel in the CTA section with "Copy blog link" button and LinkedIn/email share links. WP renders the CTA section but without the share functionality.
2. **SocialActions with follow links** -- React renders GitHub and LinkedIn follow buttons in the CTA. WP renders simpler text links.

**Drifts (2)**:
1. React uses `useBlogPosts` hook with React Query (TanStack Query) for caching/refetching; WP uses a one-shot fetch with fallback.
2. The `buildBlogItemListJsonLd` structured data in React includes all listed posts; WP generates the JSON-LD server-side with a slightly different structure.

---

### blog-post -- MINOR_DRIFT

**React source**: `BlogPost.tsx` (521 lines)
**WP block**: `render.php` + `style.css` + `view.js`

The WP block implements the full blog post detail page with progress bar, header, article content, share actions, and related posts.

| Area | Status | Notes |
|------|--------|-------|
| Reading progress bar | Match | Fixed progress bar at top with scroll tracking |
| Back to Blog link | Match | ArrowLeft back navigation |
| Post header | Match | Tags, title, excerpt, featured image, meta row with author/date |
| Article content | Match | Both HTML and markdown rendering supported |
| Section jump nav | Match | Sticky sidebar with heading-derived links |
| Share actions | Match | Copy link, LinkedIn share, email share |
| Scroll to top | Match | Floating action button at 20% scroll |
| Related posts | Match | 2-column grid of related post cards |
| Loading/Error states | Match | Loading spinner and "Post not found" error |
| BlogPosting JSON-LD | Match | Structured data for individual post |

**Missing (2)**:
1. **BlogCommentsSection** -- React renders a comments section for WordPress-sourced posts (with `discussionUrl` and `commentsOpen` support). WP does not render this component.
2. **WordPress footer details** -- React shows `postMetaSummary` (seoDescription vs excerpt) in a bordered footer. WP does not render this distinction.

**Drifts (3)**:
1. React uses `framer-motion` for entrance animation; WP does not animate the article entrance.
2. React generates `openGraph.article` metadata with `publishedTime`, `modifiedTime`, and `tags`; WP relies on Yoast/server-side meta tags.
3. React resolves related posts via `selectRelatedBlogPosts` with tag-matching algorithm; WP uses a simpler tag-overlap heuristic.

---

### contact-form -- PARITY

**React source**: `Contact.tsx` (540 lines)
**WP block**: `render.php` + `style.css` + `build/view.js` (JSX-compiled)

The contact form is one of the JSX-converted blocks with a full `src/` + `build/` pipeline. It implements the complete form with Turnstile verification.

| Area | Status | Notes |
|------|--------|-------|
| Hero band | Match | Eyebrow, title, description |
| Social links sidebar | Match | Social action links from data contract |
| "What to send" guidance | Match | ListChecks icon, prompt items |
| Form fields | Match | Name, email, message with validation, hints, error states |
| Honeypot field | Match | Hidden company field for bot protection |
| Turnstile verification | Match | Widget with visible/invisible modes, error/expired/pending states |
| Submit button | Match | Loading state with "Sending..." / "Verifying..." text |
| Success state | Match | "Message sent!" confirmation |
| Error handling | Match | Form-level and field-level error messages |

**Drifts (1)**:
1. The Turnstile unavailable message text differs slightly: React uses "Please try again later or email henry@lakefrontdigital.io directly"; WP uses "Please try again later" (without the direct email fallback).

**Extras (1)**:
1. WP block accepts both `/api/contact` proxy endpoint and REST `/wp-json/.../contact` endpoint as fallback; React only uses `/api/contact`.

---

### not-found -- PARITY

**React source**: `NotFound.tsx` (55 lines)
**WP block**: `render.php` + `style.css` + `view.js` (16 lines)

Simple 404 page with code display, title, path display, and action buttons.

| Area | Status | Notes |
|------|--------|-------|
| 404 code | Match | Large gradient text "404" |
| Title | Match | "Page not found" |
| Path display | Match | `<code>` element showing the attempted path |
| Go Home button | Match | Primary button linking to home |
| Go Back button | Match | Outline button with `window.history.back()` |
| Document title | Match | "Page Not Found -- Henry Perkins" |

**Drifts (1)**:
1. React renders three buttons (Go Home, Go Back, View Work with FolderOpen icon); WP renders only two (Go Home, Go Back). The "View Work" button is missing from the WP block.

---

### site-shell -- PARITY

**React source**: `AppHeader.tsx` (150 lines) + `ThemeSwitcher.tsx` (57 lines) + `nav-config.ts` (30 lines)
**WP block**: `render.php` (321 lines) + `style.css` + `view.js`

The site shell handles the sticky header, desktop/mobile navigation, theme switcher, and command palette.

| Area | Status | Notes |
|------|--------|-------|
| Sticky header | Match | Glass effect, fixed positioning, border-bottom |
| Brand/logo | Match | Logo mark image + "Henry Perkins" text |
| Desktop nav | Match | Pill-style links with active state highlighting |
| Command trigger (desktop) | Match | Search icon + Ctrl+K / Cmd+K shortcut hint |
| Theme switcher | Match | Sun/moon toggle with dropdown menu (light/dark/system) |
| Mobile menu trigger | Match | Hamburger/X icon with "Menu"/"Close" text |
| Mobile menu | Match | Full-height dialog with navigation, search trigger, quick-path card |
| Command palette | Match | Search dialog with pages, posts, and projects sections |
| Active nav state | Match | JS-based pathname matching for `is-active` class |
| Keyboard shortcut | Match | Ctrl+K / Cmd+K opens command palette |
| Theme persistence | Match | localStorage-based theme storage with system detection |

**Drifts (2)**:
1. React uses shadcn `Sheet` component for mobile menu with slide animation; WP uses a custom CSS-animated modal dialog. Visual behavior is equivalent.
2. React uses shadcn `DropdownMenu` for theme switcher; WP uses a custom menu button with `role="menu"` and `aria-checked`. Accessibility behavior is equivalent.

**Extras (1)**:
1. WP command palette fetches blog posts and projects from REST endpoints to enable searching across dynamic content; React command palette uses static route data plus client-side data from hooks.

---

## Blocks Needing Work (Detail)

### hobbies-moments

| # | Missing Feature | Severity | Fix Description |
|---|----------------|----------|-----------------|
| 1 | Cinematic hero | HIGH | Replace the simple hero band with a cinematic hero using `surface="cinematic"`, inverse tone, backdrop image class `hero-backdrop-hobbies-after-hours`, and supporting text paragraph |
| 2 | Category section backgrounds | HIGH | Restructure the page to render category-specific full-width sections (dev, music, learning) with unique background gradients and textures matching the React `sectionClassName` values |
| 3 | Per-category section intros | MEDIUM | Add section intro blocks with eyebrow, title (h2), description, and count badge before each category grid |
| 4 | "Next up" upcoming cards | MEDIUM | Render planned/upcoming items in dashed-border `SurfaceCard` containers with "Next up" badges and item title/story/takeaway |
| 5 | Closing note card | LOW | Add a closing-note `SurfaceCard` at the bottom of the page with eyebrow "Closing note" and copy text |

---

## Recommended Fix Order

Ordered by page traffic importance and gap count:

| Priority | Block | Verdict | Gap Count | Rationale |
|----------|-------|---------|-----------|-----------|
| 1 | work-showcase | MINOR_DRIFT | 5 | High-traffic page; missing shipped timeline and URL state persistence |
| 2 | work-detail | MINOR_DRIFT | 5 | Primary conversion funnel; missing sparkline and code tour preview |
| 3 | resume-overview | MINOR_DRIFT | 3 | Key recruiter page; missing hero backdrop image |
| 4 | blog-index | MINOR_DRIFT | 4 | Content discovery page; missing share panel and follow links |
| 5 | blog-post | MINOR_DRIFT | 5 | Content engagement; missing comments section |
| 6 | hobbies-moments | NEEDS_WORK | 8 | Lower traffic but furthest from parity; needs structural rework |
| 7 | not-found | PARITY | 1 | Low priority; add third "View Work" button |

---

## Notes

- All blocks use the `data-config` JSON attribute pattern for server-to-client data passing. This is consistent and works well.
- All blocks with REST API data fetching implement proper fallback chains (REST endpoint -> fallback URL -> inline payload).
- The contact-form block is the only JSX-compiled block (`src/` + `build/`). All others use hand-written `wp.element.createElement` patterns.
- The site-shell and not-found blocks use pure DOM manipulation (no `wp.element`).
- All blocks include `prefers-reduced-motion` media queries or skip animations accordingly.
- Dark mode support is present across all blocks via `[data-theme="dark"]` selectors in CSS.
