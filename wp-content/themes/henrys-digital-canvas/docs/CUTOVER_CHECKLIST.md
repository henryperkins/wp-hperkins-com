# Henry's Digital Canvas Cutover Checklist

Last updated: 2026-04-03 (UTC)

## Scope
This checklist validates full-parity migration coverage for:
- `/`, `/work`, `/work/{repo}`
- `/resume`, `/resume/ats`
- `/hobbies`
- `/blog`, `/blog/{slug}`
- `/about`, `/contact`
- invalid route fallback (`404`)

## Pre-Cutover Checks
- Child theme active: `henrys-digital-canvas`.
- Required route pages published: `home`, `about`, `work`, `resume`, `resume/ats`, `hobbies`, `blog`, `contact`.
- Rewrite rules flushed after route/template updates.
- Dynamic route templates active:
  - `page-work-detail.php`
  - `page-blog-detail.php`

## Automated Smoke Checks
Run from theme directory:

```bash
npm install
npm run smoke:full
```

Expanded manual verification sequence:

```bash
npm run smoke:route
npm run smoke:api
npm run smoke:browser
./scripts/stylebook_audit.sh
./scripts/token_sync_audit.sh ~/henry-s-digital-canvas/src/index.css
./scripts/utility_sync_audit.sh ~/henry-s-digital-canvas/src/index.css
```

Expected result:
- Route script: all routes return expected status and expected block marker class.
- API script: all theme contract endpoints return HTTP 200 and contract field checks pass.
- Browser script: Playwright route + interaction regression tests pass.
- Stylebook audit: no parent-token leakage is reported.
- Token sync audit: `PASS` status and no token mismatches against source `index.css`.
- Utility sync audit: `PASS` status and no shared utility/keyframe drift against source `index.css`.

## Browser Regression Checks
Validated (desktop + mobile):
- Work compare/filter behavior and compare sheet controls.
- Hobbies category/timeframe query synchronization.
- Contact form validation state + successful submission state.
- Blog reading progress bar and scroll-to-top action.
- 404 recovery action (`Go Back`).
- Command palette keyboard shortcut (`Ctrl+K`) and dismiss (`Escape`).
- Mobile navigation open/close behavior.

## Style Book Regression Checks (Authenticated)
Validated in **Site Editor → Styles → Style Book** for both default and **Ember Dark**:
- Text primitives: paragraph, headings, code, quote, and pullquote render with child-theme typography/colors.
- Interactive primitives: button (including outline variation), links, and search controls match design tokens.
- Surface primitives: group/columns/column section variations no longer use inherited parent palette tokens.
- No parent-token leakage in merged global styles (`./scripts/stylebook_audit.sh` exits 0).

## Accessibility Smoke Checks
Validated:
- First keyboard tab stop lands on "Skip to content".
- Contact invalid submit sets `aria-invalid="true"` for required fields.
- Command palette opens/closes via keyboard controls.
- Theme toggle exposes semantic button control.

## Performance/Health Smoke Checks
Validated:
- Primary routes respond with expected status codes and sub-second response times in baseline checks.
- Contract APIs respond with HTTP 200 and low latency baseline.
- No blocking runtime errors detected in migrated route flows.
- Note: A console network error can appear while intentionally loading the 404 route because the document response is an expected HTTP 404.

## Rollback Plan
If a cutover regression is detected:

1. Restore known-good code snapshot for the child theme.
2. Re-activate known-good theme revision in WordPress.
3. Flush rewrite rules:
   ```bash
   wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com rewrite flush
   ```
4. Re-run route/API smoke checks.
5. If needed, roll back database/content using host backup or point-in-time restore.

## Post-Cutover Monitoring (First 24 Hours)
- Re-run route/API smoke scripts after any hotfix.
- Spot-check `/work/{repo}` and `/blog/{slug}` for permalink stability.
- Review web server/PHP logs for routing or REST endpoint errors.
- Confirm contact submissions continue returning success state.

## Verification Cadence and Ownership
- Same-day owner (`Engineering`): run `npm run smoke:full` immediately after deployment.
- Next-day owner (`Engineering`): rerun `npm run smoke:full` and spot-check high-traffic routes.
- Optional logging run: `RUN_LABEL=<window> npm run smoke:cadence` (records output in `ops/`).
- Optional history summary: `npm run smoke:history`.
- Use `ops/smoke-report-template.md` for every cadence report snapshot.
- Content owner (`Site/Admin`): verify page copy + CTA links on `/`, `/work/`, `/blog/`, `/contact/`.
- Incident owner (`Engineering`): if any smoke check fails, execute rollback plan and log the failing route/test.

## Scheduled Automation

### GitHub Actions (CI/CD)
A workflow at `.github/workflows/smoke-check.yml` provides:
- **Daily schedule**: runs at 06:00 UTC automatically.
- **Manual dispatch**: trigger from GitHub Actions UI with optional `base_url`, `run_label`, and `skip_browser` inputs.
- **Push trigger**: runs on pushes to `main` that touch theme files.
- **Artifacts**: smoke logs retained 30 days per run.
- **Failure escalation**:
  1. Download the `smoke-output` artifact from the failed run.
  2. Reproduce locally: `npm run smoke:full`.
  3. If confirmed regression, follow the Rollback Plan above.
  4. Log incident in `ops/` with a cadence report from `ops/smoke-report-template.md`.

### Server-side cron (no CI/CD)
Use the cron wrapper for direct server scheduling:
```bash
# Daily at 06:00 UTC
0 6 * * * /path/to/henrys-digital-canvas/scripts/smoke_cron.sh

# Weekly on Monday at 06:00 UTC
0 6 * * 1 /path/to/henrys-digital-canvas/scripts/smoke_cron.sh
```
- Auto-labels runs as `cron-YYYY-MM-DD`.
- Prunes cadence logs older than 90 days (override with `RETENTION_DAYS`).
- Override target: `BASE_URL=https://staging.example.com ./scripts/smoke_cron.sh`.

### Escalation Path
| Signal | Owner | Action |
| --- | --- | --- |
| CI workflow fails | Engineering | Review artifact, reproduce locally, rollback if confirmed |
| Cron cadence `status!=0` in `ops/smoke-history.log` | Engineering | Run `npm run smoke:full` manually, triage failing phase |
| Content spot-check issue | Site/Admin | Report to Engineering with route and screenshot |
