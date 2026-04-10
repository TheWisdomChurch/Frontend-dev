'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MinistriesPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from('.ministry-hero-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.ministry-cards', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.3,
    });
  }, []);

  const ministries = [
    {
      id: 'youth',
      icon: '🎯',
      title: 'Youth Ministry',
      desc: 'Empowering young people ages 13-25 to grow in faith, develop leadership skills, and serve.',
      href: '/ministries/youth',
      stats: { members: '150+', events: '12/year' },
    },
    {
      id: 'women',
      icon: '👩',
      title: "Women's Ministry",
      desc: 'Supporting women in faith, growth, mentorship, and empowerment through Bible studies.',
      href: '/ministries/women',
      stats: { members: '200+', groups: '8' },
    },
    {
      id: 'men',
      icon: '👨',
      title: "Men's Ministry",
      desc: 'Building strong, godly men rooted in biblical principles and community accountability.',
      href: '/ministries/men',
      stats: { members: '120+', meetings: 'Monthly' },
    },
    {
      id: 'children',
      icon: '👶',
      title: "Children's Ministry",
      desc: 'Creating a safe, fun, and faith-filled environment for kids ages 0-12 to learn.',
      href: '/ministries/children',
      stats: { children: '300+', classes: '6' },
    },
    {
      id: 'outreach',
      icon: '🤝',
      title: 'Outreach & Missions',
      desc: "Extending God's love through community service, local outreach, and international missions.",
      href: '/ministries/outreach',
      stats: { projects: '10+', volunteers: '250+' },
    },
  ];

  const handleCardHover = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      y: -10,
      boxShadow: '0 20px 40px rgba(201, 168, 76, 0.2)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleCardHoverOut = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      y: 0,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

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
            Serving Through Ministry
          </div>

          <h1 className="hero-title ministry-hero-title">
            Connect, Grow &
            <br />
            <em>Serve Together</em>
          </h1>

          <p className="hero-sub">
            Discover how you can get involved in one of our dynamic ministries
            and make a real difference.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <Link href="#ministries" className="btn-primary">
              Explore Ministries
            </Link>
            <button
              className="btn-outline"
              onClick={() => (window.location.href = '/contact')}
              style={{ cursor: 'pointer' }}
            >
              Get Involved
            </button>
          </div>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Active Ministries</div>
            <div className="time-val">5+</div>
          </div>
        </div>
        <div className="time-sep" />
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Total Members</div>
            <div className="time-val">1000+</div>
          </div>
        </div>
        <div className="time-sep" />
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Volunteers</div>
            <div className="time-val">250+</div>
          </div>
        </div>
        <div className="time-sep" />
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Community Impact</div>
            <div className="time-val">Lives Changed</div>
          </div>
        </div>
      </div>

      <section id="ministries">
        <span className="section-tag">Our Ministries</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Ways to Get
          <br />
          <em>Involved</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {ministries.map(ministry => (
            <Link
              key={ministry.id}
              href={ministry.href}
              className="ministry-cards expect-card"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardHoverOut}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {ministry.icon}
              </div>
              <div className="expect-title">{ministry.title}</div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                }}
              >
                {ministry.desc}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {Object.entries(ministry.stats).map(([key, value]) => (
                  <div key={key} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: 'var(--gold)',
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        textTransform: 'capitalize',
                        marginTop: '0.25rem',
                      }}
                    >
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--gold-light)',
                  fontWeight: '500',
                }}
              >
                Learn More →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        style={{
          background: 'var(--charcoal)',
          borderTop: '0.5px solid var(--border)',
        }}
      >
        <span className="section-tag">What Drives Us</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Ministry
          <br />
          <em>Principles</em>
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
              num: '01',
              title: 'Discipleship',
              desc: 'Growing believers through mentorship and community.',
            },
            {
              num: '02',
              title: 'Service',
              desc: 'Serving communities with integrity and compassion.',
            },
            {
              num: '03',
              title: 'Inclusion',
              desc: 'Creating spaces where everyone feels welcomed.',
            },
            {
              num: '04',
              title: 'Impact',
              desc: 'Making lasting, transformative differences.',
            },
          ].map(principle => (
            <div
              key={principle.num}
              className="expect-card"
              style={{ textAlign: 'center' }}
            >
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: 'var(--gold)',
                  marginBottom: '1rem',
                }}
              >
                {principle.num}
              </div>
              <div className="expect-title">{principle.title}</div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                }}
              >
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="event-banner">
          <div>
            <div className="event-tag">🙌 Ready to Serve?</div>
            <div className="event-title">Join a Ministry Today</div>
            <div className="event-desc">
              Connect with our ministry leaders and find your place to serve.
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
              Serving through dynamic ministries and community impact.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Service Times</div>
            <div className="footer-contact-item">
              Sunday Worship
              <br />
              9:00 AM (WAT)
            </div>
            <div className="footer-contact-item">
              Midweek Service
              <br />
              Thursday · 6:00 PM
            </div>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-contact-item">
              Honor Gardens, Alasia, Lekki-Epe Expressway, Lagos
            </div>
            <div className="footer-contact-item">0706 999 5333</div>
            <div className="footer-contact-item">Wisdomhousehq@gmail.com</div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 The Wisdom House Church. All Rights Reserved.</span>
          <div className="footer-bottom-links">
            <Link href="/terms">Privacy Policy</Link>
            <Link href="/cookies">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
