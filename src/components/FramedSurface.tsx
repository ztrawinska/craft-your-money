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
  // page colour. Flat, no shadow.
  //
  // Four mask layers (union): the repeating notch strip; a solid body below it;
  // and two solid caps at the top-left and top-right, so BOTH corners always
  // begin on a flat run (never a half-notch cut, whatever the card's width).
  const NOTCH = 5; // depth (px)
  const notch =
    "radial-gradient(circle at 50% 0%, transparent 0 5px, #000 5.4px)";
  const solid = "linear-gradient(#000, #000)";
  const tornEdge = {
    WebkitMaskImage: `${notch}, ${solid}, ${solid}, ${solid}`,
    maskImage: `${notch}, ${solid}, ${solid}, ${solid}`,
    WebkitMaskSize: `16px ${NOTCH}px, 100% calc(100% - ${NOTCH}px), 10px ${NOTCH}px, 10px ${NOTCH}px`,
    maskSize: `16px ${NOTCH}px, 100% calc(100% - ${NOTCH}px), 10px ${NOTCH}px, 10px ${NOTCH}px`,
    WebkitMaskRepeat: "repeat-x, no-repeat, no-repeat, no-repeat",
    maskRepeat: "repeat-x, no-repeat, no-repeat, no-repeat",
    WebkitMaskPosition: "top center, bottom, top left, top right",
    maskPosition: "top center, bottom, top left, top right",
  } as const;

  return (
    <div
      className={`relative overflow-hidden rounded-band bg-card ${className}`}
      style={tornEdge}
    >
      {children}
    </div>
  );
}
