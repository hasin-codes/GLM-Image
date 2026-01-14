import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
      {
        protocol: 'https',
        hostname: 'sfile.chatglm.cn',
      },
      {
        protocol: 'https',
        hostname: 'mfile.z.ai',
      },
      {
        protocol: 'https',
        hostname: '*.bigmodel.cn',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default nextConfig;
