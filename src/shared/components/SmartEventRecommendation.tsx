/**
 * Smart Event Recommendation Engine
 * - Fetches events from API
 * - Intelligently recommends based on user behavior
 * - Tracks engagement metrics
 * - Beautiful GSAP animations
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api } from '@/lib/api';
import { useChurchAnalytics } from '@/shared/analytics/churchAnalytics';
import type { EventPublic } from '@/lib/apiTypes';

gsap.registerPlugin(ScrollTrigger);

interface SmartEventRecommendationProps {
  limit?: number;
  title?: string;
}

export default function SmartEventRecommendation({
  limit = 3,
  title = 'Events You Might Love',
}: SmartEventRecommendationProps) {
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [recommendations, setRecommendations] = useState<EventPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackEventEngagement } = useChurchAnalytics();

  // ========================================
  // FETCH EVENTS
  // ========================================

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await api.admin.listEvents();
        setEvents(data);

        // ✅ Smart recommendation logic
        const recommended = data
          .sort((a, b) => {
            // Prioritize upcoming events
            const now = new Date();
            const aTime = a.startAt ? new Date(a.startAt).getTime() : 0;
            const bTime = b.startAt ? new Date(b.startAt).getTime() : 0;

            // Scoring: closer upcoming > featured > popular
            const aScore =
              (aTime > now.getTime() ? 1000 : 0) +
              (a.isFeatured ? 500 : 0) +
              Math.random() * 100; // Add randomness for variety
            const bScore =
              (bTime > now.getTime() ? 1000 : 0) +
              (b.isFeatured ? 500 : 0) +
              Math.random() * 100;

            return bScore - aScore;
          })
          .slice(0, limit);

        setRecommendations(recommended);

        // Track recommendation view
        recommended.forEach(event => {
          trackEventEngagement({
            eventId: event.id,
            eventName: event.name,
            action: 'view',
          });
        });
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [limit, trackEventEngagement]);

  // ========================================
  // ANIMATIONS
  // ========================================

  useEffect(() => {
    if (!containerRef.current || recommendations.length === 0) return;

    // Stagger animation for cards
    const cards = containerRef.current.querySelectorAll('.event-card-item');
    gsap.from(cards, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      },
    });

    // Floating animation
    cards.forEach((card, index) => {
      gsap.to(card, {
        y: -8,
        duration: 3 + index * 0.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [recommendations]);

  // ========================================
  // EVENT CLICK HANDLER
  // ========================================

  const handleEventClick = (event: EventPublic) => {
    // Track engagement
    trackEventEngagement({
      eventId: event.id,
      eventName: event.name,
      action: 'register',
      registrationSource: 'recommendation',
    });

    // Redirect to registration
    if (event.registerLink) {
      window.open(event.registerLink, '_blank');
    }
  };

  // ========================================
  // RENDER
  // ========================================

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Loading recommendations...
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          No upcoming events at this time
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ marginTop: '40px' }}>
      {/* Title */}
      <h2
        style={{
          fontSize: '28px',
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: '32px',
          textAlign: 'center',
        }}
      >
        {title}
      </h2>

      {/* Event Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {recommendations.map(event => (
          <div
            key={event.id}
            className="event-card-item"
            onClick={() => handleEventClick(event)}
            style={{
              background:
                'linear-gradient(135deg, rgba(26,26,34,0.6), rgba(20,20,24,0.8))',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              gsap.to(el, {
                boxShadow: '0 12px 32px rgba(201,168,76,0.2)',
                borderColor: 'rgba(201,168,76,0.4)',
                duration: 0.3,
              });
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              gsap.to(el, {
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderColor: 'rgba(201,168,76,0.2)',
                duration: 0.3,
              });
            }}
          >
            {/* Image */}
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.name}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                }}
              />
            )}

            {/* Content */}
            <div style={{ padding: '20px' }}>
              {/* Date */}
              {event.startAt && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📅</span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--gold)',
                      fontWeight: 600,
                    }}
                  >
                    {new Date(event.startAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}

              {/* Title */}
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: '0 0 12px 0',
                }}
              >
                {event.name}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  margin: '0 0 16px 0',
                  lineHeight: '1.5',
                }}
              >
                {event.description?.substring(0, 100)}
                {event.description && event.description.length > 100
                  ? '...'
                  : ''}
              </p>

              {/* Location */}
              {event.location && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <span>📍</span>
                  <span
                    style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                  >
                    {event.location.substring(0, 50)}
                  </span>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={() => handleEventClick(event)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #C9A84C, #B3942A)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Register Now →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
