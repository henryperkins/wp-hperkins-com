# Homepage as synced core blocks — Design

- **Date:** 2026-06-04
- **Status:** Approved (design, rev. 4 — §4/§5/§13 reconciled with the source-of-truth merge during Phase-1 planning); pending implementation plan
- **Topic:** Rebuild the homepage from 7 custom blocks into native core blocks, with live GitHub data synced server-side from hperkins.com.
- **Related:** `2026-05-03-home-page-ai-readable-innerblocks-design.md`, `2026-06-03-home-selected-work-parity-design.md`
- **Source of truth (visual/functional parity):** `/home/dev/henry-s-digital-canvas/src/pages/Home.tsx`

## 1. Problem & goals

The homepage is currently a `home-page` parent block wrapping 6 custom children (`home-hero`, `home-selected-work`, `home-throughline`, `home-resume-snapshot`, `home-recent-writing`, `home-contact-cta`). Three children hydrate client-side from REST (`/v1/work`, `/v1/resume`, `/v1/blog`) and show a `Loading…` first paint; three are static server-rendered content; one is a wrapper with a legacy fallback.

Goals:

1. **Sync data from hperkins.com** — pull live GitHub signals from the hperkins.com Cloudflare Worker BFF.
2. **Use as many core WordPress blocks as possible** — minimize custom blocks on the homepage.
3. **Maintain near-identical visuals** to the current page (which mirrors `Home.tsx`).

### Decisions locked during brainstorming

| Decision | Choice | Rationale |
|---|---|---|
| Data reach | **Scheduled server sync** (WP-Cron → worker → CPT → core Query Loop) | Only option that satisfies all three goals; also kills the `Loading…` first paint (SEO/no-JS). |
| Ownership | **WP-native** — copy in core blocks, curation as CPT post meta | Most editable/core; retire homepage JSON mirroring. |
| Styling | **Reuse the skin, migrate toward `theme.json`** where clean | Near-identical is a hard constraint; bespoke CSS only for rich effects. |
| Selected Work rendering | **Pure core + Block Bindings** (Approach A) | Zero custom blocks; fields bound to CPT post meta. |
| Recent Writing | **Core Query Loop over real posts only** | No content import; fills in as posts are published. |
| Parent wrapper | **Retire** → "Home" block pattern + core Group shell | Removes the legacy fallback; spacing/dividers move to `theme.json`. |
| Repo identity key | **`github_id`** (immutable), via a 1-line worker change | Rename/transfer-stable; `name`/slug are not. |
| Scope | **One spec, phased** | Single coherent feature. |

### Non-goals

- Changing the Work, Resume, or Blog pages. The `/v1/work`, `/v1/resume`, `/v1/blog` REST endpoints stay — only the *homepage's* dependence on them is removed.
- Importing blog content (explicitly declined; Recent Writing fills in as real posts are published).
- Re-theming. Visuals must stay near-identical.

## 2. Key context (verified)

