'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { CalendarEvent } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X } from 'lucide-react';
import { H4, BodyMD, MediumText } from '@/components/text';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

export const EventModal = ({ event, onClose }: EventModalProps) => {
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
            <div className="flex items-start gap-2">
              {event.logo && (
                <div
                  className="p-1.5 rounded-lg text-lg"
                  style={{
                    backgroundColor: colorScheme.opacity.primary10,
                    color: colorScheme.primary,
                  }}
                >
                  {event.logo}
                </div>
              )}
              <div>
                <span
                  className="inline-block rounded-full mb-1 px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: colorScheme.opacity.primary10,
                    color: colorScheme.primary,
                  }}
                >
                  <MediumText
                    style={{ color: colorScheme.primary }}
                    useThemeColor={false}
                  >
                    {event.type}
                  </MediumText>
                </span>
                <H4
                  fontFamily="bricolage"
                  className={`mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}
                  style={{ color: textColor }}
                  useThemeColor={false}
                  weight="bold"
                >
                  {event.title}
                </H4>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg transition-colors duration-200 flex-shrink-0 p-1.5"
              style={{
                color: textColor,
                backgroundColor: colorScheme.opacity.primary10,
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {event.description && (
            <BodyMD
              className="mb-3 text-xs"
              style={{ color: subtitleTextColor }}
              useThemeColor={false}
            >
              {event.description}
            </BodyMD>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center">
              <MediumText
                className="w-12 text-xs"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Date:
              </MediumText>
              <BodyMD
                className="text-xs"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </BodyMD>
            </div>
            <div className="flex items-center">
              <MediumText
                className="w-12 text-xs"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Time:
              </MediumText>
              <BodyMD
                className="text-xs"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                {event.time}
              </BodyMD>
            </div>
            <div className="flex items-center">
              <MediumText
                className="w-12 text-xs"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                Location:
              </MediumText>
              <BodyMD
                className="text-xs"
                style={{ color: textColor }}
                useThemeColor={false}
              >
                {event.location}
              </BodyMD>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className={`flex-1 rounded-lg transition-all duration-200 shadow-md hover:scale-105 ${
                isMobile ? 'py-2' : 'py-2.5'
              }`}
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
            >
              <MediumText className="text-sm" useThemeColor={false}>
                Add to Calendar
              </MediumText>
            </button>
            <button
              className={`flex-1 border rounded-lg transition-all duration-200 ${
                isMobile ? 'py-2' : 'py-2.5'
              }`}
              style={{
                borderColor: borderColor,
                color: textColor,
                backgroundColor: modalBackground,
              }}
            >
              <MediumText className="text-sm" useThemeColor={false}>
                Share Event
              </MediumText>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
