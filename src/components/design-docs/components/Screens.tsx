import { DocSection } from "@/components/design-docs/DocSection";
import { repo } from "@/components/design-docs/links";
import { docLink } from "@/components/design-docs/styles";

export function ScreensDoc() {
  return (
    <DocSection page
      id="screens"
      title="In the app"
      lede="Screen-level components need product data, the store or a model, so they are linked to the app instead of demoed."
    >
      <ul className="max-w-[70ch] divide-y divide-ink/7 font-sans text-label">
        {[
          ["PricingPanel", "The interactive pricing block: calculated price, your price, VAT, the warning, the profit and its chip.", "/products", "src/components/PricingPanel.tsx"],
          ["EditableProfit", "The profit figure you can type into; the price back-solves.", "/products", "src/components/EditableProfit.tsx"],
          ["ProductEditor · MaterialsEditor · CostsEditor", "The inline-form pattern: rows expand in place, save gated until valid, delete confirms inline.", "/products", "src/components/ProductEditor.tsx"],
          ["HeroProfit", "The dashboard's one figure, with a count-up and the how-this-is-figured reveal.", "/dashboard", "src/components/HeroProfit.tsx"],
          ["NeedsAttention", "Count plus Review; the full list lives in the sheet it opens.", "/dashboard", "src/components/NeedsAttention.tsx"],
          ["StatusFilter · TypeFilter", "The Dropdown trigger opening a Drawer of options that navigate by query string.", "/products", "src/components/StatusFilter.tsx"],
          ["Combobox · CurrencySelect", "Type-to-search fields: the one sanctioned floating panel, a shadcn Popover that never steals focus.", "/settings", "src/components/Combobox.tsx"],
          ["BenchmarkSection", "The market benchmark reveal on the product detail.", "/products", "src/components/BenchmarkSection.tsx"],
          ["PriceCheck · AskIrisTeaser", "The two real iris sheets: a model-written review, and the honest teaser for the coach.", "/dashboard", "src/components/PriceCheck.tsx"],
        ].map(([name, what, href, path]) => (
          <li key={name} className="grid gap-x-6 gap-y-1 py-3 md:grid-cols-[260px_minmax(0,1fr)]">
            <div>
              <p className="font-medium text-ink">{name}</p>
              <p className="mt-1 font-mono text-meta">
                <a href={repo(path)} className={docLink}>
                  {path.replace("src/components/", "")}
                </a>
              </p>
            </div>
            <p className="text-body text-ink/70">
              {what}{" "}
              <a href={href} className={docLink}>
                open {href}
              </a>
            </p>
          </li>
        ))}
      </ul>
    </DocSection>
  );
}
