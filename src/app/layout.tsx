import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaisaPilot — Intelligent Financial Guidance",
  description: "AI-powered personal finance coach, investment simulator, and stock predictor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
