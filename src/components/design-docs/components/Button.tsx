import { ChevronLeft, ChevronRight, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/Button";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { GroupLabel, Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";

export function ButtonDoc() {
  return (
    <DocSection page
      id="button"
      title="Button"
      spec="§2.3"
      source="src/components/Button.tsx"
      lede="Three variants: primary, ghost, link. One primary per screen. Row-level actions use link."
    >
      <SpecimenRow>
        <Specimen label='variant="primary" · the one main action'>
          <Button variant="primary">Save and activate</Button>
        </Specimen>
        <Specimen label='variant="ghost" · beside a primary'>
          <Button variant="ghost">Save draft</Button>
        </Specimen>
        <Specimen label='variant="primary" disabled'>
          <Button variant="primary" disabled className="opacity-55">
            Save and activate
          </Button>
        </Specimen>
      </SpecimenRow>
      <GroupLabel>link · icon position carries meaning</GroupLabel>
      <SpecimenRow>
        <Specimen label="navigates → trailing chevron" inline>
          <Button variant="link" className="text-[13.5px] font-semibold" iconTrailing={<ChevronRight size={15} strokeWidth={2} />}>
            Reprice
          </Button>
        </Specimen>
        <Specimen label="acts in place → leading action icon" inline>
          <Button variant="link" className="text-[13.5px] font-semibold" iconLeading={<Plus size={14} strokeWidth={2.2} />}>
            Add material
          </Button>
        </Specimen>
        <Specimen label="acts in place → rotate-ccw, not archive-restore" inline>
          <Button variant="link" className="text-[13.5px] font-semibold" iconLeading={<RotateCcw size={13} strokeWidth={2.2} />}>
            Restore
          </Button>
        </Specimen>
        <Specimen label="back · mirror of navigate, 44px target" inline>
          <span className="-ml-3 inline-flex size-tap items-center justify-center text-ink/62">
            <ChevronLeft size={22} strokeWidth={1.8} />
          </span>
        </Specimen>
      </SpecimenRow>
      <PropsTable
        rows={[
          { name: "variant", type: '"primary" | "ghost" | "link"', default: '"link"', meaning: "The level. There is deliberately no fourth." },
          { name: "iconLeading", type: "ReactNode", meaning: "For actions that happen in place (+ Add material)." },
          { name: "iconTrailing", type: "ReactNode", meaning: "A chevron: a promise that something opens." },
          { name: "href", type: "string", meaning: "When set, renders as a Link. Same look, right semantics." },
          { name: "onClick · disabled · type", type: "…", meaning: "Plain button props. type is ignored when href is set." },
          { name: "className", type: "string", meaning: "link carries no fixed size; the caller sets it for its context." },
        ]}
      />
      <Rules
        items={[
          "A trailing chevron on an action that completes in place is a lie about what the tap does.",
          "The soft-filled fourth level (clay wash + outline) was built, tested and rejected.",
        ]}
      />
    </DocSection>
  );
}
