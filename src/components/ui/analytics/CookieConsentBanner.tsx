/**
 * Cookie Consent Banner Component
 * Professional GDPR/CCPA compliant consent interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ConsentManager } from '@/lib/analytics/ConsentManager';
import { ConsentPreferences } from '@/lib/analytics/types';

interface CookieConsentBannerProps {
  onConsent?: (preferences: ConsentPreferences) => void;
  position?: 'bottom' | 'top';
  theme?: 'light' | 'dark';
  showDetails?: boolean;
  companyName?: string;
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onConsent,
  position = 'bottom',
  theme = 'dark',
  showDetails = false,
  companyName = 'Wisdom Church',
  privacyPolicyUrl = '/privacy',
  cookiePolicyUrl = '/cookies',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(
    ConsentManager.getConsent()
  );

  useEffect(() => {
    // Only show banner if consent hasn't been given
    if (!ConsentManager.isConsentGiven()) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    ConsentManager.acceptAll();
    setIsVisible(false);
    onConsent?.(ConsentManager.getConsent());
  };

  const handleRejectAll = () => {
    ConsentManager.rejectAll();
    setIsVisible(false);
    onConsent?.(ConsentManager.getConsent());
  };

  const handleSavePreferences = () => {
    ConsentManager.updateConsent(preferences);
    setIsVisible(false);
    onConsent?.(preferences);
  };

  const handlePreferenceChange = (
    key: keyof ConsentPreferences,
    value: boolean
  ) => {
    if (key === 'necessary') return; // necessary is always true
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!isVisible) return null;

  const bgColor = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100';

  return (
    <div
      className={`fixed ${position}-0 left-0 right-0 z-50 transition-all duration-300`}
      style={{
        backdropFilter: 'blur(4px)',
        background:
          theme === 'dark' ? 'rgba(0, 0, 0, 0.88)' : 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div
          className={`${bgColor} ${textColor} rounded-xl border ${borderColor} p-4 sm:p-6 shadow-lg`}
        >
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              🍪 Cookie & Privacy Settings
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              {companyName} uses cookies and similar technologies to enhance
              your browsing experience, personalize content, analyze traffic,
              and for marketing purposes. We respect your privacy and only use
              data with your consent.
            </p>
          </div>

          {/* Expandable Details */}
          {showDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 mb-3 transition"
            >
              {expanded ? '▼' : '▶'} Learn More
            </button>
          )}

          {/* Preferences Section */}
          {(expanded || showDetails) && (
            <div className="mb-4 max-h-[40vh] overflow-y-auto space-y-4 p-4 bg-gray-900/30 rounded-lg">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="font-medium text-xs sm:text-sm">
                    Essential Cookies
                  </label>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                    Required for website functionality, security, and fraud
                    prevention. Always enabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 w-5 h-5 accent-green-500 cursor-not-allowed"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between border-t border-gray-800 pt-4">
                <div className="flex-1">
                  <label className="font-medium text-xs sm:text-sm">
                    Analytics Cookies
                  </label>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                    Help us understand how you interact with our content, so we
                    can improve the experience.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={e =>
                    handlePreferenceChange('analytics', e.target.checked)
                  }
                  className="mt-1 w-5 h-5 accent-blue-500"
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between border-t border-gray-800 pt-4">
                <div className="flex-1">
                  <label className="font-medium text-xs sm:text-sm">
                    Marketing Cookies
                  </label>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                    Allow us to show personalized advertisements and measure
                    campaign effectiveness.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={e =>
                    handlePreferenceChange('marketing', e.target.checked)
                  }
                  className="mt-1 w-5 h-5 accent-blue-500"
                />
              </div>

              {/* Personalization Cookies */}
              <div className="flex items-start justify-between border-t border-gray-800 pt-4">
                <div className="flex-1">
                  <label className="font-medium text-xs sm:text-sm">
                    Personalization Cookies
                  </label>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                    Remember your preferences and provide personalized content
                    recommendations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.personalization}
                  onChange={e =>
                    handlePreferenceChange('personalization', e.target.checked)
                  }
                  className="mt-1 w-5 h-5 accent-blue-500"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleRejectAll}
              className={`flex-1 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border ${borderColor} ${hoverBg} transition`}
            >
              Reject All
            </button>

            {expanded || showDetails ? (
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Save Preferences
              </button>
            ) : (
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
              >
                Accept All
              </button>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-3 flex flex-wrap gap-2 justify-center text-[11px] text-gray-500">
            <a
              href={privacyPolicyUrl}
              className="hover:text-gray-300 transition"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href={cookiePolicyUrl}
              className="hover:text-gray-300 transition"
            >
              Cookie Policy
            </a>
            <span>•</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="hover:text-gray-300 transition"
            >
              {expanded ? 'Hide Details' : 'More Options'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
