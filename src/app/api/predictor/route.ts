import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ticker } = await req.json();
    if (!ticker) return NextResponse.json({ error: "Ticker symbol is required" }, { status: 400 });

    const prompt = `You are a financial analysis AI. Analyze the stock ticker "${ticker.toUpperCase()}" and return ONLY valid JSON with exactly these keys and value types:

{
  "company": "string — 2-3 sentence company overview",
  "sentiment": "string — exactly one of: Bullish, Bearish, or Neutral",
  "sentimentReason": "string — one sentence explaining the sentiment",
  "outlook": "string — 3-month price outlook with a target range",
  "metrics": ["string", "string", "string"],
  "risks": ["string", "string", "string"],
  "opportunities": ["string", "string", "string"]
}

All values must be strings or arrays of strings. Do not nest objects. Be realistic and data-driven.`;

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
