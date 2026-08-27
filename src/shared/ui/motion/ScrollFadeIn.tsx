'use client';

import type { ReactNode } from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from '@/lib/safe-motion';
import { motionDistance, motionDuration, motionEase } from './tokens';

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
