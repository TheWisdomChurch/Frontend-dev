/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/FormModal.tsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2, Check, AlertCircle, Lock } from 'lucide-react';
import {
  BaseText,
  BodySM,
  BodyMD,
  SemiBoldText,
  LightText,
  MediumText,
} from '@/components/text';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  message: string;
  department: string;
}

export const FormModal = ({ isOpen, onClose, department }: FormModalProps) => {
  const { colorScheme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const modalBackground = isDarkMode ? colorScheme.white : '#000000f0';
  const textColor = isDarkMode ? colorScheme.black : colorScheme.white;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const borderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.primary + '40';
  const buttonBackground = isDarkMode ? colorScheme.black : colorScheme.primary;
  const buttonTextColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const inputBackground = isDarkMode ? colorScheme.white : colorScheme.surface;
  const inputBorderColor = isDarkMode
    ? colorScheme.borderLight
    : colorScheme.border;
  const surfaceBackground = isDarkMode
    ? colorScheme.surface
    : colorScheme.surfaceVariant;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      occupation: '',
      message: '',
      department: department,
    },
  });

  // Set department when component mounts or department changes
  useEffect(() => {
    setValue('department', department);
  }, [department, setValue]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();
      tl.fromTo(
        modalRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        }
      );
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 50,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          reset();
          onClose();
        },
      });
    } else {
      reset();
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Simulate form submission
      console.log('Form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      toast.success('Application submitted successfully!', {
        description: `Your application for ${department} has been received.`,
        duration: 4000,
      });

      // Show agreement information
      setShowAgreement(true);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Submission failed', {
        description:
          'There was an error submitting your application. Please try again.',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToForm = () => {
    setShowAgreement(false);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Final submission logic here
      const formData = watch();
      console.log('Final form submission:', formData);

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Welcome to Wisdom House Ministry!', {
        description:
          'Your application has been processed. We will contact you soon about the membership class.',
        duration: 5000,
      });

      handleClose();
    } catch (error) {
      console.error('Final submission error:', error);
      toast.error('Processing failed', {
        description:
          'There was an error processing your application. Please contact us directly.',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation patterns
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^[+]?[0-9\s\-()]{10,}$/;
  const namePattern = /^[a-zA-Z\s]{2,50}$/;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border shadow-2xl"
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 rounded-t-3xl p-6 z-10"
          style={{
            backgroundColor: modalBackground,
            borderBottom: `1px solid ${isDarkMode ? colorScheme.borderLight : colorScheme.border}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <BaseText
                weight="bold"
                className="text-2xl"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                {showAgreement ? 'Membership Agreement' : `Join ${department}`}
              </BaseText>
              <BodyMD
                className="mt-1"
                style={{ color: secondaryTextColor }}
                useThemeColor={false}
              >
                {showAgreement
                  ? 'Important information about our membership process'
                  : 'Fill out the form below to express your interest'}
              </BodyMD>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full transition-colors flex-shrink-0"
              style={{
                color: textColor,
                backgroundColor: isDarkMode
                  ? colorScheme.opacity.black10
                  : colorScheme.opacity.white10,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.opacity.black20
                  : colorScheme.opacity.white20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.opacity.black10
                  : colorScheme.opacity.white10;
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!showAgreement ? (
          /* Main Form */
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 lg:p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <MediumText
                  className="block mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Full Name *
                </MediumText>
                <input
                  type="text"
                  id="fullName"
                  {...register('fullName', {
                    required: 'Full name is required',
                    pattern: {
                      value: namePattern,
                      message:
                        'Please enter a valid name (letters and spaces only)',
                    },
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters long',
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: errors.fullName
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: inputBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <BodySM
                    className="mt-1 flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName.message}
                  </BodySM>
                )}
              </div>

              <div>
                <MediumText
                  className="block mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Email Address *
                </MediumText>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: emailPattern,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: errors.email
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: inputBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <BodySM
                    className="mt-1 flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </BodySM>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <MediumText
                  className="block mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Phone Number *
                </MediumText>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: phonePattern,
                      message: 'Please enter a valid phone number',
                    },
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 digits',
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: errors.phone
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: inputBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <BodySM
                    className="mt-1 flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone.message}
                  </BodySM>
                )}
              </div>

              <div>
                <MediumText
                  className="block mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Current Occupation *
                </MediumText>
                <input
                  type="text"
                  id="occupation"
                  {...register('occupation', {
                    required: 'Occupation is required',
                    minLength: {
                      value: 2,
                      message: 'Occupation must be at least 2 characters long',
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: errors.occupation
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: inputBackground,
                    color: textColor,
                  }}
                  placeholder="e.g., Student, Engineer, Teacher, etc."
                />
                {errors.occupation && (
                  <BodySM
                    className="mt-1 flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.occupation.message}
                  </BodySM>
                )}
              </div>
            </div>

            <div>
              <MediumText
                className="block mb-2"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Why do you want to join {department}? *
              </MediumText>
              <textarea
                id="message"
                rows={4}
                {...register('message', {
                  required:
                    'Please tell us why you want to join this department',
                  minLength: {
                    value: 20,
                    message:
                      'Please provide more details (at least 20 characters)',
                  },
                  maxLength: {
                    value: 500,
                    message: 'Message is too long (maximum 500 characters)',
                  },
                })}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 resize-vertical"
                style={{
                  borderColor: errors.message
                    ? colorScheme.error
                    : inputBorderColor,
                  backgroundColor: inputBackground,
                  color: textColor,
                }}
                placeholder="Tell us about your interest, skills, and what you hope to contribute to our ministry..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.message ? (
                  <BodySM
                    className="flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.message.message}
                  </BodySM>
                ) : (
                  <div></div>
                )}
                <LightText
                  className={`text-xs ${
                    watch('message')?.length > 450 ? 'text-orange-600' : ''
                  }`}
                  style={{
                    color:
                      watch('message')?.length > 450
                        ? colorScheme.warning
                        : secondaryTextColor,
                  }}
                  useThemeColor={false}
                >
                  {watch('message')?.length || 0}/500
                </LightText>
              </div>
            </div>

            {/* Agreement Notice */}
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: isDarkMode
                  ? colorScheme.opacity.primary10
                  : colorScheme.opacity.primary20,
                borderColor: isDarkMode
                  ? colorScheme.opacity.primary20
                  : colorScheme.opacity.primary30,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: colorScheme.black,
                  }}
                >
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <MediumText
                    style={{
                      color: isDarkMode
                        ? colorScheme.primary
                        : colorScheme.primaryLight,
                    }}
                    useThemeColor={false}
                  >
                    By submitting this form, you agree to join our compulsory
                    1-month membership class
                  </MediumText>
                  <BodySM
                    className="mt-1"
                    style={{
                      color: isDarkMode
                        ? colorScheme.primary
                        : colorScheme.primaryLight,
                    }}
                    useThemeColor={false}
                  >
                    This foundational training is required for all new members
                    to understand our vision and values
                  </BodySM>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:shadow-xl"
                style={{
                  backgroundColor: buttonBackground,
                  color: buttonTextColor,
                }}
                onMouseEnter={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? colorScheme.gray[800]
                      : colorScheme.primaryLight;
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = buttonBackground;
                  }
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2
                      className="animate-spin h-5 w-5"
                      style={{ color: buttonTextColor }}
                    />
                    <MediumText
                      style={{ color: buttonTextColor }}
                      useThemeColor={false}
                    >
                      Processing...
                    </MediumText>
                  </span>
                ) : (
                  <SemiBoldText
                    style={{ color: buttonTextColor }}
                    useThemeColor={false}
                  >
                    Submit Application
                  </SemiBoldText>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 border py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: isDarkMode
                    ? colorScheme.borderLight
                    : colorScheme.border,
                  color: textColor,
                  backgroundColor: modalBackground,
                }}
                onMouseEnter={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? colorScheme.opacity.black10
                      : colorScheme.opacity.white10;
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = modalBackground;
                  }
                }}
              >
                <MediumText style={{ color: textColor }} useThemeColor={false}>
                  Cancel
                </MediumText>
              </button>
            </div>
          </form>
        ) : (
          /* Agreement Information Section */
          <div className="p-6 lg:p-8 space-y-6">
            {/* Main Agreement Content */}
            <div
              className="border rounded-2xl p-6"
              style={{
                backgroundColor: surfaceBackground,
                borderColor: isDarkMode
                  ? colorScheme.borderLight
                  : colorScheme.border,
              }}
            >
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: isDarkMode
                      ? colorScheme.opacity.primary20
                      : colorScheme.opacity.primary30,
                    color: colorScheme.primary,
                  }}
                >
                  <Lock className="w-8 h-8" />
                </div>
                <BaseText
                  weight="bold"
                  className="text-xl mb-2"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Welcome to Wisdom House Ministry!
                </BaseText>
                <BodyMD
                  style={{ color: secondaryTextColor }}
                  useThemeColor={false}
                >
                  Thank you for your interest in joining our {department} team
                </BodyMD>
              </div>

              <div className="space-y-4">
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: modalBackground,
                    borderColor: isDarkMode
                      ? colorScheme.borderLight
                      : colorScheme.border,
                  }}
                >
                  <MediumText
                    className="mb-2 flex items-center gap-2"
                    style={{ color: textColor }}
                    useThemeColor={false}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colorScheme.primary }}
                    ></span>
                    Compulsory 1-Month Membership Class
                  </MediumText>
                  <BodySM
                    style={{ color: secondaryTextColor }}
                    useThemeColor={false}
                  >
                    Every new member is required to complete our foundational
                    membership class. This ensures everyone understands our
                    vision, values, and ministry philosophy.
                  </BodySM>
                </div>

                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: modalBackground,
                    borderColor: isDarkMode
                      ? colorScheme.borderLight
                      : colorScheme.border,
                  }}
                >
                  <MediumText
                    className="mb-2 flex items-center gap-2"
                    style={{ color: textColor }}
                    useThemeColor={false}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colorScheme.success }}
                    ></span>
                    What You'll Learn
                  </MediumText>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: secondaryTextColor }}
                  >
                    <BodySM useThemeColor={false}>
                      • Our church history and vision
                    </BodySM>
                    <BodySM useThemeColor={false}>
                      • Biblical foundations for ministry service
                    </BodySM>
                    <BodySM useThemeColor={false}>
                      • Understanding your spiritual gifts
                    </BodySM>
                    <BodySM useThemeColor={false}>
                      • Team dynamics and collaboration
                    </BodySM>
                    <BodySM useThemeColor={false}>
                      • Practical ministry training
                    </BodySM>
                  </ul>
                </div>

                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: modalBackground,
                    borderColor: isDarkMode
                      ? colorScheme.borderLight
                      : colorScheme.border,
                  }}
                >
                  <MediumText
                    className="mb-2 flex items-center gap-2"
                    style={{ color: textColor }}
                    useThemeColor={false}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colorScheme.secondary }}
                    ></span>
                    Class Schedule & Commitment
                  </MediumText>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: secondaryTextColor }}
                  >
                    <BodySM useThemeColor={false}>
                      • Duration: This will be communicated upon completion of
                      form
                    </BodySM>
                    <BodySM useThemeColor={false}>
                      • Location: This will be announced during service
                    </BodySM>
                    <BodySM useThemeColor={false}>
                      • Materials: Provided at no cost
                    </BodySM>
                    <BodySM useThemeColor={false}>
                      • Certificate: Awarded upon completion
                    </BodySM>
                  </ul>
                </div>

                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: isDarkMode
                      ? colorScheme.opacity.warning10
                      : colorScheme.opacity.warning20,
                    borderColor: isDarkMode
                      ? colorScheme.opacity.warning20
                      : colorScheme.opacity.warning10,
                  }}
                >
                  <MediumText
                    className="mb-2 flex items-center gap-2"
                    style={{ color: colorScheme.warning }}
                    useThemeColor={false}
                  >
                    <AlertCircle className="w-4 h-4" />
                    Important Notice
                  </MediumText>
                  <BodySM
                    style={{ color: colorScheme.warning }}
                    useThemeColor={false}
                  >
                    Your application will be processed after successful
                    completion of the membership class. This ensures we place
                    everyone in roles where they can thrive and serve
                    effectively.
                  </BodySM>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:shadow-xl"
                style={{
                  backgroundColor: buttonBackground,
                  color: buttonTextColor,
                }}
                onMouseEnter={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? colorScheme.gray[800]
                      : colorScheme.primaryLight;
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = buttonBackground;
                  }
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2
                      className="animate-spin h-5 w-5"
                      style={{ color: buttonTextColor }}
                    />
                    <MediumText
                      style={{ color: buttonTextColor }}
                      useThemeColor={false}
                    >
                      Finalizing...
                    </MediumText>
                  </span>
                ) : (
                  <SemiBoldText
                    style={{ color: buttonTextColor }}
                    useThemeColor={false}
                  >
                    I Understand & Agree to Continue
                  </SemiBoldText>
                )}
              </button>
              <button
                onClick={handleContinueToForm}
                disabled={isSubmitting}
                className="flex-1 border py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: isDarkMode
                    ? colorScheme.borderLight
                    : colorScheme.border,
                  color: textColor,
                  backgroundColor: modalBackground,
                }}
                onMouseEnter={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? colorScheme.opacity.black10
                      : colorScheme.opacity.white10;
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = modalBackground;
                  }
                }}
              >
                <MediumText style={{ color: textColor }} useThemeColor={false}>
                  Back to Form
                </MediumText>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
