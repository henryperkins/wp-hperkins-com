# Codex CLI Parity Workflows

Parity checker, fixer, and batch runner for the henrys-digital-canvas WordPress block theme, adapted from the Claude Code agent/skill system for use with [Codex CLI](https://github.com/openai/codex).

## Prerequisites

```bash
npm i -g @openai/codex
```

## Agents

| Agent | File | Purpose |
|-------|------|---------|
| Parity Checker | `agents/parity-checker.md` | Compare one block against its React TSX source |
| Parity Fixer | `agents/parity-fixer.md` | Full pipeline: check, triage, fix, verify |
| Batch Parity | `agents/batch-parity.md` | Run checks on all 12 blocks, produce aggregated report |

## Quick Start

### Check a single block

```bash
./codex/scripts/parity-check.sh home-page
```

### Fix a single block

```bash
./codex/scripts/parity-fix.sh about-timeline
```

### Batch check all blocks

```bash
./codex/scripts/parity-check.sh --all
```

### Direct codex invocation

```bash
# Check
codex --instructions codex/agents/parity-checker.md \
  "Check the work-showcase block against Work.tsx"

# Fix
codex --instructions codex/agents/parity-fixer.md \
  "Fix the blog-index block"

# Batch
codex --instructions codex/agents/batch-parity.md \
  "Run parity checks on all blocks"
```

## Approval Modes

The wrapper scripts use `--approval-mode suggest` (Codex proposes changes, you approve). For autonomous operation:

```bash
codex --instructions codex/agents/parity-fixer.md \
  --approval-mode auto-edit \
  "Fix the resume-overview block"
```

## How It Maps to Claude Code

| Claude Code | Codex CLI |
|-------------|-----------|
| `.claude/agents/parity-checker.md` | `codex/agents/parity-checker.md` |
| `.claude/agents/batch-parity-runner.md` | `codex/agents/batch-parity.md` |
| `.claude/skills/parity-fix/SKILL.md` | `codex/agents/parity-fixer.md` |
| `Agent(subagent_type: "parity-checker")` | `codex --instructions agents/parity-checker.md` |
| `/parity-fix home-page` | `./codex/scripts/parity-fix.sh home-page` |
| Playwright browser snapshot | `curl -s` + grep verification |

## Key Differences

- **No subagent dispatching**: Codex CLI is single-agent. The parity-fixer does the check inline instead of spawning a separate checker agent.
- **No Playwright**: Browser verification uses `curl` + content checks instead of accessibility snapshots.
- **No MCP**: WordPress operations use `wp-cli` directly instead of MCP adapter tools.
- **Linear workflow**: Steps run sequentially; no parallel agent batches.
