import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { SectionLabel } from "@/components/SectionLabel";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";

export function SectionLabelDoc() {
  return (
    <DocSection page
      id="section-label"
      title="SectionLabel"
      spec="§2.5"
      source="src/components/SectionLabel.tsx"
      lede="Caps label for a section, with an optional right-aligned total."
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
  );
}
