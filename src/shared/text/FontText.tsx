// components/text/FontText.tsx
'use client';

import React from 'react';
import { BaseText, BaseTextProps } from './baseText';

export const BricolageText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} fontFamily="bricolage" />
);

export const WorkSansText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} fontFamily="worksans" />
);

export const PlayfairText: React.FC<BaseTextProps> = props => (
  <BaseText {...props} fontFamily="playfair" />
);
