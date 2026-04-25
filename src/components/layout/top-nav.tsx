"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Bell, Settings, LogOut,
  LayoutDashboard, LineChart, MessageSquare,
  HelpCircle, BarChart2, Receipt, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/markets",   label: "Markets",   icon: LineChart },
  { href: "/coach",     label: "AI Coach",  icon: MessageSquare },
  { href: "/simulator", label: "What If?",  icon: HelpCircle },
  { href: "/predictor", label: "Predictor", icon: BarChart2 },
  { href: "/expenses",  label: "Expenses",  icon: Receipt },
  { href: "/roast",     label: "Roast",     icon: Flame },
];

export function TopNav({ title, subtitle }: { title?: string; subtitle?: string }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "DP";

  return (
    <header
      className="mx-4 mt-4 mb-1 flex h-[60px] shrink-0 items-center gap-3 rounded-2xl px-4"
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden shrink-0"
          style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.2)" }}
        >
          <Image src="/logo.png" alt="DollarPaisa" width={28} height={28} className="object-contain scale-110" />
        </div>
        <p className="text-[13px] font-extrabold text-white tracking-tight hidden lg:block">DollarPaisa</p>
      </Link>

      <div className="h-5 w-px shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />

      {/* Nav links */}
      <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold whitespace-nowrap transition-all shrink-0",
                active ? "text-[#34d399]" : "hover:text-white/80 hover:bg-white/5"
              )}
              style={
                active
                  ? { background: "rgba(52,211,153,0.14)", border: "1px solid rgba(52,211,153,0.22)", color: "#34d399" }
                  : { color: "rgba(255,255,255,0.42)" }
              }
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Bell */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-xl transition-all"
          style={{ background: "rgba(255,255,255,0.05)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          <Bell className="h-[15px] w-[15px]" style={{ color: "rgba(255,255,255,0.6)" }} />
          <span
            className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#34d399]"
            style={{ boxShadow: "0 0 5px #34d399" }}
          />
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-all"
          style={{ background: "rgba(255,255,255,0.05)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          <Settings className="h-[15px] w-[15px]" style={{ color: "rgba(255,255,255,0.6)" }} />
        </Link>

        <div className="h-5 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Avatar + name */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black text-white shrink-0 cursor-default select-none"
            style={{
              background: "linear-gradient(135deg, #1b7a4a, #34d399)",
              boxShadow: "0 0 10px rgba(52,211,153,0.3)",
              border: "1px solid rgba(52,211,153,0.3)",
            }}
          >
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-[12px] font-semibold leading-tight text-white">
              {session?.user?.name?.split(" ")[0] ?? "User"}
            </p>
            <p className="text-[10px] leading-tight truncate max-w-[100px]" style={{ color: "rgba(255,255,255,0.38)" }}>
              {session?.user?.email ?? ""}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Logout"
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-all"
          style={{ background: "rgba(255,255,255,0.05)" }}
          onMouseEnter={(e) => {
            (e.currentTarget.style.background = "rgba(220,38,38,0.12)");
            (e.currentTarget.querySelector("svg") as SVGElement | null)?.setAttribute("style", "color:rgba(248,113,113,0.9)");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.background = "rgba(255,255,255,0.05)");
            (e.currentTarget.querySelector("svg") as SVGElement | null)?.setAttribute("style", "color:rgba(255,255,255,0.35)");
          }}
        >
          <LogOut className="h-[14px] w-[14px]" style={{ color: "rgba(255,255,255,0.35)" }} />
        </button>
      </div>

      {/* Hidden title/subtitle — kept for compat, not rendered visually */}
      {title && <span className="sr-only">{title}{subtitle ? ` — ${subtitle}` : ""}</span>}
    </header>
  );
}
