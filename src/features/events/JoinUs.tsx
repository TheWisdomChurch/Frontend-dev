'use client';

import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import * as ZodResolvers from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Baby,
  CheckCircle2,
  ChevronLeft,
  Cpu,
  HeartHandshake,
  Music,
  Sparkles,
  Target,
  Users,
  Users2,
  Video,
} from 'lucide-react';

import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import { BaseModal } from '@/shared/ui/modals/Base';
import { BodySM, Caption } from '@/shared/text';
import SectionGlow from '@/shared/ui/SectionGlow';
import { apiClient } from '@/lib/api';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion/staggerReveal';

/* ─── Why serve ────────────────────────────────────────────────────── */

const valuePillars = [
  {
    icon: Sparkles,
    title: 'Discover your gift',
    body: 'Every skill has a place to serve here.',
  },
  {
    icon: HeartHandshake,
    title: 'Build real community',
    body: 'Serve alongside people who become family.',
  },
  {
    icon: Target,
    title: 'Make eternal impact',
    body: 'Your seat here matters more than you know.',
  },
] as const;

const { zodResolver } = ZodResolvers;

/* ─── Department data ─────────────────────────────────────────────── */

const departments = [
  {
    title: 'Ushers & Protocol',
    section: 'Protocol',
    apiDepartment: 'Protocol',
    icon: Users,
    description: 'First touch hospitality and service flow.',
    detail:
      'The first face a visitor sees and the team that keeps every service moving without friction — from the car park to the sanctuary door.',
    responsibilities: [
      'Welcome and direct guests and members as they arrive',
      'Manage seating, overflow, and altar-call flow during service',
      'Coordinate offering collection and special moments',
      'Keep exits, aisles, and emergency routes clear throughout',
    ],
  },
  {
    title: 'Media & Broadcast',
    section: 'Media',
    apiDepartment: 'Media',
    icon: Video,
    description: 'Cameras, lighting, sound, and storytelling.',
    detail:
      "The team behind every camera angle, every lyric on screen, and every service that reaches people who couldn't be in the room.",
    responsibilities: [
      'Operate cameras and switch live service broadcasts',
      'Run lighting and stage visuals during worship and ministration',
      'Edit and publish sermon clips, reels, and highlight content',
      'Manage livestream setup across YouTube and other platforms',
    ],
  },
  {
    title: 'Wave City Music',
    section: 'Music',
    apiDepartment: 'Music',
    icon: Music,
    description: 'Lead worship and craft the atmosphere.',
    detail:
      'Vocalists, instrumentalists, and sound engineers who lead the church into worship and shape the atmosphere of every gathering.',
    responsibilities: [
      'Rehearse and lead worship as a vocalist or instrumentalist',
      'Run live sound, mixing, and stage monitoring',
      'Prepare set lists and arrangements with the music director',
      'Serve consistently across weekly services and special programs',
    ],
  },
  {
    title: 'Children Ministry',
    section: 'Children',
    apiDepartment: 'Children',
    icon: Baby,
    description: 'Shepherd the next generation with love.',
    detail:
      'A safe, joyful space where children build their first real foundations in the Word — led by adults who take that responsibility seriously.',
    responsibilities: [
      'Teach age-appropriate Bible lessons and lead worship for kids',
      'Supervise and care for children throughout each service',
      'Plan activities, games, and creative learning moments',
      "Partner with parents to keep them informed on their child's growth",
    ],
  },
  {
    title: 'Youth & Campus',
    section: 'Youth',
    apiDepartment: 'Youth',
    icon: Users2,
    description: 'Mentor teens and young adults.',
    detail:
      "Walking with teenagers and young adults through real questions, real pressure, and the process of building a faith that's actually theirs.",
    responsibilities: [
      'Lead or support small-group discussions and mentorship',
      'Help plan and run youth gatherings and campus outreach',
      'Build genuine relationships beyond the weekly meeting',
      'Model consistency and character young people can follow',
    ],
  },
  {
    title: 'Technical Team',
    section: 'Technical',
    apiDepartment: 'Technical',
    icon: Cpu,
    description: 'Keep every service running flawlessly.',
    detail:
      'The quiet infrastructure behind every service — power, screens, streaming, and systems — so nothing visible ever breaks.',
    responsibilities: [
      'Set up and maintain audio, visual, and streaming equipment',
      'Troubleshoot technical issues in real time during service',
      'Manage church software, screens, and presentation systems',
      'Support other departments with technical needs as they arise',
    ],
  },
] as const;

