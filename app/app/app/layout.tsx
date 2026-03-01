import { AppLayoutClient } from "@/components/app/AppLayoutClient";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
