'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
  const [activeCenterIndex, setActiveCenterIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const activeCenter =
    FELLOWSHIP_CENTERS[activeCenterIndex] ?? FELLOWSHIP_CENTERS[0];

  const handlePrev = () => {
    setDirection(-1);
    setActiveCenterIndex(prev =>
      prev === 0 ? FELLOWSHIP_CENTERS.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setActiveCenterIndex(prev =>
      prev === FELLOWSHIP_CENTERS.length - 1 ? 0 : prev + 1
    );
  };

  const handleSelectIndex = (idx: number) => {
    setDirection(idx > activeCenterIndex ? 1 : -1);
    setActiveCenterIndex(idx);
  };

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

      {/* ── Step 1: centers directory (Single Center at a time, with Prev/Next Toggles) ───── */}
      <BaseModal
        isOpen={view === 'centers'}
        onClose={close}
        title="Find a Cell Fellowship center"
        subtitle="Pick the center closest to you — then leave your details and we'll connect you."
        maxWidth="max-w-xl"
      >
        <div className="space-y-5">
          {/* Top Bar with Center Step indicator & Prev/Next Toggle Buttons */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[var(--app-primary)]" />
              <span className="font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-primary-light)]">
                Center {activeCenterIndex + 1} of {FELLOWSHIP_CENTERS.length}
              </span>
            </div>

            {/* Previous / Next Navigation Toggles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous fellowship center"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[var(--app-primary)]/60 hover:bg-white/10 hover:text-white active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next fellowship center"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[var(--app-primary)]/60 hover:bg-white/10 hover:text-white active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Area Jump Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {FELLOWSHIP_CENTERS.map((item, idx) => {
              const isSelected = activeCenterIndex === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectIndex(idx)}
                  className={`rounded-full px-3 py-1 font-ui text-[11px] font-semibold transition-all ${
                    isSelected
                      ? 'border border-[var(--app-primary)] bg-[var(--app-primary)]/20 text-[var(--app-primary-light)]'
                      : 'border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {item.area}
                </button>
              );
            })}
          </div>

          {/* Single Center Display Card with High-End Slide Transition */}
          <div className="relative min-h-[310px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeCenter.id}
                initial={{ opacity: 0, x: direction * 45 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -45 }}
                transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[var(--app-dark-2)] via-[var(--app-dark)] to-black/95 p-6 sm:p-7 shadow-2xl text-white"
              >
                {/* Ambient Gold Glow Backdrop */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--app-primary)_20%,transparent)_0%,transparent_75%)]"
                />

                {/* Card Header: Area Eyebrow + Name */}
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--app-primary)]/40 bg-[var(--app-primary)]/15 px-3 py-1 font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--app-primary-light)]">
                      <Sparkles className="h-3 w-3 text-[var(--app-primary)]" />
                      {activeCenter.area}
                    </span>
                    <span className="font-ui text-xs font-semibold text-white/40">
                      Center {activeCenterIndex + 1}/{FELLOWSHIP_CENTERS.length}
                    </span>
                  </div>
                  <h3 className="mt-3 font-ui text-heading-md sm:text-heading-lg font-bold tracking-tight text-white">
                    {activeCenter.name}
                  </h3>
                </div>

                {/* Card Details: Address, Time, Phone */}
                <div className="my-5 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--app-primary)]/40 bg-[var(--app-primary)]/15 text-[var(--app-primary-light)]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-white/50">
                        Meeting Address
                      </p>
                      <p className="font-ui text-sm font-medium leading-relaxed text-white/90">
                        {activeCenter.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--app-primary)]/40 bg-[var(--app-primary)]/15 text-[var(--app-primary-light)]">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-white/50">
                        Fellowship Schedule
                      </p>
                      <p className="font-ui text-sm font-semibold text-white">
                        {activeCenter.meetingTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--app-primary)]/40 bg-[var(--app-primary)]/15 text-[var(--app-primary-light)]">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-white/50">
                        Coordinator Contact
                      </p>
                      <a
                        href={activeCenter.phoneHref}
                        className="font-ui text-sm font-semibold text-[var(--app-primary-light)] underline decoration-white/20 underline-offset-4 transition hover:text-white"
                      >
                        {activeCenter.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button (High-End Luminous Gold Pill) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCenter(activeCenter);
                      setError(null);
                      setView('form');
                    }}
                    className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--app-primary-dark)] via-[var(--app-primary)] to-[var(--app-primary-light)] py-3.5 px-6 font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-dark)] shadow-[0_4px_20px_color-mix(in_srgb,var(--app-primary)_40%,transparent)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--app-primary)_70%,transparent)] hover:brightness-105 active:scale-[0.98]"
                  >
                    <span>Join {activeCenter.name}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </BaseModal>

      {/* ── Step 2: join form ─────────────────────────────── */}
      <BaseModal
        isOpen={view === 'form'}
        onClose={close}
        title={center ? `Join ${center.name}` : 'Join a Cell Fellowship'}
        subtitle={
          center
            ? `${center.meetingTime} · ${center.address}`
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
            ? `Thank you. The ${center.name} team will reach out to welcome you — they meet ${center.meetingTime.toLowerCase()}.`
            : 'Thank you. Our team will reach out and connect you to a Cell Fellowship center near you.'
        }
        actionLabel="Done"
      />
    </>
  );
}

export default CellFellowshipCta;
