import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";
import Link from "next/link";
import {
  MessageSquare,
  HelpCircle,
  BarChart2,
  Flame,
  Receipt,
  ArrowUpRight,
  Sparkles,
  TrendingDown,
  DollarSign,
  LineChart,
} from "lucide-react";

const statCards = [
  {
    label: "AI Coach Sessions",
    value: "0",
    sub: "Start your first chat",
    icon: MessageSquare,
    accent: "#34d399",
    href: "/coach",
  },
  {
    label: "Scenarios Analyzed",
    value: "0",
    sub: "Explore a what-if",
    icon: HelpCircle,
    accent: "#a78bfa",
    href: "/simulator",
  },
  {
    label: "Stocks Analyzed",
    value: "0",
    sub: "Search a ticker",
    icon: BarChart2,
    accent: "#60a5fa",
    href: "/predictor",
  },
  {
    label: "Finances Roasted",
    value: "0",
    sub: "Pick a persona",
    icon: Flame,
    accent: "#fb923c",
    href: "/roast",
  },
];

const features = [
  {
    href: "/coach",
    icon: MessageSquare,
    title: "AI Finance Coach",
    description: "Ask anything: budgeting, saving, investing, or debt. Get clear, personalized advice in seconds.",
    tag: "Chat",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
  },
  {
    href: "/simulator",
    icon: HelpCircle,
    title: "What If Scenarios",
    description: "Stress-test global events against your portfolio: Apple bankrupt, war, Bitcoin $1M, and more.",
    tag: "What If",
    color: "#a78bfa",
    bg: "rgba(124,58,237,0.12)",
  },
  {
    href: "/markets",
    icon: LineChart,
    title: "Live Markets",
    description: "Track stocks and crypto in real time with interactive charts, price history, and market indices.",
    tag: "Markets",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.12)",
  },
  {
    href: "/predictor",
    icon: BarChart2,
    title: "Stock Predictor",
    description: "AI-powered sentiment analysis on any ticker: outlook, risks, and opportunities explained.",
    tag: "Analyze",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.12)",
  },
  {
    href: "/expenses",
    icon: Receipt,
    title: "Expense Tracker",
    description: "Upload a bank statement PDF and get an AI-powered breakdown of spending by category and merchant.",
    tag: "Track",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
  },
  {
    href: "/roast",
    icon: Flame,
    title: "Roast My Finances",
    description: "Pick a persona and get your spending habits mercilessly judged by a Wall Street bro or Skynet.",
    tag: "Roast",
    color: "#fb923c",
    bg: "rgba(249,115,22,0.12)",
  },
];

const tips = [
  { icon: DollarSign, text: "Save at least 20% of your income each month.", color: "#34d399" },
  { icon: TrendingDown, text: "High-interest debt costs more than most investments can earn.", color: "#f87171" },
  { icon: Sparkles, text: "Compound interest doubles money roughly every 9 years at 8% annual returns.", color: "#a78bfa" },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col min-h-full">
      <TopNav title="Dashboard" />

      <div className="flex-1 overflow-y-auto p-6 space-y-7">

        {/* Hero greeting */}
        <div
          className="rounded-2xl px-7 py-6 flex items-center justify-between gap-4"
          style={{
            background: "rgba(52,211,153,0.07)",
            border: "1px solid rgba(52,211,153,0.15)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#34d399" }}>
              Welcome back
            </p>
            <h1 className="text-2xl font-extrabold text-white leading-tight">
              Good to see you, {firstName}
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              Your AI-powered financial co-pilot is ready.
            </p>
          </div>
          <Link
            href="/coach"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-[#06061a] shrink-0 transition-all hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #34d399, #10b981)",
              boxShadow: "0 0 20px rgba(52,211,153,0.35)",
            }}
          >
            <Sparkles className="h-4 w-4" />
            Ask AI Coach
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map(({ label, value, sub, icon: Icon, accent, href }) => (
            <Link key={href} href={href}>
              <div
                className="dp-hover-surface relative rounded-2xl p-5 cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]"
                style={{
                  "--dp-bg": "rgba(14,36,25,0.70)",
                  "--dp-bg-hover": "rgba(24,61,42,0.72)",
                  "--dp-border": `${accent}22`,
                  "--dp-border-hover": `${accent}44`,
                } as React.CSSProperties}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: accent }} />
                  </div>
                  <ArrowUpRight className="h-4 w-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                </div>
                <p className="text-3xl font-extrabold text-white leading-none mb-1">{value}</p>
                <p className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>{label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>{sub}</p>
                {/* Accent glow corner */}
                <div
                  className="absolute -right-5 -bottom-5 h-20 w-20 rounded-full blur-2xl"
                  style={{ background: `${accent}15` }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Features Grid */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              Features
            </p>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ href, icon: Icon, title, description, tag, color, bg }) => (
              <Link key={href} href={href}>
                <div
                  className="dp-hover-surface group rounded-2xl p-5 cursor-pointer h-full transition-all duration-200 hover:-translate-y-px"
                  style={{
                    "--dp-bg": "rgba(14,36,25,0.62)",
                    "--dp-bg-hover": "rgba(24,61,42,0.70)",
                    "--dp-border": "rgba(249,250,251,0.08)",
                    "--dp-border-hover": `${color}30`,
                    "--dp-shadow": "none",
                    "--dp-shadow-hover": `0 8px 32px rgba(0,0,0,0.40), 0 0 0 1px ${color}20`,
                  } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: bg, border: `1px solid ${color}25` }}
                    >
                      <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: bg, color }}
                      >
                        {tag}
                      </span>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />
                    </div>
                  </div>
                  <p className="text-[14px] font-bold text-white mb-1.5">{title}</p>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              Quick Tips
            </p>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {tips.map(({ icon: Icon, text, color }, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-0.5"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <p className="text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
