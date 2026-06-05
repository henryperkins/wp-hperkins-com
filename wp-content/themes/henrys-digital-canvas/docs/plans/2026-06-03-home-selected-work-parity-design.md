# Home — Selected Work Source-Parity Design (Batch C)

**Date:** 2026-06-03
**Block:** `henrys-digital-canvas/home-selected-work` (child of the dissected `home-page`)
**Source:** `Home.tsx` "Selected Work" section — lines 137–212, helpers 35–73, derivations 86–100 (`/home/dev/henry-s-digital-canvas/src/pages/Home.tsx`)
**Status:** design — pending plan (`superpowers:writing-plans`) and execution

> This is **Batch C** of the home-page parity sweep. Batches A (quick wins across hero/throughline/resume/contact) and B (recent-writing error state + image dimensions) are already implemented, verified, and live. This block was deferred because its fixes form a higher-risk, multi-file data-pipeline change that also touches shared infrastructure used by `work-showcase`.

## Goal

Bring `home-selected-work` to design + functional parity with the React "Selected Work" section. The verified parity check returned **NEEDS_WORK** (2 HIGH, 3 MEDIUM, 4 LOW). The root cause is that featured-repo selection diverges from source: the block uses a hard-coded name allow-list instead of the source's `featured → featuredPriority → updatedAt` algorithm, compounded by `featuredPriority`/`whyItMatters` being dropped in the data pipeline and a data-drift in `repos.json`.

## Locked decisions (from user)

1. **Match source exactly.** Remove the `featuredRepoNames` allow-list. Derive the top-N from `repos.filter(featured).sort(featuredPriority asc, then updatedAt desc).slice(0, repoCount)`.
2. **Remove dead config.** Delete the `sourceLiveLabel` / `sourceFallbackLabel` attributes (defined + editor-exposed but never rendered by `view.js`, and not present in source).

## Source behavior (the target)

```ts
// Home.tsx:86–96
const featuredRepos = repos
  .filter((r) => r.featured)
  .sort((a, b) => {
    const pa = a.featuredPriority ?? Number.MAX_SAFE_INTEGER;
    const pb = b.featuredPriority ?? Number.MAX_SAFE_INTEGER;
    if (pa !== pb) return pa - pb;
    return compareReposByUpdatedAtDesc(a, b);
  })
  .slice(0, 3);
```

Helpers (lines 35–73) — already mirrored correctly in the WP block per the parity check: `getHomeRepoBadge`, `getHomeRepoSourceBadge`, `getHomeRepoCtaLabel`, `getHomeRepoSummary` (`whyItMatters ?? description`).

In source `repos.ts`, only two featured repos carry an explicit `featuredPriority`: **`flavor-agent` (-1)** and **`tarot` (0)**. All other featured repos have no priority, so they sort among themselves by `updatedAt` desc. **Expected source top-3: `flavor-agent`, `tarot`, then the most-recently-updated featured repo.**

## Gaps to fix (from parity check)

| # | Sev | Gap | Location |
|---|-----|-----|----------|
| H1 | HIGH | Selection uses `featuredRepoNames` allow-list + file-order fill instead of source sort | `view.js:158–198` |
| H2 | HIGH | `featuredPriority` dropped in `normalizeRepoItem` (and `mapGitHubRepos`) so source sort is impossible | `assets/js/hdc-shared-utils.js:785–895` **(SHARED)** |
| M2 | MED | `render.php` repo whitelist omits `featuredPriority` + `whyItMatters` → never reach `data-config` | `render.php:64–77` |
| M3 | MED | `render.php` pre-filters the serialized snapshot to featured/named repos → breaks the sort's candidate pool | `render.php:48–82` |
| M4 | MED | Data drift: `flavor-agent` is `featured:false` + no `featuredPriority` in block `repos.json` (source: `featured:true`, `-1`) | `blocks/work-showcase/data/repos.json` |
| L6 | LOW | `whyItMatters` never populated, so summary always falls back to `description` (matches today, latent break) | `render.php` + normalizer |
| — | — | Remove `featuredRepoNames`, `sourceLiveLabel`, `sourceFallbackLabel` | block.json / render.php / index.js / home-content.json |

**Accepted drift (out of scope):** L7 trailing-slash `/work/{repo}/` href (correct for the MPA + rewrite), L9 skeleton internal layout (conveys same shape). L8 hover `translateY(-2px)` lift is optional polish — drop only if trivially clean.

## Regression-plan tension & resolution

