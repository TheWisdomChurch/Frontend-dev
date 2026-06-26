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
  CheckCircle2,
  Cpu,
  HeartHandshake,
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
    description: 'Storytelling through cameras, lights, and sound.',
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
    description: 'Shepherd the next generation.',
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
    description: 'Keep every service running smoothly.',
  },
];

const countryCodes = [
  { code: '+234', label: 'Nigeria' },
  { code: '+233', label: 'Ghana' },
  { code: '+44', label: 'UK' },
  { code: '+1', label: 'USA/Canada' },
];

const quickSchema = z.object({
  name: z
    .string()
    .min(2, 'Enter your full name')
    .refine(
      val => val.trim().split(/\s+/).length >= 2,
      'Enter first and last name'
    ),
  email: z.string().email('Enter a valid email'),
  team: z.string().min(1, 'Select a team'),
});

const modalSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Full name is required')
      .refine(
        val => val.trim().split(/\s+/).length >= 2,
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
    about: z.string().max(800, 'Keep under 100 words').optional(),
  })
  .superRefine((val, ctx) => {
    if (val.married === 'yes') {
      if (!val.spouse) {
        ctx.addIssue({
          code: 'custom',
          path: ['spouse'],
          message: 'Spouse name required',
        });
      }
      if (!val.anniversary) {
        ctx.addIssue({
          code: 'custom',
          path: ['anniversary'],
          message: 'Anniversary date required',
        });
      }
    }
  });

type QuickValues = z.infer<typeof quickSchema>;
type ModalValues = z.infer<typeof modalSchema>;

const inputClass =
  'w-full border border-[var(--app-ink)]/15 bg-white px-4 py-3 text-sm text-[var(--app-ink)] outline-none transition rounded-[var(--radius-input)] placeholder:text-[var(--app-ink)]/30 hover:border-[var(--app-ink)]/25 focus:border-[var(--app-primary)]/60 focus:ring-2 focus:ring-[var(--app-primary)]/10';

const selectClass =
  'w-full border border-[var(--app-ink)]/15 bg-white px-4 py-3 text-sm text-[var(--app-ink)] outline-none transition rounded-[var(--radius-input)] hover:border-[var(--app-ink)]/25 focus:border-[var(--app-primary)]/60 focus:ring-2 focus:ring-[var(--app-primary)]/10';

const modalInputClass =
  'w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-[var(--app-primary)]/10';

const modalSelectClass =
  'w-full rounded-2xl border border-white/12 bg-[#1a1814] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-4 focus:ring-[var(--app-primary)]/10';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Caption className="mt-1 text-red-500">{message}</Caption>;
}

function ModalFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Caption className="mt-1 text-red-300">{message}</Caption>;
}

