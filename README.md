# Craft Your Money

A pricing and profitability app for people who make things by hand (jewelry first). It helps a maker decide what to charge: costs in, a suggested price out, and a plain verdict on the margin. Mobile-first, Next.js, single-user, flat file store.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Sample data loads on first run.

| Route | What |
|---|---|
| `/dashboard` | Briefing, profit hero, what needs attention |
| `/products` | The range, sorted problems-first |
| `/products/<id>` | Costs, the pricing block, price check |
| `/materials`, `/costs`, `/settings` | Library, business costs, account |
| `/design` | The design system, live |

## Design system

The system is documented in three layers, and the app renders it:

| Where | What it holds |
|---|---|
| `docs/craft-your-money-design-system.md` | The rules and the reasoning. Source of truth for *why*. |
| `docs/craft-your-money-prd-v2.md` | Product behaviour. |
| `docs/design/*.html` | Reference renders per screen. |
| `src/app/globals.css` | The tokens (Tailwind `@theme`) and the shadcn bridge. Source of truth for *values*. |
| `design/tokens.json` | The same tokens in the W3C DTCG format, for tooling and Figma. A checked export: `src/lib/tokens.test.ts` fails if it drifts from the CSS. |
| `src/components/*.tsx` | The components. Each file opens with the rule it enforces. |
| `src/components/ui/*.tsx` | shadcn/ui primitives (Drawer, Input, Switch, Popover), re-skinned to the tokens. |
| `src/lib/status.ts` | The status model: label, chip tone and margin threshold in one table. |
| `/design` (`src/app/design`) | The live library: foundations, every component in every state, patterns. Storybook-style sidebar. |
| [Figma · Craft Your Money · Design System](https://www.figma.com/design/4SU2FWCR13o15AspvjXI6F) | Generated *from* the code: Colour / Radius / Space variables (code syntax = the CSS), 26 text styles, and Chip, Button, Price, SectionLabel, Dropdown, AssistantSlot, ListRow, BottomNav as variant sets. Code stays upstream. |

## Checks

```bash
npm test          # unit tests, including the tokens ↔ CSS guard
npm run lint
npm run check:tells
```

`check:tells` (`scripts/check-tells.sh`) greps `src/` for design-system tells: hex values that aren't tokens, radii outside the documented set, finance jargon in copy, generic AI-copy tells. It reports; it doesn't block. A Stop hook in `.claude/settings.json` runs it after every Claude response.

## Working with Claude

`CLAUDE.md` is a short pointer into `docs/`. Reading order for a new screen: PRD (behaviour) → design-system.md (components) → the matching mockup (layout). `SETUP.md` records what the project context contains and what was decided against.
