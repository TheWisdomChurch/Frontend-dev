'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PastoralPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('counseling');

  useEffect(() => {
    gsap.from('.pastoral-hero-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  const services = [
    {
      id: 'counseling',
      title: 'Pastoral Counseling',
      icon: '💬',
      desc: "Professional, compassionate guidance through life's challenges from a biblical perspective.",
      features: [
        'One-on-one counseling sessions',
        'Confidential professional environment',
        'Biblical guidance on life challenges',
        'Follow-up support and resources',
      ],
    },
    {
      id: 'prayer',
      title: 'Prayer & Intercession',
      icon: '🙏',
      desc: 'Dedicated prayer support for your spiritual needs and personal requests.',
      features: [
        'Individual prayer sessions',
        'Prayer chain notifications',
        'Intercessory prayer partnerships',
        '24/7 prayer line access',
      ],
    },
    {
      id: 'crisis',
      title: 'Crisis Support',
      icon: '🆘',
      desc: 'Immediate support during difficult times and spiritual emergencies.',
      features: [
        'Emergency pastoral response',
        'Hospital and home visits',
        'Grief and loss support',
        'Mental health referrals',
      ],
    },
    {
      id: 'weddings',
      title: 'Wedding Services',
      icon: '💍',
      desc: 'Meaningful spiritual preparation and solemnization of your marriage.',
      features: [
        'Pre-marital counseling',
        'Wedding ceremony services',
        'Marriage enrichment programs',
        'Vow renewal services',
      ],
    },
  ];

  const selectedService = services.find(s => s.id === activeTab);

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
            Spiritual Care & Support
          </div>

          <h1 className="hero-title pastoral-hero-title">
            We're Here
            <br />
            <em>For You</em>
          </h1>

          <p className="hero-sub">
            Our pastoral team provides compassionate, confidential support
            during life's important moments.
          </p>

          <button
            onClick={() => (window.location.href = '/contact')}
            className="btn-primary"
            style={{ marginTop: '2rem', cursor: 'pointer' }}
          >
            Request Support
          </button>
        </div>
      </section>

      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Prayer Line</div>
            <div className="time-val">24/7 Available</div>
          </div>
        </div>
        <div className="time-sep" />
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Response Time</div>
            <div className="time-val">Same Day</div>
          </div>
        </div>
        <div className="time-sep" />
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Confidentiality</div>
            <div className="time-val">100% Secure</div>
          </div>
        </div>
        <div className="time-sep" />
        <div className="time-item">
          <div className="time-icon">✦</div>
          <div>
            <div className="time-label">Cost</div>
            <div className="time-val">Free</div>
          </div>
        </div>
      </div>

      <section>
        <span className="section-tag">Our Services</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Pastoral Care
          <br />
          <em>Services</em>
        </h2>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {services.map(service => (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className={
                activeTab === service.id ? 'btn-primary' : 'btn-outline'
              }
              style={{
                cursor: 'pointer',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <span>{service.icon}</span>
              {service.title}
            </button>
          ))}
        </div>

        {selectedService && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3rem',
              alignItems: 'center',
              marginBottom: '4rem',
            }}
          >
            <div style={{ fontSize: '80px', textAlign: 'center' }}>
              {selectedService.icon}
            </div>

            <div>
              <h3 className="section-title" style={{ marginBottom: '1rem' }}>
                {selectedService.title}
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: '2rem',
                }}
              >
                {selectedService.desc}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {selectedService.features.map((feature, idx) => (
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
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section
        style={{
          background: 'var(--charcoal)',
          borderTop: '0.5px solid var(--border)',
        }}
      >
        <span className="section-tag">Meet the Team</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Pastoral
          <br />
          <em>Leadership</em>
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
              name: 'Bishop Gabriel Ayilara',
              title: 'Senior Pastor',
              phone: '0706 999 5333',
              email: 'gabriel@wisdomhq.org',
            },
            {
              name: 'Pastor Kenny Ayilara',
              title: 'Co-Pastor',
              phone: '0706 999 5334',
              email: 'kenny@wisdomhq.org',
            },
            {
              name: 'Pastoral Care Team',
              title: 'Support Services',
              phone: '0706 999 5335',
              email: 'pastoral@wisdomhq.org',
            },
          ].map((pastor, idx) => (
            <div
              key={idx}
              className="expect-card"
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '56px', marginBottom: '1rem' }}>👔</div>
              <div className="expect-title">{pastor.name}</div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--gold-light)',
                  marginBottom: '1rem',
                  fontWeight: '500',
                }}
              >
                {pastor.title}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.8',
                }}
              >
                <div>📞 {pastor.phone}</div>
                <div>✉️ {pastor.email}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <span className="section-tag">Getting Help</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          How to Request
          <br />
          <em>Pastoral Care</em>
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
              title: 'Contact Us',
              desc: 'Reach out through our contact form, phone, or in person.',
            },
            {
              num: '02',
              title: 'Schedule Meeting',
              desc: 'Let us know your availability and preferred meeting time.',
            },
            {
              num: '03',
              title: 'Confidential Session',
              desc: 'Meet with our pastoral team in a safe, supportive environment.',
            },
            {
              num: '04',
              title: 'Follow-up Support',
              desc: 'Receive ongoing support and spiritual guidance as needed.',
            },
          ].map(step => (
            <div
              key={step.num}
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
                {step.num}
              </div>
              <div className="expect-title">{step.title}</div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="event-banner">
          <div>
            <div className="event-tag">💙 Need Support?</div>
            <div className="event-title">Reach Out Today</div>
            <div className="event-desc">
              Our pastoral team is ready to listen and guide you through any
              challenge.
            </div>
          </div>
          <Link href="/contact" className="btn-primary">
            Get Help Now
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
              Providing compassionate pastoral care and spiritual support.
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
            <div className="footer-col-title">Prayer Line</div>
            <div className="footer-contact-item">
              24/7 Available
              <br />
              0706 999 5333
            </div>
            <div className="footer-contact-item">
              Emergency Support
              <br />
              Always Available
            </div>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-contact-item">
              Honor Gardens, Alasia, Lekkit-Epe Expressway, Lagos
            </div>
            <div className="footer-contact-item">pastoral@wisdomhq.org</div>
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
