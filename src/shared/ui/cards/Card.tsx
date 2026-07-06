'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type CardVariant = 'default' | 'elevated' | 'interactive' | 'glass';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  className?: string;
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantClasses: Record<CardVariant, string> = {
  default: 'rounded-[1.5rem] border border-white/10 bg-white/[0.045]',
  elevated:
    'rounded-[1.5rem] border border-white/10 bg-white/[0.045] shadow-[0_18px_55px_rgba(0,0,0,0.35)]',
  interactive:
    'rounded-[1.5rem] border border-white/10 bg-white/[0.045] shadow-[0_18px_55px_rgba(0,0,0,0.35)] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_65px_rgba(0,0,0,0.45)]',
  glass:
    'rounded-[1.5rem] border border-white/10 bg-white/[0.045] shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', padding = 'md', className, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
export type { CardProps, CardVariant, CardPadding };
