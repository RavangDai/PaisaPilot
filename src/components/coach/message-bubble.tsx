import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 items-start max-w-3xl", isUser && "flex-row-reverse ml-auto")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-[#1B5E39]" : "bg-[#1B5E39]"
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5 text-white" />
        ) : (
          <Sparkles className="h-3.5 w-3.5 text-white" />
        )}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm max-w-[85%]",
          isUser
            ? "bg-[#1B5E39] text-white rounded-tr-sm"
            : "bg-white border border-[#E4E7E5] text-[#111917] rounded-tl-sm"
        )}
      >
        {content}
      </div>
    </div>
  );
}
