'use client';

import type {
  EventPublic,
  PublicFormPayload,
  PublicFormSubmissionRequest,
  Testimonial,
  CreateTestimonialRequest,
} from './apiTypes';
import type { WorkforceRegistrationData } from './types';

/* ============================================================================
   API CONFIG (PUBLIC WEBSITE)
============================================================================ */

/**
 * Normalize an origin string:
 * - trims
 * - removes trailing slashes
 * - strips a trailing /api/v1 if someone passes that
 *
 * DEV: falls back to localhost
 * PROD: throws (prevents shipping localhost builds)
 */
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
   Error Utilities (WITH validationErrors)
============================================================================ */

export type ValidationFieldError = {
  field: string;
  code?: string;
  message: string;
};

export interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
  validationErrors?: ValidationFieldError[];
}

export function createApiError(
  message: string,
  statusCode?: number,
  details?: unknown,
  validationErrors?: ValidationFieldError[]
): ApiError {
  const err = new Error(message) as ApiError;
  err.statusCode = statusCode;
  err.details = details;
  if (validationErrors && validationErrors.length > 0) {
    err.validationErrors = validationErrors;
  }
  return err;
}

export function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'statusCode' in err;
}

export function isValidationError(
  err: unknown
): err is ApiError & { validationErrors: ValidationFieldError[] } {
  return (
    isApiError(err) &&
    Array.isArray((err as ApiError).validationErrors) &&
    (err as ApiError).validationErrors!.length > 0
  );
}

