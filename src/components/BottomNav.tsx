/**
 * BottomNav — the app's primary chrome (design system §2.10).
 *
 *   Home · Products · [+] · Materials · Costs
 *
 * The icons are neutral Lucide (house, tag, layers, wallet, plus): a candlemaker
 * would read them identically. That's the point — chrome carries no category
 * signal, so the product ports to any craft without redrawing navigation.
 * Jewelry lives only in content.
 *
 * The centre "+" is always "new product": a flat clay square, bottom-aligned
 * with the tabs. No lift, no shadow, no floating action button.
 */
import Link from "next/link";
import { House, Tag, Layers, Wallet, Plus, type LucideIcon } from "lucide-react";

export type NavKey = "home" | "products" | "materials" | "costs";

type NavItem = { key: NavKey; label: string; href: string; Icon: LucideIcon };

const LEFT: NavItem[] = [
  { key: "home", label: "Home", href: "/dashboard", Icon: House },
  { key: "products", label: "Products", href: "/products", Icon: Tag },
];
const RIGHT: NavItem[] = [
  { key: "materials", label: "Materials", href: "/materials", Icon: Layers },
  { key: "costs", label: "Costs", href: "/costs", Icon: Wallet },
];

function Tab({ item, active }: { item: NavItem; active?: NavKey }) {
  const on = item.key === active;
  const { Icon } = item;
  return (
    <Link
      href={item.href}
      className="relative flex flex-1 flex-col items-center justify-end gap-[5px] px-2.5"
    >
      {on && (
        <span className="absolute -top-[11px] left-1/2 h-0.5 w-[22px] -translate-x-1/2 rounded-b-[2px] bg-clay-deep" />
      )}
      <Icon
        size={22}
        strokeWidth={1.6}
        className={on ? "text-clay-deep" : "text-ink/42"}
      />
      <span
        className={`text-[9px] ${
          on ? "font-semibold text-clay-deep" : "font-medium text-ink/42"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}

export function BottomNav({ active }: { active?: NavKey }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-ink/7 bg-page">
      <div className="mx-auto flex max-w-[430px] items-end justify-around px-2 pb-3.5 pt-[11px]">
        {LEFT.map((item) => (
          <Tab key={item.key} item={item} active={active} />
        ))}
        <div className="flex flex-1 items-end justify-center">
          <Link
            href="/products/new"
            aria-label="New product"
            className="mb-px flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-clay-deep"
          >
            <Plus size={19} strokeWidth={1.9} className="text-[#FDFBF9]" />
          </Link>
        </div>
        {RIGHT.map((item) => (
          <Tab key={item.key} item={item} active={active} />
        ))}
      </div>
    </nav>
  );
}
