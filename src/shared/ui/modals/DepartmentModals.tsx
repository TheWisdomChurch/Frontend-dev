'use client';

import React, { useEffect, useMemo, useState, type ComponentType } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as ZodResolvers from '@hookform/resolvers/zod';
import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  Check,
  ChevronRight,
  Church,
  Clock,
  DoorOpen,
  Globe,
  Heart,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Mic,
  Music,
  Phone,
  School,
  Shield,
  Sparkles,
  Target,
  User,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';

import { BaseModal, modalStyles } from './Base';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import type {
  DepartmentType,
  JoinFormData,
  JoinUsModalProps,
} from '@/lib/types';

const { zodResolver } = ZodResolvers;

type IconType = ComponentType<{ className?: string }>;
type Step = 'personal' | 'department' | 'availability';

const DEPARTMENT_VALUES = [
  'Ushers',
  'Media Team',
  'Choir',
  'Children Ministry',
  'Youth Ministry',
  'Technical Team',
] as const;

const joinFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  department: z.enum(DEPARTMENT_VALUES),
  role: z.string().min(1, 'Please select a role'),
  experience: z.string().min(1, 'Please select your experience level'),
  availability: z
    .array(z.string())
    .min(1, 'Select at least one availability option'),
  occupation: z.string().min(2, 'Occupation is required').max(100),
  whyJoin: z
    .string()
    .min(20, 'Please share why you want to join, minimum 20 characters')
    .max(500, 'Response too long, max 500 characters'),
  spiritualGifts: z.string().optional(),
  previousMinistry: z.string().optional(),
  agreeToTerms: z.boolean().refine(Boolean, {
    message: 'You must agree to the terms and conditions',
  }),
  agreeToTraining: z.boolean().refine(Boolean, {
    message: 'You must agree to attend required training',
  }),
});

const DEPARTMENT_CONFIG: Record<
  DepartmentType,
  {
    title: string;
    description: string;
    icon: IconType;
    roles: Array<{
      id: string;
      label: string;
      description: string;
      icon: IconType;
    }>;
    skills: string[];
    commitment: string;
  }
