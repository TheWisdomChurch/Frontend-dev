'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'min-h-12 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition',
            'placeholder:text-white/35',
            'hover:border-white/20',
            'focus:border-[var(--app-primary)]/70 focus:bg-black/45 focus:ring-4 focus:ring-[var(--app-primary)]/10',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error &&
              'border-[var(--status-error)]/60 focus:border-[var(--status-error)]/70 focus:ring-[var(--status-error)]/10',
            icon && 'pl-11',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error && (
          <p className="mt-2 text-xs leading-5 text-rose-300" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
export type { TextInputProps };
