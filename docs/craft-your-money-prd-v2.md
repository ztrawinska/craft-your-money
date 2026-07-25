# Craft Your Money — PRD v2

**Status:** current source of truth. Supersedes the original PRD (MVP 1.0) and all separate amendment files.
**Rule:** where this document conflicts with anything older, this wins. Where it conflicts with `CLAUDE.md`, they must be reconciled in the same breath — not left to drift.

---

## 1. What this is

A pricing and profitability web app for handmade business owners. It helps them understand what a product truly costs, price it with confidence, and see which products are worth growing — without a spreadsheet or accounting software.

Jewelry-first in UX: examples, materials, labour steps and helper copy reflect real jewelry making. The core is generic by design so it can extend to other handmade categories.

**Not:** an ERP, inventory system, CRM, accounting replacement, or order management tool.

Every screen should help answer one of four questions:
- What does this product really cost?
- Is this price good enough?
- Is this product profitable?
- What should I do next?

---

## 2. Users

**Primary — the solo maker.** Runs a small handmade brand alone. Sells via Etsy, Instagram, a webshop, or markets. Prices by feel or competitor copying. Avoids spreadsheets. Core need: *"tell me if this price is good enough and what to do if it isn't."*

**Secondary — the growing craft business.** Small team, some operational complexity. Knows a profitability problem exists but can't diagnose it. Core need: *"show me which products are worth scaling and which are quietly draining me."*

**Constraints:** users aren't financially trained (jargon is a barrier), are often on mobile in the studio, won't tolerate long setup before value, and must reach a meaningful calculation in under 3 minutes.

---

## 3. Naming principle

Name things by **meaning, not implementation**.

- `product` is the canonical entity term. Jewelry lives only in copy, examples, product types and sample data.
- Chip tones name meaning (`positive`, `caution`, `critical`, `neutral`), never colour.
- Button variants name role (`primary`, `ghost`, `link`), never colour.

This is what keeps the product category-agnostic and the design system refactorable.

---

## 4. MVP feature set

- **Product cost calculator** — materials, labour steps, other per-unit costs → total direct cost, broken down.
- **Calculated price and final price** — a system suggestion alongside the user's own decision.
- **VAT layer** — optional, gross-first (see §6).
- **Optional fixed-cost layer** — business overhead allocated per unit, producing full cost and real margin.
- **Profitability overview** — all products compared by status and margin, problems first.
- **Draft and activate workflow** — save partial work, activate when ready.
- **Lightweight materials library** — reusable materials with unit cost and optional stock.
- **Simple market benchmark** — 3–5 manually entered competitor prices.
- **Price Check (AI)** — bounded, on-demand pricing review (see §10).

### Out of scope for MVP
Inventory management, order/fulfilment tracking, CRM, accounting, barcodes, platform integrations (Shopify/Etsy/Baselinker), forecasting, multi-user roles, multi-category templates, native mobile apps, tax filing, historical time-series, batch production scaling.

---

## 5. Core flow: add and price a product

1. **Initiate** — "+ Add product" from dashboard or overview → `/products/new`.
2. **Create** — product name (required), product type (optional: Ring / Necklace / Earrings / Bracelet / Other).
3. **Draft saved immediately** — name, type, `workflow_status = draft`, user, timestamp. A product with only a name is a valid placeholder draft.
4. **Redirect** to `/products/[id]` with empty cost sections and the prompt "Now add your costs."
5. **Materials** — inline rows: name, quantity, unit, cost per unit. Live line cost and total. Library items autofill unit cost (still editable).
6. **Labour** — inline labelled steps: label, duration in minutes, rate per hour (defaults to bench rate). Live line cost and total.
7. **Other direct costs** — optional flat per-unit amounts. Examples: ring box, hallmarking fee, **outsourced finishing or plating**.
8. **Direct cost summary** — materials + labour + other, with the reconciling lines from §7.
9. **Calculated price** — read-only, live, never persisted (see §6).
10. **Final price** — editable, pre-filled, auto-syncs until first manual edit (see §6).
11. **Profitability preview** — live, draft-only, expressed in the chip as "Would be Healthy · 52%".
12. **Save draft** — persists everything, `workflow_status` stays draft, excluded from dashboard metrics.
13. **Save and activate** — persists everything, `workflow_status = active`, real profitability status evaluated. A final price is **not** required to activate.

---

## 6. Pricing logic

This section is the substance of the product. It is subtle; do not simplify it.

### Direct cost
```
materials_cost = Σ (quantity × unit_cost)      for completed rows (qty > 0, cost present)
labour_cost    = Σ (minutes ÷ 60 × rate)       for completed rows (duration > 0)
other_cost     = Σ amounts                     for completed rows (amount > 0)

direct_cost    = materials_cost + labour_cost + other_cost
```

