# Native WordPress Installation Design

## Goal

Turn this checkout into a runnable native WordPress installation without Docker while preserving the repo's current ownership model: tracked site code in `wp-content/`, generated WordPress core and local runtime files outside version control.

## Current State

The repo tracks the custom `henrys-digital-canvas` child theme, local plugins, Codex/Claude runbooks, and smoke-test tooling. It does not track WordPress core, `wp-config.php`, a database, uploads, or server runtime files. The child theme depends on the `twentytwentyfive` parent theme and uses WP-CLI page synchronization to create route-owned page records.

## Runtime Shape

- WordPress core lives at the repo root after setup and remains ignored by git.
- Existing tracked `wp-content/themes/henrys-digital-canvas/` and `wp-content/plugins/hdc-ai-media-modal/` stay in place.
- Local database uses native MariaDB/MySQL, not a container.
- Local URL defaults to `http://localhost:8890`.
- Local config uses `wp-config.php`, `WP_ENVIRONMENT_TYPE=local`, and debug-friendly settings.
- `wp server` provides a lightweight local web server for development and smoke checks.

## Setup Workflow

Add tracked scripts under `codex/scripts/`:

- `setup-native-wordpress.sh` downloads WordPress core with WP-CLI, creates the local database/user when possible, creates `wp-config.php`, installs WordPress, installs the `twentytwentyfive` parent theme, activates the custom child theme, activates safe local plugins, runs the page sync script, and flushes rewrites.
- `start-native-wordpress.sh` starts a local `wp server` on the configured host/port.
- `verify-native-wordpress.sh` checks core installation, active theme, front-page page records, REST API availability, and local route/API smoke scripts.

Add a local runbook under `docs/native-wordpress-install.md` with setup, start, reset, and troubleshooting commands.

## Data and Secrets

Defaults are local-only and overridable by environment variables:

- `WP_LOCAL_URL=http://localhost:8890`
- `WP_DB_NAME=wp_hperkins_com_local`
- `WP_DB_USER=wp_hperkins_local`
- `WP_DB_PASSWORD=wp_hperkins_local`
- `WP_DB_HOST=127.0.0.1`
- `WP_ADMIN_USER=admin`
- `WP_ADMIN_PASSWORD=admin`
- `WP_ADMIN_EMAIL=admin@example.test`

`wp-config.php`, uploads, cache directories, and downloaded core files remain untracked.

## Verification

Verification should prove that the repo is a working WordPress install:

- `wp core is-installed`
- `wp theme status henrys-digital-canvas`
- `wp option get home` and `wp option get siteurl`
- `BASE_URL=http://localhost:8890 npm run smoke:route`
- `BASE_URL=http://localhost:8890 npm run smoke:api`

Browser smoke can run after theme dependencies are installed with `npm install` in the theme directory.

## Non-Goals

- No Docker Compose runtime.
- No production DNS/TLS cutover.
- No committed WordPress core, uploads, cache files, or local secrets.
- No activation of service-backed plugins that require credentials.
