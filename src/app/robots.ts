// src/app/robots.ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Keep crawlers on the public, content-rich pages. Transactional flows
// (checkout / order confirmation), raw API routes, build assets, form
// submission pages and the maintenance page carry no ranking value and are
// kept out of the index.
const DISALLOW = [
  '/api/',
  '/_next/',
  '/checkout',
  '/order-confirmation',
  '/forms/',
  '/unavailable',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      // Explicit entries for the big engines — same policy, no ambiguity.
      { userAgent: 'Googlebot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Bingbot', allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: 'wisdomchurchhq.org',
  };
}
