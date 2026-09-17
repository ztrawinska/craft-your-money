import { DocSection } from "@/components/design-docs/DocSection";
import { GroupLabel, Rules } from "@/components/design-docs/Rules";

const SAY: [string, string][] = [
  ["What this costs to make", "Direct cost"],
  ["What you keep", "Net revenue"],
  ["Your profit", "Contribution margin"],
  ["Business costs", "Overhead"],
  ["Your price", "Final price"],
];

export function VoiceDoc() {
  return (
    <DocSection
      page
      id="voice"
      title="Voice and copy"
      spec="§4"
      source="scripts/check-tells.sh"
      lede="Plain language over finance jargon. The banned terms are checked by scripts/check-tells.sh."
    >
      <GroupLabel>Say · not</GroupLabel>
      <div className="overflow-x-auto">
        <table className="w-full max-w-[560px] border-collapse font-sans text-label">
          <thead>
            <tr className="text-left text-caps uppercase text-ink/62">
              <th className="border-b border-ink/14 py-2 pr-4 font-semibold">Say</th>
              <th className="border-b border-ink/14 py-2 font-semibold">Not</th>
            </tr>
          </thead>
          <tbody>
            {SAY.map(([say, not]) => (
              <tr key={say}>
                <td className="border-b border-ink/7 py-3 pr-4 text-ink">{say}</td>
                <td className="border-b border-ink/7 py-3 text-ink/62 line-through decoration-ink/30">
                  {not}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Rules
        title="Reserved phrasings"
        items={[
          <>&ldquo;You keep&rdquo; is only ever about VAT.</>,
          <>&ldquo;Your profit&rdquo; is only ever after all costs.</>,
          <>A loss never uses the word profit: &ldquo;You lose £2.06 on each piece.&rdquo;</>,
          <>Draft state uses &ldquo;Would be&rdquo;: Would be Healthy · 52%.</>,
        ]}
      />
      <Rules
        title="Warnings"
        items={[
          "Warnings are helpers, not alarms. Calm, plain, and they suggest a direction.",
          "Error and invalid are reserved for genuine system failures, never for a low margin.",
          "Warnings stay monochrome ink. A notice that needs setting off sits in a TintedBand, still in ink.",
        ]}
      />
      <Rules
        title="Briefing voice"
        items={[
          "Warm, specific, assembled from real numbers. Never generic encouragement.",
          "One chip, one plain sentence. No modal advice chains.",
        ]}
      />
    </DocSection>
  );
}
