import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';
import { createHttpClient, isRecord, toQueryString } from '@/lib/http';
import type { SermonCollection, SermonDiscovery, YouTubeVideo } from './types';

const mediaHttp = createHttpClient({
  baseUrl: `${resolveConfiguredApiOrigin()}/api/v1`,
});

function normalizeVideo(value: unknown): YouTubeVideo | null {
  if (!isRecord(value) || value.id === undefined) return null;
  const id = String(value.id).trim();
  // YouTube video IDs are fixed-length, URL-safe identifiers. Rejecting
  // anything else prevents upstream metadata from becoming an arbitrary URL
  // path in thumbnails, links, or iframe embeds.
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
  const thumbnails = isRecord(value.thumbnails) ? value.thumbnails : undefined;
  const medium =
    thumbnails && isRecord(thumbnails.medium) ? thumbnails.medium : undefined;

  return {
    id,
    title: String(value.title || ''),
    description: String(value.description || ''),
    thumbnail: String(value.thumbnail || medium?.url || ''),
    thumbnails:
      typeof medium?.url === 'string'
        ? { medium: { url: medium.url } }
        : undefined,
    publishedAt: String(value.publishedAt || value.published_at || ''),
    duration: String(value.duration || ''),
    viewCount: String(value.viewCount || value.view_count || '0'),
    likeCount:
      value.likeCount === undefined ? undefined : String(value.likeCount),
    commentCount:
      value.commentCount === undefined ? undefined : String(value.commentCount),
    tags: Array.isArray(value.tags) ? value.tags.map(String) : undefined,
    url: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    series: String(value.series || ''),
    preacher: String(value.preacher || ''),
  };
}

const normalizeVideos = (value: unknown) =>
  (Array.isArray(value) ? value : [])
    .map(normalizeVideo)
    .filter((item): item is YouTubeVideo => item !== null);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildSermonDiscovery(sermons: YouTubeVideo[]): SermonDiscovery {
  const latest = [...sermons].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const recommended = [...sermons].sort((a, b) => {
    const score = (item: YouTubeVideo) => {
      const views = Number(item.viewCount.replace(/\D/g, '')) || 0;
      const ageDays = Math.max(
        0,
        (Date.now() - new Date(item.publishedAt).getTime()) / 86_400_000
      );
      return views / 1000 + 30 / (1 + ageDays / 14);
    };
    return score(b) - score(a);
  });
  const grouped = new Map<string, YouTubeVideo[]>();
  sermons.forEach(sermon => {
    const series = sermon.series.trim();
    if (!series || series.toLowerCase() === 'general') return;
    grouped.set(series, [...(grouped.get(series) ?? []), sermon]);
  });
  return {
    featured: latest[0],
    recommended: recommended.slice(0, 8),
    latest: latest.slice(0, 12),
    collections: [...grouped.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 6)
      .map(([title, items]) => ({
        id: slugify(title),
        title,
        description: `${items.length} ${items.length === 1 ? 'message' : 'messages'} in this teaching series`,
        items: items.slice(0, 8),
      })),
    topics: [
      ...new Set(sermons.flatMap(sermon => sermon.tags ?? []).filter(Boolean)),
    ].slice(0, 12),
    generatedAt: new Date().toISOString(),
  };
}

export const mediaApi = {
  async listSermons(options?: {
    sort?: 'newest' | 'oldest' | 'popular';
    limit?: number;
    signal?: AbortSignal;
  }): Promise<YouTubeVideo[]> {
    const query = toQueryString({
      sort: options?.sort ?? 'newest',
      limit: options?.limit ?? 50,
    });
    const payload = await mediaHttp.request<unknown>(`/sermons${query}`, {
      method: 'GET',
      credentials: 'omit',
      signal: options?.signal,
      unwrap: true,
      skipCache: true,
    });
    return normalizeVideos(payload);
  },

  async getSermonDiscovery(): Promise<SermonDiscovery> {
    const payload = await mediaHttp.request<unknown>('/sermons/discovery', {
      method: 'GET',
      credentials: 'omit',
      unwrap: true,
      skipCache: true,
    });
    const value = isRecord(payload) ? payload : {};
    const collections: SermonCollection[] = (
      Array.isArray(value.collections) ? value.collections : []
    )
      .filter(isRecord)
      .map(item => ({
        id: String(item.id || ''),
        title: String(item.title || ''),
        description: String(item.description || ''),
        items: normalizeVideos(item.items),
      }))
      .filter(item => item.id && item.items.length > 0);
    return {
      featured: normalizeVideo(value.featured) ?? undefined,
      recommended: normalizeVideos(value.recommended),
      latest: normalizeVideos(value.latest),
      collections,
      topics: Array.isArray(value.topics) ? value.topics.map(String) : [],
      generatedAt: String(value.generatedAt || ''),
    };
  },
};
