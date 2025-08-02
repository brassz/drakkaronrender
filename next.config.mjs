/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable standalone mode for Docker deployment
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Disable cache completely to prevent stale data issues in production
  experimental: {
    serverComponentsExternalPackages: [],
    // Disable ISR and force dynamic rendering
    isrFlushToDisk: false,
  },
  // Force dynamic rendering for all pages
  // generateStaticParams: false, // Invalid config option - removed
  // Add headers to prevent caching at all levels
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Vary',
            value: '*',
          },
          {
            key: 'X-No-Cache',
            value: 'true',
          },
        ],
      },
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },
  // Force dynamic rendering
  async rewrites() {
    return []
  },
  // Disable compression for API routes in production to avoid caching
  compress: false,
}

export default nextConfig