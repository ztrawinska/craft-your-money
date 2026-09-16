/**
 * ActionSheet — the ⋯ menu (design system §2.11). A bottom sheet, never a
 * floating popover: page background, a grab handle, full-width 44px+ rows.
 *
 * Built on the shared shadcn Drawer (vaul) primitive, so it gets focus-trap,
 * Escape, drag-to-dismiss and scroll-lock for free — the look and behaviour are
 * unchanged from the hand-built version. The external API (open / onClose /
 * actions) is identical, so callers don't change.
 *
 * Dividers mark a change in kind, not every row — constructive actions sit
 * together, one hairline sets off the destructive one, which is last and red.
 * A destructive confirm swaps the sheet's content in place (never a modal on a
 * modal) and points at the gentler alternative.
 */
"use client";

import { useState, type ReactNode } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

export type SheetAction = {
  id: string;
  label: string;
  sublabel?: string;
  icon: ReactNode;
  danger?: boolean;
  onSelect: () => void;
  /** When set, tapping opens an inline confirm inside the sheet. */
  confirm?: { title: string; body: ReactNode; confirmLabel: string };
};

export function ActionSheet({
  open,
  onClose,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  actions: SheetAction[];
}) {
  const [confirming, setConfirming] = useState<SheetAction | null>(null);

  const close = () => {
    setConfirming(null);
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(next) => !next && close()}>
      <DrawerContent className="pb-4">
        {/* Accessible name for the dialog; the visible headers vary by state. */}
        <DrawerTitle className="sr-only">Actions</DrawerTitle>

        {confirming ? (
          <div className="px-5 pb-1 pt-2">
            <p className="mb-1 font-serif text-[15px] font-medium text-status-red">
              {confirming.confirm!.title}
            </p>
            <p className="mb-4 font-sans text-[12px] font-light leading-[1.55] text-ink/62">
              {confirming.confirm!.body}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirming(null)}
                className="flex-1 rounded-[7px] border border-ink/14 py-3 font-sans text-[13.5px] font-medium text-ink/62"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={() => {
                  const a = confirming;
                  close();
                  a.onSelect();
                }}
                className="flex-1 rounded-[7px] bg-status-red py-3 font-sans text-[13.5px] font-semibold text-on-clay"
              >
                {confirming.confirm!.confirmLabel}
              </button>
            </div>
          </div>
        ) : (
          <>
            {actions.map((a, i) => {
              const firstDanger = a.danger && !(i > 0 && actions[i - 1].danger);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    if (a.confirm) setConfirming(a);
                    else {
                      onClose();
                      a.onSelect();
                    }
                  }}
                  className={`flex w-full items-center gap-3 px-5 py-row text-left font-sans text-[14.5px] font-medium ${
                    a.danger ? "text-status-red" : "text-ink"
                  } ${firstDanger ? "border-t border-ink/7" : ""}`}
                >
                  <span className={a.danger ? "text-status-red" : "text-ink/62"}>{a.icon}</span>
                  <span>
                    {a.label}
                    {a.sublabel && (
                      <span className="mt-1 block text-[11px] font-light text-ink/62">
                        {a.sublabel}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
            <div className="px-5 pt-3">
              <button
                type="button"
                onClick={close}
                className="w-full rounded-[7px] border border-ink/14 py-row font-sans text-[14px] font-medium text-ink/62"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
