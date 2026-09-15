# GARAGE — Craft Your Money design system

Check-in: 2026-09-15. Re-confirm at the next inspection ("anything changed since 2026-09-15?").

## Profile

| | |
|---|---|
| System | Craft Your Money design system (r3) — flat, one accent (clay), one framed surface per screen, status only in chips |
| Team | Solo: Zuzanna (designer, learning to build). Claude is the second consumer of the system. |
| Consumers | One Next.js app (`src/app`), plus the AI assistant surfaces (Iris) |
| Stack | Next.js (App Router), Tailwind v4 (`@theme` in `src/app/globals.css`), Radix/shadcn primitives in `src/components/ui`, vaul, lucide |
| Source of truth | **Code.** `globals.css` → `design/tokens.json` (mirror, guarded by `src/lib/tokens.test.ts`) → Figma library *generated from code*. Figma is a mirror; drift in Figma is debt, not a decision. |
| Spec | `docs/craft-your-money-design-system.md` (visual/component spec), `docs/craft-your-money-prd-v2.md` (behaviour), `docs/design/*.html` (7 reference renders) |
| Live docs | `/design` (`src/app/design`) — Storybook-style library rendered from the real components |
| Figma | "Craft Your Money · Design System", file key `4SU2FWCR13o15AspvjXI6F` |
| Calibration | Green = healthy *for a solo system with one app*. Not a platform-org bar. |

## Evidence access map

| Source | Access | How |
|---|---|---|
| Repo files | live `[verified]` | direct read |
| Figma library | live `[verified]` | figma-console MCP via Desktop Bridge plugin (whole-file sweep possible: variables, components, styles, lint via Plugin API) |
| Official Figma MCP | not available | needs OAuth in an interactive session; not needed — console bridge covers it |
| Docs | live `[verified]` | `docs/`, `/design` source |
| Tests / hooks | live `[verified]` | `src/**/*.test.ts`, `.claude/hooks`, `scripts/check-tells.sh` |
| CI | none found | no `.github/workflows` |
| Knowledge MCP for benchmarking | none | benchmarks come from the inspector's own knowledge — said so where used |
| Interview | done 2026-09-15 | scale, source of truth, scope (all 10 stations) |

## Noted intentional deviations

- Figma is deliberately downstream of code (generated). Missing typography variables in Figma may be a generation gap, not a policy — confirm at station 1/4.
- Iris (`#6467C9`) is an intentional second hue reserved for the AI assistant; not a "second accent" violation.
