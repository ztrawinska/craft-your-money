/**
 * CurrencyContext — carries the account's currency symbol to every client
 * component that shows money, so none of them hardcodes "£". The symbol is
 * resolved once in the root layout (server) and provided here (client).
 *
 * Server components can't read this; they resolve the symbol locally from
 * settings and format money inline.
 */
"use client";

import { createContext, useContext, type ReactNode } from "react";

const CurrencyContext = createContext<string>("£");

export function CurrencyProvider({
  symbol,
  children,
}: {
  symbol: string;
  children: ReactNode;
}) {
  return <CurrencyContext.Provider value={symbol}>{children}</CurrencyContext.Provider>;
}

/** The account currency symbol (a prefix: £, €, zł, …). */
export function useCurrency(): string {
  return useContext(CurrencyContext);
}
