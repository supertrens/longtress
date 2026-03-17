import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure correct root on Vercel (and when multiple lockfiles exist locally)
  turbopack: { root: "." },
};

export default nextConfig;
