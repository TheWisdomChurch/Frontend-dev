'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white/60">
          {label}
          {required && (
            <span className="ml-1 text-[var(--status-error)]">*</span>
          )}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs leading-5 text-rose-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export type { FormFieldProps };
