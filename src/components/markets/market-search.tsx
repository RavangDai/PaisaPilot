"use client";

import { useState } from "react";
import { Search, Loader2, X } from "lucide-react";

interface SearchResult {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  currency: string;
  quoteType: string;
}

interface MarketSearchProps {
  onSelect: (result: SearchResult) => void;
}

const POPULAR = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Google" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "META", name: "Meta" },
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
];

export function MarketSearch({ onSelect }: MarketSearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  async function doSearch(symbol: string) {
    if (!symbol.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/markets/quote?symbols=${symbol.trim().toUpperCase()}`);
      const data = await res.json();
      const quotes = (data.quotes ?? []).filter((q: { error?: boolean }) => !q.error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setResults(quotes.map((q: any) => ({
        symbol: q.symbol,
        name: q.shortName ?? q.longName ?? q.symbol,
        price: q.regularMarketPrice ?? 0,
        changePct: q.regularMarketChangePercent ?? 0,
        currency: q.currency ?? "USD",
        quoteType: q.quoteType ?? "",
      })));
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(r: SearchResult) {
    onSelect(r);
    setQuery("");
    setResults([]);
    setSearched(false);
  }

  return (
    <div className="space-y-3">
      {/* Search input */}
      <form
        onSubmit={(e) => { e.preventDefault(); doSearch(query); }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A39A]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Search ticker — AAPL, BTC-USD, ^GSPC…"
            className="w-full h-10 rounded-xl border border-[#E4E7E5] bg-white pl-9 pr-9 text-sm text-[#111917] placeholder:text-[#94A39A] focus:outline-none focus:ring-2 focus:ring-[#1B5E39]/25 focus:border-[#1B5E39]"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); setSearched(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A39A] hover:text-[#5A6A62]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="h-10 px-4 rounded-xl bg-[#1B5E39] text-white text-sm font-semibold hover:bg-[#154d2f] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </button>
      </form>

      {/* Search results */}
      {searched && results.length > 0 && (
        <div className="rounded-xl border border-[#E4E7E5] bg-white shadow-sm overflow-hidden">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F8FAF9] transition-colors border-b border-[#F0F2F1] last:border-0"
            >
              <div className="text-left">
                <p className="font-semibold text-[#111917] text-sm">{r.symbol}</p>
                <p className="text-xs text-[#5A6A62]">{r.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#111917] text-sm">
                  {r.price.toLocaleString("en-US", { style: "currency", currency: r.currency })}
                </p>
                <p className={`text-xs font-medium ${r.changePct >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                  {r.changePct >= 0 ? "+" : ""}{r.changePct.toFixed(2)}%
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <p className="text-sm text-[#94A39A] text-center py-2">No results for &ldquo;{query}&rdquo;</p>
      )}

      {/* Popular shortcuts */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[#94A39A] shrink-0">Popular:</span>
        {POPULAR.map((p) => (
          <button
            key={p.symbol}
            onClick={() => doSearch(p.symbol)}
            className="rounded-lg border border-[#E4E7E5] bg-white px-2.5 py-1 text-xs font-semibold text-[#5A6A62] hover:border-[#1B5E39] hover:text-[#1B5E39] transition-colors"
          >
            {p.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