type Department = (typeof departments)[number];

// Repeating three-panel rhythm. Additional departments automatically continue
// the mosaic instead of coupling the UI to today's number of teams.
const departmentSpanPattern = [
  'lg:col-span-5',
  'lg:col-span-3',
  'lg:col-span-4',
  'lg:col-span-3',
  'lg:col-span-5',
  'lg:col-span-4',
] as const;

const countryCodes = [
  { code: '+234', label: 'NG' },
  { code: '+233', label: 'GH' },
  { code: '+44', label: 'UK' },
  { code: '+1', label: 'US/CA' },
];

/* ─── Validation ──────────────────────────────────────────────────── */

const modalSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Enter your full name')
      .refine(
        v => v.trim().split(/\s+/).length >= 2,
        'Enter first and last name'
      ),
    phoneCode: z.string().min(2),
    phone: z.string().min(7, 'Phone number is required'),
    email: z.string().email('Enter a valid email'),
    birthday: z
      .string()
      .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/, 'Use DD/MM format'),
    occupation: z.string().optional(),
    department: z.string().min(1, 'Select a department'),
    married: z.enum(['yes', 'no']),
    spouse: z.string().optional(),
    anniversary: z.string().optional(),
    about: z.string().max(800).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.married === 'yes') {
      if (!val.spouse)
        ctx.addIssue({
          code: 'custom',
          path: ['spouse'],
          message: 'Spouse name required',
        });
      if (!val.anniversary)
        ctx.addIssue({
          code: 'custom',
          path: ['anniversary'],
          message: 'Anniversary date required',
        });
    }
  });

type ModalValues = z.infer<typeof modalSchema>;

/* ─── Field styles ────────────────────────────────────────────────── */

const mInput =
  'w-full border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/45 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-[var(--app-primary)]/12';
const mSelect =
  'w-full border border-white/12 bg-[var(--app-dark-input)] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-2 focus:ring-[var(--app-primary)]/12';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-ui text-label text-rose-300">{message}</p>;
}

const defaultValues: ModalValues = {
  fullName: '',
  phoneCode: '+234',
  phone: '',
  email: '',
  birthday: '',
  occupation: '',
  department: '',
  married: 'no',
  spouse: '',
  anniversary: '',
  about: '',
};

/* ─── Component ───────────────────────────────────────────────────── */

