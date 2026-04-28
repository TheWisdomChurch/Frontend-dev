'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as ZodResolvers from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  Bell,
  Building,
  DoorOpen,
  Heart,
  Loader2,
  Music,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';

import { BaseModal, modalStyles } from './Base';
import { SuccessModal } from './SuccessModal';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import { eventRegistrationSchema } from '@/lib/validation';
import type { EventRegistrationFormSchema } from '@/lib/validation';
import type {
  EventRegistrationData,
  EventRegistrationModalProps,
} from '@/lib/types';

const { zodResolver } = ZodResolvers;

const VOLUNTEER_ROLES = [
  {
    id: 'service_prep',
    label: 'Service Preparatory Unit',
    icon: Bell,
  },
  {
    id: 'music',
    label: 'Music Department',
    icon: Music,
  },
  {
    id: 'sanctuary',
    label: 'Sanctuary Management',
    icon: Building,
  },
  {
    id: 'ushers',
    label: 'Ushers & Greeters',
    icon: DoorOpen,
  },
  {
    id: 'security',
    label: 'Security Team',
    icon: Shield,
  },
  {
    id: 'protocol',
    label: 'Protocol & Logistics',
    icon: UserCheck,
  },
  {
    id: 'media',
    label: 'Media & Tech',
    icon: Users,
  },
  {
    id: 'prayer',
    label: 'Prayer Team',
    icon: Heart,
  },
  {
    id: 'children',
    label: 'Children Ministry',
    icon: Users,
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    icon: Users,
  },
  {
    id: 'other',
    label: 'Other',
    icon: Users,
  },
] as const;

const COUNTRIES = [
  'Nigeria',
  'Ghana',
  'South Africa',
  'Kenya',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Other',
];

type Step = 'personal' | 'volunteer' | 'additional';

const stepOrder: Step[] = ['personal', 'volunteer', 'additional'];

function getStepNumber(step: Step) {
  return stepOrder.indexOf(step) + 1;
}

