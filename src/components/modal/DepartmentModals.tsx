'use client';

import { BaseModal } from './Base';
import { useForm } from 'react-hook-form';
import { useState, useMemo, JSX } from 'react';
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
  Palette
} from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';

// Department types based on your UI
export type DepartmentType = 
  | 'Ushers'
  | 'Media Team'
  | 'Choir'
  | 'Children Ministry'
  | 'Youth Ministry'
  | 'Technical Team';

// Department configuration - Updated with your color scheme
const DEPARTMENT_CONFIG: Record<DepartmentType, {
  title: string;
  description: string;
  icon: JSX.Element;
  roles: Array<{
    id: string;
    label: string;
    description: string;
    icon?: JSX.Element;
    gradient?: string;
  }>;
  skills?: string[];
  commitment?: string;
  gradient?: string;
}> = {
  'Ushers': {
    title: 'Ushers Department',
    description: 'Welcome and guide attendees with warmth and excellence',
    icon: <DoorOpen className="w-5 h-5" />,
    gradient: 'from-purple-500 to-pink-500',
    roles: [
      { 
        id: 'greeter', 
        label: 'Greeter', 
        description: 'Welcome people at the entrance', 
        icon: <UserCheck className="w-4 h-4" />,
        gradient: 'from-purple-400 to-pink-400'
      },
      { 
        id: 'seating', 
        label: 'Seating Assistant', 
        description: 'Help people find seats', 
        icon: <MapPin className="w-4 h-4" />,
        gradient: 'from-purple-400 to-pink-400'
      },
      { 
        id: 'information', 
        label: 'Information Desk', 
        description: 'Answer questions and provide guidance', 
        icon: <Bell className="w-4 h-4" />,
        gradient: 'from-purple-400 to-pink-400'
      },
      { 
        id: 'special_assistance', 
        label: 'Special Assistance', 
        description: 'Help elderly and disabled attendees', 
        icon: <Heart className="w-4 h-4" />,
        gradient: 'from-purple-400 to-pink-400'
      },
    ],
    skills: ['Communication', 'Patience', 'Organization', 'Hospitality'],
    commitment: '2-4 hours per week',
  },
  'Media Team': {
    title: 'Media Department',
    description: 'Capture and broadcast the move of God through visuals and sound',
    icon: <Video className="w-5 h-5" />,
    gradient: 'from-blue-500 to-cyan-500',
    roles: [
      { 
        id: 'camera', 
        label: 'Camera Operator', 
        description: 'Operate video cameras during services', 
        icon: <Video className="w-4 h-4" />,
        gradient: 'from-blue-400 to-cyan-400'
      },
      { 
        id: 'sound', 
        label: 'Sound Engineer', 
        description: 'Manage audio equipment and mixing', 
        icon: <Mic className="w-4 h-4" />,
        gradient: 'from-blue-400 to-cyan-400'
      },
      { 
        id: 'lighting', 
        label: 'Lighting Technician', 
        description: 'Control stage and venue lighting', 
        icon: <Sparkles className="w-4 h-4" />,
        gradient: 'from-blue-400 to-cyan-400'
      },
      { 
        id: 'livestream', 
        label: 'Livestream Operator', 
        description: 'Manage online broadcasting', 
        icon: <Globe className="w-4 h-4" />,
        gradient: 'from-blue-400 to-cyan-400'
      },
    ],
    skills: ['Technical Skills', 'Attention to Detail', 'Creativity', 'Teamwork'],
    commitment: '3-5 hours per week',
  },
  'Choir': {
    title: 'Choir & Worship Team',
    description: 'Lead powerful worship and create heavenly atmospheres',
    icon: <Music className="w-5 h-5" />,
    gradient: 'from-amber-500 to-orange-500',
    roles: [
      { 
        id: 'singer', 
        label: 'Vocalist', 
        description: 'Sing in the choir or worship team', 
        icon: <Mic className="w-4 h-4" />,
        gradient: 'from-amber-400 to-orange-400'
      },
      { 
        id: 'instrumentalist', 
        label: 'Instrumentalist', 
        description: 'Play musical instruments', 
        icon: <Music className="w-4 h-4" />,
        gradient: 'from-amber-400 to-orange-400'
      },
      { 
        id: 'worship_leader', 
        label: 'Worship Leader', 
        description: 'Lead worship sessions', 
        icon: <Sparkles className="w-4 h-4" />,
        gradient: 'from-amber-400 to-orange-400'
      },
      { 
        id: 'choir_director', 
        label: 'Choir Director', 
        description: 'Direct and train choir members', 
        icon: <Award className="w-4 h-4" />,
        gradient: 'from-amber-400 to-orange-400'
      },
    ],
    skills: ['Musical Talent', 'Worship Heart', 'Team Player', 'Commitment'],
    commitment: '4-6 hours per week (including rehearsals)',
  },
  'Children Ministry': {
    title: 'Children Ministry',
    description: 'Nurture young hearts and teach them the ways of God',
    icon: <School className="w-5 h-5" />,
    gradient: 'from-green-500 to-emerald-500',
    roles: [
      { 
        id: 'teacher', 
        label: 'Sunday School Teacher', 
        description: 'Teach Bible lessons to children', 
        icon: <BookOpen className="w-4 h-4" />,
        gradient: 'from-green-400 to-emerald-400'
      },
      { 
        id: 'assistant', 
        label: 'Teacher\'s Assistant', 
        description: 'Assist with classroom activities', 
        icon: <Users className="w-4 h-4" />,
        gradient: 'from-green-400 to-emerald-400'
      },
      { 
        id: 'activity_leader', 
        label: 'Activity Leader', 
        description: 'Lead games and crafts', 
        icon: <Sparkles className="w-4 h-4" />,
        gradient: 'from-green-400 to-emerald-400'
      },
      { 
        id: 'safety', 
        label: 'Safety Monitor', 
        description: 'Ensure child safety and security', 
        icon: <Shield className="w-4 h-4" />,
        gradient: 'from-green-400 to-emerald-400'
      },
    ],
    skills: ['Patience', 'Creativity', 'Love for Children', 'Teaching Ability'],
    commitment: '2-3 hours per week',
  },
  'Youth Ministry': {
    title: 'Youth Ministry',
    description: 'Empower the next generation to walk in purpose and power',
    icon: <Sparkles className="w-5 h-5" />,
    gradient: 'from-indigo-500 to-purple-500',
    roles: [
      { 
        id: 'mentor', 
        label: 'Youth Mentor', 
        description: 'Mentor and guide young people', 
        icon: <UserCheck className="w-4 h-4" />,
        gradient: 'from-indigo-400 to-purple-400'
      },
      { 
        id: 'activity_coordinator', 
        label: 'Activity Coordinator', 
        description: 'Plan youth events and activities', 
        icon: <Calendar className="w-4 h-4" />,
        gradient: 'from-indigo-400 to-purple-400'
      },
      { 
        id: 'small_group_leader', 
        label: 'Small Group Leader', 
        description: 'Lead Bible study groups', 
        icon: <Users className="w-4 h-4" />,
        gradient: 'from-indigo-400 to-purple-400'
      },
      { 
        id: 'outreach', 
        label: 'Outreach Coordinator', 
        description: 'Plan community outreach events', 
        icon: <Globe className="w-4 h-4" />,
        gradient: 'from-indigo-400 to-purple-400'
      },
    ],
    skills: ['Relatability', 'Leadership', 'Communication', 'Passion for Youth'],
    commitment: '3-5 hours per week',
  },
  'Technical Team': {
    title: 'Technical Team',
    description: 'Ensure seamless operations behind the scenes with excellence',
    icon: <Target className="w-5 h-5" />,
    gradient: 'from-slate-600 to-zinc-800',
    roles: [
      { 
        id: 'projection', 
        label: 'Projection Operator', 
        description: 'Manage slides and media presentation', 
        icon: <Video className="w-4 h-4" />,
        gradient: 'from-slate-500 to-zinc-700'
      },
      { 
        id: 'it_support', 
        label: 'IT Support', 
        description: 'Maintain computers and network systems', 
        icon: <Target className="w-4 h-4" />,
        gradient: 'from-slate-500 to-zinc-700'
      },
      { 
        id: 'equipment', 
        label: 'Equipment Manager', 
        description: 'Maintain and setup technical equipment', 
        icon: <Briefcase className="w-4 h-4" />,
        gradient: 'from-slate-500 to-zinc-700'
      },
      { 
        id: 'broadcast', 
        label: 'Broadcast Technician', 
        description: 'Manage recording and broadcasting', 
        icon: <Globe className="w-4 h-4" />,
        gradient: 'from-slate-500 to-zinc-700'
      },
    ],
    skills: ['Technical Skills', 'Problem Solving', 'Attention to Detail', 'Reliability'],
    commitment: '3-5 hours per week',
  },
};


