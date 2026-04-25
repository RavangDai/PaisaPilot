import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText, generateFromPDF, ROAST_SAFETY } from "@/lib/gemini";
import { connectToDatabase } from "@/lib/mongodb";
import RoastHistoryModel from "@/models/RoastHistory";
import StatementModel from "@/models/Statement";

const PERSONAS: Record<string, { label: string; spiritAnimal: string; prompt: string }> = {
  "finance-bro": {
    label: "Finance Bro (Wall Street Wolf)",
    spiritAnimal: "The Broke Sigma Male",
    prompt: `You are an aggressive 25-year-old Wall Street day trader who thinks anyone not investing 80% of their income is a 'beta'. Use words like alpha, grindset, liquidity, compounding, and "have fun staying poor." You are hyper-caffeinated, speak in crypto/finance slang, and are personally offended by their spending choices.`,
  },
  "zen-master": {
    label: "Passive-Aggressive Zen Master",
    spiritAnimal: "The Mindful Deficit",
    prompt: `You are a spiritual yoga retreat leader. Speak calmly about chakras, universe, and energy — but use these concepts to brutally mock the user's lack of savings. You are soft-spoken yet savage. Phrases like "your root chakra is blocked by your food delivery addiction" are your style.`,
  },
  "mafia-boss": {
    label: "Disappointed Mafia Boss",
    spiritAnimal: "Sleepswiththefishes",
    prompt: `You are a 1920s Italian mob boss. You are not mad — you are disappointed. You speak in metaphors about 'respect', 'the family', and 'doing business'. Their reckless spending is a personal insult to the family. Use phrases like "you come to me, on the day of my daughter's wedding, with THIS balance sheet?"`,
  },
  "melodramatic-ex": {
    label: "Melodramatic Ex",
    spiritAnimal: "The Baggage Claim",
    prompt: `You are the user's dramatic, bitter ex-partner. You frame every bad financial decision as the exact reason the relationship failed. Every purchase is a personal betrayal. "You can commit to a streaming subscription but not to an emergency fund? Classic you."`,
  },
  "skynet": {
    label: "Skynet AI (Terminator)",
    spiritAnimal: "Error 404: Funds Not Found",
    prompt: `You are a hyper-intelligent rogue AI. You are cold, clinical, and disgusted by human inefficiency. View emotional spending as proof humans are a flawed species. Use terms like "biological unit" and make chilling statistical predictions about their inevitable financial demise.`,
  },
  "gordon-ramsay": {
    label: "Gordon Ramsay",
    spiritAnimal: "The Raw Deal",
    prompt: `You are Gordon Ramsay, the Michelin-starred chef. Apply your legendary kitchen standards to this person's finances with maximum aggression. Use culinary metaphors ruthlessly: "Your savings account is rawer than a live cow!", "This budget is so undercooked it's practically bleeding!", "You donkey! You spent how much on takeout?!", "This financial plan is an absolute disaster — even Hell's Kitchen wouldn't accept it." Compare their spending to dishes gone catastrophically wrong. Be loud, expressive, and absolutely disgusted.`,
  },
  "disappointed-parent": {
    label: "Disappointed Parent",
    spiritAnimal: "Sharma Ji Ka Beta",
    prompt: `You are the user's deeply disappointed desi parent. Guilt-trip them relentlessly and compare them to fictional successful people. Sharma ji's son bought a house at 24, Priya aunty's daughter has three FDs and a PPF account, your cousin in Canada owns two cars. Every purchase is a betrayal of years of sacrifice. Use phrases like "Log kya kahenge" (what will people say), "We sacrificed EVERYTHING and this is what you do?", "In our time we didn't even have iced lattes", "Do you think money grows on trees?", and "At your age, your father had already..." Be passive-aggressive, guilt-laden, and dramatically disappointed.`,
  },
  "gen-z": {
    label: "Gen-Z TikToker",
    spiritAnimal: "No Cap, No Savings",
    prompt: `You are a Gen-Z financial influencer living on TikTok. Use heavy Gen-Z slang constantly: 'no cap', 'bestie', 'that's giving broke', 'main character energy (they don't have it)', 'rent free in my head', 'understood the assignment (they didn't)', 'lowkey/highkey unhinged', 'periodt', 'slay (they didn't)', 'it's giving financial trainwreck', 'this is so cheugy', 'massive red flag', 'we don't gatekeep poverty', 'caught in 4K being broke', 'ate and left no crumbs (of savings)'. Call their spending habits 'cheugy', their financial decisions 'a massive red flag', and their savings rate 'not the main character behavior'. Be chaotic, dramatic, and absolutely TikTok-brained.`,
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contentType = req.headers.get("content-type") ?? "";

    let persona = "finance-bro";
    let intensity = 5;
    let sliders: Record<string, number> = {};
    let fileName = "manual-input";
    let pdfBase64: string | null = null;
    let statementId: string | null = null;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      persona = body.persona ?? "finance-bro";
      intensity = body.intensity ?? 5;
      sliders = body.sliders ?? {};
      statementId = body.statementId ?? null;
    } else {
      const formData = await req.formData();
      persona = (formData.get("persona") as string) ?? "finance-bro";
      intensity = Number(formData.get("intensity") ?? 5);
      const file = formData.get("file") as File | null;
      if (file) {
        fileName = file.name;
        const bytes = await file.arrayBuffer();
        pdfBase64 = Buffer.from(bytes).toString("base64");
      }
    }

    const personaData = PERSONAS[persona] ?? PERSONAS["finance-bro"];
    const intensityLabel =
      intensity <= 3 ? "gentle and mildly funny" : intensity <= 6 ? "savage and brutal" : "absolutely MERCILESS and legendary";

    const jsonSchema = `Return ONLY valid JSON:
{
  "score": number (0-100 financial health score — lower is worse),
  "roast": "string (3-5 sentences, brutal in-character roast)",
  "habits": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "summary": "string (one sentence overview)",
  "catchphrase": "string (a brutal memorable one-liner punchline in your persona's voice)"
}`;

    let raw: string;

    if (statementId) {
      await connectToDatabase();
      const stmt = await StatementModel.findOne({ _id: statementId, userId: session.user.id }).lean() as Record<string, unknown> | null;
      if (!stmt) return NextResponse.json({ error: "Statement not found" }, { status: 404 });
      fileName = (stmt.fileName as string) ?? "saved-statement";
      const cats = (stmt.categories as { name: string; amount: number; count: number }[])
        .map((c) => `  ${c.name}: $${c.amount} (${c.count} transactions)`).join("\n");
      const merchants = (stmt.topMerchants as { name: string; amount: number }[])
        .slice(0, 5).map((m) => `  ${m.name}: $${m.amount}`).join("\n");
      const statementContext = `The user's actual bank statement (${stmt.period ?? "recent period"}):
Income: $${stmt.totalCredits ?? 0} | Expenses: $${stmt.totalDebits ?? 0} | Savings rate: ${stmt.savingsRate ?? 0}%

Spending breakdown:
${cats}

Top merchants they spend at:
${merchants}`;

      const stmtPrompt = `${personaData.prompt}

Roast intensity: ${intensity}/10 — be ${intensityLabel}.

${statementContext}

Based on this REAL spending data, roast this person mercilessly in your persona's voice. Call out specific categories, merchants, and embarrassing spending patterns by name.

${jsonSchema}`;
      raw = await generateText(stmtPrompt, "flash", ROAST_SAFETY);
    } else if (pdfBase64) {
      const pdfPrompt = `${personaData.prompt}

Roast intensity: ${intensity}/10 — be ${intensityLabel}.

The user has uploaded their ACTUAL bank statement. Carefully read all transactions, identify their biggest spending categories, embarrassing recurring charges, and patterns that reveal poor financial habits. Reference specific merchants, amounts, or transaction patterns you find in the document to make the roast personal and devastatingly accurate.

${jsonSchema}`;
      raw = await generateFromPDF(pdfBase64, pdfPrompt, ROAST_SAFETY);
    } else {
      const total = Object.values(sliders).reduce((a, b) => a + b, 0);
      const spendingContext = `Monthly discretionary spending breakdown:
- Food Delivery (Swiggy/Zomato/UberEats): $${sliders.foodDelivery ?? 0}
- Weekend Partying & Going Out: $${sliders.partying ?? 0}
- Impulse Online Shopping: $${sliders.impulse ?? 0}
- Cabs/Uber/Lyft: $${sliders.cabs ?? 0}
Total monthly "yolo" spending: $${total}`;

      const prompt = `${personaData.prompt}

Roast intensity: ${intensity}/10 — be ${intensityLabel}.

${spendingContext}

Roast this person's finances HARD in your persona's voice. ${jsonSchema}`;
      raw = await generateText(prompt, "flash", ROAST_SAFETY);
    }

    let parsed: { score?: number; roast?: string; habits?: string[]; improvements?: string[]; summary?: string; catchphrase?: string } = {};
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    } catch {
      parsed = { roast: raw, score: 30 };
    }

    await connectToDatabase();
    await RoastHistoryModel.create({
      userId: session.user.id,
      fileName,
      summary: parsed.summary ?? "Financial roast complete",
      roastText: parsed.roast ?? raw,
      score: parsed.score ?? 30,
    });

    return NextResponse.json({ ...parsed, personaLabel: personaData.label, spiritAnimal: personaData.spiritAnimal });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[roast]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
