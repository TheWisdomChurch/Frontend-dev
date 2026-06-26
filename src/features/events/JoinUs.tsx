// components/ui/Homepage/JoinUs.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as ZodResolvers from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Baby,
  Cpu,
  Loader2,
  Music,
  Users,
  Users2,
  Video,
} from 'lucide-react';

import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import { BaseModal } from '@/shared/ui/modals/Base';
import { BodySM, Caption } from '@/shared/text';
import { apiClient } from '@/lib/api';

const { zodResolver } = ZodResolvers;

/* ─── Data ────────────────────────────────────────────── */

const departments = [
  {
    title: 'Ushers & Protocol',
    section: 'Protocol',
    apiDepartment: 'Protocol',
    icon: Users,
    description: 'First touch hospitality and service flow.',
  },
  {
    title: 'Media & Broadcast',
    section: 'Media',
    apiDepartment: 'Media',
    icon: Video,
    description: 'Cameras, lighting, sound, and storytelling.',
  },
  {
    title: 'Wave City Music',
    section: 'Music',
    apiDepartment: 'Music',
    icon: Music,
    description: 'Lead worship and craft the atmosphere.',
  },
  {
    title: 'Children Ministry',
    section: 'Children',
    apiDepartment: 'Children',
    icon: Baby,
    description: 'Shepherd the next generation with love.',
  },
  {
    title: 'Youth & Campus',
    section: 'Youth',
    apiDepartment: 'Youth',
    icon: Users2,
    description: 'Mentor teens and young adults.',
  },
  {
    title: 'Technical Team',
    section: 'Technical',
    apiDepartment: 'Technical',
    icon: Cpu,
    description: 'Keep every service running flawlessly.',
  },
] as const;

const countryCodes = [
  { code: '+234', label: 'Nigeria' },
  { code: '+233', label: 'Ghana' },
  { code: '+44', label: 'UK' },
  { code: '+1', label: 'USA/Canada' },
];

/* ─── Schemas ─────────────────────────────────────────── */

const modalSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Full name is required')
      .refine(
        v => v.trim().split(/\s+/).length >= 2,
        'Enter first and last name'
      ),
    phoneCode: z.string().min(2),
    phone: z.string().min(7, 'Phone number is required'),
    email: z.string().email('Valid email required'),
    birthday: z
      .string()
      .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/, 'Use DD/MM'),
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

/* ─── Styles ──────────────────────────────────────────── */

const mInput =
  'w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-[var(--app-primary)]/10';
const mSelect =
  'w-full rounded-2xl border border-white/12 bg-[#1a1814] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-4 focus:ring-[var(--app-primary)]/10';

function ModalFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Caption className="mt-1 text-red-300">{message}</Caption>;
}

/* ─── Component ───────────────────────────────────────── */

