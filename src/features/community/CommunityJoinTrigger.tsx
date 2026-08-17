'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Users } from 'lucide-react';

import { cn } from '@/lib/cn';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';
import { requestCommunityJoin } from './communityJoinEvent';

type Props = {
  children?: ReactNode;
  className?: string;
  icon?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;

export default function CommunityJoinTrigger({
  children = 'Join our community',
  className,
  icon = true,
  onClick,
  ...buttonProps
}: Props) {
  const { trackEvent } = useAnalytics();

  return (
    <button
      {...buttonProps}
      type="button"
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          trackEvent('community_connection_opened');
          requestCommunityJoin();
        }
      }}
      className={cn(
        'inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-full border border-black/25 px-5 py-3 text-center font-ui text-sm font-bold leading-5 transition hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--app-primary)]/25',
        className
      )}
    >
      {icon ? <Users className="h-4 w-4 shrink-0" /> : null}
      <span className="min-w-0 break-words">{children}</span>
    </button>
  );
}
