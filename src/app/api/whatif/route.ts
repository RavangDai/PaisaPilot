import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "@/lib/gemini";
import { connectToDatabase } from "@/lib/mongodb";
import StatementModel from "@/models/Statement";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { scenario, statementId } = await req.json();
    if (!scenario?.trim()) return NextResponse.json({ error: "Scenario is required" }, { status: 400 });

    let statementContext = "";
    if (statementId) {
      await connectToDatabase();
      const stmt = await StatementModel.findOne({ _id: statementId, userId: session.user.id }).lean() as Record<string, unknown> | null;
      if (stmt) {
        const cats = (stmt.categories as { name: string; amount: number }[])
          .slice(0, 6).map((c) => `  ${c.name}: $${c.amount}`).join("\n");
        const merchants = (stmt.topMerchants as { name: string; amount: number }[])
          .slice(0, 4).map((m) => `  ${m.name}: $${m.amount}`).join("\n");
        statementContext = `

USER'S ACTUAL FINANCIAL DATA (from uploaded bank statement, period: ${stmt.period ?? "recent"}):
Monthly income: $${stmt.totalCredits ?? 0}
Monthly expenses: $${stmt.totalDebits ?? 0}
Savings rate: ${stmt.savingsRate ?? 0}%
Spending breakdown:
${cats}
Top merchants:
${merchants}

Analyze this scenario specifically in context of the user's actual spending. Be personal, specific, and reference their real numbers. For personal what-if queries (e.g. "what if I stop X", "how long to save for Y"), calculate exact timelines using their real data.`;
      }
    }

    const prompt = `You are DollarPilot's What-If Financial Analysis Engine, a world-class economic analyst. Analyze this hypothetical scenario with deep financial expertise.

Scenario: "${scenario}"${statementContext}

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

Requirements: exactly 5 immediateEffects, 6 stocksAffected (mix up/down), 4 sectorsImpacted, 4 personalFinanceTips, 4 timeline entries (Day 1, Week 1, Month 1, 6 Months). For personal scenarios, make personalFinanceTips extremely specific with real numbers from the user's data.`;

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
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[whatif]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
