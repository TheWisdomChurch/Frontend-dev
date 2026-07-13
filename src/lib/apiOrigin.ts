const DEFAULT_LOCAL_API_ORIGIN = 'http://localhost:8080';
const DEFAULT_PRODUCTION_API_ORIGIN = 'https://api.wisdomchurchhq.org';

export function normalizeApiOrigin(raw?: string | null): string {
  if (!raw || !raw.trim()) return '';

  let base = raw.trim().replace(/\/+$/, '');
  if (base.endsWith('/api/v1')) {
    base = base.slice(0, -'/api/v1'.length);
  }

  return base;
}

export function resolveConfiguredApiOrigin(): string {
  const configured = normalizeApiOrigin(
    process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      process.env.NEXT_PUBLIC_BACKEND_URL
  );

  if (configured) return configured;

  // Browser: always prefer same-origin so requests route through the
  // /api/v1 rewrite proxy and avoid CORS. Only default to a direct backend
  // origin when running server-side (SSR/route handlers), where there's no
  // CORS concern.
  if (typeof window !== 'undefined') return '';

  return process.env.NODE_ENV === 'production'
    ? DEFAULT_PRODUCTION_API_ORIGIN
    : DEFAULT_LOCAL_API_ORIGIN;
}
