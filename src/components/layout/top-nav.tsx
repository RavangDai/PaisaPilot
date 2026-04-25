"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface TopNavProps {
  title: string;
}

export function TopNav({ title }: TopNavProps) {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <User className="h-4 w-4" />
          <span>{session?.user?.name ?? session?.user?.email}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
