# Work order — 2026-09-15

From [2026-09-15-inspection.md](../reports/2026-09-15-inspection.md) (54/100). Reds are **fix now**; yellows are **scheduled**. Each item: station · evidence · suggested first move. Order within a group is a proposal — the calls are yours.

**Tracking (2026-09-16):** every item is a GitHub issue in milestone *DS inspection 2026-09-15* (#6–#19; F1/F2 filed closed against #3). This file stays the source of the *what and why*; the issues carry status and link to PRs. Add `Closes #N` to the PR that finishes an item.

## Fix now (red lights)

### F1 · Re-tune the ink ladder and chip fills so text meets AA at the sizes it's used — station 3
**Issue:** #6 — closed, fixed in #3
**Status 2026-09-15 — done, code and Figma.** Rule chosen: three text rungs (`ink` · `ink/70` · `ink/62`); `ink/55` and `ink/42` merged into `ink/62` (4.7:1). Status colours darkened: green `#336E48`, amber `#785F20`, red `#A2443B` (chip text on 15% fill = 4.5:1 each). Changed: `globals.css` (+ `--destructive`, `--muted-foreground` = ink@62 `#706C69`), `tokens.json`, 124 class uses in `src`, two real-text `ink/30` uses, spec §1.2/§1.3 + 22 mentions, CLAUDE.md, `check-tells.sh` allow-list, `/design` Ink lede. Not changed: `docs/design/*.html` (static r3 renders). Figma: 8 `status/*` variables re-valued (same alphas), `ink/55` renamed to `ink/62` @0.62 (97 bindings kept), 53 paints rebound from `ink/42` → `ink/62`, `ink/42` deleted, Foundations swatch tiles and 5 component descriptions updated. Parity check Figma ↔ `tokens.json`: 17/17 shared values agree.
**Evidence:** `ink/55` 3.8:1 (24 uses at 12–13px), `ink/42` 2.6:1 (19 uses at 9–11px), chips green 3.75 / amber 3.08 / red 4.0 at 12px and 10.5px. Same values in Figma (`ink/55`, `ink/42`, `status/*-fill`).
**First move:** decide the rule first, then the numbers. A workable rule: text below 18px never sits on a rung under `ink/70`; `ink/55`/`ink/42` become *non-text* rungs (hairlines, icons, disabled). For chips, either raise the fill (status colour at 15% → a solid tinted fill, e.g. 22–25%, recomputed) or deepen the three status colours by ~15% lightness — one token change each, verified by the same blend maths. Change values in `globals.css` → `tokens.json` (the test forces it) → Figma variables. Then re-check the 43 text uses; most will just inherit.

### F2 · Make the test suite green and put it in CI — station 5
**Issue:** #7 — closed, fixed in #3
**Status 2026-09-15 — done.** `products.test.ts` rewritten against the authored collection (flagship = Harmonia collar; Thetis = the one Risky piece; state mix asserted). 47/47 pass. `.github/workflows/ci.yml` runs `npm test`, `tsc --noEmit`, `npm run lint`, then the tell-check as advisory. A pre-existing `react-hooks/set-state-in-effect` error in `PricingPanel.tsx` was fixed (render-time adjustment) so lint could join CI. Proves itself on first push.
**Evidence:** `npx vitest run` → 2 failed / 43 passed (`products.test.ts`: `Cannot read properties of undefined (reading 'materials')`); no `.github/workflows`.
**First move:** fix the fixture lookup in `products.test.ts` (the sample product it expects has been renamed or removed — 5-minute job). Add one workflow: `npm ci && npm test && npm run lint`. From then on a red suite blocks a merge instead of hiding.

## Scheduled (yellow lights)

### S1 · Tokenise type, radius and space in `globals.css` — stations 2, 4, 9
**Issue:** #8 — open; space done in #5 and closed as a scale in #23, type and radius remain
**Status 2026-09-15 — space done; type and radius still open.** Grid decided: 8pt rhythm at layout level (named tokens), 4pt inside components, 2px/1px only as the currency-symbol nudges. Spec §1.5 rewritten from ranges to fixed steps (tight 8, row 16, section 24, zone 32, row-height 64, tap 44). `--spacing-*` utilities in `@theme` (`pt-section`, `py-row`, `min-h-row-height`, `gap-tight`, `min-h-tap`), guarded by a new parity test in `tokens.test.ts`. All 69 arbitrary spacings migrated (0 left); `check-tells.sh` now reports any new one. Product rows chosen as exactly 64px (`min-h-row-height py-tight`) — was 71px, off-grid — so lists get one more row per screen. Figma `Space` variables re-valued to match. Option 2 (strict 8pt inside components too) was decided 2026-09-16 (#19 → foundations plan D1–D3): a *closed* 4/8 scale in three tiers, implemented as P1 (#23) — `--spacing: initial`, steps 0…96, sizes xs…2xl, roles aliased; 61 half-step uses migrated (57 app + 4 shadcn) plus 34 in the `/design` pages; `nudge` 2px as the one named sub-4pt step; parity test checks values and alias relationships; Figma `Space` rebuilt as scale/size/role with aliases (26 variables, 156 bindings kept); checker exits 1 on any off-scale step, CI honours it.
**Evidence:** 181 `text-[…px]` (13px ×33, 12px ×25, 15px ×16…), 24 `rounded-[…]`, 50 arbitrary paddings; 23 type styles / 8 radii / 7 spaces already named in `tokens.json` and Figma.
**First move:** add the 8 radii as `--radius-stamp … --radius-chip` and the 7 spaces as `--spacing-*` in `@theme` (Tailwind v4 then gives `rounded-button`, `p-gutter`). For type, add `@utility text-meta { … }`-style utilities for the 23 styles, or at minimum `--text-*` sizes. Migrate one component (Chip) end-to-end as the pattern, then the rest by search-and-replace. Extend `check-tells.sh` to flag new `text-[`/`rounded-[` arbitraries once utilities exist.

### S2 · Add the `on-clay` and `ink/10` tokens; reconcile the 3 Figma-only text styles — stations 2, 4
**Issue:** #9 — done 2026-09-16
**Status 2026-09-16 — done.** All three turned out to be real, not noise: code already used every one of them, only without a name. `on-clay` `#FDFBF9` added to `globals.css` (`--color-on-clay`) and `tokens.json`; the 8 literals are now `text-on-clay` / `bg-on-clay`; the shadcn `--primary-foreground` keeps the same hex, marked as on-clay. `ink/10` was the neutral chip's fill (`bg-ink/10` in `Chip.tsx`) — added to the ladder in `tokens.json` and spec §1.3. The three Figma-only text styles matched code exactly (Chip sm 10.5/600, Button ghost 14.5/500, AssistantSlot label 13.5/500) — added to `tokens.json` `type` and spec §1.4; Figma descriptions filled in. Also fixed on the way: §1.3 rationale read "`ink-62` (3.8:1) and `ink-62` (2.6:1)" after the F1 rename — now `ink-55` / `ink-42`; §2.3 primary button spelled with `on-clay` and its real 14.5px; `check-tells.sh` no longer lists `app/manifest.ts` (JSON for the browser, can't use a CSS variable) — the token-hex section is empty for the first time.
**Evidence:** `#FDFBF9` literal in 8 files; Figma has `on-clay`, `ink/10`, `Sans/chip-sm`, `Sans/button-ghost`, `Sans/assistant`; `tokens.json` has none of them.
**First move:** `--color-on-clay: #FDFBF9` in `globals.css` + `tokens.json`; replace the 8 literals. Add `ink/10` to the opacity ladder. Decide whether the 3 text styles are real (then add to `tokens.json` `type`) or noise (then delete in Figma).

### S3 · Bring the missing 8 components into Figma, starting with the identity pieces — station 1
**Issue:** #10
**Evidence:** Figma mirrors 9/17: missing FramedSurface, TintedBand, Input, Switch, RadioCards, Collapse, ActionSheet, IrisSheet.
**First move:** FramedSurface and TintedBand first (they define the look); Input/Switch/RadioCards next; sheets last (they're mostly behaviour). Generate from code the same way the first 9 were, via the bridge — and this time record the prompt/script in `scripts/` so it can be re-run (see S5). Delete the duplicate `Icon/plus`.

### S4 · Bind Figma spacing and the remaining text/radius to variables — station 2
**Issue:** #11
**Evidence:** `itemSpacing` bound 0/71; padding hard 25 (BottomNav); text unstyled 20 (ListRow/Product 13); radius hard 10 (ListRow/Product).
**First move:** one `figma_execute` pass that walks components and binds `itemSpacing`/padding to the nearest `space/*` variable, `cornerRadius` to `radius/*`, and unstyled text to the matching `Sans/*`/`Serif/*` style. ListRow/Product and BottomNav account for most of it.

### S5 · Give the code → Figma sync a re-run path and a parity check — station 6
**Issue:** #12
**Evidence:** one-shot generation on 2026-09-15, no script, no Code Connect; drift visible the same day.
**First move:** a small script (`scripts/figma-sync.md` or a `figma_execute` snippet checked in) that (a) upserts variables from `tokens.json`, (b) upserts text styles from `tokens.json` `type`. Then a read-only parity script that diffs Figma variables/text styles against `tokens.json` and exits non-zero — add it to CI once F2 exists.

### S6 · Close the spec/library coverage gaps — station 1
**Issue:** #13
**Evidence:** spec §2 has no RadioCards, Switch, Combobox; `/design` has no Combobox or inline-form page (spec §2.12 exists).
**First move:** two short spec sections (RadioCards, Switch — the rules already exist in their docblocks); one `/design` page each for Combobox and inline-form via `nav.ts`.

### S7 · Decide the three unsanctioned shadows — station 2
**Issue:** #14 (decision)
**Evidence:** Button primary `shadow-[0_1px_2px_rgba(138,90,82,0.3)]` (Button.tsx:24); sticky footers (ProductEditor.tsx:795, SettingsForm.tsx:170). Spec §1.1 "no drop shadows"; only popover (§2.4) and sheet (§2.11) are sanctioned.
**First move:** either remove them or add a line to §2.3 / §2.12 sanctioning them (a "lift on the primary action" and "a sticky bar's fold" are defensible). Either way the spec and code stop disagreeing.

### S8 · Fix the tell-checker's standing false positive and widen its eye — station 5
**Issue:** #15 — done 2026-09-16
**Status 2026-09-16 — done.** `#000`/`#fff` inside a `gradient(`/mask line no longer count as colours (the hex sections now share one pass that drops them); the top of every report is clean. New section "Type and radius still written by hand" prints `text-[…px]` / `leading-`+`tracking-[…]` / `rounded-[…]` counts (174 / 60 / 24 today) with the five most common sizes — non-failing until the §1.4/§1.6 utilities exist, then it becomes a hard flag like spacing. Spec §6 table row updated.
**Evidence:** `#000` in FramedSurface.tsx:39–40 is a CSS mask, reported every turn; the checker doesn't see type/space arbitraries.
**First move:** allow-list `#000` inside `mask-image`/`gradient(` lines; add a count of `text-[`/`rounded-[`/`p*-[` arbitraries so S1's migration is visible as a number going down.

### S9 · Version the system — station 7
**Issue:** #16
**Evidence:** spec "r3", no tags, no CHANGELOG, no `$version` in tokens.json, Figma unversioned.
**First move:** a `CHANGELOG.md` with one entry per token-value or component-API change; tag `ds-r3` now; stamp the same version into `tokens.json` (`$extensions.cym.version`) and the Figma Cover page.

### S10 · Point agents at Figma and map components — station 10
**Issue:** #17
**Evidence:** CLAUDE.md doesn't mention the Figma library or figma-console; no Code Connect; component ↔ Figma mapping is by name only.
**First move:** three lines in CLAUDE.md (Figma URL, "figma-console is the bridge; run the Desktop Bridge plugin", "Figma is a mirror — change code first"). A `design/figma-map.json` (component → Figma node id/key) is cheap and lets an agent open the right node without searching.

### S11 · Give the human loop a place — station 8
**Issue:** #18
**Evidence:** rule-didn't-hold observations only survive as SETUP.md rejected-ideas entries.
**First move:** a `docs/decisions.md` (or keep SETUP.md but title the section) with a dated line whenever a rule is bent in practice. Solo-sized; the value is in re-reading it before the next inspection.

## Not scheduled (noted, no action)

- Price has `primary` and `hero` variants in Figma that code exposes elsewhere (`HeroProfit`, pricing block) — acceptable naming difference; note in the Figma description.
- Chip `Tone=inactive` flagged by Figma lint as an unexplained disabled state — it's a workflow stamp, not a disabled control; add one sentence to its Figma description.
