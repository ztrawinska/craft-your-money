"use client";

import { useState } from "react";
import { Combobox, type ComboOption } from "@/components/Combobox";
import { FieldLabel } from "@/components/inline-form";

const LIBRARY: ComboOption[] = [
  { id: "1", label: "Sterling silver sheet", hint: "£0.94 / g" },
  { id: "2", label: "Sterling silver wire", hint: "£1.02 / g" },
  { id: "3", label: "14ct gold wire", hint: "£48.00 / g" },
  { id: "4", label: "Freshwater pearl", hint: "£2.40 / ea" },
  { id: "5", label: "Jump ring, 5mm", hint: "£0.08 / ea" },
];

/**
 * The autofill, live: focus the field to see the whole library, type to filter
 * it, and watch "Use as new" appear the moment there is something to name.
 * Picking fills the field; nothing below the input moves as the list opens.
 */
export function ComboboxDemo() {
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <FieldLabel>Material</FieldLabel>
        <Combobox
          value={text}
          options={LIBRARY}
          onType={(v) => {
            setText(v);
            setPicked(null);
          }}
          onPick={(o) => {
            setText(o.label);
            setPicked(`picked “${o.label}” from the library`);
          }}
          onUseAsNew={() => setPicked(`“${text}” will be saved as a new material`)}
          placeholder="e.g. Sterling silver sheet"
        />
      </div>
      <p className="font-sans text-body-sm text-ink/62">
        {picked ?? "Focus the field for the whole library; type to filter it."}
      </p>
    </div>
  );
}
