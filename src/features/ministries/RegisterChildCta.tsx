'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

import apiClient from '@/lib/api';
import { CONTACT_INFO } from '@/shared/constants/contactInfo';
import { buttonClass } from '@/shared/ui/button';
import { BaseModal, modalStyles } from '@/shared/ui/modals/Modal';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import Arrow from '@/shared/ui/icons/Arrow';
import { cn } from '@/lib/cn';

// The draft is mirrored to the device on every keystroke so a network drop,
// a refresh, or an accidental close can never lose what a parent typed. It is
// cleared only after a confirmed submit.
const DRAFT_KEY = 'wc:child-registration:draft';

function readDraft(): Partial<Fields> | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<Fields>) : null;
  } catch {
    return null;
  }
}
function writeDraft(fields: Fields) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(fields));
  } catch {
    /* private mode / quota — the in-memory form still holds the entries */
  }
}
function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* no-op */
  }
}

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
 * "Register your child" — a single premium modal form for the children's
 * ministry. Posts a structured record via `apiClient.registerChild`, which
 * hits the dedicated `/children/registrations` endpoint (so the admin portal
 * can count children and query by date of birth) and falls back to the audited
 * form pipeline if that endpoint is not yet live. Every keystroke is mirrored
 * to `localStorage` so a submit failure, refresh, or accidental close never
 * loses the parent's entries.
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
  const [savedLocally, setSavedLocally] = useState(false);
  const [done, setDone] = useState(false);

  const age = useMemo(() => ageLabel(form.dob), [form.dob]);
  const hasEntries = useMemo(
    () => Object.values(form).some(v => v !== ''),
    [form]
  );

  // Mirror the form to the device as it changes so nothing is lost on a
  // refresh, an accidental close, or a failed submit.
  useEffect(() => {
    if (open && hasEntries) writeDraft(form);
  }, [form, open, hasEntries]);

  const openModal = () => {
    setError(null);
    const draft = readDraft();
    if (draft) {
      setForm(current => ({ ...current, ...draft }));
      setSavedLocally(true);
    }
    setOpen(true);
  };

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
      await apiClient.registerChild({
        childFullName: form.childName.trim(),
        dateOfBirth: form.dob,
        age,
        gender: form.gender,
        homeAddress: form.address.trim(),
        parentOrGuardianName: form.guardianName.trim(),
        primaryPhoneNumber: form.primaryPhone.trim(),
        emergencyContact: form.emergencyContact.trim(),
        authorizedPickupName: form.authorizedPickup.trim(),
        medicalCondition: form.medical.trim() || 'None reported',
        photoMediaRelease: form.mediaRelease === 'yes',
        sourceChannel: 'frontend:web:children-registration',
      });
      clearDraft();
      setForm(EMPTY);
      setSavedLocally(false);
      setOpen(false);
      setDone(true);
    } catch {
      // The entries are still in the form AND on the device — nothing is lost.
      setError(
        `We couldn't reach the church system just now. Your entry is saved on this device — reopen this form to try again, or call us on ${CONTACT_INFO.phone} and we'll register your child.`
      );
      setSavedLocally(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
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
          {savedLocally ? (
            <p className="flex items-center gap-2 rounded-md bg-[var(--app-primary-10)] px-3 py-2 font-ui text-caption font-medium text-[var(--app-primary-dark)]">
              <ShieldCheck
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              Your entries are saved on this device.
            </p>
          ) : null}

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
