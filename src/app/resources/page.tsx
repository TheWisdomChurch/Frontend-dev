'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useState } from 'react';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const resources = [
    {
      id: 1,
      type: 'sermon',
      title: 'The Power of Faith',
      date: 'Jan 15, 2024',
      icon: '🎙️',
      desc: 'Powerful message on trusting God',
    },
    {
      id: 2,
      type: 'blog',
      title: 'Spiritual Growth Habits',
      date: 'Jan 10, 2024',
      icon: '📝',
      desc: 'Daily practices for spiritual development',
    },
    {
      id: 3,
      type: 'guide',
      title: 'Prayer Guide',
      date: 'Jan 5, 2024',
      icon: '🙏',
      desc: 'How to develop a consistent prayer life',
    },
    {
      id: 4,
      type: 'video',
      title: 'Bible Study Series',
      date: 'Dec 28, 2023',
      icon: '📺',
      desc: 'In-depth study of book of Romans',
    },
    {
      id: 5,
      type: 'sermon',
      title: 'Overcoming Obstacles',
      date: 'Dec 20, 2023',
      icon: '🎙️',
      desc: 'Finding victory through faith',
    },
    {
      id: 6,
      type: 'publication',
      title: 'Monthly Newsletter',
      date: 'Dec 15, 2023',
      icon: '📰',
      desc: 'Church updates and spiritual insights',
    },
  ];

  const filtered =
    activeTab === 'all'
      ? resources
      : resources.filter(r => r.type === activeTab);

  return (
    <>
      <section className="hero" style={{ minHeight: '75vh' }}>
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
            Spiritual Growth Resources
          </div>
          <h1 className="hero-title">
            Grow in
            <br />
            <em>your faith</em>
          </h1>
          <p className="hero-sub">
            Access sermons, Bible studies, teaching resources, and more to
            deepen your relationship with God.
          </p>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Sermons Available</div>
            <div className="time-val">100+</div>
          </div>
        </div>
        <div className="time-sep" />
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Bible Studies</div>
            <div className="time-val">30+</div>
          </div>
        </div>
        <div className="time-sep" />
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Books</div>
            <div className="time-val">15+</div>
          </div>
        </div>
        <div className="time-sep" />
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Videos</div>
            <div className="time-val">50+</div>
          </div>
        </div>
      </div>

      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {['all', 'sermon', 'blog', 'guide', 'video'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'btn-primary' : 'btn-outline'}
              style={{ cursor: 'pointer', textTransform: 'capitalize' }}
            >
              {tab === 'all'
                ? 'All Resources'
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {filtered.map(resource => (
            <Link
              key={resource.id}
              href={`/resources/${resource.type}/${resource.id}`}
              className="expect-card"
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {resource.icon}
              </div>
              <div className="expect-title">{resource.title}</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}
              >
                {resource.date}
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                }}
              >
                {resource.desc}
              </p>
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
        <span className="section-tag">Support Ministry</span>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          Shop our
          <br />
          <em>ministry store</em>
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            marginBottom: '2rem',
            maxWidth: '600px',
          }}
        >
          Purchase books, materials, and merchandise to support the ministry and
          deepen your spiritual journey.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="expect-card"
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
              <div className="expect-title">Ministry Resources</div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                }}
              >
                Learn more
              </div>
              <button className="btn-outline" style={{ cursor: 'pointer' }}>
                View Store
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="event-banner">
          <div>
            <div className="event-tag">📚 Learn & Grow</div>
            <div className="event-title">Subscribe to Updates</div>
            <div className="event-desc">
              Get weekly sermon digests, Bible study guides, and resources
              delivered to your inbox.
            </div>
          </div>
          <Link href="/contact" className="btn-primary">
            Subscribe Now
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
              Resources for spiritual growth and Christian development.
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
    </>
  );
}
