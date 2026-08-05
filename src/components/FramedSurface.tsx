/**
 * FramedSurface — the ONE enclosed area allowed per screen (design §2.7).
 *
 * On Product Detail this is the pricing block: the single place a decision
 * happens. It is the only white surface on an otherwise flat, page-coloured
 * screen. Its top edge is *torn* — even flat runs interrupted by concave
 * notches, cut out of the card so the real page shows through — because the
 * block genuinely reads like a costing receipt (line items, dashed rules,
 * running totals): a sheet torn from a pad. No border; the torn edge + the fill
 * define the surface. Kept flat (no shadow / 3-D) so it stays on-brand.
 *
 * Rule: if a second one of these appears on a screen, one of them is wrong —
 * reach for a hairline instead. This component intentionally doesn't stop you
 * rendering two; that stays a judgement call (§6), so it's a convention, not
 * something the type system enforces.
 *
 * Padding is left to the caller so the frame can wrap differently-shaped
 * content.
 */
import type { ReactNode } from "react";

type FramedSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function FramedSurface({ children, className = "" }: FramedSurfaceProps) {
  // The card IS the paper. Its top edge is torn: even flat runs interrupted by
  // concave (semicircle) notches, cut straight out of the card so the *real*
  // page shows through the gaps — a sheet torn from a pad, ending exactly there.
  // Masking the card itself (not an overlay) is what makes the gaps the true
  // page colour. Flat, no shadow. The notch sits at each tile's centre with flat
  // runs either side, so the edge starts and ends on a flat run.
  const NOTCH = 6; // depth (px)
  const tornEdge = {
    WebkitMaskImage:
      "radial-gradient(circle at 50% 0%, transparent 0 6px, #000 6.4px), linear-gradient(#000, #000)",
    maskImage:
      "radial-gradient(circle at 50% 0%, transparent 0 6px, #000 6.4px), linear-gradient(#000, #000)",
    WebkitMaskSize: `18px ${NOTCH}px, 100% calc(100% - ${NOTCH}px)`,
    maskSize: `18px ${NOTCH}px, 100% calc(100% - ${NOTCH}px)`,
    WebkitMaskRepeat: "repeat-x, no-repeat",
    maskRepeat: "repeat-x, no-repeat",
    WebkitMaskPosition: "top center, bottom",
    maskPosition: "top center, bottom",
  } as const;

  return (
    <div
      className={`relative overflow-hidden rounded-[8px] bg-card ${className}`}
      style={tornEdge}
    >
      {children}
    </div>
  );
}
