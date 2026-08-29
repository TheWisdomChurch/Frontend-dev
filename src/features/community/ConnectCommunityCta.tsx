'use client';

import { useState } from 'react';
import { ArrowLeft, AtSign, MessageCircle, Users } from 'lucide-react';

import apiClient from '@/lib/api';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { buttonClass } from '@/shared/ui/button';
import { BaseModal, modalStyles } from '@/shared/ui/modals/Modal';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import Arrow from '@/shared/ui/icons/Arrow';
import { SOCIAL_MARKS } from '@/shared/ui/icons/social';

type View = 'closed' | 'options' | 'form';
const EMPTY = { name: '', phone: '', email: '' };

/**
 * "Connect with us" — opens a modal offering three ways in: the WhatsApp
 * community, social media, or leaving contact details for the welcome team.
 * The last option posts to `/notifications/subscribe`; nothing routes away to
 * the contact page.
 */
export function ConnectCommunityCta({ label }: { label: string }) {
  const [view, setView] = useState<View>('closed');
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const close = () => {
    if (submitting) return;
    setView('closed');
    setError(null);
  };

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
        source: 'community',
      });
      setForm(EMPTY);
      setView('closed');
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
        onClick={() => setView('options')}
        className={buttonClass('dark', 'md', 'mt-10')}
      >
        <Users className="h-4 w-4" /> {label}
      </button>

      {/* ── Step 1: the three ways in ─────────────────────── */}
      <BaseModal
        isOpen={view === 'options'}
        onClose={close}
        title="Connect with us"
        subtitle="Pick whichever way suits you — we'd love to have you."
        maxWidth="max-w-lg"
        tone="light"
      >
        <ul className="space-y-3">
          {/* WhatsApp community */}
          <li className="flex flex-col gap-3 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-[color-mix(in_srgb,var(--app-whatsapp)_14%,transparent)] text-[var(--app-whatsapp)]">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-ui text-body-md font-semibold text-[var(--app-text)]">
                  Join our WhatsApp community
                </span>
                <span className="mt-0.5 block font-ui text-label text-[var(--app-muted)]">
                  Daily encouragement, prayer points, and church updates.
                </span>
              </span>
            </div>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className={buttonClass('primary', 'sm', 'shrink-0')}
            >
              Open WhatsApp <Arrow />
            </a>
          </li>

          {/* Social media */}
          <li className="rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-4 sm:p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-[var(--app-primary-10)] text-[var(--app-primary-dark)]">
                <AtSign className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block font-ui text-body-md font-semibold text-[var(--app-text)]">
                  Follow us on social media
                </span>
                <span className="mt-0.5 block font-ui text-label text-[var(--app-muted)]">
                  Sermons, reels, and moments from church life.
                </span>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {SOCIAL_MARKS.map(social => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-subtle)] transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--app-primary)_50%,transparent)]"
                    >
                      <social.Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </li>

          {/* Join form */}
          <li className="flex flex-col gap-3 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-[var(--app-primary-10)] text-[var(--app-primary-dark)]">
                <Users className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-ui text-body-md font-semibold text-[var(--app-text)]">
                  Become part of the family
                </span>
                <span className="mt-0.5 block font-ui text-label text-[var(--app-muted)]">
                  Leave your details and our welcome team will help you find
                  your place.
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setView('form');
              }}
              className={buttonClass('dark', 'sm', 'shrink-0')}
            >
              Join us <Arrow />
            </button>
          </li>
        </ul>
      </BaseModal>

      {/* ── Step 2: the join form ─────────────────────────── */}
      <BaseModal
        isOpen={view === 'form'}
        onClose={close}
        title="Tell us you're in"
        subtitle="Our welcome team will reach out to say hello and help you settle in."
        maxWidth="max-w-md"
        tone="light"
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
            {submitting ? 'Sending…' : 'Join the community'}
          </button>

          <button
            type="button"
            onClick={() => setView('options')}
            className="mx-auto flex items-center gap-1.5 font-ui text-caption font-semibold text-[var(--app-subtle)] transition hover:text-[var(--app-text)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all options
          </button>
        </form>
      </BaseModal>

      <SuccessModal
        isOpen={done}
        onClose={() => setDone(false)}
        title="Welcome — we're glad you're here"
        message="Thank you. Our welcome team will be in touch shortly to help you find your place in the family."
        actionLabel="Done"
      />
    </>
  );
}

export default ConnectCommunityCta;
