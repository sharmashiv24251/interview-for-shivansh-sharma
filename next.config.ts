/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Disable type checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint errors/warnings during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
