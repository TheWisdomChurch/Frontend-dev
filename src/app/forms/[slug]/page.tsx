'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Section, Container } from '@/components/layout';
import { H2, H3, BodyMD, BodySM, SmallText } from '@/components/text';
import { EventBannerDesktop, EventBannerMobile } from '@/components/assets';
import apiClient from '@/lib/api';
import { PublicFormPayload, EventPublic,PublicFormField } from '@/lib';
import { Calendar, MapPin } from 'lucide-react';

const fieldBaseClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/60 transition';

const labelClass = 'text-sm font-semibold text-white/80';

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
        const [formData, eventsData] = await Promise.all([
          apiClient.getPublicForm(formSlug),
          apiClient.listEvents().catch(() => [] as EventPublic[]),
        ]);

        if (!mounted) return;

        setForm(formData);

        setEvent(
          Array.isArray(eventsData)
            ? eventsData.find(evt => evt.formSlug === formSlug) || null
            : null
        );

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
        setError(err?.message || 'Unable to load form. Please try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [formSlug]);

  const eventMeta = useMemo(() => {
    if (!event) return null;
    const date = event.startAt ? new Date(event.startAt).toLocaleString() : '';
    return { date, location: event.location || '' };
  }, [event]);

  const handleChange = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxOption = (key: string, optionValue: string, checked: boolean) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      if (checked) return { ...prev, [key]: [...current, optionValue] };
      return { ...prev, [key]: current.filter((item: string) => item !== optionValue) };
    });
  };

  const handleSubmit = async (eventSubmit: React.FormEvent<HTMLFormElement>) => {
    eventSubmit.preventDefault();
    if (!formSlug || !form) return;

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.submitPublicForm(formSlug, { answers });
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
          <div className="max-w-3xl space-y-3">
            <SmallText className="uppercase tracking-[0.22em] text-white/70">
              Event Registration
            </SmallText>

            <H2 className="text-3xl sm:text-4xl font-black">
              {event?.title || form?.title || 'Event Registration'}
            </H2>

            <BodyMD className="text-white/80">
              {event?.description ||
                form?.description ||
                'Complete the form below to reserve your spot.'}
            </BodyMD>

            {eventMeta && (
              <div className="flex flex-wrap items-center gap-4 text-white/75 text-sm">
                {eventMeta.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-300" />
                    <span>{eventMeta.date}</span>
                  </div>
                )}
                {eventMeta.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-300" />
                    <span>{eventMeta.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>
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
              </div>

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
                            {field.required && <span className="text-yellow-300"> *</span>}
                          </span>
                          <textarea
                            className={`${fieldBaseClass} min-h-[120px]`}
                            placeholder={field.placeholder}
                            required={field.required}
                            value={value || ''}
                            onChange={e => handleChange(field.key, e.target.value)}
                          />
                        </label>
                      );
                    }

                    if (field.type === 'select') {
                      return (
                        <label key={field.key} className="space-y-2">
                          <span className={labelClass}>
                            {field.label}
                            {field.required && <span className="text-yellow-300"> *</span>}
                          </span>
                          <select
                            className={fieldBaseClass}
                            required={field.required}
                            value={value || ''}
                            onChange={e => handleChange(field.key, e.target.value)}
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
                            {field.required && <span className="text-yellow-300"> *</span>}
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
                                  onChange={e => handleChange(field.key, e.target.value)}
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
                            {field.required && <span className="text-yellow-300"> *</span>}
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
                                    handleCheckboxOption(field.key, option.value, e.target.checked)
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
                            onChange={e => handleChange(field.key, e.target.checked)}
                            className="accent-yellow-400"
                          />
                          <span>
                            {field.label}
                            {field.required && <span className="text-yellow-300"> *</span>}
                          </span>
                        </label>
                      );
                    }

                    const inputType = field.type === 'number' ? 'number' : field.type;

                    return (
                      <label key={field.key} className="space-y-2">
                        <span className={labelClass}>
                          {field.label}
                          {field.required && <span className="text-yellow-300"> *</span>}
                        </span>
                        <input
                          type={inputType}
                          className={fieldBaseClass}
                          placeholder={field.placeholder}
                          required={field.required}
                          value={value || ''}
                          onChange={e => handleChange(field.key, e.target.value)}
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
              Your response has been received. Thank you for registering!
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
