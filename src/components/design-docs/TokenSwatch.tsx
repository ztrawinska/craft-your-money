/**
 * TokenSwatch: one colour token, painted from its own value (read from
 * tokens.json, never typed here), with the names a developer and a designer
 * each reach for: the Tailwind utility, the CSS variable, the hex.
 */
export function TokenSwatch({
  name,
  value,
  utility,
  cssVar,
  description,
}: {
  name: string;
  value: string;
  utility: string;
  cssVar: string;
  description?: string;
}) {
  return (
    <div className="flex gap-4">
      <div
        aria-hidden
        className="size-[56px] shrink-0 rounded-band border border-ink/14"
        style={{ backgroundColor: value }}
      />
      <div className="min-w-0 font-sans">
        <p className="text-[14px] font-medium text-ink">{name}</p>
        <p className="mt-1 font-mono text-[11.5px] text-ink/62 tabular-nums">
          {value.toUpperCase()} · {utility} · {cssVar}
        </p>
        {description && (
          <p className="mt-1 text-[12.5px] font-light leading-[1.5] text-ink/70">{description}</p>
        )}
      </div>
    </div>
  );
}
