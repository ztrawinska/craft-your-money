/**
 * IrisSheet — the one surface every AI/iris interaction opens into (§2.9).
 *
 * A bottom sheet, not an inline inset: iris left the pricing block's framed
 * surface, so there's no iris left-rule and no iris wash here. The sheet itself
 * is a neutral drawer (same family as the action sheet and the benchmark
 * drawer); iris shows only on the sanctioned marks — the glint and the label in
 * this header, plus the finding numerals and follow-up chips the body renders.
 * That keeps the rule honest: iris marks *who is speaking*, never the surface.
 *
 * Presentational shell only — the caller owns open state (so a fetch can fire
 * on open) and the body.
 */
"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Glint } from "@/components/Glint";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function IrisSheet({
  label,
  trigger,
  children,
  open,
  onOpenChange,
  busy = false,
}: {
  /** Header label beside the glint — "Price check", "Ask about your prices". */
  label: string;
  /** The entry-point element (an AssistantSlot); becomes the sheet trigger. */
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Pulse the glint while the model is working. */
  busy?: boolean;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="pb-6">
        {/* iris header — glint + label (who's speaking) + dismiss */}
        <div className="flex items-center gap-2 px-6 pb-3 pt-1">
          <Glint className={`h-[15px] w-[15px] shrink-0 ${busy ? "animate-pulse" : ""}`} />
          <DrawerTitle className="flex-1 text-left font-sans text-label-strong text-iris-deep">
            {label}
          </DrawerTitle>
          <DrawerClose aria-label="Dismiss" className="text-ink/62">
            <X size={18} />
          </DrawerClose>
        </div>
        <div className="max-h-[68vh] overflow-y-auto px-6">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
