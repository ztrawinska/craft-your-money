import { AssistantSlot } from "@/components/AssistantSlot";
import { Chip } from "@/components/Chip";
import { FramedSurface } from "@/components/FramedSurface";
import { Price } from "@/components/Price";
import { DocSection } from "@/components/design-docs/DocSection";
import { PropsTable } from "@/components/design-docs/PropsTable";
import { Rules } from "@/components/design-docs/Rules";
import { Specimen, SpecimenRow } from "@/components/design-docs/Specimen";
import { ACTIVE, chipFor } from "@/components/design-docs/components/shared";

export function FramedSurfaceDoc() {
  return (
    <DocSection page
      id="framed-surface"
      title="FramedSurface"
      spec="§2.7"
      source={["src/components/FramedSurface.tsx", "src/components/PricingPanel.tsx"]}
      lede="The one enclosed surface per screen (the pricing block). White card with a torn top edge, no border, no shadow."
    >
      <SpecimenRow>
        <Specimen label="the pricing block, static excerpt" flush>
          <div className="bg-page px-0 pb-6 pt-4">
            <FramedSurface className="mx-6 px-6 pb-5 pt-section font-sans">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-ink/7 pb-4">
                <div>
                  <p className="text-[12.5px] text-clay-deep">Calculated price</p>
                  <p className="mt-1 text-[11px] font-light text-ink/62">30% target</p>
                </div>
                <Price value={40.17} variant="calc" />
              </div>
              <p className="mb-2 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/62">
                Your price
              </p>
              <div className="mb-5">
                <Price value={42.6} variant="primary" />
              </div>
              <div className="border-t border-ink/7 pt-4">
                <p className="mb-2 text-[12px] text-ink/62">Profit per piece, after all costs</p>
                <div className="flex items-center justify-between gap-3">
                  <Price value={18.2} variant="profit" tone="positive" />
                  <Chip tone="positive">{chipFor(ACTIVE(0.52)).label}</Chip>
                </div>
              </div>
              <AssistantSlot centered className="mt-5">
                Check this price
              </AssistantSlot>
            </FramedSurface>
          </div>
        </Specimen>
      </SpecimenRow>
      <PropsTable rows={[{ name: "children", type: "ReactNode", meaning: "The block. Padding is left to the caller." }, { name: "className", type: "string", meaning: "Margins and padding." }]} />
      <Rules
        items={[
          "If a second one appears on a screen, one of them is wrong. Reach for a hairline instead.",
          "The component doesn't stop you rendering two; that stays a judgment call (§6), a convention.",
          "Internal sections divide with ink/7 hairlines. The last word is the profit.",
        ]}
      />
    </DocSection>
  );
}
