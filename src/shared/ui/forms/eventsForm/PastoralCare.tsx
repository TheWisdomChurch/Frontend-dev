'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  User,
  MessageCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { BaseModal } from '@/shared/ui/modals/Base';
import SectionGlow from '@/shared/ui/SectionGlow';
import { apiClient } from '@/lib/api';

// A counseling request is a fundamentally different, confidential ask from
// an event/officiant booking — this form serves both (one backend endpoint,
// no access to add a second), so it adapts its fields based on how the
// visitor arrived rather than showing every event-booking field to someone
// asking for private pastoral counseling.
const COUNSELING_EVENT_TYPE = 'Counseling Session';
const COUNSELING_DEFAULT_ROLE = 'Prayer Partner';

interface PastoralCareFormData {
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

type FieldErrors = Partial<Record<keyof PastoralCareFormData, string>>;

/* ── Field styles — match the flat, gold-accented input language used
   across every other form on the site (JoinUs, HeroHighlights) ───── */

const fieldInput =
  'w-full border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-[var(--app-primary)]/12';

const fieldInputError =
  'w-full border border-rose-400/50 bg-rose-500/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20';

const fieldSelect =
  'w-full border border-white/12 bg-[var(--app-dark-input)] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-2 focus:ring-[var(--app-primary)]/12';

const fieldSelectError =
  'w-full border border-rose-400/50 bg-[var(--app-dark-input)] px-4 py-3 text-sm text-white outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20';

const fieldLabel =
  'block font-ui text-caption font-bold uppercase tracking-[0.15em] text-white/45';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-ui text-label text-rose-300">{message}</p>;
}

