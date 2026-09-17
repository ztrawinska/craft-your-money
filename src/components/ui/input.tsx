import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input — the shared text/number field, on shadcn's Input primitive.
 *
 * Re-skinned to the exact Craft Your Money field style (this replaced the
 * `fieldInput` className that used to live in inline-form): page background,
 * ink-14 border, a clay focus ring, and 16px text — the 16px stops iOS from
 * auto-zooming on focus (§2.12). Callers extend via `className`: right-align,
 * font-serif, a fixed width, or padding to make room for a currency symbol.
 *
 * A plain <input> has no interactive behaviour for a library to add, so this is
 * purely the one place the field's look lives — change it here, every field
 * follows.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-input border border-ink/14 bg-page px-3 py-2 min-h-tap text-value text-ink outline-none focus:border-clay focus:ring-[3px] focus:ring-clay/12",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
