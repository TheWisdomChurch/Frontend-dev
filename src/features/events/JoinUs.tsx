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
  ShieldCheck,
  Sparkles,
  Users,
  Users2,
  Video,
} from 'lucide-react';

import { Container, Section } from '@/shared/layout';
import CustomButton from '@/shared/utils/buttons/CustomButton';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import { BaseModal } from '@/shared/ui/modals/Base';
import { H2, BodySM, SmallText, Caption } from '@/shared/text';
import { apiClient } from '@/lib/api';

const { zodResolver } = ZodResolvers;

const departments = [
  {
    title: 'Ushers & Protocol',
    section: 'Protocol',
    apiDepartment: 'Protocol',
    from: '#f59e0b',
    to: '#f97316',
    icon: Users,
    description: 'First touch hospitality and service flow.',
  },
  {
    title: 'Media & Broadcast',
    section: 'Media',
    apiDepartment: 'Media',
    from: '#3b82f6',
    to: '#06b6d4',
    icon: Video,
    description: 'Storytelling through cameras, lights, and sound.',
  },
  {
    title: 'Wave City Music',
    section: 'Music',
    apiDepartment: 'Music',
    from: '#f43f5e',
    to: '#ec4899',
    icon: Music,
    description: 'Lead worship and craft the atmosphere.',
  },
  {
    title: 'Children Ministry',
    section: 'Children',
    apiDepartment: 'Children',
    from: '#10b981',
    to: '#14b8a6',
    icon: Baby,
    description: 'Shepherd the next generation.',
  },
  {
    title: 'Youth & Campus',
    section: 'Youth',
    apiDepartment: 'Youth',
    from: '#6366f1',
    to: '#a855f7',
    icon: Users2,
    description: 'Mentor teens and young adults.',
  },
  {
    title: 'Technical Team',
    section: 'Technical',
    apiDepartment: 'Technical',
    from: '#475569',
    to: '#0f172a',
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
  'w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[#F7DE12]/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-[#F7DE12]/10';

const selectClass =
  'w-full rounded-2xl border border-white/12 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[#F7DE12]/70 focus:ring-4 focus:ring-[#F7DE12]/10';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-red-300">{message}</p>;
}

export default function JoinWisdomHouse() {
  const { colorScheme } = useTheme();
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
      className="relative overflow-hidden bg-[#050505]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 14% 18%, rgba(247,222,18,0.14), transparent 32%), radial-gradient(circle at 88% 12%, rgba(255,255,255,0.08), transparent 30%), radial-gradient(circle at 50% 100%, rgba(247,222,18,0.09), transparent 34%)',
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
      </div>

      <Container size="xl" className="relative z-10 py-14 sm:py-18 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <div className="space-y-7">
            <div>
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
                style={{
                  borderColor: `${colorScheme.primary}33`,
                  background: `${colorScheme.primary}12`,
                  color: colorScheme.primary,
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <Caption className="text-[10px] font-bold uppercase tracking-[0.24em]">
                  Join the workforce
                </Caption>
              </div>

              <H2
                className="max-w-2xl text-[2.25rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl"
                useThemeColor={false}
              >
                Serve with excellence. Build with purpose.
              </H2>

              <BodySM
                className="mt-5 max-w-xl text-[0.95rem] leading-7 text-white/68 sm:text-base"
                useThemeColor={false}
              >
                Use your gifts to strengthen the house, serve people, and help
                create a warm Spirit-filled experience for everyone who comes
                through Wisdom House.
              </BodySM>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ['6+', 'Teams'],
                ['24h', 'Follow-up'],
                ['One', 'Family'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl"
                >
                  <p
                    className="text-2xl font-semibold"
                    style={{ color: colorScheme.primary }}
                  >
                    {value}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <form
              onSubmit={onQuickSubmit}
              className="rounded-[2rem] border border-white/12 bg-white/[0.065] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-6"
            >
              <div className="mb-5 flex items-start gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark || colorScheme.primary})`,
                  }}
                >
                  <HeartHandshake className="h-5 w-5 text-black" />
                </div>

                <div>
                  <SmallText
                    weight="bold"
                    className="text-white"
                    useThemeColor={false}
                  >
                    Quick team interest
                  </SmallText>
                  <Caption
                    className="mt-1 text-[0.8rem] leading-5 text-white/55"
                    useThemeColor={false}
                  >
                    Submit your name, email, and preferred team. The full form
                    is available below.
                  </Caption>
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

                <CustomButton
                  type="submit"
                  variant="primary"
                  size="md"
                  curvature="full"
                  disabled={quickSubmitting}
                  className="mt-1 h-12 w-full font-semibold"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: '#000',
                  }}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {quickSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : submitted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Submitted
                      </>
                    ) : (
                      <>
                        Submit interest
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </span>
                </CustomButton>

                <button
                  type="button"
                  onClick={() => handleOpenModal()}
                  className="text-center text-sm font-semibold text-white/75 underline underline-offset-4 transition hover:text-white"
                >
                  Complete full workforce form
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {departments.map((dept, index) => {
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
                  className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 text-left shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.085] ${
                    index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div
                    className="absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-opacity group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${dept.from}, ${dept.to})`,
                      opacity: 0.18,
                    }}
                  />

                  <div className="relative z-10">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${dept.from}, ${dept.to})`,
                      }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    <SmallText
                      weight="bold"
                      className="mt-5 text-white"
                      useThemeColor={false}
                    >
                      {dept.title}
                    </SmallText>

                    <Caption
                      className="mt-2 line-clamp-2 text-[0.82rem] leading-6 text-white/58"
                      useThemeColor={false}
                    >
                      {dept.description}
                    </Caption>

                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white/75 transition group-hover:text-white">
                      Apply for this team
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-black/30 p-5 backdrop-blur-2xl sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Guided onboarding',
                text: 'A team lead follows up and helps you understand the next step.',
              },
              {
                icon: Users,
                title: 'Community first',
                text: 'You serve with people, not alone. Every team is built around family.',
              },
              {
                icon: Sparkles,
                title: 'Purpose driven',
                text: 'Your skill and passion can help create meaningful ministry moments.',
              },
            ].map(item => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      background: `${colorScheme.primary}18`,
                      color: colorScheme.primary,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/55">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      <BaseModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Join the workforce"
        subtitle="Complete your details and our team will follow up with your next step."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={onModalSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-1.5">
            <button
              type="button"
              onClick={() => setExisting(false)}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                !existing
                  ? 'bg-[#F7DE12] text-black'
                  : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              New member
            </button>

            <button
              type="button"
              onClick={() => setExisting(true)}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                existing
                  ? 'bg-[#F7DE12] text-black'
                  : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              Existing member
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <input
                {...register('fullName')}
                className={inputClass}
                placeholder="Full name"
              />
              <FieldError message={errors.fullName?.message} />
            </div>

            <div>
              <input
                {...register('email')}
                className={inputClass}
                placeholder="Email address"
                type="email"
              />
              <FieldError message={errors.email?.message} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[0.42fr_1fr]">
            <div>
              <select {...register('phoneCode')} className={selectClass}>
                {countryCodes.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.code} · {item.label}
                  </option>
                ))}
              </select>
              <FieldError message={errors.phoneCode?.message} />
            </div>

            <div>
              <input
                {...register('phone')}
                className={inputClass}
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
                className={inputClass}
                placeholder="Birthday · DD/MM"
              />
              <FieldError message={errors.birthday?.message} />
            </div>

            <div>
              <input
                {...register('occupation')}
                className={inputClass}
                placeholder="Occupation optional"
              />
              <FieldError message={errors.occupation?.message} />
            </div>
          </div>

          <div>
            <select {...register('department')} className={selectClass}>
              <option value="">Select department</option>
              {departmentOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FieldError message={errors.department?.message} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="mb-3 text-sm font-semibold text-white">
              Marital status
            </p>

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
                    className={inputClass}
                    placeholder="Spouse name"
                  />
                  <FieldError message={errors.spouse?.message} />
                </div>

                <div>
                  <input
                    {...register('anniversary')}
                    className={inputClass}
                    placeholder="Anniversary date"
                  />
                  <FieldError message={errors.anniversary?.message} />
                </div>
              </div>
            )}
          </div>

          <div>
            <textarea
              {...register('about')}
              className={`${inputClass} min-h-[120px] resize-none`}
              placeholder="Tell us briefly about your passion, skills, or previous service experience..."
            />
            <FieldError message={errors.about?.message} />
          </div>

          <CustomButton
            type="submit"
            variant="primary"
            size="md"
            curvature="full"
            disabled={modalSubmitting}
            className="h-12 w-full font-semibold"
            style={{
              backgroundColor: colorScheme.primary,
              color: '#000',
            }}
          >
            <span className="inline-flex items-center justify-center gap-2">
              {modalSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit application
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </span>
          </CustomButton>
        </form>
      </BaseModal>
    </Section>
  );
}
