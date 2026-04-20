'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Container, Section } from '@/shared/layout';
import { H3, BodySM } from '@/shared/text';
import { EventBannerDesktop, EventBannerMobile } from '@/shared/assets';
import apiClient from '@/lib/api';
import { PublicFormPayload, EventPublic, PublicFormField } from '@/lib';

const fieldBaseClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/60 transition';

const labelClass = 'text-sm font-semibold text-white/80';
const DEFAULT_EYEBROW = 'Registration';

function formatFormTypeLabel(formType?: string): string {
  if (!formType) return DEFAULT_EYEBROW;
  return formType
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function applyTemplateVars(
  input: string | undefined,
  formTitle: string
): string {
  if (!input) return '';
  return input.replace(/\{\{\s*formTitle\s*\}\}/gi, formTitle);
}

export default function PublicFormPage() {
  const params = useParams();
  const formSlug = Array.isArray(params?.slug)
    ? params.slug[0]
    : (params?.slug as string | undefined);

  const [form, setForm] = useState<PublicFormPayload | null>(null);
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    const title =
      settings?.introTitle || event?.title || form?.title || 'Registration';
    const subtitle =
      settings?.introSubtitle ||
      event?.description ||
      form?.description ||
      'Complete the form below to continue.';
    const eyebrow = formatFormTypeLabel(settings?.formType);
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
      eyebrow,
      detailItems,
      detailSubtexts,
      headerNote,
      sections,
      successTitle,
      successSubtitle,
      successMessage,
    };
  }, [event, form]);

  const handleChange = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
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
      await apiClient.submitPublicForm(formSlug, { values: answers });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Section padding="sm" className="relative overflow-hidden">
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

        <Container size="xl" className="relative z-10 py-8 sm:py-12">
          <div className="h-24 sm:h-28" aria-hidden />
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#0b0b0b]">
        <Container size="md">
          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
              Loading form...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
              {error}
            </div>
          )}

          {!loading && form && !submitted && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <H3 className="text-2xl font-semibold">{form.title}</H3>
                {form.description && (
                  <BodySM className="text-white/70">{form.description}</BodySM>
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

              <div className="grid grid-cols-1 gap-5">
                {form.fields
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map(field => {
                    const value = answers[field.key];

                    if (field.type === 'textarea') {
                      return (
                        <label key={field.key} className="space-y-2">
                          <span className={labelClass}>
                            {field.label}
                            {field.required && (
                              <span className="text-yellow-300"> *</span>
                            )}
                          </span>
                          <textarea
                            className={`${fieldBaseClass} min-h-[120px]`}
                            placeholder={field.placeholder}
                            required={field.required}
                            value={value || ''}
                            onChange={e =>
                              handleChange(field.key, e.target.value)
                            }
                          />
                        </label>
                      );
                    }

                    if (field.type === 'select') {
                      return (
                        <label key={field.key} className="space-y-2">
                          <span className={labelClass}>
                            {field.label}
                            {field.required && (
                              <span className="text-yellow-300"> *</span>
                            )}
                          </span>
                          <select
                            className={fieldBaseClass}
                            required={field.required}
                            value={value || ''}
                            onChange={e =>
                              handleChange(field.key, e.target.value)
                            }
                          >
                            <option value="" disabled>
                              {field.placeholder || 'Select an option'}
                            </option>
                            {field.options?.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      );
                    }

                    if (field.type === 'radio') {
                      return (
                        <fieldset key={field.key} className="space-y-2">
                          <legend className={labelClass}>
                            {field.label}
                            {field.required && (
                              <span className="text-yellow-300"> *</span>
                            )}
                          </legend>
                          <div className="flex flex-wrap gap-3">
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
                        </fieldset>
                      );
                    }

                    if (field.type === 'checkbox' && field.options?.length) {
                      const currentValues = Array.isArray(value) ? value : [];
                      return (
                        <fieldset key={field.key} className="space-y-2">
                          <legend className={labelClass}>
                            {field.label}
                            {field.required && (
                              <span className="text-yellow-300"> *</span>
                            )}
                          </legend>
                          <div className="flex flex-wrap gap-3">
                            {field.options.map(option => (
                              <label
                                key={option.value}
                                className="flex items-center gap-2 text-sm text-white/80"
                              >
                                <input
                                  type="checkbox"
                                  checked={currentValues.includes(option.value)}
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
                        </fieldset>
                      );
                    }

                    if (field.type === 'checkbox') {
                      return (
                        <label
                          key={field.key}
                          className="flex items-center gap-2 text-sm text-white/80"
                        >
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
                      );
                    }

                    const inputType =
                      field.type === 'number' ? 'number' : field.type;

                    return (
                      <label key={field.key} className="space-y-2">
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
                          required={field.required}
                          value={value || ''}
                          onChange={e =>
                            handleChange(field.key, e.target.value)
                          }
                        />
                      </label>
                    );
                  })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
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
        </Container>
      </Section>
    </div>
  );
}
