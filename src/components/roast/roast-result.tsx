"use client";

import { CheckCircle, AlertTriangle, XCircle, Copy, AlertCircle } from "lucide-react";
import type { ElementType } from "react";

interface RoastData {
  score?: number;
  roast?: string;
  habits?: string[];
  improvements?: string[];
  summary?: string;
  catchphrase?: string;
  personaLabel?: string;
  spiritAnimal?: string;
}

interface PersonaInfo {
  id: string;
  Icon: ElementType;
  name: string;
  tagline: string;
  color: string;
  bg: string;
}

interface RoastResultProps {
  data: RoastData;
  persona: PersonaInfo;
  intensity: number;
  total: number;
}

export function RoastResult({ data, persona, intensity, total }: RoastResultProps) {
  const score = data.score ?? 40;
  const scoreColor = score >= 70 ? "#34d399" : score >= 55 ? "#fbbf24" : score >= 35 ? "#fb923c" : "#f87171";
  const ScoreIcon = score >= 70 ? CheckCircle : score >= 55 ? AlertCircle : score >= 35 ? AlertTriangle : XCircle;
  const scoreLabel = score >= 70 ? "Not Bad" : score >= 55 ? "Needs Work" : score >= 35 ? "Yikes" : "Financial Disaster";

  const shareText = `My financial health score: ${score}/100 💀\n"${data.catchphrase ?? data.roast ?? ""}"\n\nRoasted by ${data.personaLabel} on DollarPaisa`;

  function copyRoast() {
    navigator.clipboard.writeText(shareText).catch(() => {});
  }

  function shareTwitter() {
    const tweet = `My financial health score: ${score}/100 🔥 "${data.catchphrase ?? data.summary}" — Roasted by ${data.personaLabel} on @DollarPaisa`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&hashtags=DollarPaisa,FinancialRoast`, "_blank");
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  }

  async function shareNative() {
    if (navigator.share) {
      await navigator.share({ title: "My Financial Roast — DollarPaisa", text: shareText }).catch(() => {});
    } else {
      copyRoast();
    }
  }

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="rounded-2xl overflow-hidden bg-[#111917] text-white p-6 relative">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ background: `radial-gradient(circle at 80% 20%, ${persona.color}, transparent 60%)` }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Roasted by</p>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                  style={{ background: persona.bg, border: `1px solid ${persona.color}40` }}
                >
                  <persona.Icon className="h-5 w-5" style={{ color: persona.color }} />
                </div>
                <div>
                  <p className="text-lg font-bold">{persona.name}</p>
                  <p className="text-xs opacity-60">{persona.tagline}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-50 mb-1">Monthly Splurge</p>
              <p className="text-xl font-bold">${total.toLocaleString()}</p>
              <p className="text-xs opacity-40">Intensity: {intensity}/10</p>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 text-2xl font-black"
              style={{ borderColor: scoreColor, color: scoreColor, backgroundColor: `${scoreColor}15` }}
            >
              {score}
            </div>
            <div>
              <p className="text-xs opacity-50 uppercase tracking-widest">Financial Health</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ScoreIcon className="h-4 w-4" style={{ color: scoreColor }} />
                <p className="text-lg font-bold">{scoreLabel}</p>
              </div>
              {data.summary && <p className="text-xs opacity-60 mt-0.5">{data.summary}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* The Roast */}
      {data.roast && (
        <div className="rounded-2xl border p-5" style={{ backgroundColor: persona.bg, borderColor: persona.color + "33" }}>
          <div className="flex items-center gap-2 mb-3">
            <persona.Icon className="h-3.5 w-3.5" style={{ color: persona.color }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: persona.color }}>The Roast</p>
          </div>
          <p className="text-sm leading-relaxed text-[#111917] italic">&ldquo;{data.roast}&rdquo;</p>
        </div>
      )}

      {/* Catchphrase */}
      {data.catchphrase && (
        <div className="rounded-2xl bg-[#111917] p-4 text-center">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Catchphrase</p>
          <p className="text-base font-bold text-white italic">&ldquo;{data.catchphrase}&rdquo;</p>
        </div>
      )}

      {/* Spirit Animal */}
      {data.spiritAnimal && (
        <div className="rounded-2xl border border-[#E4E7E5] bg-white p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A]">Your Spirit Animal</p>
            <p className="text-lg font-black text-[#111917] mt-0.5">{data.spiritAnimal}</p>
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: `${scoreColor}18`, border: `1px solid ${scoreColor}30` }}
          >
            <ScoreIcon className="h-6 w-6" style={{ color: scoreColor }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Bad habits */}
        {data.habits && data.habits.length > 0 && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <XCircle className="h-3.5 w-3.5 text-red-700" />
              <p className="text-xs font-bold uppercase tracking-widest text-red-700">Worst Habits</p>
            </div>
            <ol className="space-y-2">
              {data.habits.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm text-red-900">
                  <span className="font-black shrink-0 text-red-400">{i + 1}.</span>
                  {h}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Improvements */}
        {data.improvements && data.improvements.length > 0 && (
          <div className="rounded-2xl border border-[#D1E8DA] bg-[#EAF4EE] p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <CheckCircle className="h-3.5 w-3.5 text-[#1B5E39]" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#1B5E39]">Start Today</p>
            </div>
            <ol className="space-y-2">
              {data.improvements.map((imp, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#1B5E39]">
                  <span className="font-black shrink-0">{i + 1}.</span>
                  {imp}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Share row */}
      <div className="rounded-2xl border border-[#E4E7E5] bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#94A39A] mb-3">Share your roast</p>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={shareTwitter}
            className="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-2 transition-all hover:scale-105"
            style={{ background: "rgba(29,161,242,0.12)", border: "1px solid rgba(29,161,242,0.25)" }}
          >
            <svg className="h-4 w-4" style={{ color: "#1da1f2" }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.265 5.638L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-[10px] font-semibold" style={{ color: "#1da1f2" }}>X / Twitter</span>
          </button>

          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-2 transition-all hover:scale-105"
            style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)" }}
          >
            <svg className="h-4 w-4" style={{ color: "#25d366" }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-[10px] font-semibold" style={{ color: "#25d366" }}>WhatsApp</span>
          </button>

          <button
            onClick={shareNative}
            className="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-2 transition-all hover:scale-105"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}
          >
            <svg className="h-4 w-4" style={{ color: "#818cf8" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span className="text-[10px] font-semibold" style={{ color: "#818cf8" }}>Share</span>
          </button>

          <button
            onClick={copyRoast}
            className="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-2 transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <Copy className="h-4 w-4 text-[#94A39A]" />
            <span className="text-[10px] font-semibold text-[#94A39A]">Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
