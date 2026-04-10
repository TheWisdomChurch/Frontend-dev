/**
 * Church-Specific Analytics Tracker
 * Tracks engagement metrics unique to church websites:
 * - Donations & giving
 * - Event registrations & attendance
 * - Volunteer interest
 * - Sermon engagement
 * - Member interactions
 * - Prayer requests
 * - Testimonies shared
 */

'use client';

import { useAnalytics } from '@/shared/providers/AnalyticsProvider';
import { useCallback } from 'react';

export interface DonationEvent {
  amount: number;
  currency?: string;
  method?: 'card' | 'bank' | 'mobile' | 'other';
  purpose?: 'general' | 'offering' | 'project' | 'emergency';
  donorName?: string;
  isAnonymous?: boolean;
}

export interface EventEngagementEvent {
  eventId: string;
  eventName: string;
  eventType?: 'service' | 'conference' | 'workshop' | 'meeting' | 'outreach';
  action: 'view' | 'register' | 'attend' | 'share';
  attendees?: number;
  registrationSource?: 'website' | 'social' | 'referral' | 'email';
}

export interface VolunteerEvent {
  ministryName: string;
  ministryType?:
    | 'youth'
    | 'women'
    | 'men'
    | 'children'
    | 'outreach'
    | 'ushering'
    | 'media';
  action: 'express_interest' | 'register' | 'complete_training' | 'serve';
  hoursCommitted?: number;
  frequency?: 'weekly' | 'monthly' | 'occasional' | 'seasonal';
}

export interface SermonEngagementEvent {
  sermonId: string;
  sermonTitle: string;
  speaker?: string;
  duration?: number; // seconds watched
  percentageWatched?: number; // 0-100
  action: 'view' | 'share' | 'download' | 'bookmark';
}

export interface MemberInteractionEvent {
  memberId?: string;
  memberName?: string;
  interactionType:
    | 'prayer_request'
    | 'testimony_submitted'
    | 'profile_updated'
    | 'group_joined'
    | 'resource_downloaded';
  resourceType?: string;
  engagementScore?: number;
}

export interface EngagementMetrics {
  pageViews: number;
  eventRegistrations: number;
  volunteerSignups: number;
  donationsReceived: number;
  sermonEngagement: number;
  prayerRequests: number;
  testimoniesShared: number;
  memberInteractions: number;
}

/**
 * Hook for church-specific analytics tracking
 */
