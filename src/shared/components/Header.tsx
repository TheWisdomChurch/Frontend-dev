'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BodySM, Caption } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';

type NavChild = {
  label: string;
  href: string;
  description?: string;
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
      {
        label: 'Sermons',
        href: '/resources/sermons',
        description: 'Messages from our pulpit',
      },
      {
        label: 'Blog',
        href: '/resources/blogs',
        description: 'Articles & devotionals',
      },
      {
        label: 'Publications',
        href: '/resources/publications',
        description: 'Books & resources',
      },
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
      { label: 'Weekly Services', href: '/events/weekly' },
      { label: 'Special Events', href: '/events/special' },
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

function DropdownMenu({ items }: { items: NavChild[] }) {
  return (
    <div className="absolute left-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-radius-md border border-white/10 bg-[var(--app-surface-2)] shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="py-2">
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col gap-0.5 px-4 py-2.5 transition-colors hover:bg-white/[0.06]"
          >
            <span className="text-sm font-medium text-white/85 group-hover:text-white">
              {item.label}
            </span>
            {item.description && (
              <span className="text-[11px] text-white/45 group-hover:text-white/60">
                {item.description}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname() || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = useMemo(() => NAV_ITEMS, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
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

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
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
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() =>
                  item.children && handleDropdownEnter(item.label)
                }
                onMouseLeave={() => item.children && handleDropdownLeave()}
              >
                <Link
                  href={item.href}
                  className={`site-header__nav-link inline-flex items-center gap-1 ${
                    isActive(item.href) ? 'is-active' : ''
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </Link>
                {item.children && openDropdown === item.label && (
                  <DropdownMenu items={item.children} />
                )}
              </div>
            ))}
          </nav>

          <div className="site-header__desktop flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[0.7rem] text-white/60 lg:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
              Sundays · 9:00 AM
            </span>
            <Link href="/forms/membership" className="site-header__cta">
              Join Us
            </Link>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="site-header__menu-button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(value => !value)}
          >
            <span className="site-header__menu-icon" />
          </Button>
        </div>
      </header>

      <div className="site-header__mobile-layer" aria-hidden={!menuOpen}>
        <Button
          type="button"
          variant="ghost"
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
              <Caption className="site-header__mobile-brand-kicker">
                Welcome to
              </Caption>
              <BodySM
                weight="semibold"
                className="site-header__mobile-brand-name"
              >
                The Wisdom Church
              </BodySM>
            </div>
          </div>

          {/* Priority Actions */}
          <div className="mb-4 grid grid-cols-2 gap-2 px-5">
            <Link
              href="/resources/sermons"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-radius-sm border border-white/12 bg-white/[0.06] py-3 text-sm font-medium text-white/85 transition hover:bg-white/[0.10]"
            >
              Watch Live
            </Link>
            <Link
              href="/#giving"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-radius-sm bg-[var(--app-primary)] py-3 text-sm font-semibold text-black transition hover:bg-[var(--app-primary-light)]"
            >
              Give Online
            </Link>
          </div>

          {/* Explore Section */}
          <div className="mb-1 px-5 pt-2">
            <Caption className="font-semibold text-white/35">Explore</Caption>
          </div>
          <nav
            className="site-header__mobile-nav"
            aria-label="Mobile navigation"
          >
            {navItems
              .filter(item => !['Give', 'Contact'].includes(item.label))
              .map(item => (
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

          {/* Connect Section */}
          <div className="mb-1 px-5 pt-4">
            <Caption className="font-semibold text-white/35">Connect</Caption>
          </div>
          <nav aria-label="Connect navigation">
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="site-header__mobile-link"
            >
              <span>Contact Us</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/forms/membership"
              onClick={() => setMenuOpen(false)}
              className="site-header__mobile-link"
            >
              <span>Join the Team</span>
              <span aria-hidden="true">→</span>
            </Link>
          </nav>

          <Link
            href="/forms/membership"
            className="site-header__cta site-header__mobile-cta"
          >
            Plan a Visit
          </Link>
        </div>
      </div>
    </>
  );
}
