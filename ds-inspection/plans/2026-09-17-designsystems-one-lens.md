# DesignSystems.one — a second reading of the system

**Status:** read 2026-09-17, mid-milestone (9/18 of *DS inspection 2026-09-15* done). No code changed. This note decides what the reading changes in the remaining items and what becomes a new issue *after* the milestone.

**Source:** [DesignSystems.one](https://www.designsystems.one) by Kiryl Zhukouski — an 8-chapter build playbook, 11 foundations, a 119-system gallery, an AI-ready hub and a five-stage maturity model. Pages read: foundations *Spacing, Typography, Color, Naming conventions, Voice & tone, Motion, Maturity model*; playbook *02 Foundations first, 03 Tokens not values, 04 Components: the right ten, 07 Governance*; the *AI-ready* hub. Not read: *Layout, Duration & easing, Principles, Accessibility*; chapters 01, 05, 06, 08; the gallery.

**Why read it now:** the second half of the work order is exactly their chapters 03/04/07 and the AI-ready checklist (S3, S6 → ch. 04; S9, S11 → ch. 07; S10 → AI-ready; S5 → ch. 03). Reading first costs an hour and can change how those items are done; reading after would mean redoing them.

---

## 1. What it confirms — keep going `[verified against main @ 35a9e94]`

| Their rule | Ours | Evidence |
|---|---|---|
| Spacing: closed scale, 4px base, ~13 values, gaps widen past 32 (`0.5 1 2 3 4 5 6 8 10 12 16 20 24`) | 12 steps `0 1 2 3 4 5 6 8 10 12 16 24` + `nudge` 2px; sizes xs…2xl; roles | `globals.css` `@theme`, `tokens.json` `space.*`, spec §1.5 |
| *"Components own padding. Layouts own gap. Margin is a last resort, mostly inside prose."* | Spec §1.5's four ownership rules, word for word the same doctrine | spec §1.5; enforcement is P4 (#25) |
| Type: eleven sizes, two families max, four weights, leading tight at the top and loose at the bottom | 11 sizes `10…56`; Lora + Plex; Plex 300/400/500/600, Lora 400/500; `figure-xl` 56/48 → `prose` 16/24 | spec §1.4, `tokens.json` `type.*`, `tokens.test.ts` |
| Tokens: W3C DTCG file in the repo, semantic over primitive, semver'd like an API | `design/tokens.json` (DTCG, aliases), parity test in CI; versioning still open | S9 (#16) |
| Colour pairs travel together (`brand` + `brand-foreground`) | `clay` + `on-clay` | S2 done (#9) |
| Colour is the third signal, never the only one | Status lives in chips with a label (*Healthy / Caution / Risky*); numbers stay ink | CLAUDE.md, spec §1.2 |
| Placeholder at 60% opacity fails AA — raise it or move the hint | Ink ladder retuned so every step clears AA at the size it's used | F1 (#6) |
| Components: count what the product uses, build the smallest superset, never pre-build | 17 in `/design`; 16 have a product consumer, `Dropdown` has none (see §4.1); Figma mirrors 9 | S3 (#10) |
| Voice: error = what failed + the fix, no apology; destructive confirm names verb + noun; no marketing voice inside the product | §4 *warnings are helpers*; *"Remove this material? The library item stays — only this line goes."* | spec §4, `ProductEditor.tsx:412` |
| AI-ready Q1 — tokens parseable without a docs site | `tokens.json` + `@theme` in the repo | — |
| AI-ready Q4 — patterns as code samples, not screenshots | `/design` renders the real components | `src/app/design` |
| AI-ready Q6 — variants as unions, not `string` | `ButtonVariant = "primary" \| "ghost" \| "link"`, `ChipTone`, `size: keyof typeof sizeClasses` | `Button.tsx:20`, `Chip.tsx:34` |
| Maturity anti-pattern: *"MCP at Managed stage"* — build it at Optimized, once tokens are stable | We have no design-system MCP server and should not build one yet | scopes S10, see §3 |

## 2. Where we differ on purpose — noted deviations, not warning lights

- **No colour ramps, no dark mode.** They want five hues × eleven OKLCH steps with semantic aliases on top. We have one accent (`clay`), one ink with an opacity ladder, status colours tuned once for chips, Iris for the assistant. That is the brand principle (*Stripe discipline*: numbers monochrome, colour only in chips and the accent), not a gap. Dark mode is not planned; if it ever is, their note stands — it is a different shape of contrast, not an inversion.
- **Type presets named by role — decided and done 2026-09-25, see §2a.** Their typography anti-pattern #4 warns against `--font-h2` / `--font-button`: a name bound to one component locks you into the markup. Six of our 24 presets are bound that way (`button`, `button-ghost`, `chip`, `nav`, `link`, `caps`), and the symptom they predict is already in the file: `button` ≡ `link` (14/20/600) and `button-ghost` ≡ `label-strong` (14/20/500) are two pairs of identical presets under different names, and `text-chip` is borrowed by two non-chips (`NeedsAttention.tsx:80`, `PriceCheck.tsx:146`) because the numbers fit. What we keep regardless: the *bundle* (size + line box + weight + tracking in one class) — that is the Figma text-style model and what ended the 28-size drift. The question is only the names of the six.
- **Body leading under 1.5.** They put reading text at 1.5–1.65. Our `body` 14/20 (1.43) is UI text, `prose` 16/24 is 1.5, and `prose-sm` 14/20 was chosen on renders for a dashboard that should recede. Line boxes on 4pt were the higher rule; a 14/24 briefing would be 1.71 and was not what she picked.
- **Governance sized for an org.** RFCs, 14-day reviews, six-month deprecation notices and a funded team are for a platform. The solo equivalents already exist: the dated decision docs in `ds-inspection/plans/` plus the `decision` label are an RFC-lite; *no token without a consumer* is deprecation by construction.

## 2a. Benchmark — how ten systems name their type styles `[verified 2026-09-17, each from its own docs]`

| System | Style names | Bundle? | A style named after a component? | What buttons use |
|---|---|---|---|---|
| **Material 3** | display / headline / title / body / **label** × large / medium / small (15 + 15 emphasized) | yes — *"each of the 30 styles has a single token that captures all the default properties"* | no | `label-large` (+ emphasized for primary actions) |
| **Carbon (IBM)** | heading-01…07, body-01/02, body-compact-01/02, **label**-01/02, helper-text, legal, code | yes | no | `body-compact-01` — *"use in expressive components, such as button and link"* (button and link share one token) |
| **Primer (GitHub)** | display, title-l/m/s, subtitle, body-l/m/s, caption, code | yes — `shorthand` tokens bundle weight, size, line height, family | no | body + weight |
| **Atlassian** | heading × 7, body × 3, **metric** × 3, code | yes | no | body + `font.weight.*` |
| **Fluent 2 (Microsoft)** | Caption 2/1, Body 1, Subtitle 2/1, Title 3/2/1, Large Title, Display — **with a weight suffix: Strong, Stronger** | yes | no | *Body 1 Strong* — Semibold 14/20, the same numbers as our `button` |
| **Polaris (Shopify)** | headingXs…3xl, bodyXs…Lg; weight is a separate prop (regular / medium / semibold / bold) | size + line height; weight apart | no | body + semibold |
| **Spectrum (Adobe)** | heading, body, detail, code × sizes | yes | no | *"Body is primarily used for Spectrum components"*; *"Bold is used … in buttons and toasts"* |
| **Apple HIG** | Large Title, Title 1–3, Headline, Body, Callout, Subheadline, Footnote, Caption 1–2 | yes | no | Body / Headline |
| **Eddie (Brad Frost)** | display / headline / title / body / **label** × lg / default / sm, code — *"presets combine font family, weight, size, line height, and optionally text-transform and letter spacing"* | yes — the same mechanism as ours | no | label / body |
| **Geist (Vercel)** | heading-72…14, label-20…12, copy-24…13, **button-16 / 14 / 12** | yes | **yes** — `button-*`, but still with a size suffix | `button-14` |
| *(DesignSystems.one itself)* | `--text-xs … 7xl` — sizes only, Tailwind's model | no | no | size + weight utilities |

Read: **bundles are the norm, not the exception** — nine of ten ship a style as one token; the size-only model is Tailwind's, and DesignSystems.one inherits it. On names, **nine of ten are category × size**, with `label` (Material, Eddie, Carbon) or `body` (Spectrum, Atlassian, Polaris) as the home of control text, and a **weight suffix** where one style needs a heavier twin (Fluent *Strong / Stronger*, Material *emphasized*). Buttons *consume* a category style; two systems say in so many words that button and link share one (Carbon, Spectrum). Geist is the one that names `button-*`.

What that means for the six: the hybrid — keep the bundle, rename by category × weight — is what Fluent and Eddie do, and it removes the two duplicate pairs:

| Now | Proposed | Precedent |
|---|---|---|
| `button`, `link` (both 14/20/600) | **`label-bold`** — one definition | Fluent *Body 1 Strong* 14/20 semibold; Carbon's shared button/link token |
| `button-ghost` (14/20/500) | **`label-strong`** — already exists, this one goes | Fluent *Strong* |
| `chip` (12/16/600) | **`meta-bold`** — beside `meta` 12/16/400 | Fluent *Caption 1 Strong* 12/16 semibold |
| `nav` (10/12/500) | `nav` stays — one consumer, no category twin at 10/500; recorded as the exception in §1.4 | Geist-style exception, documented |
| `caps`, `caps-tight` | stay — category names already (uppercase, tracked) | Spectrum *detail* |

**24 → 22 presets** (two definitions fold away; two are renames, not removals — an earlier draft of this note said 21, which was an arithmetic slip). The same pass also renamed **`meta` → `label-sm`**: once chips and the attention count wore its bold twin, `meta` (the quiet line under a name) failed the §1.8 test exactly as `chip` had, and the 12px UI family is simply the 14px one a size down. The Plex ladder now reads itself:

| | 300 | 400 | 500 | 600 |
|---|---|---|---|---|
| **14 / 20** | `body` | `label` | `label-strong` | `label-bold` |
| **12 / 16** | `body-sm` | `label-sm` | — | `label-sm-bold` |

**Done 2026-09-25.** 67 class uses across 34 files, plus `globals.css`, `tokens.json`, spec §1.4 / §1.8 / §6 and the `/design` specimen map. Verified: 50/50 tests, `tsc` clean, checker exit 0, computed styles on the detail screen unchanged for all seven Plex presets (`label` 14/20/400, `label-strong` /500, `label-bold` /600, `label-sm` 12/16/400, `label-sm-bold` /600, `body` 14/20/300, `body-sm` 12/16/300), and a pixel diff of five screens at 430px with motion frozen and the dev badge masked — dashboard, products, detail and settings **identical to the pixel**; the typography doc page differs only in its lede sentence, which was edited on purpose. **Still open: the Figma text styles keep the old names** — renamed as part of P5 (#11), which is the binding pass.

Counter-argument, kept honest: `text-button` on a Button reads by itself, and if links and buttons ever diverge in weight they split again — ten minutes under the same rule as the radii (§1.6).

## 3. What changes in the remaining items — before we do them

| Item | Change |
|---|---|
| **S9 · Version the system (#16)** | Adopt their token semver rule verbatim: **major** = a token removed or renamed, **minor** = a token added, **patch** = a value changed under the same name. Changelog assembled from PR titles; a git tag per version. *"Keep aliases one release"* is dropped — one consumer, no external teams. |
| **S11 · Human loop (#18)** | Their RFC lifecycle is *proposal → review → decision → ship → measure*. We have proposal (plan doc), decision (issue + `decision` label) and ship (PR). Missing: **measure** — the re-inspection. S11 becomes: a `decision` issue template + a dated re-inspection in the calendar, not a new process. |
| **S3 · 8 components into Figma (#10)** | *The right ten*: bring them in the order the product uses them, and only if a Figma consumer exists. FramedSurface and TintedBand first (they define the look), Input/Switch/RadioCards next; the two sheets are mostly behaviour — mirror them last, or not at all if nothing in Figma will place them. |
| **S6 · Coverage gaps (#13)** | The two missing `/design` pages (Combobox, inline-form) stay code-rendered — their Q4 says code samples, not screenshots. Confirms the first move. |
| **S10 · Agents → Figma (#17)** | Scope to Code Connect + a CLAUDE.md pointer at the Figma file. **No MCP server for the system** — their maturity model puts that at Optimized, and building it at Managed is their named anti-pattern. |
| **S5 · Sync re-run + parity (#12)** | Their model is a Tokens Studio round-trip; ours is one-way, code → Figma by script, with the parity test as the check. For one person one-way is enough — write that down as the decision inside S5 so nobody later "fixes" it into a round-trip. |
| **P4 · Rhythm owners (#25)** | Confirmed word for word. Nothing changes. |

## 4. New gaps — outside this milestone

Each becomes an issue with the `design-system` label and **no milestone**, so the current one stays 18 items. Ordered by how cheap it is against how much it fixes.

1. **One library component has no consumer — and its job is done by hand twice.** `[verified]` `Dropdown.tsx` is imported by nothing outside `/design` (it is a static trigger; *"the menu itself comes with behaviour later"*). Meanwhile `StatusFilter.tsx:41` and `TypeFilter.tsx:37` spell out the same trigger classes by hand (`rounded-button border bg-transparent px-3 py-2 text-button-ghost …`) and drive a Drawer. That is their *"aspirational components rot"* and the drift they warn about, in one place: three copies of one trigger, one of them in the library. The docblock also still says *"Radius is 7px"* (it is `rounded-button` 8 since #29). *Fix:* the two filters render `<Dropdown filtered>` as their `DrawerTrigger`, the docblock is corrected — the library gains its consumer and the copies go. Small; could ride with S6.
2. **Motion has no foundation.** `[verified]` Spec §1 has no motion section. The product ships five durations and four easings, none named: 150ms (Tailwind's default `transition` on the chevrons and the switch), 200ms `settle` (`globals.css:228`, pricing chip), 300ms `ease-out` (`Collapse.tsx:18`), 500ms `cubic-bezier(.32,.72,0,1)` (the sheets, vaul's default), 650ms easeOutCubic (`HeroProfit.tsx:46`, the count-up). Reduced motion is honoured in three of five places (settle, Collapse, count-up); the chevrons and switch don't need it, the sheets rely on vaul. Also: the drawer overlay carries `animate-in fade-in-0 animate-out fade-out-0` (`ui/drawer.tsx:40`) — shadcn boilerplate that needs `tw-animate-css`, which isn't installed, so Tailwind v4 compiles them to nothing; vaul's own fade does the work. Dead classes, harmless, misleading.
   *Their shape:* duration tiers + easing tokens are the foundation; animations are component decisions; every pattern documented by name, duration, easing and where it's used; a global reduced-motion floor in the stylesheet. *Proposal:* three durations (`quick` 150 · `base` 300 · `slow` 650 — the settle folds into quick or base after a render check, the sheet stays vaul's 500 or moves to `slow`), one or two easings, a §1.7 in the spec with the five named patterns (settle, reveal, count-up, sheet slide, glint pulse), and the checker's eye widened to `duration-[…]` / `animate-[…]`. Small.
3. **Voice has rules but no named voice.** Their *three attributes, each with its opposite* (Mailchimp's this-not-that) is what §4 is missing: the say/not table and the reserved phrasings are rules, the attributes are what a writer reasons from. A first draft to argue with: *Plain, not financial · Calm, not alarming · Specific, not generic*. Would also give the two open advisories a frame (the em-dash rule's breadth; *Direct cost* at `ProductEditor.tsx:750`). One spec paragraph plus the `/design` voice page.
4. **Run their maturity diagnostic at the re-inspection** — nine yes/no questions, scored per dimension, never as one number. Today's honest reading: **tokens** Defined (W3C JSON, parity test, checker in CI) · **Figma** Managed (one-way mirror, 9/17 components) · **components** Managed→Defined (no version) · **docs** Defined (`/design`). *The lowest dimension caps the system*: Managed today, Defined once S3, S5 and S9 land. Their Managed→Defined moves map onto the milestone one to one, except *"adoption metric on the quarterly review"*, which for one person is *checker green + parity green + a dated re-inspection*.
5. **Layout foundation** — the app is one column at 430px by design; breakpoints appear in 19 places, all in `/design` and the drawer, none on a product screen. No grid, container or breakpoint is documented. Not needed until a wider viewport is designed; note it so the first `md:` on a product screen triggers the conversation.
6. **Accessibility in CI** (axe / Lighthouse gates) — their Defined→Optimized move. Station 3 went from red to fixed by hand (F1); an automated gate is the next step, but after the milestone.

## 5. Glossary — the words on that site, plainly

- **Playbook** — their 90-day recipe: decide → foundations → tokens → components → patterns → distribution → governance → measurement. We entered at "foundations" with a product already built, which is their *migrate* path.
- **Foundations** — the decisions locked before any component: colour, type, spacing, motion, plus how the system is used (principles, accessibility, voice, naming). Ours are §1 of the spec; motion is the one we don't have.
- **Primitive / semantic / component tokens** — raw value (`blue-600`), the job it does (`brand`), where it lives (`button-bg`). Components ask for the middle layer. Our spacing has all three tiers; colour is two (value + `on-clay` / shadcn bridge); radii and type presets are named by job on purpose.
- **W3C Design Tokens (DTCG)** — the JSON shape (`$value`, `$type`, `$description`) tools agree on. `design/tokens.json` is in it. **Tokens Studio** (Figma plugin) and **Style Dictionary** (build tool) are the two things that read it; we use neither — a script and a parity test instead.
- **Semver** — version numbers as a promise: *major* breaks you, *minor* adds, *patch* fixes. S9.
- **RFC** — a written proposal reviewed before code. Our plan docs + `decision` issues.
- **Deprecation** — retiring something with warning and a path off it. Solo: *no token without a consumer*.
- **MCP server** — a small service an editor's agent can query ("list tokens", "find component") instead of guessing from a docs URL. We use MCP to *reach Figma and Mobbin*; our system does not *serve* one, and shouldn't yet.
- **Discriminated union** — a TypeScript type that lists the allowed values (`"primary" | "ghost" | "link"`), so a wrong one is a type error, not a silent no-op. Ours are.
- **Registry** — shadcn's way of shipping components as files you copy into your repo. Not ours.
- **Maturity model** — five stages (ad hoc → managed → defined → optimized → adaptive), scored per part of the system, re-scored each quarter. A dashboard, not a certificate.
- **Density** — one scale, three "modes" (compact / comfortable / spacious) that change which steps components reach for. Ours is single-density; `tap` 44 and `row-height` 64 sit at their *comfortable*.
- **Measure** — line length in characters; 45–75 is readable. A 430px column at Plex 14 is ~55ch, inside the band without a rule.
- **OKLCH / APCA** — a colour space where equal steps look equal, and a newer contrast formula that scores by size and weight. Neither needed for a one-accent system; APCA is worth a look if the ink ladder is ever retuned again.
- **Reduced motion** — the OS setting "don't move things at me"; a stylesheet floor honours it for every component at once.
- **Choreography** — when several things move, one leads and the rest follow at lower amplitude. Our sheets and the count-up are single-element; no choreography to document yet.

## 6. Next

1. `commit na main` for this note (ds-inspection only).
2. `issues` — six new issues from §4 (label `design-system`, no milestone; the motion one also gets `decision`, because the duration values need a render check first), plus one `decision` issue for the §2a rename if she says yes.
3. Apply §3 as each remaining item is started — the changes are recorded on the item's issue when it's picked up, not now.
