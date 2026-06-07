# Red Signals Investigation

Investigated the red signals. There are two separate issues.

## Cloudflare check

The failed check on `main` is `Workers Builds: wp-hperkins-com`, external id `eb898f01-0182-4c92-aae8-ce7bb3563d8e`.

Root cause: it is tied to a stale Cloudflare Worker service named `wp-hperkins-com`, not the real deployed Worker. Evidence:

- `/home/dev/wp-hperkins-com` has no root `package.json`, no root `wrangler.*`, and no root GitHub workflow.
- The real Worker repo is `/home/dev/henry-s-digital-canvas`.
- That real Worker passed `lint`, `877` tests, `build`, and `wrangler deploy --dry-run`.
- `wrangler deployments list --name henrys-digital-canvas` shows active Wrangler deployments, latest from June 5.
- `wrangler deployments list --name wp-hperkins-com` shows only two old dashboard-template uploads from April 24.

Fix path: disable/delete the stale Cloudflare Builds trigger or stale `wp-hperkins-com` Worker service in Cloudflare. I did not delete it because that is destructive. A current Wrangler credential can inspect Worker deployments and confirms the stale service, but the Cloudflare MCP/direct Builds API path still fails with `12006: Invalid token`, so I could not inspect/remove the Builds trigger through the Builds API.

Latest non-destructive check:

- `npx wrangler whoami` in `/home/dev/henry-s-digital-canvas` succeeds for the Henry Flare account.
- `npx wrangler deployments list --name wp-hperkins-com` still shows only the two April 24 dashboard uploads.
- `npx wrangler deployments status --name wp-hperkins-com` shows the active deployment as the April 24 upload.
- `npx wrangler deployments list --name henrys-digital-canvas` still shows active real Worker deployments, latest from June 5.
- `npx wrangler delete wp-hperkins-com --dry-run` makes no changes and only reports that dry-run exited.

## Dependabot/security

GitHub had `35` open Dependabot alerts, all in `wp-content/themes/henrys-digital-canvas/package-lock.json`. Local `npm audit` initially reported `27` vulnerability nodes: `14 high`, `13 moderate`.

There is an open Dependabot PR #9, but it is stale and unsafe to merge as-is:

- It is based on old commit `081978470`.
- Against current `main`, it would revert the just-merged homepage/hobbies work.
- Its lockfile update would reduce audit from `27` to `17`, but not clear all alerts. Remaining issues are mostly dev-tool transitive dependencies under `@wordpress/scripts`.

Local remediation from current `main`:

- Updated `@playwright/test` from `^1.58.2` to `^1.60.0`.
- Updated `@wordpress/scripts` from `^31.6.0` to `^31.8.0`, not `32.x`, because `32.x` moves this repo to the ESLint 10 line and breaks the existing lint setup.
- Added targeted npm overrides for vulnerable transitive dev-tool packages:
  - `@typescript-eslint/typescript-estree` -> `minimatch@9.0.7`
  - `copy-webpack-plugin` -> `serialize-javascript@7.0.5`
  - `markdownlint-cli` -> `minimatch@3.1.5`
  - `sockjs` -> `uuid@11.1.1`
  - `webpack-dev-server` -> `5.2.4`
- Adjusted the theme `webpack.config.js` to normalize the inherited `@wordpress/scripts` dev-server proxy shape for `webpack-dev-server@5`.

Verification:

- `npm audit --json` now reports `0` vulnerabilities.
- `npm run build` passes.
- `timeout 25s npm run start -- --hot` boots webpack-dev-server, compiles successfully, and exits only because of the timeout.
- `git diff --check` passes.
- `npm run lint:js` still fails on the repo's existing lint baseline with `7739` problems, mostly Prettier and legacy JS style issues in existing theme/smoke files. This is separate from the dependency audit remediation.

The pre-existing dirty worktree is still preserved. Files changed for this remediation are `package.json`, `package-lock.json`, `webpack.config.js`, and this investigation note.
