"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email or password. Please try again.");
    else router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F0F2F1] flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#1B5E39]/5" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#1B5E39]/4" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="PaisaPilot" width={56} height={56} className="object-contain mb-3" />
          <h1 className="text-2xl font-bold text-[#111917]">Welcome back</h1>
          <p className="text-sm text-[#5A6A62] mt-1">Sign in to your PaisaPilot account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_4px_24px_0_rgb(0,0,0,0.08)] p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#5A6A62] uppercase tracking-wide">
                Email
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#5A6A62] uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A39A] hover:text-[#5A6A62]"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E4E7E5]" />
            <span className="text-xs text-[#94A39A]">or</span>
            <div className="flex-1 h-px bg-[#E4E7E5]" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm text-[#5A6A62] mt-5">
          No account?{" "}
          <Link href="/register" className="text-[#1B5E39] font-semibold hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
