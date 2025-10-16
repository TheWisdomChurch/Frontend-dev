// components/text/FontText.tsx
'use client';

import React from 'react';

import { BaseText, BaseTextProps } from './baseText';

export const LukiestGuyText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} fontFamily="LukiestGuy" />
);

export const UltraText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} fontFamily="Ultra" />
);

export const AbrilFatFaceText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} fontFamily="AbrilFatFace" />
);

export const BricolageText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} fontFamily="Bricolage" />
);

export const ShadowsText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} fontFamily="Shadows" />
);
