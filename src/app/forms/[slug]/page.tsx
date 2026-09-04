'use client';

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

import apiClient, { isApiError } from '@/lib/api';
import type {
  EventPublic,
  PublicFormContentSection,
  PublicFormContentSectionItem,
  PublicFormField,
  PublicFormPayload,
} from '@/lib/apiTypes';
import { isValidNationalPhone } from '@/lib/validation/phone';
import { isFieldVisible } from '@/lib/forms/conditionalVisibility';
import {
  applyTemplateVars,
  countWords,
  isPhoneLikeField,
  parseDDMM,
  resolveMaxWords,
  splitE164,
} from '@/lib/forms/fieldValue';
import {
  clearFormDraft,
  readFormDraft,
  writeFormDraft,
} from '@/lib/forms/formDraft';
import { Button } from '@/shared/ui/button';
import { Notice } from '@/shared/ui/layout';
import {
  CheckboxField,
  CheckboxGroupField,
  ConsentDisclosure,
  DateField,
  FormShell,
  FormSuccess,
  ImageField,
  PhoneField,
  RadioGroupField,
  SelectField,
  TextField,
  TextareaField,
  imageFieldHasBlockingError,
  imageFieldIsBusy,
  isImageFieldValue,
  resolveImageSubmissionValue,
  type ConsentContent,
} from '@/shared/ui/forms';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_GRID_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
};

const FIELD_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.19, 1, 0.22, 1] as const },
  },
};

function estimateMinutes(fieldCount: number): number {
  return Math.max(1, Math.round(fieldCount * 0.4));
}

function fieldHasValue(field: PublicFormField, value: unknown): boolean {
  if (field.type === 'image') {
    return (
      isImageFieldValue(value) &&
      (value.status === 'done' || value.status === 'uploading')
    );
  }
  if (field.type === 'checkbox' && field.options?.length) {
    return Array.isArray(value) && value.length > 0;
  }
  if (field.type === 'checkbox') return Boolean(value);
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
}

