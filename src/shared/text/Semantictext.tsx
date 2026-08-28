'use client';

import { forwardRef } from 'react';
import { BaseText, type BaseTextProps } from './baseText';

export const H2 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h2" variant="h2" {...props} />
);
H2.displayName = 'H2';

export const H3 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h3" variant="h3" {...props} />
);
H3.displayName = 'H3';

export const H4 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h4" variant="h4" {...props} />
);
H4.displayName = 'H4';

export const BodyLG = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-lg" {...props} />
);
BodyLG.displayName = 'BodyLG';

export const BodyMD = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-md" {...props} />
);
BodyMD.displayName = 'BodyMD';

export const BodySM = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-sm" {...props} />
);
BodySM.displayName = 'BodySM';

export const SmallText = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-sm" {...props} />
);
SmallText.displayName = 'SmallText';

export const Caption = forwardRef<HTMLSpanElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="span" variant="caption" {...props} />
);
Caption.displayName = 'Caption';

export const Eyebrow = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="eyebrow" {...props} />
);
Eyebrow.displayName = 'Eyebrow';
