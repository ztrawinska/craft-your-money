# Craft Your Money — Design System

**Status:** the visual source of truth. Values here are extracted from the built r3 mockups in `docs/design/`, not invented.

**How this relates to the other docs:**
- `PRD v2` says *what the product does and why*.
- **This file** says *what things look like and when to use them*.
- `docs/design/*.html` are the reference renders — read them for exact layout when building a specific screen.

**Reading order for a new screen:** PRD (behaviour) → this file (components) → the matching mockup (layout).

---

## 1. Foundations

### 1.1 The five principles

Everything below descends from these. When a decision is unclear, return here.

1. **Flat.** No cards, no drop shadows, no floating panels. Depth comes from hairlines and one framed surface — never from elevation.
2. **One framed surface per screen.** Exactly one place is visually enclosed: where the decision happens. On Product Detail that's the pricing block. Everything else sits directly on the page.
3. **One accent.** Clay, and only clay. Actions, links, focus, the pricing frame, the primary button. Iris is not a second accent — it is the AI identity and appears only when the assistant is involved.
4. **Status lives in chips.** Never as raw coloured text. Numbers are monochrome ink.
5. **More authored, not louder.** Contrast comes from structure, hierarchy and restraint — never from decoration.

### 1.2 Colour tokens

| Token | Value | Used for |
|---|---|---|
| `page` | `#F7F4F0` | Page background. The default surface. |
| `card` | `#FFFFFF` | The single framed surface only. Not for grouping. |
| `cream-mid` | `#EDE7DD` | Reserved. Deprecated for verdict/insight bands — too heavy (see 1.3). |
| `ink` | `#1E1916` | All primary text and **all numbers**. |
| `clay` | `#A0716A` | Identity accent: framing, top rules, the "+" square. |
| `clay-deep` | `#8A5A52` | Actionable clay: links, buttons, active nav, verb-links, focus. |
| `iris` | `#6467C9` | The glint only. |
| `iris-deep` | `#5155B4` | Assistant text and iconography. |
| `status-green` | `#3A7D52` | Healthy — **chips only**. |
| `status-amber` | `#9C7B2A` | Caution — **chips only**. |
| `status-red` | `#B04A40` | Risky / loss — **chips only**, plus the left-edge urgency stripe. |

**Currency:** £ throughout, including sample data.

### 1.3 Ink opacity scale

Ink is used at fixed opacities rather than as separate greys. This keeps everything in one hue family.

| Token | Opacity | Used for |
|---|---|---|
| `ink` | 100% | Primary text, all numbers |
| `ink-70` | 70% | Body copy, briefing paragraphs |
| `ink-55` | 55% | Secondary labels, meta text |
| `ink-42` | 42% | Section labels (caps), inactive nav, unit suffixes |
| `ink-30` | 30% | Placeholders, muted marks, the neutral stripe |
| `ink-14` | 14% | Stronger dividers, input borders, dashed frames |
| `ink-07` | 7% | Hairline dividers between rows and sections |

**Tinted bands** (briefing, insight strip) use `rgba(ink, 0.035)` — deliberately lighter than `cream-mid`, which read as shouting. Backgrounds should sit very close to the page.

### 1.4 Typography

Two families, strictly divided by role.

**Lora (serif)** — outputs and identity: product names, prices, all numbers, greetings, section totals.
**IBM Plex Sans** — everything else: labels, body copy, meta lines, buttons, navigation.

The rule of thumb: *if it's a number or a name, it's Lora. If it's chrome, it's Plex.*

Lora was validated against Fraunces, Newsreader and Literata on the real pricing block, judged primarily on tabular numerals and pairing with IBM Plex Sans. Kept deliberately, not by default.

#### Type scale

