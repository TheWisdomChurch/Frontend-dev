// const DEFAULT_LOCAL_API_ORIGIN = 'http://localhost:8080';

// export function normalizeApiOrigin(raw?: string | null): string {
//   if (!raw || !raw.trim()) return '';

//   let base = raw.trim().replace(/\/+$/, '');
//   if (base.endsWith('/api/v1')) base = base.slice(0, -'/api/v1'.length);
//   return base;
// }

// export function resolveApiOrigin(raw?: string | null): string {
//   const normalized = normalizeApiOrigin(raw);
//   const isProd = process.env.NODE_ENV === 'production';

//   // In browser environments, prefer an explicitly configured origin when present.
//   // Otherwise fall back to same-origin calls routed via /api/v1 rewrites.
//   if (typeof window !== 'undefined') {
//     return normalized || '';
//   }

//   if (normalized) return normalized;
//   return isProd ? '' : DEFAULT_LOCAL_API_ORIGIN;
// }

// export function resolveConfiguredApiOrigin(): string {
//   return resolveApiOrigin(
//     process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL
//   );
// }
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

  return process.env.NODE_ENV === 'production'
    ? DEFAULT_PRODUCTION_API_ORIGIN
    : DEFAULT_LOCAL_API_ORIGIN;
}
