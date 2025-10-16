// components/text/SemanticText.tsx
'use client';

import React from 'react';
import { BaseText, BaseTextProps } from './baseText'; // Fixed import

// Heading Components
export const H1: React.FC<BaseTextProps> = props => (
  <BaseText as="h1" variant="heading-xl" {...props} />
);

export const H2: React.FC<BaseTextProps> = props => (
  <BaseText as="h2" variant="heading-lg" {...props} />
);

export const H3: React.FC<BaseTextProps> = props => (
  <BaseText as="h3" variant="heading-md" {...props} />
);

export const H4: React.FC<BaseTextProps> = props => (
  <BaseText as="h4" variant="heading-sm" {...props} />
);

// Body Text Components
export const P: React.FC<BaseTextProps> = props => (
  <BaseText as="p" variant="body-md" {...props} />
);

export const LargeText: React.FC<BaseTextProps> = props => (
  <BaseText as="p" variant="body-lg" {...props} />
);

export const SmallText: React.FC<BaseTextProps> = props => (
  <BaseText as="p" variant="body-sm" {...props} />
);

export const Caption: React.FC<BaseTextProps> = props => (
  <BaseText as="span" variant="caption" {...props} />
);

// Inline Text Components
export const Span: React.FC<BaseTextProps> = props => (
  <BaseText as="span" {...props} />
);

export const Strong: React.FC<BaseTextProps> = props => (
  <BaseText as="strong" weight="bold" {...props} />
);

export const Em: React.FC<BaseTextProps> = props => (
  <BaseText as="em" style={{ fontStyle: 'italic' }} {...props} />
);
