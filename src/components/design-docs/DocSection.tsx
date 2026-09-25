/**
 * DocSection: a titled block in the library. As `page`, it is the page's own
 * heading (h1, no rule above); otherwise a section on a longer page (h2 with
 * a hairline above). Under the title: which section of the design-system doc
 * holds the rationale, and which file holds the code.
 */
import type { ReactNode } from "react";
import { DESIGN_SYSTEM_DOC, repo } from "./links";
import { docLink } from "./styles";

type DocSectionProps = {
  id: string;
  title: string;
  /** The design-system.md section, e.g. "§2.1". */
  spec?: string;
  /** Source file(s), repo-relative, e.g. "src/components/Chip.tsx". */
  source?: string | string[];
  /** One or two plain sentences: what it is and what it is for. */
  lede?: ReactNode;
  /** Render as the page heading instead of a section. */
  page?: boolean;
  children: ReactNode;
};

export function DocSection({ id, title, spec, source, lede, page = false, children }: DocSectionProps) {
  const sources = source ? (Array.isArray(source) ? source : [source]) : [];
  const Heading = page ? "h1" : "h2";
  const meta = (spec || sources.length > 0) && (
    <p className="font-sans text-label-sm text-ink/62">
      {spec && (
        <a href={DESIGN_SYSTEM_DOC} className={docLink}>
          design-system.md {spec}
        </a>
      )}
      {spec && sources.length > 0 && " · "}
      {sources.map((s, i) => (
        <span key={s}>
          {i > 0 && " · "}
          <a href={repo(s)} className={docLink}>
            {s.replace(/^src\//, "")}
          </a>
        </span>
      ))}
    </p>
  );

  return (
    <section id={id} className={page ? "" : "scroll-mt-6 border-t border-ink/7 py-8"}>
      <div className={page ? "mb-6" : "mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"}>
        <Heading
          className={`font-serif text-ink ${page ? "text-title" : "text-figure-xs"}`}
        >
          {page ? title : (
            <a href={`#${id}`} className="hover:text-clay-deep">
              {title}
            </a>
          )}
        </Heading>
        {page ? <div className="mt-2">{meta}</div> : meta}
        {page && lede && (
          <p className="mt-3 max-w-[62ch] font-sans text-body text-ink/70">
            {lede}
          </p>
        )}
      </div>
      {!page && lede && (
        <p className="mb-6 max-w-[62ch] font-sans text-body text-ink/70">
          {lede}
        </p>
      )}
      {children}
    </section>
  );
}
