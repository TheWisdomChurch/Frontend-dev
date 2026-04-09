// components/text/SemanticText.tsx
'use client';

import React, { forwardRef } from 'react';
import { BaseText, BaseTextProps } from './baseText';

// Hero Text - Largest, most prominent
export const HeroText = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h1" variant="hero" {...props} />
);
HeroText.displayName = 'HeroText';

// Heading Components with progressive scaling
export const H1 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h1" variant="h1" {...props} />
);
H1.displayName = 'H1';

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

export const H5 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h5" variant="h5" {...props} />
);
H5.displayName = 'H5';

export const H6 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h6" variant="h6" {...props} />
);
H6.displayName = 'H6';

// Body Text Components
export const BodyXL = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-xl" {...props} />
);
BodyXL.displayName = 'BodyXL';

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

export const P = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-md" {...props} />
);
P.displayName = 'P';

export const SmallText = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-sm" {...props} />
);
SmallText.displayName = 'SmallText';

export const ExtraSmallText = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-xs" {...props} />
);
ExtraSmallText.displayName = 'ExtraSmallText';

export const Caption = forwardRef<HTMLSpanElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="span" variant="caption" {...props} />
);
Caption.displayName = 'Caption';

// Elegant Text Components
export const ElegantXL = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="elegant-xl" {...props} />
);
ElegantXL.displayName = 'ElegantXL';

export const ElegantLG = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="elegant-lg" {...props} />
);
ElegantLG.displayName = 'ElegantLG';

export const ElegantMD = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="elegant-md" {...props} />
);
ElegantMD.displayName = 'ElegantMD';
