# Incremental wp-scripts Integration for Parity-Fix Pipeline

**Date:** 2026-03-15
**Status:** Draft
**Scope:** Add `@wordpress/scripts` build tooling to the henrys-digital-canvas theme, adopted incrementally as blocks are touched by the parity-fix pipeline.

## Problem

Most of the theme's 13 custom blocks use hand-written vanilla JS (`wp.element.createElement` calls wrapped in IIFEs). Two blocks (`site-shell` and `not-found`) use pure DOM manipulation with no `wp.element` dependency. This creates three problems:

1. **Parity gap** — Source React pages are JSX; WP blocks are `createElement`. The parity-fixer agent must mentally translate between the two, increasing error surface.
2. **No linting or formatting** — Validation is limited to `node -c` syntax checks. WordPress coding standard violations go undetected.
3. **No dependency manifests** — Block scripts manually reference `window.wp.*` globals. There are no `*.asset.php` files declaring dependencies or providing content-hashed versions.

## Solution

Adopt `@wordpress/scripts` with a multi-entry webpack config at the theme level. Blocks are converted from vanilla JS to JSX source files incrementally — only when the parity-fix agent next touches them. Unconverted blocks continue working unchanged.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Migration strategy | Incremental, parity-fix-driven | Lowest risk; no big-bang rewrite |
| Editor scripts (`index.js`) | Included in build pipeline | Consistency; proper asset.php generation |
| CSS | Stays hand-written in block root | Works fine as-is; Sass can be added later |
| Config location | Theme root `webpack.config.js` | Single config for all blocks |
| Build artifacts | Committed to git | No CI/CD pipeline; direct git-based deployment |
| Legacy `element.render` fallback | Dropped during conversion | Project targets WP 7.0-beta; `createRoot` always available |
| `viewScriptModule` (ESM) | Deferred | Viable on WP 7.0-beta but adds complexity; can adopt later per-block |

## Block Categories

Not all 13 blocks are candidates for the same conversion path:

| Category | Blocks | Current pattern | Conversion path |
|----------|--------|----------------|----------------|
| **createElement blocks** (11) | home-page, about-timeline, work-showcase, work-detail, resume-overview, resume-ats, hobbies-moments, blog-index, blog-post, contact-form, digital-canvas-feed | IIFE wrapping `wp.element.createElement` | Convert to JSX in `src/` |
| **DOM-only blocks** (2) | site-shell, not-found | Pure IIFE with DOM queries and event listeners, no `wp.element` | Stay as-is; conversion is a rewrite, not a syntax transform |

DOM-only blocks can optionally be brought into the build pipeline later if a parity-fix requires substantial new React component logic. That decision is made per-block at fix time, not upfront.

## Directory Structure

### Before conversion (current state)
```
blocks/<name>/
  block.json          # editorScript: "file:./index.js", viewScript: "file:./view.js"
  index.js            # hand-written createElement editor script
  view.js             # hand-written createElement view script
  render.php
  style.css
```

### After conversion (createElement blocks)
```
blocks/<name>/
  src/
    index.js          # JSX editor script source
    view.js           # JSX view script source
  build/
    index.js          # compiled editor script
    index.asset.php   # auto-generated dependencies + version hash
    view.js           # compiled view script
    view.asset.php    # auto-generated dependencies + version hash
  block.json          # editorScript: "file:./build/index.js", viewScript: "file:./build/view.js"
  render.php          # unchanged
  style.css           # unchanged, stays "file:./style.css" in block.json
```

### Theme root additions
```
wp-content/themes/henrys-digital-canvas/
  webpack.config.js   # multi-entry config scanning blocks/*/src/
  .gitignore          # node_modules/
  package.json        # updated with @wordpress/scripts + build/start/lint scripts
```

## Webpack Configuration

A custom `webpack.config.js` at the theme root that:

1. Extends the default `@wordpress/scripts` webpack config
2. Scans `blocks/*/src/index.js` and `blocks/*/src/view.js` for entry points (only picks up blocks that have a `src/` directory)
3. Outputs compiled files to each block's `build/` directory
4. Replaces the default `DependencyExtractionWebpackPlugin` with a custom instance that additionally maps `hdc-shared-utils` imports to the globally enqueued script handle — this generates correct `*.asset.php` manifests including the shared-utils dependency

### Skeleton config

