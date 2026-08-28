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
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-button font-ui font-semibold leading-none tracking-[-0.01em] outline-none transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)] disabled:pointer-events-none disabled:opacity-55 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97]';

const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 text-body-sm',
  md: 'min-h-11 px-5 text-body-md',
  lg: 'min-h-12 px-7 text-body-lg',
  icon: 'h-11 w-11 p-0',
};

const solid =
  'bg-[var(--app-ink)] text-[var(--app-surface-solid)] shadow-sm hover:bg-[var(--app-ink)]/88 hover:shadow-lg hover:shadow-black/25 active:shadow-sm';

const variantClass: Record<ButtonVariant, string> = {
  // Fill state; hover brightens + adds a gold glow, active dims it back.
  primary:
    'bg-[var(--app-primary)] text-[var(--app-dark)] shadow-sm hover:bg-[var(--app-primary-light)] hover:shadow-lg hover:shadow-[var(--app-primary)]/35 active:bg-[var(--app-primary)] active:shadow-sm',
  solid,
  // Back-compat alias — `dark` is the same high-contrast solid button.
  dark: solid,
  // Gold hairline at rest; hover fills the border and washes the surface gold.
  outline:
    'border border-[var(--app-primary)]/55 bg-transparent text-current hover:border-[var(--app-primary)] hover:bg-[var(--app-primary)]/[0.1] hover:text-[var(--app-primary-dark)] hover:shadow-sm active:bg-[var(--app-primary)]/[0.16]',
  // No background at rest; a gold border + wash appears on hover.
  ghost:
    'border border-transparent bg-transparent text-current hover:border-[var(--app-primary)]/50 hover:bg-[var(--app-primary)]/[0.08] hover:text-[var(--app-primary-dark)] active:bg-[var(--app-primary)]/[0.14]',
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
