# Homepage Core-Block Sync — Phase 0 Implementation Plan (Worker `id` field)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose the immutable numeric GitHub repo `id` from the hperkins.com worker's `/api/github/repos` response so the WordPress sync can key on it (rename/transfer-stable) instead of falling back to repo `name`.

**Architecture:** Three tiny additions to `sanitizeGitHubRepo()` and its two local types in `worker/routes/github.ts`, covered by a Vitest test that drives the real route with a mocked GitHub `fetch`. Then deploy via Wrangler and verify live against the exact WordPress sync URL. Finally, a WordPress-side observability touch-up so the sync's status distinguishes raw fetched repos, post-filter attempted repos, applied repos, and skipped repos (skips drop to 0 once `id` is flowing and the exact sync URL is no longer stale).

**Tech Stack:** Cloudflare Worker (TypeScript), Vitest, Wrangler; plus a small PHP change in the theme's `inc/home-core/sync.php`.

---

## Why this matters / current state

Verified in the worker repo: `sanitizeGitHubRepo()` (`worker/routes/github.ts:402-430`) returns 23 keys and **no `id`**. The WordPress Phase-1 sync therefore can't match by immutable id and uses a `name` fallback, **silently skipping ~25 non-curated live GitHub repos every cron run** (they have no `github_id` and no seeded post to name-match). This plan closes that: once the worker returns `id`, the sync matches/creates by `github_id` and the skips go to 0.

