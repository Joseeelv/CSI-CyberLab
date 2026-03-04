import type { NextConfig } from "next";
import withPWA from 'next-pwa';

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
        hostname: '*.trycloudflare.com',
      },
    ],
  },
  // Allow the Cloudflare Tunnel domain to access dev server resources
  // and proxy API calls to the local backend running on port 3000.
  allowedDevOrigins: [
    'https://*.trycloudflare.com',
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://*.trycloudflare.com',
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

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig);
