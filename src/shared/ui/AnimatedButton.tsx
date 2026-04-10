/**
 * Professional Animated Buttons
 * Multiple variants with GSAP interactions
 */

'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'right',
      loading = false,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const innerRef = (ref as React.RefObject<HTMLButtonElement>) || buttonRef;

    // ====================================================================
    // STYLES
    // ====================================================================

    const baseStyles: React.CSSProperties = {
      position: 'relative',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      letterSpacing: '0.05em',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      width: fullWidth ? '100%' : 'auto',
      overflow: 'hidden',
      opacity: loading || props.disabled ? 0.6 : 1,
    };

    const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
      sm: { padding: '8px 14px', fontSize: '12px' },
      md: { padding: '12px 20px', fontSize: '14px' },
      lg: { padding: '16px 28px', fontSize: '16px' },
    };

    const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
      primary: {
        background: 'linear-gradient(135deg, #C9A84C, #B3942A)',
        color: '#000',
      },
      secondary: {
        background:
          'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(179,148,42,0.2))',
        color: '#C9A84C',
        border: '1px solid #C9A84C',
      },
      outline: {
        background: 'transparent',
        color: '#C9A84C',
        border: '2px solid #C9A84C',
      },
      ghost: {
        background: 'transparent',
        color: 'var(--text)',
        border: '1px solid var(--border)',
      },
      danger: {
        background: 'linear-gradient(135deg, #FF6B6B, #EE5A52)',
        color: '#fff',
      },
    };

    // ====================================================================
    // EVENT HANDLERS
    // ====================================================================

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;

      gsap.to(e.currentTarget, {
        scale: 1.05,
        boxShadow: `0 8px 24px ${variant === 'danger' ? 'rgba(255,107,107,0.4)' : 'rgba(201,168,76,0.3)'}`,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Add ripple effect
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background =
        variant === 'primary' ? 'rgba(0,0,0,0.1)' : 'rgba(201,168,76,0.1)';
      ripple.style.pointerEvents = 'none';

      const rect = e.currentTarget.getBoundingClientRect();
      const parent = e.currentTarget.getBoundingClientRect();
      const size = Math.max(parent.width, parent.height);

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${(e.clientX || 0) - rect.left - size / 2}px`;
      ripple.style.top = `${(e.clientY || 0) - rect.top - size / 2}px`;

      e.currentTarget.appendChild(ripple);

      gsap.to(ripple, {
        scale: 2,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;
      gsap.to(e.currentTarget, {
        scale: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        duration: 0.2,
        ease: 'power2.in',
      });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || props.disabled) return;

      // Click pulse animation
      gsap.to(e.currentTarget, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });

      props.onClick?.(e);
    };

    // ====================================================================
    // RENDER
    // ====================================================================

    return (
      <button
        ref={innerRef}
        {...props}
        style={{
          ...baseStyles,
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...props.style,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={loading || props.disabled}
      >
        {iconPosition === 'left' && icon && <span>{icon}</span>}
        <span>{loading ? 'Loading...' : children}</span>
        {iconPosition === 'right' && icon && <span>{icon}</span>}
      </button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

// ====================================================================
// BUTTON GROUP COMPONENT
// ====================================================================

interface ButtonGroupProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: number;
}

export function ButtonGroup({
  children,
  direction = 'row',
  gap = 12,
}: ButtonGroupProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: `${gap}px`,
        flexWrap: 'wrap',
      }}
    >
      {children}
    </div>
  );
}

// ====================================================================
// ICON BUTTON COMPONENT
// ====================================================================

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        title={label}
        {...props}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid rgba(201,168,76,0.2)',
          color: 'var(--text)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '18px',
          ...props.style,
        }}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
