/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/news',
        destination: '/',
      },
    ];
  },
};

module.exports = nextConfig;
