"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { ProjectionPoint } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProjectionChartProps {
  data: ProjectionPoint[];
  title?: string;
}

export function ProjectionChart({ data, title }: ProjectionChartProps) {
  if (!data.length) return null;

  return (
    <div className="space-y-2">
      {title && <h3 className="text-sm font-medium text-zinc-300">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="year" stroke="#71717a" tick={{ fontSize: 12 }} tickFormatter={(v) => `Yr ${v}`} />
          <YAxis stroke="#71717a" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
            labelStyle={{ color: "#a1a1aa" }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: "12px" }} />
          <Area type="monotone" dataKey="balance" name="Total Balance" stroke="#10b981" fill="url(#balanceGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="contributions" name="Contributions" stroke="#6366f1" fill="url(#contribGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
