'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ReminderFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
import { H4, BodyMD, BodySM, MediumText, Caption } from '@/components/text';
import { Button } from '@/components/utils/buttons/button';

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

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className={`absolute rounded-full transform hover:scale-110 transition-all duration-200 ${
            isMobile ? 'top-1 right-1 p-1' : 'top-2 right-2 p-1'
          }`}
          style={{
            backgroundColor: colorScheme.opacity.primary10,
            color: textColor,
          }}
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
              style={{ color: textColor }}
              useThemeColor={false}
              weight="bold"
            >
              Set Reminder
            </H4>

            <BodyMD
              className="text-xs leading-relaxed"
              style={{ color: subtitleTextColor }}
              useThemeColor={false}
            >
              Get notified about the{' '}
              {formData.eventType === 'conference'
                ? 'Wisdom Power Conference 2026'
                : '7 Nights of Lifting'}
            </BodyMD>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {/* Email Input */}
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
                placeholder="Enter your email"
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

            {/* Frequency Select */}
            <div>
              <MediumText
                className="block mb-1 text-xs"
                style={{ color: textColor }}
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
                  borderColor: inputBorderColor,
                  backgroundColor: surfaceBackground,
                  color: textColor,
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
                style={{ color: textColor }}
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
                  borderColor: inputBorderColor,
                  backgroundColor: surfaceBackground,
                  color: textColor,
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
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.opacity.primary20,
              }}
            >
              <div className="flex items-start gap-1">
                <span className="text-xs mt-0.5 flex-shrink-0">💡</span>
                <Caption
                  className="leading-relaxed"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  <MediumText
                    style={{ color: textColor }}
                    useThemeColor={false}
                  >
                    How it works:
                  </MediumText>{' '}
                  We'll send you periodic updates about the event, including
                  important dates, speaker announcements, and registration
                  reminders.
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
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
            >
              {isSettingReminder ? (
                <span className="flex items-center justify-center">
                  <Loader2
                    className="animate-spin mr-2 h-3 w-3"
                    style={{ color: buttonTextColor }}
                  />
                  <MediumText
                    className="text-sm"
                    style={{ color: buttonTextColor }}
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
