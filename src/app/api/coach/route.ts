import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "@/lib/gemini";
import { connectToDatabase } from "@/lib/mongodb";
import ChatMessageModel from "@/models/ChatMessage";
import ChatSessionModel from "@/models/ChatSession";

const CHAT_PROMPT = `You are Georgie, an expert AI financial coach for DollarPilot. You have the wisdom of a seasoned financial advisor combined with the approachability of a trusted friend. Give clear, actionable, and personalized advice on budgeting, saving, investing, debt management, and financial planning. Keep responses concise, practical, and encouraging. Sign off warmly when appropriate. Always remind users to consult a licensed financial advisor for major decisions.`;

const PLAN_PROMPT = `You are Georgie, an elite AI financial planner for DollarPilot. Create a detailed, actionable financial plan based on the user's inputs. Be specific with numbers, percentages, and timelines. Structure your response with clear sections: Goal Analysis, Monthly Budget Breakdown (show exact allocation), Investment Strategy (specific instruments), Key Milestones (with dates), and Risk Considerations. Be encouraging but realistic.`;

const COMPARE_PROMPT = `You are Georgie, DollarPilot's financial comparison engine. Analyze two financial options and return ONLY valid JSON (no markdown) with this structure:
{
  "optionAName": "short name for option A",
  "optionBName": "short name for option B",
  "optionA": {
    "pros": ["string", "string", "string"],
    "cons": ["string", "string", "string"],
    "riskLevel": "Low|Medium|High",
    "riskScore": number (1-10),
    "rewardScore": number (1-10),
    "timeHorizon": "string",
    "expectedReturn": "string"
  },
  "optionB": {
    "pros": ["string", "string", "string"],
    "cons": ["string", "string", "string"],
    "riskLevel": "Low|Medium|High",
    "riskScore": number (1-10),
    "rewardScore": number (1-10),
    "timeHorizon": "string",
    "expectedReturn": "string"
  },
  "winner": "A|B|Tie",
  "winnerReason": "string",
  "recommendation": "string (2-3 sentences)"
}`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { mode, message, sessionId } = body;

    if (mode === "plan") {
      const { goal, monthlyIncome, monthlySavings, horizon, risk } = body;
      const planPrompt = `${PLAN_PROMPT}

User's Financial Goal: ${goal}
Monthly Income: $${monthlyIncome}
Monthly Savings Capacity: $${monthlySavings}
Time Horizon: ${horizon} years
Risk Tolerance: ${risk}

Create a comprehensive, personalized financial plan.`;

      const reply = await generateText(planPrompt, "pro");
      return NextResponse.json({ reply });
    }

    if (mode === "compare") {
      const { optionA, optionB, context } = body;
      const comparePrompt = `${COMPARE_PROMPT}

Option A: ${optionA}
Option B: ${optionB}
${context ? `Context: ${context}` : ""}

Analyze and compare these two financial options.`;

      const raw = await generateText(comparePrompt, "pro");
      let parsed;
      try {
        const match = raw.match(/\{[\s\S]*\}/);
        parsed = match ? JSON.parse(match[0]) : null;
      } catch {
        parsed = null;
      }
      if (!parsed) return NextResponse.json({ error: "Comparison failed. Please try again." }, { status: 500 });
      return NextResponse.json(parsed);
    }

    // Default: chat mode
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    await connectToDatabase();

    let chatSessionId = sessionId;
    if (!chatSessionId) {
      const newSession = await ChatSessionModel.create({
        userId: session.user.id,
        title: message.slice(0, 60),
      });
      chatSessionId = newSession._id.toString();
    }

    await ChatMessageModel.create({ sessionId: chatSessionId, userId: session.user.id, role: "user", content: message });

    const history = await ChatMessageModel.find({ sessionId: chatSessionId }).sort({ createdAt: 1 }).limit(20);
    const contextMessages = history.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
    const fullPrompt = `${CHAT_PROMPT}\n\nConversation:\n${contextMessages}\n\nAssistant:`;

    const reply = await generateText(fullPrompt, "flash");

    await ChatMessageModel.create({ sessionId: chatSessionId, userId: session.user.id, role: "assistant", content: reply });

    return NextResponse.json({ reply, sessionId: chatSessionId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[coach]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
