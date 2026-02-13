// components/ui/Homepage/JoinUs.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Video, Music, Baby, Cpu, Users2, ArrowRight, Sparkles } from 'lucide-react';

import { Section, Container } from '@/components/layout';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';
import { H2, BodySM, SmallText, Caption } from '@/components/text';
import { Workforce_bg } from '@/components/assets';
import { apiClient } from '@/lib/api';

const departments = [
  {
    title: 'Ushers & Protocol',
    from: '#f59e0b',
    to: '#f97316',
    icon: Users,
    description: 'First touch hospitality and service flow.',
  },
  {
    title: 'Media & Broadcast',
    from: '#3b82f6',
    to: '#06b6d4',
    icon: Video,
    description: 'Storytelling through cameras, lights, and sound.',
  },
  {
    title: 'Wave City Music',
    from: '#f43f5e',
    to: '#ec4899',
    icon: Music,
    description: 'Lead worship and craft the atmosphere.',
  },
  {
    title: 'Children Ministry',
    from: '#10b981',
    to: '#14b8a6',
    icon: Baby,
    description: 'Shepherd the next generation.',
  },
  {
    title: 'Youth & Campus',
    from: '#6366f1',
    to: '#a855f7',
    icon: Users2,
    description: 'Mentor teens and young adults.',
  },
  {
    title: 'Technical Team',
    from: '#475569',
    to: '#0f172a',
    icon: Cpu,
    description: 'Keep every service running smoothly.',
  },
];