| Role | Size | Family | Weight | Notes |
|---|---|---|---|---|
| Hero figure (dashboard profit) | 46px | Lora | 500 | Currency symbol at 29px, `ink-42` |
| Final price | 56px | Lora | 500 | Whole number; decimals at 25px, currency at 22px |
| Profit amount | 34px | Lora | 500 | |
| Greeting / page title | 27px | Lora | 500 | |
| Product name (detail header) | 27px | Lora | 500 | Line-height 1.16 |
| Direct cost total | 24px | Lora | 500 | |
| Supporting metric | 20px | Lora | 500 | Unit suffix 10.5px sans, `ink-42` |
| Section total | 13px | Lora | 400 | `ink-55` |
| Product name (list row) | 15–16px | Lora | 500 | |
| Row value | 15.5px | Lora | 400 | |
| Briefing paragraph | 15px | Plex | 300 | Line-height 1.7 |
| Row label | 15px | Plex | 400 | |
| Body / helper | 13px | Plex | 300 | |
| Verb-link | 13.5px | Plex | 600 | clay-deep |
| Chip | 12px | Plex | 600 | |
| Meta line | 11.5px | Plex | 300 | `ink-55` |
| Section label (caps) | 10px | Plex | 600 | `letter-spacing: 0.2em`, uppercase, `ink-42` |
| Metric label (caps) | 9px | Plex | 600 | `letter-spacing: 0.13em`, uppercase |
| Workflow stamp | 9.5px | Plex | 600 | `letter-spacing: 0.22em`, uppercase |
| Nav label | 9px | Plex | 500 | |

**Numeric rule:** every figure uses `font-feature-settings: 'tnum'` (tabular numerals) so columns align and numbers don't jitter when they change.

**Caps labels** always pair small size with wide tracking (0.12–0.22em). This is the system's quiet structural voice — it recedes while still organising.

### 1.5 Spacing

Horizontal gutter is **24px** on every screen. Vertical rhythm:

| Gap | Value | Between |
|---|---|---|
| Tight | 4–8px | Label and its value |
| Row | 13–16px | Vertical padding inside list rows |
| Section | 22–26px | Between subsections within a zone |
| Zone | 30–34px | Between major zones (briefing / attention / metrics / resume) |

**Lists are compact; briefings breathe.** These are different screen types. A list row is 56–64px tall to keep context visible; dashboard zones get 30px+ so each reads as a separate thought.

### 1.6 Radii

| Value | Used for |
|---|---|
| `2px` | Workflow stamp (Draft) |
| `6px` | Framed surfaces, notes |
| `7px` | Buttons |
| `8px` | Tinted bands, dashed containers |
| `11px` | The nav "+" square |
| `100px` | Chips only |

Nothing is rounder than 11px except chips. Generous radii read as "app card" — the thing we avoid.

### 1.7 Lines

| Weight | Token | Used for |
|---|---|---|
| Hairline | `1px ink-07` | Between rows, between subsections |
| Divider | `1px ink-14` | Before a summary, above a metric band |
| Dashed | `1px dashed ink-14` | Secondary/derived lines (business-cost share), resume container |
| Accent rule | `3px clay` | Top of the framed pricing surface |
| Urgency stripe | `3px` status colour | Left edge of a list row |
| Active tick | `2px clay-deep` | Above the active nav tab |

The 3px clay top rule and the 2px clay nav tick are deliberately the same device at different scales: *"this is where you are"* and *"this is where you decide"* speak one visual language.

---

## 2. Components

Each component below is a real reusable piece, not a convention. Building them as components is what makes the rules *the path of least resistance* rather than something to remember.

### 2.1 Chip — **built**

The only way to show status in this system.

**Props:** `tone` (meaning, not colour) and children.
**Tones:** `positive` / `caution` / `critical` / `neutral` / `inactive`.

| User-facing label | Tone | Appearance |
|---|---|---|
| Healthy · 64% | `positive` | green at 15% bg, green text |
| Caution · 22% | `caution` | amber at 15% bg, amber text |
| Risky · 8% | `critical` | red at 15% bg, red text |
| No price | `neutral` | ink at 10% bg, ink-70 text |
| Draft | `inactive` | transparent bg, ink-14 border, ink-42 text |
| Archived | `inactive` | transparent bg, ink-14 border, ink-42 text |
| Would be Healthy · 52% | `positive` | draft preview — "Would be" carries the tentativeness |

**Why `neutral` and `inactive` are separate tones.** The status model has two
layers (PRD §8). *Healthy / Caution / Risky / No price* are **profitability
statuses** — a verdict on a product that is live in the collection. *Draft* and
*Archived* are **workflow states**: the product isn't in the live range at all,
so there is nothing to judge. The rendering encodes exactly that split — a
**filled** chip is a verdict on a live product; an **outlined** chip means the
product sits outside the range. `No price` therefore stays `neutral` and stays
filled: it *is* live, it's just missing an input. `Draft` and `Archived` take
`inactive`.

