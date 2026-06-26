'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { BaseModal } from '@/shared/ui/modals/Base';
import { Button } from '@/shared/utils/buttons';

/* ── Storage ─────────────────────────────────────────────── */

type CookiePreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
};

const PREFS_KEY = 'wc_cookie_preferences_data';
const CONSENT_KEY = 'wc_cookie_preferences_v1';
const MAX_AGE = 60 * 60 * 24 * 180;

const basePrefs: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: '',
  version: 1,
};

function readSaved(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${PREFS_KEY.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}=([^;]*)`
    )
  );
  const raw = match ? decodeURIComponent(match[1]) : null;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    return {
      ...basePrefs,
      ...parsed,
      essential: true,
      version: 1,
      updatedAt: parsed.updatedAt || '',
    };
  } catch {
    return null;
  }
}

function writeCookies(prefs: CookiePreferences) {
  const opts = `Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;
  document.cookie = `wc_cookie_consent=1; ${opts}`;
  document.cookie = `wc_cookie_analytics=${prefs.analytics ? '1' : '0'}; ${opts}`;
  document.cookie = `wc_cookie_marketing=${prefs.marketing ? '1' : '0'}; ${opts}`;
  document.cookie = `${PREFS_KEY}=${encodeURIComponent(JSON.stringify(prefs))}; ${opts}`;
  document.cookie = `${CONSENT_KEY}=1; ${opts}`;
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
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(basePrefs);

  useEffect(() => {
    setMounted(true);
    const saved = readSaved();
    if (saved) {
      setPrefs(saved);
      setVisible(false);
    } else {
      // Delay so it doesn't compete with page load animations
      const t = window.setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const apply = (next: Omit<CookiePreferences, 'updatedAt' | 'version'>) => {
    const payload: CookiePreferences = {
      ...next,
      essential: true,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    setPrefs(payload);
    writeCookies(payload);
    window.dispatchEvent(
      new CustomEvent('wc:cookie-consent-updated', { detail: payload })
    );
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
                <p className="font-ui text-[0.78rem] font-bold text-white">
                  We use cookies
                </p>
                <p className="mt-0.5 font-body text-[0.76rem] leading-[1.6] text-white/55">
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
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/12 px-3.5 font-ui text-[0.75rem] font-semibold text-white/65 transition hover:border-white/22 hover:text-white/90"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Manage
              </button>

              <button
                type="button"
                onClick={() =>
                  apply({ essential: true, analytics: false, marketing: false })
                }
                className="inline-flex h-9 items-center rounded-lg border border-white/12 px-3.5 font-ui text-[0.75rem] font-semibold text-white/65 transition hover:border-white/22 hover:text-white/90"
              >
                Essential only
              </button>

              <button
                type="button"
                onClick={() =>
                  apply({ essential: true, analytics: true, marketing: true })
                }
                className="inline-flex h-9 items-center rounded-lg bg-[var(--app-primary)] px-4 font-ui text-[0.75rem] font-bold text-[#0d0a06] transition hover:bg-[var(--app-primary-light)]"
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
      >
        <div className="space-y-3">
          {COOKIE_ROWS.map(row => (
            <div
              key={row.key}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="font-ui text-[0.82rem] font-semibold text-white">
                  {row.label}
                </p>
                <p className="mt-0.5 font-body text-[0.76rem] leading-[1.5] text-white/50">
                  {row.description}
                </p>
              </div>
              <Toggle
                on={row.on}
                locked={row.locked}
                label={`Toggle ${row.label} cookies`}
                onChange={() => {
                  if (row.key === 'analytics')
                    setPrefs(p => ({ ...p, analytics: !p.analytics }));
                  if (row.key === 'marketing')
                    setPrefs(p => ({ ...p, marketing: !p.marketing }));
                }}
              />
            </div>
          ))}

          <div className="mt-2 grid grid-cols-2 gap-3 pt-1">
            <Button
              variant="ghost"
              size="sm"
              curvature="md"
              className="h-11 border border-white/12 font-ui text-sm text-white/70"
              onClick={() =>
                apply({ essential: true, analytics: false, marketing: false })
              }
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
                  essential: true,
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
