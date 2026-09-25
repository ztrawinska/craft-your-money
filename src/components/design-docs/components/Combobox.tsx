import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { BuiltOn, Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { shadcn } from "@/components/design-docs/links";
import { ComboboxDemo } from "@/components/design-docs/demos/ComboboxDemo";

export function ComboboxDoc() {
  return (
    <DocSection page
      id="combobox"
      title="Combobox"
      spec="§2.17"
      source={["src/components/Combobox.tsx", "src/components/ui/popover.tsx"]}
      lede="A text field that suggests what you have saved already. It is the materials library's autofill: pick an entry to fill the row, or keep typing and use the name as new."
    >
      <SpecimenRow>
        <Specimen label="live · focus, then type “silver”">
          <ComboboxDemo />
        </Specimen>
      </SpecimenRow>
      <PropsTable
        rows={[
          { name: "value · onType", type: "string · (text) => void", meaning: "The field's text, controlled by the owner." },
          { name: "options", type: "{ id, label, hint? }[]", meaning: "What is saved. `hint` is the right-aligned figure — a unit cost." },
          { name: "onPick", type: "(option) => void", meaning: "A saved entry was chosen; the owner fills the rest of the row from it." },
          { name: "onUseAsNew", type: "() => void", meaning: "The typed name is not in the library and should be saved as a new entry." },
        ]}
      />
      <BuiltOn
        name="Popover"
        href={shadcn("popover")}
        note="Used as an anchor, not a trigger: the list floats under the field instead of pushing the form down, and Radix's own dismiss is switched off so typing doesn't close it."
      />
      <Rules
        items={[
          "“Use as new” is always the last option, so the library never traps you — a name that isn't saved yet is still a valid answer.",
          "The list never steals focus: you keep typing in the field while it is open. Items block the field's blur until the click lands.",
          "Every match is shown; the list scrolls past 264px. A cap would silently hide a material you had just saved.",
          "An empty field shows the whole library, not nothing — the list is a reminder of what you have, not only a filter.",
          "The suggestions float; nothing below the field moves as the list opens and closes.",
        ]}
      />
    </DocSection>
  );
}
