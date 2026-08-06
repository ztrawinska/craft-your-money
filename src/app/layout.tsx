import type { Metadata } from "next";
import { Lora, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/CurrencyContext";
import { currencyCur } from "@/lib/currency";
import { getSettings } from "@/lib/store";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  // 300 (light) drives the quiet meta/body copy; italic is used for hints
  // and the "all on target" state.
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Craft Your Money",
  description: "Craft Your Money",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolve the account currency once, provide it to the whole tree.
  const cur = currencyCur((await getSettings()).currency);
  return (
    <html
      lang="en"
      className={`${lora.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-page text-ink font-sans">
        <CurrencyProvider cur={cur}>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
