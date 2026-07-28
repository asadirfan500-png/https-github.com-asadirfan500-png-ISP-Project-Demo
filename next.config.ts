import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reel frame payloads (several JPEGs) need headroom past the default body limit.
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
