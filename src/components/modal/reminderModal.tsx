'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ReminderFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
import { H4, BodyMD, BodySM, MediumText, Caption } from '@/components/text';
import Button from '@/components/utils/buttons/CustomButton';

interface ReminderModalProps {
  formData: ReminderFormData;
  formErrors: Partial<ReminderFormData>;
  isSettingReminder: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ReminderModal = ({
  formData,
  formErrors,
  isSettingReminder,
  onInputChange,
  onSubmit,
  onClose,
}: ReminderModalProps) => {
  const { colorScheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Theme-based styles
  const themeStyles = {
    modalBackground: colorScheme.black,
    textColor: colorScheme.primary,
    subtitleTextColor: colorScheme.white,
    buttonBackground: colorScheme.primary,
    buttonTextColor: colorScheme.black,
    surfaceBackground: colorScheme.surface,
    borderColor: colorScheme.primary,
    inputBorderColor: colorScheme.border,
    opacityPrimary10: colorScheme.opacity.primary10,
    opacityPrimary20: colorScheme.opacity.primary20,
    error: colorScheme.error,
  };

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    // Initial check
    checkMobile();

    const handleResize = () => {
      requestAnimationFrame(checkMobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle body scroll locking
  useEffect(() => {
    if (!modalRef.current) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Animation effect
  useEffect(() => {
    if (!modalRef.current) return;

    const modalElement = modalRef.current;
    const tl = gsap.timeline();

    if (isMobile) {
      tl.fromTo(
        modalElement,
        { y: '100%', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      tl.fromTo(
        modalElement,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }

    return () => {
      tl.kill();
    };
  }, [isMobile]);

  const handleClose = useCallback(() => {
    if (!modalRef.current) {
      onClose();
      return;
    }

    const modalElement = modalRef.current;

    if (isMobile) {
      gsap.to(modalElement, {
        y: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      gsap.to(modalElement, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      });
    }
  }, [isMobile, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(e);
    },
    [onSubmit]
  );

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-3 ${
        isMobile ? 'pb-0' : ''
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Set Reminder"
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
          backgroundColor: themeStyles.modalBackground,
          borderColor: themeStyles.borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div
            className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing"
            aria-hidden="true"
          >
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className={`absolute rounded-full transform hover:scale-110 transition-all duration-200 ${
            isMobile ? 'top-1 right-1 p-1' : 'top-2 right-2 p-1'
          }`}
          style={{
            backgroundColor: themeStyles.opacityPrimary10,
            color: themeStyles.textColor,
          }}
          aria-label="Close modal"
        >
          <X className="w-3 h-3" />
        </Button>

        <div
          className={`overflow-y-auto ${isMobile ? 'p-3 max-h-[calc(85vh-40px)]' : 'p-4 max-h-[calc(85vh-40px)]'}`}
        >
          {/* Header */}
          <div className={`text-center ${isMobile ? 'mb-4' : 'mb-5'}`}>
            <div
              className={`rounded-full flex items-center justify-center mx-auto border-2 ${
                isMobile ? 'w-12 h-12 mb-2' : 'w-14 h-14 mb-3'
              }`}
              style={{
                backgroundColor: `${colorScheme.primary}20`,
                borderColor: colorScheme.primary,
              }}
            >
              <span
                className={isMobile ? 'text-lg' : 'text-xl'}
                style={{ color: colorScheme.primary }}
              >
                ⏰
              </span>
            </div>

            <H4
              fontFamily="bricolage"
              className={`mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}
              style={{ color: themeStyles.textColor }}
              useThemeColor={false}
              weight="bold"
            >
              Set Reminder
            </H4>

            <BodyMD
              className="text-xs leading-relaxed"
              style={{ color: themeStyles.subtitleTextColor }}
              useThemeColor={false}
            >
              Get notified about the{' '}
              {formData.eventType === 'conference'
                ? 'Wisdom Power Conference 2026'
                : '7 Nights of Lifting'}
            </BodyMD>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Input */}
            <div>
              <MediumText
                className="block mb-1 text-xs"
                style={{ color: themeStyles.textColor }}
                useThemeColor={false}
              >
                Email Address *
              </MediumText>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                style={{
                  borderColor: formErrors.email
                    ? themeStyles.error
                    : themeStyles.inputBorderColor,
                  backgroundColor: themeStyles.surfaceBackground,
                  color: themeStyles.textColor,
                }}
                placeholder="Enter your email"
                required
              />
              {formErrors.email && (
                <BodySM
                  className="mt-0.5 text-xs"
                  style={{ color: themeStyles.error }}
                  useThemeColor={false}
                >
                  {formErrors.email}
                </BodySM>
              )}
            </div>

            {/* Frequency Select */}
            <div>
              <MediumText
                className="block mb-1 text-xs"
                style={{ color: themeStyles.textColor }}
                useThemeColor={false}
              >
                Reminder Frequency
              </MediumText>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={onInputChange}
                className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                style={{
                  borderColor: themeStyles.inputBorderColor,
                  backgroundColor: themeStyles.surfaceBackground,
                  color: themeStyles.textColor,
                }}
              >
                <option value="daily">Daily Updates</option>
                <option value="weekly">Weekly Updates</option>
                <option value="monthly">Monthly Updates</option>
              </select>
            </div>

            {/* Event Type Select */}
            <div>
              <MediumText
                className="block mb-1 text-xs"
                style={{ color: themeStyles.textColor }}
                useThemeColor={false}
              >
                Event Type
              </MediumText>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={onInputChange}
                className="w-full px-2 py-1.5 rounded-lg border focus:outline-none text-xs"
                style={{
                  borderColor: themeStyles.inputBorderColor,
                  backgroundColor: themeStyles.surfaceBackground,
                  color: themeStyles.textColor,
                }}
              >
                <option value="conference">Wisdom Power Conference 2026</option>
                <option value="lifting">7 Nights of Lifting</option>
              </select>
            </div>

            {/* Information Section */}
            <div
              className="rounded-lg p-2 border"
              style={{
                backgroundColor: themeStyles.opacityPrimary10,
                borderColor: themeStyles.opacityPrimary20,
              }}
            >
              <div className="flex items-start gap-1">
                <span className="text-xs mt-0.5 flex-shrink-0">💡</span>
                <Caption
                  className="leading-relaxed"
                  style={{ color: themeStyles.textColor }}
                  useThemeColor={false}
                >
                  <MediumText
                    style={{ color: themeStyles.textColor }}
                    useThemeColor={false}
                  >
                    How it works:
                  </MediumText>{' '}
                  We&apos;ll send you periodic updates about the event,
                  including important dates, speaker announcements, and
                  registration reminders.
                </Caption>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSettingReminder}
              className={`w-full rounded-lg hover:shadow-lg transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                isMobile ? 'py-2 text-sm' : 'py-2.5 text-sm'
              }`}
              style={{
                backgroundColor: themeStyles.buttonBackground,
                color: themeStyles.buttonTextColor,
              }}
            >
              {isSettingReminder ? (
                <span className="flex items-center justify-center">
                  <Loader2
                    className="animate-spin mr-2 h-3 w-3"
                    style={{ color: themeStyles.buttonTextColor }}
                  />
                  <MediumText
                    className="text-sm"
                    style={{ color: themeStyles.buttonTextColor }}
                    useThemeColor={false}
                  >
                    Setting Reminder...
                  </MediumText>
                </span>
              ) : (
                <MediumText className="text-sm" useThemeColor={false}>
                  Set Reminder
                </MediumText>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
