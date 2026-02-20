'use client';

import type {
  EventPublic,
  ReelPublic,
  PublicFormPayload,
  PublicFormSubmissionRequest,
  Testimonial,
  CreateTestimonialRequest,
} from './apiTypes';

import type { WorkforceRegistrationData } from './types';
import { trackApiRequestStart, trackApiRequestEnd } from './apiActivity';

/* ============================================================================
   API CONFIG
============================================================================ */

const DEFAULT_LOCAL_API_ORIGIN = 'http://localhost:8080';
const DEFAULT_PROD_API_ORIGIN = 'https://api.wisdomchurchhq.org';

function normalizeOrigin(raw?: string | null): string {
  const isProd = process.env.NODE_ENV === 'production';

  if (!raw || !raw.trim()) {
    return isProd ? DEFAULT_PROD_API_ORIGIN : DEFAULT_LOCAL_API_ORIGIN;
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
   Error Utilities
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
  if (validationErrors?.length) err.validationErrors = validationErrors;
  return err;
}

export function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'statusCode' in err;
}

export function mapValidationErrors(err: unknown): Record<string, string> | null {
  if (!isApiError(err) || !Array.isArray(err.validationErrors) || err.validationErrors.length === 0) {
    return null;
  }
  const mapped: Record<string, string> = {};
  err.validationErrors.forEach((entry) => {
    if (!entry.field || mapped[entry.field]) return;
    mapped[entry.field] = entry.message;
  });
  return mapped;
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

    if (field) normalized.push({ field, code, message });
  }

  return normalized.length ? normalized : undefined;
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
============================================================================ */

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
  if (!res || typeof res !== 'object') return res as T;
  if ('data' in res) {
    const d = (res as any).data;
    if (d && typeof d === 'object' && 'data' in d) return d.data as T;
    return d as T;
  }
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

  trackApiRequestStart();
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
    throw createApiError(getErrorMessage(err), 0, err);
  } finally {
    trackApiRequestEnd();
  }
}

/* ============================================================================
   MAPPERS
============================================================================ */

function mapWorkforcePayload(payload: WorkforceRegistrationData) {
  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    birthday,
    notes,
    title,
    leadershipCategory,
    currentAssignment,
    isExistingMember,
  } = payload;

  const notesParts: string[] = [];
  if (notes?.trim()) notesParts.push(notes.trim());
  if (title?.trim()) notesParts.push(`Title: ${title.trim()}`);
  if (leadershipCategory?.trim()) notesParts.push(`Category: ${leadershipCategory.trim()}`);
  if (currentAssignment?.trim()) notesParts.push(`Assignment: ${currentAssignment.trim()}`);
  if (typeof isExistingMember === 'boolean') {
    notesParts.push(`Existing worker: ${isExistingMember ? 'yes' : 'no'}`);
  }

  return {
    firstName,
    lastName,
    email,
    phone,
    department,
    birthday,
    notes: notesParts.length > 0 ? notesParts.join('\n') : undefined,
  };
}

function toQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const cleaned: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    cleaned[key] = String(value);
  });
  const qs = new URLSearchParams(cleaned).toString();
  return qs ? `?${qs}` : '';
}

function extractArrayData<T>(payload: any): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== 'object') return [];

  const topData = (payload as any).data;
  if (Array.isArray(topData)) return topData as T[];
  if (topData && typeof topData === 'object') {
    if (Array.isArray((topData as any).items)) return (topData as any).items as T[];
    if (Array.isArray((topData as any).data)) return (topData as any).data as T[];
  }

  if (Array.isArray((payload as any).items)) return (payload as any).items as T[];
  return [];
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function parseEventDate(date?: string, time?: string): { startAt?: string; endAt?: string } {
  if (!date) return {};

  const baseDate = date.includes('T') ? date : `${date}T00:00:00`;
  const start = new Date(baseDate);
  if (Number.isNaN(start.getTime())) return {};

  if (time) {
    const parsedWithTime = new Date(`${date} ${time}`);
    if (!Number.isNaN(parsedWithTime.getTime())) {
      const end = new Date(parsedWithTime.getTime() + 2 * 60 * 60 * 1000);
      return { startAt: parsedWithTime.toISOString(), endAt: end.toISOString() };
    }
  }

  return { startAt: start.toISOString() };
}

