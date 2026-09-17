/**
 * New product (/products/new) — the start of the add-and-price flow (PRD §5).
 *
 * A product is a valid placeholder draft the moment it has a name; type is
 * optional. This is a plain server-rendered form posting to a Server Action,
 * which creates the draft and redirects to /products/[id] to add costs. No JS
 * required to work — the name field is `required`, the type pills are radios.
 */
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Input } from "@/components/ui/input";
import { PRODUCT_TYPES } from "@/lib/products";
import { createProductAction } from "@/app/products/actions";

export default function NewProduct() {
  return (
    <main className="mx-auto w-full max-w-[430px] pb-24">
      {/* header */}
      <div className="flex items-center justify-between px-6 pt-5">
        <Link
          href="/products"
          aria-label="Back"
          className="-ml-3 flex size-tap items-center justify-center text-ink/62"
        >
          <ChevronLeft size={22} strokeWidth={2} />
        </Link>
        <span />
        <span className="w-[18px]" />
      </div>

      {/* identity */}
      <div className="px-6 pb-2 pt-5">
        <p className="mb-2 text-caps uppercase text-clay-deep">
          New product
        </p>
        <h1 className="font-serif text-title">
          What are you making?
        </h1>
      </div>

      <form action={createProductAction} className="px-6 pt-6">
        <label className="block">
          <span className="mb-1 block text-caps-tight uppercase text-ink/62">
            Name
          </span>
          <Input
            name="name"
            required
            autoFocus
            placeholder="e.g. Hammered silver band"
            className="font-sans"
          />
        </label>

        <fieldset className="mt-6">
          <legend className="mb-2 text-caps-tight uppercase text-ink/62">
            Type <span className="font-normal normal-case tracking-normal text-ink/62">· optional</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_TYPES.map((t) => (
              <label
                key={t}
                className="cursor-pointer rounded-chip border border-ink/14 px-4 py-2 font-sans text-label text-ink/70 has-[:checked]:border-clay-deep has-[:checked]:bg-clay-deep has-[:checked]:text-on-clay"
              >
                <input
                  type="radio"
                  name="type"
                  value={t}
                  defaultChecked={t === "Ring"}
                  className="sr-only"
                />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        <p className="mt-6 text-body-sm text-ink/62">
          Saved as a draft — you&rsquo;ll add costs next.
        </p>

        <div className="mt-4">
          <Button type="submit" variant="primary">
            Create product
          </Button>
        </div>
      </form>
    </main>
  );
}
