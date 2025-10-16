// components/ui/ButtonGroup.tsx
'use client';

import React from 'react';

interface ButtonGroupProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  direction = 'horizontal',
  spacing = 'md',
  className = '',
}) => {
  const spacingStyles = {
    sm: direction === 'horizontal' ? 'space-x-1' : 'space-y-1',
    md: direction === 'horizontal' ? 'space-x-2' : 'space-y-2',
    lg: direction === 'horizontal' ? 'space-x-4' : 'space-y-4',
  };

  const directionStyle = direction === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div className={`flex ${directionStyle} ${spacingStyles[spacing]} ${className}`}>
      {children}
    </div>
  );
};