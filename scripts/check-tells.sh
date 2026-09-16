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
ALLOWED_HEX_REGEX='#(f7f4f0|ffffff|fdfbf9|1e1916|a0716a|8a5a52|6467c9|5155b4|336e48|785f20|a2443b|efe9e2|706c69|e5ded6)\b'

# Radii from design-system.md §1.6 + the documented §2.12 input exception.
ALLOWED_RADIUS_PX='2|5|6|7|8|11|100'

# Every hex in src, one "file:line:#hex" per hit. Pure black/white inside a
# gradient( or mask line is dropped first: in a CSS mask only alpha matters,
# so the #000 in FramedSurface's torn edge is a stencil, not a colour, and
# reporting it every turn taught everyone to skim past this section.
HEX_ALL=$(grep -rnE '#[0-9a-fA-F]{3,8}\b' "$ROOT" --include="*.tsx" --include="*.ts" \
  | grep -v '/globals\.css' \
  | perl -ne 'if (/^([^:]+:\d+):(.*)$/) { my ($loc, $line) = ($1, $2); my $stencil = $line =~ /gradient\(|mask/i;
      while ($line =~ /(#[0-9a-fA-F]{3,8})\b/g) { my $h = $1; next if $stencil && $h =~ /^#(000|000000|fff|ffffff)$/i; print "$loc:$h\n" } }')

echo "== Hardcoded hex outside globals.css =="
HEX_HITS=$(echo "$HEX_ALL" | grep -viE "$ALLOWED_HEX_REGEX" | grep .)
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
# app/manifest.ts is excluded: the PWA manifest is JSON handed to the browser,
# so it cannot reference a CSS variable and the page-colour literal is the only
# spelling available there.
TOKEN_HEX_HITS=$(echo "$HEX_ALL" | grep -iE "$ALLOWED_HEX_REGEX" | grep -v '/app/manifest\.ts:')
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
echo "== Type and radius still written by hand (S1 meter: design-system §1.4 / §1.6 — should only go down) =="
# Not a fail yet: the named utilities don't exist, so there is nothing to
# migrate to. Once they do, this section turns into a hard flag like the
# spacing one below. /design-docs/ is excluded: the library pages quote the
# raw values on purpose.
count_arbs() { grep -rnoE "$1" "$ROOT" --include="*.tsx" | grep -v '/design-docs/'; }
TYPE_ARBS=$(count_arbs 'text-\[[0-9]+(\.[0-9]+)?px\]')
LINE_ARBS=$(count_arbs '(leading|tracking)-\[[^]]+\]')
RADIUS_ARBS=$(count_arbs 'rounded-\[[^]]+\]')
n() { if [ -n "$1" ]; then echo "$1" | wc -l | tr -d ' '; else echo 0; fi; }
echo "  text-[…px]:            $(n "$TYPE_ARBS")"
echo "  leading-/tracking-[…]: $(n "$LINE_ARBS")"
echo "  rounded-[…]:           $(n "$RADIUS_ARBS")"
if [ -n "$TYPE_ARBS" ]; then
  echo "  most common sizes:"
  echo "$TYPE_ARBS" | sed -E 's/^[^:]+:[0-9]+://' | sort | uniq -c | sort -rn | head -5 | sed 's/^/   /'
fi

echo
echo "== Arbitrary spacing values (design-system §1.5: named steps pt-section/py-row/… or the 4pt scale, never p-[11px]) =="
SPACING_HITS=$(grep -rnoE '\b(-?(p|m)[xytblr]?|gap|space-[xy]|inset(-[xy])?|top|left|right|bottom)-\[-?[0-9]+(\.[0-9]+)?px\]' "$ROOT" --include="*.tsx" \
  | grep -v '/design-docs/')
if [ -n "$SPACING_HITS" ]; then
  echo "$SPACING_HITS"
  echo "  -> §1.5: layout steps are named (section, row, zone, tight, gutter); inside a component use the 4pt scale. 2px/1px only as the documented optical nudges (ml-0.5, mr-px)."
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
