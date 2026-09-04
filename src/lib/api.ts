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
  GivingOption,
  GivingIntentData,
  PastoralCareRequestData,
  WorkforceRegistrationData,
  ContactMessageData,
  VisitRequestData,
  VisitRequestConfirmation,
  VisitServiceOption,
  PrayerRequestData,
} from './types';
import type {
  LeadershipApplicationRequest,
  LeadershipMember,
  LeadershipRole,
  LeadershipStatus,
} from '@/domain/leadership/types';
import { resolveConfiguredApiOrigin } from './apiOrigin';
import {
  createHttpClient,
  extractArrayData,
  HttpError,
  isHttpError,
  isRecord,
  toQueryString,
  unwrapData,
  type ValidationFieldError,
} from './http';

/* ============================================================================
   API CONFIG
============================================================================ */

const API_ORIGIN = resolveConfiguredApiOrigin();
const API_V1_BASE_URL = `${API_ORIGIN}/api/v1`;

/* ============================================================================
   CACHE & RETRY CONFIG
============================================================================ */

const http = createHttpClient({
  baseUrl: API_V1_BASE_URL,
  maxConcurrentRequests: 2,
});

/* ============================================================================
   Error Utilities
============================================================================ */

export type ApiError = HttpError;
export type { ValidationFieldError };

export function createApiError(
  message: string,
  statusCode?: number,
  details?: unknown,
  validationErrors?: ValidationFieldError[]
): HttpError {
  return new HttpError(message, {
    statusCode: statusCode ?? 0,
    details,
    validationErrors,
  });
}

export const isApiError = isHttpError;

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

async function request<T>(
  path: string,
  options: RequestInit = {},
  config?: { skipCache?: boolean }
): Promise<T> {
  return http.request<T>(path, {
    ...options,
    skipCache: config?.skipCache,
  });
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
    phoneCode,
    title,
    department,
    departmentSection,
    leadershipCategory,
    birthMonth,
    anniversaryMonth,
    isExistingMember,
    currentAssignment,
    birthday,
    registrationType,
    sourceChannel,
    notes,
    occupation,
    married,
    spouse,
    anniversaryDate,
    about,
  } = payload;

  return {
    firstName,
    lastName,
    email,
    phone,
    phoneCode,
    title,
    department,
    departmentSection,
    leadershipCategory,
    birthMonth,
    anniversaryMonth,
    isExistingMember,
    currentAssignment,
    birthday,
    registrationType,
    sourceChannel,
    notes,
    occupation,
    married,
    spouse,
    anniversary: anniversaryDate,
    about,
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

/**
 * Media URLs from the CMS/upload endpoints arrive in three shapes: an absolute
 * URL, a protocol-relative URL, or a path relative to the API host (e.g.
 * `/uploads/leader.jpg`). Resolve the last case against the configured API
 * origin so `next/image` receives something it can actually load.
 */
function resolveMediaUrl(url: string | null | undefined): string | null {
  const value = asNonEmptyString(url);
  if (!value) return null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) return value;
  if (!API_ORIGIN) return value; // browser same-origin
  return `${API_ORIGIN}${value.startsWith('/') ? '' : '/'}${value}`;
}

const LEADERSHIP_ROLES: readonly LeadershipRole[] = [
  'senior_pastor',
  'associate_pastor',
  'deacon',
  'deaconess',
  'reverend',
];

