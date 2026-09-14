import { AssistantSlot } from "@/components/AssistantSlot";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";

export function AssistantSlotDoc() {
  return (
    <DocSection page
      id="assistant-slot"
      title="AssistantSlot"
      spec="§2.9"
      source="src/components/AssistantSlot.tsx"
      lede="Button that opens the iris sheet. The single entry point for every AI interaction."
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
  );
}
