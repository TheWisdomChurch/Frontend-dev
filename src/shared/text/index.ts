// components/text/index.ts
export { BaseText } from './baseText';
export {
  H1,
  H2,
  H3,
  H4,
  P,
  BodyXL,
  BodyLG,
  BodyMD, // ← ADD THIS
  BodySM, // ← ADD THIS
  SmallText,
  Caption,
  // Span,
  // Strong,
  // Em,
} from './Semantictext';
export { LightText, RegularText, MediumText, SemiBoldText } from './weightText';
export { BricolageText } from './FontText';

export type { BaseTextProps } from './baseText';
