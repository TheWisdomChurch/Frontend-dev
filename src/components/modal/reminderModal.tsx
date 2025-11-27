/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/ReminderModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ReminderFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
import { BaseText, BodySM, BodyMD, SemiBoldText } from '@/components/text';
import { Button } from '@/components/ui/button';

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
              : 'rounded-3xl max-w-md max-h-[90vh]'
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

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className={`absolute rounded-full transform hover:scale-110 transition-all duration-200 ${
            isMobile ? 'top-2 right-2 p-1.5' : 'top-3 right-3 p-2'
          }`}
          style={{
            backgroundColor: colorScheme.opacity.primary10,
            color: textColor,
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
        </Button>

        <div
          className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 lg:p-8 max-h-[calc(90vh-80px)]'}`}
        >
          {/* Header */}
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
            <div
              className={`rounded-full flex items-center justify-center mx-auto border-4 ${
                isMobile ? 'w-16 h-16 mb-3' : 'w-20 h-20 mb-4'
              }`}
              style={{
                backgroundColor: `${colorScheme.primary}20`,
                borderColor: colorScheme.primary,
              }}
            >
              <span
                className={isMobile ? 'text-xl' : 'text-2xl'}
                style={{ color: colorScheme.primary }}
              >
                ⏰
              </span>
            </div>

            <BaseText
              weight="black"
              className={`mb-2 tracking-tight ${
                isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'
              }`}
              style={{ color: textColor }}
              useThemeColor={false}
            >
              Set Reminder
            </BaseText>

            <BodyMD
              className="opacity-90 leading-relaxed text-sm"
              style={{ color: subtitleTextColor }}
              useThemeColor={false}
            >
              Get notified about the{' '}
              {formData.eventType === 'conference'
                ? 'Wisdom Power Conference 2026'
                : '7 Nights of Lifting'}
            </BodyMD>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email Input */}
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

            {/* Frequency Select */}
            <div>
              <SemiBoldText
                className="block mb-2 text-sm"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Reminder Frequency
              </SemiBoldText>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={onInputChange}
                className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
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
              <SemiBoldText
                className="block mb-2 text-sm"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Event Type
              </SemiBoldText>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={onInputChange}
                className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
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
              className="rounded-xl p-3 border text-sm"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.opacity.primary20,
              }}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5 flex-shrink-0">💡</span>
                <BodySM
                  className="leading-relaxed"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  <SemiBoldText
                    style={{ color: textColor }}
                    useThemeColor={false}
                  >
                    How it works:
                  </SemiBoldText>{' '}
                  We'll send you periodic updates about the event, including
                  important dates, speaker announcements, and registration
                  reminders.
                </BodySM>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSettingReminder}
              className={`w-full rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isMobile ? 'py-3 text-base' : 'py-4 text-lg'
              }`}
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                if (!isSettingReminder) {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.primaryLight;
                }
              }}
              onMouseLeave={(e: any) => {
                if (!isSettingReminder) {
                  e.currentTarget.style.backgroundColor = buttonBackground;
                }
              }}
            >
              {isSettingReminder ? (
                <span className="flex items-center justify-center">
                  <Loader2
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    style={{ color: buttonTextColor }}
                  />
                  Setting Reminder...
                </span>
              ) : (
                <SemiBoldText
                  className={isMobile ? 'text-base' : 'text-lg'}
                  style={{ color: buttonTextColor }}
                  useThemeColor={false}
                >
                  Set Reminder
                </SemiBoldText>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
