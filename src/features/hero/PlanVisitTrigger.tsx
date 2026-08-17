'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { CalendarDays } from 'lucide-react';

import { cn } from '@/lib/cn';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';
import { requestPlanVisit } from './planVisitEvent';

export default function PlanVisitTrigger({
  children = 'Plan your visit',
  className,
  icon = true,
  onClick,
  ...buttonProps
}: {
  children?: ReactNode;
  className?: string;
  icon?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>) {
  const { trackEvent } = useAnalytics();

  return (
    <button
      {...buttonProps}
      type="button"
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          trackEvent('plan_visit_opened');
          requestPlanVisit();
        }
      }}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--app-primary)] bg-[var(--app-primary)] px-6 font-ui text-sm font-bold text-black transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--app-primary)]/25',
        className
      )}
    >
      {icon ? <CalendarDays className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
