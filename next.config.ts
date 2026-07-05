import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: 'dist',
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/cExSaKZ',
        permanent: true,
      },
      {
        source: '/reddit',
        destination: 'https://www.reddit.com/r/rocketwatch/',
        permanent: true,
      },
      {
        source: '/youtube',
        destination: 'https://www.youtube.com/c/RocketWatch',
        permanent: true,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/rocket_watch',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
