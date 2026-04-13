/**
 * Analytics External Service Integration Configuration
 * Configure third-party analytics services (Google Analytics, Mixpanel, etc.)
 */

/**
 * ENVIRONMENT VARIABLES NEEDED IN .env.local
 */
const REQUIRED_ENV_VARS = `
# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_API=http://localhost:3000/api/analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXXXX
NEXT_PUBLIC_GA_API_SECRET=xxxxxxxxxxxxxxxxxx

# Mixpanel (Optional)  
NEXT_PUBLIC_MIXPANEL_TOKEN=xxxxxxxxxxxxxxxx

# Segment (Optional)
NEXT_PUBLIC_SEGMENT_WRITE_KEY=xxxxxxxxxxxxxxxx

# Custom Webhook for Analytics Events
ANALYTICS_WEBHOOK_URL=https://your-analytics-server.com/webhook
`;

/**
 * Google Analytics Integration Example
 *
 * 1. Install: npm install next-gtag
 * 2. Add to layout.tsx:
 */
export const GoogleAnalyticsIntegration = `
import { GoogleAnalytics } from 'next-gtag';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
        {children}
      </body>
    </html>
  );
}
`;

/**
 * Mixpanel Integration Example
 */
export const MixpanelIntegration = `
import { getUserProfile } from '@/lib/analytics/AnalyticsService';

export interface MixpanelConfig {
  token: string;
  enabled: boolean;
}

class MixpanelAnalytics {
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Initialize Mixpanel
    (window as any).mixpanel.init(this.token);
  }

  track(eventName: string, properties?: Record<string, any>) {
    (window as any).mixpanel.track(eventName, properties);
  }

  identify(userId: string) {
    (window as any).mixpanel.identify(userId);
  }

  setPeople(properties: Record<string, any>) {
    (window as any).mixpanel.people.set(properties);
  }
}

export default MixpanelAnalytics;
`;

/**
 * Segment Integration Example
 */
export const SegmentIntegration = `
import { useAnalytics } from '@/hooks/useAnalytics';

export function useSegmentAnalytics() {
  const analytics = useAnalytics();

  const trackToSegment = (eventName: string, properties?: Record<string, any>) => {
    if ((window as any).analytics) {
      (window as any).analytics.track(eventName, properties);
    }
  };

  return trackToSegment;
}
`;

/**
 * Custom Webhook Integration
 *
 * How it works:
 * 1. Analytics events are batched on the frontend
 * 2. Sent to /api/analytics endpoint
 * 3. API forwards to your webhook URL
 * 4. Your server processes and stores data
 */
export const WebhookIntegration = `
// In src/app/api/analytics/route.ts
export async function POST(request: NextRequest) {
  const payload = await request.json();

  // Send to external webhook
  if (process.env.ANALYTICS_WEBHOOK_URL) {
    try {
      await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: Date.now(),
          events: payload.events,
          userProfile: payload.userProfile,
          sessionId: request.headers.get('X-Session-ID'),
        }),
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }

  return NextResponse.json({ success: true });
}
`;

/**
 * Real-time Dashboard Integration
 *
 * Services that can consume your analytics data:
 * - Grafana: Real-time metric dashboards
 * - Tableau: Business intelligence
 * - Metabase: Simple analytics
 * - Looker Studio: Google's BI tool
 * - Custom dashboard: Build with Next.js + Chart.js
 */

/**
 * Database Schema for Analytics Storage
 */
export const DatabaseSchema = `
-- Events Table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255),
  event_type VARCHAR(50),
  event_name VARCHAR(255),
  page_url VARCHAR(2048),
  page_title VARCHAR(255),
  event_data JSONB,
  device_info JSONB,
  engagement JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Sessions Table
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  event_count INTEGER DEFAULT 0,
  total_time_ms INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Users Table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  first_visit TIMESTAMP,
  last_visit TIMESTAMP,
  visit_count INTEGER DEFAULT 1,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_events_session ON analytics_events(session_id);
CREATE INDEX idx_events_user ON analytics_events(user_id);
CREATE INDEX idx_events_created ON analytics_events(created_at DESC);
CREATE INDEX idx_sessions_user ON sessions(user_id);
`;

/**
 * Server-side Analytics Processing
 *
 * Process analytics in your backend to:
 * 1. Store in database
 * 2. Generate reports
 * 3. Feed to third-party services
 * 4. Create dashboards
 */
export const ServerSideProcessing = `
// Example: Process analytics in your Node.js backend

import express from 'express';
import { Pool } from 'pg';

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post('/analytics/webhook', async (req, res) => {
  const { events, userProfile, sessionId } = req.body;

  try {
    const client = await pool.connect();

    // Store events in database
    for (const event of events) {
      await client.query(
        'INSERT INTO analytics_events (session_id, user_id, event_type, event_name, page_url, event_data, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
          sessionId,
          userProfile?.userId,
          event.eventType,
          event.eventName,
          event.pageUrl,
          JSON.stringify(event.eventData),
          new Date(event.timestamp),
        ]
      );
    }

    // Update user profile
    if (userProfile) {
      await client.query(
        'INSERT INTO users (id, first_visit, last_visit, visit_count) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET last_visit = $3, visit_count = visit_count + 1',
        [
          userProfile.userId,
          new Date(userProfile.firstVisit),
          new Date(userProfile.lastVisit),
          userProfile.visitCount,
        ]
      );
    }

    client.release();
    res.json({ success: true });
  } catch (error) {
    console.error('Analytics processing error:', error);
    res.status(500).json({ error: 'Failed to process analytics' });
  }
});

app.listen(3001, () => {
  console.log('Analytics webhook server listening on port 3001');
});
`;