export function useChurchAnalytics() {
  const { trackEvent, identify } = useAnalytics();

  // ====================================================================
  // DONATION TRACKING
  // ====================================================================

  const trackDonation = useCallback(
    (donation: DonationEvent) => {
      trackEvent('church_donation', {
        amount: donation.amount,
        currency: donation.currency || 'NGN',
        method: donation.method || 'card',
        purpose: donation.purpose || 'general',
        is_anonymous: donation.isAnonymous ?? false,
        donor_name: donation.donorName,
        event_type: 'conversion', // ✅ Meta Pixel conversion
      });
    },
    [trackEvent]
  );

  // ====================================================================
  // EVENT ENGAGEMENT TRACKING
  // ====================================================================

  const trackEventEngagement = useCallback(
    (event: EventEngagementEvent) => {
      trackEvent('church_event_engagement', {
        event_id: event.eventId,
        event_name: event.eventName,
        event_type: event.eventType || 'service',
        engagement_action: event.action,
        attendees: event.attendees,
        registration_source: event.registrationSource,
        event_category: 'engagement',
      });

      // Track registration as a lead for Meta Pixel
      if (event.action === 'register') {
        trackEvent('lead_generated', {
          lead_type: 'event_registration',
          event_name: event.eventName,
          event_type: event.eventType,
        });
      }
    },
    [trackEvent]
  );

  // ====================================================================
  // VOLUNTEER/MINISTRY TRACKING
  // ====================================================================

  const trackVolunteerAction = useCallback(
    (volunteer: VolunteerEvent) => {
      trackEvent('church_volunteer_action', {
        ministry_name: volunteer.ministryName,
        ministry_type: volunteer.ministryType,
        volunteer_action: volunteer.action,
        hours_committed: volunteer.hoursCommitted,
        frequency: volunteer.frequency,
        event_category: 'volunteer',
      });

      // Track volunteer signup as lead
      if (
        volunteer.action === 'register' ||
        volunteer.action === 'express_interest'
      ) {
        trackEvent('lead_generated', {
          lead_type: 'volunteer_signup',
          ministry: volunteer.ministryName,
          ministry_type: volunteer.ministryType,
        });
      }
    },
    [trackEvent]
  );

  // ====================================================================
  // SERMON ENGAGEMENT TRACKING
  // ====================================================================

  const trackSermonEngagement = useCallback(
    (sermon: SermonEngagementEvent) => {
      trackEvent('church_sermon_engagement', {
        sermon_id: sermon.sermonId,
        sermon_title: sermon.sermonTitle,
        speaker: sermon.speaker,
        watch_duration: sermon.duration,
        watch_percentage: sermon.percentageWatched,
        engagement_action: sermon.action,
        event_category: 'content_engagement',
      });
    },
    [trackEvent]
  );

  // ====================================================================
  // MEMBER INTERACTION TRACKING
  // ====================================================================

  const trackMemberInteraction = useCallback(
    (interaction: MemberInteractionEvent) => {
      trackEvent('church_member_interaction', {
        member_id: interaction.memberId,
        member_name: interaction.memberName,
        interaction_type: interaction.interactionType,
        resource_type: interaction.resourceType,
        engagement_score: interaction.engagementScore,
        event_category: 'member_engagement',
      });

      // Special tracking for high-engagement actions
      if (interaction.interactionType === 'prayer_request') {
        trackEvent('prayer_request_submitted', {
          member_id: interaction.memberId,
          engagement_depth: 'high',
        });
      }

      if (interaction.interactionType === 'testimony_submitted') {
        trackEvent('testimony_shared', {
          member_id: interaction.memberId,
          engagement_depth: 'very_high',
          event_type: 'milestone',
        });
      }
    },
    [trackEvent]
  );

  // ====================================================================
  // MEMBER IDENTIFICATION (for CRM integration)
  // ====================================================================

  const identifyMember = useCallback(
    (memberId: string, memberData: any) => {
      identify({
        user_id: memberId,
        email: memberData.email,
        first_name: memberData.firstName,
        last_name: memberData.lastName,
        phone: memberData.phone,
        member_type: memberData.memberType, // 'member', 'attendee', 'volunteer', 'donor'
        member_since: memberData.memberSince,
        ministry_interests: memberData.ministryInterests,
        engagement_level: memberData.engagementLevel, // 'high', 'medium', 'low'
        total_donations: memberData.totalDonations,
        events_attended: memberData.eventsAttended,
        volunteer_hours: memberData.volunteerHours,
      });
    },
    [identify]
  );

  // ====================================================================
  // ENGAGEMENT SCORING
  // ====================================================================

  const calculateEngagementScore = useCallback(
    (metrics: Partial<EngagementMetrics>): number => {
      let score = 0;

      // Page views (1 point per 5 views)
      if (metrics.pageViews) score += Math.floor(metrics.pageViews / 5);

      // Event registrations (10 points each)
      if (metrics.eventRegistrations) score += metrics.eventRegistrations * 10;

      // Volunteer signups (15 points each)
      if (metrics.volunteerSignups) score += metrics.volunteerSignups * 15;

      // Donations (1 point per N currency unit, min 5 points)
      if (metrics.donationsReceived)
        score += Math.max(5, Math.floor(metrics.donationsReceived / 1000));

      // Sermon engagement (5 points per watch)
      if (metrics.sermonEngagement) score += metrics.sermonEngagement * 5;

      // Prayer requests (3 points each)
      if (metrics.prayerRequests) score += metrics.prayerRequests * 3;

      // Testimonies shared (20 points each)
      if (metrics.testimoniesShared) score += metrics.testimoniesShared * 20;

      // Member interactions (2 points each)
      if (metrics.memberInteractions) score += metrics.memberInteractions * 2;

      return score;
    },
    []
  );

  return {
    trackDonation,
    trackEventEngagement,
    trackVolunteerAction,
    trackSermonEngagement,
    trackMemberInteraction,
    identifyMember,
    calculateEngagementScore,
  };
}
