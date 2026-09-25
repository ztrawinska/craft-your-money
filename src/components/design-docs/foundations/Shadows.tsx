import { DocSection } from "@/components/design-docs/DocSection";
import { Rules } from "@/components/design-docs/Rules";
import { leaves, tokens } from "@/components/design-docs/tokens";

type ShadowValue = { color: string; offsetX: string; offsetY: string; blur: string; spread: string };

/** The class that actually paints each token, so the specimen is the real thing. */
const CLASS: Record<string, string> = {
  popover: "shadow-popover",
  sheet: "shadow-sheet",
};

export function ShadowsDoc() {
  const shadows = leaves<ShadowValue>(tokens.shadow);
  return (
    <DocSection page
      id="shadows"
      title="Shadows"
      spec="§1.1"
      lede="Two, and no third. A shadow means one thing here: this surface genuinely left the page. Anything still in flow separates with a hairline."
    >
      <div className="flex flex-col gap-8">
        {shadows.map(([name, t]) => (
          <div key={name} className="grid gap-x-8 gap-y-3 font-sans md:grid-cols-[220px_minmax(0,1fr)]">
            <div>
              <p className="text-label-strong text-ink">{CLASS[name] ?? name}</p>
              <p className="font-mono text-label-sm text-ink/62">
                {t.$value.offsetX} {t.$value.offsetY} {t.$value.blur} {t.$value.spread}
              </p>
              <p className="font-mono text-label-sm text-ink/62">{t.$value.color}</p>
            </div>
            <div>
              {/* Room around the specimen so a shadow cast upward has somewhere to land. */}
              <div className="flex items-center justify-center rounded-band bg-ink/[0.03] px-6 py-10">
                <div className={`w-full max-w-[280px] rounded-button border border-ink/14 bg-page px-4 py-3 ${CLASS[name]}`}>
                  <p className="text-label text-ink/62">the surface that floats</p>
                </div>
              </div>
              {t.$description && <p className="pt-2 text-body-sm text-ink/70">{t.$description}</p>}
            </div>
          </div>
        ))}
      </div>
      <Rules
        items={[
          <>
            The scale is closed the same way the others are:{" "}
            <span className="font-mono text-label-sm">--shadow-*: initial</span>{" "}
            switches Tailwind&rsquo;s own sizes off, so they paint nothing, and{" "}
            <span className="font-mono text-label-sm">scripts/check-tells.sh</span> fails the build on a third
            shadow. A new one is a change to this page, not a class in a component.
          </>,
          "Two were removed in September 2026, after being measured rather than argued about. A lift under the primary button read as a moulded key. A fold above the save bars promised content passing underneath, but those bars sit still at the very end of the page, and the blur was softening the hairline that does the real separating.",
          "Everything still in the page’s flow separates with a hairline. That is the whole test: if it has not left the page, it has no shadow.",
        ]}
      />
    </DocSection>
  );
}
