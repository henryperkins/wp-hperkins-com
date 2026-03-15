# wp-scripts Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `@wordpress/scripts` build tooling to the theme and convert one pilot block to validate the pipeline end-to-end.

**Architecture:** Multi-entry webpack config at theme root discovers `blocks/*/src/` entry points, compiles JSX to production JS with `*.asset.php` manifests. Blocks are converted incrementally — only the pilot block (`contact-form`) is converted in this plan. All other blocks remain untouched.

**Tech Stack:** `@wordpress/scripts` ^31.6.0, `@wordpress/dependency-extraction-webpack-plugin`, webpack 5, Node 24, npm 11

**Spec:** `docs/superpowers/specs/2026-03-15-wp-scripts-integration-design.md`

---

## Chunk 1: Build Infrastructure

### Task 1: Create theme-level .gitignore and untrack node_modules

**Files:**
- Create: `.gitignore` (in theme root)

This MUST happen before `npm install` to prevent hundreds of new dependency files from appearing in `git status`. Existing `node_modules/` (Playwright) is currently tracked and must be untracked.

- [ ] **Step 1: Create .gitignore**

Create `wp-content/themes/henrys-digital-canvas/.gitignore` with:

```
node_modules/
```

Note: `blocks/*/build/` is NOT gitignored — build artifacts are committed because there is no CI/CD pipeline.

- [ ] **Step 2: Untrack existing node_modules**

Existing Playwright files in `node_modules/` are tracked by git. Untrack them:

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com && git rm -r --cached wp-content/themes/henrys-digital-canvas/node_modules/
```

Expected: Lists removed files (Playwright and its deps).

- [ ] **Step 3: Verify node_modules is excluded from git**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com && git status wp-content/themes/henrys-digital-canvas/node_modules/
```

Expected: No untracked files listed (gitignored).

