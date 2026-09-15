import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { BuiltOn, Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { shadcn } from "@/components/design-docs/links";
import { ActionSheetDemo } from "@/components/design-docs/demos/ActionSheetDemo";

export function ActionSheetDoc() {
  return (
    <DocSection page
      id="action-sheet"
      title="ActionSheet"
      spec="§2.11"
      source={["src/components/ActionSheet.tsx", "src/components/ui/drawer.tsx"]}
      lede="The ⋯ menu as a bottom sheet. Constructive actions first, a hairline, then the destructive action last in red with its consequence. Confirms inline."
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
  );
}
