import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </SessionProvider>
  );
}
