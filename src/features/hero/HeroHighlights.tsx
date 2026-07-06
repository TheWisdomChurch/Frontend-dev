'use client';

import React, { useCallback, useState } from 'react';
import {
  ArrowRight,
  CalendarClock,
  Clock,
  Headphones,
  HeartHandshake,
  MapPin,
  PlayCircle,
  Users,
} from 'lucide-react';

import { BaseModal } from '@/shared/ui/modals/Base';
import { Container } from '@/shared/layout';
import { Card } from '@/shared/ui/cards';
import { Button } from '@/shared/utils/buttons';
import { Caption } from '@/shared/text';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';

/* ─────────────────────────────────────────────────────────
   Types & Data
───────────────────────────────────────────────────────── */

const departments = [
  'Media',
  'Music',
  'Hospitality',
  'Protocol',
  'Prayer',
  'Children',
  'Ushering',
] as const;

type Department = (typeof departments)[number];
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
  'w-full rounded-input border border-white/12 bg-[#1a1814] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-4 focus:ring-[var(--app-primary)]/10';

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
type JoinState = {
  name: string;
  email: string;
  phone: string;
  department: Department;
  experience: string;
};

/* ─────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────── */

export default function HeroHighlights() {
  const { open: showUnavailable } = useServiceUnavailable();

  const [modal, setModal] = useState<ModalKey>(null);

  const [visit, setVisit] = useState<VisitState>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    attendance: '1',
    notes: '',
  });
  const [watch, setWatch] = useState<WatchState>({ name: '', email: '' });
  const [join, setJoin] = useState<JoinState>({
    name: '',
    email: '',
    phone: '',
    department: departments[0],
    experience: '',
  });

  const openModal = useCallback((key: ModalKey) => setModal(key), []);
  const closeModal = useCallback(() => setModal(null), []);

  const onUnavailable = useCallback(() => {
    closeModal();
    showUnavailable({
      title: 'Coming soon',
      message: 'We are polishing this for production.',
      actionLabel: 'Got it',
    });
  }, [closeModal, showUnavailable]);

  const onSubmitVisit = (e: React.FormEvent) => {
    e.preventDefault();
    onUnavailable();
    setVisit({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      attendance: '1',
      notes: '',
    });
  };
  const onSubmitWatch = (e: React.FormEvent) => {
    e.preventDefault();
    onUnavailable();
    setWatch({ name: '', email: '' });
  };
  const onSubmitJoin = (e: React.FormEvent) => {
    e.preventDefault();
    onUnavailable();
    setJoin({
      name: '',
      email: '',
      phone: '',
      department: departments[0],
      experience: '',
    });
  };

  return (
    <>
      {/* ── Editorial belief strip ────────────────────────────── */}
      <section className="border-t border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <div className="grid grid-cols-1 divide-y divide-[var(--app-ink)]/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => openModal(action.key)}
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
          <Button type="submit" variant="primary" className="w-full">
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
          <Button type="submit" variant="primary" className="w-full">
            Notify me <ArrowRight className="h-4 w-4" />
          </Button>
          <Caption className="text-white/50">
            Service reminders only. No spam.
          </Caption>
        </form>
      </ModalShell>

      {/* ── Join a team modal ─────────────────────────────────── */}
      <ModalShell
        open={modal === 'join'}
        onClose={closeModal}
        title="Join a serve team"
        subtitle="Pick a department and we'll connect you with the team lead within 24 hours."
      >
        <form className="space-y-4" onSubmit={onSubmitJoin}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full name"
              className={inputClass}
              value={join.name}
              onChange={e => setJoin(p => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className={inputClass}
              value={join.email}
              onChange={e => setJoin(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className={inputClass}
              value={join.phone}
              onChange={e => setJoin(p => ({ ...p, phone: e.target.value }))}
            />
            <select
              className={selectClass}
              value={join.department}
              onChange={e =>
                setJoin(p => ({
                  ...p,
                  department: e.target.value as Department,
                }))
              }
              required
              aria-label="Select department"
            >
              {departments.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <Card padding="sm" className="rounded-xl bg-white/[0.045]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary)] text-black">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Serve with excellence
                </p>
                <p className="mt-1 text-xs text-white/55">
                  Choose the department you feel called to, and our team will
                  help you take the next step.
                </p>
              </div>
            </div>
          </Card>
          <textarea
            placeholder="Any experience? (optional)"
            className={`${inputClass} min-h-[110px] resize-none`}
            value={join.experience}
            onChange={e => setJoin(p => ({ ...p, experience: e.target.value }))}
          />
          <Button type="submit" variant="primary" className="w-full">
            Send interest <ArrowRight className="h-4 w-4" />
          </Button>
          <Caption className="text-white/50">
            We'll reach out by email or phone if provided. No spam.
          </Caption>
        </form>
      </ModalShell>
    </>
  );
}
