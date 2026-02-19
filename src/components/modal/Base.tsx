'use client';

import { 
  useEffect, 
  useRef, 
  useState, 
  useCallback,
  useLayoutEffect,
  useMemo,
  useId,
  ReactNode,
  memo
} from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useTheme } from '@/components/contexts/ThemeContext';
import { X, Loader2 } from 'lucide-react';
import { useWindowSize } from '@/components/utils/hooks/useWindowSize';
import { responsive } from '@/lib/responsivee';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  showHandle?: boolean;
  maxWidth?: string;
  preventClose?: boolean;
  onEscapeClose?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
  onAnimationComplete?: () => void;
  forceBottomSheet?: boolean;
}

export const modalStyles = {
  sectionTitle: 'text-sm font-semibold text-white/80',
  label: 'block text-xs font-semibold uppercase tracking-wide text-white/70 mb-1',
  input:
    'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30',
  select:
    'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30',
  textarea:
    'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30',
  errorText: 'text-xs text-red-400 mt-1',
  primaryButton:
    'w-full rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
  ghostButton:
    'w-full rounded-lg px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10 border border-white/20',
};

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

// Focus trap helper function
const getFocusableElements = (element: HTMLElement): HTMLElement[] => {
  return Array.from(element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter(el => !el.hasAttribute('disabled') && 
                   el.getAttribute('aria-hidden') !== 'true') as HTMLElement[];
};

export const BaseModal = memo(function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  showCloseButton = true,
  showHandle = true,
  maxWidth = 'max-w-lg',
  preventClose = false,
  onEscapeClose = true,
  isLoading = false,
  loadingText = 'Loading...',
  initialFocusRef,
  onAnimationComplete,
  forceBottomSheet = true,
}: BaseModalProps) {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const viewport: ViewportSize = useMemo(() => {
    if (!windowSize.width) return 'mobile';
    if (windowSize.width < 640) return 'mobile';
    if (windowSize.width < 1024) return 'tablet';
    return 'desktop';
  }, [windowSize.width]);

  // Use bottom sheet on mobile for consistency; allow forced sheet on larger screens
  const useBottomSheet = forceBottomSheet || viewport === 'mobile';

  const colors = useMemo(() => ({
    background: colorScheme.black,
    text: {
      primary: colorScheme.white,
      secondary: colorScheme.white,
      muted: 'rgba(255, 255, 255, 0.7)',
      accent: colorScheme.primary,
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
    backdrop: 'rgba(0, 0, 0, 0.7)'
  }), [colorScheme]);

  // Mount/Unmount logic
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Body scroll lock
  useLayoutEffect(() => {
    if (mounted && isOpen) {
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
          (body.style as any)[key] = value;
        });

        const scrollYValue = parseInt(document.documentElement.dataset.scrollY || '0');
        window.scrollTo(0, scrollYValue);
        delete document.documentElement.dataset.scrollY;
      };
    }
  }, [mounted, isOpen]);

  // Focus Management
  useEffect(() => {
    if (!mounted || !isOpen || !modalRef.current) return;

    // Store the currently focused element
    lastFocusedElement.current = document.activeElement as HTMLElement;

    // Focus management
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = getFocusableElements(modalRef.current);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add focus trap
    document.addEventListener('keydown', handleFocusTrap);

    // Focus on modal or initial element
    setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (showCloseButton && modalRef.current) {
        // Find close button
        const closeButton = modalRef.current.querySelector(
          '[aria-label="Close modal"]'
        ) as HTMLElement;
        if (closeButton) {
          closeButton.focus();
        } else {
          // Focus first focusable element
          const focusableElements = getFocusableElements(modalRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            modalRef.current.setAttribute('tabindex', '-1');
            modalRef.current.focus();
          }
        }
      }
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
      
      // Restore focus to last focused element
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
        lastFocusedElement.current = null;
      }
    };
  }, [mounted, isOpen, showCloseButton, initialFocusRef]);

  // Animation
  useEffect(() => {
    if (!mounted || !isOpen || !modalRef.current || !backdropRef.current) return;

    const modal = modalRef.current;
    const backdrop = backdropRef.current;
    const revealNodes = modal.querySelectorAll('[data-modal-stagger]');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(modal, { opacity: 1, y: 0, scale: 1 });
      if (revealNodes.length > 0) {
        gsap.set(revealNodes, { opacity: 1, y: 0 });
      }
      onAnimationComplete?.();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.45 },
      onComplete: onAnimationComplete
    });

    if (useBottomSheet) {
      tl.fromTo(backdrop, 
        { opacity: 0 },
        { opacity: 1, duration: 0.36, ease: 'power2.out' }
      )
      .fromTo(modal,
        { y: '108%', opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.58, ease: 'expo.out' },
        '<'
      );
    } else {
      tl.fromTo(backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.34, ease: 'power2.out' }
      )
      .fromTo(modal,
        { 
          scale: 0.94,
          opacity: 0,
          y: 26
        },
        { 
          scale: 1, 
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.2)'
        },
        '<'
      );
    }

    if (revealNodes.length > 0) {
      tl.fromTo(
        revealNodes,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out',
        },
        '-=0.24'
      );
    }

    return () => {
      tl.kill();
    };
  }, [mounted, isOpen, useBottomSheet, onAnimationComplete]);

  const handleClose = useCallback(() => {
    if (!modalRef.current || !backdropRef.current || isClosing || preventClose || isLoading) return;
    
    setIsClosing(true);
    const modal = modalRef.current;
    const backdrop = backdropRef.current;
    const revealNodes = modal.querySelectorAll('[data-modal-stagger]');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsClosing(false);
      onClose();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.in', duration: 0.24 },
      onComplete: () => {
        setIsClosing(false);
        onClose();
      }
    });

    if (revealNodes.length > 0) {
      tl.to(revealNodes, {
        opacity: 0,
        y: 8,
        duration: 0.16,
        stagger: -0.025,
      });
    }

    if (useBottomSheet) {
      tl.to(modal, { y: '108%', opacity: 0.2, duration: 0.28, ease: 'power3.in' })
        .to(backdrop, { opacity: 0, duration: 0.22 }, '<');
    } else {
      tl.to(modal, { scale: 0.96, opacity: 0, y: 24, duration: 0.25, ease: 'power2.in' })
        .to(backdrop, { opacity: 0, duration: 0.2 }, '<');
    }
  }, [onClose, useBottomSheet, isClosing, preventClose, isLoading]);

  // Escape key
  useEffect(() => {
    if (!isOpen || !onEscapeClose) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) handleClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose, onEscapeClose, isLoading]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventClose && !isLoading) {
      handleClose();
    }
  }, [handleClose, preventClose, isLoading]);

  // Handle drag for bottom sheet (mobile/tablet)
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const dragThreshold = 100;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!useBottomSheet || !showHandle) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  }, [useBottomSheet, showHandle]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !modalRef.current) return;
    const clientY = e.touches[0].clientY;
    setCurrentY(clientY);
    
    const delta = clientY - startY;
    if (delta > 0) {
      modalRef.current.style.transform = `translateY(${delta}px)`;
    }
  }, [isDragging, startY]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !modalRef.current) return;
    setIsDragging(false);
    
    const delta = currentY - startY;
    if (delta > dragThreshold && !preventClose && !isLoading) {
      handleClose();
    } else {
      // Snap back
      modalRef.current.style.transform = 'translateY(0)';
    }
  }, [isDragging, currentY, startY, preventClose, isLoading, handleClose]);

  // Handle mouse drag for bottom sheet
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!useBottomSheet || !showHandle || preventClose || isLoading || !modalRef.current) return;
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  }, [useBottomSheet, showHandle, preventClose, isLoading]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !modalRef.current) return;
    const clientY = e.clientY;
    setCurrentY(clientY);
    
    const delta = clientY - startY;
    if (delta > 0) {
      modalRef.current.style.transform = `translateY(${delta}px)`;
    }
  }, [isDragging, startY]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !modalRef.current) return;
    setIsDragging(false);
    
    const delta = currentY - startY;
    if (delta > dragThreshold && !preventClose && !isLoading) {
      handleClose();
    } else {
      // Snap back
      modalRef.current.style.transform = 'translateY(0)';
    }
  }, [isDragging, currentY, startY, preventClose, isLoading, handleClose]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging && modalRef.current) {
      setIsDragging(false);
      const delta = currentY - startY;
      if (delta > dragThreshold && !preventClose && !isLoading) {
        handleClose();
      } else {
        modalRef.current.style.transform = 'translateY(0)';
      }
    }
  }, [isDragging, currentY, startY, preventClose, isLoading, handleClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      ref={backdropRef}
      className={`fixed inset-0 z-[9999] ${useBottomSheet ? 'flex items-end justify-center p-4' : 'flex items-center justify-center p-4'}`}
      onClick={handleBackdropClick}
      role="presentation"
      aria-hidden="true"
      style={{ 
        backgroundColor: colors.backdrop,
        backdropFilter: 'blur(8px)',
        willChange: 'opacity'
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.text.primary }} />
            </div>
            {loadingText && (
              <p className="text-sm text-white">{loadingText}</p>
            )}
          </div>
        </div>
      )}

      <div
        ref={modalRef}
        className={`
          w-full overflow-hidden border shadow-2xl
          ${responsive.modal[viewport]}
          ${useBottomSheet ? 'rounded-t-3xl rounded-b-none pb-safe-bottom' : 'rounded-2xl'}
          max-h-[92vh]
          ${maxWidth}
          ${isLoading ? 'opacity-80' : ''}
          transition-transform duration-300 ease-out
        `}
        style={{ 
          backgroundColor: colors.background, 
          borderColor: colors.border.default,
          willChange: 'transform, opacity',
          touchAction: 'pan-y'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? descriptionId : undefined}
        aria-busy={isLoading}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={useBottomSheet ? handleTouchStart : undefined}
        onTouchMove={useBottomSheet ? handleTouchMove : undefined}
        onTouchEnd={useBottomSheet ? handleTouchEnd : undefined}
      >
        {showHandle && useBottomSheet && (
          <div 
            className="flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing touch-none select-none"
            aria-hidden="true"
            onMouseDown={useBottomSheet ? handleMouseDown : undefined}
            onMouseMove={useBottomSheet ? handleMouseMove : undefined}
            onMouseUp={useBottomSheet ? handleMouseUp : undefined}
            onMouseLeave={useBottomSheet ? handleMouseLeave : undefined}
          >
            <div 
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: colors.text.accent }}
            />
          </div>
        )}

        <div className="flex flex-col h-full">
          <div 
            className={`
              overflow-y-auto flex-1
              ${useBottomSheet ? 'px-6' : responsive.padding[viewport]}
              ${useBottomSheet ? 'pb-6' : ''}
              ${responsive.gap[viewport]}
              overscroll-contain
            `}
          >
            {/* Header */}
            {(title || subtitle || showCloseButton) && (
              <div
                className={`flex justify-between items-start mb-6 ${useBottomSheet ? 'pt-2' : ''}`}
                data-modal-stagger
              >
                <div className="flex-1">
                  {title && (
                    <h2
                      id={titleId}
                      className={`mb-2 ${useBottomSheet ? 'text-xl' : responsive.heading[viewport]} font-bold leading-tight`}
                      style={{ color: colors.text.primary }}
                    >
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p
                      id={descriptionId}
                      className={`${useBottomSheet ? 'text-sm' : responsive.body[viewport]} leading-relaxed`}
                      style={{ color: colors.text.muted }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
                
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    className="rounded-full p-1.5 transition-all duration-200 hover:scale-110 active:scale-95 ml-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.border.default,
                      borderWidth: '1px'
                    }}
                    aria-label="Close modal"
                    disabled={preventClose || isLoading}
                  >
                    <X 
                      className="w-4 h-4"
                      style={{ color: colors.text.primary }}
                    />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={isLoading ? 'opacity-60 pointer-events-none' : ''} data-modal-stagger>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

BaseModal.displayName = 'BaseModal';