export default function JoinWisdomHouse() {
  const { open } = useServiceUnavailable();

  const [submitted, setSubmitted] = useState(false);
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [existing, setExisting] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');

  const departmentOptions = useMemo(() => departments.map(d => d.title), []);

  const {
    register: registerQuick,
    handleSubmit: handleQuickSubmit,
    formState: { errors: quickErrors },
    reset: resetQuick,
    setValue: setQuickValue,
  } = useForm<QuickValues>({
    resolver: zodResolver(quickSchema),
    defaultValues: { name: '', email: '', team: '' },
  });

  const {
    register,
    handleSubmit: handleModalSubmit,
    formState: { errors },
    reset: resetModal,
    watch,
    setValue,
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

  const splitName = (value: string) => {
    const parts = value.trim().split(/\s+/);
    const firstName = parts.shift() || '';
    const lastName = parts.join(' ').trim() || firstName;
    return { firstName, lastName };
  };

  const getDepartmentMeta = (rawDepartment: string) => {
    const matched = departments.find(
      d => d.title.toLowerCase() === rawDepartment.trim().toLowerCase()
    );
    return {
      department: matched?.apiDepartment || rawDepartment.trim(),
      departmentSection: matched?.section || 'General',
      originalLabel: rawDepartment.trim(),
    };
  };

  const handleOpenModal = useCallback(
    (dept?: string) => {
      const value = dept || selectedDept || '';
      setSelectedDept(value);
      setExisting(false);
      setOpenModal(true);
      resetModal({
        fullName: '',
        phoneCode: '+234',
        phone: '',
        email: '',
        birthday: '',
        occupation: '',
        department: value,
        married: 'no',
        spouse: '',
        anniversary: '',
        about: '',
      });
    },
    [resetModal, selectedDept]
  );

  const onQuickSubmit = handleQuickSubmit(async (values: QuickValues) => {
    try {
      setQuickSubmitting(true);
      const { firstName, lastName } = splitName(values.name);
      const dept = getDepartmentMeta(values.team);
      await apiClient.applyWorkforceNew({
        firstName,
        lastName,
        email: values.email,
        department: dept.department,
        departmentSection: dept.departmentSection,
        registrationType: 'new',
        sourceChannel: 'frontend:web:join-us:quick',
        notes: `Quick signup\nOriginal team label: ${dept.originalLabel}`,
      } as any);
      setSubmitted(true);
      resetQuick();
      setTimeout(() => setSubmitted(false), 2600);
    } catch (err: any) {
      open({
        title: 'Unable to submit',
        message: err?.message || 'Please try again shortly.',
        actionLabel: 'Got it',
      });
    } finally {
      setQuickSubmitting(false);
    }
  });

  const onModalSubmit = handleModalSubmit(async (values: ModalValues) => {
    try {
      setModalSubmitting(true);
      const { firstName, lastName } = splitName(values.fullName);
      const dept = getDepartmentMeta(values.department);
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
        sourceChannel: 'frontend:web:join-us:full',
        notes: [
          `Full workforce form`,
          `Original team label: ${dept.originalLabel}`,
          `Member status: ${existing ? 'Existing member' : 'New member'}`,
          values.about ? `About: ${values.about}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      } as any);
      setOpenModal(false);
      setSubmitted(true);
      resetModal();
      setTimeout(() => setSubmitted(false), 2600);
    } catch (err: any) {
      open({
        title: 'Unable to submit',
        message: err?.message || 'Please try again shortly.',
        actionLabel: 'Got it',
      });
    } finally {
      setModalSubmitting(false);
    }
  });

  return (
    <Section
      padding="none"
      fullHeight={false}
      className="bg-[var(--app-canvas)]"
    >
      <Container size="xl" className="py-section-md">
        {/* ── Section header ─────────────────────────────── */}
        <div className="mb-12">
          <p className="mb-3 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Join the workforce
          </p>
          <h2
            className="font-headline font-normal text-[var(--app-ink)]"
            style={{ fontSize: 'var(--type-display-sm)' }}
          >
            Serve with excellence.
          </h2>
          <p className="mt-4 max-w-[480px] text-[0.95rem] leading-[1.8] text-[var(--app-ink)]/60">
            Use your gifts to strengthen the house, serve people, and help
            create a warm Spirit-filled experience for everyone who walks
            through our doors.
          </p>
        </div>

        {/* ── Main layout ────────────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
          {/* Left — quick form ─────────────────────────── */}
          <div>
            <form
              onSubmit={onQuickSubmit}
              className="border border-[var(--app-ink)]/10 bg-[var(--app-canvas-2)] p-6"
              style={{ borderRadius: 'var(--radius-card)' }}
            >
              <div className="mb-5 flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--app-primary)]"
                  style={{ borderRadius: 'var(--radius-badge)' }}
                >
                  <HeartHandshake className="h-4.5 w-4.5 text-[#0d0a06]" />
                </div>
                <div>
                  <p className="text-[0.8rem] font-bold text-[var(--app-ink)]">
                    Quick team interest
                  </p>
                  <p className="mt-0.5 text-[0.75rem] leading-5 text-[var(--app-ink)]/55">
                    Submit your name, email, and preferred team. The full form
                    is available below.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div>
                  <input
                    {...registerQuick('name')}
                    className={inputClass}
                    placeholder="Full name"
                  />
                  <FieldError message={quickErrors.name?.message} />
                </div>
                <div>
                  <input
                    {...registerQuick('email')}
                    className={inputClass}
                    placeholder="Email address"
                    type="email"
                  />
                  <FieldError message={quickErrors.email?.message} />
                </div>
                <div>
                  <select {...registerQuick('team')} className={selectClass}>
                    <option value="">Select preferred team</option>
                    {departmentOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <FieldError message={quickErrors.team?.message} />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={quickSubmitting}
                  className="mt-1 h-12 w-full font-semibold"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {quickSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : submitted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Submitted
                      </>
                    ) : (
                      <>
                        Submit interest <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </span>
                </Button>

                <button
                  type="button"
                  onClick={() => handleOpenModal()}
                  className="text-center text-[0.78rem] font-semibold text-[var(--app-ink)]/50 underline underline-offset-4 transition hover:text-[var(--app-primary)]"
                >
                  Complete full workforce form
                </button>
              </div>
            </form>
          </div>

          {/* Right — department cards ───────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {departments.map(dept => {
              const Icon = dept.icon;
              return (
                <button
                  key={dept.title}
                  type="button"
                  onClick={() => {
                    setSelectedDept(dept.title);
                    setQuickValue('team', dept.title);
                    setValue('department', dept.title);
                    handleOpenModal(dept.title);
                  }}
                  className="group flex flex-col items-start border border-[var(--app-ink)]/10 bg-[var(--app-canvas-2)] p-5 text-left transition duration-200 hover:border-[var(--app-ink)]/20 hover:bg-[var(--app-canvas)] hover:shadow-sm"
                  style={{ borderRadius: 'var(--radius-card)' }}
                >
                  {/* Colored icon on neutral background */}
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center bg-[var(--app-canvas)]"
                    style={{ borderRadius: 'var(--radius-badge)' }}
                  >
                    <Icon className="h-4.5 w-4.5 text-[var(--app-primary)]" />
                  </div>

                  <p className="text-[0.82rem] font-bold text-[var(--app-ink)]">
                    {dept.title}
                  </p>
                  <p className="mt-1 text-[0.75rem] leading-[1.55] text-[var(--app-ink)]/50">
                    {dept.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-[var(--app-primary)] transition group-hover:gap-2">
                    Apply <ArrowRight className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Container>

      {/* ── Full workforce modal ──────────────────────────── */}
      <BaseModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Join the workforce"
        subtitle="Complete your details and our team will follow up with your next step."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={onModalSubmit} className="space-y-5">
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
                className={modalInputClass}
                placeholder="Full name"
              />
              <ModalFieldError message={errors.fullName?.message} />
            </div>
            <div>
              <input
                {...register('email')}
                className={modalInputClass}
                placeholder="Email address"
                type="email"
              />
              <ModalFieldError message={errors.email?.message} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[0.42fr_1fr]">
            <div>
              <select {...register('phoneCode')} className={modalSelectClass}>
                {countryCodes.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.code} · {item.label}
                  </option>
                ))}
              </select>
              <ModalFieldError message={errors.phoneCode?.message} />
            </div>
            <div>
              <input
                {...register('phone')}
                className={modalInputClass}
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
                className={modalInputClass}
                placeholder="Birthday · DD/MM"
              />
              <ModalFieldError message={errors.birthday?.message} />
            </div>
            <div>
              <input
                {...register('occupation')}
                className={modalInputClass}
                placeholder="Occupation optional"
              />
              <ModalFieldError message={errors.occupation?.message} />
            </div>
          </div>

          <div>
            <select {...register('department')} className={modalSelectClass}>
              <option value="">Select department</option>
              {departmentOptions.map(option => (
                <option key={option} value={option}>
                  {option}
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
                    className={modalInputClass}
                    placeholder="Spouse name"
                  />
                  <ModalFieldError message={errors.spouse?.message} />
                </div>
                <div>
                  <input
                    {...register('anniversary')}
                    className={modalInputClass}
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
              className={`${modalInputClass} min-h-[120px] resize-none`}
              placeholder="Tell us briefly about your passion, skills, or previous service experience…"
            />
            <ModalFieldError message={errors.about?.message} />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            curvature="full"
            disabled={modalSubmitting}
            className="h-12 w-full font-semibold"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {modalSubmitting ? (
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
