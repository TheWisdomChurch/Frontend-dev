import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface StackProps {
  children: ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

const gapMap: Record<NonNullable<StackProps['gap']>, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
};

const alignMap: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export default function Stack({
  children,
  gap = 'md',
  align = 'stretch',
  className,
}: StackProps) {
  return (
    <div
      className={cn('flex flex-col', gapMap[gap], alignMap[align], className)}
    >
      {children}
    </div>
  );
}