This is a **cross-repo** plan:
- **Tasks 1–2** are in the **worker repo**: `/home/dev/henry-s-digital-canvas`.
- **Task 3** is in the **theme repo**: `/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas` (it consumes the worker change and improves sync observability — closes follow-up #17).

The WordPress sync already has a `name`-fallback, so Phase 0 is **not blocking** for Phase 1/2 — it's an enhancement. Tasks 1–2 can land independently of Task 3.

## Before you start (worker repo)

```bash
cd /home/dev/henry-s-digital-canvas
git checkout -b feat/worker-expose-repo-id
```

## File Structure

| File | Change | Task |
|---|---|---|
| `worker/routes/github.ts` | Add `id` to `GitHubRepoPayload` (`:14-36`) + `GitHubRepoResponse` (`:77-99`) + the `sanitizeGitHubRepo()` return (`:402-430`) | 1 |
| `src/test/github-worker-id.test.ts` | New Vitest test driving `GET /api/github/repos`, asserting `id` is in the response | 1 |
| *(deploy)* `wrangler deploy` via `npm run cf:deploy` | Ship to production `hperkins.com` | 2 |
| `wp-content/.../inc/home-core/sync.php` (theme repo) | Record raw `fetched`, post-filter `attempted`, `applied`, and derived `skipped` counts in `hdc_repo_sync_status` + surface them in the WP-CLI message | 3 |

---

## Task 1: Add `id` to the worker repos response (TDD)

**Files (worker repo `/home/dev/henry-s-digital-canvas`):**
- Create: `src/test/github-worker-id.test.ts`
- Modify: `worker/routes/github.ts` (`GitHubRepoPayload` ~14-36, `GitHubRepoResponse` ~77-99, `sanitizeGitHubRepo` ~402-430)

> Vitest's config globs `src/**/*.{test,spec}.{ts,tsx}` only (not `worker/`), and `sanitizeGitHubRepo` is not exported — so the test lives under `src/test/` and drives the route end-to-end via the default worker export + a mocked global `fetch`, matching the existing `src/test/github-worker-*.test.ts` convention.

- [ ] **Step 1: Write the failing test**

`src/test/github-worker-id.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

import worker from "../../worker/index.ts";

function createEnv(overrides: Record<string, unknown> = {}) {
	return {
		GITHUB_REPO_OWNER: "henryperkins",
		ASSETS: { fetch: vi.fn() },
		...overrides,
	};
}

describe("worker /api/github/repos exposes the immutable id", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("includes the numeric id in each sanitized repo", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify([
					{
						id: 901234567,
						name: "tarot",
						description: "Tarot app",
						language: "JavaScript",
						stargazers_count: 5,
						forks_count: 2,
						open_issues_count: 1,
						pushed_at: "2026-05-01T00:00:00Z",
						created_at: "2025-01-01T00:00:00Z",
						html_url: "https://github.com/henryperkins/tarot",
						topics: ["ai"],
						fork: false,
						archived: false,
					},
				]),
				{ status: 200, headers: { "content-type": "application/json" } },
			),
		);
		vi.stubGlobal("fetch", fetchMock);

		const response = await worker.fetch(
			new Request("https://hperkins.com/api/github/repos?username=henryperkins&per_page=100&page=1"),
			createEnv(),
		);
		const payload = await response.json();

		expect(response.status).toBe(200);
		expect(Array.isArray(payload)).toBe(true);
		expect(payload[0].id).toBe(901234567);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/dev/henry-s-digital-canvas && npx vitest run src/test/github-worker-id.test.ts`
Expected: FAIL — `expect(payload[0].id).toBe(901234567)` receives `undefined` (the worker doesn't return `id` yet).

- [ ] **Step 3: Add `id` to `GitHubRepoPayload`**

In `worker/routes/github.ts`, in the `GitHubRepoPayload` type (around line 14), add the `id` field (every other field here uses `unknown`):

```ts
type GitHubRepoPayload = {
	id?: unknown;
	archived?: unknown;
```

(Insert the `id?: unknown;` line as the first property; the rest of the type is unchanged.)

- [ ] **Step 4: Add `id` to `GitHubRepoResponse`**

In the `GitHubRepoResponse` type (around line 77), add:

```ts
type GitHubRepoResponse = {
	id: number;
	archived: boolean;
```

(Insert `id: number;` as the first property; the rest unchanged.)

- [ ] **Step 5: Map `id` in `sanitizeGitHubRepo`**

In `sanitizeGitHubRepo()` (around line 405), add the `id` mapping as the first returned key, using the same `Number.isFinite(...) ? Number(...) : 0` idiom the function already uses for `size`/`stargazers_count`/etc.:

```ts
	return {
		id: Number.isFinite(payload.id) ? Number(payload.id) : 0,
		name: typeof payload.name === "string" ? payload.name : "",
```

(The remaining returned keys are unchanged.)

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/test/github-worker-id.test.ts`
Expected: PASS (`payload[0].id` is `901234567`).

- [ ] **Step 7: Run the full worker test suite (no regressions)**

Run: `npm test`
Expected: all tests pass (the new test included; no existing test asserts the exact key set, so adding `id` is non-breaking).

- [ ] **Step 8: Commit**

```bash
cd /home/dev/henry-s-digital-canvas
git add worker/routes/github.ts src/test/github-worker-id.test.ts
git commit -m "feat(worker): expose immutable repo id from /api/github/repos

Lets the wp.hperkins.com homepage sync key hdc_repo on the immutable
github id (rename/transfer-stable) instead of the name fallback.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Deploy to production + verify live

> **OUTWARD-FACING / PRODUCTION DEPLOY.** This publishes to the live `hperkins.com` worker. Get explicit go-ahead before running the deploy. `npm run cf:deploy` runs an auth check, lint, the full test suite, and a build before `wrangler deploy`, so it will not ship if anything is red.

**Files:** none (deploy + verification only).

- [ ] **Step 1: Deploy**

Run: `cd /home/dev/henry-s-digital-canvas && npm run cf:deploy`
Expected: auth check passes → lint passes → tests pass → build → `wrangler deploy` uploads to `wrangler.jsonc` target (worker `henrys-digital-canvas`, domain `hperkins.com`). Ends with a successful deployment URL/line.

- [ ] **Step 2: Verify the live endpoint now returns `id` on the exact sync URL**

Run:
```bash
SYNC_QUERY='per_page=100&username=henryperkins'

# Cache-busted proof that the deployed worker code can emit id.
curl -s "https://hperkins.com/api/github/repos?${SYNC_QUERY}&_verify=$(date +%s)" | jq '.[0] | {id, name}'

# Exact URL shape used by wp.hperkins.com hdc_github_sync().
curl -s "https://hperkins.com/api/github/repos?${SYNC_QUERY}" | jq '.[0] | {id, name}'
```
Expected: both commands return a JSON object with a **positive integer** `id` and the repo `name`, e.g. `{ "id": 901234567, "name": "..." }`. The second command is mandatory because Cloudflare caches successful GET responses by request URL (`s-maxage=300`), and WordPress syncs this exact query shape. If the cache-busted command has `id` but the exact sync URL is still stale, purge the Cloudflare cache for that URL or wait for `s-maxage` expiry and retry before marking Task 2 verified.

- [ ] **Step 3: Merge/finish the worker branch**

Use the team's normal flow for the worker repo (this plan doesn't prescribe it). Typically: merge `feat/worker-expose-repo-id` → the worker repo's main, or open a PR. The production change is already live from Step 1; the branch merge is bookkeeping.

---

## Task 3: WordPress sync — consume `id` + add full sync observability (theme repo)

> Closes follow-up **#17**. Run this in the **theme repo** `/home/dev/wp-hperkins-com`. The Phase-1 sync already prefers `github_id` matching, so once Task 2 is live the sync auto-upgrades to id-keying; this task makes that observable and verifies it.

**Files (theme repo):**
- Modify: `wp-content/themes/henrys-digital-canvas/inc/home-core/sync.php` (the `hdc_github_sync()` loop + the status `update_option` + the WP-CLI success line)

- [ ] **Step 1: Branch (theme repo)**

```bash
cd /home/dev/wp-hperkins-com
git checkout -b feat/sync-id-observability
```

- [ ] **Step 2: Count fetched, attempted, applied, and skipped in `hdc_github_sync()`**

In `inc/home-core/sync.php`, inside `hdc_github_sync()`: record the raw upstream count before fork/archive filtering, treat `count( $kept )` as the attempted live rows after filtering, increment `$applied` after a repo is written, then derive `$skipped` after the loop as `attempted - applied`. Deriving `skipped` covers every non-applied branch, including malformed rows, no-id/no-name rows, and `wp_insert_post()` failures.

Add after the decoded live array has passed the empty-response guard and before `$kept` is assigned:

```php
	$fetched = count( $live );
```

Add before the loop (right after the `hdc_repo_suppress_begin();` line):

```php
	$attempted = count( $kept );
	$applied   = 0;
```

At the very end of a successful per-repo iteration (immediately after the `hdc_repo_write_derived( $post_id, $merged, true );` line), add:

```php
		$applied++;
```

After the loop and after `hdc_repo_reconcile();`, derive the skipped count:

```php
	$skipped = max( 0, $attempted - $applied );
```

- [ ] **Step 3: Record the counts in the status option + CLI message**

Change the success `update_option( 'hdc_repo_sync_status', ... )` call to include raw `fetched`, post-filter `attempted`, `applied`, and derived `skipped`. Keep `count` as the existing post-filter count for backward compatibility:

```php
	update_option(
		'hdc_repo_sync_status',
		array(
			'time'      => time(),
			'source'    => 'live',
			'count'     => $attempted,
			'fetched'   => $fetched,
			'attempted' => $attempted,
			'applied'   => $applied,
			'skipped'   => $skipped,
		),
		false
	);
```

And change the function's return to carry them:

```php
	return array(
		'source'    => 'live',
		'count'     => $attempted,
		'fetched'   => $fetched,
		'attempted' => $attempted,
		'applied'   => $applied,
		'skipped'   => $skipped,
	);
```

Then update the WP-CLI `sync-repos` success line to surface them:

```php
			$result = hdc_github_sync();
			WP_CLI::success( sprintf(
				'Sync complete: source=%s, fetched=%d, attempted=%d, applied=%d, skipped=%d.',
				$result['source'],
				(int) ( $result['fetched'] ?? $result['count'] ?? 0 ),
				(int) ( $result['attempted'] ?? $result['count'] ?? 0 ),
				(int) ( $result['applied'] ?? 0 ),
				(int) ( $result['skipped'] ?? 0 )
			) );
```

(The fallback path's `return`/`update_option` may keep its existing `{source, count}` shape, but setting `fetched`, `attempted`, `applied`, and `skipped` to `0` there is also acceptable. CLI readers must treat those keys as optional on fallback.)

- [ ] **Step 4: Run the sync and verify id-keying + honest counts**

Run:
```bash
wp --path=/home/dev/wp-hperkins-com hdc sync-repos
wp --path=/home/dev/wp-hperkins-com option get hdc_repo_sync_status --format=json
```
Expected (after Task 2 is live and the exact sync URL is no longer stale): `Success: Sync complete: source=live, fetched=N, attempted=M, applied=M, skipped=0.` `fetched` is the raw worker array length, while `attempted`/`applied` are lower if forked or archived repos were filtered before sync. If Task 2 is NOT yet deployed, or if the exact sync URL still returns a cached payload without `id`, `skipped` will remain >0 — that's the honest pre-deploy/stale-cache state and confirms the counter works.

- [ ] **Step 5: Verify `github_id` is now populated on the seeded repos**

Run:
```bash
wp --path=/home/dev/wp-hperkins-com eval '
$id = hdc_repo_find_by_name("tarot");
echo "tarot github_id: ".(int) get_post_meta($id, "github_id", true)."\n";'
```
Expected: a **positive integer** (the immutable GitHub id), confirming the sync back-filled `github_id` via the live response.

- [ ] **Step 6: Commit**

```bash
cd /home/dev/wp-hperkins-com
git add wp-content/themes/henrys-digital-canvas/inc/home-core/sync.php
git commit -m "feat(home-core): record full sync counters in sync status

Surfaces raw fetched, post-filter attempted, applied, and skipped repo counts
per sync. Skips drop to 0 once the worker exposes repo id and the exact sync
URL is no longer stale. Closes follow-up #17.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:** Phase 0's sole requirement (design §12 Phase 0 + §4 line 41 + §13 line 222) is "add `id` to `sanitizeGitHubRepo()` and deploy" → Tasks 1–2. Follow-up #17 (sync observability) → Task 3. ✓

**Placeholder scan:** every code step shows the exact edit; every command shows expected output. No TBD/TODO. ✓

**Type/name consistency:** `id` added to both worker types + the mapper with the codebase's existing `Number.isFinite/Number` idiom; the WP status keys (`fetched`/`attempted`/`applied`/`skipped`) are used consistently in the `update_option`, the `return`, and the CLI message. ✓

**Cross-repo note:** Tasks 1–2 (worker) and Task 3 (theme) are independent commits on separate branches; Task 3's *verification* depends on Task 2 being live, but its *code* does not (the counters work regardless; `skipped` just reads >0 until the worker ships `id`).

---

## Execution Handoff

Plan complete and saved to `wp-content/themes/henrys-digital-canvas/docs/plans/2026-06-05-homepage-core-block-sync-phase-0-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks. Note Task 2 is a production deploy requiring explicit go-ahead.

**2. Inline Execution** — batch through tasks with checkpoints.

Which approach? (Task 2's deploy will need your explicit authorization regardless.)
