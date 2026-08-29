'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Info, X } from 'lucide-react';

interface PageTipCardProps {
  message: string;
  open: boolean;
  onDismiss: () => void;
}

export default function PageTipCard({
  message,
  open,
  onDismiss,
}: PageTipCardProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16, x: -8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.18 } }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="fixed inset-x-[var(--page-gutter)] bottom-[max(var(--page-gutter),env(safe-area-inset-bottom))] z-[70] flex items-start gap-3 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3.5 shadow-xl shadow-black/10 sm:left-[var(--page-gutter)] sm:right-auto sm:max-w-[320px]"
        >
          <div className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[var(--app-primary)]/12 text-[var(--app-primary-dark)]">
            <Info className="h-3.5 w-3.5" />
          </div>

          <p className="flex-1 pt-0.5 font-ui text-body-sm leading-[1.5] text-[var(--app-muted)]">
            {message}
          </p>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss tip"
            className="mt-0.5 grid h-5 w-5 flex-none place-items-center text-[var(--app-subtle)] transition hover:text-[var(--app-text)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
