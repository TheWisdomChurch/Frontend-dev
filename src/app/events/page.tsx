'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: 'Sunday Worship Service',
      date: 'Every Sunday',
      time: '9:00 AM - 11:30 AM',
      location: 'Main Sanctuary',
      desc: 'Join us for inspiring worship, powerful teaching, and community fellowship.',
      icon: '⛪',
    },
    {
      id: 2,
      title: 'Midweek Service',
      date: 'Thursday',
      time: '6:00 PM - 7:30 PM',
      location: 'Prayer Hall',
      desc: 'Prayers, worship, and Bible study for spiritual growth.',
      icon: '📖',
    },
    {
      id: 3,
      title: 'Youth Ministry Meeting',
      date: 'Saturday',
      time: '3:00 PM - 5:00 PM',
      location: 'Youth Center',
      desc: 'Fellowship, games, and spiritual mentorship for teens and young adults.',
      icon: '👥',
    },
    {
      id: 4,
      title: "Women's Prayer & Praise",
      date: 'Tuesday',
      time: '10:00 AM - 12:00 PM',
      location: "Women's Wing",
      desc: 'Prayer intercession and praise for spiritual empowerment.',
      icon: '🙏',
    },
  ];

  const upcomingSpecial = [
    {
      id: 1,
      title: 'WPC 2026 - Wisdom Power Conference',
      date: '2026',
      desc: 'Annual conference featuring international speakers and powerful worship.',
      image: '🎤',
    },
    {
      id: 2,
      title: 'Christmas Celebration',
      date: 'December 2024',
      desc: 'Festive worship celebrating the birth of Christ with special performances.',
      image: '🎄',
    },
    {
      id: 3,
      title: 'New Year Breakthrough Crusade',
      date: 'January 2026',
      desc: 'Seven days of revival and supernatural encounters with God.',
      image: '✨',
    },
  ];

  return (
    <>
      {/* Hero */}
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
            Upcoming events & services
          </div>

          <h1 className="hero-title">
            Experience God
            <br />
            <em>in community</em>
          </h1>

          <p className="hero-sub">
            Join us for inspiring worship services, special events, and
            community gatherings throughout the year.
          </p>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Sunday Worship</div>
            <div className="time-val">9:00 AM (WAT)</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Midweek Service</div>
            <div className="time-val">Thursday • 6:00 PM</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Youth Meeting</div>
            <div className="time-val">Saturday • 3:00 PM</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Women's Prayer</div>
            <div className="time-val">Tuesday • 10:00 AM</div>
          </div>
        </div>
      </div>

      {/* Regular Events */}
      <section>
        <span className="section-tag">Regular Schedule</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Weekly
          <br />
          <em>services & meetings</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {events.map(event => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="expect-card"
              style={{ cursor: 'pointer' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {event.icon}
              </div>
              <div className="expect-title">{event.title}</div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}
              >
                {event.date} • {event.time}
              </div>
              <div className="expect-desc">{event.desc}</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--gold-light)',
                  marginTop: '1rem',
                }}
              >
                📍 {event.location}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Events */}
      <section
        style={{
          background: 'var(--charcoal)',
          borderTop: '0.5px solid var(--border)',
        }}
      >
        <span className="section-tag">Special Events</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Upcoming
          <br />
          <em>special services</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {upcomingSpecial.map(event => (
            <div
              key={event.id}
              className="expect-card"
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {event.image}
              </div>
              <div className="expect-title">{event.title}</div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--gold-light)',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                {event.date}
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                }}
              >
                {event.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Registration */}
      <section>
        <div className="event-banner">
          <div>
            <div className="event-tag">🎫 Early Bird Registration</div>
            <div className="event-title">Register for WPC 2026</div>
            <div className="event-desc">
              Join us for the Wisdom Power Conference 2026 - Limited early bird
              spots available!
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => (window.location.hash = '#event-modal')}
          >
            Register Now
          </button>
        </div>
      </section>

      {/* Calendar View CTA */}
      <section style={{ textAlign: 'center', paddingBottom: '3rem' }}>
        <span className="section-tag">Need More Details?</span>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          View full
          <br />
          <em>event calendar</em>
        </h2>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/events/calendar" className="btn-primary">
            Full Calendar
          </Link>
          <Link href="/events/weekly" className="btn-outline">
            Weekly Services
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
              Join us for worship, fellowship, and spiritual growth.
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
                <Link href="/resources">Resources</Link>
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
