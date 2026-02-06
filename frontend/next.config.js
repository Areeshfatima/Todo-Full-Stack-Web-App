/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  },
  serverExternalPackages: ['better-auth'],
  staticPageGenerationTimeout: 300,
};

module.exports = nextConfig;