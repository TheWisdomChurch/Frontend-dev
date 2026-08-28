import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * The single button system. `<Button>` renders a real <button>; `buttonClass()`
 * produces the same styling for an <a>/<Link>. One shape (`--radius-button`),
 * four variants, three sizes. `outline` and `ghost` adapt to the surrounding
 * text colour, so they work on light and dark sections without a prop.
 */

export type ButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-button font-ui font-bold uppercase tracking-[0.14em] transition duration-200 ease-out outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)] disabled:pointer-events-none disabled:opacity-55 motion-safe:hover:-translate-y-0.5';

const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 text-eyebrow',
  md: 'min-h-11 px-6 text-label',
  lg: 'min-h-12 px-7 text-label',
  icon: 'h-11 w-11 p-0',
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--app-primary)] text-[var(--app-ink)] hover:bg-[var(--app-primary-hover)]',
  dark: 'bg-[var(--app-dark)] text-white hover:bg-[var(--app-neutral)]',
  outline:
    'border border-current/35 bg-transparent text-current hover:border-current/70 hover:bg-current/5',
  ghost: 'bg-transparent text-current hover:bg-current/10',
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
