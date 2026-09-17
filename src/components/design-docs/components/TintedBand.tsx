import { TintedBand } from "@/components/TintedBand";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";

export function TintedBandDoc() {
  return (
    <DocSection page
      id="tinted-band"
      title="TintedBand"
      spec="§2.8"
      source="src/components/TintedBand.tsx"
      lede="Background band for briefings and notices. Ink at 3.5%, 8px radius."
    >
      <SpecimenRow>
        <Specimen label="a briefing paragraph">
          <TintedBand>
            <p className="font-sans text-body text-ink/70">
              Most of your range earns well. The Thalia stacking set is priced under what it
              costs to make, and two rings sit just below target.
            </p>
          </TintedBand>
        </Specimen>
      </SpecimenRow>
      <PropsTable rows={[{ name: "children", type: "ReactNode", meaning: "Prose. Never numbers-as-heroes." }, { name: "className", type: "string", meaning: "Margins, from the caller." }]} />
      <Rules items={["If the band draws the eye before its content does, it is too strong."]} />
    </DocSection>
  );
}
