/** @type {import('next').NextConfig} */

// Debug environment variables
console.log('🔍 FalkorDB Browser Next.js Config Debug:');
console.log(`   BEHIND_PROXY = "${process.env.BEHIND_PROXY}"`);
console.log(`   NODE_ENV = "${process.env.NODE_ENV}"`);
console.log(`   Will apply basePath/assetPrefix: ${process.env.BEHIND_PROXY === 'true'}`);

const nextConfig = {
  // Remove standalone output to fix Railway internal networking
  // output: 'standalone',
  // Always use basePath in production (Railway), optional in development
  ...((process.env.BEHIND_PROXY === 'true' || process.env.NODE_ENV === 'production') && { 
    basePath: '/falkordb',
    assetPrefix: '/falkordb'
  }),
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

module.exports = nextConfig
