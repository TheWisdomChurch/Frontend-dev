// components/ui/buttons/index.tsx
'use client';

import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

// Primary Buttons
export const PrimaryButton: React.FC<ButtonProps> = props => (
  <Button variant="primary" {...props} />
);

export const BlackButton: React.FC<ButtonProps> = props => (
  <Button variant="primary" {...props} />
);

export const WhiteButton: React.FC<ButtonProps> = props => (
  <Button
    variant="outline"
    style={{
      backgroundColor: 'white',
      color: 'black',
      border: '1px solid #e5e5e5',
    }}
    {...props}
  />
);

// Accent Buttons
export const YellowButton: React.FC<ButtonProps> = props => (
  <Button variant="accent-yellow" {...props} />
);

export const OrangeButton: React.FC<ButtonProps> = props => (
  <Button variant="accent-orange" {...props} />
);

// Secondary Buttons
export const GrayButton: React.FC<ButtonProps> = props => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<ButtonProps> = props => (
  <Button variant="outline" {...props} />
);

export const GhostButton: React.FC<ButtonProps> = props => (
  <Button variant="ghost" {...props} />
);

// State Buttons
export const DangerButton: React.FC<ButtonProps> = props => (
  <Button variant="danger" {...props} />
);

export const SuccessButton: React.FC<ButtonProps> = props => (
  <Button
    style={{
      backgroundColor: '#16a34a',
      color: 'white',
    }}
    {...props}
  />
);

// Size Variants
export const SmallButton: React.FC<ButtonProps> = props => (
  <Button size="sm" {...props} />
);

export const LargeButton: React.FC<ButtonProps> = props => (
  <Button size="lg" {...props} />
);

export const XLargeButton: React.FC<ButtonProps> = props => (
  <Button size="xl" {...props} />
);

// Icon Buttons
export const IconButton: React.FC<ButtonProps & { icon: React.ReactNode }> = ({
  icon,
  children,
  ...props
}) => (
  <Button leftIcon={icon} {...props}>
    {children}
  </Button>
);

// Full Width Button
export const FullWidthButton: React.FC<ButtonProps> = props => (
  <Button fullWidth {...props} />
);
