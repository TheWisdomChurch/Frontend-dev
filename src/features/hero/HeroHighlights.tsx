'use client';

import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  CalendarClock,
  Clock,
  Headphones,
  MapPin,
  PlayCircle,
  Users,
} from 'lucide-react';

import { BaseModal } from '@/shared/ui/modals/Base';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import { Container } from '@/shared/layout';
import { Card } from '@/shared/ui/cards';
import { Button } from '@/shared/utils/buttons';
import { Caption } from '@/shared/text';
import { apiClient } from '@/lib/api';

function splitFullName(value: string): { firstName: string; lastName: string } {
  const parts = value.trim().split(/\s+/);
  const firstName = parts.shift() || '';
  return { firstName, lastName: parts.join(' ').trim() || firstName };
}

/* ─────────────────────────────────────────────────────────
   Types & Data
───────────────────────────────────────────────────────── */

type ModalKey = 'visit' | 'watch' | 'join' | null;

const ACTIONS = [
  {
    key: 'visit' as const,
    label: 'Plan a Visit',
    sub: 'Sundays · 9:00 AM',
    cta: 'Plan now',
    icon: MapPin,
  },
  {
    key: 'watch' as const,
    label: 'Stream a Service',
    sub: 'Live & on-demand',
    cta: 'Watch live',
    icon: PlayCircle,
  },
  {
    key: 'join' as const,
    label: 'Serve with Us',
    sub: 'Find your place',
    cta: 'Join a team',
    icon: Users,
  },
] as const;

/* ─────────────────────────────────────────────────────────
   Form input styling
───────────────────────────────────────────────────────── */

const inputClass =
  'w-full rounded-input border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-[var(--app-primary)]/10';

const selectClass =
  'w-full rounded-input border border-white/12 bg-[var(--app-dark-input)] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-4 focus:ring-[var(--app-primary)]/10';

/* ─────────────────────────────────────────────────────────
   Modal shell
───────────────────────────────────────────────────────── */

function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="max-w-2xl"
      forceBottomSheet
    >
      <div className="space-y-5">{children}</div>
    </BaseModal>
  );
}

/* ─────────────────────────────────────────────────────────
   State types
───────────────────────────────────────────────────────── */

type VisitState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  attendance: string;
  notes: string;
};
type WatchState = { name: string; email: string };

/* ─────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────── */

const initialVisit: VisitState = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  attendance: '1',
  notes: '',
};
const initialWatch: WatchState = { name: '', email: '' };