- **hperkins.com** is a Cloudflare Worker (`name: henrys-digital-canvas`, custom domain `hperkins.com`, `wrangler.jsonc` + `worker/index.ts`). It **exposes** `/api/github/*` (incl. `/api/github/repos`) and the feed/WordPress routes. Its config sets `WORDPRESS_API_BASE_URL=https://wp.hperkins.com`, and `/api/feed` + `/api/wordpress/posts` read blog content **from this WordPress site** — so blog data must not be "synced back" from the worker (circular).
- The worker's `/api/github/repos` (route `worker/routes/github.ts:727`, mapper `sanitizeGitHubRepo()` `:402-430`) returns **live GitHub fields only**: `name`, `description`, `language`, `stargazers_count`, `forks_count`, `pushed_at`, `created_at`, `html_url`, `topics`, `fork`, `archived`, `license`, plus several fields the homepage ignores (`size`, `open_issues_count`, `homepage`, `has_pages/issues/projects/wiki/discussions`, `default_branch`). **Verified:** it does **not** currently return the immutable numeric `id` (see §4 — a 1-line worker change adds it). The endpoint has **no client-side auth gate** (its GitHub token is used worker→GitHub only) and defaults to `per_page=100`, identical to the React client's single-page fetch (`GITHUB_REPO_LIST_LIMIT = 100`) — so the WP sync needs **no credentials and no pagination loop**.
- The worker carries **none** of the **curated** fields, and their source files differ: `featured`, `featuredPriority`, `origin`, `access`, `displayName` live in `src/data/repos.ts` (mirrored to `blocks/work-showcase/data/repos.json`); **`whyItMatters` lives in `src/data/repo-case-study-details.ts`** (mirrored to `blocks/work-showcase/data/repo-case-study-details.json`, 23 entries) — it is **not** present in `repos.json` (0 occurrences). This drives the seed plan in §4/§8.
- The client merge to replicate server-side is `mapGitHubRepos()` in `src/hooks/useGitHubRepos.ts:110-170`: filter out forks/archived, merge live onto curated **by `name`**, retain curated-only repos missing from the API.
- Reading time is already canonical: `hdc_estimate_reading_time()` (`inc/data-contracts.php:250`) = `str_word_count( wp_strip_all_tags() ) / 220`, `max(1, round())`. React matches (`src/lib/blog-source.ts:95`, `WORDS_PER_MINUTE = 220`).
- Helpers confirmed present: `hdc_get_portfolio_origin()` (`inc/data-contracts.php:210`, returns `https://hperkins.com`) and `hdc_get_configured_github_owner()` (`:189`, `HDC_GITHUB_REPO_OWNER` → fallback `henryperkins`).
- Install is **WordPress 7.1-alpha-62456** + **Gutenberg 23.3.0** (verified on disk; CLAUDE.md still says 6.9.4 — corrected as a follow-up task). The relied-on features are in **stable** core, so this design does **not** depend on the alpha: Block Bindings (WP 6.5), the `core/post-meta` binding source (6.7), and the `query_loop_block_query_vars` filter (6.1) are all GA.
- Theme include convention: `inc/*.php` are loaded via explicit `require_once` in `functions.php`, and the theme has **no existing WP-Cron** (this design introduces the first scheduled event) — so the proposed `inc/home-core/` tree fits cleanly.
- Recent Writing currently renders from blog fallback JSON; the live published-post count is low (reportedly just "Hello world!"). Either way the Query Loop degrades gracefully (§6).

## 3. Architecture

```
hperkins.com/api/github/repos  ──(WP-Cron: hdc_sync_repos, hourly)──►  hdc_github_sync()
        (live GitHub signals + id)                                           │  merge + derive
                                                                             ▼
 repos.json + case-study-details ─(one-time seed)─►  hdc_repo CPT  ◄── curation (post meta, admin-owned)
                                          │            (upsert key: github_id)
                                          ▼
   Home page record (core blocks) ─►  core Query Loop  (Selected Work, bound to meta)
                                      core Query Loop  (Recent Writing, native posts)
                                      core-block patterns (Hero / Throughline / Resume / Contact)
                                          │
                                          ▼
                                   front-page.html → <main> → footer
```

New code lives in one theme include tree: `inc/home-core/` (CPT + meta, sync, derivation, pattern + block-style registration), wired from `functions.php`. No homepage custom blocks remain. One cross-repo prerequisite: a 1-line addition to the worker's `sanitizeGitHubRepo()` to expose `id`.

## 4. Data model — `hdc_repo` CPT

