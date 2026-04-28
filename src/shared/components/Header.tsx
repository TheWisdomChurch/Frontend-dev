'use client';

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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = useMemo(() => NAV_ITEMS, []);

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
            aria-label="Wisdom Church home"
          >
            <span className="site-header__brand-mark">W</span>
            <span className="site-header__brand-text">Wisdom Church</span>
          </Link>

          <nav
            className="site-header__nav site-header__desktop"
            aria-label="Primary navigation"
          >
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`site-header__nav-link ${isActive(item.href) ? 'is-active' : ''}`}
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
          <nav
            className="site-header__mobile-nav"
            aria-label="Mobile navigation"
          >
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`site-header__mobile-link ${isActive(item.href) ? 'is-active' : ''}`}
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
