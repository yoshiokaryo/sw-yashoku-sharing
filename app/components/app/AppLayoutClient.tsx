"use client";

import { AppHeader } from "./AppHeader";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="min-h-[60vh] p-4">{children}</main>
    </>
  );
}