### Fixed costs (optional layer)
```
monthly_equivalent        = amount                          if period = monthly
                          = amount × (months_active ÷ 12)   if period = seasonal
total_monthly_fixed_cost  = Σ monthly_equivalents

fixed_cost_per_unit = total_monthly_fixed_cost ÷ units_per_month          (per-unit method)
                    = (product_labour_hours ÷ labour_hours_per_month)
                      × total_monthly_fixed_cost                          (bench-time method)

full_cost = direct_cost + fixed_cost_per_unit
```
Only calculated when fixed costs are configured. Otherwise everything runs on `direct_cost`.

### Calculated price (the suggestion)
```
calculated_price = direct_cost ÷ (1 − target_margin)
```
- **Always from direct cost, never full cost.** Deliberate: avoids double-counting business costs and keeps the suggestion stable when volume estimates change.
- **Runtime-only. Never persisted.**
- If fixed costs are configured, a clearly-labelled secondary reference may be shown: `full_cost ÷ (1 − target_margin)`. It does not affect the final-price pre-fill.
- *Known revisitable decision:* basing the suggestion on full cost is a cheap change (one formula, nothing persisted). If revisited, prefer a Settings toggle over a per-product option.

### Final price (the decision)
`final_price` is the user's actual selling price and drives **all** downstream logic: margin, profit, status, market position.

Three-state sync:
1. Pre-filled with `calculated_price`, auto-syncing.
2. On first manual edit → decoupled permanently.
3. "Reset to calculated price" is one-time and **does not** re-enable auto-sync.

`final_price` is the only price persisted.

### VAT — gross-first
- `final_price` is **GROSS** — the price on the tag, the Etsy listing.
- `net_price = final_price ÷ (1 + vat_rate)` — runtime-derived, never stored.
- **Margin and profit run on NET.**
- Settings holds one VAT group per account: a toggle ("I'm VAT registered") and a free-entry rate.
- Off by default → no VAT copy appears anywhere.
- Data: two fields on User (`vat_enabled`, `vat_rate`). Zero fields on Product.
- Key edge case: profitable before VAT, loss after → explicit warning.

### Margin and profit
```
relevant_cost = full_cost    if fixed costs configured
              = direct_cost  otherwise

margin_amount = net_price − relevant_cost
margin_pct    = margin_amount ÷ net_price
```

**Profit is the final word of the pricing block**, shown in money:
- Amount leads, percentage is context, chip carries the verdict.
- Scope line: "after materials, labour, and business costs".
- The chain reads: *customer pays £42 → you keep £35 after 20% VAT → your profit is £18.20*.
- Language: **"you keep"** is reserved for VAT; **"your profit"** for after-costs.
- A loss flips the wording entirely: *"You lose £X on each piece"* — never the word "profit".

### Price warnings (plain language)
| Condition | Message |
|---|---|
| `final_price < direct_cost` | "Your price is below your costs. You'd lose £X.XX on every sale." |
| `direct_cost ≤ final_price < calculated_price` | "Your price covers costs but is below your [X%] margin target." |
| fixed costs configured, `final_price < full_cost` | "This product looks profitable before overhead — but fixed costs make it a loss." |
| `final_price = direct_cost` | "You're breaking even. No profit on this product." |
| VAT on, profitable gross but loss net | "This is profitable before VAT — but a loss after." |
| `target_margin = 0%` | "A 0% margin target means no profit. Is this intentional?" (soft caution, not an error) |

### Market position
```
market_min / market_max / market_median = from entered competitor prices

final_price < market_min   → "Below market"
final_price ≤ market_max   → "Within market range"
final_price > market_max   → "Above market"
```
Always uses `final_price`. Collapsed by default. 2+ entries needed for range language.

---

## 7. Cost summary — reconciling

The summary band must let the user derive the profit by eye. When fixed costs are configured it reads:

```
Materials                     £2.81
Labour                       £11.25
─────────────────────────────────
Direct cost                  £14.06
 · Your share of business costs  £2.74     (dashed, secondary)
 · Full cost                    £16.80     (dashed, secondary)
```

So that `£35.00 (net) − £16.80 = £18.20` is visible arithmetic, not a black box. The dashed lines are hidden when fixed costs are unconfigured or the volume figure is missing.

---

## 8. Status model

Two **separate** layers.

### Workflow status
- `draft` — saved, not yet active. May hold complete, partial, or name-only data. Visible in overview with a "Draft" label. Profitability preview shown on detail page only. Excluded from all dashboard metrics.
- `active` — part of the live collection. Included in dashboard metrics. Profitability status evaluated and displayed.

