'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ChildrenPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from('.children-hero-title', {
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
            Ages 0-12
          </div>

          <h1 className="hero-title children-hero-title">
            Growing Up in
            <br />
            <em>God's Love</em>
          </h1>

          <p className="hero-sub">
            A safe, fun, and faith-filled environment where children learn about
            Jesus, grow in God's Word, and discover their unique purpose.
          </p>

          <button
            onClick={() => (window.location.href = '/contact')}
            className="btn-primary"
            style={{ marginTop: '2rem', cursor: 'pointer' }}
          >
            Enroll Your Child
          </button>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Children's Service</div>
            <div className="time-val">Sundays · 9:00 AM</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Grade Groups</div>
            <div className="time-val">Nursery to Grade 6</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Location</div>
            <div className="time-val">Children's Wing</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Director</div>
            <div className="time-val">Sister Iya Okafor</div>
          </div>
        </div>
      </div>

      <section>
        <span className="section-tag">Our Promise</span>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          Children's Ministry
          <br />
          <em>Mission</em>
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
          <div style={{ fontSize: '80px', textAlign: 'center' }}>👶</div>

          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '16px',
                lineHeight: '1.8',
                marginBottom: '2rem',
              }}
            >
              Our Children's Ministry creates a joyful, safe, and engaging
              environment where children experience God's love, learn biblical
              values, and grow spiritually while making wonderful friends and
              memories.
            </p>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {[
                'Bible stories and teachings',
                'Fun, age-appropriate activities',
                'Safe, supervised environment',
                'Character development',
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
          Children's Ministry
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
              title: 'Bible Classes',
              icon: '📚',
              desc: 'Age-appropriate Bible stories and teachings',
            },
            {
              title: 'Arts & Crafts',
              icon: '🎨',
              desc: 'Creative activities reinforcing Bible lessons',
            },
            {
              title: 'Worship Circle',
              icon: '🎵',
              desc: 'Kid-friendly worship and praise songs',
            },
            {
              title: 'Games & Activities',
              icon: '🎮',
              desc: 'Fun, interactive learning experiences',
            },
            {
              title: 'Seasonal Events',
              icon: '🎄',
              desc: 'Special celebrations and holiday programs',
            },
            {
              title: 'Field Trips',
              icon: '🚌',
              desc: 'Educational and fun outings for children',
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
        <span className="section-tag">Our Team</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Children's Ministry
          <br />
          <em>Staff & Volunteers</em>
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
              name: 'Sister Iya Okafor',
              role: 'Ministry Director',
              icon: '👩‍🏫',
            },
            {
              name: 'Sister Bimbo Oluwande',
              role: 'Assistant Director',
              icon: '👩‍💼',
            },
            {
              name: 'Brother Emeka Eze',
              role: 'Activities Coordinator',
              icon: '👨‍💼',
            },
          ].map((staff, idx) => (
            <div
              key={idx}
              className="expect-card"
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '60px', marginBottom: '1rem' }}>
                {staff.icon}
              </div>
              <div className="expect-title">{staff.name}</div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--gold-light)',
                  marginBottom: '1rem',
                  fontWeight: '500',
                }}
              >
                {staff.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="event-banner">
          <div>
            <div className="event-tag">🌈 Welcome!</div>
            <div className="event-title">
              Give Your Child a Loving Faith Community
            </div>
            <div className="event-desc">
              Join hundreds of children discovering God's love in a safe, fun,
              and nurturing environment.
            </div>
          </div>
          <Link href="/contact" className="btn-primary">
            Register Now
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
              Children's Ministry - Growing young hearts.
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
              Children's Office
              <br />
              0706 999 5403
            </div>
            <div className="footer-contact-item">kids@wisdomhq.org</div>
          </div>
          <div>
            <div className="footer-col-title">Hours</div>
            <div className="footer-contact-item">
              Sundays · 9:00 AM
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
