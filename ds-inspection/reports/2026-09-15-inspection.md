# Craft Your Money — design system inspection

**Date:** 2026-09-15 · **Inspected at:** `main` @ `17a7aa9` · **Figma:** Craft Your Money · Design System (`4SU2FWCR13o15AspvjXI6F`) · **Profile:** solo, one app, code is the source of truth (see [GARAGE.md](../GARAGE.md))
**Work order:** [2026-09-15-work-order.md](../work-orders/2026-09-15-work-order.md)

## Score: 54 / 100

A conversation starter, not a grade. Two lights are on (accessibility, testing); the other eight stations are yellow — the system is coherent and well-documented but half of it is held by prose, not by code. Fix the reds, schedule the yellows, re-run next quarter.

## The three findings that carry the most weight

1. **The ink ladder and the status chips don't meet AA contrast on the sizes they're used at.** `ink/55` is 3.8:1 and carries 12–13px text in 24 places; `ink/42` is 2.6:1 and carries 9–11px text in 19 places; the three coloured chips sit at 3.1–4.0:1. This is the app's main hierarchy device and its only status carrier — and it's the same in Figma, because the values are shared. Turning this light off means re-tuning three or four token values, not touching components. *(Station 3)*
2. **Half the token families exist only as documentation.** Colour is fully tokenised in code and 100 % bound in Figma (146 fills, 64 strokes, zero hardcoded). But the type scale (23 styles), radii (8) and spacing (7) live in `tokens.json` and Figma and nowhere in `globals.css` — so components carry 181 arbitrary `text-[…px]`, 24 `rounded-[…]` and 50 arbitrary paddings, and Figma never binds a gap to the `Space` collection. The names are agreed; the plumbing is missing. *(Stations 2, 4, 9)*
3. **The test suite is red and nothing notices.** 2 of 45 tests fail on `main` (`products.test.ts`, a fixture lookup returns undefined) and there is no CI. Figma ↔ code parity has no check at all, and it drifted within a day of generation (3 Figma-only text styles, `on-clay` missing in code). *(Stations 5, 6)*

## Inspection sheet

| # | Station | Score | Light | One line |
|---|---|---|---|---|
| 1 | Coverage | 6 | 🟡 | `/design` covers 17 components; Figma mirrors 9 of them; spec lacks RadioCards/Switch; Combobox and inline-form have no library page |
| 2 | Best practices | 5 | 🟡 | Colour tier exemplary in both worlds; type/radius/space not tokenised in code; Figma gaps unbound; `on-clay` missing; 3 unsanctioned shadows |
| 3 | Accessibility | 3 | 🔴 | `ink/55`, `ink/42` and all three status chips fail AA at their sizes; semantics and ARIA are sound |
| 4 | Shared language | 7 | 🟡 | Variant vocabularies identical across code and Figma; status↔tone mapping executable; small drift in Price variants, text styles, `ink/10`, `on-clay` |
| 5 | Testing | 3 | 🔴 | 2/45 tests failing on main, no CI, no component/a11y/parity tests; tell-checker is advisory with a standing false positive |
| 6 | Orchestration | 5 | 🟡 | css→json enforced, code→/design live; code→Figma one-shot with no re-run path; no CI |
| 7 | Governance | 6 | 🟡 | Dated decision log and enforcement table are strong for solo; no versions, tags or changelog |
| 8 | Feedback | 5 | 🟡 | Agent loop via Stop hook is real; human loop implicit; nowhere to log "the rule didn't hold" |
| 9 | Machine-readable docs | 7 | 🟡 | DTCG tokens with descriptions/aliases; PropsTable 17/17; docblocks 33/33; Figma descriptions 20/20; type scale not consumable; no component API format |
| 10 | Agent access | 7 | 🟡 | CLAUDE.md/AGENTS.md/SETUP.md give the what *and* the why; figma-console bridged; no Code Connect; CLAUDE.md doesn't point at Figma |
| | **Total** | **54** | | |

## Evidence basis

