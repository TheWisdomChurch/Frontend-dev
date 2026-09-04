'use client';

import { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

import apiClient from '@/lib/api';
import { buttonClass } from '@/shared/ui/button';
import { BaseModal, modalStyles } from '@/shared/ui/modals/Modal';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import Arrow from '@/shared/ui/icons/Arrow';
import { cn } from '@/lib/cn';

const FORM_SLUG = 'children-registration';

type Fields = {
  childName: string;
  dob: string;
  gender: string;
  address: string;
  guardianName: string;
  primaryPhone: string;
  emergencyContact: string;
  authorizedPickup: string;
  medical: string;
  mediaRelease: 'yes' | 'no' | '';
};

const EMPTY: Fields = {
  childName: '',
  dob: '',
  gender: '',
  address: '',
  guardianName: '',
  primaryPhone: '',
  emergencyContact: '',
  authorizedPickup: '',
  medical: '',
  mediaRelease: '',
};

/** Human age from an ISO date string — "2 years, 4 months old". */
function ageLabel(dob: string): string {
  if (!dob) return '';
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return '';
  const now = new Date();
  let months =
    (now.getFullYear() - born.getFullYear()) * 12 +
    (now.getMonth() - born.getMonth());
  if (now.getDate() < born.getDate()) months -= 1;
  if (months < 0) return '';
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const y = years ? `${years} year${years === 1 ? '' : 's'}` : '';
  const m = rem ? `${rem} month${rem === 1 ? '' : 's'}` : '';
  return `${[y, m].filter(Boolean).join(', ') || '0 months'} old`;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-primary-dark)]">
      {children}
    </p>
  );
}

/**
 * "Register a child" — a single premium modal form for the children's
 * ministry. Posts through the audited public-form pipeline
 * (`/forms/children-registration/submissions`), which stores the record,
 * surfaces it to the admin, and emails the parent a confirmation.
 */