export default function JoinWisdomHouse() {
  const { open } = useServiceUnavailable();

  const [openModal, setOpenModal] = useState(false);
  const [existing, setExisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const departmentOptions = useMemo(() => departments.map(d => d.title), []);

  const {
    register,
    handleSubmit: handleModalSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ModalValues>({
    resolver: zodResolver(modalSchema),
    defaultValues: {
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
    },
  });

  const marriedValue = watch('married');

  const openFor = useCallback(
    (dept: string) => {
      reset({
        fullName: '',
        phoneCode: '+234',
        phone: '',
        email: '',
        birthday: '',
        occupation: '',
        department: dept,
        married: 'no',
        spouse: '',
        anniversary: '',
        about: '',
      });
      setExisting(false);
      setOpenModal(true);
    },
    [reset]
  );

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
        registrationType: existing ? 'existing' : 'new',
        married: values.married,
        spouse: values.married === 'yes' ? values.spouse || '' : '',
        anniversary: values.married === 'yes' ? values.anniversary || '' : '',
        about: values.about || '',
        sourceChannel: 'frontend:web:join-us',
        notes: [
          `Original team: ${dept.originalLabel}`,
          `Member status: ${existing ? 'Existing' : 'New'}`,
        ].join('\n'),
      } as any);
      setOpenModal(false);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      open({
        title: 'Unable to submit',
        message: err?.message || 'Please try again.',
        actionLabel: 'Got it',
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Section
      padding="none"
      fullHeight={false}
      className="bg-[var(--app-canvas)]"
    >
      <Container size="xl" className="py-section-md">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-12 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Join the workforce
            </p>
            <h2
              className="font-headline font-normal text-[var(--app-ink)]"
              style={{ fontSize: 'var(--type-display-sm)' }}
            >
              Serve with excellence.
            </h2>
            <p className="mt-3 max-w-[460px] font-ui text-[0.95rem] leading-[1.8] text-[var(--app-ink)]/60">
              Use your gifts to build the house. Every team here has a role and
              a seat — find yours.
            </p>
          </div>

          {submitted && (
            <p className="font-ui text-[0.82rem] font-semibold text-[var(--app-primary)]">
              Application received. We'll be in touch soon.
            </p>
          )}
        </div>

        {/* ── Department grid ──────────────────────────────── */}
        <div
          className="grid grid-cols-1 gap-px bg-[var(--app-ink)]/8 sm:grid-cols-2 lg:grid-cols-3"
          style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden' }}
        >
          {departments.map(dept => {
            const Icon = dept.icon;
            return (
              <button
                key={dept.title}
                type="button"
                onClick={() => openFor(dept.title)}
                className="group relative flex flex-col overflow-hidden bg-[var(--app-canvas)] p-6 text-left transition-all duration-300 hover:bg-[var(--app-canvas-2)] hover:shadow-[inset_0_0_0_1px_rgba(201,150,26,0.18)] sm:p-7"
              >
                {/* Gold top accent — animates in on hover */}
                <span
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[var(--app-primary)] transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden="true"
                />

                {/* Icon */}
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center bg-[var(--app-ink)]/6 transition-all duration-300 group-hover:bg-[var(--app-primary)]/14 group-hover:scale-[1.08]"
                  style={{ borderRadius: 'var(--radius-badge)' }}
                >
                  <Icon className="h-[1.1rem] w-[1.1rem] text-[var(--app-ink)]/40 transition duration-300 group-hover:text-[var(--app-primary)]" />
                </div>

                {/* Text */}
                <p className="font-ui text-[0.88rem] font-bold text-[var(--app-ink)]">
                  {dept.title}
                </p>
                <p className="mt-1.5 font-ui text-[0.78rem] leading-[1.65] text-[var(--app-ink)]/50">
                  {dept.description}
                </p>

                {/* Apply CTA — always visible, animates on hover */}
                <span className="mt-5 inline-flex items-center gap-1.5 font-ui text-[0.72rem] font-semibold text-[var(--app-ink)]/30 transition-all duration-200 group-hover:gap-2.5 group-hover:text-[var(--app-primary)]">
                  Apply{' '}
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>

        {/* ── General CTA ─────────────────────────────────── */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => openFor('')}
            className="font-ui text-[0.8rem] font-semibold text-[var(--app-ink)]/45 underline underline-offset-4 transition hover:text-[var(--app-primary)]"
          >
            Not sure which team? Apply anyway →
          </button>
        </div>
      </Container>

      {/* ── Full application modal ───────────────────────── */}
      <BaseModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Join the workforce"
        subtitle="Complete your details and our team will follow up with your next step."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={onSubmit} className="space-y-5">
          {/* New / Existing toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-1.5">
            <Button
              type="button"
              onClick={() => setExisting(false)}
              variant={!existing ? 'primary' : 'ghost'}
              size="sm"
              curvature="md"
              className={
                !existing
                  ? ''
                  : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
              }
            >
              New member
            </Button>
            <Button
              type="button"
              onClick={() => setExisting(true)}
              variant={existing ? 'primary' : 'ghost'}
              size="sm"
              curvature="md"
              className={
                existing
                  ? ''
                  : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
              }
            >
              Existing member
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <input
                {...register('fullName')}
                className={mInput}
                placeholder="Full name"
              />
              <ModalFieldError message={errors.fullName?.message} />
            </div>
            <div>
              <input
                {...register('email')}
                className={mInput}
                placeholder="Email address"
                type="email"
              />
              <ModalFieldError message={errors.email?.message} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[0.42fr_1fr]">
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
              <ModalFieldError message={errors.phone?.message} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <input
                {...register('birthday')}
                className={mInput}
                placeholder="Birthday · DD/MM"
              />
              <ModalFieldError message={errors.birthday?.message} />
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
            <ModalFieldError message={errors.department?.message} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <BodySM weight="semibold" className="mb-3 text-white">
              Marital status
            </BodySM>
            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white/75">
                <input
                  {...register('married')}
                  type="radio"
                  value="no"
                  className="mr-2"
                />
                Not married
              </label>
              <label className="cursor-pointer rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white/75">
                <input
                  {...register('married')}
                  type="radio"
                  value="yes"
                  className="mr-2"
                />
                Married
              </label>
            </div>
            {marriedValue === 'yes' && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <input
                    {...register('spouse')}
                    className={mInput}
                    placeholder="Spouse name"
                  />
                  <ModalFieldError message={errors.spouse?.message} />
                </div>
                <div>
                  <input
                    {...register('anniversary')}
                    className={mInput}
                    placeholder="Anniversary date"
                  />
                  <ModalFieldError message={errors.anniversary?.message} />
                </div>
              </div>
            )}
          </div>

          <div>
            <textarea
              {...register('about')}
              className={`${mInput} min-h-[120px] resize-none`}
              placeholder="Tell us about your passion, skills, or previous service experience…"
            />
            <ModalFieldError message={errors.about?.message} />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            curvature="full"
            disabled={submitting}
            className="h-12 w-full font-semibold"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit application <ArrowRight className="h-4 w-4" />
                </>
              )}
            </span>
          </Button>
        </form>
      </BaseModal>
    </Section>
  );
}
