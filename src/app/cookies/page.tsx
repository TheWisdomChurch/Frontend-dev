'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useEffect } from 'react';
import gsap from 'gsap';

export default function CookiesPage() {
  useEffect(() => {
    gsap.from('.cookies-hero-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  return (
    <div>
      <section className="hero" style={{ minHeight: '60vh' }}>
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
            Privacy & Data
          </div>

          <h1 className="hero-title cookies-hero-title">
            Cookie
            <br />
            <em>Policy</em>
          </h1>

          <p className="hero-sub">
            Last updated: January 2026. Understand how we use cookies to improve
            your experience.
          </p>
        </div>
      </section>

      <section
        style={{
          background: 'var(--charcoal)',
          borderTop: '0.5px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Overview */}
          <div style={{ marginBottom: '4rem' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '2rem',
              }}
            >
              What Are Cookies?
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                lineHeight: '1.8',
                fontSize: '15px',
              }}
            >
              Cookies are small text files that are placed on your device when
              you visit our website. They help us remember your preferences,
              understand how you use our site, and improve your experience. Some
              cookies are essential for the website to function properly, while
              others help us understand better how our visitors interact with
              our content.
            </p>
          </div>

          {/* Cookie Types */}
          <div style={{ marginBottom: '4rem' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '2rem',
              }}
            >
              Types of Cookies We Use
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              {[
                {
                  title: '🔒 Essential Cookies',
                  desc: 'These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot disable these cookies without affecting the functionality of the site.',
                  examples: [
                    'Session ID',
                    'Security tokens',
                    'User permissions',
                  ],
                },
                {
                  title: '📊 Analytics Cookies',
                  desc: 'We use analytics cookies to understand how you interact with our website. These cookies help us analyze traffic patterns, user behavior, and content performance to improve your experience.',
                  examples: [
                    'Page visits',
                    'Click tracking',
                    'User journey',
                    'Time on page',
                  ],
                },
                {
                  title: '🎯 Preference Cookies',
                  desc: 'These cookies remember your choices, such as language preferences, font size, and other personalization settings, so your experience remains consistent on subsequent visits.',
                  examples: [
                    'Language preference',
                    'Theme selection',
                    'Accessibility settings',
                  ],
                },
                {
                  title: '📢 Marketing Cookies',
                  desc: 'Marketing cookies help us deliver targeted content and measure the effectiveness of our campaigns. They track your interests and behavior to show relevant content.',
                  examples: [
                    'Campaign tracking',
                    'Conversion tracking',
                    'Audience segmentation',
                  ],
                },
              ].map((cookie, idx) => (
                <div key={idx} className="expect-card">
                  <div style={{ fontSize: '28px', marginBottom: '1rem' }}>
                    {cookie.title.substring(0, cookie.title.indexOf(' '))}
                  </div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'var(--text)',
                      marginBottom: '1rem',
                    }}
                  >
                    {cookie.title.substring(cookie.title.indexOf(' ') + 1)}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-muted)',
                      lineHeight: '1.6',
                      marginBottom: '1rem',
                    }}
                  >
                    {cookie.desc}
                  </p>
                  <div style={{ fontSize: '13px', color: 'var(--gold-light)' }}>
                    <strong>Examples:</strong> {cookie.examples.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Third-party Cookies */}
          <div style={{ marginBottom: '4rem' }}>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'var(--gold)', fontSize: '28px' }}>✦</span>
              Third-Party Cookies
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                lineHeight: '1.8',
                fontSize: '15px',
              }}
            >
              We may also use cookies from third-party services like Google
              Analytics and Meta Pixel to analyze website traffic and user
              behavior. These services may set their own cookies on your device
              in accordance with their own privacy policies.
            </p>
          </div>

          {/* Managing Cookies */}
          <div style={{ marginBottom: '4rem' }}>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'var(--gold)', fontSize: '28px' }}>✦</span>
              How to Manage Your Cookies
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Browser Settings
                </h4>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                >
                  Most web browsers allow you to control cookies through their
                  settings. You can usually find these settings in the "Options"
                  or "Preferences" menu. Please note that disabling cookies may
                  affect the functionality of websites.
                </p>
              </div>
              <div>
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Cookie Management Tools
                </h4>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                >
                  You can also use browser extensions and online tools to manage
                  and delete cookies more easily.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Updates */}
          <div
            style={{
              marginTop: '4rem',
              padding: '2.5rem',
              background: 'rgba(201, 168, 76, 0.05)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: '12px',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '1rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
              }}
            >
              <span>📋</span>
              Policy Updates & Contact
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
                lineHeight: '1.8',
                marginBottom: '1.5rem',
              }}
            >
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or as required by law. Your continued use
              of the website indicates your acceptance of any updated policy. If
              you have questions about our use of cookies or this policy, please
              reach out to us.
            </p>
            <Link href="/contact" className="btn-primary">
              Ask About Our Cookies Policy
            </Link>
          </div>

          {/* GDPR & Privacy */}
          <div style={{ marginTop: '4rem', marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '1.5rem',
              }}
            >
              Your Privacy Rights
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                lineHeight: '1.8',
                fontSize: '15px',
              }}
            >
              We respect your privacy and are committed to complying with
              applicable data protection laws. You have the right to access,
              correct, or delete your personal data. For more information about
              how we handle your personal data, please see our{' '}
              <Link
                href="/terms"
                style={{
                  color: 'var(--gold-light)',
                  textDecoration: 'underline',
                }}
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
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
              Growing in faith, community, and service.
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
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <ul className="footer-links">
              <li>
                <Link href="/pastoral">Pastoral Care</Link>
              </li>
              <li>
                <Link href="/leadership">Leadership</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/ministries">Ministries</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-contact-item">
              Honor Gardens, Alasia
              <br />
              Lagos, Nigeria
            </div>
            <div className="footer-contact-item">
              privacy@wisdomhq.org
              <br />
              0706 999 5333
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 The Wisdom House Church. All Rights Reserved.</span>
          <div className="footer-bottom-links">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
