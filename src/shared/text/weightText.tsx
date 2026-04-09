// components/text/WeightText.tsx
'use client';

import React from 'react';
import { BaseText, BaseTextProps } from './baseText';

// Work Sans Weight Variants
export const LightText = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="light" fontFamily="worksans" />
  )
);
LightText.displayName = 'LightText';

export const RegularText = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="regular" fontFamily="worksans" />
  )
);
RegularText.displayName = 'RegularText';

export const MediumText = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="medium" fontFamily="worksans" />
  )
);
MediumText.displayName = 'MediumText';

export const SemiBoldText = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="semibold" fontFamily="worksans" />
  )
);
SemiBoldText.displayName = 'SemiBoldText';

// Bricolage Weight Variants
export const BricolageMedium = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="medium" fontFamily="bricolage" />
  )
);
BricolageMedium.displayName = 'BricolageMedium';

export const BricolageSemiBold = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="semibold" fontFamily="bricolage" />
  )
);
BricolageSemiBold.displayName = 'BricolageSemiBold';

export const BricolageBold = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="bold" fontFamily="bricolage" />
  )
);
BricolageBold.displayName = 'BricolageBold';

export const BricolageExtraBold = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="extrabold" fontFamily="bricolage" />
  )
);
BricolageExtraBold.displayName = 'BricolageExtraBold';

// Playfair Weight Variants
export const PlayfairRegular = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="regular" fontFamily="playfair" />
  )
);
PlayfairRegular.displayName = 'PlayfairRegular';

export const PlayfairBold = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="bold" fontFamily="playfair" />
  )
);
PlayfairBold.displayName = 'PlayfairBold';

export const PlayfairExtraBold = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText ref={ref} {...props} weight="extrabold" fontFamily="playfair" />
  )
);
PlayfairExtraBold.displayName = 'PlayfairExtraBold';

export const PlayfairItalic = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => (
    <BaseText
      ref={ref}
      {...props}
      weight="regular"
      fontFamily="playfair"
      style={{ fontStyle: 'italic' }}
    />
  )
);
PlayfairItalic.displayName = 'PlayfairItalic';
