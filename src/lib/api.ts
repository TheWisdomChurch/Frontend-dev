'use client';

import type {
  PublicFormPayload,
  PublicFormSubmissionRequest,
  // Testimonial,
  TestimonialFormData,
  CreateTestimonialRequest,
  SubscriberPayload,
} from './apiTypes';

/* ============================================================================
   API CONFIG (PUBLIC WEBSITE)
============================================================================ */

function normalizeOrigin(raw?: string | null): string {
  const isProd = process.env.NODE_ENV === 'production';

  if (!raw || !raw.trim()) {
    if (!isProd) return 'http://localhost:8080';
    throw new Error(
      '[public api] Missing NEXT_PUBLIC_API_URL (or NEXT_PUBLIC_BACKEND_URL) in production.'
    );
  }

  let base = raw.trim().replace(/\/+$/, '');
  if (base.endsWith('/api/v1')) base = base.slice(0, -'/api/v1'.length);
  return base;
}

const API_ORIGIN = normalizeOrigin(
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL
);

const API_V1_BASE_URL = `${API_ORIGIN}/api/v1`;

/* ============================================================================
   Errors + Fetch
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

function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'statusCode' in err;
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

function unwrapData<T>(res: any): T {
  if (res && typeof res === 'object' && 'data' in res) return res.data as T;
  return res as T;
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
    if (isApiError(err)) throw err;
    throw createApiError(err?.message || 'Network error', 0, err);
  }
}

/* ============================================================================
   Normalizers (optional but keeps frontend stable)
============================================================================ */

function normalizeTestimonial(raw: any): Testimonial {
  const firstName = raw?.firstName ?? raw?.first_name;
  const lastName = raw?.lastName ?? raw?.last_name;

  const anonymous =
    raw?.anonymous ??
    raw?.isAnonymous ??
    raw?.is_anonymous ??
    raw?.isAnonymous ??
    false;

  const image =
    raw?.image ??
    raw?.imageUrl ??
    raw?.image_url ??
    undefined;

  const createdAt =
    raw?.createdAt ?? raw?.created_at;

  const fullName =
    raw?.fullName ??
    raw?.full_name ??
    (firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : undefined);

  return {
    id: raw?.id,
    firstName,
    lastName,
    fullName,
    testimony: raw?.testimony ?? '',
    image,
    anonymous: Boolean(anonymous),
    approved: raw?.approved ?? raw?.isApproved ?? raw?.is_approved,
    createdAt,
  };
}

/* ============================================================================
   FORM → BACKEND MAPPER (THIS IS THE INTEGRATION)
============================================================================ */

/**
 * IMPORTANT:
 * Your Go backend currently expects imageUrl (not base64) unless you add support.
 * So we send base64 only if you decide to support it on the backend as imageBase64.
 *
 * For now, we include imageBase64 if it's a data URL; if your backend rejects it,
 * remove imageBase64 line OR implement backend support.
 */
export function mapTestimonialFormToRequest(form: TestimonialFormData): CreateTestimonialRequest {
  const isAnonymous = Boolean(form.anonymous);

  // Backend requires firstName/lastName: provide placeholders if anonymous
  const firstName = isAnonymous ? 'Anonymous' : form.firstName.trim();
  const lastName = isAnonymous ? 'Anonymous' : form.lastName.trim();

  const imageBase64 =
    typeof form.image === 'string' && form.image.startsWith('data:')
      ? form.image
      : undefined;

  return {
    firstName,
    lastName,
    email: form.email?.trim() || undefined,
    testimony: form.testimony.trim(),
    isAnonymous,

    // If your backend DOES NOT support base64, delete this line:
    imageBase64,

    // If you upload first and get a URL, set this instead:
    // imageUrl: "https://....",

    allowSharing: Boolean(form.allowSharing),
    agreeToTerms: Boolean(form.agreeToTerms),
  };
}

/* ============================================================================
   PUBLIC API (matches your Go routes)
============================================================================ */

export const apiPublic = {
  async getPublicForm(slug: string): Promise<PublicFormPayload> {
    const res = await request<any>(`/forms/${encodeURIComponent(slug)}`, { method: 'GET' });
    return unwrapData<PublicFormPayload>(res);
  },

  async submitPublicForm(slug: string, body: PublicFormSubmissionRequest): Promise<any> {
    const res = await request<any>(`/forms/${encodeURIComponent(slug)}/submissions`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<any>(res);
  },

  async listApprovedTestimonials(): Promise<Testimonial[]> {
    const res = await request<any>(`/testimonials?approved=true`, { method: 'GET' });
    const data = unwrapData<any>(res);
    return Array.isArray(data) ? data.map(normalizeTestimonial) : [];
  },

  async submitTestimonial(payload: CreateTestimonialRequest): Promise<Testimonial> {
    const res = await request<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeTestimonial(unwrapData<any>(res));
  },

  /**
   * This is the one your React page should call.
   * It converts your form state to the backend request payload.
   */
  async submitTestimonialFromForm(form: TestimonialFormData): Promise<Testimonial> {
    const payload = mapTestimonialFormToRequest(form);
    return this.submitTestimonial(payload);
  },

  async subscribe(payload: SubscriberPayload) {
    return request<any>('/subscribers', { method: 'POST', body: JSON.stringify(payload) });
  },

  async unsubscribe(payload: { email: string }) {
    return request<any>('/subscribers/unsubscribe', { method: 'POST', body: JSON.stringify(payload) });
  },

  async sendOtp(payload: { email: string; purpose?: string }) {
    return request<any>('/otp/send', { method: 'POST', body: JSON.stringify(payload) });
  },

  async verifyOtp(payload: { email: string; code: string; purpose?: string }) {
    return request<any>('/otp/verify', { method: 'POST', body: JSON.stringify(payload) });
  },

  async applyToWorkforce(payload: any) {
    return request<any>('/workforce/apply', { method: 'POST', body: JSON.stringify(payload) });
  },
};

export default apiPublic;
