/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/Button.tsx
'use client';

import React from 'react';

import { useTheme } from '../../contexts/ThemeContext';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent-yellow'
  | 'accent-orange'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: React.CSSProperties;
  /** New: Adds subtle shadow and hover lift effect */
  elevated?: boolean;
  /** New: Controls border radius - more curvy */
  curvature?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  leftIcon,
  rightIcon,
  style,
  elevated = false,
  curvature = 'lg',
}) => {
  const { colorScheme } = useTheme();

  // Size styles with better proportions
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
    xl: 'px-10 py-5 text-xl min-h-[60px]',
  };

  // Curvature styles
  const curvatureStyles = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  };

  // Enhanced variant styles with smooth transitions and better hover effects
  const getVariantStyles = () => {
    const baseStyles = `inline-flex items-center justify-center font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-3 focus:ring-offset-2 ${curvatureStyles[curvature]}`;

    const variants = {
      primary: {
        backgroundColor: colorScheme.primary,
        color: colorScheme.white,
        hover: 'hover:shadow-lg hover:scale-[1.02] hover:brightness-110',
        active: 'active:scale-[0.98]',
        focus: `focus:ring-[${colorScheme.primary}] focus:ring-opacity-50`,
        disabled: 'opacity-60 cursor-not-allowed transform-none shadow-none',
      },
      secondary: {
        backgroundColor: colorScheme.gray100,
        color: colorScheme.gray100,
        hover: 'hover:bg-gray-200 hover:shadow-md hover:scale-[1.02]',
        active: 'active:scale-[0.98]',
        focus: `focus:ring-[${colorScheme.gray300}] focus:ring-opacity-50`,
        disabled: 'opacity-60 cursor-not-allowed transform-none shadow-none',
      },
      'accent-yellow': {
        backgroundColor: colorScheme.yellow,
        color: colorScheme.black,
        hover: 'hover:shadow-lg hover:scale-[1.02] hover:brightness-110',
        active: 'active:scale-[0.98]',
        focus: `focus:ring-[${colorScheme.yellow}] focus:ring-opacity-50`,
        disabled: 'opacity-60 cursor-not-allowed transform-none shadow-none',
      },
      'accent-orange': {
        backgroundColor: colorScheme.orange,
        color: colorScheme.white,
        hover: 'hover:shadow-lg hover:scale-[1.02] hover:brightness-110',
        active: 'active:scale-[0.98]',
        focus: `focus:ring-[${colorScheme.orange}] focus:ring-opacity-50`,
        disabled: 'opacity-60 cursor-not-allowed transform-none shadow-none',
      },
      outline: {
        backgroundColor: 'transparent',
        color: colorScheme.text,
        border: `2px solid ${colorScheme.border}`,
        hover: `hover:bg-[${colorScheme.gray100}] hover:border-[${colorScheme.primary}] hover:shadow-md hover:scale-[1.02]`,
        active: 'active:scale-[0.98]',
        focus: `focus:ring-[${colorScheme.primary}] focus:ring-opacity-50`,
        disabled:
          'opacity-60 cursor-not-allowed transform-none shadow-none border-gray-300',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colorScheme.text,
        hover: `hover:bg-[${colorScheme.gray100}] hover:shadow-sm hover:scale-[1.02]`,
        active: 'active:scale-[0.98]',
        focus: `focus:ring-[${colorScheme.primary}] focus:ring-opacity-50`,
        disabled: 'opacity-60 cursor-not-allowed transform-none shadow-none',
      },
      danger: {
        backgroundColor: colorScheme.error,
        color: colorScheme.white,
        hover: 'hover:shadow-lg hover:scale-[1.02] hover:brightness-110',
        active: 'active:scale-[0.98]',
        focus: `focus:ring-[${colorScheme.error}] focus:ring-opacity-50`,
        disabled: 'opacity-60 cursor-not-allowed transform-none shadow-none',
      },
      success: {
        backgroundColor: '#10b981',
        color: colorScheme.white,
        hover: 'hover:shadow-lg hover:scale-[1.02] hover:brightness-110',
        active: 'active:scale-[0.98]',
        focus: 'focus:ring-[#10b981] focus:ring-opacity-50',
        disabled: 'opacity-60 cursor-not-allowed transform-none shadow-none',
      },
    };

    const variantConfig = variants[variant];

    return {
      backgroundColor: variantConfig.backgroundColor,
      color: variantConfig.color,
      border: (variantConfig as any).border || 'none',
      hover: variantConfig.hover,
      active: variantConfig.active,
      focus: variantConfig.focus,
      disabled: variantConfig.disabled,
      base: baseStyles,
    };
  };

  const variantStyles = getVariantStyles();
  const sizeStyle = sizeStyles[size];
  const widthStyle = fullWidth ? 'w-full' : '';
  const elevationStyle = elevated ? 'shadow-md hover:shadow-lg' : '';

  const buttonStyles: React.CSSProperties = {
    backgroundColor: variantStyles.backgroundColor,
    color: variantStyles.color,
    border: variantStyles.border,
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${variantStyles.base}
        ${sizeStyle}
        ${widthStyle}
        ${elevationStyle}
        ${!(disabled || loading) ? variantStyles.hover : ''}
        ${!(disabled || loading) ? variantStyles.active : ''}
        ${variantStyles.focus}
        ${disabled || loading ? variantStyles.disabled : ''}
        ${className}
        transform transition-all duration-300 ease-out
        font-medium tracking-wide
        overflow-hidden relative
      `}
      style={buttonStyles}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-current opacity-20 rounded-inherit" />
      )}

      {/* Content container */}
      <div
        className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left Icon */}
        {!loading && leftIcon && (
          <span className="flex-shrink-0" style={{ fontSize: '0.9em' }}>
            {leftIcon}
          </span>
        )}

        {/* Children */}
        <span className="whitespace-nowrap">{children}</span>

        {/* Right Icon */}
        {!loading && rightIcon && (
          <span className="flex-shrink-0" style={{ fontSize: '0.9em' }}>
            {rightIcon}
          </span>
        )}
      </div>
    </button>
  );
};

export default Button;
