'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { extendedNavLinks } from '@/lib/data';
import { cn } from '@/lib/cn';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { WisdomeHouseLogo } from '@/shared/assets';

const quickLinks = [
  { label: 'Upcoming Events', href: '/events/upcoming' },
  { label: 'Watch Sermons', href: '/resources/sermons' },
  { label: 'Need Prayer?', href: '/pastoral' },
];

export default function Header() {
  const pathname = usePathname();
  const { colorScheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
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

  const navItems = useMemo(
    () =>
      extendedNavLinks.map(link => ({
        label: link.label,
        href: link.href,
      })),
    []
  );

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'border-white/10 bg-[rgba(4,4,5,0.9)] backdrop-blur-2xl'
            : 'border-transparent bg-[rgba(4,4,5,0.52)] backdrop-blur-xl'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05]">
              <Image
                src={WisdomeHouseLogo}
                alt="The Wisdom Church"
                width={44}
                height={44}
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/55">
                The Wisdom Church
              </p>
              <p className="truncate text-sm font-semibold text-white sm:text-base">
                Equipping and empowering for greatness
              </p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5">
              {navItems.map(item => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      active
                        ? 'text-black'
                        : 'text-white/72 hover:bg-white/[0.06] hover:text-white'
                    )}
                    style={
                      active
                        ? {
                            background: colorScheme.primaryGradient,
                            boxShadow: `0 12px 30px ${colorScheme.opacity.primary20}`,
                          }
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <Link
              href="/resources/sermons"
              className="text-sm font-medium text-white/66 transition hover:text-white"
            >
              Watch online
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              style={{
                background: colorScheme.primaryGradient,
                boxShadow: `0 14px 36px ${colorScheme.opacity.primary20}`,
              }}
            >
              Plan a visit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(open => !open)}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08] lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition lg:hidden',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-screen w-full max-w-sm flex-col border-l border-white/10 bg-[#050505] px-6 pb-8 pt-24 transition-transform duration-300 lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="space-y-2">
          {navItems.map(item => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition',
                  active
                    ? 'border-transparent text-black'
                    : 'border-white/10 bg-white/[0.03] text-white/78 hover:bg-white/[0.06]'
                )}
                style={
                  active
                    ? { background: colorScheme.primaryGradient }
                    : undefined
                }
              >
                <span>{item.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#d7bb75]">
            Quick access
          </p>
          <div className="mt-4 grid gap-3">
            {quickLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72 transition hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black"
            style={{ background: colorScheme.primaryGradient }}
          >
            Plan your visit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}
