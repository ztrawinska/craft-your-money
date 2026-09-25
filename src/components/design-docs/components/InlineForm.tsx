import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { InlineFormDemo } from "@/components/design-docs/demos/InlineFormDemo";

export function InlineFormDoc() {
  return (
    <DocSection page
      id="inline-form"
      title="Inline form"
      spec="§2.12"
      source="src/components/inline-form.tsx"
      lede="The pieces a row is edited with, in place. Add and edit never open a modal: the row becomes a tinted card, the figure settles live under a dashed rule, and delete asks inside the card."
    >
      <SpecimenRow>
        <Specimen label="live · the whole cycle">
          <InlineFormDemo />
        </Specimen>
      </SpecimenRow>
      <PropsTable
        rows={[
          { name: "EditShell", type: "children", meaning: "The card: ink-5% tint, band radius, 8px clear of the rows around it. Containment alone marks edit mode." },
          { name: "FieldLabel", type: "children", meaning: "The caps label above a field (`caps-tight`). It reserves its own 4px beneath — see §1.5 rule 5." },
          { name: "MoneyInput", type: "value · onChange", meaning: "The cents accumulator: digits fill from the right, the decimal point is painted on, never typed." },
          { name: "FormFooter.lineCost", type: "number | null", meaning: "The live figure above the actions. `null` renders an em dash, not a zero." },
          { name: "FormFooter.valid", type: "boolean", meaning: "Gates Save. Invalid is a quiet, disabled button — never an error state while typing." },
          { name: "FormFooter.confirmingDelete", type: "boolean", meaning: "Swaps the actions for the inline confirm. The owner holds this, so the card can't lose it on a re-render." },
          { name: "num", type: "(s: string) => number", meaning: "Parses a typed number, accepting a comma decimal." },
        ]}
      />
      <Rules
        items={[
          "Containment marks edit mode — a rounded, faintly tinted card. No accent stripe: it was decoration here, and the clay and iris stripes elsewhere carry meaning (the one framed surface; “the assistant is here”).",
          "The card is presentational. The owner holds the draft and passes handlers, so the materials library and the business-costs screen edit rows with exactly the same feel.",
          "Delete confirms inline, in the card, with copy that says what survives: “the library item stays — only this line goes.”",
          "Save is disabled until the row is valid. No error states while typing.",
          "The figure sits on a dashed rule: derived, not entered.",
          "44px minimum touch targets; 16px minimum input text, which is what stops iOS zooming the page on focus.",
        ]}
      />
    </DocSection>
  );
}
