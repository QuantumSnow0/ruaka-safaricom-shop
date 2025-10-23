/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable experimental features for better performance
    optimizePackageImports: ["@heroicons/react", "lucide-react"],
  },

  // Image optimization
  images: {
    domains: [
      "jvrqdpiuixdeeofazqfu.supabase.co",
      "your-supabase-project.supabase.co",
      "supabase.co",
      "via.placeholder.com",
      "images.unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jvrqdpiuixdeeofazqfu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "safaricomshopruaka.co.ke",
          },
        ],
        destination: "https://www.safaricomshopruaka.co.ke/:path*",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      // Redirect old category URLs to new format using has conditions
      {
        source: "/products",
        destination: "/products/category/:category",
        permanent: false,
        has: [
          {
            type: "query",
            key: "category",
            value: "(?<category>.*)",
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Optimize for production
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Output configuration for Vercel
  output: "standalone",
  outputFileTracingRoot: __dirname,

  // Enable compression
  compress: true,

  // Power by header
  poweredByHeader: false,

  // React strict mode
  reactStrictMode: true,

  // Disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // SWC minification (removed - not needed in Next.js 13+)
};

module.exports = nextConfig;
