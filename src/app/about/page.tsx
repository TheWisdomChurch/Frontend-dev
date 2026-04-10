'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';

export default function AboutPage() {
  const culturePillars = [
    {
      num: '01',
      title: 'Presence-driven',
      desc: 'Spirit-led worship, prayer, and obedience at the core of every gathering.',
    },
    {
      num: '02',
      title: 'Word-centered',
      desc: 'Practical, transforming teaching that builds complete believers.',
    },
    {
      num: '03',
      title: 'People-first',
      desc: 'Authentic community, hospitality, and service across every generation.',
    },
    {
      num: '04',
      title: 'Excellence-driven',
      desc: 'High standards in every detail, honoring God through quality and care.',
    },
  ];

  const values = [
    { label: 'Core', value: 'Obedience & Service' },
    { label: 'Focus', value: 'Word & Power' },
    { label: 'Culture', value: 'Excellence & Love' },
  ];

  return (
    <>
      {/* Hero */}
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

        <div className="hero-content" style={{ maxWidth: '800px' }}>
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            Learn more about our church
          </div>

          <h1 className="hero-title">
            About
            <br />
            <em>The Wisdom Church</em>
          </h1>

          <p className="hero-sub">
            A Spirit-filled family committed to raising complete believers,
            rooted in Christ, empowered by wisdom, and established in faith
            across all generations.
          </p>

          <div className="hero-actions">
            <Link href="#mission" className="btn-primary">
              Our Mission
            </Link>
            <Link href="#culture" className="btn-outline">
              Our Culture
            </Link>
          </div>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Founded</div>
            <div className="time-val">A Legacy of Faith</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Vision</div>
            <div className="time-val">Raise Complete Believers</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Leaders</div>
            <div className="time-val">Bishop Gabriel Ayilara</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Reach</div>
            <div className="time-val">Growing Community</div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section id="mission">
        <span className="section-tag">Our Identity</span>
        <h2 className="section-title">
          Who we are &
          <br />
          <em>what we stand for</em>
        </h2>

        <p
          className="section-body"
          style={{ marginBottom: '3rem', maxWidth: '700px' }}
        >
          The Wisdom Church is a trans-generational movement of faith and
          excellence, committed to spreading the Gospel and empowering believers
          through the Word of God and the Holy Spirit. We are dedicated to
          raising complete believers—spiritually mature, practically equipped,
          and community-minded.
        </p>

        <div className="expect-grid">
          {values.map((value, idx) => (
            <div key={value.label} className="expect-card">
              <div className="expect-num" style={{ opacity: 0.3 }}>
                0{idx + 1}
              </div>
              <div className="expect-title">{value.label}</div>
              <div className="expect-desc">{value.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" style={{ background: 'var(--charcoal)' }}>
        <span className="section-tag">Our Culture</span>
        <h2 className="section-title">
          Built on pillars of
          <br />
          <em>faith & excellence</em>
        </h2>

        <p className="section-body" style={{ marginBottom: '3rem' }}>
          Our church culture is shaped by core values that define how we
          worship, serve, and relate to one another. These pillars guide every
          decision and interaction within our community.
        </p>

        <div className="expect-grid">
          {culturePillars.map(pillar => (
            <div key={pillar.num} className="expect-card">
              <div className="expect-num">{pillar.num}</div>
              <div className="expect-title">{pillar.title}</div>
              <div className="expect-desc">{pillar.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section
        style={{
          background: 'var(--charcoal)',
          borderTop: '0.5px solid var(--border)',
        }}
      >
        <div className="pastor-section">
          <div className="pastor-img-wrap">
            <div className="pastor-img-frame">
              <div className="pastor-placeholder">✝</div>
            </div>
            <div className="pastor-badge">
              <div className="pastor-badge-title">Senior Pastor</div>
              <div className="pastor-badge-name">Bishop Gabriel Ayilara</div>
            </div>
          </div>

          <div>
            <span className="section-tag">Leadership</span>
            <h2 className="section-title">
              Servants of the
              <br />
              <em>Most High God</em>
            </h2>

            <blockquote className="pastor-quote">
              "Our leadership is committed to modeling Christ-like service,
              spiritual integrity, and pastoral care to every member of our
              congregation."
            </blockquote>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-muted)',
                lineHeight: '1.8',
                marginBottom: '2rem',
              }}
            >
              Under the leadership of Bishop Gabriel Ayilara and the pastoral
              team, The Wisdom Church has grown as a beacon of light in Lagos.
              Our leaders are dedicated to discipleship, spiritual growth, and
              community impact. We believe leadership is servant-hood—pouring
              into lives and equipping believers for their divine purpose.
            </p>

            <Link href="/leadership" className="btn-outline">
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="event-banner">
          <div>
            <div className="event-tag">🙏 Join Us</div>
            <div className="event-title">Become Part of Our Community</div>
            <div className="event-desc">
              Experience a church that values faith, excellence, and community.
              We'd love to meet you!
            </div>
          </div>
          <Link href="#join" className="btn-primary">
            Plan Your Visit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="nav-logo">
              <div className="nav-logo-icon">W</div>
              <span className="nav-logo-text">The Wisdom Church</span>
            </div>
            <p className="footer-brand-desc" style={{ marginTop: '1rem' }}>
              A trans-generational movement of faith and excellence, raising
              complete believers across generations.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/resources">Resources</Link>
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
    </>
  );
}
