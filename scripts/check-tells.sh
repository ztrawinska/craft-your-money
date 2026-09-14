#!/usr/bin/env bash
# Mechanical "tell" check against docs/craft-your-money-design-system.md.
#
# This does NOT judge whether a hit is a real problem — it just surfaces
# candidates so a human (or Claude) makes that call, instead of the drift
# quietly surviving into the build. See docs/craft-your-money-design-system.md
# §6 "Enforcement vs convention": this script is how conventions that aren't
# type-enforced still get checked.
#
# Usage: scripts/check-tells.sh [path]   (defaults to src/)

set -uo pipefail

ROOT="${1:-src}"
FAIL=0

# Tokens defined in src/app/globals.css — the only hex values allowed to
# appear literally in component code. Anything else outside globals.css is
# either a new token that should be added there, or a value that should
# reuse an existing one.
ALLOWED_HEX_REGEX='#(f7f4f0|ffffff|fdfbf9|1e1916|a0716a|8a5a52|6467c9|5155b4|3a7d52|9c7b2a|b04a40|efe9e2|7d756e|e5ded6)\b'

# Radii from design-system.md §1.6 + the documented §2.12 input exception.
ALLOWED_RADIUS_PX='2|5|6|7|8|11|100'

echo "== Hardcoded hex outside globals.css =="
HEX_HITS=$(grep -rnoiE '#[0-9a-fA-F]{3,8}\b' "$ROOT" --include="*.tsx" --include="*.ts" \
  | grep -v '/globals\.css' \
  | grep -viE "$ALLOWED_HEX_REGEX")
if [ -n "$HEX_HITS" ]; then
  echo "$HEX_HITS"
  echo "  -> not one of the tokens in src/app/globals.css. Add it as a token, or reuse an existing one."
  FAIL=1
else
  echo "  none"
fi

echo
echo "== Hex values that already have a token, spelled out literally =="
# Catches e.g. #FDFBF9 typed directly instead of using text-primary-foreground / --color-*.
TOKEN_HEX_HITS=$(grep -rnoiE '#[0-9a-fA-F]{3,8}\b' "$ROOT" --include="*.tsx" --include="*.ts" \
  | grep -v '/globals\.css' \
  | grep -iE "$ALLOWED_HEX_REGEX")
if [ -n "$TOKEN_HEX_HITS" ]; then
  echo "$TOKEN_HEX_HITS"
  echo "  -> valid token value, but written as a raw hex instead of the Tailwind/CSS var. Not a hard fail, but worth a pass."
else
  echo "  none"
fi

echo
echo "== Arbitrary radius values outside the documented set ($ALLOWED_RADIUS_PX px) =="
RADIUS_HITS=$(grep -rnoE 'rounded-\[[0-9]+(\.[0-9]+)?px\]' "$ROOT" --include="*.tsx" \
  | grep -vE "rounded-\[($ALLOWED_RADIUS_PX)px\]")
if [ -n "$RADIUS_HITS" ]; then
  echo "$RADIUS_HITS"
  FAIL=1
else
  echo "  none"
fi

echo
echo "== Distinct radius classes in use (design-system §1.6: nothing rounder than 11px except chips) =="
grep -rnoE 'rounded-\[[^]]+\]|rounded-(none|sm|md|lg|xl|2xl|3xl|full)\b' "$ROOT" --include="*.tsx" \
  | sed -E 's/^[^:]+:[0-9]+://' | sort | uniq -c | sort -rn

echo
echo "== Banned copy: design-system §4 jargon (use the plain-language column instead) =="
JARGON_WORDS='direct cost|net revenue|contribution margin|\boverhead\b'
JARGON_HITS=$(grep -rnoiE "$JARGON_WORDS" "$ROOT" --include="*.tsx" --include="*.ts" \
  | grep -vE '/lib/[^:]+\.(ts|test\.ts):')
if [ -n "$JARGON_HITS" ]; then
  echo "$JARGON_HITS"
  echo "  -> §4: internal/variable names are fine, but this must not be user-facing copy. Check by hand."
else
  echo "  none in user-facing files (internal lib/*.ts names excluded)"
fi

echo
echo "== Generic AI-copy tells (em dash, stock CTAs, consultant vocabulary) =="
echo "   (comment lines excluded — this checks copy, not docblocks/prose-about-code)"
COPY_TELLS='—|Get Started\b|Learn More\b|seamlessly|leverage|empower|unlock|streamline|supercharge|delve|landscape|journey|tapestry|testament|ecosystem'
COPY_HITS=$(grep -rnE "$COPY_TELLS" "$ROOT" --include="*.tsx" \
  | grep -viE '^[^:]+:[0-9]+: *(\*|//|/\*|\{/\*)' \
  | grep -v '//.*—')
if [ -n "$COPY_HITS" ]; then
  echo "$COPY_HITS"
  FAIL=1
else
  echo "  none"
fi

echo
if [ "$FAIL" -eq 1 ]; then
  echo "Result: hits found above. Each is a candidate, not an automatic failure — decide per-line, per docs/craft-your-money-design-system.md §6."
else
  echo "Result: clean."
fi
exit 0
