/**
 * AssistantSlot — the iris entry point (design system §2.9).
 *
 * The glint means "a model is involved". It never mixes with clay on one
 * element and never touches status colours. Used to OPEN the iris sheet:
 * "Check this price" on the pricing block (centered), "Talk to your pricing
 * coach" on the dashboard (with a trailing chevron).
 *
 * It is always a button now: every iris interaction opens a bottom sheet
 * (§2.9), so the slot is a sheet trigger. It forwards its ref and props, so it
 * drops straight into `<DrawerTrigger asChild>`.
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Glint } from "@/components/Glint";

type AssistantSlotProps = {
  children: ReactNode;
  /** Centered with no trailing chevron (the pricing-block "Check this price"). */
  centered?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const AssistantSlot = forwardRef<HTMLButtonElement, AssistantSlotProps>(
  function AssistantSlot({ children, centered = false, className = "", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={`flex w-full items-center gap-2 rounded-band border border-iris/30 bg-iris/[0.06] px-4 py-row font-sans disabled:opacity-55 ${
          centered ? "justify-center" : ""
        } ${className}`}
        {...rest}
      >
        <Glint className="h-[15px] w-[15px] shrink-0" />
        <span className={`text-label-strong text-iris-deep ${centered ? "" : "flex-1 text-left"}`}>
          {children}
        </span>
        {!centered && <ChevronRight size={15} className="text-iris-deep" />}
      </button>
    );
  },
);
