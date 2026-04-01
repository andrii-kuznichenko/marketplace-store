import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'upkbcnxnvbmgpcwvdrwy.supabase.co',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
