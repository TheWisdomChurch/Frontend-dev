'use client';

import { forwardRef } from 'react';
import { BaseText, type BaseTextProps } from './baseText';

export const LightText = forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} {...props} weight="light" />
);
LightText.displayName = 'LightText';

export const RegularText = forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} {...props} weight="regular" />
);
RegularText.displayName = 'RegularText';

export const MediumText = forwardRef<HTMLElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} {...props} weight="medium" />
);
MediumText.displayName = 'MediumText';
