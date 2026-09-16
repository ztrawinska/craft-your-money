# Craft Your Money

**A pricing and profitability app for people who make things by hand.** Costs go in, a suggested price comes out, and the maker gets a plain verdict on whether their price is good enough — no spreadsheet, no accounting jargon.

Designed and built by [Zuzanna Trawińska](https://github.com/ztrawinska), product designer, as a design-led solo build: the spec and the design system came first, then the code, written screen by screen with Claude Code as a pair programmer.

## The problem

Handmade sellers — jewelry makers first — usually price by feel or by copying a competitor. They aren't financially trained, they're on their phone in the studio, and they won't sit through a long setup before they get an answer. The app is built around four questions:

- What does this product really cost?
- Is this price good enough?
- Is this product profitable?
- What should I do next?

Every screen exists to answer one of them. It is deliberately **not** an ERP, an inventory system, a CRM or an accounting tool.

## What it does

| Screen | What it answers |
|---|---|
| **Dashboard** `/dashboard` | Opens like a message, not a report: a short plain-language briefing, average profit per piece, and up to three things that need attention. Each row ends in a verb — "Reprice ›", "Set price ›" — so it says *what to do*, not just what's wrong. When nothing needs attention, the section simply isn't there. |
| **Products** `/products` | The whole range, problems first. Status chips (Healthy / Caution / Risky / No price), filters, and a deterministic insight strip. |
| **Product detail** `/products/<id>` | Materials, labour steps and other per-unit costs go in; the pricing block comes out — the suggested price, *your* price, the margin, and "your profit £X" as the final word. |
| **Price Check** | An on-demand AI review of one product's price: a verdict, three findings grounded in the real numbers, and an honest footer of what it used, what it assumed and what it can't know. |
| **Materials · Costs · Settings** | A small reusable materials library, optional business overheads (rent, insurance) spread across the month's pieces, VAT and the bench rate. |
| **Design system** `/design` | The live component library — every component in every state, rendered from the real code, Storybook-style. |

Mobile-first (430px column), installable as a PWA, single-user by design.

## Decisions worth a look

The short version. The full reasoning lives in [`docs/`](docs/).

**A suggestion and a decision are two different numbers.** The app calculates a price (`cost ÷ (1 − target margin)`) but never stores it. The maker's own price is the only price saved, and it drives everything downstream — margin, profit, status, market position. The suggestion pre-fills the field and follows the costs until the first manual edit; after that it steps back. → [PRD §6](docs/craft-your-money-prd-v2.md)

**The suggestion targets the same cost the margin is measured on.** With business costs configured, both use full cost; without, both use direct cost. Accepting the suggestion therefore lands exactly on target — the app never recommends a price it will then flag as below target. This replaced a simpler direct-cost-only rule, and the trade-off is written down next to the formula.

**Prices are gross; margin is net.** VAT is off by default and, when off, appears nowhere in the copy. When on, "what you keep" is derived at runtime and the margin runs on that.

**Status lives only in chips.** Numbers are monochrome ink. Colour means exactly one thing on a screen: a status chip, or the single clay accent for actions. Chip tones are named by meaning (`positive`, `caution`, `critical`), never by colour, so the palette can change without touching the logic. → [Design system §1–2](docs/craft-your-money-design-system.md)

**The AI reviews; it never sets the price.** Price Check is bounded on purpose: one verdict, three findings, follow-ups as chips rather than free text, a provenance footer. It is written live by Claude (`claude-haiku-4-5`, structured output, server-only) with a scripted fallback when no key is present. The assistant has its own colour — iris — that appears nowhere else in the app, so the maker always knows which words came from a model. → [PRD §10](docs/craft-your-money-prd-v2.md)

**Plain language, not finance jargon.** "What this costs to make", "what you keep", "your profit" — and when the price doesn't cover the costs, "you lose £X on each piece". Warnings are calm helpers, never alarms.

## How it was built

A design-led build, in this order:

1. **PRD** — [`docs/craft-your-money-prd-v2.md`](docs/craft-your-money-prd-v2.md). Behaviour, pricing logic, the status model, edge cases. The source of truth for *what*.
2. **Design system** — [`docs/craft-your-money-design-system.md`](docs/craft-your-money-design-system.md). Five principles (flat · one framed surface per screen · one accent · status in chips · more authored, not louder), tokens, a type scale, every component with the rule it enforces. The source of truth for *how it looks*.
3. **Reference renders** — [`docs/design/*.html`](docs/design/). Hand-built HTML mockups per screen, used as the layout reference while coding.
4. **The app** — Next.js, TypeScript, Tailwind, built screen by screen against the docs.
5. **The live library** — [`/design`](src/app/design/). The real components rendered in every state. [`design/tokens.json`](design/tokens.json) is a W3C DTCG export of the CSS tokens, and a test fails if the two ever drift.
6. **Figma, last** — a [Figma library](https://www.figma.com/design/4SU2FWCR13o15AspvjXI6F) generated *from* the code: variables, 26 text styles and eight atomic components as variant sets. Code stays upstream; Figma is a documentation surface, not the source.

**Working with an AI pair.** I designed the product and wrote the specs; the code was written with Claude Code against those docs. [`CLAUDE.md`](CLAUDE.md) is a short standing brief that points into `docs/` and states the rules that must not drift — the pricing logic, the status model, the one-accent discipline. [`SETUP.md`](SETUP.md) records what context the project carries and what was decided *against*. [`scripts/check-tells.sh`](scripts/check-tells.sh) greps the source for design-system tells (hex values that aren't tokens, radii outside the documented set, finance jargon in copy) and runs automatically after every AI response.

## Stack

- **Next.js 16** (App Router, Server Actions) · **React 19** · **TypeScript**
- **Tailwind CSS v4**, with the tokens declared as `@theme`; a handful of **shadcn/ui** primitives (Drawer, Input, Switch, Popover) re-skinned to the tokens
- **Vitest** — the pricing maths, status thresholds, the tokens ↔ CSS guard
- **Anthropic SDK** — Price Check, structured output, server-only
- **Upstash Redis** in production, a JSON file under `.data/` locally — one key/value interface, backend picked by environment

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Sample data — a small Greek-myth jewelry collection with one deliberately under-priced piece, so the dashboard has something real to catch — loads on first run.

To make Price Check live, copy `.env.example` to `.env.local` and add an Anthropic API key. Without one it falls back to the built-in scripted review.

```bash
npm test             # unit tests, including the tokens ↔ CSS guard
npm run lint
npm run check:tells  # design-system tells in src/ — reports, doesn't block
```

## Where to look

| Path | What it holds |
|---|---|
| [`docs/`](docs/) | PRD, design system, HTML reference renders |
| [`src/lib/pricing.ts`](src/lib/pricing.ts) | The pricing maths: direct cost, full cost, calculated price, margin, profit |
| [`src/lib/status.ts`](src/lib/status.ts) | The status model — label, chip tone and margin threshold in one table |
| [`src/lib/price-review.ts`](src/lib/price-review.ts), [`price-review-llm.ts`](src/lib/price-review-llm.ts) | Price Check, scripted and live, same shape |
| [`src/lib/store.ts`](src/lib/store.ts) | Persistence: Redis in production, a JSON file locally |
| [`src/components/`](src/components/) | The components. Each file opens with the rule it enforces. |
| [`src/app/design/`](src/app/design/) | The live design-system library |
| [`design/tokens.json`](design/tokens.json) | The tokens in DTCG format, guarded by [`src/lib/tokens.test.ts`](src/lib/tokens.test.ts) |
| [`CLAUDE.md`](CLAUDE.md), [`SETUP.md`](SETUP.md) | How the AI pair is briefed, and what was decided against |

## Scope

MVP, single user, no accounts. Out of scope on purpose: inventory, orders, CRM, accounting, marketplace integrations, forecasting, multi-user roles. Jewelry-first in copy and sample data; the core is category-agnostic — the canonical entity is `product`, and jewelry lives only in copy, product types and examples.
