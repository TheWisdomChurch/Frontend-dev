// components/modals/FormModal.tsx
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTheme } from '@/components/contexts/ThemeContext';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: colorScheme.backdrop }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: colorScheme.background,
          border: `1px solid ${colorScheme.border}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 rounded-t-2xl p-6 z-10"
          style={{
            backgroundColor: colorScheme.background,
            borderBottom: `1px solid ${colorScheme.border}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-2xl font-bold"
                style={{ color: colorScheme.text }}
              >
                {showAgreement ? 'Membership Agreement' : `Join ${department}`}
              </h3>
              <p className="mt-1" style={{ color: colorScheme.textSecondary }}>
                {showAgreement
                  ? 'Important information about our membership process'
                  : 'Fill out the form below to express your interest'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full transition-colors"
              style={{
                color: colorScheme.textSecondary,
                backgroundColor: colorScheme.opacity.white10,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.white20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.white10;
              }}
            >
              <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!showAgreement ? (
          /* Main Form */
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colorScheme.text }}
                >
                  Full Name *
                </label>
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
                      : colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
                  }}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p
                    className="mt-1 text-sm flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colorScheme.text }}
                >
                  Email Address *
                </label>
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
                      : colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
                  }}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p
                    className="mt-1 text-sm flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colorScheme.text }}
                >
                  Phone Number *
                </label>
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
                      : colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
                  }}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p
                    className="mt-1 text-sm flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="occupation"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colorScheme.text }}
                >
                  Current Occupation *
                </label>
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
                      : colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
                  }}
                  placeholder="e.g., Student, Engineer, Teacher, etc."
                />
                {errors.occupation && (
                  <p
                    className="mt-1 text-sm flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.occupation.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2"
                style={{ color: colorScheme.text }}
              >
                Why do you want to join {department}? *
              </label>
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
                    : colorScheme.border,
                  backgroundColor: colorScheme.background,
                  color: colorScheme.text,
                }}
                placeholder="Tell us about your interest, skills, and what you hope to contribute to our ministry..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.message ? (
                  <p
                    className="text-sm flex items-center gap-1"
                    style={{ color: colorScheme.error }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.message.message}
                  </p>
                ) : (
                  <div></div>
                )}
                <span
                  className={`text-xs ${
                    watch('message')?.length > 450 ? 'text-orange-600' : ''
                  }`}
                  style={{
                    color:
                      watch('message')?.length > 450
                        ? colorScheme.warning
                        : colorScheme.textSecondary,
                  }}
                >
                  {watch('message')?.length || 0}/500
                </span>
              </div>
            </div>

            {/* Agreement Notice */}
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                border: `1px solid ${colorScheme.opacity.primary20}`,
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
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: colorScheme.primary }}
                  >
                    By submitting this form, you agree to join our compulsory
                    1-month membership class
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: colorScheme.primary }}
                  >
                    This foundational training is required for all new members
                    to understand our vision and values
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.black,
                }}
                onMouseEnter={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor =
                      colorScheme.primaryLight;
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = colorScheme.primary;
                  }
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      style={{ color: colorScheme.black }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 border py-4 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colorScheme.border,
                  color: colorScheme.text,
                  backgroundColor: colorScheme.background,
                }}
                onMouseEnter={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor =
                      colorScheme.opacity.white10;
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor =
                      colorScheme.background;
                  }
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Agreement Information Section */
          <div className="p-6 space-y-6">
            {/* Main Agreement Content */}
            <div
              className="border rounded-2xl p-6"
              style={{
                backgroundColor: colorScheme.surface,
                borderColor: colorScheme.border,
              }}
            >
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: colorScheme.opacity.primary20,
                    color: colorScheme.primary,
                  }}
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h4
                  className="text-xl font-bold mb-2"
                  style={{ color: colorScheme.text }}
                >
                  Welcome to Wisdom House Ministry!
                </h4>
                <p style={{ color: colorScheme.textSecondary }}>
                  Thank you for your interest in joining our {department} team
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: colorScheme.background,
                    borderColor: colorScheme.border,
                  }}
                >
                  <h5
                    className="font-semibold mb-2 flex items-center gap-2"
                    style={{ color: colorScheme.text }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colorScheme.primary }}
                    ></span>
                    Compulsory 1-Month Membership Class
                  </h5>
                  <p
                    className="text-sm"
                    style={{ color: colorScheme.textSecondary }}
                  >
                    Every new member is required to complete our foundational
                    membership class. This ensures everyone understands our
                    vision, values, and ministry philosophy.
                  </p>
                </div>

                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: colorScheme.background,
                    borderColor: colorScheme.border,
                  }}
                >
                  <h5
                    className="font-semibold mb-2 flex items-center gap-2"
                    style={{ color: colorScheme.text }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colorScheme.success }}
                    ></span>
                    What You'll Learn
                  </h5>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: colorScheme.textSecondary }}
                  >
                    <li>• Our church history and vision</li>
                    <li>• Biblical foundations for ministry service</li>
                    <li>• Understanding your spiritual gifts</li>
                    <li>• Team dynamics and collaboration</li>
                    <li>• Practical ministry training</li>
                  </ul>
                </div>

                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: colorScheme.background,
                    borderColor: colorScheme.border,
                  }}
                >
                  <h5
                    className="font-semibold mb-2 flex items-center gap-2"
                    style={{ color: colorScheme.text }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colorScheme.secondary }}
                    ></span>
                    Class Schedule & Commitment
                  </h5>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: colorScheme.textSecondary }}
                  >
                    <li>
                      • Duration: This will be communicated upon completion of
                      form
                    </li>
                    <li>• Location: This will be announced during service </li>
                    <li>• Materials: Provided at no cost</li>
                    <li>• Certificate: Awarded upon completion</li>
                  </ul>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: colorScheme.opacity.warning10,
                    border: `1px solid ${colorScheme.opacity.warning20}`,
                  }}
                >
                  <h5
                    className="font-semibold mb-2 flex items-center gap-2"
                    style={{ color: colorScheme.warning }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Important Notice
                  </h5>
                  <p className="text-sm" style={{ color: colorScheme.warning }}>
                    Your application will be processed after successful
                    completion of the membership class. This ensures we place
                    everyone in roles where they can thrive and serve
                    effectively.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.black,
                }}
                onMouseEnter={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor =
                      colorScheme.primaryLight;
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = colorScheme.primary;
                  }
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      style={{ color: colorScheme.black }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Finalizing...
                  </span>
                ) : (
                  'I Understand & Agree to Continue'
                )}
              </button>
              <button
                onClick={handleContinueToForm}
                disabled={isSubmitting}
                className="flex-1 border py-4 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colorScheme.border,
                  color: colorScheme.text,
                  backgroundColor: colorScheme.background,
                }}
                onMouseEnter={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor =
                      colorScheme.opacity.white10;
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor =
                      colorScheme.background;
                  }
                }}
              >
                Back to Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
