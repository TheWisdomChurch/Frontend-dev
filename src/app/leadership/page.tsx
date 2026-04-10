'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';

export default function LeadershipPage() {
  const leaders = [
    {
      name: 'Bishop Gabriel Ayilara',
      title: 'Senior Pastor',
      bio: "Bishop Gabriel Ayilara is the Founder and Senior Pastor of The Wisdom Church. With a heart for excellence and a passion for transforming lives through God's Word, Bishop Gabriel leads with wisdom, vision, and biblical authority.",
      role: 'spiritual-leader',
    },
    {
      name: 'Pastor Kenny Ayilara',
      title: 'Co-Pastor',
      bio: 'Co-Pastor Kenny brings years of ministry experience and a deep commitment to discipleship and community outreach. Together with Bishop Gabriel, Pastor Kenny continues to build a legacy of faith and excellence.',
      role: 'ministry-leader',
    },
  ];

  const ministries = [
    {
      num: '01',
      title: 'Youth Ministry',
      desc: 'Empowering the next generation with faith, purpose, and community.',
    },
    {
      num: '02',
      title: "Women's Ministry",
      desc: 'Supporting women in faith, growth, and empowerment.',
    },
    {
      num: '03',
      title: "Men's Ministry",
      desc: "Building strong men rooted in God's Word.",
    },
    {
      num: '04',
      title: 'Outreach & Missions',
      desc: "Extending God's love through service and community impact.",
    },
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
            Meet our leadership
          </div>

          <h1 className="hero-title">
            Led by
            <br />
            <em>visionary leaders</em>
          </h1>

          <p className="hero-sub">
            Our pastoral team is committed to serving the Wisdom Church
            community with integrity, wisdom, and a heart for spiritual growth.
          </p>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Vision</div>
            <div className="time-val">Complete Believers</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Mission</div>
            <div className="time-val">Transform Lives</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Culture</div>
            <div className="time-val">Excellence & Love</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Commitment</div>
            <div className="time-val">Servant Leadership</div>
          </div>
        </div>
      </div>

      {/* Senior Leadership */}
      {leaders.map((leader, idx) => (
        <section
          key={leader.name}
          style={{
            background: idx % 2 === 0 ? 'var(--charcoal)' : 'transparent',
            borderTop: idx % 2 === 0 ? '0.5px solid var(--border)' : 'none',
          }}
        >
          <div className="pastor-section">
            <div className="pastor-img-wrap">
              <div className="pastor-img-frame">
                <div className="pastor-placeholder">✝</div>
              </div>
              <div className="pastor-badge">
                <div className="pastor-badge-title">
                  {leader.role === 'spiritual-leader' ? 'Senior' : 'Co'}
                </div>
                <div className="pastor-badge-name">
                  {leader.name.split(' ').pop()}
                </div>
              </div>
            </div>

            <div>
              <span className="section-tag">
                {leader.role === 'spiritual-leader' ? 'Leadership' : 'Ministry'}
              </span>
              <h2 className="section-title">
                {leader.name}
                <br />
                <em>{leader.title}</em>
              </h2>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.8',
                  marginBottom: '2rem',
                }}
              >
                {leader.bio}
              </p>

              <Link
                href={`/leadership/${leader.name.toLowerCase().replace(' ', '-')}`}
                className="btn-outline"
              >
                Learn More About This Leader
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Ministry Leaders */}
      <section
        style={{
          background: 'var(--charcoal)',
          borderTop: '0.5px solid var(--border)',
        }}
      >
        <span className="section-tag">Our Ministry Teams</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Serving through
          <br />
          <em>diverse ministries</em>
        </h2>

        <div className="expect-grid">
          {ministries.map(ministry => (
            <Link
              key={ministry.num}
              href={`/ministries`}
              className="expect-card"
            >
              <div className="expect-num">{ministry.num}</div>
              <div className="expect-title">{ministry.title}</div>
              <div className="expect-desc">{ministry.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="event-banner">
          <div>
            <div className="event-tag">📧 Get Connected</div>
            <div className="event-title">Connect With Our Pastoral Team</div>
            <div className="event-desc">
              Whether you need prayer, counsel, or want to get involved in
              ministry, our team is ready to serve.
            </div>
          </div>
          <Link href="/contact" className="btn-primary">
            Contact Us
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
              Our leadership team is committed to serving you with integrity and
              care.
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
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/ministries">Ministries</Link>
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
