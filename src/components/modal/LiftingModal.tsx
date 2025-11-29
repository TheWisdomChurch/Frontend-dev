'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { RegistrationFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (modalRef.current) {
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
  }, [isMobile]);

  const handleClose = () => {
    if (modalRef.current) {
      if (isMobile) {
        gsap.to(modalRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose,
        });
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose,
        });
      }
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!mounted) return null;

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

        <div
          className={`overflow-y-auto ${isMobile ? 'p-3 max-h-[calc(85vh-40px)]' : 'p-4 max-h-[calc(85vh-40px)]'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <H4
                fontFamily="bricolage"
                className={`mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}
                style={{ color: textColor }}
                useThemeColor={false}
                weight="bold"
              >
                Register for 7 Nights of Lifting
              </H4>
              <BodyMD
                className="text-xs"
                style={{ color: subtitleTextColor }}
                useThemeColor={false}
              >
                Join us for seven powerful nights of spiritual elevation
              </BodyMD>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg transition-colors duration-200 flex-shrink-0 p-1.5 ml-2"
              style={{
                color: textColor,
                backgroundColor: colorScheme.opacity.primary10,
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <MediumText
                  className="block mb-1 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  First Name *
                </MediumText>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onInputChange}
                  className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                  style={{
                    borderColor: formErrors.firstName
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="First name"
                />
                {formErrors.firstName && (
                  <BodySM
                    className="mt-0.5 text-xs"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.firstName}
                  </BodySM>
                )}
              </div>

              <div>
                <MediumText
                  className="block mb-1 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Last Name *
                </MediumText>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onInputChange}
                  className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                  style={{
                    borderColor: formErrors.lastName
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Last name"
                />
                {formErrors.lastName && (
                  <BodySM
                    className="mt-0.5 text-xs"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.lastName}
                  </BodySM>
                )}
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <MediumText
                  className="block mb-1 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Email *
                </MediumText>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onInputChange}
                  className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                  style={{
                    borderColor: formErrors.email
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Email address"
                />
                {formErrors.email && (
                  <BodySM
                    className="mt-0.5 text-xs"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.email}
                  </BodySM>
                )}
              </div>

              <div>
                <MediumText
                  className="block mb-1 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Phone *
                </MediumText>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onInputChange}
                  className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                  style={{
                    borderColor: formErrors.phone
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Phone number"
                />
                {formErrors.phone && (
                  <BodySM
                    className="mt-0.5 text-xs"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.phone}
                  </BodySM>
                )}
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <MediumText
                  className="block mb-1 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Country *
                </MediumText>
                <select
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                  className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                  style={{
                    borderColor: formErrors.country
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
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
                    className="mt-0.5 text-xs"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.country}
                  </BodySM>
                )}
              </div>

              <div>
                <MediumText
                  className="block mb-1 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  City *
                </MediumText>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onInputChange}
                  className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                  style={{
                    borderColor: formErrors.location
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Your city"
                />
                {formErrors.location && (
                  <BodySM
                    className="mt-0.5 text-xs"
                    style={{ color: colorScheme.error }}
                    useThemeColor={false}
                  >
                    {formErrors.location}
                  </BodySM>
                )}
              </div>
            </div>

            {/* Note Section */}
            <div
              className="rounded-lg p-2 border"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.opacity.primary20,
              }}
            >
              <Caption
                style={{ color: colorScheme.primary }}
                useThemeColor={false}
              >
                <MediumText
                  style={{ color: colorScheme.primary }}
                  useThemeColor={false}
                >
                  Note:
                </MediumText>{' '}
                This registration covers all seven nights of the event. You will
                receive a detailed schedule and preparation materials via email.
              </Caption>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-lg hover:shadow-lg transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                isMobile ? 'py-2 text-sm' : 'py-2.5 text-sm'
              }`}
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
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
                <MediumText className="text-sm" useThemeColor={false}>
                  Complete Registration
                </MediumText>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
