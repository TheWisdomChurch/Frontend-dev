'use client';

import { useMemo, useState } from 'react';
import { BaseModal, modalStyles } from './Base';
import { Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';
import { reminderSchema } from '@/lib/validation';
import { SuccessModal } from './SuccessModal';
import type { ReminderModalProps } from '@/lib/types';
import type { ReminderFormSchema } from '@/lib/validation';

export const ReminderModal = ({
  event,
  isOpen,
  onClose,
  onSetReminder,
  isLoading = false,
}: ReminderModalProps) => {
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

  const eventDate = format(new Date(event.start_date), 'MMMM dd, yyyy');
  const timeUntil = formatDistanceToNow(new Date(event.start_date), {
    addSuffix: true,
  });

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
      await onSetReminder({ email: data.email, frequency: data.frequency });
      reset();
      onClose();
      setShowSuccess(true);
    } catch (error) {
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
      >
        <div className="mb-4 space-y-2 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{eventDate}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Starts {timeUntil}</span>
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
              placeholder="Enter your email"
              disabled={isProcessing}
              {...register('email')}
            />
            {errors.email && (
              <p className={modalStyles.errorText}>{errors.email.message}</p>
            )}
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
            {errors.frequency && (
              <p className={modalStyles.errorText}>{errors.frequency.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isProcessing}
            className={modalStyles.primaryButton}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Setting Reminder...
              </span>
            ) : (
              'Set Reminder'
            )}
          </button>
        </form>
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
};
