/**
 * Analytics Dashboard Component
 * Display user engagement and analytics metrics
 */

'use client';

import React from 'react';
import {
  useEngagementMetrics,
  useUserProfile,
  useAnalytics,
} from '@/hooks/useAnalytics';

export const AnalyticsDashboard: React.FC<{ adminOnly?: boolean }> = ({
  adminOnly = true,
}) => {
  const metrics = useEngagementMetrics();
  const userProfile = useUserProfile();
  const analytics = useAnalytics();

  // Only show in development or for authorized users
  if (adminOnly && process.env.NODE_ENV === 'production') {
    return null;
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-100 text-xs space-y-2 max-h-96 overflow-y-auto shadow-lg">
        <div className="font-bold text-blue-400 border-b border-slate-700 pb-2">
          📊 Analytics Dashboard
        </div>

        {/* Engagement Metrics */}
        <div className="space-y-1">
          <div className="font-semibold text-slate-300">Engagement</div>
          <div className="pl-2 space-y-1 text-slate-400">
            <div>
              ⏱️ Time on Page:{' '}
              <span className="text-green-400">
                {formatTime(metrics.timeOnPage)}
              </span>
            </div>
            <div>
              📜 Scroll Depth:{' '}
              <span className="text-blue-400">{metrics.scrollDepth}%</span>
            </div>
            <div>
              🖱️ Interactions:{' '}
              <span className="text-yellow-400">
                {metrics.interactionCount}
              </span>
            </div>
            <div>
              👆 Clicks:{' '}
              <span className="text-orange-400">{metrics.clickCount}</span>
            </div>
            <div>
              📝 Forms:{' '}
              <span className="text-purple-400">
                {metrics.formInteractions}
              </span>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {userProfile && (
          <div className="space-y-1 border-t border-slate-700 pt-2">
            <div className="font-semibold text-slate-300">User Profile</div>
            <div className="pl-2 space-y-1 text-slate-400">
              <div>
                👤 Session:{' '}
                <span className="text-cyan-400 text-[10px]">
                  {userProfile.sessionId.slice(0, 8)}...
                </span>
              </div>
              <div>🆔 Visit #{userProfile.visitCount}</div>
              <div>
                📱 Platform:{' '}
                <span className="text-green-400">{navigator.platform}</span>
              </div>
              <div>
                🌐 Language:{' '}
                <span className="text-green-400">{navigator.language}</span>
              </div>
            </div>
          </div>
        )}

        {/* Screen Info */}
        <div className="space-y-1 border-t border-slate-700 pt-2">
          <div className="font-semibold text-slate-300">Screen</div>
          <div className="pl-2 space-y-1 text-slate-400">
            <div>
              📐 Viewport:{' '}
              <span className="text-green-400">
                {window.innerWidth}×{window.innerHeight}px
              </span>
            </div>
            <div>
              🖥️ Screen:{' '}
              <span className="text-green-400">
                {window.screen.width}×{window.screen.height}px
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-1 border-t border-slate-700 pt-2">
          <button
            onClick={() => analytics.flush()}
            className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs font-medium transition"
          >
            💾 Flush Events
          </button>
          <button
            onClick={() => {
              const userProfile = analytics.getUserProfile();
              console.log('User Profile:', userProfile);
              console.log('Metrics:', metrics);
            }}
            className="w-full bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-xs font-medium transition"
          >
            📋 Log to Console
          </button>
        </div>

        <div className="text-slate-500 text-[10px] pt-2 border-t border-slate-700 text-center">
          Development Mode Only
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
