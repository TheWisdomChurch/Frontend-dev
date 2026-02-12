// components/ui/Homepage/HeroHighlights.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarClock,
  Radio,
  Users,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';

import { useTheme } from '@/components/contexts/ThemeContext';
import { lightShades } from '@/components/colors/colorScheme';
import { BaseModal } from '@/components/modal/Base';
import { Container } from '@/components/layout';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';

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
    icon: CalendarClock,
    href: '/contact',
    actionLabel: 'Plan a visit',
  },
  {
    key: 'watch',
    title: 'Live Stream',
    meta: 'Join our online family',
    detail: 'YouTube + Mixlr every service',
    description: 'Stream our service from anywhere.',
    icon: Radio,
    href: '/resources/sermons',
    actionLabel: 'Watch now',
  },
  {
    key: 'join',
    title: 'Serve & Belong',
    meta: 'Creative, worship & outreach',
    detail: 'Join a team this month',
    description: 'Put your gifts to work by serving',
    icon: Users,
    href: '#join',
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
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Quick form</p>
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
      message: 'We are polishing this experience for production. Please check back soon.',
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
    <section className="relative z-30" style={{ background: '#0b0b0b' }}>
      <Container size="xl" className="relative py-4 sm:py-5 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.key}
                className={cardBase}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.06 * index, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ translateY: -4, transition: { duration: 0.2 } }}
              >
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(900px circle at 20% 20%, ${colorScheme.opacity?.primary20 ?? 'rgba(251,191,36,0.20)'}, transparent 55%)`,
                  }}
                />

                <div className="relative p-4 sm:p-5 lg:p-6 space-y-2.5 sm:space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-white/70 font-medium">
                        {item.meta}
                      </p>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white leading-tight">
                        {item.title}
                      </h3>
                    </div>

                    <span
                      className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-white/20 shadow-inner shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark ?? colorScheme.primary} 100%)`,
                        boxShadow: `0 16px 26px ${colorScheme.opacity?.primary25 ?? 'rgba(251,191,36,0.25)'}`,
                      }}
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5 text-black" />
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-sm font-medium text-white">{item.detail}</p>
                  <p className="text-[12px] sm:text-sm leading-relaxed text-white/70">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <CustomButton
                      variant="outline"
                      size="sm"
                      curvature="full"
                      className="border border-white/30 text-[11px] sm:text-xs text-white"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.10)',
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.30)',
                      }}
                      onClick={() => openModal(item.key)}
                      type="button"
                    >
                      {item.actionLabel}
                    </CustomButton>

                    <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/70">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
                      <span>Always on mission</span>
                    </div>
                  </div>

                  {/* <div className="pt-1">
                    <Link
                      href={item.href}
                      className="text-[11px] sm:text-xs text-white/55 hover:text-white/80 inline-flex items-center gap-2"
                    >
                      Open page <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div> */}
                </div>
              </motion.article>
            );
          })}
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
              onChange={(e) => setVisit((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.email}
              onChange={(e) => setVisit((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.phone}
              onChange={(e) => setVisit((p) => ({ ...p, phone: e.target.value }))}
            />
            <select
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={visit.attendance}
              onChange={(e) => setVisit((p) => ({ ...p, attendance: e.target.value }))}
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
                <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">Date</span>
                <input
                  type="date"
                  className="w-full rounded-2xl bg-black/30 border border-white/12 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                  value={visit.date}
                  onChange={(e) => setVisit((p) => ({ ...p, date: e.target.value }))}
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">Time</span>
                <input
                  type="time"
                  className="w-full rounded-2xl bg-black/30 border border-white/12 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                  value={visit.time}
                  onChange={(e) => setVisit((p) => ({ ...p, time: e.target.value }))}
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
            onChange={(e) => setVisit((p) => ({ ...p, notes: e.target.value }))}
          />

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
          >
            Confirm appointment <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-white/50 text-xs">We confirm by email and send a reminder. No spam, ever.</p>
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
            onChange={(e) => setWatch((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
            value={watch.email}
            onChange={(e) => setWatch((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
          >
            Notify me <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/50 text-xs">Service reminders only. No spam.</p>
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
              onChange={(e) => setJoin((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.email}
              onChange={(e) => setJoin((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.phone}
              onChange={(e) => setJoin((p) => ({ ...p, phone: e.target.value }))}
            />

            <select
              className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
              value={join.department}
              onChange={(e) => setJoin((p) => ({ ...p, department: e.target.value as Department }))}
              required
              aria-label="Select department"
            >
              {departments.map((d) => (
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
            onChange={(e) => setJoin((p) => ({ ...p, experience: e.target.value }))}
          />

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
          >
            Send interest <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-white/50 text-xs">We’ll reach out by email (or phone if provided). No spam.</p>
        </form>
      </ModalShell>
    </section>
  );
}
