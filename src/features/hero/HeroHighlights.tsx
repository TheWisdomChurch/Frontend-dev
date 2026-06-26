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
import { H3, H4, SmallText, BodySM, Caption } from '@/shared/text';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';

/* =============================================================================
   Data
============================================================================= */

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

const actions = [
  {
    key: 'visit' as const,
    label: 'Plan Your Visit',
    description: 'Prepare your Sunday experience',
    icon: MapPin,
  },
  {
    key: 'watch' as const,
    label: 'Stream Our Service',
    description: 'Get live service reminders',
    icon: PlayCircle,
  },
  {
    key: 'join' as const,
    label: 'Join Us',
    description: 'Serve with a ministry team',
    icon: Users,
  },
] as const;

/* =============================================================================
   Form UI
============================================================================= */

const inputClassName =
  'w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-[var(--app-primary)]/10';

const selectClassName =
  'w-full rounded-2xl border border-white/12 bg-[#1a1814] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-4 focus:ring-[var(--app-primary)]/10';

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

/* =============================================================================
   State
============================================================================= */

type VisitState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  attendance: string;
  notes: string;
};

type WatchState = {
  name: string;
  email: string;
};

type JoinState = {
  name: string;
  email: string;
  phone: string;
  department: Department;
  experience: string;
};

