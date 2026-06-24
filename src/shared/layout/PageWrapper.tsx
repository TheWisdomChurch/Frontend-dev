import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PageWrapperProps {
  hero?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({
  hero,
  children,
  className,
}: PageWrapperProps) {
  return (
    <main
      className={cn(
        'min-h-screen bg-[var(--app-surface)] text-white',
        className
      )}
    >
      {hero}
      {children}
    </main>
  );
}
