'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2, Check, AlertCircle, Lock } from 'lucide-react';
import { H4, BodyMD, BodySM, MediumText, Caption } from '@/components/text';

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
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Theme-based styles - Always dark theme
  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white;
  const buttonBackground = colorScheme.primary;
  const buttonTextColor = colorScheme.black;
  const surfaceBackground = colorScheme.surface;
  const borderColor = colorScheme.primary;
  const inputBorderColor = colorScheme.border;

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

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setValue('department', department);
  }, [department, setValue]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();

      if (isMobile) {
        tl.fromTo(
          modalRef.current,
          { y: '100%', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  const handleClose = () => {
    if (modalRef.current) {
      if (isMobile) {
        gsap.to(modalRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            reset();
            onClose();
            setShowAgreement(false);
          },
        });
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            reset();
            onClose();
            setShowAgreement(false);
          },
        });
      }
    } else {
      reset();
      onClose();
      setShowAgreement(false);
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
      console.log('Form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Application submitted successfully!', {
        description: `Your application for ${department} has been received.`,
        duration: 4000,
      });

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

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-3 ${
        isMobile ? 'pb-0' : ''
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border shadow-xl
          ${
            isMobile
              ? 'rounded-t-2xl rounded-b-none max-h-[85vh]'
              : 'rounded-2xl max-w-md max-h-[85vh]'
          }
        `}
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        {/* Header */}
        <div
          className={`sticky top-0 z-10 ${isMobile ? 'p-3' : 'p-4'}`}
          style={{
            backgroundColor: modalBackground,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <H4
                fontFamily="bricolage"
                className={`mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}
                style={{ color: textColor }}
                useThemeColor={false}
                weight="bold"
              >
                {showAgreement ? 'Membership Agreement' : `Join ${department}`}
              </H4>
              <BodyMD
                className="text-xs"
                style={{ color: subtitleTextColor }}
                useThemeColor={false}
              >
                {showAgreement
                  ? 'Important information about our membership process'
                  : 'Fill out the form below to express your interest'}
              </BodyMD>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg transition-colors flex-shrink-0 p-1.5"
              style={{
                color: textColor,
                backgroundColor: colorScheme.opacity.primary10,
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div
          className={`overflow-y-auto ${isMobile ? 'p-3 max-h-[calc(85vh-80px)]' : 'p-4 max-h-[calc(85vh-90px)]'}`}
        >
          {!showAgreement ? (
            /* Main Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <MediumText
                    className="block mb-1 text-xs"
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
                    className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                    style={{
                      borderColor: errors.fullName
                        ? colorScheme.error
                        : inputBorderColor,
                      backgroundColor: surfaceBackground,
                      color: textColor,
                    }}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <BodySM
                      className="mt-1 flex items-center gap-1 text-xs"
                      style={{ color: colorScheme.error }}
                      useThemeColor={false}
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName.message}
                    </BodySM>
                  )}
                </div>

                <div>
                  <MediumText
                    className="block mb-1 text-xs"
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
                    className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                    style={{
                      borderColor: errors.email
                        ? colorScheme.error
                        : inputBorderColor,
                      backgroundColor: surfaceBackground,
                      color: textColor,
                    }}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <BodySM
                      className="mt-1 flex items-center gap-1 text-xs"
                      style={{ color: colorScheme.error }}
                      useThemeColor={false}
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.email.message}
                    </BodySM>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <MediumText
                    className="block mb-1 text-xs"
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
                    className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                    style={{
                      borderColor: errors.phone
                        ? colorScheme.error
                        : inputBorderColor,
                      backgroundColor: surfaceBackground,
                      color: textColor,
                    }}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <BodySM
                      className="mt-1 flex items-center gap-1 text-xs"
                      style={{ color: colorScheme.error }}
                      useThemeColor={false}
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone.message}
                    </BodySM>
                  )}
                </div>

                <div>
                  <MediumText
                    className="block mb-1 text-xs"
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
                        message:
                          'Occupation must be at least 2 characters long',
                      },
                    })}
                    className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                    style={{
                      borderColor: errors.occupation
                        ? colorScheme.error
                        : inputBorderColor,
                      backgroundColor: surfaceBackground,
                      color: textColor,
                    }}
                    placeholder="e.g., Student, Engineer, Teacher, etc."
                  />
                  {errors.occupation && (
                    <BodySM
                      className="mt-1 flex items-center gap-1 text-xs"
                      style={{ color: colorScheme.error }}
                      useThemeColor={false}
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.occupation.message}
                    </BodySM>
                  )}
                </div>
              </div>

              <div>
                <MediumText
                  className="block mb-1 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Why do you want to join {department}? *
                </MediumText>
                <textarea
                  id="message"
                  rows={3}
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
                  className="w-full px-2 py-1.5 rounded-lg border focus:outline-none resize-vertical text-xs"
                  style={{
                    borderColor: errors.message
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Tell us about your interest, skills, and what you hope to contribute to our ministry..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message ? (
                    <BodySM
                      className="flex items-center gap-1 text-xs"
                      style={{ color: colorScheme.error }}
                      useThemeColor={false}
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.message.message}
                    </BodySM>
                  ) : (
                    <div></div>
                  )}
                  <Caption
                    className={`${
                      watch('message')?.length > 450 ? 'text-orange-600' : ''
                    }`}
                    style={{
                      color:
                        watch('message')?.length > 450
                          ? colorScheme.warning
                          : subtitleTextColor,
                    }}
                    useThemeColor={false}
                  >
                    {watch('message')?.length || 0}/500
                  </Caption>
                </div>
              </div>

              {/* Agreement Notice */}
              <div
                className="rounded-lg p-2 border"
                style={{
                  backgroundColor: colorScheme.opacity.primary10,
                  borderColor: colorScheme.opacity.primary20,
                }}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="flex-shrink-0 w-3 h-3 rounded-full flex items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: colorScheme.primary,
                      color: colorScheme.black,
                    }}
                  >
                    <Check className="w-2 h-2" />
                  </div>
                  <div>
                    <MediumText
                      className="text-xs"
                      style={{ color: colorScheme.primary }}
                      useThemeColor={false}
                    >
                      By submitting this form, you agree to join our compulsory
                      1-month membership class
                    </MediumText>
                    <Caption
                      className="mt-0.5"
                      style={{ color: colorScheme.primary }}
                      useThemeColor={false}
                    >
                      This foundational training is required for all new members
                      to understand our vision and values
                    </Caption>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 rounded-lg transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    isMobile ? 'py-2' : 'py-2.5'
                  }`}
                  style={{
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2
                        className="animate-spin h-3 w-3"
                        style={{ color: buttonTextColor }}
                      />
                      <MediumText
                        className="text-sm"
                        style={{ color: buttonTextColor }}
                        useThemeColor={false}
                      >
                        Processing...
                      </MediumText>
                    </span>
                  ) : (
                    <MediumText className="text-sm" useThemeColor={false}>
                      Submit Application
                    </MediumText>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className={`flex-1 border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isMobile ? 'py-2' : 'py-2.5'
                  }`}
                  style={{
                    borderColor: borderColor,
                    color: textColor,
                    backgroundColor: modalBackground,
                  }}
                >
                  <MediumText className="text-sm" useThemeColor={false}>
                    Cancel
                  </MediumText>
                </button>
              </div>
            </form>
          ) : (
            /* Agreement Information Section */
            <div className="space-y-3">
              {/* Main Agreement Content */}
              <div
                className="border rounded-xl p-3"
                style={{
                  backgroundColor: surfaceBackground,
                  borderColor: borderColor,
                }}
              >
                <div className="text-center mb-3">
                  <div
                    className={`rounded-full flex items-center justify-center mx-auto mb-2 ${
                      isMobile ? 'w-10 h-10' : 'w-12 h-12'
                    }`}
                    style={{
                      backgroundColor: colorScheme.opacity.primary10,
                      color: colorScheme.primary,
                    }}
                  >
                    <Lock className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                  </div>
                  <H4
                    fontFamily="bricolage"
                    className={`mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}
                    style={{ color: textColor }}
                    useThemeColor={false}
                    weight="bold"
                  >
                    Welcome to Wisdom House Ministry!
                  </H4>
                  <BodyMD
                    className="text-xs"
                    style={{ color: subtitleTextColor }}
                    useThemeColor={false}
                  >
                    Thank you for your interest in joining our {department} team
                  </BodyMD>
                </div>

                <div className="space-y-2">
                  <div
                    className="rounded-lg p-2 border"
                    style={{
                      backgroundColor: modalBackground,
                      borderColor: borderColor,
                    }}
                  >
                    <MediumText
                      className="mb-1 flex items-center gap-1 text-xs"
                      style={{ color: textColor }}
                      useThemeColor={false}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: colorScheme.primary }}
                      ></span>
                      Compulsory 1-Month Membership Class
                    </MediumText>
                    <Caption
                      style={{ color: subtitleTextColor }}
                      useThemeColor={false}
                    >
                      Every new member is required to complete our foundational
                      membership class. This ensures everyone understands our
                      vision, values, and ministry philosophy.
                    </Caption>
                  </div>

                  <div
                    className="rounded-lg p-2 border"
                    style={{
                      backgroundColor: modalBackground,
                      borderColor: borderColor,
                    }}
                  >
                    <MediumText
                      className="mb-1 flex items-center gap-1 text-xs"
                      style={{ color: textColor }}
                      useThemeColor={false}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: colorScheme.success }}
                      ></span>
                      What You'll Learn
                    </MediumText>
                    <ul className="space-y-0.5">
                      <Caption useThemeColor={false}>
                        • Our church history and vision
                      </Caption>
                      <Caption useThemeColor={false}>
                        • Biblical foundations for ministry service
                      </Caption>
                      <Caption useThemeColor={false}>
                        • Understanding your spiritual gifts
                      </Caption>
                      <Caption useThemeColor={false}>
                        • Team dynamics and collaboration
                      </Caption>
                      <Caption useThemeColor={false}>
                        • Practical ministry training
                      </Caption>
                    </ul>
                  </div>

                  <div
                    className="rounded-lg p-2 border"
                    style={{
                      backgroundColor: modalBackground,
                      borderColor: borderColor,
                    }}
                  >
                    <MediumText
                      className="mb-1 flex items-center gap-1 text-xs"
                      style={{ color: textColor }}
                      useThemeColor={false}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: colorScheme.secondary }}
                      ></span>
                      Class Schedule & Commitment
                    </MediumText>
                    <ul className="space-y-0.5">
                      <Caption useThemeColor={false}>
                        • Duration: This will be communicated upon completion of
                        form
                      </Caption>
                      <Caption useThemeColor={false}>
                        • Location: This will be announced during service
                      </Caption>
                      <Caption useThemeColor={false}>
                        • Materials: Provided at no cost
                      </Caption>
                      <Caption useThemeColor={false}>
                        • Certificate: Awarded upon completion
                      </Caption>
                    </ul>
                  </div>

                  <div
                    className="rounded-lg p-2 border"
                    style={{
                      backgroundColor: colorScheme.opacity.warning10,
                      borderColor: colorScheme.opacity.warning20,
                    }}
                  >
                    <MediumText
                      className="mb-1 flex items-center gap-1 text-xs"
                      style={{ color: colorScheme.warning }}
                      useThemeColor={false}
                    >
                      <AlertCircle className="w-3 h-3" />
                      Important Notice
                    </MediumText>
                    <Caption
                      style={{ color: colorScheme.warning }}
                      useThemeColor={false}
                    >
                      Your application will be processed after successful
                      completion of the membership class. This ensures we place
                      everyone in roles where they can thrive and serve
                      effectively.
                    </Caption>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 rounded-lg transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    isMobile ? 'py-2' : 'py-2.5'
                  }`}
                  style={{
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2
                        className="animate-spin h-3 w-3"
                        style={{ color: buttonTextColor }}
                      />
                      <MediumText
                        className="text-sm"
                        style={{ color: buttonTextColor }}
                        useThemeColor={false}
                      >
                        Finalizing...
                      </MediumText>
                    </span>
                  ) : (
                    <MediumText className="text-sm" useThemeColor={false}>
                      I Understand & Agree to Continue
                    </MediumText>
                  )}
                </button>
                <button
                  onClick={handleContinueToForm}
                  disabled={isSubmitting}
                  className={`flex-1 border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isMobile ? 'py-2' : 'py-2.5'
                  }`}
                  style={{
                    borderColor: borderColor,
                    color: textColor,
                    backgroundColor: modalBackground,
                  }}
                >
                  <MediumText className="text-sm" useThemeColor={false}>
                    Back to Form
                  </MediumText>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
