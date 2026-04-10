'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { extendedNavLinks } from '@/lib/data';
import { cn } from '@/lib/cn';
import { Container } from '@/shared/layout';
import { WisdomeHouseLogo } from '@/shared/assets';

const quickLinks = [
  { label: 'Upcoming Events', href: '/events/upcoming' },
  { label: 'Watch Sermons', href: '/resources/sermons' },
  { label: 'Pastoral Care', href: '/pastoral' },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300'
        )}
        style={{
          borderColor: scrolled ? 'var(--color-border-light)' : 'transparent',
          backgroundColor: scrolled
            ? 'rgba(5, 5, 5, 0.95)'
            : 'rgba(5, 5, 5, 0.7)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Container size="xl" className="py-3">
          <div className="flex items-center gap-4">
            {/* Logo & Branding */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div
                className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border"
                style={{ borderColor: 'var(--color-border-light)' }}
              >
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom Church"
                  width={44}
                  height={44}
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <p
                  className="text-xs uppercase tracking-widest font-semibold"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  The Wisdom Church
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Welcome Home
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <div
                className="flex items-center gap-1 rounded-full p-1.5"
                style={{
                  border: '1px solid var(--color-border-light)',
                  backgroundColor: 'rgba(215, 187, 117, 0.05)',
                }}
              >
                {extendedNavLinks.map(item => {
                  const active =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition"
                      style={{
                        backgroundColor: active
                          ? 'var(--color-gold)'
                          : 'transparent',
                        color: active
                          ? 'var(--color-text-inverse)'
                          : 'var(--color-text-secondary)',
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Link
                href="/contact"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-xs py-2 px-4"
              >
                Get Involved
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-auto lg:hidden p-2 rounded-lg transition"
              style={{
                backgroundColor: 'rgba(215, 187, 117, 0.1)',
                color: 'var(--color-text-primary)',
              }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 top-[56px] z-40 overflow-y-auto lg:hidden"
          style={{
            backgroundColor: 'var(--color-bg-deep)',
          }}
        >
          <Container size="xl" className="py-8">
            <nav className="space-y-2">
              {extendedNavLinks.map(item => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition"
                    style={{
                      backgroundColor: active
                        ? 'rgba(215, 187, 117, 0.15)'
                        : 'transparent',
                      color: active
                        ? 'var(--color-gold)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Quick Links */}
            <div
              className="mt-8 pt-8 border-t"
              style={{ borderColor: 'var(--color-border-light)' }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Quick Links
              </p>
              <div className="space-y-2">
                {quickLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 rounded-lg text-sm transition"
                    style={{
                      backgroundColor: 'rgba(215, 187, 117, 0.05)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile CTA */}
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center justify-center gap-2 w-full mt-8"
            >
              Plan Your Visit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Container>
        </div>
      )}
    </>
  );
}
