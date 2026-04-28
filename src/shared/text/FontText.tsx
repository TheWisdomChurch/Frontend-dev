'use client';

import React from 'react';
import { BaseText, type BaseTextProps } from './baseText';

export const BricolageText = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} {...props} fontFamily="bricolage" />
);

BricolageText.displayName = 'BricolageText';

export const WorkSansText = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} {...props} fontFamily="worksans" />
);

WorkSansText.displayName = 'WorkSansText';

export const PlayfairText = React.forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} {...props} fontFamily="playfair" />
);

PlayfairText.displayName = 'PlayfairText';