const PastoralCareUnit = () => {
  const searchParams = useSearchParams();
  const isCounseling = searchParams.get('intent') === 'counseling';

  const [formData, setFormData] = useState<PastoralCareFormData>({
    title: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    contactAddress: '',
    eventDate: '',
    eventType: isCounseling ? COUNSELING_EVENT_TYPE : '',
    churchRole: isCounseling ? COUNSELING_DEFAULT_ROLE : '',
    customRole: '',
    comments: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const eventTypes = [
    'Counseling Session',
    'Wedding Ceremony',
    'Naming Ceremony',
    'Birthday Celebration',
    'Child Dedication',
    'Housewarming',
    'Funeral Service',
    'Thanksgiving Service',
    'Anniversary Celebration',
    'Other Special Event',
  ];

  const churchRoles = [
    'Officiating Minister',
    'Guest Minister',
    'Prayer Partner',
    'Worship Leader',
    'Event Coordinator',
    'Custom Role',
  ];

  const titles = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Pastor'];

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setFieldErrors(prev =>
        prev[name as keyof PastoralCareFormData]
          ? { ...prev, [name]: undefined }
          : prev
      );

      // Show custom role input if "Custom Role" is selected
      if (name === 'churchRole') {
        setShowCustomRole(value === 'Custom Role');
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError('');

      const requiredFields: Array<keyof PastoralCareFormData> = isCounseling
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

      const nextErrors: FieldErrors = {};
      requiredFields.forEach(field => {
        if (!String(formData[field] || '').trim()) {
          nextErrors[field] = 'This field is required.';
        }
      });
      if (showCustomRole && !formData.customRole.trim()) {
        nextErrors.customRole = 'Please provide your custom role.';
      }

      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors);
        setSubmitError(
          'Please complete all required fields before submitting.'
        );
        return;
      }

      setFieldErrors({});
      setIsSubmitting(true);

      try {
        await apiClient.submitPastoralCareRequest({
          title: formData.title,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactNumber: formData.contactNumber,
          email: formData.email,
          contactAddress: formData.contactAddress,
          eventDate: formData.eventDate,
          eventType: formData.eventType,
          churchRole: formData.churchRole,
          customRole: showCustomRole ? formData.customRole : undefined,
          comments: formData.comments,
          sourceChannel: isCounseling
            ? 'frontend:web:pastoral-care:counseling'
            : 'frontend:web:pastoral-care:event',
        });

        setFormData({
          title: '',
          firstName: '',
          lastName: '',
          contactNumber: '',
          email: '',
          contactAddress: '',
          eventDate: '',
          eventType: isCounseling ? COUNSELING_EVENT_TYPE : '',
          churchRole: isCounseling ? COUNSELING_DEFAULT_ROLE : '',
          customRole: '',
          comments: '',
        });
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
    [formData, showCustomRole, isCounseling]
  );

  const getMinDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const getMaxDate = useCallback(() => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow.toISOString().split('T')[0];
  }, []);

  return (
    <Section
      padding="xl"
      className="relative overflow-hidden border-b border-white/8 bg-[var(--app-dark)]"
    >
      <SectionGlow variant="double" />
      <Container size="xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            {isCounseling
              ? 'Confidential Counseling'
              : 'Pastoral Care Services'}
          </p>
          <h2 className="mt-4 font-headline text-heading-md font-normal leading-snug text-white sm:text-[2.3rem]">
            {isCounseling
              ? 'Request a counseling session'
              : 'Register for pastoral care'}
          </h2>
          <p className="mt-5 font-ui text-body-sm leading-[2] text-white/68">
            {isCounseling
              ? 'Share a few details below and a member of our pastoral team will reach out privately to arrange a time to talk.'
              : 'Let us be part of your special moments. Register below and our ministry team will support you in your celebrations and milestones.'}
          </p>
          {isCounseling && (
            <p className="mt-4 inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-4 py-2 font-ui text-label text-white/60">
              <Lock className="h-3.5 w-3.5 flex-none text-[var(--app-primary)]" />
              Confidential — only our pastoral team will see this.
            </p>
          )}
        </div>

        {/* Form card */}
        <div className="mx-auto mt-12 max-w-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal information */}
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
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`mt-2 ${fieldErrors.title ? fieldSelectError : fieldSelect}`}
                  >
                    <option value="">Select title</option>
                    {titles.map(title => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  <FieldError message={fieldErrors.title} />
                </div>

                <div>
                  <label className={fieldLabel}>First name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className={`mt-2 ${fieldErrors.firstName ? fieldInputError : fieldInput}`}
                  />
                  <FieldError message={fieldErrors.firstName} />
                </div>

                <div>
                  <label className={fieldLabel}>Last name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className={`mt-2 ${fieldErrors.lastName ? fieldInputError : fieldInput}`}
                  />
                  <FieldError message={fieldErrors.lastName} />
                </div>

                <div>
                  <label className={fieldLabel}>Contact number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={`mt-2 ${fieldErrors.contactNumber ? fieldInputError : fieldInput}`}
                  />
                  <FieldError message={fieldErrors.contactNumber} />
                </div>

                <div>
                  <label className={fieldLabel}>Email address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className={`mt-2 ${fieldErrors.email ? fieldInputError : fieldInput}`}
                  />
                  <FieldError message={fieldErrors.email} />
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
                    value={formData.contactAddress}
                    onChange={handleInputChange}
                    placeholder={
                      isCounseling
                        ? 'In person, phone, or video call — up to you'
                        : 'Enter your complete address'
                    }
                    className={`mt-2 ${fieldErrors.contactAddress ? fieldInputError : fieldInput}`}
                  />
                  <FieldError message={fieldErrors.contactAddress} />
                </div>
              </div>
            </div>

            {/* Event details — hidden entirely for confidential counseling
                requests, where eventType/churchRole are pre-set
                programmatically and irrelevant to the visitor */}
            {!isCounseling && (
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
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className={`mt-2 ${fieldErrors.eventDate ? fieldInputError : fieldInput}`}
                    />
                    <FieldError message={fieldErrors.eventDate} />
                  </div>

                  <div>
                    <label htmlFor="eventType" className={fieldLabel}>
                      Event type *
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className={`mt-2 ${fieldErrors.eventType ? fieldSelectError : fieldSelect}`}
                    >
                      <option value="">Select event type</option>
                      {eventTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.eventType} />
                  </div>

                  <div>
                    <label htmlFor="churchRole" className={fieldLabel}>
                      Church role requested *
                    </label>
                    <select
                      id="churchRole"
                      name="churchRole"
                      value={formData.churchRole}
                      onChange={handleInputChange}
                      className={`mt-2 ${fieldErrors.churchRole ? fieldSelectError : fieldSelect}`}
                    >
                      <option value="">Select preferred role</option>
                      {churchRoles.map(role => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.churchRole} />
                  </div>

                  {showCustomRole && (
                    <div>
                      <label className={fieldLabel}>
                        Specify custom role *
                      </label>
                      <input
                        type="text"
                        name="customRole"
                        value={formData.customRole}
                        onChange={handleInputChange}
                        placeholder="Enter your preferred role"
                        className={`mt-2 ${fieldErrors.customRole ? fieldInputError : fieldInput}`}
                      />
                      <FieldError message={fieldErrors.customRole} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional comments */}
            <div className="space-y-3 border-t border-white/8 pt-6">
              <div className="flex items-center gap-2.5 border-b border-white/8 pb-4">
                <MessageCircle className="h-4 w-4 text-[var(--app-primary)]" />
                <p className="font-ui text-label font-bold uppercase tracking-[0.14em] text-white/70">
                  Additional information
                </p>
              </div>
              <div>
                <label className={fieldLabel}>
                  Additional comments or special requests
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Please share any additional details, special requests, or specific needs…"
                  rows={4}
                  className={`mt-2 resize-none ${fieldInput}`}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-white/8 pt-6">
              {submitError && (
                <div className="mb-4 border border-rose-400/40 bg-rose-500/10 px-4 py-3 font-ui text-body-sm text-rose-200">
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
        </div>
      </Container>

      <BaseModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Request received"
        subtitle="We've emailed a confirmation of your pastoral care request."
        maxWidth="max-w-md"
        showHandle
        forceBottomSheet
      >
        <div className="flex items-center gap-3 border border-white/10 bg-white/[0.04] p-4">
          <div className="flex h-10 w-10 flex-none items-center justify-center border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="font-ui text-body-sm leading-[1.7] text-white/75">
            Thank you. Our team will review and reach out soon. A confirmation
            email has been sent to the address you provided.
          </p>
        </div>
      </BaseModal>
    </Section>
  );
};

export default PastoralCareUnit;
