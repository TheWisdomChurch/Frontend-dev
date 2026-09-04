import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';

// Served at /manifest.webmanifest. A valid manifest is part of Google's
// mobile / installability signals and lets the church site be added to a
// phone home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: SITE_NAME,
    short_name: 'Wisdom Church',
    description: SITE_DESCRIPTION,
    start_url: '/?utm_source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'en',
    dir: 'ltr',
    categories: ['lifestyle', 'education', 'social'],
    background_color: 'black',
    theme_color: 'black',
    icons: [
      {
        src: '/OIP.webp',
        sizes: '638x630',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: '/OIP.webp',
        sizes: '638x630',
        type: 'image/webp',
        purpose: 'maskable',
      },
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  };
}
