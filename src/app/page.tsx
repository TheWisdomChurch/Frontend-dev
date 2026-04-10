'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import { useTheme } from '@/shared/contexts/ThemeContext';
import VideoBg from '@/shared/components/VideoBg';
import { staggerReveal } from '@/hooks/useScrollAnimation';
import { useAnalyticsTracking } from '@/shared/analytics/useTracking';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // ✅ Fixed import

gsap.registerPlugin(ScrollTrigger);

export const dynamic = 'force-dynamic';

// ============================================================================
// DYNAMIC IMPORTS
// ============================================================================

const EventsShowcase = nextDynamic(
  () => import('@/features/events/EventsShowcase'),
  { ssr: false, loading: () => null }
);

const Testimonials = nextDynamic(
  () => import('@/features/testimonials/Testimonials'),
  { ssr: true, loading: () => null }
);

const EventAdModal = nextDynamic(
  () => import('@/shared/ui/modals/EventAdModal'),
  { ssr: false, loading: () => null }
);

// ============================================================================
// HOMEPAGE COMPONENT - NEW DESIGN
// ============================================================================

export default function Home() {
  const { colorScheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [nextAdAt, setNextAdAt] = useState<number | null>(null);
  const expectCardsRef = useRef<HTMLDivElement>(null);
  const { trackScroll } = useAnalyticsTracking();

  const eventStorageKey = 'wc_event_ad_next_show_session_v2';

  const eventAd = useMemo(
    () => ({
      id: 'wpc-2026',
      title: 'Wisdom Power Conference 2026',
      headline: 'Have you registered for WPC 2026?',
      description:
        'Join three days of worship, impartation, and encounters designed to refresh your spirit and strengthen your walk.',
      startAt: '2026-03-20T18:00:00Z',
      endAt: '2026-03-22T20:00:00Z',
      time: 'Morning Session • Evening Session',
      location: 'Honor Gardens opposite Dominion City, Alasia Bus stop',
      image: '/HEADER.png',
      registerUrl: 'https://admin.wisdomchurchhq.org/forms/wpc26',
      ctaLabel: 'Register now',
      note: 'You will be returned to the main website after you finish.',
    }),
    []
  );

  useEffect(() => {
    const now = Date.now();
    const nextAllowedRaw =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem(eventStorageKey)
        : null;
    const nextAllowed = nextAllowedRaw ? Number(nextAllowedRaw) : 0;

    if (Number.isFinite(nextAllowed) && now < nextAllowed) {
      setNextAdAt(nextAllowed);
      return;
    }

    setNextAdAt(now + 1200);
  }, []);

  useEffect(() => {
    if (nextAdAt === null) return;
    const timeLeft = nextAdAt - Date.now();
    if (timeLeft <= 0) {
      setShowModal(true);
      return;
    }
    const timer = window.setTimeout(() => setShowModal(true), timeLeft);
    return () => window.clearTimeout(timer);
  }, [nextAdAt]);

  // Scroll animations for cards
  useEffect(() => {
    if (!expectCardsRef.current) return;

    // ✅ Setup scroll depth tracking (tracks 25%, 50%, 75%, 100%)
    const cleanupScroll = trackScroll({ thresholds: [25, 50, 75, 100] });

    const cards = expectCardsRef.current.querySelectorAll('.expect-card');
    if (cards.length === 0) return;

    gsap.from(cards, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: expectCardsRef.current,
        start: 'top 75%',
        end: 'top 50%',
        markers: false,
      },
    });

    return () => {
      cleanupScroll();
      ScrollTrigger.getAll().forEach((trigger: { kill: () => any }) =>
        trigger.kill()
      );
    };
  }, [trackScroll]);

  const handleCloseModal = () => {
    const nextAllowedAt = Date.now() + 1000 * 60 * 20;
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(eventStorageKey, String(nextAllowedAt));
    }
    setNextAdAt(nextAllowedAt);
    setShowModal(false);
  };

  return (
    <>
      {/* ===================================================================== */}
      {/* NAVIGATION */}
      {/* ===================================================================== */}
      <nav>
        <div className="nav-logo">
          <div className="nav-logo-icon">W</div>
          <span className="nav-logo-text">The Wisdom Church</span>
        </div>
        <ul className="nav-links">
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/resources">Sermons</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="#giving">Give</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <Link href="#join" className="nav-cta">
          Join Us Sunday
        </Link>
      </nav>

      <main className="w-full overflow-hidden">
        {/* ===================================================================== */}
        {/* HERO SECTION */}
        {/* ===================================================================== */}
        <section className="hero">
          <VideoBg
            src="/videos/hero.mp4"
            overlay={true}
            overlayOpacity={0.35}
            autoPlay={true}
            muted={true}
            loop={true}
          />
          <div className="hero-grid" />

          <div className="hero-content">
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              Sundays 9:00 AM · Lekki-Epe, Lagos
            </div>

            <h1 className="hero-title">
              Experience God's
              <br />
              <em>Transforming</em>
              <br />
              Power
            </h1>

            <p className="hero-sub">
              A Spirit-filled family helping believers grow in faith, purpose,
              and community — equipped and empowered for greatness.
            </p>

            <div className="hero-actions">
              <Link href="#join" className="btn-primary">
                Plan Your Visit
              </Link>
              <a href="https://wisdomchurchhq.org/live" className="btn-outline">
                Watch Live
              </a>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">9 AM</div>
              <div className="stat-label">Sunday Worship</div>
            </div>
            <div className="stat">
              <div className="stat-num">Thu</div>
              <div className="stat-label">Midweek · 6 PM</div>
            </div>
            <div className="stat">
              <div className="stat-num">2026</div>
              <div className="stat-label">WPC Conference</div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SERVICE TIMES BAR */}
        {/* ===================================================================== */}
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
              <div className="time-val">Thursday · 6:00 PM</div>
            </div>
          </div>
          <div className="time-sep" />

          <div className="time-item">
            <div className="time-icon">✦</div>
            <div>
              <div className="time-label">Location</div>
              <div className="time-val">
                Honor Gardens, Alasia, Lekki-Epe Expressway, Lagos
              </div>
            </div>
          </div>
          <div className="time-sep" />

          <div className="time-item">
            <div className="time-icon">✦</div>
            <div>
              <div className="time-label">Phone</div>
              <div className="time-val">0706 999 5333</div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* WHAT TO EXPECT SECTION */}
        {/* ===================================================================== */}
        <section ref={expectCardsRef}>
          <span className="section-tag">What to expect</span>
          <h2 className="section-title">
            Sundays that feel
            <br />
            <em>alive in every lane</em>
          </h2>
          <p className="section-body">
            At The Wisdom Church, we are committed to spreading the Gospel and
            empowering believers through the Word of God and the Holy Spirit.
          </p>

          <div className="expect-grid">
            <div className="expect-card">
              <div className="expect-num">01</div>
              <div className="expect-title">The Word at Work</div>
              <div className="expect-desc">
                We actively apply God's Word in our daily lives, transforming
                biblical teachings into practical actions that impact our
                community and deepen faith.
              </div>
            </div>

            <div className="expect-card">
              <div className="expect-num">02</div>
              <div className="expect-title">The Power of Prayer</div>
              <div className="expect-desc">
                Through fervent prayer, we connect with God's divine power,
                witnessing miraculous transformations and spiritual
                breakthroughs in our community.
              </div>
            </div>

            <div className="expect-card">
              <div className="expect-num">03</div>
              <div className="expect-title">Powerful Worship</div>
              <div className="expect-desc">
                In heartfelt worship, we glorify God through song, praise, and
                devotion — creating an atmosphere where His presence transforms
                hearts and renews spirits.
              </div>
            </div>

            <div className="expect-card">
              <div className="expect-num">04</div>
              <div className="expect-title">Transformative Messages</div>
              <div className="expect-desc">
                We diligently study and receive God's Word, allowing scripture
                to guide our decisions, shape our character, and illuminate our
                path forward.
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* PASTOR SECTION */}
        {/* ===================================================================== */}
        <section
          style={{
            background: 'var(--charcoal)',
            borderTop: '0.5px solid var(--border)',
            borderBottom: '0.5px solid var(--border)',
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
              <span className="section-tag">Our Leadership</span>
              <h2 className="section-title">
                Guided by vision,
                <br />
                <em>grounded in truth</em>
              </h2>

              <blockquote className="pastor-quote">
                "His vision for The Wisdom Church is to create a place where
                everyone can encounter God's transformative love and discover
                their unique purpose."
              </blockquote>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.8',
                  marginBottom: '2rem',
                }}
              >
                Bishop Gabriel Ayilara has faithfully discipled and mentored
                countless individuals, demonstrating the practical workings of
                God's Word in everyday life. Together with Pastor Kenny Ayilara,
                they continue to inspire, equip, and impact lives for the
                Kingdom of God.
              </p>

              <Link href="/leadership" className="btn-outline">
                Meet Our Leaders
              </Link>
            </div>
          </div>

          <div className="event-banner">
            <div>
              <div className="event-tag">📢 Coming 2026</div>
              <div className="event-title">Wisdom Power Conference 2026</div>
              <div className="event-desc">
                City-wide gathering with worship, word, and miracles. Come
                expectant.
              </div>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Register Now
            </button>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* TESTIMONIES SECTION */}
        {/* ===================================================================== */}
        <section>
          <span className="section-tag">Testimonies</span>
          <h2 className="section-title">
            God is moving
            <br />
            <em>in our house</em>
          </h2>
          <p className="section-body">
            Real moments of healing, provision, and restoration from the Wisdom
            Church community.
          </p>

          <div className="testimonies-grid">
            <div className="testimony-card">
              <div className="testimony-text">
                This church has transformed my life. The community here is
                unlike any other — supportive, loving, and genuinely committed
                to helping each other grow in faith. The teachings are
                biblically sound and practically applicable to everyday life.
              </div>
              <div className="testimony-author">
                <div className="testimony-avatar">MJ</div>
                <div>
                  <div className="testimony-name">Michael Johnson</div>
                  <div className="testimony-meta">Member · Jan 2024</div>
                </div>
              </div>
            </div>

            <div className="testimony-card">
              <div className="testimony-text">
                As a young professional, finding a church that speaks to my
                generation while maintaining biblical truth was challenging.
                This church does it perfectly! The youth programs are engaging
                and the community is incredibly welcoming.
              </div>
              <div className="testimony-author">
                <div className="testimony-avatar">SW</div>
                <div>
                  <div className="testimony-name">Sarah Williams</div>
                  <div className="testimony-meta">Member</div>
                </div>
              </div>
            </div>

            <div className="testimony-card">
              <div className="testimony-text">
                The outreach programs have allowed me to serve my community in
                meaningful ways. I've found purpose and fulfillment through
                serving here. The leadership is supportive and truly empowering
                in every sense.
              </div>
              <div className="testimony-author">
                <div className="testimony-avatar">RC</div>
                <div>
                  <div className="testimony-name">Robert Chen</div>
                  <div className="testimony-meta">Member</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link href="/testimonies" className="btn-outline">
              Share Your Testimony
            </Link>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* ONLINE GIVING SECTION */}
        {/* ===================================================================== */}
        <section className="giving-section" id="giving">
          <span className="section-tag">Online Giving</span>
          <h2 className="section-title">
            Give with a
            <br />
            <em>cheerful heart</em>
          </h2>
          <p
            className="section-body"
            style={{
              fontStyle: 'italic',
              fontFamily: 'var(--font-serif)',
              fontSize: '17px',
            }}
          >
            "As each has purposed in his heart, let him give not grudgingly or
            under compulsion. God loves a cheerful giver." — 2 Corinthians 9:7
          </p>

          <div className="giving-grid">
            <div className="giving-card">
              <div className="giving-icon">🙏</div>
              <div className="giving-title">Tithes & Offerings & Seeds</div>
              <div className="giving-desc">
                Give your tithes as an act of worship and obedience to God.
                Every seed sown in faith yields a harvest.
              </div>
              <a
                href="https://admin.wisdomchurchhq.org/giving/tithes"
                className="giving-btn"
              >
                Make Contribution →
              </a>
            </div>

            <div className="giving-card">
              <div className="giving-icon">🏛</div>
              <div className="giving-title">Building Projects & Outreach</div>
              <div className="giving-desc">
                Support us in building a church for all. Your partnership
                extends the Kingdom beyond our walls.
              </div>
              <a
                href="https://admin.wisdomchurchhq.org/giving/building"
                className="giving-btn"
              >
                Make Contribution →
              </a>
            </div>

            <div className="giving-card">
              <div className="giving-icon">🌍</div>
              <div className="giving-title">Diaspora Giving</div>
              <div className="giving-desc">
                May God continually replenish your pocket. Give from wherever
                you are in the world.
              </div>
              <a
                href="https://admin.wisdomchurchhq.org/giving/diaspora"
                className="giving-btn"
              >
                Make Contribution →
              </a>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* RESOURCES SECTION */}
        {/* ===================================================================== */}
        <section>
          <span className="section-tag">Resources & Media</span>
          <h2 className="section-title">
            Streams, sermons,
            <br />
            <em>and pastoral care</em>
          </h2>
          <p className="section-body">
            Catch up on sermons, join a live service, register for events, or
            request pastoral moments.
          </p>

          <div className="resources-grid">
            <Link href="/resources#sermons" className="resource-card">
              <div className="resource-label">Sermons & Teachings</div>
              <div className="resource-title">
                Messages that transform lives
              </div>
              <div className="resource-desc">
                Watch, listen, and grow through powerful biblical teaching from
                Bishop Gabriel Ayilara and the Wisdom Church team.
              </div>
              <div className="resource-link">
                Listen Now <span className="resource-arrow">→</span>
              </div>
            </Link>

            <Link href="/resources#live" className="resource-card">
              <div className="resource-label">Live Services</div>
              <div className="resource-title">Join us in real-time</div>
              <div className="resource-desc">
                Stream Sunday services, prayer meetings, and special events
                live. Sundays 9 AM · Thursdays 6 PM (WAT).
              </div>
              <div className="resource-link">
                Get Notified <span className="resource-arrow">→</span>
              </div>
            </Link>

            <Link href="/events" className="resource-card">
              <div className="resource-label">Events & Programs</div>
              <div className="resource-title">Be part of something greater</div>
              <div className="resource-desc">
                Conferences, revivals, outreaches, and life-changing gatherings.
                Including the Wisdom Power Conference 2026.
              </div>
              <div className="resource-link">
                Join Events <span className="resource-arrow">→</span>
              </div>
            </Link>

            <Link href="/resources/store" className="resource-card">
              <div className="resource-label">Wisdom House Store</div>
              <div className="resource-title">Wear your faith</div>
              <div className="resource-desc">
                Merchandise that carries a message of hope and identity.
                Represent the Kingdom wherever you go.
              </div>
              <div className="resource-link">
                Shop Now <span className="resource-arrow">→</span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* ===================================================================== */}
      {/* FOOTER */}
      {/* ===================================================================== */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="nav-logo">
              <div className="nav-logo-icon">W</div>
              <span className="nav-logo-text">The Wisdom Church</span>
            </div>
            <p className="footer-brand-desc" style={{ marginTop: '1rem' }}>
              Equipping & Empowering for Greatness. A Spirit-filled family
              helping believers grow in faith, purpose, and community.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-links">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/events">Events & Programs</Link>
              </li>
              <li>
                <Link href="/resources">Sermons</Link>
              </li>
              <li>
                <Link href="/resources/store">Store</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
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
              Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe
              Expressway, Lagos
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

      {/* Event Ad Modal */}
      <EventAdModal
        open={showModal}
        event={eventAd}
        onClose={handleCloseModal}
        onRemindLater={() => {
          const nextAllowedAt = Date.now() + 1000 * 60 * 45;
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(
              eventStorageKey,
              String(nextAllowedAt)
            );
          }
          setShowModal(false);
        }}
      />
    </>
  );
}
