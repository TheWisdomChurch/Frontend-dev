'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Users } from 'lucide-react';

import {
  buttonClass,
  type ButtonVariant,
  type ButtonSize,
} from '@/shared/ui/button';
import { requestCommunityJoin } from './communityJoinEvent';

type Props = {
  children?: ReactNode;
  className?: string;
  icon?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;

export default function CommunityJoinTrigger({
  children = 'Join our community',
  className,
  icon = true,
  variant = 'outline',
  size = 'md',
  onClick,
  ...buttonProps
}: Props) {
  return (
    <button
      {...buttonProps}
      type="button"
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) requestCommunityJoin();
      }}
      className={buttonClass(variant, size, className)}
    >
      {icon ? <Users className="h-4 w-4 shrink-0" /> : null}
      <span className="min-w-0 break-words">{children}</span>
    </button>
  );
}
