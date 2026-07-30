/**
 * CurrencyContext — carries the account's currency (symbol + placement) to every
 * client component that shows money, so none of them hardcodes "£". Resolved
 * once in the root layout (server) and provided here (client).
 *
 * Server components can't read this; they resolve the currency locally from
 * settings and format money inline with formatMoney().
 */
"use client";

import { createContext, useContext, type ReactNode } from "react";
import { GBP_CUR, type Cur } from "@/lib/currency";

const CurrencyContext = createContext<Cur>(GBP_CUR);

export function CurrencyProvider({ cur, children }: { cur: Cur; children: ReactNode }) {
  return <CurrencyContext.Provider value={cur}>{children}</CurrencyContext.Provider>;
}

/** The account currency — { symbol, suffix }. Pair with formatMoney(). */
export function useCurrency(): Cur {
  return useContext(CurrencyContext);
}
