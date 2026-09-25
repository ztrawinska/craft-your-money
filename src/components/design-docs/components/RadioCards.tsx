import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { RadioCardsDemo } from "@/components/design-docs/demos/RadioCardsDemo";

export function RadioCardsDoc() {
  return (
    <DocSection page
      id="radio-cards"
      title="RadioCards"
      spec="§2.15"
      source="src/components/RadioCards.tsx"
      lede="Two or three mutually exclusive options as cards with a title and description. Native radios underneath."
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
  );
}
