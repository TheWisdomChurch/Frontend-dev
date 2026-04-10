'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function OutreachPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from('.outreach-hero-title', {
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
            Community Care & Impact
          </div>

          <h1 className="hero-title outreach-hero-title">
            Love in
            <br />
            <em>Action</em>
          </h1>

          <p className="hero-sub">
            Extending God's love beyond our walls through community service,
            humanitarian aid, and transformative outreach programs.
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
            <div className="time-label">Outreach Projects</div>
            <div className="time-val">Monthly Community Service</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Focus Areas</div>
            <div className="time-val">6 Major Initiatives</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Partnership</div>
            <div className="time-val">NGOs & Community Organizations</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Leader</div>
            <div className="time-val">Pastor Grace Okafor</div>
          </div>
        </div>
      </div>

      <section>
        <span className="section-tag">Our Vision</span>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          Outreach Ministry
          <br />
          <em>Impact</em>
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
          <div style={{ fontSize: '80px', textAlign: 'center' }}>🤝</div>

          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '16px',
                lineHeight: '1.8',
                marginBottom: '2rem',
              }}
            >
              Our Outreach Ministry demonstrates Christ's compassion by meeting
              the physical, emotional, and spiritual needs of our community. We
              believe in serving the vulnerable, voiceless, and
              marginalized—living out God's mandate to care for the least among
              us.
            </p>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {[
                'Community development projects',
                'Healthcare initiatives and clinics',
                'Education and skills training',
                'Relief and humanitarian aid',
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
          Outreach Programs
          <br />
          <em>& Projects</em>
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
              title: 'Medical Outreach',
              icon: '🏥',
              desc: 'Free medical clinics and health awareness campaigns',
            },
            {
              title: 'Education Support',
              icon: '🎓',
              desc: 'Scholarships, tutoring, and skills training programs',
            },
            {
              title: 'Food Relief',
              icon: '🍲',
              desc: 'Food banks and meal programs for vulnerable families',
            },
            {
              title: 'Shelter Support',
              icon: '🏠',
              desc: 'Housing assistance and community development projects',
            },
            {
              title: 'Disaster Relief',
              icon: '🆘',
              desc: 'Emergency response and humanitarian assistance',
            },
            {
              title: "Women's Empowerment",
              icon: '💪',
              desc: 'Vocational training and economic empowerment programs',
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
          Outreach Ministry
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
              name: 'Pastor Grace Okafor',
              role: 'Outreach Ministry Director',
              icon: '👩‍💼',
            },
            {
              name: 'Brother Femi Adebayo',
              role: 'Community Projects Lead',
              icon: '👨‍💼',
            },
            {
              name: 'Sister Cynthia Omoniya',
              role: "Women's & Health Programs",
              icon: '👩‍⚕️',
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
            <div className="event-tag">❤️ Make a Difference</div>
            <div className="event-title">Join Our Outreach Ministry</div>
            <div className="event-desc">
              Serve your community and extend God's love through hands-on
              ministry and compassionate service.
            </div>
          </div>
          <Link href="/contact" className="btn-primary">
            Volunteer Today
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
              Outreach Ministry - Love in action.
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
              Outreach Office
              <br />
              0706 999 5404
            </div>
            <div className="footer-contact-item">outreach@wisdomhq.org</div>
          </div>
          <div>
            <div className="footer-col-title">Connect</div>
            <div className="footer-contact-item">
              Monthly Projects
              <br />
              Community-Wide
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
