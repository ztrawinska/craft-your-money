import { Chip } from "@/components/Chip";
import { Price } from "@/components/Price";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { GroupLabel, Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { ACTIVE, chipFor } from "@/components/design-docs/components/shared";

export function PriceDoc() {
  return (
    <DocSection page
      id="price"
      title="Price"
      spec="§2.2"
      source="src/components/Price.tsx"
      lede="Formats a money value in Lora with tabular numerals and ink. Eight size variants. Currency comes from the account settings."
    >
      <SpecimenRow>
        <Specimen label='variant="primary" · your price'>
          <Price value={42.6} variant="primary" />
        </Specimen>
        <Specimen label='variant="hero" · dashboard profit'>
          <Price value={12.85} variant="hero" />
        </Specimen>
      </SpecimenRow>
      <SpecimenRow>
        <Specimen label='variant="figure" · a total' inline>
          <Price value={14.06} variant="figure" />
        </Specimen>
        <Specimen label='variant="calc" · the suggestion' inline>
          <Price value={40.17} variant="calc" />
        </Specimen>
        <Specimen label='variant="inline" · a row value' inline>
          <Price value={2.48} variant="inline" />
        </Specimen>
        <Specimen label='variant="summary"' inline>
          <Price value={2.74} variant="summary" />
        </Specimen>
        <Specimen label='variant="sectionTotal"' inline>
          <Price value={9.96} variant="sectionTotal" />
        </Specimen>
      </SpecimenRow>
      <GroupLabel>profit · the one figure that takes its chip&rsquo;s tone</GroupLabel>
      <SpecimenRow>
        {(["positive", "caution", "critical"] as const).map((tone) => {
          const margin = { positive: 0.52, caution: 0.22, critical: 0.08 }[tone];
          const c = chipFor(ACTIVE(margin));
          return (
            <Specimen key={tone} label={`variant="profit" tone="${tone}"`}>
              <div className="flex items-center justify-between gap-2.5">
                <Price value={{ positive: 18.2, caution: 6.4, critical: 2.1 }[tone]} variant="profit" tone={tone} />
                <Chip tone={c.tone}>{c.label}</Chip>
              </div>
            </Specimen>
          );
        })}
      </SpecimenRow>
      <PropsTable
        rows={[
          { name: "value", type: "number", meaning: "The amount, gross." },
          { name: "variant", type: '"primary" | "hero" | "figure" | "inline" | "calc" | "sectionTotal" | "summary" | "profit"', default: '"inline"', meaning: "Which role the figure plays; the size, weight and opacity follow." },
          { name: "tone", type: '"positive" | "caution" | "critical"', meaning: "Only read by the profit variant. Neutral and inactive can never colour a number: the type excludes them." },
        ]}
      />
      <Rules
        items={[
          "Costs and prices are always ink. Only the profit takes its chip's tone, and only so the two can never disagree.",
          "Not green-when-positive: a £4 profit at 9% is a green number beside a red chip, two contradictory stories.",
          "The primary price splits its decimals down so the eye lands on pounds.",
        ]}
      />
    </DocSection>
  );
}