- [ ] **Step 4: Commit**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && git add .gitignore && git commit -m "chore: add theme .gitignore, untrack node_modules"
```

---

### Task 2: Install @wordpress/scripts and update package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update package.json with new scripts and dependency**

Replace the full contents of `package.json` with:

```json
{
  "name": "henrys-digital-canvas-theme",
  "private": true,
  "version": "0.1.0",
  "description": "Operational smoke checks for Henry's Digital Canvas WordPress child theme",
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

- [ ] **Step 2: Install dependencies**

Run from theme directory:
```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npm install
```

Expected: `@wordpress/scripts` and its transitive dependencies install successfully. `node_modules/` is populated but gitignored.

- [ ] **Step 3: Verify wp-scripts is available**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npx wp-scripts --version
```

Expected: Prints a version number (31.x.x or similar).

- [ ] **Step 4: Commit**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && git add package.json package-lock.json && git commit -m "chore: add @wordpress/scripts ^31.6.0 to devDependencies"
```

---

### Task 3: Create webpack.config.js

**Files:**
- Create: `webpack.config.js` (in theme root)

- [ ] **Step 1: Create the multi-entry webpack config**

Create `wp-content/themes/henrys-digital-canvas/webpack.config.js` with:

```js
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const path = require( 'path' );
const glob = require( 'fast-glob' ); // transitive dep of @wordpress/scripts

// Discover all blocks that have a src/ directory.
const srcFiles = glob.sync( 'blocks/*/src/{index,view}.js', {
	cwd: __dirname,
} );

const entry = {};
for ( const file of srcFiles ) {
	// "blocks/contact-form/src/view.js" -> "blocks/contact-form/build/view"
	const parts = file.split( '/' );
	const blockName = parts[ 1 ];
	const baseName = path.basename( file, '.js' );
	entry[ `blocks/${ blockName }/build/${ baseName }` ] = path.resolve(
		__dirname,
		file
	);
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
				return 'hdcSharedUtils';
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

Note: `requestToExternal` returns the bare global name `'hdcSharedUtils'` (not `'window.hdcSharedUtils'`), following WordPress ecosystem convention where all externals use the plain global name (e.g., `'jQuery'`, `'React'`, `['wp', 'element']`).

- [ ] **Step 2: Verify webpack config loads without errors**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && node -e "const c = require('./webpack.config.js'); console.log('entry keys:', Object.keys(c.entry).length, '| plugins:', c.plugins.length)"
```

Expected: `entry keys: 0` (no blocks have `src/` yet), plugins count is a number. No errors.

- [ ] **Step 3: Verify build runs (no-op with zero entries)**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npx wp-scripts build 2>&1 || true
```

Expected: Completes without a fatal error. May warn about no entry points, which is fine.

- [ ] **Step 4: Commit**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && git add webpack.config.js && git commit -m "chore: add multi-entry webpack config for wp-scripts"
```

---

## Chunk 2: Pilot Block Conversion (contact-form)

### Task 4: Create JSX source for contact-form view.js

**Files:**
- Create: `blocks/contact-form/src/view.js`

This is the largest step. The existing `blocks/contact-form/view.js` (868 lines) must be converted from `wp.element.createElement` IIFE to JSX with ES module imports. This is a substantial mechanical transformation — the business logic, validation state machine, Turnstile integration, and dual-endpoint submission remain identical.

- [ ] **Step 1: Create the src/ directory**

```bash
mkdir -p /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas/blocks/contact-form/src
```

- [ ] **Step 2: Convert view.js to JSX**

Read the full `blocks/contact-form/view.js` (868 lines) and create `blocks/contact-form/src/view.js` applying these transformations:

1. **Remove IIFE wrapper** — `( function ( wp ) { ... } )( window.wp );` becomes top-level code

2. **Replace globals with imports** — do NOT import `createElement` (Babel's JSX transform handles it automatically):
   ```jsx
   import { useEffect, useRef, useState, createRoot } from '@wordpress/element';
   import { renderLucideIcon, decodeHtml } from 'hdc-shared-utils';
   ```

3. **Convert all `h(tag, props, ...children)` calls to JSX tags:**
   - `h( 'div', { className: 'foo' }, h( 'span', null, 'text' ) )` → `<div className="foo"><span>text</span></div>`
   - `h( 'input', { type: 'text', value: val, onChange: fn } )` → `<input type="text" value={ val } onChange={ fn } />`
   - `h( Fragment, null, ... )` → `<>...</>` (import `Fragment` if needed, or use shorthand)
   - `Object.assign( {}, prev, updates )` → `{ ...prev, ...updates }`
   - Ternary chains in render returns need careful JSX nesting: `condition ? h('a', ...) : h('b', ...)` → `{ condition ? <A /> : <B /> }`

4. **Drop `legacyRender` fallback** — remove the `element.render` alias and the `if (typeof createRoot === 'function')` branch. Use only `createRoot`. (WP 7.0-beta guarantees `createRoot` is available.)

5. **Drop `renderLucideIcon` null fallback** — the `window.hdcSharedUtils` defensive check is no longer needed since the import guarantees it exists.

6. **Keep all business logic identical** — validation logic, Turnstile widget lifecycle, config parsing, honeypot field, error handling, submit state machine — all stay the same.

7. **Fix the mount logic** — the existing code uses a two-level mount pattern that must be preserved:
   ```jsx
   document.querySelectorAll( '.hdc-contact-form' ).forEach( ( section ) => {
   	const rootNode = section.querySelector( '[data-hdc-contact-form-root]' );
   	if ( ! rootNode ) {
   		return;
   	}
   	const config = parseConfig( section );
   	createRoot( rootNode ).render( <ContactFormApp config={ config } /> );
   } );
   ```

   The outer selector is `.hdc-contact-form` (the section rendered by `render.php`), NOT `.wp-block-henrys-digital-canvas-contact-form`. The React root is the inner `[data-hdc-contact-form-root]` div. The `parseConfig()` function reads `data-config` from the section element. `ContactFormApp` receives `config` as a prop (not `container`).

- [ ] **Step 3: Verify the source compiles**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npx wp-scripts build
```

Expected: Build succeeds. Files created:
- `blocks/contact-form/build/view.js`
- `blocks/contact-form/build/view.asset.php`

- [ ] **Step 4: Verify asset.php contains expected dependencies**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && php -r "print_r(include 'blocks/contact-form/build/view.asset.php');"
```

Expected: Array with `dependencies` containing `wp-element` and `hdc-shared-utils`, plus a `version` string (content hash).

- [ ] **Step 5: Commit source (not build output yet — that comes after index.js)**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && git add blocks/contact-form/src/view.js && git commit -m "feat(contact-form): convert view.js to JSX source"
```

---

### Task 5: Create JSX source for contact-form index.js

**Files:**
- Create: `blocks/contact-form/src/index.js`

- [ ] **Step 1: Convert index.js to JSX**

Read the existing `blocks/contact-form/index.js` (99 lines) and create `blocks/contact-form/src/index.js`:

```jsx
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

registerBlockType( 'henrys-digital-canvas/contact-form', {
	edit: function Edit( { attributes, setAttributes } ) {
		const blockProps = useBlockProps( {
			className: 'hdc-contact-form-editor',
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody
						title={ __( 'Contact Form Settings', 'henrys-digital-canvas' ) }
						initialOpen={ true }
					>
						<TextControl
							label={ __( 'Heading', 'henrys-digital-canvas' ) }
							value={ attributes.heading }
							onChange={ ( heading ) => setAttributes( { heading } ) }
						/>
						<TextControl
							label={ __( 'Description', 'henrys-digital-canvas' ) }
							value={ attributes.description }
							onChange={ ( description ) => setAttributes( { description } ) }
						/>
						<ToggleControl
							label={ __( 'Show social links', 'henrys-digital-canvas' ) }
							checked={ !! attributes.showSocialLinks }
							onChange={ ( showSocialLinks ) => setAttributes( { showSocialLinks } ) }
						/>
						<TextControl
							label={ __( 'Submit label', 'henrys-digital-canvas' ) }
							value={ attributes.submitLabel }
							onChange={ ( submitLabel ) => setAttributes( { submitLabel } ) }
						/>
						<TextControl
							label={ __( 'Submitting label', 'henrys-digital-canvas' ) }
							value={ attributes.submittingLabel }
							onChange={ ( submittingLabel ) => setAttributes( { submittingLabel } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					<Notice status="info" isDismissible={ false }>
						{ __( 'Frontend posts form payloads to /api/contact and preserves client validation + submit states.', 'henrys-digital-canvas' ) }
					</Notice>
					<h3 className="hdc-contact-form-editor__title">
						{ attributes.heading || __( 'Contact', 'henrys-digital-canvas' ) }
					</h3>
					<p className="hdc-contact-form-editor__description">
						{ attributes.description || __( 'Open to opportunities and consulting engagements.', 'henrys-digital-canvas' ) }
					</p>
				</div>
			</>
		);
	},
	save: () => null,
} );
```

- [ ] **Step 2: Rebuild**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npx wp-scripts build
```

Expected: Build succeeds. New files:
- `blocks/contact-form/build/index.js`
- `blocks/contact-form/build/index.asset.php`

- [ ] **Step 3: Verify editor asset.php dependencies**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && php -r "print_r(include 'blocks/contact-form/build/index.asset.php');"
```

Expected: `dependencies` includes `wp-blocks`, `wp-block-editor`, `wp-components`, `wp-i18n`, and `wp-element`.

- [ ] **Step 4: Commit source**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && git add blocks/contact-form/src/index.js && git commit -m "feat(contact-form): convert editor index.js to JSX source"
```

---

### Task 6: Update block.json, remove old files, commit build output

**Files:**
- Modify: `blocks/contact-form/block.json`
- Remove: `blocks/contact-form/index.js`, `blocks/contact-form/view.js`, `blocks/contact-form/index.asset.php`, `blocks/contact-form/view.asset.php`

- [ ] **Step 1: Update block.json paths to point to build/**

In `blocks/contact-form/block.json`, change:

```diff
-	"editorScript": "file:./index.js",
+	"editorScript": "file:./build/index.js",
-	"viewScript": "file:./view.js",
+	"viewScript": "file:./build/view.js",
```

All other fields (`style`, `editorStyle`, `render`) stay unchanged.

- [ ] **Step 2: Run final build**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npx wp-scripts build
```

- [ ] **Step 3: Remove old root-level JS and asset.php files**

The old hand-written files are superseded by `src/` (source) and `build/` (compiled output + generated asset.php):

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && git rm blocks/contact-form/index.js blocks/contact-form/view.js blocks/contact-form/index.asset.php blocks/contact-form/view.asset.php
```

- [ ] **Step 4: Commit block.json change, build output, and old file removal**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && git add blocks/contact-form/block.json blocks/contact-form/build/ && git commit -m "$(cat <<'EOF'
feat(contact-form): switch to wp-scripts build pipeline

- block.json now points to build/ output
- Old hand-written index.js, view.js, and *.asset.php removed
- Build artifacts committed (no CI/CD)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Chunk 3: Validation and Documentation

### Task 7: End-to-end validation

**Files:** None modified — validation only.

- [ ] **Step 1: Flush WordPress caches**

```bash
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

- [ ] **Step 2: Run route smoke tests**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npm run smoke:route
```

Expected: All routes pass, including `/contact/`.

- [ ] **Step 3: Run API smoke tests**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npm run smoke:api
```

Expected: All API endpoints pass.

- [ ] **Step 4: Verify contact page renders with the compiled script**

```bash
curl -s https://wp.hperkins.com/contact/ | grep -c 'hdc-contact-form'
```

Expected: At least 1 match (the block container is present).

- [ ] **Step 5: Verify the compiled view.js is served (not 404)**

```bash
THEME_URL=$(wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com option get stylesheet_directory_uri 2>/dev/null || echo "https://wp.hperkins.com/wp-content/themes/henrys-digital-canvas")
curl -sI "${THEME_URL}/blocks/contact-form/build/view.js" | head -1
```

Expected: `HTTP/... 200` (not 404).

- [ ] **Step 6: Verify unconverted blocks still work**

```bash
curl -s https://wp.hperkins.com/ | grep -c 'hdc-home-page'
```

Expected: At least 1 match. The home-page block (not converted) still renders.

---

### Task 8: Update parity-fixer agent prompt

**Files:**
- Modify: `codex/agents/parity-fixer.md`

- [ ] **Step 1: Add build pipeline section to the agent**

After the existing "## Conventions" section in `codex/agents/parity-fixer.md`, add a new section:

```markdown
## Build Pipeline (wp-scripts)

The theme uses `@wordpress/scripts` for blocks that have been converted to JSX. Converted blocks have a `src/` directory; unconverted blocks do not.

### Detecting block state

- **Converted block**: `blocks/<name>/src/` directory exists. Source is JSX in `src/`, compiled output in `build/`.
- **Unconverted createElement block**: No `src/` directory, `view.js` uses `wp.element.createElement` in an IIFE.
- **DOM-only block** (`site-shell`, `not-found`): No `src/` directory, `view.js` uses pure DOM manipulation, no `wp.element`.

### When fixing a converted block

1. Edit JSX source in `blocks/<name>/src/view.js` or `src/index.js`
2. Run `npm run build` from the theme directory
3. Run `npm run lint:js -- blocks/<name>/src/` to validate
4. Commit both `src/` and `build/` files

### When converting an unconverted createElement block

1. Create `blocks/<name>/src/` directory
2. Convert `view.js` from createElement to JSX → `src/view.js`
   - Replace IIFE + `window.wp.*` globals with `@wordpress/element` imports (do NOT import `createElement` — Babel handles it)
   - Replace `window.hdcSharedUtils.*` with `import { ... } from 'hdc-shared-utils'`
   - Drop the `legacyRender` / `element.render` fallback (WP 7.0-beta has `createRoot`)
   - Convert all `h(tag, props, children)` calls to JSX tags
   - Preserve the existing mount selector pattern (check `render.php` for the actual root element)
3. Convert `index.js` from createElement to JSX → `src/index.js`
   - Replace `window.wp.blocks`/etc. with `@wordpress/blocks`, `@wordpress/block-editor` imports
4. Update `block.json`: `editorScript` → `file:./build/index.js`, `viewScript` → `file:./build/view.js`
5. Run `npm run build`
6. Run `npm run lint:js -- blocks/<name>/src/`
7. Remove old root-level `view.js`, `index.js`, `view.asset.php`, and `index.asset.php`
8. Commit `src/`, `build/`, updated `block.json`, and removed files

### When fixing a DOM-only block

Keep working with the hand-written `view.js` in the block root. Only convert if the fix requires substantial new React component logic (treat as a rewrite requiring a full plan).
```

- [ ] **Step 2: Update the validation step (Step 5) in the agent**

In the existing Step 5 "Implement Fixes" section, update the validation commands. Replace:

```bash
# Validate JS syntax
node -c <theme>/blocks/<block>/view.js
```

With:

```bash
# For converted blocks (have src/ directory):
cd <theme> && npm run build
cd <theme> && npm run lint:js -- blocks/<block>/src/

# For unconverted blocks (no src/ directory):
node -c <theme>/blocks/<block>/view.js
```

- [ ] **Step 3: Commit**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com && git add codex/agents/parity-fixer.md && git commit -m "docs(parity-fixer): add wp-scripts build pipeline guidance"
```

---

### Task 9: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (project root)

- [ ] **Step 1: Update the blocks description in Key Paths**

In the Key Paths table, change:

```
| `blocks/` | 13 custom Gutenberg blocks (each has `block.json` + `render.php` + `view.js`) |
```

To:

```
| `blocks/` | 13 custom Gutenberg blocks (`block.json` + `render.php` + `view.js`). Converted blocks have `src/` (JSX source) and `build/` (compiled output). |
```

- [ ] **Step 2: Update the "No build step" statement in Dev Setup**

Replace:

```
No build step — blocks use server-side rendering with vanilla JS `view.js` files.
```

With:

```
Blocks use server-side rendering. Converted blocks (those with a `src/` directory) use `@wordpress/scripts` to compile JSX source to production JS:

\`\`\`bash
cd wp-content/themes/henrys-digital-canvas && npm run build   # production build
cd wp-content/themes/henrys-digital-canvas && npm run start   # dev watcher
\`\`\`

Unconverted blocks still use hand-written vanilla JS `view.js` files with no build step.
Build artifacts (`blocks/*/build/`) are committed to git — there is no CI/CD pipeline.
```

- [ ] **Step 3: Add block categories note after the Custom Blocks table**

After the "When modifying any block, always compare against the source TSX to maintain parity." line, add:

```markdown
### Block Categories

- **createElement blocks** (11): Use `wp.element.createElement` — candidates for JSX conversion via wp-scripts
- **DOM-only blocks** (2): `site-shell` and `not-found` use pure DOM manipulation — stay as hand-written JS

Converted blocks use `*.asset.php` content hashes for cache-busting. Unconverted blocks use WordPress core's `filemtime()`.
```

- [ ] **Step 4: Commit**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com && git add CLAUDE.md && git commit -m "docs: update CLAUDE.md for wp-scripts build pipeline"
```

---

### Task 10: Final verification

- [ ] **Step 1: Run full smoke test suite**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npm run smoke:full
```

Expected: All smoke tests pass.

- [ ] **Step 2: Verify build is clean**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npx wp-scripts build && git diff --stat
```

Expected: No diff — build output already committed matches current source.

- [ ] **Step 3: Verify lint passes on pilot block**

```bash
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas && npx wp-scripts lint-js blocks/contact-form/src/
```

Expected: No errors.
