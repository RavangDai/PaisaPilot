"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ProjectionPoint } from "@/types";

interface ScenarioFormProps {
  onResult: (data: ProjectionPoint[], name: string) => void;
}

export function ScenarioForm({ onResult }: ScenarioFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "My Scenario",
    initialAmount: 10000,
    monthlyContribution: 500,
    annualReturnRate: 8,
    years: 20,
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: field === "name" ? value : parseFloat(value) || 0 }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.scenario) onResult(data.scenario.result, form.name);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Scenario Name", field: "name", type: "text" },
          { label: "Initial Amount ($)", field: "initialAmount", type: "number" },
          { label: "Monthly Contribution ($)", field: "monthlyContribution", type: "number" },
          { label: "Annual Return Rate (%)", field: "annualReturnRate", type: "number" },
          { label: "Years", field: "years", type: "number" },
        ].map(({ label, field, type }) => (
          <div key={field} className={field === "name" ? "col-span-2" : ""}>
            <label className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
            <Input
              type={type}
              value={form[field as keyof typeof form]}
              onChange={(e) => update(field, e.target.value)}
              step={field === "annualReturnRate" ? "0.1" : "1"}
            />
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...</> : "Run Simulation"}
      </Button>
    </form>
  );
}
