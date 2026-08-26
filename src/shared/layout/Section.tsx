import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type SectionPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface SectionProps {
  children: React.ReactNode;
  padding?: SectionPadding;
  className?: string;
  fullHeight?: boolean;
  centered?: boolean;
  style?: React.CSSProperties;
  id?: string;
  perf?: 'auto' | 'none';
}

const paddingClasses: Record<SectionPadding, string> = {
  none: '',
  xs: 'py-section-xs',
  sm: 'py-section-xs lg:py-section-sm',
  md: 'py-section-sm',
  lg: 'py-section-sm lg:py-section-md',
  xl: 'py-section-md',
  '2xl': 'py-section-md lg:py-section-lg',
};

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      padding = 'lg',
      className,
      fullHeight = false,
      centered = false,
      style,
      id,
      perf = 'none',
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        id={id}
        suppressHydrationWarning
        className={cn(
          'relative w-full min-w-0 overflow-hidden border-b border-current/10',
          paddingClasses[padding],
          fullHeight && 'min-h-screen',
          centered && 'flex items-center',
          perf === 'auto' && 'perf-section',
          className
        )}
        style={style}
      >
        <div className="relative z-10 w-full min-w-0" suppressHydrationWarning>
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
