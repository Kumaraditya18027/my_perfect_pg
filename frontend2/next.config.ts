import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "th.bing.com",
      },
    ],
    domains: ["res.cloudinary.com"], // Add Cloudinary domain here
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
