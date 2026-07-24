/**
 * AssistantSlot — the only place iris appears (design system §2.9).
 *
 * The glint means "a model is involved". It never mixes with clay on one
 * element and never touches status colours. Used for AI entry points:
 * "Check this price" on the pricing block (centered), "Ask about your prices"
 * on the dashboard (with a trailing arrow).
 *
 * An entry point only, until it genuinely generates: pass `href` to make it
 * navigate; leave it off for a placeholder that doesn't act yet.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const GLINT_PATH =
  "M12 3 Q13.6 9.4 21 12 Q13.6 14.6 12 21 Q10.4 14.6 3 12 Q10.4 9.4 12 3 Z";

type AssistantSlotProps = {
  children: ReactNode;
  href?: string;
  /** Centered with no trailing arrow (the pricing-block "Check this price"). */
  centered?: boolean;
  className?: string;
};

export function AssistantSlot({
  children,
  href,
  centered = false,
  className = "",
}: AssistantSlotProps) {
  const cls = `flex items-center gap-[9px] rounded-[8px] border border-iris/30 bg-iris/[0.06] px-4 py-[13px] font-sans ${
    centered ? "justify-center" : ""
  } ${className}`;

  const inner = (
    <>
      <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] shrink-0 fill-iris">
        <path d={GLINT_PATH} />
      </svg>
      <span
        className={`text-[13.5px] font-medium text-iris-deep ${
          centered ? "" : "flex-1"
        }`}
      >
        {children}
      </span>
      {!centered && <ArrowRight size={15} className="text-iris-deep" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return <div className={cls}>{inner}</div>;
}
