'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Container, Section } from '@/shared/layout';
import { EventBannerDesktop, EventBannerMobile } from '@/shared/assets';
import apiClient from '@/lib/api';
import type { EventPublic, PublicFormField, PublicFormPayload } from '@/lib';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const e164Re = /^\+[1-9]\d{7,14}$/;

const COUNTRY_PHONE_CODES = [
  { iso: 'NG', name: 'Nigeria', dial: '+234' },
  { iso: 'GH', name: 'Ghana', dial: '+233' },
  { iso: 'KE', name: 'Kenya', dial: '+254' },
  { iso: 'ZA', name: 'South Africa', dial: '+27' },
  { iso: 'US', name: 'United States', dial: '+1' },
  { iso: 'CA', name: 'Canada', dial: '+1' },
  { iso: 'GB', name: 'United Kingdom', dial: '+44' },
] as const;

const MONTH_OPTIONS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const;

const fieldShellClass =
  'rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5';

const fieldBaseClass =
  'min-h-12 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-[0.95rem] text-white outline-none transition placeholder:text-white/35 focus:border-[#f7de12]/70 focus:bg-black/45 focus:ring-4 focus:ring-[#f7de12]/10';

const fieldSelectClass =
  'min-h-12 w-full rounded-2xl border border-white/10 bg-[#080808] px-4 py-3 text-[0.95rem] text-white outline-none transition focus:border-[#f7de12]/70 focus:ring-4 focus:ring-[#f7de12]/10';

const labelClass =
  'block text-[0.73rem] font-bold uppercase tracking-[0.16em] text-white/60';

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function splitE164(value: string): { dial: string; national: string } | null {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed.startsWith('+')) return null;

  const dial = COUNTRY_PHONE_CODES.map(country => country.dial)
    .sort((a, b) => b.length - a.length)
    .find(candidate => trimmed.startsWith(candidate));

  if (!dial) return null;

  return {
    dial,
    national: trimmed.slice(dial.length).replace(/\D/g, ''),
  };
}

function isPhoneLikeField(field: PublicFormField): boolean {
  const fieldType = String(field.type || '').toLowerCase();

  if (['tel', 'phone', 'mobile'].includes(fieldType)) {
    return true;
  }

  const haystack = `${field.key} ${field.label}`.toLowerCase();

  return /(phone|mobile|tel|telephone|contact[-_\s]?number)/.test(haystack);
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function daysInMonth(month: number): number {
  if (month === 2) return 29;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

function parseDDMM(value: string): { day: string; month: string } | null {
  if (!value || typeof value !== 'string') return null;

  const match = /^(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(month)) return null;

  return { day: match[1], month: match[2] };
}

function parseDDMMPartial(
  value: string
): { day: string; month: string } | null {
  if (!value || typeof value !== 'string') return null;

  const match = /^(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  return { day: match[1], month: match[2] };
}

function toDDMM(day: string, month: string): string {
  if (!day && !month) return '';
  if (!day) return `00-${month}`;
  if (!month) return `${day}-00`;
  return `${day}-${month}`;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

function applyTemplateVars(
  input: string | undefined,
  formTitle: string
): string {
  if (!input) return '';

  return input.replace(/\{\{\s*formTitle\s*\}\}/gi, formTitle);
}

function normalizeValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(normalizeValue).filter(Boolean).join('|');
  }

  if (value === null || value === undefined) return '';

  return String(value).trim().toLowerCase();
}

function asNormalizedList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(normalizeValue).filter(Boolean);
  }

  const normalized = normalizeValue(value);
  return normalized ? [normalized] : [];
}

function evaluateFieldRule(
  currentValue: unknown,
  operator: string,
  expectedValue?: unknown,
  expectedValues?: unknown[]
): boolean {
  const left = normalizeValue(currentValue);
  const leftList = asNormalizedList(currentValue);
  const right = normalizeValue(expectedValue);
  const rightList = asNormalizedList(expectedValues);
  const op = operator.toLowerCase();

  if (op === 'is_empty') return !left;
  if (op === 'not_empty') return Boolean(left);

  if (op === 'contains' || op === 'includes') {
    if (leftList.length > 1) return leftList.includes(right);
    return left.includes(right);
  }

  if (op === 'not_contains' || op === 'not_includes') {
    if (leftList.length > 1) return !leftList.includes(right);
    return !left.includes(right);
  }

  if (op === 'in') {
    return leftList.some(item => rightList.includes(item));
  }

  if (op === 'not_in') {
    return leftList.every(item => !rightList.includes(item));
  }

  if (op === 'greater_than') return Number(left) > Number(right);
  if (op === 'less_than') return Number(left) < Number(right);

  if (op === 'not_equals' || op === 'not_equal') {
    return !leftList.includes(right);
  }

  if (op === 'equals' && leftList.length > 1) {
    return leftList.includes(right);
  }

  return left === right;
}

