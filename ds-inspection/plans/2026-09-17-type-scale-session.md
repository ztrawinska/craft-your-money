# Type scale session — P3, step 0

**Status:** decided 2026-09-17 — see *Outcome* at the end. The session page: **[Craft Your Money Type Scale](https://claude.ai/artifact/9EJdKW3tGMk9rGuPkFDhgp)** — every style rendered in the real faces, current beside proposed, a pick per row saved as she goes. Once all 26 are decided, this file gets the outcome table and spec §1.4 is rewritten from it; only then does code move (P3 proper, #8).

**Brief (foundations plan D5, D6).** One pass, done whole: sizes on the 2pt grid, line boxes on 4pt, names by *category × size*, the 26 role names kept as descriptions.

## What the code does today `[verified 2026-09-17, main @ ebf2243]`

- 174 `text-[…px]` uses across the app, **28 distinct sizes**; `tokens.json` names 26 styles at 22 sizes, so **8 sizes in use have no style at all**: 11 (×9, quiet captions), 14 (×5, mixed regulars and mediums), 22 and 29 (currency glyphs beside the 56 and 46 figures), 25 (decimals), 26 (×3, list-screen titles — a second "title"), 28 (the business-costs total), 44 (the editable price field).
- 16 of the 26 styles sit on a half pixel or an odd integer; all line-heights are unitless ratios, so line boxes land at 19.2, 31.3, 44.2px.
- Nothing is a utility: a meta line is `font-sans text-[12px] leading-[1.4] text-ink/62`, typed 25 times.

## The proposal — 26 presets, 11 sizes

Line box = the line-height in px. Every box is a multiple of 4. Family: L = Lora, P = IBM Plex Sans.

| Preset | ← today | Size / box | Weight | Tracking | Where |
|---|---|---|---|---|---|
| `figure-xl` | final-price 56/0.86 | 56 / 48 | 500 L | −0.025em | Your price |
| `figure-lg` | hero-figure 46/0.96 · *the 44px price field* | **44** / 44 | 500 L | −0.02em | Dashboard hero; the editable price ⚑ |
| `figure-md` | profit 34/1 | 34 / 36 | 500 L | | Your profit |
| `figure-sm` | figure 24/1 · *the 28px costs total* | 24 / 24 | 500 L | | Totals ⚑ |
| `figure-xs` | metric 20/1 | 20 / 20 | 500 L | | Metric band |
| `figure-2xs` | calc 17/1.2 | **18** / 24 | 400 L | | Calculated price ⚑ |
| `title` | title 27/1.16 · *the 26px list titles* | **28** / 32 | 500 L | | Greeting, product name, screen titles ⚑ |
| `name` | row-name 16/1.2 | 16 / 20 | 500 L | | Row and line names |
| `value` | row-value 15.5/1.2 | **16** / 20 | 400 L | | Row money values |
| `value-sm` | section-total 13/1.2 | **14** / 16 | 400 L | | Section totals ⚑ |
| `body-lg` | briefing 15/1.7 | **16** / 28 | 300 P | | Dashboard briefing ⚑ |
| `label` | row-label 15/1.3 · *the 14px regulars* | **14** / 20 | 400 P | | Cost-line labels, settings rows, list options ⚑ |
| `body` | body 13/1.55 | **14** / 20 | 300 P | | Helper copy ⚑ |
| `label-strong` | assistant 13.5/1.2 · *the 14px mediums* | **14** / 20 | 500 P | | Assistant label, radio titles, sheet cancel ⚑ |
| `link` | verb-link 13.5/1.2 | **14** / 20 | 600 P | | Reprice ›, + Add material |
| `button` | button 14.5/1.2 | **14** / 20 | 600 P | | Primary button |
| `button-ghost` | button-ghost 14.5/1.2 | **14** / 20 | 500 P | | Ghost button |
| `label-sm` | dropdown 12.5/1.2 | **12** / 16 | 500 P | | Dropdown and filter triggers |
| `meta` | meta 12/1.4 | 12 / 16 | 400 P | | Row meta lines |
| `body-sm` | meta-light 11.5/1.4 · *the 11px lights* | **12** / 16 | 300 P | | Captions, sublabels ⚑ |
| `chip` | chip 12/1.2 | 12 / 16 | 600 P | | Status chip |
| `chip-sm` | chip-sm 10.5/1.2 | **10** / 12 | 600 P | | Inline chip |
| `caps` | section-label 10/1.2 | 10 / 12 | 600 P | 0.2em | Section labels |
| `caps` *(merged)* | workflow-stamp 9.5/1.2 | **10** / 12 | 600 P | 0.2em | Draft / Archived stamp ⚑ |
| `caps-tight` | metric-label 9/1.2 | **10** / 12 | 600 P | 0.13em | Metric and field labels ⚑ |
| `nav` | nav-label 9/1.2 | **10** / 12 | 500 P | | Bottom nav |

Bold = a size change. ⚑ = a judgement call, flagged in the session page with its alternatives.

**Not presets:** the currency glyph (22 beside 56, 29 beside 46) and the decimals (25) are proportions of their figure inside `Price.tsx` — component-scoped values, like the 2px nudge. They follow whatever the figure decides.

## The judgement calls, in one place

1. **figure-lg 44** merges the dashboard hero (46) with the editable price field (44). Alternative: 46 for both.
2. **The 28px costs total** has no style: figure-sm (24) or figure-md (34)?
3. **calc 17 → 18** keeps a step between value (16) and metric (20); or merge into value.
4. **title 27 and the 26px list titles both become 28** — one title.
5. **value-sm 13 → 14** stays a figure; 12 would make it read as meta.
6. **body-lg 15 → 16** makes the briefing a touch larger; 14/24 is the other way.
7. **label 15 → 14**, down not up, so labels sit under names (16).
8. **body 13 → 14** is the most-used change (33 places); 12/16 goes the other way.
9. **label-strong** gathers three 14/500 uses that were never one style; the assistant label could keep its own name if the glint deserves one.
10. **body-sm** collapses 11, 11.5 and 12-light into one; captions grow by up to a pixel.
11. **The stamp merges into caps** (9.5/.22em → 10/.2em) or stays its own preset.
12. **caps-tight 9 → 10**: at 10 it differs from caps only by tracking. One style or two?

## After the session

1. Read the picks back from the page's store (`decisions/<preset>`), write the outcome table here, rewrite spec §1.4 as the preset table with line boxes and names.
2. Mechanism (D6): Tailwind v4 `--text-<preset>` with `--line-height`, `--font-weight`, `--letter-spacing` sub-keys → one utility per preset (`text-meta`); Tailwind's own `text-xs…9xl` removed (`--text-*: initial`); family stays `font-serif` / `font-sans`. `tokens.json` `type` renamed and mirrored; parity test extended; Figma text styles renamed.
3. Migrate component by component — Chip first as the pattern, then the three key screens, then the rest — with before/after screenshots at 430px. The checker's type meter becomes a hard flag at the end.

## Outcome (2026-09-17)

All 26 rows decided in the session page: 23 as proposed, 3 amended after discussion —

- **`body-lg` is gone; two Lora prose presets instead.** Implementing the picks surfaced that the briefing, the Price Check verdict and the coach teaser are Lora in code (r3 tokens misdocumented the briefing as Plex 15/300), so a Plex `body-lg` had no consumer. A Mobbin benchmark (24 finance and reading apps) showed finance apps set such sentences in the UI face while reading apps use serif; the designer kept Lora by brand principle ("opens like a message") and, after seeing three renders of the dashboard and two of the Price Check, chose **two sizes by role**: `prose` 16/24 for the surfaces made for reading (verdict, teaser) and `prose-sm` 14/20 at ink-62 for the briefing, which should recede on a dashboard that already bombards. The briefing concept itself is to be tested later.
- **chip-sm has no type of its own.** Benchmarks put the floor for chip/badge text at 12px (Polaris, Carbon, Primer, Ant, Chakra; Material 14); 10 would sit under all of them. Both chip sizes use the `chip` preset (12 / 16 / 600); `sm` is only the tighter inset.
- **The dropdown trigger is `button-ghost`** (14 / 20 / 500), because *Dropdown = ghost + chevron* (CLAUDE.md). `label-sm` is dropped.

So: **24 presets, 11 sizes** — `10 · 12 · 14 · 16 · 18 · 20 · 24 · 28 · 34 · 44 · 56`, every line box on 4pt. The approved table is spec §1.4; the migration is P3 proper (#8).