```js
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const path = require( 'path' );
const glob = require( 'fast-glob' ); // transitive dep of @wordpress/scripts

// Discover all blocks that have a src/ directory
const srcFiles = glob.sync( 'blocks/*/src/{index,view}.js' );

const entry = {};
for ( const file of srcFiles ) {
  // "blocks/home-page/src/view.js" -> "blocks/home-page/build/view"
  const parts = file.split( '/' );
  const blockName = parts[ 1 ];
  const baseName = path.basename( file, '.js' );
  entry[ `blocks/${ blockName }/build/${ baseName }` ] = path.resolve( __dirname, file );
}

// Replace the default DependencyExtractionWebpackPlugin with a custom instance
// that maps hdc-shared-utils imports to the globally enqueued script handle.
const plugins = defaultConfig.plugins.filter(
  ( plugin ) => ! ( plugin instanceof DependencyExtractionWebpackPlugin )
);
plugins.push(
  new DependencyExtractionWebpackPlugin( {
    requestToExternal( request ) {
      if ( request === 'hdc-shared-utils' ) {
        return 'window.hdcSharedUtils';
      }
    },
    requestToHandle( request ) {
      if ( request === 'hdc-shared-utils' ) {
        return 'hdc-shared-utils';
      }
    },
  } )
);

module.exports = {
  ...defaultConfig,
  entry,
  output: {
    path: path.resolve( __dirname ),
    filename: '[name].js',
  },
  plugins,
};
```

The key challenge is the output path: `@wordpress/scripts` default config outputs to a single `./build/` directory, but this config encodes the per-block path into the entry point name so each block gets its own `build/` directory.

The custom `DependencyExtractionWebpackPlugin` instance maps `import { renderLucideIcon } from 'hdc-shared-utils'` so that:
- The import is excluded from the bundle (resolved to `window.hdcSharedUtils` at runtime)
- The `hdc-shared-utils` handle is written into `*.asset.php` dependencies, guaranteeing WordPress enqueues it before the block script

## block.json Changes

When a block is converted, two fields change:

```diff
- "editorScript": "file:./index.js",
+ "editorScript": "file:./build/index.js",
- "viewScript": "file:./view.js",
+ "viewScript": "file:./build/view.js",
```

The `style` and `editorStyle` fields remain `"file:./style.css"` — CSS is not part of the build pipeline.

The `render` field remains `"file:./render.php"` — server-side rendering is unchanged.

## Package.json Changes

```json
{
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "lint:js": "wp-scripts lint-js",
    "format:js": "wp-scripts format",
    "sync:pages": "./scripts/sync_page_sources.sh",
    "smoke:route": "./scripts/route_smoke.sh",
    "smoke:api": "./scripts/api_smoke.sh",
    "smoke:browser": "./scripts/browser_smoke.sh",
    "smoke:full": "./scripts/full_smoke.sh",
    "smoke:cadence": "./scripts/smoke_cadence.sh",
    "smoke:history": "./scripts/smoke_history_tail.sh 10"
  },
  "devDependencies": {
    "@playwright/test": "^1.58.2",
    "@wordpress/scripts": "^31.6.0"
  }
}
```

Note: `@wordpress/scripts` `^31.6.0` aligns with the project's WordPress 7.0-beta / Gutenberg 22.x environment.

## JSX Source Convention

Converted `src/view.js` files use standard WordPress imports instead of `window.wp.*` globals:

```jsx
// Before (hand-written vanilla JS)
( function ( wp ) {
  const h = wp.element.createElement;
  const useState = wp.element.useState;
  const legacyRender = wp.element.render;  // dropped during conversion
  // ... 500+ lines of createElement calls
} )( window.wp );

// After (JSX source in src/view.js)
import { createElement, useState, useEffect, createRoot } from '@wordpress/element';

function HomePage({ config }) {
  // ... JSX that closely mirrors source React TSX
  return (
    <div className="hdc-home-page">
      ...
    </div>
  );
}

// Mount logic — createRoot only, no legacyRender fallback
// (WP 7.0-beta guarantees createRoot is available)
document.querySelectorAll('.wp-block-henrys-digital-canvas-home-page').forEach((el) => {
  const config = JSON.parse(el.dataset.config || '{}');
  createRoot(el).render(<HomePage config={config} />);
});
```

