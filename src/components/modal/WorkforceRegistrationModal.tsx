'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { BaseModal, modalStyles } from './Base';
import { SuccessModal } from './SuccessModal';
import apiClient, { mapValidationErrors } from '@/lib/api';
import { workforceRegistrationSchema } from '@/lib/validation';
import type {
  WorkforceRegistrationData,
  WorkforceRegistrationModalProps,
} from '@/lib/types';

const LEADERSHIP_TITLES = [
  'Deacon',
  'Deaconess',
  'Pastor',
  'Associate Pastor',
  'Reverend',
  'Senior Pastor',
  'Other',
];

const LEADERSHIP_CATEGORIES = [
  'Leadership Council',
  'Music Leaders',
  'Departmental Leaders',
  'Workforce',
  'Other',
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WorkforceRegistrationModal = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
}: WorkforceRegistrationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const resolver = useMemo(() => zodResolver(workforceRegistrationSchema), []);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<WorkforceRegistrationData>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      title: '',
      department: '',
      leadershipCategory: '',
      birthMonth: '',
      anniversaryMonth: '',
      isExistingMember: false,
      currentAssignment: '',
      notes: '',
      ...defaultValues,
    },
  });

  const submitHandler = onSubmit ?? apiClient.applyWorkforce;

  const onSubmitForm = async (data: WorkforceRegistrationData) => {
    setIsSubmitting(true);
    try {
      await submitHandler(data);
      reset();
      onClose();
      setShowSuccess(true);
    } catch (error) {
      const fieldErrors = mapValidationErrors(error);
      if (fieldErrors) {
        const fieldMap: Record<string, keyof WorkforceRegistrationData> = {
          first_name: 'firstName',
          last_name: 'lastName',
          leadership_category: 'leadershipCategory',
          birth_month: 'birthMonth',
          anniversary_month: 'anniversaryMonth',
          is_existing_member: 'isExistingMember',
          current_assignment: 'currentAssignment',
        };
        Object.entries(fieldErrors).forEach(([field, message]) => {
          const mappedField =
            fieldMap[field] ?? (field as keyof WorkforceRegistrationData);
          setError(mappedField, {
            type: 'server',
            message,
          });
        });
      } else {
        toast.error('Submission failed. Please review your details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Workforce Registration"
        subtitle="Keep your leadership profile up to date"
        maxWidth="max-w-2xl"
        preventClose={isSubmitting}
        isLoading={isSubmitting}
        loadingText="Submitting..."
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
          <div className={modalStyles.sectionTitle}>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Personal Details
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {errors.firstName && (
                <p className={modalStyles.errorText}>{errors.firstName.message}</p>
              )}
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
              {errors.lastName && (
                <p className={modalStyles.errorText}>{errors.lastName.message}</p>
              )}
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
              {errors.email && (
                <p className={modalStyles.errorText}>{errors.email.message}</p>
              )}
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
                placeholder="+1 555 123 4567"
                {...register('phone')}
              />
              {errors.phone && (
                <p className={modalStyles.errorText}>{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={modalStyles.label} htmlFor="title">
                Leadership Title *
              </label>
              <select
                id="title"
                className={modalStyles.select}
                {...register('title')}
              >
                <option value="">Select a title</option>
                {LEADERSHIP_TITLES.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.title && (
                <p className={modalStyles.errorText}>{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className={modalStyles.label} htmlFor="department">
                Department *
              </label>
              <input
                id="department"
                type="text"
                className={modalStyles.input}
                placeholder="E.g. Choir, Media, Ushering"
                {...register('department')}
              />
              {errors.department && (
                <p className={modalStyles.errorText}>{errors.department.message}</p>
              )}
            </div>
            <div>
              <label className={modalStyles.label} htmlFor="leadershipCategory">
                Leadership Category *
              </label>
              <select
                id="leadershipCategory"
                className={modalStyles.select}
                {...register('leadershipCategory')}
              >
                <option value="">Select a category</option>
                {LEADERSHIP_CATEGORIES.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.leadershipCategory && (
                <p className={modalStyles.errorText}>
                  {errors.leadershipCategory.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                id="existingMember"
                type="checkbox"
                className="h-4 w-4 rounded border border-white/30"
                {...register('isExistingMember')}
              />
              <label htmlFor="existingMember" className="text-sm text-white/80">
                I am updating my existing workforce profile
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={modalStyles.label} htmlFor="birthMonth">
                Birth Month
              </label>
              <select
                id="birthMonth"
                className={modalStyles.select}
                {...register('birthMonth')}
              >
                <option value="">Select month</option>
                {MONTHS.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={modalStyles.label} htmlFor="anniversaryMonth">
                Wedding Anniversary Month
              </label>
              <select
                id="anniversaryMonth"
                className={modalStyles.select}
                {...register('anniversaryMonth')}
              >
                <option value="">Select month</option>
                {MONTHS.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={modalStyles.label} htmlFor="currentAssignment">
              Current Assignment
            </label>
            <input
              id="currentAssignment"
              type="text"
              className={modalStyles.input}
              placeholder="E.g. Worship leader, Protocol team, Assistant pastor"
              {...register('currentAssignment')}
            />
          </div>

          <div>
            <label className={modalStyles.label} htmlFor="notes">
              Additional Notes
            </label>
            <textarea
              id="notes"
              className={`${modalStyles.textarea} min-h-[96px]`}
              placeholder="Share any important updates or requests"
              {...register('notes')}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={modalStyles.primaryButton}
            style={{ backgroundColor: '#facc15' }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" />
                Submitting...
              </span>
            ) : (
              'Submit Workforce Details'
            )}
          </button>
        </form>
      </BaseModal>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Details received"
        message="Your workforce information has been updated successfully."
        actionLabel="Close"
      />
    </>
  );
};
