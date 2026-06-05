# Token Sync Audit

- Status: **FAIL**
- Source CSS: `/home/dev/henry-s-digital-canvas/src/index.css`
- Design system CSS: `/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/assets/css/design-system.css`
- Theme JSON: `/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/theme.json`
- Dark variation JSON: `/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/styles/ember-dark.json`
- Checks: `336`
- Mismatches: `10`

## Mismatches

| Check | Actual | Expected |
| --- | --- | --- |
| `design-system light --layer-local-raised` | `` | `10` |
| `design-system light --motion-duration-route` | `220ms` | `200ms` |
| `design-system light --motion-duration-route-exit` | `` | `150ms` |
| `design-system light --motion-duration-route-slide` | `` | `260ms` |
| `design-system light --motion-ease-route` | `` | `cubic-bezier(0.32, 0.72, 0, 1)` |
| `design-system dark --layer-local-raised` | `` | `10` |
| `design-system dark --motion-duration-route` | `220ms` | `200ms` |
| `design-system dark --motion-duration-route-exit` | `` | `150ms` |
| `design-system dark --motion-duration-route-slide` | `` | `260ms` |
| `design-system dark --motion-ease-route` | `` | `cubic-bezier(0.32, 0.72, 0, 1)` |
