# Work Showcase Parity Remediation Design

**Date**: 2026-03-09
**Block**: `henrys-digital-canvas/work-showcase`
**Source of truth**: `/home/azureuser/henry-s-digital-canvas/src/pages/Work.tsx` and components in `src/components/work/`

## Problem

The parity checker identified 6 missing features, 1 WP-only extra feature, and several minor drifts between the WordPress `work-showcase` block and its React source.

## Decision

Fix all gaps in 3 phases, ordered by severity. Remove the WP-only Language Distribution section to achieve strict parity.

## Scope

### Phase 1: Role Group Interactivity + Language Distribution Removal

**Files**: `view.js`, `style.css`

#### 1a. Role group expand/collapse

The React `WorkRoleGroups` maintains an `expandedRoles: Set<RepoRole>` state. Clicking a role card expands it to show all repos instead of just 2 previews. The WP version always shows exactly 2 preview repos with a "+N more" badge but has no interactivity.

**Changes to `view.js` (RoleGroups component, ~lines 1691-1782)**:

- Add `expandedRoles` state (a `Set`) to the `WorkShowcaseApp` component state.
- Add `toggleRole(role)` handler that toggles a role in the set.
- In RoleGroups, for each group:
  - If `expandedRoles.has(role)`: render ALL repo name badges instead of slicing to `PREVIEW_COUNT` (2).
  - Render the "+N more" badge as a clickable element. When expanded, change text to "Show less".
  - Add `onClick` on the card element calling `toggleRole(role)`.
  - Add `role="button"`, `aria-expanded={expanded}`, `tabIndex={0}` on the card.
  - Add `onKeyDown` handler: Enter and Space trigger `toggleRole`, with `e.preventDefault()`.
  - Repo name link clicks must call `e.stopPropagation()` to prevent card toggle.
- Add ChevronDown icon to the "+N more" / "Show less" badge.
- When expanded, rotate ChevronDown 180 degrees via a CSS class.

**Changes to `style.css`**:

- Add `.hdc-work-role-card[aria-expanded]` cursor pointer style.
- Add `.hdc-work-role-badge-chevron` with `transition: transform 0.2s ease`.
- Add `.is-expanded .hdc-work-role-badge-chevron` with `transform: rotate(180deg)`.
- Add proportion bar animation: `transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)` on `.hdc-work-role-proportion-fill`. Render with `width: 0` initially, set target width via JS after mount.

#### 1b. Remove Language Distribution section

The React `WorkSignalsPanel` renders only 3 stat cards (recently updated, most active language, weekly activity trend). The WP version adds a "Language Distribution" section with a bar chart ("Primary Language by Repository") and a treemap ("Language Share by Bytes") fetched from `/api/github/language-summary`. This is WP-only content.

**Changes to `view.js` (SignalsPanel, ~lines 1347-1566)**:

- Remove the `loadLanguageSummary` function and its `fetch` call to the language summary proxy.
- Remove `languageSummary` state variable and any references.
- Remove the "Language Distribution" DOM subtree (~lines 1465-1564): the "Primary Language by Repository" bar chart and "Language Share by Bytes" treemap.
- Remove the `githubLanguageSummaryProxyUrl` config reference.

**Changes to `style.css`**:

- Remove `.hdc-work-lang-*` styles (bar chart rows, treemap tiles, track/fill elements).

---

### Phase 2: Missing Repo Card Badges

**Files**: `view.js`, `style.css`

#### 2a. CI status fetch and badge

The React app calls `useGitHubCIStatus` to fetch CI workflow statuses and renders colored "CI {status}" badges on repo cards. The WP block has no CI status integration.

**Changes to `view.js`**:

- Add a `loadCIStatus(repos, username)` function that fetches from the existing GitHub CI proxy endpoint (same pattern as `loadRepoProofs`).
  - Accept an array of visible repo names.
  - Return a map of `{ repoName: { status: "passing"|"failing"|"running"|null } }`.
  - Include rate limit handling (check cooldown map before fetching, set cooldown on 429/403).
  - Include offline detection (`navigator.onLine`).
- Add `ciStatusMap` state to the app.
- Call `loadCIStatus` after repos are loaded, for the currently visible page of repos.
- In `RepoCard`, render a CI badge when `ciStatus` is one of `passing`, `failing`, `running`:
  - Badge text: `"CI {status}"`.
  - Badge variant: `outline`.
  - Color class: `is-ci-passing` (green), `is-ci-failing` (red), `is-ci-running` (yellow).

**Changes to `style.css`**:

