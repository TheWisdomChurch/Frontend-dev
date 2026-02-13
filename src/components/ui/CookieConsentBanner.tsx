'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { BaseModal } from '@/components/modal/Base';
import { Button } from '@/components/utils/buttons';
import { BodySM, Caption } from '@/components/text';

type CookiePreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
};

const COOKIE_PREFS_KEY = 'wc_cookie_preferences_v1';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

const basePreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: '',
  version: 1,
};

const readSavedPreferences = (): CookiePreferences | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(COOKIE_PREFS_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    return {
      ...basePreferences,
      ...parsed,
      essential: true,
      version: 1,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

const writeCookies = (prefs: CookiePreferences) => {
  const cookieOptions = `Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
  document.cookie = `wc_cookie_consent=1; ${cookieOptions}`;
  document.cookie = `wc_cookie_analytics=${prefs.analytics ? '1' : '0'}; ${cookieOptions}`;
  document.cookie = `wc_cookie_marketing=${prefs.marketing ? '1' : '0'}; ${cookieOptions}`;
};

export default function CookieConsentBanner() {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(basePreferences);

  useEffect(() => {
    setMounted(true);
    const saved = readSavedPreferences();
    if (saved) {
      setPreferences(saved);
      setBannerVisible(false);
      return;
    }
    setBannerVisible(true);
  }, []);

  const persistPreferences = (next: CookiePreferences) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(next));
    writeCookies(next);
    window.dispatchEvent(
      new CustomEvent('wc:cookie-consent-updated', { detail: next })
    );
  };

  const applyPreferences = (next: Omit<CookiePreferences, 'updatedAt' | 'version'>) => {
    const payload: CookiePreferences = {
      ...next,
      essential: true,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    setPreferences(payload);
    persistPreferences(payload);
    setBannerVisible(false);
    setSettingsOpen(false);
  };

  const preferencesSummary = useMemo(() => {
    if (!preferences.analytics && !preferences.marketing) return 'Essential only';
    if (preferences.analytics && preferences.marketing) return 'All cookies';
    if (preferences.analytics) return 'Essential + analytics';
    return 'Essential + marketing';
  }, [preferences.analytics, preferences.marketing]);

  if (!mounted) return null;

  return (
    <>
      {bannerVisible && (
        <div className="fixed inset-x-0 bottom-4 z-[10500] px-4">
          <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/15 bg-[#090909]/95 p-4 shadow-2xl backdrop-blur-md sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  <ShieldCheck className="h-3.5 w-3.5" style={{ color: colorScheme.primary }} />
                  <Caption className="uppercase tracking-[0.12em] text-white/70">
                    Cookie Settings
                  </Caption>
                </div>
                <BodySM className="max-w-xl leading-relaxed text-white/80">
                  We use cookies for essential site functionality and optional analytics.
                  Choose what you want to allow. See our{' '}
                  <Link href="/cookies" className="underline underline-offset-4">
                    Cookies & Privacy
                  </Link>{' '}
                  page for details.
                </BodySM>
              </div>
              <div className="grid w-full grid-cols-1 gap-2 sm:w-auto">
                <Button
                  variant="primary"
                  size="sm"
                  curvature="full"
                  className="h-10 px-4 text-xs font-medium sm:text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                    color: colorScheme.black,
                  }}
                  onClick={() =>
                    applyPreferences({
                      essential: true,
                      analytics: true,
                      marketing: true,
                    })
                  }
                >
                  Accept all
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  curvature="full"
                  className="h-10 px-4 text-xs font-medium sm:text-sm"
                  style={{
                    borderColor: `${colorScheme.primary}66`,
                    color: '#ffffff',
                  }}
                  onClick={() =>
                    applyPreferences({
                      essential: true,
                      analytics: false,
                      marketing: false,
                    })
                  }
                >
                  Essential only
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  curvature="full"
                  className="h-10 px-4 text-xs font-medium text-white sm:text-sm"
                  onClick={() => setSettingsOpen(true)}
                  leftIcon={<SlidersHorizontal className="h-4 w-4" />}
                >
                  Manage settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BaseModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Cookie Preferences"
        subtitle={`Current selection: ${preferencesSummary}`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          {[
            {
              key: 'essential',
              title: 'Essential cookies',
              description: 'Required for navigation, forms, and secure sessions.',
              enabled: true,
              locked: true,
            },
            {
              key: 'analytics',
              title: 'Analytics cookies',
              description: 'Help us understand usage so we can improve performance.',
              enabled: preferences.analytics,
              locked: false,
            },
            {
              key: 'marketing',
              title: 'Marketing cookies',
              description: 'Used for campaign performance and engagement tracking.',
              enabled: preferences.marketing,
              locked: false,
            },
          ].map(item => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div className="pr-3">
                <BodySM className="font-medium text-white">{item.title}</BodySM>
                <Caption className="text-white/60">{item.description}</Caption>
              </div>
              <button
                type="button"
                disabled={item.locked}
                aria-pressed={item.enabled}
                onClick={() => {
                  if (item.key === 'analytics') {
                    setPreferences(prev => ({ ...prev, analytics: !prev.analytics }));
                  }
                  if (item.key === 'marketing') {
                    setPreferences(prev => ({ ...prev, marketing: !prev.marketing }));
                  }
                }}
                className={`relative h-6 w-11 rounded-full border transition-all ${
                  item.locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                style={{
                  backgroundColor: item.enabled ? colorScheme.primary : 'rgba(255,255,255,0.14)',
                  borderColor: item.enabled ? colorScheme.primary : 'rgba(255,255,255,0.24)',
                }}
              >
                <span
                  className="absolute top-[2px] h-5 w-5 rounded-full bg-black transition-all"
                  style={{ left: item.enabled ? 'calc(100% - 22px)' : '2px' }}
                />
              </button>
            </div>
          ))}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              size="sm"
              curvature="full"
              className="h-11 text-sm font-medium"
              style={{
                borderColor: `${colorScheme.primary}66`,
                color: '#ffffff',
              }}
              onClick={() =>
                applyPreferences({
                  essential: true,
                  analytics: false,
                  marketing: false,
                })
              }
            >
              Essential only
            </Button>
            <Button
              variant="primary"
              size="sm"
              curvature="full"
              className="h-11 text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                color: colorScheme.black,
              }}
              onClick={() =>
                applyPreferences({
                  essential: true,
                  analytics: preferences.analytics,
                  marketing: preferences.marketing,
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

