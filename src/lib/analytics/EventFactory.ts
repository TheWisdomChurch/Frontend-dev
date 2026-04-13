/**
 * Professional Event Tracking System
 * Advanced event categorization and tracking
 * User-focused event taxonomy
 */

export type EventCategory =
  | 'page_view'
  | 'user_engagement'
  | 'conversion'
  | 'form'
  | 'media'
  | 'error'
  | 'performance'
  | 'commerce'
  | 'social'
  | 'search'
  | 'custom';

export type EventAction =
  | 'view'
  | 'click'
  | 'submit'
  | 'scroll'
  | 'play'
  | 'pause'
  | 'complete'
  | 'error'
  | 'load'
  | 'share'
  | 'search'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'checkout'
  | 'purchase'
  | 'signup'
  | 'login'
  | 'logout'
  | 'custom';

export interface EventProperties {
  // Common properties
  [key: string]: any;

  // Page context
  page_title?: string;
  page_url?: string;
  page_path?: string;
  referrer?: string;

  // User context
  user_id?: string;
  anonymous_id?: string;
  session_id?: string;
  device_id?: string;

  // Engagement metrics
  time_on_page?: number;
  scroll_depth?: number;
  interaction_count?: number;

  // Device info
  device_type?: 'mobile' | 'tablet' | 'desktop';
  browser_name?: string;
  browser_version?: string;
  os_name?: string;
  os_version?: string;

  // Performance
  page_load_time?: number;
  interaction_latency?: number;

  // Value tracking
  value?: number;
  currency?: string;
  revenue?: number;

  // Error tracking
  error_message?: string;
  error_stack?: string;
  error_type?: string;
}

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  category: EventCategory;
  action: EventAction;
  label?: string;
  properties: EventProperties;
  context: {
    sessionId: string;
    anonymousId: string;
    userId?: string;
    deviceId: string;
  };
  metadata?: {
    source: 'auto' | 'manual';
    priority: 'low' | 'medium' | 'high';
    retryable: boolean;
  };
}

export class EventFactory {
  /**
   * Create page view event
   */
  static createPageViewEvent(
    pageTitle: string,
    pageUrl: string,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'page_view',
      action: 'view',
      label: pageTitle,
      properties: {
        page_title: pageTitle,
        page_url: pageUrl,
        page_path: new URL(pageUrl).pathname,
        ...properties,
      },
      metadata: {
        source: 'auto',
        priority: 'high',
        retryable: true,
      },
    };
  }

  /**
   * Create click event
   */
  static createClickEvent(
    label: string,
    element?: HTMLElement,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'user_engagement',
      action: 'click',
      label,
      properties: {
        element_type: element?.tagName,
        element_class: element?.className,
        element_id: element?.id,
        ...properties,
      },
      metadata: {
        source: 'auto',
        priority: 'medium',
        retryable: true,
      },
    };
  }

  /**
   * Create form submission event
   */
  static createFormSubmitEvent(
    formName: string,
    fields?: Record<string, any>,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'form',
      action: 'submit',
      label: formName,
      properties: {
        form_name: formName,
        form_fields: fields ? Object.keys(fields) : [],
        ...properties,
      },
      metadata: {
        source: 'manual',
        priority: 'high',
        retryable: true,
      },
    };
  }

  /**
   * Create scroll event
   */
  static createScrollEvent(
    scrollDepth: number,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'user_engagement',
      action: 'scroll',
      label: `Scroll to ${scrollDepth}%`,
      properties: {
        scroll_depth: scrollDepth,
        ...properties,
      },
      metadata: {
        source: 'auto',
        priority: 'low',
        retryable: false,
      },
    };
  }

  /**
   * Create conversion event
   */
  static createConversionEvent(
    conversionType: string,
    value?: number,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'conversion',
      action: 'complete',
      label: conversionType,
      properties: {
        conversion_type: conversionType,
        value,
        ...properties,
      },
      metadata: {
        source: 'manual',
        priority: 'high',
        retryable: true,
      },
    };
  }

  /**
   * Create error event
   */
  static createErrorEvent(
    errorType: string,
    message: string,
    stack?: string,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'error',
      action: 'error',
      label: errorType,
      properties: {
        error_type: errorType,
        error_message: message,
        error_stack: stack,
        ...properties,
      },
      metadata: {
        source: 'auto',
        priority: 'high',
        retryable: true,
      },
    };
  }

  /**
   * Create media event (video/audio)
   */
  static createMediaEvent(
    action: 'play' | 'pause' | 'complete',
    mediaTitle: string,
    duration?: number,
    currentTime?: number,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'media',
      action,
      label: mediaTitle,
      properties: {
        media_title: mediaTitle,
        media_duration: duration,
        media_current_time: currentTime,
        ...properties,
      },
      metadata: {
        source: 'auto',
        priority: 'medium',
        retryable: true,
      },
    };
  }

  /**
   * Create purchase event
   */
  static createPurchaseEvent(
    orderId: string,
    value: number,
    currency: string,
    items?: Array<{ name: string; quantity: number; price: number }>,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'commerce',
      action: 'purchase',
      label: orderId,
      properties: {
        order_id: orderId,
        value,
        currency,
        items,
        ...properties,
      },
      metadata: {
        source: 'manual',
        priority: 'high',
        retryable: true,
      },
    };
  }

  /**
   * Create search event
   */
  static createSearchEvent(
    query: string,
    results?: number,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'search',
      action: 'search',
      label: query,
      properties: {
        search_query: query,
        search_results: results,
        ...properties,
      },
      metadata: {
        source: 'manual',
        priority: 'medium',
        retryable: true,
      },
    };
  }

  /**
   * Create custom event
   */
  static createCustomEvent(
    eventName: string,
    properties?: Partial<EventProperties>
  ): Omit<AnalyticsEvent, 'id' | 'timestamp' | 'context'> {
    return {
      category: 'custom',
      action: 'custom',
      label: eventName,
      properties: properties || {},
      metadata: {
        source: 'manual',
        priority: 'medium',
        retryable: true,
      },
    };
  }
}
