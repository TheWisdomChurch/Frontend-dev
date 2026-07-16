'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type PromoModalKey = 'event' | 'dailyPrayer' | 'confession';

const TRIGGER_DELAY_MS = 1200;
const ADVANCE_GRACE_MS = 900;
// A brand-new visitor (nothing in localStorage yet) can be eligible for all
// three modals at once — give them a longer breather between each one so
// the first visit doesn't feel like three stacked interrupts.
const FIRST_VISIT_ADVANCE_GRACE_MS = 4000;

const DAILY_PRAYER_STORAGE_KEY = 'wisdom_daily_prayer_last_shown';
const CONFESSION_STORAGE_KEY = 'wisdom_confession_last_shown';
const CONFESSION_REPEAT_DAYS = 14;
const EVENT_CLOSE_COOLDOWN_MS = 1000 * 60 * 20;
const EVENT_REMIND_COOLDOWN_MS = 1000 * 60 * 45;

const todayKey = () => new Date().toISOString().slice(0, 10);

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable — this modal may reappear more often than intended
    // for this visitor, which is an acceptable degradation over crashing.
  }
}

const isDailyPrayerEligible = () =>
  readStorage(DAILY_PRAYER_STORAGE_KEY) !== todayKey();
const markDailyPrayerShown = () =>
  writeStorage(DAILY_PRAYER_STORAGE_KEY, todayKey());

function isConfessionEligible(): boolean {
  const last = readStorage(CONFESSION_STORAGE_KEY);
  if (!last) return true;
  const lastDate = new Date(last);
  if (Number.isNaN(lastDate.getTime())) return true;
  const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= CONFESSION_REPEAT_DAYS;
}
const markConfessionShown = () =>
  writeStorage(CONFESSION_STORAGE_KEY, new Date().toISOString());

interface UsePromoModalQueueOptions {
  /** True once real Event Ad content has loaded and is worth showing. */
  eventAdAvailable: boolean;
}

/**
 * Sequences the homepage promo modals (Event Ad -> Daily Prayer -> Confession)
 * so they show one at a time, paced, instead of three independent timers
 * that could stack or overlap. Each modal has its own eligibility rule and
 * persists it in localStorage so it only reappears on the cadence it's
 * meant to (event: per-session cooldown, daily prayer: once/day,
 * confession: once/14 days).
 */
export function usePromoModalQueue({
  eventAdAvailable,
}: UsePromoModalQueueOptions) {
  const [active, setActive] = useState<PromoModalKey | null>(null);
  const eventCooldownUntilRef = useRef(0);
  const triggerTimerRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  // Captured once, before this session can mark anything as seen — true
  // only for a visitor whose browser has never shown either
  // localStorage-gated modal before. Lazily computed on first render only.
  const isFirstVisitRef = useRef<boolean | null>(null);
  if (isFirstVisitRef.current === null) {
    isFirstVisitRef.current =
      readStorage(DAILY_PRAYER_STORAGE_KEY) === null &&
      readStorage(CONFESSION_STORAGE_KEY) === null;
  }

  const eligible = useCallback(
    (key: PromoModalKey): boolean => {
      if (key === 'event') {
        return eventAdAvailable && Date.now() >= eventCooldownUntilRef.current;
      }
      if (key === 'dailyPrayer') return isDailyPrayerEligible();
      return isConfessionEligible();
    },
    [eventAdAvailable]
  );

  const nextEligible = useCallback((): PromoModalKey | null => {
    const order: PromoModalKey[] = ['event', 'dailyPrayer', 'confession'];
    return order.find(eligible) ?? null;
  }, [eligible]);

  useEffect(() => {
    if (active) return;

    triggerTimerRef.current = window.setTimeout(() => {
      setActive(current => current ?? nextEligible());
    }, TRIGGER_DELAY_MS);

    return () => {
      if (triggerTimerRef.current !== null) {
        window.clearTimeout(triggerTimerRef.current);
      }
    };
  }, [active, nextEligible]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const closeActive = useCallback(
    (remindLater = false) => {
      if (active === 'event') {
        eventCooldownUntilRef.current =
          Date.now() +
          (remindLater ? EVENT_REMIND_COOLDOWN_MS : EVENT_CLOSE_COOLDOWN_MS);
      } else if (active === 'dailyPrayer') {
        markDailyPrayerShown();
      } else if (active === 'confession') {
        markConfessionShown();
      }

      setActive(null);
      const graceMs = isFirstVisitRef.current
        ? FIRST_VISIT_ADVANCE_GRACE_MS
        : ADVANCE_GRACE_MS;
      advanceTimerRef.current = window.setTimeout(() => {
        setActive(nextEligible());
      }, graceMs);
    },
    [active, nextEligible]
  );

  return { active, closeActive };
}
