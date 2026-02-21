import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  // ✅ CRITICAL: Add this for Docker production build
  output: 'standalone',

  // ✅ Keep typescript and eslint config
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // Add your own domain for logos/OG images if needed
      {
        protocol: 'https',
        hostname: 'wisdomchurchhq.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thewisdomhousechurch.org',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [60, 70, 80, 85],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ✅ Webpack configuration - OPTIMIZED FOR DOCKER
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };

      // Disable SWC in Docker for better performance
      if (process.env.DOCKER_ENV === 'true') {
        config.experiments = {
          ...config.experiments,
          topLevelAwait: true,
        };
      }
    }
    return config;
  },

  // ✅ Comprehensive CSS handling
  experimental: {
    optimizeCss: false,
  },

  // ✅ Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ✅ Reduce preloading for development
  poweredByHeader: false,

  // ✅ Add headers to handle CORS if needed
  async headers() {
    return [
      {
        source: '/_next/static/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

// Wrap with PWA config (disable in dev to avoid issues)
const enablePwa = false;
const withPwa = withPWA({
  dest: 'public',
  register: false,
  skipWaiting: false,
  disable: !enablePwa,
});

export default (withPwa as unknown as (config: NextConfig) => NextConfig)(
  nextConfig
);
