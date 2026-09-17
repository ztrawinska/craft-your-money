"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

/** Two live switches, so the on/off transition can be seen, not described. */
export function SwitchDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center justify-between gap-4 font-sans text-label text-ink">
        VAT registered
        <Switch checked={a} onCheckedChange={setA} aria-label="VAT registered" />
      </label>
      <label className="flex items-center justify-between gap-4 font-sans text-label text-ink">
        Share business costs per piece
        <Switch checked={b} onCheckedChange={setB} aria-label="Share business costs per piece" />
      </label>
    </div>
  );
}