export default function HeroHighlights() {
  const serviceUnavailable = useServiceUnavailable();

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

  const [watch, setWatch] = useState<WatchState>({
    name: '',
    email: '',
  });

  const [join, setJoin] = useState<JoinState>({
    name: '',
    email: '',
    phone: '',
    department: departments[0],
    experience: '',
  });

  const openModal = useCallback((key: ModalKey) => setModal(key), []);
  const closeModal = useCallback(() => setModal(null), []);

  const showUnavailable = useCallback(() => {
    serviceUnavailable.open({
      title: 'Service not available yet',
      message:
        'We are polishing this experience for production. Please check back soon.',
      actionLabel: 'Okay, thanks',
    });
  }, [serviceUnavailable]);

  const onSubmitVisit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      closeModal();
      showUnavailable();

      setVisit({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        attendance: '1',
        notes: '',
      });
    },
    [closeModal, showUnavailable]
  );

  const onSubmitWatch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      closeModal();
      showUnavailable();
      setWatch({ name: '', email: '' });
    },
    [closeModal, showUnavailable]
  );

  const onSubmitJoin = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      closeModal();
      showUnavailable();

      setJoin({
        name: '',
        email: '',
        phone: '',
        department: departments[0],
        experience: '',
      });
    },
    [closeModal, showUnavailable]
  );

  return (
    <section className="border-t border-[var(--app-border)] bg-white py-14 sm:py-16 lg:py-20">
      <Container size="xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-12">
          <div>
            <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
              Next Steps
            </p>
            <H3 className="text-[var(--app-text)]">
              Take your next step with Wisdom House
            </H3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {actions.map(action => {
              const Icon = action.icon;

              return (
                <Button
                  key={action.key}
                  type="button"
                  onClick={() => openModal(action.key)}
                  variant="ghost"
                  className="group rounded-xl border border-[var(--app-border)] p-5 !justify-start text-left transition duration-200 hover:border-[var(--app-primary)]/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--app-primary)]/10 text-[var(--app-primary)] transition group-hover:bg-[var(--app-primary)] group-hover:text-black">
                    <Icon className="h-5 w-5" />
                  </div>

                  <H4 className="mt-4 text-sm font-semibold text-[var(--app-text)] sm:text-base">
                    {action.label}
                  </H4>

                  <SmallText className="mt-2 min-h-[38px] leading-5 text-[var(--app-muted)]">
                    {action.description}
                  </SmallText>

                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[var(--app-primary)]">
                    Continue
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </Container>

      <ModalShell
        open={modal === 'visit'}
        onClose={closeModal}
        title="Plan your visit"
        subtitle="Book a visit appointment—so we can prepare seats, parking, and a warm welcome."
      >
        <form className="space-y-4" onSubmit={onSubmitVisit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full name"
              className={inputClassName}
              value={visit.name}
              onChange={e => setVisit(p => ({ ...p, name: e.target.value }))}
              required
            />

            <input
              type="email"
              placeholder="Email address"
              className={inputClassName}
              value={visit.email}
              onChange={e => setVisit(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className={inputClassName}
              value={visit.phone}
              onChange={e => setVisit(p => ({ ...p, phone: e.target.value }))}
            />

            <select
              className={selectClassName}
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
                  Date
                </span>
                <input
                  type="date"
                  className={inputClassName}
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
                  className={inputClassName}
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
                <Clock className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                Sundays 9:00 AM (WAT)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                We&apos;ll email directions
              </span>
            </div>
          </Card>

          <textarea
            placeholder="Notes (optional) — kids, first time, prayer request, accessibility needs…"
            className={`${inputClassName} min-h-[110px] resize-none`}
            value={visit.notes}
            onChange={e => setVisit(p => ({ ...p, notes: e.target.value }))}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full shadow-[0_18px_45px_rgba(201,150,26,0.25)] hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98]"
          >
            Confirm appointment <ArrowRight className="h-4 w-4" />
          </Button>

          <Caption className="text-white/50">
            We confirm by email and send a reminder. No spam, ever.
          </Caption>
        </form>
      </ModalShell>

      <ModalShell
        open={modal === 'watch'}
        onClose={closeModal}
        title="Watch live or on-demand"
        subtitle="Drop your email and we’ll remind you 30 minutes before we go live."
      >
        <form className="space-y-4" onSubmit={onSubmitWatch}>
          <Card padding="sm" className="rounded-xl bg-white/[0.045]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary)] text-black">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <BodySM weight="semibold" className="text-white">
                  Service reminder
                </BodySM>
                <Caption className="mt-1 text-white/55">
                  We&apos;ll notify you before live service and direct you to
                  the active stream.
                </Caption>
              </div>
            </div>
          </Card>

          <input
            type="text"
            placeholder="Full name"
            className={inputClassName}
            value={watch.name}
            onChange={e => setWatch(p => ({ ...p, name: e.target.value }))}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            className={inputClassName}
            value={watch.email}
            onChange={e => setWatch(p => ({ ...p, email: e.target.value }))}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full shadow-[0_18px_45px_rgba(201,150,26,0.25)] hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98]"
          >
            Notify me <ArrowRight className="h-4 w-4" />
          </Button>

          <Caption className="text-white/50">
            Service reminders only. No spam.
          </Caption>
        </form>
      </ModalShell>

      <ModalShell
        open={modal === 'join'}
        onClose={closeModal}
        title="Join a serve team"
        subtitle="Pick a department and we’ll connect you with the team lead within 24 hours."
      >
        <form className="space-y-4" onSubmit={onSubmitJoin}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full name"
              className={inputClassName}
              value={join.name}
              onChange={e => setJoin(p => ({ ...p, name: e.target.value }))}
              required
            />

            <input
              type="email"
              placeholder="Email address"
              className={inputClassName}
              value={join.email}
              onChange={e => setJoin(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className={inputClassName}
              value={join.phone}
              onChange={e => setJoin(p => ({ ...p, phone: e.target.value }))}
            />

            <select
              className={selectClassName}
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
                <BodySM weight="semibold" className="text-white">
                  Serve with excellence
                </BodySM>
                <Caption className="mt-1 text-white/55">
                  Choose the department you feel called to, and our team will
                  help you take the next step.
                </Caption>
              </div>
            </div>
          </Card>

          <textarea
            placeholder="Any experience? (optional) — music instrument, camera, design, admin, teaching…"
            className={`${inputClassName} min-h-[110px] resize-none`}
            value={join.experience}
            onChange={e => setJoin(p => ({ ...p, experience: e.target.value }))}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full shadow-[0_18px_45px_rgba(201,150,26,0.25)] hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98]"
          >
            Send interest <ArrowRight className="h-4 w-4" />
          </Button>

          <Caption className="text-white/50">
            We’ll reach out by email or phone if provided. No spam.
          </Caption>
        </form>
      </ModalShell>
    </section>
  );
}
