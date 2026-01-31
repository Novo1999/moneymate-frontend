import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://moneymate-backend-tau.vercel.app/api/:path*',
      },
    ]
  },
}

export default nextConfig
