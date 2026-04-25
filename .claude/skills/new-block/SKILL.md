---
name: new-block
description: Scaffold a new Gutenberg block for the henrys-digital-canvas theme, maintaining parity with the source React page.
disable-model-invocation: true
---

## New Block Scaffolding

### Required inputs

- **Block name** (kebab-case, e.g., `portfolio-grid`)
- **Source TSX page** (path under `/home/ubuntu/henry-s-digital-canvas/src/pages/`)

### Steps

1. **Read the source TSX** page and all imported components to understand structure, data, and interactions
2. **Create `blocks/<name>/block.json`** with metadata:
   - Namespace: `henrys-digital-canvas/<name>`
   - Set `apiVersion` to 3
   - Set `viewScript` to `file:./view.js` (only loads on pages where the block appears)
   - Set `style` to `file:./style.css`
   - No `editorScript` — blocks are server-rendered only
3. **Create `blocks/<name>/render.php`** with server-side HTML matching the TSX layout:
   - Prefix all PHP functions with `hdc_`
   - Sanitize all query vars and user input
   - Use `hdc_asset_version()` for cache-busting if loading extra assets
4. **Create `blocks/<name>/view.js`** for client-side interactivity (vanilla JS, no build step):
   - Use `document.addEventListener('DOMContentLoaded', ...)` or observe the block wrapper
   - Reimplement React hooks as fetch calls or DOM manipulation
5. **Create `blocks/<name>/style.css`** reimplementing any shadcn/Tailwind styles:
   - Use `--wpds-*` semantic tokens (never raw hex/hsl values)
   - Reference `assets/css/design-system.css` for available tokens
6. **Register in `functions.php`** via `register_block_type_from_metadata(__DIR__ . '/blocks/<name>')`
7. **Add data contract** in `inc/data-contracts.php` if the block needs static data
8. **Run `npm run smoke:route`** from theme dir to verify

### Conventions

- PHP: WordPress coding standards (tabs, Yoda conditions, snake_case with `hdc_` prefix)
- CSS: `--wpds-*` semantic tokens, no Tailwind utilities
- JS: Vanilla JS, viewScript in block.json (loads only where block appears)
- Cache-bust via `hdc_asset_version()` using `filemtime()`
- Compare rendered output against source TSX before marking complete

### Reference

Existing blocks to use as patterns:
- Simple static block: `blocks/home-page/`
- Block with REST data: `blocks/blog-index/`
- Block with GitHub API: `blocks/work-showcase/`
- Block with URL params: `blocks/work-detail/`