// Experience levels
const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'No prior experience' },
  { id: 'some', label: 'Some Experience', description: '1-2 years in church ministry' },
  { id: 'experienced', label: 'Experienced', description: '3+ years in church ministry' },
  { id: 'leader', label: 'Leader', description: 'Leadership experience in ministry' },
];

// Availability options
const AVAILABILITY = [
  { id: 'sunday', label: 'Sunday Services', icon: <Church className="w-4 h-4" /> },
  { id: 'midweek', label: 'Midweek Services', icon: <Calendar className="w-4 h-4" /> },
  { id: 'special', label: 'Special Events', icon: <Star className="w-4 h-4" /> },
  { id: 'flexible', label: 'Flexible Schedule', icon: <Clock className="w-4 h-4" /> },
  { id: 'full_time', label: 'Full-time Ministry', icon: <Heart className="w-4 h-4" /> },
];

// Define validation schema with Zod - Simplified for Lagos
const joinFormSchema = z.object({
  // Personal Info
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long'),
  email: z.string()
    .email('Invalid email address')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  phone: z.string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
  
  // Location Info
  lga: z.string().min(1, 'Please select your LGA in Lagos'),
  serviceLocation: z.string().min(1, 'Please select preferred service location'),
  
  // Department Info
  department: z.string().min(1, 'Please select a department'),
  role: z.string().min(1, 'Please select a role'),
  
  // Experience & Availability
  experience: z.string().min(1, 'Please select your experience level'),
  availability: z.array(z.string()).min(1, 'Select at least one availability option'),
  
  // Additional Info
  occupation: z.string()
    .min(2, 'Occupation is required')
    .max(100, 'Occupation too long'),
  whyJoin: z.string()
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

type JoinFormData = z.infer<typeof joinFormSchema>;

interface JoinUsModalProps {
  department: DepartmentType;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JoinFormData) => Promise<void>;
  defaultValues?: Partial<JoinFormData>;
}

export const JoinUsModal = ({
  department,
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
}: JoinUsModalProps) => {
  const { colorScheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'personal' | 'department' | 'availability'>('personal');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const departmentConfig = DEPARTMENT_CONFIG[department];

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
      // Add department info to data
      const submissionData = {
        ...data,
        department_name: departmentConfig.title,
        department_description: departmentConfig.description,
        applied_at: new Date().toISOString(),
      };

      await onSubmit(submissionData);
      // Reset form on success
      reset();
      setSelectedRole('');
      setStep('personal');
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
        isValid = await trigger(['firstName', 'lastName', 'email', 'phone', 'lga', 'serviceLocation']);
        break;
      case 'department':
        isValid = await trigger(['role', 'experience']);
        break;
      case 'availability':
        isValid = await trigger(['availability', 'occupation', 'whyJoin', 'agreeToTerms', 'agreeToTraining']);
        break;
    }

    if (isValid) {
      if (step === 'personal') {
        setStep('department');
      } else if (step === 'department') {
        setStep('availability');
      } else {
        // Final step - submit
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

  // Format progress steps
  const progressSteps = [
    { 
      id: 'personal', 
      label: 'Personal', 
      icon: <User className="w-4 h-4" />,
      color: 'text-blue-500'
    },
    { 
      id: 'department', 
      label: 'Role', 
      icon: departmentConfig.icon,
      color: 'text-yellow-500'
    },
    { 
      id: 'availability', 
      label: 'Details', 
      icon: <Calendar className="w-4 h-4" />,
      color: 'text-green-500'
    },
    { 
      id: 'review', 
      label: 'Submit', 
      icon: <Check className="w-4 h-4" />,
      color: 'text-purple-500'
    },
  ];

  // Memoized role buttons with gradient backgrounds
  const roleButtons = useMemo(() => 
    departmentConfig.roles.map((role) => (
      <button
        key={role.id}
        type="button"
        onClick={() => {
          setSelectedRole(role.id);
          setValue('role', role.id);
        }}
        className={`p-4 rounded-xl text-left transition-all border-2 ${
          selectedRole === role.id
            ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-900 shadow-lg'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-yellow-400 hover:shadow-md'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${role.gradient || departmentConfig.gradient} shadow-sm`}>
            {role.icon || departmentConfig.icon}
          </div>
          <div className="flex-1">
            <div className={`font-semibold text-sm ${
              selectedRole === role.id 
                ? 'text-gray-900 dark:text-yellow-100' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {role.label}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
              {role.description}
            </div>
          </div>
          {selectedRole === role.id && (
            <div className="bg-yellow-500 text-white p-1 rounded-full">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </button>
    )), [departmentConfig, selectedRole, setValue]
  );

  // Input field styling using your color scheme
  const inputClassName = `
    w-full px-3 py-2.5 text-sm rounded-lg border 
    focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    border-gray-300 dark:border-gray-600
    focus:border-yellow-500 dark:focus:border-yellow-500
    focus:ring-yellow-500/20 dark:focus:ring-yellow-500/30
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const labelClassName = `
    block text-xs font-medium mb-1.5 
    text-gray-700 dark:text-gray-300
    tracking-wide uppercase
  `;

  const errorClassName = `
    mt-1.5 text-xs text-red-500 dark:text-red-400
    flex items-center gap-1
  `;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Join ${departmentConfig.title}`}
      subtitle={departmentConfig.description}
      maxWidth="max-w-4xl"
      preventClose={isSubmitting}
      isLoading={isSubmitting}
      loadingText="Submitting your application..."
    >
      {/* Progress Steps - Modern Design */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {progressSteps.map((progressStep, index) => (
            <div key={progressStep.id} className="flex items-center">
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    step === progressStep.id || 
                    (step === 'department' && index === 1) ||
                    (step === 'availability' && index === 2)
                    ? `${progressStep.color} bg-yellow-500/10 border-2 border-yellow-500/30`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {step === progressStep.id || 
                   (step === 'department' && index === 1) ||
                   (step === 'availability' && index === 2) ? (
                    progressStep.icon
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className={`text-xs font-medium hidden sm:block ${
                    step === progressStep.id || 
                    (step === 'department' && index === 1) ||
                    (step === 'availability' && index === 2)
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {progressStep.label}
                  </span>
                </div>
              </div>
              {index < progressSteps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 rounded-full ${
                  step === progressStep.id || 
                  (index === 0 && step === 'department') ||
                  (index === 0 && step === 'availability') ||
                  (index === 1 && step === 'availability')
                    ? 'bg-yellow-500' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Progress Bar - Modern */}
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-500"
            style={{ 
              width: step === 'personal' ? '25%' : 
                     step === 'department' ? '50%' : 
                     step === 'availability' ? '75%' : '100%' 
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Step 1: Personal Information */}
        {step === 'personal' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tell us about yourself. All fields are required.
              </p>
            </div>
            
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="firstName" className={labelClassName}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className={inputClassName}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className={errorClassName}>
                    <span>⚠</span> {errors.firstName.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className={labelClassName}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className={inputClassName}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className={errorClassName}>
                    <span>⚠</span> {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="email" className={labelClassName}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`${inputClassName} pl-10`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className={errorClassName}>
                    <span>⚠</span> {errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className={labelClassName}>
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className={`${inputClassName} pl-10`}
                    placeholder="08012345678 or +2348012345678"
                  />
                </div>
                {errors.phone && (
                  <p className={errorClassName}>
                    <span>⚠</span> {errors.phone.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Nigerian format: 080, 081, 090, 091, 070, 081
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Department & Role Selection */}
        {step === 'department' && (
          <div className="space-y-8">
            {/* Department Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${departmentConfig.gradient} shadow-lg`}>
                  {departmentConfig.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {departmentConfig.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {departmentConfig.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Select Your Role
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedRole ? '✓ Selected' : 'Choose one'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roleButtons}
              </div>
              {errors.role && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    ⚠ {errors.role.message}
                  </p>
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Ministry Experience Level
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setValue('experience', level.id)}
                    className={`p-4 rounded-xl text-center transition-all border-2 ${
                      formData.experience === level.id
                        ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-900'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-yellow-400'
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {level.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
              {errors.experience && (
                <p className={errorClassName}>
                  <span>⚠</span> {errors.experience.message}
                </p>
              )}
            </div>

            {/* Department Requirements */}
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Target className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Department Requirements
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-700 dark:text-gray-300 font-medium mb-1">
                        Required Skills:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {departmentConfig.skills?.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Time Commitment: {departmentConfig.commitment}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Availability & Additional Info */}
        {step === 'availability' && (
          <div className="space-y-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Availability & Details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tell us when you can serve and share more about yourself.
              </p>
            </div>

            {/* Availability Selection */}
            <div>
              <h4 className={labelClassName}>
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
                      className={`p-4 rounded-xl text-center transition-all border-2 ${
                        isSelected
                          ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-400'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          isSelected 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {option.icon}
                        </div>
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {option.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.availability && (
                <p className={errorClassName}>
                  <span>⚠</span> {errors.availability.message}
                </p>
              )}
            </div>

            {/* Occupation & Spiritual Gifts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="occupation" className={labelClassName}>
                  Occupation / Profession
                </label>
                <input
                  id="occupation"
                  type="text"
                  {...register('occupation')}
                  className={inputClassName}
                  placeholder="e.g., Software Engineer, Teacher, Student"
                />
                {errors.occupation && (
                  <p className={errorClassName}>
                    <span>⚠</span> {errors.occupation.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="spiritualGifts" className={labelClassName}>
                  Spiritual Gifts (Optional)
                </label>
                <input
                  id="spiritualGifts"
                  type="text"
                  {...register('spiritualGifts')}
                  className={inputClassName}
                  placeholder="e.g., Teaching, Mercy, Leadership"
                />
              </div>
            </div>

            {/* Why Join */}
            <div>
              <label htmlFor="whyJoin" className={labelClassName}>
                Why do you want to join this ministry?
              </label>
              <textarea
                id="whyJoin"
                {...register('whyJoin')}
                rows={4}
                className={`${inputClassName} resize-none`}
                placeholder="Share your calling, passion, and what you hope to contribute to this ministry..."
              />
              <div className="flex justify-between mt-2">
                {errors.whyJoin ? (
                  <p className={errorClassName}>
                    <span>⚠</span> {errors.whyJoin.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minimum 20 characters
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.whyJoin?.length || 0}/500
                </p>
              </div>
            </div>

            {/* Previous Ministry */}
            <div>
              <label htmlFor="previousMinistry" className={labelClassName}>
                Previous Ministry Experience (Optional)
              </label>
              <textarea
                id="previousMinistry"
                {...register('previousMinistry')}
                rows={3}
                className={`${inputClassName} resize-none`}
                placeholder="Share any previous church ministry experience..."
              />
            </div>

            {/* Agreement Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  {...register('agreeToTerms')}
                  className="w-4 h-4 mt-1 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <div>
                  <label htmlFor="agreeToTerms" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    I agree to the terms and conditions *
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    By checking this box, I commit to serving faithfully, upholding church values, 
                    maintaining confidentiality, and being accountable to ministry leadership.
                  </p>
                  {errors.agreeToTerms && (
                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                      ⚠ {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  id="agreeToTraining"
                  {...register('agreeToTraining')}
                  className="w-4 h-4 mt-1 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <div>
                  <label htmlFor="agreeToTraining" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    I agree to attend required training *
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    I understand that ministry training is mandatory and commit to attending 
                    all scheduled training sessions for this department.
                  </p>
                  {errors.agreeToTraining && (
                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                      ⚠ {errors.agreeToTraining.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Next Steps Info */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    What happens after you apply?
                  </h4>
                  <ul className="space-y-1.5 text-sm text-blue-700 dark:text-blue-400">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" />
                      <span>Application review within 3-5 business days</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" />
                      <span>Email notification with next steps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" />
                      <span>Orientation & training session scheduling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ministry placement and service commencement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 'personal' || isSubmitting}
            className={`
              px-6 py-3 rounded-lg border text-sm font-medium transition-all
              flex items-center gap-2
              ${step === 'personal' || isSubmitting
                ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700 text-gray-400'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <button
            type="button"
            onClick={handleNextStep}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold shadow-lg transition-all hover:shadow-xl"
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

// Helper Info component
const Info = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);