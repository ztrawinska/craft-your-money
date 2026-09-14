import { DocSection } from "@/components/design-docs/DocSection";
import { leaves, tokens } from "@/components/design-docs/tokens";

export function RadiiDoc() {
  return (
    <DocSection page
      id="radii"
      title="Radii"
      spec="§1.6"
      lede="Eight radii. Nothing rounder than 11px except chips (100px) and sheets (14px). The checker flags any other value."
    >
      <div className="flex flex-wrap gap-6">
        {leaves<string>(tokens.radius).map(([name, t]) => (
          <div key={name} className="w-[112px] font-sans">
            <div
              className="h-14 w-full border border-ink/30 bg-ink/[0.035]"
              style={{ borderRadius: t.$value }}
            />
            <p className="mt-2 text-[13px] font-medium text-ink">{name}</p>
            <p className="font-mono text-[11.5px] text-ink/55 tabular-nums">{t.$value}</p>
            {t.$description && (
              <p className="mt-1 text-[11.5px] font-light leading-[1.45] text-ink/70">
                {t.$description}
              </p>
            )}
          </div>
        ))}
      </div>
    </DocSection>
  );
}
