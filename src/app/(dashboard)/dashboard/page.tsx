import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, TrendingUp, BarChart2, Flame } from "lucide-react";
import Link from "next/link";

const features = [
  { href: "/coach", icon: MessageSquare, title: "AI Coach", description: "Get personalized financial advice powered by Gemini AI", color: "text-emerald-400" },
  { href: "/simulator", icon: TrendingUp, title: "Investment Simulator", description: "Visualize your wealth growth with compound interest projections", color: "text-indigo-400" },
  { href: "/predictor", icon: BarChart2, title: "Stock Predictor", description: "AI-powered stock analysis and market sentiment insights", color: "text-blue-400" },
  { href: "/roast", icon: Flame, title: "Roast My Finances", description: "Upload your bank statement and get a brutally honest review", color: "text-orange-400" },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <TopNav title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Welcome back, {session.user?.name?.split(" ")[0]} 👋</h2>
          <p className="text-zinc-400 mt-1">What would you like to work on today?</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {features.map(({ href, icon: Icon, title, description, color }) => (
            <Link key={href} href={href}>
              <Card className="hover:border-zinc-600 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <Icon className={`h-6 w-6 ${color} mb-2`} />
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
