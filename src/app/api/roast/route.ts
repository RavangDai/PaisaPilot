import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "@/lib/gemini";
import { connectToDatabase } from "@/lib/mongodb";
import RoastHistoryModel from "@/models/RoastHistory";

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
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contentType = req.headers.get("content-type") ?? "";

    let persona = "finance-bro";
    let intensity = 5;
    let sliders: Record<string, number> = {};
    let fileName = "slider-input";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      persona = body.persona ?? "finance-bro";
      intensity = body.intensity ?? 5;
      sliders = body.sliders ?? {};
    } else {
      const formData = await req.formData();
      persona = (formData.get("persona") as string) ?? "finance-bro";
      const file = formData.get("file") as File | null;
      if (file) fileName = file.name;
    }

    const personaData = PERSONAS[persona] ?? PERSONAS["finance-bro"];
    const intensityLabel =
      intensity <= 3 ? "gentle and mildly funny" : intensity <= 6 ? "savage and brutal" : "absolutely MERCILESS and legendary";

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

Roast this person's finances HARD in your persona's voice. Return ONLY valid JSON:
{
  "score": number (0-100 financial health score — lower is worse),
  "roast": "string (3-5 sentences, brutal in-character roast, make it unforgettable)",
  "habits": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "summary": "string (one sentence overview)",
  "catchphrase": "string (a brutal memorable one-liner punchline in your persona's voice)"
}`;

    const raw = await generateText(prompt, "pro");

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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
