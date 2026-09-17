/**
 * Sidebar: the library's tree, pinned left like Storybook's explorer. Groups
 * are caps labels; the active page is clay-deep with the app's 2px tick
 * (§1.7). On narrow screens it folds into a native <details> above the page.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./nav";

function Item({ href, name }: { href: string; name: string }) {
  const path = usePathname();
  const on = path === href;
  return (
    <li>
      <Link
        href={href}
        aria-current={on ? "page" : undefined}
        className={`relative block py-1 pl-4 font-sans text-label ${
          on ? "font-semibold text-clay-deep" : "text-ink/70 hover:text-ink"
        }`}
      >
        {on && (
          <span aria-hidden className="absolute bottom-1 left-0 top-1 w-[2px] rounded-r-stamp bg-clay-deep" />
        )}
        {name}
      </Link>
    </li>
  );
}

function Tree() {
  return (
    <nav aria-label="Design system">
      <ul className="mb-4">
        <Item href="/design" name="Overview" />
      </ul>
      {NAV.map((g) => (
        <div key={`${g.base}/${g.name}`} className="mb-4">
          <p className="mb-1 pl-4 font-sans text-caps uppercase text-ink/62">
            {g.name}
          </p>
          <ul>
            {g.items.map((i) => (
              <Item key={i.slug} href={`${g.base}/${i.slug}`} name={i.name} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <>
      {/* wide: pinned, scrolls on its own */}
      <aside className="hidden border-r border-ink/7 lg:block">
        <div className="sticky top-0 h-dvh overflow-y-auto px-4 py-8">
          <div className="mb-6 pl-4">
            <p className="font-sans text-caps uppercase text-ink/62">
              Craft Your Money
            </p>
            <p className="mt-1 font-serif text-figure-xs text-ink">Design system</p>
          </div>
          <Tree />
        </div>
      </aside>
      {/* narrow: folds above the page */}
      <details className="border-b border-ink/7 px-6 py-3 lg:hidden">
        <summary className="cursor-pointer list-none font-sans text-label-strong text-clay-deep">
          Design system · contents
        </summary>
        <div className="pt-4">
          <Tree />
        </div>
      </details>
    </>
  );
}
