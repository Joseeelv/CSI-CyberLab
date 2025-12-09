import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable Turbopack explicitly (Next.js 16)
  turbopack: {},
};

export default nextConfig;