### Profitability status (active products only)
| Status | Condition |
|---|---|
| **No price** | `final_price` is null or empty |
| **Healthy** | `margin_pct ≥ 30%` |
| **Caution** | `15% ≤ margin_pct < 30%` |
| **Risky** | `margin_pct < 15%` (including negative) |

Thresholds are user-adjustable in Settings; defaults seeded above.

### The chip is the status carrier
Status, margin and colour merge into **one chip**, system-wide:
- Active: `Healthy · 64%`, `Caution · 22%`, `Risky · 8%`
- No price: `No price` (neutral tone — it is not a health judgment)
- Draft: `Draft`
- Draft with a price, on the detail page: `Would be Healthy · 52%` — the words "Would be" carry the draft-ness. The old sentence "If activated, this would be Healthy" is **deleted**.

**Label ↔ tone mapping must be explicit in code**, not remembered:

| User-facing label | Chip tone |
|---|---|
| Healthy | `positive` |
| Caution | `caution` |
| Risky | `critical` |
| No price | `neutral` |
| Draft | `neutral` |

### Sort order (products overview)
Risky → Caution → Healthy → No price → Draft.

### Dashboard inclusion
| State | In metrics |
|---|---|
| Active + Healthy / Caution / Risky | ✓ |
| Active + No price | ✗ |
| Draft (any) | ✗ |

---

## 9. Design system (r3)

Converged after three polish rounds. Reference points: YNAB (contrast discipline, action-per-row), Linear (calm, one accent, monochrome), Stripe (colour in chips, never in numbers), Oura (conversational voice). Directional only — never copied visually.

### Principles
- **Flat.** No cards, no drop shadows, no floating panels. Sections separated by hairline rules only.
- **Exactly one framed surface per screen** — the place a decision happens (on Product Detail: the pricing block, thin border + clay top rule).
- **One accent: clay.** Actions, links, focus, the pricing frame, the primary button.
- **Status lives only in chips.** Never raw coloured text.
- **Numbers are monochrome ink.** Colour lives only in chips and the clay accent.
- Near-invisible paper-grain texture (~2% SVG noise).

### Tokens
| Token | Value |
|---|---|
| page | `#F7F4F0` |
| card | `#FFFFFF` |
| cream-mid | `#EDE7DD` |
| ink | `#1E1916` |
| clay | `#A0716A` |
| clay-deep | `#8A5A52` |
| status green (Healthy) | `#3A7D52` |
| status amber (Caution) | `#9C7B2A` |
| status red (Risky) | `#B04A40` |
| iris (the glint) | `#6467C9` |
| iris-deep | `#5155B4` |

**Currency:** £ everywhere, including sample data. Currency is a user setting but only changes the symbol — no conversion.

### Typography
- **Lora** (serif) — product names, prices, key numbers, greetings.
- **IBM Plex Sans** — all UI chrome and body copy.

### The glint (AI identity)
A soft four-pointed spark in iris:
```
M12 3 Q13.6 9.4 21 12 Q13.6 14.6 12 21 Q10.4 14.6 3 12 Q10.4 9.4 12 3 Z
```
Appears **only** when the assistant is involved. Never mixes with clay on one element. Never uses status colours. Library-autofill hints use a neutral ◆ diamond instead — autofill is deterministic, not AI.

### Chrome is branch-agnostic
Navigation icons are neutral open-source Lucide (ISC): house, tag, layers, wallet, plus. **No jewelry in the chrome** — so the product ports to any craft without redrawing navigation. Jewelry lives in content and sample data only.

### Bottom navigation
`Home · Products · [+] · Materials · Costs` (Settings is not a tab; it lives behind the dashboard avatar).
- Active tab: clay top-tick + clay icon stroke + heavier clay label. No background pill.
- Central "+": always "new product". A **flat, gently-rounded clay square** (42px, radius 11px), bottom-aligned with the tabs. No lift, no shadow, no FAB.

### Logged exception
The Market Benchmark section keeps the earlier r2 treatment (closed, bordered tab) rather than the flat r3 language.

---

## 10. Price Check (AI assistant)

**Concept:** the assistant reviews, it never sets the price.

- Silent by default. Invoked by a glint button in the pricing block: "Check this price".
- Returns a **bounded review card**: verdict → three findings → two preview-only scenario chips → provenance footer ("Used / Assumed / Can't know").
- Follow-ups are chips, not free text. Roughly three exchanges deep, then it stops.
- **One protective exception:** activating below the calculated price offers a declinable "second look".
- Live Claude API when built, with a scripted fallback.