**Why it isn't called `neutral-outline`.** That name describes the *rendering*
(an outline), which is the exact mistake the tone vocabulary exists to prevent —
we say `caution`, never `amber`. `inactive` names the *meaning* (the product is
outside the live range); the outline is merely how that meaning looks today.

**Anatomy:** `rounded-full`, `px-3 py-1`, 12px Plex 600, tabular numerals. A
`sm` size (10.5px, `px-2 py-0.5`) exists only for a chip sitting inline in dense
text — e.g. the status chip inside a dashboard attention row's meta line.

**Rules**
- Chips merge label + margin into one unit: `Healthy · 64%`, never a badge next to a coloured number.
- "No price" takes `neutral`, not a status colour — it is a missing input, not a health judgment.
- `inactive` (Draft, Archived) is outlined, not filled — the product is outside the live range, so there is no verdict to colour.
- Never invent a tone for a one-off. If a new meaning appears, add it to the union type.

**Anti-patterns:** raw coloured status text; a coloured number with a separate badge; chips used for anything that isn't status.

### 2.2 Price — *to build*

Guarantees Lora and tabular numerals wherever money appears.

**Variants:** `hero` (46px, dashboard), `primary` (56px, the final price), `figure` (24px, totals), `inline` (15.5px, row values).

**Rules**
- Currency symbol is always smaller and `ink-42`; the number carries the weight.
- Large prices split the decimals down (56px whole, 25px decimals) so the eye lands on pounds.
- **Cost and price figures are always monochrome ink.** Materials, labour, totals, direct cost, full cost, calculated price, your price, "you keep" — all ink.
- **One exception: the profit figure takes its chip's tone.** On Product Detail the profit carries the *same* status colour as the chip beside it (`positive` / `caution` / `critical`), so the two can never disagree.

**Why the exception exists.** Product Detail holds around fifteen figures; the profit is the answer among them and needs a point of attachment. Colouring it by status is not decoration — it is a second carrier of the same signal the chip already shows. The rule stays "colour means status", its scope simply widens to one figure.

**Why it is not "green when positive".** A product can have a positive profit and a Risky margin (£4.00 at 9%). Green-when-positive would put a green number beside a red chip — two contradictory stories. Tone-follows-chip makes that impossible by construction.

**Dashboard stays fully monochrome.** It holds few figures and the hero is a single truth, so it needs no anchor. Different screen, different job — the same distinction we make between compact lists and a breathing briefing.

**Anti-pattern:** green-when-positive; colouring cost figures; a profit figure whose colour disagrees with its chip.

### 2.3 Button — *to build*

Three levels. **Three, not four** — resist adding a fourth.

| Variant | Appearance | Used for |
|---|---|---|
| `primary` | Filled `clay-deep`, `#FDFBF9` text, 7px radius, 14px 600 | The one main action per screen (Save and activate) |
| `ghost` | Transparent, `1px ink-14` border, `ink-55` text, 500 | Secondary action beside a primary (Save draft) |
| `link` | Clay-deep text + optional chevron, no border, no background | Everything else: verb-links, add-row, reset, inline actions |

**Rules**
- A screen has at most one `primary`.
- Row-level actions are always `link` — never a boxed button. Two boxed buttons stacked in a list compete with the framed surface.

**Icon position carries meaning.** This is the rule that decides which icon a verb-link gets:

| The action | Icon | Example |
|---|---|---|
| **Navigates** somewhere | Lucide `chevron-right`, **trailing**, 15px | `Reprice ›` · `Set price ›` · `3 ›` |
| **Acts in place** | An action-specific Lucide icon, **leading**, 13–15px | `+ Add material` · `↺ Restore` |

A trailing chevron is a promise that something opens. Putting one on an action that completes in place — like Restore — would be a lie about what the tap does. Restore uses `rotate-ccw`; `archive-restore` is more literal but too busy at this size (the same lesson the Costs icon taught us).

**Anti-pattern:** a "soft filled" fourth level (clay wash + outline). It was built, tested and rejected — it added weight without adding clarity.

### 2.4 Dropdown — *built (ghost trigger + shadcn Drawer sheet)*

