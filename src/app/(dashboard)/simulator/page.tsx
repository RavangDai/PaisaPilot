"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { ScenarioForm } from "@/components/simulator/scenario-form";
import { ProjectionChart } from "@/components/simulator/projection-chart";
import { formatCurrency } from "@/lib/utils";
import type { ProjectionPoint } from "@/types";
import { TrendingUp, PiggyBank, Coins } from "lucide-react";

export default function SimulatorPage() {
  const [result, setResult] = useState<ProjectionPoint[]>([]);
  const [scenarioName, setScenarioName] = useState("");

  const finalYear = result[result.length - 1];

  const stats = finalYear
    ? [
        { label: "Final Balance", value: formatCurrency(finalYear.balance), icon: TrendingUp, color: "#1B5E39", bg: "#EAF4EE" },
        { label: "Total Contributed", value: formatCurrency(finalYear.contributions), icon: PiggyBank, color: "#4338ca", bg: "#EEF2FF" },
        { label: "Interest Earned", value: formatCurrency(finalYear.interest), icon: Coins, color: "#0369a1", bg: "#E0F2FE" },
      ]
    : [];

  return (
    <div className="flex h-full flex-col">
      <TopNav title="Investment Simulator" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-3 gap-5">
          {/* Form */}
          <div className="col-span-1">
            <div className="rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] p-5">
              <p className="text-[15px] font-semibold text-[#111917] mb-4">Configure Scenario</p>
              <ScenarioForm onResult={(data, name) => { setResult(data); setScenarioName(name); }} />
            </div>
          </div>

          {/* Results */}
          <div className="col-span-2 space-y-4">
            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="rounded-2xl border border-[#E4E7E5] bg-white p-4 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl mb-2" style={{ backgroundColor: bg }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <p className="text-xl font-bold text-[#111917]">{value}</p>
                    <p className="text-xs text-[#5A6A62] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] p-5">
              <ProjectionChart data={result} title={scenarioName || "Wealth Projection"} />
              {!result.length && (
                <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-[#94A39A]">
                  <TrendingUp className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Configure a scenario to see your projection</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