> = {
  Ushers: {
    title: 'Ushers Department',
    description: 'Welcome and guide attendees with warmth and excellence.',
    icon: DoorOpen,
    roles: [
      {
        id: 'greeter',
        label: 'Greeter',
        description: 'Welcome people at the entrance.',
        icon: UserCheck,
      },
      {
        id: 'seating',
        label: 'Seating Assistant',
        description: 'Help people find seats.',
        icon: MapPin,
      },
      {
        id: 'information',
        label: 'Information Desk',
        description: 'Answer questions and provide guidance.',
        icon: Bell,
      },
      {
        id: 'special_assistance',
        label: 'Special Assistance',
        description: 'Help elderly and disabled attendees.',
        icon: Heart,
      },
    ],
    skills: ['Communication', 'Patience', 'Organization', 'Hospitality'],
    commitment: '2–4 hours per week',
  },
  'Media Team': {
    title: 'Media Department',
    description:
      'Capture and broadcast the move of God through visuals and sound.',
    icon: Video,
    roles: [
      {
        id: 'camera',
        label: 'Camera Operator',
        description: 'Operate video cameras during services.',
        icon: Video,
      },
      {
        id: 'sound',
        label: 'Sound Engineer',
        description: 'Manage audio equipment and mixing.',
        icon: Mic,
      },
      {
        id: 'lighting',
        label: 'Lighting Technician',
        description: 'Control stage and venue lighting.',
        icon: Sparkles,
      },
      {
        id: 'livestream',
        label: 'Livestream Operator',
        description: 'Manage online broadcasting.',
        icon: Globe,
      },
    ],
    skills: [
      'Technical Skills',
      'Attention to Detail',
      'Creativity',
      'Teamwork',
    ],
    commitment: '3–5 hours per week',
  },
  Choir: {
    title: 'Choir & Worship Team',
    description: 'Lead powerful worship and create heavenly atmospheres.',
    icon: Music,
    roles: [
      {
        id: 'singer',
        label: 'Vocalist',
        description: 'Sing in the choir or worship team.',
        icon: Mic,
      },
      {
        id: 'instrumentalist',
        label: 'Instrumentalist',
        description: 'Play musical instruments.',
        icon: Music,
      },
      {
        id: 'worship_leader',
        label: 'Worship Leader',
        description: 'Lead worship sessions.',
        icon: Sparkles,
      },
      {
        id: 'choir_director',
        label: 'Choir Director',
        description: 'Direct and train choir members.',
        icon: Award,
      },
    ],
    skills: ['Musical Talent', 'Worship Heart', 'Team Player', 'Commitment'],
    commitment: '4–6 hours per week',
  },
  'Children Ministry': {
    title: 'Children Ministry',
    description: 'Nurture young hearts and teach them the ways of God.',
    icon: School,
    roles: [
      {
        id: 'teacher',
        label: 'Sunday School Teacher',
        description: 'Teach Bible lessons to children.',
        icon: BookOpen,
      },
      {
        id: 'assistant',
        label: "Teacher's Assistant",
        description: 'Assist with classroom activities.',
        icon: Users,
      },
      {
        id: 'activity_leader',
        label: 'Activity Leader',
        description: 'Lead games and crafts.',
        icon: Sparkles,
      },
      {
        id: 'safety',
        label: 'Safety Monitor',
        description: 'Ensure child safety and security.',
        icon: Shield,
      },
    ],
    skills: ['Patience', 'Creativity', 'Love for Children', 'Teaching Ability'],
    commitment: '2–3 hours per week',
  },
  'Youth Ministry': {
    title: 'Youth Ministry',
    description: 'Empower the next generation to walk in purpose and power.',
    icon: Sparkles,
    roles: [
      {
        id: 'mentor',
        label: 'Youth Mentor',
        description: 'Mentor and guide young people.',
        icon: UserCheck,
      },
      {
        id: 'activity_coordinator',
        label: 'Activity Coordinator',
        description: 'Plan youth events and activities.',
        icon: Calendar,
      },
      {
        id: 'small_group_leader',
        label: 'Small Group Leader',
        description: 'Lead Bible study groups.',
        icon: Users,
      },
      {
        id: 'outreach',
        label: 'Outreach Coordinator',
        description: 'Plan community outreach events.',
        icon: Globe,
      },
    ],
    skills: [
      'Relatability',
      'Leadership',
      'Communication',
      'Passion for Youth',
    ],
    commitment: '3–5 hours per week',
  },
  'Technical Team': {
    title: 'Technical Team',
    description:
      'Ensure seamless operations behind the scenes with excellence.',
    icon: Target,
    roles: [
      {
        id: 'projection',
        label: 'Projection Operator',
        description: 'Manage slides and media presentation.',
        icon: Video,
      },
      {
        id: 'it_support',
        label: 'IT Support',
        description: 'Maintain computers and network systems.',
        icon: Target,
      },
      {
        id: 'equipment',
        label: 'Equipment Manager',
        description: 'Maintain and setup technical equipment.',
        icon: Briefcase,
      },
      {
        id: 'broadcast',
        label: 'Broadcast Technician',
        description: 'Manage recording and broadcasting.',
        icon: Globe,
      },
    ],
    skills: [
      'Technical Skills',
      'Problem Solving',
      'Attention to Detail',
      'Reliability',
    ],
    commitment: '3–5 hours per week',
  },
};

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'No prior experience' },
  {
    id: 'some',
    label: 'Some Experience',
    description: '1–2 years in church ministry',
  },
  {
    id: 'experienced',
    label: 'Experienced',
    description: '3+ years in church ministry',
  },
  {
    id: 'leader',
    label: 'Leader',
    description: 'Leadership experience in ministry',
  },
];

