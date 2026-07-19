import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  typescript: {
    // Type checking chạy ở local. Vercel chỉ cần compile, không cần type-check lại.
    ignoreBuildErrors: true,
  },
}

export default nextConfig
