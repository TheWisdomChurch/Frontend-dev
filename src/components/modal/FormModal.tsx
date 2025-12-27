'use client';

import { BaseModal } from './Base';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  Loader2, 
  Check, 
  Users, 
  Music, 
  Shield,
  UserCheck,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Building,
  DoorOpen,
  Bell,
  Mail,
  Phone,
  User,
  Briefcase,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface EventRegistrationModalProps {
  event: {
    id: string;
    title: string;
    description?: string;
    start_date: string;
    end_date?: string;
    time: string;
    location: string;
    event_type: 'conference' | 'service' | 'program' | 'special' | 'lifting' | 'training';
    image_url?: string;
    requires_volunteers?: boolean;
    volunteer_roles?: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationData) => Promise<void>;
  defaultValues?: Partial<RegistrationData>;
}

interface RegistrationData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  
  // Attendance
  attendance_type: 'attendee' | 'volunteer' | 'both';
  volunteer_role?: string;
  custom_role?: string;
  
  // Additional Info
  occupation: string;
  previous_experience?: string;
  special_needs?: string;
  expectations?: string;
  
  // Event Info
  event_id: string;
  registration_type: string;
}

// Volunteer role options
const VOLUNTEER_ROLES = [
  { id: 'service_prep', label: 'Service Preparatory Unit', icon: <Bell className="w-4 h-4" /> },
  { id: 'music', label: 'Music Department', icon: <Music className="w-4 h-4" /> },
  { id: 'sanctuary', label: 'Sanctuary Management', icon: <Building className="w-4 h-4" /> },
  { id: 'ushers', label: 'Ushers & Greeters', icon: <DoorOpen className="w-4 h-4" /> },
  { id: 'security', label: 'Security Team', icon: <Shield className="w-4 h-4" /> },
  { id: 'protocol', label: 'Protocol & Logistics', icon: <UserCheck className="w-4 h-4" /> },
  { id: 'media', label: 'Media & Tech', icon: <Users className="w-4 h-4" /> },
  { id: 'prayer', label: 'Prayer Team', icon: <Heart className="w-4 h-4" /> },
  { id: 'children', label: 'Children Ministry', icon: <Users className="w-4 h-4" /> },
  { id: 'hospitality', label: 'Hospitality', icon: <Users className="w-4 h-4" /> },
  { id: 'other', label: 'Other (Please specify)', icon: <Users className="w-4 h-4" /> },
];

// Country options (simplified)
const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Nigeria', 'Ghana',
  'South Africa', 'Kenya', 'Australia', 'Germany', 'France', 'Other'
];

