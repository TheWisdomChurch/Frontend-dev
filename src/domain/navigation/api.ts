import { createHttpClient } from '@/lib/http';
import type { RoutePreview, RoutePreviewRequest } from './types';

const http = createHttpClient({ baseUrl: '', timeoutMs: 15_000, retries: 1 });

export function getRoutePreview(
  input: RoutePreviewRequest,
  signal?: AbortSignal
) {
  return http.request<RoutePreview>('/api/navigation/route', {
    method: 'POST',
    body: JSON.stringify(input),
    signal,
    skipCache: true,
  });
}
