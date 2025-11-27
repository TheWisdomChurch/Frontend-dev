/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/ConferenceModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { RegistrationFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
import { BaseText, BodySM, BodyMD, SemiBoldText } from '@/components/text';

interface ConferenceModalProps {
  formData: RegistrationFormData;
  formErrors: Partial<RegistrationFormData>;
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ConferenceModal = ({
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
  onClose,
}: ConferenceModalProps) => {
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
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
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
          duration: 0.4,
          ease: 'power2.in',
          onComplete: onClose,
        });
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 30,
          duration: 0.4,
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
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 ${
        isMobile ? 'pb-0' : ''
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border shadow-2xl
          ${
            isMobile
              ? 'rounded-t-3xl rounded-b-none max-h-[90vh]'
              : 'rounded-3xl max-w-2xl max-h-[90vh]'
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
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        <div
          className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 lg:p-8 max-h-[calc(90vh-80px)]'}`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <BaseText
                fontFamily="bricolage"
                weight="black"
                className={`mb-2 tracking-tight ${
                  isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'
                }`}
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Register for Wisdom Power Conference 2026
              </BaseText>
              <BodyMD
                className="text-sm"
                style={{ color: subtitleTextColor }}
                useThemeColor={false}
              >
                Join us for this transformative spiritual gathering
              </BodyMD>
            </div>
            <button
              onClick={handleClose}
              className={`rounded-xl transition-colors duration-300 flex-shrink-0 ${
                isMobile ? 'p-1.5' : 'p-2'
              }`}
              style={{
                color: textColor,
                backgroundColor: colorScheme.opacity.primary10,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary10;
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <SemiBoldText
                  className="block mb-2 text-sm"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  First Name *
                </SemiBoldText>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                  style={{
                    borderColor: formErrors.firstName
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your first name"
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
                <SemiBoldText
                  className="block mb-2 text-sm"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Last Name *
                </SemiBoldText>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                  style={{
                    borderColor: formErrors.lastName
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your last name"
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

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <SemiBoldText
                  className="block mb-2 text-sm"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Email Address *
                </SemiBoldText>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                  style={{
                    borderColor: formErrors.email
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your email"
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
                <SemiBoldText
                  className="block mb-2 text-sm"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Phone Number *
                </SemiBoldText>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                  style={{
                    borderColor: formErrors.phone
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your phone number"
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

            {/* Country & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <SemiBoldText
                  className="block mb-2 text-sm"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Country *
                </SemiBoldText>
                <select
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                  style={{
                    borderColor: formErrors.country
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                >
                  <option value="">Select your country</option>
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
                <SemiBoldText
                  className="block mb-2 text-sm"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Location/City *
                </SemiBoldText>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                  style={{
                    borderColor: formErrors.location
                      ? colorScheme.error
                      : inputBorderColor,
                    backgroundColor: surfaceBackground,
                    color: textColor,
                  }}
                  placeholder="Enter your city"
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

            {/* Note Section */}
            <div
              className="rounded-xl p-3 border text-sm"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.opacity.primary20,
              }}
            >
              <BodySM
                style={{ color: colorScheme.primary }}
                useThemeColor={false}
              >
                <SemiBoldText
                  style={{ color: colorScheme.primary }}
                  useThemeColor={false}
                >
                  Note:
                </SemiBoldText>{' '}
                After registration, you will receive a confirmation email with
                event details and next steps. For group registrations, please
                contact our events team directly.
              </BodySM>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isMobile ? 'py-3 text-base' : 'py-4 text-lg'
              }`}
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.primaryLight;
                }
              }}
              onMouseLeave={(e: any) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = buttonBackground;
                }
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    style={{ color: buttonTextColor }}
                  />
                  <BaseText
                    weight="bold"
                    className="text-sm"
                    style={{ color: buttonTextColor }}
                    useThemeColor={false}
                  >
                    Processing Registration...
                  </BaseText>
                </span>
              ) : (
                <SemiBoldText
                  className={isMobile ? 'text-base' : 'text-lg'}
                  style={{ color: buttonTextColor }}
                  useThemeColor={false}
                >
                  Complete Registration
                </SemiBoldText>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
