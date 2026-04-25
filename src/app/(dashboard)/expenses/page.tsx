"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import {
  Upload, FileText, X, Loader2,
  TrendingUp, TrendingDown, AlertTriangle, Lightbulb,
  ShoppingBag, RefreshCw, Trash2, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  amount: number;
  count: number;
  emoji: string;
}

interface Merchant {
  name: string;
  amount: number;
  count: number;
}

interface ExpenseResult {
  _id?: string;
  fileName?: string;
  createdAt?: string;
  period: string;
  currency: string;
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
  savingsRate: number;
  categories: Category[];
  topMerchants: Merchant[];
  biggestExpense: { description: string; amount: number; date: string };
  insights: string[];
  warningFlags: string[];
}

function fmt(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default function ExpensesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExpenseResult | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<ExpenseResult[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/expenses")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setSaved(d); })
      .catch(() => {});
  }, []);

  async function deleteStatement(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      setSaved((prev) => prev.filter((s) => s._id !== id));
      if (result?._id === id) setResult(null);
    } finally {
      setDeleting(null);
    }
  }

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) { setFile(accepted[0]); setResult(null); setError(""); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop,
  });

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/expenses", { method: "POST", body: form });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(data);
      setFile(null);
      if (data._id) setSaved((prev) => [data, ...prev]);
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const maxCategory = result ? Math.max(...result.categories.map((c) => c.amount)) : 1;

  return (
    <div className="flex h-full flex-col">
      <TopNav title="Expense Tracker" subtitle="Upload a bank statement to analyze your spending" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Upload zone */}
        <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(52,211,153,0.12)" }}>
              <FileText className="h-4 w-4" style={{ color: "#34d399" }} />
            </div>
            <p className="text-[15px] font-semibold text-[#111917]">Upload Bank Statement</p>
          </div>

          {!file ? (
            <div
              {...getRootProps()}
              className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all"
              style={{
                borderColor: isDragActive ? "#34d399" : "rgba(255,255,255,0.15)",
                backgroundColor: isDragActive ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.02)",
              }}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.3)" }} />
              <p className="text-sm font-semibold text-[#111917] mb-1">
                {isDragActive ? "Drop it here" : "Drop your bank statement PDF here"}
              </p>
              <p className="text-xs text-[#5A6A62]">or click to browse — PDF only, any bank format</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="flex-1 rounded-xl p-3.5 flex items-center gap-3"
                style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)" }}
              >
                <FileText className="h-6 w-6 shrink-0" style={{ color: "#34d399" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111917] truncate">{file.name}</p>
                  <p className="text-xs text-[#5A6A62]">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <button onClick={() => { setFile(null); setResult(null); }} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="h-4 w-4" style={{ color: "rgba(255,255,255,0.4)" }} />
                </button>
              </div>
              <Button onClick={analyze} disabled={loading} className="rounded-xl gap-2 shrink-0">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : "Analyze"}
              </Button>
            </div>
          )}

          {file && !result && !loading && (
            <Button onClick={analyze} className="w-full mt-3 rounded-xl gap-2">
              <TrendingUp className="h-4 w-4" /> Analyze Statement
            </Button>
          )}
        </div>

        {/* Saved statements */}
        {saved.length > 0 && !result && !loading && (
          <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-3">Saved Statements</p>
            <div className="space-y-2">
              {saved.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors cursor-pointer group"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <FileText className="h-5 w-5 shrink-0" style={{ color: "#34d399" }} />
                  <div className="flex-1 min-w-0" onClick={() => setResult(s)}>
                    <p className="text-sm font-semibold text-[#111917] truncate">{s.fileName ?? "Statement"}</p>
                    <p className="text-[11px] text-[#94A39A]">
                      {s.period} · {fmt(s.totalDebits, s.currency)} spent
                      {s.createdAt && ` · ${new Date(s.createdAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setResult(s)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/10"
                  >
                    <ChevronRight className="h-4 w-4 text-[#5A6A62]" />
                  </button>
                  <button
                    onClick={() => s._id && deleteStatement(s._id)}
                    disabled={deleting === s._id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10"
                  >
                    {deleting === s._id
                      ? <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                      : <Trash2 className="h-4 w-4 text-red-400" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-[#E4E7E5] bg-white p-12 flex flex-col items-center gap-3">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[rgba(52,211,153,0.2)] animate-ping opacity-60" />
              <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(52,211,153,0.12)" }}>
                <FileText className="h-7 w-7" style={{ color: "#34d399" }} />
              </div>
            </div>
            <p className="text-[15px] font-semibold text-[#111917]">Reading your statement…</p>
            <p className="text-xs text-[#94A39A]">Gemini AI is extracting and categorizing transactions</p>
          </div>
        )}

        {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Period banner */}
            <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#94A39A] mb-1">Statement Period</p>
                <p className="text-xl font-bold text-[#111917]">{result.period}</p>
              </div>
              <button
                onClick={() => setResult(null)}
                className="flex items-center gap-1.5 text-xs text-[#5A6A62] hover:text-[#111917] transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Upload new
              </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Income", value: fmt(result.totalCredits, result.currency), icon: TrendingUp, color: "#34d399", bg: "rgba(52,211,153,0.12)" },
                { label: "Total Spent", value: fmt(result.totalDebits, result.currency), icon: TrendingDown, color: "#f87171", bg: "rgba(248,113,113,0.12)" },
                { label: "Savings Rate", value: `${result.savingsRate.toFixed(0)}%`, icon: ShoppingBag, color: result.savingsRate >= 20 ? "#34d399" : result.savingsRate >= 10 ? "#fbbf24" : "#f87171", bg: result.savingsRate >= 20 ? "rgba(52,211,153,0.12)" : result.savingsRate >= 10 ? "rgba(251,191,36,0.12)" : "rgba(248,113,113,0.12)" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="rounded-2xl border border-[#E4E7E5] bg-white p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl mb-3" style={{ background: bg }}>
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <p className="text-xl font-bold text-[#111917]">{value}</p>
                  <p className="text-xs text-[#5A6A62] mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-4">Spending by Category</p>
              <div className="space-y-3">
                {result.categories.map((cat) => {
                  const pct = (cat.amount / maxCategory) * 100;
                  const sharePct = result.totalDebits > 0 ? ((cat.amount / result.totalDebits) * 100).toFixed(0) : "0";
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{cat.emoji}</span>
                          <span className="text-sm font-semibold text-[#111917]">{cat.name}</span>
                          <span className="text-[10px] text-[#94A39A]">{cat.count} txn{cat.count !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#94A39A]">{sharePct}%</span>
                          <span className="text-sm font-bold text-[#111917]">{fmt(cat.amount, result.currency)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: "linear-gradient(90deg,#34d399,#059669)" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Top merchants */}
              <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-3">Top Merchants</p>
                <div className="space-y-2.5">
                  {result.topMerchants.map((m, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#111917] truncate">{m.name}</p>
                          <p className="text-[10px] text-[#94A39A]">{m.count} transaction{m.count !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#111917] shrink-0">{fmt(m.amount, result.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biggest expense + warnings */}
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#E4E7E5] bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-2">Biggest Single Expense</p>
                  <p className="text-lg font-bold text-[#111917]">{fmt(result.biggestExpense.amount, result.currency)}</p>
                  <p className="text-xs text-[#5A6A62] mt-0.5 line-clamp-2">{result.biggestExpense.description}</p>
                  {result.biggestExpense.date && (
                    <p className="text-[10px] text-[#94A39A] mt-1">{result.biggestExpense.date}</p>
                  )}
                </div>

                {result.warningFlags.length > 0 && (
                  <div
                    className="rounded-2xl p-4 space-y-2"
                    style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="h-3.5 w-3.5" style={{ color: "#f87171" }} />
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f87171" }}>Warning Flags</p>
                    </div>
                    {result.warningFlags.map((flag, i) => (
                      <p key={i} className="text-xs text-[#5A6A62]">{flag}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4" style={{ color: "#fbbf24" }} />
                <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A]">AI Insights</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {result.insights.map((ins, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3 flex gap-2"
                    style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}
                  >
                    <span className="text-sm shrink-0 mt-0.5">•</span>
                    <p className="text-xs text-[#5A6A62] leading-relaxed">{ins}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-[10px] text-[#94A39A]">AI analysis for educational purposes only. Figures extracted from uploaded statement.</p>
          </div>
        )}
      </div>
    </div>
  );
}
