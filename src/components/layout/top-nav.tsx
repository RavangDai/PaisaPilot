"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Bell, HelpCircle, LogOut,
  LayoutDashboard, LineChart, MessageSquare,
  BarChart2, Receipt, Flame,
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
        background: "rgba(14,36,25,0.72)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(249,250,251,0.10)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Brand */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 shrink-0 transition-transform duration-150 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden shrink-0"
          style={{ background: "rgba(16,185,129,0.16)", border: "1px solid rgba(16,185,129,0.26)" }}
        >
          <Image src="/logo.png" alt="DollarPilot" width={28} height={28} className="object-contain scale-110" />
        </div>
        <p className="text-[13px] font-extrabold text-white tracking-tight hidden lg:block">DollarPilot</p>
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
                "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
                active ? "text-[#10B981]" : "hover:text-white/90 hover:bg-[rgba(24,61,42,0.55)]"
              )}
              style={
                active
                  ? { background: "rgba(16,185,129,0.16)", border: "1px solid rgba(16,185,129,0.24)", color: "#10B981" }
                  : { color: "rgba(249,250,251,0.44)" }
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
          className="relative flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:-translate-y-px active:translate-y-0 active:scale-[0.96]"
          style={{ background: "rgba(249,250,251,0.06)" }}
        >
          <Bell className="h-[15px] w-[15px]" style={{ color: "rgba(249,250,251,0.68)" }} />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#10B981]" style={{ boxShadow: "0 0 5px #10B981" }} />
        </button>

        {/* Help */}
        <Link
          href="/help"
          title="Help"
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:-translate-y-px active:translate-y-0 active:scale-[0.96]"
          style={{ background: "rgba(249,250,251,0.06)" }}
        >
          <HelpCircle className="h-[15px] w-[15px]" style={{ color: "rgba(249,250,251,0.68)" }} />
        </Link>

        <div className="h-5 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Avatar + name */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black text-white shrink-0 cursor-default select-none"
            style={{
              background: "linear-gradient(135deg, #183D2A, #10B981)",
              boxShadow: "0 0 10px rgba(16,185,129,0.26)",
              border: "1px solid rgba(16,185,129,0.28)",
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
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:-translate-y-px active:translate-y-0 active:scale-[0.96]"
          style={{ background: "rgba(249,250,251,0.06)" }}
          onMouseEnter={(e) => {
            (e.currentTarget.style.background = "rgba(220,38,38,0.12)");
            (e.currentTarget.querySelector("svg") as SVGElement | null)?.setAttribute("style", "color:rgba(248,113,113,0.9)");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.background = "rgba(249,250,251,0.06)");
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
