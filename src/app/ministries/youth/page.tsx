'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function YouthPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from('.youth-hero-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  return (
    <div ref={pageRef}>
      <section className="hero" style={{ minHeight: '80vh' }}>
        <VideoBg
          src="/videos/hero.mp4"
          overlay={true}
          overlayOpacity={0.35}
          autoPlay={true}
          muted={true}
          loop={true}
        />
        <div className="hero-grid" />

        <div className="hero-content" style={{ maxWidth: '900px' }}>
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            Ages 13-25
          </div>

          <h1 className="hero-title youth-hero-title">
            Rise Up
            <br />
            <em>Young Voices</em>
          </h1>

          <p className="hero-sub">
            Empowering young people to grow in faith, develop leadership, and
            make a kingdom impact in their generation.
          </p>

          <button
            onClick={() => (window.location.href = '/contact')}
            className="btn-primary"
            style={{ marginTop: '2rem', cursor: 'pointer' }}
          >
            Get Involved
          </button>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Youth Service</div>
            <div className="time-val">Sundays · 10:30 AM</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Age Group</div>
            <div className="time-val">13 - 25 Years</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Location</div>
            <div className="time-val">Honor Gardens Main Hall</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Leaders</div>
            <div className="time-val">Pastor David & Team</div>
          </div>
        </div>
      </div>

      <section>
        <span className="section-tag">Our Purpose</span>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          Youth Ministry
          <br />
          <em>Vision</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
            marginBottom: '4rem',
          }}
        >
          <div style={{ fontSize: '80px', textAlign: 'center' }}>🎯</div>

          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '16px',
                lineHeight: '1.8',
                marginBottom: '2rem',
              }}
            >
              Our Youth Ministry is dedicated to creating a safe, vibrant, and
              Christ-centered community where young people can grow in their
              faith, develop their gifts, and become leaders who impact their
              generation. We believe that every young person has unique
              potential and purpose in God's kingdom.
            </p>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {[
                'Build strong biblical foundation',
                'Develop leadership and character',
                'Create authentic community',
                'Equip young people for service',
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      color: 'var(--gold)',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ color: 'var(--text)', fontSize: '15px' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          background: 'var(--charcoal)',
          borderTop: '0.5px solid var(--border)',
        }}
      >
        <span className="section-tag">What We Do</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Youth
          <br />
          <em>Activities & Events</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {[
            {
              title: 'Cell Groups',
              icon: '👥',
              desc: 'Small group meetings for Bible study, prayer, and fellowship',
            },
            {
              title: 'Worship & Service',
              icon: '🎵',
              desc: 'Lead worship, serve in church, and grow spiritually',
            },
            {
              title: 'Outreach Programs',
              icon: '🤝',
              desc: 'Community service and mission opportunities',
            },
            {
              title: 'Youth Conferences',
              icon: '📚',
              desc: 'Annual conferences for spiritual growth and networking',
            },
            {
              title: 'Leadership Training',
              icon: '🏆',
              desc: 'Develop skills and prepare for ministry roles',
            },
            {
              title: 'Social Events',
              icon: '🎉',
              desc: 'Fun activities and events to build community',
            },
          ].map((activity, idx) => (
            <div
              key={idx}
              className="expect-card"
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '60px', marginBottom: '1rem' }}>
                {activity.icon}
              </div>
              <div className="expect-title">{activity.title}</div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                }}
              >
                {activity.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <span className="section-tag">Meet the Leaders</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Youth
          <br />
          <em>Leadership Team</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {[
            { name: 'Pastor David Obi', role: 'Youth Pastor', icon: '👔' },
            {
              name: 'Tunde Adeyemi',
              role: 'Assistant Youth Pastor',
              icon: '👨‍💼',
            },
            { name: 'Joy Akande', role: "Women's Coordinator", icon: '👩‍💼' },
          ].map((leader, idx) => (
            <div
              key={idx}
              className="expect-card"
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '60px', marginBottom: '1rem' }}>
                {leader.icon}
              </div>
              <div className="expect-title">{leader.name}</div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--gold-light)',
                  marginBottom: '1rem',
                  fontWeight: '500',
                }}
              >
                {leader.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="event-banner">
          <div>
            <div className="event-tag">🚀 Ready to Join?</div>
            <div className="event-title">
              Become Part of Our Youth Community
            </div>
            <div className="event-desc">
              Experience faith, friendship, and purpose with young people who
              are passionate about following Jesus.
            </div>
          </div>
          <Link href="/contact" className="btn-primary">
            Get Started
          </Link>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div>
            <div className="nav-logo">
              <div className="nav-logo-icon">W</div>
              <span className="nav-logo-text">The Wisdom Church</span>
            </div>
            <p className="footer-brand-desc" style={{ marginTop: '1rem' }}>
              Youth Ministry - Empowering the next generation.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-links">
              <li>
                <Link href="/ministries">Ministries</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-contact-item">
              Youth Office
              <br />
              0706 999 5400
            </div>
            <div className="footer-contact-item">youth@wisdomhq.org</div>
          </div>
          <div>
            <div className="footer-col-title">Connect</div>
            <div className="footer-contact-item">
              Sundays · 10:30 AM
              <br />
              Honor Gardens
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 The Wisdom House Church. All Rights Reserved.</span>
          <div className="footer-bottom-links">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
