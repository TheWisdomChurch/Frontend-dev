'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  placeholder?: string;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className, error, children, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn(
            'min-h-12 w-full rounded-2xl border border-white/10 bg-[var(--app-surface-2)] px-4 py-3 text-sm text-white outline-none transition',
            'hover:border-white/20',
            'focus:border-[var(--app-primary)]/70 focus:ring-4 focus:ring-[var(--app-primary)]/10',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--status-error)]/60',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        {error && (
          <p className="mt-2 text-xs leading-5 text-rose-300" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export default SelectInput;
export type { SelectInputProps };
