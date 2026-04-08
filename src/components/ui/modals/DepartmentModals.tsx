'use client';

import { useState, useCallback, useEffect, JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  Check,
  Users,
  Music,
  Shield,
  UserCheck,
  Heart,
  Building,
  DoorOpen,
  Bell,
  Mail,
  Phone,
  User,
  Briefcase,
  MessageSquare,
  Calendar,
  Video,
  BookOpen,
  Mic,
  Sparkles,
  Target,
  School,
  Globe,
  Award,
  Clock,
  MapPin,
  Star,
  Home,
  Church,
  Palette,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';
import React from 'react';
import { BaseModal } from './Base';
import type {
  DepartmentType,
  JoinFormData,
  JoinUsModalProps,
} from '@/lib/types';

// Department configuration
const DEPARTMENT_CONFIG: Record<
  DepartmentType,
  {
    title: string;
    description: string;
    icon: JSX.Element;
    roles: Array<{
      id: string;
      label: string;
      description: string;
      icon?: JSX.Element;
    }>;
    skills?: string[];
    commitment?: string;
  }
> = {
  Ushers: {
    title: 'Ushers Department',
    description: 'Welcome and guide attendees with warmth and excellence',
    icon: <DoorOpen className="w-5 h-5" />,
    roles: [
      {
        id: 'greeter',
        label: 'Greeter',
        description: 'Welcome people at the entrance',
        icon: <UserCheck className="w-4 h-4" />,
      },
      {
        id: 'seating',
        label: 'Seating Assistant',
        description: 'Help people find seats',
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: 'information',
        label: 'Information Desk',
        description: 'Answer questions and provide guidance',
        icon: <Bell className="w-4 h-4" />,
      },
      {
        id: 'special_assistance',
        label: 'Special Assistance',
        description: 'Help elderly and disabled attendees',
        icon: <Heart className="w-4 h-4" />,
      },
    ],
    skills: ['Communication', 'Patience', 'Organization', 'Hospitality'],
    commitment: '2-4 hours per week',
  },
  'Media Team': {
    title: 'Media Department',
    description:
      'Capture and broadcast the move of God through visuals and sound',
    icon: <Video className="w-5 h-5" />,
    roles: [
      {
        id: 'camera',
        label: 'Camera Operator',
        description: 'Operate video cameras during services',
        icon: <Video className="w-4 h-4" />,
      },
      {
        id: 'sound',
        label: 'Sound Engineer',
        description: 'Manage audio equipment and mixing',
        icon: <Mic className="w-4 h-4" />,
      },
      {
        id: 'lighting',
        label: 'Lighting Technician',
        description: 'Control stage and venue lighting',
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        id: 'livestream',
        label: 'Livestream Operator',
        description: 'Manage online broadcasting',
        icon: <Globe className="w-4 h-4" />,
      },
    ],
    skills: [
      'Technical Skills',
      'Attention to Detail',
      'Creativity',
      'Teamwork',
    ],
    commitment: '3-5 hours per week',
  },
  Choir: {
    title: 'Choir & Worship Team',
    description: 'Lead powerful worship and create heavenly atmospheres',
    icon: <Music className="w-5 h-5" />,
    roles: [
      {
        id: 'singer',
        label: 'Vocalist',
        description: 'Sing in the choir or worship team',
        icon: <Mic className="w-4 h-4" />,
      },
      {
        id: 'instrumentalist',
        label: 'Instrumentalist',
        description: 'Play musical instruments',
        icon: <Music className="w-4 h-4" />,
      },
      {
        id: 'worship_leader',
        label: 'Worship Leader',
        description: 'Lead worship sessions',
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        id: 'choir_director',
        label: 'Choir Director',
        description: 'Direct and train choir members',
        icon: <Award className="w-4 h-4" />,
      },
    ],
    skills: ['Musical Talent', 'Worship Heart', 'Team Player', 'Commitment'],
    commitment: '4-6 hours per week',
  },
  'Children Ministry': {
    title: 'Children Ministry',
    description: 'Nurture young hearts and teach them the ways of God',
    icon: <School className="w-5 h-5" />,
    roles: [
      {
        id: 'teacher',
        label: 'Sunday School Teacher',
        description: 'Teach Bible lessons to children',
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        id: 'assistant',
        label: "Teacher's Assistant",
        description: 'Assist with classroom activities',
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: 'activity_leader',
        label: 'Activity Leader',
        description: 'Lead games and crafts',
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        id: 'safety',
        label: 'Safety Monitor',
        description: 'Ensure child safety and security',
        icon: <Shield className="w-4 h-4" />,
      },
    ],
    skills: ['Patience', 'Creativity', 'Love for Children', 'Teaching Ability'],
    commitment: '2-3 hours per week',
  },
  'Youth Ministry': {
    title: 'Youth Ministry',
    description: 'Empower the next generation to walk in purpose and power',
    icon: <Sparkles className="w-5 h-5" />,
    roles: [
      {
        id: 'mentor',
        label: 'Youth Mentor',
        description: 'Mentor and guide young people',
        icon: <UserCheck className="w-4 h-4" />,
      },
      {
        id: 'activity_coordinator',
        label: 'Activity Coordinator',
        description: 'Plan youth events and activities',
        icon: <Calendar className="w-4 h-4" />,
      },
      {
        id: 'small_group_leader',
        label: 'Small Group Leader',
        description: 'Lead Bible study groups',
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: 'outreach',
        label: 'Outreach Coordinator',
        description: 'Plan community outreach events',
        icon: <Globe className="w-4 h-4" />,
      },
    ],
    skills: [
      'Relatability',
      'Leadership',
      'Communication',
      'Passion for Youth',
    ],
    commitment: '3-5 hours per week',
  },
  'Technical Team': {
    title: 'Technical Team',
    description: 'Ensure seamless operations behind the scenes with excellence',
    icon: <Target className="w-5 h-5" />,
    roles: [
      {
        id: 'projection',
        label: 'Projection Operator',
        description: 'Manage slides and media presentation',
        icon: <Video className="w-4 h-4" />,
      },
      {
        id: 'it_support',
        label: 'IT Support',
        description: 'Maintain computers and network systems',
        icon: <Target className="w-4 h-4" />,
      },
      {
        id: 'equipment',
        label: 'Equipment Manager',
        description: 'Maintain and setup technical equipment',
        icon: <Briefcase className="w-4 h-4" />,
      },
      {
        id: 'broadcast',
        label: 'Broadcast Technician',
        description: 'Manage recording and broadcasting',
        icon: <Globe className="w-4 h-4" />,
      },
    ],
    skills: [
      'Technical Skills',
      'Problem Solving',
      'Attention to Detail',
      'Reliability',
    ],
    commitment: '3-5 hours per week',
  },
};

// Modern Modal Component
const ModernModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="max-w-2xl"
    >
      {children}
    </BaseModal>
  );
};

