'use client';

import { useState } from 'react';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';

import apiClient from '@/lib/api';
import { buttonClass } from '@/shared/ui/button';
import { BaseModal, modalStyles } from '@/shared/ui/modals/Modal';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import Arrow from '@/shared/ui/icons/Arrow';
import {
  FELLOWSHIP_CENTERS,
  type FellowshipCenter,
} from '@/features/community/cellFellowshipCenters';

type View = 'closed' | 'centers' | 'form';
const EMPTY = { name: '', phone: '', email: '' };

/**
 * "Join a Cell Fellowship" — opens a directory of centers (name, address,
 * phone). Picking one opens a short form (name / contact number / email) that
 * posts to `/notifications/subscribe` tagged with the chosen center. The
 * backend sends the follow-up email; on a failed submit the entries are kept
 * so nothing is lost.
 */
export function CellFellowshipCta({ label }: { label: string }) {
  const [view, setView] = useState<View>('closed');
  const [center, setCenter] = useState<FellowshipCenter | null>(null);
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
    if (submitting || !center) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.subscribe({
        name: form.name.trim() || undefined,
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        source: `cell-fellowship:${center.id}`,
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
        onClick={() => setView('centers')}
        className={buttonClass('primary')}
      >
        {label} <Arrow />
      </button>

      {/* ── Step 1: centers directory ─────────────────────── */}
      <BaseModal
        isOpen={view === 'centers'}
        onClose={close}
        title="Find a Cell Fellowship center"
        subtitle="Pick the center closest to you — then leave your details and we'll connect you."
        maxWidth="max-w-2xl"
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {FELLOWSHIP_CENTERS.map(item => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
            >
              <div>
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.16em] text-[var(--app-primary-dark)]">
                  {item.area}
                </p>
                <h3 className="mt-1 font-ui text-heading-sm font-semibold text-[var(--app-text)]">
                  {item.name}
                </h3>
              </div>
              <p className="flex items-start gap-2 font-ui text-body-sm leading-[1.6] text-[var(--app-muted)]">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--app-primary-dark)]"
                  aria-hidden="true"
                />
                {item.address}
              </p>
              <a
                href={item.phoneHref}
                className="inline-flex items-center gap-2 font-ui text-body-sm font-semibold text-[var(--app-text)] transition hover:text-[var(--app-primary-dark)]"
              >
                <Phone
                  className="h-4 w-4 shrink-0 text-[var(--app-primary-dark)]"
                  aria-hidden="true"
                />
                {item.phone}
              </a>
              <button
                type="button"
                onClick={() => {
                  setCenter(item);
                  setError(null);
                  setView('form');
                }}
                className={buttonClass('outline', 'sm', 'mt-1 self-start')}
              >
                Join this center
              </button>
            </li>
          ))}
        </ul>
      </BaseModal>

      {/* ── Step 2: join form ─────────────────────────────── */}
      <BaseModal
        isOpen={view === 'form'}
        onClose={close}
        title={center ? `Join ${center.name}` : 'Join a Cell Fellowship'}
        subtitle={
          center
            ? `${center.area} · ${center.address}`
            : 'Leave your details and we will connect you.'
        }
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
            {submitting ? 'Sending…' : 'Join this center'}
          </button>

          <button
            type="button"
            onClick={() => setView('centers')}
            className="mx-auto flex items-center gap-1.5 font-ui text-caption font-semibold text-[var(--app-subtle)] transition hover:text-[var(--app-text)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Choose another center
          </button>
        </form>
      </BaseModal>

      <SuccessModal
        isOpen={done}
        onClose={() => setDone(false)}
        title="We've got your details"
        message={
          center
            ? `Thank you. The ${center.name} team will reach out to welcome you and share the meeting details.`
            : 'Thank you. Our team will reach out and connect you to a Cell Fellowship center near you.'
        }
        actionLabel="Done"
      />
    </>
  );
}

export default CellFellowshipCta;
