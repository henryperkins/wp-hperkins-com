---
name: parity-fix
description: Use when a custom theme block has drifted from its source React TSX page and needs parity remediation (missing features, design/function gaps, WP-only extras).
disable-model-invocation: true
---

## Parity Fix Pipeline

Runs the full parity remediation workflow for a single block: check -> triage -> fix.

### Required input

- **Block name** (e.g., `work-showcase`, `about-timeline`) — must be one of the 12 blocks in CLAUDE.md's "Custom Blocks" table
- **Not valid**: `home-page` (+ its 6 children) was retired in the June 2026 core-block sync. Homepage parity is native core blocks driven by `inc/home-core/` — check it with `npm run parity:site` (theme dir), not this pipeline.

### Step 1: Run parity checker

Launch the `parity-checker` agent for the given block:

```
Agent(subagent_type: "parity-checker", prompt: "Compare the WordPress block <name> against its source React TSX...")
```

- Block files: `/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/blocks/<name>/`
- Source TSX: look up the mapping in CLAUDE.md's "Custom Blocks" table
- React source root: `/home/dev/henry-s-digital-canvas/src/`

### Step 2: Evaluate verdict

- **PARITY**: Report "Block is at parity" and stop.
- **MINOR_DRIFT**: Report drifts and ask user if they want to fix any. Stop if no.
- **NEEDS_WORK**: Continue to Step 3.

### Step 3: Review working tree for reusable patterns

**Before designing any fix**, check for uncommitted or recent work in sibling blocks that may provide patterns to reuse:

```bash
git status
git log --oneline -10
git diff --stat  # scan for relevant changes in sibling blocks
```

Look specifically for:
- Animation/reveal systems, shared CSS patterns, or utility functions added in other blocks
- REST API or data contract changes that affect the target block's data sources
- Shared infrastructure changes (e.g., `hdc-shared-utils.js`, `design-system.css`)

Note any reusable patterns for the implementation phase.

### Step 4: Triage — fast-path vs. full plan

**Fast-path** (direct implementation): Use when ALL of these are true:
- No high-severity gaps
- Total gaps <= 12
- Changes touch <= 4 files (block files + shared utils)

**Full plan** (design doc + writing-plans skill): Use when ANY of these are true:
- Any high-severity gap
- Total gaps > 12
- Changes touch > 4 files or require structural refactoring

#### Fast-path flow

1. Present the gap list to the user grouped by severity
2. For WP-only extras the checker labeled "acceptable" or "keep", default to keeping them. Only ask the user about extras labeled ambiguous or "remove recommended"
3. Get user approval to proceed, then go to **Step 5a**

#### Full plan flow

1. Present the gap list and ask about ambiguous extras (same rule as above)
2. Write design doc to `docs/plans/YYYY-MM-DD-<block-name>-parity-design.md` (in the theme dir)
3. Invoke the `superpowers:writing-plans` skill with the design doc path
4. Offer execution options: Subagent-Driven (this session) or Parallel Session

### Step 5a: Implement fixes (fast-path)

Apply all fixes directly, grouped by severity (medium first, then low). For each fix:

1. Verify shared dependencies exist (icon names in `hdc-shared-utils.js`, CSS classes in `design-system.css`, REST fields in data contracts) — add any missing dependencies first
2. Make the edit
3. After all fixes, validate syntax (`node -c` for JS) and run smoke tests

### Step 5b: Implement fixes (full plan)

Follow the generated implementation plan, running smoke tests after each phase.

### Step 6: Verify

- Run `npm run smoke:route` and `npm run smoke:api` from the theme dir
- Flush the object cache: `wp --path=/home/dev/wp-hperkins-com cache flush`
- Browser-check the live page (Playwright snapshot) to confirm visible changes — **this checkout IS production**, so fixes are live as soon as they're saved
- Optionally run `npm run parity:site` (Playwright parity spec vs the source React app)

### Reference

- Existing examples (theme `docs/plans/`): `2026-05-02-work-showcase-parity-design.md`, `2026-03-15-about-timeline-parity-design.md`
- Smoke tests: `npm run smoke:full` from theme dir
- Final verification: re-run parity checker to confirm PARITY or MINOR_DRIFT
