"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  BarChart2,
  Flame,
  LineChart,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menu = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/markets", label: "Markets", icon: LineChart },
  { href: "/coach", label: "AI Coach", icon: MessageSquare },
  { href: "/simulator", label: "Simulator", icon: TrendingUp },
  { href: "/predictor", label: "AI Predictor", icon: BarChart2 },
  { href: "/roast", label: "Roast My Finances", icon: Flame },
];

const general = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

function NavItem({
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
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 relative",
        active
          ? "bg-[#EAF4EE] text-[#1B5E39]"
          : "text-[#5A6A62] hover:bg-[#F5F7F6] hover:text-[#111917]"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-[#1B5E39]" />
      )}
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          active ? "text-[#1B5E39]" : "text-[#94A39A] group-hover:text-[#5A6A62]"
        )}
      />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[228px] shrink-0 flex-col border-r border-[#E4E7E5] bg-white">
      {/* Logo */}
      <div className="flex h-[68px] items-center gap-2.5 border-b border-[#E4E7E5] px-5">
        <Image
          src="/logo.png"
          alt="PaisaPilot"
          width={32}
          height={32}
          className="shrink-0 object-contain"
        />
        <div>
          <p className="text-[15px] font-bold text-[#111917] leading-tight">PaisaPilot</p>
          <p className="text-[10px] text-[#94A39A] font-medium tracking-wide uppercase">Finance AI</p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#94A39A]">
            Menu
          </p>
          {menu.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#94A39A]">
            General
          </p>
          {general.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#5A6A62] hover:bg-[#FEF2F2] hover:text-red-600 transition-all duration-150"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0 text-[#94A39A]" />
            Logout
          </button>
        </div>
      </div>

      {/* Bottom promo card */}
      <div className="m-3 rounded-2xl bg-[#1B5E39] p-4 text-white">
        <p className="text-xs font-semibold leading-tight mb-1">Your finances,</p>
        <p className="text-xs font-semibold leading-tight mb-3 opacity-80">guided by AI ✦</p>
        <p className="text-[11px] opacity-60 leading-snug">
          Ask your AI coach anything, anytime.
        </p>
        <Link
          href="/coach"
          className="mt-3 block text-center text-xs font-semibold bg-white text-[#1B5E39] rounded-lg py-1.5 hover:bg-[#EAF4EE] transition-colors"
        >
          Start chatting
        </Link>
      </div>
    </aside>
  );
}
