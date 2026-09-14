import { DocSection } from "@/components/design-docs/DocSection";
import { leaves, tokens } from "@/components/design-docs/tokens";

export function SpacingDoc() {
  return (
    <DocSection page
      id="spacing"
      title="Spacing"
      spec="§1.5"
      lede="24px horizontal gutter on every screen. Vertical rhythm by scale: tight, row, section, zone."
    >
      <div className="space-y-3">
        {leaves<string>(tokens.space).map(([name, t]) => (
          <div key={name} className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-4 font-sans">
            <p className="text-[13px] font-medium text-ink">{name}</p>
            <div className="flex items-center gap-3">
              <div className="h-3 shrink-0 rounded-[2px] bg-clay/40" style={{ width: t.$value }} />
              <p className="font-mono text-[11.5px] text-ink/55 tabular-nums">{t.$value}</p>
              {t.$description && (
                <p className="hidden text-[11.5px] font-light text-ink/70 sm:block">{t.$description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}
