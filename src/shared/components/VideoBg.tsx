/**
 * Member Engagement Tracker
 * - Tracks member interactions
 * - Shows engagement metrics
 * - Provides engagement insights
 * - Beautiful visualizations
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  useChurchAnalytics,
  type EngagementMetrics,
} from '@/shared/analytics/churchAnalytics';

interface MemberProfile {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  engagementScore: number;
  engagementLevel: 'low' | 'medium' | 'high' | 'very_high';
  metrics: EngagementMetrics;
  avatar?: string;
}

interface MemberEngagementTrackerProps {
  memberId?: string;
  onMemberUpdate?: (member: MemberProfile) => void;
}

export default function MemberEngagementTracker({
  memberId,
  onMemberUpdate,
}: MemberEngagementTrackerProps) {
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { calculateEngagementScore } = useChurchAnalytics();

  useEffect(() => {
    let active = true;

    const loadMember = async () => {
      const mockMember: MemberProfile = {
        id: memberId || 'member_001',
        name: 'John Doe',
        email: 'john@example.com',
        joinDate: new Date('2023-01-15'),
        metrics: {
          pageViews: 45,
          eventRegistrations: 3,
          volunteerSignups: 1,
          donationsReceived: 15000,
          sermonEngagement: 8,
          prayerRequests: 2,
          testimoniesShared: 1,
          memberInteractions: 12,
        },
        engagementScore: 0,
        engagementLevel: 'high',
      };

      mockMember.engagementScore = calculateEngagementScore(mockMember.metrics);

      if (mockMember.engagementScore >= 100) {
        mockMember.engagementLevel = 'very_high';
      } else if (mockMember.engagementScore >= 50) {
        mockMember.engagementLevel = 'high';
      } else if (mockMember.engagementScore >= 20) {
        mockMember.engagementLevel = 'medium';
      } else {
        mockMember.engagementLevel = 'low';
      }

      if (!active) return;

      setMember(mockMember);
      onMemberUpdate?.(mockMember);
      setIsLoading(false);
    };

    loadMember();

    return () => {
      active = false;
    };
  }, [memberId, calculateEngagementScore, onMemberUpdate]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        Loading engagement data...
      </div>
    );
  }

  if (!member) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        No member data available
      </div>
    );
  }

  const engagementColors: Record<MemberProfile['engagementLevel'], string> = {
    low: '#FF6B6B',
    medium: '#FFA500',
    high: '#4CAF50',
    very_high: '#00FF88',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A84C, #B3942A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: '#000',
              }}
            >
              {member.name.charAt(0)}
            </div>
          )}

          <div>
            <h2 style={{ margin: 0, color: 'var(--text)', fontSize: '20px' }}>
              {member.name}
            </h2>
            <p
              style={{
                margin: '4px 0 0 0',
                color: 'var(--text-secondary)',
                fontSize: '14px',
              }}
            >
              {member.email}
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(201,168,76,0.1)',
            border: `2px solid ${engagementColors[member.engagementLevel]}`,
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Engagement Score
              </p>
              <p
                style={{
                  margin: '8px 0 0 0',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: engagementColors[member.engagementLevel],
                }}
              >
                {member.engagementScore}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Level
              </p>
              <p
                style={{
                  margin: '8px 0 0 0',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: engagementColors[member.engagementLevel],
                  textTransform: 'capitalize',
                }}
              >
                {member.engagementLevel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          📊 Engagement Breakdown
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {Object.entries(member.metrics).map(([key, value]) => (
            <MetricCard
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').trim()}
              value={value}
              icon={getMetricIcon(key)}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: 'var(--text-secondary)',
            fontSize: '12px',
          }}
        >
          Member since {member.joinDate.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  icon: string;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.from(cardRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        background: 'rgba(26,26,34,0.4)',
        border: '1px solid rgba(201,168,76,0.1)',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        gsap.to(e.currentTarget, {
          scale: 1.05,
          boxShadow: '0 4px 12px rgba(201,168,76,0.1)',
          duration: 0.3,
        });
      }}
      onMouseLeave={e => {
        gsap.to(e.currentTarget, {
          scale: 1,
          boxShadow: 'none',
          duration: 0.3,
        });
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: 'var(--text-secondary)',
          textTransform: 'capitalize',
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: '8px 0 0 0',
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--gold)',
        }}
      >
        {value}
      </p>
    </div>
  );
}

function getMetricIcon(key: string): string {
  const icons: Record<string, string> = {
    pageViews: '👁️',
    eventRegistrations: '📅',
    volunteerSignups: '🤝',
    donationsReceived: '💝',
    sermonEngagement: '🎤',
    prayerRequests: '🙏',
    testimoniesShared: '💬',
    memberInteractions: '👤',
  };

  return icons[key] || '📊';
}