export default function PublicFormPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

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
  const [draftRestored, setDraftRestored] = useState(false);

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
              : field.type === 'image'
                ? null
                : '';
        });

        const draft = readFormDraft(formSlug);
        if (draft) setDraftRestored(true);

        setAnswers(current => ({ ...defaults, ...draft, ...current }));
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

  // Mirror answers to the device as the member types — a refresh, a network
  // drop, or an accidental tab close never loses what they entered.
  useEffect(() => {
    if (!formSlug || loading || submitted) return undefined;

    const timer = window.setTimeout(() => {
      writeFormDraft(formSlug, answers);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [formSlug, answers, loading, submitted]);

  const presentation = useMemo(() => {
    const settings = form?.settings;
    const formTitle = form?.title || 'Form';

    const title = isTestimonialForm
      ? form?.title || 'Share your testimony'
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

  const consent: ConsentContent = useMemo(() => {
    const source = form?.settings?.consent;
    return {
      title: source?.title || 'How we handle your information',
      introduction:
        source?.introduction ||
        'The Wisdom Church uses the details you provide to process this submission, stay in touch about it, and keep accurate church records.',
      purposes: source?.purposes?.length
        ? source.purposes
        : [
            'Process and manage this submission.',
            'Contact you about updates and actions you requested.',
            'Maintain proportionate church administration and safeguarding records where applicable.',
          ],
      dataUse:
        source?.dataUse ||
        'Access is limited to authorised church personnel who need it for these purposes. Personal information is never sold.',
      retention:
        source?.retention ||
        'Kept only while reasonably needed for its stated purpose and any legal, safeguarding, or administrative obligations.',
      rights:
        source?.rights ||
        'You may request access or correction and, where applicable, deletion, restriction, or withdrawal of consent.',
      contact:
        source?.contact ||
        'Contact the church administration team through the official church contact details for any privacy question.',
      acknowledgementLabel:
        source?.acknowledgementLabel ||
        'I have read and understood this notice, confirm my information is accurate, and consent to its use for the purposes described.',
      version: source?.version || '2026.1',
    };
  }, [form?.settings?.consent]);

  const sortedFields = useMemo(() => {
    return (form?.fields || []).slice().sort((a, b) => a.order - b.order);
  }, [form?.fields]);

  const visibleFields = useMemo(() => {
    return sortedFields.filter(field => isFieldVisible(field, answers));
  }, [answers, sortedFields]);

  const progress = useMemo(() => {
    const required = visibleFields.filter(field => field.required);
    const tracked = required.length > 0 ? required : visibleFields;
    if (tracked.length === 0) return 0;
    const done = tracked.filter(field =>
      fieldHasValue(field, answers[field.key])
    ).length;
    return done / tracked.length;
  }, [visibleFields, answers]);

  const metaChips = useMemo(() => {
    const count = visibleFields.length;
    return [
      `${count} question${count === 1 ? '' : 's'}`,
      `about ${estimateMinutes(count)} min`,
    ];
  }, [visibleFields.length]);

  const handleChange = (key: string, value: unknown) => {
    setAnswers(current => ({ ...current, [key]: value }));
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
          'Please review and accept the privacy notice before submitting.'
        );
        setSubmitting(false);
        return;
      }

      for (const field of visibleFields) {
        const rawValue = answers[field.key];

        if (field.type === 'image') {
          if (imageFieldIsBusy(rawValue)) {
            nextFieldErrors[field.key] =
              'Please wait for the image to finish uploading.';
            continue;
          }
          if (imageFieldHasBlockingError(rawValue)) {
            nextFieldErrors[field.key] =
              'Choose a valid JPEG, PNG, or WebP image (5MB max).';
            continue;
          }

          const resolved = await resolveImageSubmissionValue(rawValue);
          if (!resolved) {
            if (field.required) {
              nextFieldErrors[field.key] = `${field.label} is required`;
            }
            continue;
          }
          payloadValues[field.key] = resolved;
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

        if (field.type === 'email' && !EMAIL_RE.test(value)) {
          nextFieldErrors[field.key] = 'Enter a valid email address';
          continue;
        }

        if (isPhoneLikeField(field)) {
          const parsedPhone = splitE164(value);
          if (
            !parsedPhone ||
            !isValidNationalPhone(parsedPhone.national, parsedPhone.country)
          ) {
            nextFieldErrors[field.key] =
              'Enter a valid phone number with country code, e.g. +2348012345678';
            continue;
          }
        }

        if (field.type === 'date' && !parseDDMM(value)) {
          nextFieldErrors[field.key] = 'Choose a valid day and month';
          continue;
        }

        const maxWords = resolveMaxWords(field);
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
    const shared = {
      field,
      value: answers[field.key],
      error: fieldErrors[field.key],
      onChange: (value: unknown) => handleChange(field.key, value),
    };

    let control: ReactNode;
    if (field.type === 'textarea') control = <TextareaField {...shared} />;
    else if (field.type === 'select') control = <SelectField {...shared} />;
    else if (field.type === 'radio') control = <RadioGroupField {...shared} />;
    else if (field.type === 'checkbox' && field.options?.length)
      control = <CheckboxGroupField {...shared} />;
    else if (field.type === 'checkbox') control = <CheckboxField {...shared} />;
    else if (field.type === 'image')
      control = (
        <ImageField
          field={field}
          value={shared.value}
          error={shared.error}
          onChange={shared.onChange}
        />
      );
    else if (field.type === 'date') control = <DateField {...shared} />;
    else if (isPhoneLikeField(field)) control = <PhoneField {...shared} />;
    else control = <TextField {...shared} />;

    return (
      <motion.div
        key={field.key}
        layout={!reduceMotion}
        variants={FIELD_ITEM_VARIANTS}
      >
        {control}
      </motion.div>
    );
  };

  const hasIntro =
    presentation.detailItems.length > 0 || presentation.sections.length > 0;

  const submitLabel = form?.settings?.submitButtonText?.trim() || 'Submit form';

  const actionBar = (
    <div className="flex flex-col gap-2">
      <Button
        type="submit"
        form="public-form"
        variant="primary"
        size="lg"
        loading={submitting}
        fullWidth
      >
        {submitting ? 'Submitting…' : submitLabel}
      </Button>
      <p className="text-center font-ui text-caption text-[var(--app-subtle)]">
        We will follow up using the details you provide.
      </p>
    </div>
  );

  if (loading) {
    return (
      <FormShell
        title="Loading form…"
        subtitle="One moment while we fetch this form."
      >
        <div className="space-y-3">
          {[0, 1, 2, 3].map(row => (
            <div
              key={row}
              className="h-16 animate-pulse rounded-input bg-[var(--app-canvas-2)]"
            />
          ))}
        </div>
      </FormShell>
    );
  }

  if (error && !form) {
    return (
      <FormShell
        title="This form could not load"
        subtitle="Please check the link and try again."
      >
        <Notice status="error">{error}</Notice>
      </FormShell>
    );
  }

  if (!form) return null;

  return (
    <>
      <FormShell
        title={presentation.title}
        subtitle={presentation.subtitle}
        metaChips={metaChips}
        progress={progress}
        actionBar={actionBar}
        coverImageUrl={form.settings?.coverImageUrl}
      >
        <form id="public-form" onSubmit={handleSubmit} className="space-y-8">
          {presentation.headerNote ? (
            <Notice status="brand">{presentation.headerNote}</Notice>
          ) : null}

          {hasIntro ? (
            <div className="space-y-4 rounded-card border border-[var(--app-border)] bg-[var(--app-canvas)] p-5 sm:p-6">
              {presentation.detailItems.length > 0 ? (
                <ul className="space-y-3">
                  {presentation.detailItems.map(
                    (item: string, index: number) => (
                      <li key={`${item}-${index}`}>
                        <p className="font-ui text-body-sm font-semibold text-[var(--app-ink)]">
                          {item}
                        </p>
                        {presentation.detailSubtexts[index] ? (
                          <p className="mt-1 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
                            {presentation.detailSubtexts[index]}
                          </p>
                        ) : null}
                      </li>
                    )
                  )}
                </ul>
              ) : null}

              {presentation.sections.map(
                (section: PublicFormContentSection) => (
                  <section key={section.id || section.title}>
                    <h2 className="font-ui text-body-md font-semibold text-[var(--app-ink)]">
                      {section.title}
                    </h2>
                    {section.subtitle ? (
                      <p className="mt-1 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
                        {section.subtitle}
                      </p>
                    ) : null}
                    {Array.isArray(section.items) &&
                    section.items.length > 0 ? (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {section.items.map(
                          (
                            item: PublicFormContentSectionItem,
                            index: number
                          ) => (
                            <div
                              key={`${section.title}-${item.title}-${index}`}
                              className="rounded-input border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
                            >
                              {item.eyebrow ? (
                                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.16em] text-[var(--app-primary-dark)]">
                                  {item.eyebrow}
                                </p>
                              ) : null}
                              <p className="mt-1 font-ui text-body-sm font-semibold text-[var(--app-ink)]">
                                {item.title}
                              </p>
                              {item.body ? (
                                <p className="mt-1.5 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
                                  {item.body}
                                </p>
                              ) : null}
                              {item.linkText && item.linkUrl ? (
                                <a
                                  href={item.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex font-ui text-body-sm font-semibold text-[var(--app-primary-dark)] hover:underline"
                                >
                                  {item.linkText}
                                </a>
                              ) : null}
                            </div>
                          )
                        )}
                      </div>
                    ) : null}
                  </section>
                )
              )}
            </div>
          ) : null}

          <motion.div
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            variants={FIELD_GRID_VARIANTS}
            className="flex flex-col gap-5"
          >
            {visibleFields.map(renderField)}
          </motion.div>

          <ConsentDisclosure
            consent={consent}
            accepted={consentAccepted}
            onAcceptedChange={value => {
              setConsentAccepted(value);
              if (value) setConsentError('');
            }}
            error={consentError}
          />

          {error ? <Notice status="error">{error}</Notice> : null}

          <div className="hidden border-t border-[var(--app-border)] pt-6 sm:block">
            {actionBar}
          </div>
        </form>
      </FormShell>

      <FormSuccess
        open={!loading && submitted}
        onClose={() => router.push(returnPath)}
        title={presentation.successTitle}
        subtitle={presentation.successSubtitle || undefined}
        message={presentation.successMessage}
        primaryLabel={returnLabel}
        onPrimary={() => router.push(returnPath)}
      />
    </>
  );
}
