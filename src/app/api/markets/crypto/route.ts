import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=1h,24h,7d",
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`CoinGecko ${res.status}`);
    }

    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coins = data.map((c: any) => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      image: c.image,
      price: c.current_price,
      marketCap: c.market_cap,
      volume24h: c.total_volume,
      change1h: c.price_change_percentage_1h_in_currency ?? 0,
      change24h: c.price_change_percentage_24h ?? 0,
      change7d: c.price_change_percentage_7d_in_currency ?? 0,
      sparkline: c.sparkline_in_7d?.price ?? [],
      rank: c.market_cap_rank,
    }));

    return NextResponse.json({ coins });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
