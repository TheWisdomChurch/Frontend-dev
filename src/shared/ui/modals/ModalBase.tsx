'use client';

import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/cn';

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
  forceBottomSheet?: boolean;
}

export const modalStyles = {
  sectionTitle: 'text-xs font-bold uppercase tracking-[0.18em] text-[#f7de12]',
  label:
    'mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white/60',
  input:
    'min-h-12 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-[#f7de12]/70 focus:bg-black/45 focus:ring-4 focus:ring-[#f7de12]/10',
  select:
    'min-h-12 w-full rounded-2xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-white outline-none transition focus:border-[#f7de12]/70 focus:ring-4 focus:ring-[#f7de12]/10',
  textarea:
    'min-h-[130px] w-full resize-y rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-white/35 transition focus:border-[#f7de12]/70 focus:bg-black/45 focus:ring-4 focus:ring-[#f7de12]/10',
  errorText: 'mt-2 text-xs leading-5 text-rose-300',
  primaryButton:
    'inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#f7de12] px-6 text-sm font-extrabold text-black shadow-lg shadow-[#f7de12]/20 transition hover:-translate-y-0.5 hover:bg-[#ffe93d] disabled:cursor-not-allowed disabled:opacity-60',
  ghostButton:
    'inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-bold text-white/82 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60',
};

function getFocusableElements(element: HTMLElement): HTMLElement[] {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(node => node.offsetParent !== null);
}

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
  forceBottomSheet = false,
}: BaseModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const subtitleId = useId();

  const isSheet = forceBottomSheet;

  const canClose = !preventClose && !isLoading;

  const close = useCallback(() => {
    if (!canClose) return;
    onClose();
  }, [canClose, onClose]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !mounted) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen || !mounted) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const timer = window.setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const modal = modalRef.current;
      if (!modal) return;

      const focusables = getFocusableElements(modal);
      focusables[0]?.focus();
    }, 40);

    return () => {
      window.clearTimeout(timer);
      previousFocusRef.current?.focus?.();
      previousFocusRef.current = null;
    };
  }, [isOpen, mounted, initialFocusRef]);

  useEffect(() => {
    if (!isOpen || !mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscapeClose && canClose) {
        event.preventDefault();
        close();
      }

      if (event.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusables = getFocusableElements(modal);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mounted, onEscapeClose, canClose, close]);

  const modalClassName = useMemo(
    () =>
      cn(
        'relative flex w-full min-w-0 flex-col overflow-hidden border border-white/10 bg-[#070707]/95 text-white shadow-2xl shadow-black/55 backdrop-blur-xl',
        'motion-safe:animate-[modal-enter_220ms_ease-out]',
        isSheet
          ? 'max-h-[90svh] rounded-t-[1.75rem] rounded-b-none'
          : 'max-h-[88svh] rounded-[1.75rem] sm:max-h-[90vh]',
        maxWidth
      ),
    [isSheet, maxWidth]
  );

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex bg-black/72 px-3 py-4 backdrop-blur-md',
        isSheet
          ? 'items-end justify-center sm:items-center'
          : 'items-center justify-center'
      )}
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={modalRef}
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? subtitleId : undefined}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="absolute inset-0 z-30 grid place-items-center bg-black/65 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/45 px-5 py-4">
              <Loader2 className="h-6 w-6 animate-spin text-[#f7de12]" />
              <p className="text-sm text-white/75">{loadingText}</p>
            </div>
          </div>
        ) : null}

        {showHandle ? (
          <div className="flex justify-center px-4 pt-3 sm:hidden">
            <div className="h-1.5 w-12 rounded-full bg-white/22" />
          </div>
        ) : null}

        {title || subtitle || showCloseButton ? (
          <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="min-w-0">
              {title ? (
                <h2
                  id={titleId}
                  className="text-balance text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl"
                >
                  {title}
                </h2>
              ) : null}

              {subtitle ? (
                <p
                  id={subtitleId}
                  className="mt-2 text-sm leading-6 text-white/58"
                >
                  {subtitle}
                </p>
              ) : null}
            </div>

            {showCloseButton ? (
              <button
                type="button"
                onClick={close}
                disabled={!canClose}
                aria-label="Close modal"
                className="grid h-10 w-10 flex-none place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </header>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>

      <style jsx global>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 640px) {
          @keyframes modal-enter {
            from {
              opacity: 0;
              transform: translateY(100%);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </div>,
    document.body
  );
});

BaseModal.displayName = 'BaseModal';
