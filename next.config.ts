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

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'wisdomchurchhq.org', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'api.wisdomchurchhq.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thewisdomhousechurch.org',
        pathname: '/**',
      },
      // YouTube thumbnails — sermons feed pulls video images from here.
      { protocol: 'https', hostname: '*.ytimg.com', pathname: '/**' },
      // Supabase storage — admin-uploaded media (homepage ads, etc.)
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/**' },
      // Cloud storage — add your CDN/S3 hostname here if images are served from one
    ],
    qualities: [85],
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
    // Static (not nonce-based) by deliberate choice: a nonce has to be
    // baked into the HTML fresh per request, which forces every route
    // through dynamic SSR instead of static generation — real cost for a
    // mostly-static site. 'unsafe-inline' on script-src is the trade-off;
    // the app has no dangerouslySetInnerHTML rendering anything but its
    // own JSON-LD, so there's no current injection surface this protects
    // against. Third-party origins kept in sync with MetaPixel.tsx,
    // ga.ts, the Ahrefs Script tag in layout.tsx, and Cloudflare's
    // auto-injected beacon (present whenever the site is proxied through
    // Cloudflare, not something this app's code controls).
    // Next's development runtime (webpack + React Refresh) evaluates the
    // generated module strings. Allow that only for `next dev`; production
    // keeps the stricter policy below.
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
      'https://analytics.ahrefs.com',
      'https://connect.facebook.net',
      'https://www.googletagmanager.com',
      'https://static.cloudflareinsights.com',
    ].join(' ');

    const csp = [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.ytimg.com https://*.supabase.co https://www.facebook.com",
      "font-src 'self' data:",
      "connect-src 'self' https://analytics.ahrefs.com https://www.google-analytics.com https://www.facebook.com https://cloudflareinsights.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      { key: 'Content-Security-Policy', value: csp },
    ];

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
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

  async redirects() {
    return [
      // Legacy domain — canonicalize to the current domain to avoid
      // duplicate-content indexing of the old church URL.
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.thewisdomhousechurch.org',
          },
        ],
        destination: 'https://wisdomchurchhq.org/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'thewisdomhousechurch.org',
          },
        ],
        destination: 'https://wisdomchurchhq.org/:path*',
        permanent: true,
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

// @ts-expect-error @types/next-pwa lags behind next's I18NConfig type
export default withPwaConfig(nextConfig);
