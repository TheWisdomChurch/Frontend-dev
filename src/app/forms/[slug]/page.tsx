'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Container, Section } from '@/shared/layout';
import { H2, H3, BodyMD, BodySM } from '@/shared/text';
import { EventBannerDesktop, EventBannerMobile } from '@/shared/assets';
import apiClient from '@/lib/api';
import { PublicFormPayload, EventPublic, PublicFormField } from '@/lib';

const fieldBaseClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/60 transition';

const labelClass = 'text-sm font-semibold text-white/80';
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

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function splitE164(value: string): { dial: string; national: string } | null {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith('+')) return null;

  const dialCandidates = COUNTRY_PHONE_CODES.map(c => c.dial).sort(
    (a, b) => b.length - a.length
  );
  const dial = dialCandidates.find(d => trimmed.startsWith(d));
  if (!dial) return null;

  return {
    dial,
    national: trimmed.slice(dial.length).replace(/\D/g, ''),
  };
}

function isPhoneLikeField(field: PublicFormField): boolean {
  const fieldType = (field.type || '').toLowerCase();
  if (fieldType === 'tel' || fieldType === 'phone' || fieldType === 'mobile') {
    return true;
  }
  const hay = `${field.key} ${field.label}`.toLowerCase();
  return /(phone|mobile|tel|telephone|contact[-_\s]?number)/.test(hay);
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
  const day = match[1];
  const month = match[2];
  if (month !== '00' && (Number(month) < 1 || Number(month) > 12)) return null;
  if (day !== '00' && (Number(day) < 1 || Number(day) > 31)) return null;
  return { day, month };
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

export default function PublicFormPage() {
  const pathname = usePathname();
  const formSlug = useMemo(() => {
    if (!pathname) return undefined;
    const segments = pathname.split('/').filter(Boolean);
    const formsIndex = segments.findIndex(segment => segment === 'forms');
    if (formsIndex < 0) return undefined;
    const nextSegment = segments[formsIndex + 1];
    return nextSegment ? decodeURIComponent(nextSegment) : undefined;
  }, [pathname]);

  const [form, setForm] = useState<PublicFormPayload | null>(null);
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isStructuredPublicForm = useMemo(() => {
    const slug = (formSlug || '').toLowerCase();
    return (
      slug.includes('testimony') ||
      slug.includes('testimonial') ||
      slug.includes('leadership') ||
      slug.includes('member') ||
      slug.includes('membership') ||
      (form?.settings?.formType || '').toLowerCase() === 'testimonial' ||
      (form?.settings?.formType || '').toLowerCase() === 'leadership' ||
      (form?.settings?.formType || '').toLowerCase() === 'member'
    );
  }, [formSlug, form?.settings?.formType]);
  const isTestimonialForm = useMemo(() => {
    const slug = (formSlug || '').toLowerCase();
    return (
      slug.includes('testimony') ||
      slug.includes('testimonial') ||
      (form?.settings?.formType || '').toLowerCase() === 'testimonial'
    );
  }, [formSlug, form?.settings?.formType]);

  useEffect(() => {
    if (!formSlug) return;

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
            ? eventsData.find(evt => evt.formSlug === formSlug) || null
            : null;
        }
        setEvent(resolvedEvent);

        const defaults: Record<string, any> = {};
        (formData?.fields || []).forEach((field: PublicFormField) => {
          if (field.type === 'checkbox') {
            defaults[field.key] = field.options?.length ? [] : false;
          } else {
            defaults[field.key] = '';
          }
        });

        setAnswers(prev => ({ ...defaults, ...prev }));
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
    const title = isTestimonialForm
      ? form?.title || 'Share Your Testimony'
      : settings?.introTitle || event?.title || form?.title || 'Registration';
    const subtitle = isTestimonialForm
      ? form?.description || 'Tell us what God has done in your life.'
      : settings?.introSubtitle ||
        event?.description ||
        form?.description ||
        'Complete the form below to continue.';
    const detailItems = settings?.introBullets || [];
    const detailSubtexts = settings?.introBulletSubtexts || [];
    const headerNote = settings?.formHeaderNote || '';
    const sections = settings?.sections || [];
    const successTitle =
      applyTemplateVars(settings?.successModalTitle, form?.title || 'Form') ||
      'Submission received';
    const successSubtitle = applyTemplateVars(
      settings?.successModalSubtitle,
      form?.title || 'Form'
    );
    const successMessage =
      applyTemplateVars(settings?.successModalMessage, form?.title || 'Form') ||
      applyTemplateVars(settings?.successMessage, form?.title || 'Form') ||
      'Your response has been received successfully.';

    return {
      title,
      subtitle,
      detailItems,
      detailSubtexts,
      headerNote,
      sections,
      successTitle,
      successSubtitle,
      successMessage,
    };
  }, [event, form, isTestimonialForm]);

  const showHeroCopy = isStructuredPublicForm;

  const handleChange = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setFieldErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleCheckboxOption = (
    key: string,
    optionValue: string,
    checked: boolean
  ) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      if (checked) return { ...prev, [key]: [...current, optionValue] };
      return {
        ...prev,
        [key]: current.filter((item: string) => item !== optionValue),
      };
    });
  };

  const handleSubmit = async (
    eventSubmit: React.FormEvent<HTMLFormElement>
  ) => {
    eventSubmit.preventDefault();
    if (!formSlug || !form) return;

    setSubmitting(true);
    setError(null);

    try {
      const nextFieldErrors: Record<string, string> = {};
      const payloadValues: Record<string, any> = {};
      const sortedFields = form.fields
        .slice()
        .sort((a, b) => a.order - b.order);

      for (const field of sortedFields) {
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
            'Enter a valid date using DD-MM format (e.g. 24-12)';
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

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Section padding="none" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={EventBannerMobile}
            alt={event?.title || form?.title || 'Event banner'}
            fill
            sizes="(max-width: 768px) 100vw, 0px"
            className="object-cover md:hidden"
            priority
          />
          <Image
            src={EventBannerDesktop}
            alt={event?.title || form?.title || 'Event banner'}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="hidden md:block object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/60" />

        <Container
          size="xl"
          className={`relative z-10 ${showHeroCopy ? 'py-12 sm:py-16' : 'py-2 sm:py-3'}`}
        >
          {showHeroCopy ? (
            <div className="max-w-3xl space-y-3">
              <H2 className="text-3xl sm:text-4xl font-black">
                {presentation.title}
              </H2>
              <BodyMD className="text-white/80">{presentation.subtitle}</BodyMD>
            </div>
          ) : (
            <div className="h-6 sm:h-8" aria-hidden />
          )}
        </Container>
      </Section>

      <Section padding="none" className="bg-[#0b0b0b]">
        <Container size="md">
          <div className="py-6 sm:py-8">
            {loading && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 text-white/70">
                Loading form...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 sm:p-6 text-red-200">
                {error}
              </div>
            )}

            {!loading && form && !submitted && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  {!showHeroCopy && (
                    <>
                      <H3 className="text-2xl font-semibold">{form.title}</H3>
                      {form.description && (
                        <BodySM className="text-white/70">
                          {form.description}
                        </BodySM>
                      )}
                    </>
                  )}
                  {presentation.headerNote && (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs sm:text-sm text-white/75">
                      {presentation.headerNote}
                    </div>
                  )}
                </div>

                {(presentation.detailItems.length > 0 ||
                  presentation.sections.length > 0) && (
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    {presentation.detailItems.length > 0 && (
                      <div className="space-y-3">
                        {presentation.detailItems.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
                          >
                            <p className="text-sm font-semibold text-white">
                              {item}
                            </p>
                            {presentation.detailSubtexts[index] && (
                              <p className="mt-1 text-xs sm:text-sm text-white/70">
                                {presentation.detailSubtexts[index]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {presentation.sections.map(section => (
                      <div
                        key={section.id || section.title}
                        className="space-y-2"
                      >
                        <h4 className="text-base font-semibold text-white">
                          {section.title}
                        </h4>
                        {section.subtitle && (
                          <p className="text-sm text-white/70">
                            {section.subtitle}
                          </p>
                        )}
                        {Array.isArray(section.items) &&
                          section.items.length > 0 && (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {section.items.map((item, index) => (
                                <div
                                  key={`${section.title}-${item.title}-${index}`}
                                  className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
                                >
                                  {item.eyebrow && (
                                    <p className="text-[11px] uppercase tracking-[0.14em] text-yellow-300/90">
                                      {item.eyebrow}
                                    </p>
                                  )}
                                  <p className="mt-1 text-sm font-medium text-white">
                                    {item.title}
                                  </p>
                                  {item.body && (
                                    <p className="mt-1 text-xs sm:text-sm text-white/70">
                                      {item.body}
                                    </p>
                                  )}
                                  {item.linkText && item.linkUrl && (
                                    <a
                                      href={item.linkUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-block text-xs sm:text-sm font-semibold text-yellow-300 hover:underline"
                                    >
                                      {item.linkText}
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {form.fields
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map(field => {
                      const value = answers[field.key];
                      const fullWidth =
                        field.type === 'textarea' ||
                        field.type === 'select' ||
                        field.type === 'radio' ||
                        field.type === 'checkbox';

                      if (field.type === 'textarea') {
                        const maxWords =
                          typeof field.validation?.maxWords === 'number'
                            ? field.validation.maxWords
                            : /(testimony|prayer[-_\s]*request)/i.test(
                                  `${field.key} ${field.label}`
                                )
                              ? 400
                              : undefined;
                        const wordCount =
                          typeof value === 'string' ? countWords(value) : 0;
                        return (
                          <div
                            key={field.key}
                            className={fullWidth ? 'md:col-span-2' : undefined}
                          >
                            <label className="space-y-2">
                              <span className={labelClass}>
                                {field.label}
                                {field.required && (
                                  <span className="text-yellow-300"> *</span>
                                )}
                              </span>
                              <textarea
                                className={`${fieldBaseClass} min-h-[120px]`}
                                placeholder={field.placeholder}
                                value={value || ''}
                                onChange={e =>
                                  handleChange(field.key, e.target.value)
                                }
                              />
                              {typeof maxWords === 'number' && (
                                <p className="text-xs text-white/60">
                                  {wordCount}/{maxWords} words
                                </p>
                              )}
                              {fieldErrors[field.key] && (
                                <p className="text-xs text-red-300">
                                  {fieldErrors[field.key]}
                                </p>
                              )}
                            </label>
                          </div>
                        );
                      }

                      if (field.type === 'select') {
                        return (
                          <div
                            key={field.key}
                            className={fullWidth ? 'md:col-span-2' : undefined}
                          >
                            <label className="space-y-2">
                              <span className={labelClass}>
                                {field.label}
                                {field.required && (
                                  <span className="text-yellow-300"> *</span>
                                )}
                              </span>
                              <select
                                className={fieldBaseClass}
                                value={value || ''}
                                onChange={e =>
                                  handleChange(field.key, e.target.value)
                                }
                              >
                                <option value="" disabled>
                                  {field.placeholder || 'Select an option'}
                                </option>
                                {field.options?.map(option => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {fieldErrors[field.key] && (
                                <p className="text-xs text-red-300">
                                  {fieldErrors[field.key]}
                                </p>
                              )}
                            </label>
                          </div>
                        );
                      }

                      if (field.type === 'radio') {
                        return (
                          <div
                            key={field.key}
                            className={fullWidth ? 'md:col-span-2' : undefined}
                          >
                            <fieldset className="space-y-2">
                              <legend className={labelClass}>
                                {field.label}
                                {field.required && (
                                  <span className="text-yellow-300"> *</span>
                                )}
                              </legend>
                              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                                {field.options?.map(option => (
                                  <label
                                    key={option.value}
                                    className="flex items-center gap-2 text-sm text-white/80"
                                  >
                                    <input
                                      type="radio"
                                      name={field.key}
                                      value={option.value}
                                      checked={value === option.value}
                                      onChange={e =>
                                        handleChange(field.key, e.target.value)
                                      }
                                      required={field.required}
                                      className="accent-yellow-400"
                                    />
                                    {option.label}
                                  </label>
                                ))}
                              </div>
                              {fieldErrors[field.key] && (
                                <p className="text-xs text-red-300">
                                  {fieldErrors[field.key]}
                                </p>
                              )}
                            </fieldset>
                          </div>
                        );
                      }

                      if (field.type === 'checkbox' && field.options?.length) {
                        const currentValues = Array.isArray(value) ? value : [];
                        return (
                          <div
                            key={field.key}
                            className={fullWidth ? 'md:col-span-2' : undefined}
                          >
                            <fieldset className="space-y-2">
                              <legend className={labelClass}>
                                {field.label}
                                {field.required && (
                                  <span className="text-yellow-300"> *</span>
                                )}
                              </legend>
                              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                                {field.options.map(option => (
                                  <label
                                    key={option.value}
                                    className="flex items-center gap-2 text-sm text-white/80"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={currentValues.includes(
                                        option.value
                                      )}
                                      onChange={e =>
                                        handleCheckboxOption(
                                          field.key,
                                          option.value,
                                          e.target.checked
                                        )
                                      }
                                      className="accent-yellow-400"
                                    />
                                    {option.label}
                                  </label>
                                ))}
                              </div>
                              {fieldErrors[field.key] && (
                                <p className="text-xs text-red-300">
                                  {fieldErrors[field.key]}
                                </p>
                              )}
                            </fieldset>
                          </div>
                        );
                      }

                      if (field.type === 'checkbox') {
                        return (
                          <div
                            key={field.key}
                            className={fullWidth ? 'md:col-span-2' : undefined}
                          >
                            <label className="flex items-center gap-2 text-sm text-white/80">
                              <input
                                type="checkbox"
                                checked={Boolean(value)}
                                onChange={e =>
                                  handleChange(field.key, e.target.checked)
                                }
                                className="accent-yellow-400"
                              />
                              <span>
                                {field.label}
                                {field.required && (
                                  <span className="text-yellow-300"> *</span>
                                )}
                              </span>
                            </label>
                            {fieldErrors[field.key] && (
                              <p className="text-xs text-red-300">
                                {fieldErrors[field.key]}
                              </p>
                            )}
                          </div>
                        );
                      }

                      if (field.type === 'image') {
                        const selectedFile =
                          value instanceof File ? value : null;
                        const fileKey = selectedFile
                          ? `${selectedFile.name}-${selectedFile.lastModified}`
                          : 'empty';
                        return (
                          <div
                            key={field.key}
                            className={fullWidth ? 'md:col-span-2' : undefined}
                          >
                            <label className="space-y-2">
                              <span className={labelClass}>
                                {field.label}
                                {field.required && (
                                  <span className="text-yellow-300"> *</span>
                                )}
                              </span>
                              <input
                                key={fileKey}
                                type="file"
                                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                className={fieldBaseClass}
                                onChange={e =>
                                  handleChange(
                                    field.key,
                                    e.target.files?.[0] || null
                                  )
                                }
                              />
                              <p className="text-xs text-white/60">
                                JPEG, PNG, or WebP. Max 5MB.
                              </p>
                              {selectedFile && (
                                <p className="text-xs text-white/70">
                                  Selected: {selectedFile.name}
                                </p>
                              )}
                              {fieldErrors[field.key] && (
                                <p className="text-xs text-red-300">
                                  {fieldErrors[field.key]}
                                </p>
                              )}
                            </label>
                          </div>
                        );
                      }

                      if (isPhoneLikeField(field)) {
                        const parsed = splitE164(
                          typeof value === 'string' ? value : ''
                        );
                        const currentDial =
                          parsed?.dial ?? COUNTRY_PHONE_CODES[0].dial;
                        const currentNational = parsed?.national ?? '';
                        return (
                          <div key={field.key}>
                            <label className="space-y-2">
                              <span className={labelClass}>
                                {field.label}
                                {field.required && (
                                  <span className="text-yellow-300"> *</span>
                                )}
                              </span>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[170px_1fr]">
                                <select
                                  className={fieldBaseClass}
                                  value={currentDial}
                                  onChange={e => {
                                    const nextDial = e.target.value;
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
                                    >
                                      {country.name} ({country.dial})
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="tel"
                                  className={fieldBaseClass}
                                  placeholder="Phone number"
                                  value={currentNational}
                                  onChange={e => {
                                    const national = onlyDigits(e.target.value);
                                    handleChange(
                                      field.key,
                                      `${currentDial}${national}`
                                    );
                                  }}
                                />
                              </div>
                              <p className="text-xs text-white/60">
                                Stored as international format, e.g.
                                +2348012345678
                              </p>
                              {fieldErrors[field.key] && (
                                <p className="text-xs text-red-300">
                                  {fieldErrors[field.key]}
                                </p>
                              )}
                            </label>
                          </div>
                        );
                      }

                      if (field.type === 'date') {
                        const parsed = parseDDMMPartial(
                          typeof value === 'string' ? value : ''
                        );
                        const selectedMonth =
                          parsed?.month && parsed.month !== '00'
                            ? parsed.month
                            : '';
                        const selectedDay =
                          parsed?.day && parsed.day !== '00' ? parsed.day : '';
                        const monthNumber = Number(selectedMonth || '0');
                        const maxDay =
                          monthNumber >= 1 && monthNumber <= 12
                            ? daysInMonth(monthNumber)
                            : 31;
                        const dayOptions = Array.from(
                          { length: maxDay },
                          (_, index) => String(index + 1).padStart(2, '0')
                        );

                        return (
                          <div key={field.key}>
                            <label className="space-y-2">
                              <span className={labelClass}>
                                {field.label}
                                {field.required && (
                                  <span className="text-yellow-300"> *</span>
                                )}
                              </span>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <select
                                  className={fieldBaseClass}
                                  value={selectedDay}
                                  disabled={!selectedMonth}
                                  onChange={e => {
                                    const nextDay = e.target.value;
                                    handleChange(
                                      field.key,
                                      toDDMM(nextDay, selectedMonth)
                                    );
                                  }}
                                >
                                  <option value="" disabled>
                                    Select day
                                  </option>
                                  {dayOptions.map(day => (
                                    <option key={day} value={day}>
                                      {day}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  className={fieldBaseClass}
                                  value={selectedMonth}
                                  onChange={e => {
                                    const nextMonth = e.target.value;
                                    const nextMax = daysInMonth(
                                      Number(nextMonth || '1')
                                    );
                                    let nextDay = selectedDay;
                                    if (nextDay && Number(nextDay) > nextMax) {
                                      nextDay = String(nextMax).padStart(
                                        2,
                                        '0'
                                      );
                                    }
                                    handleChange(
                                      field.key,
                                      toDDMM(nextDay, nextMonth)
                                    );
                                  }}
                                >
                                  <option value="" disabled>
                                    Select month
                                  </option>
                                  {MONTH_OPTIONS.map(month => (
                                    <option
                                      key={month.value}
                                      value={month.value}
                                    >
                                      {month.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <p className="text-xs text-white/60">
                                Format: DD-MM (year removed)
                              </p>
                              {fieldErrors[field.key] && (
                                <p className="text-xs text-red-300">
                                  {fieldErrors[field.key]}
                                </p>
                              )}
                            </label>
                          </div>
                        );
                      }

                      const inputType =
                        field.type === 'number' ? 'number' : field.type;

                      return (
                        <div key={field.key}>
                          <label className="space-y-2">
                            <span className={labelClass}>
                              {field.label}
                              {field.required && (
                                <span className="text-yellow-300"> *</span>
                              )}
                            </span>
                            <input
                              type={inputType}
                              className={fieldBaseClass}
                              placeholder={field.placeholder}
                              value={value || ''}
                              onChange={e =>
                                handleChange(field.key, e.target.value)
                              }
                            />
                            {fieldErrors[field.key] && (
                              <p className="text-xs text-red-300">
                                {fieldErrors[field.key]}
                              </p>
                            )}
                          </label>
                        </div>
                      );
                    })}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit form'}
                  </button>
                  <p className="text-xs text-white/60 sm:text-sm">
                    We will follow up using the details you provide.
                  </p>
                </div>
              </form>
            )}

            {!loading && submitted && (
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-6 text-emerald-100">
                <p className="text-lg font-semibold">
                  {presentation.successTitle}
                </p>
                {presentation.successSubtitle && (
                  <p className="mt-1 text-sm text-emerald-200/90">
                    {presentation.successSubtitle}
                  </p>
                )}
                <p className="mt-2 text-sm text-emerald-100/90">
                  {presentation.successMessage}
                </p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
