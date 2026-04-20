export const SITE_URL = 'https://wisdomchurchhq.org';
export const SITE_NAME = 'The Wisdom Church';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;

export function canonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return SITE_URL;
  return `${SITE_URL}${normalized}`;
}
