/**
 * RadioCards — a small set of rich, mutually-exclusive options as cards, each
 * with a title and a line of explanation (e.g. the business-cost allocation
 * method: per-unit vs bench-time).
 *
 * The selected card wears the clay accent (border + wash); the rest are plain
 * outlines. Real radios underneath, so it works without JS and reads to screen
 * readers as one group.
 */
"use client";

export type CardOption = { value: string; title: string; description: string };

type RadioCardsProps = {
  name: string;
  options: CardOption[];
  value: string;
  onChange: (value: string) => void;
};

export function RadioCards({ name, options, value, onChange }: RadioCardsProps) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <label
            key={o.value}
            className={`cursor-pointer rounded-[8px] border p-4 ${
              selected ? "border-clay-deep bg-clay/7" : "border-ink/14"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={selected}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <p className="font-sans text-[14px] font-medium text-ink">{o.title}</p>
            <p className="mt-1 font-sans text-[12px] font-light leading-[1.5] text-ink/55">
              {o.description}
            </p>
          </label>
        );
      })}
    </div>
  );
}
