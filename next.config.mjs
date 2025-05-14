/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  },
}

export default nextConfig;
