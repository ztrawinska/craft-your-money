/**
 * Rules: the two or three sentences that decide how a component is used, and
 * the things it must never become. One line each; the reasoning is in the doc.
 */
import type { ReactNode } from "react";

export function Rules({
  title = "Rules",
  items,
}: {
  title?: string;
  items: ReactNode[];
}) {
  return (
    <div className="mt-6">
      <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/42">
        {title}
      </p>
      <ul className="max-w-[62ch] space-y-1.5 font-sans text-[13.5px] font-light leading-[1.55] text-ink/70">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5">
            <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-ink/30" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Built on shadcn/ui X": the primitive underneath, and what it contributes. */
export function BuiltOn({
  name,
  href,
  note,
}: {
  name: string;
  href: string;
  note?: string;
}) {
  return (
    <p className="mt-6 font-sans text-[13px] font-light text-ink/70">
      <span className="font-medium text-ink">Built on</span>{" "}
      <a
        href={href}
        className="text-clay-deep underline decoration-clay/50 decoration-dotted underline-offset-4"
      >
        shadcn/ui {name}
      </a>
      {note && <span className="text-ink/55">. {note}</span>}
    </p>
  );
}

/** A small-caps label above a group of specimens. */
export function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 mt-7 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/42 first:mt-0">
      {children}
    </p>
  );
}
