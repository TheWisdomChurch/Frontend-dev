import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';
import { createHttpClient, isRecord, toQueryString } from '@/lib/http';
import type { YouTubeVideo } from './types';

const mediaHttp = createHttpClient({
  baseUrl: `${resolveConfiguredApiOrigin()}/api/v1`,
});

function normalizeVideo(value: unknown): YouTubeVideo | null {
  if (!isRecord(value) || value.id === undefined) return null;
  const thumbnails = isRecord(value.thumbnails) ? value.thumbnails : undefined;
  const medium =
    thumbnails && isRecord(thumbnails.medium) ? thumbnails.medium : undefined;

  return {
    id: String(value.id),
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
    url: String(value.url || ''),
    embedUrl: String(value.embedUrl || value.embed_url || ''),
    series: String(value.series || ''),
    preacher: String(value.preacher || ''),
  };
}

export const mediaApi = {
  async listSermons(options?: {
    sort?: 'newest' | 'oldest' | 'popular';
    signal?: AbortSignal;
  }): Promise<YouTubeVideo[]> {
    const query = toQueryString({ sort: options?.sort ?? 'newest' });
    const payload = await mediaHttp.request<unknown>(`/sermons${query}`, {
      method: 'GET',
      credentials: 'omit',
      signal: options?.signal,
      unwrap: true,
      skipCache: true,
    });
    return (Array.isArray(payload) ? payload : [])
      .map(normalizeVideo)
      .filter((video): video is YouTubeVideo => video !== null);
  },
};
