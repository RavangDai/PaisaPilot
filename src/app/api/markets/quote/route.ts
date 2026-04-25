import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export async function GET(req: NextRequest) {
  const symbols = req.nextUrl.searchParams.get("symbols") ?? "^GSPC,^DJI,^IXIC,BTC-USD";
  const list = symbols.split(",").map((s) => s.trim()).filter(Boolean);

  try {
    const results = await Promise.allSettled(list.map((s) => yf.quote(s)));

    const quotes = results.map((r, i) => {
      if (r.status === "fulfilled") return r.value;
      return { symbol: list[i], error: true };
    });

    return NextResponse.json({ quotes });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
