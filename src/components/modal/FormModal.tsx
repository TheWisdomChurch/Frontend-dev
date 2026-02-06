'use client';

import { BaseModal, modalStyles } from './Base';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';
import {
  Loader2,
  Users,
  Music,
  Shield,
  UserCheck,
  Heart,
  Building,
  DoorOpen,
  Bell,
  AlertCircle,
} from 'lucide-react';
import { eventRegistrationSchema } from '@/lib/validation';
import type {
  EventRegistrationData,
  EventRegistrationModalProps,
} from '@/lib/types';
import type { EventRegistrationFormSchema } from '@/lib/validation';
import { SuccessModal } from './SuccessModal';

const VOLUNTEER_ROLES = [
  { id: 'service_prep', label: 'Service Preparatory Unit', icon: <Bell className="w-4 h-4" /> },
  { id: 'music', label: 'Music Department', icon: <Music className="w-4 h-4" /> },
  { id: 'sanctuary', label: 'Sanctuary Management', icon: <Building className="w-4 h-4" /> },
  { id: 'ushers', label: 'Ushers & Greeters', icon: <DoorOpen className="w-4 h-4" /> },
  { id: 'security', label: 'Security Team', icon: <Shield className="w-4 h-4" /> },
  { id: 'protocol', label: 'Protocol & Logistics', icon: <UserCheck className="w-4 h-4" /> },
  { id: 'media', label: 'Media & Tech', icon: <Users className="w-4 h-4" /> },
  { id: 'prayer', label: 'Prayer Team', icon: <Heart className="w-4 h-4" /> },
  { id: 'children', label: 'Children Ministry', icon: <Users className="w-4 h-4" /> },
  { id: 'hospitality', label: 'Hospitality', icon: <Users className="w-4 h-4" /> },
  { id: 'other', label: 'Other (Please specify)', icon: <Users className="w-4 h-4" /> },
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Nigeria',
  'Ghana',
  'South Africa',
  'Kenya',
  'Australia',
  'Germany',
  'France',
  'Other',
];

