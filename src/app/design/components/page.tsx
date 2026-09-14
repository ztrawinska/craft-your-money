/**
 * /design/components: every built component, rendered from its real source in
 * every state it has, in atomic order (atoms → molecules → sheets and chrome).
 * Each entry: the specimens, the props as the file declares them, the two or
 * three rules that decide its use, what it is built on, and where it lives.
 * Screen-level pieces that need product state are listed, not demoed.
 */
import { ChevronLeft, ChevronRight, Plus, RotateCcw } from "lucide-react";
import { AssistantSlot } from "@/components/AssistantSlot";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Dropdown } from "@/components/Dropdown";
import { FramedSurface } from "@/components/FramedSurface";
import { Glint } from "@/components/Glint";
import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { SectionLabel } from "@/components/SectionLabel";
import { TintedBand } from "@/components/TintedBand";
import { Input } from "@/components/ui/input";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { BuiltOn, GroupLabel, Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { repo, shadcn } from "@/components/design-docs/links";
import { ActionSheetDemo } from "@/components/design-docs/demos/ActionSheetDemo";
import { CollapseDemo } from "@/components/design-docs/demos/CollapseDemo";
import { IrisSheetDemo } from "@/components/design-docs/demos/IrisSheetDemo";
import { MoneyInputDemo } from "@/components/design-docs/demos/MoneyInputDemo";
import { RadioCardsDemo } from "@/components/design-docs/demos/RadioCardsDemo";
import { SwitchDemo } from "@/components/design-docs/demos/SwitchDemo";
import { statusChip, type ChipTone, type ProductStatusInput } from "@/lib/status";

const link =
  "text-clay-deep underline decoration-clay/50 decoration-dotted underline-offset-4";

const GROUPS: { name: string; items: [string, string][] }[] = [
  {
    name: "Atoms",
    items: [
      ["glint", "Glint"],
      ["chip", "Chip"],
      ["button", "Button"],
      ["price", "Price"],
      ["section-label", "SectionLabel"],
      ["input", "Input · MoneyInput"],
      ["switch", "Switch"],
      ["dropdown", "Dropdown"],
    ],
  },
  {
    name: "Molecules",
    items: [
      ["radio-cards", "RadioCards"],
      ["tinted-band", "TintedBand"],
      ["framed-surface", "FramedSurface"],
      ["list-row", "ListRow"],
      ["collapse", "Collapse"],
      ["assistant-slot", "AssistantSlot"],
    ],
  },
  {
    name: "Sheets and chrome",
    items: [
      ["action-sheet", "ActionSheet"],
      ["iris-sheet", "IrisSheet"],
      ["bottom-nav", "BottomNav"],
    ],
  },
  { name: "Screen-level", items: [["screens", "See it in the app"]] },
];

/** A product's chip, straight from the status model (never hand-typed). */
function chipFor(input: ProductStatusInput) {
  return statusChip(input);
}

/** The overview row's right slot: price leads, the chip is its caption. */
function ProductSlot({ price, input }: { price: number | null; input: ProductStatusInput }) {
  const chip = chipFor(input);
  return (
    <div className="flex flex-col items-end gap-1.5">
      {price !== null && (
        <span className="font-serif text-[16px] font-medium leading-none tabular-nums text-ink">
          <Price value={price} variant="inline" />
        </span>
      )}
      <Chip tone={chip.tone} size={price !== null ? "sm" : "default"}>
        {chip.label}
      </Chip>
    </div>
  );
}

const ACTIVE = (marginPct: number): ProductStatusInput => ({
  workflow: "active",
  hasPrice: true,
  marginPct,
});

function GroupHeading({ children }: { children: string }) {
  return (
    <p className="mt-14 border-t border-ink/14 pt-3 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/42 first:mt-0 first:border-t-0 first:pt-0">
      {children}
    </p>
  );
}

const TONES: { tone: ChipTone; label: string }[] = [
  { tone: "positive", label: "Healthy · 64%" },
  { tone: "caution", label: "Caution · 22%" },
  { tone: "critical", label: "Risky · 8%" },
  { tone: "neutral", label: "No price" },
  { tone: "inactive", label: "Draft" },
];

export default function ComponentsPage() {
  return (
    <>
      <p className="mb-2 max-w-[62ch] font-serif text-[19px] leading-[1.5] text-ink">
        Seventeen components, each shown from its real source. If it looks right here, it looks
        right in the app.
      </p>
      <p className="mb-6 max-w-[62ch] font-sans text-[13.5px] font-light leading-[1.6] text-ink/70">
        Specimens sit in a 430px frame, the width of the app. The dashed frame is a documentation
        device, not a surface. Props are copied from the file&rsquo;s own type; the reasoning is in
        the linked section of the design-system doc.
      </p>

      <nav aria-label="Components on this page" className="mb-4 flex flex-wrap gap-x-8 gap-y-3">
        {GROUPS.map((g) => (
          <div key={g.name} className="font-sans">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/42">
              {g.name}
            </p>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
              {g.items.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className={link}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ───────────────────────────── ATOMS ───────────────────────────── */}
      <GroupHeading>Atoms</GroupHeading>

      <DocSection
        id="glint"
        title="Glint"
        spec="§2.9"
        source="src/components/Glint.tsx"
        lede="The iris mark. The one glyph that means a model is involved, drawn from a single path so every iris surface shows the exact same shape."
      >
        <SpecimenRow>
          <Specimen label="15px, in the assistant slot">
            <Glint className="h-[15px] w-[15px]" />
          </Specimen>
          <Specimen label="24px, in a sheet header">
            <Glint className="h-6 w-6" />
          </Specimen>
        </SpecimenRow>
        <PropsTable rows={[{ name: "className", type: "string", default: '""', meaning: "Size it with h-/w- utilities; the fill is always iris." }]} />
        <Rules
          items={[
            "Never without a model genuinely behind it. Deterministic features (the materials library) use a neutral diamond, not the glint.",
            "Never on the same element as clay. Never next to a status colour.",
          ]}
        />
      </DocSection>

      <DocSection
        id="chip"
        title="Chip"
        spec="§2.1"
        source={["src/components/Chip.tsx", "src/lib/status.ts"]}
        lede="The only way to show status. Callers choose a meaning, not a colour; the mapping from meaning to colour lives in one place."
      >
        <GroupLabel>Five tones · default size</GroupLabel>
        <SpecimenRow>
          {TONES.map((t) => (
            <Specimen key={t.tone} label={`tone="${t.tone}"`} inline>
              <Chip tone={t.tone}>{t.label}</Chip>
            </Specimen>
          ))}
        </SpecimenRow>
        <GroupLabel>sm · inline in dense text</GroupLabel>
        <SpecimenRow>
          {TONES.map((t) => (
            <Specimen key={t.tone} label={`tone="${t.tone}" size="sm"`} inline>
              <Chip tone={t.tone} size="sm">
                {t.label}
              </Chip>
            </Specimen>
          ))}
        </SpecimenRow>
        <GroupLabel>Labels come from the status model, not from screens</GroupLabel>
        <SpecimenRow>
          {[
            { workflow: "active", hasPrice: true, marginPct: 0.64 },
            { workflow: "active", hasPrice: false, marginPct: null },
            { workflow: "draft", hasPrice: true, marginPct: 0.52 },
            { workflow: "draft", hasPrice: false, marginPct: null },
          ].map((input) => {
            const c = chipFor(input as ProductStatusInput);
            return (
              <Specimen
                key={JSON.stringify(input)}
                label={`statusChip({ ${input.workflow}, ${input.hasPrice ? `margin ${Math.round((input.marginPct ?? 0) * 100)}%` : "no price"} })`}
                inline
              >
                <Chip tone={c.tone}>{c.label}</Chip>
              </Specimen>
            );
          })}
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "tone", type: '"positive" | "caution" | "critical" | "neutral" | "inactive"', default: '"neutral"', meaning: "The meaning. Filled tones are a verdict on a live product; inactive (outlined) means the product sits outside the live range." },
            { name: "size", type: '"default" | "sm"', default: '"default"', meaning: "sm only for a chip sitting inline in dense text." },
            { name: "children", type: "ReactNode", meaning: "Label and margin as one unit: Healthy · 64%." },
          ]}
        />
        <Rules
          items={[
            "Label and margin merge into one chip. Never a badge beside a coloured number.",
            "No price is neutral, not a status colour: a missing input, not a health judgment.",
            "Never invent a tone for a one-off. A new meaning goes into the ChipTone union first.",
          ]}
        />
      </DocSection>

      <DocSection
        id="button"
        title="Button"
        spec="§2.3"
        source="src/components/Button.tsx"
        lede="Three levels, named by role. A screen has at most one primary. Row-level actions are always link: a boxed button in a list would compete with the one framed surface."
      >
        <SpecimenRow>
          <Specimen label='variant="primary" · the one main action'>
            <Button variant="primary">Save and activate</Button>
          </Specimen>
          <Specimen label='variant="ghost" · beside a primary'>
            <Button variant="ghost">Save draft</Button>
          </Specimen>
          <Specimen label='variant="primary" disabled'>
            <Button variant="primary" disabled className="opacity-55">
              Save and activate
            </Button>
          </Specimen>
        </SpecimenRow>
        <GroupLabel>link · icon position carries meaning</GroupLabel>
        <SpecimenRow>
          <Specimen label="navigates → trailing chevron" inline>
            <Button variant="link" className="text-[13.5px] font-semibold" iconTrailing={<ChevronRight size={15} strokeWidth={2} />}>
              Reprice
            </Button>
          </Specimen>
          <Specimen label="acts in place → leading action icon" inline>
            <Button variant="link" className="text-[13.5px] font-semibold" iconLeading={<Plus size={14} strokeWidth={2.2} />}>
              Add material
            </Button>
          </Specimen>
          <Specimen label="acts in place → rotate-ccw, not archive-restore" inline>
            <Button variant="link" className="text-[13.5px] font-semibold" iconLeading={<RotateCcw size={13} strokeWidth={2.2} />}>
              Restore
            </Button>
          </Specimen>
          <Specimen label="back · mirror of navigate, 44px target" inline>
            <span className="-ml-3 inline-flex size-11 items-center justify-center text-ink/55">
              <ChevronLeft size={22} strokeWidth={1.8} />
            </span>
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "variant", type: '"primary" | "ghost" | "link"', default: '"link"', meaning: "The level. There is deliberately no fourth." },
            { name: "iconLeading", type: "ReactNode", meaning: "For actions that happen in place (+ Add material)." },
            { name: "iconTrailing", type: "ReactNode", meaning: "A chevron: a promise that something opens." },
            { name: "href", type: "string", meaning: "When set, renders as a Link. Same look, right semantics." },
            { name: "onClick · disabled · type", type: "…", meaning: "Plain button props. type is ignored when href is set." },
            { name: "className", type: "string", meaning: "link carries no fixed size; the caller sets it for its context." },
          ]}
        />
        <Rules
          items={[
            "A trailing chevron on an action that completes in place is a lie about what the tap does.",
            "The soft-filled fourth level (clay wash + outline) was built, tested and rejected.",
          ]}
        />
      </DocSection>

      <DocSection
        id="price"
        title="Price"
        spec="§2.2"
        source="src/components/Price.tsx"
        lede="The only way money appears. It guarantees Lora, tabular numerals and monochrome ink; callers only choose a variant. The currency comes from the account settings."
      >
        <SpecimenRow>
          <Specimen label='variant="primary" · your price'>
            <Price value={42.6} variant="primary" />
          </Specimen>
          <Specimen label='variant="hero" · dashboard profit'>
            <Price value={12.85} variant="hero" />
          </Specimen>
        </SpecimenRow>
        <SpecimenRow>
          <Specimen label='variant="figure" · a total' inline>
            <Price value={14.06} variant="figure" />
          </Specimen>
          <Specimen label='variant="calc" · the suggestion' inline>
            <Price value={40.17} variant="calc" />
          </Specimen>
          <Specimen label='variant="inline" · a row value' inline>
            <Price value={2.48} variant="inline" />
          </Specimen>
          <Specimen label='variant="summary"' inline>
            <Price value={2.74} variant="summary" />
          </Specimen>
          <Specimen label='variant="sectionTotal"' inline>
            <Price value={9.96} variant="sectionTotal" />
          </Specimen>
        </SpecimenRow>
        <GroupLabel>profit · the one figure that takes its chip&rsquo;s tone</GroupLabel>
        <SpecimenRow>
          {(["positive", "caution", "critical"] as const).map((tone) => {
            const margin = { positive: 0.52, caution: 0.22, critical: 0.08 }[tone];
            const c = chipFor(ACTIVE(margin));
            return (
              <Specimen key={tone} label={`variant="profit" tone="${tone}"`}>
                <div className="flex items-center justify-between gap-2.5">
                  <Price value={{ positive: 18.2, caution: 6.4, critical: 2.1 }[tone]} variant="profit" tone={tone} />
                  <Chip tone={c.tone}>{c.label}</Chip>
                </div>
              </Specimen>
            );
          })}
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "value", type: "number", meaning: "The amount, gross." },
            { name: "variant", type: '"primary" | "hero" | "figure" | "inline" | "calc" | "sectionTotal" | "summary" | "profit"', default: '"inline"', meaning: "Which role the figure plays; the size, weight and opacity follow." },
            { name: "tone", type: '"positive" | "caution" | "critical"', meaning: "Only read by the profit variant. Neutral and inactive can never colour a number: the type excludes them." },
          ]}
        />
        <Rules
          items={[
            "Costs and prices are always ink. Only the profit takes its chip's tone, and only so the two can never disagree.",
            "Not green-when-positive: a £4 profit at 9% is a green number beside a red chip, two contradictory stories.",
            "The primary price splits its decimals down so the eye lands on pounds.",
          ]}
        />
      </DocSection>

      <DocSection
        id="section-label"
        title="SectionLabel"
        spec="§2.5"
        source="src/components/SectionLabel.tsx"
        lede="The quiet caps label that organises a screen, with an optional total on the same baseline. Small size and wide tracking: it recedes while still labelling."
      >
        <SpecimenRow>
          <Specimen label="label only">
            <SectionLabel>Materials</SectionLabel>
          </Specimen>
          <Specimen label="with total (a Price sectionTotal)">
            <SectionLabel total={<Price value={9.96} variant="sectionTotal" />}>Materials</SectionLabel>
            <ListRow label="Sterling silver sheet" meta="4g × £0.62/g" value={<Price value={2.48} />} />
            <ListRow label="Sapphire (3mm)" meta="1 × £38.00" value={<Price value={38} />} />
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "children", type: "ReactNode", meaning: "The label. Rendered in caps at 10px with 0.2em tracking." },
            { name: "total", type: "ReactNode", meaning: "Right-aligned on the same baseline. Usually a Price, so this never formats money itself." },
          ]}
        />
      </DocSection>

      <DocSection
        id="input"
        title="Input · FieldLabel · MoneyInput"
        spec="§2.12 · §2.13"
        source={["src/components/ui/input.tsx", "src/components/inline-form.tsx", "src/lib/money-input.ts"]}
        lede="One field look, on shadcn's Input. Every money field is a right-to-left cents accumulator: digits only, the pennies always the last two, the decimal point painted on. Not typed, not strandable."
      >
        <SpecimenRow>
          <Specimen label="Input · empty, with value, disabled">
            <div className="flex flex-col gap-3">
              <Input placeholder="Sterling silver sheet" />
              <Input defaultValue="Sterling silver sheet" />
              <Input defaultValue="Can't edit this" disabled />
            </div>
          </Specimen>
          <Specimen label="MoneyInput · live · type digits">
            <MoneyInputDemo />
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "Input", type: 'ComponentProps<"input">', meaning: "The shadcn primitive, re-skinned: page background, ink/14 border, clay focus ring, 16px text (stops iOS zoom)." },
            { name: "MoneyInput.value", type: "string", meaning: 'The amount as text, "12.50". Empty when all zeros.' },
            { name: "MoneyInput.onChange", type: "(v: string) => void", meaning: "Fires with the accumulated amount on every keystroke." },
            { name: "FieldLabel", type: "children", meaning: "The 9px caps label above a field." },
          ]}
        />
        <BuiltOn name="Input" href={shadcn("input")} note="A plain input has no behaviour for a library to add; this is simply the one place the field's look lives." />
        <Rules
          items={[
            "Keypad is numeric, not decimal: there is no separator key because you never type a separator.",
            "The caret is pinned to the right even after a tap in the middle, so entry always builds from the right.",
            "Quantity and minutes are not money: they take real decimals and stay plain fields.",
          ]}
        />
      </DocSection>

      <DocSection
        id="switch"
        title="Switch"
        source="src/components/ui/switch.tsx"
        lede="A two-state toggle. A shadcn/Radix primitive under the hood, so keyboard control and ARIA come for free; re-skinned pixel-for-pixel to the old hand-built look."
      >
        <SpecimenRow>
          <Specimen label="checked · unchecked (live)">
            <SwitchDemo />
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "checked", type: "boolean", meaning: "Controlled state." },
            { name: "onCheckedChange", type: "(checked: boolean) => void", meaning: "Radix API: not onChange." },
            { name: "aria-label", type: "string", meaning: "Or a linked <label>. The control needs a name." },
          ]}
        />
        <BuiltOn name="Switch" href={shadcn("switch")} note="clay-deep when on, ink/14 when off, a flat knob with no shadow. The accent sits on the control because the toggle is an action." />
      </DocSection>

      <DocSection
        id="dropdown"
        title="Dropdown"
        spec="§2.4"
        source={["src/components/Dropdown.tsx", "src/components/StatusFilter.tsx"]}
        lede="A filter or select trigger. Not a new control level: it is the ghost button plus a chevron. The menu it opens is a bottom sheet, never a floating list."
      >
        <SpecimenRow>
          <Specimen label="default · filtered" inline>
            <div className="flex gap-2">
              <Dropdown>All statuses</Dropdown>
              <Dropdown filtered>Below target</Dropdown>
            </div>
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "children", type: "ReactNode", meaning: "The current value, or the filter's name when nothing is set." },
            { name: "filtered", type: "boolean", default: "false", meaning: "Has-a-value state: label and border turn clay, a faint clay wash behind." },
          ]}
        />
        <Rules
          items={[
            "Background stays transparent. A white fill would create a new surface on a flat page.",
            "Radius is 7px, never 100px: that geometry belongs to chips and means status.",
            "Filters are dropdowns; sort is not. Sort is a bare arrow-up-down icon at the right of the row.",
          ]}
        />
      </DocSection>

      {/* ─────────────────────────── MOLECULES ─────────────────────────── */}
      <GroupHeading>Molecules</GroupHeading>

      <DocSection
        id="radio-cards"
        title="RadioCards"
        source="src/components/RadioCards.tsx"
        lede="A small set of rich, mutually exclusive options, each with a title and a line of explanation. Real radios underneath, so it reads to a screen reader as one group."
      >
        <SpecimenRow>
          <Specimen label="two options · one selected (live)">
            <RadioCardsDemo />
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "name", type: "string", meaning: "The radio group name." },
            { name: "options", type: "{ value, title, description }[]", meaning: "The choices." },
            { name: "value · onChange", type: "string · (value) => void", meaning: "Controlled selection." },
          ]}
        />
        <Rules items={["The selected card wears clay (border and wash); the rest are plain outlines. Two or three options, not a list."]} />
      </DocSection>

      <DocSection
        id="tinted-band"
        title="TintedBand"
        spec="§2.8"
        source="src/components/TintedBand.tsx"
        lede="Quiet emphasis for briefings and insight strips. Ink at 3.5%: deliberately lighter than a cream fill, which read as shouting."
      >
        <SpecimenRow>
          <Specimen label="a briefing paragraph">
            <TintedBand>
              <p className="font-sans text-[15px] font-light leading-[1.7] text-ink/70">
                Most of your range earns well. The Thalia stacking set is priced under what it
                costs to make, and two rings sit just below target.
              </p>
            </TintedBand>
          </Specimen>
        </SpecimenRow>
        <PropsTable rows={[{ name: "children", type: "ReactNode", meaning: "Prose. Never numbers-as-heroes." }, { name: "className", type: "string", meaning: "Margins, from the caller." }]} />
        <Rules items={["If the band draws the eye before its content does, it is too strong."]} />
      </DocSection>

      <DocSection
        id="framed-surface"
        title="FramedSurface"
        spec="§2.7"
        source={["src/components/FramedSurface.tsx", "src/components/PricingPanel.tsx"]}
        lede="The one enclosed area allowed per screen: where the decision happens. A near-white sheet with a torn top edge, cut out of the card so the real page shows through. No border, no shadow."
      >
        <SpecimenRow>
          <Specimen label="the pricing block, static excerpt" flush>
            <div className="bg-page px-0 pb-6 pt-4">
              <FramedSurface className="mx-6 px-6 pb-5 pt-[22px] font-sans">
                <div className="mb-[18px] flex items-center justify-between gap-2.5 border-b border-ink/7 pb-[18px]">
                  <div>
                    <p className="text-[12.5px] text-clay-deep">Calculated price</p>
                    <p className="mt-0.5 text-[11px] font-light text-ink/42">30% target</p>
                  </div>
                  <Price value={40.17} variant="calc" />
                </div>
                <p className="mb-2 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                  Your price
                </p>
                <div className="mb-5">
                  <Price value={42.6} variant="primary" />
                </div>
                <div className="border-t border-ink/7 pt-[18px]">
                  <p className="mb-2 text-[12px] text-ink/55">Profit per piece, after all costs</p>
                  <div className="flex items-center justify-between gap-2.5">
                    <Price value={18.2} variant="profit" tone="positive" />
                    <Chip tone="positive">{chipFor(ACTIVE(0.52)).label}</Chip>
                  </div>
                </div>
                <AssistantSlot centered className="mt-5">
                  Check this price
                </AssistantSlot>
              </FramedSurface>
            </div>
          </Specimen>
        </SpecimenRow>
        <PropsTable rows={[{ name: "children", type: "ReactNode", meaning: "The block. Padding is left to the caller." }, { name: "className", type: "string", meaning: "Margins and padding." }]} />
        <Rules
          items={[
            "If a second one appears on a screen, one of them is wrong. Reach for a hairline instead.",
            "The component doesn't stop you rendering two; that stays a judgment call (§6), a convention.",
            "Internal sections divide with ink/7 hairlines. The last word is the profit.",
          ]}
        />
      </DocSection>

      <DocSection
        id="list-row"
        title="ListRow"
        spec="§2.6"
        source={["src/components/ListRow.tsx", "src/app/products/page.tsx"]}
        lede="The workhorse: two lines, an optional inset stripe, a right slot. Rows separate by rhythm and the stripe, not by hairlines. Muting dims the content, never the action."
      >
        <GroupLabel>emphasis=&quot;product&quot; · the overview · stripe follows the chip</GroupLabel>
        <SpecimenRow>
          <Specimen label="risky · caution · healthy · no price · draft · archived" flush>
            <ListRow emphasis="product" stripe="risky" label="Thalia stacking set" meta="Stacking rings" value={<ProductSlot price={24} input={ACTIVE(0.08)} />} />
            <ListRow emphasis="product" stripe="caution" label="Hera signet" meta="Ring" value={<ProductSlot price={58} input={ACTIVE(0.22)} />} />
            <ListRow emphasis="product" stripe="healthy" label="Selene hammered band" meta="Ring" value={<ProductSlot price={42.6} input={ACTIVE(0.64)} />} />
            <ListRow emphasis="product" stripe={null} label="Artemis crescent studs" meta="Earrings" value={<ProductSlot price={null} input={{ workflow: "active", hasPrice: false, marginPct: null }} />} />
            <ListRow emphasis="product" muted label="Nyx moonstone pendant" meta="Pendant" value={<ProductSlot price={68} input={{ workflow: "draft", hasPrice: true, marginPct: 0.52 }} />} />
            <ListRow
              emphasis="product"
              muted
              label="Iris twisted pendant"
              meta="archived"
              value={
                <Button variant="link" className="text-[13.5px] font-semibold" iconLeading={<RotateCcw size={13} strokeWidth={2.2} />}>
                  Restore
                </Button>
              }
            />
          </Specimen>
        </SpecimenRow>
        <GroupLabel>emphasis=&quot;line&quot; · a cost line on the detail</GroupLabel>
        <SpecimenRow>
          <Specimen label="plain · from the library (diamond)">
            <ListRow label="Sterling silver sheet" meta="4g × £0.62/g" value={<Price value={2.48} />} />
            <ListRow label="Sapphire (3mm)" meta="1 × £38.00" library value={<Price value={38} />} />
            <ListRow label="Polishing" meta="20 min · £15/hr" value={<Price value={5} />} />
          </Specimen>
          <Specimen label='stripe="neutral" · dashboard attention list'>
            <ListRow emphasis="product" stripe="neutral" label="Artemis crescent studs" meta={<>Earrings · <Chip tone="neutral" size="sm">No price</Chip></>} value={<Button variant="link" className="text-[13.5px] font-semibold" iconTrailing={<ChevronRight size={15} strokeWidth={2} />}>Set price</Button>} />
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "label", type: "string", meaning: "Primary line. Lora for a product, Plex for a cost line." },
            { name: "meta", type: "ReactNode", meaning: "The quiet second voice: the category, or the arithmetic (4g × £0.62/g)." },
            { name: "value", type: "ReactNode", meaning: "Right slot: a price, a chip, a verb-link, a price-with-chip." },
            { name: "emphasis", type: '"line" | "product"', default: '"line"', meaning: "Cost line, or a product with a stripe and a 64px row." },
            { name: "stripe", type: '"risky" | "caution" | "healthy" | "neutral" | null', default: "null", meaning: "The inset urgency bar. Red full, amber 55%, green 38%; neutral only on the dashboard attention list." },
            { name: "muted", type: "boolean", default: "false", meaning: "Draft or archived: name and meta recede, the slot stays full strength." },
            { name: "library", type: "boolean", default: "false", meaning: "A value pulled from the materials library: a neutral diamond, not the glint." },
            { name: "href", type: "string", meaning: "The whole row becomes a link." },
          ]}
        />
        <Rules
          items={[
            "Price leads in the overview slot; the chip is its caption. Margin is not repeated in the row: the chip already carries it.",
            "No rule between rows. Lines return only between larger sections.",
            "Dimming the whole row would make a live action look disabled. Dim the content only.",
          ]}
        />
      </DocSection>

      <DocSection
        id="collapse"
        title="Collapse · the reveal toggle"
        spec="§2.14"
        source={["src/components/Collapse.tsx", "src/components/BenchmarkSection.tsx"]}
        lede="Tap to see the numbers behind this figure. An inline chevron link with a dotted clay underline, opening a Collapse that eases height and opacity together. Optional depth, not structure."
      >
        <SpecimenRow>
          <Specimen label="closed → open (live)">
            <CollapseDemo />
          </Specimen>
        </SpecimenRow>
        <PropsTable rows={[{ name: "open", type: "boolean", meaning: "Grid rows 0fr → 1fr, so the browser interpolates the height. No measuring." }, { name: "children", type: "ReactNode", meaning: "Inert while closed, so it leaves the tab order." }]} />
        <Rules items={["Clay because it is a link. Not a full-width grey section header: that reads as structure.", "Motion is dropped under prefers-reduced-motion; the reveal is instant, never absent."]} />
      </DocSection>

      <DocSection
        id="assistant-slot"
        title="AssistantSlot"
        spec="§2.9"
        source="src/components/AssistantSlot.tsx"
        lede="The iris entry point: the button you tap to open the iris sheet. Every AI interaction uses this same pair, slot and sheet, so the assistant always arrives the same way."
      >
        <SpecimenRow>
          <Specimen label="with a trailing chevron · dashboard">
            <AssistantSlot>Talk to your pricing coach</AssistantSlot>
          </Specimen>
          <Specimen label="centered · pricing block">
            <AssistantSlot centered>Check this price</AssistantSlot>
          </Specimen>
          <Specimen label="disabled · no price to check yet">
            <AssistantSlot centered disabled>
              Check this price
            </AssistantSlot>
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "children", type: "ReactNode", meaning: "The label, in iris-deep." },
            { name: "centered", type: "boolean", default: "false", meaning: "Centered with no chevron, for the pricing block." },
            { name: "…button props", type: 'ButtonHTMLAttributes', meaning: "Forwards its ref, so it drops straight into a DrawerTrigger asChild." },
          ]}
        />
        <Rules items={["1px iris border at 30%, iris at 6% behind, 8px radius. The glint at 15px.", "It is always a button: every iris interaction opens a sheet."]} />
      </DocSection>

      {/* ──────────────────────── SHEETS AND CHROME ─────────────────────── */}
      <GroupHeading>Sheets and chrome</GroupHeading>

      <DocSection
        id="action-sheet"
        title="ActionSheet"
        spec="§2.11"
        source={["src/components/ActionSheet.tsx", "src/components/ui/drawer.tsx"]}
        lede="The ⋯ menu. A bottom sheet, not a floating popover: page background, a grab handle, full-width 44px rows. Constructive actions together, one hairline, then the destructive one, last and red, with its consequence stated."
      >
        <SpecimenRow>
          <Specimen label="tap ⋯ · Delete opens an inline confirm (live)">
            <ActionSheetDemo />
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "open · onClose", type: "boolean · () => void", meaning: "Controlled by the caller." },
            { name: "actions", type: "SheetAction[]", meaning: "id, label, icon, optional sublabel (the consequence), danger, onSelect." },
            { name: "actions[].confirm", type: "{ title, body, confirmLabel }", meaning: "When set, the sheet's content swaps to an inline confirm. Never a modal on a modal." },
          ]}
        />
        <BuiltOn name="Drawer" href={shadcn("drawer")} note="vaul supplies focus-trap, Escape, drag-to-dismiss and scroll-lock; the anatomy and rules are enforced by the styling, not the library. The filters share this one primitive, which is why nothing in the app floats." />
        <Rules items={["A destructive confirm names the object, says it is permanent, and points at the gentler alternative.", "Cancel is a full-width ghost button set off by a gap, not another row with a hairline."]} />
      </DocSection>

      <DocSection
        id="iris-sheet"
        title="IrisSheet"
        spec="§2.9"
        source={["src/components/IrisSheet.tsx", "src/components/PriceCheck.tsx"]}
        lede="The one surface every AI interaction opens into. A neutral drawer, same family as the action sheet: iris is carried by its contents, never by the surface. Iris appears on exactly four things: the glint, the label, the finding numerals, the follow-up chips."
      >
        <SpecimenRow>
          <Specimen label="a sample Price Check body (live)">
            <IrisSheetDemo />
          </Specimen>
        </SpecimenRow>
        <PropsTable
          rows={[
            { name: "label", type: "string", meaning: 'Header label beside the glint: "Price check", "Pricing coach".' },
            { name: "trigger", type: "ReactNode", meaning: "The entry point (an AssistantSlot); becomes the sheet trigger." },
            { name: "children", type: "ReactNode", meaning: "The body. The caller owns it." },
            { name: "open · onOpenChange", type: "boolean · (open) => void", meaning: "Optional control, so a fetch can fire on open." },
            { name: "busy", type: "boolean", default: "false", meaning: "Pulses the glint while the model works." },
          ]}
        />
        <BuiltOn name="Drawer" href={shadcn("drawer")} />
        <Rules
          items={[
            "Iris never touches the price, the profit or the status chip. Those keep clay and status colours.",
            "Scenarios are preview-only; tapping never applies a price. Follow-ups are chips, never free text.",
            "Provenance closes every review: Used, Assumed, Can't know. Admitting the limit is what makes the rest trustworthy.",
          ]}
        />
      </DocSection>

      <DocSection
        id="bottom-nav"
        title="BottomNav"
        spec="§2.10"
        source="src/components/BottomNav.tsx"
        lede="Home · Products · [+] · Materials · Costs. Neutral Lucide icons: a candlemaker reads them identically. The centre plus is a flat clay square, bottom-aligned with the tabs. No lift, no shadow, no FAB."
      >
        <SpecimenRow>
          <Specimen label='active="products"' flush>
            <BottomNav active="products" />
          </Specimen>
          <Specimen label="no active tab (settings, product detail)" flush>
            <BottomNav />
          </Specimen>
        </SpecimenRow>
        <PropsTable rows={[{ name: "active", type: '"home" | "products" | "materials" | "costs"', meaning: "Which tab gets the 2px clay tick. Settings is not a tab: it lives behind the dashboard avatar." }]} />
        <Rules items={["Labels always visible; the whole column is the tap target.", "Chrome carries no category signal. Jewelry lives only in content."]} />
      </DocSection>

      {/* ─────────────────────────── SCREEN-LEVEL ───────────────────────── */}
      <GroupHeading>Screen-level</GroupHeading>

      <DocSection
        id="screens"
        title="See it in the app"
        lede="These compose the pieces above but need a product, a store or a model behind them, so they are listed here and demoed in the app itself."
      >
        <ul className="max-w-[70ch] divide-y divide-ink/7 font-sans text-[13.5px]">
          {[
            ["PricingPanel", "The interactive pricing block: calculated price, your price, VAT, the warning, the profit and its chip.", "/products", "src/components/PricingPanel.tsx"],
            ["EditableProfit", "The profit figure you can type into; the price back-solves.", "/products", "src/components/EditableProfit.tsx"],
            ["ProductEditor · MaterialsEditor · CostsEditor", "The inline-form pattern: rows expand in place, save gated until valid, delete confirms inline.", "/products", "src/components/ProductEditor.tsx"],
            ["HeroProfit", "The dashboard's one figure, with a count-up and the how-this-is-figured reveal.", "/dashboard", "src/components/HeroProfit.tsx"],
            ["NeedsAttention", "Count plus Review; the full list lives in the sheet it opens.", "/dashboard", "src/components/NeedsAttention.tsx"],
            ["StatusFilter · TypeFilter", "The Dropdown trigger opening a Drawer of options that navigate by query string.", "/products", "src/components/StatusFilter.tsx"],
            ["Combobox · CurrencySelect", "Type-to-search fields: the one sanctioned floating panel, a shadcn Popover that never steals focus.", "/settings", "src/components/Combobox.tsx"],
            ["BenchmarkSection", "The market benchmark reveal on the product detail.", "/products", "src/components/BenchmarkSection.tsx"],
            ["PriceCheck · AskIrisTeaser", "The two real iris sheets: a model-written review, and the honest teaser for the coach.", "/dashboard", "src/components/PriceCheck.tsx"],
          ].map(([name, what, href, path]) => (
            <li key={name} className="grid gap-x-6 gap-y-1 py-3 md:grid-cols-[260px_minmax(0,1fr)]">
              <div>
                <p className="font-medium text-ink">{name}</p>
                <p className="mt-0.5 font-mono text-[11px]">
                  <a href={repo(path)} className={link}>
                    {path.replace("src/components/", "")}
                  </a>
                </p>
              </div>
              <p className="font-light leading-[1.5] text-ink/70">
                {what}{" "}
                <a href={href} className={link}>
                  open {href}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </DocSection>
    </>
  );
}
