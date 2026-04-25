import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "@/lib/gemini";
import { connectToDatabase } from "@/lib/mongodb";
import ChatMessageModel from "@/models/ChatMessage";
import ChatSessionModel from "@/models/ChatSession";

const SYSTEM_PROMPT = `You are DollarPaisa, an expert AI financial coach. You give clear, actionable, and personalized advice on budgeting, saving, investing, debt management, and financial planning. Keep responses concise, practical, and encouraging. Always remind users to consult a licensed financial advisor for major decisions.`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message, sessionId } = await req.json();
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
    const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation:\n${contextMessages}\n\nAssistant:`;

    const reply = await generateText(fullPrompt, "flash");

    await ChatMessageModel.create({ sessionId: chatSessionId, userId: session.user.id, role: "assistant", content: reply });

    return NextResponse.json({ reply, sessionId: chatSessionId });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