- **Repo** — read directly: `src/app/globals.css`, `design/tokens.json`, `src/components/**` (33 files), `src/components/design-docs/**`, `docs/craft-your-money-design-system.md`, `README.md`, `SETUP.md`, `.claude/hooks`, `scripts/check-tells.sh`, `eslint.config.mjs`. Test suite executed (`npx vitest run`). Counts come from `grep` over `src/**/*.tsx` excluding `design-docs/`.
- **Figma** — live via figma-console MCP (Desktop Bridge plugin, Plugin API): full-file sweeps of pages, component sets, variant properties, variable bindings on all 64 component nodes (instances excluded), 52 variables, 26 text styles, node descriptions. WCAG lint run on the Chip page; its contrast results were discarded (it cannot resolve alpha fills) and contrast was recomputed from token values with opacity blended over `page`.
- **Interview** — scale, source of truth, scope (2026-09-15).
- **Benchmarks** — from the inspector's own knowledge; no design-systems knowledge MCP was connected.
- **Not inspected:** screen-reader or keyboard walk-through of the running app; per-control touch-target audit; the `Foundations` Figma page's frames; GitHub issues; any research kept outside the repo; per-variant visual parity (does Figma's `Chip/Tone=caution` look like the rendered one) — only names were compared.

Every finding below is `[verified]` unless marked otherwise.

---

# Station records

## Station 1 — Coverage — 6/10 (yellow)

Inventories `[verified]`:
- Code system components (in `/design` nav): 17 — Glint, Chip, Button, Price, SectionLabel, Input, Switch, Dropdown, RadioCards, TintedBand, FramedSurface, ListRow, Collapse, AssistantSlot, ActionSheet, IrisSheet, BottomNav. Plus 7 foundations pages and 3 patterns.
- Figma library: 7 component sets (Chip, Button, Price, Dropdown, AssistantSlot, ListRow/Product, BottomNav) + Glint, SectionLabel, ListRow/Line, 10 icons. 52 variables (Colour 32, Radius 8, Space 12), 26 text styles, 0 paint/effect styles.
- Spec (`docs/craft-your-money-design-system.md` §2): 14 sections, all marked built.

