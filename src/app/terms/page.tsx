'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useEffect } from 'react';
import gsap from 'gsap';

export default function TermsPage() {
  useEffect(() => {
    gsap.from('.terms-hero-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  const sections = [
    {
      title: 'Terms of Service',
      content: [
        'These Terms of Service govern your use of The Wisdom House Church website and services. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.',
        'The Wisdom House Church reserves the right to modify these terms at any time. Your continued use of the website following the posting of revised terms means that you accept and agree to the changes.',
      ],
    },
    {
      title: 'Use License',
      content: [
        'Permission is granted to temporarily download one copy of the materials (information or software) on The Wisdom House Church website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.',
        'Under this license you may not: Modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to decompile or reverse engineer any software contained on the website; remove any copyright or other proprietary notations from the materials.',
        'This license shall automatically terminate if you violate any of these restrictions and may be terminated by The Wisdom House Church at any time. Upon termination of your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.',
      ],
    },
    {
      title: 'Disclaimer',
      content: [
        'The materials on The Wisdom House Church website are provided "as is". The Wisdom House Church makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.',
        'Further, The Wisdom House Church does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.',
      ],
    },
    {
      title: 'Limitations',
      content: [
        'In no event shall The Wisdom House Church or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Wisdom House Church website, even if The Wisdom House Church or an authorized representative has been notified orally or in writing of the possibility of such damage.',
        'Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.',
      ],
    },
    {
      title: 'Accuracy of Materials',
      content: [
        'The materials appearing on The Wisdom House Church website could include technical, typographical, or photographic errors. The Wisdom House Church does not warrant that any of the materials on its website are accurate, complete, or current.',
        'The Wisdom House Church may make changes to the materials contained on its website at any time without notice. However, The Wisdom House Church does not make any commitment to update the materials.',
      ],
    },
    {
      title: 'Links',
      content: [
        "The Wisdom House Church has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by The Wisdom House Church of the site. Use of any such linked website is at the user's own risk.",
        'If you believe any materials on the website violate your rights, please notify The Wisdom House Church immediately.',
      ],
    },
    {
      title: 'Modifications',
      content: [
        'The Wisdom House Church may revise these Terms and Conditions for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms and Conditions of Use.',
      ],
    },
    {
      title: 'Governing Law',
      content: [
        'These Terms and Conditions of Use are governed by and construed in accordance with the laws of the Federal Republic of Nigeria and you irrevocably submit to the exclusive jurisdiction of the courts.',
      ],
    },
  ];

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
            Legal Information
          </div>

          <h1 className="hero-title terms-hero-title">
            Terms of
            <br />
            <em>Service</em>
          </h1>

          <p className="hero-sub">
            Last updated: January 2026. Please read these terms carefully before
            using our website.
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
          {sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '3rem' }}>
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
                <span style={{ color: 'var(--gold)', fontSize: '28px' }}>
                  ✦
                </span>
                {section.title}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {section.content.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    style={{
                      color: 'var(--text-muted)',
                      lineHeight: '1.8',
                      fontSize: '15px',
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: '4rem',
              padding: '2.5rem',
              background: 'rgba(201, 168, 76, 0.05)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '15px',
                lineHeight: '1.8',
                marginBottom: '1.5rem',
              }}
            >
              If you have any questions about these Terms of Service, please
              contact us at <strong>legal@wisdomhq.org</strong>
            </p>
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
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
                <Link href="/cookies">Cookies Policy</Link>
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
                <Link href="/about">Leadership</Link>
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
              info@wisdomhq.org
              <br />
              0706 999 5333
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
