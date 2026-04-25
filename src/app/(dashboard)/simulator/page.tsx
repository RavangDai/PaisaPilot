"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { ScenarioForm } from "@/components/simulator/scenario-form";
import { ProjectionChart } from "@/components/simulator/projection-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { ProjectionPoint } from "@/types";

export default function SimulatorPage() {
  const [result, setResult] = useState<ProjectionPoint[]>([]);
  const [scenarioName, setScenarioName] = useState("");

  function handleResult(data: ProjectionPoint[], name: string) {
    setResult(data);
    setScenarioName(name);
  }

  const finalYear = result[result.length - 1];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <TopNav title="Investment Simulator" />
      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader><CardTitle>Configure Scenario</CardTitle></CardHeader>
            <CardContent>
              <ScenarioForm onResult={handleResult} />
            </CardContent>
          </Card>

          <div className="col-span-2 space-y-4">
            {finalYear && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Final Balance", value: formatCurrency(finalYear.balance), color: "text-emerald-400" },
                  { label: "Total Contributed", value: formatCurrency(finalYear.contributions), color: "text-indigo-400" },
                  { label: "Interest Earned", value: formatCurrency(finalYear.interest), color: "text-blue-400" },
                ].map(({ label, value, color }) => (
                  <Card key={label}>
                    <CardContent className="pt-4">
                      <p className="text-xs text-zinc-500">{label}</p>
                      <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <Card>
              <CardContent className="pt-4">
                <ProjectionChart data={result} title={scenarioName || "Projection"} />
                {!result.length && (
                  <div className="flex h-[300px] items-center justify-center text-zinc-500 text-sm">
                    Configure a scenario and run the simulation to see results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
