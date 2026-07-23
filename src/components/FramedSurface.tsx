/**
 * FramedSurface — the ONE enclosed area allowed per screen (design §2.7).
 *
 * On Product Detail this is the pricing block: the single place a decision
 * happens. It is the only white surface on an otherwise flat, page-coloured
 * screen. The 3px clay top rule is the same "this is where you decide" device
 * as the clay tick above the active nav tab, at a different scale.
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
  return (
    <div
      className={`relative overflow-hidden rounded-[8px] border border-clay/34 bg-card ${className}`}
    >
      {/* the clay top rule */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-clay" />
      {children}
    </div>
  );
}
