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
import { CalendarEvent } from '@/lib/types';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X } from 'lucide-react';
import { useWindowSize } from '@/components/utils/hooks/useWindowSize';
import { responsive } from '@/lib/responsivee';
import { H4, BodyMD, MediumText, Caption } from '@/components/text';

interface DateEventsModalProps {
  dateEvents: {
    date: Date;
    events: CalendarEvent[];
  };
  onClose: () => void;
  onViewEvents: () => void;
  onEventClick: (event: CalendarEvent) => void;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export const DateEventsModal = ({
  dateEvents,
  onClose,
  onViewEvents,
  onEventClick,
}: DateEventsModalProps) => {
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

  const handleEventClick = useCallback((event: CalendarEvent) => {
    handleClose();
    setTimeout(() => onEventClick(event), 300);
  }, [handleClose, onEventClick]);

  const handleViewEvents = useCallback(() => {
    handleClose();
    setTimeout(() => onViewEvents(), 300);
  }, [handleClose, onViewEvents]);

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
                    {dateEvents.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <BodyMD
                    className={`${responsive.body[viewport]} leading-relaxed`}
                    style={{ color: colors.text.muted }}
                    useThemeColor={false}
                  >
                    {dateEvents.events.length} event
                    {dateEvents.events.length > 1 ? 's' : ''} scheduled
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

              <div className="space-y-2 mb-4">
                {dateEvents.events.map(event => (
                  <div
                    key={event.id}
                    className="rounded-lg p-3 border-l-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: colors.background,
                      borderLeftColor: colors.border.active,
                      borderWidth: '1px'
                    }}
                    onClick={() => handleEventClick(event)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEventClick(event);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {event.logo && <span className="text-sm">{event.logo}</span>}
                      <span
                        className="inline-block rounded text-xs font-bold px-2 py-0.5"
                        style={{
                          backgroundColor: `${colors.button.background}20`,
                          color: colors.text.primary,
                        }}
                      >
                        {event.type}
                      </span>
                    </div>
                    <MediumText
                      className={`mb-0.5 ${responsive.body[viewport]}`}
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      {event.title}
                    </MediumText>
                    <Caption
                      className={responsive.body[viewport]}
                      style={{ color: colors.text.muted }}
                      useThemeColor={false}
                    >
                      {event.time} • {event.location}
                    </Caption>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleViewEvents}
                  className={`
                    flex-1 rounded-lg transition-all
                    hover:scale-[1.02] active:scale-[0.98]
                    ${responsive.button[viewport]}
                  `}
                  style={{
                    backgroundColor: colors.button.background,
                    color: colors.button.text,
                  }}
                >
                  <MediumText 
                    className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                    useThemeColor={false}
                  >
                    View All Events
                  </MediumText>
                </button>
                <button
                  onClick={handleClose}
                  className={`
                    flex-1 border rounded-lg transition-all
                    hover:scale-[1.02] active:scale-[0.98]
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
                    Close
                  </MediumText>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};