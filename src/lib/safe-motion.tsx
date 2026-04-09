import React from 'react';

type MotionComponent = React.ComponentType<any>;

const fallbackMotion = new Proxy(
  {},
  {
    get: (_target, prop) => prop as unknown as MotionComponent,
  }
) as Record<string, MotionComponent>;

let framer: any = {};
try {
  // Use require to avoid build-time named-export checks in this repo's setup.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  framer = require('framer-motion');
} catch {
  framer = {};
}

const motion = framer.motion ?? fallbackMotion;
const AnimatePresence =
  framer.AnimatePresence ??
  (({ children }: { children: React.ReactNode }) => <>{children}</>);

export { motion, AnimatePresence };
