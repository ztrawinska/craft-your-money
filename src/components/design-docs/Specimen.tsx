/**
 * Specimen: a demo frame the width of the app (430px), so a component is seen
 * at the size and on the ground it actually lives on. The dashed ink/14 frame
 * is the design system's "derived line" (§1.7): it marks the specimen as a
 * documentation device, not a surface in the app.
 */
import type { ReactNode } from "react";

type SpecimenProps = {
  /** The state or variant being shown, e.g. "tone=positive · size=sm". */
  label?: string;
  children: ReactNode;
  /** Remove the inner padding, for full-bleed pieces like the nav. */
  flush?: boolean;
  className?: string;
};

export function Specimen({ label, children, flush = false, className = "" }: SpecimenProps) {
  return (
    <figure className={`min-w-0 ${className}`}>
      <div
        className={`w-full max-w-[430px] rounded-[8px] border border-dashed border-ink/14 ${
          flush ? "overflow-hidden" : "px-6 py-5"
        }`}
      >
        {children}
      </div>
      {label && (
        <figcaption className="mt-2 font-sans text-[11.5px] text-ink/55 tabular-nums">
          {label}
        </figcaption>
      )}
    </figure>
  );
}

/** A row of specimens that wraps on narrow screens. */
export function SpecimenRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-x-6 gap-y-5">{children}</div>;
}
