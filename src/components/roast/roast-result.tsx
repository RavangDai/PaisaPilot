"use client";

interface RoastData {
  score?: number;
  roast?: string;
  habits?: string[];
  improvements?: string[];
  summary?: string;
}

export function RoastResult({ data }: { data: RoastData }) {
  const score = data.score ?? 50;
  const scoreColor =
    score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";
  const scoreBg =
    score >= 70 ? "#EAF4EE" : score >= 40 ? "#FFFBEB" : "#FEF2F2";

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-[#E4E7E5]">
        <div>
          <p className="text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-0.5">
            Financial Health Score
          </p>
          {data.summary && <p className="text-sm text-[#111917]">{data.summary}</p>}
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold"
          style={{ backgroundColor: scoreBg, color: scoreColor }}
        >
          {score}
        </div>
      </div>

      {/* Roast */}
      {data.roast && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
            🔥 The Roast
          </p>
          <p className="text-sm text-amber-900 leading-relaxed italic">
            &ldquo;{data.roast}&rdquo;
          </p>
        </div>
      )}

      {/* Habits */}
      {data.habits && data.habits.length > 0 && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-3">
            Worst Habits
          </p>
          <ol className="space-y-2">
            {data.habits.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-red-900">
                <span className="font-bold shrink-0">{i + 1}.</span>
                {h}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Improvements */}
      {data.improvements && data.improvements.length > 0 && (
        <div className="rounded-xl border border-[#D1E8DA] bg-[#EAF4EE] p-4">
          <p className="text-xs font-semibold text-[#1B5E39] uppercase tracking-wide mb-3">
            Start Today
          </p>
          <ol className="space-y-2">
            {data.improvements.map((imp, i) => (
              <li key={i} className="flex gap-2 text-sm text-[#1B5E39]">
                <span className="font-bold shrink-0">{i + 1}.</span>
                {imp}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