// Experience levels
const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'No prior experience' },
  {
    id: 'some',
    label: 'Some Experience',
    description: '1-2 years in church ministry',
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

// Availability options
const AVAILABILITY = [
  {
    id: 'sunday',
    label: 'Sunday Services',
    icon: <Church className="w-4 h-4" />,
  },
  {
    id: 'midweek',
    label: 'Midweek Services',
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: 'special',
    label: 'Special Events',
    icon: <Star className="w-4 h-4" />,
  },
  {
    id: 'flexible',
    label: 'Flexible Schedule',
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: 'full_time',
    label: 'Full-time Ministry',
    icon: <Heart className="w-4 h-4" />,
  },
];

// Define validation schema
const DEPARTMENT_VALUES = [
  'Ushers',
  'Media Team',
  'Choir',
  'Children Ministry',
  'Youth Ministry',
  'Technical Team',
] as const;

const joinFormSchema = z.object({
  // Personal Info
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),

  // Department Info
  department: z.enum(DEPARTMENT_VALUES),
  role: z.string().min(1, 'Please select a role'),

  // Experience & Availability
  experience: z.string().min(1, 'Please select your experience level'),
  availability: z
    .array(z.string())
    .min(1, 'Select at least one availability option'),

  // Additional Info
  occupation: z
    .string()
    .min(2, 'Occupation is required')
    .max(100, 'Occupation too long'),
  whyJoin: z
    .string()
    .min(20, 'Please share why you want to join (minimum 20 characters)')
    .max(500, 'Response too long (max 500 characters)'),
  spiritualGifts: z.string().optional(),
  previousMinistry: z.string().optional(),

  // Agreement
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  agreeToTraining: z.boolean().refine(val => val === true, {
    message: 'You must agree to attend required training',
  }),
});

