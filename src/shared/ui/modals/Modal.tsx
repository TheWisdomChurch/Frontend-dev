'use client';

import { memo, ReactNode, useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  motion,
  useDragControls,
  type PanInfo,
} from 'framer-motion';
import { CheckCircle2, Clock, Loader2, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { H2, H3, BodySM } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';
import { useIsClient, useMediaQuery } from '@/hooks';

// A drag past this distance, or a fast-enough flick, dismisses the sheet.
const DRAG_CLOSE_OFFSET = 120;
const DRAG_CLOSE_VELOCITY = 500;

// Portalled dialogs share one document body. Coordinating them here prevents
// one modal from unlocking page scroll or handling Escape while another modal
// is still open above it.
const openModalStack: string[] = [];
let bodyOverflowBeforeModal = '';
let bodyPaddingRightBeforeModal = '';

function registerOpenModal(id: string) {
  const existingIndex = openModalStack.indexOf(id);
  if (existingIndex >= 0) openModalStack.splice(existingIndex, 1);

  if (openModalStack.length === 0) {
    const body = document.body;
    bodyOverflowBeforeModal = body.style.overflow;
    bodyPaddingRightBeforeModal = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
  }

  openModalStack.push(id);
}

function unregisterOpenModal(id: string) {
  const index = openModalStack.lastIndexOf(id);
  if (index >= 0) openModalStack.splice(index, 1);

  if (openModalStack.length === 0) {
    document.body.style.overflow = bodyOverflowBeforeModal;
    document.body.style.paddingRight = bodyPaddingRightBeforeModal;
  }
}

function isTopModal(id: string) {
  return openModalStack.at(-1) === id;
}

// ---------------------------------------------------------------------------
// Style tokens shared across all modal content
// ---------------------------------------------------------------------------

export const modalStyles = {
  sectionTitle:
    'text-[0.6875rem] font-extrabold uppercase tracking-[0.2em] text-[var(--app-primary)]',
  label:
    'mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white/58',
  input:
    'min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 transition-[border-color,background-color,box-shadow] duration-200 hover:border-white/16 focus:border-[var(--app-primary)]/65 focus:bg-white/[0.075] focus:ring-4 focus:ring-[var(--app-primary)]/10',
  select:
    'min-h-12 w-full rounded-xl border border-white/10 bg-[#15120f] px-4 py-3 text-sm text-white outline-none transition-[border-color,background-color,box-shadow] duration-200 hover:border-white/16 focus:border-[var(--app-primary)]/65 focus:ring-4 focus:ring-[var(--app-primary)]/10',
  textarea:
    'min-h-[130px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-white/35 transition-[border-color,background-color,box-shadow] duration-200 hover:border-white/16 focus:border-[var(--app-primary)]/65 focus:bg-white/[0.075] focus:ring-4 focus:ring-[var(--app-primary)]/10',
  errorText:
    'mt-2 rounded-lg border border-rose-300/15 bg-rose-300/[0.07] px-3 py-2 text-xs leading-5 text-rose-200',
  primaryButton:
    'inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--app-primary)] px-6 text-sm font-extrabold text-black shadow-[0_12px_30px_rgba(201,150,26,.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--app-primary-hover)] hover:shadow-[0_16px_36px_rgba(201,150,26,.28)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
  ghostButton:
    'inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.045] px-6 text-sm font-bold text-white/82 transition duration-200 hover:border-white/20 hover:bg-white/[0.085] hover:text-white disabled:cursor-not-allowed disabled:opacity-60',
};

// ---------------------------------------------------------------------------
// BaseModal — the single modal shell used by all modal variants
// ---------------------------------------------------------------------------

export interface BaseModalProps {
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
  tone?: 'dark' | 'light';
  contentClassName?: string;
  ariaLabel?: string;
  headerIcon?: ReactNode;
}

function getFocusableElements(element: HTMLElement): HTMLElement[] {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(node => node.offsetParent !== null);
}

// ---------------------------------------------------------------------------
// ModalPanel — backdrop + draggable sheet/dialog panel.
// Mounted only while open (inside AnimatePresence) so its drag motion value
// always starts fresh, and so both open and close get a real transition.
// ---------------------------------------------------------------------------

interface ModalPanelProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  titleId: string;
  subtitleId: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  showCloseButton: boolean;
  showHandle: boolean;
  maxWidth: string;
  isLoading: boolean;
  loadingText: string;
  isSheet: boolean;
  dragEnabled: boolean;
  canClose: boolean;
  close: () => void;
  tone: 'dark' | 'light';
  contentClassName?: string;
  ariaLabel?: string;
  headerIcon?: ReactNode;
}

