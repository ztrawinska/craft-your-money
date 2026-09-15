/**
 * /design: the live library. Sidebar left (pinned), one page per entry on
 * the right. Same page colour and fonts as the app; no bottom nav.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/design-docs/Sidebar";

export const metadata: Metadata = {
  title: "Design system · Craft Your Money",
};

export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <Sidebar />
      <main className="min-w-0 px-6 pb-24 pt-8 lg:px-12 lg:pt-10">
        <div className="max-w-[880px]">{children}</div>
      </main>
    </div>
  );
}