function mapBackendLeader(input: unknown): LeadershipMember | null {
  if (!isRecord(input)) return null;

  const id = asNonEmptyString(input.id) ?? asNonEmptyString(input._id);
  const firstName =
    asNonEmptyString(input.firstName) ?? asNonEmptyString(input.first_name);
  const lastName =
    asNonEmptyString(input.lastName) ?? asNonEmptyString(input.last_name);
  if (!id || (!firstName && !lastName)) return null;

  const rawRole = asNonEmptyString(input.role);
  const role: LeadershipRole = LEADERSHIP_ROLES.includes(
    rawRole as LeadershipRole
  )
    ? (rawRole as LeadershipRole)
    : 'deacon';

  const status =
    (asNonEmptyString(input.status) as LeadershipStatus | undefined) ??
    'approved';

  const imageUrl = resolveMediaUrl(
    (input.imageUrl ??
      input.image_url ??
      input.image ??
      input.imageURL ??
      input.photo ??
      input.photoUrl ??
      input.photo_url ??
      input.avatar ??
      input.avatarUrl) as string | null | undefined
  );

  return {
    id,
    firstName: firstName ?? '',
    lastName: lastName ?? '',
    email: asNonEmptyString(input.email),
    phone: asNonEmptyString(input.phone),
    role,
    status,
    bio: asNonEmptyString(input.bio) ?? null,
    imageUrl,
    birthday: asNonEmptyString(input.birthday),
    anniversary: asNonEmptyString(input.anniversary),
    createdAt:
      asNonEmptyString(input.createdAt) ?? asNonEmptyString(input.created_at),
    updatedAt:
      asNonEmptyString(input.updatedAt) ?? asNonEmptyString(input.updated_at),
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
  const rawConsent = isRecord(pick('consent'))
    ? (pick('consent') as Record<string, unknown>)
    : null;
  const consent = rawConsent
    ? {
        enabled: rawConsent.enabled !== false,
        required: rawConsent.required !== false,
        title: asNonEmptyString(rawConsent.title),
        introduction: asNonEmptyString(rawConsent.introduction),
        purposes: parseStringArray(rawConsent.purposes),
        dataUse: asNonEmptyString(rawConsent.dataUse),
        retention: asNonEmptyString(rawConsent.retention),
        rights: asNonEmptyString(rawConsent.rights),
        contact: asNonEmptyString(rawConsent.contact),
        acknowledgementLabel: asNonEmptyString(rawConsent.acknowledgementLabel),
        version: asNonEmptyString(rawConsent.version),
      }
    : undefined;

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
    submitButtonText: asNonEmptyString(pick('submitButtonText')),
    coverImageUrl:
      asNonEmptyString(pick('coverImageUrl')) ??
      asNonEmptyString(design?.coverImageUrl),
    sections: sections.length ? sections : undefined,
    consent,
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

function normalizeTestimonial(raw: unknown): Testimonial {
  const r = isRecord(raw) ? raw : {};
  const firstName = (r.firstName ?? r.first_name) as string | undefined;
  const lastName = (r.lastName ?? r.last_name) as string | undefined;

  const isAnonymous = r.isAnonymous ?? r.is_anonymous ?? r.anonymous ?? false;
  const isApproved = (r.isApproved ?? r.is_approved ?? r.approved) as
    boolean | undefined;

  const imageUrl =
    ((r.imageUrl ?? r.image_url ?? r.image ?? r.imageURL) as
      string | null | undefined) ?? null;

  const createdAt = (r.createdAt ?? r.created_at) as string | undefined;
  const updatedAt = (r.updatedAt ?? r.updated_at) as string | undefined;

  const fullName =
    ((r.fullName ?? r.full_name) as string | undefined) ??
    (firstName || lastName
      ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
      : undefined);

  return {
    id: r.id as string | number,
    firstName,
    lastName,
    fullName,
    testimony: (r.testimony as string) ?? '',
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
  async listEvents(signal?: AbortSignal): Promise<EventPublic[]> {
    const qs = toQueryString({ page: 1, limit: 100 });
    const res = await request<unknown>(`/events${qs}`, {
      method: 'GET',
      signal,
    });
    return extractArrayData<unknown>(res)
      .map(mapBackendEvent)
      .filter((item): item is EventPublic => item !== null);
  },

  async getEvent(id: string): Promise<EventPublic> {
    const res = await request<unknown>(`/events/${encodeURIComponent(id)}`, {
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

  async listReels(signal?: AbortSignal): Promise<ReelPublic[]> {
    const qs = toQueryString({ page: 1, limit: 30 });
    const res = await request<unknown>(`/reels${qs}`, {
      method: 'GET',
      signal,
    });
    return extractArrayData<unknown>(res)
      .map(mapBackendReel)
      .filter((item): item is ReelPublic => item !== null);
  },

  async getPublicForm(slug: string): Promise<PublicFormPayload> {
    const res = await request<unknown>(
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
  ): Promise<unknown> {
    const values =
      isRecord(body) && isRecord(body.values)
        ? body.values
        : isRecord(body) && isRecord(body.answers)
          ? body.answers
          : {};

    const res = await request<unknown>(
      `/forms/${encodeURIComponent(slug)}/submissions`,
      {
        method: 'POST',
        body: JSON.stringify({ values }),
      }
    );
    return unwrapData<unknown>(res);
  },

  async listApprovedTestimonials(): Promise<Testimonial[]> {
    const res = await request<unknown>(
      `/testimonials?approved=true`,
      {
        method: 'GET',
      },
      { skipCache: true }
    );
    const data = unwrapData<unknown>(res);
    return Array.isArray(data) ? data.map(normalizeTestimonial) : [];
  },

  async submitTestimonial(
    payload: CreateTestimonialRequest
  ): Promise<Testimonial> {
    const res = await request<unknown>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeTestimonial(unwrapData<unknown>(res));
  },

  async subscribe(payload: {
    name?: string;
    email: string;
    phone?: string;
    source?: string;
  }) {
    return request<unknown>('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listGivingOptions(): Promise<GivingOption[]> {
    const res = await request<unknown>('/giving/options', {
      method: 'GET',
    });
    const data = unwrapData<unknown>(res);
    return Array.isArray(data) ? (data as GivingOption[]) : [];
  },

  async getHomepageAd(): Promise<Record<string, unknown> | null> {
    const res = await request<unknown>('/content/homepage-ad', {
      method: 'GET',
    });
    const data = unwrapData<unknown>(res);
    return data && typeof data === 'object'
      ? (data as Record<string, unknown>)
      : null;
  },

  async getConfessionContent(): Promise<Record<string, unknown> | null> {
    const res = await request<unknown>('/content/confession-popup', {
      method: 'GET',
    });
    const data = unwrapData<unknown>(res);
    return data && typeof data === 'object'
      ? (data as Record<string, unknown>)
      : null;
  },

  async getAboutContent(): Promise<Record<string, unknown> | null> {
    const res = await request<unknown>('/content/about', { method: 'GET' });
    const data = unwrapData<unknown>(res);
    return data && typeof data === 'object'
      ? (data as Record<string, unknown>)
      : null;
  },

  async submitPastoralCareRequest(
    payload: PastoralCareRequestData
  ): Promise<unknown> {
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

    const res = await request<unknown>('/pastoral-care/requests', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<unknown>(res);
  },

  async submitPrayerRequest(payload: PrayerRequestData): Promise<unknown> {
    // Backend expects snake_case here (unlike pastoral-care/contact) — see
    // service.SubmitPrayerRequest in the backend.
    const body = {
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email || undefined,
      request: payload.request,
      category: payload.category || undefined,
      is_anonymous: payload.isAnonymous ?? false,
    };

    const res = await request<unknown>('/prayer-requests', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<unknown>(res);
  },

  async submitGivingIntent(payload: GivingIntentData): Promise<unknown> {
    const body = {
      title: payload.title,
      description: payload.description,
      sourceChannel: payload.sourceChannel ?? 'frontend:web:online-giving',
      metadata: payload.metadata ?? {},
    };

    const res = await request<unknown>('/giving/intents', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<unknown>(res);
  },

  async submitContactMessage(payload: ContactMessageData): Promise<unknown> {
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

    const res = await request<unknown>('/contact/messages', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapData<unknown>(res);
  },

  async submitVisitRequest(
    payload: VisitRequestData
  ): Promise<VisitRequestConfirmation> {
    const res = await request<unknown>('/visits', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return unwrapData<VisitRequestConfirmation>(res);
  },

  async listVisitServices(count = 8): Promise<VisitServiceOption[]> {
    const res = await request<unknown>(
      `/visits/services?count=${count}`,
      {
        method: 'GET',
      },
      { skipCache: true }
    );
    return unwrapData<VisitServiceOption[]>(res);
  },

  async applyWorkforceNew(
    payload: WorkforceRegistrationData
  ): Promise<unknown> {
    const res = await request<unknown>('/workforce/apply', {
      method: 'POST',
      body: JSON.stringify(mapWorkforcePayload(payload)),
    });
    return unwrapData<unknown>(res);
  },

  /* -----------------------------
     LEADERSHIP (public apply + public list)
     Go:
       GET  /api/v1/leadership
       POST /api/v1/leadership/apply
     ----------------------------- */

  async listLeadership(role?: LeadershipRole): Promise<LeadershipMember[]> {
    const qs = toQueryString({ role });
    // Leadership approval is editorial publishing: the public directory must
    // reflect an admin decision immediately, not an old process-local cache.
    const res = await request<unknown>(
      `/leadership${qs}`,
      { method: 'GET' },
      { skipCache: true }
    );
    return extractArrayData<unknown>(res)
      .map(mapBackendLeader)
      .filter((leader): leader is LeadershipMember => leader !== null);
  },

  async applyLeadership(
    payload: LeadershipApplicationRequest
  ): Promise<unknown> {
    const res = await request<unknown>('/leadership/apply', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return unwrapData<unknown>(res);
  },

  async uploadLeadershipImage(
    file: File
  ): Promise<{ url: string; key?: string }> {
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await request<unknown>('/leadership/upload-image', {
        method: 'POST',
        body: form,
      });
      return unwrapData<{ url: string; key?: string }>(res);
    } catch (error) {
      if (isApiError(error) && error.statusCode === 404) {
        const fallbackRes = await request<unknown>('/leadership/upload', {
          method: 'POST',
          body: form,
        });
        return unwrapData<{ url: string; key?: string }>(fallbackRes);
      }
      throw error;
    }
  },

  /**
   * Upload a public form attachment (member photo, etc.) to the shared,
   * rate-limited public uploads endpoint and return its hosted URL. The form
   * submission then stores only the URL string — the backend passes plain
   * https URLs through `materializeSubmissionMedia` untouched.
   */
  async uploadPublicImage(
    file: File
  ): Promise<{ url: string; publicUrl?: string; key?: string }> {
    const form = new FormData();
    form.append('file', file);
    form.append('kind', 'image');

    const res = await request<unknown>('/uploads/images', {
      method: 'POST',
      body: form,
    });
    return unwrapData<{ url: string; publicUrl?: string; key?: string }>(res);
  },
};

export default apiClient;
