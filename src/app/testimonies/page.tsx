'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useState } from 'react';

export default function TestimoniesPage() {
  const [filterCategory, setFilterCategory] = useState('all');

  const testimonies = [
    {
      id: 1,
      name: 'Chioma Okonkwo',
      title: 'Marketing Manager',
      category: 'faith',
      quote:
        "The Wisdom Church transformed my understanding of faith and purpose. I've grown spiritually and found a caring community.",
      avatar: '👩',
    },
    {
      id: 2,
      name: 'David Adeniran',
      title: 'Software Engineer',
      category: 'healing',
      quote:
        "Through the ministry here, I've experienced God's healing and restoration in ways I never thought possible.",
      avatar: '👨',
    },
    {
      id: 3,
      name: 'Grace Adeyemi',
      title: 'Teacher',
      category: 'family',
      quote:
        "My family's relationship has been restored through the counseling and ministry. God's love is real here.",
      avatar: '👩',
    },
    {
      id: 4,
      name: 'Samuel Olaleye',
      title: 'Business Owner',
      category: 'breakthrough',
      quote:
        "God brought breakthrough in my business through the teachings and the community's intercession. Glory to God!",
      avatar: '👨',
    },
    {
      id: 5,
      name: 'Ngozi Isubu',
      title: 'Nurse',
      category: 'faith',
      quote:
        'My faith journey began here at TWC. The pastoral team and worship experience have been life-changing.',
      avatar: '👩',
    },
    {
      id: 6,
      name: 'Tunde Okafor',
      title: 'Architect',
      category: 'salvation',
      quote:
        "I gave my life to Christ here at The Wisdom Church. It's the best decision I've ever made.",
      avatar: '👨',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Stories' },
    { id: 'faith', label: 'Growing in Faith' },
    { id: 'healing', label: 'Healing & Restoration' },
    { id: 'family', label: 'Family Blessings' },
    { id: 'breakthrough', label: 'Breakthroughs' },
  ];

  const filtered =
    filterCategory === 'all'
      ? testimonies
      : testimonies.filter(t => t.category === filterCategory);

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '70vh' }}>
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
            Real stories, real faith
          </div>

          <h1 className="hero-title">
            Testimonies of
            <br />
            <em>God's faithfulness</em>
          </h1>

          <p className="hero-sub">
            Discover how God is working in the lives of our congregation
            members.
          </p>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Visitors Impacted</div>
            <div className="time-val">5,000+</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Salvations This Year</div>
            <div className="time-val">200+</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Healings Reported</div>
            <div className="time-val">50+</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Community Served</div>
            <div className="time-val">1,000+ Lives</div>
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <section style={{ textAlign: 'center', paddingBottom: '4rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={
                filterCategory === cat.id ? 'btn-primary' : 'btn-outline'
              }
              style={{ cursor: 'pointer' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Testimonies Grid */}
      <section>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {filtered.map(testimony => (
            <div key={testimony.id} className="testimony-card">
              <div className="testimony-quote">&ldquo;</div>
              <q style={{ marginBottom: '1.5rem' }}>{testimony.quote}</q>
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text)',
                  }}
                >
                  {testimony.name}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '0.25rem',
                  }}
                >
                  {testimony.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Share Your Story */}
      <section
        style={{
          background: 'var(--charcoal)',
          borderTop: '0.5px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-tag">Have a story?</span>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Share your
            <br />
            <em>testimony with us</em>
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              marginBottom: '2rem',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            Your story can inspire and encourage others. We\'d love to hear how
            God is working in your life.
          </p>
          <Link href="/testimonies#share" className="btn-primary">
            Submit Your Testimony
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="event-banner">
          <div>
            <div className="event-tag">⛪ Join Our Community</div>
            <div className="event-title">Experience God's Transformation</div>
            <div className="event-desc">
              Visit us for a service and become part of our growing faith
              community.
            </div>
          </div>
          <Link href="/" className="btn-primary">
            Find Service Times
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
              Testimonies of faith, healing, and transformation through God's
              grace.
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
                <Link href="/leadership">Leadership</Link>
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
