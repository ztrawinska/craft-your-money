# Design context setup

Checklist for this project's Claude context scaffold. Run `/design-context-setup` again and say "continue setup" to pick up where this left off.

## Have it already

- `CLAUDE.md` — short pointer file (56 lines), points into `docs/` for behaviour/design/mockups. Good as-is.
- `docs/craft-your-money-prd-v2.md` — product behaviour, source of truth.
- `docs/craft-your-money-design-system.md` — tokens, type scale, components.
- `docs/design/*.html` — reference renders per screen.
- Verification loop — `.claude/launch.json` runs `npm run dev`; Browser pane tools available for screenshot/diff checks. No extra setup needed.
- `.claude/skills/` — `ask-matt`, `grill-me`, `ux-motion` already linked.
- `design/tokens.json` — DTCG export of the tokens in `src/app/globals.css`, guarded by `src/lib/tokens.test.ts` (fails on any drift). Added 2026-09-14 for the live library and for Figma variables. CSS stays the source; the JSON is a *checked* export, which is what makes it safe (see the reversed decision below).
- `/design` route — the live component library: tokens, every built component in every state, props, rules, shadcn links. Convention, not enforced: a new component has to be added to the docs by hand.

## Decided against

- **`.claude/rules/design-principles.md`** — drafted, then removed. It only restated what's already in `CLAUDE.md` (naming-by-meaning, flat/one-accent visual rules, plain-language copy, working style) with no new content, so it was pure duplication with no benefit while `CLAUDE.md` stays short.
- **Figma MCP connection** — user confirmed `docs/` + the HTML mockups are the actual source of truth, no Figma file exists upstream of them.
- **`tokens.json` / token pipeline (reversed 2026-09-14)** — originally rejected because a second file could drift from `globals.css` with no Figma to sync from. Reversed once the file had a *reader* (the `/design` tokens page, Figma variables) and a *guard* (`tokens.test.ts`): a checked export can't silently drift. A generating pipeline (Style Dictionary → CSS) is still not set up; CSS remains the hand-edited source.
- **`.claude/agents/`** — solo project, no handoff/governance need right now.

## Add later (trigger)

- **Split principles out of `CLAUDE.md`** — if `CLAUDE.md` starts creeping toward the ~200-line ceiling (e.g. after adding several more screens' worth of exceptions or rules), pull the "how to decide" content (naming, flat design discipline, plain language) into `.claude/rules/design-principles.md` at that point — not before.
- **Figma MCP connection** — done 2026-09-15: https://www.figma.com/design/4SU2FWCR13o15AspvjXI6F (variables + text styles + 8 atomic components, generated from `design/tokens.json` and `src/components`). Originally planned in the *other* direction: a Figma library generated *from* code (`design/tokens.json` → variables, `src/components/` → components with variants), so screens can be redrawn for documentation. Code stays upstream. Needs the Figma connector authorised in claude.ai first. If Figma ever becomes the actual design source instead, revisit `.claude/rules/` for token/component sourcing rules.