export default function JoinWisdomHouse() {
  const { open } = useServiceUnavailable();

  // modalStep === null means closed. 'detail' shows the department
  // description; 'form' shows the application form. Both steps share one
  // BaseModal instance so advancing/going back never re-mounts the overlay.
  const [modalStep, setModalStep] = useState<'detail' | 'form' | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const departmentOptions = useMemo(() => departments.map(d => d.title), []);

  const {
    register,
    handleSubmit: handleModalSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ModalValues>({
    resolver: zodResolver(modalSchema),
    defaultValues,
  });

  // useWatch (not form.watch()) — watch() returns a plain function that
  // isn't a stable reactive subscription, so React Compiler can't safely
  // memoize this component around it. useWatch is a proper hook that
  // subscribes correctly and re-renders only when 'married' changes.
  const marriedValue = useWatch({ control, name: 'married' });

  const openFor = useCallback(
    (dept: Department) => {
      reset({ ...defaultValues, department: dept.title });
      setSelectedDept(dept);
      setModalStep('detail');
    },
    [reset]
  );

  const openGeneric = useCallback(() => {
    reset(defaultValues);
    setSelectedDept(null);
    setModalStep('form');
  }, [reset]);

  const closeModal = useCallback(() => {
    if (submitting) return;
    setModalStep(null);
    setSelectedDept(null);
  }, [submitting]);

  const splitName = (v: string) => {
    const parts = v.trim().split(/\s+/);
    const firstName = parts.shift() || '';
    return { firstName, lastName: parts.join(' ').trim() || firstName };
  };

  const getDeptMeta = (raw: string) => {
    const m = departments.find(
      d => d.title.toLowerCase() === raw.toLowerCase()
    );
    return {
      department: m?.apiDepartment || raw,
      departmentSection: m?.section || 'General',
      originalLabel: raw,
    };
  };

  const onSubmit = handleModalSubmit(async (values: ModalValues) => {
    try {
      setSubmitting(true);
      const { firstName, lastName } = splitName(values.fullName);
      const dept = getDeptMeta(values.department);

      await apiClient.applyWorkforceNew({
        firstName,
        lastName,
        email: values.email,
        phoneCode: values.phoneCode,
        phone: values.phone,
        birthday: values.birthday,
        occupation: values.occupation || '',
        department: dept.department,
        departmentSection: dept.departmentSection,
        registrationType: 'new',
        married: values.married,
        spouse: values.married === 'yes' ? values.spouse || '' : '',
        anniversaryDate:
          values.married === 'yes' ? values.anniversary || '' : '',
        about: values.about || '',
        sourceChannel: 'frontend:web:join-us',
        notes: `Original team: ${dept.originalLabel}`,
      });

      setModalStep(null);
      setSelectedDept(null);
      setSubmitted(true);
      reset(defaultValues);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Please try again.';
      open({ title: 'Unable to submit', message, actionLabel: 'Got it' });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Section
      padding="none"
      fullHeight={false}
      className="relative overflow-hidden bg-[var(--app-dark)]"
    >
      <SectionGlow />

      {/* ── Banner ───────────────────────────────────────────── */}
      {/* TODO: was a photo banner (Dept_1) — source image is missing from
          the repo; needs a real photo re-uploaded to shared/assets. */}
      <div className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-dark)] via-[var(--app-dark)]/78 to-[var(--app-dark)]/45" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_25%,rgba(201,150,26,0.18),transparent_55%)]" />
        </div>

        <Container size="xl" className="relative py-12 sm:py-14 lg:py-[4.5rem]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Join the workforce
              </p>
              <h2
                className="font-headline font-normal text-white"
                // eslint-disable-next-line no-restricted-syntax
                style={{ fontSize: 'var(--type-display-md)' }}
              >
                Serve with excellence.
              </h2>
              <p className="mt-3 max-w-[460px] font-ui text-body-md leading-[1.8] text-white/62">
                Use your gifts to build the church. Every team here has a role
                and a seat — find yours.
              </p>
            </div>

            {submitted && (
              <div className="inline-flex items-center gap-2 font-ui text-body-sm font-semibold text-[var(--app-primary)]">
                <CheckCircle2 className="h-4 w-4" />
                Application received. We'll be in touch soon.
              </div>
            )}
          </div>

          {/* ── Why serve ─────────────────────────────────────── */}
          <div className="-mx-5 mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto border-t border-white/10 px-5 pt-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pt-9 sm:gap-8">
            {valuePillars.map(pillar => (
              <div
                key={pillar.title}
                className="flex min-w-[76vw] snap-center items-start gap-3.5 border border-white/10 bg-white/[0.035] p-4 sm:min-w-0 sm:border-0 sm:bg-transparent sm:p-0"
              >
                <pillar.icon className="mt-0.5 h-[1.15rem] w-[1.15rem] flex-none text-[var(--app-primary)]" />
                <div>
                  <p className="font-ui text-body-sm font-bold text-white">
                    {pillar.title}
                  </p>
                  <p className="mt-1 font-ui text-label leading-[1.6] text-white/50">
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Department index ──────────────────────────────────── */}
      <Container size="xl" className="relative py-12 sm:py-14 lg:py-[4.5rem]">
        <div className="mb-8 grid gap-5 border-b border-white/10 pb-7 sm:mb-10 sm:grid-cols-[1fr_auto] sm:items-end sm:pb-9">
          <div>
            <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
              Serve at Wisdom Church
            </p>
            <h3 className="mt-3 max-w-2xl font-sans text-[clamp(2rem,4vw,3.8rem)] font-black uppercase leading-[0.94] tracking-[-0.04em] text-white">
              Bring your gift.
              <span className="block text-[var(--app-primary)]">
                Build with us.
              </span>
            </h3>
          </div>
          <p className="max-w-sm font-ui text-sm leading-6 text-white/45 sm:text-right">
            Whatever your experience, there is room to grow, contribute and
            serve alongside others.
          </p>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={staggerViewport}
          className="grid grid-cols-2 gap-px overflow-hidden border border-white/12 bg-white/12 lg:grid-cols-12"
        >
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <motion.button
                key={dept.title}
                variants={staggerItem}
                type="button"
                onClick={() => openFor(dept)}
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className={`group relative flex min-h-[176px] flex-col justify-between overflow-hidden bg-[#0d0d0d] p-4 text-left transition-colors duration-300 hover:bg-[#16130d] sm:min-h-[220px] sm:p-6 lg:min-h-[245px] ${departmentSpanPattern[index % departmentSpanPattern.length]}`}
              >
                <span
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_35%,rgba(201,150,26,0.13))] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-white/12 bg-white/[0.035] transition duration-300 group-hover:border-[var(--app-primary)]/45 group-hover:bg-[var(--app-primary)]/10 sm:h-12 sm:w-12">
                    <Icon className="h-[1.1rem] w-[1.1rem] text-[var(--app-primary)] sm:h-5 sm:w-5" />
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/35 transition duration-200 group-hover:border-[var(--app-primary)] group-hover:bg-[var(--app-primary)] group-hover:text-black sm:h-10 sm:w-10">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <div className="relative mt-7 min-w-0 sm:mt-9">
                  <p className="mb-2 font-ui text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]/75 sm:text-[10px]">
                    {dept.section} ministry
                  </p>
                  <p className="max-w-[14rem] font-ui text-base font-bold leading-5 text-white sm:text-xl sm:leading-6">
                    {dept.title}
                  </p>
                  <p className="mt-2 line-clamp-2 font-ui text-[11px] leading-[1.55] text-white/45 sm:max-w-sm sm:text-sm sm:leading-6">
                    {dept.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── General CTA ──────────────────────────────────────── */}
        <div className="mt-7 flex flex-col items-center gap-3 sm:mt-9">
          <button
            type="button"
            onClick={openGeneric}
            className="group inline-flex h-11 items-center gap-2 border border-white/18 bg-transparent px-6 font-ui text-label font-semibold text-white/55 transition-all duration-200 hover:border-[var(--app-primary)]/50 hover:bg-[var(--app-primary)]/6 hover:text-[var(--app-primary)] active:scale-[0.98]"
          >
            Not sure which team? Apply anyway
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <p className="font-ui text-label text-white/35">
            No experience required — just a willing heart.
          </p>
        </div>
      </Container>

      {/* ── Department detail + application modal ─────────────────── */}
      <BaseModal
        isOpen={modalStep !== null}
        onClose={closeModal}
        title={
          modalStep === 'detail' && selectedDept
            ? selectedDept.title
            : 'Join the workforce'
        }
        subtitle={
          modalStep === 'detail' && selectedDept
            ? selectedDept.description
            : 'Complete your details and our team will follow up with your next step.'
        }
        maxWidth="max-w-2xl"
        preventClose={submitting}
        forceBottomSheet
      >
        {/* ── Step 1: department detail ─────────────────────────── */}
        {modalStep === 'detail' && selectedDept && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-none items-center justify-center bg-[var(--app-primary)]/14">
                <selectedDept.icon className="h-6 w-6 text-[var(--app-primary)]" />
              </div>
              <p className="font-ui text-caption font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
                {selectedDept.section} Team
              </p>
            </div>

            <p className="font-ui text-body-md leading-[1.85] text-white/70">
              {selectedDept.detail}
            </p>

            <div className="border border-white/10 bg-white/[0.035] p-5">
              <p className="mb-3.5 font-ui text-label font-bold uppercase tracking-[0.16em] text-white/40">
                What you'll do
              </p>
              <ul className="space-y-2.5">
                {selectedDept.responsibilities.map(r => (
                  <li key={r} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[var(--app-primary)]" />
                    <span className="font-ui text-body-sm leading-[1.7] text-white/65">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="button"
              onClick={() => setModalStep('form')}
              variant="primary"
              size="md"
              curvature="sm"
              rightIcon={<ArrowRight />}
              className="h-12 w-full font-semibold"
            >
              Join this team
            </Button>
          </div>
        )}

        {/* ── Step 2: application form ──────────────────────────── */}
        {modalStep === 'form' && (
          <div className="space-y-5">
            {selectedDept && (
              <button
                type="button"
                onClick={() => setModalStep('detail')}
                className="inline-flex items-center gap-1.5 font-ui text-label font-semibold text-white/45 transition hover:text-white/75"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back to {selectedDept.title}
              </button>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <input
                    {...register('fullName')}
                    className={mInput}
                    placeholder="Full name (first and last)"
                  />
                  <FieldError message={errors.fullName?.message} />
                </div>
                <div>
                  <input
                    {...register('email')}
                    className={mInput}
                    placeholder="Email address"
                    type="email"
                  />
                  <FieldError message={errors.email?.message} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[0.38fr_1fr]">
                <div>
                  <select {...register('phoneCode')} className={mSelect}>
                    {countryCodes.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.code} · {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    {...register('phone')}
                    className={mInput}
                    placeholder="Phone number"
                    type="tel"
                  />
                  <FieldError message={errors.phone?.message} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <input
                    {...register('birthday')}
                    className={mInput}
                    placeholder="Birthday · DD/MM"
                  />
                  <FieldError message={errors.birthday?.message} />
                </div>
                <div>
                  <input
                    {...register('occupation')}
                    className={mInput}
                    placeholder="Occupation (optional)"
                  />
                </div>
              </div>

              <div>
                <select {...register('department')} className={mSelect}>
                  <option value="">Select department</option>
                  {departmentOptions.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.department?.message} />
              </div>

              {/* Marital status */}
              <div className="border border-white/10 bg-white/[0.04] p-4">
                <BodySM weight="semibold" className="mb-3 text-white/70">
                  Marital status
                </BodySM>
                <div className="grid grid-cols-2 gap-2">
                  {(['no', 'yes'] as const).map(value => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center justify-center border px-3 py-2.5 font-ui text-body-sm font-semibold transition ${
                        marriedValue === value
                          ? 'border-[var(--app-primary)]/50 bg-[var(--app-primary)]/10 text-white'
                          : 'border-white/10 bg-black/20 text-white/55 hover:border-white/20 hover:text-white/75'
                      }`}
                    >
                      <input
                        {...register('married')}
                        type="radio"
                        value={value}
                        className="sr-only"
                      />
                      {value === 'yes' ? 'Married' : 'Not married'}
                    </label>
                  ))}
                </div>
                {marriedValue === 'yes' && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <input
                        {...register('spouse')}
                        className={mInput}
                        placeholder="Spouse name"
                      />
                      <FieldError message={errors.spouse?.message} />
                    </div>
                    <div>
                      <input
                        {...register('anniversary')}
                        className={mInput}
                        placeholder="Anniversary · DD/MM"
                      />
                      <FieldError message={errors.anniversary?.message} />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <textarea
                  {...register('about')}
                  className={`${mInput} min-h-[110px] resize-none`}
                  placeholder="Passion, skills, or previous service experience (optional)"
                />
                <FieldError message={errors.about?.message} />
              </div>

              {/* What happens next */}
              <div className="border border-white/8 bg-white/[0.025] px-4 py-3">
                <Caption className="text-white/38">
                  After submitting, our team will review your application and
                  follow up within 3–5 days.
                </Caption>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                curvature="sm"
                loading={submitting}
                disabled={submitting}
                rightIcon={!submitting && <ArrowRight />}
                className="h-12 w-full font-semibold"
              >
                {submitting ? 'Submitting…' : 'Submit application'}
              </Button>
            </form>
          </div>
        )}
      </BaseModal>
    </Section>
  );
}
