"use client";

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
  icon: string;
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
  const scoreColor = score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";
  const scoreBg = score >= 70 ? "#EAF4EE" : score >= 40 ? "#FFF7ED" : "#FEF2F2";
  const scoreBorder = score >= 70 ? "#D1E8DA" : score >= 40 ? "#FED7AA" : "#FECACA";
  const scoreLabel = score >= 70 ? "Not Bad" : score >= 55 ? "Needs Work" : score >= 35 ? "Yikes" : "Financial Disaster";
  const scoreEmoji = score >= 70 ? "😅" : score >= 55 ? "😬" : score >= 35 ? "🔥" : "💀";

  function copyRoast() {
    const text = `${data.catchphrase ?? data.roast ?? ""}\n\nFinancial Health Score: ${score}/100\nSpirit Animal: ${data.spiritAnimal}\n\nRoasted by ${data.personaLabel} on DollarPaisa`;
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <div className="space-y-4">
      {/* Header card — Spotify Wrapped style */}
      <div className="rounded-2xl overflow-hidden bg-[#111917] text-white p-6 relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle at 80% 20%, ${persona.color}, transparent 60%)` }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Roasted by</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{persona.icon}</span>
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

          {/* Score ring */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-black border-4"
              style={{ borderColor: scoreColor, color: scoreColor, backgroundColor: `${scoreColor}15` }}
            >
              {score}
            </div>
            <div>
              <p className="text-xs opacity-50 uppercase tracking-widest">Financial Health</p>
              <p className="text-lg font-bold">{scoreEmoji} {scoreLabel}</p>
              {data.summary && <p className="text-xs opacity-60 mt-0.5">{data.summary}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* The Roast */}
      {data.roast && (
        <div className="rounded-2xl border p-5" style={{ backgroundColor: persona.bg, borderColor: persona.color + "33" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: persona.color }}>
            {persona.icon} The Roast
          </p>
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
            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: scoreBg, border: `1px solid ${scoreBorder}` }}
          >
            {scoreEmoji}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Bad habits */}
        {data.habits && data.habits.length > 0 && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-red-700 mb-3">🚨 Your Worst Habits</p>
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
            <p className="text-xs font-bold uppercase tracking-widest text-[#1B5E39] mb-3">✅ Start Today</p>
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

      {/* Share button */}
      <button
        onClick={copyRoast}
        className="w-full rounded-xl border border-[#E4E7E5] bg-white py-2.5 text-sm font-semibold text-[#5A6A62] hover:border-[#1B5E39] hover:text-[#1B5E39] transition-colors"
      >
        📋 Copy Roast to Share
      </button>
    </div>
  );
}
