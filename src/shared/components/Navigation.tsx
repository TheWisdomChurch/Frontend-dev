'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { WisdomeHouseLogo } from '@/shared/assets';
import Image from 'next/image';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events/upcoming' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Resources', href: '/resources/sermons' },
  { label: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Navigation Header */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b',
          isScrolled
            ? 'bg-black/95 backdrop-blur-md border-white/10'
            : 'bg-transparent border-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 flex-shrink-0 group"
            >
              <div
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300"
                style={{
                  borderColor: isScrolled
                    ? 'var(--color-border-light)'
                    : 'var(--color-border-white)',
                  backgroundColor: isScrolled
                    ? 'rgba(215, 187, 117, 0.05)'
                    : 'transparent',
                }}
              >
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom Church"
                  width={40}
                  height={40}
                  className="object-cover rounded"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <p
                  className="text-xs font-semibold uppercase letter-spacing tracking-widest"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  The Wisdom Church
                </p>
                <p
                  className="text-sm font-light"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Welcome Home
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-light rounded-md transition-all duration-300',
                    isActive(link.href)
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white'
                  )}
                  style={{
                    color: isActive(link.href)
                      ? 'var(--color-gold)'
                      : 'var(--color-text-tertiary)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button - Desktop */}
            <Link
              href="/checkout"
              className="hidden md:inline-flex btn-primary text-sm"
            >
              Give
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              {isOpen ? (
                <X size={24} style={{ color: 'var(--color-text-primary)' }} />
              ) : (
                <Menu
                  size={24}
                  style={{ color: 'var(--color-text-primary)' }}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(5, 5, 5, 0.98)' }}
        >
          <div className="container mx-auto px-4 py-8">
            <nav className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-lg transition-all duration-300 text-lg font-light"
                  style={{
                    color: isActive(link.href)
                      ? 'var(--color-gold)'
                      : 'var(--color-text-secondary)',
                    backgroundColor: isActive(link.href)
                      ? 'rgba(215, 187, 117, 0.1)'
                      : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile CTA */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <Link
                href="/checkout"
                className="btn-primary block w-full text-center py-3"
              >
                Give Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
