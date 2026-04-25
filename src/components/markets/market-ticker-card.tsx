"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparkline } from "./sparkline";

interface TickerCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  sparkline?: number[];
  currency?: string;
  active?: boolean;
  onClick?: () => void;
}

function fmt(price: number, currency = "USD") {
  if (price >= 1000)
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
  if (price >= 1)
    return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 3, maximumFractionDigits: 5 }).format(price);
}

export function MarketTickerCard({
  symbol,
  name,
  price,
  change,
  changePct,
  sparkline,
  currency = "USD",
  active,
  onClick,
}: TickerCardProps) {
  const isUp = changePct >= 0;
  const color = isUp ? "#16a34a" : "#dc2626";

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all duration-150 ${
        active
          ? "border-[#1B5E39] bg-[#EAF4EE] shadow-[0_0_0_2px_#1B5E3920]"
          : "border-[#E4E7E5] bg-white hover:border-[#C9D4CE] hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)]"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[13px] font-bold text-[#111917]">{symbol}</p>
          <p className="text-[11px] text-[#94A39A] truncate max-w-[120px]">{name}</p>
        </div>
        <span
          className="flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: isUp ? "#EAF4EE" : "#FEF2F2", color }}
        >
          {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
          {isUp ? "+" : ""}{changePct.toFixed(2)}%
        </span>
      </div>

      {sparkline && sparkline.length > 1 && (
        <div className="my-2 -mx-1">
          <Sparkline data={sparkline} color={color} height={38} />
        </div>
      )}

      <p className="text-lg font-bold text-[#111917]">{fmt(price, currency)}</p>
      <p className={`text-[11px] font-medium mt-0.5 ${isUp ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
        {isUp ? "+" : ""}{fmt(Math.abs(change), currency)} today
      </p>
    </button>
  );
}
