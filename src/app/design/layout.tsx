/**
 * /design: the live library. A wider shell than the app (docs are read on a
 * desk, the app on a phone), on the same page colour and fonts, with the same
 * discipline: flat, hairlines only, one accent. The section nav sits left on
 * wide screens and stacks above on narrow ones. No bottom nav: this is not a
 * screen in the product.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { DocsNav } from "@/components/design-docs/DocsNav";
import { DESIGN_SYSTEM_DOC, repo } from "@/components/design-docs/links";

export const metadata: Metadata = {
  title: "Design system · Craft Your Money",
};

export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 pb-24 pt-10">
      <header className="mb-8 border-b border-ink/14 pb-6">
        <p className="mb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/42">
          <Link href="/" className="hover:text-clay-deep">
            Craft Your Money
          </Link>
        </p>
        <h1 className="font-serif text-[27px] font-medium leading-[1.16] text-ink">
          Design system
        </h1>
        <p className="mt-2 max-w-[62ch] font-sans text-[13px] font-light leading-[1.6] text-ink/70">
          The live library: every value here is read from the code, every component is the real one.
          The reasoning lives in{" "}
          <a
            href={DESIGN_SYSTEM_DOC}
            className="text-clay-deep underline decoration-clay/50 decoration-dotted underline-offset-4"
          >
            design-system.md
          </a>
          , the behaviour in{" "}
          <a
            href={repo("docs/craft-your-money-prd-v2.md")}
            className="text-clay-deep underline decoration-clay/50 decoration-dotted underline-offset-4"
          >
            the PRD
          </a>
          .
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-12">
        <aside className="mb-6 lg:mb-0">
          <div className="lg:sticky lg:top-8">
            <DocsNav />
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
