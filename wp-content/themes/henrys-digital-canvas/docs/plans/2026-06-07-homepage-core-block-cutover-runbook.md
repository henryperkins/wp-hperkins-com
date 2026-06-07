# Homepage Core-Block Sync — Cutover / Finalize Runbook (Phases 1–3)

- **Date:** 2026-06-07
- **Status:** Active — finalize/close-out of an *already-live* deploy (NOT a flip-to-core cutover).
- **Topic:** Close out Phases 1–3 of the homepage core-block sync, which are already serving production.
- **Related:** `ACTIVE_PLANS.md`, `2026-06-04-homepage-core-block-sync-design.md`, phase plans `0/1/2/3`, `../CUTOVER_CHECKLIST.md`
- **WP-CLI path (live root):** `wp --path=/home/dev/wp-hperkins-com …` (CLAUDE.md's `/home/ubuntu` is stale).
- **Execution:** A1 backup + A2 verification (all green) done 2026-06-07; A3 home-core committed on branch `chore/home-core-finalize` (hobbies + work-showcase deferred to their own PRs); A6 doc updates (ACTIVE_PLANS, CLAUDE.md, design) applied.

## 0. Current live state — verified 2026-06-07

This checkout **is** production: `siteurl` = `home` = `https://wp.hperkins.com`. The live site serves the new core-block homepage. Phases 1–3 are already deployed:

| Phase | Live evidence | Status |
|---|---|---|
| 0 — worker `id` | `hdc_repo_sync_status` = `source:live, fetched:94, applied:46, skipped:0` | ✅ live |
| 1 — CPT + sync + Selected Work | `hdc_repo` CPT seeded 48 posts; hourly cron `hdc_sync_repos`; front page has `core/query` `namespace:"hdc/selected-work"`; 24 `is-style-hdc-repo-card` on live HTML | ✅ live |
| 2 — patterns + styling + record | front-page record (page 4) = pure core blocks, **0** `home-*` custom blocks; `is-style-home-hero/ember-*/learning-paper` in use | ✅ live |
| 3 — Recent Writing + retirement | `reading_time` registered (`subtype=post`, `show_in_rest:true`); REST returns `"reading_time":"1 min read"`; backfill option set; 6 child blocks deleted | ✅ live |

**The real exposure:** production runs **uncommitted code** — `git status` shows 21 modified + 20 untracked files, all executing on prod (docroot = this working tree). `main` is clean at `081978470`; the live changes sit on top, uncommitted. A `git checkout .` / `git stash` / `git clean` / box rebuild would revert the live site and delete the untracked images. "Deploy" therefore means **commit what's already serving prod** — not push code to prod.

The uncommitted set spans three concerns; only the first is Phases 1–3:

- **Home-core (P1–3):** `assets/css/home-{core,sections}.css`, `inc/home-core/{home-patterns,markup,query-loop,repo-cpt,repo-logic}.php`, `scripts/playwright/home-parity.spec.cjs`, `tests/repo-logic-test.php` (9 code files; **no images** — the surface webp belong to work-showcase).
- **Hobbies (separate):** `blocks/hobbies-moments/*`, `data/moments.json`, `inc/data-contracts.php` (moments media), `scripts/sync_page_sources.php` (hobbies block `align:full`), + untracked `assets/images/hobbies/*` (16).
- **Work-showcase (separate):** `blocks/work-showcase/{style.css,view.js}` + `data/{repos,repo-case-study-details}.json` (the JSON also seeds the CPT, so it straddles home + work) + untracked `assets/images/backgrounds/theme-surface-*-light*.webp` (4, referenced by `work-showcase/style.css`).

## A. Finalize the live deploy

### A1 — Back up first
```bash
WP="wp --path=/home/dev/wp-hperkins-com"
mkdir -p /home/dev/db-backups
$WP db export "/home/dev/db-backups/wp-hperkins-pre-finalize-$(date +%F).sql"   # outside the repo
git -C /home/dev/wp-hperkins-com tag prod-known-good-081978470 081978470        # rollback anchor
```

### A2 — Verify the already-live state (read-only)
```bash
WP="wp --path=/home/dev/wp-hperkins-com"
cd /home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
php tests/repo-logic-test.php
$WP eval-file tests/registration-check.php
$WP eval-file tests/selected-work-binding-test.php
$WP eval-file tests/post-reading-time-test.php
$WP eval-file tests/sync-observability-test.php

BASE_URL=https://wp.hperkins.com npm run smoke:route
RUN_FRONT_PAGE_SHAPE_CHECK=1 BASE_URL=https://wp.hperkins.com npm run smoke:api
RUN_HOME_PARITY=1            BASE_URL=https://wp.hperkins.com npm run smoke:browser
./scripts/stylebook_audit.sh
./scripts/token_sync_audit.sh   ~/henry-s-digital-canvas/src/index.css
./scripts/utility_sync_audit.sh ~/henry-s-digital-canvas/src/index.css
```
All must pass before committing — you are certifying what already serves traffic.

### A3 — Commit + push what's live (branch first, logical groups)
```bash
git switch -c chore/home-core-finalize
git diff --stat
```
Stage in separate commits (review each `git diff <file>` first):
1. **Phases 1–3 home-core** — the 9 home-core PHP/CSS/test/spec files only (no images).
2. **Hobbies** — `blocks/hobbies-moments/*`, `data/moments.json`, `inc/data-contracts.php`, `scripts/sync_page_sources.php`, + `git add assets/images/hobbies/`.
3. **Work-showcase** — `blocks/work-showcase/{style.css,view.js}` + `data/*.json` + `git add` the 4 `backgrounds/theme-surface-*-light*.webp`.
4. **Ops logs** — `ops/smoke-history.log` + new cadence log (and `.gitignore` the generated `ops/stylebook-audit/` artifacts).

> If a *converted* block's `src/` changed, run `npm run build` and commit `build/`. Home-core is patterns/PHP — no build.

```bash
git push -u origin chore/home-core-finalize   # PR triggers .github/workflows/smoke-check.yml
```

### A4 — Reconcile prod to the merge
```bash
WP="wp --path=/home/dev/wp-hperkins-com"
git -C /home/dev/wp-hperkins-com switch main && git -C /home/dev/wp-hperkins-com pull --ff-only
$WP cache flush && $WP rewrite flush
```
Re-run A2's smoke trio.

### A5 — Sign-off
```bash
RUN_LABEL=home-core-finalize npm run smoke:cadence
npm run smoke:history
cp ops/smoke-report-template.md ops/smoke-report-2026-06-07-home-core-finalize.md   # fill in results
```

### A6 — Clear stale docs
- `ACTIVE_PLANS.md` → Phases 1–3 "Complete locally" → "Complete live" (this date).
- `CLAUDE.md` → WordPress 6.9.4 → 7.1-alpha-62469; Gutenberg 23.3.2; `--path=/home/ubuntu` → `/home/dev`.
- `2026-06-04-homepage-core-block-sync-design.md` §0/header → drop "Phase 3 has no plan / design-only".
- Optional: parity guard tying the PHP `getHomeRepo*` ports to their React originals.

## B. Rollback (if verification fails)
```bash
WP="wp --path=/home/dev/wp-hperkins-com"
$WP db import "/home/dev/db-backups/wp-hperkins-pre-finalize-$(date +%F).sql"   # only on content/record regression
git -C /home/dev/wp-hperkins-com stash -u                                       # park live changes (incl. untracked)
git -C /home/dev/wp-hperkins-com checkout prod-known-good-081978470
$WP cache flush && $WP rewrite flush
```
Full host-level steps in `../CUTOVER_CHECKLIST.md` §Rollback.

## C. Clean-room redeploy reference (DR / fresh environment only)
**Do NOT run on the current prod — the CPT is already seeded.**
```bash
# 1. deploy theme code + activate theme → inc/home-core/bootstrap.php registers CPT, cron, meta
wp hdc seed-repos     # 2. one-time seed (idempotent, upserts by github_id)
wp hdc sync-repos     # 3. first live pull (else wait for hourly cron)
cd wp-content/themes/henrys-digital-canvas && npm run sync:pages   # 4. write Home pattern into front-page record
wp cache flush && wp rewrite flush                                 # 5. flush
BASE_URL=<env-url> npm run smoke:full                              #    verify
```
`seed-repos` upserts by immutable `github_id` (no duplicates); `sync:pages` is the only safe way to rewrite page 4 (never hand-edit it); the empty-`200` sync guard keeps last-good cards on a worker outage.

## D. Open decisions
1. Branch + PR (recommended) vs. commit straight to `main` (repo's historical pattern; prod = the `main` checkout).
2. Do hobbies + work-showcase ride this finalize, or split into their own PRs? They are not Phases 1–3.
