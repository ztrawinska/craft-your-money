import { DocSection } from "@/components/design-docs/DocSection";
import { leaves, tokens } from "@/components/design-docs/tokens";

// The scale is three tiers (§1.5): steps carry a px value, sizes and roles
// alias another key with a DTCG {ref}. Resolve the chain so every row can
// draw its bar at the real width and still show what it points at.
type SpaceLeaf = { $value: string; $description?: string };
const groups = {
  scale: leaves<string>(tokens.space.scale),
  size: leaves<string>(tokens.space.size),
  role: leaves<string>(tokens.space.role),
} as Record<string, [string, SpaceLeaf][]>;

function resolve(value: string, depth = 0): string {
  const ref = value.match(/^\{space\.(scale|size|role)\.([a-z0-9-]+)\}$/);
  if (!ref || depth > 5) return value;
  const leaf = groups[ref[1]].find(([name]) => name === ref[2]);
  return leaf ? resolve(leaf[1].$value, depth + 1) : value;
}

const aliasOf = (value: string) => value.match(/^\{space\.[a-z]+\.([a-z0-9-]+)\}$/)?.[1];

const tiers: { key: keyof typeof groups; title: string; lede: string; utility: (n: string) => string }[] = [
  {
    key: "scale",
    title: "Steps",
    lede: "Tier 1. Tailwind's index names, 4pt to 24 and 8pt to 64. Closed: nothing between them exists; a half step renders nothing.",
    utility: (n) => `p-${n}`,
  },
  {
    key: "size",
    title: "Sizes",
    lede: "Tier 2. T-shirt aliases onto the steps. Reach for one only when no role names the relationship.",
    utility: (n) => `gap-${n}`,
  },
  {
    key: "role",
    title: "Roles",
    lede: "Tier 2. The relationship between two things on a screen. A page says pt-section, not pt-6. A component never margins its own root; roles are for the container that arranges things.",
    utility: (n) => (n === "row-height" ? "min-h-row-height" : n === "tap-target" ? "min-h-tap" : n === "nudge" ? "ml-nudge" : `pt-${n}`),
  },
];

export function SpacingDoc() {
  return (
    <DocSection page
      id="spacing"
      title="Spacing"
      spec="§1.5"
      lede="One closed scale in three tiers: the steps, t-shirt sizes on top of them, and roles that name why two things are apart. 24px gutter on every screen."
    >
      <div className="space-y-8">
        {tiers.map(({ key, title, lede, utility }) => (
          <div key={key}>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/62">{title}</p>
            <p className="mt-1 max-w-[62ch] font-sans text-[13px] font-light leading-[1.55] text-ink/70">{lede}</p>
            <div className="mt-3 space-y-3">
              {groups[key].map(([name, t]) => {
                const px = resolve(t.$value);
                const alias = aliasOf(t.$value);
                return (
                  <div key={name} className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-4 font-sans">
                    <div>
                      <p className="text-[13px] font-medium text-ink">{name}</p>
                      <p className="font-mono text-[11px] text-ink/62">{utility(name)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 shrink-0 rounded-[2px] bg-clay/40" style={{ width: px }} />
                      <p className="font-mono text-[11.5px] text-ink/62 tabular-nums">
                        {px}
                        {alias && <span className="text-ink/30"> = {alias}</span>}
                      </p>
                      {t.$description && (
                        <p className="hidden text-[11.5px] font-light text-ink/70 sm:block">{t.$description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}