A **non-public but Query-Loop-able** CPT: `public: false` with **`publicly_queryable: true`** (verified necessary in Phase 1 — core's `build_query_vars_from_query_block()` only honors a non-builtin `postType` when `is_post_type_viewable()`, i.e. `publicly_queryable`; without it the Selected Work loop silently falls back to the `post` type). `rewrite: false` + `has_archive: false` keep it URL-less and `exclude_from_search` stays true (the `public:false` default), so no public surface is created. `show_ui: true`, `show_in_rest: true`, supports `title` + `custom-fields` only — **not** `page-attributes`, since `menu_order` is sync-owned (see §5). One post per repo, keyed by `github_id`. Meta registered via `register_post_meta()` with `single: true`, `show_in_rest: true`, and explicit sanitizers, in four tiers:

| Tier | Owner | Meta keys | Source |
|---|---|---|---|
| **Identity** | Worker (immutable) | `github_id` (int) — the upsert key | `/api/github/repos` `id` |
| **Curated** | Admin (seeded once; see seed note) | `featured` (bool), `featured_priority` (int), `why_it_matters` (text), `display_name` (text), `access` (`public`\|`private`), `description`¹ | `repos.json` (all but `why_it_matters`) + `repo-case-study-details.json` (`why_it_matters`); then admin-edited |
| **Live** | Cron (overwritten each sync) | `language`, `stars` (int), `forks` (int), `updated_at` (ISO date), `url`, `topics` (**array** — `show_in_rest` schema + `sanitize_callback`; the only array meta), `origin`² | `/api/github/repos`; `origin` set to `github` when live-present (else the seeded `repos.json` value) |
| **Derived** | Cron (computed at sync) | `summary`, `badge_label`, `source_badge`, `cta_label`, `last_sync_source` | computed at sync |

**Field-ownership precedence (parity with `mapGitHubRepos`, `useGitHubRepos.ts:104-170`) — reconciled in rev. 4:**

- ¹ `description` is **curated-preferred**, not live-overwritten. React resolves it as `localRepo.description || api.description || "Description coming soon."`, so a curated `repos.json` description wins. The sync therefore fills `description` from the live API **only when the stored value is empty** (effectively on create) and never clobbers a non-empty / admin-edited description — hence it sits in the Curated tier despite originating partly from live data.
- ² `origin` is **seeded curated but sync-promoted to `github`** for any repo present in the live API (React's `mapGitHubRepos` hardcodes `origin: 'github'` for live repos). Curated-only repos absent from the API keep their seeded origin. So for live-present repos `origin` is effectively sync-owned — and that is what makes `source_badge` / `cta_label` resolve to "Live GitHub" / "View project" for a repo like `tarot` (seeded `origin: 'curated'` + a `github.com` URL + `featuredPriority: 0`, i.e. the #1 featured card).

`archived` is **not** stored — archived repos are filtered out on read, so the field would always be false and is unused. `name` lives in the post **slug** (updated from live data on rename); the post **title** carries the derived `display_name`, so the Selected Work `core/post-title` block renders the display name (this reconciles §4 with §6). `name` is not the key.

**Invariant (rev. 4):** the sync writes Identity (on create) + Live + Derived meta and reconciles `post_status` / `menu_order` from curated values. It **never overwrites the editor-owned curated fields** — `featured`, `featured_priority`, `why_it_matters`, `display_name`, `access`. The only writes that touch curated-tier keys are the deliberate parity exceptions in footnotes ¹/²: `origin` is promoted to `github` for live-present repos, and `description` is filled from live **only when empty**. Both mirror `mapGitHubRepos`; everything else curated is the editor's to own in WP admin.

**Seed provenance (corrected in rev. 3):** the one-time seed merges **two** JSON files by repo name — `blocks/work-showcase/data/repos.json` supplies `featured`/`featured_priority`/`origin`/`access`/`display_name`, and `blocks/work-showcase/data/repo-case-study-details.json` supplies `why_it_matters`. `repos.json` contains **no** `whyItMatters` and only a partial set of `displayName`s, so seeding from it alone would collapse every Selected Work summary to `description` (since `summary ← why_it_matters || description`). This merge mirrors how React composes the repo object before `Home.tsx` reads `repo.whyItMatters`.

**Admin editing surface:** with only `custom-fields` support, the classic Custom Fields metabox edits all meta as free-text strings — workable but rough for `featured` (bool) / `featured_priority` (int), and it **cannot** edit `topics` (array, which is sync-owned anyway). A small dedicated meta box for the ~6 curated fields is recommended for a sane curation UX (implementation detail, not a blocker).

### Selection & ordering (mirrors `Home.tsx`)

`Home.tsx:86-96` selects featured repos with this **exact** comparator — the PHP port must replicate all of it, because most featured repos have **no** `featured_priority` and therefore fall through to the date/tiebreak branch:

```text
filter(r => r.featured)
sort by:
  1. featuredPriority ascending, with MISSING priority → Number.MAX_SAFE_INTEGER (sorts LAST)
  2. then updatedAt DESCENDING (null/invalid date → epoch 0, i.e. oldest)
  3. then alphabetical tiebreak  (compareReposByUpdatedAtDesc, work-utils.ts:109)
slice(0, 3)
```

WP-native equivalent:

- `post_status` is **derived** from `featured`: `publish` if `featured`, else `draft` (drafts are retained for editing, excluded from the loop).
- `menu_order` is **sync-owned** (Derived), set to the computed rank from the comparator above (0,1,2,…). The admin controls ordering by editing the curated `featured_priority` meta, **not** `menu_order` directly (hence no `page-attributes` UI — avoids admin edits fighting the cron).
- **Immediate reconciliation:** rank + `post_status` are recomputed not only by the hourly cron but also by a `save_post_hdc_repo` hook calling the **same** shared "reconcile ranks + statuses" routine, so toggling `featured` / editing `featured_priority` in admin takes effect at once instead of lagging up to an hour. (Rank is set-relative, so the routine re-ranks the whole featured set.)
- The Selected Work Query Loop carries `namespace: "hdc/selected-work"`; a ~5-line `query_loop_block_query_vars` filter keyed on that namespace sets `orderby => 'menu_order'`, `order => 'ASC'` (core Query Loop's UI exposes only date/title). This is the only render-time PHP hook.

## 5. Sync job

`hdc_github_sync()` on an hourly WP-Cron event `hdc_sync_repos` (scheduled on `init` if absent; cleared on `switch_theme`). A WP-CLI command `wp hdc sync-repos` triggers it manually for first run/debugging.

1. `wp_remote_get( hdc_get_portfolio_origin() . '/api/github/repos?per_page=100', [ 'timeout' => 5 ] )` with the configured owner (`hdc_get_configured_github_owner()`). **No auth header is needed** — the endpoint has no client gate (§2). `per_page=100` is the worker default and matches the React client; a single request suffices at this scale.
2. **Soft-fail guard** (extends stale-but-present): if the request errored/timed out/rate-limited, **or** returns a `200` whose parseable **live-repo array is empty** (after JSON decode / shape check), then leave the **Live** tier untouched, set `last_sync_source = fallback` (`fallback-empty` for the empty-`200` case), recompute `source_badge` to its snapshot variant ("GitHub snapshot" for github repos, per `getHomeRepoSourceBadge`'s fallback branch), record the `hdc_repo_sync_status` option, and exit. **What the guard actually protects:** because `post_status` is curated-derived and step 3 *retains* repos missing from the API, an empty/failed response can never blackout the section on its own — the guard's job is to avoid (a) stamping stale data as "Live GitHub" and (b) re-ranking against an empty set. The page keeps rendering the last-good cards; curated repos are never affected.
3. On good response: drop forks/archived. For each live repo, **upsert `hdc_repo` by `github_id`** (meta_query exact match; create if none). If `github_id` is absent (worker not yet deployed), fall back to exact `name`-meta/title match and log a warning. Set the post **slug** from the live `name` and the post **title** from the derived `display_name` (so a rename updates the slug but keeps the same post + curated meta). Merge Live fields (`language`, `stars`, `forks`, `updated_at`, `url`, `topics`); set `origin = github` (live-present, footnote ²); set `description` from live **only if the stored value is empty** (footnote ¹). **Never** touch the editor-owned curated fields (`featured`, `featured_priority`, `why_it_matters`, `display_name`, `access`). Retain curated-only repos missing from the API (e.g. private case studies).
4. Compute Derived meta — PHP ports of `Home.tsx` helpers. *github-linked* means `origin === 'github'` **or** `url` contains `github.com/` (per `isGitHubLinkedRepo`):
   - `summary` ← `why_it_matters || description` (`getHomeRepoSummary`). **Porting note:** React uses `??` (only null/undefined fall through), but WP post meta is `''` when unset, so the port must treat an **empty** `why_it_matters` as "fall back to `description`" (i.e. `||`/`empty()` semantics, **not** a literal `??`). Do not "fix" this to `??`.
   - `badge_label` ← `access === 'private'` → "Private case study"; else github-linked → "Open source"; else "Curated project" (`getHomeRepoBadge`)
   - `source_badge` ← `access === 'private'` → null; sync live → (`origin === 'github'` ? "Live GitHub" : null); else github-linked ? "GitHub snapshot" : null (`getHomeRepoSourceBadge`)
   - `cta_label` ← `origin === 'github' && access !== 'private'` → "View project"; else "View case study" (`getHomeRepoCtaLabel`)
   - `display_name` fallback ← `getRepoDisplayName(repo)` if curated `display_name` is empty
5. Write Identity (on create) + Live + Derived meta; then invoke the shared **reconcile ranks + statuses** routine (also called from `save_post_hdc_repo`, see §4) to set `menu_order` = computed rank and `post_status` per `featured` across the whole set.
6. Record `hdc_repo_sync_status` option: `{ time, source: 'live'|'fallback'|'fallback-empty', count }`.

## 6. Rendering map

The home page record (resolved via `get_option( 'page_on_front' )` — **not** a hard-coded ID; the local install happens to be page 4, but `scripts/sync_page_sources.php` assigns it dynamically) is rebuilt as core blocks, registered as a **"Home" block pattern** (`henrys-digital-canvas/home`). `front-page.html` is unchanged (header → `<main>` constrained → post-content → footer). The `home-page` parent block and its `hdc_build_home_page_child_block_markup()` fallback are removed.

**Page-record ownership:** the homepage's `post_content` is owned by `scripts/sync_page_sources.php` (`npm run sync:pages`), which currently bakes the custom-block markup into the record. That script must be updated to emit the new core-block "Home" pattern markup (or the homepage carved out of `sync:pages` and inserted once from the registered pattern). Without this, re-running `sync:pages` would overwrite the new homepage with the old block composition.

| Section | Core block structure | Data binding |
|---|---|---|
| **Hero** | `core/cover` (align full, `is-style-home-hero`) → `core/heading` (H1, `text-page-title-inverse`) + `core/paragraph` + `core/buttons` (primary + `is-style-inverse-glass` secondary) | Static copy in pattern |
| **Selected Work** | `core/query` (`namespace: hdc/selected-work`, postType `hdc_repo`, perPage 3) → `core/post-template` → group (`is-style-hdc-repo-card`) with meta row + `core/heading` (Post Title) + `core/paragraph` (summary) + footer + button; "No results" → empty-state copy | `core/post-meta` bindings (language, summary, updated_at, badge_label, source_badge, cta_label, url) |
| **Throughline** | `core/columns` (`1fr / 20rem`) → group `is-style-learning-paper` (`core/heading` + 4× `core/paragraph`) + group `is-style-hdc-quote-card` (icon + eyebrow + quote text + footer as core blocks, reusing the existing quote-card CSS — **not** a generic `core/quote`, since no surface style provides blockquote chrome) | Static copy in pattern |
| **Resume Snapshot** | `core/columns` (3/2) → group `is-style-ember-topography` (eyebrow + `core/heading` + paragraphs + badge group + `core/buttons`) + group `is-style-ember-strong` (`core/heading` + `core/list`) | Static copy in pattern (seeded from resume snapshot facts) |
| **Recent Writing** | `core/query` (postType `post`, perPage 3, orderby date desc) → `core/post-template` (`is-style-hdc-article-row`: `core/post-featured-image` + `core/post-title` + `core/post-excerpt` + meta) ; "No results" → empty-state copy | Native posts; `reading_time` post meta bound via `core/post-meta` |
| **Contact CTA** | `core/group` (`is-style-ember-veil`) → `core/heading` + `core/paragraph` + `core/buttons` (primary + outline) | Static copy in pattern |

The Selected Work card's excerpt slot is a `core/paragraph` **bound to the derived `summary` meta** (mirrors `whyItMatters || description`), not `core/post-excerpt`. All card meta values (language, updated date, badges, CTA label) render as core blocks bound to post meta through the native `core/post-meta` source — no per-render computation, because the sync already derived them. These bindings live **inside the Query Loop's `core/post-template`**, so they resolve against each queried `hdc_repo` (loop context), not the page; the static sections use **no** bindings.

`reading_time` is computed by reusing the existing `hdc_estimate_reading_time()` (220 wpm, `max(1, round())`) and stored as **`post`-type post meta**, which must be `register_post_meta( 'post', 'reading_time', [ 'show_in_rest' => true, … ] )` for the `core/post-meta` binding to resolve. It is (re)computed on `save_post` for `post` only, guarded against revisions/autosaves, with a one-time backfill for existing posts (they carry no meta until re-saved). `is-style-hdc-article-row` lays out gracefully **with or without** a featured image (no broken placeholder when a post has none).

## 7. Styling strategy

- Register the current skin as **block styles** carrying the existing CSS. Reusable card/row styles are `hdc-`prefixed: `is-style-hdc-repo-card`, `is-style-hdc-article-row`, `is-style-hdc-quote-card`, plus surface styles `is-style-learning-paper`, `is-style-ember-topography`, `is-style-ember-strong`, `is-style-ember-veil`, and a `is-style-hdc-section-divider`. `is-style-home-*` is reserved for home-only chrome (`is-style-home-hero`: gradient + noise backdrop, inverse tone).
- **Migrate to `theme.json`** the clean, tokenizable parts: section vertical rhythm (`spacing.blockGap`), the section-divider border, and color/typography presets the cards consume. Per WPDS rules, new properties use `--wpds-*` semantic tokens.
- Retain bespoke CSS only for non-tokenizable effects: the hero backdrop layers and surface textures. Most CSS is moved/renamed existing rules; net-new CSS is small.

## 8. What gets retired

- The 6 custom child blocks and their `view.js`/REST coupling; the `home-page` parent block + `hdc_build_home_page_child_block_markup()` legacy fallback.
- The homepage's runtime dependence on `hdc_get_home_content_data_contract()` and `repos.json`. Both remain as **one-time seeds**: the pattern copy is seeded from `hdc_get_home_content_data_contract()` (which reads `data/home-content.json`); the CPT is seeded from `repos.json` **+ `repo-case-study-details.json`** (the latter supplies `why_it_matters`, absent from `repos.json` — see §4).

**Retained:** `/v1/work`, `/v1/resume`, `/v1/blog` (used by Work/Resume/Blog pages); the data-contract functions (used elsewhere); `work-showcase/data/repos.json` **and `work-showcase/data/repo-case-study-details.json`** (still power the Work page + become the CPT seed).

## 9. Error handling, SEO, no-JS

Everything server-renders from synced/native data. No homepage client fetches, no `Loading…` states. Sync failure (incl. empty-`200`) → stale-but-present with an honest `source_badge` downgrade. Both Query Loops use their native "No results" inner block for empty states.

*Optional (out of core scope, not included by default):* a "Last synced Nd ago" line in the Selected Work header bound to `hdc_repo_sync_status` — would require a small custom binding source (binds to an option, not post meta), cutting against the pure-core grain. Add on request.

## 10. Testing & parity

- **Sync unit test** (`hdc_github_sync()` mapping/derivation, against a fixture worker response): curated-not-clobbered invariant; fork/archived filtering; **ordering comparator parity** (missing `featured_priority` → last, `updated_at` desc, alphabetical tiebreak — pick a fixture where priority is absent, since that's the common path); derived labels (incl. `source_badge` live vs fallback, and `summary` with empty `why_it_matters` → `description`); **empty-`200` guard preserves last-good cards** (assert Live tier unchanged, `source_badge` downgraded, nothing drafted); `github_id` upsert + rename (same id, new name → same post) + `name`-fallback path.
- **Seed test:** the two-file seed merge populates `why_it_matters` from `repo-case-study-details.json` (non-empty) and `display_name`/`featured`/etc. from `repos.json`.
- **Registration check:** CPT + all `hdc_repo` meta keys registered with `show_in_rest`; `topics` array schema/sanitizer; **`reading_time` registered on `post`** with `show_in_rest`.
- **Block-binding resolution test (the one to prove, not assume):** insert the "Home" pattern on a fresh page, render, and assert every Selected Work `core/post-meta` block resolves to `hdc_repo` field values (not empty / not the page's meta).
- **Playwright:** extend `smoke:browser` to assert 3 Selected Work cards + section headings render **server-side** (no `Loading…` in initial HTML). Update `scripts/playwright/home-parity.spec.cjs` + `scripts/playwright/browser-smoke.spec.cjs` for the new markup.
- Run `smoke:route` / `smoke:api` / `token_sync_audit` / `utility_sync_audit`.

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Core Query Loop can't order by `menu_order` from the UI | Precompute rank into `menu_order` + a `query_loop_block_query_vars` filter scoped by `namespace`. |
| **Block Bindings stripped/rebound on pattern insert** | Bindings live in the Query Loop post-template (loop context). De-risked by the explicit binding-resolution test (§10), run in Phase 1 before building the rest. |
| **Seed loses curated summaries** | `why_it_matters` is **not** in `repos.json`; seed merges `repo-case-study-details.json` too (§4/§8); seed test asserts non-empty. |
| **Ordering mis-ported (wrong 3 cards)** | Port the full comparator incl. missing-priority→last + alphabetical tiebreak (§4); unit-tested with a no-priority fixture. |
| Repo rename/transfer orphaning curated meta | Upsert by immutable `github_id` (worker exposes `id`); rename updates the slug, keeps the post + curated meta. |
| Worker not yet redeployed with `id` | Sync falls back to `name`-match + warning until `github_id` is present. |
| Empty/failed sync | Can't blackout the section (curated-derived `post_status` + retained-on-missing); guard keeps Live tier, downgrades `source_badge`, flags `fallback`/`fallback-empty`. |
| Curation edits lag the cron | `save_post_hdc_repo` calls the same reconcile routine as cron → immediate `post_status`/rank update (§4-5). |
| `sync:pages` overwrites the new homepage | Update `scripts/sync_page_sources.php` to emit the core-block pattern (or carve out the homepage) — §6, Phase 2. |
| Sync clobbers curation | Invariant (§4): sync never overwrites the editor-owned curated fields (`featured`/`featured_priority`/`why_it_matters`/`display_name`/`access`); the `origin`/`description` parity exceptions are deliberate; covered by the curated-not-clobbered unit test. |
| Recent Writing looks sparse / no image | Accepted (low real-post count); `is-style-hdc-article-row` degrades without an image. |
| Dual repo source of truth (Work page vs homepage CPT) | Accepted under scope; Work page keeps `repos.json` + client fetch. Two derivation impls (TS + PHP) to keep in sync; revisit unifying Work onto the CPT later. |
| WPDS token drift | New props use `--wpds-*`; run `token_sync_audit` / `utility_sync_audit`. |

## 12. Phased rollout

- **Phase 0 — Worker (cross-repo prerequisite):** add `id` to `sanitizeGitHubRepo()` in `/home/dev/henry-s-digital-canvas/worker/routes/github.ts` (`:402-430`); deploy. (WP sync has a `name`-fallback so this can land in parallel.)
- **Phase 1 — Data layer + Selected Work:** `hdc_repo` CPT + meta (incl. `github_id`, `topics` array), **two-file seed** (`repos.json` + `repo-case-study-details.json`), `hdc_github_sync()` + the shared reconcile routine + cron + `save_post_hdc_repo` hook + `wp hdc sync-repos`, the **exact ordering comparator** (§4), Selected Work Query Loop + `core/post-meta` bindings + `is-style-hdc-repo-card`, namespace order filter. **Run the binding-resolution test first.** Sync unit (incl. comparator + empty-`200` + seed) + registration tests.
- **Phase 2 — Static patterns + styling:** Hero / Throughline / Resume Snapshot / Contact as core-block patterns; register block styles; migrate clean styling into `theme.json`; assemble the "Home" pattern; **update `scripts/sync_page_sources.php` to own the new homepage `post_content`** (§6); retire the parent wrapper + fallback.
- **Phase 3 — Recent Writing + retirement:** Recent Writing Query Loop + `reading_time` meta (`register_post_meta` on `post` + `save_post` compute + one-time backfill, reuse `hdc_estimate_reading_time()`); delete the 6 custom blocks and update **every** referrer found in the audit — `functions.php`, `inc/home-page-blocks.php`, `scripts/api_smoke.sh`, `scripts/no_important_audit.sh`, `scripts/playwright/browser-smoke.spec.cjs`, `scripts/playwright/home-parity.spec.cjs`; final parity pass.
- **Follow-up:** correct CLAUDE.md (WP 6.9.4 → 7.1-alpha-62456 / GB 23.3.0); consider a parity guard/cross-reference tying the PHP `getHomeRepo*` ports to their React originals (no automated drift check today, unlike the CSS token audits).

## 13. Appendix — field mapping (`RepoData` → `hdc_repo` meta)

| `RepoData` (React) | `hdc_repo` meta | Tier |
|---|---|---|
| `id` (GitHub) | `github_id` (int) — upsert key | identity |
| `name` | post **slug** (title carries `display_name`) | (post field) |
| `displayName` | `display_name` | curated |
| `description` | `description` | curated-preferred¹ |
| `whyItMatters` | `why_it_matters` | curated |
| `language` | `language` | live |
| `stars` / `forks` | `stars` / `forks` | live |
| `updatedAt` | `updated_at` (+ `post_date`) | live |
| `url` | `url` | live |
| `topics` | `topics` (array) | live |
| `featured` | `featured` (→ `post_status`) | curated |
| `featuredPriority` | `featured_priority` (→ `menu_order` rank) | curated |
| `origin` | `origin` | live-promoted² |
| `access` | `access` | curated |
| — (derived) | `summary`, `badge_label`, `source_badge`, `cta_label`, `last_sync_source` | derived |

> **Seed sources (rev. 3):** curated values come from `repos.json` **except** `why_it_matters`, which comes from `repo-case-study-details.json`. `id` comes from the live worker response (Phase 0). Derived values are computed at sync.
>
> **Tier reconciliation (rev. 4):** ¹ `description` is curated-preferred (live fills only when empty); ² `origin` is live-promoted (`github` when live-present, else the seeded curated value) — see §4 footnotes. The post **title** carries `display_name`; the **slug** carries `name`.

## 14. Post-review revisions (rev. 2)

Changes from design review: excerpt slot bound to derived `summary` (not `core/post-excerpt`); `menu_order` reclassified sync-owned, `page-attributes` dropped; upsert keyed on immutable `github_id` via a 1-line worker change (verified the worker doesn't expose `id` today; `name`-keying isn't rename-stable); `archived` dropped from the meta model; empty-`200` soft-fail guard added; explicit Block-Bindings resolution test added and run first in Phase 1; `is-style-hdc-article-row` degrades without a featured image; `reading_time` reuses the canonical `hdc_estimate_reading_time()` (220 wpm — not 200); reusable block styles `hdc-`prefixed; throughline quote built as a bespoke styled group (verified no surface style provides blockquote chrome); `topics` flagged as the only array meta; seed reads via the contract function; 5s fetch timeout pinned; concrete Phase-3 reference-audit deletion list; CLAUDE.md version follow-up.

## 15. Post-review revisions (rev. 3)

Changes from the second design review (all verified against `/home/dev/wp-hperkins-com` and `/home/dev/henry-s-digital-canvas`):

- **Seed source corrected (was a latent parity regression):** `why_it_matters` is absent from `repos.json` (0 occurrences); the curated copy (23 entries) lives in `repo-case-study-details.json`. The CPT seed now merges both files (§2, §4, §8, §13).
- **Ordering comparator pinned:** missing `featured_priority` → `Number.MAX_SAFE_INTEGER` (sorts last — the common case here, since only 2–3 repos set a priority), then `updated_at` desc (null→epoch), then alphabetical tiebreak (`Home.tsx:86-96`, `work-utils.ts:109`). §4/§5/§10.
- **Empty-`200`/failed-sync risk re-characterized:** it cannot blacken the section (curated-derived `post_status` + retain-on-missing); the guard's real job is honest `source_badge` + no stale-as-live + no re-rank on empty (§5, §11).
- **Immediate curation reconciliation:** a `save_post_hdc_repo` hook shares the cron's rank+status routine so admin edits don't lag an hour (§4, §5).
- **`reading_time` registration + backfill** spelled out (register on `post`, guard revisions/autosaves, backfill existing posts) (§6, §10).
- **Homepage page-record ownership:** `scripts/sync_page_sources.php` must emit the new core-block markup or it will overwrite the homepage on the next `sync:pages` (§6, §12).
- **`summary` porting note:** keep `||`/`empty()` semantics (not a literal `??`) because unset WP meta is `''` (§5).
- **Verified non-issues folded in:** `/api/github/repos` needs no client auth and defaults to `per_page=100` (matches the client) — sync needs no credentials/pagination; `sanitizeGitHubRepo()` confirmed to omit `id` (Phase 0 justified) while returning several homepage-ignored extra fields (§2).
- **Minor fixes:** §1 child order (selected-work before throughline); home page resolved via `page_on_front`, not a hard-coded ID 4; WP version precise (`7.1-alpha-62456` / GB `23.3.0`) with a note that the relied-on features are GA in stable core; admin editing-surface caveat for typed/array meta; dual source-of-truth + helper-drift notes (§4, §6, §11, §12).

## 16. Post-planning revisions (rev. 4)

Surfaced while writing the Phase-1 implementation plan and tracing `mapGitHubRepos` (`src/hooks/useGitHubRepos.ts:104-170`): the §4 tier table diverged from the source-of-truth merge on two parity-affecting fields. Reconciled here so the data model matches `Home.tsx` (the hard parity constraint):

- **`description` reclassified Curated → curated-preferred:** React resolves `localRepo.description || api.description`, so the curated `repos.json` description wins. The sync now fills `description` from live **only when empty** (effectively on create) and never clobbers a non-empty / admin value (§4 footnote ¹, §5 step 3, §13).
- **`origin` reclassified Curated → live-promoted:** React's `mapGitHubRepos` hardcodes `origin: 'github'` for every live-present repo; curated-only repos keep their seeded origin. The sync now sets `origin = github` for live-present repos. This is what makes the #1 featured card (`tarot`: seeded `origin: 'curated'` + a github URL) resolve to "Live GitHub" / "View project" — matching React (§4 footnote ², §5 step 3, §13).
- **Invariant updated** to name the editor-owned curated fields explicitly (`featured`, `featured_priority`, `why_it_matters`, `display_name`, `access`) and to declare the `origin` / `description` exceptions deliberate (§4).
- **§4 ↔ §6 title/slug reconciled:** the post **title** carries the derived `display_name` (so the Selected Work `core/post-title` block renders the display name) and the **slug** carries `name` (§4, §5 step 3, §13).