function ModalPanel({
  modalRef,
  titleId,
  subtitleId,
  title,
  subtitle,
  children,
  showCloseButton,
  showHandle,
  maxWidth,
  isLoading,
  loadingText,
  isSheet,
  dragEnabled,
  canClose,
  close,
  tone,
  contentClassName,
  ariaLabel,
  headerIcon,
}: ModalPanelProps) {
  const dragControls = useDragControls();

  const startDrag = useCallback(
    (event: React.PointerEvent) => {
      if (!dragEnabled) return;
      dragControls.start(event);
    },
    [dragEnabled, dragControls]
  );

  const handleDragEnd = useCallback(
    (_event: PointerEvent, info: PanInfo) => {
      if (
        info.offset.y > DRAG_CLOSE_OFFSET ||
        info.velocity.y > DRAG_CLOSE_VELOCITY
      ) {
        close();
      }
    },
    [close]
  );

  // Sheet-specific corner treatment and slide-from-bottom entrance only
  // apply when the modal is actually rendering as a mobile bottom sheet
  // (isSheet && isMobile, i.e. dragEnabled) — desktop always gets a clean
  // centered dialog with rounded corners and a fade+scale entrance, even
  // for sheet-enabled modals.
  const panelVariants = dragEnabled
    ? {
        initial: { opacity: 0, y: '100vh' },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: '100vh' },
      }
    : {
        initial: { opacity: 0, y: 12, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
      };

  const modalClassName = cn(
    'relative isolate flex w-full min-w-0 flex-col overflow-hidden border shadow-[0_32px_110px_rgba(0,0,0,.68)]',
    tone === 'light'
      ? 'border-black/10 bg-[linear-gradient(155deg,#ffffff_0%,#fbfaf7_100%)] text-black'
      : 'border-white/[0.11] bg-[linear-gradient(155deg,#1b1712_0%,#100d0a_48%,#090806_100%)] text-white ring-1 ring-black/30',
    dragEnabled
      ? 'max-h-[calc(100dvh-0.5rem)] rounded-t-[1.75rem] rounded-b-none'
      : 'max-h-[calc(100dvh-1rem)] rounded-[1.5rem] sm:max-h-[min(90dvh,880px)] sm:rounded-[2rem]',
    maxWidth
  );

  return (
    <motion.div
      className={cn(
        'fixed inset-0 z-[11000] flex min-w-0 bg-[rgba(7,5,3,0.76)] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-[10px] sm:px-5 sm:py-5',
        isSheet
          ? 'items-end justify-center px-0 pb-0 sm:items-center sm:px-4 sm:pb-4'
          : 'items-center justify-center'
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="presentation"
      onPointerDown={event => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <motion.div
        ref={modalRef}
        className={modalClassName}
        variants={panelVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: 'spring', damping: 32, stiffness: 340 }}
        drag={dragEnabled ? 'y' : false}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.55 }}
        onDragEnd={handleDragEnd}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        aria-describedby={subtitle ? subtitleId : undefined}
        aria-busy={isLoading}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[var(--app-primary)]/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 -z-10 h-64 w-64 rounded-full bg-[var(--app-primary)]/[0.09] blur-3xl"
        />
        {isLoading ? (
          <div className="absolute inset-0 z-30 grid place-items-center bg-black/72 px-6 backdrop-blur-md">
            <div className="flex min-w-52 flex-col items-center gap-3 rounded-2xl border border-white/12 bg-[#15110d]/95 px-6 py-5 text-center shadow-2xl">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--app-primary)]/20 bg-[var(--app-primary)]/10">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--app-primary)]" />
              </span>
              <BodySM className="text-white/75">{loadingText}</BodySM>
            </div>
          </div>
        ) : null}

        {showHandle ? (
          <div
            onPointerDown={startDrag}
            className={cn(
              'flex justify-center px-4 pb-1 pt-3.5 sm:hidden',
              dragEnabled && 'cursor-grab touch-none active:cursor-grabbing'
            )}
          >
            <div className="h-1 w-11 rounded-full bg-white/25" />
          </div>
        ) : null}

        {title || subtitle || showCloseButton ? (
          <header
            className={cn(
              'relative flex min-w-0 items-start justify-between gap-4 border-b px-5 pb-5 pt-4 sm:gap-6 sm:px-8 sm:pb-6 sm:pt-7',
              tone === 'light'
                ? 'border-black/[0.07] bg-black/[0.012]'
                : 'border-white/[0.08] bg-white/[0.022]',
              dragEnabled && 'sm:touch-auto'
            )}
          >
            <div className="flex min-w-0 flex-1 items-start gap-3.5 break-words sm:gap-4">
              {title ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border shadow-inner sm:h-11 sm:w-11 sm:rounded-2xl [&_svg]:h-[1.125rem] [&_svg]:w-[1.125rem]',
                    tone === 'light'
                      ? 'border-[var(--app-primary)]/20 bg-[var(--app-primary)]/10 text-[var(--app-primary-dark)]'
                      : 'border-[var(--app-primary)]/20 bg-[var(--app-primary)]/10 text-[var(--app-primary-light)]'
                  )}
                >
                  {headerIcon || <Sparkles />}
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                {title ? (
                  <h2
                    id={titleId}
                    className={cn(
                      'break-words font-headline text-[clamp(1.4rem,6vw,2rem)] font-normal leading-[1.12] tracking-[-0.02em]',
                      tone === 'light' ? 'text-black' : 'text-white'
                    )}
                  >
                    {title}
                  </h2>
                ) : null}

                {subtitle ? (
                  <p
                    id={subtitleId}
                    className={cn(
                      'mt-2.5 max-w-xl break-words font-ui text-xs leading-5 sm:text-sm sm:leading-6',
                      tone === 'light' ? 'text-black/55' : 'text-white/52'
                    )}
                  >
                    {subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            {showCloseButton ? (
              <button
                type="button"
                onClick={close}
                onPointerDown={event => event.stopPropagation()}
                disabled={!canClose}
                aria-label="Close modal"
                className={cn(
                  'grid h-10 w-10 flex-none place-items-center rounded-full border transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--app-primary)]/15 disabled:cursor-not-allowed disabled:opacity-50',
                  tone === 'light'
                    ? 'border-black/10 bg-black/[0.025] text-black/55 hover:rotate-3 hover:bg-black hover:text-white'
                    : 'border-white/10 bg-white/[0.045] text-white/55 hover:rotate-3 hover:border-white/18 hover:bg-white/[0.1] hover:text-white'
                )}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </header>
        ) : null}

        <div
          className={cn(
            'modal-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pb-8 sm:pt-7',
            contentClassName
          )}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
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
  tone = 'dark',
  contentClassName,
  ariaLabel,
  headerIcon,
}: BaseModalProps) {
  const mounted = useIsClient();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const subtitleId = useId();
  const modalId = useId();
  const isMobile = useMediaQuery('(max-width: 639px)');

  // Every dialog becomes a bottom sheet on phones. `forceBottomSheet` keeps
  // that treatment available to callers while wider viewports stay centered.
  const isSheet = forceBottomSheet || isMobile;
  const dragEnabled = isSheet && isMobile;
  const canClose = !preventClose && !isLoading;

  const close = useCallback(() => {
    if (!canClose || !isTopModal(modalId)) return;
    onClose();
  }, [canClose, modalId, onClose]);

  useEffect(() => {
    if (!isOpen || !mounted) return;

    registerOpenModal(modalId);
    return () => unregisterOpenModal(modalId);
  }, [isOpen, modalId, mounted]);

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
      if (!isTopModal(modalId)) return;

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
  }, [isOpen, mounted, onEscapeClose, canClose, close, modalId]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <ModalPanel
          key="modal-panel"
          modalRef={modalRef}
          titleId={titleId}
          subtitleId={subtitleId}
          title={title}
          subtitle={subtitle}
          showCloseButton={showCloseButton}
          showHandle={showHandle}
          maxWidth={maxWidth}
          isLoading={isLoading}
          loadingText={loadingText}
          isSheet={isSheet}
          dragEnabled={dragEnabled}
          canClose={canClose}
          close={close}
          tone={tone}
          contentClassName={contentClassName}
          ariaLabel={ariaLabel}
          headerIcon={headerIcon}
        >
          {children}
        </ModalPanel>
      ) : null}
    </AnimatePresence>,
    document.body
  );
});