function isFieldVisible(
  field: PublicFormField,
  answers: Record<string, unknown>
): boolean {
  const conditional = field.conditional;

  if (
    !conditional ||
    !Array.isArray(conditional.rules) ||
    conditional.rules.length === 0
  ) {
    return true;
  }

  const matchMode =
    String(conditional.match || 'all').toLowerCase() === 'any' ? 'any' : 'all';

  const mode =
    String(conditional.mode || 'show').toLowerCase() === 'hide'
      ? 'hide'
      : 'show';

  const didMatch =
    matchMode === 'any'
      ? conditional.rules.some(rule =>
          evaluateFieldRule(
            answers[rule.fieldKey],
            rule.operator || 'equals',
            rule.value,
            rule.values
          )
        )
      : conditional.rules.every(rule =>
          evaluateFieldRule(
            answers[rule.fieldKey],
            rule.operator || 'equals',
            rule.value,
            rule.values
          )
        );

  return mode === 'hide' ? !didMatch : didMatch;
}

function getFieldInputType(field: PublicFormField): string {
  const type = String(field.type || '').toLowerCase();

  if (type === 'email') return 'email';
  if (type === 'number') return 'number';
  if (type === 'url') return 'url';

  return 'text';
}

export default function PublicFormPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const formSlug = useMemo(() => {
    if (!pathname) return undefined;

    const segments = pathname.split('/').filter(Boolean);
    const formsIndex = segments.findIndex(segment => segment === 'forms');
    const nextSegment = segments[formsIndex + 1];

    return nextSegment ? decodeURIComponent(nextSegment) : undefined;
  }, [pathname]);

  const [form, setForm] = useState<PublicFormPayload | null>(null);
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isStructuredPublicForm = useMemo(() => {
    const slug = (formSlug || '').toLowerCase();
    const formType = String(form?.settings?.formType || '').toLowerCase();

    return (
      slug.includes('testimony') ||
      slug.includes('testimonial') ||
      slug.includes('leadership') ||
      slug.includes('member') ||
      slug.includes('membership') ||
      ['testimonial', 'leadership', 'member'].includes(formType)
    );
  }, [formSlug, form?.settings?.formType]);

  const isTestimonialForm = useMemo(() => {
    const slug = (formSlug || '').toLowerCase();
    const formType = String(form?.settings?.formType || '').toLowerCase();

    return (
      slug.includes('testimony') ||
      slug.includes('testimonial') ||
      formType === 'testimonial'
    );
  }, [formSlug, form?.settings?.formType]);

  const returnPath = useMemo(() => {
    const raw = (searchParams.get('return_to') || '/').trim();

    if (!raw || !raw.startsWith('/')) return '/';

    return raw;
  }, [searchParams]);

  const returnDelayMs = useMemo(() => {
    const raw = searchParams.get('return_delay_ms');
    const parsed = raw ? Number(raw) : 0;

    if (!Number.isFinite(parsed) || parsed < 0) return 0;

    return Math.min(parsed, 15000);
  }, [searchParams]);

  const returnLabel = useMemo(() => {
    return (searchParams.get('return_label') || '').trim() || 'Return home';
  }, [searchParams]);

  useEffect(() => {
    if (!submitted || returnDelayMs <= 0) return undefined;

    const timer = window.setTimeout(() => {
      router.push(returnPath);
    }, returnDelayMs);

    return () => window.clearTimeout(timer);
  }, [submitted, returnDelayMs, returnPath, router]);

  useEffect(() => {
    if (!formSlug) {
      setLoading(false);
      setError('Invalid form link.');
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const formData = await apiClient.getPublicForm(formSlug);

        if (!mounted) return;

        setForm(formData);

        let resolvedEvent = formData.event ?? null;

        if (!resolvedEvent) {
          const eventsData = await apiClient
            .listEvents()
            .catch(() => [] as EventPublic[]);

          resolvedEvent = Array.isArray(eventsData)
            ? eventsData.find(item => item.formSlug === formSlug) || null
            : null;
        }

        setEvent(resolvedEvent);

        const defaults: Record<string, unknown> = {};

        (formData.fields || []).forEach((field: PublicFormField) => {
          defaults[field.key] =
            field.type === 'checkbox'
              ? field.options?.length
                ? []
                : false
              : '';
        });

        setAnswers(current => ({ ...defaults, ...current }));
        setFieldErrors({});
      } catch (err: any) {
        if (!mounted) return;

        if (err?.statusCode === 404) {
          setError(
            'This form link is invalid, unpublished, or no longer available. Please contact support for the active link.'
          );
        } else if (err?.statusCode === 410) {
          setError('This form is closed and no longer accepting responses.');
        } else {
          setError(err?.message || 'Unable to load form. Please try again.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [formSlug]);

  const presentation = useMemo(() => {
    const settings = form?.settings;
    const formTitle = form?.title || 'Form';

    const title = isTestimonialForm
      ? form?.title || 'Share Your Testimony'
      : settings?.introTitle || event?.title || form?.title || 'Registration';

    const subtitle = isTestimonialForm
      ? form?.description || 'Tell us what God has done in your life.'
      : settings?.introSubtitle ||
        event?.description ||
        form?.description ||
        'Complete the form below to continue.';

    return {
      title,
      subtitle,
      detailItems: settings?.introBullets || [],
      detailSubtexts: settings?.introBulletSubtexts || [],
      headerNote: settings?.formHeaderNote || '',
      sections: settings?.sections || [],
      successTitle:
        applyTemplateVars(settings?.successModalTitle, formTitle) ||
        'Submission received',
      successSubtitle: applyTemplateVars(
        settings?.successModalSubtitle,
        formTitle
      ),
      successMessage:
        applyTemplateVars(settings?.successModalMessage, formTitle) ||
        applyTemplateVars(settings?.successMessage, formTitle) ||
        'Your response has been received successfully.',
    };
  }, [event, form, isTestimonialForm]);

  const showHeroCopy = isStructuredPublicForm;

  const sortedFields = useMemo(() => {
    return (form?.fields || []).slice().sort((a, b) => a.order - b.order);
  }, [form?.fields]);

  const visibleFields = useMemo(() => {
    return sortedFields.filter(field => isFieldVisible(field, answers));
  }, [answers, sortedFields]);

  useEffect(() => {
    const visibleKeys = new Set(visibleFields.map(field => field.key));

    setFieldErrors(current => {
      const next: Record<string, string> = {};
      let changed = false;

      Object.entries(current).forEach(([key, message]) => {
        if (visibleKeys.has(key)) {
          next[key] = message;
        } else {
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [visibleFields]);

  const handleChange = (key: string, value: unknown) => {
    setAnswers(current => ({ ...current, [key]: value }));

    setFieldErrors(current => {
      if (!current[key]) return current;

      const next = { ...current };
      delete next[key];

      return next;
    });
  };

  const handleCheckboxOption = (
    key: string,
    optionValue: string,
    checked: boolean
  ) => {
    setAnswers(current => {
      const existing = Array.isArray(current[key]) ? current[key] : [];

      return {
        ...current,
        [key]: checked
          ? [...existing, optionValue]
          : existing.filter((item: string) => item !== optionValue),
      };
    });

    setFieldErrors(current => {
      if (!current[key]) return current;

      const next = { ...current };
      delete next[key];

      return next;
    });
  };

  const handleSubmit = async (eventSubmit: FormEvent<HTMLFormElement>) => {
    eventSubmit.preventDefault();

    if (!formSlug || !form) return;

    setSubmitting(true);
    setError(null);

    try {
      const nextFieldErrors: Record<string, string> = {};
      const payloadValues: Record<string, unknown> = {};

      for (const field of visibleFields) {
        const rawValue = answers[field.key];
        const validation = field.validation;

        const maxWords =
          typeof validation?.maxWords === 'number'
            ? validation.maxWords
            : /(testimony|prayer[-_\s]*request)/i.test(
                  `${field.key} ${field.label}`
                )
              ? 400
              : undefined;

        if (field.type === 'image') {
          if (!rawValue) {
            if (field.required) {
              nextFieldErrors[field.key] = `${field.label} is required`;
            }
            continue;
          }

          if (!(rawValue instanceof File)) {
            nextFieldErrors[field.key] = 'Invalid image selected';
            continue;
          }

          if (!ACCEPTED_IMAGE_TYPES.includes(rawValue.type)) {
            nextFieldErrors[field.key] = 'Use JPEG, PNG, or WebP image';
            continue;
          }

          if (rawValue.size > MAX_IMAGE_BYTES) {
            nextFieldErrors[field.key] = 'Image must be 5MB or smaller';
            continue;
          }

          payloadValues[field.key] = await readFileAsDataURL(rawValue);
          continue;
        }

        if (field.type === 'checkbox' && field.options?.length) {
          const selected = Array.isArray(rawValue) ? rawValue : [];

          if (field.required && selected.length === 0) {
            nextFieldErrors[field.key] = `${field.label} is required`;
            continue;
          }

          payloadValues[field.key] = selected;
          continue;
        }

        if (field.type === 'checkbox') {
          const checked = Boolean(rawValue);

          if (field.required && !checked) {
            nextFieldErrors[field.key] = `${field.label} is required`;
            continue;
          }

          payloadValues[field.key] = checked;
          continue;
        }

        const value = typeof rawValue === 'string' ? rawValue.trim() : '';

        if (!value) {
          if (field.required) {
            nextFieldErrors[field.key] = `${field.label} is required`;
          }
          continue;
        }

        if (field.type === 'email') {
          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailRe.test(value)) {
            nextFieldErrors[field.key] = 'Enter a valid email address';
            continue;
          }
        }

        if (isPhoneLikeField(field) && !e164Re.test(value)) {
          nextFieldErrors[field.key] =
            'Enter a valid phone number with country code, e.g. +2348012345678';
          continue;
        }

        if (field.type === 'date' && !parseDDMM(value)) {
          nextFieldErrors[field.key] =
            'Enter a valid date using DD-MM format, e.g. 24-12';
          continue;
        }

        if (typeof maxWords === 'number' && countWords(value) > maxWords) {
          nextFieldErrors[field.key] =
            `${field.label} must be at most ${maxWords} words`;
          continue;
        }

        payloadValues[field.key] = value;
      }

      if (Object.keys(nextFieldErrors).length > 0) {
        setFieldErrors(nextFieldErrors);
        setSubmitting(false);
        return;
      }

      await apiClient.submitPublicForm(formSlug, { values: payloadValues });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: PublicFormField) => {
    const value = answers[field.key];
    const errorMessage = fieldErrors[field.key];

    const fullWidth =
      field.type === 'textarea' ||
      field.type === 'radio' ||
      field.type === 'checkbox' ||
      field.type === 'image';

    const wrapperClass = `${fullWidth ? 'md:col-span-2' : ''} ${fieldShellClass}`;

    const Label = () => (
      <span className={labelClass}>
        {field.label}
        {field.required ? <span className="text-[#f7de12]"> *</span> : null}
      </span>
    );

    const Error = () =>
      errorMessage ? (
        <p className="text-sm leading-5 text-rose-300">{errorMessage}</p>
      ) : null;

    if (field.type === 'textarea') {
      const maxWords =
        typeof field.validation?.maxWords === 'number'
          ? field.validation.maxWords
          : /(testimony|prayer[-_\s]*request)/i.test(
                `${field.key} ${field.label}`
              )
            ? 400
            : undefined;

      const wordCount = typeof value === 'string' ? countWords(value) : 0;

      return (
        <div key={field.key} className={wrapperClass}>
          <label className="space-y-2">
            <Label />
            <textarea
              className={`${fieldBaseClass} min-h-[140px] resize-y leading-7`}
              placeholder={field.placeholder}
              value={typeof value === 'string' ? value : ''}
              onChange={event => handleChange(field.key, event.target.value)}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              {typeof maxWords === 'number' ? (
                <p className="text-xs text-white/45">
                  {wordCount}/{maxWords} words
                </p>
              ) : (
                <span />
              )}
              <Error />
            </div>
          </label>
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div key={field.key} className={wrapperClass}>
          <label className="space-y-2">
            <Label />
            <select
              className={fieldSelectClass}
              value={typeof value === 'string' ? value : ''}
              onChange={event => handleChange(field.key, event.target.value)}
            >
              <option value="" disabled>
                {field.placeholder || 'Select an option'}
              </option>
              {field.options?.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#080808] text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <Error />
          </label>
        </div>
      );
    }

    if (field.type === 'radio') {
      return (
        <div key={field.key} className={wrapperClass}>
          <fieldset className="space-y-3">
            <legend className={labelClass}>
              {field.label}
              {field.required ? (
                <span className="text-[#f7de12]"> *</span>
              ) : null}
            </legend>

            <div className="grid gap-2 sm:grid-cols-2">
              {field.options?.map(option => (
                <label
                  key={option.value}
                  className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/78 transition hover:bg-white/[0.045]"
                >
                  <input
                    type="radio"
                    name={field.key}
                    value={option.value}
                    checked={value === option.value}
                    required={field.required}
                    onChange={event =>
                      handleChange(field.key, event.target.value)
                    }
                    className="accent-[#f7de12]"
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <Error />
          </fieldset>
        </div>
      );
    }

    if (field.type === 'checkbox' && field.options?.length) {
      const currentValues = Array.isArray(value) ? value : [];

      return (
        <div key={field.key} className={wrapperClass}>
          <fieldset className="space-y-3">
            <legend className={labelClass}>
              {field.label}
              {field.required ? (
                <span className="text-[#f7de12]"> *</span>
              ) : null}
            </legend>

            <div className="grid gap-2 sm:grid-cols-2">
              {field.options.map(option => (
                <label
                  key={option.value}
                  className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/78 transition hover:bg-white/[0.045]"
                >
                  <input
                    type="checkbox"
                    checked={currentValues.includes(option.value)}
                    onChange={event =>
                      handleCheckboxOption(
                        field.key,
                        option.value,
                        event.target.checked
                      )
                    }
                    className="accent-[#f7de12]"
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <Error />
          </fieldset>
        </div>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <div key={field.key} className={wrapperClass}>
          <label className="flex items-start gap-3 text-sm leading-6 text-white/78">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={event => handleChange(field.key, event.target.checked)}
              className="mt-1 accent-[#f7de12]"
            />
            <span>
              {field.label}
              {field.required ? (
                <span className="text-[#f7de12]"> *</span>
              ) : null}
            </span>
          </label>
          <Error />
        </div>
      );
    }

    if (field.type === 'image') {
      const selectedFile = value instanceof File ? value : null;
      const fileKey = selectedFile
        ? `${selectedFile.name}-${selectedFile.lastModified}`
        : 'empty';

      return (
        <div key={field.key} className={wrapperClass}>
          <label className="space-y-2">
            <Label />
            <input
              key={fileKey}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              className={fieldBaseClass}
              onChange={event =>
                handleChange(field.key, event.target.files?.[0] || null)
              }
            />
            <p className="text-xs leading-5 text-white/45">
              JPEG, PNG, or WebP. Maximum file size is 5MB.
            </p>
            {selectedFile ? (
              <p className="text-xs leading-5 text-white/65">
                Selected: {selectedFile.name}
              </p>
            ) : null}
            <Error />
          </label>
        </div>
      );
    }

    if (isPhoneLikeField(field)) {
      const parsed = splitE164(typeof value === 'string' ? value : '');
      const currentDial = parsed?.dial ?? COUNTRY_PHONE_CODES[0].dial;
      const currentNational = parsed?.national ?? '';

      return (
        <div key={field.key} className={fieldShellClass}>
          <label className="space-y-2">
            <Label />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[170px_1fr]">
              <select
                className={fieldSelectClass}
                value={currentDial}
                onChange={event => {
                  const nextDial = event.target.value;
                  handleChange(
                    field.key,
                    `${nextDial}${onlyDigits(currentNational)}`
                  );
                }}
              >
                {COUNTRY_PHONE_CODES.map(country => (
                  <option
                    key={country.iso}
                    value={country.dial}
                    className="bg-[#080808] text-white"
                  >
                    {country.iso} {country.dial}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                className={fieldBaseClass}
                placeholder={field.placeholder || '8012345678'}
                value={currentNational}
                onChange={event =>
                  handleChange(
                    field.key,
                    `${currentDial}${onlyDigits(event.target.value)}`
                  )
                }
              />
            </div>

            <p className="text-xs leading-5 text-white/45">
              Use your country code and active phone number.
            </p>
            <Error />
          </label>
        </div>
      );
    }

    if (field.type === 'date') {
      const parsed = parseDDMMPartial(typeof value === 'string' ? value : '');
      const selectedDay = parsed?.day === '00' ? '' : parsed?.day || '';
      const selectedMonth = parsed?.month === '00' ? '' : parsed?.month || '';
      const monthNumber = selectedMonth ? Number(selectedMonth) : 12;
      const availableDays = Array.from(
        { length: daysInMonth(monthNumber) },
        (_, index) => String(index + 1).padStart(2, '0')
      );

      return (
        <div key={field.key} className={fieldShellClass}>
          <label className="space-y-2">
            <Label />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <select
                className={fieldSelectClass}
                value={selectedDay}
                onChange={event =>
                  handleChange(
                    field.key,
                    toDDMM(event.target.value, selectedMonth)
                  )
                }
              >
                <option value="">Day</option>
                {availableDays.map(day => (
                  <option key={day} value={day} className="bg-[#080808]">
                    {day}
                  </option>
                ))}
              </select>

              <select
                className={fieldSelectClass}
                value={selectedMonth}
                onChange={event =>
                  handleChange(
                    field.key,
                    toDDMM(selectedDay, event.target.value)
                  )
                }
              >
                <option value="">Month</option>
                {MONTH_OPTIONS.map(month => (
                  <option
                    key={month.value}
                    value={month.value}
                    className="bg-[#080808]"
                  >
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs leading-5 text-white/45">
              Stored as DD-MM format.
            </p>
            <Error />
          </label>
        </div>
      );
    }

    return (
      <div key={field.key} className={wrapperClass}>
        <label className="space-y-2">
          <Label />
          <input
            type={getFieldInputType(field)}
            className={fieldBaseClass}
            placeholder={field.placeholder}
            value={typeof value === 'string' ? value : ''}
            onChange={event => handleChange(field.key, event.target.value)}
          />
          <Error />
        </label>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section padding="none" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <Image
            src={EventBannerMobile}
            alt={event?.title || form?.title || 'Event banner'}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 0px"
            className="object-cover md:hidden"
          />
          <Image
            src={EventBannerDesktop}
            alt={event?.title || form?.title || 'Event banner'}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 100vw"
            className="hidden object-cover md:block"
          />
        </div>

        <div className="absolute inset-0 -z-10 bg-black/72" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(247,222,18,0.16),transparent_32%),linear-gradient(180deg,rgba(5,5,5,0.2),#050505_92%)]" />

        <Container
          size="xl"
          className={
            showHeroCopy
              ? 'relative z-10 py-14 sm:py-18 lg:py-20'
              : 'relative z-10 py-6'
          }
        >
          {showHeroCopy ? (
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                Public form
              </p>
              <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {presentation.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                {presentation.subtitle}
              </p>
            </div>
          ) : (
            <div className="h-8" aria-hidden />
          )}
        </Container>
      </Section>

      <Section padding="none" className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_5%,rgba(247,222,18,0.1),transparent_30%),linear-gradient(180deg,#050505_0%,#080808_52%,#050505_100%)]" />

        <Container size="xl" className="relative z-10">
          <div className="py-8 sm:py-10 lg:py-14">
            {loading ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 text-sm text-white/70 shadow-2xl shadow-black/25">
                Loading form...
              </div>
            ) : null}

            {!loading && error ? (
              <div className="rounded-[1.5rem] border border-rose-400/25 bg-rose-400/10 p-6 text-sm leading-7 text-rose-100 shadow-2xl shadow-black/25">
                {error}
              </div>
            ) : null}

            {!loading && form && !submitted ? (
              <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                <aside className="h-fit rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl xl:sticky xl:top-24">
                  {!showHeroCopy ? (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                        Public form
                      </p>
                      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                        {form.title}
                      </h1>
                      {form.description ? (
                        <p className="mt-3 text-sm leading-7 text-white/62">
                          {form.description}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                        Form details
                      </p>
                      <h2 className="mt-3 text-xl font-semibold text-white">
                        Complete your response
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-white/58">
                        Please provide accurate details before submitting.
                      </p>
                    </div>
                  )}

                  {presentation.headerNote ? (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white/68">
                      {presentation.headerNote}
                    </div>
                  ) : null}

                  <div className="mt-5 rounded-2xl border border-[#f7de12]/25 bg-[#f7de12]/10 px-4 py-3">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#f7de12]">
                      Form overview
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/78">
                      {visibleFields.length} visible field
                      {visibleFields.length === 1 ? '' : 's'} to complete.
                    </p>
                  </div>
                </aside>

                <form
                  onSubmit={handleSubmit}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6 lg:p-8"
                >
                  {presentation.detailItems.length > 0 ||
                  presentation.sections.length > 0 ? (
                    <div className="mb-6 space-y-4 rounded-[1.25rem] border border-white/10 bg-black/25 p-4 sm:p-5">
                      {presentation.detailItems.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {presentation.detailItems.map(
                            (item: string, index: number) => (
                              <div
                                key={`${item}-${index}`}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                              >
                                <p className="text-sm font-semibold text-white">
                                  {item}
                                </p>
                                {presentation.detailSubtexts[index] ? (
                                  <p className="mt-2 text-sm leading-6 text-white/58">
                                    {presentation.detailSubtexts[index]}
                                  </p>
                                ) : null}
                              </div>
                            )
                          )}
                        </div>
                      ) : null}

                      {presentation.sections.map((section: any) => (
                        <section key={section.id || section.title}>
                          <h3 className="text-base font-semibold text-white">
                            {section.title}
                          </h3>
                          {section.subtitle ? (
                            <p className="mt-1 text-sm leading-6 text-white/60">
                              {section.subtitle}
                            </p>
                          ) : null}

                          {Array.isArray(section.items) &&
                          section.items.length > 0 ? (
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              {section.items.map((item: any, index: number) => (
                                <div
                                  key={`${section.title}-${item.title}-${index}`}
                                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                                >
                                  {item.eyebrow ? (
                                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#f7de12]">
                                      {item.eyebrow}
                                    </p>
                                  ) : null}
                                  <p className="mt-1 text-sm font-semibold text-white">
                                    {item.title}
                                  </p>
                                  {item.body ? (
                                    <p className="mt-2 text-sm leading-6 text-white/58">
                                      {item.body}
                                    </p>
                                  ) : null}
                                  {item.linkText && item.linkUrl ? (
                                    <a
                                      href={item.linkUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 inline-flex text-sm font-bold text-[#f7de12] hover:underline"
                                    >
                                      {item.linkText}
                                    </a>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </section>
                      ))}
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {visibleFields.map(renderField)}
                  </div>

                  {error ? (
                    <div className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-100">
                      {error}
                    </div>
                  ) : null}

                  <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#f7de12] px-7 text-sm font-extrabold text-black shadow-lg shadow-[#f7de12]/20 transition hover:-translate-y-0.5 hover:bg-[#ffe93d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {submitting ? 'Submitting...' : 'Submit form'}
                    </button>

                    <p className="text-sm leading-6 text-white/50">
                      We will follow up using the details you provide.
                    </p>
                  </div>
                </form>
              </div>
            ) : null}

            {!loading && submitted ? (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm">
                <div className="w-full max-w-lg overflow-hidden rounded-[1.5rem] border border-emerald-400/25 bg-[#07140d] shadow-2xl shadow-black/50">
                  <div className="border-b border-emerald-400/15 px-6 py-5">
                    <p className="text-xl font-semibold text-emerald-100">
                      {presentation.successTitle}
                    </p>
                    {presentation.successSubtitle ? (
                      <p className="mt-1 text-sm leading-6 text-emerald-100/70">
                        {presentation.successSubtitle}
                      </p>
                    ) : null}
                  </div>

                  <div className="px-6 py-5">
                    <p className="text-sm leading-7 text-emerald-100/82">
                      {presentation.successMessage}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-emerald-100/65">
                      You can now return to the previous page.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => router.push(returnPath)}
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#f7de12] px-6 text-sm font-extrabold text-black transition hover:bg-[#ffe93d] sm:w-auto"
                      >
                        {returnLabel}
                      </button>

                      <Link
                        href={returnPath}
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-emerald-100/20 px-6 text-sm font-bold text-emerald-100 transition hover:bg-emerald-100/10 sm:w-auto"
                      >
                        {returnPath}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>
    </main>
  );
}
