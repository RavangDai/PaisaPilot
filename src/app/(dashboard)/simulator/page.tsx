"use client";

import { useState } from "react";
import Image from "next/image";
import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, TrendingDown, TrendingUp, Minus, Clock, Lightbulb, BarChart2, Swords, DollarSign, Coins, Bot, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Scenario {
  icon: ReactNode;
  title: string;
  q: string;
}

const PREBUILT: Scenario[] = [
  {
    icon: <Image src="/apple-icon.ico" alt="Apple" width={32} height={32} className="rounded-lg" />,
    title: "Apple goes bankrupt tomorrow",
    q: "What if Apple Inc went bankrupt tomorrow?",
  },
  {
    icon: <Swords className="h-8 w-8 text-red-400" />,
    title: "Iran vs Israel escalates 30 days",
    q: "What if the Iran vs Israel conflict escalated into full-scale war for 30 more days?",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-amber-400" />,
    title: "US Dollar loses reserve status",
    q: "What if the US dollar lost its global reserve currency status overnight?",
  },
  {
    icon: <Coins className="h-8 w-8 text-yellow-400" />,
    title: "Bitcoin hits $1 million",
    q: "What if Bitcoin reached $1 million per coin this week?",
  },
  {
    icon: <Bot className="h-8 w-8 text-violet-400" />,
    title: "AI replaces 50% of jobs",
    q: "What if AI replaced 50% of white-collar jobs in the next 2 years?",
  },
  {
    icon: <Globe2 className="h-8 w-8 text-blue-400" />,
    title: "China invades Taiwan tomorrow",
    q: "What if China launched a military invasion of Taiwan tomorrow?",
  },
];

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Minor:        { bg: "#EAF4EE", text: "#1B5E39", border: "#D1E8DA" },
  Moderate:     { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
  Severe:       { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
  Catastrophic: { bg: "#1a0a0a", text: "#F87171", border: "#7F1D1D" },
};

const PROB_COLORS: Record<string, string> = {
  "Very Low": "#6366f1", Low: "#0369a1", Medium: "#d97706", High: "#dc2626",
};

interface WhatIfResult {
  headline: string;
  severity: string;
  probability: string;
  immediateEffects: { icon: string; effect: string; impact: string }[];
  stocksAffected: { symbol: string; name: string; expectedChange: string; direction: string }[];
  sectorsImpacted: { sector: string; impact: string; reason: string }[];
  personalFinanceTips: { action: string; urgency: string }[];
  timeline: { period: string; event: string }[];
  verdict: string;
}

export default function WhatIfPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  async function analyze(scenario: string) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/whatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function pickScenario(s: typeof PREBUILT[0]) {
    setActiveScenario(s.title);
    setQuery(s.q);
    analyze(s.q);
  }

  const sev = result ? (SEVERITY_STYLES[result.severity] ?? SEVERITY_STYLES.Moderate) : null;

  return (
    <div className="flex h-full flex-col">
      <TopNav title="What If?" subtitle="AI-powered financial scenario analysis" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Custom input */}
        <div className="rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50">
              <Zap className="h-4 w-4 text-violet-600" />
            </div>
            <p className="text-[15px] font-semibold text-[#111917]">Ask anything</p>
          </div>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && query.trim() && analyze(query)}
              placeholder="What if the Fed raised rates by 5% tomorrow?"
              className="flex-1 rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] px-4 py-2.5 text-sm text-[#111917] placeholder:text-[#94A39A] focus:outline-none focus:border-[#1B5E39] focus:bg-white transition-colors"
            />
            <Button onClick={() => query.trim() && analyze(query)} disabled={loading || !query.trim()} className="rounded-xl gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Analyze
            </Button>
          </div>
        </div>

        {/* Pre-built scenarios */}
        {!result && !loading && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#94A39A] mb-3">Or explore a scenario</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {PREBUILT.map((s) => (
                <button
                  key={s.title}
                  onClick={() => pickScenario(s)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all hover:shadow-md",
                    activeScenario === s.title
                      ? "border-[#1B5E39] bg-[#EAF4EE]"
                      : "border-[#E4E7E5] bg-white hover:border-[#1B5E39]/40"
                  )}
                >
                  <div className="mb-2 h-8 w-8 flex items-center justify-center">{s.icon}</div>
                  <p className="text-[13px] font-semibold text-[#111917] leading-snug">{s.title}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-[#E4E7E5] bg-white p-12 flex flex-col items-center gap-3">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-violet-100 animate-ping opacity-40" />
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
                <Zap className="h-7 w-7 text-violet-600" />
              </div>
            </div>
            <p className="text-[15px] font-semibold text-[#111917]">Analyzing scenario…</p>
            <p className="text-xs text-[#94A39A]">Running financial models across global markets</p>
          </div>
        )}

        {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        {/* Results */}
        {result && sev && (
          <div className="space-y-4">
            {/* Headline */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: sev.bg, borderColor: sev.border }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xl font-bold leading-tight mb-3" style={{ color: sev.text }}>{result.headline}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full px-3 py-1 text-xs font-bold border" style={{ backgroundColor: sev.bg, borderColor: sev.border, color: sev.text }}>
                      ⚡ {result.severity}
                    </span>
                    <span className="rounded-full bg-white/70 border border-white/90 px-3 py-1 text-xs font-semibold" style={{ color: PROB_COLORS[result.probability] ?? "#5A6A62" }}>
                      Probability: {result.probability}
                    </span>
                  </div>
                </div>
                <button onClick={() => { setResult(null); setActiveScenario(null); }} className="text-xs underline opacity-60 hover:opacity-100 shrink-0" style={{ color: sev.text }}>
                  New scenario
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Immediate effects */}
              <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-3">Immediate Effects</p>
                <div className="space-y-2">
                  {result.immediateEffects.map((ef, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-base shrink-0 mt-0.5">{ef.icon}</span>
                      <span className={cn("text-sm leading-snug",
                        ef.impact === "positive" ? "text-[#16a34a]" : ef.impact === "negative" ? "text-[#dc2626]" : "text-[#5A6A62]"
                      )}>{ef.effect}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sectors */}
              <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-3">Sectors Impacted</p>
                <div className="space-y-2.5">
                  {result.sectorsImpacted.map((sec, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#111917]">{sec.sector}</p>
                        <p className="text-[11px] text-[#94A39A]">{sec.reason}</p>
                      </div>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold shrink-0",
                        sec.impact === "bullish" ? "bg-[#EAF4EE] text-[#1B5E39]" :
                        sec.impact === "bearish" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      )}>
                        {sec.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stocks */}
            <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-3">Stocks Most Affected</p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {result.stocksAffected.map((stock, i) => (
                  <div key={i} className={cn("rounded-xl border p-3 flex items-center justify-between gap-2",
                    stock.direction === "up" ? "border-green-100 bg-green-50" :
                    stock.direction === "down" ? "border-red-100 bg-red-50" : "border-amber-100 bg-amber-50"
                  )}>
                    <div>
                      <p className="text-sm font-bold text-[#111917]">{stock.symbol}</p>
                      <p className="text-[10px] text-[#5A6A62] truncate max-w-[90px]">{stock.name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      {stock.direction === "up" ? <TrendingUp className="h-4 w-4 text-[#16a34a]" /> :
                       stock.direction === "down" ? <TrendingDown className="h-4 w-4 text-[#dc2626]" /> :
                       <Minus className="h-4 w-4 text-amber-600" />}
                      <span className={cn("text-[11px] font-bold",
                        stock.direction === "up" ? "text-[#16a34a]" :
                        stock.direction === "down" ? "text-[#dc2626]" : "text-amber-600"
                      )}>{stock.expectedChange}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Timeline */}
              <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-3 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Timeline</p>
                <div className="space-y-3 relative pl-1">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#E4E7E5]" />
                  {result.timeline.map((t, i) => (
                    <div key={i} className="flex gap-3 relative">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-[#1B5E39] bg-white shrink-0 mt-0.5 z-10" />
                      <div>
                        <p className="text-xs font-bold text-[#1B5E39]">{t.period}</p>
                        <p className="text-sm text-[#5A6A62]">{t.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-3 flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5" /> What You Should Do</p>
                <div className="space-y-2.5">
                  {result.personalFinanceTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 mt-0.5",
                        tip.urgency === "now" ? "bg-red-100 text-red-700" :
                        tip.urgency === "soon" ? "bg-amber-100 text-amber-700" : "bg-[#EAF4EE] text-[#1B5E39]"
                      )}>
                        {tip.urgency === "now" ? "NOW" : tip.urgency === "soon" ? "SOON" : "WATCH"}
                      </span>
                      <p className="text-sm text-[#111917]">{tip.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 flex gap-3">
              <BarChart2 className="h-5 w-5 text-[#1B5E39] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-1">Verdict</p>
                <p className="text-sm text-[#111917] leading-relaxed">{result.verdict}</p>
              </div>
            </div>

            <p className="text-center text-[10px] text-[#94A39A]">AI analysis for educational purposes only. Not financial advice.</p>
          </div>
        )}
      </div>
    </div>
  );
}
