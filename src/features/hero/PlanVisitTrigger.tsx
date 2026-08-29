'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { CalendarDays } from 'lucide-react';

import { cn } from '@/lib/cn';
import {
  buttonClass,
  type ButtonVariant,
  type ButtonSize,
} from '@/shared/ui/button';
import { requestPlanVisit } from './planVisitEvent';

export default function PlanVisitTrigger({
  children = 'Plan your visit',
  className,
  icon = true,
  variant = 'primary',
  size = 'md',
  /** Render as a bare element (text link / nav item) — skips button styling. */
  plain = false,
  onClick,
  ...buttonProps
}: {
  children?: ReactNode;
  className?: string;
  icon?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  plain?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>) {
  return (
    <button
      {...buttonProps}
      type="button"
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) requestPlanVisit();
      }}
      className={plain ? cn(className) : buttonClass(variant, size, className)}
    >
      {icon ? <CalendarDays className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
