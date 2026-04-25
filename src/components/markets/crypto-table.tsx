"use client";

import Image from "next/image";
import { Sparkline } from "./sparkline";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change1h: number;
  change24h: number;
  change7d: number;
  sparkline: number[];
  rank: number;
}

function fmtPrice(n: number) {
  if (n >= 1000)
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  if (n >= 1)
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(n);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 5, maximumFractionDigits: 8 }).format(n);
}

function fmtLarge(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toFixed(0)}`;
}

function Pct({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={`font-semibold ${up ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
      {up ? "+" : ""}{value.toFixed(2)}%
    </span>
  );
}

export function CryptoTable({ coins }: { coins: Coin[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#F0F2F1]">
            {["#", "Coin", "Price", "1h", "24h", "7d", "Mkt Cap", "Volume 24h", "7D Chart"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#94A39A] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {coins.map((c) => (
            <tr key={c.id} className="border-b border-[#F8FAF9] hover:bg-[#F8FAF9] transition-colors">
              <td className="px-3 py-3 text-[#94A39A] text-xs">{c.rank}</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-7 w-7 shrink-0">
                    <Image src={c.image} alt={c.name} fill className="rounded-full object-contain" sizes="28px" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111917] text-[13px]">{c.name}</p>
                    <p className="text-[11px] text-[#94A39A]">{c.symbol}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 font-semibold text-[#111917] whitespace-nowrap">{fmtPrice(c.price)}</td>
              <td className="px-3 py-3 whitespace-nowrap"><Pct value={c.change1h} /></td>
              <td className="px-3 py-3 whitespace-nowrap"><Pct value={c.change24h} /></td>
              <td className="px-3 py-3 whitespace-nowrap"><Pct value={c.change7d} /></td>
              <td className="px-3 py-3 text-[#5A6A62] whitespace-nowrap">{fmtLarge(c.marketCap)}</td>
              <td className="px-3 py-3 text-[#5A6A62] whitespace-nowrap">{fmtLarge(c.volume24h)}</td>
              <td className="px-3 py-3 w-[100px]">
                <Sparkline
                  data={c.sparkline}
                  color={c.change7d >= 0 ? "#16a34a" : "#dc2626"}
                  height={36}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
