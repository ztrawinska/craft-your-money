/**
 * Switch — a two-state toggle (e.g. Settings "I'm VAT registered").
 *
 * Clay when on, ink when off — the toggle IS an action, so it wears the accent.
 * Flat: the knob has no shadow. Controlled; the parent owns the boolean.
 */
"use client";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name — the visible label usually sits beside it in the row. */
  label?: string;
};

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-clay-deep" : "bg-ink/14"
      }`}
    >
      <span
        className={`inline-block h-[20px] w-[20px] rounded-full bg-[#FDFBF9] transition-transform ${
          checked ? "translate-x-[21px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
