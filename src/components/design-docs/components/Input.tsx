import { Input } from "@/components/ui/input";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { BuiltOn, Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { shadcn } from "@/components/design-docs/links";
import { MoneyInputDemo } from "@/components/design-docs/demos/MoneyInputDemo";

export function InputDoc() {
  return (
    <DocSection page
      id="input"
      title="Input"
      spec="§2.12 · §2.13"
      source={["src/components/ui/input.tsx", "src/components/inline-form.tsx", "src/lib/money-input.ts"]}
      lede="Text field on shadcn's Input. MoneyInput is a cents accumulator: digits enter from the right, the last two are pennies, the decimal point is never typed."
    >
      <SpecimenRow>
        <Specimen label="Input · empty, with value, disabled">
          <div className="flex flex-col gap-3">
            <Input placeholder="Sterling silver sheet" />
            <Input defaultValue="Sterling silver sheet" />
            <Input defaultValue="Can't edit this" disabled />
          </div>
        </Specimen>
        <Specimen label="MoneyInput · live · type digits">
          <MoneyInputDemo />
        </Specimen>
      </SpecimenRow>
      <PropsTable
        rows={[
          { name: "Input", type: 'ComponentProps<"input">', meaning: "The shadcn primitive, re-skinned: page background, ink/14 border, clay focus ring, 16px text (stops iOS zoom)." },
          { name: "MoneyInput.value", type: "string", meaning: 'The amount as text, "12.50". Empty when all zeros.' },
          { name: "MoneyInput.onChange", type: "(v: string) => void", meaning: "Fires with the accumulated amount on every keystroke." },
          { name: "FieldLabel", type: "children", meaning: "The 9px caps label above a field." },
        ]}
      />
      <BuiltOn name="Input" href={shadcn("input")} note="A plain input has no behaviour for a library to add; this is simply the one place the field's look lives." />
      <Rules
        items={[
          "Keypad is numeric, not decimal: there is no separator key because you never type a separator.",
          "The caret is pinned to the right even after a tap in the middle, so entry always builds from the right.",
          "Quantity and minutes are not money: they take real decimals and stay plain fields.",
        ]}
      />
    </DocSection>
  );
}
