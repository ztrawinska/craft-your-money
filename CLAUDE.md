@AGENTS.md

# Craft Your Money — build context

> **The full spec lives in `docs/`, not in this file.** Read it per-screen; don't reconstruct it from memory here.
> - `docs/craft-your-money-prd-v2.md` — product behaviour. Current source of truth; supersedes anything older.
> - `docs/craft-your-money-design-system.md` — visual & component source of truth (tokens, type scale, each component).
> - `docs/design/*.html` — reference renders. Read the matching one when building a given screen.
>
> Reading order for a new screen: **PRD (behaviour) → design system (components) → the matching mockup (layout).**
> This file stays a short standing summary for orientation only. Where it and the PRD disagree, reconcile them in the same breath — never let them drift.

## What this is

A pricing & profitability web app for handmade jewelry makers. Jewelry-first in copy and sample data, but the core is category-agnostic. Not an ERP, CRM, inventory system, or accounting tool. The goal of every screen: help the user decide, not just display numbers.

## Naming principle (important)

Name things by meaning, not implementation. "product" is the canonical entity term (jewelry lives only in copy, examples, product types, sample data). Chip tones name meaning (positive/caution/critical), not colour. Button variants name role (primary/ghost/link), not colour.

## Design system (r3)

* Flat. No cards, no drop shadows, no floating panels. Sections separated by hairline rules only.
* Exactly ONE framed surface per screen: the pricing block (thin border + clay top rule).
* One accent only: clay `#A0716A` / clay-deep `#8A5A52` — actions, links, focus, pricing frame.
* Status lives ONLY in chips, never as raw coloured text. Numbers are monochrome ink `#1E1916`; colour lives only in chips + the clay accent (Stripe discipline).
* Fonts: Lora (serif) for product names, prices, numbers; IBM Plex Sans for all UI/body.
* Tokens: page `#F7F4F0`, ink `#1E1916`, status green `#3A7D52` / amber `#9C7B2A` / red `#B04A40`.
* Iris `#6467C9` ("the glint") appears ONLY when the AI assistant is involved. Never mixes with clay on one element, never with status colours.

## Status model

Two separate layers:

* workflow_status: draft | active
* profitability status (active products only): Healthy (margin ≥30%) / Caution (15–30%) / Risky (<15%) / No price

User-facing status labels: Healthy / Caution / Risky / No price. Chip tone is the internal colour-meaning; keep the two mapped, don't let them drift.

## Pricing logic (subtle — do not simplify)

* direct_cost = materials + labour + other per-unit costs.
* calculated_price = direct_cost ÷ (1 − target_margin). ALWAYS from direct cost, never full cost. Runtime-only, NEVER persisted.
* final_price ("your price") is the user's decision and drives ALL logic (margin, profit, status, market position). Pre-filled with calculated_price; auto-syncs until first manual edit, then decoupled; "reset to calculated" is one-time and does not re-enable auto-sync. final_price is the only price stored.
* VAT: final_price is GROSS. net_price = final ÷ (1 + vat_rate), runtime-derived. Margin runs on NET. VAT off by default (no VAT copy anywhere when off).
* Fixed costs are OPTIONAL. If configured: full_cost = direct_cost + fixed_cost_per_unit, and margin/profit evaluate against full_cost. Otherwise everything runs on direct_cost.
* Profit is shown in money as the final word of the pricing block ("your profit £X", after all costs). Loss flips to "you lose £X on each piece".
* Activation without a final price is allowed → workflow_status=active, status=No price.

## Plain language, not finance jargon

"what this costs to make" not "direct cost"; "what you keep" (VAT) vs "your profit" (after all costs). Warnings are calm helpers, never alarms.

## How I want to work

I'm a designer learning to build — explain files and decisions in plain language as you go, pause at natural gates so I can look before we move on. Don't move too fast. Flag when my spec is only a convention vs enforced in code.
