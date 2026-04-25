"use client";

import { useState, useEffect } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { MarketTickerCard } from "@/components/markets/market-ticker-card";
import { PriceChart } from "@/components/markets/price-chart";
import { CryptoTable } from "@/components/markets/crypto-table";
import { MarketSearch } from "@/components/markets/market-search";
import { RefreshCw } from "lucide-react";

interface Quote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  currency?: string;
  quoteType?: string;
  error?: boolean;
}

interface SelectedTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  currency: string;
}

const INDEX_SYMBOLS = "^GSPC,^DJI,^IXIC,^RUT";
const DEFAULT_STOCKS = "AAPL,TSLA,NVDA,MSFT,GOOGL,AMZN,META,BRK-B";

const INDEX_LABELS: Record<string, string> = {
  "^GSPC": "S&P 500",
  "^DJI": "Dow Jones",
  "^IXIC": "NASDAQ",
  "^RUT": "Russell 2000",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function quoteToTicker(q: any, historySparkline?: number[]) {
  return {
    symbol: q.symbol,
    name: q.shortName ?? q.longName ?? INDEX_LABELS[q.symbol] ?? q.symbol,
    price: q.regularMarketPrice ?? 0,
    change: q.regularMarketChange ?? 0,
    changePct: q.regularMarketChangePercent ?? 0,
    currency: q.currency ?? "USD",
    sparkline: historySparkline,
  };
}

export default function MarketsPage() {
  const [indices, setIndices] = useState<Quote[]>([]);
  const [stocks, setStocks] = useState<Quote[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [selected, setSelected] = useState<SelectedTicker | null>(null);
  const [tab, setTab] = useState<"stocks" | "crypto">("stocks");
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [loadingCrypto, setLoadingCrypto] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchQuotes() {
    setLoadingQuotes(true);
    try {
      const [idxRes, stkRes] = await Promise.all([
        fetch(`/api/markets/quote?symbols=${INDEX_SYMBOLS}`),
        fetch(`/api/markets/quote?symbols=${DEFAULT_STOCKS}`),
      ]);
      const [idxData, stkData] = await Promise.all([idxRes.json(), stkRes.json()]);
      const validIdx = (idxData.quotes ?? []).filter((q: Quote) => !q.error);
      const validStk = (stkData.quotes ?? []).filter((q: Quote) => !q.error);
      setIndices(validIdx);
      setStocks(validStk);
      if (!selected && validStk.length > 0) {
        const q = validStk[0];
        setSelected({
          symbol: q.symbol,
          name: q.shortName ?? q.symbol,
          price: q.regularMarketPrice ?? 0,
          change: q.regularMarketChange ?? 0,
          changePct: q.regularMarketChangePercent ?? 0,
          currency: q.currency ?? "USD",
        });
      }
      setLastUpdated(new Date());
    } finally {
      setLoadingQuotes(false);
    }
  }

  async function fetchCrypto() {
    setLoadingCrypto(true);
    try {
      const res = await fetch("/api/markets/crypto");
      const data = await res.json();
      setCryptos(data.coins ?? []);
    } finally {
      setLoadingCrypto(false);
    }
  }

  useEffect(() => {
    fetchQuotes();
    fetchCrypto();
    const interval = setInterval(fetchQuotes, 60000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchSelect(r: { symbol: string; name: string; price: number; changePct: number; currency: string }) {
    setSelected({
      symbol: r.symbol,
      name: r.name,
      price: r.price,
      change: 0,
      changePct: r.changePct,
      currency: r.currency,
    });
  }

  return (
    <div className="flex h-full flex-col">
      <TopNav title="Markets" />

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Market Indices Row */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-[#111917]">Market Indices</h2>
            <button
              onClick={fetchQuotes}
              className="flex items-center gap-1.5 text-xs text-[#5A6A62] hover:text-[#1B5E39] transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingQuotes ? "animate-spin" : ""}`} />
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Refresh"}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {loadingQuotes && indices.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-[#E4E7E5] bg-white p-4 h-[110px] animate-pulse">
                    <div className="h-3 w-16 bg-[#F0F2F1] rounded mb-2" />
                    <div className="h-5 w-24 bg-[#F0F2F1] rounded mb-3" />
                    <div className="h-8 bg-[#F0F2F1] rounded" />
                  </div>
                ))
              : indices.map((q) => {
                  const t = quoteToTicker(q);
                  return (
                    <MarketTickerCard
                      key={q.symbol}
                      {...t}
                      onClick={() => setSelected({ ...t, change: q.regularMarketChange ?? 0 })}
                      active={selected?.symbol === q.symbol}
                    />
                  );
                })}
          </div>
        </div>

        {/* Main content: Chart + Stocks/Crypto */}
        <div className="grid grid-cols-5 gap-5">
          {/* Left: Chart */}
          <div className="col-span-3 rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] p-5">
            {selected ? (
              <PriceChart
                symbol={selected.symbol}
                name={selected.name}
                currentPrice={selected.price}
                change={selected.change}
                changePct={selected.changePct}
                currency={selected.currency}
              />
            ) : (
              <div className="flex h-[360px] items-center justify-center text-[#94A39A] text-sm">
                Select a ticker to view the chart
              </div>
            )}
          </div>

          {/* Right: Stock / Crypto list */}
          <div className="col-span-2 space-y-3">
            {/* Search */}
            <div className="rounded-2xl border border-[#E4E7E5] bg-white p-4">
              <MarketSearch onSelect={handleSearchSelect} />
            </div>

            {/* Stocks list */}
            <div className="rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] overflow-hidden">
              <div className="px-4 pt-4 pb-2 border-b border-[#F0F2F1]">
                <p className="text-[13px] font-semibold text-[#111917]">Popular Stocks</p>
              </div>
              <div className="divide-y divide-[#F8FAF9] max-h-[340px] overflow-y-auto">
                {loadingQuotes && stocks.length === 0
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 animate-pulse">
                        <div className="space-y-1">
                          <div className="h-3 w-14 bg-[#F0F2F1] rounded" />
                          <div className="h-2.5 w-20 bg-[#F0F2F1] rounded" />
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="h-3 w-16 bg-[#F0F2F1] rounded" />
                          <div className="h-2.5 w-12 bg-[#F0F2F1] rounded ml-auto" />
                        </div>
                      </div>
                    ))
                  : stocks.map((q) => {
                      const isUp = (q.regularMarketChangePercent ?? 0) >= 0;
                      const isActive = selected?.symbol === q.symbol;
                      return (
                        <button
                          key={q.symbol}
                          onClick={() =>
                            setSelected({
                              symbol: q.symbol,
                              name: q.shortName ?? q.symbol,
                              price: q.regularMarketPrice ?? 0,
                              change: q.regularMarketChange ?? 0,
                              changePct: q.regularMarketChangePercent ?? 0,
                              currency: q.currency ?? "USD",
                            })
                          }
                          className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                            isActive ? "bg-[#EAF4EE]" : "hover:bg-[#F8FAF9]"
                          }`}
                        >
                          <div className="text-left">
                            <p className={`text-[13px] font-semibold ${isActive ? "text-[#1B5E39]" : "text-[#111917]"}`}>
                              {q.symbol}
                            </p>
                            <p className="text-[11px] text-[#94A39A] truncate max-w-[120px]">
                              {q.shortName ?? q.longName ?? ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-semibold text-[#111917]">
                              {(q.regularMarketPrice ?? 0).toLocaleString("en-US", {
                                style: "currency",
                                currency: q.currency ?? "USD",
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className={`text-[11px] font-semibold ${isUp ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                              {isUp ? "+" : ""}{(q.regularMarketChangePercent ?? 0).toFixed(2)}%
                            </p>
                          </div>
                        </button>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>

        {/* Crypto Table */}
        <div className="rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#F0F2F1]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTab("stocks")}
                className={`text-[13px] font-semibold pb-1 border-b-2 transition-colors ${
                  tab === "stocks" ? "border-[#1B5E39] text-[#1B5E39]" : "border-transparent text-[#94A39A] hover:text-[#5A6A62]"
                }`}
              >
                Stocks
              </button>
              <button
                onClick={() => setTab("crypto")}
                className={`text-[13px] font-semibold pb-1 border-b-2 transition-colors ${
                  tab === "crypto" ? "border-[#1B5E39] text-[#1B5E39]" : "border-transparent text-[#94A39A] hover:text-[#5A6A62]"
                }`}
              >
                Crypto Top 20
              </button>
            </div>
            <span className="text-[11px] text-[#94A39A]">
              {tab === "crypto" ? "via CoinGecko" : "via Yahoo Finance"}
            </span>
          </div>

          {tab === "crypto" ? (
            loadingCrypto && cryptos.length === 0 ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-5 w-5 rounded-full border-2 border-[#1B5E39] border-t-transparent animate-spin" />
              </div>
            ) : (
              <CryptoTable coins={cryptos} />
            )
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F0F2F1]">
                    {["Symbol", "Name", "Price", "Change", "Change %", "Volume", "Day High", "Day Low"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#94A39A] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((q) => {
                    const isUp = (q.regularMarketChangePercent ?? 0) >= 0;
                    return (
                      <tr
                        key={q.symbol}
                        onClick={() =>
                          setSelected({
                            symbol: q.symbol,
                            name: q.shortName ?? q.symbol,
                            price: q.regularMarketPrice ?? 0,
                            change: q.regularMarketChange ?? 0,
                            changePct: q.regularMarketChangePercent ?? 0,
                            currency: q.currency ?? "USD",
                          })
                        }
                        className={`border-b border-[#F8FAF9] cursor-pointer transition-colors ${
                          selected?.symbol === q.symbol ? "bg-[#EAF4EE]" : "hover:bg-[#F8FAF9]"
                        }`}
                      >
                        <td className="px-4 py-3 font-bold text-[#1B5E39]">{q.symbol}</td>
                        <td className="px-4 py-3 text-[#5A6A62] max-w-[160px] truncate">{q.shortName ?? q.longName ?? ""}</td>
                        <td className="px-4 py-3 font-semibold text-[#111917] whitespace-nowrap">
                          {(q.regularMarketPrice ?? 0).toLocaleString("en-US", { style: "currency", currency: q.currency ?? "USD", maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-3 font-semibold whitespace-nowrap ${isUp ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                          {isUp ? "+" : ""}{(q.regularMarketChange ?? 0).toFixed(2)}
                        </td>
                        <td className={`px-4 py-3 font-semibold whitespace-nowrap ${isUp ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                          {isUp ? "+" : ""}{(q.regularMarketChangePercent ?? 0).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-[#5A6A62] whitespace-nowrap">
                          {(q.regularMarketVolume ?? 0) > 0
                            ? ((q.regularMarketVolume ?? 0) >= 1e6
                                ? `${((q.regularMarketVolume ?? 0) / 1e6).toFixed(1)}M`
                                : `${((q.regularMarketVolume ?? 0) / 1e3).toFixed(0)}K`)
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-[#5A6A62] whitespace-nowrap">
                          {(q.regularMarketDayHigh ?? 0) > 0
                            ? (q.regularMarketDayHigh ?? 0).toLocaleString("en-US", { style: "currency", currency: q.currency ?? "USD", maximumFractionDigits: 2 })
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-[#5A6A62] whitespace-nowrap">
                          {(q.regularMarketDayLow ?? 0) > 0
                            ? (q.regularMarketDayLow ?? 0).toLocaleString("en-US", { style: "currency", currency: q.currency ?? "USD", maximumFractionDigits: 2 })
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-[#94A39A] text-center pb-2">
          Stock data via Yahoo Finance · Crypto data via CoinGecko · Refreshes every 60s · For informational purposes only.
        </p>
      </div>
    </div>
  );
}
