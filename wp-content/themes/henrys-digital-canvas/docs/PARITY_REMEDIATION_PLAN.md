# Henry's Digital Canvas Parity Remediation Plan

Last updated: 2026-03-05T21:22Z (UTC)

## Status

- Scope status: `closed`
- Verification status: `verified`
- Closure date: 2026-03-05

This document originally tracked the March 5, 2026 parity-remediation work for the WordPress child theme. That scope is now complete. The open-plan language that previously lived here is superseded by the current-state entries in `MIGRATION_PROGRESS.md` and the smoke artifacts under `ops/`.

## Final Outcome

- The migration tracker now distinguishes shipped routing from parity closure and verification evidence instead of using blanket "complete" language.
- `WPDS_TARGET_STATEMENT.md` defines the transitional WPDS foundation, including `--wpds-*` semantic-token mapping rules.
- The blog contract now exposes `featuredImageUrl`, `featuredImageAlt`, and `featuredImageSrcSet` for WordPress-backed and fallback-backed responses.
- `/blog/`, `/blog/:slug`, and `/` now render blog media when available and degrade cleanly when not.
- The home feed defaults and metadata affordances were brought back in line with the current source app parity target for the March 2026 review scope.
- Smoke verification for route, API, browser, and full chains passed and was captured under `ops/parity-remediation-2026-03-05T21-10-24Z/`.

## Scope Closed

### 1. Tracker truth reset

- `MIGRATION_PROGRESS.md` now uses the status model introduced during parity remediation.
- The tracker links this document, the WPDS target note, and the smoke report as the source of truth for closure.

### 2. Blog media contract restoration

- `inc/data-contracts.php` now emits featured-media fields for list and detail responses.
- `data/blog-posts-fallback.json` now carries the same media fields so fallback rendering exercises the same UI path.

### 3. Blog and home consumer updates

- `blocks/blog-index/view.js` renders the featured post hero image and list thumbnails when media exists.
- `blocks/blog-post/view.js` renders the article header image while preserving existing reading-progress behavior.
- `blocks/digital-canvas-feed/view.js` renders recent-writing thumbnails and keeps no-image layouts stable.

### 4. Home feed parity restoration

- `blocks/digital-canvas-feed/render.php` defaults remain aligned with the source app for the verified parity target.
- Feed rendering now preserves repo-origin/access affordances alongside the post-media work above.

### 5. WPDS foundation alignment for this remediation scope

- `assets/css/design-system.css` and `theme.json` now include WPDS semantic adapter tokens for the current foundation layer.
- This closure does not claim blanket `@wordpress/ui` or `@wordpress/components` adoption. That broader package-level adoption remains selective and is governed by `WPDS_TARGET_STATEMENT.md`.

### 6. Verification gates and evidence capture

- Smoke coverage now includes the parity-sensitive routes and media assertions used for this closure.
- The parity scope was only marked closed after the smoke chain passed and artifacts were written to `ops/`.

## Verification Evidence

- Smoke report: `ops/smoke-report-2026-03-05-parity-remediation-close.md`
- Output directory: `ops/parity-remediation-2026-03-05T21-10-24Z/`
- Route log: `ops/parity-remediation-2026-03-05T21-10-24Z/smoke-route.log`
- API log: `ops/parity-remediation-2026-03-05T21-10-24Z/smoke-api.log`
- Browser log: `ops/parity-remediation-2026-03-05T21-10-24Z/smoke-browser.log`
- Full log: `ops/parity-remediation-2026-03-05T21-10-24Z/smoke-full.log`

## Remaining Follow-up

- Continue treating `WPDS_TARGET_STATEMENT.md` as the contract for future foundation-token work.
- Keep the blog-media assertions in the smoke suite so future parity changes cannot silently drop featured-image rendering again.
- If the React source app changes the home feed contract again, rerun a parity audit before changing tracker status language.

## References

- `MIGRATION_PROGRESS.md`
- `WPDS_TARGET_STATEMENT.md`
- `ops/smoke-report-2026-03-05-parity-remediation-close.md`