const AVAILABILITY = [
  { id: 'sunday', label: 'Sunday Services', icon: Church },
  { id: 'midweek', label: 'Midweek Services', icon: Calendar },
  { id: 'special', label: 'Special Events', icon: Sparkles },
  { id: 'flexible', label: 'Flexible Schedule', icon: Clock },
  { id: 'full_time', label: 'Full-time Ministry', icon: Heart },
];

const stepOrder: Step[] = ['personal', 'department', 'availability'];

function stepIndex(step: Step) {
  return stepOrder.indexOf(step);
}

export function JoinUsModal({
  department,
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
}: JoinUsModalProps) {
  const { open } = useServiceUnavailable();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<Step>('personal');
  const [mounted, setMounted] = useState(false);

  const departmentConfig = DEPARTMENT_CONFIG[department];
  const DepartmentIcon = departmentConfig.icon;

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<JoinFormData>({
    resolver: zodResolver(joinFormSchema),
    mode: 'onChange',
    defaultValues: {
      ...defaultValues,
      department,
      role: '',
      experience: '',
      availability: [],
      agreeToTerms: false,
      agreeToTraining: false,
    },
  });

  const role = watch('role');
  const experience = watch('experience');
  const whyJoin = watch('whyJoin') || '';
  const selectedAvailability = watch('availability') || [];

  const toggleAvailability = (id: string) => {
    const next = selectedAvailability.includes(id)
      ? selectedAvailability.filter((item: string) => item !== id)
      : [...selectedAvailability, id];

    setValue('availability', next, { shouldValidate: true, shouldDirty: true });
  };

  const submitForm = async (data: JoinFormData) => {
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...data,
        department_name: departmentConfig.title,
        department_description: departmentConfig.description,
        applied_at: new Date().toISOString(),
      };

      if (!onSubmit) {
        onClose();
        open({
          title: 'Applications opening soon',
          message:
            'We are preparing this sign-up flow for production. Please check back shortly.',
          actionLabel: 'Got it',
        });
        return;
      }

      await onSubmit(submissionData);
      reset();
      setStep('personal');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    if (step === 'personal') {
      const valid = await trigger(['firstName', 'lastName', 'email', 'phone']);
      if (valid) setStep('department');
      return;
    }

    if (step === 'department') {
      const valid = await trigger(['role', 'experience']);
      if (valid) setStep('availability');
      return;
    }

    const valid = await trigger([
      'availability',
      'occupation',
      'whyJoin',
      'agreeToTerms',
      'agreeToTraining',
    ]);

    if (!valid) return;

    await handleSubmit(submitForm)();
  };

  const handlePrevStep = () => {
    if (step === 'department') setStep('personal');
    if (step === 'availability') setStep('department');
  };

  if (!mounted) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Join ${departmentConfig.title}`}
      subtitle={departmentConfig.description}
      maxWidth="max-w-4xl"
      isLoading={isSubmitting}
      loadingText="Submitting application..."
      preventClose={isSubmitting}
      forceBottomSheet
    >
      <div className="space-y-5">
        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl border border-[#f7de12]/20 bg-[#f7de12]/10 text-[#f7de12]">
              <DepartmentIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className={modalStyles.sectionTitle}>Ministry application</p>
              <h3 className="mt-1 text-lg font-semibold text-white">
                {departmentConfig.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-white/58">
                {departmentConfig.description}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
          <div className="grid grid-cols-3 gap-2">
            {stepOrder.map((item, index) => {
              const active = item === step;
              const completed = index < stepIndex(step);

              return (
                <div key={item} className="min-w-0 text-center">
                  <div
                    className={[
                      'mx-auto grid h-8 w-8 place-items-center rounded-full border text-xs font-black transition',
                      active
                        ? 'border-[#f7de12] bg-[#f7de12] text-black'
                        : completed
                          ? 'border-[#f7de12]/40 bg-[#f7de12]/10 text-[#f7de12]'
                          : 'border-white/10 bg-white/[0.035] text-white/45',
                    ].join(' ')}
                  >
                    {completed ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <p
                    className={[
                      'mt-2 truncate text-[0.68rem] font-bold uppercase tracking-[0.12em]',
                      active ? 'text-white' : 'text-white/42',
                    ].join(' ')}
                  >
                    {item}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#f7de12] transition-all duration-500"
              style={{
                width:
                  step === 'personal'
                    ? '33%'
                    : step === 'department'
                      ? '66%'
                      : '100%',
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          {step === 'personal' ? (
            <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="mb-5">
                <p className={modalStyles.sectionTitle}>Personal information</p>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  Tell us about yourself. All fields are required.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={modalStyles.label} htmlFor="firstName">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      type="text"
                      className={`${modalStyles.input} pl-11`}
                      placeholder="John"
                      {...register('firstName')}
                    />
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  </div>
                  {errors.firstName ? (
                    <p className={modalStyles.errorText}>
                      {errors.firstName.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className={modalStyles.label} htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={modalStyles.input}
                    placeholder="Doe"
                    {...register('lastName')}
                  />
                  {errors.lastName ? (
                    <p className={modalStyles.errorText}>
                      {errors.lastName.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className={modalStyles.label} htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      className={`${modalStyles.input} pl-11`}
                      placeholder="john@example.com"
                      {...register('email')}
                    />
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  </div>
                  {errors.email ? (
                    <p className={modalStyles.errorText}>
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className={modalStyles.label} htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      className={`${modalStyles.input} pl-11`}
                      placeholder="+234 801 234 5678"
                      {...register('phone')}
                    />
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  </div>
                  {errors.phone ? (
                    <p className={modalStyles.errorText}>
                      {errors.phone.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {step === 'department' ? (
            <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="mb-5">
                <p className={modalStyles.sectionTitle}>Department & role</p>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  Select the role and experience level that best describes you.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {departmentConfig.roles.map(item => {
                  const Icon = item.icon;
                  const selected = role === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setValue('role', item.id, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className={[
                        'rounded-2xl border p-4 text-left transition hover:-translate-y-0.5',
                        selected
                          ? 'border-[#f7de12] bg-[#f7de12]/10 text-[#f7de12]'
                          : 'border-white/10 bg-black/25 text-white/70 hover:border-white/20 hover:bg-white/[0.04]',
                      ].join(' ')}
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#f7de12]/10">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="mt-1 text-xs leading-5 text-white/52">
                            {item.description}
                          </p>
                        </div>
                        {selected ? (
                          <Check className="h-4 w-4 flex-none" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.role ? (
                <p className={modalStyles.errorText}>{errors.role.message}</p>
              ) : null}

              <div className="mt-6">
                <p className={modalStyles.label}>Ministry Experience Level</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {EXPERIENCE_LEVELS.map(item => {
                    const selected = experience === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setValue('experience', item.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className={[
                          'rounded-2xl border p-4 text-center transition',
                          selected
                            ? 'border-[#f7de12] bg-[#f7de12]/10 text-[#f7de12]'
                            : 'border-white/10 bg-black/25 text-white/70 hover:border-white/20 hover:bg-white/[0.04]',
                        ].join(' ')}
                      >
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="mt-1 text-xs leading-5 text-white/52">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {errors.experience ? (
                  <p className={modalStyles.errorText}>
                    {errors.experience.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 rounded-2xl border border-[#f7de12]/20 bg-[#f7de12]/10 p-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 flex-none text-[#f7de12]" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Department requirements
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {departmentConfig.skills.map(skill => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#f7de12]/10 px-3 py-1 text-xs font-semibold text-[#f7de12]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-white/62">
                      <Clock className="h-4 w-4" />
                      Time Commitment: {departmentConfig.commitment}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {step === 'availability' ? (
            <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="mb-5">
                <p className={modalStyles.sectionTitle}>
                  Availability & details
                </p>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  Tell us when you can serve and share more about yourself.
                </p>
              </div>

              <div>
                <p className={modalStyles.label}>
                  When can you serve? Select all that apply.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {AVAILABILITY.map(item => {
                    const Icon = item.icon;
                    const selected = selectedAvailability.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleAvailability(item.id)}
                        className={[
                          'rounded-2xl border p-4 text-center transition',
                          selected
                            ? 'border-[#f7de12] bg-[#f7de12]/10 text-[#f7de12]'
                            : 'border-white/10 bg-black/25 text-white/70 hover:border-white/20 hover:bg-white/[0.04]',
                        ].join(' ')}
                      >
                        <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-[#f7de12]/10">
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-semibold">{item.label}</p>
                      </button>
                    );
                  })}
                </div>

                {errors.availability ? (
                  <p className={modalStyles.errorText}>
                    {errors.availability.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={modalStyles.label} htmlFor="occupation">
                    Occupation / Profession
                  </label>
                  <input
                    id="occupation"
                    type="text"
                    className={modalStyles.input}
                    placeholder="Software Engineer, Teacher, Student"
                    {...register('occupation')}
                  />
                  {errors.occupation ? (
                    <p className={modalStyles.errorText}>
                      {errors.occupation.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className={modalStyles.label} htmlFor="spiritualGifts">
                    Spiritual Gifts
                  </label>
                  <input
                    id="spiritualGifts"
                    type="text"
                    className={modalStyles.input}
                    placeholder="Teaching, Mercy, Leadership"
                    {...register('spiritualGifts')}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={modalStyles.label} htmlFor="whyJoin">
                    Why do you want to join this ministry?
                  </label>
                  <textarea
                    id="whyJoin"
                    rows={4}
                    className={modalStyles.textarea}
                    placeholder="Share your calling, passion, and what you hope to contribute..."
                    {...register('whyJoin')}
                  />
                  <div className="mt-2 flex justify-between gap-3">
                    {errors.whyJoin ? (
                      <p className={modalStyles.errorText}>
                        {errors.whyJoin.message}
                      </p>
                    ) : (
                      <p className="text-xs text-white/42">
                        Minimum 20 characters
                      </p>
                    )}
                    <p className="text-xs text-white/42">
                      {whyJoin.length}/500
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    className={modalStyles.label}
                    htmlFor="previousMinistry"
                  >
                    Previous Ministry Experience
                  </label>
                  <textarea
                    id="previousMinistry"
                    rows={3}
                    className={modalStyles.textarea}
                    placeholder="Share any previous church ministry experience..."
                    {...register('previousMinistry')}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-white/30 accent-[#f7de12]"
                    {...register('agreeToTerms')}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      I agree to the terms and conditions.
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-white/52">
                      I commit to serving faithfully, upholding church values,
                      and being accountable to ministry leadership.
                    </span>
                    {errors.agreeToTerms ? (
                      <span className={modalStyles.errorText}>
                        {errors.agreeToTerms.message}
                      </span>
                    ) : null}
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-white/30 accent-[#f7de12]"
                    {...register('agreeToTraining')}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      I agree to attend required training.
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-white/52">
                      I understand that ministry training is mandatory and
                      commit to attending all scheduled training sessions.
                    </span>
                    {errors.agreeToTraining ? (
                      <span className={modalStyles.errorText}>
                        {errors.agreeToTraining.message}
                      </span>
                    ) : null}
                  </span>
                </label>
              </div>

              <div className="mt-5 rounded-2xl border border-[#f7de12]/20 bg-[#f7de12]/10 p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-5 w-5 flex-none text-[#f7de12]" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      What happens after you apply?
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-white/62">
                      {[
                        'Application review within 3–5 business days',
                        'Email notification with next steps',
                        'Orientation and training session scheduling',
                      ].map(item => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-[#f7de12]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <div className="sticky bottom-0 -mx-5 border-t border-white/10 bg-[#070707]/95 px-5 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={step === 'personal' || isSubmitting}
                className={modalStyles.ghostButton}
              >
                <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className={modalStyles.primaryButton}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : step === 'availability' ? (
                  <span className="inline-flex items-center justify-center">
                    Submit Application
                    <Check className="ml-2 h-4 w-4" />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center">
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}
