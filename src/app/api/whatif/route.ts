import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { scenario } = await req.json();
    if (!scenario?.trim()) return NextResponse.json({ error: "Scenario is required" }, { status: 400 });

    const prompt = `You are DollarPaisa's What-If Financial Analysis Engine — a world-class economic analyst. Analyze this hypothetical scenario with deep financial expertise.

Scenario: "${scenario}"

Return ONLY valid JSON (no markdown, no extra text) with exactly this structure:
{
  "headline": "dramatic punchy one-liner about the financial impact",
  "severity": "Minor|Moderate|Severe|Catastrophic",
  "probability": "Very Low|Low|Medium|High",
  "immediateEffects": [
    {"icon": "emoji", "effect": "description", "impact": "positive|negative|neutral"}
  ],
  "stocksAffected": [
    {"symbol": "TICKER", "name": "Full Company Name", "expectedChange": "+X% to +Y%", "direction": "up|down|volatile"}
  ],
  "sectorsImpacted": [
    {"sector": "Sector Name", "impact": "bullish|bearish|mixed", "reason": "brief explanation"}
  ],
  "personalFinanceTips": [
    {"action": "specific action", "urgency": "now|soon|monitor"}
  ],
  "timeline": [
    {"period": "Day 1", "event": "what happens financially"}
  ],
  "verdict": "2-3 sentence overall financial assessment"
}

Requirements: exactly 5 immediateEffects, 6 stocksAffected (mix up/down), 4 sectorsImpacted, 4 personalFinanceTips, 4 timeline entries (Day 1, Week 1, Month 1, 6 Months).`;

    const raw = await generateText(prompt, "pro");

    let parsed;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    } catch {
      parsed = null;
    }

    if (!parsed) return NextResponse.json({ error: "Analysis failed. Try rephrasing your scenario." }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
