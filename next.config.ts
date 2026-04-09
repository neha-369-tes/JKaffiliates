import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mlszrccnrqunowjihfjg.supabase.co',
      },
    ],
  },
};

export default nextConfig;
