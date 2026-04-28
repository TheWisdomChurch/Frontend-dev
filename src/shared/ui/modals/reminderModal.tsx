'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as ZodResolvers from '@hookform/resolvers/zod';
import { Calendar, Clock, Loader2, MapPin } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

import { BaseModal, modalStyles } from './Base';
import { SuccessModal } from './SuccessModal';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import { reminderSchema, type ReminderFormSchema } from '@/lib/validation';
import type { ReminderModalProps } from '@/lib/types';

const { zodResolver } = ZodResolvers;

export function ReminderModal({
  event,
  isOpen,
  onClose,
  onSetReminder,
  isLoading = false,
}: ReminderModalProps) {
  const { open } = useServiceUnavailable();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const resolver = useMemo(() => zodResolver(reminderSchema), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ReminderFormSchema>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      email: '',
      frequency: 'weekly',
    },
  });

  const isProcessing = isLoading || isSubmitting;

  const startDate = useMemo(
    () => new Date(event.start_date),
    [event.start_date]
  );
  const eventDate = Number.isNaN(startDate.getTime())
    ? 'Date to be announced'
    : format(startDate, 'MMMM dd, yyyy');

  const timeUntil = Number.isNaN(startDate.getTime())
    ? ''
    : formatDistanceToNow(startDate, { addSuffix: true });

  const onSubmitForm = async (data: ReminderFormSchema) => {
    setIsSubmitting(true);

    try {
      if (!onSetReminder) {
        onClose();
        open({
          title: 'Reminders opening soon',
          message:
            'We are preparing reminders for production. Please check back shortly.',
          actionLabel: 'Sounds good',
        });
        return;
      }

      await onSetReminder({
        email: data.email,
        frequency: data.frequency,
      });

      reset();
      onClose();
      setShowSuccess(true);
    } catch {
      toast.error('Failed to set reminder');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Set Reminder"
        subtitle={`Get notified about ${event.title}`}
        isLoading={isProcessing}
        loadingText="Setting reminder..."
        preventClose={isProcessing}
        maxWidth="max-w-md"
        forceBottomSheet
      >
        <div className="space-y-5">
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4">
            <p className={modalStyles.sectionTitle}>Event details</p>

            <div className="mt-4 space-y-3 text-sm leading-6 text-white/72">
              <p className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 flex-none text-[#f7de12]" />
                <span>{eventDate}</span>
              </p>

              {event.location ? (
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 flex-none text-[#f7de12]" />
                  <span>{event.location}</span>
                </p>
              ) : null}

              {timeUntil ? (
                <p className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 flex-none text-[#f7de12]" />
                  <span>Starts {timeUntil}</span>
                </p>
              ) : null}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <label className={modalStyles.label} htmlFor="reminderEmail">
                Email *
              </label>
              <input
                id="reminderEmail"
                type="email"
                className={modalStyles.input}
                placeholder="you@example.com"
                disabled={isProcessing}
                autoComplete="email"
                {...register('email')}
              />
              {errors.email ? (
                <p className={modalStyles.errorText}>{errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <label className={modalStyles.label} htmlFor="reminderFrequency">
                Frequency *
              </label>
              <select
                id="reminderFrequency"
                className={modalStyles.select}
                disabled={isProcessing}
                {...register('frequency')}
              >
                <option value="daily">Daily Updates</option>
                <option value="weekly">Weekly Updates</option>
                <option value="monthly">Monthly Updates</option>
              </select>
              {errors.frequency ? (
                <p className={modalStyles.errorText}>
                  {errors.frequency.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={!isValid || isProcessing}
              className={modalStyles.primaryButton}
            >
              {isProcessing ? (
                <span className="inline-flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Reminder...
                </span>
              ) : (
                'Set Reminder'
              )}
            </button>
          </form>
        </div>
      </BaseModal>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Reminder set"
        message={`We will notify you about ${event.title}.`}
        actionLabel="Close"
      />
    </>
  );
}
