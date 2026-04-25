"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, Settings } from "lucide-react";

interface TopNavProps {
  title?: string;
  subtitle?: string;
}

export function TopNav({ title, subtitle }: TopNavProps) {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "DP";

  return (
    <header
      className="mx-4 mt-4 mb-1 flex h-[60px] shrink-0 items-center gap-4 rounded-2xl px-5"
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden"
          style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <Image src="/logo.png" alt="DollarPaisa" width={28} height={28} className="object-contain scale-110" />
        </div>
        <div>
          <p className="text-[14px] font-extrabold text-white leading-tight tracking-tight">DollarPaisa</p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>
            Finance AI
          </p>
        </div>
      </Link>

      {/* Page title (center) */}
      {title && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>{title}</p>
            {subtitle && <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{subtitle}</p>}
          </div>
        </div>
      )}

      {!title && <div className="flex-1" />}

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Bell */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all"
          style={{ background: "rgba(255,255,255,0.05)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          <Bell className="h-[17px] w-[17px]" style={{ color: "rgba(255,255,255,0.6)" }} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#34d399]"
            style={{ boxShadow: "0 0 6px #34d399" }} />
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-all"
          style={{ background: "rgba(255,255,255,0.05)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          <Settings className="h-[17px] w-[17px]" style={{ color: "rgba(255,255,255,0.6)" }} />
        </Link>

        {/* Thin divider */}
        <div className="h-6 w-px mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black text-white shrink-0 cursor-default select-none"
            style={{
              background: "linear-gradient(135deg, #1b7a4a, #34d399)",
              boxShadow: "0 0 12px rgba(52,211,153,0.3)",
              border: "1px solid rgba(52,211,153,0.3)",
            }}
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold leading-tight text-white">
              {session?.user?.name?.split(" ")[0] ?? "User"}
            </p>
            <p className="text-[10px] leading-tight truncate max-w-[120px]"
              style={{ color: "rgba(255,255,255,0.38)" }}>
              {session?.user?.email ?? ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
