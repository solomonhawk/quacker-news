/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    runtime: 'experimental-edge',
  },
  async rewrites() {
    return [
      {
        source: '/news',
        destination: '/',
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
