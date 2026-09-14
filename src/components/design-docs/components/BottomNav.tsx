import { BottomNav } from "@/components/BottomNav";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";

export function BottomNavDoc() {
  return (
    <DocSection page
      id="bottom-nav"
      title="BottomNav"
      spec="§2.10"
      source="src/components/BottomNav.tsx"
      lede="Home · Products · [+] · Materials · Costs. Neutral Lucide icons; the centre plus is a flat clay square, not a FAB."
    >
      <SpecimenRow>
        <Specimen label='active="products"' flush>
          <BottomNav active="products" />
        </Specimen>
        <Specimen label="no active tab (settings, product detail)" flush>
          <BottomNav />
        </Specimen>
      </SpecimenRow>
      <PropsTable rows={[{ name: "active", type: '"home" | "products" | "materials" | "costs"', meaning: "Which tab gets the 2px clay tick. Settings is not a tab: it lives behind the dashboard avatar." }]} />
      <Rules items={["Labels always visible; the whole column is the tap target.", "Chrome carries no category signal. Jewelry lives only in content."]} />
    </DocSection>
  );
}
