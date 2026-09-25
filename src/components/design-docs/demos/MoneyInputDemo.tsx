"use client";

import { useState } from "react";
import { FieldLabel, MoneyInput } from "@/components/inline-form";
import { Input } from "@/components/ui/input";

/**
 * The money field, live: type digits and watch the pennies fill from the
 * right. There is no separator key to press; the decimal point is painted on.
 */
export function MoneyInputDemo() {
  const [cost, setCost] = useState("");
  const [qty, setQty] = useState("4");
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <FieldLabel>Cost per g</FieldLabel>
        <MoneyInput value={cost} onChange={setCost} />
      </div>
      <div>
        <FieldLabel>Quantity</FieldLabel>
        <div className="relative">
          <Input
            inputMode="decimal"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="pr-8 font-serif tabular-nums"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-sans text-label-sm text-ink/62">
            g
          </span>
        </div>
      </div>
      <p className="col-span-2 font-sans text-body-sm text-ink/62 tabular-nums">
        Money field holds {cost === "" ? "nothing yet (reads as empty)" : `"${cost}"`}. Try typing
        5, 6, 8, 0.
      </p>
    </div>
  );
}
