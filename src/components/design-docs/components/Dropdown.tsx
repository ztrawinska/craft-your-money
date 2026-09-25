import { Dropdown } from "@/components/Dropdown";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";

export function DropdownDoc() {
  return (
    <DocSection page
      id="dropdown"
      title="Dropdown"
      spec="§2.4"
      source={["src/components/Dropdown.tsx", "src/components/StatusFilter.tsx"]}
      lede="Trigger for a filter or select. Ghost button plus chevron; opens a bottom sheet (Drawer), not a floating menu."
    >
      <SpecimenRow>
        <Specimen label="default · filtered" inline>
          <div className="flex gap-2">
            <Dropdown>All statuses</Dropdown>
            <Dropdown filtered>Below target</Dropdown>
          </div>
        </Specimen>
      </SpecimenRow>
      <PropsTable
        rows={[
          { name: "children", type: "ReactNode", meaning: "The current value, or the filter's name when nothing is set." },
          { name: "filtered", type: "boolean", default: "false", meaning: "Has-a-value state: label and border turn clay, a faint clay wash behind." },
        ]}
      />
      <Rules
        items={[
          "Background stays transparent. A white fill would create a new surface on a flat page.",
          "Radius is rounded-button (8px), never 100px: that geometry belongs to chips and means status.",
          "Filters are dropdowns; sort is not. Sort is a bare arrow-up-down icon at the right of the row.",
        ]}
      />
    </DocSection>
  );
}
