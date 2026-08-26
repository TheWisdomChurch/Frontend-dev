'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { H1, H2, H3, H4, BodySM, Caption, Eyebrow } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';
import apiClient, { isApiError } from '@/lib/api';
import type {
  EventPublic,
  PublicFormField,
  PublicFormPayload,
} from '@/lib/apiTypes';
import { PhoneNumberField } from '@/shared/ui/forms';
import {
  DEFAULT_PHONE_COUNTRY,
  isValidNationalPhone,
  PHONE_COUNTRIES,
} from '@/lib/validation/phone';
import type { CountryCode } from 'libphonenumber-js';
import { BaseModal } from '@/shared/ui/modals/Base';
import {
  EditorialContainer,
  EditorialPanel,
  EditorialSection,
  editorialFieldClass,
  editorialLabelClass,
} from '@/shared/ui/editorial';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
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

const fieldShellClass = 'border-t border-[var(--app-border)] py-5';

const fieldBaseClass = `min-h-12 ${editorialFieldClass}`;

const fieldSelectClass = `min-h-12 ${editorialFieldClass}`;

const labelClass = editorialLabelClass;

function splitE164(
  value: string
): { country: CountryCode; dial: string; national: string } | null {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed.startsWith('+')) return null;

  const match = PHONE_COUNTRIES.slice()
    .sort((a, b) => b.dial.length - a.dial.length)
    .find(country => trimmed.startsWith(country.dial));
  if (!match) return null;

  return {
    country: match.iso,
    dial: match.dial,
    national: trimmed.slice(match.dial.length).replace(/\D/g, ''),
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
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentError, setConsentError] = useState('');

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
    let mounted = true;

    const load = async () => {
      if (!formSlug) {
        setLoading(false);
        setError('Invalid form link.');
        return;
      }

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
      } catch (err: unknown) {
        if (!mounted) return;

        if (isApiError(err) && err.statusCode === 404) {
          setError(
            'This form link is invalid, unpublished, or no longer available. Please contact support for the active link.'
          );
        } else if (isApiError(err) && err.statusCode === 410) {
          setError('This form is closed and no longer accepting responses.');
        } else {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load form. Please try again.'
          );
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

  const consent = {
    title:
      form?.settings?.consent?.title ||
      'Consent, privacy and responsible use of your information',
    introduction:
      form?.settings?.consent?.introduction ||
      'The Wisdom Church collects the information you provide to administer this submission, communicate with you, provide appropriate support, and maintain accurate church records.',
    purposes: form?.settings?.consent?.purposes?.length
      ? form.settings.consent.purposes
      : [
          'Process and manage this submission.',
          'Contact you about relevant updates and actions you requested.',
          'Maintain proportionate church administration and safeguarding records where applicable.',
        ],
    dataUse:
      form?.settings?.consent?.dataUse ||
      'Access is limited to authorised church personnel who need the information for these purposes. Personal information is not sold.',
    retention:
      form?.settings?.consent?.retention ||
      'Information is retained only while reasonably needed for its stated purpose and applicable legal, safeguarding, or administrative obligations.',
    rights:
      form?.settings?.consent?.rights ||
      'You may request access or correction and, where applicable, deletion, restriction, or withdrawal of consent.',
    contact:
      form?.settings?.consent?.contact ||
      'Contact the church administration team through the official church contact details for privacy questions or corrections.',
    acknowledgementLabel:
      form?.settings?.consent?.acknowledgementLabel ||
      'I have read and understood this notice, confirm that my information is accurate, and consent to its use for the purposes described above.',
    version: form?.settings?.consent?.version || '2026.1',
  };

  const showHeroCopy = isStructuredPublicForm;

  const sortedFields = useMemo(() => {
    return (form?.fields || []).slice().sort((a, b) => a.order - b.order);
  }, [form?.fields]);

  const visibleFields = useMemo(() => {
    return sortedFields.filter(field => isFieldVisible(field, answers));
  }, [answers, sortedFields]);

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

      if (!consentAccepted) {
        setConsentError(
          'Review and accept the privacy notice before submitting.'
        );
        setSubmitting(false);
        return;
      }

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

        const parsedPhone = isPhoneLikeField(field) ? splitE164(value) : null;
        if (
          isPhoneLikeField(field) &&
          (!parsedPhone ||
            !isValidNationalPhone(parsedPhone.national, parsedPhone.country))
        ) {
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

      payloadValues._consentAccepted = true;
      payloadValues._consentVersion = consent.version;

      await apiClient.submitPublicForm(formSlug, { values: payloadValues });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Submission failed. Please try again.'
      );
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
        {field.required ? (
          <span className="text-[var(--app-primary)]"> *</span>
        ) : null}
      </span>
    );

    const Error = () =>
      errorMessage ? (
        <BodySM className="text-rose-300">{errorMessage}</BodySM>
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
                <Caption className="text-stone-500">
                  {wordCount}/{maxWords} words
                </Caption>
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
              aria-label={field.label}
              className={fieldSelectClass}
              value={typeof value === 'string' ? value : ''}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                handleChange(field.key, event.target.value)
              }
            >
              <option value="" disabled>
                {field.placeholder || 'Select an option'}
              </option>
              {field.options?.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-white text-stone-950"
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
                <span className="text-[var(--app-primary)]"> *</span>
              ) : null}
            </legend>

            <div className="grid gap-2 sm:grid-cols-2">
              {field.options?.map(option => (
                <label
                  key={option.value}
                  className="flex min-h-11 items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 transition hover:bg-white"
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
                    className="accent-[var(--app-primary)]"
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
                <span className="text-[var(--app-primary)]"> *</span>
              ) : null}
            </legend>

            <div className="grid gap-2 sm:grid-cols-2">
              {field.options.map(option => (
                <label
                  key={option.value}
                  className="flex min-h-11 items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 transition hover:bg-white"
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
                    className="accent-[var(--app-primary)]"
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
          <label className="flex items-start gap-3 text-sm leading-6 text-stone-700">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={event => handleChange(field.key, event.target.checked)}
              className="mt-1 accent-[var(--app-primary)]"
            />
            <span>
              {field.label}
              {field.required ? (
                <span className="text-[var(--app-primary)]"> *</span>
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
            <Caption className="text-stone-500">
              JPEG, PNG, or WebP. Maximum file size is 5MB.
            </Caption>
            {selectedFile ? (
              <Caption className="text-stone-600">
                Selected: {selectedFile.name}
              </Caption>
            ) : null}
            <Error />
          </label>
        </div>
      );
    }

    if (isPhoneLikeField(field)) {
      const parsed = splitE164(typeof value === 'string' ? value : '');
      const currentCountry = parsed?.country ?? DEFAULT_PHONE_COUNTRY;
      const currentDial =
        parsed?.dial ??
        PHONE_COUNTRIES.find(item => item.iso === currentCountry)?.dial ??
        '+234';
      const currentNational = parsed?.national ?? '';

      return (
        <div key={field.key} className={fieldShellClass}>
          <label className="space-y-2">
            <Label />

            <PhoneNumberField
              id={`dynamic-phone-${field.key}`}
              country={currentCountry}
              number={currentNational}
              onCountryChange={country => {
                const dial =
                  PHONE_COUNTRIES.find(item => item.iso === country)?.dial ??
                  currentDial;
                handleChange(
                  field.key,
                  `${dial}${currentNational.replace(/\D/g, '')}`
                );
              }}
              onNumberChange={number =>
                handleChange(
                  field.key,
                  `${currentDial}${number.replace(/\D/g, '')}`
                )
              }
              inputClassName={fieldBaseClass}
              selectClassName={fieldSelectClass}
              placeholder={field.placeholder || '8012345678'}
              error={fieldErrors[field.key]}
              required={field.required}
            />

            <Caption className="text-stone-500">
              Use your country code and active phone number.
            </Caption>
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
                  <option key={day} value={day} className="bg-white">
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
                    className="bg-white"
                  >
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <Caption className="text-stone-500">
              Stored as DD-MM format.
            </Caption>
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
    <main className="min-h-screen bg-[#faf9f6] text-stone-950">
      <EditorialSection compact>
        <div className="absolute inset-x-0 top-0 -z-10 h-1 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />
        <div className="absolute -right-32 -top-32 -z-10 h-80 w-80 rounded-full bg-amber-100/70 blur-3xl" />

        <EditorialContainer
          className={
            showHeroCopy
              ? 'relative z-10 py-14 sm:py-18 lg:py-20'
              : 'relative z-10 py-6'
          }
        >
          {showHeroCopy ? (
            <div className="max-w-3xl">
              <Eyebrow className="text-[var(--app-primary)]">
                Public form
              </Eyebrow>
              <H1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
                {presentation.title}
              </H1>
              <BodySM className="mt-4 max-w-2xl text-stone-600">
                {presentation.subtitle}
              </BodySM>
            </div>
          ) : (
            <div className="h-8" aria-hidden />
          )}
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="canvas">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_5%,rgba(217,160,31,0.07),transparent_30%)]" />

        <EditorialContainer className="relative z-10">
          <div className="py-8 sm:py-10 lg:py-14">
            {loading ? (
              <div className="rounded-card border border-[var(--app-border)] bg-white p-6 text-sm text-stone-600">
                Loading form...
              </div>
            ) : null}

            {!loading && error ? (
              <div className="rounded-card border border-rose-400/25 bg-rose-400/10 p-6 text-sm leading-7 text-rose-700">
                {error}
              </div>
            ) : null}

            {!loading && form && !submitted ? (
              <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                <EditorialPanel className="h-fit p-5 xl:sticky xl:top-24">
                  {!showHeroCopy ? (
                    <div>
                      <Eyebrow className="text-[var(--app-primary)]">
                        Public form
                      </Eyebrow>
                      <H2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                        {form.title}
                      </H2>
                      {form.description ? (
                        <BodySM className="mt-3 text-stone-600">
                          {form.description}
                        </BodySM>
                      ) : null}
                    </div>
                  ) : (
                    <div>
                      <Eyebrow className="text-[var(--app-primary)]">
                        Form details
                      </Eyebrow>
                      <H3 className="mt-3 text-xl text-stone-950">
                        Complete your response
                      </H3>
                      <BodySM className="mt-2 text-stone-600">
                        Please provide accurate details before submitting.
                      </BodySM>
                    </div>
                  )}

                  {presentation.headerNote ? (
                    <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-600">
                      {presentation.headerNote}
                    </div>
                  ) : null}

                  <div className="mt-5 rounded-2xl border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/10 px-4 py-3">
                    <Eyebrow className="text-[var(--app-primary)]">
                      Form overview
                    </Eyebrow>
                    <BodySM className="mt-2 text-stone-700">
                      {visibleFields.length} visible field
                      {visibleFields.length === 1 ? '' : 's'} to complete.
                    </BodySM>
                  </div>
                </EditorialPanel>

                <form
                  onSubmit={handleSubmit}
                  className="rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-4 sm:p-6 lg:p-8"
                >
                  {presentation.detailItems.length > 0 ||
                  presentation.sections.length > 0 ? (
                    <div className="mb-6 space-y-4 rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4 sm:p-5">
                      {presentation.detailItems.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {presentation.detailItems.map(
                            (item: string, index: number) => (
                              <div
                                key={`${item}-${index}`}
                                className="rounded-2xl border border-stone-200 bg-white p-4"
                              >
                                <BodySM
                                  weight="semibold"
                                  className="text-stone-950"
                                >
                                  {item}
                                </BodySM>
                                {presentation.detailSubtexts[index] ? (
                                  <BodySM className="mt-2 text-stone-600">
                                    {presentation.detailSubtexts[index]}
                                  </BodySM>
                                ) : null}
                              </div>
                            )
                          )}
                        </div>
                      ) : null}

                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {presentation.sections.map((section: any) => (
                        <section key={section.id || section.title}>
                          <H4 className="text-base text-stone-950">
                            {section.title}
                          </H4>
                          {section.subtitle ? (
                            <BodySM className="mt-1 text-stone-600">
                              {section.subtitle}
                            </BodySM>
                          ) : null}

                          {Array.isArray(section.items) &&
                          section.items.length > 0 ? (
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {section.items.map((item: any, index: number) => (
                                <div
                                  key={`${section.title}-${item.title}-${index}`}
                                  className="rounded-2xl border border-stone-200 bg-white p-4"
                                >
                                  {item.eyebrow ? (
                                    <Eyebrow className="text-[var(--app-primary)]">
                                      {item.eyebrow}
                                    </Eyebrow>
                                  ) : null}
                                  <BodySM
                                    weight="semibold"
                                    className="mt-1 text-stone-950"
                                  >
                                    {item.title}
                                  </BodySM>
                                  {item.body ? (
                                    <BodySM className="mt-2 text-stone-600">
                                      {item.body}
                                    </BodySM>
                                  ) : null}
                                  {item.linkText && item.linkUrl ? (
                                    <a
                                      href={item.linkUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 inline-flex text-sm font-bold text-[var(--app-primary)] hover:underline"
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

                  <section
                    className="mt-7 rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6"
                    aria-labelledby="privacy-consent-title"
                  >
                    <Eyebrow className="text-emerald-700">
                      Privacy and consent
                    </Eyebrow>
                    <H3
                      id="privacy-consent-title"
                      className="mt-2 text-lg text-stone-950"
                    >
                      {consent.title}
                    </H3>
                    <BodySM className="mt-3 leading-6 text-stone-700">
                      {consent.introduction}
                    </BodySM>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-700">
                      {consent.purposes.map(purpose => (
                        <li key={purpose} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                          {purpose}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 grid gap-4 text-sm leading-6 text-stone-600 sm:grid-cols-2">
                      <div>
                        <strong className="block text-stone-900">
                          Responsible access
                        </strong>
                        {consent.dataUse}
                      </div>
                      <div>
                        <strong className="block text-stone-900">
                          Retention
                        </strong>
                        {consent.retention}
                      </div>
                      <div>
                        <strong className="block text-stone-900">
                          Your rights
                        </strong>
                        {consent.rights}
                      </div>
                      <div>
                        <strong className="block text-stone-900">
                          Questions and corrections
                        </strong>
                        {consent.contact}
                      </div>
                    </div>
                    <label
                      className={`mt-5 flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 text-sm leading-6 text-stone-700 ${consentError ? 'border-rose-400 ring-2 ring-rose-100' : 'border-stone-300'}`}
                    >
                      <input
                        type="checkbox"
                        checked={consentAccepted}
                        onChange={event => {
                          setConsentAccepted(event.target.checked);
                          if (event.target.checked) setConsentError('');
                        }}
                        className="mt-1 h-4 w-4 accent-emerald-700"
                      />
                      <span>
                        <strong className="block text-stone-950">
                          Required acknowledgement
                        </strong>
                        {consent.acknowledgementLabel}
                      </span>
                    </label>
                    {consentError ? (
                      <p
                        className="mt-2 text-sm font-semibold text-rose-700"
                        role="alert"
                      >
                        {consentError}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs text-stone-500">
                      Privacy notice version {consent.version}
                    </p>
                  </section>

                  {error ? (
                    <div className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-100">
                      {error}
                    </div>
                  ) : null}

                  <div className="mt-7 flex flex-col gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      variant="primary"
                      curvature="full"
                      disabled={submitting}
                      className="w-full sm:w-auto"
                    >
                      {submitting ? 'Submitting...' : 'Submit form'}
                    </Button>

                    <BodySM className="text-stone-500">
                      We will follow up using the details you provide.
                    </BodySM>
                  </div>
                </form>
              </div>
            ) : null}

            <BaseModal
              isOpen={!loading && submitted}
              onClose={() => router.push(returnPath)}
              title={presentation.successTitle}
              subtitle={presentation.successSubtitle}
              showCloseButton={false}
              forceBottomSheet
              maxWidth="max-w-lg"
            >
              <div className="min-w-0 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.055] p-4 sm:p-5">
                <BodySM className="text-emerald-100/82">
                  {presentation.successMessage}
                </BodySM>
                <BodySM className="mt-4 text-emerald-100/65">
                  You can now return to the previous page.
                </BodySM>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="primary"
                    curvature="full"
                    onClick={() => router.push(returnPath)}
                    className="w-full sm:w-auto"
                  >
                    {returnLabel}
                  </Button>

                  <Link
                    href={returnPath}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-emerald-100/20 px-6 text-sm font-bold text-emerald-100 transition hover:bg-emerald-100/10 sm:w-auto"
                  >
                    {returnPath}
                  </Link>
                </div>
              </div>
            </BaseModal>
          </div>
        </EditorialContainer>
      </EditorialSection>
    </main>
  );
}
