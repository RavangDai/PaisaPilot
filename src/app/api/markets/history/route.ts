import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

type Period = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y";

function periodToConfig(period: Period): {
  period1: string;
  interval: "1m" | "5m" | "15m" | "30m" | "1h" | "1d" | "1wk" | "1mo";
} {
  const now = new Date();
  const map: Record<Period, { days: number; interval: "5m" | "1h" | "1d" | "1wk" | "1mo" }> = {
    "1d":  { days: 1,    interval: "5m"  },
    "5d":  { days: 5,    interval: "1h"  },
    "1mo": { days: 30,   interval: "1d"  },
    "3mo": { days: 90,   interval: "1d"  },
    "6mo": { days: 180,  interval: "1d"  },
    "1y":  { days: 365,  interval: "1d"  },
    "2y":  { days: 730,  interval: "1wk" },
    "5y":  { days: 1825, interval: "1mo" },
  };
  const { days, interval } = map[period];
  const period1 = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  return { period1, interval };
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const period = (req.nextUrl.searchParams.get("period") ?? "1mo") as Period;

  if (!symbol) return NextResponse.json({ error: "symbol is required" }, { status: 400 });

  try {
    const { period1, interval } = periodToConfig(period);

    const result = await yf.chart(symbol, {
      period1,
      period2: new Date().toISOString().split("T")[0],
      interval,
    });

    const candles = (result.quotes ?? [])
      .filter((q) => q.close !== null && q.close !== undefined)
      .map((q) => ({
        date: new Date(q.date).getTime(),
        open:   Number(q.open   ?? 0),
        high:   Number(q.high   ?? 0),
        low:    Number(q.low    ?? 0),
        close:  Number(q.close  ?? 0),
        volume: Number(q.volume ?? 0),
      }));

    return NextResponse.json({
      symbol,
      period,
      currency: result.meta?.currency ?? "USD",
      candles,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
