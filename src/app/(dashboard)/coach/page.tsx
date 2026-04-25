import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";
import { ChatInterface } from "@/components/coach/chat-interface";

export default async function CoachPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-full flex-col">
      <TopNav title="AI Finance Coach" />
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
