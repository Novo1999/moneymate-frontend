import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://moneymate-backend-tau.vercel.app/api/v1/:path*',
      },
    ]
  },
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
}

export default nextConfig
