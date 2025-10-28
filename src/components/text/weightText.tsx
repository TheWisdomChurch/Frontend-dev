// components/text/WeightText.tsx
'use client';

import React from 'react';
import { BaseText, BaseTextProps } from './baseText';

// Work Sans Weight Variants
export const LightText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="light" fontFamily="worksans" />
);

export const RegularText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="regular" fontFamily="worksans" />
);

export const MediumText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="medium" fontFamily="worksans" />
);

export const SemiBoldText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="semibold" fontFamily="worksans" />
);

// Bricolage Weight Variants
export const BricolageMedium: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="medium" fontFamily="bricolage" />
);

export const BricolageSemiBold: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="semibold" fontFamily="bricolage" />
);

export const BricolageBold: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="bold" fontFamily="bricolage" />
);

export const BricolageExtraBold: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="extrabold" fontFamily="bricolage" />
);

// Playfair Weight Variants
export const PlayfairRegular: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="regular" fontFamily="playfair" />
);

export const PlayfairBold: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="bold" fontFamily="playfair" />
);

export const PlayfairExtraBold: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="extrabold" fontFamily="playfair" />
);

export const PlayfairItalic: React.FC<BaseTextProps> = props => (
  <BaseText
    {...props}
    weight="regular"
    fontFamily="playfair"
    style={{ fontStyle: 'italic' }}
  />
);