export default function HeroHighlights() {
  const [modal, setModal] = useState<ModalKey>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const [visit, setVisit] = useState<VisitState>(initialVisit);
  const [watch, setWatch] = useState<WatchState>(initialWatch);

  const openModal = useCallback((key: ModalKey) => setModal(key), []);
  const closeModal = useCallback(() => setModal(null), []);

  const onSubmitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const { firstName, lastName } = splitFullName(visit.name);
      await apiClient.submitContactMessage({
        firstName,
        lastName,
        email: visit.email,
        phone: visit.phone || undefined,
        topic: 'visit',
        message:
          visit.notes.trim() ||
          `Requesting a visit appointment for ${visit.attendance} ${visit.attendance === '1' ? 'person' : 'people'}.`,
        sourceChannel: 'frontend:web:hero:plan-visit',
        metadata: {
          preferredDate: visit.date || undefined,
          preferredTime: visit.time || undefined,
          attendance: visit.attendance,
        },
      });
      closeModal();
      setVisit(initialVisit);
      setSuccess({
        title: 'Visit request received',
        message:
          "We've got your details and will email you directions and a reminder before Sunday.",
      });
    } catch (error) {
      console.error('Failed to submit visit request:', error);
      toast.error('We could not submit your visit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitWatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await apiClient.subscribe({ name: watch.name, email: watch.email });
      closeModal();
      setWatch(initialWatch);
      setSuccess({
        title: "You're on the list",
        message: "We'll email you a reminder 30 minutes before we go live.",
      });
    } catch (error) {
      console.error('Failed to subscribe to service reminders:', error);
      toast.error('We could not save your reminder. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goToJoinSection = useCallback(() => {
    document
      .getElementById('join')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      {/* ── Editorial belief strip ────────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-t border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <div className="grid grid-cols-1 divide-y divide-[var(--app-ink)]/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() =>
                    action.key === 'join'
                      ? goToJoinSection()
                      : openModal(action.key)
                  }
                  className="group relative flex flex-col justify-between px-6 py-7 text-left transition duration-200 hover:bg-[var(--app-canvas-2)] sm:px-8 sm:py-8"
                >
                  <div className="flex items-start justify-between">
                    <Icon
                      className="h-4 w-4 text-[var(--app-ink)]/25 transition duration-200 group-hover:text-[var(--app-primary)]"
                      aria-hidden="true"
                    />
                    <ArrowRight
                      className="h-3.5 w-3.5 text-[var(--app-primary)] opacity-0 transition duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-6">
                    <p className="font-headline text-[1.35rem] font-normal leading-snug text-[var(--app-ink)]">
                      {action.label}
                    </p>
                    <p className="mt-1 font-ui text-[0.78rem] text-[var(--app-ink)]/50">
                      {action.sub}
                    </p>
                  </div>

                  <span
                    className="mt-5 inline-flex items-center gap-1.5 font-ui text-[0.72rem] font-semibold text-[var(--app-primary)] opacity-0 transition duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    {action.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Plan a Visit modal ────────────────────────────────── */}
      <ModalShell
        open={modal === 'visit'}
        onClose={closeModal}
        title="Plan your visit"
        subtitle="Book a visit appointment — so we can prepare seats, parking, and a warm welcome."
      >
        <form className="space-y-4" onSubmit={onSubmitVisit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full name"
              className={inputClass}
              value={visit.name}
              onChange={e => setVisit(p => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className={inputClass}
              value={visit.email}
              onChange={e => setVisit(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className={inputClass}
              value={visit.phone}
              onChange={e => setVisit(p => ({ ...p, phone: e.target.value }))}
            />
            <select
              className={selectClass}
              value={visit.attendance}
              onChange={e =>
                setVisit(p => ({ ...p, attendance: e.target.value }))
              }
              aria-label="Number of attendees"
            >
              <option value="1">1 person</option>
              <option value="2">2 people</option>
              <option value="3">3 people</option>
              <option value="4">4 people</option>
              <option value="5+">5+ people</option>
            </select>
          </div>
          <Card padding="sm" className="space-y-3 rounded-xl bg-white/[0.045]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
              <CalendarClock className="h-4 w-4 text-[var(--app-primary)]" />
              Appointment details
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
                  Date
                </span>
                <input
                  type="date"
                  className={inputClass}
                  value={visit.date}
                  onChange={e =>
                    setVisit(p => ({ ...p, date: e.target.value }))
                  }
                  required
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
                  Time
                </span>
                <input
                  type="time"
                  className={inputClass}
                  value={visit.time}
                  onChange={e =>
                    setVisit(p => ({ ...p, time: e.target.value }))
                  }
                  required
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1.5">
                <Clock className="h-3.5 w-3.5 text-[var(--app-primary)]" />{' '}
                Sundays 9:00 AM (WAT)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--app-primary)]" />{' '}
                We'll email directions
              </span>
            </div>
          </Card>
          <textarea
            placeholder="Notes (optional) — kids, first time, prayer request, accessibility needs…"
            className={`${inputClass} min-h-[110px] resize-none`}
            value={visit.notes}
            onChange={e => setVisit(p => ({ ...p, notes: e.target.value }))}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={submitting}
            disabled={submitting}
          >
            Confirm appointment <ArrowRight className="h-4 w-4" />
          </Button>
          <Caption className="text-white/50">
            We confirm by email and send a reminder. No spam, ever.
          </Caption>
        </form>
      </ModalShell>

      {/* ── Watch a service modal ─────────────────────────────── */}
      <ModalShell
        open={modal === 'watch'}
        onClose={closeModal}
        title="Watch live or on-demand"
        subtitle="Drop your email and we'll remind you 30 minutes before we go live."
      >
        <form className="space-y-4" onSubmit={onSubmitWatch}>
          <Card padding="sm" className="rounded-xl bg-white/[0.045]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary)] text-black">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Service reminder
                </p>
                <p className="mt-1 text-xs text-white/55">
                  We'll notify you before live service and direct you to the
                  active stream.
                </p>
              </div>
            </div>
          </Card>
          <input
            type="text"
            placeholder="Full name"
            className={inputClass}
            value={watch.name}
            onChange={e => setWatch(p => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            className={inputClass}
            value={watch.email}
            onChange={e => setWatch(p => ({ ...p, email: e.target.value }))}
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={submitting}
            disabled={submitting}
          >
            Notify me <ArrowRight className="h-4 w-4" />
          </Button>
          <Caption className="text-white/50">
            Service reminders only. No spam.
          </Caption>
        </form>
      </ModalShell>

      <SuccessModal
        isOpen={success !== null}
        onClose={() => setSuccess(null)}
        title={success?.title}
        message={success?.message}
      />
    </>
  );
}
