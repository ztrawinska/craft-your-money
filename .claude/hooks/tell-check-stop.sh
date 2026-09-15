#!/usr/bin/env bash
# Stop hook: runs scripts/check-tells.sh automatically when Claude finishes
# responding, and surfaces any hits as context for the next turn.
#
# Report-only by design — see docs/craft-your-money-design-system.md §6.
# This never exits 2 / blocks; it only hands findings back for a human (or
# Claude, next turn) to judge per-line.

set -uo pipefail

INPUT="$(cat)"

# Guard against the Stop-hook loop: if this Stop hook is itself what
# triggered the current stop cycle, bail immediately.
STOP_HOOK_ACTIVE="$(printf '%s' "$INPUT" | jq -r '.stop_hook_active // false' 2>/dev/null)"
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  exit 0
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CHECK_SCRIPT="$REPO_ROOT/scripts/check-tells.sh"

if [ ! -x "$CHECK_SCRIPT" ]; then
  exit 0
fi

OUTPUT="$("$CHECK_SCRIPT" 2>&1)"

if printf '%s' "$OUTPUT" | grep -q "Result: hits found"; then
  ESCAPED="$(printf '%s' "$OUTPUT" | jq -Rs .)"
  printf '{"systemMessage": "check-tells.sh found candidates worth a look (design-system tells) — see additional context.", "hookSpecificOutput": {"hookEventName": "Stop", "additionalContext": %s}}\n' "$ESCAPED"
fi

exit 0
