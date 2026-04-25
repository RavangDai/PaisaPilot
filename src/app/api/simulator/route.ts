import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import SimulatorScenarioModel from "@/models/SimulatorScenario";
import type { ProjectionPoint } from "@/types";

function calculateProjection(
  initialAmount: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number
): ProjectionPoint[] {
  const monthlyRate = annualReturnRate / 100 / 12;
  const points: ProjectionPoint[] = [];
  let balance = initialAmount;
  let totalContributions = initialAmount;

  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalContributions += monthlyContribution;
    }
    points.push({
      year,
      balance: Math.round(balance),
      contributions: Math.round(totalContributions),
      interest: Math.round(balance - totalContributions),
    });
  }
  return points;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, initialAmount, monthlyContribution, annualReturnRate, years } = await req.json();

    if (!initialAmount || !annualReturnRate || !years) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = calculateProjection(initialAmount, monthlyContribution ?? 0, annualReturnRate, years);

    await connectToDatabase();
    const scenario = await SimulatorScenarioModel.create({
      userId: session.user.id,
      name: name || "My Scenario",
      initialAmount,
      monthlyContribution: monthlyContribution ?? 0,
      annualReturnRate,
      years,
      result,
    });

    return NextResponse.json({ scenario });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const scenarios = await SimulatorScenarioModel.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ scenarios });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
