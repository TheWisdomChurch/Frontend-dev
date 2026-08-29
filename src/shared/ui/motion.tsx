'use client';

import type { ReactNode } from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';

/* ── Motion tokens — the one easing curve, duration, distance, and stagger
      scale for every animation in the app. Tuned for an expressive entrance:
      longer travel, a touch of scale, a slower settle. ───────────────────── */

export const motionEase = [0.19, 1, 0.22, 1] as const;

export const motionDuration = {
  fast: 0.32,
  base: 0.62,
  slow: 0.92,
} as const;

export const motionDistance = {
  subtle: 18,
  base: 44,
  expressive: 72,
} as const;

export const motionStagger = {
  tight: 0.06,
  base: 0.1,
  relaxed: 0.15,
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
  hidden: { opacity: 0, y: motionDistance.base, scale: 0.965 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: motionDuration.slow, ease: motionEase },
  },
};

export const staggerViewport = { once: true, amount: 0.2 } as const;

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
      initial={{ opacity: 0, y, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: motionEase }}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </motion.div>
  );
}