The dependency-extraction plugin detects `@wordpress/element` imports and:
- Excludes them from the bundle (they're provided by WordPress at runtime)
- Writes `['wp-element']` into `build/view.asset.php`

## Shared Utilities

`hdc-shared-utils.js` (Lucide icons, etc.) remains a globally enqueued script. Converted blocks import it as a module:

```jsx
import { renderLucideIcon } from 'hdc-shared-utils';
```

The custom `DependencyExtractionWebpackPlugin` in `webpack.config.js` (see skeleton config above) handles this import by:
1. **Excluding it from the bundle** — resolved to `window.hdcSharedUtils` at runtime
2. **Writing `'hdc-shared-utils'` into `*.asset.php`** — WordPress automatically enqueues the shared-utils script before the block script

No PHP filter is needed. The dependency extraction plugin handles both bundling and load order in one place.

A future enhancement could convert shared utils into a proper WordPress script module, but that's out of scope.

## Parity-Fix Agent Changes

### Updated validation step (Step 5)

The parity-fixer agent's validation expands:

```bash
# For converted blocks (have src/ directory):
cd <theme> && npm run build                            # compile all src/ blocks
cd <theme> && npm run lint:js -- blocks/<block>/src/   # lint source
# No need for node -c on build output — successful build guarantees valid JS

# For unconverted blocks (no src/ directory):
node -c blocks/<block>/view.js       # existing syntax check

# Both paths:
cd <theme> && npm run smoke:route && npm run smoke:api
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

### New conversion guidance (added to agent prompt)

When the parity-fixer encounters a **createElement block** without `src/`:

1. Create `blocks/<name>/src/` directory
2. Convert `view.js` from `createElement` to JSX, write to `src/view.js`
   - Replace `wp.element.createElement` calls with JSX tags
   - Replace IIFE wrapper + `window.wp.*` globals with `@wordpress/element` imports
   - Drop the `legacyRender` / `element.render` fallback path (WP 7.0-beta has `createRoot`)
   - Replace `window.hdcSharedUtils.renderLucideIcon` with `import { renderLucideIcon } from 'hdc-shared-utils'` (mapped by the dependency extraction plugin)
3. Convert `index.js` from `createElement` to JSX, write to `src/index.js`
   - Replace `window.wp.blocks`/`blockEditor`/etc. with `@wordpress/blocks`, `@wordpress/block-editor` imports
4. Update `block.json` paths: `editorScript` and `viewScript` point to `build/`
5. Run `npm run build` to compile
6. Run `npm run lint:js -- blocks/<name>/src/` to validate
7. Verify with smoke tests
8. Remove old root-level `view.js` and `index.js` (now superseded by `src/` + `build/`)

When the parity-fixer encounters a **DOM-only block** (`site-shell`, `not-found`):
- Keep working with the existing hand-written `view.js` in the block root
- Only consider conversion if the fix requires substantial new React component logic
- If converting, this is a rewrite (not a syntax transform) and should be treated as a high-severity gap requiring a full plan

### Parity comparison benefit

With JSX source files, the agent can now do near-direct comparison:

| Source React TSX | WP block `src/view.js` |
|-----------------|----------------------|
| `import { useState } from 'react'` | `import { useState } from '@wordpress/element'` |
| `<div className="foo">` | `<div className="foo">` |
| `{items.map(item => <Card key={item.id} />)}` | `{items.map(item => <Card key={item.id} />)}` |

The structural similarity makes gap detection more accurate and fixes more straightforward.

## Build Artifacts and Deployment

Build artifacts (`blocks/*/build/`) are **committed to git**. The project has no CI/CD pipeline and deploys directly from the git repository. Gitignoring build output would break the production site.

This means:
- After converting a block, `npm run build` must run and the `build/` output must be committed alongside the `src/` source
- The parity-fix agent includes `npm run build` in its workflow and stages both `src/` and `build/` files
- `node_modules/` is gitignored (theme-level `.gitignore`)

A future enhancement could add a deploy hook or CI step that runs the build, at which point `build/` directories could be gitignored. That's out of scope.

## Cache-Busting

The cache-busting mechanism **changes** for converted blocks:

| Asset type | Before | After |
|-----------|--------|-------|
| Block `viewScript` / `editorScript` (converted) | WordPress core uses `filemtime()` on the file | Content-hash from `*.asset.php` `version` field |
| Block `viewScript` / `editorScript` (unconverted) | WordPress core uses `filemtime()` | No change |
| Non-block assets (`design-system.css`, `hdc-shared-utils.js`, etc.) | `hdc_asset_version()` via `filemtime()` | No change |

The `hdc_asset_version()` function in `functions.php` is **not involved** in block script versioning — that's handled by `register_block_type_from_metadata()` reading the `*.asset.php` file. The content-hash approach is an improvement: cache is busted by content changes rather than file modification time.

## What Does Not Change

- `render.php` files — still server-rendered PHP, no build involvement
- `style.css` files — hand-written CSS, referenced directly from `block.json`
- `design-system.css` — global token system, unchanged
- `hdc-shared-utils.js` — globally enqueued shared utilities, unchanged
- Smoke tests — same scripts, same validation
- Unconverted blocks — completely unaffected until parity-fix touches them
- DOM-only blocks (`site-shell`, `not-found`) — stay as-is unless deliberate rewrite
- REST API, data contracts, rewrite rules — no changes

## CLAUDE.md Updates Required

When the first block is converted, update CLAUDE.md:

1. Change "No build step" to describe the dual state: some blocks use `wp-scripts` build (`src/` → `build/`), unconverted blocks use hand-written JS
2. Add `npm run build` / `npm run start` to the Dev Setup section
3. Note that converted block cache-busting uses `*.asset.php` content hashes
4. Add the block category distinction (createElement vs DOM-only)

## Success Criteria

1. `npm run build` compiles all converted blocks' `src/` files to `build/` without errors
2. `npm run lint:js` passes on all converted source files
3. Converted blocks render identically on the frontend (smoke tests pass)
4. `*.asset.php` files correctly declare WordPress dependencies (including `hdc-shared-utils` via the dependency extraction plugin)
5. Unconverted blocks continue to work with no changes
6. The parity-fix agent can convert a createElement block and produce working JSX output
7. Build artifacts are committed and the production site works without a separate build step
