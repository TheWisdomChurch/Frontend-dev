// components/ui/Homepage/HeroHighlights.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, Radio, Users, ArrowRight, X } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { lightShades } from '@/components/colors/colorScheme';
import { Container } from '@/components/layout';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';

const highlights = [
  {
    title: 'Worship with us onsite',
    meta: 'In-person gathering',
    detail: 'Sundays • 9:00 AM (WAT)',
    description: 'Be in the room for worship, teaching, and community.',
    icon: CalendarClock,
    href: '/contact',
    actionLabel: 'Plan a visit',
  },
  {
    key: 'watch',
    title: 'Live Stream',
    meta: 'Join our online family',
    detail: 'YouTube + Mixlr every service',
    description: 'Stay in the flow from anywhere on earth.',
    icon: Radio,
    href: '/resources/sermons',
    actionLabel: 'Watch now',
  },
  {
    key: 'join',
    title: 'Serve & Belong',
    meta: 'Creative, worship & outreach',
    detail: 'Join a team this month',
    description: 'Put your gifts to work in music, media, youth, or prayer.',
    icon: Users,
    href: '#join',
    actionLabel: 'Join a team',
  },
] as const;

export default function HeroHighlights() {
  const { colorScheme = lightShades } = useTheme();
  const [modal, setModal] = useState<'visit' | 'watch' | 'join' | null>(null);
  const { open } = useServiceUnavailable();

type Department = (typeof departments)[number];

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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function useLockBody(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);
}

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
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  useLockBody(open);

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-md" onClick={() => setModal(null)} />
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl rounded-[28px] border border-white/12 bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-[#0c0c0c] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] text-white"
          >
            <button
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 text-white/70 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-3 pr-10">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Quick form</p>
              <h3 className="text-3xl font-black leading-tight">{copy.title}</h3>
              <p className="text-white/75 text-sm leading-relaxed">{copy.description}</p>
            </div>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setModal(null);
                open({
                  title: 'Service not available yet',
                  message:
                    'We are polishing this experience for production. Please check back soon.',
                  actionLabel: 'Okay, thanks',
                });
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3.5 text-white text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
                  required
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3.5 text-white text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
                  required
                />
                {modal === 'visit' ? (
                  <input
                    type="date"
                    className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3.5 text-white text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Which team? (media, music, hospitality)"
                    className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3.5 text-white text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
                    required
                  />
                )}
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3.5 text-white text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
                  required
                />
              </div>
              <textarea
                placeholder="Anything we should know?"
                className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3.5 text-white text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/60 min-h-[120px] resize-none"
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-white/55 text-xs">
                  We confirm by email and send a reminder. No spam, ever.
                </p>
                <CustomButton
                  variant="primary"
                  size="md"
                  curvature="xl"
                  className="px-6 py-3 text-sm font-semibold shadow-lg shadow-primary/20"
                >
                  {copy.cta}
                </CustomButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section className="relative z-30" style={{ background: '#0b0b0b' }}>
      <Container size="xl" className="relative py-4 sm:py-5 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                className={cardBase}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.06 * index, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ translateY: -4, transition: { duration: 0.2 } }}
              >
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(900px circle at 20% 20%, ${colorScheme.opacity.primary20}, transparent 55%)`,
                  }}
                />

                <div className="relative p-4 sm:p-5 lg:p-6 space-y-2.5 sm:space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-white/70 font-semibold">
                        {item.meta}
                      </p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight">{item.title}</h3>
                    </div>

                    <span
                      className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-white/20 shadow-inner shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                        boxShadow: `0 16px 26px ${colorScheme.opacity.primary25}`,
                      }}
                      aria-hidden="true"
                    >
                      <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-black" />
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-sm font-semibold text-white">{item.detail}</p>

                  <p className="text-[12px] sm:text-sm leading-relaxed text-white/75">{item.description}</p>

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
                    >
                      {item.actionLabel}
                    </CustomButton>

                    <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/70">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
                      <span>Always on mission</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link
                      href={item.href}
                      className="text-[11px] sm:text-xs text-white/55 hover:text-white/80 inline-flex items-center gap-2"
                    >
                      Open page <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>

      {/* ===================== MODALS ===================== */}

      <ModalShell
        open={open === 'visit'}
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
        open={open === 'watch'}
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
        open={open === 'join'}
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
