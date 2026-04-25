"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import { RoastResult } from "@/components/roast/roast-result";
import {
  Loader2, Flame, ChevronRight,
  TrendingUp, Wind, Briefcase, HeartCrack, Cpu,
  ChefHat, Users, Smartphone,
  Upload, FileText, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";

interface PersonaDef {
  id: string;
  Icon: ElementType;
  name: string;
  tagline: string;
  color: string;
  bg: string;
  preview: string;
}

const PERSONAS: PersonaDef[] = [
  {
    id: "finance-bro",
    Icon: TrendingUp,
    name: "Finance Bro",
    tagline: "Wall Street Wolf",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    preview: "Your liquidity is drier than a Popeyes biscuit. Have fun staying poor.",
  },
  {
    id: "zen-master",
    Icon: Wind,
    name: "Zen Master",
    tagline: "Passive-Aggressive Guru",
    color: "#a78bfa",
    bg: "rgba(124,58,237,0.15)",
    preview: "I sense a deep blockage in your root chakra, manifesting as poor savings.",
  },
  {
    id: "mafia-boss",
    Icon: Briefcase,
    name: "Mafia Boss",
    tagline: "Disappointed Don",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    preview: "You come to me with THIS bank statement? This breaks my heart.",
  },
  {
    id: "melodramatic-ex",
    Icon: HeartCrack,
    name: "Melodramatic Ex",
    tagline: "Bitter & Dramatic",
    color: "#f472b6",
    bg: "rgba(236,72,153,0.12)",
    preview: "You can commit to Netflix but not to an emergency fund? Classic you.",
  },
  {
    id: "skynet",
    Icon: Cpu,
    name: "Skynet AI",
    tagline: "Cold & Calculating",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.1)",
    preview: "Analysis complete. Your financial efficiency coefficient is dangerously low.",
  },
  {
    id: "gordon-ramsay",
    Icon: ChefHat,
    name: "Gordon Ramsay",
    tagline: "Michelin-Star Judgment",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    preview: "Your savings account is rawer than a live cow, you absolute donkey!",
  },
  {
    id: "disappointed-parent",
    Icon: Users,
    name: "Disappointed Parent",
    tagline: "Sharma Ji Ka Beta",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.1)",
    preview: "Sharma ji's son bought a house. You bought 14 iced lattes.",
  },
  {
    id: "gen-z",
    Icon: Smartphone,
    name: "Gen-Z TikToker",
    tagline: "No Cap, No Savings",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.1)",
    preview: "Bestie, this budget is giving massive red flag energy. Periodt.",
  },
];

const SLIDER_LABELS = [
  { key: "foodDelivery", label: "Food Delivery", subtitle: "Swiggy / Zomato / UberEats", max: 15000 },
  { key: "partying",     label: "Weekend Partying", subtitle: "Going out / clubs / drinks", max: 15000 },
  { key: "impulse",      label: "Impulse Shopping", subtitle: "Amazon / online buys", max: 15000 },
  { key: "cabs",         label: "Cabs / Uber", subtitle: "Rides & transport", max: 10000 },
];

type RoastData = {
  score?: number;
  roast?: string;
  habits?: string[];
  improvements?: string[];
  summary?: string;
  catchphrase?: string;
  personaLabel?: string;
  spiritAnimal?: string;
};

