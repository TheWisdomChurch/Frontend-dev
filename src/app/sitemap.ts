// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://wisdomchurchhq.org';
const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/api\/v1\/?$/, '');

// How often Next should refresh this sitemap (seconds)
export const revalidate = 3600; // 1 hour

type ApiResource = {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
};

function toLastMod(dateLike?: string): Date | undefined {
  if (!dateLike) return undefined;
  const d = new Date(dateLike);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function fetchJSON<T>(path: string): Promise<T | null> {
  if (!API_BASE_URL) return null;

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      // Sitemap should not be cached forever; use revalidate above
      next: { revalidate },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Core public pages only (exclude transactional pages like checkout/order confirmation).
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/events/calendar`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/events/special`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/events/upcoming`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/events/weekly`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/resources/sermons`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resources/blogs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/resources/publications`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/resources/store`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/leadership`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/pastoral`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${SITE_URL}/testimonies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/ministries`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/ministries/men`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/ministries/women`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/ministries/youth`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/ministries/children`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/ministries/outreach`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.25,
    },
  ];

  // Optional dynamic routes from API if available.
  const resources = await fetchJSON<ApiResource[]>('/api/v1/public/resources');

  const eventRoutes: MetadataRoute.Sitemap = [];
  const resourceRoutes: MetadataRoute.Sitemap =
    resources?.map(r => ({
      url: `${SITE_URL}/resources/${encodeURIComponent(r.slug)}`,
      lastModified: toLastMod(r.updatedAt ?? r.createdAt) ?? now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })) ?? [];

  return [...staticRoutes, ...eventRoutes, ...resourceRoutes];
}
