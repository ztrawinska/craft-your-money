/**
 * TintedBand — quiet emphasis for briefings and insight strips (design §2.8).
 *
 * The background sits *very* close to the page (`ink` at 3.5%), deliberately
 * lighter than a cream fill, which read as shouting. It holds prose, never
 * numbers-as-heroes. If the band draws the eye before its content does, it's
 * too strong.
 */
import type { ReactNode } from "react";

type TintedBandProps = {
  children: ReactNode;
  className?: string;
};

export function TintedBand({ children, className = "" }: TintedBandProps) {
  return (
    <div className={`rounded-[8px] bg-ink/[0.035] px-4 py-4 ${className}`}>
      {children}
    </div>
  );
}