A filter, sort or select control. **Not a new control level — it is the ghost button plus a chevron.**

**Anatomy:** 7px radius, `1px ink-14` border, transparent background, 12.5px Plex 500 in `ink-55`, Lucide `chevron-down` at 14px in `ink-42`, padding 8px 12px.

**States**

| State | Appearance |
|---|---|
| Default | ghost treatment, `ink-55` label |
| Filtered / value set | `clay-deep` label, `rgba(clay-deep, .45)` border, `clay-wash` background |
| Open | `clay-deep` label and border, clay focus ring `0 0 0 3px rgba(clay, .12)`, chevron rotated 180° |

**Rules**
- Background stays **transparent**. A white fill would create a new surface on a flat page.
- Radius is **7px**, never 100px — that geometry belongs to chips and means "status".
- The chevron comes from the icon set, never a text caret (`▾`).
- Filters are dropdowns; **sort is not**. Sort is a mode, not a value to filter by, so it sits at the right of the control row as a bare `arrow-up-down` icon (18px, `ink-55`, 38px tap target) and opens a sheet. Keeping it out of the dropdown family stops the row from reading as three equal boxes.

**Anti-pattern:** chip-shaped dropdowns; white pills floating on the page; text carets.

### 2.5 Section header — *to build*

`SectionLabel` + optional right-aligned total.

- Label: 10px Plex 600, uppercase, 0.2em tracking, `ink-42`.
- Total: 13px Lora, `ink-55`, right-aligned on the same baseline.
- Followed by rows separated with `ink-07` hairlines.

### 2.6 List row — *to build*

The workhorse. Two lines, optional left stripe, optional right slot.

**Anatomy**
```
[stripe]  Primary label (Lora 15–16px)              [right slot]
          Meta line (Plex 11.5px ink-55)
```

- **Left stripe:** 3px, status-coloured, urgency-scaled (red full, amber 55%, green 38%, none for No price / Draft). A secondary scan aid — the chip is primary. *Exception:* on the dashboard's curated attention list — where every row already needs action — a No-price row takes a neutral `ink-30` stripe rather than none, since "no stripe" would there read as "nothing here".
- **Right slot:** a chip (overview) or a verb-link (dashboard attention).
- **Meta line** carries the arithmetic in the quiet voice: `4g × £0.62/g`, `20 min · £15/hr`, `Ring · £42.00`.
- Height 56–64px. Whole row is tappable; no hover-only affordances.
- **When a row is muted (draft, archived), dim the content — never the action.** Dimming the whole row makes a live action read as disabled. The name and meta line recede; the verb-link stays full-strength clay.

### 2.7 Framed surface — *to build*

The one enclosed area per screen. Currently: the pricing block.

- `1px` clay border at 34% opacity, 8px radius, white background.
- `3px` solid clay rule across the top.
- Internal sections divided by `ink-07` hairlines.

**Rule:** if a second framed surface appears on a screen, one of them is wrong. Reach for hairlines instead.

### 2.8 Tinted band — *to build*

For briefings, insight strips and quiet emphasis.

- Background `rgba(ink, 0.035)`, radius 8px, padding 16px 18px.
- Contains prose, never numbers-as-heroes.

**Rule:** backgrounds sit very close to the page. If a band draws the eye before the content does, it's too strong.

### 2.9 Assistant slot (the glint) — *to build*

The only place iris appears.

- `1px` iris border at 30%, `rgba(iris, 0.06)` background, 8px radius.
- Glint SVG at 15px, then 13.5px iris-deep label, then a trailing arrow.
- Glint path: `M12 3 Q13.6 9.4 21 12 Q13.6 14.6 12 21 Q10.4 14.6 3 12 Q10.4 9.4 12 3 Z`

**Rules**
- Iris never mixes with clay on the same element.
- Iris never touches status colours.
- Deterministic features (library autofill) use a neutral ◆ diamond, **not** the glint. The glint means *a model is thinking*, and that promise must stay honest.

#### The expanded surface (Price Check)

When the assistant answers, the review is **an inset inside the existing framed surface** — never a second floating card. On Product Detail it opens within the pricing block, below a hairline.

