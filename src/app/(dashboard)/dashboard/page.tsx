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
} from "lucide-react";

const statCards = [
  {
    label: "AI Coach Sessions",
    value: "0",
    sub: "Start your first chat",
    icon: MessageSquare,
    hero: true,
    href: "/coach",
  },
  {
    label: "Scenarios Analyzed",
    value: "0",
    sub: "Explore a what-if",
    icon: HelpCircle,
    hero: false,
    href: "/simulator",
  },
  {
    label: "Stocks Analyzed",
    value: "0",
    sub: "Search a ticker",
    icon: BarChart2,
    hero: false,
    href: "/predictor",
  },
  {
    label: "Finances Roasted",
    value: "0",
    sub: "Pick a persona",
    icon: Flame,
    hero: false,
    href: "/roast",
  },
];

const features = [
  {
    href: "/coach",
    icon: MessageSquare,
    title: "AI Finance Coach",
    description:
      "Ask anything — budgeting, saving, investing, or debt. Get clear, personalized advice in seconds.",
    tag: "Chat",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
  },
  {
    href: "/simulator",
    icon: HelpCircle,
    title: "What If Scenarios",
    description:
      "Stress-test global events against your portfolio — Apple bankrupt, war, Bitcoin $1M, and more.",
    tag: "What If",
    color: "#a78bfa",
    bg: "rgba(124,58,237,0.12)",
  },
  {
    href: "/predictor",
    icon: BarChart2,
    title: "Stock Predictor",
    description:
      "AI-powered sentiment analysis on any ticker — outlook, risks, and opportunities explained.",
    tag: "Analyze",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.12)",
  },
  {
    href: "/expenses",
    icon: Receipt,
    title: "Expense Tracker",
    description:
      "Upload a bank statement PDF and get an AI-powered breakdown of spending by category and merchant.",
    tag: "Track",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
  },
  {
    href: "/roast",
    icon: Flame,
    title: "Roast My Finances",
    description:
      "Pick a persona and get your spending habits mercilessly judged by a Wall Street bro or Skynet.",
    tag: "Roast",
    color: "#fb923c",
    bg: "rgba(249,115,22,0.12)",
  },
];

const tips = [
  { icon: DollarSign, text: "Save at least 20% of your income each month." },
  { icon: TrendingDown, text: "High-interest debt costs more than investments earn." },
  { icon: Sparkles, text: "Compound interest doubles money roughly every 9 years at 8%." },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col min-h-full">
      <TopNav title="Dashboard" />

      <div className="flex-1 p-6 space-y-6 max-w-[1200px]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111917]">
              Good to see you, {firstName}
            </h1>
            <p className="text-sm text-[#5A6A62] mt-1">
              Your AI-powered financial co-pilot is ready.
            </p>
          </div>
          <Link
            href="/coach"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1B5E39] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#154d2f] transition-colors shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            Ask AI Coach
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map(({ label, value, sub, icon: Icon, hero, href }) => (
            <Link key={href} href={href}>
              <div
                className={`relative rounded-2xl p-5 transition-all duration-150 hover:scale-[1.02] cursor-pointer overflow-hidden ${
                  hero
                    ? "bg-[#1B5E39] text-white shadow-lg"
                    : "bg-white border border-[#E4E7E5] shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      hero ? "bg-white/15" : "bg-[#EAF4EE]"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${hero ? "text-white" : "text-[#1B5E39]"}`}
                    />
                  </div>
                  <ArrowUpRight
                    className={`h-4 w-4 ${hero ? "text-white/50" : "text-[#94A39A]"}`}
                  />
                </div>
                <p
                  className={`text-3xl font-bold mb-1 ${
                    hero ? "text-white" : "text-[#111917]"
                  }`}
                >
                  {value}
                </p>
                <p
                  className={`text-xs font-medium ${
                    hero ? "text-white/70" : "text-[#5A6A62]"
                  }`}
                >
                  {label}
                </p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    hero ? "text-white/50" : "text-[#94A39A]"
                  }`}
                >
                  {sub}
                </p>
                {hero && (
                  <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/5" />
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-base font-semibold text-[#111917] mb-3">Features</h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ href, icon: Icon, title, description, tag, color, bg }) => (
              <Link key={href} href={href}>
                <div className="group rounded-2xl border border-[#E4E7E5] bg-white p-5 hover:border-[#C9D4CE] hover:shadow-[0_4px_12px_0_rgb(0,0,0,0.08)] transition-all duration-200 cursor-pointer h-full">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: bg }}
                    >
                      <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[15px] font-semibold text-[#111917]">{title}</p>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: bg, color }}
                        >
                          {tag}
                        </span>
                      </div>
                      <p className="text-sm text-[#5A6A62] leading-relaxed">{description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#C9D4CE] group-hover:text-[#5A6A62] transition-colors shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h2 className="text-base font-semibold text-[#111917] mb-3">Financial Tips</h2>
          <div className="grid grid-cols-3 gap-3">
            {tips.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#E4E7E5] bg-white p-4 flex items-start gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF4EE]">
                  <Icon className="h-4 w-4 text-[#1B5E39]" />
                </div>
                <p className="text-xs text-[#5A6A62] leading-relaxed pt-0.5">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
