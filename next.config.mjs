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
    domains: [
      'keycrm.s3.eu-central-1.amazonaws.com',
      'diverso.api.keycrm.app'
    ],
  },
}

export default nextConfig
