// components/layout/ThemeToggle.tsx
'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Laptop2, Moon, Sun } from 'lucide-react';
import { useMemo } from 'react';
import { useTheme, ThemeMode } from '@/components/contexts/ThemeContext';
import { cn } from '@/lib/cn';

type ThemeToggleProps = {
  size?: 'sm' | 'md';
  className?: string;
};

const options: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'system', label: 'System', icon: Laptop2 },
  { id: 'dark', label: 'Dark', icon: Moon },
];

export default function ThemeToggle({
  size = 'md',
  className = '',
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, colorScheme, mounted } = useTheme();

  // Avoid hydration mismatch before theme mounts
  if (!mounted) return null;

  const activeIndex = options.findIndex(opt => opt.id === theme);
  const pillWidth = 100 / options.length;
  const compact = size === 'sm';

  const textTone =
    resolvedTheme === 'dark' ? 'text-white/80' : 'text-gray-900';

  const baseClasses = cn(
    'relative overflow-hidden rounded-full border backdrop-blur-md isolate',
    compact
      ? 'px-1.5 py-1 min-w-[150px]'
      : 'px-2 py-1.5 min-w-[210px] shadow-lg',
    className
  );

  const containerTone = useMemo(
    () => ({
      border: `1px solid rgba(255,255,255,${resolvedTheme === 'dark' ? 0.14 : 0.2})`,
      background:
        resolvedTheme === 'dark'
          ? 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))'
          : 'linear-gradient(145deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))',
    }),
    [resolvedTheme]
  );

  return (
    <div className={baseClasses} style={containerTone}>
      <div
        className={cn(
          'relative grid grid-cols-3 items-center text-[11px] sm:text-xs font-semibold',
          textTone
        )}
      >
        <AnimatePresence>
          <motion.div
            key={theme}
            layoutId="theme-pill"
            className="absolute inset-y-0 rounded-full"
            style={{
              width: `${pillWidth}%`,
              left: `${activeIndex * pillWidth}%`,
              background: `linear-gradient(120deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
              boxShadow: `0 10px 30px ${colorScheme.opacity.primary20}, 0 1px 0 rgba(255,255,255,0.5) inset`,
            }}
            initial={{ opacity: 0.75, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.5 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          />
        </AnimatePresence>

        {options.map(opt => {
          const Icon = opt.icon;
          const isActive = opt.id === theme;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              aria-pressed={isActive}
              className={cn(
                'relative z-10 flex items-center justify-center gap-1.5 px-2 py-1 transition-all duration-200',
                compact ? 'h-8' : 'h-9',
                isActive ? 'text-black' : 'text-white/70 hover:text-white'
              )}
            >
              <Icon className={cn('w-3.5 h-3.5', compact ? '' : 'sm:w-4 sm:h-4')} />
              {!compact && (
                <span className="hidden sm:inline-block tracking-tight">
                  {opt.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
