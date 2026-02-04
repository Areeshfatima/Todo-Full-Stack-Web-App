/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  },
  // Increase webpack timeout to avoid build timeouts
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Add timeout settings to prevent hanging builds
  staticPageGenerationTimeout: 300,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig;