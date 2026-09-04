import type { NextConfig } from 'next';

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
      // AWS S3 — leadership photos and other admin uploads. Covers virtual-hosted
      // (`bucket.s3.region.amazonaws.com`) and path-style (`s3.region.amazonaws.com`)
      // URLs. Tighten to the exact bucket host if you want a narrower rule.
      { protocol: 'https', hostname: '**.amazonaws.com', pathname: '/**' },
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
    // against. Third-party origins are kept in sync with the analytics providers,
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
      "img-src 'self' data: blob: https://wisdomchurchhq.org https://api.wisdomchurchhq.org https://*.amazonaws.com https://*.ytimg.com https://*.supabase.co https://www.facebook.com",
      "font-src 'self' data:",
      "connect-src 'self' https://analytics.ahrefs.com https://www.google-analytics.com https://www.facebook.com https://cloudflareinsights.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com",
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

    return [{ source: '/:path*', headers: securityHeaders }];
  },

  async redirects() {
    const toApex = (host: string) => ({
      source: '/:path*',
      has: [{ type: 'host' as const, value: host }],
      destination: 'https://wisdomchurchhq.org/:path*',
      permanent: true,
    });
    return [
      // One canonical host. `www` and the legacy church domain 301 to the apex
      // so Google never sees duplicate copies of the same page (a real ranking
      // dilution — split link equity, "which URL do I show?").
      toApex('www.wisdomchurchhq.org'),
      toApex('www.thewisdomhousechurch.org'),
      toApex('thewisdomhousechurch.org'),
    ];
  },
};

export default nextConfig;
