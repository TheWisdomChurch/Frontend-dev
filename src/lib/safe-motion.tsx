import React from 'react';

type MotionComponent = React.ComponentType<any>;
type MotionRecord = Record<string, MotionComponent>;

const fallbackCache = new Map<string, MotionComponent>();
const createFallback = (tag: string): MotionComponent => {
  const existing = fallbackCache.get(tag);
  if (existing) {
    return existing;
  }
  const Component = React.forwardRef<HTMLElement, Record<string, unknown>>(
    (props, ref) =>
      React.createElement(tag, {
        ...props,
        ref,
      })
  );
  Component.displayName = `FallbackMotion.${tag}`;
  fallbackCache.set(tag, Component);
  return Component;
};

const fallbackMotion = new Proxy(
  {},
  {
    get: (_target, prop) =>
      createFallback(typeof prop === 'string' ? prop : 'div'),
  }
) as MotionRecord;

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
