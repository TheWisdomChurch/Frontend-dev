'use client';

import type { ReactNode } from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from '@/lib/safe-motion';

/* ── Motion tokens — the one easing curve, duration, distance, and stagger
      scale for every animation in the app. ───────────────────────────────── */

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const motionDuration = {
  fast: 0.24,
  base: 0.48,
  slow: 0.72,
} as const;

export const motionDistance = {
  subtle: 12,
  base: 24,
  expressive: 36,
} as const;

export const motionStagger = {
  tight: 0.045,
  base: 0.08,
  relaxed: 0.12,
} as const;

/* ── Scroll-reveal cascade — a section wraps its content in `staggerContainer`
      (whileInView) and marks each direct child with `staggerItem`. ────────── */

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: motionStagger.relaxed,
      delayChildren: motionStagger.tight,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.slow, ease: motionEase },
  },
};

export const staggerViewport = { once: true, amount: 0.25 } as const;

/* ── ScrollFadeIn — the single reveal primitive. ──────────────────────────── */

interface ScrollFadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}

export function ScrollFadeIn({
  children,
  delay = 0,
  y = motionDistance.base,
  duration = motionDuration.slow,
  once = true,
  ...props
}: ScrollFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.22 }}
      transition={{ duration, delay, ease: motionEase }}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </motion.div>
  );
}
