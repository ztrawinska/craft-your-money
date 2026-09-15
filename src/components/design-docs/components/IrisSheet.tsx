import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { BuiltOn, Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { shadcn } from "@/components/design-docs/links";
import { IrisSheetDemo } from "@/components/design-docs/demos/IrisSheetDemo";

export function IrisSheetDoc() {
  return (
    <DocSection page
      id="iris-sheet"
      title="IrisSheet"
      spec="§2.9"
      source={["src/components/IrisSheet.tsx", "src/components/PriceCheck.tsx"]}
      lede="Bottom sheet for AI responses. Neutral drawer; iris colour appears only on the glint, the label, the finding numerals and the follow-up chips."
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
  );
}
