/** Previous / next page, in sidebar order. */
import Link from "next/link";
import { neighbours } from "./nav";

export function DocFooter({ href }: { href: string }) {
  const { prev, next } = neighbours(href);
  if (!prev && !next) return null;
  return (
    <div className="mt-16 flex justify-between border-t border-ink/14 pt-5 font-sans text-[13px]">
      <span>
        {prev && (
          <Link href={prev.href} className="text-clay-deep">
            ‹ {prev.name}
          </Link>
        )}
      </span>
      <span>
        {next && (
          <Link href={next.href} className="text-clay-deep">
            {next.name} ›
          </Link>
        )}
      </span>
    </div>
  );
}
