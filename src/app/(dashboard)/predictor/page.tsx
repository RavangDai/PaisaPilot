"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { TickerInput } from "@/components/predictor/ticker-input";
import { PredictionChart } from "@/components/predictor/prediction-chart";
import { Card, CardContent } from "@/components/ui/card";

export default function PredictorPage() {
  const [result, setResult] = useState<unknown>(null);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <TopNav title="Stock Predictor" />
      <div className="flex-1 p-6 space-y-6">
        <div>
          <p className="text-sm text-zinc-400">AI-powered market sentiment and stock analysis using Gemini Pro.</p>
          <p className="text-xs text-zinc-600 mt-1">For educational purposes only. Not financial advice.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <TickerInput onResult={setResult} />
          </CardContent>
        </Card>

        {result && <PredictionChart data={result as Parameters<typeof PredictionChart>[0]["data"]} />}

        {!result && (
          <div className="flex h-40 items-center justify-center text-zinc-500 text-sm">
            Enter a stock ticker above to get AI analysis
          </div>
        )}
      </div>
    </div>
  );
}