export function EventRegistrationModal({
  event,
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
  headline,
  lead,
  eyebrow,
  highlight,
  ctaNote,
}: EventRegistrationModalProps) {
  const { open } = useServiceUnavailable();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<Step>('personal');

  const resolver = useMemo(() => zodResolver(eventRegistrationSchema), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<EventRegistrationFormSchema>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      ...defaultValues,
      event_id: event.id,
      registration_type: event.event_type,
      attendance_type: 'attendee',
    },
  });

  const attendanceType = watch('attendance_type');
  const volunteerRole = watch('volunteer_role');

  const eventDate = useMemo(() => {
    const start = new Date(event.start_date);
    const end = event.end_date ? new Date(event.end_date) : null;

    if (Number.isNaN(start.getTime())) return 'Date to be announced';

    if (end && !Number.isNaN(end.getTime())) {
      return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
    }

    return format(start, 'MMMM dd, yyyy');
  }, [event.end_date, event.start_date]);

  const submitRegistration = async (data: EventRegistrationFormSchema) => {
    setIsSubmitting(true);

    try {
      if (!onSubmit) {
        onClose();
        open({
          title: 'Registration opening soon',
          message:
            'This registration flow is being prepared for production. Please check back shortly.',
          actionLabel: 'Okay, thanks',
        });
        return;
      }

      const submissionData = {
        ...(data as EventRegistrationData),
        event_title: event.title,
        event_date: event.start_date,
        event_time: event.time,
        event_location: event.location,
      } as EventRegistrationData & Record<string, unknown>;

      await onSubmit(submissionData);

      reset();
      setStep('personal');
      onClose();
      setShowSuccess(true);
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    let isValid = false;

    if (step === 'personal') {
      isValid = await trigger([
        'firstName',
        'lastName',
        'email',
        'phone',
        'country',
        'city',
        'attendance_type',
      ]);

      if (!isValid) return;

      setStep(attendanceType === 'attendee' ? 'additional' : 'volunteer');
      return;
    }

    if (step === 'volunteer') {
      isValid = await trigger(
        volunteerRole === 'other'
          ? ['volunteer_role', 'custom_role']
          : ['volunteer_role']
      );

      if (!isValid) return;

      setStep('additional');
      return;
    }

    isValid = await trigger(['occupation']);

    if (!isValid) return;

    await handleSubmit(submitRegistration)();
  };

  const handlePrevStep = () => {
    if (step === 'volunteer') {
      setStep('personal');
      return;
    }

    if (step === 'additional') {
      setStep(attendanceType === 'attendee' ? 'personal' : 'volunteer');
    }
  };

  const canGoBack = step !== 'personal';

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={headline || `Register for ${event.title}`}
        subtitle={`${eventDate} • ${event.location || 'Location TBD'}`}
        maxWidth="max-w-3xl"
        isLoading={isSubmitting}
        loadingText="Submitting..."
        preventClose={isSubmitting}
        forceBottomSheet
      >
        <div className="space-y-5">
          {event.image_url ? (
            <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/35">
              <div className="relative h-40 w-full sm:h-48 md:h-56">
                <Image
                  src={event.image_url}
                  alt={`${event.title} program`}
                  fill
                  sizes="(max-width: 768px) 92vw, 720px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
            </div>
          ) : null}

          {eyebrow || lead || highlight ? (
            <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              {eyebrow ? (
                <p className={modalStyles.sectionTitle}>{eyebrow}</p>
              ) : null}

              {lead ? (
                <p className="mt-2 text-sm leading-7 text-white/70">{lead}</p>
              ) : null}

              {highlight ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#f7de12]/20 bg-[#f7de12]/10 px-3 py-1.5 text-xs font-bold text-[#f7de12]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {highlight}
                </div>
              ) : null}
            </section>
          ) : null}

          <div className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
            <div className="flex items-center justify-between gap-3">
              {stepOrder.map(item => {
                const active = item === step;
                const completed = getStepNumber(item) < getStepNumber(step);

                return (
                  <div key={item} className="flex min-w-0 flex-1 items-center">
                    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <div
                        className={[
                          'grid h-8 w-8 place-items-center rounded-full border text-xs font-black transition',
                          active
                            ? 'border-[#f7de12] bg-[#f7de12] text-black'
                            : completed
                              ? 'border-[#f7de12]/40 bg-[#f7de12]/10 text-[#f7de12]'
                              : 'border-white/10 bg-white/[0.035] text-white/45',
                        ].join(' ')}
                      >
                        {getStepNumber(item)}
                      </div>
                      <p
                        className={[
                          'truncate text-center text-[0.68rem] font-bold uppercase tracking-[0.12em]',
                          active ? 'text-white' : 'text-white/42',
                        ].join(' ')}
                      >
                        {item}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit(submitRegistration)}
            className="space-y-5"
          >
            {step === 'personal' ? (
              <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                <div className="mb-5">
                  <p className={modalStyles.sectionTitle}>Personal details</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    Tell us who is registering for this event.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={modalStyles.label} htmlFor="firstName">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      className={modalStyles.input}
                      placeholder="First name"
                      {...register('firstName')}
                    />
                    {errors.firstName ? (
                      <p className={modalStyles.errorText}>
                        {errors.firstName.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className={modalStyles.label} htmlFor="lastName">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      className={modalStyles.input}
                      placeholder="Last name"
                      {...register('lastName')}
                    />
                    {errors.lastName ? (
                      <p className={modalStyles.errorText}>
                        {errors.lastName.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className={modalStyles.label} htmlFor="email">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={modalStyles.input}
                      placeholder="you@example.com"
                      {...register('email')}
                    />
                    {errors.email ? (
                      <p className={modalStyles.errorText}>
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className={modalStyles.label} htmlFor="phone">
                      Phone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      className={modalStyles.input}
                      placeholder="+234 801 234 5678"
                      {...register('phone')}
                    />
                    {errors.phone ? (
                      <p className={modalStyles.errorText}>
                        {errors.phone.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className={modalStyles.label} htmlFor="country">
                      Country *
                    </label>
                    <select
                      id="country"
                      className={modalStyles.select}
                      {...register('country')}
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country ? (
                      <p className={modalStyles.errorText}>
                        {errors.country.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className={modalStyles.label} htmlFor="city">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      autoComplete="address-level2"
                      className={modalStyles.input}
                      placeholder="City"
                      {...register('city')}
                    />
                    {errors.city ? (
                      <p className={modalStyles.errorText}>
                        {errors.city.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5">
                  <label className={modalStyles.label}>Attendance Type *</label>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {(['attendee', 'volunteer', 'both'] as const).map(
                      option => {
                        const selected = attendanceType === option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setValue('attendance_type', option, {
                                shouldValidate: true,
                              })
                            }
                            className={[
                              'min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold capitalize transition',
                              selected
                                ? 'border-[#f7de12] bg-[#f7de12]/10 text-[#f7de12]'
                                : 'border-white/10 bg-black/25 text-white/65 hover:border-white/20 hover:bg-white/[0.04]',
                            ].join(' ')}
                          >
                            {option}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </section>
            ) : null}

            {step === 'volunteer' ? (
              <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                <div className="mb-5">
                  <p className={modalStyles.sectionTitle}>Volunteer interest</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    Select the area where you would like to serve.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {VOLUNTEER_ROLES.map(role => {
                    const Icon = role.icon;
                    const selected = volunteerRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() =>
                          setValue('volunteer_role', role.id, {
                            shouldValidate: true,
                          })
                        }
                        className={[
                          'flex min-h-12 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition',
                          selected
                            ? 'border-[#f7de12] bg-[#f7de12]/10 text-[#f7de12]'
                            : 'border-white/10 bg-black/25 text-white/70 hover:border-white/20 hover:bg-white/[0.04]',
                        ].join(' ')}
                      >
                        <Icon className="h-4 w-4 flex-none" />
                        <span>{role.label}</span>
                      </button>
                    );
                  })}
                </div>

                {errors.volunteer_role ? (
                  <p className={modalStyles.errorText}>
                    {errors.volunteer_role.message}
                  </p>
                ) : null}

                {volunteerRole === 'other' ? (
                  <div className="mt-4">
                    <label className={modalStyles.label} htmlFor="customRole">
                      Specify Role *
                    </label>
                    <input
                      id="customRole"
                      type="text"
                      className={modalStyles.input}
                      placeholder="Tell us where you would like to serve"
                      {...register('custom_role')}
                    />
                    {errors.custom_role ? (
                      <p className={modalStyles.errorText}>
                        {errors.custom_role.message}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </section>
            ) : null}

            {step === 'additional' ? (
              <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                <div className="mb-5">
                  <p className={modalStyles.sectionTitle}>Additional details</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    Add any extra information that will help us prepare.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={modalStyles.label} htmlFor="occupation">
                      Occupation *
                    </label>
                    <input
                      id="occupation"
                      type="text"
                      className={modalStyles.input}
                      placeholder="Occupation"
                      {...register('occupation')}
                    />
                    {errors.occupation ? (
                      <p className={modalStyles.errorText}>
                        {errors.occupation.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className={modalStyles.label}
                      htmlFor="previousExperience"
                    >
                      Previous Experience
                    </label>
                    <input
                      id="previousExperience"
                      type="text"
                      className={modalStyles.input}
                      placeholder="Optional"
                      {...register('previous_experience')}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={modalStyles.label} htmlFor="specialNeeds">
                      Special Needs
                    </label>
                    <textarea
                      id="specialNeeds"
                      className={modalStyles.textarea}
                      rows={3}
                      placeholder="Let us know how we can support you"
                      {...register('special_needs')}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={modalStyles.label} htmlFor="expectations">
                      Expectations
                    </label>
                    <textarea
                      id="expectations"
                      className={modalStyles.textarea}
                      rows={3}
                      placeholder="What are you expecting from this event?"
                      {...register('expectations')}
                    />
                  </div>
                </div>
              </section>
            ) : null}

            {ctaNote ? (
              <p className="text-center text-xs leading-5 text-white/50">
                {ctaNote}
              </p>
            ) : null}

            <div className="sticky bottom-0 -mx-5 border-t border-white/10 bg-[#070707]/95 px-5 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={!canGoBack || isSubmitting}
                  className={modalStyles.ghostButton}
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className={modalStyles.primaryButton}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : step === 'additional' ? (
                    'Submit Registration'
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </BaseModal>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Registration complete"
        message={`You are registered for ${event.title}.`}
        actionLabel="Close"
      />
    </>
  );
}
