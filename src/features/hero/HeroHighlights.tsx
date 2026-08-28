'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Headphones,
  MapPin,
  Navigation,
  ShieldCheck,
  PlayCircle,
  Users,
} from 'lucide-react';

import { BaseModal } from '@/shared/ui/modals/Modal';
import { buttonClass } from '@/shared/ui/button';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import { Container } from '@/shared/ui/Container';
import { Button } from '@/shared/ui/button';
import { Caption } from '@/shared/text';
import { apiClient } from '@/lib/api';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion';
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
import VisitServiceCalendar from './VisitServiceCalendar';

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
  icon,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      headerIcon={icon}
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
  const [submissionError, setSubmissionError] = useState<string | null>(null);
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
      setSubmissionError(null);
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
  const closeModal = useCallback(() => {
    setSubmissionError(null);
    setModal(null);
  }, []);

  useEffect(() => {
    const handlePlanVisit = () => openModal('visit');
    window.addEventListener(PLAN_VISIT_EVENT, handlePlanVisit);
    return () => window.removeEventListener(PLAN_VISIT_EVENT, handlePlanVisit);
  }, [openModal]);

  const onSubmitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmissionError(null);
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
      setSubmissionError(
        'We could not save your visit yet. Your details are still here—please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitWatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmissionError(null);
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
      setSubmissionError(
        'We could not save your reminder yet. Your details are still here—please try again.'
      );
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
        <section className="overflow-hidden min-w-0 border-t border-[var(--app-border)] bg-[var(--app-canvas)]">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={staggerViewport}
              className="grid grid-cols-1 divide-y divide-[var(--app-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
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
                          className="h-4 w-4 text-[var(--app-muted)] transition duration-200 group-hover:text-[var(--app-primary)]"
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
                      <p className="mt-1 font-ui text-label text-[var(--app-subtle)]">
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
        icon={<CalendarClock />}
      >
        <form className="min-w-0 space-y-5 pb-1" onSubmit={onSubmitVisit}>
          <div className="relative min-w-0 overflow-hidden rounded-card border border-[var(--app-primary)]/20 bg-[var(--app-primary-10)] p-4 sm:p-5">
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
            <VisitServiceCalendar
              services={visitDates}
              value={visit.date}
              loading={scheduleLoading}
              onChange={option =>
                setVisit(current => ({ ...current, date: option.value }))
              }
            />
            {!scheduleLoading && !scheduleVerified ? (
              <div className="mt-3 flex min-w-0 flex-col items-start gap-2 rounded-card border border-[var(--status-warning)]/20 bg-[var(--status-warning)]/[0.06] px-4 py-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <p className="font-ui text-xs leading-5 text-white/70">
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
                id="visit-name"
                name="name"
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
                id="visit-email"
                name="email"
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
                id="visit-attendance"
                name="attendance"
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
              id="visit-notes"
              name="notes"
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
              id="visit-reminder-opt-in"
              name="reminderOptIn"
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

          {submissionError ? (
            <p
              role="alert"
              className="rounded-card border border-[var(--status-error)]/20 bg-[var(--status-error)]/[0.08] px-4 py-3 font-ui text-xs leading-5 text-[var(--status-error)]"
            >
              {submissionError}
            </p>
          ) : null}

          <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.025] p-4 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-success)]" />
              <p className="min-w-0 break-words font-ui text-xs leading-5 text-white/45">
                We’ll email your confirmation, directions, and a reminder before
                service.
              </p>
            </div>
            <Button
              type="submit"
              variant="primary"
              rightIcon={<ArrowRight aria-hidden="true" />}
              className="mt-4 min-h-12 w-full shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-center font-ui text-sm font-bold leading-5 sm:mt-0 sm:w-auto sm:min-w-48 sm:px-6"
              loading={submitting}
              disabled={
                submitting ||
                scheduleLoading ||
                !scheduleVerified ||
                !visit.date
              }
            >
              Reserve my welcome
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
        icon={<Headphones />}
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
            id="watch-name"
            name="name"
            type="text"
            placeholder="Full name"
            className={inputClass}
            value={watch.name}
            onChange={e => setWatch(p => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            id="watch-email"
            name="email"
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
          {submissionError ? (
            <p
              role="alert"
              className="border border-[var(--status-error)]/20 bg-[var(--status-error)]/[0.08] px-4 py-3 font-ui text-xs leading-5 text-[var(--status-error)]"
            >
              {submissionError}
            </p>
          ) : null}
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
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-card border border-[var(--status-success)]/20 bg-[var(--status-success)]/10 text-[var(--status-success)]">
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
                className={buttonClass('primary')}
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
