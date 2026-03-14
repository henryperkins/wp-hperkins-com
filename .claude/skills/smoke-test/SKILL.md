---
name: smoke-test
description: Run smoke tests for the WordPress theme. Use after modifying blocks, templates, REST endpoints, or CSS.
---

## Smoke Test Runner

Run all commands from the theme directory:
```
cd /home/hperkins-wp/htdocs/wp.hperkins.com/wp-content/themes/henrys-digital-canvas
```

### Which suite to run

| What changed | Command |
|-------------|---------|
| Block render.php, view.js, or templates | `npm run smoke:route` then `npm run smoke:browser` |
| REST API endpoints or data contracts | `npm run smoke:api` |
| Design tokens or CSS | `./scripts/stylebook_audit.sh` then `./scripts/token_sync_audit.sh ~/henry-s-digital-canvas/src/index.css` |
| Utility classes or keyframes | `./scripts/utility_sync_audit.sh ~/henry-s-digital-canvas/src/index.css` |
| Everything / unsure | `npm run smoke:full` |

### After running

- Log the result: `npm run smoke:cadence`
- If failures occur, check `npm run smoke:history` for regression patterns
- Override target URL with: `BASE_URL=https://example.com ./scripts/full_smoke.sh`

### Interpreting results

- Route smoke: verifies every page returns HTTP 200 and expected content markers
- API smoke: validates REST endpoint response shapes against data contracts
- Browser smoke: Playwright checks for visual regressions and JS errors
- Stylebook audit: detects parent-token leakage in merged global styles
- Token sync audit: detects drift between WP design tokens and React source index.css
