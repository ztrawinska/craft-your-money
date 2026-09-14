/**
 * DocSection: one entry in the library. A heading with an anchor, then the
 * pointers that keep this page honest: which section of the design-system doc
 * holds the *why*, and which file holds the code. The library itself never
 * restates the rationale; it shows the thing and links to the reasoning.
 */
import type { ReactNode } from "react";
import { DESIGN_SYSTEM_DOC, repo } from "./links";

type DocSectionProps = {
  id: string;
  title: string;
  /** The design-system.md section, e.g. "§2.1". */
  spec?: string;
  /** Source file(s), repo-relative, e.g. "src/components/Chip.tsx". */
  source?: string | string[];
  /** One line under the title: what this is, in plain words. */
  lede?: ReactNode;
  children: ReactNode;
};

export function DocSection({ id, title, spec, source, lede, children }: DocSectionProps) {
  const sources = source ? (Array.isArray(source) ? source : [source]) : [];
  return (
    <section id={id} className="scroll-mt-6 border-t border-ink/7 py-8">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-serif text-[22px] font-medium leading-tight text-ink">
          <a href={`#${id}`} className="hover:text-clay-deep">
            {title}
          </a>
        </h2>
        <p className="font-sans text-[11.5px] text-ink/55">
          {spec && (
            <a
              href={DESIGN_SYSTEM_DOC}
              className="text-clay-deep underline decoration-clay/50 decoration-dotted underline-offset-4"
            >
              design-system.md {spec}
            </a>
          )}
          {spec && sources.length > 0 && " · "}
          {sources.map((s, i) => (
            <span key={s}>
              {i > 0 && " · "}
              <a
                href={repo(s)}
                className="text-clay-deep underline decoration-clay/50 decoration-dotted underline-offset-4"
              >
                {s.replace(/^src\//, "")}
              </a>
            </span>
          ))}
        </p>
      </div>
      {lede && (
        <p className="mb-6 max-w-[62ch] font-sans text-[15px] font-light leading-[1.7] text-ink/70">
          {lede}
        </p>
      )}
      {children}
    </section>
  );
}
