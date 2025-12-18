import type { NextConfig } from "next";

const BACKEND_INTERNAL = process.env.BACKEND_INTERNAL_URL || 'http://localhost:3000';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kijiji-measured-auction-entity.trycloudflare.com',
      },
    ],
  },
  // Allow the Cloudflare Tunnel domain to access dev server resources
  // and proxy API calls to the local backend running on port 3000.
  allowedDevOrigins: [
    'https://marco-utilities-spiritual-premiere.trycloudflare.com',
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://marco-utilities-spiritual-premiere.trycloudflare.com',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_INTERNAL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
