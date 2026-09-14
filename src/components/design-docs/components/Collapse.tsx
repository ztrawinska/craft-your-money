import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { CollapseDemo } from "@/components/design-docs/demos/CollapseDemo";

export function CollapseDoc() {
  return (
    <DocSection page
      id="collapse"
      title="Collapse"
      spec="§2.14"
      source={["src/components/Collapse.tsx", "src/components/BenchmarkSection.tsx"]}
      lede="Animated disclosure. Opened by the reveal toggle: an inline chevron link with a dotted clay underline."
    >
      <SpecimenRow>
        <Specimen label="closed → open (live)">
          <CollapseDemo />
        </Specimen>
      </SpecimenRow>
      <PropsTable rows={[{ name: "open", type: "boolean", meaning: "Grid rows 0fr → 1fr, so the browser interpolates the height. No measuring." }, { name: "children", type: "ReactNode", meaning: "Inert while closed, so it leaves the tab order." }]} />
      <Rules items={["Clay because it is a link. Not a full-width grey section header: that reads as structure.", "Motion is dropped under prefers-reduced-motion; the reveal is instant, never absent."]} />
    </DocSection>
  );
}
