import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "hugeicons-react", "date-fns"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
