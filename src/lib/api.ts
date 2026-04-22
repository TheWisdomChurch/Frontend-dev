'use client';

import type {
  EventPublic,
  PublicFormContentSection,
  PublicFormContentSectionItem,
  PublicFormFieldConditionRule,
  PublicFormFieldConditional,
  PublicFormField,
  ReelPublic,
  PublicFormPayload,
  PublicFormSettings,
  PublicFormSubmissionRequest,
  Testimonial,
  CreateTestimonialRequest,
} from './apiTypes';

import type {
  LeadershipApplicationRequest,
  GivingOption,
  GivingIntentData,
  LeadershipMember,
  PastoralCareRequestData,
  LeadershipRole,
  WorkforceRegistrationData,
  ContactMessageData,
} from './types';
import { trackApiRequestStart, trackApiRequestEnd } from './apiActivity';
import { resolveConfiguredApiOrigin } from './apiOrigin';

/* ============================================================================
   API CONFIG
============================================================================ */

// const API_ORIGIN = resolveConfiguredApiOrigin();
// const API_V1_BASE_URL = `${API_ORIGIN}/api/v1`;

const API_ORIGIN = resolveConfiguredApiOrigin();
const API_V1_BASE_URL = `${API_ORIGIN}/api/v1`;

/* ============================================================================
   CACHE & RETRY CONFIG
============================================================================ */

const REQUEST_CACHE = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // Start with 1s, exponential backoff

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

export function mapValidationErrors(
  err: unknown
): Record<string, string> | null {
  const mapped: Record<string, string> = {};

  if (isApiError(err) && Array.isArray(err.validationErrors)) {
    for (const item of err.validationErrors) {
      if (item?.field && item?.message) {
        mapped[item.field] = item.message;
      }
    }
  }

  const details = isApiError(err) ? err.details : undefined;
  if (isRecord(details)) {
    const rawErrors = details.errors;
    if (Array.isArray(rawErrors)) {
      for (const raw of rawErrors) {
        if (!isRecord(raw)) continue;
        const field = typeof raw.field === 'string' ? raw.field : '';
        const message = typeof raw.message === 'string' ? raw.message : '';
        if (field && message && !mapped[field]) {
          mapped[field] = message;
        }
      }
    }
  }

  return Object.keys(mapped).length ? mapped : null;
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
function extractValidationErrors(
  payload: unknown
): ValidationFieldError[] | undefined {
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
      typeof item.code === 'string' && item.code.trim()
        ? item.code.trim()
        : undefined;

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

function toQueryString(params: Record<string, unknown>): string {
  const qp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    qp.set(key, String(value));
  });

  const query = qp.toString();
  return query ? `?${query}` : '';
}

