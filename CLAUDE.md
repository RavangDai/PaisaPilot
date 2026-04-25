@AGENTS.md

# DollarPilot — Project Context

AI-powered personal finance web app. Full-stack Next.js 16 with MongoDB, NextAuth v5, Gemini AI, and live market data.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16.2.4** (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | **Tailwind CSS v4** (`@import "tailwindcss"` — no `@tailwind` directives) |
| Font | **Plus Jakarta Sans** via `next/font/google` in `layout.tsx` (NOT CSS `@import`) |
| Auth | **NextAuth v5 beta** (`next-auth@5.0.0-beta`) + `@auth/mongodb-adapter` |
| Database | **MongoDB Atlas** via `mongoose` v9 + native `mongodb` v6 driver |
| AI | **Google Gemini** via `@google/generative-ai` (gemini-2.5-flash / gemini-2.5-pro / gemini-2.0-*) |
| Markets | **yahoo-finance2 v3** for stocks + **CoinGecko public API** for crypto |
| Charts | **Recharts** (AreaChart, ComposedChart, LineChart, Bar) |
| Icons | **lucide-react** |

---

## Critical Framework Notes (Next.js 16)

- **`middleware.ts` is deprecated** — use `src/proxy.ts` with `export const proxy = ...` (named export, not default)
- **`next-auth` v5 beta** — imports from `next-auth` not `next-auth/next`; use `auth()`, `handlers`, `signIn`, `signOut` from `src/lib/auth.ts`
- **Tailwind v4** — `@import "tailwindcss"` at top of CSS, custom vars in `@theme inline {}` block
- **Google Fonts** — always use `next/font/google` in `layout.tsx`; never `@import url(...)` in CSS (PostCSS expansion breaks ordering)
- **`serverExternalPackages`** in `next.config.ts` — currently: `["mongoose", "yahoo-finance2"]`
- **yahoo-finance2 v3** — requires `new YahooFinance({ suppressNotices: ["yahooSurvey"] })` before calling any method; the default export is a class constructor, not a singleton

---

## Environment Variables (`.env.local`)

```
MONGODB_URI=mongodb+srv://grishmaneupane_db_user:...@cluster01.jagmjor.mongodb.net/paisapilot
AUTH_SECRET=<generated>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=          # optional Google OAuth
GOOGLE_CLIENT_SECRET=      # optional Google OAuth
GEMINI_API_KEY=            # from aistudio.google.com
```

---

## Project Structure

```
src/
├── proxy.ts                        # Auth guard (replaces middleware.ts)
├── types/index.ts                  # Shared TypeScript interfaces
│
├── app/
│   ├── layout.tsx                  # Root layout — loads Plus Jakarta Sans font
│   ├── globals.css                 # Tailwind v4 + CSS vars + scrollbar styles
│   ├── page.tsx                    # Redirects → /dashboard
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx          # Credentials + Google OAuth login
│   │   └── register/page.tsx       # Email/password registration
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Sidebar + SessionProvider wrapper
│   │   ├── dashboard/page.tsx      # Home — stat cards + feature grid
│   │   ├── markets/page.tsx        # Live stocks/crypto + chart (CLIENT component)
│   │   ├── coach/page.tsx          # AI chat page
│   │   ├── simulator/page.tsx      # Investment simulator (CLIENT)
│   │   ├── predictor/page.tsx      # AI stock predictor (CLIENT)
│   │   └── roast/page.tsx          # Finance roast uploader (CLIENT)
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts   # NextAuth handler
│       ├── register/route.ts             # Public — POST new user
│       ├── coach/route.ts                # POST — Gemini chat
│       ├── simulator/route.ts            # POST/GET — compound interest calc
│       ├── predictor/route.ts            # POST — Gemini stock analysis
│       ├── roast/route.ts                # POST multipart — file + Gemini roast
│       └── markets/
│           ├── quote/route.ts            # GET ?symbols=AAPL,^GSPC — yahoo-finance2
│           ├── history/route.ts          # GET ?symbol=AAPL&period=1mo — OHLCV data
│           └── crypto/route.ts           # GET — CoinGecko top 20 + sparklines
│
├── components/
│   ├── ui/                         # button, card, input, badge
│   ├── layout/                     # sidebar, top-nav
│   ├── coach/                      # chat-interface, message-bubble
│   ├── simulator/                  # scenario-form, projection-chart
│   ├── predictor/                  # ticker-input, prediction-chart
│   ├── roast/                      # upload-zone, roast-result
│   └── markets/
│       ├── sparkline.tsx           # Tiny recharts LineChart (no axes)
│       ├── price-chart.tsx         # Full OHLCV chart + volume + timeframes
│       ├── market-ticker-card.tsx  # Card with sparkline, price, % change
│       ├── crypto-table.tsx        # CoinGecko table with 7d sparklines
│       └── market-search.tsx       # Search any ticker + popular shortcuts
│
├── lib/
│   ├── mongodb.ts                  # Mongoose connection (cached for dev)
│   ├── mongodb-client.ts           # Native MongoClient (for NextAuth adapter)
│   ├── auth.ts                     # NextAuth config — Credentials + Google
│   ├── gemini.ts                   # Gemini client — generateText, generateStream
│   └── utils.ts                    # cn(), formatCurrency(), formatPercent()
│
└── models/
    ├── User.ts                     # name, email, password (select: false), image
    ├── ChatSession.ts              # userId, title, timestamps
    ├── ChatMessage.ts              # sessionId, userId, role, content
    ├── SimulatorScenario.ts        # userId, inputs, result[] (ProjectionPoint)
    └── RoastHistory.ts             # userId, fileName, roastText, score 0-100
```

---

## Design System

Light theme. Primary color: `#1B5E39` (dark forest green).

| Token | Value |
|---|---|
| Body bg | `#F0F2F1` |
| Surface (cards) | `#FFFFFF` |
| Border | `#E4E7E5` |
| Primary | `#1B5E39` |
| Primary light | `#EAF4EE` |
| Text primary | `#111917` |
| Text secondary | `#5A6A62` |
| Text muted | `#94A39A` |
| Up/green | `#16a34a` |
| Down/red | `#dc2626` |

- Cards: `rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06)]`
- Active nav: 3px left green bar + `bg-[#EAF4EE]` + `text-[#1B5E39]`
- Buttons: `rounded-xl`, primary = `bg-[#1B5E39]`, outline = `border border-[#E4E7E5]`
- Logo: `public/logo.png` — compass rose SVG, shown with `next/image` in sidebar

---

## Proxy (Auth Guard) — `src/proxy.ts`

Public paths (no login required):
- `/`, `/login`, `/register`
- `/api/auth/*` (NextAuth)
- `/api/register` (new user signup)

Everything else requires an authenticated session. Unauthenticated requests redirect to `/login`.

---

## Key Patterns

### MongoDB connection
```ts
// For Mongoose models
import { connectToDatabase } from "@/lib/mongodb";
await connectToDatabase();

// For NextAuth adapter (native driver)
import clientPromise from "@/lib/mongodb-client";
```

### Auth in server components / API routes
```ts
import { auth } from "@/lib/auth";
const session = await auth();
if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

### Gemini AI
```ts
import { generateText } from "@/lib/gemini";
const reply = await generateText(prompt, "flash"); // or "pro"
```

### Yahoo Finance v3
```ts
import YahooFinance from "yahoo-finance2";
const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
const quote = await yf.quote("AAPL");
const chart = await yf.chart("AAPL", { period1: "2024-01-01", interval: "1d" });
```

### CoinGecko (no API key)
```ts
fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&per_page=20")
```

---

## Known Gotchas

- **`@types/mongoose`** is installed but covers only v5 — mongoose v9 ships its own types; this may cause conflicts, consider removing it
- **Hydration warnings** from `bis_register` / `__processed_*` attributes on `<body>` are from the **Bionic Reading browser extension**, not a code bug
- **`yahoo-finance2`** is ESM-only; must be in `serverExternalPackages` and instantiated with `new YahooFinance()`
- **CoinGecko free tier** has rate limits (~30 req/min); the crypto route uses `next: { revalidate: 60 }` to cache responses
- **Markets auto-refreshes** quotes every 60 seconds via `setInterval` in `markets/page.tsx`
- **Stray `C:\Users\bibek\package-lock.json`** — this file causes Turbopack workspace detection warnings; safe to delete if it doesn't belong to another project
