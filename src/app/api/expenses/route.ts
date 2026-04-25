import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateFromPDF } from "@/lib/gemini";
import { connectToDatabase } from "@/lib/mongodb";
import StatementModel from "@/models/Statement";

const PROMPT = `You are a financial data extraction AI. Carefully read this bank statement PDF and extract all transaction data.

Return ONLY valid JSON with this exact structure:
{
  "period": "string (date range of the statement, e.g. 'March 2024' or 'Jan–Mar 2024')",
  "currency": "string (e.g. USD, INR, GBP — detect from statement)",
  "totalCredits": number (total money in / income),
  "totalDebits": number (total money out / expenses),
  "netBalance": number (credits minus debits),
  "savingsRate": number (0-100, percentage of income saved),
  "categories": [
    {
      "name": "string (e.g. Food & Dining, Shopping, Transport, Entertainment, Bills & Utilities, Health, Subscriptions, Other)",
      "amount": number,
      "count": number,
      "emoji": "string (single relevant emoji)"
    }
  ],
  "topMerchants": [
    { "name": "string", "amount": number, "count": number }
  ],
  "biggestExpense": { "description": "string", "amount": number, "date": "string" },
  "insights": ["string", "string", "string", "string"],
  "warningFlags": ["string", "string"]
}

Rules: sort categories by amount descending, include at least 5 categories, list 6 top merchants, all amounts positive numbers.`;

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectToDatabase();
    const statements = await StatementModel.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(statements);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch statements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const pdfBase64 = Buffer.from(bytes).toString("base64");

    const raw = await generateFromPDF(pdfBase64, PROMPT);

    let parsed: Record<string, unknown> | null = null;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    } catch {
      parsed = null;
    }

    if (!parsed) return NextResponse.json({ error: "Could not parse the bank statement. Please try a clearer PDF." }, { status: 422 });

    await connectToDatabase();
    const saved = await StatementModel.create({
      userId: session.user.id,
      fileName: file.name,
      ...parsed,
    });

    return NextResponse.json({ ...parsed, _id: saved._id.toString() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[expenses]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
