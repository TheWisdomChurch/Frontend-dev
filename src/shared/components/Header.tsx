'use client';

import Image from 'next/image';
import { IMAGE_QUALITY } from '@/shared/constants';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';

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
  },
  {
    label: 'Grow',
    href: '/grow',
  },
  {
    label: 'Ministries',
    href: '/ministries',
    children: [
      { label: 'Prayer', href: '/ministries/prayer' },
      { label: 'Youth', href: '/ministries/youth' },
      { label: "Men's", href: '/ministries/men' },
      { label: "Women's", href: '/ministries/women' },
      { label: 'Evangelism', href: '/ministries/outreach' },
      { label: 'Children', href: '/ministries/children' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
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

// Links shown directly in the header bar on desktop
const DESKTOP_NAV: NavItem[] = [
  { label: 'Watch', href: '/resources/sermons' },
  { label: 'Grow', href: '/grow' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const SOCIALS = [
  { label: 'Instagram', href: SOCIAL_LINKS.instagram },
  { label: 'YouTube', href: SOCIAL_LINKS.youtube },
  { label: 'Facebook', href: SOCIAL_LINKS.facebook },
];

export default function Header() {
  const pathname = usePathname() || '/';
  const [navOpen, setNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const close = () => setNavOpen(false);

  // Close on route change — adjusted during render rather than in an
  // effect, per React's guidance for resetting state on a changing key.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setNavOpen(false);
  }

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
            prefetch={false}
            className="site-header__brand"
            aria-label="The Wisdom Church — home"
          >
            <span className="site-header__logo-wrap">
              <Image
                quality={IMAGE_QUALITY}
                src="/logo.webp"
                alt=""
                width={38}
                height={38}
                className="site-header__logo"
              />
            </span>
            <span className="site-header__wordmark" aria-hidden="true">
              <span className="site-header__wordmark-sub">The Wisdom</span>
              <strong className="site-header__wordmark-title">Church</strong>
            </span>
          </Link>

          {/* Desktop nav links — hidden on mobile, handled by overlay */}
          <nav className="site-header__nav" aria-label="Primary navigation">
            <div className="site-header__nav-pill">
              {DESKTOP_NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`site-header__nav-link${isActive(item.href) ? ' is-active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="site-header__actions">
            <Link
              href="/#giving"
              prefetch={false}
              className="site-header__give"
            >
              <Heart className="site-header__give-icon" aria-hidden="true" />
              <span>Give</span>
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
          {/* ── Top bar: brand + close button (always visible) ── */}
          <div className="nav-overlay__topbar">
            <Link
              href="/"
              prefetch={false}
              className="nav-overlay__brand"
              onClick={close}
              tabIndex={navOpen ? 0 : -1}
              aria-label="The Wisdom Church — home"
            >
              <span className="site-header__logo-wrap">
                <Image
                  quality={IMAGE_QUALITY}
                  src="/logo.webp"
                  alt=""
                  width={34}
                  height={34}
                  className="nav-overlay__brand-logo"
                />
              </span>
              <span className="nav-overlay__brand-wordmark">
                <span>The Wisdom</span>
                <strong>Church</strong>
              </span>
            </Link>

            <button
              type="button"
              className="nav-overlay__close"
              onClick={close}
              aria-label="Close navigation"
              tabIndex={navOpen ? 0 : -1}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 2L14 14M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="nav-overlay__close-label">Close</span>
            </button>
          </div>

          {/* ── Body: nav links left + info panel right (desktop) ── */}
          <div className="nav-overlay__body">
            {/* Primary navigation links */}
            <nav className="nav-overlay__links" aria-label="Primary navigation">
              {NAV_ITEMS.map((item, i) => (
                <div
                  key={item.href}
                  className="nav-item"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ '--nav-i': i } as React.CSSProperties}
                >
                  <div className="nav-item__head">
                    <span className="nav-item__num" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <Link
                      href={item.href}
                      prefetch={false}
                      ref={i === 0 ? firstLinkRef : undefined}
                      className={`nav-item__link${isActive(item.href) ? ' is-active' : ''}`}
                      onClick={close}
                      tabIndex={navOpen ? 0 : -1}
                    >
                      {item.label}
                      <ChevronRight
                        className="nav-item__arrow"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>

                  {item.children ? (
                    <div className="nav-item__sub">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          prefetch={false}
                          className="nav-item__sub-link"
                          onClick={close}
                          tabIndex={navOpen ? 0 : -1}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            {/* Right panel — service info + socials (desktop only) */}
            <aside
              className="nav-overlay__panel"
              aria-label="Service information"
            >
              <div className="nav-panel">
                <p className="nav-panel__eyebrow">Next Sunday Service</p>
                <p className="nav-panel__title">
                  This {SERVICE_INFO.sunday.day}
                </p>
                <p className="nav-panel__detail">
                  {SERVICE_INFO.sunday.time} · {SERVICE_INFO.sunday.timezone}
                </p>
                <p className="nav-panel__detail">{SERVICE_INFO.venue.short}</p>
                <PlanVisitTrigger
                  icon={false}
                  plain
                  className="nav-panel__cta"
                  onClick={close}
                  tabIndex={navOpen ? 0 : -1}
                >
                  Plan a visit →
                </PlanVisitTrigger>

                <div className="nav-panel__divider" aria-hidden="true" />

                <p className="nav-panel__eyebrow">
                  {SERVICE_INFO.dailyPrayer.label}
                </p>
                <p className="nav-panel__detail">
                  {SERVICE_INFO.dailyPrayer.daysShort} ·{' '}
                  {SERVICE_INFO.dailyPrayer.time} · {SERVICE_INFO.venue.name}
                </p>
              </div>

              <div className="nav-socials">
                <p className="nav-socials__label">Follow us</p>
                <div className="nav-socials__links">
                  {SOCIALS.map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
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

          {/* ── Mobile footer: service times + socials ── */}
          <div className="nav-overlay__footer">
            <div className="nav-footer__card">
              <p className="nav-footer__label">Next Sunday Service</p>
              <p className="nav-footer__time">
                {SERVICE_INFO.sunday.day} · {SERVICE_INFO.sunday.time}
              </p>
              <p className="nav-footer__venue">{SERVICE_INFO.venue.short}</p>
              <PlanVisitTrigger
                icon={false}
                plain
                className="nav-footer__cta"
                onClick={close}
                tabIndex={navOpen ? 0 : -1}
              >
                Plan a visit →
              </PlanVisitTrigger>
            </div>
            <div className="nav-footer__socials">
              <span className="nav-footer__socials-label">Connect</span>
              <div className="nav-footer__socials-row">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-footer__social-link"
                    tabIndex={navOpen ? 0 : -1}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
