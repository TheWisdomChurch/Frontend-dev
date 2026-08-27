// Shared scroll-reveal cascade tokens — a section wraps its content in
// `staggerContainer` (whileInView) and marks each direct child that should
// cascade in with `staggerItem`, instead of the whole section fading in as
// one flat block.
export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: motionStagger.relaxed,
      delayChildren: motionStagger.tight,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.slow, ease: motionEase },
  },
};

export const staggerViewport = { once: true, amount: 0.25 } as const;
import { motionDuration, motionEase, motionStagger } from './tokens';
