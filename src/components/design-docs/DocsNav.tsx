/**
 * DocsNav: the library's four pages. Active page in clay-deep with the same
 * 2px tick the app's bottom nav uses (§1.7: "this is where you are"), so the
 * documentation speaks the app's visual language rather than a generic one.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/design", label: "Overview" },
  { href: "/design/tokens", label: "Tokens" },
  { href: "/design/components", label: "Components" },
  { href: "/design/patterns", label: "Patterns" },
] as const;

export function DocsNav() {
  const path = usePathname();
  return (
    <nav aria-label="Design system pages" className="flex gap-1 lg:flex-col">
      {PAGES.map((p) => {
        const on = p.href === "/design" ? path === "/design" : path.startsWith(p.href);
        return (
          <Link
            key={p.href}
            href={p.href}
            aria-current={on ? "page" : undefined}
            className={`relative px-3 py-2 font-sans text-[13.5px] lg:px-0 lg:py-1.5 ${
              on ? "font-semibold text-clay-deep" : "font-medium text-ink/55 hover:text-ink"
            }`}
          >
            {on && (
              <span
                aria-hidden
                className="absolute left-3 right-3 top-0 h-0.5 rounded-b-[2px] bg-clay-deep lg:bottom-0 lg:left-auto lg:right-auto lg:top-0 lg:-ml-4 lg:h-auto lg:w-0.5 lg:rounded-r-[2px]"
              />
            )}
            {p.label}
          </Link>
        );
      })}
    </nav>
  );
}
