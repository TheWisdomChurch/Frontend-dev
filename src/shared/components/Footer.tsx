'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Globe,
  Mail,
  MapPin,
  MonitorPlay,
  PhoneCall,
} from 'lucide-react';

import { Container } from '@/shared/layout';
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
  '🕘 Sunday Worship: 9:00 AM',
  '🕕 Midweek Service: Thursday, 6:00 PM',
  '🙏 Prayer & pastoral support available by request',
];

const socialLinks = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@wisdomhousehq',
    icon: MonitorPlay,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/wisdomhousehq',
    icon: Camera,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/wisdomhousehq',
    icon: Globe,
  },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{
        borderColor: 'var(--color-border-light)',
        backgroundColor: 'var(--color-bg-deep)',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* Decorative Gradient Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(circle at 12% 20%, rgba(215, 187, 117, 0.1), transparent 32%), radial-gradient(circle at 85% 80%, rgba(215, 187, 117, 0.08), transparent 30%)',
        }}
      />

      <Container size="xl" className="relative py-16 sm:py-20 lg:py-24">
        {/* Main CTA Section */}
        <div
          className="rounded-3xl p-8 sm:p-12 lg:p-14 mb-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
          style={{
            backgroundColor: 'rgba(215, 187, 117, 0.08)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <div className="space-y-4">
            <p
              className="text-sm uppercase tracking-widest font-semibold"
              style={{ color: 'var(--color-gold)' }}
            >
              Build Your Week
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                color: 'var(--color-text-primary)',
              }}
            >
              Around worship, sound teaching, and meaningful community.
            </h2>
            <p
              className="max-w-2xl text-base leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Whether you are exploring faith, returning to church, or looking
              for a place to serve, there is room for you here.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Plan your visit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources/sermons"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Watch online
            </Link>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_1fr] mb-12">
          {/* Brand Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border"
                style={{ borderColor: 'var(--color-border-light)' }}
              >
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom Church"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-wider font-semibold"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  The Wisdom Church
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Experience. Equip. Empower.
                </p>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              A vibrant, Spirit-filled community committed to raising leaders,
              strengthening faith, and serving the nations with wisdom and love.
            </p>

            {/* Service Times */}
            <div
              className="space-y-2 pt-4 border-t"
              style={{ borderColor: 'var(--color-border-light)' }}
            >
              {serviceTimes.map((time, idx) => (
                <p
                  key={idx}
                  className="text-sm"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {time}
                </p>
              ))}
            </div>
          </div>

          {/* Site Links */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-gold)' }}
            >
              Explore
            </h3>
            <nav className="space-y-3">
              {siteLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm transition"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Care Links */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-gold)' }}
            >
              Community
            </h3>
            <nav className="space-y-3">
              {careLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm transition"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-gold)' }}
            >
              Contact & Connect
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: 'var(--color-gold)' }}
                />
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Honor Gardens, opposite Dominion City, Alasia, Lagos
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: 'var(--color-gold)' }}
                />
                <a
                  href="tel:+2348000000000"
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  +234 800 000 0000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: 'var(--color-gold)' }}
                />
                <a
                  href="mailto:info@wisdomchurchhq.org"
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  info@wisdomchurchhq.org
                </a>
              </div>

              {/* Social Media */}
              <div
                className="pt-4 border-t flex gap-3"
                style={{ borderColor: 'var(--color-border-light)' }}
              >
                {socialLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg transition"
                      style={{
                        backgroundColor: 'rgba(215, 187, 117, 0.1)',
                        color: 'var(--color-gold)',
                      }}
                      title={link.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-12 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-sm"
          style={{
            borderColor: 'var(--color-border-light)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <p>
            &copy; {new Date().getFullYear()} The Wisdom Church. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="transition"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="transition"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Cookie Policy
            </Link>
            <Link
              href="/privacy"
              className="transition"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
