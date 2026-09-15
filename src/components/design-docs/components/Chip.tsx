import { Chip } from "@/components/Chip";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { GroupLabel, Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { TONES, chipFor } from "@/components/design-docs/components/shared";
import type { ProductStatusInput } from "@/lib/status";

export function ChipDoc() {
  return (
    <DocSection page
      id="chip"
      title="Chip"
      spec="§2.1"
      source={["src/components/Chip.tsx", "src/lib/status.ts"]}
      lede="Shows a product's status. Takes a tone named by meaning, not colour; the tone-to-colour mapping lives in the component."
    >
      <GroupLabel>Five tones · default size</GroupLabel>
      <SpecimenRow>
        {TONES.map((t) => (
          <Specimen key={t.tone} label={`tone="${t.tone}"`} inline>
            <Chip tone={t.tone}>{t.label}</Chip>
          </Specimen>
        ))}
      </SpecimenRow>
      <GroupLabel>sm · inline in dense text</GroupLabel>
      <SpecimenRow>
        {TONES.map((t) => (
          <Specimen key={t.tone} label={`tone="${t.tone}" size="sm"`} inline>
            <Chip tone={t.tone} size="sm">
              {t.label}
            </Chip>
          </Specimen>
        ))}
      </SpecimenRow>
      <GroupLabel>Labels come from the status model, not from screens</GroupLabel>
      <SpecimenRow>
        {[
          { workflow: "active", hasPrice: true, marginPct: 0.64 },
          { workflow: "active", hasPrice: false, marginPct: null },
          { workflow: "draft", hasPrice: true, marginPct: 0.52 },
          { workflow: "draft", hasPrice: false, marginPct: null },
        ].map((input) => {
          const c = chipFor(input as ProductStatusInput);
          return (
            <Specimen
              key={JSON.stringify(input)}
              label={`statusChip({ ${input.workflow}, ${input.hasPrice ? `margin ${Math.round((input.marginPct ?? 0) * 100)}%` : "no price"} })`}
              inline
            >
              <Chip tone={c.tone}>{c.label}</Chip>
            </Specimen>
          );
        })}
      </SpecimenRow>
      <PropsTable
        rows={[
          { name: "tone", type: '"positive" | "caution" | "critical" | "neutral" | "inactive"', default: '"neutral"', meaning: "The meaning. Filled tones are a verdict on a live product; inactive (outlined) means the product sits outside the live range." },
          { name: "size", type: '"default" | "sm"', default: '"default"', meaning: "sm only for a chip sitting inline in dense text." },
          { name: "children", type: "ReactNode", meaning: "Label and margin as one unit: Healthy · 64%." },
        ]}
      />
      <Rules
        items={[
          "Label and margin merge into one chip. Never a badge beside a coloured number.",
          "No price is neutral, not a status colour: a missing input, not a health judgment.",
          "Never invent a tone for a one-off. A new meaning goes into the ChipTone union first.",
        ]}
      />
    </DocSection>
  );
}
