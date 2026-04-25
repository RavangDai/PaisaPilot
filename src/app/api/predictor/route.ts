import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ticker } = await req.json();
    if (!ticker) return NextResponse.json({ error: "Ticker symbol is required" }, { status: 400 });

    const prompt = `You are a financial analysis AI. Analyze the stock ticker "${ticker.toUpperCase()}" and provide:
1. A brief company overview (2-3 sentences)
2. Key financial metrics to watch
3. Recent market sentiment (bullish/bearish/neutral) with reasoning
4. A 3-month price outlook with a target range
5. Main risks and opportunities

Format your response as JSON with these keys: company, metrics, sentiment, outlook, risks, opportunities. Be realistic and data-driven.`;

    const raw = await generateText(prompt, "pro");

    let parsed;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { analysis: raw };
    } catch {
      parsed = { analysis: raw };
    }

    return NextResponse.json({ ticker: ticker.toUpperCase(), analysis: parsed });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
