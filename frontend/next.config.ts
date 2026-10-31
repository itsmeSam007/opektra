import type { NextConfig } from "next";

const apiProxy = process.env.API_PROXY_URL || "http://localhost:18000";

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 120,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    return [
      ...["/portfolio", "/case-studies", "/enterprise", "/acquisition", "/open-source"].map(source => ({ source: `${source}/:path*`, destination: "/products", permanent: false })),
      ...["/media", "/technology", "/travel", "/testimonials"].map(source => ({ source: `${source}/:path*`, destination: "/about", permanent: false })),
      { source: "/products/ai-customer-operations", destination: "/products/conektra", permanent: false },
      { source: "/newsletter/:path*", destination: "/blog", permanent: false },
      { source: "/legal/cookies", destination: "/legal/privacy", permanent: false },
      { source: "/legal/licensing", destination: "/legal/terms", permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiProxy}/api/v1/:path*`,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
