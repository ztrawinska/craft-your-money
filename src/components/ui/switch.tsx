/**
 * Switch — a two-state toggle (e.g. Settings "I'm VAT registered").
 *
 * A shadcn/Radix primitive under the hood, so keyboard control and ARIA come
 * for free. Re-skinned to the Craft Your Money look, pixel-for-pixel with the
 * old hand-built version: clay-deep when on, ink/14 when off, a flat knob with
 * no shadow. The accent sits on the control because the toggle IS an action.
 *
 * We keep using the real `bg-clay-deep` / `bg-ink/14` utilities (not the
 * shadcn `--primary` token) so it matches the design system exactly. The only
 * addition is a keyboard-only focus ring — invisible during mouse use, so the
 * resting UI is unchanged; it just makes the control reachable by Tab.
 *
 * Radix API (differs from the old component): use `checked` + `onCheckedChange`
 * (not `onChange`), and give it a name via `aria-label` or a linked <label>.
 */
"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "relative inline-flex h-[26px] w-[44px] shrink-0 cursor-pointer items-center rounded-full outline-none transition-colors",
        "data-[state=checked]:bg-clay-deep data-[state=unchecked]:bg-ink/14",
        "focus-visible:ring-2 focus-visible:ring-clay/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-[20px] w-[20px] rounded-full bg-[#FDFBF9] transition-transform",
          "data-[state=checked]:translate-x-[21px] data-[state=unchecked]:translate-x-[3px]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
