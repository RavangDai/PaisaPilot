"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { TickerInput } from "@/components/predictor/ticker-input";
import { PredictionChart } from "@/components/predictor/prediction-chart";
import { BarChart2 } from "lucide-react";

export default function PredictorPage() {
  const [result, setResult] = useState<unknown>(null);

  return (
    <div className="flex h-full flex-col">
      <TopNav title="Stock Predictor" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] p-5">
          <p className="text-[15px] font-semibold text-[#111917] mb-1">Analyze a Stock</p>
          <p className="text-xs text-[#5A6A62] mb-4">
            Enter any ticker symbol for AI-powered sentiment analysis and outlook.
          </p>
          <TickerInput onResult={setResult} />
        </div>

        {result ? (
          <PredictionChart data={result as Parameters<typeof PredictionChart>[0]["data"]} />
        ) : (
          <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D5DAD7] text-[#94A39A]">
            <BarChart2 className="h-8 w-8 opacity-30" />
            <p className="text-sm">Enter a ticker above to get AI analysis</p>
          </div>
        )}

        <p className="text-xs text-[#94A39A] text-center">
          For educational purposes only. Not financial advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