- Add `.hdc-work-badge.is-ci-passing { color: hsl(var(--success)); }`.
- Add `.hdc-work-badge.is-ci-failing { color: hsl(var(--destructive)); }`.
- Add `.hdc-work-badge.is-ci-running { color: hsl(var(--warning)); }`.

**Config**: The proxy URL for CI status needs to be provided in the block's `data-config`. Check if it already exists; if not, add `githubCIStatusProxyUrl` to `render.php` config output.

#### 2b. License badge

React renders a license badge with a Scale icon when `repo.license` exists. WP has the data but doesn't render it.

**Changes to `view.js` (RepoCard, ~lines 1912-1936)**:

- After the release badge, add a license badge:
  - Condition: `repo.license` is truthy.
  - Render: Scale icon SVG + `repo.license` text.
  - Badge variant: `outline`.

#### 2c. Open issues/PRs count in footer

React shows an open issues count with a CircleDot icon when `openIssuesAndPullRequests > 0`. WP doesn't render this.

**Changes to `view.js` (RepoCard footer, ~lines 1937-1986)**:

- After the forks count, add an open issues stat:
  - Condition: `repo.openIssuesAndPullRequests > 0` (or equivalent field from the GitHub API merge).
  - Render: CircleDot icon SVG + count.
  - Same styling as stars/forks stats.

**Data check**: Verify that the GitHub API response includes `open_issues_count` and that the data merge in `loadWorkData` maps it to the repo object.

---

### Phase 3: Visual Polish

**Files**: `view.js`, `style.css`

#### 3a. Skeleton loading UI

React renders a rich `WorkLoadingSkeleton` with animated placeholders for filter chips and repo cards. WP shows only "Loading repositories..." text.

**Changes to `view.js`**:

- Add a `LoadingSkeleton` component that renders:
  - Filter bar skeleton: 5 pill-shaped placeholders + 1 wider control placeholder.
  - Card grid skeleton: 6 cards, each with header, title, description lines, topic badges, and footer placeholders.
- Render `LoadingSkeleton` when `loading === true` instead of the text message.

**Changes to `style.css`**:

- Add `.hdc-work-skeleton` base class with `background: hsl(var(--muted)); border-radius: var(--radius-surface);`.
- Add `@keyframes hdc-skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`.
- Add `.hdc-work-skeleton { animation: hdc-skeleton-pulse 2s ease-in-out infinite; }`.
- Add size utility classes: `.is-h4`, `.is-h5`, `.is-h6`, `.is-w-20`, `.is-w-24`, `.is-w-full`, `.is-w-5-6`, `.is-rounded-pill`.
- Add `.hdc-work-skeleton-grid` with responsive columns matching the repo card grid.

#### 3b. Reveal/entrance animations

React wraps sections in `<Reveal>` components providing fade-up entrance animations with staggered timing. WP has no entrance animations.

**Changes to `style.css`**:

- Add `@keyframes hdc-reveal-fade-up`:
  ```css
  @keyframes hdc-reveal-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  ```
- Add `.hdc-reveal` class:
  ```css
  .hdc-reveal {
    opacity: 0;
    transform: translateY(20px);
  }
  .hdc-reveal.is-visible {
    animation: hdc-reveal-fade-up 0.26s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    animation-delay: calc(var(--reveal-index, 0) * 0.16s);
  }
  @media (prefers-reduced-motion: reduce) {
    .hdc-reveal { opacity: 1; transform: none; }
    .hdc-reveal.is-visible { animation: none; }
  }
  ```

**Changes to `view.js`**:

- Add an `initRevealObserver()` function using `IntersectionObserver` (threshold 0.1).
- When an element with `.hdc-reveal` enters the viewport, add `.is-visible`.
- Apply `.hdc-reveal` class and `--reveal-index` CSS variable to:
  - Hero section (index 0, using `fadeUpSoft` variant with `translateY(12px)`)
  - Each role group card (staggered by index)
  - Each repo card in the grid (staggered by index within page)
  - Signals panel
  - Featured case studies cards
- Call `initRevealObserver()` after initial render and after pagination changes.

---

## Minor Drifts NOT addressed

These are acceptable platform differences and are out of scope:

- Pagination buttons (text vs icon) — platform convention difference
- Checkbox styling (native vs shadcn) — no visual regression
- Toast implementation (custom vs sonner) — functionally equivalent
- Single 720px breakpoint vs multi-breakpoint — acceptable simplification
- Featured case study item limit (2 vs 1) — more content shown is acceptable
- No auto-refetch after rate limit cooldown — one-shot fetch sufficient for SSR+hydration pattern

## Verification

After each phase, run:
```bash
npm run smoke:full
```

After all phases, run the parity checker agent again to confirm PARITY or MINOR_DRIFT rating.
