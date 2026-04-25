"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Sparkles, ClipboardList, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CompareResult {
  optionAName?: string;
  optionBName?: string;
  optionA?: { pros: string[]; cons: string[]; riskLevel: string; riskScore: number; rewardScore: number; timeHorizon: string; expectedReturn: string };
  optionB?: { pros: string[]; cons: string[]; riskLevel: string; riskScore: number; rewardScore: number; timeHorizon: string; expectedReturn: string };
  winner?: string;
  winnerReason?: string;
  recommendation?: string;
}

const STARTERS = [
  "How do I start investing with $500?",
  "What's the 50/30/20 budget rule?",
  "How do I pay off credit card debt fast?",
  "Should I build an emergency fund first?",
];

const RISK_COLORS: Record<string, string> = { Low: "#16a34a", Medium: "#d97706", High: "#dc2626" };

type Mode = "chat" | "plan" | "compare";

export function ChatInterface() {
  const [mode, setMode] = useState<Mode>("chat");

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! I'm Georgie, your personal AI financial coach. Ask me anything about budgeting, saving, investing, or debt management. I'm here to help you take control of your finances." },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Plan state
  const [planForm, setPlanForm] = useState({ goal: "", monthlyIncome: "", monthlySavings: "", horizon: "5", risk: "medium" });
  const [planResult, setPlanResult] = useState("");
  const [planLoading, setPlanLoading] = useState(false);

  // Compare state
  const [compareForm, setCompareForm] = useState({ optionA: "", optionB: "", context: "" });
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const message = (text ?? input).trim();
    if (!message || chatLoading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatLoading(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ AI error: ${data.error ?? "Something went wrong. Please try again."}` }]);
        return;
      }
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "No response received." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  }

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    setPlanLoading(true);
    setPlanResult("");
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "plan", ...planForm }),
      });
      const data = await res.json();
      setPlanResult(data.reply ?? "Could not generate plan.");
    } finally {
      setPlanLoading(false);
    }
  }

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    setCompareLoading(true);
    setCompareResult(null);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "compare", ...compareForm }),
      });
      const data = await res.json();
      setCompareResult(data);
    } finally {
      setCompareLoading(false);
    }
  }

  const tabs: { id: Mode; label: string; icon: React.ElementType }[] = [
    { id: "chat", label: "Chat", icon: Sparkles },
    { id: "plan", label: "Plan Mode", icon: ClipboardList },
    { id: "compare", label: "Compare", icon: GitCompare },
  ];

  return (
    <div className="flex h-full flex-col bg-[#F0F2F1]">
      {/* Georgie identity header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{
          background: "rgba(52,211,153,0.06)",
          borderColor: "rgba(52,211,153,0.15)",
        }}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden"
          style={{ border: "2px solid rgba(52,211,153,0.4)", background: "rgba(6,6,26,0.6)" }}>
          <Image src="/georgie.png" alt="Georgie" width={40} height={40} className="object-cover object-top scale-125" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#111917]">Georgie</p>
          <p className="text-[11px] text-[#5A6A62]">Your AI Financial Coach</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
          <span className="text-[11px] font-medium" style={{ color: "#34d399" }}>Online</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[#E4E7E5] bg-white px-4 pt-3">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 pb-2.5 text-sm font-semibold border-b-2 transition-colors",
              mode === id
                ? "border-[#1B5E39] text-[#1B5E39]"
                : "border-transparent text-[#94A39A] hover:text-[#5A6A62]"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Chat Mode */}
      {mode === "chat" && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} content={msg.content} />
            ))}
            {chatLoading && (
              <div className="flex gap-3 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden"
                  style={{ border: "1px solid rgba(52,211,153,0.3)", background: "rgba(6,6,26,0.6)" }}>
                  <Image src="/georgie.png" alt="Georgie" width={32} height={32} className="object-cover object-top scale-125" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white border border-[#E4E7E5] px-4 py-3 text-sm text-[#94A39A] shadow-sm">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce [animation-delay:0ms]">·</span>
                    <span className="animate-bounce [animation-delay:150ms]">·</span>
                    <span className="animate-bounce [animation-delay:300ms]">·</span>
                  </span>
                </div>
              </div>
            )}
            {messages.length === 1 && !chatLoading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {STARTERS.map((s) => (
                  <button key={s} onClick={() => handleSend(s)} className="rounded-xl border border-[#E4E7E5] bg-white px-3 py-2 text-xs font-medium text-[#5A6A62] hover:border-[#1B5E39] hover:text-[#1B5E39] transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-[#E4E7E5] bg-white px-4 py-3">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 max-w-3xl mx-auto">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your finances…" className="flex-1" disabled={chatLoading} />
              <Button type="submit" disabled={chatLoading || !input.trim()} size="icon" className="h-10 w-10 rounded-xl">
                {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="text-center text-[10px] text-[#94A39A] mt-2">AI responses are for educational purposes only. Not financial advice.</p>
          </div>
        </>
      )}

      {/* Plan Mode */}
      {mode === "plan" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
            <p className="text-[15px] font-bold text-[#111917] mb-1">Build Your Financial Plan</p>
            <p className="text-xs text-[#5A6A62] mb-4">Tell us your goal and we'll build a personalized roadmap.</p>
            <form onSubmit={handlePlan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">Financial Goal</label>
                <input value={planForm.goal} onChange={(e) => setPlanForm((p) => ({ ...p, goal: e.target.value }))} placeholder="e.g. Buy a house in 5 years, retire by 55, pay off debt" required
                  className="w-full rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] px-3 py-2 text-sm focus:outline-none focus:border-[#1B5E39]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">Monthly Income ($)</label>
                  <input type="number" value={planForm.monthlyIncome} onChange={(e) => setPlanForm((p) => ({ ...p, monthlyIncome: e.target.value }))} placeholder="5000" required
                    className="w-full rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] px-3 py-2 text-sm focus:outline-none focus:border-[#1B5E39]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">Monthly Savings ($)</label>
                  <input type="number" value={planForm.monthlySavings} onChange={(e) => setPlanForm((p) => ({ ...p, monthlySavings: e.target.value }))} placeholder="1000" required
                    className="w-full rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] px-3 py-2 text-sm focus:outline-none focus:border-[#1B5E39]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">Time Horizon (years)</label>
                  <input type="number" value={planForm.horizon} onChange={(e) => setPlanForm((p) => ({ ...p, horizon: e.target.value }))} placeholder="5" min="1" max="40" required
                    className="w-full rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] px-3 py-2 text-sm focus:outline-none focus:border-[#1B5E39]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">Risk Tolerance</label>
                  <select value={planForm.risk} onChange={(e) => setPlanForm((p) => ({ ...p, risk: e.target.value }))}
                    className="w-full rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] px-3 py-2 text-sm focus:outline-none focus:border-[#1B5E39]">
                    <option value="low">Low (Conservative)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="high">High (Aggressive)</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={planLoading} className="w-full rounded-xl gap-2">
                {planLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Building your plan…</> : <><ClipboardList className="h-4 w-4" /> Generate Plan</>}
              </Button>
            </form>
          </div>

          {planResult && (
            <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1B5E39] mb-3">Your Financial Plan</p>
              <div className="text-sm text-[#111917] leading-relaxed whitespace-pre-wrap">{planResult}</div>
            </div>
          )}
        </div>
      )}

      {/* Compare Mode */}
      {mode === "compare" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
            <p className="text-[15px] font-bold text-[#111917] mb-1">Compare Financial Options</p>
            <p className="text-xs text-[#5A6A62] mb-4">Get a risk-to-reward breakdown for any two financial choices.</p>
            <form onSubmit={handleCompare} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">Option A</label>
                <textarea value={compareForm.optionA} onChange={(e) => setCompareForm((p) => ({ ...p, optionA: e.target.value }))} placeholder="e.g. Invest $10,000 in S&P 500 index fund" required rows={2}
                  className="w-full rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] px-3 py-2 text-sm focus:outline-none focus:border-[#1B5E39] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">Option B</label>
                <textarea value={compareForm.optionB} onChange={(e) => setCompareForm((p) => ({ ...p, optionB: e.target.value }))} placeholder="e.g. Buy a rental property with the same $10,000" required rows={2}
                  className="w-full rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] px-3 py-2 text-sm focus:outline-none focus:border-[#1B5E39] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">Context (optional)</label>
                <input value={compareForm.context} onChange={(e) => setCompareForm((p) => ({ ...p, context: e.target.value }))} placeholder="e.g. I'm 28, have 5-year horizon, moderate income"
                  className="w-full rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] px-3 py-2 text-sm focus:outline-none focus:border-[#1B5E39]" />
              </div>
              <Button type="submit" disabled={compareLoading} className="w-full rounded-xl gap-2">
                {compareLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : <><GitCompare className="h-4 w-4" /> Compare Options</>}
              </Button>
            </form>
          </div>

          {compareResult && compareResult.optionA && compareResult.optionB && (
            <div className="space-y-3">
              {/* Winner banner */}
              {compareResult.winner && compareResult.winner !== "Tie" && (
                <div className="rounded-2xl bg-[#1B5E39] text-white p-4 text-center">
                  <p className="text-xs opacity-60 mb-1">Winner</p>
                  <p className="text-lg font-black">
                    {compareResult.winner === "A" ? compareResult.optionAName ?? "Option A" : compareResult.optionBName ?? "Option B"} wins 🏆
                  </p>
                  {compareResult.winnerReason && <p className="text-xs opacity-70 mt-1">{compareResult.winnerReason}</p>}
                </div>
              )}

              {/* Side-by-side */}
              <div className="grid grid-cols-2 gap-3">
                {(["A", "B"] as const).map((key) => {
                  const opt = key === "A" ? compareResult.optionA! : compareResult.optionB!;
                  const name = key === "A" ? (compareResult.optionAName ?? "Option A") : (compareResult.optionBName ?? "Option B");
                  const isWinner = compareResult.winner === key;
                  return (
                    <div key={key} className={cn("rounded-2xl border p-4 space-y-3", isWinner ? "border-[#1B5E39] bg-[#EAF4EE]" : "border-[#E4E7E5] bg-white")}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-[#111917] truncate">{name}</p>
                        {isWinner && <span className="text-xs font-bold text-[#1B5E39]">✓ Recommended</span>}
                      </div>

                      {/* Risk/Reward bars */}
                      <div className="space-y-1.5">
                        <div>
                          <div className="flex justify-between text-[10px] text-[#94A39A] mb-0.5">
                            <span>Risk</span><span className="font-semibold" style={{ color: RISK_COLORS[opt.riskLevel] ?? "#d97706" }}>{opt.riskLevel}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#E4E7E5] overflow-hidden">
                            <div className="h-full rounded-full bg-red-400 transition-all" style={{ width: `${(opt.riskScore / 10) * 100}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-[#94A39A] mb-0.5">
                            <span>Reward</span><span className="font-semibold text-[#1B5E39]">{opt.rewardScore}/10</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#E4E7E5] overflow-hidden">
                            <div className="h-full rounded-full bg-[#1B5E39] transition-all" style={{ width: `${(opt.rewardScore / 10) * 100}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] space-y-1">
                        <p className="text-[#94A39A]">Expected: <span className="font-semibold text-[#111917]">{opt.expectedReturn}</span></p>
                        <p className="text-[#94A39A]">Horizon: <span className="font-semibold text-[#111917]">{opt.timeHorizon}</span></p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-[#16a34a] mb-1">PROS</p>
                        {opt.pros?.slice(0, 2).map((pro, i) => <p key={i} className="text-[11px] text-[#111917]">+ {pro}</p>)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-red-500 mb-1">CONS</p>
                        {opt.cons?.slice(0, 2).map((con, i) => <p key={i} className="text-[11px] text-[#5A6A62]">− {con}</p>)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {compareResult.recommendation && (
                <div className="rounded-2xl border border-[#E4E7E5] bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-1.5">Recommendation</p>
                  <p className="text-sm text-[#111917] leading-relaxed">{compareResult.recommendation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
