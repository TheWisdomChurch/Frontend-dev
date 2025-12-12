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
import { ReminderFormData } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
import { useWindowSize } from '@/components/utils/hooks/useWindowSize';
import { responsive } from '@/lib/responsivee';
import { H4, BodyMD, BodySM, MediumText, Caption } from '@/components/text';

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

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

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
              <div className={`text-center ${responsive.gap[viewport]}`}>
                <div
                  className={`rounded-full flex items-center justify-center mx-auto border-2 ${
                    viewport === 'mobile' ? 'w-12 h-12 mb-2' : 'w-14 h-14 mb-3'
                  }`}
                  style={{
                    backgroundColor: `${colors.button.background}20`,
                    borderColor: colors.text.primary,
                  }}
                >
                  <span
                    className={viewport === 'mobile' ? 'text-lg' : 'text-xl'}
                    style={{ color: colors.text.primary }}
                  >
                    ⏰
                  </span>
                </div>

                <div
                  className={`mb-2 ${responsive.heading[viewport]} font-bold leading-tight`}
                  style={{ color: colors.text.primary }}
                >
                  Set Reminder
                </div>

                <BodyMD
                  className={`${responsive.body[viewport]} leading-relaxed`}
                  style={{ color: colors.text.muted }}
                  useThemeColor={false}
                >
                  Get notified about the{' '}
                  {formData.eventType === 'conference'
                    ? 'Wisdom Power Conference 2026'
                    : '7 Nights of Lifting'}
                </BodyMD>
              </div>

              <form onSubmit={handleSubmit} className={`space-y-3`}>
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
                    placeholder="Enter your email"
                    required
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
                    Reminder Frequency
                  </MediumText>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                    style={{
                      borderColor: colors.border.input,
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderWidth: '1px'
                    }}
                  >
                    <option value="daily">Daily Updates</option>
                    <option value="weekly">Weekly Updates</option>
                    <option value="monthly">Monthly Updates</option>
                  </select>
                </div>

                <div>
                  <MediumText
                    className={`block mb-2 ${responsive.body[viewport]} font-medium`}
                    style={{ color: colors.text.primary }}
                    useThemeColor={false}
                  >
                    Event Type
                  </MediumText>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${responsive.body[viewport]}`}
                    style={{
                      borderColor: colors.border.input,
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderWidth: '1px'
                    }}
                  >
                    <option value="conference">Wisdom Power Conference 2026</option>
                    <option value="lifting">7 Nights of Lifting</option>
                  </select>
                </div>

                <div
                  className="rounded-lg p-3 border"
                  style={{
                    backgroundColor: `${colors.button.background}20`,
                    borderColor: colors.border.active,
                  }}
                >
                  <div className="flex items-start gap-1">
                    <span className={`mt-0.5 flex-shrink-0 ${responsive.body[viewport]}`}>💡</span>
                    <Caption
                      className={`leading-relaxed ${responsive.body[viewport]}`}
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      <MediumText
                        style={{ color: colors.text.primary }}
                        useThemeColor={false}
                      >
                        How it works:
                      </MediumText>{' '}
                      We'll send you periodic updates about the event,
                      including important dates, speaker announcements, and
                      registration reminders.
                    </Caption>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSettingReminder}
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
                  {isSettingReminder ? (
                    <span className="flex items-center justify-center">
                      <Loader2
                        className="animate-spin mr-2 h-3 w-3"
                        style={{ color: colors.button.text }}
                      />
                      <MediumText
                        className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                        style={{ color: colors.button.text }}
                        useThemeColor={false}
                      >
                        Setting Reminder...
                      </MediumText>
                    </span>
                  ) : (
                    <MediumText 
                      className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                      useThemeColor={false}
                    >
                      Set Reminder
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