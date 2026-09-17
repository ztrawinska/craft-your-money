# Foundations plan — spacing, type, radius, naming

**Status:** draft, 2026-09-16. Decided the same day: **D1** keep 20 (B) · **D2** 2/6px off the scale, named per component (B) · **D5** the type pass is done *whole*, not in two steps (see D5) · **D6** category × size naming (B) · **D7** name radii as they are now (A), consolidation decided the next day (#26, 2026-09-17: 2 · 4 · 8 · 12 · 16 · chip, `frame` folded into `band`) · **D4** the ownership rule becomes doctrine, applied in P4. All six decided; nothing is implemented yet. Once made, each phase below becomes one PR and one GitHub issue (milestone *DS inspection 2026-09-15* or a new one).

**Why now.** The 8pt/4pt grid landed in #5 as "option 1". Living with it for a day surfaced two things: the rule in spec §1.5 says *4pt inside components*, but the code is on a 2pt grid in practice (61 half-step uses the checker can't see); and the standard the designer works to — a **semantic spacing scale on the 8-point grid, with 2 and 4 as the small steps** — is a *closed, tiered* scale, which is a stronger thing than "use the 4pt utilities". The same question then falls on type and radius, where nothing is named in code yet (#8). This document decides the shape of all three together, because they share one mechanism (closed scales in `@theme`), one naming scheme and one enforcement story.

**The reference.** Brad Frost's Eddie design system, read live on 2026-09-16 — the [spacing & rhythm doctrine](https://ds.bradfrost.com/storybook/?path=/story/documentation-guidelines--spacing-and-rhythm), the [tokens guideline](https://ds.bradfrost.com/storybook/?path=/story/documentation-guidelines--tokens) and the compiled token values from its Storybook (`--ed-spacing-*`, `--ed-theme-spacing-*`, `--ed-theme-typography-*`, `--ed-theme-border-radius-*`). This revamp follows his workshop; where this plan departs from Eddie it says so and why.

---

## 1. The reference model, in one page

Eddie's foundations are **three tiers**, and only one is for everyday use:

| Tier | What | Spacing example | Who uses it |
|---|---|---|---|
| 1 · Definitions | raw values, named by value | `--ed-spacing-0 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128` | token source and component internals only |
| 2 · Sizes | t-shirt aliases onto tier 1 | `none 0 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · xxl 64` | "only when no role names your relationship" |
| 2 · Roles | the *relationship* between two things | `region xl · section xxl · block lg · flow md · field lg · inline sm` | **consumers, agents, the system's own containers** |

Rules that come with it:

- **Roles name the relationship, not the amount.** Six of them, deliberately; "a role vocabulary only works while it's small enough to memorize". A theme retunes the whole system by remapping six values.
- **Components never margin their own root.** A component doesn't know its context. The space between siblings belongs to the container that arranged them — `flex-column + gap` driven by role tokens. Prose is the one place margins are right (`margin-block-end`, trailing one trimmed).
- **A painted surface owns its padding.** A card, band or footer ships the internal padding that makes bare content presentable.
- **Micro-spacing (2 / 4 / 6px) is not rhythm.** It lives *inside* a lockup — a field's label→control gap, an icon beside its own label — as component-scoped custom properties (`--ed-field-label-gap: 2px | 4px | 6px` by field size). It is not on the scale and there is deliberately no 4px utility.
- **Typography presets** are `{category}-{size}`: display / headline / title / label / body / button / meta / nav × `lg / default / sm`. Font sizes are **even** (12 · 14 · 16 · 20 · 24 · 28 · 32 · 40 · 48 · 64) and every line-height ratio is chosen so the **line box lands on 4pt**: 12→16, 14→20, 16→24, 20→28, 24→32, 28→36, 32→40, 40→48, 48→56, 64→72. Letter-spacing is a tier-1 scale in half-pixel steps (−2, −1.5, −1, −0.5, 0, +0.5, +2 px).
- **Radius**: tier 1 `0 / 2 / 4 / 8 / 16 / 32 / full`; tier 2 `none / sm 2 / md 4 / lg 8 / round`.
- **Enforcement is a validator, not a habit**: hard error on a root margin, warning on a size token where a role exists, an adjacency check at the ship gate.

---

## 2. Where Craft Your Money is today `[verified 2026-09-16, main @ 2f659b7 + branch tokens-s2]`

### Spacing

Steps actually used in app code (pages + components, excluding `/design-docs/` and the shadcn `ui/` primitives), from the Tailwind classes in use:

| px | 0 | **2** | 4 | **6** | 8 | **10** | 12 | **14** | 16 | 20 | 24 | 32 | 36 | 40 | 48 | 64 | 96 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| uses | 2 | 15 | 50 | 22 | 48 | 12 | 68 | 8 | 43 | 25 | 54 | 6 | 1 | 1 | 1 | 1 | 2 |

Bold = **off the 4pt grid: 57 uses** (`gap-1.5` ×9, `py-2.5` ×6, `mb-1.5` ×5, `pb-3.5` ×4 …) plus 4 in the shadcn primitives (`drawer.tsx`, `input.tsx`). The spec's "4pt inside components" is a convention the code doesn't keep, and `check-tells.sh` only sees `[Npx]` arbitraries (those are at 0 since #5).

What already matches the reference: seven named layout steps (`gutter 24 · tight 8 · row 16 · section 24 · zone 32 · row-height 64 · tap 44`) in `@theme`, mirrored in `tokens.json` (parity test) and Figma — a role layer, in effect. What's missing: a *closed* tier 1 (Tailwind's dynamic scale accepts any `p-2.5`), a t-shirt tier (arguably optional), and an ownership rule (2 of 33 components carry a margin on their root: `SectionLabel`, `inline-form`; pages space sections with `mt-section` on children rather than a gap on the container).

### Type

- 174 `text-[…px]` and 60 `leading-/tracking-[…]` uses; **28 distinct font sizes** in use: 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 17, 20, 22, 24, 25, 26, 27, 28, 29, 34, 44, 46, 56.
- `tokens.json` names **26 styles** (23 + the three reconciled in #9), by *role*: `hero-figure, final-price, profit, title, figure, metric, calc, row-name, row-value, section-total, briefing, row-label, button, button-ghost, verb-link, assistant, body, dropdown, chip, chip-sm, meta, meta-light, section-label, workflow-stamp, metric-label, nav-label`. Eleven of them sit on a half pixel (9.5, 10.5, 11.5, 12.5, 13.5 ×2, 14.5 ×2, 15.5) and five on an odd integer (9, 13, 15, 17, 27).
- Line-heights are unitless ratios (0.86, 0.96, 1, 1.16, 1.2, 1.3, 1.4, 1.55, 1.7): line boxes land at 19.2px, 31.3px, 44.2px — off both grids.
- Nothing is a utility in code: a meta line is `font-sans text-[12px] leading-[1.4] text-ink/62`, typed by hand each time.

### Radius

Eight named values in `tokens.json`/Figma — `stamp 2 · input 5 · frame 6 · button 7 · band 8 · nav-plus 11 · sheet 14 · chip 100` — none named in code: 24 `rounded-[…]` uses, plus `rounded-md` (6px, Tailwind's) and `rounded-[50%]` spelling the same things a second way.

### Enforcement

`check-tells.sh` (Stop hook + CI, advisory): flags hex, off-list radius, `[Npx]` spacing; meters `text-[`/`rounded-[`. Nothing is enforced by the build.

---

## 3. The gaps, named

1. **The scale is open.** Any multiple of 2px compiles. The 4pt rule exists only in prose.
2. **No tier separation.** Roles exist (7 layout names) but sit directly on raw values; there is no primitive tier to alias onto, so Figma's `Space` collection and the CSS can't share a shape.
3. **Type has no presets in code**, sizes aren't on any grid, line-heights don't land on 4pt, and 26 role names are too many to hold in one's head (Eddie: ~8 categories × 3 sizes).
4. **Radius has 8 values where systems have 4–5**, three of them (5, 7, 11) unusual.
5. **No ownership rule** for who spaces what; two components margin their root.
6. **Enforcement is a grep.** A closed `@theme` would make the wrong value impossible rather than reported.

---

## 4. Decisions

Each with the options, the evidence and a recommendation. **The call is the designer's.** "Designs in 2 / 4 / 8" is taken as the brief.

### D1 · The spacing primitives (tier 1)

Eddie: `4 8 12 16 24 32 40 48 64 80 96 128` — 4pt to 16, 8pt to 48, 16pt above; **no 20**. Atlassian and Polaris include 20. We use 20px in 25 places (`px-5`, `pt-5`, `gap-5` — sheet and row insets).

- **Option A — Eddie's list exactly.** 25 migrations (20 → 16 or 24), visible in sheet/row insets.
- **Option B — 4pt to 24, 8pt to 64: `4 8 12 16 20 24 32 40 48 64`** (+ `96` for the two page-bottom clearances, or express those as `zone×3`). Keeps 20.

**Recommend B.** It is the same doctrine (4 then 8) with one more small step; 20 is doing real work in the product and Eddie's omission is a taste choice, not a grid argument. Tailwind's index names stay as the tier-1 spelling — `p-1` = 4 … `p-6` = 24, `p-8` = 32, `p-10` = 40, `p-12` = 48, `p-16` = 64 — because every existing class already reads that way; the scale is *closed* with `--spacing: initial` and an explicit list, so `p-2.5` and `p-7` stop existing.

### D2 · 2px and 6px (the "2" in 2/4/8)

Eddie keeps them **off the scale**: they are component-internal, named per component (`--ed-field-label-gap`), never a utility. Today: 15 uses of 2px, 22 of 6px, 12 of 10px, 8 of 14px.

- **Option A — 2px is a tier-1 step** (`--spacing-0.5`). Honest to "2/4/8", but Eddie's warning applies: a 2px utility only ever gets used to fight a component's own spacing.
- **Option B — no 2 or 6 on the scale; each surviving use becomes a named, component-scoped token** with a reason: `--nudge-currency: 2px` (the £ sits off its figure), `--chip-sm-inset-y: 2px`, and so on. 6px goes to 4 or 8 case by case (mostly icon+label gaps → 8, or 4 where the icon is tiny). 10 → 8 or 12; 14 → 12 or 16.

**Recommend B.** "2" stays legal *inside* a component, as a decision with a name, and can never leak into layout. Migration is 57 + 4 places, each reviewed against a screenshot at 430px.

### D3 · Tiers and naming for spacing

- **Tier 1 (definitions):** Tailwind's indices, closed — see D1.
- **Tier 2 (sizes):** `xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 64` as `--spacing-xs …` so `p-sm`, `gap-lg` exist. Optional; Eddie has it as the fallback layer. **Recommend adding it** — cheap, and it is the vocabulary Figma and the spec will speak.
- **Tier 2 (roles):** keep ours, they are product-true and there are seven: `gutter 24` (page edge), `tight 8` (inside a lockup), `row 16` (between rows), `section 24` (between blocks in a section), `zone 32` (between page zones), `row-height 64`, `tap 44`. Map each to a size alias in `tokens.json` (`section = lg`), which is what lets Figma variables alias the same way. Rename nothing now; revisit `zone` vs Eddie's `region` when the ownership rule (D4) lands and page containers are real.

### D4 · Ownership: who spaces what

Adopt Eddie's four rules as spec §1.5 doctrine: components never margin their root; containers own rhythm via `gap` on a column-flex; prose owns flow via `margin-block-end`; a painted surface owns its padding. Consequence in code: pages become `flex flex-col gap-section` stacks instead of `mt-section` on each child; `SectionLabel` and `inline-form` lose their root margins; the checker gets a "root margin in `src/components`" rule.

**Recommend adopting the rule now and applying it in its own phase (P4)** rather than folding it into the spacing migration — it is architectural, touches every page, and the visible result should be identical.

### D5 · Font sizes on the grid

The hard one. Eddie's sizes are even and its line boxes are 4pt. Ours: 26 styles, 16 of them on a half-pixel or an odd integer.

| Style | now | **A** keep | **B** snap to 2pt | **C** snap half-pixels only |
|---|---|---|---|---|
| final-price | 56 | 56 | 56 | 56 |
| hero-figure | 46 | 46 | 46 (or 48) | 46 |
| profit | 34 | 34 | 34 | 34 |
| title | 27 | 27 | 28 | 27 |
| figure | 24 | 24 | 24 | 24 |
| metric | 20 | 20 | 20 | 20 |
| calc | 17 | 17 | 16 or 18 | 17 |
| row-name | 16 | 16 | 16 | 16 |
| row-value | 15.5 | 15.5 | 16 | 16 |
| briefing / row-label | 15 | 15 | 14 or 16 | 15 |
| button / button-ghost | 14.5 | 14.5 | 14 | 14 |
| verb-link / assistant | 13.5 | 13.5 | 14 | 14 |
| body / section-total | 13 | 13 | 12 or 14 | 13 |
| dropdown | 12.5 | 12.5 | 12 | 12 |
| chip / meta | 12 | 12 | 12 | 12 |
| meta-light | 11.5 | 11.5 | 12 | 12 |
| chip-sm | 10.5 | 10.5 | 10 | 10 |
| section-label | 10 | 10 | 10 | 10 |
| workflow-stamp | 9.5 | 9.5 | 10 | 10 |
| metric-label / nav-label | 9 | 9 | 8 or 10 | 9 |

- **A** — name what exists. Zero visual change; 22 distinct sizes stay. Consistent with "sizes are off-grid in every system" (Apple 13/15/17), *not* with "I design in 2/4/8".
- **B** — even sizes only, Eddie-style. The type scale shrinks to ~12 sizes and several authored distinctions collapse (body 13 vs verb-link 13.5 vs button 14.5 become 14/14/14 — then hierarchy must come from weight and colour, which it mostly already does). Visible everywhere; a real redesign pass, done style by style with screenshots.
- **C** — round only the half-pixels to the nearest even. Nine styles move ≤0.5px (imperceptible); odd integers stay. Gets the scale onto whole pixels and halves the size count without touching the authored hierarchy.

**Decided 2026-09-16: the type work is done whole.** Not C-then-B: one pass that designs the target scale first (sizes on 2pt, line-heights on 4pt, weights, tracking — a working session with the app at 430px in front of the designer, style by style, starting from the B column), then names it (D6) and implements it (P3). Splitting it would mean migrating 174 uses twice. Consequence: P3 begins with a design step, not a code step, and its first artefact is the preset table in spec §1.4 — approved before any component moves.

### D6 · Type naming and mechanism

- **Naming — Option A: keep the 26 role names** (`text-verb-link`). Self-documenting, but 26 is past memorable and the names leak product nouns into a scale.
- **Naming — Option B: category × size, Eddie-style, with product-true categories:** `figure-xl 56 · figure-lg 46 · figure-md 34 · figure-sm 24 · figure-xs 20` (Lora numbers), `title 27`, `name 16` (row name), `body-lg 15 · body 13 · body-sm 12`, `label 15`, `button · button-sm`, `link 13.5`, `meta · meta-sm`, `caps-lg 10 · caps 9.5 · caps-sm 9` (the tracked uppercase family), `nav 9`. Roughly 8 categories, ~20 presets; the old role names survive as the *description* of each preset in `tokens.json` and Figma ("hero figure = figure-lg").

**Recommend B.** It is the one place this plan asks for a rename, and it pays for itself every time someone (or an agent) has to pick a style.

- **Mechanism:** Tailwind v4 `--text-<name>` with sub-keys — `--text-meta: 12px; --text-meta--line-height: 16px; --text-meta--font-weight: 400; --text-meta--letter-spacing: 0` — gives one utility `text-meta` that sets size, line-height, weight and tracking together. Family stays a separate class (`font-serif` / `font-sans`) because Tailwind's `--text-*` doesn't carry it; the spec's rule (numbers and names are Lora, chrome is Plex) is already one line. Tailwind's default text sizes are removed (`--text-*: initial`) so `text-sm` can't be reached for. `tokens.json` `type` becomes the source the CSS is generated from — or, simpler for now, stays the mirror with the parity test extended to `--text-*`.

### D7 · Radius

Eddie: `0 2 4 8 16 32 full` → `none sm md lg round`. Ours: `2 5 6 7 8 11 14 100`.

- **Option A — name as-is.** `rounded-button` = 7px. Zero visual change.
- **Option B — snap to `2 4 8 12 16 full`, keep role aliases:** `stamp 2 · input 4 · frame 8 (or 4) · button 8 · band 8 · nav-plus 12 · sheet 16 · chip full`. Buttons go 7 → 8, inputs 5 → 4, the sheet 14 → 16; five values instead of eight. Visible, but small.

**Recommend B**, as its own decision (a new decision issue, like #19), with A as the first step in code so that the *names* land now and the *values* can be tuned in one line each later.

### D8 · Enforcement

Order of strength: the build (closed scales — the wrong value doesn't compile) → the checker in CI (arbitraries, root margins; **exit 1** once each family is migrated, not advisory) → the spec (why). Today everything sits at the third level. Each phase below moves one family up.

---

## 5. The phases

Each is one PR, one issue, CI green, before/after screenshots at 430px for the three key screens (dashboard, products, product detail), `tokens.json` + Figma + spec updated in the same PR. Order matters: type depends on nothing, radius on nothing, but P4 wants P1 first.

| Phase | Scope | Decisions | Size | Issue |
|---|---|---|---|---|
| **P1 · Close the spacing scale** — *done 2026-09-16, #23* | `--spacing: initial` + tier 1 list; tier-2 sizes; roles aliased; migrate 57+4 off-grid uses; named nudges; spec §1.5 rewritten around tiers and the ownership rules (text only); `tokens.json` `space` restructured (primitives / sizes / roles) + parity test; Figma `Space` collection rebuilt as tier 1 + aliases; checker: spacing section hard-fails in CI | D1 D2 D3 | ≈ #5 | resolves #19 |
| **P2 · Name the radii** — *done 2026-09-16, #24* | tier 1 `--radius-*` closed, role aliases; 24 migrations + unify `rounded-md`/`[50%]`; spec §1.6; Figma `Radius` re-checked; checker: radius arbitraries hard-fail | D7 (A now, B later) | small | part of #8 |
| **P3 · Type presets** — *done 2026-09-17, part of #8* | *Step 0: design the target scale with the designer (sizes, line-heights, weights) and approve the §1.4 preset table.* Then `--text-*` presets with sub-keys per D5/D6; Tailwind defaults removed; migrate 174 + 60 uses component by component (Chip first as the pattern, then the 3 key screens, then the rest); line-heights on 4pt; spec §1.4 rewritten as the preset table; `tokens.json` `type` renamed and mirrored (parity test); Figma text styles renamed to presets; checker: type meter becomes a hard flag | D5 D6 | largest — split in two PRs if needed (presets + Chip/ListRow, then the rest) | part of #8 |
| **P4 · Rhythm owners** | root-margin audit (2 components), pages as `gap` stacks, `SectionLabel`/`inline-form` fixed, checker rule for root margins, spec §1.5 doctrine paragraph made enforceable | D4 | medium | new |
| **P5 · Figma binding** | S4: bind autolayout spacing, padding, radius and text to the (now final) variables and styles | — | medium | #11 |

Radius consolidation (D7-B) was decided on screenshots the day after P2 (#26 — yes). Full even-size type (D5-B) is folded into P3's design step.

---

## 6. Risks and what limits them

- **Visible change.** P1 (57 places) and P3 (if D5-B) change how things look. Every phase ships with screenshots; nothing merges on numbers alone.
- **shadcn primitives.** `drawer.tsx`, `input.tsx` use half-steps and `text-sm`; closing the scales breaks them at build time — which is the point. They get re-skinned in P1/P3 (three files).
- **Figma drift.** Every phase re-runs the Figma ↔ `tokens.json` parity check before merge (S5/#12 turns that into a script; until then, by hand via the bridge, as in F1).
- **Scope creep into product design.** D5-B and D7-B are explicitly *not* in these phases; they are decision issues so the migration can't quietly become a redesign.
- **Two sessions, one tree.** Each phase is a branch; `ds-inspection/` notes go straight to `main`.

---

## 7. What the designer decides before P1 starts

1. ~~**D1**~~ — decided: keep 20 (B).
2. ~~**D2**~~ — decided: off the scale, named per component (B).
3. ~~**D5**~~ — decided: whole type pass, design step first.
4. ~~**D6**~~ — decided: category × size (B).
5. ~~**D7**~~ — decided: A now, B as a decision issue after.
6. ~~**D4**~~ — decided: doctrine now, applied in P4.

All six decided 2026-09-16. P1 and P2 done the same day (#23, #24); #26 the day after. P3 step 0 — the type design session — done 2026-09-17 (see `2026-09-17-type-scale-session.md`: 23 presets, 11 sizes, approved as spec §1.4). P3 implemented the same day (24 presets; `body-lg` became the two Lora `prose` sizes after a Mobbin benchmark and three renders — see the session doc). Next: P4 (#25), then P5 (#11).

**Correction learned in P1:** Tailwind v4 does not error on an unknown class — an off-scale `p-2.5` compiles to *nothing*, silently. So "the build enforces it" means "the wrong value has no effect", which is visible but not loud; the checker's spacing section (exit 1 in CI, variants included) is the loud half. Both are in place.
