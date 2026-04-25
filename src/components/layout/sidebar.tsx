"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  HelpCircle,
  BarChart2,
  Flame,
  LineChart,
  Receipt,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menu = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/markets",   label: "Markets",   icon: LineChart },
  { href: "/coach",     label: "AI Coach",  icon: MessageSquare },
  { href: "/simulator", label: "What If?",  icon: HelpCircle },
  { href: "/predictor", label: "Predictor", icon: BarChart2 },
  { href: "/expenses",  label: "Expenses",  icon: Receipt },
  { href: "/roast",     label: "Roast Me",  icon: Flame },
];

const general = [
  { href: "/help",     label: "Help",     icon: HelpCircle },
];

function NavIcon({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150",
        "hover:-translate-y-px active:translate-y-0 active:scale-[0.96]",
        active
          ? "bg-[rgba(16,185,129,0.18)] shadow-[0_0_12px_rgba(16,185,129,0.22)]"
          : "hover:bg-[rgba(24,61,42,0.55)]"
      )}
      style={!active ? { "--tw-bg-opacity": "1" } as React.CSSProperties : undefined}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
      )}
      <Icon
        className={cn(
          "h-[18px] w-[18px] transition-colors",
          active ? "text-[#10B981]" : "text-white/40 group-hover:text-white/75"
        )}
      />
      {/* Tooltip */}
      <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ background: "rgba(6,20,13,0.95)", border: "1px solid rgba(249,250,251,0.10)" }}>
        {label}
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-[64px] shrink-0 flex-col items-center py-4 gap-1 z-40"
      style={{
        background: "rgba(6,20,13,0.76)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(249,250,251,0.08)",
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden"
        style={{ background: "rgba(16,185,129,0.16)", border: "1px solid rgba(16,185,129,0.28)" }}>
        <Image src="/logo.png" alt="DollarPilot" width={36} height={36} className="object-contain scale-110" />
      </Link>

      {/* Thin divider */}
      <div className="w-8 h-px mb-2" style={{ background: "rgba(255,255,255,0.08)" }} />

      {/* Main nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {menu.map((item) => (
          <NavIcon key={item.href} {...item} active={pathname === item.href} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-8 h-px mb-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        {general.map((item) => (
          <NavIcon key={item.href} {...item} active={pathname === item.href} />
        ))}
        <button
          title="Logout"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 hover:bg-red-500/10 hover:-translate-y-px active:translate-y-0 active:scale-[0.96]"
        >
          <LogOut className="h-[18px] w-[18px] text-white/35 group-hover:text-red-400 transition-colors" />
          <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ background: "rgba(6,20,13,0.95)", border: "1px solid rgba(249,250,251,0.10)" }}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