export default function RoastPage() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [persona, setPersona] = useState("finance-bro");
  const [intensity, setIntensity] = useState(7);
  const [sliders, setSliders] = useState({ foodDelivery: 0, partying: 0, impulse: 0, cabs: 0 });
  const [inputMode, setInputMode] = useState<"manual" | "pdf">("manual");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [result, setResult] = useState<RoastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setPdfFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop,
  });

  function maxOut() {
    setSliders({ foodDelivery: 8000, partying: 6000, impulse: 4000, cabs: 3000 });
  }

  async function handleRoast() {
    setLoading(true);
    setError("");
    try {
      let res: Response;
      if (inputMode === "pdf" && pdfFile) {
        const form = new FormData();
        form.append("file", pdfFile);
        form.append("persona", persona);
        form.append("intensity", String(intensity));
        res = await fetch("/api/roast", { method: "POST", body: form });
      } else {
        res = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona, intensity, sliders }),
        });
      }
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(data);
      setStep(3);
    } catch {
      setError("Roast failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0); setResult(null); setError(""); setPdfFile(null);
    setSliders({ foodDelivery: 0, partying: 0, impulse: 0, cabs: 0 });
    setPersona("finance-bro"); setIntensity(7); setInputMode("manual");
  }

  const selectedPersona = PERSONAS.find((p) => p.id === persona) ?? PERSONAS[0];
  const total = Object.values(sliders).reduce((a, b) => a + b, 0);
  const canRoast = inputMode === "pdf" ? !!pdfFile : true;

  return (
    <div className="flex h-full flex-col">
      <TopNav title="Roast My Finances" subtitle="Pick your poison. Get destroyed." />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Step 0: Consent */}
          {step === 0 && (
            <div
              className="rounded-2xl p-8 text-center space-y-5"
              style={{
                background: "rgba(251,150,30,0.08)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(251,150,30,0.25)",
                boxShadow: "0 4px 32px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl"
                style={{ background: "rgba(251,150,30,0.18)", border: "1px solid rgba(251,150,30,0.3)" }}
              >
                <Flame className="h-8 w-8" style={{ color: "#fb923c" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ color: "#f0f4f8" }}>Financial Roast Mode</h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Brace yourself. This is going to hurt.</p>
              </div>
              <div
                className="rounded-xl p-4 text-left space-y-2"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(251,150,30,0.2)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#fb923c" }}>Roast Agreement</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  I, the undersigned human with{" "}
                  <span className="font-semibold" style={{ color: "#fbbf24" }}>questionable financial decisions</span>,
                  hereby consent to having my spending habits mercilessly mocked by an AI. I acknowledge that my food delivery habit
                  is, in fact, a red flag. I accept that the AI will not hold back, and I promise not to cry.
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.36)" }}>By clicking below you agree to receive an unfiltered financial reality check.</p>
              </div>
              <Button
                onClick={() => setStep(1)}
                size="lg"
                className="w-full gap-2 rounded-xl font-semibold"
                style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none" }}
              >
                <Flame className="h-4 w-4" /> I Accept My Fate
              </Button>
            </div>
          )}

          {/* Step 1: Pick Persona */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
                <p className="text-[15px] font-bold text-[#111917] mb-1">Pick Your Poison</p>
                <p className="text-xs text-[#5A6A62] mb-4">Choose who will roast you. Each has a very different style.</p>
                <div className="space-y-2">
                  {PERSONAS.map((p) => {
                    const active = persona === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPersona(p.id)}
                        className="w-full rounded-xl border p-3 text-left transition-all hover:shadow-sm"
                        style={
                          active
                            ? { borderColor: p.color, borderWidth: 2, backgroundColor: p.bg }
                            : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                            style={{ backgroundColor: p.bg, border: `1px solid ${p.color}30` }}
                          >
                            <p.Icon className="h-4 w-4" style={{ color: p.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold" style={{ color: "#f0f4f8" }}>{p.name}</span>
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: p.bg, color: p.color }}
                              >
                                {p.tagline}
                              </span>
                            </div>
                            <p className="text-xs mt-0.5 italic truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                              &ldquo;{p.preview}&rdquo;
                            </p>
                          </div>
                          {active && (
                            <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full gap-2 rounded-xl">
                <selectedPersona.Icon className="h-4 w-4" style={{ color: selectedPersona.color }} />
                Continue with {selectedPersona.name}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Data Input */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Mode toggle */}
              <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
                <p className="text-[15px] font-bold text-[#111917] mb-3">How should we get your data?</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["pdf", "manual"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setInputMode(mode)}
                      className="rounded-xl border p-3 text-left transition-all"
                      style={
                        inputMode === mode
                          ? { borderColor: "#34d399", borderWidth: 2, backgroundColor: "rgba(52,211,153,0.1)" }
                          : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }
                      }
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {mode === "pdf"
                          ? <FileText className="h-4 w-4" style={{ color: inputMode === "pdf" ? "#34d399" : "rgba(255,255,255,0.4)" }} />
                          : <TrendingUp className="h-4 w-4" style={{ color: inputMode === "manual" ? "#34d399" : "rgba(255,255,255,0.4)" }} />
                        }
                        <span className="text-sm font-semibold" style={{ color: inputMode === mode ? "#34d399" : "rgba(255,255,255,0.6)" }}>
                          {mode === "pdf" ? "Upload PDF Statement" : "Enter Manually"}
                        </span>
                      </div>
                      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {mode === "pdf" ? "Real transactions, personalised roast" : "Use spending sliders"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* PDF Upload */}
              {inputMode === "pdf" && (
                <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
                  {!pdfFile ? (
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
                        {isDragActive ? "Drop it here" : "Drop your bank statement PDF"}
                      </p>
                      <p className="text-xs text-[#5A6A62]">or click to browse — PDF only</p>
                    </div>
                  ) : (
                    <div
                      className="rounded-xl p-4 flex items-center gap-3"
                      style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)" }}
                    >
                      <FileText className="h-8 w-8 shrink-0" style={{ color: "#34d399" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111917] truncate">{pdfFile.name}</p>
                        <p className="text-xs text-[#5A6A62]">{(pdfFile.size / 1024).toFixed(0)} KB — ready to roast</p>
                      </div>
                      <button onClick={() => setPdfFile(null)} className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <X className="h-4 w-4" style={{ color: "rgba(255,255,255,0.4)" }} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Sliders */}
              {inputMode === "manual" && (
                <>
                  <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[15px] font-bold text-[#111917]">Confess Your Sins</p>
                      <button onClick={maxOut} className="text-xs font-semibold text-amber-600 hover:text-amber-700 border border-amber-200 bg-amber-50 px-2.5 py-1 rounded-lg transition-colors">
                        Max out (demo)
                      </button>
                    </div>
                    <p className="text-xs text-[#5A6A62] mb-5">How much do you REALLY spend per month?</p>
                    <div className="space-y-5">
                      {SLIDER_LABELS.map(({ key, label, subtitle, max }) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div>
                              <p className="text-sm font-semibold text-[#111917]">{label}</p>
                              <p className="text-[11px] text-[#94A39A]">{subtitle}</p>
                            </div>
                            <span className="text-sm font-bold text-[#111917] tabular-nums">
                              ${sliders[key as keyof typeof sliders].toLocaleString()}
                            </span>
                          </div>
                          <input
                            type="range" min={0} max={max} step={100}
                            value={sliders[key as keyof typeof sliders]}
                            onChange={(e) => setSliders((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                            className="w-full accent-[#1B5E39] h-1.5 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-[#C9D4CE] mt-0.5">
                            <span>$0</span><span>${(max / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-xl bg-[#F8FAF9] border border-[#E4E7E5] p-3 flex items-center justify-between">
                      <p className="text-sm text-[#5A6A62]">Total monthly spending</p>
                      <p className="text-lg font-bold text-[#111917]">${total.toLocaleString()}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Intensity */}
              <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-[#111917]">Roast Intensity</p>
                  <span className="text-sm font-bold" style={{ color: intensity <= 3 ? "#16a34a" : intensity <= 6 ? "#d97706" : "#dc2626" }}>
                    {intensity <= 3 ? "Gentle" : intensity <= 6 ? "Savage" : "Merciless"} ({intensity}/10)
                  </span>
                </div>
                <input
                  type="range" min={1} max={10} step={1} value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-1.5 cursor-pointer"
                  style={{ accentColor: intensity <= 3 ? "#16a34a" : intensity <= 6 ? "#d97706" : "#dc2626" }}
                />
                <div className="flex justify-between text-[10px] text-[#C9D4CE] mt-0.5">
                  <span>Gentle</span><span>Merciless</span>
                </div>
              </div>

              {error && <div className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-600">{error}</div>}

              <Button
                onClick={handleRoast}
                disabled={loading || !canRoast}
                size="lg"
                className="w-full rounded-xl gap-2 bg-[#111917] hover:bg-black text-white"
              >
                {loading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Getting roasted…</>
                  : <><Flame className="h-4 w-4" /> Roast Me, {selectedPersona.name}</>
                }
              </Button>
              {inputMode === "pdf" && !pdfFile && (
                <p className="text-center text-xs text-[#94A39A]">Upload a PDF to continue</p>
              )}
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && (
            <div className="space-y-4">
              <RoastResult data={result} persona={selectedPersona} intensity={intensity} total={total} />
              <Button variant="outline" onClick={reset} className="w-full rounded-xl">
                Try Another Roast
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
