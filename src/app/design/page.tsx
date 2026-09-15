/**
 * /design (overview): what the system is for, the five principles it descends
 * from, how the documents relate, and the table that matters most for keeping
 * a system honest: which rules are enforced by code and which are still
 * conventions someone has to remember (§6).
 */
import { Chip } from "@/components/Chip";
import { DocSection } from "@/components/design-docs/DocSection";
import { DESIGN_SYSTEM_DOC, repo } from "@/components/design-docs/links";
import { docLink as link } from "@/components/design-docs/styles";
import type { ChipTone } from "@/lib/status";

const PRINCIPLES = [
  ["Flat", "No cards, no drop shadows, no floating panels. Depth comes from hairlines and one framed surface, never from elevation."],
  ["One framed surface per screen", "Exactly one place is visually enclosed: where the decision happens. Everything else sits directly on the page."],
  ["One accent", "Clay, and only clay. Iris is not a second accent; it is the AI identity and appears only when the assistant is involved."],
  ["Status lives in chips", "Never as raw coloured text. Numbers are monochrome ink."],
  ["More authored, not louder", "Contrast comes from structure, hierarchy and restraint, never from decoration."],
] as const;

type Level = "Enforced" | "Checked" | "Convention";
const levelTone: Record<Level, ChipTone> = {
  Enforced: "positive",
  Checked: "caution",
  Convention: "neutral",
};

const ENFORCEMENT: { rule: string; level: Level; where: string; path?: string }[] = [
  { rule: "Meaning-named tones (positive, caution, critical), never colours", level: "Enforced", where: "the ChipTone union", path: "src/lib/status.ts" },
  { rule: "Label, tone and margin threshold can't drift apart", level: "Enforced", where: "PROFITABILITY_META + statusChip()", path: "src/lib/status.ts" },
  { rule: "Money is always Lora, tabular, monochrome ink", level: "Enforced", where: "the Price component", path: "src/components/Price.tsx" },
  { rule: "Profit is the one figure that takes its chip's tone", level: "Enforced", where: "profitTone(), used by Price and Chip alike", path: "src/lib/status.ts" },
  { rule: "Three button levels, no fourth", level: "Enforced", where: "the variant union", path: "src/components/Button.tsx" },
  { rule: "Money entry is a right-to-left cents accumulator", level: "Enforced", where: "the only way a money field is typed", path: "src/lib/money-input.ts" },
  { rule: "Tokens in tokens.json agree with globals.css", level: "Enforced", where: "a test that fails on drift", path: "src/lib/tokens.test.ts" },
  { rule: "No hardcoded hex, no off-scale radii, no jargon in copy", level: "Checked", where: "check-tells.sh, run by a Stop hook after every Claude response; report-only", path: "scripts/check-tells.sh" },
  { rule: "Status appears only in chips", level: "Convention", where: "Chip is the only status component, but nothing stops coloured text" },
  { rule: "One framed surface per screen", level: "Convention", where: "FramedSurface doesn't count its siblings; needs judgment" },
  { rule: "Iris never mixes with clay on one element", level: "Convention", where: "a combination rule, hard to type" },
  { rule: "This library lists every component", level: "Convention", where: "a new component has to be added here by hand" },
];

const FILES = [
  ["src/app/globals.css", "The tokens, as Tailwind @theme variables, plus the shadcn bridge. The source."],
  ["design/tokens.json", "The same tokens in the W3C DTCG format, for this library and for Figma. A checked export."],
  ["src/components/*.tsx", "The components. Each file opens with the rule it exists to enforce."],
  ["src/components/ui/*.tsx", "shadcn/ui primitives (Drawer, Input, Switch, Popover), re-skinned to the tokens."],
  ["src/lib/status.ts", "The status model: label, tone and threshold in one table, pure and unit-tested."],
  ["docs/craft-your-money-design-system.md", "The why behind every rule. Read it before changing anything here."],
  ["docs/design/*.html", "The reference renders each screen was built from."],
];

