import { ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { GroupLabel, Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { ACTIVE, ProductSlot } from "@/components/design-docs/components/shared";

export function ListRowDoc() {
  return (
    <DocSection page
      id="list-row"
      title="ListRow"
      spec="§2.6"
      source={["src/components/ListRow.tsx", "src/app/products/page.tsx"]}
      lede="Two-line row with an optional status stripe and a right slot. Used for products (overview) and cost lines (detail)."
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
              <Button variant="link" className="text-button" iconLeading={<RotateCcw size={13} strokeWidth={2.2} />}>
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
          <ListRow emphasis="product" stripe="neutral" label="Artemis crescent studs" meta={<>Earrings · <Chip tone="neutral" size="sm">No price</Chip></>} value={<Button variant="link" className="text-button" iconTrailing={<ChevronRight size={15} strokeWidth={2} />}>Set price</Button>} />
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
  );
}
