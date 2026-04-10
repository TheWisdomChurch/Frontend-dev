'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from 'lucide-react';

import { useTheme } from '@/shared/contexts/ThemeContext';
import { WisdomeHouseLogo } from '@/shared/assets';

const siteLinks = [
  { label: 'About', href: '/about' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

const careLinks = [
  { label: 'Pastoral Care', href: '/pastoral' },
  { label: 'Testimonies', href: '/testimonies' },
  { label: 'Upcoming Events', href: '/events/upcoming' },
  { label: 'Sermons', href: '/resources/sermons' },
  { label: 'Store', href: '/resources/store' },
];

const serviceTimes = [
  'Sunday Worship: 9:00 AM',
  'Midweek Service: Thursday, 6:00 PM',
  'Prayer & pastoral support available by request',
];

const socialLinks = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@wisdomhousehq',
    icon: Youtube,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/wisdomhousehq',
    icon: Instagram,
  },
];

export default function Footer() {
  const { colorScheme } = useTheme();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#040404] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 15% 18%, rgba(215,187,117,0.14), transparent 28%), radial-gradient(circle at 88% 82%, rgba(215,187,117,0.1), transparent 30%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Visit Wisdom Church
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Build your week around worship, sound teaching, and meaningful
              community.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
              Whether you are exploring faith, returning to church, or looking
              for a place to serve, there is room for you here.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              style={{
                background: colorScheme.primaryGradient,
                boxShadow: `0 14px 36px ${colorScheme.opacity.primary20}`,
              }}
            >
              Plan your visit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources/sermons"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Watch online
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05]">
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom Church"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  The Wisdom Church
                </p>
                <p className="text-sm text-white/58">
                  Equipping and empowering for greatness
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-white/65">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d7bb75]" />
                <span>
                  Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe
                  Expressway, Lagos
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#d7bb75]" />
                <a
                  href="tel:07069995333"
                  className="transition hover:text-white"
                >
                  0706 999 5333
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#d7bb75]" />
                <a
                  href="mailto:Wisdomhousehq@gmail.com"
                  className="transition hover:text-white"
                >
                  Wisdomhousehq@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/50">
              Explore
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/68">
              {siteLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/50">
              Community
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/68">
              {careLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/50">
                Service Times
              </p>
              <div className="mt-4 grid gap-3">
                {serviceTimes.map(item => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/68"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/50">
                Connect
              </p>
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} The Wisdom Church. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="transition hover:text-white/72">
              Terms
            </Link>
            <Link href="/cookies" className="transition hover:text-white/72">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
