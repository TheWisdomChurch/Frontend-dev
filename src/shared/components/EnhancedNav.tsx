'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function EnhancedNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY > 50;
      setScrolled(scrollPos);

      if (scrollPos && !mobileMenuOpen) {
        gsap.to('nav', {
          backdropFilter: 'blur(20px)',
          duration: 0.3,
          overwrite: 'auto',
        });
        gsap.to('nav', {
          backgroundColor: 'rgba(10, 10, 15, 0.95)',
          duration: 0.3,
          overwrite: 'auto',
        });
      } else if (!scrollPos && !mobileMenuOpen) {
        gsap.to('nav', {
          backdropFilter: 'blur(0px)',
          duration: 0.3,
          overwrite: 'auto',
        });
        gsap.to('nav', {
          backgroundColor: 'rgba(10, 10, 15, 0)',
          duration: 0.3,
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    gsap.to('.nav-mobile-menu', {
      maxHeight: mobileMenuOpen ? 0 : 300,
      duration: 0.4,
      ease: 'power2.inOut',
      opacity: mobileMenuOpen ? 0 : 1,
    });
  };

  return (
    <nav
      className="nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        href="/"
        className="nav-logo"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        <div className="nav-logo-icon">W</div>
        <span className="nav-logo-text">Wisdom</span>
      </Link>

      <div
        className="nav-links"
        style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        {['Home', 'About', 'Events', 'Resources', 'Leadership', 'Contact'].map(
          link => (
            <Link
              key={link}
              href={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`}
              style={{
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                position: 'relative',
                transition: 'color 0.2s',
              }}
              className="nav-link"
            >
              {link}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  height: '2px',
                  width: 0,
                  background: 'var(--gold)',
                  transition: 'width 0.3s',
                }}
                className="nav-link-underline"
              />
            </Link>
          )
        )}
      </div>

      <Link
        href="/checkout"
        className="btn-primary"
        style={{ padding: '0.75rem 1.5rem', fontSize: '14px' }}
      >
        Donate
      </Link>

      <button
        className="nav-mobile-toggle"
        onClick={toggleMobileMenu}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
        }}
      >
        ☰
      </button>

      <div
        className="nav-mobile-menu"
        style={{
          display: 'none',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--charcoal)',
          maxHeight: 0,
          overflow: 'hidden',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem',
        }}
      >
        {['Home', 'About', 'Events', 'Resources', 'Leadership', 'Contact'].map(
          link => (
            <Link
              key={link}
              href={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`}
              style={{ color: 'var(--text)', textDecoration: 'none' }}
            >
              {link}
            </Link>
          )
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: block !important;
          }
          .nav-mobile-menu {
            display: flex !important;
          }
        }
        .nav-link:hover .nav-link-underline {
          width: 100%;
        }
      `}</style>
    </nav>
  );
}