export function mapValidationErrors(err: unknown): Record<string, string> | null {
  if (!isValidationError(err)) return null;
  const out: Record<string, string> = {};
  for (const e of err.validationErrors) {
    if (!e.field) continue;
    if (!out[e.field]) out[e.field] = e.message;
  }
  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getMessageFromPayload(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined;
  const error = payload.error;
  if (typeof error === 'string' && error.trim()) return error;
  const message = payload.message;
  if (typeof message === 'string' && message.trim()) return message;
  return undefined;
}

/**
 * Expects backend payload like:
 * { errors: [{ field: "firstName", message: "...", code: "required" }, ...] }
 */
function extractValidationErrors(payload: unknown): ValidationFieldError[] | undefined {
  if (!isRecord(payload)) return undefined;

  const raw = (payload as Record<string, unknown>).errors;
  if (!Array.isArray(raw)) return undefined;

  const normalized: ValidationFieldError[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;

    const field = typeof item.field === 'string' ? item.field.trim() : '';
    const message =
      typeof item.message === 'string' && item.message.trim()
        ? item.message.trim()
        : 'Invalid value';
    const code =
      typeof item.code === 'string' && item.code.trim() ? item.code.trim() : undefined;

    normalized.push({ field, code, message });
  }

  return normalized.length > 0 ? normalized : undefined;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (isRecord(err)) {
    const message = getMessageFromPayload(err);
    if (message) return message;
  }
  return 'Network error';
}

/* ============================================================================
   Fetch Utilities

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
 * Supports these common backend shapes:
 * - direct payload: {...}
 * - wrapped: { data: {...} }
 * - wrapped: { data: { data: ... } }   (some "SuccessResponse" patterns)
 */
function unwrapData<T>(res: any): T {
  if (!res || typeof res !== 'object') return res as T;

  if ('data' in res) {
    const d = (res as any).data;
    if (d && typeof d === 'object' && 'data' in d) return d.data as T; // { data: { data: ... } }
    return d as T; // { data: ... }
  }

  return res as T;
}

function mapWorkforcePayload(payload: WorkforceRegistrationData) {
  const {
    firstName,
    lastName,
    email,
    phone,
    title,
    department,
    leadershipCategory,
    birthMonth,
    anniversaryMonth,
    isExistingMember,
    currentAssignment,
    notes,
  } = payload;

  return {
    firstName,
    lastName,
    email,
    phone,
    title,
    department,
    leadershipCategory,
    birthMonth,
    anniversaryMonth,
    isExistingMember,
    currentAssignment,
    notes,
    first_name: firstName,
    last_name: lastName,
    leadership_category: leadershipCategory,
    birth_month: birthMonth,
    anniversary_month: anniversaryMonth,
    is_existing_member: isExistingMember,
    current_assignment: currentAssignment,
  };
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
      const validationErrors = extractValidationErrors(payload);
      throw createApiError(
        getMessageFromPayload(payload) || 'Request failed',
        res.status,
        payload,
        validationErrors
      );
    }

    return payload as T;
  } catch (err: any) {
    if (isApiError(err)) throw err;

function normalizeTestimonial(raw: any): Testimonial {
  const firstName = raw?.firstName ?? raw?.first_name;
  const lastName = raw?.lastName ?? raw?.last_name;

  const anonymous =
    raw?.anonymous ??
    raw?.isAnonymous ??
    raw?.is_anonymous ??
    false;

  const image =
    raw?.image ??
    raw?.imageUrl ??
    raw?.image_url ??
    undefined;

  const createdAt = raw?.createdAt ?? raw?.created_at;

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

/**
 * IMPORTANT:
 * Your Go backend currently expects imageUrl (not base64) unless you add support.
 * We include imageBase64 only if it's a data URL. If backend rejects it, remove it.
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

    allowSharing: Boolean(form.allowSharing),
    agreeToTerms: Boolean(form.agreeToTerms),
  };
}

/* ============================================================================
   PUBLIC API (matches your Go routes)

export const apiPublic = {
    throw createApiError(getErrorMessage(err), 0, err);
  }
}

/* ============================================================================
   Public API Client (PUBLIC WEBSITE)

export const apiClient = {
  /* -----------------------------
     EVENTS (public read)
     ----------------------------- */

  /**
   * ⚠️ Your Go backend (main.go you posted) does NOT expose these public event routes yet.
   * Your current routes:
   *   /api/v1/events  -> admin protected
   *
   * If you add these later:
   *   GET /api/v1/public/events
   *   GET /api/v1/public/events/:id
   * then these functions will work.
   */
  async listEvents(): Promise<EventPublic[]> {
    const res = await request<any>('/public/events', { method: 'GET' });
    return unwrapData<EventPublic[]>(res);
  },

  async getEvent(id: string): Promise<EventPublic> {
    const res = await request<any>(`/public/events/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
    return unwrapData<EventPublic>(res);
  },

  /* -----------------------------
     FORMS (public)
     Go:
       GET  /api/v1/forms/:slug
       POST /api/v1/forms/:slug/submissions
     ----------------------------- */

  async getPublicForm(slug: string): Promise<PublicFormPayload> {
    const res = await request<any>(`/forms/${encodeURIComponent(slug)}`, {
      method: 'GET',
    });
    return unwrapData<PublicFormPayload>(res);
  },

  async submitPublicForm(
    slug: string,
    body: PublicFormSubmissionRequest
  ): Promise<any> {
    const res = await request<any>(`/forms/${encodeURIComponent(slug)}/submissions`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<any>(res);
  },

  /* -----------------------------
     TESTIMONIALS (public submit + public list approved)
     Go:
       GET  /api/v1/testimonials?approved=true
       POST /api/v1/testimonials
     ----------------------------- */

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

  /* -----------------------------
     SUBSCRIBERS (public)
     Go:
       POST /api/v1/subscribers
     ----------------------------- */

  async subscribe(payload: { name?: string; email: string }) {
    return request<any>('/subscribers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /* -----------------------------
     WORKFORCE (public apply)
     Go:
       POST /api/v1/workforce/apply
     ----------------------------- */

  async applyWorkforce(payload: WorkforceRegistrationData): Promise<any> {
    const res = await request<any>('/workforce/apply', {
      method: 'POST',
      body: JSON.stringify(mapWorkforcePayload(payload)),
    });
    return unwrapData<any>(res);
  },
};

export default apiPublic;
