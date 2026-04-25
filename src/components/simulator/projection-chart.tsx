"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ProjectionPoint } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProjectionChartProps {
  data: ProjectionPoint[];
  title?: string;
}

export function ProjectionChart({ data, title }: ProjectionChartProps) {
  if (!data.length) return null;

  return (
    <div className="space-y-3">
      {title && (
        <p className="text-sm font-semibold text-[#111917]">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1B5E39" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1B5E39" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F1" />
          <XAxis
            dataKey="year"
            stroke="#C9D4CE"
            tick={{ fontSize: 11, fill: "#94A39A" }}
            tickFormatter={(v) => `Yr ${v}`}
          />
          <YAxis
            stroke="#C9D4CE"
            tick={{ fontSize: 11, fill: "#94A39A" }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E4E7E5",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgb(0,0,0,0.08)",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#5A6A62", fontWeight: 600 }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend
            wrapperStyle={{ color: "#5A6A62", fontSize: "12px" }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            name="Total Balance"
            stroke="#1B5E39"
            fill="url(#balanceGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="contributions"
            name="Contributions"
            stroke="#6366f1"
            fill="url(#contribGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
