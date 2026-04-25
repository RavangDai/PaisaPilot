"use client";

import { TrendingUp, TrendingDown, Minus, AlertTriangle, Zap } from "lucide-react";

interface PredictionData {
  ticker: string;
  analysis: {
    company?: string;
    sentiment?: string;
    outlook?: string;
    risks?: string[];
    opportunities?: string[];
    metrics?: string[];
    analysis?: string;
  };
}

function str(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    const v = val as Record<string, unknown>;
    return String(v.overall ?? v.value ?? v.label ?? v.text ?? Object.values(v)[0] ?? "");
  }
  return String(val ?? "");
}

export function PredictionChart({ data }: { data: PredictionData }) {
  const { ticker, analysis } = data;
  const sentiment = str(analysis.sentiment).toLowerCase();
  const isBullish = sentiment.includes("bull");
  const isBearish = sentiment.includes("bear");

  const sentimentLabel = str(analysis.sentiment) || "Neutral";
  const sentimentConfig = isBullish
    ? { icon: TrendingUp, color: "#16a34a", bg: "#EAF4EE", label: sentimentLabel }
    : isBearish
    ? { icon: TrendingDown, color: "#dc2626", bg: "#FEF2F2", label: sentimentLabel }
    : { icon: Minus, color: "#d97706", bg: "#FFFBEB", label: sentimentLabel };

  const SentimentIcon = sentimentConfig.icon;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-[#111917]">{ticker}</h2>
            {analysis.company && (
              <p className="text-sm text-[#5A6A62] mt-0.5 max-w-lg">{str(analysis.company)}</p>
            )}
          </div>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-1.5"
            style={{ backgroundColor: sentimentConfig.bg }}
          >
            <SentimentIcon className="h-4 w-4" style={{ color: sentimentConfig.color }} />
            <span className="text-sm font-semibold" style={{ color: sentimentConfig.color }}>
              {sentimentConfig.label}
            </span>
          </div>
        </div>
        {analysis.outlook && (
          <div className="rounded-xl bg-[#F0F2F1] p-3.5">
            <p className="text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">
              3-Month Outlook
            </p>
            <p className="text-sm text-[#111917] leading-relaxed">{str(analysis.outlook)}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Opportunities */}
        {analysis.opportunities && analysis.opportunities.length > 0 && (
          <div className="rounded-2xl border border-[#D1E8DA] bg-[#EAF4EE] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-[#1B5E39]" />
              <p className="text-xs font-semibold text-[#1B5E39] uppercase tracking-wide">
                Opportunities
              </p>
            </div>
            <ul className="space-y-2">
              {analysis.opportunities.map((o, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#1B5E39]">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1B5E39] shrink-0" />
                  {str(o)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {analysis.risks && analysis.risks.length > 0 && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                Risks
              </p>
            </div>
            <ul className="space-y-2">
              {analysis.risks.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-red-700">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  {str(r)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {analysis.analysis && !analysis.company && (
        <div className="rounded-2xl border border-[#E4E7E5] bg-white p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
          <p className="text-sm text-[#5A6A62] leading-relaxed">{analysis.analysis}</p>
        </div>
      )}
    </div>
  );
}