export const JoinUsModal = ({
  department,
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
}: JoinUsModalProps) => {
  const { colorScheme } = useTheme();
  const { open } = useServiceUnavailable();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'personal' | 'department' | 'availability'>(
    'personal'
  );
  const [selectedRole, setSelectedRole] = useState<string>('');

  const departmentConfig = DEPARTMENT_CONFIG[department];
  const [mounted, setMounted] = useState(false);

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
    defaultValues: {
      ...defaultValues,
      department,
      availability: [],
    },
  });

  // Watched values
  const formData = watch();
  const selectedAvailability = formData.availability || [];

  // Toggle availability option
  const toggleAvailability = (id: string) => {
    const current = selectedAvailability;
    const newAvailability = current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id];
    setValue('availability', newAvailability);
  };

  // Handle form submission
  const handleFormSubmit = async (data: JoinFormData) => {
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
      setSelectedRole('');
      setStep('personal');
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next step with validation
  const handleNextStep = async () => {
    let isValid = false;

    switch (step) {
      case 'personal':
        isValid = await trigger(['firstName', 'lastName', 'email', 'phone']);
        break;
      case 'department':
        isValid = await trigger(['role', 'experience']);
        break;
      case 'availability':
        isValid = await trigger([
          'availability',
          'occupation',
          'whyJoin',
          'agreeToTerms',
          'agreeToTraining',
        ]);
        break;
    }

    if (isValid) {
      if (step === 'personal') {
        setStep('department');
      } else if (step === 'department') {
        setStep('availability');
      } else {
        await handleSubmit(handleFormSubmit)();
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 'department') {
      setStep('personal');
    } else if (step === 'availability') {
      setStep('department');
    }
  };

  // Progress steps
  const progressSteps = [
    { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
    { id: 'department', label: 'Role', icon: departmentConfig.icon },
    {
      id: 'availability',
      label: 'Details',
      icon: <Calendar className="w-4 h-4" />,
    },
  ];

  if (!mounted) return null;

  return (
    <ModernModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Join ${departmentConfig.title}`}
      subtitle={departmentConfig.description}
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {progressSteps.map((progressStep, index) => (
              <div key={progressStep.id} className="flex items-center">
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      step === progressStep.id
                        ? 'bg-amber-500 text-white border-2 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {step === progressStep.id ? progressStep.icon : index + 1}
                  </div>
                </div>
                {index < progressSteps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 rounded-full ${
                      step === progressStep.id ||
                      (index === 0 && step === 'department') ||
                      (index === 0 && step === 'availability') ||
                      (index === 1 && step === 'availability')
                        ? 'bg-amber-500'
                        : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Step 1: Personal Information */}
          {step === 'personal' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">
                  Personal Information
                </h3>
                <p className="text-slate-400 text-sm">
                  Tell us about yourself. All fields are required.
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-slate-400 text-sm font-medium mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...register('firstName')}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-slate-400 text-sm font-medium mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName')}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-slate-400 text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 pl-11 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                      placeholder="john@example.com"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-slate-400 text-sm font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 pl-11 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                      placeholder="+234 801 234 5678"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Department & Role Selection */}
          {step === 'department' && (
            <div className="space-y-6">
              {/* Department Header */}
              <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                    {React.cloneElement(departmentConfig.icon, {
                      className: 'w-6 h-6 text-amber-400',
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {departmentConfig.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {departmentConfig.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <h4 className="text-white font-medium mb-4">
                  Select Your Role
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {departmentConfig.roles.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setValue('role', role.id);
                      }}
                      className={`p-4 rounded-xl text-left transition-all border ${
                        selectedRole === role.id
                          ? 'border-amber-500 bg-gradient-to-r from-amber-500/10 to-orange-500/5'
                          : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                          {role.icon || departmentConfig.icon}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-semibold text-sm ${
                              selectedRole === role.id
                                ? 'text-amber-400'
                                : 'text-white'
                            }`}
                          >
                            {role.label}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {role.description}
                          </div>
                        </div>
                        {selectedRole === role.id && (
                          <div className="bg-amber-500 text-white p-1 rounded-full">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="mt-3 text-sm text-red-400">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Experience Level */}
              <div>
                <h4 className="text-white font-medium mb-4">
                  Ministry Experience Level
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EXPERIENCE_LEVELS.map(level => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setValue('experience', level.id)}
                      className={`p-4 rounded-xl text-center transition-all border ${
                        formData.experience === level.id
                          ? 'border-amber-500 bg-gradient-to-r from-amber-500/10 to-orange-500/5'
                          : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-sm text-white mb-1">
                        {level.label}
                      </div>
                      <div className="text-xs text-slate-400">
                        {level.description}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.experience && (
                  <p className="mt-3 text-sm text-red-400">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              {/* Department Requirements */}
              <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-2">
                      Department Requirements
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">
                          Required Skills:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {departmentConfig.skills?.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-amber-500/20 text-amber-300 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          Time Commitment: {departmentConfig.commitment}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Availability & Additional Info */}
          {step === 'availability' && (
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">
                  Availability & Details
                </h3>
                <p className="text-slate-400 text-sm">
                  Tell us when you can serve and share more about yourself.
                </p>
              </div>

              {/* Availability Selection */}
              <div>
                <h4 className="text-slate-400 text-sm font-medium mb-3">
                  When can you serve? (Select all that apply)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {AVAILABILITY.map(option => {
                    const isSelected = selectedAvailability.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleAvailability(option.id)}
                        className={`p-4 rounded-xl text-center transition-all border ${
                          isSelected
                            ? 'border-amber-500 bg-gradient-to-r from-amber-500/10 to-orange-500/5'
                            : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected
                                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {option.icon}
                          </div>
                          <div className="font-medium text-sm text-white">
                            {option.label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.availability && (
                  <p className="mt-3 text-sm text-red-400">
                    {errors.availability.message}
                  </p>
                )}
              </div>

              {/* Occupation & Spiritual Gifts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-slate-400 text-sm font-medium mb-2"
                  >
                    Occupation / Profession
                  </label>
                  <input
                    id="occupation"
                    type="text"
                    {...register('occupation')}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                    placeholder="e.g., Software Engineer, Teacher, Student"
                  />
                  {errors.occupation && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.occupation.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="spiritualGifts"
                    className="block text-slate-400 text-sm font-medium mb-2"
                  >
                    Spiritual Gifts (Optional)
                  </label>
                  <input
                    id="spiritualGifts"
                    type="text"
                    {...register('spiritualGifts')}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                    placeholder="e.g., Teaching, Mercy, Leadership"
                  />
                </div>
              </div>

              {/* Why Join */}
              <div>
                <label
                  htmlFor="whyJoin"
                  className="block text-slate-400 text-sm font-medium mb-2"
                >
                  Why do you want to join this ministry?
                </label>
                <textarea
                  id="whyJoin"
                  {...register('whyJoin')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition resize-none"
                  placeholder="Share your calling, passion, and what you hope to contribute to this ministry..."
                />
                <div className="flex justify-between mt-2">
                  {errors.whyJoin ? (
                    <p className="text-sm text-red-400">
                      {errors.whyJoin.message}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Minimum 20 characters
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    {formData.whyJoin?.length || 0}/500
                  </p>
                </div>
              </div>

              {/* Previous Ministry */}
              <div>
                <label
                  htmlFor="previousMinistry"
                  className="block text-slate-400 text-sm font-medium mb-2"
                >
                  Previous Ministry Experience (Optional)
                </label>
                <textarea
                  id="previousMinistry"
                  {...register('previousMinistry')}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition resize-none"
                  placeholder="Share any previous church ministry experience..."
                />
              </div>

              {/* Agreement Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-700 bg-slate-900/30">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    {...register('agreeToTerms')}
                    className="w-4 h-4 mt-1 text-amber-500 focus:ring-amber-500 border-slate-600 rounded bg-slate-800"
                  />
                  <div>
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm font-medium text-white"
                    >
                      I agree to the terms and conditions *
                    </label>
                    <p className="text-xs text-slate-400 mt-1">
                      By checking this box, I commit to serving faithfully,
                      upholding church values, and being accountable to ministry
                      leadership.
                    </p>
                    {errors.agreeToTerms && (
                      <p className="mt-2 text-xs text-red-400">
                        {errors.agreeToTerms.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-700 bg-slate-900/30">
                  <input
                    type="checkbox"
                    id="agreeToTraining"
                    {...register('agreeToTraining')}
                    className="w-4 h-4 mt-1 text-amber-500 focus:ring-amber-500 border-slate-600 rounded bg-slate-800"
                  />
                  <div>
                    <label
                      htmlFor="agreeToTraining"
                      className="text-sm font-medium text-white"
                    >
                      I agree to attend required training *
                    </label>
                    <p className="text-xs text-slate-400 mt-1">
                      I understand that ministry training is mandatory and
                      commit to attending all scheduled training sessions.
                    </p>
                    {errors.agreeToTraining && (
                      <p className="mt-2 text-xs text-red-400">
                        {errors.agreeToTraining.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Steps Info */}
              <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-2">
                      What happens after you apply?
                    </h4>
                    <ul className="space-y-1.5 text-sm text-slate-400">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>Application review within 3-5 business days</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>Email notification with next steps</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>Orientation & training session scheduling</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={step === 'personal' || isSubmitting}
              className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 text-sm font-medium"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold shadow-lg transition-all hover:shadow-amber-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : step === 'availability' ? (
                <>
                  Submit Application
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ModernModal>
  );
};