BaseModal.displayName = 'BaseModal';

// ---------------------------------------------------------------------------
// SuccessModal — pass title, message, and actionLabel as props
// ---------------------------------------------------------------------------

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = 'Submission successful',
  message = 'Your information has been received. Thank you!',
  actionLabel = 'Done',
}: SuccessModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      showCloseButton={false}
      forceBottomSheet
    >
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <H2 className="mt-5 text-white">{title}</H2>

        <BodySM className="mt-3 text-white/65">{message}</BodySM>

        <Button variant="primary" onClick={onClose} className="mt-7 w-full">
          {actionLabel}
        </Button>
      </div>
    </BaseModal>
  );
}

// ---------------------------------------------------------------------------
// ServiceUnavailableSheet — temporary "coming soon" alert sheet
// ---------------------------------------------------------------------------

export interface ServiceUnavailableSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
}

export function ServiceUnavailableSheet({
  isOpen,
  onClose,
  title = 'Service not available yet',
  message = 'We are polishing this experience for production. Please check back soon.',
  actionLabel = 'Got it',
}: ServiceUnavailableSheetProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      showHandle
      showCloseButton={false}
      forceBottomSheet
      maxWidth="max-w-lg"
    >
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--app-primary)]/15 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-label font-bold uppercase tracking-[0.18em] text-white/75">
            <Sparkles className="h-3.5 w-3.5 text-[var(--app-primary)]" />
            Heads up
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close modal"
            className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.06] text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative mt-5">
          <H3 className="text-white">{title}</H3>
          <BodySM className="mt-2 text-white/65">{message}</BodySM>
        </div>

        <div className="relative mt-5 flex gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white/58">
          <Clock className="mt-0.5 h-4 w-4 flex-none text-[var(--app-primary)]" />
          <span>We will reopen this shortly. Thanks for your patience.</span>
        </div>

        <Button variant="primary" onClick={onClose} className="mt-6 w-full">
          {actionLabel}
        </Button>
      </div>
    </BaseModal>
  );
}
