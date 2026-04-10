'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MenPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from('.men-hero-title', {
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
            Brotherhood & Leadership
          </div>

          <h1 className="hero-title men-hero-title">
            Men of
            <br />
            <em>Integrity</em>
          </h1>

          <p className="hero-sub">
            Building godly men rooted in biblical principles, accountability,
            and community impact through mentorship and service.
          </p>

          <button
            onClick={() => (window.location.href = '/contact')}
            className="btn-primary"
            style={{ marginTop: '2rem', cursor: 'pointer' }}
          >
            Join the Brotherhood
          </button>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Men's Meeting</div>
            <div className="time-val">Monthly · Second Saturday</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Accountability Groups</div>
            <div className="time-val">Bi-weekly Meetings</div>
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
            <div className="time-label">Leader</div>
            <div className="time-val">Deacon Mike Okonkwo</div>
          </div>
        </div>
      </div>

      <section>
        <span className="section-tag">Our Values</span>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          Men's Ministry
          <br />
          <em>Foundation</em>
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
          <div style={{ fontSize: '80px', textAlign: 'center' }}>💪</div>

          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '16px',
                lineHeight: '1.8',
                marginBottom: '2rem',
              }}
            >
              Our Men's Ministry is committed to building strong, godly men who
              walk in integrity, lead their families and communities with
              biblical principles, and become powerful witnesses of Christ's
              love and strength.
            </p>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {[
                'Integrity and biblical manhood',
                'Accountability and brotherhood',
                'Servant leadership development',
                'Family and community impact',
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
        <span className="section-tag">What We Offer</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Men's Ministry
          <br />
          <em>Programs</em>
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
              title: 'Bible Study',
              icon: '📖',
              desc: 'Dive deep into Scripture and biblical leadership principles',
            },
            {
              title: 'Accountability Groups',
              icon: '🤝',
              desc: 'Close fellowships for mutual support and growth',
            },
            {
              title: 'Leadership Training',
              icon: '🏆',
              desc: 'Develop skills for church and family leadership',
            },
            {
              title: 'Service Projects',
              icon: '🛠️',
              desc: 'Community projects and outreach initiatives',
            },
            {
              title: 'Mentorship',
              icon: '👨‍🏫',
              desc: 'One-on-one mentoring relationships and coaching',
            },
            {
              title: "Men's Events",
              icon: '⛳',
              desc: 'Fellowship events and spiritual retreats',
            },
          ].map((program, idx) => (
            <div
              key={idx}
              className="expect-card"
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '60px', marginBottom: '1rem' }}>
                {program.icon}
              </div>
              <div className="expect-title">{program.title}</div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                }}
              >
                {program.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <span className="section-tag">Leadership</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Men's Ministry
          <br />
          <em>Leaders</em>
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
              name: 'Deacon Mike Okonkwo',
              role: "Men's Ministry Leader",
              icon: '👔',
            },
            {
              name: 'Brother Segun Adebayo',
              role: 'Co-Leader & Training',
              icon: '👨‍💼',
            },
            {
              name: 'Brother Tunde Okafor',
              role: 'Community Projects',
              icon: '👨‍🔧',
            },
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
            <div className="event-tag">🎯 Rise Up!</div>
            <div className="event-title">Join Our Men's Ministry</div>
            <div className="event-desc">
              Connect with godly men, grow in faith, and make a lasting impact
              on your family and community.
            </div>
          </div>
          <Link href="/contact" className="btn-primary">
            Get Connected
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
              Men's Ministry - Building godly leaders.
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
              Men's Office
              <br />
              0706 999 5402
            </div>
            <div className="footer-contact-item">men@wisdomhq.org</div>
          </div>
          <div>
            <div className="footer-col-title">Connect</div>
            <div className="footer-contact-item">
              Second Saturday Monthly
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
