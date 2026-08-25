'use client';

import type { ReactNode } from 'react';

import { motion } from '@/lib/safe-motion';
import { staggerItem } from '@/shared/ui/motion/staggerReveal';
import { cn } from '@/lib/cn';

export type SectionHeadingTone = 'light' | 'dark';
export type SectionHeadingSize = 'sm' | 'md' | 'lg';

const SIZE_CLASS: Record<SectionHeadingSize, string> = {
  sm: 'text-[clamp(1.9rem,3.1vw,2.75rem)]',
  md: 'text-[clamp(2.1rem,3.6vw,3.4rem)]',
  lg: 'text-[clamp(2.3rem,4vw,4.2rem)]',
};

// Headings only inherit color when nothing targets them directly — but
// globals.scss sets `h1..h6 { color: var(--app-text) }` on the tag itself,
// which always wins over color inherited from an ancestor section. Any
// heading built without its own explicit color class here silently renders
// near-black regardless of the section it sits in — so `tone` is required,
// not defaulted, to make that mistake impossible to reintroduce.
export function SectionHeading({
  children,
  tone,
  size = 'lg',
  className,
}: {
  children: ReactNode;
  tone: SectionHeadingTone;
  size?: SectionHeadingSize;
  className?: string;
}) {
  return (
    <motion.h2
      variants={staggerItem}
      className={cn(
        'text-balance font-headline font-semibold leading-[1.02] tracking-[-0.025em] transition-colors duration-300',
        SIZE_CLASS[size],
        tone === 'light' ? 'text-white' : 'text-[var(--app-ink)]',
        className
      )}
    >
      {children}
    </motion.h2>
  );
}

export function HeadingAccent({ children }: { children: ReactNode }) {
  return <span className="block text-[var(--app-primary)]">{children}</span>;
}
