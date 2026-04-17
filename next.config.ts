import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

function normalizeApiProxyTarget(raw?: string): string {
  if (!raw || !raw.trim()) return '';
  let base = raw.trim().replace(/\/+$/, '');
  if (base.endsWith('/api/v1')) base = base.slice(0, -'/api/v1'.length);
  return base;
}

const nextConfig: NextConfig = {
  // Use an isolated build directory for CI/hooks when NEXT_DIST_DIR is set.
  // This avoids conflicts with a running `next dev` process writing to `.next`.
  distDir: process.env.NEXT_DIST_DIR || '.next',

  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wisdomchurchhq.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thewisdomhousechurch.org',
        pathname: '/**',
      },
    ],
    qualities: [60, 70, 80, 85],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };

      if (process.env.DOCKER_ENV === 'true') {
        config.experiments = {
          ...config.experiments,
          topLevelAwait: true,
        };
      }
    }

    return config;
  },

  experimental: {
    optimizeCss: false,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  poweredByHeader: false,

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

  async rewrites() {
    const target = normalizeApiProxyTarget(
      process.env.API_PROXY_TARGET ||
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_BACKEND_URL
    );

    if (!target) return [];

    return [
      {
        source: '/api/v1/:path*',
        destination: `${target}/api/v1/:path*`,
      },
    ];
  },
};

const enablePwa = false;

const withPwaConfig = withPWA({
  dest: 'public',
  register: false,
  skipWaiting: false,
  disable: !enablePwa,
});

export default withPwaConfig(nextConfig);
