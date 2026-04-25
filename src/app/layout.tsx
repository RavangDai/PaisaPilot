import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DollarPaisa — Intelligent Financial Guidance",
  description: "AI-powered personal finance coach, investment simulator, and stock predictor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${plusJakarta.variable}`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
