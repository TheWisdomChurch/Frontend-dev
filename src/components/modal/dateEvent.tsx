/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/DateEventsModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { CalendarEvent } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X } from 'lucide-react';
import { BaseText, BodySM, BodyMD, SemiBoldText } from '@/components/text';

interface DateEventsModalProps {
  dateEvents: {
    date: Date;
    events: CalendarEvent[];
  };
  onClose: () => void;
  onViewEvents: () => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const DateEventsModal = ({
  dateEvents,
  onClose,
  onViewEvents,
  onEventClick,
}: DateEventsModalProps) => {
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

        <div
          className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 lg:p-8 max-h-[calc(90vh-80px)]'}`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <BaseText
                weight="black"
                className={`mb-2 tracking-tight ${
                  isMobile ? 'text-lg' : 'text-xl lg:text-2xl'
                }`}
                style={{ color: textColor }}
                useThemeColor={false}
              >
                {dateEvents.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </BaseText>
              <BodyMD
                className="text-sm"
                style={{ color: subtitleTextColor }}
                useThemeColor={false}
              >
                {dateEvents.events.length} event
                {dateEvents.events.length > 1 ? 's' : ''} scheduled
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

          {/* Events List */}
          <div className="space-y-3 mb-6">
            {dateEvents.events.map(event => (
              <div
                key={event.id}
                className="rounded-xl p-3 border-l-4 cursor-pointer transition-colors duration-300"
                style={{
                  backgroundColor: surfaceBackground,
                  borderLeftColor: colorScheme.primary,
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.opacity.primary10;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = surfaceBackground;
                }}
                onClick={() => {
                  handleClose();
                  onEventClick(event);
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {event.logo && <span className="text-lg">{event.logo}</span>}
                  <span
                    className={`inline-block rounded text-xs font-bold ${
                      isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'
                    }`}
                    style={{
                      backgroundColor: colorScheme.opacity.primary20,
                      color: colorScheme.primary,
                    }}
                  >
                    {event.type}
                  </span>
                </div>
                <SemiBoldText
                  className="mb-1 text-sm"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  {event.title}
                </SemiBoldText>
                <BodySM
                  className="text-xs"
                  style={{ color: subtitleTextColor }}
                  useThemeColor={false}
                >
                  {event.time}
                </BodySM>
                <BodySM
                  className="text-xs"
                  style={{ color: subtitleTextColor }}
                  useThemeColor={false}
                >
                  {event.location}
                </BodySM>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onViewEvents}
              className={`flex-1 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 ${
                isMobile ? 'py-2.5' : 'py-3'
              }`}
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.primaryLight;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = buttonBackground;
              }}
            >
              <SemiBoldText
                className={isMobile ? 'text-sm' : 'text-base'}
                style={{ color: buttonTextColor }}
                useThemeColor={false}
              >
                View All Events
              </SemiBoldText>
            </button>
            <button
              onClick={handleClose}
              className={`flex-1 border-2 rounded-xl transition-colors duration-300 ${
                isMobile ? 'py-2.5' : 'py-3'
              }`}
              style={{
                borderColor: borderColor,
                color: textColor,
                backgroundColor: modalBackground,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary10;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = modalBackground;
              }}
            >
              <SemiBoldText
                className={isMobile ? 'text-sm' : 'text-base'}
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Close
              </SemiBoldText>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