export const EventRegistrationModal = ({
  event,
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
}: EventRegistrationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'personal' | 'volunteer' | 'additional'>('personal');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegistrationData>({
    defaultValues: {
      ...defaultValues,
      event_id: event.id,
      registration_type: event.event_type,
      attendance_type: 'attendee',
    },
  });

  // Watched values
  const attendanceType = watch('attendance_type');
  const volunteerRole = watch('volunteer_role');
  const customRole = watch('custom_role');

  // Format event dates
  const formatEventDate = () => {
    const start = new Date(event.start_date);
    const end = event.end_date ? new Date(event.end_date) : null;
    
    if (end) {
      return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
    }
    return format(start, 'MMMM dd, yyyy');
  };

  const handleFormSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      // Add event info to data
      const submissionData = {
        ...data,
        event_title: event.title,
        event_date: event.start_date,
        event_time: event.time,
        event_location: event.location,
      };

      await onSubmit(submissionData);
      toast.success('Registration successful!', {
        duration: 4000,
      });
      onClose();
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    let isValid = false;
    
    switch (step) {
      case 'personal':
        isValid = await trigger(['firstName', 'lastName', 'email', 'phone', 'country', 'city']);
        break;
      case 'volunteer':
        if (attendanceType !== 'attendee') {
          isValid = await trigger(['volunteer_role']);
        } else {
          isValid = true;
        }
        break;
      case 'additional':
        isValid = await trigger(['occupation']);
        break;
    }

    if (isValid) {
      if (step === 'personal') {
        if (attendanceType === 'attendee') {
          setStep('additional');
        } else {
          setStep('volunteer');
        }
      } else if (step === 'volunteer') {
        setStep('additional');
      } else {
        // Final step - submit
        handleSubmit(handleFormSubmit)();
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 'volunteer') {
      setStep('personal');
    } else if (step === 'additional') {
      if (attendanceType === 'attendee') {
        setStep('personal');
      } else {
        setStep('volunteer');
      }
    }
  };

  // Event type specific configurations
  const getEventConfig = () => {
    const configs = {
      conference: {
        title: 'Conference Registration',
        subtitle: 'Join our spiritual gathering',
        requiresVolunteers: true,
      },
      lifting: {
        title: '7 Nights of Lifting Registration',
        subtitle: 'Seven powerful nights of spiritual elevation',
        requiresVolunteers: true,
      },
      service: {
        title: 'Service Registration',
        subtitle: 'Join us for worship',
        requiresVolunteers: true,
      },
      program: {
        title: 'Program Registration',
        subtitle: 'Special church program',
        requiresVolunteers: true,
      },
      special: {
        title: 'Special Event Registration',
        subtitle: 'Join our special gathering',
        requiresVolunteers: true,
      },
      training: {
        title: 'Training Registration',
        subtitle: 'Ministry training session',
        requiresVolunteers: false,
      },
    };

    return configs[event.event_type] || configs.conference;
  };

  const eventConfig = getEventConfig();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      subtitle={`${formatEventDate()} • ${event.time} • ${event.location}`}
      maxWidth="max-w-2xl"
      preventClose={isSubmitting}
    >
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {['personal', 'volunteer', 'additional'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === stepName
                    ? 'bg-blue-500 text-white'
                    : step === 'volunteer' && attendanceType === 'attendee'
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {index + 1}
              </div>
              <div className="ml-2 text-sm font-medium capitalize">{stepName}</div>
              {index < 2 && (
                <div className="w-12 h-1 mx-2 bg-gray-200 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Step 1: Personal Information */}
        {step === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Country *</label>
                <select
                  {...register('country', { required: 'Country is required' })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
            </div>

            {/* Attendance Type Selection */}
            {eventConfig.requiresVolunteers && (
              <div>
                <h4 className="text-sm font-medium mb-2">How would you like to participate?</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue('attendance_type', 'attendee')}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      attendanceType === 'attendee'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-1" />
                    <div className="font-medium">Attendee</div>
                    <div className="text-xs text-gray-500">Just attending</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setValue('attendance_type', 'volunteer')}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      attendanceType === 'volunteer'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Heart className="w-5 h-5 mx-auto mb-1" />
                    <div className="font-medium">Volunteer</div>
                    <div className="text-xs text-gray-500">Serve at event</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setValue('attendance_type', 'both')}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      attendanceType === 'both'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 mx-auto mb-1" />
                    <div className="font-medium">Both</div>
                    <div className="text-xs text-gray-500">Attend & serve</div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Volunteer Role Selection */}
        {step === 'volunteer' && attendanceType !== 'attendee' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Volunteer Role Selection
            </h3>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Select a volunteer role *</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {VOLUNTEER_ROLES.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setValue('volunteer_role', role.id);
                      if (role.id !== 'other') {
                        setValue('custom_role', '');
                      }
                    }}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      volunteerRole === role.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-600">{role.icon}</span>
                      <span className="font-medium text-sm">{role.label}</span>
                    </div>
                    {role.id === 'other' && (
                      <input
                        type="text"
                        {...register('custom_role')}
                        onClick={(e) => e.stopPropagation()}
                        className={`mt-2 w-full px-2 py-1 text-sm border rounded ${
                          volunteerRole === 'other'
                            ? 'border-blue-300'
                            : 'border-gray-200'
                        }`}
                        placeholder="Specify your role"
                        onChange={(e) => {
                          setValue('custom_role', e.target.value);
                          if (e.target.value.trim() && volunteerRole !== 'other') {
                            setValue('volunteer_role', 'other');
                          }
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
              {errors.volunteer_role && (
                <p className="mt-1 text-sm text-red-600">{errors.volunteer_role.message}</p>
              )}
            </div>

            {/* Previous Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Previous Volunteer Experience (Optional)
              </label>
              <textarea
                {...register('previous_experience')}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Have you volunteered before? If yes, please share your experience..."
              />
            </div>
          </div>
        )}

        {/* Step 3: Additional Information */}
        {step === 'additional' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Additional Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Occupation *</label>
              <input
                type="text"
                {...register('occupation', { required: 'Occupation is required' })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Engineer, Teacher, Student, etc."
              />
              {errors.occupation && (
                <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>
              )}
            </div>

            {attendanceType !== 'attendee' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Why do you want to volunteer? *
                </label>
                <textarea
                  {...register('expectations', { required: 'Please tell us why you want to volunteer' })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your motivation and what you hope to contribute..."
                />
                {errors.expectations && (
                  <p className="mt-1 text-sm text-red-600">{errors.expectations.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Special Needs or Accommodations (Optional)
              </label>
              <textarea
                {...register('special_needs')}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special requirements we should know about?"
              />
            </div>

            {/* Summary Card */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Registration Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Event:</span>
                  <div className="font-medium">{event.title}</div>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <div className="font-medium">{formatEventDate()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <div className="font-medium">{event.time}</div>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <div className="font-medium">{event.location}</div>
                </div>
                <div>
                  <span className="text-gray-600">Role:</span>
                  <div className="font-medium capitalize">{attendanceType}</div>
                </div>
                {volunteerRole && volunteerRole !== 'attendee' && (
                  <div>
                    <span className="text-gray-600">Volunteer Role:</span>
                    <div className="font-medium">
                      {VOLUNTEER_ROLES.find(r => r.id === volunteerRole)?.label}
                      {customRole && ` (${customRole})`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 'personal' || isSubmitting}
            className={`px-4 py-2 rounded-lg border ${
              step === 'personal' || isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50'
            }`}
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={handleNextStep}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {step === 'additional' ? 'Complete Registration' : 'Continue'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};