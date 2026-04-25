import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden bg-[#F0F2F1]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