function extractFormSlug(registerLink?: string): string | null {
  if (!registerLink) return null;
  try {
    const url = new URL(registerLink);
    const match = url.pathname.match(/\/forms\/([^/?#]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    const match = registerLink.match(/\/forms\/([^/?#]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}

function mapBackendEvent(input: unknown): EventPublic | null {
  if (!isRecord(input)) return null;

  const id = asNonEmptyString(input.id);
  const title = asNonEmptyString(input.title);
  if (!id || !title) return null;

  const description =
    asNonEmptyString(input.description) ?? asNonEmptyString(input.shortDescription);
  const date = asNonEmptyString(input.date);
  const time = asNonEmptyString(input.time);
  const location = asNonEmptyString(input.location);
  const bannerUrl = asNonEmptyString(input.bannerImage);
  const imageUrl = bannerUrl ?? asNonEmptyString(input.image);
  const registerLink = asNonEmptyString(input.registerLink);
  const { startAt, endAt } = parseEventDate(date, time);

  return {
    id,
    title,
    description,
    date,
    time,
    location,
    imageUrl,
    bannerUrl,
    registerLink: registerLink ?? null,
    formSlug: extractFormSlug(registerLink),
    startAt,
    endAt,
  };
}

function normalizeTestimonial(raw: any): Testimonial {
  const firstName = raw?.firstName ?? raw?.first_name;
  const lastName = raw?.lastName ?? raw?.last_name;

  const isAnonymous = raw?.isAnonymous ?? raw?.is_anonymous ?? raw?.anonymous ?? false;
  const isApproved = raw?.isApproved ?? raw?.is_approved ?? raw?.approved ?? undefined;

  const imageUrl =
    raw?.imageUrl ?? raw?.image_url ?? raw?.image ?? raw?.imageURL ?? null;

  const createdAt = raw?.createdAt ?? raw?.created_at;
  const updatedAt = raw?.updatedAt ?? raw?.updated_at;

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
    imageUrl,
    isAnonymous: Boolean(isAnonymous),
    isApproved,
    createdAt,
    updatedAt,
  };
}

function mapBackendReel(input: unknown): ReelPublic | null {
  if (!isRecord(input)) return null;

  const id = asNonEmptyString(input.id);
  const title = asNonEmptyString(input.title) ?? 'Reel';
  if (!id) return null;

  const thumbnail =
    asNonEmptyString(input.thumbnail) ??
    asNonEmptyString(input.thumbnailUrl) ??
    asNonEmptyString(input.thumbnail_url);
  const videoUrl =
    asNonEmptyString(input.videoUrl) ??
    asNonEmptyString(input.video_url) ??
    asNonEmptyString(input.url);
  if (!videoUrl) return null;

  return {
    id,
    title,
    thumbnail: thumbnail ?? '',
    videoUrl,
    duration:
      asNonEmptyString(input.duration) ??
      asNonEmptyString(input.length) ??
      asNonEmptyString(input.videoDuration),
    eventId:
      asNonEmptyString(input.eventId) ??
      asNonEmptyString(input.event_id),
    createdAt:
      asNonEmptyString(input.createdAt) ??
      asNonEmptyString(input.created_at),
    updatedAt:
      asNonEmptyString(input.updatedAt) ??
      asNonEmptyString(input.updated_at),
  };
}

/* ============================================================================
   PUBLIC API CLIENT
============================================================================ */

export const apiClient = {
  async listEvents(): Promise<EventPublic[]> {
    const qs = toQueryString({ page: 1, limit: 100 });
    const res = await request<any>(`/events${qs}`, { method: 'GET' });
    return extractArrayData<unknown>(res)
      .map(mapBackendEvent)
      .filter((item): item is EventPublic => item !== null);
  },

  async getEvent(id: string): Promise<EventPublic> {
    const res = await request<any>(`/events/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
    const item = mapBackendEvent(unwrapData<unknown>(res));
    if (!item) {
      throw createApiError('Invalid event payload', 400, res);
    }
    return item;
  },

  /* -----------------------------
     REELS (public read)
     Go:
       GET /api/v1/reels
     ----------------------------- */

  async listReels(): Promise<ReelPublic[]> {
    const qs = toQueryString({ page: 1, limit: 30 });
    const res = await request<any>(`/reels${qs}`, { method: 'GET' });
    return extractArrayData<unknown>(res)
      .map(mapBackendReel)
      .filter((item): item is ReelPublic => item !== null);
  },

  async getPublicForm(slug: string): Promise<PublicFormPayload> {
    const res = await request<any>(`/forms/${encodeURIComponent(slug)}`, {
      method: 'GET',
    });
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

  async subscribe(payload: { name?: string; email: string }) {
    return request<any>('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async applyWorkforce(payload: WorkforceRegistrationData): Promise<any> {
    const res = await request<any>('/workforce/apply', {
      method: 'POST',
      body: JSON.stringify(mapWorkforcePayload(payload)),
    });
    return unwrapData<any>(res);
  },

  async applyWorkforceServing(payload: WorkforceRegistrationData): Promise<any> {
    const body = {
      ...mapWorkforcePayload(payload),
      status: 'serving',
    };
    const res = await request<any>('/workforce/serving/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<any>(res);
  },

  async applyWorkforceNew(payload: WorkforceRegistrationData): Promise<any> {
    const res = await request<any>('/workforce/apply', {
      method: 'POST',
      body: JSON.stringify(mapWorkforcePayload(payload)),
    });
    return unwrapData<any>(res);
  },

  /* -----------------------------
     LEADERSHIP (public apply + public list)
     Go:
       GET  /api/v1/leadership
       POST /api/v1/leadership/apply
     ----------------------------- */

  async listLeadership(role?: LeadershipRole): Promise<LeadershipMember[]> {
    const qs = toQueryString({ role });
    const res = await request<any>(`/leadership${qs}`, { method: 'GET' });
    return unwrapData<LeadershipMember[]>(res);
  },

  async applyLeadership(payload: LeadershipApplicationRequest): Promise<any> {
    const res = await request<any>('/leadership/apply', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return unwrapData<any>(res);
  },

  async uploadLeadershipImage(file: File): Promise<{ url: string; key?: string }> {
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await request<any>('/leadership/upload-image', {
        method: 'POST',
        body: form,
      });
      return unwrapData<{ url: string; key?: string }>(res);
    } catch (error) {
      if (isApiError(error) && error.statusCode === 404) {
        const fallbackRes = await request<any>('/leadership/upload', {
          method: 'POST',
          body: form,
        });
        return unwrapData<{ url: string; key?: string }>(fallbackRes);
      }
      throw error;
    }
  },
};

export default apiClient;
