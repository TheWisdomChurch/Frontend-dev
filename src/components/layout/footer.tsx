'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  MapPin,
  Mail,
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  ArrowRight,
} from 'lucide-react';
import { bricolageGrotesque, worksans } from '@/components/fonts/fonts';
import { useTheme } from '@/components/contexts/ThemeContext';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WisdomeHouseLogo } from '../assets';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { colorScheme } = useTheme();

  const footerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const col4Ref = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
        }
      );

      [col1Ref, col2Ref, col3Ref, col4Ref].forEach((ref, i) => {
        gsap.from(ref.current?.children || [], {
          y: 50,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 90%' },
        });
      });

      gsap.from(bottomRef.current?.children || [], {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'back.out(1.3)',
        scrollTrigger: { trigger: bottomRef.current, start: 'top 95%' },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Social media links
  const socialLinks = [
    {
      Icon: Facebook,
      href: 'https://web.facebook.com/search/top?q=wisdom%20house%20hq',
      label: 'Facebook',
    },
    {
      Icon: Youtube,
      href: 'https://www.youtube.com/@wisdomhousehq',
      label: 'YouTube',
    },
    {
      Icon: Instagram,
      href: '#', // Add Instagram link later
      label: 'Instagram',
    },
    {
      Icon: Twitter,
      href: '#', // Add Twitter link later
      label: 'Twitter',
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: colorScheme.background }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 80%, ${colorScheme.primary}20 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-20">
        {/* Perfect 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 xl:gap-16 mb-16">
          {/* Column 1 – Brand & Description */}
          <div ref={col1Ref} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-4 ring-primary/20">
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom House Church"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div>
                <h3
                  className={`${bricolageGrotesque.className} text-2xl font-bold`}
                  style={{ color: colorScheme.white }}
                >
                  The Wisdom House Church
                </h3>
                <p
                  className={`${worksans.className} text-sm`}
                  style={{ color: colorScheme.primary }}
                >
                  Equipping & Empowering for greatness
                </p>
              </div>
            </div>

            <p
              className={`${worksans.className} text-base leading-relaxed`}
              style={{ color: colorScheme.text }}
            >
              A vibrant community dedicated to spiritual growth, divine wisdom,
              and kingdom impact. Join us as we pursue purpose together.
            </p>

            {/* Contact Cards */}
            <div className="space-y-4">
              {[
                {
                  Icon: MapPin,
                  title: 'Location',
                  text: 'Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe Expressway, Lagos',
                },
                { Icon: Phone, title: 'Phone', text: '0706 999 5333' },
                { Icon: Mail, title: 'Email', text: 'info@wisdomhouse.com' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <item.Icon
                      className="w-5 h-5"
                      style={{ color: colorScheme.primary }}
                    />
                  </div>
                  <div>
                    <p
                      className={`${worksans.className} text-sm font-medium`}
                      style={{ color: colorScheme.white }}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`${worksans.className} text-sm`}
                      style={{ color: colorScheme.heading }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div ref={col2Ref} className="space-y-6">
            <h4
              className={`${bricolageGrotesque.className} text-xl font-bold mb-6`}
              style={{ color: colorScheme.white }}
            >
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/about/mission', label: 'About Us' },
                { href: '/events/upcoming', label: 'Events & Programs' },
                { href: '/resources/sermons', label: 'Sermons' },
                { href: '/resources/store', label: 'Store' },
                // { href: "/giving", label: "Give Online" },
                { href: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 text-base hover:translate-x-2 transition-all duration-300"
                    style={{ color: colorScheme.primary }}
                  >
                    <ArrowRight
                      className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      style={{ color: colorScheme.primary }}
                    />
                    <span
                      style={{ color: colorScheme.primary }}
                      className="group-hover:text-primary transition-colors"
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Service Times */}
          <div ref={col3Ref} className="space-y-6">
            <h4
              className={`${bricolageGrotesque.className} text-xl font-bold mb-6`}
              style={{ color: colorScheme.white }}
            >
              Service Times
            </h4>
            <div className="space-y-4">
              {[
                { day: 'Sunday Worship', time: '9:00 AM', highlight: true },
                { day: 'Midweek Service', time: 'Thursday • 6:00 PM' },
                { day: '1st Sunday', time: 'Celebration & Communion' },
                { day: 'Last Sunday', time: 'Supernatural Encounter' },
              ].map(s => (
                <div
                  key={s.day}
                  className={`p-4 rounded-xl border ${s.highlight ? 'border-primary/40 bg-primary/5' : 'border-white/10'}`}
                >
                  <p
                    className={`${worksans.className} font-semibold`}
                    style={{
                      color: s.highlight
                        ? colorScheme.primary
                        : colorScheme.white,
                    }}
                  >
                    {s.day}
                  </p>
                  <p
                    className={`${worksans.className} text-sm mt-1`}
                    style={{ color: colorScheme.text }}
                  >
                    {s.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 – Newsletter + Social */}
          <div ref={col4Ref} className="space-y-8">
            <div>
              <h4
                className={`${bricolageGrotesque.className} text-xl font-bold mb-4`}
                style={{ color: colorScheme.white }}
              >
                Stay Inspired
              </h4>
              <p
                className={`${worksans.className} text-sm mb-6`}
                style={{ color: colorScheme.primary }}
              >
                Get weekly sermons, event updates, and devotionals straight to
                your inbox.
              </p>

              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-primary focus:outline-none transition-all"
                  style={{ color: colorScheme.white }}
                />
                <button
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: colorScheme.black,
                  }}
                  className="px-6 py-3 rounded-xl font-medium  hover:bg-primary/90 text-black transition-all flex items-center justify-center gap-2"
                >
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div>
              <p
                className={`${worksans.className} text-sm font-medium mb-4`}
                style={{ color: colorScheme.white }}
              >
                Follow Us
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.Icon
                      className="w-5 h-5"
                      style={{ color: colorScheme.primary }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div ref={bottomRef} className="pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
            <p style={{ color: colorScheme.text }}>
              © {currentYear} The Wisdom House Church. All Rights Reserved.
            </p>

            <div className="flex items-center gap-8">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
                style={{ color: colorScheme.primary }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
                style={{ color: colorScheme.primary }}
              >
                Terms of Service
              </Link>
            </div>

            {/* <p className={`${worksans.className} flex items-center gap-2`} style={{ color: colorScheme.primary }}>
              Made with <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" /> for the Kingdom
            </p> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
