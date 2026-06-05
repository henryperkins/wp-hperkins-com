# Active Theme Plans

Last updated: 2026-06-05

This index is the current handoff map for dated plan files under `docs/plans/`. Older dated plans and designs are historical/audit material unless they are listed here as active or prerequisite context.

## Homepage Core-Block Sync

| File | Status | Use |
|---|---|---|
| `2026-06-04-homepage-core-block-sync-design.md` | Approved architecture | Source for the overall phased design. Phase 0, Phase 1, Phase 2, and Phase 3 implementation plans now exist. |
| `2026-06-05-homepage-core-block-sync-phase-0-plan.md` | Complete live | Worker `id` exposure is deployed to production; the exact WordPress sync URL returns numeric repo ids; WordPress sync observability reports fetched/attempted/applied/skipped counts with `skipped=0`. |
| `2026-06-04-homepage-core-block-sync-phase-1-plan.md` | Complete locally | Data layer + Selected Work plan is present in this checkout; repo logic, registration, selected-work binding, and full live smoke verification passed after the Phase 0 production sync completed. |
| `2026-06-05-homepage-core-block-sync-phase-2-plan.md` | Complete locally | Static core-block patterns, globalized home styling, assembled Home pattern, front-page record sync, parent block retirement, smoke updates, and visual parity fixes are committed locally. |
| `2026-06-05-homepage-core-block-sync-phase-3-plan.md` | Complete locally | Recent Writing now uses a core Query Loop backed by `reading_time` post meta; the six retired home child blocks are deleted; referrer, smoke, parity, and final front-page shape checks passed locally. |

## Superseded Home Plans

The May and early-June `home-page` innerBlocks and `home-selected-work` plans are retained for provenance. Their target behavior has either landed in the current checkout or is being superseded by the core-block sync sequence above. Do not use their unchecked task boxes as active status without first comparing them against the live files.
