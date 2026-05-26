import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // We fallback to localhost:3001 if the env variable isn't set (useful for local dev)
        destination: `${process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
