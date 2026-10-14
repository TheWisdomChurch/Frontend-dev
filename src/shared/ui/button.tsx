import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * The single button system. `<Button>` renders a real <button>; `buttonClass()`
 * produces the same styling for an <a>/<Link>. One shape (`--radius-button`),
 * four variants, four sizes.
 *
 * Theme behaviour — every variant works on a light section and inside
 * `.tone-dark` with no prop:
 *  - `primary`  gold fill, always-dark label (gold is a light colour in both themes)
 *  - `solid`    high-contrast fill that inverts with the surface (ink→surface tokens)
 *  - `outline`  / `ghost`  borrow `currentColor`, so they read on any surface
 */

export type ButtonVariant = 'primary' | 'solid' | 'dark' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-button font-ui font-semibold leading-none tracking-[-0.01em] outline-none transition-[transform,background-color,border-color,box-shadow,color,filter] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)] disabled:pointer-events-none disabled:opacity-55 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]';

const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 py-2 text-caption font-semibold',
  md: 'min-h-11 px-5 py-2.5 text-body-sm font-semibold',
  lg: 'min-h-11 sm:min-h-12 px-6 sm:px-7 py-2.5 sm:py-3 text-body-sm sm:text-body-md font-semibold',
  icon: 'h-11 w-11 min-h-11 min-w-11 p-0',
};

const solid =
  'bg-[var(--app-ink)] text-[var(--app-surface-solid)] shadow-sm hover:bg-[var(--app-neutral)] hover:shadow-lg hover:shadow-black/25 active:shadow-sm active:scale-[0.98]';

const variantClass: Record<ButtonVariant, string> = {
  // Fill state: radiant warm gold pill with luminous hover and subtle micro-lift
  primary:
    'bg-[var(--app-primary)] text-[var(--app-dark)] shadow-sm hover:bg-[var(--app-primary-light)] hover:shadow-lg hover:shadow-black/20 hover:brightness-105 active:bg-[var(--app-primary)] active:shadow-sm active:scale-[0.98]',
  solid,
  // Back-compat alias — `dark` is the same high-contrast solid button.
  dark: solid,
  // Modern frosted glass outline: subtle hairline, backdrop blur, gold wash on hover
  outline:
    'border border-[color-mix(in_srgb,var(--app-primary)_55%,transparent)] bg-white/[0.03] backdrop-blur-sm text-current hover:border-[var(--app-primary)] hover:bg-[var(--app-primary-10)] hover:text-[var(--app-primary-dark)] hover:shadow-sm active:bg-[var(--app-primary-20)] active:scale-[0.98]',
  // Soft ghost hover pill
  ghost:
    'border border-transparent bg-transparent text-current hover:border-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] hover:bg-[var(--app-primary-10)] hover:text-[var(--app-primary-dark)] active:bg-[var(--app-primary-20)] active:scale-[0.98]',
};

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string
) {
  return cn(base, sizeClass[size], variantClass[variant], className);
}

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  elevated?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    elevated = false,
    leftIcon,
    rightIcon,
    className,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(
        variant,
        size,
        cn(
          '[&_svg]:h-4 [&_svg]:w-4',
          elevated && 'shadow-lg hover:shadow-xl',
          fullWidth && 'w-full',
          className
        )
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="shrink-0 animate-spin" aria-hidden="true" />
      ) : leftIcon ? (
        <span className="shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      {children ? <span className="min-w-0 truncate">{children}</span> : null}
      {!loading && rightIcon ? (
        <span className="shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      ) : null}
    </button>
  );
});

export default Button;
export { Button };
