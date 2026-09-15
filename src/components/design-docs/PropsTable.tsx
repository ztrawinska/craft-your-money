/**
 * PropsTable: a component's API in four columns. Types are written as the
 * union the code declares, so the table is a mirror of the file, not a
 * paraphrase.
 */
export type PropRow = {
  name: string;
  type: string;
  default?: string;
  meaning: string;
};

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="mt-7 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse font-sans text-[13px]">
        <thead>
          <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/62">
            <th className="border-b border-ink/14 py-2 pr-4 font-semibold">Prop</th>
            <th className="border-b border-ink/14 py-2 pr-4 font-semibold">Type</th>
            <th className="border-b border-ink/14 py-2 pr-4 font-semibold">Default</th>
            <th className="border-b border-ink/14 py-2 font-semibold">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="align-top">
              <td className="border-b border-ink/7 py-2.5 pr-4 font-mono text-[12.5px] text-ink">
                {r.name}
              </td>
              <td className="border-b border-ink/7 py-2.5 pr-4 font-mono text-[12px] text-ink/70">
                {r.type}
              </td>
              <td className="border-b border-ink/7 py-2.5 pr-4 font-mono text-[12px] text-ink/62">
                {r.default ?? ""}
              </td>
              <td className="border-b border-ink/7 py-2.5 font-light leading-[1.5] text-ink/70">
                {r.meaning}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
