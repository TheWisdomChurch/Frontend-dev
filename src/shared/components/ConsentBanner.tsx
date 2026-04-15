// components/ConsentBanner.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAnalytics } from '../providers/AnalyticsProvider';

export function ConsentBanner() {
  const { setConsent } = useAnalytics();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent =
      typeof document !== 'undefined'
        ? document.cookie.includes('analytics_consent=1')
        : false;
    if (!consent) setVisible(true);
  }, []);

  const acceptAll = () => {
    setConsent({ functional: true, analytics: true, marketing: true });
    document.cookie =
      'analytics_consent=1; Max-Age=31536000; Path=/; SameSite=Lax';
    setVisible(false);
  };

  const acceptEssential = () => {
    setConsent({ functional: true, analytics: false, marketing: false });
    document.cookie =
      'analytics_consent=1; Max-Age=31536000; Path=/; SameSite=Lax';
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <p>We use cookies to improve your experience.</p>
      <div className="space-x-4 mt-2">
        <button onClick={acceptAll}>Accept All</button>
        <button onClick={acceptEssential}>Essential Only</button>
      </div>
    </div>
  );
}