export const EventRegistrationModal = ({
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
}: EventRegistrationModalProps) => {
  const { open } = useServiceUnavailable();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<'personal' | 'volunteer' | 'additional'>('personal');

  const resolver = useMemo(() => zodResolver(eventRegistrationSchema), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
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

  const formatEventDate = () => {
    const start = new Date(event.start_date);
    const end = event.end_date ? new Date(event.end_date) : null;

    if (end) {
      return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
    }
    return format(start, 'MMMM dd, yyyy');
  };

  const handleFormSubmit = async (data: EventRegistrationFormSchema) => {
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
      } as EventRegistrationData & Record<string, any>;

      await onSubmit(submissionData);
      onClose();
      setShowSuccess(true);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    let isStepValid = false;

    switch (step) {
      case 'personal':
        isStepValid = await trigger([
          'firstName',
          'lastName',
          'email',
          'phone',
          'country',
          'city',
        ]);
        break;
      case 'volunteer':
        if (attendanceType !== 'attendee') {
          isStepValid = await trigger(['volunteer_role', 'custom_role']);
        } else {
          isStepValid = true;
        }
        break;
      case 'additional':
        isStepValid = await trigger(['occupation']);
        break;
    }

    if (!isStepValid) return;

    if (step === 'personal') {
      if (attendanceType === 'attendee') {
        setStep('additional');
      } else {
        setStep('volunteer');
      }
      return;
    }

    if (step === 'volunteer') {
      setStep('additional');
      return;
    }

    handleSubmit(handleFormSubmit)();
  };

  const handlePrevStep = () => {
    if (step === 'volunteer') setStep('personal');
    if (step === 'additional') setStep(attendanceType === 'attendee' ? 'personal' : 'volunteer');
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={headline || `Register for ${event.title}`}
        subtitle={`${formatEventDate()} • ${event.location || 'Location TBD'}`}
        maxWidth="max-w-3xl"
        isLoading={isSubmitting}
        loadingText="Submitting..."
        preventClose={isSubmitting}
      >
        <div className="space-y-4">
          {event.image_url && (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <div className="relative h-36 sm:h-44 md:h-52 w-full">
                <Image
                  src={event.image_url}
                  alt={`${event.title} program`}
                  fill
                  sizes="(max-width: 768px) 90vw, 640px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              </div>
            </div>
          )}
          {(eyebrow || lead) && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              {eyebrow && (
                <p className="text-xs uppercase tracking-widest text-white/60 mb-2">
                  {eyebrow}
                </p>
              )}
              {lead && <p className="text-sm text-white/80 leading-relaxed">{lead}</p>}
              {highlight && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 px-3 py-1 text-xs text-yellow-200">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {highlight}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pb-6">
            {step === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={modalStyles.label}>First Name *</label>
                    <input className={modalStyles.input} {...register('firstName')} />
                    {errors.firstName && (
                      <p className={modalStyles.errorText}>{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={modalStyles.label}>Last Name *</label>
                    <input className={modalStyles.input} {...register('lastName')} />
                    {errors.lastName && (
                      <p className={modalStyles.errorText}>{errors.lastName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={modalStyles.label}>Email *</label>
                    <input className={modalStyles.input} {...register('email')} />
                    {errors.email && (
                      <p className={modalStyles.errorText}>{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={modalStyles.label}>Phone *</label>
                    <input className={modalStyles.input} {...register('phone')} />
                    {errors.phone && (
                      <p className={modalStyles.errorText}>{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={modalStyles.label}>Country *</label>
                    <select className={modalStyles.select} {...register('country')}>
                      <option value="">Select country</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className={modalStyles.errorText}>{errors.country.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={modalStyles.label}>City *</label>
                    <input className={modalStyles.input} {...register('city')} />
                    {errors.city && (
                      <p className={modalStyles.errorText}>{errors.city.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={modalStyles.label}>Attendance Type *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(['attendee', 'volunteer', 'both'] as const).map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setValue('attendance_type', option)}
                        className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
                          watch('attendance_type') === option
                            ? 'border-yellow-400 bg-yellow-400/10 text-yellow-100'
                            : 'border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'volunteer' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VOLUNTEER_ROLES.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setValue('volunteer_role', role.id)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                        volunteerRole === role.id
                          ? 'border-yellow-400 bg-yellow-400/10 text-yellow-100'
                          : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {role.icon}
                      {role.label}
                    </button>
                  ))}
                </div>
                {errors.volunteer_role && (
                  <p className={modalStyles.errorText}>{errors.volunteer_role.message}</p>
                )}

                {volunteerRole === 'other' && (
                  <div>
                    <label className={modalStyles.label}>Specify Role *</label>
                    <input className={modalStyles.input} {...register('custom_role')} />
                    {errors.custom_role && (
                      <p className={modalStyles.errorText}>{errors.custom_role.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 'additional' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={modalStyles.label}>Occupation *</label>
                    <input className={modalStyles.input} {...register('occupation')} />
                    {errors.occupation && (
                      <p className={modalStyles.errorText}>{errors.occupation.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={modalStyles.label}>Previous Experience</label>
                    <input className={modalStyles.input} {...register('previous_experience')} />
                  </div>
                </div>
                <div>
                  <label className={modalStyles.label}>Special Needs</label>
                  <textarea className={modalStyles.textarea} rows={3} {...register('special_needs')} />
                </div>
                <div>
                  <label className={modalStyles.label}>Expectations</label>
                  <textarea className={modalStyles.textarea} rows={3} {...register('expectations')} />
                </div>
              </div>
            )}

            {ctaNote && (
              <p className="text-xs text-white/60 text-center">{ctaNote}</p>
            )}

            <div className="sticky bottom-0 -mx-6 lg:-mx-8 px-6 lg:px-8 pt-4 pb-3 bg-black/95 backdrop-blur border-t border-white/10">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={step === 'personal'}
                  className="text-sm text-white/70 hover:text-white disabled:opacity-40"
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
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
};
