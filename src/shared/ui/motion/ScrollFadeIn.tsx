'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { motion } from '@/lib/safe-motion';

interface ScrollFadeInProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}

export function ScrollFadeIn({
  children,
  delay = 0,
  y = 24,
  duration = 0.65,
  once = true,
  ...props
}: ScrollFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.22 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
