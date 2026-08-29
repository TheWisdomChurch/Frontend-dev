'use client';

import { useState } from 'react';

import apiClient from '@/lib/api';
import { buttonClass } from '@/shared/ui/button';
import { BaseModal, modalStyles } from '@/shared/ui/modals/Modal';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import Arrow from '@/shared/ui/icons/Arrow';

interface NotifyCtaProps {
  /** The button label. */
  label: string;
  /** Modal heading. */
  heading: string;
  /** One line under the heading explaining what they're signing up for. */
  blurb: string;
  /** Tag sent to the backend so it knows which list this is. */
  source: string;
  /** Confirmation-screen copy. */
  successTitle?: string;
  successMessage?: string;
}

/**
 * A "notify me" call to action: a primary button that opens a modal collecting
 * name, contact number and email, posts to `/notifications/subscribe`, and
 * shows a confirmation. The backend sends the follow-up email.
 */
export function NotifyCta({
  label,
  heading,
  blurb,
  source,
  successTitle = "You're on the list",
  successMessage = "Thank you. We'll email you with the date, time and venue before the next gathering.",
}: NotifyCtaProps) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm(current => ({ ...current, [field]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.subscribe({
        name: form.name.trim() || undefined,
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        source,
      });
      setForm({ name: '', phone: '', email: '' });
      setOpen(false);
      setDone(true);
    } catch {
      setError(
        'We could not save your details right now. Your entries are still here — please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClass('primary')}
      >
        {label} <Arrow />
      </button>

      <BaseModal
        isOpen={open}
        onClose={() => (submitting ? undefined : setOpen(false))}
        title={heading}
        subtitle={blurb}
        maxWidth="max-w-md"
        forceBottomSheet
      >
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className={modalStyles.label}>Full name</span>
            <input
              required
              value={form.name}
              onChange={update('name')}
              autoComplete="name"
              className={modalStyles.input}
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className={modalStyles.label}>Contact number</span>
            <input
              required
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={update('phone')}
              autoComplete="tel"
              className={modalStyles.input}
              placeholder="0801 234 5678"
            />
          </label>

          <label className="block">
            <span className={modalStyles.label}>Email address</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={update('email')}
              autoComplete="email"
              className={modalStyles.input}
              placeholder="you@example.com"
            />
          </label>

          {error ? <p className={modalStyles.errorText}>{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className={modalStyles.primaryButton}
          >
            {submitting ? 'Sending…' : 'Notify me'}
          </button>

          <p className="text-center font-ui text-caption leading-relaxed text-[var(--app-subtle)]">
            We&apos;ll only email you about this. Unsubscribe any time.
          </p>
        </form>
      </BaseModal>

      <SuccessModal
        isOpen={done}
        onClose={() => setDone(false)}
        title={successTitle}
        message={successMessage}
        actionLabel="Done"
      />
    </>
  );
}

export default NotifyCta;
