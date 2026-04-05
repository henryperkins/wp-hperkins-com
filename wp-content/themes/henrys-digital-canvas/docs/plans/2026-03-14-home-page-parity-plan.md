# Home Page Parity Remediation - Implementation Plan

> Historical snapshot: This dated document is retained for planning or audit history and may contain period-specific assumptions, commands, file lists, test counts, or open issues. For current workflow guidance, use `README.md`, `docs/PAGE_TO_BLOCK_MIGRATION_CHECKLIST.md`, `docs/CUTOVER_CHECKLIST.md`, and `docs/MIGRATION_PROGRESS.md`.

**Goal:** Close the remaining parity gaps between the WordPress `home-page` block and the React `Home.tsx` page.

**Architecture:** Three phases across `render.php`, `view.js`, `style.css`, and shared work-data JSON. No build step is required.

**Block directory:** `wp-content/themes/henrys-digital-canvas/blocks/home-page/`

---

## Phase 1: Canonical Repo Names + Extras Removal

### Task 1: Add canonical `displayName` values to work data

**Files:**
- Modify: `blocks/work-showcase/data/repo-case-study-details.json`

**Steps:**
1. Add `displayName` entries for the homepage-featured repositories whose React data defines a curated name.
2. At minimum, add `"displayName": "Prompt Forge"` under `"ai-prompt-pro"`.
3. Add any other homepage-featured curated names that React already defines so the home page and future work views can share the same source of truth.

**Verify:**
- Confirm the JSON remains valid.

---

### Task 2: Make `home-page` prefer shared `displayName`

**Files:**
- Modify: `blocks/home-page/view.js`

**Steps:**
1. Extend `normalizeRepoItem()` to carry a `displayName` field from the shared work contract.
2. Update `getHomeRepoTitle()` to prefer `repo.displayName`, then `repoTitles[ repo.name ]`, then `humanizeRepoName( repo.name )`.
3. Keep `repoTitles` as a fallback only; do not rely on it as the primary title source.

**Verify:**
- A featured `ai-prompt-pro` card resolves to `Prompt Forge`.

---

### Task 3: Remove WP-only extras

**Files:**
- Modify: `blocks/home-page/render.php`
- Modify: `blocks/home-page/view.js`

**Steps:**
1. Remove the Open Graph and Twitter `<meta>` tags emitted before the block wrapper in `render.php`.
2. Remove the `useEffect()` that mutates `document.title` in `view.js`.
3. Leave route-level metadata ownership with `functions.php` and the theme's existing document-title logic.

**Verify:**
- The block still renders normally.
- No title flicker is introduced by the block app.

---

## Phase 2: First-Paint Data Parity

### Task 4: Embed initial posts and resume data in block config

**Files:**
- Modify: `blocks/home-page/render.php`

**Steps:**
1. Add `initialPosts` to the config using `hdc_get_blog_posts_data_contract( 3 )`.
2. Add `initialResume` to the config using `hdc_get_resume_data_contract()`.
3. Keep the existing REST endpoints in config so the client can still revalidate.

**Verify:**
- The `data-config` payload contains populated initial posts and resume data.

---

### Task 5: Hydrate from config before revalidating

**Files:**
- Modify: `blocks/home-page/view.js`

**Steps:**
1. Parse `initialPosts` and `initialResume` from config.
2. Initialize `postsState` with those posts when present so Recent Writing renders immediately.
3. Initialize `resumeState` with the embedded resume data when present so Resume Snapshot renders immediately.
4. Keep the fetch calls, but treat them as background refreshes.
5. If background refresh fails and initial data exists, keep the initial data instead of dropping to empty/failure UI.

**Verify:**
- Home page renders post cards and resume content on first paint without interim loading copy.

---

## Phase 3: Date Stability + UI Polish

### Task 6: Normalize date-only strings the React way

**Files:**
- Modify: `blocks/home-page/view.js`

**Steps:**
1. Add a helper that mirrors React's `parseRepoDate()` behavior:
   - empty input -> epoch fallback
   - `YYYY-MM-DD` -> append `T12:00:00`
   - otherwise parse normally
2. Use that helper in `formatDate()`.
3. Use that helper in `getUpdatedAtTimestamp()`.

**Verify:**
- Repo and post dates stay stable across time zones for date-only strings.

---

### Task 7: Close remaining low-level UI drift

**Files:**
- Modify: `blocks/home-page/view.js`
- Modify: `blocks/home-page/style.css`

**Steps:**
1. Render the hero eyebrow only when `config.hero.eyebrow` is non-empty.
2. Replace any remaining plain loading/fallback text with structured state UI that fits the existing home-page card system.
3. Keep the styling aligned with current `ember-surface` and card patterns already in the theme.

**Verify:**
- No empty eyebrow node appears in the hero.
- Fallback/loading states look intentional rather than placeholder text.

---

## Verification

### Task 8: Validate and test

**Commands:**
```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/home-page/view.js
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route
cd wp-content/themes/henrys-digital-canvas && npm run smoke:api
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

**Browser check:**
- Load `/`
- Confirm hero, Selected Work, Resume Snapshot, and Recent Writing visually match the React page more closely
- Confirm featured repo naming, first-paint content, and date formatting behavior

### Task 9: Re-run parity checker

Expected outcome: `PARITY` or `MINOR_DRIFT`
