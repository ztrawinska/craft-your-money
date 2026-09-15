import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { BuiltOn } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { shadcn } from "@/components/design-docs/links";
import { SwitchDemo } from "@/components/design-docs/demos/SwitchDemo";

export function SwitchDoc() {
  return (
    <DocSection page
      id="switch"
      title="Switch"
      source="src/components/ui/switch.tsx"
      lede="Two-state toggle on shadcn/Radix Switch, re-skinned to the tokens."
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
  );
}
