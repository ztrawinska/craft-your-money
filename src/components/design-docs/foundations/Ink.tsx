import { DocSection } from "@/components/design-docs/DocSection";
import { Rules } from "@/components/design-docs/Rules";
import { leaves, tokens } from "@/components/design-docs/tokens";
import { inkSteps } from "@/components/design-docs/foundations/shared";

export function InkDoc() {
  return (
    <DocSection page
      id="ink"
      title="Ink ladder"
      spec="§1.3"
      lede="The ink colour at seven fixed opacities, used instead of a grey scale."
    >
      <div className="flex flex-wrap gap-x-5 gap-y-5">
        {inkSteps.map(([name, o]) => {
          const t = leaves<number>(tokens.opacity.ink).find(([k]) => `ink/${k}` === name)?.[1];
          return (
            <div key={name} className="w-[128px] font-sans">
              <div className="h-12 w-full rounded-[6px] bg-ink" style={{ opacity: o }} />
              <p className="mt-2 font-serif text-[18px] text-ink" style={{ opacity: o }}>
                Aa 1234
              </p>
              <p className="font-mono text-[11.5px] text-ink/55">
                {name} · {Math.round(o * 100)}%
              </p>
              {t?.$description && (
                <p className="mt-1 text-[11.5px] font-light leading-[1.45] text-ink/70">
                  {t.$description}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <Rules
        items={[
          <>
            Tinted bands use ink at {Math.round(tokens.opacity.tint.$value * 1000) / 10}%, and a
            chip&rsquo;s fill is its status colour at {tokens.opacity["chip-fill"].$value * 100}%.
            Backgrounds sit very close to the page.
          </>,
          "Written in Tailwind as text-ink/55, border-ink/14, bg-ink/7. There is nothing extra to define.",
        ]}
      />
    </DocSection>
  );
}
