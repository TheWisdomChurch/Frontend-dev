'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  ArrowUpRight,
  Bell,
  Bookmark,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Church,
  Clock,
  Compass,
  Cross,
  Flame,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Play,
  Radio,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/shared/ui/layout';

export type FlowDockIconName =
  | 'church'
  | 'graduation-cap'
  | 'users'
  | 'shield-check'
  | 'shield'
  | 'heart-handshake'
  | 'flame'
  | 'sparkles'
  | 'compass'
  | 'map-pin'
  | 'clock'
  | 'calendar-days'
  | 'book-open'
  | 'cross'
  | 'radio'
  | 'video'
  | 'bookmark'
  | 'bell'
  | 'play'
  | (string & {});

const FLOW_DOCK_ICONS: Record<string, LucideIcon> = {
  church: Church,
  graduationcap: GraduationCap,
  users: Users,
  shieldcheck: ShieldCheck,
  shield: Shield,
  hearthandshake: HeartHandshake,
  flame: Flame,
  sparkles: Sparkles,
  compass: Compass,
  mappin: MapPin,
  clock: Clock,
  calendardays: CalendarDays,
  bookopen: BookOpen,
  cross: Cross,
  radio: Radio,
  video: Video,
  bookmark: Bookmark,
  bell: Bell,
  play: Play,
};

function resolveDockIcon(
  icon: FlowDockIconName | undefined
): React.ComponentType<{ className?: string }> {
  if (!icon) return Sparkles;
  const normalized = icon.toLowerCase().replace(/[\s_-]/g, '');
  return FLOW_DOCK_ICONS[normalized] || Sparkles;
}

export interface FlowDockItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: FlowDockIconName;
  href?: string;
  targetId?: string;
}

export interface SectionFlowDockProps {
  /** Section label displayed in the top bar pill, e.g. "Ministries Directory Track" */
  label: string;
  /** Items rendered inside the dock track */
  items: readonly FlowDockItem[];
  /** Optional container className */
  className?: string;
}

