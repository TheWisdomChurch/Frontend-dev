'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { BaseModal } from '@/shared/ui/modals/Base';
import { Button } from '@/shared/utils/buttons';
import { useIsClient } from '@/hooks';
import {
  DEFAULT_CONSENT,
  readStoredConsent,
  writeStoredConsent,
  type StoredConsent,
} from '@/shared/analytics/consent';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';

/* ── Storage ─────────────────────────────────────────────── */

type CookiePreferences = StoredConsent;

const basePrefs: CookiePreferences = {
  ...DEFAULT_CONSENT,
  updatedAt: '',
  version: 1,
};

function readRawSaved(): string | null {
  const saved = readStoredConsent();
  return saved ? JSON.stringify(saved) : null;
}

function parseSaved(raw: string): CookiePreferences | null {
  try {
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

// Cookies aren't a subscribable store (no in-tab change events), so this is
// a read-only snapshot: real value once mounted on the client, null on the
// server. No subscription is needed since nothing else in this tab mutates
// the cookie except this component's own `apply()`. The raw string is
// cached so repeated reads return the same object reference when the
// cookie hasn't actually changed, as useSyncExternalStore requires.
let cachedRaw: string | null = null;
let cachedSavedPrefs: CookiePreferences | null = null;

function getSavedPrefsSnapshot(): CookiePreferences | null {
  const raw = readRawSaved();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSavedPrefs = raw ? parseSaved(raw) : null;
  }
  return cachedSavedPrefs;
}

function subscribeNever() {
  return () => {};
}
function getSavedPrefsServerSnapshot() {
  return null;
}

/* ── Toggle switch ──────────────────────────────────────── */

function Toggle({
  on,
  locked,
  onChange,
  label,
}: {
  on: boolean;
  locked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={locked}
      onClick={onChange}
      className={[
        'relative h-6 w-11 flex-none rounded-full border transition-all duration-200',
        locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        on
          ? 'border-[var(--app-primary)] bg-[var(--app-primary)]'
          : 'border-white/20 bg-white/10',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition-all duration-200',
          on ? 'left-[calc(100%-22px)]' : 'left-[2px]',
        ].join(' ')}
      />
    </button>
  );
}

/* ── Component ─────────────────────────────────────────── */

export default function CookieConsentBanner() {
  const { setConsent } = useAnalytics();
  const mounted = useIsClient();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const savedPrefs = useSyncExternalStore(
    subscribeNever,
    getSavedPrefsSnapshot,
    getSavedPrefsServerSnapshot
  );
  // Optimistic local write so the UI updates immediately on `apply()`,
  // without waiting for a fresh cookie read.
  const [overridePrefs, setOverridePrefs] = useState<CookiePreferences | null>(
    null
  );
  const prefs = overridePrefs ?? savedPrefs ?? basePrefs;

  useEffect(() => {
    if (savedPrefs) return;
    // Delay so it doesn't compete with page load animations
    const t = window.setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, [savedPrefs]);

  const apply = (next: Pick<CookiePreferences, 'analytics' | 'marketing'>) => {
    const payload = writeStoredConsent({
      ...next,
      functional: true,
    });
    setOverridePrefs(payload);
    setConsent(payload);
    setVisible(false);
    setSettingsOpen(false);
  };

  const summary = useMemo(() => {
    if (prefs.analytics && prefs.marketing) return 'All cookies enabled';
    if (prefs.analytics) return 'Essential + analytics';
    if (prefs.marketing) return 'Essential + marketing';
    return 'Essential only';
  }, [prefs.analytics, prefs.marketing]);

  if (!mounted) return null;

  const COOKIE_ROWS = [
    {
      key: 'essential',
      label: 'Essential',
      description: 'Navigation, forms, and secure sessions.',
      on: true,
      locked: true,
    },
    {
      key: 'analytics',
      label: 'Analytics',
      description: 'Help us understand how the site is used.',
      on: prefs.analytics,
      locked: false,
    },
    {
      key: 'marketing',
      label: 'Marketing',
      description: 'Campaign performance and engagement.',
      on: prefs.marketing,
      locked: false,
    },
  ];

  return (
    <>
      {/* ── Banner ─────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Cookie consent"
        className={[
          'fixed inset-x-0 bottom-0 z-[10400] transition-transform duration-500',
          visible ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        {/* Thin gold accent line at top */}
        <div className="h-[2px] w-full bg-[var(--app-primary)]/40" />

        <div className="border-t border-white/8 bg-[rgba(7,6,10,0.97)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-screen-xl flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6 lg:px-8 lg:py-6">
            {/* Left — icon + text */}
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[var(--app-primary)]/12 sm:mt-0">
                <ShieldCheck className="h-4 w-4 text-[var(--app-primary)]" />
              </div>
              <div className="min-w-0">
                <p className="font-ui text-label font-bold text-white">
                  We use cookies
                </p>
                <p className="mt-0.5 font-body text-label leading-[1.6] text-white/55">
                  Essential cookies keep the site working. Optional analytics
                  help us improve it.{' '}
                  <Link
                    href="/cookies"
                    className="text-[var(--app-primary)] underline-offset-3 hover:underline"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Right — actions */}
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/12 px-3.5 font-ui text-label font-semibold text-white/65 transition hover:border-white/22 hover:text-white/90"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Manage
              </button>

              <button
                type="button"
                onClick={() => apply({ analytics: false, marketing: false })}
                className="inline-flex h-9 items-center rounded-lg border border-white/12 px-3.5 font-ui text-label font-semibold text-white/65 transition hover:border-white/22 hover:text-white/90"
              >
                Essential only
              </button>

              <button
                type="button"
                onClick={() => apply({ analytics: true, marketing: true })}
                className="inline-flex h-9 items-center rounded-lg bg-[var(--app-primary)] px-4 font-ui text-label font-bold text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)]"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cookie settings modal ──────────────────────────── */}
      <BaseModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Cookie preferences"
        subtitle={summary}
        maxWidth="max-w-lg"
        forceBottomSheet
      >
        <div className="space-y-3">
          {COOKIE_ROWS.map(row => (
            <div
              key={row.key}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="font-ui text-body-sm font-semibold text-white">
                  {row.label}
                </p>
                <p className="mt-0.5 font-body text-label leading-[1.5] text-white/50">
                  {row.description}
                </p>
              </div>
              <Toggle
                on={row.on}
                locked={row.locked}
                label={`Toggle ${row.label} cookies`}
                onChange={() => {
                  if (row.key === 'analytics')
                    setOverridePrefs({ ...prefs, analytics: !prefs.analytics });
                  if (row.key === 'marketing')
                    setOverridePrefs({ ...prefs, marketing: !prefs.marketing });
                }}
              />
            </div>
          ))}

          <div className="mt-2 grid grid-cols-1 gap-3 pt-1 min-[390px]:grid-cols-2">
            <Button
              variant="ghost"
              size="sm"
              curvature="md"
              className="h-11 border border-white/12 font-ui text-sm text-white/70"
              onClick={() => apply({ analytics: false, marketing: false })}
            >
              Essential only
            </Button>
            <Button
              variant="primary"
              size="sm"
              curvature="md"
              className="h-11 font-ui text-sm font-bold"
              onClick={() =>
                apply({
                  analytics: prefs.analytics,
                  marketing: prefs.marketing,
                })
              }
            >
              Save preferences
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}
