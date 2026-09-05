'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';

import apiClient, { isApiError } from '@/lib/api';
import type {
  EventPublic,
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
import {
  imageFieldHasBlockingError,
  imageFieldIsBusy,
  isImageFieldValue,
  resolveImageSubmissionValue,
  type ConsentContent,
} from '@/shared/ui/forms';

/* ============================================================================
   usePublicFormEngine — the one place that knows how to load, validate, and
   submit a published public form.

   Every surface that renders a public form (the standalone `/forms/[slug]`
   page, and any in-page modal such as the Children's Ministry registration
   modal) shares this exact hook, so they always load the same form
   definition from the admin form builder and post to the same
   `/forms/{slug}/submissions` endpoint on the backend — one source of truth,
   no forked copy of the validation rules to keep in sync.
============================================================================ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export interface PublicFormEngine {
  form: PublicFormPayload | null;
  event: EventPublic | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitted: boolean;
  draftRestored: boolean;
  answers: Record<string, unknown>;
  fieldErrors: Record<string, string>;
  consentAccepted: boolean;
  setConsentAccepted: (value: boolean) => void;
  consentError: string;
  setConsentError: (value: string) => void;
  presentation: {
    title: string;
    subtitle: string;
    detailItems: string[];
    detailSubtexts: string[];
    headerNote: string;
    sections: import('@/lib/apiTypes').PublicFormContentSection[];
    successTitle: string;
    successSubtitle: string;
    successMessage: string;
  };
  consent: ConsentContent;
  visibleFields: PublicFormField[];
  progress: number;
  metaChips: string[];
  hasIntro: boolean;
  submitLabel: string;
  handleChange: (key: string, value: unknown) => void;
  handleSubmit: (eventSubmit: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function usePublicFormEngine(
  formSlug: string | undefined
): PublicFormEngine {
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
  // drop, or an accidental close never loses what they entered.
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
      clearFormDraft(formSlug);
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

  const hasIntro =
    presentation.detailItems.length > 0 || presentation.sections.length > 0;

  const submitLabel = form?.settings?.submitButtonText?.trim() || 'Submit form';

  return {
    form,
    event,
    loading,
    error,
    submitting,
    submitted,
    draftRestored,
    answers,
    fieldErrors,
    consentAccepted,
    setConsentAccepted,
    consentError,
    setConsentError,
    presentation,
    consent,
    visibleFields,
    progress,
    metaChips,
    hasIntro,
    submitLabel,
    handleChange,
    handleSubmit,
  };
}