export function RegisterChildCta({
  label = 'Register your child',
  variant = 'primary',
}: {
  label?: string;
  variant?: 'primary' | 'solid' | 'outline';
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Fields>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const age = useMemo(() => ageLabel(form.dob), [form.dob]);

  const set =
    (field: keyof Fields) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm(current => ({ ...current, [field]: event.target.value }));

  const close = () => {
    if (submitting) return;
    setOpen(false);
    setError(null);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    if (!form.mediaRelease) {
      setError('Please choose a photo / media release option.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.submitPublicForm(FORM_SLUG, {
        values: {
          child_full_name: form.childName.trim(),
          child_date_of_birth: form.dob,
          child_age: age,
          gender: form.gender,
          home_address: form.address.trim(),
          parent_or_guardian_name: form.guardianName.trim(),
          primary_phone_number: form.primaryPhone.trim(),
          emergency_contact: form.emergencyContact.trim(),
          authorized_pickup_name: form.authorizedPickup.trim(),
          medical_condition: form.medical.trim() || 'None reported',
          photo_media_release: form.mediaRelease,
          _source: FORM_SLUG,
        },
      });
      setForm(EMPTY);
      setOpen(false);
      setDone(true);
    } catch {
      setError(
        'We could not submit the registration right now. Your entries are still here — please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className={buttonClass(variant)}
      >
        {label} <Arrow />
      </button>

      <BaseModal
        isOpen={open}
        onClose={close}
        title="Register your child"
        subtitle="A few details so our team can care for your child well every Sunday."
        maxWidth="max-w-lg"
        tone="light"
        forceBottomSheet
      >
        <form onSubmit={submit} className="space-y-6">
          {/* ── The child ─────────────────────────────────── */}
          <fieldset className="space-y-4">
            <SectionLabel>The child</SectionLabel>

            <label className="block">
              <span className={modalStyles.label}>Full name of the child</span>
              <input
                required
                value={form.childName}
                onChange={set('childName')}
                autoComplete="off"
                className={modalStyles.input}
                placeholder="Child's full name"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={modalStyles.label}>Date of birth</span>
                <input
                  required
                  type="date"
                  value={form.dob}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={set('dob')}
                  className={modalStyles.input}
                />
                {age ? (
                  <span className="mt-1.5 block font-ui text-caption text-[var(--app-subtle)]">
                    {age}
                  </span>
                ) : null}
              </label>

              <label className="block">
                <span className={modalStyles.label}>Gender</span>
                <select
                  required
                  value={form.gender}
                  onChange={set('gender')}
                  className={modalStyles.select}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className={modalStyles.label}>Home address</span>
              <textarea
                required
                rows={2}
                value={form.address}
                onChange={set('address')}
                autoComplete="street-address"
                className={modalStyles.textarea}
                placeholder="Street, area, city"
              />
            </label>
          </fieldset>

          {/* ── Parent / guardian ─────────────────────────── */}
          <fieldset className="space-y-4 border-t border-[var(--app-border)] pt-5">
            <SectionLabel>Parent / guardian</SectionLabel>

            <label className="block">
              <span className={modalStyles.label}>Parent or guardian name</span>
              <input
                required
                value={form.guardianName}
                onChange={set('guardianName')}
                autoComplete="name"
                className={modalStyles.input}
                placeholder="Your full name"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={modalStyles.label}>Primary phone number</span>
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  value={form.primaryPhone}
                  onChange={set('primaryPhone')}
                  autoComplete="tel"
                  className={modalStyles.input}
                  placeholder="0801 234 5678"
                />
              </label>

              <label className="block">
                <span className={modalStyles.label}>Emergency contact</span>
                <input
                  required
                  value={form.emergencyContact}
                  onChange={set('emergencyContact')}
                  className={modalStyles.input}
                  placeholder="Name & phone"
                />
              </label>
            </div>
          </fieldset>

          {/* ── Safety & permissions ──────────────────────── */}
          <fieldset className="space-y-4 border-t border-[var(--app-border)] pt-5">
            <SectionLabel>Safety &amp; permissions</SectionLabel>

            <label className="block">
              <span className={modalStyles.label}>
                Authorised pick-up name(s)
              </span>
              <input
                required
                value={form.authorizedPickup}
                onChange={set('authorizedPickup')}
                className={modalStyles.input}
                placeholder="Who may collect the child"
              />
            </label>

            <label className="block">
              <span className={modalStyles.label}>
                Medical condition or allergy
              </span>
              <textarea
                rows={2}
                value={form.medical}
                onChange={set('medical')}
                className={modalStyles.textarea}
                placeholder="Write “None” if there are no conditions"
              />
            </label>

            <div>
              <span className={modalStyles.label}>
                Photo / media release — may we use photos or videos of your
                child in church media?
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(['yes', 'no'] as const).map(value => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={form.mediaRelease === value}
                    onClick={() =>
                      setForm(c => ({ ...c, mediaRelease: value }))
                    }
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-input border px-4 py-2.5 font-ui text-body-sm font-semibold capitalize transition',
                      form.mediaRelease === value
                        ? 'border-[var(--app-primary)] bg-[var(--app-primary-10)] text-[var(--app-primary-dark)]'
                        : 'border-[var(--app-border)] text-[var(--app-muted)] hover:border-[color-mix(in_srgb,var(--app-primary)_40%,transparent)]'
                    )}
                  >
                    {value === 'yes' ? 'Yes, I permit it' : 'No'}
                  </button>
                ))}
              </div>
            </div>
          </fieldset>

          {error ? <p className={modalStyles.errorText}>{error}</p> : null}

          <p className="flex items-start gap-2 font-ui text-caption leading-[1.6] text-[var(--app-subtle)]">
            <ShieldCheck
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--app-primary-dark)]"
              aria-hidden="true"
            />
            These details are used only to care for your child and are kept
            confidential by the children&rsquo;s ministry team.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className={modalStyles.primaryButton}
          >
            {submitting ? 'Submitting…' : 'Submit registration'}
          </button>
        </form>
      </BaseModal>

      <SuccessModal
        isOpen={done}
        onClose={() => setDone(false)}
        title="Registration received"
        message="Thank you. We have your child's details and a confirmation email is on its way. Our team will welcome you both this Sunday."
        actionLabel="Done"
      />
    </>
  );
}

export default RegisterChildCta;