- **Marker:** a `2px` iris left-rule and a `rgba(iris, .055)` wash, 6px radius on the right side only.
- **Structure:** header (glint + "Price check" label + dismiss) → verdict in Lora → numbered findings separated by iris-tinted hairlines → preview-only scenarios → follow-up chips → provenance footer.
- **Iris appears on exactly four things:** the glint, the section label, the finding numerals, and the follow-up chips.
- **Iris never touches the price, the profit or the status chip.** Those keep clay and status colours.

The rule to remember: **iris marks who is speaking, never what the answer is.**

- **Scenarios are preview-only.** They show what another price would mean; tapping one never applies it. There is no "apply" control in the card — the price stays the user's decision.
- **Follow-ups are chips, never free text**, generated from the findings themselves, roughly three exchanges deep. The assistant cannot introduce new UI.
- **Provenance closes every review:** *Used / Assumed / Can't know*. Admitting the limit is what makes the rest trustworthy.

### 2.10 Bottom navigation — **specified**

`Home · Products · [+] · Materials · Costs`. Settings is not a tab — it lives behind the dashboard avatar.

- Icons: neutral Lucide (house, tag, layers, wallet, plus), 22px, 1.6px stroke, `ink-42`.
- Active: 2px clay top-tick, clay icon stroke, clay label at 600.
- Central "+": flat clay square, 42px, 11px radius, **bottom-aligned with the tabs**. No lift, no shadow, no FAB.
- Labels always visible. Full column is the tap target.

**Rule:** chrome carries no category signal. A candlemaker reads these icons identically. Jewelry lives only in content.

### 2.11 Action sheet — *built (shadcn Drawer)*

Holds destructive and secondary actions for an object (the ⋯ menu). **A bottom sheet, not a floating popover** — no card hovering over a flat page, full-width 44px+ targets, identical behaviour by tap at any size.

**Anatomy:** page background, `1px ink-14` top border, 14px top corners, a small grab handle, then items separated by `ink-07` hairlines. Each item: 18px Lucide icon, 14.5px label, optional 11px `ink-42` sub-label explaining consequence. A "Cancel" row closes it.

**Rules**
- Destructive items take `red` for both icon and label, and always sit **last**.
- Consequences are stated in the sub-label, not discovered afterwards.
- **Dividers mark a change in the kind of action, not every row.** Constructive actions sit together with no rule between them; a single hairline separates them from the destructive one. A line per row is noise.
- **Cancel is a full-width `ghost` button, set off by a gap** — not another list row with a hairline. It belongs to a different group than the actions, and the gap says so better than a line.
- **Confirmation stays inside the same sheet** — the sheet's content swaps to an inline confirm. Never a modal stacked on a modal.
- A destructive confirm must **name the object**, say plainly that it is permanent, and where one exists, **point at the gentler alternative**.

**Anti-pattern:** floating popover menus; a confirm dialog opening on top of a sheet; destructive actions with no stated consequence.

**Implementation:** the action sheet and the status/type filters (§2.4) share ONE primitive — a shadcn **Drawer** (vaul) restyled to these tokens (`ink-28` scrim, 34×3px grab handle, 14px top corners, `max-w-430`, the sheet shadow). vaul supplies focus-trap, Escape and scroll-lock; the anatomy and rules above are enforced by the styling, not the library. This is why the filters open a bottom sheet, never a floating menu — the primitive has no floating variant in this app.

### 2.12 Inline form — *to build*

Add and edit never open a modal.

- The row expands in place; a **3px clay left stripe** plus a **faint `ink` 3.5% tint** (rounded on the right, like the assistant inset in §2.9) mark edit mode; content below shifts down. Inputs stay `page`-coloured so they lift off the tint.
- Inputs: `page` background, `1px ink-14` border, 5px radius, 15px Lora for values (tabular).
- Focus: clay border + `0 0 0 3px rgba(clay, 0.12)` ring.
- Live line cost above the actions, on a dashed rule.
- Delete opens an **inline confirm**, never a modal, with reassuring copy.
- Save is disabled until the row is valid. No error states while typing.
- 16px minimum input size (prevents iOS zoom); 44px minimum touch targets.

---

## 3. Composition rules

**Per screen:**
- One framed surface. One `primary` button. One dominant number.
- **Control rows** hold filters as dropdowns on the left and a single bare sort icon on the right. Never a third box.
- Colour appears only in chips, the clay accent, and (once) the urgency stripe.