export default function DesignOverview() {
  return (
    <>
      <h1 className="font-serif text-[27px] font-medium leading-[1.16] text-ink">Overview</h1>
      <p className="mt-3 mb-8 max-w-[62ch] font-sans text-[15px] font-light leading-[1.7] text-ink/70">
        The design system for Craft Your Money, a pricing tool for handmade makers. This library
        renders the real components from <code className="font-mono text-[13px] text-ink">src/components</code>{" "}
        and the real tokens from <code className="font-mono text-[13px] text-ink">globals.css</code>.
        The rationale for each rule is in{" "}
        <a href={DESIGN_SYSTEM_DOC} className={link}>design-system.md</a>; product behaviour is in{" "}
        <a href={repo("docs/craft-your-money-prd-v2.md")} className={link}>the PRD</a>.
      </p>

      <DocSection id="principles" title="The five principles" spec="§1.1">
        <ol className="max-w-[62ch] space-y-4">
          {PRINCIPLES.map(([name, line], i) => (
            <li key={name} className="flex gap-4">
              <span className="w-5 shrink-0 font-serif text-[15px] text-ink/62 tabular-nums">
                {i + 1}
              </span>
              <div>
                <p className="font-sans text-[15px] font-medium text-ink">{name}</p>
                <p className="mt-0.5 font-sans text-[13.5px] font-light leading-[1.55] text-ink/70">
                  {line}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </DocSection>

      <DocSection
        id="reading-order"
        title="How the documents fit together"
        lede="Reading order for a new screen: behaviour, then components, then layout."
      >
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[13.5px]">
          {[
            ["PRD", repo("docs/craft-your-money-prd-v2.md"), "what it does and why"],
            ["design-system.md", DESIGN_SYSTEM_DOC, "what things look like and when"],
            ["docs/design/*.html", repo("docs/design"), "the layout of each screen"],
            ["this library", "/design/components", "the real components, rendered"],
          ].map(([name, href, what], i, all) => (
            <li key={name} className="flex items-center gap-3">
              <span>
                <a href={href} className={`font-medium ${link}`}>
                  {name}
                </a>
                <span className="text-ink/62"> · {what}</span>
              </span>
              {i < all.length - 1 && <span className="text-ink/30">→</span>}
            </li>
          ))}
        </ol>
      </DocSection>

      <DocSection
        id="enforcement"
        title="Enforced, checked, or convention"
        spec="§6"
        lede="Which rules the code enforces, which a script checks, and which are still conventions to remember."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse font-sans text-[13px]">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/62">
                <th className="border-b border-ink/14 py-2 pr-4 font-semibold">Rule</th>
                <th className="border-b border-ink/14 py-2 pr-4 font-semibold">Level</th>
                <th className="border-b border-ink/14 py-2 font-semibold">Where</th>
              </tr>
            </thead>
            <tbody>
              {ENFORCEMENT.map((r) => (
                <tr key={r.rule} className="align-top">
                  <td className="border-b border-ink/7 py-2.5 pr-4 text-ink">{r.rule}</td>
                  <td className="border-b border-ink/7 py-2 pr-4">
                    <Chip tone={levelTone[r.level]} size="sm">
                      {r.level}
                    </Chip>
                  </td>
                  <td className="border-b border-ink/7 py-2.5 font-light leading-[1.5] text-ink/70">
                    {r.where}
                    {r.path && (
                      <>
                        {" · "}
                        <a href={repo(r.path)} className={`font-mono text-[11.5px] ${link}`}>
                          {r.path.split("/").pop()}
                        </a>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-[62ch] font-sans text-[12px] font-light leading-[1.55] text-ink/62">
          Enforced: the type system or a test stops it. Checked: a script reports it. Convention: documented only.
        </p>
      </DocSection>

      <DocSection id="files" title="Where things live">
        <ul className="max-w-[70ch] space-y-3">
          {FILES.map(([path, what]) => (
            <li key={path} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <a
                href={repo(path.replace("*.tsx", ""))}
                className={`shrink-0 font-mono text-[12.5px] sm:w-[300px] ${link}`}
              >
                {path}
              </a>
              <span className="font-sans text-[13.5px] font-light leading-[1.5] text-ink/70">
                {what}
              </span>
            </li>
          ))}
        </ul>
      </DocSection>
    </>
  );
}