export default function JoinWisdomHouse() {
  const { colorScheme } = useTheme();
  const { open } = useServiceUnavailable();

  const [submitted, setSubmitted] = useState(false);
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [existing, setExisting] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>('');

  const departmentOptions = useMemo(() => departments.map((d) => d.title), []);

  // lock body scroll when modal is open
  useEffect(() => {
    if (openModal) {
      const originalBody = document.body.style.overflow;
      const originalHtml = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalBody;
        document.documentElement.style.overflow = originalHtml;
      };
    }
  }, [openModal]);

  /* ----------------------- Quick signup (compact form) ---------------------- */
  const quickSchema = z.object({
    name: z
      .string()
      .min(2, 'Enter your full name')
      .refine((val) => val.trim().split(/\s+/).length >= 2, 'Enter first and last name'),
    email: z.string().email('Enter a valid email'),
    team: z.string().min(1, 'Select a team'),
  });

  const {
    register: registerQuick,
    handleSubmit: handleQuickSubmit,
    formState: { errors: quickErrors },
    reset: resetQuick,
  } = useForm<z.infer<typeof quickSchema>>({
    resolver: zodResolver(quickSchema),
    defaultValues: { name: '', email: '', team: '' },
  });

  const splitName = (value: string) => {
    const parts = value.trim().split(/\s+/);
    const firstName = parts.shift() || '';
    const lastName = parts.join(' ').trim() || firstName;
    return { firstName, lastName };
  };

  const toBackendBirthday = (mmdd: string) => {
    const trimmed = mmdd.trim();
    const [mm, dd] = trimmed.split('/');
    if (!mm || !dd) return '';
    return `${dd}/${mm}`;
  };

  const onQuickSubmit = handleQuickSubmit(async (values) => {
    try {
      setQuickSubmitting(true);
      const { firstName, lastName } = splitName(values.name);
      await apiClient.applyWorkforce({
        firstName,
        lastName,
        email: values.email,
        department: values.team,
        notes: 'Quick signup',
      });
      setSubmitted(true);
      resetQuick();
      setTimeout(() => setSubmitted(false), 2400);
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

  const handleOpenModal = (dept?: string) => {
    const v = dept || '';
    setSelectedDept(v);
    setExisting(false);
    setOpenModal(true);
  };

  /* ----------------------- Full modal form schema -------------------------- */
  const countryCodes = [
    { code: '+234', label: 'Nigeria' },
    { code: '+233', label: 'Ghana' },
    { code: '+44', label: 'UK' },
    { code: '+1', label: 'USA/Canada' },
  ];

  /**
   * ✅ FIX: remove `.default('no')` so Zod input/output types match RHF.
   * Keep default in `defaultValues`.
   */
  const modalSchema = z
    .object({
      fullName: z
        .string()
        .min(3, 'Full name is required')
        .refine((val) => val.trim().split(/\s+/).length >= 2, 'Enter first and last name'),
      phoneCode: z.string().min(2),
      phone: z.string().min(7, 'Phone number is required'),
      email: z.string().email('Valid email required'),
      birthday: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/, 'Use MM/DD'),
      occupation: z.string().optional(),
      department: z.string().min(1, 'Select a department'),
      married: z.enum(['yes', 'no']), // ✅ no default here
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

  type ModalValues = z.infer<typeof modalSchema>;

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
      married: 'no', // ✅ default stays here
      spouse: '',
      anniversary: '',
      about: '',
    },
  });

  const marriedValue = watch('married');

  const onModalSubmit = handleModalSubmit(async (values) => {
    try {
      setModalSubmitting(true);
      const { firstName, lastName } = splitName(values.fullName);
      const notesParts: string[] = [];
      if (existing) notesParts.push('Existing worker: yes');
      if (values.occupation) notesParts.push(`Occupation: ${values.occupation}`);
      if (values.married === 'yes') {
        if (values.spouse) notesParts.push(`Spouse: ${values.spouse}`);
        if (values.anniversary) notesParts.push(`Anniversary: ${values.anniversary}`);
      }
      if (values.about) notesParts.push(`About: ${values.about}`);

      const birthday = toBackendBirthday(values.birthday);
      const phone = `${values.phoneCode} ${values.phone}`.trim();

      await apiClient.applyWorkforce({
        firstName,
        lastName,
        email: values.email,
        phone,
        department: values.department,
        birthday: birthday || undefined,
        notes: notesParts.length > 0 ? notesParts.join('\n') : undefined,
      });

      setOpenModal(false);
      resetModal();
      setSelectedDept('');
      open({
        title: 'Application received',
        message: 'Thank you for joining the workforce. We will reach out soon.',
        actionLabel: 'Great',
      });
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

  // Keep RHF "department" in sync if user opens modal from a department card
  useEffect(() => {
    if (openModal) {
      setValue('department', selectedDept || '', {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [openModal, selectedDept, setValue]);

  return (
    <Section
      id="join"
      padding="xl"
      background="custom"
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(185deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.94) 50%, rgba(0,0,0,0.96) 100%), url(${Workforce_bg.src})`,
        backgroundSize: 'cover, cover',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'center center, center center',
        backgroundBlendMode: 'overlay',
        backgroundColor: '#050505',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/75 to-black/85 pointer-events-none" />

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/25 bg-white/5 text-white text-xs uppercase tracking-[0.18em]">
              <Sparkles className="w-3.5 h-3.5" />
              “Two are better than one” — Ecclesiastes 4:9
            </div>

            <H2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight">
              Join the <span style={{ color: colorScheme.primary }}>Wisdom Church</span>{' '}
              workforce
            </H2>

            <BodySM className="text-white/75 max-w-2xl">
              Serving together is worship. Hospitality, music, media, prayer, and
              tech—pick a lane, get trained, and build the body with joy.
            </BodySM>

            <div className="flex items-center gap-4 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: colorScheme.primary }}
                />
                “Each one should use whatever gift…” — 1 Peter 4:10
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: colorScheme.primary }}
                />
                Together we serve, together we grow.
              </div>
            </div>
          </div>

          {/* ✅ QUICK SIGNUP FORM */}
          <form
            onSubmit={onQuickSubmit}
            className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-4"
          >
            <SmallText className="text-white/80">Quick signup</SmallText>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm text-white/80 space-y-1">
                Full Name
                <input
                  type="text"
                  {...registerQuick('name')}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                />
                {quickErrors.name && (
                  <span className="text-xs text-amber-300">
                    {quickErrors.name.message}
                  </span>
                )}
              </label>

              <label className="text-sm text-white/80 space-y-1">
                Email
                <input
                  type="email"
                  {...registerQuick('email')}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                />
                {quickErrors.email && (
                  <span className="text-xs text-amber-300">
                    {quickErrors.email.message}
                  </span>
                )}
              </label>
            </div>

            <label className="text-sm text-white/80 space-y-1">
              Preferred Team
              <select
                {...registerQuick('team')}
                className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
              >
                <option value="">Select a team</option>
                {departments.map((dept) => (
                  <option key={dept.title} value={dept.title}>
                    {dept.title}
                  </option>
                ))}
              </select>

              {quickErrors.team && (
                <span className="text-xs text-amber-300">
                  {quickErrors.team.message}
                </span>
              )}
            </label>

            <CustomButton
              type="submit"
              variant="primary"
              size="md"
              curvature="xl"
              elevated
              className="w-full"
              disabled={quickSubmitting}
            >
              {quickSubmitting ? 'Submitting...' : submitted ? 'We will reach out!' : 'Quick signup'}
            </CustomButton>

            <CustomButton
              type="button"
              variant="outline"
              size="sm"
              curvature="xl"
              className="w-full text-white border-white/30 hover:border-white/60"
              style={{ color: '#ffffff' }}
              onClick={() => handleOpenModal()}
            >
              Open full workforce form
            </CustomButton>

            <Caption className="text-white/60">
              We respond within 24 hours. Training happens weekly after service.
            </Caption>
          </form>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex flex-col gap-3 shadow-xl transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ boxShadow: `0 10px 30px ${colorScheme.opacity.primary10}` }}
                onClick={() => handleOpenModal(dept.title)}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white relative"
                  style={{
                    background: `linear-gradient(135deg, ${dept.from} 0%, ${dept.to} 100%)`,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="relative z-10 space-y-1">
                  <SmallText weight="bold" className="text-white">
                    {dept.title}
                  </SmallText>
                  <Caption className="text-white/70">{dept.description}</Caption>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-2">
                  <Caption className="text-white/60">Tap to choose above</Caption>
                  <ArrowRight className="w-4 h-4 text-white/70" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ MODAL */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpenModal(false)}
            />

            <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-t-3xl rounded-b-none border border-white/12 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-center pt-3 pb-2">
                <span className="h-1.5 w-12 rounded-full bg-white/30" />
              </div>
              <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-5 sm:px-8 py-4 sm:py-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                    Join the Wisdom Church Workforce
                  </p>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    “Two are better than one...”
                  </h3>
                  <p className="text-xs text-white/70">
                    Ecclesiastes 4:9 — Together we build, pray, and serve.
                  </p>
                </div>

                <button
                  className="text-white/70 hover:text-white"
                  onClick={() => setOpenModal(false)}
                  aria-label="Close"
                  type="button"
                >
                  ×
                </button>
              </div>

              <form onSubmit={onModalSubmit} className="p-5 sm:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={existing}
                      onChange={(e) => setExisting(e.target.checked)}
                      className="accent-yellow-400 h-4 w-4"
                    />
                    Already serving? Update my details
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="text-sm text-white/80 space-y-1">
                    Full Name
                    <input
                      type="text"
                      className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2"
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <span className="text-xs text-amber-300">
                        {errors.fullName.message}
                      </span>
                    )}
                  </label>

                  <label className="text-sm text-white/80 space-y-1">
                    Contact Phone
                    <div className="flex gap-2">
                      <select
                        className="w-24 rounded-xl bg-black/30 border border-white/20 text-white px-2 py-2"
                        {...register('phoneCode')}
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} {c.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        className="flex-1 rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2"
                        placeholder="812 345 6789"
                        {...register('phone')}
                      />
                    </div>

                    {errors.phone && (
                      <span className="text-xs text-amber-300">
                        {errors.phone.message}
                      </span>
                    )}
                  </label>

                  <label className="text-sm text-white/80 space-y-1">
                    Contact Email
                    <input
                      type="email"
                      className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2"
                      {...register('email')}
                    />
                    {errors.email && (
                      <span className="text-xs text-amber-300">
                        {errors.email.message}
                      </span>
                    )}
                  </label>

                  <label className="text-sm text-white/80 space-y-1">
                    Birthday (MM/DD)
                    <input
                      type="text"
                      placeholder="08/15"
                      className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2"
                      {...register('birthday')}
                    />
                    {errors.birthday && (
                      <span className="text-xs text-amber-300">
                        {errors.birthday.message}
                      </span>
                    )}
                  </label>

                  <label className="text-sm text-white/80 space-y-1">
                    Occupation
                    <input
                      type="text"
                      className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2"
                      {...register('occupation')}
                    />
                  </label>

                  <label className="text-sm text-white/80 space-y-1">
                    Department
                    <select
                      className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2"
                      value={selectedDept}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSelectedDept(v);
                        setValue('department', v, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {errors.department && (
                      <span className="text-xs text-amber-300">
                        {errors.department.message}
                      </span>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="text-sm text-white/80 space-y-1">
                    Married?
                    <select
                      className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2"
                      {...register('married')}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </label>

                  {marriedValue === 'yes' && (
                    <>
                      <label className="text-sm text-white/80 space-y-1">
                        Spouse Name
                        <input
                          type="text"
                          className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2"
                          {...register('spouse')}
                        />
                        {errors.spouse && (
                          <span className="text-xs text-amber-300">
                            {errors.spouse.message}
                          </span>
                        )}
                      </label>

                      <label className="text-sm text-white/80 space-y-1">
                        Wedding Anniversary
                        <input
                          type="date"
                          className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2"
                          {...register('anniversary')}
                        />
                        {errors.anniversary && (
                          <span className="text-xs text-amber-300">
                            {errors.anniversary.message}
                          </span>
                        )}
                      </label>
                    </>
                  )}
                </div>

                <label className="text-sm text-white/80 space-y-1 block">
                  Tell us about yourself (max 100 words)
                  <textarea
                    maxLength={800}
                    className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2 min-h-[110px]"
                    placeholder="Share a short story (max 100 words)"
                    {...register('about')}
                  />
                  {errors.about && (
                    <span className="text-xs text-amber-300">
                      {errors.about.message}
                    </span>
                  )}
                </label>

                <div className="flex flex-wrap gap-3 pt-2">
                  <CustomButton
                    variant="primary"
                    size="md"
                    curvature="xl"
                    className="w-full sm:w-auto"
                    type="submit"
                    disabled={modalSubmitting}
                  >
                    {modalSubmitting ? 'Submitting...' : 'Submit details'}
                  </CustomButton>

                  <CustomButton
                    variant="ghost"
                    size="sm"
                    curvature="xl"
                    className="text-white w-full sm:w-auto"
                    onClick={() => setOpenModal(false)}
                    type="button"
                  >
                    Cancel
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
