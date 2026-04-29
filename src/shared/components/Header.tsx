'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Events', href: '/events' },
  { label: 'Giving', href: '/giving' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname() || '/';
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = useMemo(() => NAV_ITEMS, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    document.documentElement.classList.toggle('menu-open', menuOpen);
    document.body.dataset.menuOpen = menuOpen ? 'true' : 'false';

    return () => {
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      delete document.body.dataset.menuOpen;
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      document.body.dataset.scrolled = window.scrollY > 12 ? 'true' : 'false';
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link
            href="/"
            className="site-header__brand"
            aria-label="The Wisdom Church home"
          >
            <span className="site-header__brand-logo">
              <Image
                src="/logo.webp"
                alt="The Wisdom Church logo"
                width={44}
                height={44}
                priority
                className="site-header__brand-image"
              />
            </span>

            <span className="site-header__brand-divider" aria-hidden="true" />

            <span className="site-header__brand-copy">
              <span className="site-header__brand-line">The Wisdom</span>
              <span className="site-header__brand-line site-header__brand-line--strong">
                Church
              </span>
            </span>
          </Link>

          <nav
            className="site-header__nav site-header__desktop"
            aria-label="Primary navigation"
          >
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`site-header__nav-link ${
                  isActive(item.href) ? 'is-active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__desktop">
            <Link href="/forms/membership" className="site-header__cta">
              Join Us
            </Link>
          </div>

          <button
            type="button"
            className="site-header__menu-button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(value => !value)}
          >
            <span className="site-header__menu-icon" />
          </button>
        </div>
      </header>

      <div className="site-header__mobile-layer" aria-hidden={!menuOpen}>
        <button
          type="button"
          className="site-header__mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />

        <div className="site-header__mobile-panel" id="mobile-navigation">
          <div className="site-header__mobile-brand">
            <Image
              src="/logo.webp"
              alt="The Wisdom Church logo"
              width={46}
              height={46}
              className="site-header__mobile-brand-image"
            />
            <div>
              <p className="site-header__mobile-brand-kicker">Welcome to</p>
              <p className="site-header__mobile-brand-name">
                The Wisdom Church
              </p>
            </div>
          </div>

          <nav
            className="site-header__mobile-nav"
            aria-label="Mobile navigation"
          >
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`site-header__mobile-link ${
                  isActive(item.href) ? 'is-active' : ''
                }`}
              >
                <span>{item.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>

          <Link
            href="/forms/membership"
            className="site-header__cta site-header__mobile-cta"
          >
            Join Us
          </Link>
        </div>
      </div>
    </>
  );
}
