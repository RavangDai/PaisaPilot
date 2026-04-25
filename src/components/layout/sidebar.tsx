"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, TrendingUp, BarChart2, Flame } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/coach", label: "AI Coach", icon: MessageSquare },
  { href: "/simulator", label: "Simulator", icon: TrendingUp },
  { href: "/predictor", label: "Predictor", icon: BarChart2 },
  { href: "/roast", label: "Roast My Finances", icon: Flame },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-zinc-800 bg-zinc-950 px-3 py-6">
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold text-emerald-400">PaisaPilot</h1>
        <p className="text-xs text-zinc-500">AI Finance Co-pilot</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-emerald-900/50 text-emerald-400"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