Findings:
- Figma mirrors **9 of 17** library components. Missing: Input, Switch, RadioCards, TintedBand, FramedSurface, Collapse, ActionSheet, IrisSheet. FramedSurface ("the one framed surface") and TintedBand are identity pieces — their absence is the biggest gap.
- Figma has no Lines (hairline/dashed) or Ink-opacity foundation as such — opacity lives inside Colour as `ink/70…ink/07`, which is fine; `Foundations` page has 3 frames.
- Spec §2 has no section for RadioCards, Switch, AssistantSlot (folded into §2.9?), Combobox. `/design` has RadioCards, Switch, AssistantSlot but not Combobox or inline-form (spec §2.12 exists, library page doesn't).
- Duplicate `Icon/plus` component on Button page and BottomNav page in Figma.
- Feature compositions (ProductEditor, CostsEditor, PriceCheck, StatusFilter…) correctly *not* in the library; their docblocks cite spec sections.

Not inspected: per-variant parity (does Figma Chip have the same 5 tones × 2 sizes as code? — checked at station 4).

## Station 2 — Best practices — 5/10 (yellow)

Figma (sweep of all 64 component nodes, own layers only, instances excluded) `[verified]`:
- Fills 146/146 bound to variables, strokes 64/64 bound — **zero hardcoded colours**. Auto-layout on 100/100 frames.
- Text styles: 82 styled / 20 unstyled (ListRow/Product 13, BottomNav 4, Price 3).
- Radius: 28 bound / 10 hard (all 10 in ListRow/Product).
- Spacing: `itemSpacing` bound 0 / 71 hard; padding 34 bound / 25 hard (all 25 in BottomNav). The `Space` collection (12 vars) exists but gaps never use it.
- No paint styles, no effect styles — consistent with "flat, colours are variables".
- Duplicate `Icon/plus` (Button page + BottomNav page).

Code `[verified]` (`src/**/*.tsx` minus design-docs):
- Colour tier is real and used: `ink/55` ×52, `ink/42` ×41, `clay-deep` ×39, `ink/14` ×26… Only 1 `bg-[…]` arbitrary. Naming by meaning holds (Chip tone positive/caution/critical, Button primary/ghost/link) and matches the Figma variant names exactly.
- Type scale exists in `tokens.json` (23 styles) and Figma (26 text styles) but **not in `globals.css`** → 181 arbitrary `text-[…px]` (13px ×33, 12px ×25, 15px ×16, 13.5px ×11, 12.5px ×8, 10px ×10, 9px ×7…), 29 `leading-[…]`, 31 `tracking-[…]`.
- Radii: 8 named radii in `tokens.json`/Figma, none as Tailwind utilities → 24 `rounded-[…]` (`rounded-[7px]` ×12).
- Space: 7 named spaces documented, none as utilities → 50 arbitrary paddings (`pt-[22px]` ×7, `py-[3px]` ×5, `gap-[7px]` ×4…), 51 `w-[…]`.
- `#FDFBF9` literal in 8 files (Button, BottomNav, ActionSheet, CostsEditor, inline-form, switch, dashboard, products/new) = the **`on-clay`** colour that exists as a Figma variable but has no token in `globals.css`/`tokens.json`.
- `#000` in FramedSurface.tsx:39–40 is a CSS mask gradient (alpha only) — false positive of the tell-checker, not a colour.
- Shadows: 2 sanctioned by spec (popover §2.4, sheet §2.11). 3 further: Button primary `shadow-[0_1px_2px_rgba(138,90,82,0.3)]` (Button.tsx:24), sticky footers `shadow-[0_-6px_18px_-12px…]` (ProductEditor.tsx:795, SettingsForm.tsx:170). Spec §2.3 says nothing about a button shadow; §1.1 says "no drop shadows". Candidate deviation — decide.
- Token tiers: one semantic tier, no primitive layer. Appropriate for a solo system; Figma's `Space` collection has both (2/4/8/12/16 + named).

## Station 3 — Accessibility — 3/10 (RED)

Contrast, computed from token values with opacity blended over page `#F7F4F0` `[verified]` (Figma's lint can't resolve alpha fills — it reported 1.0:1 green-on-green, discarded as an artefact):
- `ink/100` 15.9:1, `ink/70` 6.2:1, `clay-deep` 5.2:1 (links, 39 uses), `iris-deep` 5.8:1, primary button `#FDFBF9` on clay-deep 5.6:1 — **pass AA**.
- `ink/55` on page **3.8:1** — 52 uses, of which 24 at 12–13px → fails AA for normal text (4.5 needed).
- `ink/42` on page **2.6:1** — 41 uses, 19 of them at 9–11px → fails AA and AA-large.
- `ink/30` **1.9:1** — decorative/placeholder only? not checked per use.
- Chips: text on 15% fill — green 3.75, amber **3.08**, red 4.0 at 12px / 10.5px → all three fail AA; amber is worst. Neutral chip 13.8:1 fine.
- `status-amber` as raw text on page 3.6:1 — fails (10 uses of status-red text pass at 4.9; amber not counted separately).
- Figma lint also flags Chip `Tone=inactive` as a disabled state with no explanation (warning, 2 nodes).

Keyboard / semantics `[verified]` counts across app components: `focus-visible:` 2, `outline-none` 4 (focus ring relies on Radix/shadcn `--ring` = clay for primitives; custom controls thin), `aria-*` 24, `role=` 2, `sr-only` 3, `<label>` 25 (`htmlFor` 0 — labels wrap inputs, fine), **0** `div/span onClick` (all actions are real buttons/links — good), reduced-motion handled in 6 places, `lang="en"` set.
- Touch targets: spec says 44px min (`space/tap-target`); only 3 explicit 44px hits in code — not verified per control. `[not inspected]` per-control audit.

Not inspected: screen-reader run, real keyboard walk-through, Figma focus-indicator annotations (none exist as annotations).

## Station 4 — Shared language — 7/10 (yellow, high)

Parity `[verified]` code ↔ Figma ↔ tokens.json ↔ spec:
- Chip: code `positive|caution|critical|neutral|inactive` × `default|sm` = Figma `Tone`/`Size` **exactly**. Button: `primary|ghost|link` = Figma. ListRow: `risky|caution|healthy|neutral|null` = Figma `Stripe none|risky|caution|healthy|neutral`; `muted` = `Muted`. `ListRow / Product` + `ListRow / Line` = code `variant "product"|"line"`.
- Status label ↔ chip tone mapping (Healthy→positive, Risky→critical, No price→neutral) is executable in `src/lib/status.ts` (`PROFITABILITY_META`) — the one place, as CLAUDE.md demands.
- Radius names: tokens.json 8 = Figma `Radius` 8, same names and values. Space: tokens.json 7 named ⊂ Figma 12 (adds 2/4/8/12/16 primitives).
- Price: Figma has `primary` and `hero` variants that code's `Price` does not expose (hero lives in `HeroProfit`, primary in the pricing block) — 2 Figma-only names.
- Type: Figma 26 text styles vs tokens.json 23 — Figma-only: `Sans/chip-sm`, `Sans/button-ghost`, `Sans/assistant`. Since Figma is the mirror, these are either undocumented styles in tokens.json or Figma additions.
- Colour: Figma has 32 named colours incl. `on-clay`, `ink/10`, `ink/tint`, `clay/50|12|07`, `clay-deep/45`, `iris/30|15|09|06`, `status/*-fill`, `status/*-stripe`. tokens.json has 10 base + 8 opacities; missing `ink/10` (code uses `bg-ink/10` for neutral chip) and `on-clay`. Spelling: code `ink/7` (Tailwind) vs `ink/07` (Figma, tokens.json).
- Spec uses plain names ("Section header", "Reveal toggle", "Money entry") with code names in parentheses — documented, not drift.
- The 12 icons: Figma `Icon/house|tag|layers|wallet|plus|chevron-*|rotate-ccw` = lucide names used in code.

## Station 5 — Testing — 3/10 (RED)

`[verified]` by running `npx vitest run` on main @ 17a7aa9: **1 file failed, 6 passed; 2 tests failed, 43 passed.** `src/lib/products.test.ts` — "the flagship still reduces to its known figures" and "stacking set is still a real loss" throw `Cannot read properties of undefined (reading 'materials')` (a sample-product fixture no longer resolves). Nothing noticed: no CI.
- Protected by tests: pricing/status/benchmark/fixed-costs logic (5 files), `globals.css` ↔ `tokens.json` parity + alias integrity + shadcn radius (`tokens.test.ts`, 4 tests).
- Checked but advisory: `scripts/check-tells.sh` via Stop hook — hex outside globals, radii outside the set, §4 jargon, AI-copy tells. Report-only by design (§6). Has a standing false positive (`#000` mask in FramedSurface) that will nag every turn.
- Not protected: component rendering (0 component tests), visual regression (none), accessibility (no axe/jest-axe), Figma ↔ code parity (no test; the drift at station 4 is invisible to tooling), the 181 arbitrary text sizes (the tell-checker checks radii and hex, not type/space).
- ESLint: `next/core-web-vitals` + TS only — no design-system rules.

## Station 6 — Orchestration — 5/10 (yellow)

How a change flows `[verified]`:
- `globals.css` → `design/tokens.json`: manual, but the test fails on drift. ✔ Enforced.
- code → `/design`: live by construction (renders the real components); adding a page = `nav.ts` + one doc file, by hand. Convention, documented in `nav.ts` and §6.
- code/tokens → **Figma**: one-shot generation (2026-09-15, via MCP in a session — no script in repo, no `figma.config`, no Code Connect). There is no re-run path; the Figma-only text styles/colours at station 4 show it has already drifted within a day.
- spec markdown → code: manual; "built" markers hand-maintained. `docs/design/*.html` mockups are static r3 references.
- No CI (`.github/workflows` absent) → the red test suite and any tell-check hits only surface if someone runs them locally or through the Stop hook.
- SETUP.md keeps a dated decision log (tokens pipeline "reversed 2026-09-14", Figma "done 2026-09-15") — good trace.

## Station 7 — Governance — 6/10 (yellow) — calibrated for solo

- Decision log exists and is dated: SETUP.md "rejected / reversed / done" entries; spec §6 table says per rule whether it is enforced or convention and what it should become. This is unusually good hygiene for a solo system. `[verified]`
- Change control: GitHub PRs used (PR #2 merged 2026-09-15). No PR template, no CODEOWNERS (fine solo).
- Versioning: spec labelled "r3"; no git tags, no CHANGELOG, Figma library has no version stamp or published-library changelog; tokens.json has no `$version`. 69 commits since 2026-07-23. `[verified]`
- Ownership: single owner. Where PRD and CLAUDE.md disagree, CLAUDE.md says reconcile in the same breath — a rule, not a process.

## Station 8 — Feedback — 5/10 (yellow) — calibrated for solo

- Consumers of the system: Zuzanna and Claude. The agent loop is real: every Stop runs the tell-checker and feeds hits back into the next turn `[verified]`. The human loop is implicit (she is the user).
- No place to record "this rule didn't hold in practice" beyond SETUP.md's rejected-ideas list; the spec's rationale lines (benchmarks: Airwallex, Bevel, Walmart, YNAB) show decisions were informed by comparison, not by observed use.
- No user-research traces in `docs/` (grep for interview/research/feedback: none). `[not inspected]` any research kept outside the repo.
- GitHub issues: not checked.

## Station 9 — Machine-readable docs — 7/10 (yellow, high)

- `design/tokens.json` is W3C DTCG: `$type`, `$value`, `$description` on every token, 29 aliases (`{…}`), 3 `$extensions` (line opacities). Guarded by test. `[verified]`
- `/design` pages: `PropsTable` on **17/17** component pages, `Rules` on 15/17. Props are TSX data, not JSON/MDX — readable by an agent through source, not by a tool.
- Every component file (33/33) opens with a docblock stating the rule it enforces and the spec section. `[verified]`
- Figma: descriptions on 7/7 sets and 13/13 components; variables named by meaning; 26 text styles. No component-level annotations, no Code Connect mapping.
- Gaps: type scale is documented (tokens.json `type`, 23 entries) but not consumable by code; no component API in a machine format; no `$version`/metadata block in tokens.json.

## Station 10 — Agent access — 7/10 (yellow, high)

- `CLAUDE.md` (orientation + reading order + naming principle + status model + pricing logic + working style), `AGENTS.md` (Next.js version warning), `docs/` spec + PRD, `README.md` file map. `[verified]`
- Stop hook hands design-system tells to the agent each turn; `SETUP.md` logs what was tried and rejected — an agent can read *why* as well as *what*.
- MCP: `figma-console` connected today (Desktop Bridge; whole-file sweeps work). Official Figma MCP present but unauthorized. No Code Connect, so an agent must infer Figma-component ↔ code-component mapping from names (which match, station 4).
- `CLAUDE.md` does not mention the Figma library or which MCP to use for it; README does. `.claude/skills`: ask-matt, grill-me, ux-motion.
- Friction: the tell-checker's `#000` false positive and its inability to see type/space arbitraries; no machine-readable "component → Figma node" table.

---

## Cadence

- **Deep inspection:** quarterly, or after any change to `globals.css` token *values* (the contrast light depends on them).
- **Wire into CI now** (a single GitHub Actions workflow on push/PR): `npm test`, `npm run lint`, `scripts/check-tells.sh` (advisory output), and — once written — a Figma↔tokens parity script. This alone turns stations 5 and 6 from red/yellow to green territory.
- **Re-run stations 3 and 5 first** at the next inspection; compare against this sheet.
