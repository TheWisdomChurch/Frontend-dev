'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as ZodResolvers from '@hookform/resolvers/zod';
import { Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

import { BaseModal, modalStyles } from './Base';
import { SuccessModal } from './SuccessModal';
import apiClient, { mapValidationErrors } from '@/lib/api';
import {
  workforceRegistrationSchema,
  type WorkforceRegistrationFormData,
} from '@/lib/validation';
import type { WorkforceRegistrationModalProps } from '@/lib/types';

const { zodResolver } = ZodResolvers;

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

export function WorkforceRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
}: WorkforceRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const resolver = useMemo(() => zodResolver(workforceRegistrationSchema), []);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<WorkforceRegistrationFormData>({
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

  const submitHandler = onSubmit ?? apiClient.applyWorkforceServing;

  const onSubmitForm = async (data: WorkforceRegistrationFormData) => {
    setIsSubmitting(true);

    try {
      await submitHandler({
        ...data,
        isExistingMember: true,
        registrationType: 'serving',
      });

      reset();
      onClose();
      setShowSuccess(true);
    } catch (error) {
      const fieldErrors = mapValidationErrors(error);

      if (fieldErrors) {
        const fieldMap: Record<string, keyof WorkforceRegistrationFormData> = {
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
            fieldMap[field] ?? (field as keyof WorkforceRegistrationFormData);

          setError(mappedField, {
            type: 'server',
            message: String(message),
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
        subtitle="Keep your leadership and service profile up to date."
        maxWidth="max-w-3xl"
        preventClose={isSubmitting}
        isLoading={isSubmitting}
        loadingText="Submitting..."
        forceBottomSheet
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f7de12]/10 text-[#f7de12]">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className={modalStyles.sectionTitle}>Personal details</p>
                <p className="mt-1 text-sm text-white/55">
                  Basic contact information for your profile.
                </p>
              </div>
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
            </div>
          </section>

          <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="mb-5">
              <p className={modalStyles.sectionTitle}>Leadership information</p>
              <p className="mt-1 text-sm text-white/55">
                Help us keep your ministry assignment accurate.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
                {errors.title ? (
                  <p className={modalStyles.errorText}>
                    {errors.title.message}
                  </p>
                ) : null}
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
                {errors.department ? (
                  <p className={modalStyles.errorText}>
                    {errors.department.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className={modalStyles.label}
                  htmlFor="leadershipCategory"
                >
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
                {errors.leadershipCategory ? (
                  <p className={modalStyles.errorText}>
                    {errors.leadershipCategory.message}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center rounded-2xl border border-white/10 bg-black/25 px-4 py-3 sm:mt-6">
                <input
                  id="existingMember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 accent-[#f7de12]"
                  {...register('isExistingMember')}
                />
                <label
                  htmlFor="existingMember"
                  className="ml-3 text-sm leading-6 text-white/75"
                >
                  I am updating my existing workforce profile
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="mb-5">
              <p className={modalStyles.sectionTitle}>Additional details</p>
              <p className="mt-1 text-sm text-white/55">
                Optional details for better church administration.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="sm:col-span-2">
                <label
                  className={modalStyles.label}
                  htmlFor="currentAssignment"
                >
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

              <div className="sm:col-span-2">
                <label className={modalStyles.label} htmlFor="notes">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  className={modalStyles.textarea}
                  placeholder="Share any important updates or requests"
                  {...register('notes')}
                />
              </div>
            </div>
          </section>

          <div className="sticky bottom-0 -mx-5 border-t border-white/10 bg-[#070707]/95 px-5 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={modalStyles.primaryButton}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Workforce Details'
              )}
            </button>
          </div>
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
}
