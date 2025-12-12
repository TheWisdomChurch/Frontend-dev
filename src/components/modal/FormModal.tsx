'use client';

import { 
  useEffect, 
  useRef, 
  useState, 
  useCallback,
  useLayoutEffect,
  useMemo
} from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2, Check, AlertCircle, Lock } from 'lucide-react';
import { useWindowSize } from '@/components/utils/hooks/useWindowSize';
import { responsive } from '@/lib/responsivee';
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

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export const FormModal = ({ isOpen, onClose, department }: FormModalProps) => {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();

  const viewport: ViewportSize = useMemo(() => {
    if (!windowSize.width) return 'mobile';
    if (windowSize.width < 640) return 'mobile';
    if (windowSize.width < 1024) return 'tablet';
    return 'desktop';
  }, [windowSize.width]);

  const colors = useMemo(() => ({
    background: colorScheme.black,
    text: {
      primary: colorScheme.primary,
      secondary: colorScheme.white,
      muted: 'rgba(255, 255, 255, 0.7)'
    },
    button: {
      background: colorScheme.primary,
      text: colorScheme.black,
      hover: colorScheme.opacity || colorScheme.primary
    },
    border: {
      default: colorScheme.border,
      active: colorScheme.primary,
      input: colorScheme.border
    },
    overlay: 'rgba(0, 0, 0, 0.85)',
    backdrop: 'rgba(0, 0, 0, 0.7)'
  }), [colorScheme]);

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
  }, []);

  useEffect(() => {
    setValue('department', department);
  }, [department, setValue]);

  useLayoutEffect(() => {
    if (isOpen && mounted) {
      const scrollY = window.scrollY;
      const body = document.body;
      
      const originalStyles = {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        height: body.style.height,
        touchAction: body.style.touchAction
      };

      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.height = '100%';
      body.style.touchAction = 'none';

      document.documentElement.dataset.scrollY = scrollY.toString();

      return () => {
        Object.entries(originalStyles).forEach(([key, value]) => {
          body.style[key as any] = value;
        });

        const scrollYValue = parseInt(document.documentElement.dataset.scrollY || '0');
        window.scrollTo(0, scrollYValue);
        delete document.documentElement.dataset.scrollY;
      };
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen || !modalRef.current || !backdropRef.current) return;

    const modal = modalRef.current;
    const backdrop = backdropRef.current;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.4 }
    });

    if (viewport === 'mobile') {
      tl.fromTo(backdrop, 
        { opacity: 0 },
        { opacity: 1 }
      )
      .fromTo(modal,
        { y: '100%', opacity: 0 },
        { y: 0, opacity: 1 },
        '<'
      );
    } else {
      tl.fromTo(backdrop,
        { opacity: 0 },
        { opacity: 1 }
      )
      .fromTo(modal,
        { 
          scale: 0.9, 
          opacity: 0,
          y: 20 
        },
        { 
          scale: 1, 
          opacity: 1,
          y: 0 
        },
        '<'
      );
    }

    return () => {
      tl.kill();
    };
  }, [isOpen, viewport]);

  const handleClose = useCallback(() => {
    if (!modalRef.current || !backdropRef.current || isClosing) return;
    
    setIsClosing(true);
    const modal = modalRef.current;
    const backdrop = backdropRef.current;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.in', duration: 0.3 },
      onComplete: () => {
        setIsClosing(false);
        reset();
        onClose();
        setShowAgreement(false);
      }
    });

    if (viewport === 'mobile') {
      tl.to(modal, { y: '100%', opacity: 0 })
        .to(backdrop, { opacity: 0 }, '<');
    } else {
      tl.to(modal, { scale: 0.95, opacity: 0, y: 20 })
        .to(backdrop, { opacity: 0 }, '<');
    }
  }, [onClose, viewport, isClosing, reset]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const onSubmit = useCallback(async (data: FormData) => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Application submitted successfully!', {
        description: `Your application for ${department} has been received.`,
        duration: 4000,
      });
      setShowAgreement(true);
    } catch (error) {
      toast.error('Submission failed', {
        description:
          'There was an error submitting your application. Please try again.',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [department]);

  const handleContinueToForm = useCallback(() => {
    setShowAgreement(false);
  }, []);

  const handleFinalSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const formData = watch();
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Welcome to Wisdom House Ministry!', {
        description:
          'Your application has been processed. We will contact you soon about the membership class.',
        duration: 5000,
      });

      handleClose();
    } catch (error) {
      toast.error('Processing failed', {
        description:
          'There was an error processing your application. Please contact us directly.',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [watch, handleClose]);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^[+]?[0-9\s\-()]{10,}$/;
  const namePattern = /^[a-zA-Z\s]{2,50}$/;

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      style={{ 
        backgroundColor: colors.backdrop,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        ref={modalRef}
        className={`
          w-full overflow-hidden border shadow-2xl
          ${responsive.modal[viewport]}
          ${viewport === 'mobile' ? 'pb-0' : ''}
        `}
        style={{ 
          backgroundColor: colors.background, 
          borderColor: colors.border.default 
        }}
        onClick={e => e.stopPropagation()}
      >
        {viewport === 'mobile' && (
          <div 
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            aria-hidden="true"
          >
            <div 
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: colors.text.primary }}
            />
          </div>
        )}

        <div className="flex flex-col h-full">
          <div 
            className={`
              sticky top-0 z-10
              ${responsive.padding[viewport]}
              border-b
            `}
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border.default,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`mb-2 ${responsive.heading[viewport]} font-bold leading-tight`}
                  style={{ color: colors.text.primary }}
                >
                  {showAgreement ? 'Membership Agreement' : `Join ${department}`}
                </div>
                <BodyMD
                  className={`${responsive.body[viewport]} leading-relaxed`}
                  style={{ color: colors.text.muted }}
                  useThemeColor={false}
                >
                  {showAgreement
                    ? 'Important information about our membership process'
                    : 'Fill out the form below to express your interest'}
                </BodyMD>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-1.5 transition-all duration-200 hover:scale-110 active:scale-95 ml-2 flex-shrink-0"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.border.default,
                  borderWidth: '1px'
                }}
                aria-label="Close modal"
              >
                <X 
                  className="w-4 h-4"
                  style={{ color: colors.text.primary }}
                />
              </button>
            </div>
          </div>

          <div 
            className={`
              overflow-y-auto flex-1
              ${responsive.padding[viewport]}
              ${responsive.gap[viewport]}
            `}
          >
            {!showAgreement ? (
              <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col ${responsive.gap[viewport]}`}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <MediumText
                      className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
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
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: errors.fullName
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
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
                      className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
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
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: errors.email
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
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
                      className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
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
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: errors.phone
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
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
                      className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
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
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: errors.occupation
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
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
                    className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                    style={{ color: colors.text.primary }}
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
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none resize-vertical ${responsive.body[viewport]}`}
                    style={{
                      borderColor: errors.message
                        ? colorScheme.error
                        : colors.border.input,
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderWidth: '1px'
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
                      className={`${watch('message')?.length > 450 ? 'text-orange-600' : ''}`}
                      style={{
                        color:
                          watch('message')?.length > 450
                            ? colorScheme.warning
                            : colors.text.muted,
                      }}
                      useThemeColor={false}
                    >
                      {watch('message')?.length || 0}/500
                    </Caption>
                  </div>
                </div>

                <div
                  className="rounded-lg p-3 border"
                  style={{
                    backgroundColor: `${colors.button.background}20`,
                    borderColor: colors.border.active,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className="flex-shrink-0 w-3 h-3 rounded-full flex items-center justify-center mt-0.5"
                      style={{
                        backgroundColor: colors.text.primary,
                        color: colors.button.text,
                      }}
                    >
                      <Check className="w-2 h-2" />
                    </div>
                    <div>
                      <MediumText
                        className={responsive.body[viewport]}
                        style={{ color: colors.text.primary }}
                        useThemeColor={false}
                      >
                        By submitting this form, you agree to join our compulsory
                        1-month membership class
                      </MediumText>
                      <Caption
                        className="mt-0.5"
                        style={{ color: colors.text.primary }}
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
                    className={`
                      flex-1 rounded-lg transition-all
                      hover:scale-[1.02] active:scale-[0.98]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${responsive.button[viewport]}
                    `}
                    style={{
                      backgroundColor: colors.button.background,
                      color: colors.button.text,
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2
                          className="animate-spin h-3 w-3"
                          style={{ color: colors.button.text }}
                        />
                        <MediumText
                          className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                          style={{ color: colors.button.text }}
                          useThemeColor={false}
                        >
                          Processing...
                        </MediumText>
                      </span>
                    ) : (
                      <MediumText 
                        className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                        useThemeColor={false}
                      >
                        Submit Application
                      </MediumText>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className={`
                      flex-1 border rounded-lg transition-all
                      hover:scale-[1.02] active:scale-[0.98]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${responsive.button[viewport]}
                    `}
                    style={{
                      borderColor: colors.border.default,
                      color: colors.text.primary,
                      backgroundColor: colors.background,
                      borderWidth: '1px'
                    }}
                  >
                    <MediumText 
                      className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                      useThemeColor={false}
                    >
                      Cancel
                    </MediumText>
                  </button>
                </div>
              </form>
            ) : (
              <div className={`flex flex-col ${responsive.gap[viewport]}`}>
                <div
                  className="border rounded-xl p-3"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border.default,
                  }}
                >
                  <div className="text-center mb-3">
                    <div
                      className={`rounded-full flex items-center justify-center mx-auto border-2 mb-2 ${
                        viewport === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
                      }`}
                      style={{
                        backgroundColor: `${colors.button.background}20`,
                        borderColor: colors.text.primary,
                      }}
                    >
                      <Lock className={viewport === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'} />
                    </div>
                    <div
                      className={`mb-2 ${responsive.heading[viewport]} font-bold leading-tight`}
                      style={{ color: colors.text.primary }}
                    >
                      Welcome to Wisdom House Ministry!
                    </div>
                    <BodyMD
                      className={`${responsive.body[viewport]} leading-relaxed`}
                      style={{ color: colors.text.muted }}
                      useThemeColor={false}
                    >
                      Thank you for your interest in joining our {department} team
                    </BodyMD>
                  </div>

                  <div className="space-y-2">
                    <div
                      className="rounded-lg p-3 border"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border.default,
                      }}
                    >
                      <MediumText
                        className={`mb-1 flex items-center gap-1 ${responsive.body[viewport]}`}
                        style={{ color: colors.text.primary }}
                        useThemeColor={false}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: colors.text.primary }}
                        ></span>
                        Compulsory 1-Month Membership Class
                      </MediumText>
                      <Caption
                        className={responsive.body[viewport]}
                        style={{ color: colors.text.muted }}
                        useThemeColor={false}
                      >
                        Every new member is required to complete our foundational
                        membership class. This ensures everyone understands our
                        vision, values, and ministry philosophy.
                      </Caption>
                    </div>

                    <div
                      className="rounded-lg p-3 border"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border.default,
                      }}
                    >
                      <MediumText
                        className={`mb-1 flex items-center gap-1 ${responsive.body[viewport]}`}
                        style={{ color: colors.text.primary }}
                        useThemeColor={false}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: colorScheme.success }}
                        ></span>
                        What You'll Learn
                      </MediumText>
                      <ul className="space-y-0.5">
                        <Caption useThemeColor={false}>• Our church history and vision</Caption>
                        <Caption useThemeColor={false}>• Biblical foundations for ministry service</Caption>
                        <Caption useThemeColor={false}>• Understanding your spiritual gifts</Caption>
                        <Caption useThemeColor={false}>• Team dynamics and collaboration</Caption>
                        <Caption useThemeColor={false}>• Practical ministry training</Caption>
                      </ul>
                    </div>

                    <div
                      className="rounded-lg p-3 border"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border.default,
                      }}
                    >
                      <MediumText
                        className={`mb-1 flex items-center gap-1 ${responsive.body[viewport]}`}
                        style={{ color: colors.text.primary }}
                        useThemeColor={false}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: colorScheme.secondary }}
                        ></span>
                        Class Schedule & Commitment
                      </MediumText>
                      <ul className="space-y-0.5">
                        <Caption useThemeColor={false}>• Duration: This will be communicated upon completion of form</Caption>
                        <Caption useThemeColor={false}>• Location: This will be announced during service</Caption>
                        <Caption useThemeColor={false}>• Materials: Provided at no cost</Caption>
                        <Caption useThemeColor={false}>• Certificate: Awarded upon completion</Caption>
                      </ul>
                    </div>

                    <div
                      className="rounded-lg p-3 border"
                      style={{
                        backgroundColor: `${colorScheme.warning}20`,
                        borderColor: `${colorScheme.warning}40`,
                      }}
                    >
                      <MediumText
                        className={`mb-1 flex items-center gap-1 ${responsive.body[viewport]}`}
                        style={{ color: colorScheme.warning }}
                        useThemeColor={false}
                      >
                        <AlertCircle className="w-3 h-3" />
                        Important Notice
                      </MediumText>
                      <Caption
                        className={responsive.body[viewport]}
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

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className={`
                      flex-1 rounded-lg transition-all
                      hover:scale-[1.02] active:scale-[0.98]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${responsive.button[viewport]}
                    `}
                    style={{
                      backgroundColor: colors.button.background,
                      color: colors.button.text,
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2
                          className="animate-spin h-3 w-3"
                          style={{ color: colors.button.text }}
                        />
                        <MediumText
                          className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                          style={{ color: colors.button.text }}
                          useThemeColor={false}
                        >
                          Finalizing...
                        </MediumText>
                      </span>
                    ) : (
                      <MediumText 
                        className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                        useThemeColor={false}
                      >
                        I Understand & Agree to Continue
                      </MediumText>
                    )}
                  </button>
                  <button
                    onClick={handleContinueToForm}
                    disabled={isSubmitting}
                    className={`
                      flex-1 border rounded-lg transition-all
                      hover:scale-[1.02] active:scale-[0.98]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${responsive.button[viewport]}
                    `}
                    style={{
                      borderColor: colors.border.default,
                      color: colors.text.primary,
                      backgroundColor: colors.background,
                      borderWidth: '1px'
                    }}
                  >
                    <MediumText 
                      className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                      useThemeColor={false}
                    >
                      Back to Form
                    </MediumText>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};