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
  /** Shrink to the content (a chip, a link) instead of the app's 430px. */
  inline?: boolean;
  className?: string;
};

export function Specimen({
  label,
  children,
  flush = false,
  inline = false,
  className = "",
}: SpecimenProps) {
  return (
    <figure className={`min-w-0 ${inline ? "" : "w-full max-w-[430px]"} ${className}`}>
      <div
        className={`rounded-band border border-dashed border-ink/14 ${
          flush ? "overflow-hidden" : "px-6 py-5"
        }`}
      >
        {children}
      </div>
      {label && (
        <figcaption className="mt-2 font-sans text-meta text-ink/62 tabular-nums">
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