export function SectionFlowDock({
  label,
  items,
  className = '',
}: SectionFlowDockProps) {
  const [activeDockIndex, setActiveDockIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dockScrollRef = useRef<HTMLDivElement>(null);

  const scrollToDockIndex = useCallback((index: number) => {
    const container = dockScrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(
      '[data-flow-dock-card]'
    );
    const targetCard = cards[index];
    if (targetCard) {
      const containerWidth = container.offsetWidth;
      const cardWidth = targetCard.offsetWidth;
      const cardLeft = targetCard.offsetLeft;
      // Smoothly center the active card in the dock viewport
      const targetScroll = cardLeft - containerWidth / 2 + cardWidth / 2;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
    setActiveDockIndex(index);
  }, []);

  const scrollDock = (direction: 'left' | 'right') => {
    const nextIndex =
      direction === 'left'
        ? Math.max(0, activeDockIndex - 1)
        : Math.min(items.length - 1, activeDockIndex + 1);
    scrollToDockIndex(nextIndex);
  };

  // Automated scroll effect: smoothly advances across cards every 3.8s
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      setActiveDockIndex(prev => {
        const next = (prev + 1) % items.length;
        scrollToDockIndex(next);
        return next;
      });
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, items.length, scrollToDockIndex]);

  const handleDockScroll = () => {
    const container = dockScrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(
      '[data-flow-dock-card]'
    );
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    setActiveDockIndex(closestIndex);
  };

  const handleItemClick = (item: FlowDockItem, idx: number) => {
    scrollToDockIndex(idx);
    if (item.targetId) {
      const el = document.getElementById(item.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section
      aria-label={`${label} Quick Navigation`}
      className={cn(
        'relative z-20 -mt-8 sm:-mt-12 lg:-mt-16 pb-12 sm:pb-16 lg:pb-20',
        className
      )}
    >
      <Container>
        <div className="relative rounded-3xl border border-white/10 bg-[var(--app-dark-2)]/95 p-4 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-xl">
          {/* Ambient gold glow behind dock */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--app-primary)_20%,transparent)_0%,transparent_70%)]"
          />

          {/* Slider Top Bar: Header label + navigation controls */}
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 sm:mb-5 sm:pb-4">
            <div className="flex items-center gap-2">
              <span className="font-ui text-caption font-bold uppercase tracking-wider text-[var(--app-primary-light)]">
                {label}
              </span>
              <span className="hidden sm:inline-block font-ui text-caption text-white/30">
                ·
              </span>
              <span className="hidden sm:inline-block font-ui text-caption font-medium text-white/60">
                Pathway {activeDockIndex + 1} of {items.length}
              </span>
            </div>

            {/* Slider Left / Right Navigation Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => scrollDock('left')}
                disabled={activeDockIndex === 0}
                aria-label="Scroll to previous pathway"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[var(--app-primary)]/50 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollDock('right')}
                disabled={activeDockIndex === items.length - 1}
                aria-label="Scroll to next pathway"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[var(--app-primary)]/50 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable / Slidable Track */}
          <div
            ref={dockScrollRef}
            onScroll={handleDockScroll}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="flex gap-4 sm:gap-5 overflow-x-auto px-1 py-2 sm:py-3 scroll-smooth snap-x snap-mandatory no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, idx) => {
              const Icon = resolveDockIcon(item.icon);
              const isActive = activeDockIndex === idx;

              const content = (
                <>
                  {/* Top Row: Icon badge + top-right arrow */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                        isActive
                          ? 'border-[var(--app-primary)]/70 bg-[var(--app-primary)]/20 text-[var(--app-primary-light)] shadow-[0_0_12px_color-mix(in_srgb,var(--app-primary)_30%,transparent)]'
                          : 'border-white/10 bg-[var(--app-dark)] text-white/70 group-hover:border-[var(--app-primary)]/50 group-hover:bg-[var(--app-primary)]/15 group-hover:text-[var(--app-primary-light)]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        isActive
                          ? 'text-[var(--app-primary-light)]'
                          : 'text-white/40 group-hover:text-[var(--app-primary-light)]'
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  {/* Middle: Title & Description */}
                  <div className="mt-4 space-y-1.5 flex-1">
                    <h2
                      className={`font-ui text-body-sm font-bold tracking-tight transition-colors ${
                        isActive
                          ? 'text-[var(--app-primary-light)]'
                          : 'text-white group-hover:text-[var(--app-primary-light)]'
                      }`}
                    >
                      {item.title}
                    </h2>
                    <p className="font-ui text-caption text-white/75 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom: Pill indicator */}
                  <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between">
                    <span className="font-ui text-[11px] font-semibold uppercase tracking-wider text-[var(--app-primary-light)]">
                      {item.badge}
                    </span>
                    <span className="font-ui text-[10px] text-white/40 uppercase tracking-widest group-hover:text-white/70 transition-colors">
                      Explore →
                    </span>
                  </div>
                </>
              );

              const cardClasses = cn(
                'group relative flex w-[84vw] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-2xl border p-5 sm:p-6 text-left transition-all duration-300 sm:w-[320px] lg:w-[310px] xl:w-[320px] 2xl:w-[330px] min-h-[195px]',
                isActive
                  ? 'border-[var(--app-primary)] bg-gradient-to-b from-white/[0.14] via-white/[0.06] to-[var(--app-primary)]/15 shadow-2xl shadow-black/90 ring-1 ring-[var(--app-primary)]/60 scale-100 opacity-100 z-10 cursor-pointer'
                  : 'border-white/10 bg-white/[0.03] shadow-md scale-[0.98] opacity-75 hover:opacity-100 hover:scale-100 hover:border-[var(--app-primary)]/40 hover:bg-white/[0.07] cursor-pointer'
              );

              if (item.href && !item.targetId) {
                return (
                  <Link
                    key={item.id}
                    data-flow-dock-card
                    href={item.href}
                    onClick={() => scrollToDockIndex(idx)}
                    className={cardClasses}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  data-flow-dock-card
                  type="button"
                  onClick={() => handleItemClick(item, idx)}
                  className={cardClasses}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SectionFlowDock;
