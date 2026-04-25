"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface TickerInputProps {
  onResult: (data: unknown) => void;
}

const popular = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN"];

export function TickerInput({ onResult }: TickerInputProps) {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(symbol?: string) {
    const t = (symbol ?? ticker).trim().toUpperCase();
    if (!t) return;
    setTicker(t);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: t }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else onResult(data);
    } catch {
      setError("Failed to fetch analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        className="flex gap-2"
      >
        <Input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter ticker symbol (e.g. AAPL, TSLA, NVDA)"
          className="flex-1"
          maxLength={10}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !ticker.trim()}>
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
          ) : (
            <><Search className="h-4 w-4" /> Analyze</>
          )}
        </Button>
      </form>

      {/* Popular tickers */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[#94A39A]">Popular:</span>
        {popular.map((t) => (
          <button
            key={t}
            onClick={() => handleSearch(t)}
            disabled={loading}
            className="rounded-lg border border-[#E4E7E5] bg-white px-2.5 py-1 text-xs font-semibold text-[#5A6A62] hover:border-[#1B5E39] hover:text-[#1B5E39] transition-colors disabled:opacity-50"
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