**Vertical order** follows importance, not convention: the answer first, the detail below. The dashboard opens with a greeting and a briefing, not a title. The pricing block ends with profit — the last word is the verdict.

**Empty states disappear.** When a section has nothing to say, it does not render. No "all clear" bands, no proud zeros. A shorter screen is the message. The one exception: a metric cell that must hold its grid position switches to a quiet italic state ("all on target") rather than showing `0`.

**Progressive disclosure:** fixed costs, market benchmark and the materials library are opt-in depth layers. They never block the core flow, and when unconfigured they show a quiet nudge — never an error.

---

## 4. Voice and copy

**Plain language over finance jargon.**

| Say | Not |
|---|---|
| What this costs to make | Direct cost |
| What you keep | Net revenue |
| Your profit | Contribution margin |
| Business costs | Overhead |
| Your price | Final price (in UI) |

**Reserved phrasings**
- **"You keep"** is only ever about VAT.
- **"Your profit"** is only ever after all costs.
- A loss never uses the word profit: *"You lose £2.06 on each piece."*
- Draft state uses **"Would be"**: `Would be Healthy · 52%`.

**Warnings are helpers, not alarms.** Calm, plain, and they suggest a direction. "Error" and "invalid" are reserved for genuine system failures — never for a low margin.

**Warnings and notices stay monochrome ink** — never a coloured band or coloured text. A notice that needs setting off sits in a tinted band (§2.8), still in ink. Colour lives only in chips and the clay accent; a warning introducing amber or red would make colour mean two things. (The status verdict a warning refers to is already carried, in colour, by its chip.)

**The tool has opinions but does not lecture.** One chip, one plain sentence. No modal advice chains. The user runs the business; the tool informs.

**Briefing voice** (dashboard): warm, specific, assembled from real numbers, written as if by someone who knows the business. Never generic encouragement.

---

## 5. Anti-patterns

Explicitly rejected during design. Each was built or considered and turned down for a reason.

| Anti-pattern | Why rejected |
|---|---|
| Soft white cards for grouping | Five floating surfaces compete; the page reads as generic SaaS |
| Drop shadows anywhere | Depth belongs to hairlines and one frame |
| Green-when-positive profit | Can put a green number beside a red Risky chip — two contradictory stories |
| Coloured cost figures | Five text colours at once; costs are inputs, not verdicts |
| A fourth button level | Row actions don't need a box; three levels are enough |
| Material-style FAB in the nav | Reads as a library default, not a decision |
| "All clear" reassurance bands | Confidence through absence; empty sections vanish |
| A proud `0` as a hero metric | Designed for the bad day, embarrassing on a good one |
| Jewelry icons in navigation | Locks the chrome to one craft |
| Glint on deterministic features | Dishonest — the glint means a model is involved |
| Floating popover menus | A card hovering over a flat page; poor tap targets on mobile |
| Modal stacked on a sheet | Confirmation belongs inside the sheet that raised it |
| Dimming a whole row to mute it | Makes live actions look disabled; dim the content only |
| A hairline between every sheet row | Dividers should mark a change of kind, not repeat per item |
| "If activated, this would be Healthy" | A whole sentence doing a chip's job |

---

## 6. Enforcement vs convention

A rule written down is memory; a rule in a type or a component is enforcement. As the system is built, each rule should move leftward:

| Rule | Currently | Should become |
|---|---|---|
| Status only in chips | Convention | Enforced — `Chip` is the only status export |
| Meaning-named tones | **Enforced** | — (`ChipTone` union) |
| Label ↔ tone mapping | Convention | Enforced — an explicit table, not remembered |
| Money always Lora + tnum | Convention | Enforced — `Price` component |
| Three button levels | Convention | Enforced — `variant` union type |
| Dropdown = ghost + chevron | Convention | Enforced — a `Dropdown` component, so chip geometry can't leak in |
| Profit tone matches its chip | Convention | Enforced — derive both from one status value, never set separately |
| One framed surface per screen | Convention | Stays convention — needs judgment |
| Iris never mixes with clay | Convention | Stays convention — a combination rule, hard to type |
| Destructive action is last, red, with consequence | Convention | Enforced — an `ActionSheet` item variant |

**Convention is fine** for rules that need judgment. What matters is knowing which is which — and never assuming prose will hold a line that code doesn't.
