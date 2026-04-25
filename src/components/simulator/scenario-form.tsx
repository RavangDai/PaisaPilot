"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ProjectionPoint } from "@/types";

interface ScenarioFormProps {
  onResult: (data: ProjectionPoint[], name: string) => void;
}

const fields = [
  { label: "Scenario Name", field: "name", type: "text", step: undefined },
  { label: "Initial Amount ($)", field: "initialAmount", type: "number", step: "100" },
  { label: "Monthly Contribution ($)", field: "monthlyContribution", type: "number", step: "50" },
  { label: "Annual Return Rate (%)", field: "annualReturnRate", type: "number", step: "0.1" },
  { label: "Years", field: "years", type: "number", step: "1" },
];

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
    setForm((prev) => ({
      ...prev,
      [field]: field === "name" ? value : parseFloat(value) || 0,
    }));
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
    <form onSubmit={handleSubmit} className="space-y-3">
      {fields.map(({ label, field, type, step }) => (
        <div key={field}>
          <label className="block text-xs font-semibold text-[#5A6A62] uppercase tracking-wide mb-1">
            {label}
          </label>
          <Input
            type={type}
            value={form[field as keyof typeof form]}
            onChange={(e) => update(field, e.target.value)}
            step={step}
          />
        </div>
      ))}
      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Calculating…</>
        ) : (
          "Run Simulation"
        )}
      </Button>
    </form>
  );
}