function extractArrayData<T>(res: any): T[] {
  const data = unwrapData<any>(res);

  if (Array.isArray(data)) {
    return data as T[];
  }

  if (isRecord(data)) {
    const candidates = [data.items, data.results, data.rows];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate as T[];
      }
    }
  }

  return [];
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  config?: { skipCache?: boolean }
): Promise<T> {
  const url = `${API_V1_BASE_URL}${path}`;
  const cacheKey = `${options.method || 'GET'}:${path}`;
  const method = (options.method || 'GET').toUpperCase();
  const isIdempotent = method === 'GET' || method === 'HEAD';

  const skipCache = Boolean(config?.skipCache);

  // Check cache for cacheable GET requests
  if (
    !skipCache &&
    method !== 'POST' &&
    method !== 'PUT' &&
    method !== 'PATCH' &&
    method !== 'DELETE'
  ) {
    const cached = REQUEST_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T;
    }
  }

  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  let lastError: any = null;

  // Retry logic with exponential backoff
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    trackApiRequestStart();
    try {
      const res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
        cache: 'no-store',
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      const json = await safeParseJson(res);
      const payload =
        json ??
        ({ message: await res.text().catch(() => '') } as Record<string, any>);

      if (!res.ok) {
        // Don't retry on client errors (4xx)
        if (res.status >= 400 && res.status < 500) {
          const validationErrors = extractValidationErrors(payload);
          throw createApiError(
            getMessageFromPayload(payload) || 'Request failed',
            res.status,
            payload,
            validationErrors
          );
        }

        // Retry on server errors (5xx)
        if (res.status >= 500 && isIdempotent && attempt < MAX_RETRIES - 1) {
          lastError = createApiError(
            getMessageFromPayload(payload) || 'Server error',
            res.status,
            payload
          );
          continue;
        }

        throw createApiError(
          getMessageFromPayload(payload) || 'Request failed',
          res.status,
          payload
        );
      }

      // Cache successful cacheable GET requests
      if (
        !skipCache &&
        method !== 'POST' &&
        method !== 'PUT' &&
        method !== 'PATCH' &&
        method !== 'DELETE'
      ) {
        REQUEST_CACHE.set(cacheKey, { data: payload, timestamp: Date.now() });
      }

      return payload as T;
    } catch (err: any) {
      lastError = err;

      // Don't retry on API errors (already processed)
      if (isApiError(err) && err.statusCode && err.statusCode < 500) {
        throw err;
      }

      // Retry on network errors or timeouts only for idempotent requests.
      if (!isIdempotent || attempt === MAX_RETRIES - 1) {
        if (isApiError(err)) throw err;
        throw createApiError(getErrorMessage(err), 0, err);
      }
    } finally {
      trackApiRequestEnd();
    }
  }

  // If all retries failed, throw the last error
  if (lastError) {
    if (isApiError(lastError)) throw lastError;
    throw createApiError(getErrorMessage(lastError), 0, lastError);
  }

  throw createApiError('Request failed after retries', 0, null);
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
    title,
    department,
    departmentSection,
    leadershipCategory,
    birthMonth,
    anniversaryMonth,
    isExistingMember,
    currentAssignment,
    birthday,
    sourceChannel,
    notes,
  } = payload;

  return {
    firstName,
    lastName,
    email,
    phone,
    title,
    department,
    departmentSection,
    leadershipCategory,
    birthMonth,
    anniversaryMonth,
    isExistingMember,
    currentAssignment,
    birthday,
    sourceChannel,
    notes,
  };
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function parseEventDate(
  date?: string,
  time?: string
): { startAt?: string; endAt?: string } {
  if (!date) return {};

  const baseDate = date.includes('T') ? date : `${date}T00:00:00`;
  const start = new Date(baseDate);
  if (Number.isNaN(start.getTime())) return {};

  if (time) {
    const parsedWithTime = new Date(`${date} ${time}`);
    if (!Number.isNaN(parsedWithTime.getTime())) {
      const end = new Date(parsedWithTime.getTime() + 2 * 60 * 60 * 1000);
      return {
        startAt: parsedWithTime.toISOString(),
        endAt: end.toISOString(),
      };
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
    asNonEmptyString(input.description) ??
    asNonEmptyString(input.shortDescription);
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

function mapBackendReel(input: unknown): ReelPublic | null {
  if (!isRecord(input)) return null;

  const id = asNonEmptyString(input.id);
  const title = asNonEmptyString(input.title);
  if (!id || !title) return null;

  return {
    id,
    title,
    description: asNonEmptyString(input.description),
    thumbnailUrl:
      asNonEmptyString(input.thumbnailUrl) ??
      asNonEmptyString(input.thumbnail) ??
      asNonEmptyString(input.imageUrl),
    videoUrl:
      asNonEmptyString(input.videoUrl) ??
      asNonEmptyString(input.video_url) ??
      asNonEmptyString(input.url),
    publishedAt:
      asNonEmptyString(input.publishedAt) ??
      asNonEmptyString(input.createdAt) ??
      asNonEmptyString(input.created_at),
  };
}

function parseJsonValue<T>(value: unknown, fallback: T): T {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (value === undefined || value === null) return fallback;
  return value as T;
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizePublicFormSectionItem(
  input: unknown
): PublicFormContentSectionItem | null {
  if (!isRecord(input)) return null;
  const title = asNonEmptyString(input.title);
  if (!title) return null;

  return {
    title,
    body: asNonEmptyString(input.body),
    eyebrow: asNonEmptyString(input.eyebrow),
    icon: asNonEmptyString(input.icon),
    linkText: asNonEmptyString(input.linkText),
    linkUrl: asNonEmptyString(input.linkUrl),
  };
}

function normalizePublicFormSection(
  input: unknown
): PublicFormContentSection | null {
  if (!isRecord(input)) return null;
  const title = asNonEmptyString(input.title);
  if (!title) return null;

  const itemsRaw = Array.isArray(input.items) ? input.items : [];
  const items = itemsRaw
    .map(normalizePublicFormSectionItem)
    .filter((item): item is PublicFormContentSectionItem => item !== null);

  return {
    id: asNonEmptyString(input.id),
    title,
    subtitle: asNonEmptyString(input.subtitle),
    layout: asNonEmptyString(input.layout),
    items,
  };
}

function normalizePublicFormSettings(
  input: unknown
): PublicFormSettings | null {
  if (!isRecord(input)) return null;
  const design = isRecord(input.design) ? input.design : null;
  const pick = (key: string): unknown =>
    input[key] !== undefined ? input[key] : design?.[key];

  const introBullets = parseStringArray(pick('introBullets'));
  const introBulletSubtexts = parseStringArray(pick('introBulletSubtexts'));
  const rawSections = Array.isArray(pick('sections'))
    ? (pick('sections') as unknown[])
    : [];
  const sections = rawSections
    .map(normalizePublicFormSection)
    .filter((section): section is PublicFormContentSection => section !== null);

  const settings: PublicFormSettings = {
    formType: asNonEmptyString(pick('formType')),
    introTitle: asNonEmptyString(pick('introTitle')),
    introSubtitle: asNonEmptyString(pick('introSubtitle')),
    introBullets: introBullets.length ? introBullets : undefined,
    introBulletSubtexts: introBulletSubtexts.length
      ? introBulletSubtexts
      : undefined,
    formHeaderNote: asNonEmptyString(pick('formHeaderNote')),
    successMessage: asNonEmptyString(pick('successMessage')),
    successModalTitle: asNonEmptyString(pick('successModalTitle')),
    successModalSubtitle: asNonEmptyString(pick('successModalSubtitle')),
    successModalMessage: asNonEmptyString(pick('successModalMessage')),
    layoutMode: asNonEmptyString(pick('layoutMode')),
    dateFormat: asNonEmptyString(pick('dateFormat')),
    sections: sections.length ? sections : undefined,
  };

  const hasAnyValue = Object.values(settings).some(value =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
  return hasAnyValue ? settings : null;
}

function normalizePublicFormField(
  input: unknown,
  index: number
): PublicFormField | null {
  if (!isRecord(input)) return null;

  const key = asNonEmptyString(input.key) ?? `field_${index + 1}`;
  const label = asNonEmptyString(input.label) ?? key;
  const rawType = (asNonEmptyString(input.type) ?? 'text').toLowerCase();
  const allowedTypes = new Set([
    'text',
    'email',
    'tel',
    'number',
    'textarea',
    'select',
    'radio',
    'checkbox',
    'date',
    'image',
  ]);
  const type = (
    allowedTypes.has(rawType) ? rawType : 'text'
  ) as PublicFormField['type'];
  const required = Boolean(input.required);
  const order = typeof input.order === 'number' ? input.order : index;
  const placeholder = asNonEmptyString(input.placeholder);

  const rawOptions = parseJsonValue<unknown>(input.options, []);
  const rawValidation = parseJsonValue<Record<string, unknown> | null>(
    input.validation,
    null
  );
  const rawConditional =
    parseJsonValue<Record<string, unknown> | null>(input.conditional, null) ??
    parseJsonValue<Record<string, unknown> | null>(input.conditions, null) ??
    parseJsonValue<Record<string, unknown> | null>(input.visibility, null) ??
    null;

  const normalizeRule = (
    rawRule: unknown
  ): PublicFormFieldConditionRule | null => {
    if (!isRecord(rawRule)) return null;

    const fieldKey =
      asNonEmptyString(rawRule.fieldKey) ??
      asNonEmptyString(rawRule.field) ??
      asNonEmptyString(rawRule.dependsOn) ??
      asNonEmptyString(rawRule.sourceField);
    if (!fieldKey) return null;

    const operator =
      asNonEmptyString(rawRule.operator) ??
      asNonEmptyString(rawRule.comparison) ??
      'equals';
    const value =
      typeof rawRule.value === 'string' ||
      typeof rawRule.value === 'number' ||
      typeof rawRule.value === 'boolean' ||
      rawRule.value === null
        ? rawRule.value
        : undefined;
    const values = Array.isArray(rawRule.values)
      ? rawRule.values.filter(
          item =>
            typeof item === 'string' ||
            typeof item === 'number' ||
            typeof item === 'boolean'
        )
      : undefined;

    return {
      fieldKey,
      operator,
      value,
      values: values?.length ? values : undefined,
    };
  };

  const normalizeConditional = (): PublicFormFieldConditional | undefined => {
    const rulesFromList = Array.isArray(input['conditionRules'])
      ? input['conditionRules']
      : [];
    const rawRules = rawConditional
      ? Array.isArray(rawConditional.rules)
        ? rawConditional.rules
        : []
      : [];
    const directRule =
      rawConditional && !Array.isArray(rawConditional.rules)
        ? normalizeRule(rawConditional)
        : null;

    const rules = [...rawRules, ...rulesFromList]
      .map(normalizeRule)
      .filter((rule): rule is PublicFormFieldConditionRule => rule !== null);

    if (directRule) {
      rules.unshift(directRule);
    }

    if (rules.length === 0) return undefined;

    const rawMode =
      asNonEmptyString(rawConditional?.mode) ??
      asNonEmptyString(rawConditional?.action) ??
      'show';
    const rawMatch =
      asNonEmptyString(rawConditional?.match) ??
      asNonEmptyString(rawConditional?.logic) ??
      'all';

    return {
      mode: rawMode === 'hide' ? 'hide' : 'show',
      match: rawMatch === 'any' ? 'any' : 'all',
      rules,
    };
  };

  const conditional = normalizeConditional();
  const validation = rawValidation
    ? {
        minLength:
          typeof rawValidation.minLength === 'number'
            ? rawValidation.minLength
            : undefined,
        maxLength:
          typeof rawValidation.maxLength === 'number'
            ? rawValidation.maxLength
            : undefined,
        maxWords:
          typeof rawValidation.maxWords === 'number'
            ? rawValidation.maxWords
            : undefined,
        pattern: asNonEmptyString(rawValidation.pattern),
        min:
          typeof rawValidation.min === 'number' ? rawValidation.min : undefined,
        max:
          typeof rawValidation.max === 'number' ? rawValidation.max : undefined,
      }
    : undefined;
  const options = Array.isArray(rawOptions)
    ? rawOptions
        .map(item => {
          if (!isRecord(item)) return null;
          const value = asNonEmptyString(item.value);
          const optionLabel = asNonEmptyString(item.label);
          if (!value || !optionLabel) return null;
          return { label: optionLabel, value };
        })
        .filter(
          (item): item is { label: string; value: string } => item !== null
        )
    : undefined;

  return {
    key,
    label,
    type,
    required,
    order,
    validation,
    placeholder,
    options,
    conditional,
  };
}

function normalizePublicFormPayload(input: unknown): PublicFormPayload {
  if (!isRecord(input)) {
    throw createApiError('Invalid public form payload', 500, input);
  }

  const rawForm = isRecord(input.form) ? input.form : input;
  const id = asNonEmptyString(rawForm.id);
  const slug = asNonEmptyString(rawForm.slug);
  const title = asNonEmptyString(rawForm.title);

  if (!id || !slug || !title) {
    throw createApiError('Invalid public form payload', 500, input);
  }

  const rawSettings = parseJsonValue<Record<string, unknown> | null>(
    rawForm.settings,
    null
  );
  const settings = normalizePublicFormSettings(rawSettings);

  const capacityFromSettings =
    rawSettings && typeof rawSettings.capacity === 'number'
      ? rawSettings.capacity
      : null;
  const closesAtFromSettings =
    rawSettings && typeof rawSettings.closesAt === 'string'
      ? rawSettings.closesAt
      : null;

  const rawFields = Array.isArray(rawForm.fields) ? rawForm.fields : [];
  const fields = rawFields
    .map((field, index) => normalizePublicFormField(field, index))
    .filter((field): field is PublicFormField => field !== null)
    .sort((a, b) => a.order - b.order);

  const payload: PublicFormPayload = {
    id,
    slug,
    title,
    description: asNonEmptyString(rawForm.description),
    capacity:
      typeof rawForm.capacity === 'number'
        ? rawForm.capacity
        : capacityFromSettings,
    closesAt:
      asNonEmptyString(rawForm.closesAt) ?? closesAtFromSettings ?? null,
    fields,
    event: mapBackendEvent(input.event),
    settings,
  };

  return payload;
}

function normalizeTestimonial(raw: any): Testimonial {
  const firstName = raw?.firstName ?? raw?.first_name;
  const lastName = raw?.lastName ?? raw?.last_name;

  const isAnonymous =
    raw?.isAnonymous ?? raw?.is_anonymous ?? raw?.anonymous ?? false;
  const isApproved =
    raw?.isApproved ?? raw?.is_approved ?? raw?.approved ?? undefined;

  const imageUrl =
    raw?.imageUrl ?? raw?.image_url ?? raw?.image ?? raw?.imageURL ?? null;

  const createdAt = raw?.createdAt ?? raw?.created_at;
  const updatedAt = raw?.updatedAt ?? raw?.updated_at;

  const fullName =
    raw?.fullName ??
    raw?.full_name ??
    (firstName || lastName
      ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
      : undefined);

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
    const res = await request<any>(
      `/forms/${encodeURIComponent(slug)}`,
      {
        method: 'GET',
      },
      { skipCache: true }
    );
    return normalizePublicFormPayload(unwrapData<unknown>(res));
  },

  async submitPublicForm(
    slug: string,
    body: PublicFormSubmissionRequest
  ): Promise<any> {
    const values =
      isRecord(body) && isRecord(body.values)
        ? body.values
        : isRecord(body) && isRecord(body.answers)
          ? body.answers
          : {};

    const res = await request<any>(
      `/forms/${encodeURIComponent(slug)}/submissions`,
      {
        method: 'POST',
        body: JSON.stringify({ values }),
      }
    );
    return unwrapData<any>(res);
  },

  async listApprovedTestimonials(): Promise<Testimonial[]> {
    const res = await request<any>(
      `/testimonials?approved=true`,
      {
        method: 'GET',
      },
      { skipCache: true }
    );
    const data = unwrapData<any>(res);
    return Array.isArray(data) ? data.map(normalizeTestimonial) : [];
  },

  async submitTestimonial(
    payload: CreateTestimonialRequest
  ): Promise<Testimonial> {
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

  async listGivingOptions(): Promise<GivingOption[]> {
    const res = await request<any>('/giving/options', {
      method: 'GET',
    });
    const data = unwrapData<any>(res);
    return Array.isArray(data) ? (data as GivingOption[]) : [];
  },

  async getHomepageAd(): Promise<Record<string, unknown> | null> {
    const res = await request<any>('/content/homepage-ad', { method: 'GET' });
    const data = unwrapData<any>(res);
    return data && typeof data === 'object'
      ? (data as Record<string, unknown>)
      : null;
  },

  async getConfessionContent(): Promise<Record<string, unknown> | null> {
    const res = await request<any>('/content/confession-popup', {
      method: 'GET',
    });
    const data = unwrapData<any>(res);
    return data && typeof data === 'object'
      ? (data as Record<string, unknown>)
      : null;
  },

  async applyWorkforce(payload: WorkforceRegistrationData): Promise<any> {
    const res = await request<any>('/workforce/apply', {
      method: 'POST',
      body: JSON.stringify(mapWorkforcePayload(payload)),
    });
    return unwrapData<any>(res);
  },

  async applyWorkforceServing(
    payload: WorkforceRegistrationData
  ): Promise<any> {
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

  async submitPastoralCareRequest(
    payload: PastoralCareRequestData
  ): Promise<any> {
    const body = {
      title: payload.title,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.contactNumber,
      email: payload.email,
      address: payload.contactAddress,
      eventDate: payload.eventDate,
      eventType: payload.eventType,
      churchRole: payload.churchRole,
      customRole: payload.customRole,
      comments: payload.comments,
      sourceChannel: payload.sourceChannel ?? 'frontend:web:pastoral',
    };

    const res = await request<any>('/pastoral-care/requests', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<any>(res);
  },

  async submitGivingIntent(payload: GivingIntentData): Promise<any> {
    const body = {
      title: payload.title,
      description: payload.description,
      sourceChannel: payload.sourceChannel ?? 'frontend:web:online-giving',
      metadata: payload.metadata ?? {},
    };

    const res = await request<any>('/giving/intents', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<any>(res);
  },

  async submitContactMessage(payload: ContactMessageData): Promise<any> {
    const body = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      topic: payload.topic,
      message: payload.message,
      sourceChannel: payload.sourceChannel ?? 'frontend:web:contact',
      metadata: payload.metadata ?? {},
    };

    const res = await request<any>('/contact/messages', {
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

  async uploadLeadershipImage(
    file: File
  ): Promise<{ url: string; key?: string }> {
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