The boundary must stay honest: the dashboard's "Ask about your prices" slot is an *entry point* for future AI. Nothing there generates until it genuinely does.

---

## 11. Screens

### Dashboard (`/dashboard`)
Opens like a message, not a screen title.
- **Header:** date + greeting ("Good afternoon, Zuza") and an **avatar** top-right (Settings behind it). No "Home" title — the greeting orients, and the nav tab already says Home.
- **Briefing:** a short, warm paragraph in plain language, assembled deterministically from real numbers. Carries the good news on a good day and names the problem on a bad one.
- **Hero:** **average profit per piece**, in money, monochrome. Always true, every day — no empty "0", no forced celebration.
- **Supporting metrics:** Priced (12 / 14) and Below target (3 ›). On a clear day, "Below target" reads "all on target" in quiet italic rather than showing a proud zero.
- **Needs attention:** max 3 items. Each row ends in a **clay verb-link** — "Reprice ›", "Set price ›" — so the row answers *what do I do*, not just *what's wrong*. The status chip sits in the meta line.
  - Priority: active Risky → active No price → low-stock materials. Drafts never appear.
  - **When nothing needs attention, the entire section does not render.** No reassurance band, no empty state. The shorter screen is the message.
- **Resume draft**, then the assistant slot.

### Products overview (`/products`)
- Deterministic insight strip (no AI, no iris).
- Filter pills (active products only; "All" includes drafts), urgency sort by default.
- Rows: product name (Lora) + type · price on the meta line, status chip on the right, left-edge stripe as a secondary scan aid.
- Desktop: table layout, all columns visible, sortable headers, plus a **Profit / piece** column. Mobile keeps percentage only.

### Product detail (`/products/[id]`)
Identity → materials → labour → other costs → reconciling summary → **pricing block (the one framed surface)** → market benchmark (collapsed) → sticky save bar. No bottom nav on this screen.

### Materials (`/materials`)
Inline edit, optional stock layer (ghost "no stock tracked"), safe delete — products keep their own cost copies.

### Business costs (`/costs`)
Costs → total → allocation method (two radio cards: per-unit vs bench-time) → result with a real product example. Zero volume blocks the result with a quiet inline message — plain ink in a tinted band, never a coloured alarm (see design system §4). **Never says "overhead"** — always "business costs".

### Settings
Groups: bench rate, target margin, currency, VAT, thresholds (read-only in MVP), account. Ripple rules stated as helper copy:
- hourly rate → applies to new rows only
- target margin → recalculates suggestions and auto-synced prices, never manually-set ones
- currency → symbol only, no conversion
- VAT → recalculates margins and statuses; prices never move

Delete account requires typing DELETE.

---

## 12. Interaction rules

### Inline add / edit — never a modal
The row expands in place; a clay left-stripe marks edit mode; everything below shifts down.
- Library autofill: typing surfaces saved materials (◆ marks library items); picking one fills unit cost, still editable; **"+ Use as new" is always the last option** so the library never traps you.
- Line cost computes live as you type, shown before saving.
- Delete opens an **inline confirm**, never a jump-away modal, and the copy reassures: the library entry survives, only this line goes.
- Save is gated until the row is valid. No error states while typing.
- Keyboard up: the Save action stays reachable directly above it (PRD Phase-B check). 16px inputs prevent iOS auto-zoom; 44px touch targets throughout.

### Save bar
Sticky at the bottom when unsaved changes exist, hidden otherwise. Stacked on mobile: `Save and activate` above `Save draft`. Leaving with unsaved changes triggers a lightweight confirm, not a heavy modal.

---

## 13. Responsive rules

One codebase, one URL. Mobile-first core loop, adapted upward. **Desktop-better means more comfortable, never exclusive.**

Every action must be reachable by tap: no hover-only affordances, no right-click, no hover-revealed actions as the only access point.

**Compactness applies to lists, not to the dashboard.** List rows are compact two-line (56–64px); the dashboard is a briefing and gets generous space between its zones. These are different screen types with different rules.

---

## 14. Data model

| Entity | Holds |
|---|---|
| **User** | login, default bench rate (£15/hr), default target margin (40%), currency, thresholds, `vat_enabled`, `vat_rate` |
| **Product** | name, type, `workflow_status`, `final_price`, `target_margin`, archived flag, timestamps |
| **ProductMaterial** | name, quantity, unit, unit cost; optional reference to a library Material |
| **LaborEntry** | label, duration in minutes, rate per hour |
| **OtherDirectCost** | label, amount |
| **Material (library)** | name, unit cost, unit type, optional stock quantity, optional low-stock threshold |
| **FixedCost** | label, amount, period (monthly / seasonal), months active |
| **FixedCostSettings** | allocation method, volume figure (units or hours per month) |
| **MarketBenchmark** | optional label, price — belongs to a product |

