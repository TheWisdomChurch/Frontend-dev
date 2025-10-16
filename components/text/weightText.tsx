// components/text/WeightText.tsx
'use client';

import React from 'react';

import { BaseText, BaseTextProps } from './baseText'; // Fixed import

export const ExtraLightText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="extralight" />
);

export const LightText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="light" />
);

export const RegularText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="regular" />
);

export const MediumText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="medium" />
);

export const SemiBoldText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="semibold" />
);

export const BoldText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="bold" />
);

export const ExtraBoldText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="extrabold" />
);

export const ExtraRegularText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} weight="extraregular" />
);
