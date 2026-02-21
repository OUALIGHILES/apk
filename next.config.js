/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Allow images from the backend
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kaffak.company',
        pathname: '/kaffak/uploads/images/**',
      },
      {
        protocol: 'https',
        hostname: '**.firebasestorage.app',
      },
    ],
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
