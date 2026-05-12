# Native WordPress Install Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/home/dev/wp-hperkins-com` a working native, non-Docker WordPress installation with repeatable setup/start/verify commands.

**Architecture:** WordPress core is downloaded into the repo root and ignored by git; site-owned code remains tracked under `wp-content/`. Root-level scripts in `codex/scripts/` use WP-CLI and native MariaDB/MySQL to install, start, and verify the site against `http://localhost:8890`.

**Tech Stack:** WP-CLI, PHP 8.5, native MariaDB/MySQL, WordPress core, `wp server`, existing theme smoke scripts.

---

### Task 1: Track Native Install Documentation

**Files:**
- Modify: `.gitignore`
- Create: `docs/superpowers/specs/2026-05-02-native-wordpress-install-design.md`
- Create: `docs/superpowers/plans/2026-05-02-native-wordpress-install.md`
- Create: `docs/native-wordpress-install.md`

- [x] **Step 1: Allow root docs to be tracked**

Update `.gitignore` so root `docs/` is not swallowed by the existing `/*` ignore rule:

```gitignore
!/docs/
!/docs/**
```

- [x] **Step 2: Save the approved native install design**

Create `docs/superpowers/specs/2026-05-02-native-wordpress-install-design.md` with the native runtime contract: no Docker, ignored WordPress core, native MariaDB, local `wp server`, setup/start/verify scripts, and smoke-test acceptance criteria.

- [x] **Step 3: Save this implementation plan**

Create `docs/superpowers/plans/2026-05-02-native-wordpress-install.md` with task-level checkboxes and exact commands.

- [x] **Step 4: Add the user-facing runbook**

Create `docs/native-wordpress-install.md` with:

```markdown
# Native WordPress Install

## Setup

Run:

```bash
codex/scripts/setup-native-wordpress.sh
```

## Start

Run:

```bash
codex/scripts/start-native-wordpress.sh
```

Open `http://localhost:8890`.

## Verify

Run:

```bash
codex/scripts/verify-native-wordpress.sh
```

## Local Defaults

- URL: `http://localhost:8890`
- Database: `wp_hperkins_com_local`
- Database user: `wp_hperkins_local`
- Admin user: `admin`
- Admin password: `admin`

Override defaults by exporting `WP_LOCAL_URL`, `WP_DB_NAME`, `WP_DB_USER`, `WP_DB_PASSWORD`, `WP_DB_HOST`, `WP_ADMIN_USER`, `WP_ADMIN_PASSWORD`, or `WP_ADMIN_EMAIL`.
```

- [x] **Step 5: Verify docs are tracked**

Run:

```bash
git check-ignore -q docs/native-wordpress-install.md
printf 'docs/native-wordpress-install.md exit=%s\n' "$?"
```

Expected: `exit=1`, which means the file is not ignored.

### Task 2: Add Native Setup Script

**Files:**
- Create: `codex/scripts/setup-native-wordpress.sh`

- [x] **Step 1: Create setup script**

Create `codex/scripts/setup-native-wordpress.sh` with executable bash code that:

- resolves the repo root;
- validates `wp`, `php`, and `mysql`/`mariadb` clients;
- starts MariaDB/MySQL if the service is available but inactive;
- creates the database and local user through a root socket/client connection;
- downloads WordPress core with `wp core download --skip-content`;
- creates `wp-config.php` if missing;
- installs WordPress if not already installed;
- installs `twentytwentyfive`;
- activates `henrys-digital-canvas`;
- activates `hdc-ai-media-modal` only if WordPress sees it as valid;
- runs `npm install` in the theme directory when `node_modules/` is missing;
- runs `npm run sync:pages`;
- flushes rewrite rules.

- [x] **Step 2: Make setup script executable**

Run:

```bash
chmod +x codex/scripts/setup-native-wordpress.sh
```

- [x] **Step 3: Run setup script**

Run:

```bash
codex/scripts/setup-native-wordpress.sh
```

Expected: exits 0 after printing the local URL and active theme.

### Task 3: Add Start Script

**Files:**
- Create: `codex/scripts/start-native-wordpress.sh`

- [x] **Step 1: Create start script**

Create `codex/scripts/start-native-wordpress.sh` with executable bash code that:

- resolves the repo root;
- defaults to host `127.0.0.1`, port `8890`, and URL `http://localhost:8890`;
- checks that WordPress is installed;
- updates `home` and `siteurl` to the selected URL;
- starts `wp server --host=<host> --port=<port>`.

- [x] **Step 2: Make start script executable**

Run:

```bash
chmod +x codex/scripts/start-native-wordpress.sh
```

- [x] **Step 3: Start local server**

Run:

```bash
codex/scripts/start-native-wordpress.sh
```

Expected: server listens on `http://localhost:8890`.

### Task 4: Add Verification Script

**Files:**
- Create: `codex/scripts/verify-native-wordpress.sh`

- [x] **Step 1: Create verification script**

Create `codex/scripts/verify-native-wordpress.sh` with executable bash code that:

- checks `wp core is-installed`;
- checks `wp theme is-active henrys-digital-canvas`;
- checks `home` and `siteurl`;
- checks required pages with `wp post list --post_type=page`;
- checks the REST blog endpoint over HTTP;
- runs `npm run smoke:route` and `npm run smoke:api` from the theme directory with `BASE_URL` set to the local URL.

- [x] **Step 2: Make verification script executable**

Run:

```bash
chmod +x codex/scripts/verify-native-wordpress.sh
```

- [x] **Step 3: Run verification against the local server**

Run:

```bash
codex/scripts/verify-native-wordpress.sh
```

Expected: exits 0 and reports route/API smoke passed.

### Task 5: Final Repository Check

**Files:**
- Inspect: git status and ignored core files

- [x] **Step 1: Confirm git tracks only intended files**

Run:

```bash
git status --short
```

Expected: only `.gitignore`, `docs/...`, and `codex/scripts/...` are modified or untracked.

- [x] **Step 2: Confirm core files are ignored**

Run:

```bash
git check-ignore -v wp-admin wp-includes wp-config.php index.php
```

Expected: each path is ignored by `.gitignore`.

- [x] **Step 3: Report local URL and credentials**

Report:

- URL: `http://localhost:8890`
- Admin user: `admin`
- Admin password: `admin`
- Verification command: `codex/scripts/verify-native-wordpress.sh`
