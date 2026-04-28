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
  xs: 'py-6 sm:py-8',
  sm: 'py-8 sm:py-10 lg:py-12',
  md: 'py-10 sm:py-12 lg:py-16',
  lg: 'py-12 sm:py-16 lg:py-20',
  xl: 'py-14 sm:py-20 lg:py-24',
  '2xl': 'py-16 sm:py-24 lg:py-28',
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
        className={cn(
          'relative w-full min-w-0 overflow-hidden',
          paddingClasses[padding],
          fullHeight && 'min-h-screen',
          centered && 'flex items-center',
          perf === 'auto' && 'perf-section',
          className
        )}
        style={style}
      >
        <div className="relative z-10 w-full min-w-0">{children}</div>
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
