// components/text/SemanticText.tsx
'use client';

import React, { forwardRef } from 'react';
import { BaseText, BaseTextProps } from './baseText';

// Heading Components - Using Bricolage Grotesque
export const H1 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h1" variant="heading-xl" {...props} />
);
H1.displayName = 'H1';

export const H2 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h2" variant="heading-lg" {...props} />
);
H2.displayName = 'H2';

export const H3 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h3" variant="heading-md" {...props} />
);
H3.displayName = 'H3';

export const H4 = forwardRef<HTMLHeadingElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="h4" variant="heading-sm" {...props} />
);
H4.displayName = 'H4';

// Body Text Components - Using Work Sans
export const P = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-md" {...props} />
);
P.displayName = 'P';

export const LargeText = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-lg" {...props} />
);
LargeText.displayName = 'LargeText';

export const SmallText = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="body-sm" {...props} />
);
SmallText.displayName = 'SmallText';

export const Caption = forwardRef<HTMLSpanElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="span" variant="caption" {...props} />
);
Caption.displayName = 'Caption';

// Elegant Text Components - Using Playfair Display
export const ElegantLarge = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="elegant-lg" {...props} />
);
ElegantLarge.displayName = 'ElegantLarge';

export const ElegantMedium = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="elegant-md" {...props} />
);
ElegantMedium.displayName = 'ElegantMedium';

export const ElegantSmall = forwardRef<HTMLParagraphElement, BaseTextProps>(
  (props, ref) => <BaseText ref={ref} as="p" variant="elegant-sm" {...props} />
);
ElegantSmall.displayName = 'ElegantSmall';

// Inline Text Components
export const Span = forwardRef<HTMLSpanElement, BaseTextProps>((props, ref) => (
  <BaseText ref={ref} as="span" fontFamily="worksans" {...props} />
));
Span.displayName = 'Span';

export const Strong = forwardRef<HTMLElement, BaseTextProps>((props, ref) => (
  <BaseText
    ref={ref}
    as="strong"
    weight="bold"
    fontFamily="worksans"
    {...props}
  />
));
Strong.displayName = 'Strong';

export const Em = forwardRef<HTMLElement, BaseTextProps>((props, ref) => (
  <BaseText
    ref={ref}
    as="em"
    style={{ fontStyle: 'italic' }}
    fontFamily="worksans"
    {...props}
  />
));
Em.displayName = 'Em';
