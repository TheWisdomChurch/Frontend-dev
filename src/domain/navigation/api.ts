import { createHttpClient } from '@/lib/http';
import type { RoutePreview, RoutePreviewRequest } from './types';

const http = createHttpClient({ baseUrl: '', timeoutMs: 15_000, retries: 1 });

export function getRoutePreview(
  input: RoutePreviewRequest,
  signal?: AbortSignal
) {
  return http
    .request<unknown>('/api/v1/navigation/routes/preview', {
      method: 'POST',
      body: JSON.stringify(input),
      signal,
      skipCache: true,
      unwrap: true,
    })
    .then(normalizeRoutePreview);
}

export function normalizeRoutePreview(value: unknown): RoutePreview {
  if (!value || typeof value !== 'object') {
    throw new Error('Route preview response is invalid');
  }
  const route = value as Record<string, unknown>;
  const distanceMeters = Number(route.distanceMeters);
  const durationSeconds = Number(route.durationSeconds);
  const encodedPolyline = route.encodedPolyline;
  if (
    !Number.isFinite(distanceMeters) ||
    distanceMeters <= 0 ||
    !Number.isFinite(durationSeconds) ||
    durationSeconds <= 0 ||
    typeof encodedPolyline !== 'string' ||
    encodedPolyline.length === 0
  ) {
    throw new Error('Route preview response is incomplete');
  }
  const distanceLabel =
    typeof route.distanceLabel === 'string' && route.distanceLabel.trim()
      ? route.distanceLabel.trim()
      : `${(distanceMeters / 1000).toFixed(1)} km`;
  const durationLabel =
    typeof route.durationLabel === 'string' && route.durationLabel.trim()
      ? route.durationLabel.trim()
      : `${Math.max(1, Math.round(durationSeconds / 60))} min`;

  return {
    distanceMeters,
    durationSeconds,
    distanceLabel,
    durationLabel,
    encodedPolyline,
  };
}
