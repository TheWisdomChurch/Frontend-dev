import type { NextConfig } from 'next';

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
    ],
    qualities: [75, 85, 90, 100],
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

  // ✅ Disable SWC in Docker environment
  swcMinify: process.env.DOCKER_ENV !== 'true',

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

export default nextConfig;