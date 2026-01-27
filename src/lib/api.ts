'use client';

import type { Testimonial, TestimonialPayload } from './types';

/* ============================================================================
   API CLIENT CONFIG (Public Frontend)
============================================================================ */

function normalizeOrigin(raw?: string | null): string {
  const fallback = 'http://localhost:8080';
  if (!raw) return fallback;

  let base = raw.trim().replace(/\/+$/, '');

  // If someone mistakenly sets NEXT_PUBLIC_API_URL=https://domain.com/api/v1
  // normalize it back to origin so we can safely append /api/v1.
  if (base.endsWith('/api/v1')) {
    base = base.slice(0, -'/api/v1'.length);
  }

  return base || fallback;
}

const API_ORIGIN = normalizeOrigin(process.env.NEXT_PUBLIC_API_URL);
const API_V1_BASE_URL = `${API_ORIGIN}/api/v1`;

/* ============================================================================
   Error + Fetch Utilities
============================================================================ */

export interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

function createApiError(message: string, statusCode?: number, details?: unknown): ApiError {
  const err = new Error(message) as ApiError;
  err.statusCode = statusCode;
  err.details = details;
  return err;
}

async function safeParseJson(res: Response): Promise<any | null> {
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function unwrapData<T>(res: any, errorMessage: string): T {
  // supports both:
  // 1) { data: ... }
  // 2) raw payload
  if (res && typeof res === 'object' && 'data' in res) {
    const data = res.data;
    if (data === undefined || data === null) throw createApiError(errorMessage, 400, res);
    return data as T;
  }
  return res as T;
}

function toQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    cleaned[k] = String(v);
  }
  const qs = new URLSearchParams(cleaned).toString();
  return qs ? `?${qs}` : '';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_V1_BASE_URL}${path}`;

  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      // Public frontend can be cookie-less, but keep include for consistency
      // (it won't hurt, and allows future auth-gated calls if needed).
      credentials: 'include',
      cache: 'no-store',
    });

    const json = await safeParseJson(res);
    const payload =
      json ??
      ({ message: await res.text().catch(() => '') } as Record<string, any>);

    if (!res.ok) {
      throw createApiError(
        (payload as any)?.error || (payload as any)?.message || 'Request failed',
        res.status,
        payload
      );
    }

    return payload as T;
  } catch (err: any) {
    if (err?.statusCode !== undefined) throw err;
    throw createApiError(err?.message || 'Network error', 0, err);
  }
}

/* ============================================================================
   PUBLIC API (Testimonials Only)
============================================================================ */

export const apiClient = {
  /**
   * Public display: ALWAYS fetch approved testimonials.
   * Your backend should filter with approved=true.
   */
  async listApprovedTestimonials(): Promise<Testimonial[]> {
    const qs = toQueryString({ approved: true });
    const res = await request<any>(`/testimonials${qs}`, { method: 'GET' });
    return unwrapData<Testimonial[]>(res, 'Invalid testimonials payload');
  },

  /**
   * Public submit: creates a testimonial (should default to approved=false on backend).
   */
  async submitTestimonial(payload: TestimonialPayload): Promise<Testimonial> {
    const res = await request<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return unwrapData<Testimonial>(res, 'Invalid testimonial payload');
  },
};

export default apiClient;
