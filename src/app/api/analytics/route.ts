/**
 * Professional Analytics API Route
 * Enterprise-grade analytics event handling
 * Validation, Processing, and Storage
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Analytics Event Batch Payload
 */
interface AnalyticsEventBatch {
  batchId: string;
  events: any[];
  session: {
    sessionId: string;
    userId?: string;
    deviceId: string;
    createdAt: number;
  };
  userProfile: {
    anonymousId: string;
    userId?: string;
    identificationMethod: string;
  };
  timestamp: number;
}

/**
 * Validation result
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// In-memory storage (in production, use database)
const analyticsStorage: Array<AnalyticsEventBatch & { receivedAt: number }> =
  [];
const aggregatedMetrics = {
  totalEvents: 0,
  totalBatches: 0,
  uniqueSessions: new Set<string>(),
  uniqueUsers: new Set<string>(),
  eventsByCategory: new Map<string, number>(),
};

/**
 * Validate analytics batch payload
 */
function validateBatch(payload: any): ValidationResult {
  const errors: string[] = [];

  if (!payload) {
    errors.push('Payload is required');
    return { valid: false, errors };
  }

  if (!payload.events || !Array.isArray(payload.events)) {
    errors.push('Events array is required and must be an array');
  }

  if (payload.events?.length === 0) {
    errors.push('At least one event is required');
  }

  if (!payload.session?.sessionId) {
    errors.push('Session ID is required');
  }

  if (!payload.userProfile?.anonymousId) {
    errors.push('User profile is required');
  }

  if (!payload.batchId) {
    errors.push('Batch ID is required');
  }

  // Validate individual events
  if (payload.events && Array.isArray(payload.events)) {
    payload.events.forEach((event: any, index: number) => {
      if (!event.id) errors.push(`Event ${index} missing id`);
      if (!event.category) errors.push(`Event ${index} missing category`);
      if (!event.action) errors.push(`Event ${index} missing action`);
      if (typeof event.timestamp !== 'number') {
        errors.push(`Event ${index} has invalid timestamp`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Process analytics batch
 */
function processBatch(payload: AnalyticsEventBatch, receivedAt: number): void {
  // Store batch
  analyticsStorage.push({
    ...payload,
    receivedAt,
  });

  // Update aggregated metrics
  aggregatedMetrics.totalEvents += payload.events.length;
  aggregatedMetrics.totalBatches += 1;
  aggregatedMetrics.uniqueSessions.add(payload.session.sessionId);

  if (payload.userProfile.userId) {
    aggregatedMetrics.uniqueUsers.add(payload.userProfile.userId);
  }

  // Track events by category
  payload.events.forEach(event => {
    const count = aggregatedMetrics.eventsByCategory.get(event.category) || 0;
    aggregatedMetrics.eventsByCategory.set(event.category, count + 1);
  });

  // Keep only last 1000 batches in memory
  if (analyticsStorage.length > 1000) {
    analyticsStorage.shift();
  }
}

/**
 * Send to external analytics service
 */
async function sendToExternalService(
  batch: AnalyticsEventBatch
): Promise<void> {
  if (!process.env.ANALYTICS_WEBHOOK_URL) return;

  try {
    const response = await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Batch-ID': batch.batchId,
        'X-Event-Count': batch.events.length.toString(),
      },
      body: JSON.stringify(batch),
      signal: AbortSignal.timeout?.(5000),
    });

    if (!response.ok) {
      console.warn(`[Analytics] Webhook failed: ${response.status}`);
    }
  } catch (error) {
    console.error('[Analytics] Error sending to webhook:', error);
  }
}

/**
 * POST: Receive and process analytics events
 */
export async function POST(request: NextRequest) {
  const receivedAt = Date.now();

  try {
    // Parse request body
    let payload: any;
    try {
      payload = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON payload',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    // Validate batch
    const validation = validateBatch(payload);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Extract headers for additional context
    const sessionId =
      request.headers.get('X-Session-ID') || payload.session.sessionId;
    const userId =
      request.headers.get('X-User-ID') || payload.userProfile.userId;
    const userAgent = request.headers.get('user-agent') || '';

    // Process batch
    processBatch(payload, receivedAt);

    // Send to external service asynchronously
    sendToExternalService(payload).catch(error => {
      console.error('[Analytics] Background webhook error:', error);
    });

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics API] Batch processed:', {
        batchId: payload.batchId,
        eventCount: payload.events.length,
        sessionId,
        userId: userId || 'anonymous',
        userAgent,
        userAgent,
        receivedAt: new Date(receivedAt).toISOString(),
        categories: payload.events.map((e: any) => e.category),
      });
    }

    return NextResponse.json(
      {
        success: true,
        batchId: payload.batchId,
        eventsProcessed: payload.events.length,
        message: 'Analytics events received and processed successfully',
        processingTime: Date.now() - receivedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Analytics API] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred processing analytics events',
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Return analytics summary (development only)
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const eventsByCategory = Object.fromEntries(
    aggregatedMetrics.eventsByCategory
  );

  return NextResponse.json(
    {
      status: 'ok',
      aggregatedMetrics: {
        totalEvents: aggregatedMetrics.totalEvents,
        totalBatches: aggregatedMetrics.totalBatches,
        uniqueSessions: aggregatedMetrics.uniqueSessions.size,
        uniqueUsers: aggregatedMetrics.uniqueUsers.size,
        eventsByCategory,
        averageEventsPerBatch:
          aggregatedMetrics.totalBatches > 0
            ? Math.round(
                aggregatedMetrics.totalEvents / aggregatedMetrics.totalBatches
              )
            : 0,
      },
      recentBatches: analyticsStorage.slice(-20).map(batch => ({
        batchId: batch.batchId,
        eventCount: batch.events.length,
        sessionId: batch.session.sessionId,
        userId: batch.userProfile.userId || 'anonymous',
        receivedAt: new Date(batch.receivedAt).toISOString(),
        categories: batch.events.map(e => e.category),
      })),
      timestamp: new Date().toISOString(),
      retention: `${analyticsStorage.length} batches in memory (max 1000)`,
    },
    { status: 200 }
  );
}

/**
 * DELETE: Clear analytics (development only)
 */
export async function DELETE(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  analyticsStorage.length = 0;
  aggregatedMetrics.totalEvents = 0;
  aggregatedMetrics.totalBatches = 0;
  aggregatedMetrics.uniqueSessions.clear();
  aggregatedMetrics.uniqueUsers.clear();
  aggregatedMetrics.eventsByCategory.clear();

  return NextResponse.json(
    {
      success: true,
      message: 'Analytics storage cleared',
    },
    { status: 200 }
  );
}
