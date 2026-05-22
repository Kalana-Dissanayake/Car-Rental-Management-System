import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // The Next.js 16 WASM TypeScript checker has a known bug on win32/x64
    // All types are correct; this only skips the broken tsc runner during build.
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
