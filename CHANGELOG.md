# Changelog — Craft Your Money design system

What changed in the system, and whether it breaks anything that uses it. The product's own features are not in here; this file tracks **tokens and component APIs**, because those are what another file, another person or Figma can depend on.

The current version lives in `design/tokens.json` (`$extensions.cym.version`) and is shown on `/design`. `src/lib/tokens.test.ts` fails if that version and the newest entry below disagree.

## How the number moves

The system is **pre-1.0**, and semver means what it says there: anything may change. So while the major is `0`:

| Change | Bump |
|---|---|
| A token removed or renamed; a scale closed; a component's API changed in a way a caller must follow | **minor** — `0.7.0` → `0.8.0` |
| A token added; a value changed under the same name; anything a caller can ignore | **patch** — `0.7.0` → `0.7.1` |

A **closed scale counts as a break** even when no token of ours is removed: `--spacing: initial` deletes no `--spacing-*` of ours, but it deletes every off-scale Tailwind class, and code that used one silently renders nothing.

`1.0.0` is cut when the 2026-09-15 inspection milestone closes and Figma is bound to these tokens — the point where a break starts costing someone else time. After that the full rule applies: **major** = removed, renamed or closed; **minor** = added; **patch** = a value under the same name.

One release is one pull request. There is one consumer and no external team, so aliases are not kept for a release — a rename lands with its migration in the same PR.

---

## 0.7.0 — 2026-09-25

**Two shadows, and a test that keeps them at two** ([#41](https://github.com/ztrawinska/craft-your-money/pull/41), §1.1, closes S7)

- Added `--shadow-popover` and `--shadow-sheet`; the two arbitrary shadows they replace were never tokens.
- **Closed** the shadow scale (`--shadow-*: initial`): Tailwind's `2xs…2xl` now paint nothing.
- Removed the primary button's lift and the save bars' fold — measured at 7/255 and 36/255, neither on a surface that floats.
- `Popover` carries its own shadow, so `Combobox` and `CurrencySelect` stopped spelling it.

## 0.6.1 — 2026-09-25

**Dropdown becomes the trigger its two filters were copying** ([#39](https://github.com/ztrawinska/craft-your-money/pull/39))

- `Dropdown` forwards its ref and spreads props, so it can be a Radix `asChild` trigger. Additive — existing uses are unchanged.
- `StatusFilter` and `TypeFilter` render it instead of re-spelling its classes.

## 0.6.0 — 2026-09-25

**Rhythm owners: no component decides where it sits** ([#32](https://github.com/ztrawinska/craft-your-money/pull/32), §1.5)

- **Breaking for callers.** A component no longer carries a vertical margin on its root: `PricingPanel`, `SectionLabel`, `EditShell` and the settings sections lost theirs, and the page that places them sets the distance. Enforced by `scripts/check-tells.sh`.
- Rule 5 added to §1.5: micro-spacing inside a lockup is not rhythm and these rules do not reach it.

## 0.5.0 — 2026-09-25

**Name the type presets by content, not by consumer** ([#31](https://github.com/ztrawinska/craft-your-money/pull/31), §1.8)

- **Five names removed, three added.** 24 presets became 22 on 11 sizes.

  | Gone | Use instead | |
  |---|---|---|
  | `text-button` | `text-label-bold` | rename |
  | `text-link` | `text-label-bold` | folded — it was identical to `text-button` |
  | `text-button-ghost` | `text-label-strong` | folded — that preset already existed |
  | `text-chip` | `text-label-sm-bold` | rename |
  | `text-meta` | `text-label-sm` | rename |

- The rule behind it (§1.8): a token is named by what is inside it, never by who wears it. Two names survived with their reason recorded in the spec — `caps` and `caps-tight` describe their own appearance, and `nav` is the one size-and-weight nothing else in the system uses.

## 0.4.0 — 2026-09-17

**Type presets: 24 on 11 sizes, every line box on 4pt** ([#30](https://github.com/ztrawinska/craft-your-money/pull/30), §1.4)

- 76 declarations added: each preset bundles size, line box, weight and tracking under one class.
- **Closed** the type scale (`--text-*: initial`): Tailwind's `xs…9xl` are gone, and so is `text-[13px]`.

## 0.3.0 — 2026-09-17

**Consolidate the radii onto the 2/4/8 scale** ([#29](https://github.com/ztrawinska/craft-your-money/pull/29), §1.6)

- **Removed `--radius-frame`**; `button`, `input`, `nav-plus` and `sheet` changed value. Eight radii became seven.

## 0.2.1 — 2026-09-17

**Name the eight radii in code; values unchanged** ([#28](https://github.com/ztrawinska/craft-your-money/pull/28))

- 8 tokens added. Nothing moved on screen — `rounded-[8px]` became `rounded-button`.

## 0.2.0 — 2026-09-16

**Close the spacing scale: three tiers** ([#27](https://github.com/ztrawinska/craft-your-money/pull/27), §1.5)

- 20 tokens added (steps, sizes `xs…2xl`, roles), 6 role values changed.
- **Closed** the scale (`--spacing: initial`): `p-2.5` and `p-[11px]` now render nothing. 95 call sites migrated.

## 0.1.3 — 2026-09-16

**Name on-clay and ink/10; mirror the three Figma-only text styles** ([#22](https://github.com/ztrawinska/craft-your-money/pull/22))

- `--color-on-clay` added, so the pair `clay` + `on-clay` travels together.

## 0.1.2 — 2026-09-16

**Layout spacing on an 8pt rhythm with named steps** ([#5](https://github.com/ztrawinska/craft-your-money/pull/5))

- 7 tokens added. The scale was still open at this point; closing it was 0.2.0.

## 0.1.1 — 2026-09-15

**Ink ladder and chips to AA** ([#3](https://github.com/ztrawinska/craft-your-money/pull/3))

- The three status colours retuned so chip text clears WCAG AA on its own 15% fill: green `#3A7D52` → `#336E48`, amber `#9C7B2A` → `#785F20`, red `#B04A40` → `#A2443B`. Amber moved the most.
- The ink ladder merged `ink-55` and `ink-42` into `ink-62` — opacities, not tokens, so no token changed.

## 0.1.0 — 2026-09-15

**The system becomes a system** ([#2](https://github.com/ztrawinska/craft-your-money/pull/2))

- `design/tokens.json` (W3C DTCG) added as the export of `globals.css`, with `src/lib/tokens.test.ts` failing on drift.
- `/design` added: the live library, rendering the real components and tokens.

Before this, tokens lived only in `globals.css` and the system was a stylesheet. The values came from the **r3 mockups** in `docs/design/` — which is what "r3" names in this repo: the third round of static mockups, not a version of the system. Everything above is how far the system has moved since.
