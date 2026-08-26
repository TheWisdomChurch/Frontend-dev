'use client';

import { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  HeartHandshake,
  Lock,
  MessageCircle,
  User,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/shared/utils/buttons';
import { BaseModal } from '@/shared/ui/modals/Base';
import { EditorialContainer, EditorialSection } from '@/shared/ui/editorial';
import { apiClient } from '@/lib/api';
import { PhoneNumberField } from '@/shared/ui/forms';
import {
  DEFAULT_PHONE_COUNTRY,
  isValidNationalPhone,
  toE164,
} from '@/lib/validation/phone';
import type { CountryCode } from 'libphonenumber-js';

// Pastoral care covers three genuinely different requests, each hitting its
// own backend shape — a dedicated prayer-requests endpoint, and a
// pastoral-care endpoint shared by counseling and event/officiant bookings
// (no separate backend route for those two yet). Picking an intent below
// swaps both the visible fields and which endpoint gets called, all without
// ever leaving this page.
type Intent = 'prayer' | 'counseling' | 'event';

const INTENTS: {
  id: Intent;
  label: string;
  short: string;
  description: string;
  icon: typeof HeartHandshake;
}[] = [
  {
    id: 'prayer',
    label: 'Prayer Request',
    short: 'Prayer',
    description: 'Ask our prayer team to stand with you on something.',
    icon: HeartHandshake,
  },
  {
    id: 'counseling',
    label: 'Confidential Counseling',
    short: 'Counseling',
    description: 'Talk privately with a pastor about what you are facing.',
    icon: Lock,
  },
  {
    id: 'event',
    label: 'Weddings & Occasions',
    short: 'Occasions',
    description:
      'Request a minister for your wedding, dedication, or special occasion.',
    icon: Calendar,
  },
];

const PRAYER_CATEGORIES = [
  'Healing',
  'Family & Relationships',
  'Guidance & Direction',
  'Provision & Finances',
  'Thanksgiving',
  'Salvation',
  'Other',
];

const EVENT_TYPES = [
  'Wedding Ceremony',
  'Home Opening / Warming',
  'Book Launch',
  'Naming Ceremony',
  'Birthday Celebration',
  'Child Dedication',
  'Funeral Service',
  'Thanksgiving Service',
  'Anniversary Celebration',
  'Other Special Event',
];

const CHURCH_ROLES = [
  'Officiating Minister',
  'Guest Minister',
  'Prayer Partner',
  'Worship Leader',
  'Event Coordinator',
  'Custom Role',
];

const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Pastor'];

interface PrayerFormState {
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  request: string;
  isAnonymous: boolean;
}

const initialPrayerForm: PrayerFormState = {
  firstName: '',
  lastName: '',
  email: '',
  category: '',
  request: '',
  isAnonymous: false,
};

interface CareFormState {
  title: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  contactAddress: string;
  eventDate: string;
  eventType: string;
  churchRole: string;
  customRole: string;
  comments: string;
}

const initialCareForm: CareFormState = {
  title: '',
  firstName: '',
  lastName: '',
  contactNumber: '',
  email: '',
  contactAddress: '',
  eventDate: '',
  eventType: '',
  churchRole: '',
  customRole: '',
  comments: '',
};

type PrayerErrors = Partial<Record<keyof PrayerFormState, string>>;
type CareErrors = Partial<Record<keyof CareFormState, string>>;

/* ── Field styles — match the flat, gold-accented input language used
   across every other form on the site (JoinUs, HeroHighlights) ───── */

const fieldInput =
  'w-full border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/45 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-[var(--app-primary)]/12';

const fieldInputError =
  'w-full border border-[var(--status-error)]/50 bg-[var(--status-error)]/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[var(--status-error)] focus:ring-2 focus:ring-[var(--status-error)]/20';

const fieldSelect =
  'w-full border border-white/12 bg-[var(--app-dark-input)] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-2 focus:ring-[var(--app-primary)]/12';

const fieldSelectError =
  'w-full border border-[var(--status-error)]/50 bg-[var(--app-dark-input)] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--status-error)] focus:ring-2 focus:ring-[var(--status-error)]/20';

const fieldLabel =
  'block font-ui text-caption font-bold uppercase tracking-[0.15em] text-white/45';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 font-ui text-label text-[var(--status-error)]">
      {message}
    </p>
  );
}

function getMinDate() {
  return new Date().toISOString().split('T')[0];
}
function getMaxDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