/**
 * Analytics Dashboard Query Examples
 */
export const AnalyticsDashboardQueries = `
-- Total Events Today
SELECT COUNT(*) as total_events FROM analytics_events 
WHERE created_at >= CURRENT_DATE;

-- Unique Sessions Today
SELECT COUNT(DISTINCT session_id) as unique_sessions FROM analytics_events
WHERE created_at >= CURRENT_DATE;

-- Average Time on Page
SELECT AVG((engagement->>'timeOnPage')::INTEGER) as avg_time_ms FROM analytics_events
WHERE created_at >= CURRENT_DATE;

-- Most Popular Pages
SELECT page_title, COUNT(*) as views FROM analytics_events
WHERE event_type = 'page_view' AND created_at >= CURRENT_DATE
GROUP BY page_title ORDER BY views DESC LIMIT 10;

-- Top Events
SELECT event_name, COUNT(*) as count FROM analytics_events
WHERE created_at >= CURRENT_DATE
GROUP BY event_name ORDER BY count DESC LIMIT 20;

-- Scroll Depth Analysis
SELECT 
  (engagement->>'scrollDepth')::INTEGER as depth,
  COUNT(*) as users
FROM analytics_events
WHERE engagement->>'scrollDepth' IS NOT NULL
GROUP BY depth
ORDER BY depth;

-- Form Submission Rate
SELECT 
  (event_data->>'formName') as form_name,
  COUNT(CASE WHEN event_type = 'form_submission' THEN 1 END) as submissions,
  COUNT(CASE WHEN event_type = 'form_interaction' THEN 1 END) as interactions,
  ROUND(
    100.0 * COUNT(CASE WHEN event_type = 'form_submission' THEN 1 END) / 
    NULLIF(COUNT(CASE WHEN event_type = 'form_interaction' THEN 1 END), 0), 
    2
  ) as submission_rate
FROM analytics_events
WHERE event_type IN ('form_submission', 'form_interaction')
GROUP BY form_name;

-- User Journey (Events per Session)
SELECT 
  session_id,
  COUNT(*) as event_count,
  MAX(created_at) - MIN(created_at) as session_duration,
  ARRAY_AGG(event_name) as events
FROM analytics_events
WHERE session_id = 'specific-session-id'
GROUP BY session_id;
`;

/**
 * Useful Metrics to Track
 */
export const KeyMetricsToTrack = {
  engagement: {
    avgTimeOnPage: 'Average time users spend on page',
    scrollDepth: 'How far users scroll (0-100%)',
    bounceRate: 'Percentage leaving without interaction',
    pagesPerSession: 'Average pages visited per session',
    interactionRate: 'Percentage of users who interact',
  },
  conversion: {
    donationRate: 'Percentage of users who donate',
    formCompletionRate: 'Percentage of forms submitted',
    eventRegistration: 'Number of event registrations',
    newsletterSignups: 'Email list growth',
    ctaClickRate: 'Percentage clicking CTAs',
  },
  traffic: {
    uniqueVisitors: 'Number of unique users',
    returnVisitRate: 'Percentage of returning users',
    trafficBySource: 'Where visitors come from',
    trafficByDevice: 'Desktop vs mobile split',
    avgSessionsPerUser: 'User loyalty indicator',
  },
  content: {
    topPages: 'Most viewed pages',
    topEvents: 'Most tracked events',
    contentEngagement: 'Which content keeps users longest',
    searchQueries: 'What users search for',
    errorFrequency: 'Technical issues',
  },
};

/**
 * Privacy & Compliance Checklist
 */
export const PrivacyChecklist = {
  GDPR: [
    'Consent before tracking',
    'Easy consent withdrawal',
    'Privacy policy visible',
    'Cookie policy documented',
    'Data export capability',
    'Right to be forgotten',
  ],
  CCPA: [
    'Clear privacy notice',
    'Opt-out functionality',
    'No selling of personal data',
    'Consumer rights info',
    'Data collection transparency',
  ],
  DataSecurity: [
    'HTTPS only',
    'Secure cookie transmission',
    'No sensitive data stored',
    'Regular security audits',
    'Encryption at rest',
  ],
};

/**
 * Performance Recommendations
 */
export const PerformanceRecommendations = {
  eventBatching: {
    batchSize: 10,
    description: 'Send events in batches of 10 to reduce API calls',
  },
  batchTimeout: {
    timeout: 10000,
    description: 'Send pending events every 10 seconds',
  },
  debouncing: {
    interval: 300,
    description: 'Debounce scroll events to avoid excessive calls',
  },
  compression: {
    enabled: true,
    description: 'Compress analytics payloads for faster transmission',
  },
};

export default {
  REQUIRED_ENV_VARS,
  GoogleAnalyticsIntegration,
  MixpanelIntegration,
  SegmentIntegration,
  WebhookIntegration,
  DatabaseSchema,
  ServerSideProcessing,
  AnalyticsDashboardQueries,
  KeyMetricsToTrack,
  PrivacyChecklist,
  PerformanceRecommendations,
};
