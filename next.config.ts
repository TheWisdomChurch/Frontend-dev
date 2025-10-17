import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove this line: output: 'standalone',
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
