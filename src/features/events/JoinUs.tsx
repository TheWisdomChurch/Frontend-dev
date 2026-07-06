'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as ZodResolvers from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Baby,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Loader2,
  Music,
  Search,
  Users,
  Users2,
  Video,
  X,
} from 'lucide-react';

import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import { BaseModal } from '@/shared/ui/modals/Base';
import { BodySM, Caption } from '@/shared/text';
import { apiClient } from '@/lib/api';

const { zodResolver } = ZodResolvers;

/* ─── Department data ─────────────────────────────────────────────── */

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
  'w-full border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-[var(--app-primary)]/12';
const mSelect =
  'w-full border border-white/12 bg-[#1a1814] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-2 focus:ring-[var(--app-primary)]/12';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 font-ui text-[0.72rem] text-rose-300">{message}</p>
  );
}

/* ─── Lookup status type ──────────────────────────────────────────── */

type LookupStatus = 'idle' | 'loading' | 'found' | 'not_found';

/* ─── Component ───────────────────────────────────────────────────── */

export default function JoinWisdomHouse() {
  const { open } = useServiceUnavailable();

  const [openModal, setOpenModal] = useState(false);
  const [existing, setExisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeCard, setActiveCard] = useState<number>(0);

  // Existing member lookup state
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle');
  const [foundName, setFoundName] = useState('');
  const lookupEmailRef = useRef<HTMLInputElement>(null);

  const departmentOptions = useMemo(() => departments.map(d => d.title), []);

  // Lookup responses return the stored department code (e.g. "Protocol"),
  // but the <select> options are display titles (e.g. "Ushers & Protocol").
  // Map code -> title so pre-fill actually selects the right option.
  const resolveDepartmentTitle = useCallback((raw: string) => {
    const match = departments.find(
      d =>
        d.apiDepartment.toLowerCase() === raw.toLowerCase() ||
        d.title.toLowerCase() === raw.toLowerCase()
    );
    return match?.title || raw;
  }, []);

  const {
    register,
    handleSubmit: handleModalSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
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
      setLookupEmail('');
      setLookupStatus('idle');
      setFoundName('');
      setOpenModal(true);
    },
    [reset]
  );

  const switchMode = useCallback(
    (isExisting: boolean) => {
      setExisting(isExisting);
      setLookupEmail('');
      setLookupStatus('idle');
      setFoundName('');
      if (!isExisting) {
        // Reset form when switching back to new member, preserve department
        reset({
          fullName: '',
          phoneCode: '+234',
          phone: '',
          email: '',
          birthday: '',
          occupation: '',
          department: getValues('department'),
          married: 'no',
          spouse: '',
          anniversary: '',
          about: '',
        });
      }
    },
    [reset, getValues]
  );

  const handleLookup = useCallback(async () => {
    if (!lookupEmail || !lookupEmail.includes('@')) return;
    setLookupStatus('loading');
    try {
      const profile = await apiClient.lookupWorkforceMember(lookupEmail);
      if (profile) {
        const name =
          typeof profile.firstName === 'string' &&
          typeof profile.lastName === 'string'
            ? `${profile.firstName} ${profile.lastName}`.trim()
            : typeof profile.fullName === 'string'
              ? profile.fullName
              : '';

        setFoundName(name);
        setLookupStatus('found');

        // Pre-fill form with fetched data
        const current = getValues();
        reset({
          ...current,
          fullName: name || current.fullName,
          email: lookupEmail,
          phone:
            typeof profile.phone === 'string' ? profile.phone : current.phone,
          phoneCode:
            typeof profile.phoneCode === 'string'
              ? profile.phoneCode
              : current.phoneCode,
          occupation:
            typeof profile.occupation === 'string'
              ? profile.occupation
              : current.occupation,
          department:
            typeof profile.department === 'string' && profile.department
              ? resolveDepartmentTitle(profile.department)
              : current.department,
          married:
            profile.married === 'yes' || profile.married === 'no'
              ? profile.married
              : current.married,
          spouse:
            typeof profile.spouse === 'string'
              ? profile.spouse
              : current.spouse,
          about:
            typeof profile.about === 'string' ? profile.about : current.about,
        });
      } else {
        setLookupStatus('not_found');
        // Pre-fill email so the user doesn't have to re-type it
        setValue('email', lookupEmail);
      }
    } catch {
      setLookupStatus('not_found');
      setValue('email', lookupEmail);
    }
  }, [lookupEmail, reset, setValue, getValues, resolveDepartmentTitle]);

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
      const registrationType =
        existing && lookupStatus === 'found'
          ? 'update'
          : existing
            ? 'existing'
            : 'new';

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
        registrationType,
        married: values.married,
        spouse: values.married === 'yes' ? values.spouse || '' : '',
        anniversaryDate:
          values.married === 'yes' ? values.anniversary || '' : '',
        about: values.about || '',
        sourceChannel: 'frontend:web:join-us',
        notes: [
          `Original team: ${dept.originalLabel}`,
          `Member status: ${registrationType}`,
          existing && lookupStatus === 'found'
            ? `Profile updated for: ${values.email}`
            : '',
        ]
          .filter(Boolean)
          .join('\n'),
      });

      setOpenModal(false);
      setSubmitted(true);
      reset();
      setLookupEmail('');
      setLookupStatus('idle');
      setFoundName('');
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Please try again.';
      open({ title: 'Unable to submit', message, actionLabel: 'Got it' });
    } finally {
      setSubmitting(false);
    }
  });

  // Show form when: new member OR existing + lookup done (found or not_found)
  const showForm =
    !existing || lookupStatus === 'found' || lookupStatus === 'not_found';

  return (
    <Section
      padding="none"
      fullHeight={false}
      className="bg-[var(--app-canvas)]"
    >
      <Container size="xl" className="py-section-md">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="mb-12 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Join the workforce
            </p>
            <h2
              className="font-headline font-normal text-[var(--app-ink)]"
              // eslint-disable-next-line no-restricted-syntax
              style={{ fontSize: 'var(--type-display-sm)' }}
            >
              Serve with excellence.
            </h2>
            <p className="mt-3 max-w-[460px] font-ui text-[0.95rem] leading-[1.8] text-[var(--app-ink)]/60">
              Use your gifts to build the church. Every team here has a role and
              a seat — find yours.
            </p>
          </div>

          {submitted && (
            <div className="inline-flex items-center gap-2 font-ui text-[0.82rem] font-semibold text-[var(--app-primary)]">
              <CheckCircle2 className="h-4 w-4" />
              Application received. We'll be in touch soon.
            </div>
          )}
        </div>

        {/* ── Department grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card bg-[var(--app-ink)]/8 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            const isActive = activeCard === index;
            return (
              <button
                key={dept.title}
                type="button"
                onClick={() => openFor(dept.title)}
                onMouseEnter={() => setActiveCard(index)}
                className={`group relative flex flex-col overflow-hidden p-6 text-left transition-all duration-300 sm:p-7 ${
                  isActive
                    ? 'bg-[var(--app-canvas-2)] shadow-[inset_0_0_0_1px_rgba(201,150,26,0.18)]'
                    : 'bg-[var(--app-canvas)] hover:bg-[var(--app-canvas-2)] hover:shadow-[inset_0_0_0_1px_rgba(201,150,26,0.18)]'
                }`}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-[2px] origin-left bg-[var(--app-primary)] transition-transform duration-300 ${
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  aria-hidden="true"
                />
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center transition-all duration-300 group-hover:scale-[1.08] ${
                    isActive
                      ? 'scale-[1.08] bg-[var(--app-primary)]/14'
                      : 'bg-[var(--app-ink)]/6 group-hover:bg-[var(--app-primary)]/14'
                  }`}
                >
                  <Icon
                    className={`h-[1.1rem] w-[1.1rem] transition duration-300 group-hover:text-[var(--app-primary)] ${
                      isActive
                        ? 'text-[var(--app-primary)]'
                        : 'text-[var(--app-ink)]/40'
                    }`}
                  />
                </div>
                <p className="font-ui text-[0.88rem] font-bold text-[var(--app-ink)]">
                  {dept.title}
                </p>
                <p className="mt-1.5 font-ui text-[0.78rem] leading-[1.65] text-[var(--app-ink)]/50">
                  {dept.description}
                </p>
                <span
                  className={`mt-5 inline-flex items-center gap-1.5 font-ui text-[0.72rem] font-semibold transition-all duration-200 group-hover:gap-2.5 group-hover:text-[var(--app-primary)] ${
                    isActive
                      ? 'gap-2.5 text-[var(--app-primary)]'
                      : 'text-[var(--app-ink)]/30'
                  }`}
                >
                  Apply{' '}
                  <ArrowRight
                    className={`h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 ${isActive ? 'translate-x-0.5' : ''}`}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* ── General CTA ──────────────────────────────────────── */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => openFor('')}
            className="group inline-flex h-11 items-center gap-2 border border-[var(--app-ink)]/20 bg-transparent px-6 font-ui text-[0.78rem] font-semibold text-[var(--app-ink)]/55 transition-all duration-200 hover:border-[var(--app-primary)]/50 hover:bg-[var(--app-primary)]/6 hover:text-[var(--app-primary)] active:scale-[0.98]"
          >
            Not sure which team? Apply anyway
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </Container>

      {/* ── Application modal ─────────────────────────────────────── */}
      <BaseModal
        isOpen={openModal}
        onClose={() => {
          if (!submitting) {
            setOpenModal(false);
            setLookupEmail('');
            setLookupStatus('idle');
            setFoundName('');
          }
        }}
        title="Join the workforce"
        subtitle="Complete your details and our team will follow up with your next step."
        maxWidth="max-w-2xl"
        preventClose={submitting}
      >
        <div className="space-y-5">
          {/* ── New / Existing toggle ─────────────────────── */}
          <div className="grid grid-cols-2 gap-1.5 border border-white/10 bg-white/[0.04] p-1.5">
            <Button
              type="button"
              onClick={() => switchMode(false)}
              variant={!existing ? 'primary' : 'ghost'}
              size="sm"
              curvature="sm"
              className={!existing ? '' : 'text-white/55 hover:text-white'}
            >
              New member
            </Button>
            <Button
              type="button"
              onClick={() => switchMode(true)}
              variant={existing ? 'primary' : 'ghost'}
              size="sm"
              curvature="sm"
              className={existing ? '' : 'text-white/55 hover:text-white'}
            >
              Existing member
            </Button>
          </div>

          {/* ── Existing member lookup ────────────────────── */}
          {existing &&
            lookupStatus !== 'found' &&
            lookupStatus !== 'not_found' && (
              <div className="space-y-3 border border-white/10 bg-white/[0.035] p-5">
                <p className="font-ui text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[var(--app-primary)]">
                  Find your profile
                </p>
                <p className="font-ui text-[0.85rem] leading-[1.75] text-white/58">
                  Enter the email address you used when you first registered.
                  We'll pre-fill your current details so you only update what's
                  changed.
                </p>
                <div className="flex gap-2">
                  <input
                    ref={lookupEmailRef}
                    type="email"
                    value={lookupEmail}
                    onChange={e => setLookupEmail(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleLookup();
                      }
                    }}
                    placeholder="your@email.com"
                    className={`${mInput} flex-1`}
                    disabled={lookupStatus === 'loading'}
                  />
                  <button
                    type="button"
                    onClick={handleLookup}
                    disabled={lookupStatus === 'loading' || !lookupEmail}
                    className="inline-flex h-12 min-w-[110px] items-center justify-center gap-2 bg-[var(--app-primary)] px-4 font-ui text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[#0d0a06] transition hover:bg-[var(--app-primary-light)] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]"
                  >
                    {lookupStatus === 'loading' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-3.5 w-3.5" />
                        Find
                      </>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLookupStatus('not_found');
                    setValue('email', lookupEmail);
                  }}
                  className="font-ui text-[0.76rem] text-white/38 transition hover:text-white/65"
                >
                  Skip — fill in manually instead
                </button>
              </div>
            )}

          {/* ── Found banner ──────────────────────────────── */}
          {existing && lookupStatus === 'found' && (
            <div className="flex items-start gap-3 border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/8 p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[var(--app-primary)]" />
              <div className="min-w-0 flex-1">
                <p className="font-ui text-[0.82rem] font-semibold text-white">
                  Profile found{foundName ? ` — ${foundName}` : ''}
                </p>
                <p className="mt-0.5 font-ui text-[0.76rem] text-white/55">
                  Your details have been pre-filled. Update anything that's
                  changed and submit — our admin team will be notified.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLookupStatus('idle');
                  setFoundName('');
                  setLookupEmail('');
                }}
                aria-label="Clear lookup"
                className="text-white/35 transition hover:text-white/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Not found notice ─────────────────────────── */}
          {existing && lookupStatus === 'not_found' && (
            <div className="flex items-start gap-3 border border-white/10 bg-white/[0.04] p-4">
              <ChevronRight className="mt-0.5 h-4 w-4 flex-none text-white/40" />
              <div className="min-w-0 flex-1">
                <p className="font-ui text-[0.82rem] font-semibold text-white/80">
                  No profile found
                </p>
                <p className="mt-0.5 font-ui text-[0.76rem] text-white/50">
                  Fill in your details below and we'll create your workforce
                  record.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLookupStatus('idle');
                  setLookupEmail('');
                }}
                aria-label="Try a different email"
                className="text-white/35 transition hover:text-white/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Application form ──────────────────────────── */}
          {showForm && (
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
                  <label className="flex cursor-pointer items-center gap-2.5 border border-white/10 bg-black/20 px-3 py-2.5">
                    <input
                      {...register('married')}
                      type="radio"
                      value="no"
                      className="accent-[var(--app-primary)]"
                    />
                    <span className="font-ui text-sm text-white/70">
                      Not married
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5 border border-white/10 bg-black/20 px-3 py-2.5">
                    <input
                      {...register('married')}
                      type="radio"
                      value="yes"
                      className="accent-[var(--app-primary)]"
                    />
                    <span className="font-ui text-sm text-white/70">
                      Married
                    </span>
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
                  {existing && lookupStatus === 'found'
                    ? 'Submitting will update your profile and notify our admin team by email.'
                    : 'After submitting, our team will review your application and follow up within 3–5 days.'}
                </Caption>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                curvature="sm"
                disabled={submitting}
                className="h-12 w-full font-semibold"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </span>
                ) : existing && lookupStatus === 'found' ? (
                  <span className="inline-flex items-center gap-2">
                    Update my profile
                    <ArrowRight className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Submit application
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>
      </BaseModal>
    </Section>
  );
}
