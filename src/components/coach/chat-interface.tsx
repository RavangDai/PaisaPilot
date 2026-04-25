"use client";

import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const starters = [
  "How do I start investing with $500?",
  "What's the 50/30/20 budget rule?",
  "How do I pay off credit card debt fast?",
  "Should I build an emergency fund first?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm your DollarPaisa AI coach. Ask me anything about budgeting, saving, investing, or debt management — I'm here to help you take control of your finances.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const isFirstMessage = messages.length === 1;

  return (
    <div className="flex h-full flex-col bg-[#F0F2F1]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="flex gap-3 items-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B5E39]">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white border border-[#E4E7E5] px-4 py-3 text-sm text-[#94A39A] shadow-sm">
              <span className="inline-flex gap-1">
                <span className="animate-bounce [animation-delay:0ms]">·</span>
                <span className="animate-bounce [animation-delay:150ms]">·</span>
                <span className="animate-bounce [animation-delay:300ms]">·</span>
              </span>
            </div>
          </div>
        )}

        {/* Starter prompts */}
        {isFirstMessage && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="rounded-xl border border-[#E4E7E5] bg-white px-3 py-2 text-xs font-medium text-[#5A6A62] hover:border-[#1B5E39] hover:text-[#1B5E39] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#E4E7E5] bg-white px-4 py-3">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2 max-w-3xl mx-auto"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances…"
            className="flex-1"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            size="icon"
            className="h-10 w-10 rounded-xl"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        <p className="text-center text-[10px] text-[#94A39A] mt-2">
          AI responses are for educational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
}
