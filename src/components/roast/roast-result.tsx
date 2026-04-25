"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoastData {
  score?: number;
  roast?: string;
  habits?: string[];
  improvements?: string[];
  summary?: string;
}

export function RoastResult({ data }: { data: RoastData }) {
  const score = data.score ?? 50;
  const scoreColor = score >= 70 ? "text-emerald-400" : score >= 40 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">Your Financial Roast</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Score:</span>
          <span className={`text-2xl font-bold ${scoreColor}`}>{score}/100</span>
        </div>
      </div>

      {data.summary && (
        <Badge variant="secondary" className="text-sm py-1 px-3 w-full justify-center">
          {data.summary}
        </Badge>
      )}

      {data.roast && (
        <Card className="border-orange-800/50 bg-orange-900/10">
          <CardHeader><CardTitle className="text-orange-400">🔥 The Roast</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-zinc-200 leading-relaxed italic">&quot;{data.roast}&quot;</p></CardContent>
        </Card>
      )}

      {data.habits && data.habits.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-red-400">Worst Financial Habits</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {data.habits.map((h, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="text-red-500 font-bold">{i + 1}.</span>{h}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {data.improvements && data.improvements.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-emerald-400">Start TODAY</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {data.improvements.map((imp, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="text-emerald-500 font-bold">{i + 1}.</span>{imp}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
