/**
 * UI Components Index
 * Re-export UI components from actual locations.
 */

// Layout primitives
export { Container } from './Container';
export type { ContainerWidth } from './Container';
export { Flex } from './Flex';

// Text & icons live in ../text and ../icons
export * from '../text';
export * from '../icons';
export type { BaseTextProps as TextComponentProps } from '../text';

// Analytics
export * from '../analytics';
