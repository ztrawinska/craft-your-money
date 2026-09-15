import { Glint } from "@/components/Glint";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";

export function GlintDoc() {
  return (
    <DocSection page
      id="glint"
      title="Glint"
      spec="§2.9"
      source="src/components/Glint.tsx"
      lede="The iris icon. Marks that an AI model is involved. One SVG path, reused everywhere."
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
  );
}