The `2026-05-19-home-page-innerblocks-regression-remediation-plan.md` (Finding #5) **deliberately tightened** the serialized `data-config.initialRepos` payload to avoid embedding *every* repo from `repos.json`. Source-accurate sorting needs a candidate pool, not a pre-sliced list.

**Resolution:** emit **all `featured` repos** (not a 3-name allow-list, and not the entire repo file) into `initialRepos`, each carrying `featuredPriority`, `whyItMatters`, and `updatedAt`. The client then sorts + slices to `repoCount`. This keeps the payload tight (the regression plan's intent) **and** gives the sort the inputs it needs (parity's intent) — the two are compatible once "tight" means "all featured" rather than "three named."

## File-by-file change plan

1. **`blocks/work-showcase/data/repos.json`** (data re-sync — hand-edit; there is **no** automated repos→json sync, only `sync:pages` + audit scripts). Set `flavor-agent` → `featured: true`, `featuredPriority: -1`; confirm `tarot` → `featuredPriority: 0`. Leave other featured repos without `featuredPriority` (they sort by `updatedAt`), matching source. **SHARED with `work-showcase` — re-verify that block after.**
2. **`assets/js/hdc-shared-utils.js`** — `normalizeRepoItem` (785–833) + `mapGitHubRepos` (847–895): carry `featuredPriority` (number | undefined) and ensure `whyItMatters` survives normalization + the GitHub-merge path. **SHARED — additive, but re-verify `work-showcase`.**
3. **`blocks/home-selected-work/render.php`** — (a) add `featuredPriority` + `whyItMatters` to the repo field whitelist (64–77); (b) stop pre-filtering to featured/named (48–82) — serialize **all featured repos** as the candidate pool; (c) drop `featuredRepoNames` / `sourceLiveLabel` / `sourceFallbackLabel` handling.
4. **`blocks/home-selected-work/view.js`** — replace the allow-list selection (158–198) with the source algorithm (filter featured → sort `featuredPriority` asc then `compareReposByUpdatedAtDesc` → `slice(0, repoCount)`); remove the dead `sourceLiveLabel`/`sourceFallbackLabel` config from `parseConfig`. Keep `repoCount` (default 3). Bump `view.asset.php` version.
5. **`blocks/home-selected-work/block.json`** — remove `featuredRepoNames`, `sourceLiveLabel`, `sourceFallbackLabel` attributes; keep `repoCount`, `repoEndpoint`, `emptyTitle`, `emptyDescriptionLive`, `emptyDescriptionFallback`, `loadingLabel`.
6. **`blocks/home-selected-work/index.js`** — remove the editor (InspectorControls) for the dropped attributes.
7. **`data/home-content.json`** → `selectedWork`: remove `featuredRepoNames`, `sourceLiveLabel`, `sourceFallbackLabel` keys.
8. **Re-sync + caches.** The `selectedWork` attributes are **baked into the home page `post_content`** (verified for `contactCta` in Batch B — same builder). After block/content changes, run `npm run sync:pages` then `wp --path=/home/dev/wp-hperkins-com cache flush`, otherwise the stale baked `featuredRepoNames` persists on the live page.

## Risks

- **Shared normalizer.** `normalizeRepoItem`/`mapGitHubRepos` back `work-showcase` too. Changes are additive (new field pass-through) but **must** re-run the `work-showcase` parity-checker + browser-check `/work/` as a regression guard.
- **Hand-edited data.** `repos.json` edits must match source for `featured`/`featuredPriority`; verify rendered order.
- **Baked attributes.** Removing `featuredRepoNames` etc. from block/content is inert until `sync:pages` regenerates `post_content`.

## Verification

- Static: `node -c view.js`; `php -l render.php`; JSON validity (`block.json`, `repos.json`, `home-content.json`).
- WP-side (`wp eval-file`): selected-work `data-config` carries `featuredPriority` + `whyItMatters`; `initialRepos` contains all featured repos.
- `npm run smoke:route` + `npm run smoke:api`.
- `npm run sync:pages` + `wp cache flush`.
- Browser (`https://wp.hperkins.com/`): selected-work top-3 order = **flavor-agent, tarot, [most-recent featured]**; each card's icon/badges/source-badge/CTA label/summary correct; 0 console errors.
- **Regression guard:** re-run `parity-checker` for `home-selected-work` (expect PARITY/MINOR_DRIFT) **and** `work-showcase`; browser-check `/work/`.

## Definition of done

`home-selected-work` parity-checker returns PARITY or MINOR_DRIFT; `work-showcase` shows no regression; the live homepage renders the source-accurate top-3; no dead config remains; pages re-synced and caches flushed.
