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
import { RegistrationFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
import { useWindowSize } from '@/components/utils/hooks/useWindowSize';
import { responsive } from '@/lib/responsivee';
import {
  H4,
  BodyMD,
  BodySM,
  RegularText,
  MediumText,
  Caption,
} from '@/components/text';

interface LiftingModalProps {
  formData: RegistrationFormData;
  formErrors: Partial<RegistrationFormData>;
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export const LiftingModal = ({
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
  onClose,
}: LiftingModalProps) => {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (mounted) {
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
  }, [mounted]);

  useEffect(() => {
    if (!modalRef.current || !backdropRef.current) return;

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
  }, [viewport]);

  const handleClose = useCallback(() => {
    if (!modalRef.current || !backdropRef.current || isClosing) return;
    
    setIsClosing(true);
    const modal = modalRef.current;
    const backdrop = backdropRef.current;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.in', duration: 0.3 },
      onComplete: () => {
        setIsClosing(false);
        onClose();
      }
    });

    if (viewport === 'mobile') {
      tl.to(modal, { y: '100%', opacity: 0 })
        .to(backdrop, { opacity: 0 }, '<');
    } else {
      tl.to(modal, { scale: 0.95, opacity: 0, y: 20 })
        .to(backdrop, { opacity: 0 }, '<');
    }
  }, [onClose, viewport, isClosing]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  }, [onSubmit]);

  if (!mounted) return null;

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
              overflow-y-auto flex-1
              ${responsive.padding[viewport]}
              ${responsive.gap[viewport]}
            `}
          >
            <div className={`flex flex-col ${responsive.gap[viewport]}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div
                    className={`mb-2 ${responsive.heading[viewport]} font-bold leading-tight`}
                    style={{ color: colors.text.primary }}
                  >
                    Register for 7 Nights of Lifting
                  </div>
                  <BodyMD
                    className={`${responsive.body[viewport]} leading-relaxed`}
                    style={{ color: colors.text.muted }}
                    useThemeColor={false}
                  >
                    Join us for seven powerful nights of spiritual elevation
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

              <form onSubmit={handleSubmit} className={`space-y-3`}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <MediumText
                      className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      First Name *
                    </MediumText>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: formErrors.firstName
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
                      }}
                      placeholder="First name"
                    />
                    {formErrors.firstName && (
                      <BodySM
                        className="mt-1 text-xs"
                        style={{ color: colorScheme.error }}
                        useThemeColor={false}
                      >
                        {formErrors.firstName}
                      </BodySM>
                    )}
                  </div>

                  <div>
                    <MediumText
                      className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      Last Name *
                    </MediumText>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: formErrors.lastName
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
                      }}
                      placeholder="Last name"
                    />
                    {formErrors.lastName && (
                      <BodySM
                        className="mt-1 text-xs"
                        style={{ color: colorScheme.error }}
                        useThemeColor={false}
                      >
                        {formErrors.lastName}
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
                      Email *
                    </MediumText>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: formErrors.email
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
                      }}
                      placeholder="Email address"
                    />
                    {formErrors.email && (
                      <BodySM
                        className="mt-1 text-xs"
                        style={{ color: colorScheme.error }}
                        useThemeColor={false}
                      >
                        {formErrors.email}
                      </BodySM>
                    )}
                  </div>

                  <div>
                    <MediumText
                      className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      Phone *
                    </MediumText>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: formErrors.phone
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
                      }}
                      placeholder="Phone number"
                    />
                    {formErrors.phone && (
                      <BodySM
                        className="mt-1 text-xs"
                        style={{ color: colorScheme.error }}
                        useThemeColor={false}
                      >
                        {formErrors.phone}
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
                      Country *
                    </MediumText>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: formErrors.country
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
                      }}
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="NG">Nigeria</option>
                      <option value="GH">Ghana</option>
                      <option value="ZA">South Africa</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.country && (
                      <BodySM
                        className="mt-1 text-xs"
                        style={{ color: colorScheme.error }}
                        useThemeColor={false}
                      >
                        {formErrors.country}
                      </BodySM>
                    )}
                  </div>

                  <div>
                    <MediumText
                      className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      City *
                    </MediumText>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                      style={{
                        borderColor: formErrors.location
                          ? colorScheme.error
                          : colors.border.input,
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderWidth: '1px'
                      }}
                      placeholder="Your city"
                    />
                    {formErrors.location && (
                      <BodySM
                        className="mt-1 text-xs"
                        style={{ color: colorScheme.error }}
                        useThemeColor={false}
                      >
                        {formErrors.location}
                      </BodySM>
                    )}
                  </div>
                </div>

                <div
                  className="rounded-lg p-3 border"
                  style={{
                    backgroundColor: `${colors.button.background}20`,
                    borderColor: colors.border.active,
                  }}
                >
                  <Caption
                    style={{ color: colors.text.primary }}
                    useThemeColor={false}
                  >
                    <MediumText
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      Note:
                    </MediumText>{' '}
                    This registration covers all seven nights of the event. You will
                    receive a detailed schedule and preparation materials via email.
                  </Caption>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full rounded-lg transition-all
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
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 h-3 w-3" />
                      <RegularText className="text-xs" useThemeColor={false}>
                        Processing...
                      </RegularText>
                    </span>
                  ) : (
                    <MediumText 
                      className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                      useThemeColor={false}
                    >
                      Complete Registration
                    </MediumText>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};