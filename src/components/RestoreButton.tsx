/**
 * RestoreButton — the verb-link on an archived row. Brings a product back to
 * the range (§2.3: acts in place, so a leading rotate-ccw icon, not a chevron).
 */
"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { restoreProductAction } from "@/app/products/actions";

export function RestoreButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => restoreProductAction(id))}
      className="inline-flex items-center gap-1 font-sans text-label-bold text-clay-deep"
    >
      <RotateCcw size={14} strokeWidth={2} />
      Restore
    </button>
  );
}
