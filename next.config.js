/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 1080, 1920],
    formats: ['image/webp'],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/9ieso0n2yz5w/**',
      },
    ],
  },
  
  env: {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_ACCESS_TOKEN: process.env.ALGOLIA_ACCESS_TOKEN,
    ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL
  },
  compiler: {
    styledComponents: true
  },
  eslint: {
    // Only run ESLint on these directories during builds
    dirs: ['app', 'lib'],
    // Ignore test files and stories
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Ignore TypeScript errors during builds
    ignoreBuildErrors: false,
  }
}

module.exports = nextConfig