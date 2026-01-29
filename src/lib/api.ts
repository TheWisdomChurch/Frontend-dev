'use client';


import { EventPublic, PublicFormPayload, PublicFormSubmissionRequest,
  Testimonial, TestimonialPayload,CreateTestimonialRequest
 } from './apiTypes';

/* ============================================================================
   API ORIGIN
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

/**
 * Supports both:
 * 1) { data: ... }
 * 2) raw payload
 */
function unwrapData<T>(res: any): T {
  if (res && typeof res === 'object' && 'data' in res) return res.data as T;
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
      credentials: 'include',
      cache: 'no-store',
    });

    const json = await safeParseJson(res);
    const payload =
      json ?? ({ message: await res.text().catch(() => '') } as Record<string, any>);

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
   Public API Client (Frontend)
============================================================================ */

export const apiClient = {
  /* -----------------------------
     EVENTS (public read)
     ----------------------------- */

  /**
   * Recommended public endpoints:
   *   GET /api/v1/public/events
   *   GET /api/v1/public/events/:id
   *
   * Note: Your current /api/v1/events is admin-protected.
   */
  async listEvents(): Promise<EventPublic[]> {
    const res = await request<any>('/public/events', { method: 'GET' });
    return unwrapData<EventPublic[]>(res);
  },

  async getEvent(id: string): Promise<EventPublic> {
    const res = await request<any>(`/public/events/${encodeURIComponent(id)}`, { method: 'GET' });
    return unwrapData<EventPublic>(res);
  },

  /* -----------------------------
     FORMS (public)
     ----------------------------- */

  /**
   * User opens: /forms/:slug on the website
   * Frontend calls backend: GET /api/v1/forms/:slug
   */
  async getPublicForm(slug: string): Promise<PublicFormPayload> {
    const res = await request<any>(`/forms/${encodeURIComponent(slug)}`, { method: 'GET' });
    return unwrapData<PublicFormPayload>(res);
  },

  /**
   * User submits: POST /api/v1/forms/:slug/submissions
   * Backend stores + notifies admin portal
   */
  async submitPublicForm(slug: string, body: PublicFormSubmissionRequest): Promise<any> {
    const res = await request<any>(`/forms/${encodeURIComponent(slug)}/submissions`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<any>(res);
  },

  /* -----------------------------
     TESTIMONIALS (public submit + public list approved)
     ----------------------------- */

  /**
   * Public display: ONLY approved testimonials should render on the website.
   * Flow:
   *   Frontend submits -> backend stores as approved=false -> super admin approves ->
   *   admin publishes (or approval itself marks it approved) -> frontend lists approved=true.
   */
  async listApprovedTestimonials(): Promise<Testimonial[]> {
    const qs = toQueryString({ approved: true });
    const res = await request<any>(`/testimonials${qs}`, { method: 'GET' });
    return unwrapData<Testimonial[]>(res);
  },

  /**
   * Public submit: creates testimonial as pending (approved=false).
   * Backend handles super admin + admin workflow.
   */
  async submitTestimonial(payload: CreateTestimonialRequest): Promise<Testimonial> {
    const res = await request<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return unwrapData<Testimonial>(res);
  },

  /* -----------------------------
     SUBSCRIBERS
     ----------------------------- */
  async subscribe(payload: { name?: string; email: string }) {
    return request<any>('/subscribers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export default apiClient;
