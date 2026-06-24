import React from 'react';
import { cn } from '@/lib/cn';

interface GridBackgroundProps {
  className?: string;
}

export default function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0',
        'bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]',
        'bg-[size:56px_56px]',
        'opacity-25',
        className
      )}
    />
  );
}
