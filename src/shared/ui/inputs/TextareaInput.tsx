'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            'min-h-[130px] w-full resize-y rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-7 text-white outline-none transition',
            'placeholder:text-white/35',
            'hover:border-white/20',
            'focus:border-[var(--app-primary)]/70 focus:bg-black/45 focus:ring-4 focus:ring-[var(--app-primary)]/10',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error &&
              'border-[var(--status-error)]/60 focus:border-[var(--status-error)]/70 focus:ring-[var(--status-error)]/10',
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

TextareaInput.displayName = 'TextareaInput';

export default TextareaInput;
export type { TextareaInputProps };
