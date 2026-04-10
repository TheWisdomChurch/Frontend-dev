'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function WomenPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from('.women-hero-title', {
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
            Sisterhood & Strength
          </div>

          <h1 className="hero-title women-hero-title">
            Women of
            <br />
            <em>Purpose</em>
          </h1>

          <p className="hero-sub">
            Connecting women in faith, growth, mentorship, and empowerment
            through Bible study, fellowship, and service.
          </p>

          <button
            onClick={() => (window.location.href = '/contact')}
            className="btn-primary"
            style={{ marginTop: '2rem', cursor: 'pointer' }}
          >
            Join Our Community
          </button>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Women's Meeting</div>
            <div className="time-val">Monthly · First Saturday</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Bible Study Groups</div>
            <div className="time-val">Thursdays · 2:00 PM</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Location</div>
            <div className="time-val">Honor Gardens Fellowship Hall</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Leader</div>
            <div className="time-val">Sister Funke Okafor</div>
          </div>
        </div>
      </div>

      <section>
        <span className="section-tag">Our Promise</span>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          Women's Ministry
          <br />
          <em>Empowerment</em>
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
          <div style={{ fontSize: '80px', textAlign: 'center' }}>👩‍🤝‍👩</div>

          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '16px',
                lineHeight: '1.8',
                marginBottom: '2rem',
              }}
            >
              Our Women's Ministry creates a nurturing environment where women
              can grow in their faith, build meaningful friendships, develop
              their gifts, and equip themselves to make a powerful impact in
              their families, church, and communities.
            </p>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {[
                'Spiritual growth through Bible study',
                'Authentic fellowship and mentorship',
                'Leadership development and training',
                'Community service and outreach',
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
        <span className="section-tag">Our Initiatives</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Women's Ministry
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
              title: 'Bible Study Groups',
              icon: '📖',
              desc: 'Weekly and monthly groups diving deep into Scripture',
            },
            {
              title: 'Mentorship Program',
              icon: '🤝',
              desc: 'Connecting experienced women with those seeking guidance',
            },
            {
              title: 'Prayer Ministry',
              icon: '🙏',
              desc: 'Intercessory prayer and spiritual support network',
            },
            {
              title: 'Conferences & Retreats',
              icon: '🏨',
              desc: 'Annual events for spiritual renewal and growth',
            },
            {
              title: 'Community Service',
              icon: '💝',
              desc: 'Outreach programs serving widows and vulnerable women',
            },
            {
              title: "Women's Fellowship",
              icon: '🎉',
              desc: 'Social events for building authentic friendships',
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
          Women's Ministry
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
              name: 'Sister Funke Okafor',
              role: "Women's Ministry Leader",
              icon: '👩‍💼',
            },
            {
              name: 'Sister Tina Okafor',
              role: 'Co-Leader & Mentorship',
              icon: '👩‍🏫',
            },
            {
              name: 'Sister Bola Adebayo',
              role: 'Events & Fellowships',
              icon: '👩‍💻',
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
            <div className="event-tag">🌟 You're Invited!</div>
            <div className="event-title">Join Our Women's Community</div>
            <div className="event-desc">
              Connect with purposeful women growing together in faith, love, and
              service.
            </div>
          </div>
          <Link href="/contact" className="btn-primary">
            Connect With Us
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
              Women's Ministry - Growing in faith and purpose.
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
              Women's Office
              <br />
              0706 999 5401
            </div>
            <div className="footer-contact-item">women@wisdomhq.org</div>
          </div>
          <div>
            <div className="footer-col-title">Connect</div>
            <div className="footer-contact-item">
              First Saturday Monthly
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
