import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable static export to test build
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable server-side features for static export
  experimental: {
    // Enable if needed
  }
};

export default nextConfig;
