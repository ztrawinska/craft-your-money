import { DocSection } from "@/components/design-docs/DocSection";

const ANTI: [string, string][] = [
  ["Soft white cards for grouping", "Floating surfaces compete; the page reads as generic SaaS."],
  ["Drop shadows anywhere", "Depth belongs to hairlines and the one frame."],
  ["Green-when-positive profit", "Puts a green number beside a red Risky chip: two contradictory stories."],
  ["Coloured cost figures", "Costs are inputs, not verdicts."],
  ["A fourth button level", "Row actions don't need a box; three levels are enough."],
  ["Material-style FAB in the nav", "Reads as a library default, not a decision."],
  ["All-clear reassurance bands", "Confidence through absence; empty sections vanish."],
  ["A proud 0 as a hero metric", "Designed for the bad day, embarrassing on a good one."],
  ["Jewelry icons in navigation", "Locks the chrome to one craft."],
  ["Glint on deterministic features", "The glint means a model is involved."],
  ["Floating popover menus", "A card hovering over a flat page; poor tap targets on mobile."],
  ["Modal stacked on a sheet", "Confirmation belongs inside the sheet that raised it."],
  ["Dimming a whole row to mute it", "Makes live actions look disabled; dim the content only."],
  ["A hairline between every sheet row", "Dividers mark a change of kind, not every item."],
  ["“If activated, this would be Healthy”", "A whole sentence doing a chip's job."],
];

export function AntiPatternsDoc() {
  return (
    <DocSection
      page
      id="anti-patterns"
      title="Anti-patterns"
      spec="§5"
      lede="Rejected during design. Each was built or considered and turned down for the reason given."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-sans text-[13.5px]">
          <thead>
            <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/62">
              <th className="border-b border-ink/14 py-2 pr-4 font-semibold">Anti-pattern</th>
              <th className="border-b border-ink/14 py-2 font-semibold">Why rejected</th>
            </tr>
          </thead>
          <tbody>
            {ANTI.map(([what, why]) => (
              <tr key={what} className="align-top">
                <td className="border-b border-ink/7 py-2.5 pr-4 text-ink">{what}</td>
                <td className="border-b border-ink/7 py-2.5 font-light leading-[1.5] text-ink/70">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocSection>
  );
}
