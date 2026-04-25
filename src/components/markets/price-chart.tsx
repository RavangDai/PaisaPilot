"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

type Period = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y";

interface Candle {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceChartProps {
  symbol: string;
  name?: string;
  currentPrice?: number;
  change?: number;
  changePct?: number;
  currency?: string;
}

const PERIODS: { label: string; value: Period }[] = [
  { label: "1D", value: "1d" },
  { label: "5D", value: "5d" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "6M", value: "6mo" },
  { label: "1Y", value: "1y" },
  { label: "2Y", value: "2y" },
  { label: "5Y", value: "5y" },
];

function formatDate(ts: number, period: Period) {
  const d = new Date(ts);
  if (period === "1d") return format(d, "HH:mm");
  if (period === "5d") return format(d, "EEE HH:mm");
  if (period === "1mo" || period === "3mo") return format(d, "MMM d");
  return format(d, "MMM ''yy");
}

function formatPrice(v: number, currency = "USD") {
  if (v >= 1000) return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(v);
  if (v >= 1) return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 4, maximumFractionDigits: 6 }).format(v);
}

function formatVolume(v: number) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return v.toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, period, currency }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as Candle;
  const isUp = d.close >= d.open;

  return (
    <div className="rounded-xl border border-[#E4E7E5] bg-white shadow-[0_8px_24px_rgb(0,0,0,0.12)] p-3 text-xs min-w-[140px]">
      <p className="text-[#5A6A62] mb-2 font-medium">{formatDate(d.date, period)}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-[#94A39A]">Close</span>
          <span className={`font-semibold ${isUp ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
            {formatPrice(d.close, currency)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[#94A39A]">Open</span>
          <span className="text-[#111917] font-medium">{formatPrice(d.open, currency)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[#94A39A]">High</span>
          <span className="text-[#16a34a] font-medium">{formatPrice(d.high, currency)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[#94A39A]">Low</span>
          <span className="text-[#dc2626] font-medium">{formatPrice(d.low, currency)}</span>
        </div>
        <div className="border-t border-[#F0F2F1] pt-1 mt-1 flex justify-between gap-4">
          <span className="text-[#94A39A]">Vol</span>
          <span className="text-[#5A6A62] font-medium">{formatVolume(d.volume)}</span>
        </div>
      </div>
    </div>
  );
}

export function PriceChart({ symbol, name, currentPrice, change, changePct, currency = "USD" }: PriceChartProps) {
  const [period, setPeriod] = useState<Period>("1mo");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/markets/history?symbol=${symbol}&period=${period}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCandles(data.candles ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load chart");
    } finally {
      setLoading(false);
    }
  }, [symbol, period]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const isUp = (change ?? 0) >= 0;
  const lineColor = isUp ? "#16a34a" : "#dc2626";
  const gradientId = `grad-${symbol.replace(/[^a-z0-9]/gi, "")}`;

  const firstClose = candles[0]?.close ?? 0;
  const domainMin = Math.min(...candles.map((c) => c.low)) * 0.998;
  const domainMax = Math.max(...candles.map((c) => c.high)) * 1.002;

  const volumeMax = Math.max(...candles.map((c) => c.volume));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#111917]">
              {currentPrice ? formatPrice(currentPrice, currency) : "—"}
            </span>
            {changePct !== undefined && (
              <span className={`flex items-center gap-1 text-sm font-semibold ${isUp ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {isUp ? "+" : ""}{change?.toFixed(2)} ({isUp ? "+" : ""}{changePct?.toFixed(2)}%)
              </span>
            )}
          </div>
          {name && <p className="text-sm text-[#5A6A62] mt-0.5">{name}</p>}
        </div>

        {/* Period buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-[#E4E7E5] bg-[#F8FAF9] p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                period === p.value
                  ? "bg-white text-[#1B5E39] shadow-sm"
                  : "text-[#94A39A] hover:text-[#5A6A62]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-[#94A39A]">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xs">Loading chart…</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : (
        <div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={candles} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F1" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatDate(v, period)}
                stroke="transparent"
                tick={{ fontSize: 10, fill: "#94A39A" }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={60}
              />
              <YAxis
                domain={[domainMin, domainMax]}
                orientation="right"
                tickFormatter={(v) => formatPrice(v, currency).replace(/[^0-9.,KMB]/g, "")}
                stroke="transparent"
                tick={{ fontSize: 10, fill: "#94A39A" }}
                tickLine={false}
                width={60}
              />
              <Tooltip
                content={<CustomTooltip period={period} currency={currency} />}
                cursor={{ stroke: "#E4E7E5", strokeWidth: 1, strokeDasharray: "4 2" }}
              />
              {firstClose > 0 && (
                <ReferenceLine
                  y={firstClose}
                  stroke="#E4E7E5"
                  strokeDasharray="4 2"
                  strokeWidth={1}
                />
              )}
              <Area
                type="monotone"
                dataKey="close"
                stroke={lineColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: lineColor, strokeWidth: 2, stroke: "white" }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Volume bars */}
          <ResponsiveContainer width="100%" height={60}>
            <ComposedChart data={candles} margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, volumeMax * 4]} hide />
              <Tooltip content={() => null} cursor={false} />
              <Bar
                dataKey="volume"
                fill={lineColor}
                opacity={0.25}
                radius={[2, 2, 0, 0]}
                maxBarSize={6}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-[#C9D4CE] text-right -mt-1">Volume</p>
        </div>
      )}
    </div>
  );
}
