// lib/safe-motion.tsx
'use client';

import React from 'react';

type AnyProps = Record<string, unknown>;
type FallbackMotionComponent = React.ForwardRefExoticComponent<
  AnyProps & React.RefAttributes<HTMLElement>
>;

type MotionRecord = Record<string, React.ComponentType<any>>;

type AnimatePresenceProps = {
  children?: React.ReactNode;
  mode?: 'sync' | 'popLayout' | 'wait';
  initial?: boolean;
  custom?: unknown;
  onExitComplete?: () => void;
};

const MOTION_ONLY_PROPS = new Set([
  'animate',
  'initial',
  'exit',
  'variants',
  'transition',
  'whileHover',
  'whileTap',
  'whileFocus',
  'whileInView',
  'viewport',
  'layout',
  'layoutId',
  'drag',
  'dragConstraints',
  'dragElastic',
  'dragMomentum',
  'onAnimationStart',
  'onAnimationComplete',
  'onUpdate',
]);

const fallbackCache = new Map<string, FallbackMotionComponent>();

function sanitizeProps(props: AnyProps): AnyProps {
  const cleaned: AnyProps = {};

  Object.entries(props).forEach(([key, value]) => {
    if (MOTION_ONLY_PROPS.has(key)) return;
    cleaned[key] = value;
  });

  return cleaned;
}

function createFallback(tag: string): FallbackMotionComponent {
  const cached = fallbackCache.get(tag);
  if (cached) return cached;

  const Component = React.forwardRef<HTMLElement, AnyProps>((props, ref) => {
    const safeProps = sanitizeProps(props);

    return React.createElement(tag, {
      ...safeProps,
      ref,
    });
  });

  Component.displayName = `FallbackMotion.${tag}`;
  fallbackCache.set(tag, Component);

  return Component;
}

const fallbackMotion = new Proxy(
  {},
  {
    get: (_target, prop) =>
      createFallback(typeof prop === 'string' ? prop : 'div'),
  }
) as MotionRecord;

function FallbackAnimatePresence({ children }: AnimatePresenceProps) {
  return <>{children}</>;
}

let framerMotion: Partial<{
  motion: MotionRecord;
  AnimatePresence: React.ComponentType<AnimatePresenceProps>;
}> = {};

try {
  // Keeps the app alive even when framer-motion is unavailable or bundled oddly.
  // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
  framerMotion = require('framer-motion');
} catch {
  framerMotion = {};
}

export const motion = framerMotion.motion ?? fallbackMotion;

export const AnimatePresence =
  framerMotion.AnimatePresence ?? FallbackAnimatePresence;

export default motion;
