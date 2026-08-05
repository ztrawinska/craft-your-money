/**
 * Glint — the iris mark (design system §2.9). The one glyph that means "a model
 * is involved". Centralised here so every iris surface draws the exact same
 * shape; it never appears without a model genuinely behind it.
 */
export const GLINT_PATH =
  "M12 3 Q13.6 9.4 21 12 Q13.6 14.6 12 21 Q10.4 14.6 3 12 Q10.4 9.4 12 3 Z";

export function Glint({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`fill-iris ${className}`}>
      <path d={GLINT_PATH} />
    </svg>
  );
}
