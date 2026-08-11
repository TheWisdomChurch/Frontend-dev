'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Headphones,
  MapPin,
  Navigation,
  ShieldCheck,
  PlayCircle,
  Users,
} from 'lucide-react';

import { BaseModal } from '@/shared/ui/modals/Base';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import { Container } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { Caption } from '@/shared/text';
import { apiClient } from '@/lib/api';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion/staggerReveal';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { PhoneNumberField } from '@/shared/ui/forms';
import {
  DEFAULT_PHONE_COUNTRY,
  isValidNationalPhone,
  toE164,
} from '@/lib/validation/phone';
import type { CountryCode } from 'libphonenumber-js';
import {
  getUpcomingSundayServices,
  type SundayService,
} from '@/lib/serviceCalendar';
import type { VisitRequestConfirmation } from '@/lib/types';
import { buildDrivingDirectionsUrl } from '@/domain/navigation/directions';
import { PLAN_VISIT_EVENT } from './planVisitEvent';

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
    sub: `${SERVICE_INFO.sunday.day}s · ${SERVICE_INFO.sunday.time}`,
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
  'w-full border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/45 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-[var(--app-primary)]/12';

const selectClass =
  'w-full border border-white/12 bg-[var(--app-dark-input)] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-2 focus:ring-[var(--app-primary)]/12';

const fieldLabelClass =
  'font-ui text-caption font-bold uppercase tracking-[0.15em] text-white/45';

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
  reminderOptIn: boolean;
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
  time: '09:00',
  attendance: '1',
  notes: '',
  reminderOptIn: true,
};
const initialWatch: WatchState = { name: '', email: '' };