const SUCCESS_COPY: Record<Intent, { title: string; subtitle: string }> = {
  prayer: {
    title: 'Prayer request received',
    subtitle: 'Our prayer team has your request and is standing with you.',
  },
  counseling: {
    title: 'Request received',
    subtitle:
      "We've emailed a confirmation. A pastor will reach out privately.",
  },
  event: {
    title: 'Request received',
    subtitle:
      "We've emailed a confirmation. Our pastoral team is honored to be part of your moment.",
  },
};

const PastoralCareForm = () => {
  const searchParams = useSearchParams();
  const requestedIntent = searchParams.get('intent');
  const initialIntent: Intent =
    requestedIntent === 'prayer' ||
    requestedIntent === 'counseling' ||
    requestedIntent === 'event'
      ? requestedIntent
      : 'prayer';

  const [intent, setIntent] = useState<Intent>(initialIntent);
  const formRef = useRef<HTMLDivElement>(null);

  const [prayerForm, setPrayerForm] =
    useState<PrayerFormState>(initialPrayerForm);
  const [careForm, setCareForm] = useState<CareFormState>(initialCareForm);
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(
    DEFAULT_PHONE_COUNTRY
  );
  const [showCustomRole, setShowCustomRole] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [prayerErrors, setPrayerErrors] = useState<PrayerErrors>({});
  const [careErrors, setCareErrors] = useState<CareErrors>({});

  const selectIntent = useCallback((next: Intent) => {
    setIntent(next);
    setSubmitError('');
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const updatePrayerField = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setPrayerForm(prev => ({ ...prev, [name]: value }));
      setPrayerErrors(prev =>
        prev[name as keyof PrayerFormState]
          ? { ...prev, [name]: undefined }
          : prev
      );
    },
    []
  );

  const updateCareField = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setCareForm(prev => ({ ...prev, [name]: value }));
      setCareErrors(prev =>
        prev[name as keyof CareFormState]
          ? { ...prev, [name]: undefined }
          : prev
      );
      if (name === 'churchRole') setShowCustomRole(value === 'Custom Role');
    },
    []
  );

  const handlePrayerSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError('');

      const nextErrors: PrayerErrors = {};
      if (!prayerForm.firstName.trim())
        nextErrors.firstName = 'This field is required.';
      if (!prayerForm.lastName.trim())
        nextErrors.lastName = 'This field is required.';
      if (!prayerForm.request.trim())
        nextErrors.request = 'Let us know what to pray for.';

      if (Object.keys(nextErrors).length > 0) {
        setPrayerErrors(nextErrors);
        setSubmitError(
          'Please complete all required fields before submitting.'
        );
        return;
      }

      setPrayerErrors({});
      setIsSubmitting(true);
      try {
        await apiClient.submitPrayerRequest({
          firstName: prayerForm.firstName,
          lastName: prayerForm.lastName,
          email: prayerForm.email || undefined,
          category: prayerForm.category || undefined,
          request: prayerForm.request,
          isAnonymous: prayerForm.isAnonymous,
        });
        setPrayerForm(initialPrayerForm);
        setShowSuccess(true);
      } catch (error: unknown) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'We could not submit your request right now. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [prayerForm]
  );

  const handleCareSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError('');

      const isCounseling = intent === 'counseling';
      const requiredFields: Array<keyof CareFormState> = isCounseling
        ? ['title', 'firstName', 'lastName', 'contactNumber', 'email']
        : [
            'title',
            'firstName',
            'lastName',
            'contactNumber',
            'email',
            'contactAddress',
            'eventDate',
            'eventType',
            'churchRole',
          ];

      const nextErrors: CareErrors = {};
      requiredFields.forEach(field => {
        if (!String(careForm[field] || '').trim()) {
          nextErrors[field] = 'This field is required.';
        }
      });
      if (showCustomRole && !careForm.customRole.trim()) {
        nextErrors.customRole = 'Please provide your custom role.';
      }
      if (
        careForm.contactNumber &&
        !isValidNationalPhone(careForm.contactNumber, phoneCountry)
      ) {
        nextErrors.contactNumber =
          'Enter a valid phone number for the selected country.';
      }

      if (Object.keys(nextErrors).length > 0) {
        setCareErrors(nextErrors);
        setSubmitError(
          'Please complete all required fields before submitting.'
        );
        return;
      }

      setCareErrors({});
      setIsSubmitting(true);
      try {
        await apiClient.submitPastoralCareRequest({
          title: careForm.title,
          firstName: careForm.firstName,
          lastName: careForm.lastName,
          contactNumber:
            toE164(careForm.contactNumber, phoneCountry) ||
            careForm.contactNumber,
          email: careForm.email,
          contactAddress: careForm.contactAddress,
          eventDate: careForm.eventDate,
          eventType: isCounseling ? 'Counseling Session' : careForm.eventType,
          churchRole: isCounseling ? 'Prayer Partner' : careForm.churchRole,
          customRole: showCustomRole ? careForm.customRole : undefined,
          comments: careForm.comments,
          sourceChannel: isCounseling
            ? 'frontend:web:pastoral-care:counseling'
            : 'frontend:web:pastoral-care:event',
        });
        setCareForm(initialCareForm);
        setPhoneCountry(DEFAULT_PHONE_COUNTRY);
        setShowCustomRole(false);
        setShowSuccess(true);
      } catch (error: unknown) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'We could not submit your request right now. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [careForm, intent, phoneCountry, showCustomRole]
  );

  const isCounseling = intent === 'counseling';
  const isEvent = intent === 'event';
  const successCopy = SUCCESS_COPY[intent];

  return (
    <EditorialSection
      tone="dark"
      className="overflow-hidden border-b border-white/8"
    >
      <EditorialContainer>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Pastoral care
          </p>
          <h2 className="mt-4 font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-lg">
            Tell us how we can help.
          </h2>
          <p className="mt-5 font-ui text-body-sm leading-[2] text-white/68">
            Share what&apos;s on your heart below. Your request goes straight to
            our pastoral team.
          </p>
        </div>

        {/* Intent selector */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          {INTENTS.map(opt => {
            const Icon = opt.icon;
            const active = intent === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => selectIntent(opt.id)}
                aria-pressed={active}
                className={`group flex flex-col items-start gap-2.5 border p-5 text-left transition duration-200 ${
                  active
                    ? 'border-[var(--app-primary)] bg-[var(--app-primary)]/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                    active
                      ? 'border-[var(--app-primary)] bg-[var(--app-primary)] text-black'
                      : 'border-white/15 text-white/55 group-hover:border-white/30'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={`font-ui text-sm font-bold ${active ? 'text-[var(--app-primary)]' : 'text-white'}`}
                >
                  {opt.label}
                </span>
                <span className="font-ui text-label leading-[1.6] text-white/50">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form card */}
        <div
          ref={formRef}
          className="mx-auto mt-10 max-w-2xl scroll-mt-24 border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:p-10"
        >
          <div className="mb-8 text-center">
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
              {INTENTS.find(i => i.id === intent)?.short}
            </p>
            {isCounseling && (
              <p className="mt-4 inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-4 py-2 font-ui text-label text-white/60">
                <Lock className="h-3.5 w-3.5 flex-none text-[var(--app-primary)]" />
                Confidential — only our pastoral team will see this.
              </p>
            )}
          </div>

          {intent === 'prayer' ? (
            <form onSubmit={handlePrayerSubmit} className="space-y-8">
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 border-b border-white/8 pb-4">
                  <User className="h-4 w-4 text-[var(--app-primary)]" />
                  <p className="font-ui text-label font-bold uppercase tracking-[0.14em] text-white/70">
                    Your information
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>First name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={prayerForm.firstName}
                      onChange={updatePrayerField}
                      placeholder="Enter your first name"
                      className={`mt-2 ${prayerErrors.firstName ? fieldInputError : fieldInput}`}
                    />
                    <FieldError message={prayerErrors.firstName} />
                  </div>
                  <div>
                    <label className={fieldLabel}>Last name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={prayerForm.lastName}
                      onChange={updatePrayerField}
                      placeholder="Enter your last name"
                      className={`mt-2 ${prayerErrors.lastName ? fieldInputError : fieldInput}`}
                    />
                    <FieldError message={prayerErrors.lastName} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={fieldLabel}>
                      Email address (optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={prayerForm.email}
                      onChange={updatePrayerField}
                      placeholder="Only if you'd like a response"
                      className={`mt-2 ${fieldInput}`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5 border-t border-white/8 pt-6">
                <div className="flex items-center gap-2.5 border-b border-white/8 pb-4">
                  <HeartHandshake className="h-4 w-4 text-[var(--app-primary)]" />
                  <p className="font-ui text-label font-bold uppercase tracking-[0.14em] text-white/70">
                    Your request
                  </p>
                </div>
                <div>
                  <label htmlFor="category" className={fieldLabel}>
                    What is this about? (optional)
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={prayerForm.category}
                    onChange={updatePrayerField}
                    className={`mt-2 ${fieldSelect}`}
                  >
                    <option value="">Select a category</option>
                    {PRAYER_CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Your prayer request *</label>
                  <textarea
                    name="request"
                    value={prayerForm.request}
                    onChange={updatePrayerField}
                    placeholder="Share as much or as little as you're comfortable with…"
                    rows={5}
                    className={`mt-2 resize-none ${prayerErrors.request ? fieldInputError : fieldInput}`}
                  />
                  <FieldError message={prayerErrors.request} />
                </div>
                <label className="flex items-center gap-2.5 font-ui text-label text-white/60">
                  <input
                    type="checkbox"
                    checked={prayerForm.isAnonymous}
                    onChange={e =>
                      setPrayerForm(prev => ({
                        ...prev,
                        isAnonymous: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-white/20 accent-[var(--app-primary)]"
                  />
                  Keep my request anonymous to the prayer team
                </label>
              </div>

              <div className="border-t border-white/8 pt-6">
                {submitError && (
                  <div className="mb-4 border border-[var(--status-error)]/40 bg-[var(--status-error)]/10 px-4 py-3 font-ui text-body-sm text-[var(--status-error)]">
                    {submitError}
                  </div>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="h-12 w-full font-ui text-body-sm font-bold"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit prayer request'}
                </Button>
                <p className="mt-4 text-center font-ui text-label leading-[1.7] text-white/45">
                  Our prayer team reviews every request as it comes in.
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCareSubmit} className="space-y-8">
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 border-b border-white/8 pb-4">
                  <User className="h-4 w-4 text-[var(--app-primary)]" />
                  <p className="font-ui text-label font-bold uppercase tracking-[0.14em] text-white/70">
                    Personal information
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="title" className={fieldLabel}>
                      Title *
                    </label>
                    <select
                      id="title"
                      name="title"
                      value={careForm.title}
                      onChange={updateCareField}
                      className={`mt-2 ${careErrors.title ? fieldSelectError : fieldSelect}`}
                    >
                      <option value="">Select title</option>
                      {TITLES.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <FieldError message={careErrors.title} />
                  </div>
                  <div>
                    <label className={fieldLabel}>First name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={careForm.firstName}
                      onChange={updateCareField}
                      placeholder="Enter your first name"
                      className={`mt-2 ${careErrors.firstName ? fieldInputError : fieldInput}`}
                    />
                    <FieldError message={careErrors.firstName} />
                  </div>
                  <div>
                    <label className={fieldLabel}>Last name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={careForm.lastName}
                      onChange={updateCareField}
                      placeholder="Enter your last name"
                      className={`mt-2 ${careErrors.lastName ? fieldInputError : fieldInput}`}
                    />
                    <FieldError message={careErrors.lastName} />
                  </div>
                  <PhoneNumberField
                    id="pastoral-phone"
                    label="Contact number"
                    required
                    country={phoneCountry}
                    number={careForm.contactNumber}
                    onCountryChange={setPhoneCountry}
                    onNumberChange={contactNumber => {
                      setCareForm(prev => ({ ...prev, contactNumber }));
                      setCareErrors(prev => ({
                        ...prev,
                        contactNumber: undefined,
                      }));
                    }}
                    inputClassName={
                      careErrors.contactNumber ? fieldInputError : fieldInput
                    }
                    labelClassName={fieldLabel}
                    selectClassName={
                      careErrors.contactNumber ? fieldSelectError : fieldSelect
                    }
                    error={careErrors.contactNumber}
                  />
                  <div>
                    <label className={fieldLabel}>Email address *</label>
                    <input
                      type="email"
                      name="email"
                      value={careForm.email}
                      onChange={updateCareField}
                      placeholder="Enter your email address"
                      className={`mt-2 ${careErrors.email ? fieldInputError : fieldInput}`}
                    />
                    <FieldError message={careErrors.email} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={fieldLabel}>
                      {isCounseling
                        ? 'Where would you prefer to meet? (optional)'
                        : 'Contact address *'}
                    </label>
                    <input
                      type="text"
                      name="contactAddress"
                      value={careForm.contactAddress}
                      onChange={updateCareField}
                      placeholder={
                        isCounseling
                          ? 'In person, phone, or video call — up to you'
                          : 'Enter your complete address'
                      }
                      className={`mt-2 ${careErrors.contactAddress ? fieldInputError : fieldInput}`}
                    />
                    <FieldError message={careErrors.contactAddress} />
                  </div>
                </div>
              </div>

              {isEvent && (
                <div className="space-y-5 border-t border-white/8 pt-6">
                  <div className="flex items-center gap-2.5 border-b border-white/8 pb-4">
                    <Calendar className="h-4 w-4 text-[var(--app-primary)]" />
                    <p className="font-ui text-label font-bold uppercase tracking-[0.14em] text-white/70">
                      Event details
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="eventDate" className={fieldLabel}>
                        Event date *
                      </label>
                      <input
                        id="eventDate"
                        type="date"
                        name="eventDate"
                        value={careForm.eventDate}
                        onChange={updateCareField}
                        min={getMinDate()}
                        max={getMaxDate()}
                        className={`mt-2 ${careErrors.eventDate ? fieldInputError : fieldInput}`}
                      />
                      <FieldError message={careErrors.eventDate} />
                    </div>
                    <div>
                      <label htmlFor="eventType" className={fieldLabel}>
                        Event type *
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={careForm.eventType}
                        onChange={updateCareField}
                        className={`mt-2 ${careErrors.eventType ? fieldSelectError : fieldSelect}`}
                      >
                        <option value="">Select event type</option>
                        {EVENT_TYPES.map(type => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <FieldError message={careErrors.eventType} />
                    </div>
                    <div>
                      <label htmlFor="churchRole" className={fieldLabel}>
                        Church role requested *
                      </label>
                      <select
                        id="churchRole"
                        name="churchRole"
                        value={careForm.churchRole}
                        onChange={updateCareField}
                        className={`mt-2 ${careErrors.churchRole ? fieldSelectError : fieldSelect}`}
                      >
                        <option value="">Select preferred role</option>
                        {CHURCH_ROLES.map(role => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <FieldError message={careErrors.churchRole} />
                    </div>
                    {showCustomRole && (
                      <div>
                        <label className={fieldLabel}>
                          Specify custom role *
                        </label>
                        <input
                          type="text"
                          name="customRole"
                          value={careForm.customRole}
                          onChange={updateCareField}
                          placeholder="Enter your preferred role"
                          className={`mt-2 ${careErrors.customRole ? fieldInputError : fieldInput}`}
                        />
                        <FieldError message={careErrors.customRole} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3 border-t border-white/8 pt-6">
                <div className="flex items-center gap-2.5 border-b border-white/8 pb-4">
                  <MessageCircle className="h-4 w-4 text-[var(--app-primary)]" />
                  <p className="font-ui text-label font-bold uppercase tracking-[0.14em] text-white/70">
                    {isCounseling
                      ? 'What would you like to talk about?'
                      : 'Additional information'}
                  </p>
                </div>
                <div>
                  <label className={fieldLabel}>
                    {isCounseling
                      ? 'Share as much as you are comfortable with (optional)'
                      : 'Additional comments or special requests'}
                  </label>
                  <textarea
                    name="comments"
                    value={careForm.comments}
                    onChange={updateCareField}
                    placeholder="Please share any additional details, special requests, or specific needs…"
                    rows={4}
                    className={`mt-2 resize-none ${fieldInput}`}
                  />
                </div>
              </div>

              <div className="border-t border-white/8 pt-6">
                {submitError && (
                  <div className="mb-4 border border-[var(--status-error)]/40 bg-[var(--status-error)]/10 px-4 py-3 font-ui text-body-sm text-[var(--status-error)]">
                    {submitError}
                  </div>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="h-12 w-full font-ui text-body-sm font-bold"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit request'}
                </Button>
                <p className="mt-4 text-center font-ui text-label leading-[1.7] text-white/45">
                  We&apos;ll contact you within 24–48 hours to discuss your
                  request and confirm next steps.
                </p>
              </div>
            </form>
          )}
        </div>
      </EditorialContainer>

      <BaseModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successCopy.title}
        subtitle={successCopy.subtitle}
        maxWidth="max-w-md"
        showHandle
        forceBottomSheet
      >
        <div className="flex items-center gap-3 border border-white/10 bg-white/[0.04] p-4">
          <div className="flex h-10 w-10 flex-none items-center justify-center border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="font-ui text-body-sm leading-[1.7] text-white/75">
            Thank you. Our team will review and reach out soon.
          </p>
        </div>
      </BaseModal>
    </EditorialSection>
  );
};

export default PastoralCareForm;
