'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Watch',
    href: '/resources/sermons',
    children: [
      { label: 'Sermons', href: '/resources/sermons' },
      { label: 'Blog', href: '/resources/blogs' },
      { label: 'Publications', href: '/resources/publications' },
    ],
  },
  {
    label: 'Ministries',
    href: '/ministries',
    children: [
      { label: 'Children', href: '/ministries/children' },
      { label: 'Youth', href: '/ministries/youth' },
      { label: "Men's", href: '/ministries/men' },
      { label: "Women's", href: '/ministries/women' },
      { label: 'Outreach', href: '/ministries/outreach' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
    children: [
      { label: 'Upcoming', href: '/events/upcoming' },
      { label: 'Weekly', href: '/events/weekly' },
      { label: 'Special', href: '/events/special' },
      { label: 'Calendar', href: '/events/calendar' },
    ],
  },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Story', href: '/about' },
      { label: 'Leadership', href: '/leadership' },
      { label: 'Pastoral Care', href: '/pastoral' },
      { label: 'Testimonies', href: '/testimonies' },
    ],
  },
  { label: 'Give', href: '/#giving' },
  { label: 'Contact', href: '/contact' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/wisdomchurchhq' },
  { label: 'YouTube', href: 'https://www.youtube.com/@wisdomchurchhq' },
  { label: 'Facebook', href: 'https://facebook.com/wisdomchurchhq' },
];

export default function Header() {
  const pathname = usePathname() || '/';
  const [navOpen, setNavOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const close = () => setNavOpen(false);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname]);

  // Scroll tracking for header background
  useEffect(() => {
    const onScroll = () => {
      document.body.dataset.scrolled = window.scrollY > 16 ? 'true' : 'false';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll lock + focus management
  useEffect(() => {
    document.body.classList.toggle('nav-open', navOpen);
    document.documentElement.classList.toggle('nav-open', navOpen);
    if (navOpen) {
      setTimeout(() => firstLinkRef.current?.focus(), 380);
    }
    return () => {
      document.body.classList.remove('nav-open');
      document.documentElement.classList.remove('nav-open');
    };
  }, [navOpen]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && navOpen) close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <>
      {/* ── Persistent top bar ──────────────────────────────── */}
      <header className="site-header" role="banner">
        <div className="site-header__inner">
          <Link
            href="/"
            className="site-header__brand"
            aria-label="The Wisdom Church — home"
          >
            <Image
              src="/logo.webp"
              alt=""
              width={36}
              height={36}
              priority
              className="site-header__logo"
            />
            <span className="site-header__wordmark" aria-hidden="true">
              <span>The Wisdom</span>
              <strong>Church</strong>
            </span>
          </Link>

          <div className="site-header__actions">
            <Link href="/#giving" className="site-header__give">
              Give
            </Link>

            <button
              type="button"
              className={`site-header__toggle${navOpen ? ' is-open' : ''}`}
              aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={navOpen}
              aria-controls="nav-overlay"
              onClick={() => setNavOpen(v => !v)}
            >
              <span className="site-header__toggle-label" aria-hidden="true">
                {navOpen ? 'Close' : 'Menu'}
              </span>
              <span className="site-header__toggle-icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-screen nav overlay ──────────────────────────── */}
      <div
        id="nav-overlay"
        className={`nav-overlay${navOpen ? ' is-open' : ''}`}
        aria-hidden={!navOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        {/* Backdrop — click outside to close */}
        <button
          type="button"
          className="nav-overlay__backdrop"
          onClick={close}
          aria-label="Close navigation"
          tabIndex={-1}
        />

        <div className="nav-overlay__inner">
          {/* Left — primary navigation links */}
          <nav className="nav-overlay__links" aria-label="Primary navigation">
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item.href}
                className="nav-item"
                // CSS stagger via custom property
                style={{ '--nav-i': i } as React.CSSProperties}
              >
                <span className="nav-item__num" aria-hidden="true">
                  0{i + 1}
                </span>

                <Link
                  href={item.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  className={`nav-item__link${isActive(item.href) ? ' is-active' : ''}`}
                  onClick={close}
                  tabIndex={navOpen ? 0 : -1}
                >
                  {item.label}
                </Link>

                {item.children ? (
                  <p className="nav-item__sub">
                    {item.children.map((child, ci) => (
                      <span key={child.href}>
                        <Link
                          href={child.href}
                          className="nav-item__sub-link"
                          onClick={close}
                          tabIndex={navOpen ? 0 : -1}
                        >
                          {child.label}
                        </Link>
                        {ci < (item.children?.length ?? 0) - 1 && (
                          <span className="nav-item__dot" aria-hidden="true">
                            {' '}
                            ·{' '}
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            ))}
          </nav>

          {/* Right — service info + socials (desktop only) */}
          <aside
            className="nav-overlay__panel"
            aria-label="Service information"
          >
            <div className="nav-panel">
              <p className="nav-panel__eyebrow">Next Service</p>
              <p className="nav-panel__title">This Sunday</p>
              <p className="nav-panel__detail">9:00 AM · WAT</p>
              <p className="nav-panel__detail">Honor Gardens, Lekki-Epe</p>
              <Link
                href="/events/weekly"
                className="nav-panel__cta"
                onClick={close}
                tabIndex={navOpen ? 0 : -1}
              >
                Plan a visit →
              </Link>

              <div className="nav-panel__divider" aria-hidden="true" />

              <p className="nav-panel__eyebrow">Thursday Midweek</p>
              <p className="nav-panel__detail">6:00 PM · Honor Gardens</p>
            </div>

            <div className="nav-socials">
              <p className="nav-socials__label">Follow us</p>
              <div className="nav-socials__links">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="nav-socials__link"
                    tabIndex={navOpen ? 0 : -1}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
