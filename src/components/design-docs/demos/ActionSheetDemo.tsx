"use client";

import { useState } from "react";
import { Archive, Copy, Ellipsis, Trash2 } from "lucide-react";
import { ActionSheet, type SheetAction } from "@/components/ActionSheet";

/**
 * The real ActionSheet, opened from a ⋯ button: two constructive actions
 * together, one hairline, then the destructive one with its inline confirm.
 */
export function ActionSheetDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  const actions: SheetAction[] = [
    { id: "duplicate", label: "Duplicate", icon: <Copy size={18} strokeWidth={1.6} />, onSelect: () => setLast("Duplicated") },
    {
      id: "archive",
      label: "Archive",
      sublabel: "Stop making it, keep the record",
      icon: <Archive size={18} strokeWidth={1.6} />,
      onSelect: () => setLast("Archived"),
    },
    {
      id: "delete",
      label: "Delete",
      sublabel: "Gone for good",
      icon: <Trash2 size={18} strokeWidth={1.6} />,
      danger: true,
      onSelect: () => setLast("Deleted"),
      confirm: {
        title: "Delete Selene hammered band?",
        body: "This removes the product and its costs permanently. If you just want it out of the range, Archive keeps the record.",
        confirmLabel: "Delete it",
      },
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-serif text-[16px] font-medium text-ink">Selene hammered band</p>
        <p className="mt-1 font-sans text-[12px] text-ink/62">
          {last ? `Last action: ${last}` : "Ring"}
        </p>
      </div>
      <button
        type="button"
        aria-label="More actions"
        onClick={() => setOpen(true)}
        className="flex size-tap items-center justify-center rounded-[7px] text-ink/62"
      >
        <Ellipsis size={20} strokeWidth={1.8} />
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} actions={actions} />
    </div>
  );
}
