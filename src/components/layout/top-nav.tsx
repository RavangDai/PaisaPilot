"use client";

import { useSession } from "next-auth/react";
import { Bell, Mail, Search } from "lucide-react";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export function TopNav({ title, subtitle }: TopNavProps) {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "PP";

  return (
    <header className="flex h-[68px] shrink-0 items-center gap-4 border-b border-[#E4E7E5] bg-white px-6">
      {/* Search */}
      <div className="flex flex-1 max-w-xs items-center gap-2 rounded-xl border border-[#E4E7E5] bg-[#F0F2F1] px-3 py-2 text-sm text-[#94A39A]">
        <Search className="h-4 w-4 shrink-0" />
        <span className="text-[13px]">Search…</span>
        <kbd className="ml-auto text-[10px] border border-[#D5DAD7] rounded px-1.5 py-0.5 bg-white font-mono text-[#94A39A]">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Icons */}
      <div className="flex items-center gap-1">
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-[#5A6A62] hover:bg-[#F0F2F1] transition-colors relative">
          <Mail className="h-[18px] w-[18px]" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-[#5A6A62] hover:bg-[#F0F2F1] transition-colors relative">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#1B5E39] ring-2 ring-white" />
        </button>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-[#E4E7E5]" />

      {/* User */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1B5E39] text-white text-xs font-bold shrink-0"
          aria-hidden
        >
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-[13px] font-semibold text-[#111917] leading-tight">
            {session?.user?.name ?? "User"}
          </p>
          <p className="text-[11px] text-[#94A39A] leading-tight truncate max-w-[160px]">
            {session?.user?.email}
          </p>
        </div>
      </div>
    </header>
  );
}
