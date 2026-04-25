import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "yahoo-finance2"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "coin-images.coingecko.com" },
      { protocol: "https", hostname: "assets.coingecko.com" },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
