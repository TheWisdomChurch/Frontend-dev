'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Quote, Sparkles, X, ArrowRight } from 'lucide-react';
import { buttonClass } from '@/shared/ui/button';
import { cn } from '@/lib/cn';
import type { TestimonialItem } from './testimonialsData';
import { initialsOf } from './testimonialsData';

interface TestimonialModalProps {
  testimony: TestimonialItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TestimonialModal({
  testimony,
  isOpen,
  onClose,
}: TestimonialModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!testimony) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-testimony-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-[var(--app-surface)] text-[var(--app-ink)] shadow-2xl dark:bg-[var(--app-dark)] dark:text-white"
          >
            {/* Top decorative accent glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-[var(--app-primary-20)] blur-3xl opacity-70"
            />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-[var(--app-border)]/80 px-6 py-5 sm:px-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--app-primary)]/30 bg-[color-mix(in_srgb,var(--app-primary)_12%,transparent)] px-3 py-1 font-ui text-xs font-semibold text-[var(--app-primary)]">
                  <Sparkles className="h-3 w-3" />
                  {testimony.category}
                </span>
                <span className="inline-flex items-center gap-1 font-ui text-xs font-medium text-[var(--app-subtle)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--status-success)]" />
                  Verified Testimony
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-border)] text-[var(--app-subtle)] transition hover:border-[var(--app-primary)] hover:bg-[var(--app-primary-10)] hover:text-[var(--app-ink)] dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="relative max-h-[65vh] overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <div className="mb-4 text-[var(--app-primary)]">
                <Quote className="h-8 w-8 opacity-80" />
              </div>

              <blockquote className="font-headline text-lg sm:text-xl font-normal leading-relaxed text-[var(--app-ink)] dark:text-[var(--app-on-dark)]">
                &ldquo;{testimony.quote}&rdquo;
              </blockquote>

              {/* Author attribution */}
              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-[var(--app-border)]/60 bg-[var(--app-canvas-2)]/60 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)] font-ui text-sm font-bold text-black ring-2 ring-white/20 shadow-md">
                  {initialsOf(testimony.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    id="modal-testimony-title"
                    className="font-ui text-base font-bold text-[var(--app-ink)] dark:text-white"
                  >
                    {testimony.name}
                  </p>
                  <p className="font-ui text-xs text-[var(--app-subtle)]">
                    {testimony.role}{' '}
                    {testimony.date ? `· ${testimony.date}` : ''}
                  </p>
                </div>
              </div>

              {/* Scripture banner */}
              <div className="mt-6 rounded-xl border border-[var(--app-primary)]/20 bg-[color-mix(in_srgb,var(--app-primary)_8%,transparent)] p-3.5 text-center">
                <p className="font-ui text-xs italic text-[var(--app-subtle)]">
                  &ldquo;They overcame him by the blood of the Lamb and by the
                  word of their testimony.&rdquo; — Revelation 12:11
                </p>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="relative flex flex-col gap-3 border-t border-[var(--app-border)]/80 bg-[var(--app-surface-solid)]/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <Link
                href="/forms/share-testimony"
                onClick={onClose}
                className={cn(buttonClass('primary', 'sm'), 'gap-2')}
              >
                Share your story <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className={buttonClass('outline', 'sm')}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