export default function HeroHighlights({
  modalOnly = false,
}: {
  modalOnly?: boolean;
}) {
  const [modal, setModal] = useState<ModalKey>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [visitConfirmation, setVisitConfirmation] =
    useState<VisitRequestConfirmation | null>(null);

  const [visit, setVisit] = useState<VisitState>(initialVisit);
  const [visitPhoneCountry, setVisitPhoneCountry] = useState<CountryCode>(
    DEFAULT_PHONE_COUNTRY
  );
  const [visitDates, setVisitDates] = useState<SundayService[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleVerified, setScheduleVerified] = useState(false);
  const [watch, setWatch] = useState<WatchState>(initialWatch);

  const loadVisitSchedule = useCallback(async () => {
    setScheduleLoading(true);
    setScheduleVerified(false);
    try {
      const services = await apiClient.listVisitServices(8);
      const formatter = new Intl.DateTimeFormat('en-NG', {
        month: 'short',
        day: 'numeric',
        timeZone: 'Africa/Lagos',
      });
      const options = services.map((service, index) => ({
        value: service.date,
        day: index === 0 ? 'Next Sunday' : 'Sunday',
        date: formatter.format(new Date(service.serviceAt)),
        serviceType: service.serviceType,
      }));
      setVisitDates(options);
      setVisit(current => ({
        ...current,
        date: options.some(option => option.value === current.date)
          ? current.date
          : options[0]?.value || '',
      }));
      setScheduleVerified(options.length > 0);
    } catch {
      // The backend uses the same deterministic Sunday classification rules.
      // Keep the visitor moving during a rolling backend deployment or a
      // temporary schedule-read outage; submission is still validated by the
      // backend before a visit is accepted.
      const fallback = getUpcomingSundayServices(new Date(), 8);
      setVisitDates(fallback);
      setVisit(current => ({
        ...current,
        date: fallback.some(option => option.value === current.date)
          ? current.date
          : fallback[0]?.value || '',
      }));
      setScheduleVerified(fallback.length > 0);
    } finally {
      setScheduleLoading(false);
    }
  }, []);

  const openModal = useCallback(
    (key: ModalKey) => {
      if (key === 'visit') {
        const upcoming = getUpcomingSundayServices();
        setVisitDates(upcoming);
        setVisit(current => ({
          ...current,
          date: current.date || upcoming[0]?.value || '',
          time: '09:00',
        }));
        void loadVisitSchedule();
      }
      setModal(key);
    },
    [loadVisitSchedule]
  );
  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    const handlePlanVisit = () => openModal('visit');
    window.addEventListener(PLAN_VISIT_EVENT, handlePlanVisit);
    return () => window.removeEventListener(PLAN_VISIT_EVENT, handlePlanVisit);
  }, [openModal]);

  const onSubmitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (
      visit.phone.trim() &&
      !isValidNationalPhone(visit.phone, visitPhoneCountry)
    ) {
      toast.error('Enter a valid phone number for the selected country.');
      return;
    }
    setSubmitting(true);
    try {
      const { firstName, lastName } = splitFullName(visit.name);
      const confirmation = await apiClient.submitVisitRequest({
        firstName,
        lastName,
        email: visit.email,
        phone: visit.phone
          ? toE164(visit.phone, visitPhoneCountry) || undefined
          : undefined,
        serviceDate: visit.date,
        attendance: Number.parseInt(visit.attendance, 10) || 1,
        notes: visit.notes.trim() || undefined,
        reminderOptIn: visit.reminderOptIn,
        sourceChannel: 'frontend:web:hero:plan-visit',
        idempotencyKey: `visit:${visit.email.trim().toLowerCase()}:${visit.date}`,
      });
      closeModal();
      setVisit(initialVisit);
      setVisitPhoneCountry(DEFAULT_PHONE_COUNTRY);
      setVisitConfirmation(confirmation);
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
      {!modalOnly ? (
        <section className="overflow-hidden min-w-0 border-t border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
          <Container size="xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={staggerViewport}
              className="grid grid-cols-1 divide-y divide-[var(--app-ink)]/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {ACTIONS.map(action => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.key}
                    variants={staggerItem}
                    type="button"
                    onClick={() =>
                      action.key === 'join'
                        ? goToJoinSection()
                        : openModal(action.key)
                    }
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="group relative flex flex-col justify-between px-6 py-7 text-left transition-colors duration-200 hover:bg-[var(--app-canvas-2)] sm:px-8 sm:py-8"
                  >
                    <div className="flex items-start justify-between">
                      <span className="relative">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-[var(--app-primary)]/0 blur-lg transition-colors duration-300 group-hover:bg-[var(--app-primary)]/20"
                        />
                        <Icon
                          className="h-4 w-4 text-[var(--app-ink)]/60 transition duration-200 group-hover:text-[var(--app-primary)]"
                          aria-hidden="true"
                        />
                      </span>
                      <ArrowRight
                        className="h-3.5 w-3.5 text-[var(--app-primary)] opacity-0 transition duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="mt-6">
                      <p className="font-headline text-heading-sm font-normal leading-snug text-[var(--app-ink)]">
                        {action.label}
                      </p>
                      <p className="mt-1 font-ui text-label text-[var(--app-ink)]/50">
                        {action.sub}
                      </p>
                    </div>

                    <span
                      className="mt-5 inline-flex items-center gap-1.5 font-ui text-label font-semibold text-[var(--app-primary)] opacity-0 transition duration-200 group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      {action.cta} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </Container>
        </section>
      ) : null}

      {/* ── Plan a Visit modal ────────────────────────────────── */}
      <ModalShell
        open={modal === 'visit'}
        onClose={closeModal}
        title="Plan your visit"
        subtitle="Tell us you're coming and our welcome team will take care of the details."
      >
        <form className="min-w-0 space-y-5" onSubmit={onSubmitVisit}>
          <div className="relative min-w-0 overflow-hidden rounded-2xl border border-[var(--app-primary)]/20 bg-[linear-gradient(135deg,rgba(201,150,26,.16),rgba(255,255,255,.035))] p-4 sm:rounded-3xl sm:p-5">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--app-primary)]/15 blur-3xl" />
            <div className="relative flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--app-primary)]/25 bg-black/25 text-[var(--app-primary)] sm:h-11 sm:w-11 sm:rounded-2xl">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div className="min-w-0 break-words">
                <p className="font-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--app-primary)] sm:text-xs sm:tracking-[0.18em]">
                  Sunday worship
                </p>
                <p className="mt-1 break-words font-headline text-lg leading-tight text-white sm:text-xl">
                  {SERVICE_INFO.sunday.time}{' '}
                  <span className="font-ui text-xs text-white/45 sm:text-sm">
                    {SERVICE_INFO.sunday.timezone}
                  </span>
                </p>
                <p className="mt-1.5 max-w-lg break-words font-ui text-xs leading-5 text-white/55">
                  {SERVICE_INFO.venue.full}
                </p>
              </div>
            </div>
          </div>

          <fieldset>
            <legend className={fieldLabelClass}>
              {scheduleLoading
                ? 'Verifying Sunday schedule…'
                : 'Choose your Sunday'}
            </legend>
            <div className="mt-2 grid min-w-0 grid-cols-1 gap-2 min-[390px]:grid-cols-2 md:grid-cols-4">
              {visitDates.map(option => {
                const selected = visit.date === option.value;
                return (
                  <label
                    key={option.value}
                    className={`relative min-w-0 cursor-pointer rounded-2xl border px-3 py-3 transition ${
                      selected
                        ? 'border-[var(--app-primary)]/65 bg-[var(--app-primary)]/12 text-white'
                        : 'border-white/10 bg-white/[0.035] text-white/55 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visit-date"
                      value={option.value}
                      checked={selected}
                      onChange={() =>
                        setVisit(current => ({
                          ...current,
                          date: option.value,
                        }))
                      }
                      className="sr-only"
                    />
                    <span className="block font-ui text-[10px] font-bold uppercase tracking-[0.14em] opacity-65">
                      {option.day}
                    </span>
                    <span className="mt-1 flex min-w-0 items-center justify-between gap-2 font-ui text-sm font-bold">
                      {option.date}
                      {selected ? (
                        <Check className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                      ) : null}
                    </span>
                    <span className="mt-1.5 block break-words font-ui text-[10px] leading-4 opacity-60">
                      {option.serviceType}
                    </span>
                  </label>
                );
              })}
            </div>
            {!scheduleLoading && !scheduleVerified ? (
              <div className="mt-3 flex min-w-0 flex-col items-start gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <p className="font-ui text-xs leading-5 text-amber-100/70">
                  Booking is paused until the live service calendar is verified.
                </p>
                <button
                  type="button"
                  onClick={() => void loadVisitSchedule()}
                  className="shrink-0 font-ui text-xs font-bold text-[var(--app-primary)] hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : null}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className={fieldLabelClass}>Full name</span>
              <input
                type="text"
                autoComplete="name"
                placeholder="How should we welcome you?"
                className={`${inputClass} rounded-2xl`}
                value={visit.name}
                onChange={e =>
                  setVisit(current => ({ ...current, name: e.target.value }))
                }
                required
              />
            </label>
            <label className="space-y-2">
              <span className={fieldLabelClass}>Email address</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`${inputClass} rounded-2xl`}
                value={visit.email}
                onChange={e =>
                  setVisit(current => ({ ...current, email: e.target.value }))
                }
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className={fieldLabelClass}>Phone number (optional)</span>
              <PhoneNumberField
                id="visit-phone"
                country={visitPhoneCountry}
                number={visit.phone}
                onCountryChange={setVisitPhoneCountry}
                onNumberChange={phone =>
                  setVisit(current => ({ ...current, phone }))
                }
                inputClassName={`${inputClass} rounded-r-2xl`}
                selectClassName={`${selectClass} rounded-l-2xl`}
                placeholder="Phone number"
              />
            </label>
            <label className="space-y-2">
              <span className={fieldLabelClass}>Your party</span>
              <select
                className={`${selectClass} rounded-2xl`}
                value={visit.attendance}
                onChange={e =>
                  setVisit(current => ({
                    ...current,
                    attendance: e.target.value,
                  }))
                }
              >
                <option value="1">Just me</option>
                <option value="2">2 people</option>
                <option value="3">3 people</option>
                <option value="4">4 people</option>
                <option value="5+">5 or more people</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className={fieldLabelClass}>Anything we should know?</span>
            <textarea
              placeholder="Children joining you, accessibility needs, a prayer request…"
              className={`${inputClass} min-h-[100px] resize-none rounded-2xl leading-6`}
              value={visit.notes}
              onChange={e =>
                setVisit(current => ({ ...current, notes: e.target.value }))
              }
            />
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-3.5">
            <input
              type="checkbox"
              checked={visit.reminderOptIn}
              onChange={event =>
                setVisit(current => ({
                  ...current,
                  reminderOptIn: event.target.checked,
                }))
              }
              className="mt-0.5 h-4 w-4 accent-[var(--app-primary)]"
            />
            <span className="font-ui text-xs leading-5 text-white/50">
              Send me one reminder before this service. Your booking
              confirmation is transactional and will still be sent.
            </span>
          </label>

          <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <p className="min-w-0 break-words font-ui text-xs leading-5 text-white/45">
                We’ll email your confirmation, directions, and a reminder before
                service.
              </p>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="mt-3 min-h-12 w-full shrink-0 whitespace-normal rounded-full px-5 py-3 text-center font-ui text-sm font-bold leading-5 sm:mt-0 sm:w-auto sm:px-6"
              loading={submitting}
              disabled={
                submitting ||
                scheduleLoading ||
                !scheduleVerified ||
                !visit.date
              }
            >
              Reserve my welcome <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
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
          <div className="flex items-start gap-3 border border-white/10 bg-white/[0.03] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <p className="font-ui text-body-sm font-semibold text-white">
                Service reminder
              </p>
              <p className="mt-1 font-ui text-label leading-[1.6] text-white/50">
                We'll notify you before live service and direct you to the
                active stream.
              </p>
            </div>
          </div>
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
            className="h-12 w-full font-ui text-body-sm font-bold"
            loading={submitting}
            disabled={submitting}
          >
            Notify me <ArrowRight className="h-4 w-4" />
          </Button>
          <Caption className="text-center text-white/40">
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

      <BaseModal
        isOpen={visitConfirmation !== null}
        onClose={() => setVisitConfirmation(null)}
        maxWidth="max-w-lg"
        showCloseButton={false}
        forceBottomSheet
      >
        {visitConfirmation ? (
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-5 font-ui text-xs font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
              Visit confirmed
            </p>
            <h2 className="mt-2 break-words font-headline text-2xl leading-tight text-white sm:text-3xl">
              We’re expecting you.
            </h2>
            <p className="mx-auto mt-3 max-w-sm font-ui text-sm leading-6 text-white/55">
              {visitConfirmation.reminderOptIn
                ? 'Your confirmation is saved, the welcome team has been notified, and your reminder is scheduled.'
                : 'Your confirmation is saved and the welcome team has been notified.'}
            </p>
            <div className="mt-6 min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left sm:rounded-3xl sm:p-5">
              <p className="break-words font-ui text-xs font-bold uppercase tracking-[0.12em] text-white/40 sm:tracking-[0.16em]">
                {visitConfirmation.serviceType}
              </p>
              <p className="mt-2 break-words font-headline text-lg leading-snug text-white sm:text-xl">
                {new Intl.DateTimeFormat('en-NG', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'Africa/Lagos',
                }).format(new Date(visitConfirmation.serviceAt))}
              </p>
              <p className="mt-1 font-ui text-sm text-white/55">
                {SERVICE_INFO.sunday.time} {SERVICE_INFO.sunday.timezone} ·{' '}
                {visitConfirmation.attendance}{' '}
                {visitConfirmation.attendance === 1 ? 'guest' : 'guests'}
              </p>
              <p className="mt-4 break-all border-t border-white/8 pt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-white/35 sm:tracking-[0.12em]">
                Reference {visitConfirmation.id}
              </p>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <a
                href={buildDrivingDirectionsUrl({
                  destination: SERVICE_INFO.venue.full,
                  destinationPlaceId: SERVICE_INFO.venue.googlePlaceId,
                })}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--app-primary)] px-5 font-ui text-sm font-bold text-black transition hover:brightness-110"
              >
                <Navigation className="h-4 w-4" /> Get directions
              </a>
              <button
                type="button"
                onClick={() => setVisitConfirmation(null)}
                className="min-h-12 rounded-full border border-white/12 px-5 font-ui text-sm font-bold text-white transition hover:bg-white/[0.06]"
              >
                Done
              </button>
            </div>
          </div>
        ) : null}
      </BaseModal>
    </>
  );
}
