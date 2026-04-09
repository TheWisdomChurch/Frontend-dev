// components/ui/Homepage/HeroHighlights.tsx
'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarClock, ArrowRight, Clock, MapPin } from 'lucide-react';

import { useTheme } from '@/components/contexts/ThemeContext';
import { lightShades } from '@/components/colors/colorScheme';
import { BaseModal } from '@/components/ui/modals/Base';
import { Container } from '@/components/layout';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';
import { Dept_1, Dept_2, Dept_3 } from '@/components/assets';

import { motion } from '@/lib/safe-motion';

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

const highlights = [
  {
    key: 'visit',
    title: 'Worship with us onsite',
    meta: 'In-person gathering',
    detail: 'Sundays • 9:00 AM (WAT)',
    description: 'Stay in faith',
    image: Dept_1,
    actionLabel: 'Plan a visit',
  },
  {
    key: 'watch',
    title: 'Live Stream',
    meta: 'Join our online family',
    detail: 'YouTube + Mixlr every service',
    description: 'Stream our service from anywhere.',
    image: Dept_2,
    actionLabel: 'Watch now',
  },
  {
    key: 'join',
    title: 'Serve & Belong',
    meta: 'Creative, worship & outreach',
    detail: 'Join a team this month',
    description: 'Put your gifts to work by serving',
    image: Dept_3,
    actionLabel: 'Join a team',
  },
] as const;

/* =============================================================================
   Small utilities
============================================================================= */

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/* =============================================================================
   Modal shell
============================================================================= */

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
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
          Quick form
        </p>
        {children}
      </div>
    </BaseModal>
  );
}

/* =============================================================================
   Page component
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
  if (typeof window === 'undefined') {
    return null;
  }

  const { colorScheme = lightShades } = useTheme();
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

  const cardBase = useMemo(
    () =>
      cx(
        'relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 backdrop-blur-xl',
        'shadow-[0_18px_50px_rgba(0,0,0,0.35)]'
      ),
    []
  );

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
    <section className="relative z-30 bg-[#0b0b0b]">
      <Container size="xl" className="relative py-6 sm:py-10">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colorScheme.primary }}
              />
              <p className="text-[0.7rem] sm:text-xs uppercase tracking-[0.2em] text-white/60">
                Get connected
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[0.7rem] text-white/50">
              <CalendarClock className="h-4 w-4" />
              <span>Sunday 9:00 AM (WAT)</span>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {highlights.map((item, index) => (
              <motion.article
                key={item.key}
                className={cx(
                  cardBase,
                  'min-w-[250px] sm:min-w-[280px] md:min-w-[320px] snap-start'
                )}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                whileHover={{ translateY: -4 }}
              >
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`${item.title} preview`}
                    fill
                    sizes="(max-width: 640px) 80vw, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute left-4 bottom-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-white/70">
                      {item.meta}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-2.5">
                  <h3 className="text-[0.95rem] sm:text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-[0.72rem] sm:text-sm text-white/70">
                    {item.detail}
                  </p>
                  <p className="text-[0.75rem] sm:text-sm text-white/60 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2">
                    <CustomButton
                      variant="outline"
                      size="sm"
                      curvature="full"
                      className="border border-white/30 text-[0.7rem] sm:text-xs text-white"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.3)',
                      }}
                      onClick={() => openModal(item.key)}
                      type="button"
                    >
                      {item.actionLabel}
                    </CustomButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </Container>

      {/* ===================== MODALS ===================== */}

      <ModalShell
        open={modal === 'visit'}
        onClose={closeModal}
        title="Plan your visit"
        subtitle="Book a visit appointment—so we can prepare seats, parking, and a warm welcome."
      >
        <form className="space-y-3" onSubmit={onSubmitVisit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full name"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.name}
              onChange={e => setVisit(p => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.email}
              onChange={e => setVisit(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.phone}
              onChange={e => setVisit(p => ({ ...p, phone: e.target.value }))}
            />
            <select
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
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

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
              <CalendarClock className="w-4 h-4" />
              Appointment details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                  Date
                </span>
                <input
                  type="date"
                  className="w-full rounded-2xl bg-black/30 border border-white/12 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                  value={visit.date}
                  onChange={e =>
                    setVisit(p => ({ ...p, date: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                  Time
                </span>
                <input
                  type="time"
                  className="w-full rounded-2xl bg-black/30 border border-white/12 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                  value={visit.time}
                  onChange={e =>
                    setVisit(p => ({ ...p, time: e.target.value }))
                  }
                  required
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-white/75">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1">
                <Clock className="w-3.5 h-3.5" /> Sundays 9:00 AM (WAT)
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1">
                <MapPin className="w-3.5 h-3.5" /> We’ll email directions
              </span>
            </div>
          </div>

          <textarea
            placeholder="Notes (optional) — kids, first time, prayer request, accessibility needs…"
            className="w-full min-h-[96px] rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary resize-none"
            value={visit.notes}
            onChange={e => setVisit(p => ({ ...p, notes: e.target.value }))}
          />

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
          >
            Confirm appointment <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-white/50 text-xs">
            We confirm by email and send a reminder. No spam, ever.
          </p>
        </form>
      </ModalShell>

      <ModalShell
        open={modal === 'watch'}
        onClose={closeModal}
        title="Watch live or on-demand"
        subtitle="Drop your email and we’ll remind you 30 minutes before we go live."
      >
        <form className="space-y-3" onSubmit={onSubmitWatch}>
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
            value={watch.name}
            onChange={e => setWatch(p => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
            value={watch.email}
            onChange={e => setWatch(p => ({ ...p, email: e.target.value }))}
            required
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
          >
            Notify me <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/50 text-xs">
            Service reminders only. No spam.
          </p>
        </form>
      </ModalShell>

      <ModalShell
        open={modal === 'join'}
        onClose={closeModal}
        title="Join a serve team"
        subtitle="Pick a department and we’ll connect you with the team lead within 24 hours."
      >
        <form className="space-y-3" onSubmit={onSubmitJoin}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full name"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.name}
              onChange={e => setJoin(p => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.email}
              onChange={e => setJoin(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.phone}
              onChange={e => setJoin(p => ({ ...p, phone: e.target.value }))}
            />

            <select
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
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

          <textarea
            placeholder="Any experience? (optional) — music instrument, camera, design, admin, teaching…"
            className="w-full min-h-[96px] rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary resize-none"
            value={join.experience}
            onChange={e => setJoin(p => ({ ...p, experience: e.target.value }))}
          />

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
          >
            Send interest <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-white/50 text-xs">
            We’ll reach out by email (or phone if provided). No spam.
          </p>
        </form>
      </ModalShell>
    </section>
  );
}
