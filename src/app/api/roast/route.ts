import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "@/lib/gemini";
import { connectToDatabase } from "@/lib/mongodb";
import RoastHistoryModel from "@/models/RoastHistory";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const text = await file.text();
    const fileName = file.name;

    const prompt = `You are a brutally honest but funny and caring financial advisor. Analyze this financial statement/bank statement/budget data and:

1. Identify the top 3 worst financial habits (be specific and a bit savage but constructive)
2. Give an overall financial health score out of 100
3. Write a short "roast" paragraph (like a comedy roast but for their finances) — be funny, not mean
4. Give 3 actionable improvements they can start TODAY

Data provided:
${text.slice(0, 3000)}

Respond as JSON with keys: habits (array of 3 strings), score (number), roast (string), improvements (array of 3 strings), summary (one sentence overview).`;

    const raw = await generateText(prompt, "pro");

    let parsed: { habits?: string[]; score?: number; roast?: string; improvements?: string[]; summary?: string };
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      parsed = { roast: raw, score: 50, summary: "Analysis complete" };
    }

    await connectToDatabase();
    const history = await RoastHistoryModel.create({
      userId: session.user.id,
      fileName,
      summary: parsed.summary ?? "Financial analysis",
      roastText: parsed.roast ?? raw,
      score: parsed.score ?? 50,
    });

    return NextResponse.json({ ...parsed, historyId: history._id.toString() });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
