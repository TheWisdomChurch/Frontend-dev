'use client';

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent-yellow'
  | 'accent-orange'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'dark';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  elevated?: boolean;
  curvature?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const baseClasses =
  'group relative inline-flex min-w-0 shrink-0 items-center justify-center overflow-hidden border font-bold outline-none transition-all duration-300 ease-out focus-visible:ring-4 focus-visible:ring-[#f7de12]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none disabled:transform-none';

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'min-h-8 px-3 text-xs gap-1.5',
  sm: 'min-h-9 px-3.5 text-xs sm:text-sm gap-2',
  md: 'min-h-11 px-5 text-sm gap-2',
  lg: 'min-h-12 px-6 text-sm sm:text-[0.95rem] gap-2.5',
  xl: 'min-h-14 px-7 text-base gap-3',
  icon: 'h-11 w-11 p-0',
};

const radiusClasses = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-[1.25rem]',
  full: 'rounded-full',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-[#f7de12] bg-[#f7de12] text-black shadow-[#f7de12]/20 hover:border-[#ffe93d] hover:bg-[#ffe93d]',
  'accent-yellow':
    'border-[#f7de12] bg-[#f7de12] text-black shadow-[#f7de12]/20 hover:border-[#ffe93d] hover:bg-[#ffe93d]',
  'accent-orange':
    'border-orange-500 bg-orange-500 text-white shadow-orange-500/20 hover:border-orange-400 hover:bg-orange-400',
  secondary:
    'border-white/10 bg-white/[0.07] text-white hover:border-white/20 hover:bg-white/[0.11]',
  outline:
    'border-white/15 bg-transparent text-white hover:border-[#f7de12]/50 hover:bg-[#f7de12]/10 hover:text-[#f7de12]',
  ghost:
    'border-transparent bg-transparent text-white/78 hover:bg-white/[0.08] hover:text-white',
  dark: 'border-white/10 bg-black/55 text-white hover:border-white/20 hover:bg-black/75',
  danger:
    'border-rose-500 bg-rose-500 text-white shadow-rose-500/20 hover:border-rose-400 hover:bg-rose-400',
  success:
    'border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-400',
};

const interactiveClasses =
  'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]';

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: '[&_svg]:h-3.5 [&_svg]:w-3.5',
  sm: '[&_svg]:h-4 [&_svg]:w-4',
  md: '[&_svg]:h-4 [&_svg]:w-4',
  lg: '[&_svg]:h-5 [&_svg]:w-5',
  xl: '[&_svg]:h-5 [&_svg]:w-5',
  icon: '[&_svg]:h-5 [&_svg]:w-5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      elevated = false,
      curvature = 'full',
      className,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onClick={handleClick}
        className={cn(
          baseClasses,
          sizeClasses[size],
          radiusClasses[curvature],
          variantClasses[variant],
          iconSizeClasses[size],
          !isDisabled && interactiveClasses,
          elevated && 'shadow-lg hover:shadow-xl',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />

        <span className="relative z-10 flex min-w-0 items-center justify-center gap-inherit">
          {loading ? (
            <Loader2 className="shrink-0 animate-spin" aria-hidden="true" />
          ) : leftIcon ? (
            <span className="shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          ) : null}

          {children ? (
            <span className="min-w-0 truncate whitespace-nowrap">
              {children}
            </span>
          ) : null}

          {!loading && rightIcon ? (
            <span
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          ) : null}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
