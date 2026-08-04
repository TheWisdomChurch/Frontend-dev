'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type PromoModalKey = 'event' | 'dailyPrayer' | 'confession';

// Give visitors time to understand and interact with the page before a
// campaign interrupts them. Only one campaign may appear per tab session.
const TRIGGER_DELAY_MS = 12000;
const SESSION_SHOWN_KEY = 'wisdom_home_promo_shown';

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
  const hasShownRef = useRef(false);

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
    try {
      hasShownRef.current = sessionStorage.getItem(SESSION_SHOWN_KEY) === '1';
    } catch {
      // Session storage may be unavailable in privacy-restricted browsers.
    }

    if (active || hasShownRef.current) return;

    triggerTimerRef.current = window.setTimeout(() => {
      const next = nextEligible();
      if (!next) return;

      hasShownRef.current = true;
      try {
        sessionStorage.setItem(SESSION_SHOWN_KEY, '1');
      } catch {
        // The in-memory guard still prevents another modal this page view.
      }
      setActive(current => current ?? next);
    }, TRIGGER_DELAY_MS);

    return () => {
      if (triggerTimerRef.current !== null) {
        window.clearTimeout(triggerTimerRef.current);
      }
    };
  }, [active, nextEligible]);

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
    },
    [active]
  );

  return { active, closeActive };
}