**Never stored:** `calculated_price`, `net_price`, margin, profit, profitability status. All runtime-derived.

---

## 15. Edge cases

| Case | Behaviour |
|---|---|
| Draft with no costs | "Add costs to see your direct cost" / "Add costs to see a price". Valid placeholder. |
| Draft with partial costs | Only completed rows count. Incomplete rows stored but excluded. Preview shown with caveat. |
| Active, no final price | Status = No price. Excluded from avg margin and below-target metrics. Appears in Needs attention. |
| Final price below direct cost | Negative margin, status Risky, explicit loss warning. |
| No fixed costs configured | Direct cost only. Quiet nudge, never a block. |
| Missing benchmark data | Collapsed, empty state copy, no range or median. |
| Very long product name | Clamped at two lines in rows; full name in the detail header. |
| Unsaved changes | Sticky save bar; lightweight leave confirm; draft record retained. |
| Manual final price diverging | "Reset to calculated price (£X.XX)" appears. Reset does not re-enable auto-sync. |
| Fixed cost allocation, zero volume | Inline amber message; result blocked until resolved. |

---

## 16. Principles

- **Simple first, deeper later.** Fixed costs, benchmarks and the library are opt-in depth layers.
- **Decision support over data overload.** Every screen ends with a signal.
- **Plain language over finance jargon.** "What this costs to make", not "direct cost". "What you keep", not "net revenue".
- **Jewelry-first examples, generic core.**
- **Avoid spreadsheet-like complexity.** No walls of fields, no 10-column tables by default.
- **Avoid false precision.** Outputs reflect the quality of inputs.
- **Compact, not bloated** — for lists. Briefings breathe.
- **Warnings are helpers, not alarms.** "Error" and "invalid" are reserved for real system failures.
- **Opinions without lecturing.** One chip, one plain sentence. The user runs the business.
- **Calm, trustworthy, non-corporate.** Like a knowledgeable friend — warm but not cute, polished but not generic.
- **Accessibility is part of done**, not polish.

---

## 17. Success criteria

- A maker with no setup can add a product, enter costs, see a suggested price, set their own, and understand the result **in under 3 minutes** on first visit.
- Users can articulate *why* their price is what it is.
- Users with several products can spot the weakest margin **without opening each product**.
- Users who add business costs can explain the difference between direct-cost and full-cost margin.
- The full add-and-price flow completes on mobile without zoom, horizontal scroll, or unreachable actions.
- Users don't describe the tool as feeling like a spreadsheet.

---

## 18. Known post-MVP extensions

Recorded so they don't get lost — and so the code leaves room for them.

### Wholesale pricing (second channel)
The same product has two profitability realities. Industry standard: wholesale ≈ cost + ~20% profit; retail ≈ wholesale × 2 (keystone markup).

**Design intent when built:** retail (`final_price`) keeps driving status, overview and dashboard. Wholesale becomes an **optional display-only layer on Product Detail** with its own margin, profit and a warning when it falls below full cost.

**The expensive version to avoid:** letting wholesale drive status too. That gives a product two statuses at once and breaks the one-chip-per-row model across overview, dashboard, sorting and filtering.

**Seam to preserve now (costs nothing):** write all margin and profit functions to **take price as a parameter** — `computeMargin(price, cost, vat)` — never reading `final_price` internally. A second channel then reuses the same functions with no rewrite.

### Percentage-based fees
Etsy / PayPal / card fees are a **percentage of the selling price**. The current "other direct costs" model handles flat amounts only. Percentages behave differently — they scale with price and create a circular relationship with the suggested price. Needs its own treatment.

### Wholesale VAT is quoted net
Retail is gross-first (§6). B2B wholesale is conventionally quoted **net**. If wholesale is built, it should not inherit the gross-first model.

### Others
Named per-person labour rates (validate need first — borders the multi-user non-goal). Basing the calculated price on full cost via a Settings toggle. Historical tracking. Batch production scaling.

---

## 19. How to work in this repo

- Explain files and decisions in plain language; pause at natural gates.
- Flag which side of the line each rule sits on: **memory** (`CLAUDE.md`, prose) vs **enforcement** (types, schema constraints, tests).
- Pricing logic belongs in **pure functions with tests** — the rules should be executable, not prose.
- When a decision here changes, update this file **in the same breath**. A stale spec that quietly lies is worse than no spec.
