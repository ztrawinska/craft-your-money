/**
 * Collapse — a subtle open/close for the app's inline disclosures ("how this is
 * figured", "market benchmark"). It animates height AND opacity together, so the
 * content eases open rather than snapping in.
 *
 * The height animation uses the CSS grid `0fr → 1fr` trick: the content always
 * renders inside a grid row whose track grows from 0 to its natural size, which
 * the browser can interpolate — no JS height measuring, no layout jank. When
 * closed the inner wrapper is `inert`, so hidden content stays out of tab order
 * and the accessibility tree. Motion is dropped entirely under
 * prefers-reduced-motion (the reveal is instant, never absent).
 */
import type { ReactNode } from "react";

export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden" inert={open ? undefined : true}>
        {children}
      </div>
    </div>
  );
}
