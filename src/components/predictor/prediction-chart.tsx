"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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

export function PredictionChart({ data }: { data: PredictionData }) {
  const { ticker, analysis } = data;
  const sentiment = analysis.sentiment?.toLowerCase() ?? "neutral";

  const SentimentIcon = sentiment.includes("bull") ? TrendingUp : sentiment.includes("bear") ? TrendingDown : Minus;
  const sentimentColor = sentiment.includes("bull") ? "default" : sentiment.includes("bear") ? "destructive" : "secondary";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-zinc-100">{ticker}</h2>
        <Badge variant={sentimentColor} className="flex items-center gap-1">
          <SentimentIcon className="h-3 w-3" />
          {analysis.sentiment ?? "Neutral"}
        </Badge>
      </div>

      {analysis.company && (
        <Card>
          <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-zinc-300 leading-relaxed">{analysis.company}</p></CardContent>
        </Card>
      )}

      {analysis.outlook && (
        <Card>
          <CardHeader><CardTitle>3-Month Outlook</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-zinc-300 leading-relaxed">{analysis.outlook}</p></CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        {analysis.opportunities && analysis.opportunities.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-emerald-400">Opportunities</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {analysis.opportunities.map((o, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex gap-2"><span className="text-emerald-500">+</span>{o}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {analysis.risks && analysis.risks.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-red-400">Risks</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {analysis.risks.map((r, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex gap-2"><span className="text-red-500">−</span>{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {analysis.analysis && (
        <Card>
          <CardContent><p className="text-sm text-zinc-300 leading-relaxed pt-2">{analysis.analysis}</p></CardContent>
        </Card>
      )}
    </div>
  );
}
