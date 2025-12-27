'use client';

import { memo, useRef, useEffect, useMemo, useCallback } from 'react'; // Added memoization hooks
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Mail, Facebook, Youtube, Instagram, Twitter, ArrowRight } from 'lucide-react';
import { bricolageGrotesque } from '@/components/fonts/fonts';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H4, BodySM, BodyMD, Caption, BodyLG } from '@/components/text';

// 1. MEMOIZE STATIC DATA & COMPONENTS OUTSIDE
const currentYear = new Date().getFullYear();
const socialLinks = [
  { Icon: Facebook, href: 'https://web.facebook.com/search/top?q=wisdom%20house%20hq', label: 'Facebook' },
  { Icon: Youtube, href: 'https://www.youtube.com/@wisdomhousehq', label: 'YouTube' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
];
const contactInfo = [
  { Icon: MapPin, title: 'Location', text: 'Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe Expressway, Lagos' },
  { Icon: Phone, title: 'Phone', text: '0706 999 5333' },
  { Icon: Mail, title: 'Email', text: 'Wisdomhousehq@gmail.com' },
];
const quickLinks = [
  { href: '/about/mission', label: 'About Us' },
  { href: '/events/upcoming', label: 'Events & Programs' },
  { href: '/resources/sermons', label: 'Sermons' },
  { href: '/resources/store', label: 'Store' },
  { href: '/contact', label: 'Contact Us' },
];
const serviceTimes = [
  { day: 'Sunday Worship', time: '9:00 AM', highlight: true },
  { day: 'Midweek Service', time: 'Thursday • 6:00 PM', highlight: false },
];

// 2. LAZY LOAD HEAVY LIBRARIES
let gsapPromise: Promise<{ gsap: any; ScrollTrigger: any }> | undefined;
const getGsap = () => {
  if (!gsapPromise) {
    gsapPromise = import('gsap').then(gsapModule => {
      const gsap = gsapModule.default;
      return import('gsap/ScrollTrigger').then(ScrollTriggerModule => {
        const ScrollTrigger = ScrollTriggerModule.default;
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      });
    });
  }
  return gsapPromise;
};

// 3. OPTIMIZED IMAGE CONFIGURATION (Update path if needed)
const logoConfig = {
  src: '/images/wisdom-house-logo.webp', // Consider converting to WebP and using public folder
  width: 48,
  height: 48,
  alt: 'The Wisdom House Church',
  priority: false, // Keep false for footer
  loading: 'lazy' as const, // Lazy load the footer logo
};

// 4. MAIN COMPONENT WITH MEMOIZATION
function Footer() {
  const { colorScheme } = useTheme();
  const footerRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null); // For Intersection Observer

  // 5. MEMOIZE VALUES THAT DEPEND ON colorScheme
  const gradientStyle = useMemo(() => ({
    background: `radial-gradient(circle at 20% 80%, ${colorScheme.primary}40 0%, transparent 60%)`
  }), [colorScheme.primary]);

  const borderStyle = useMemo(() => ({
    borderColor: colorScheme.primary + '40'
  }), [colorScheme.primary]);

  // 6. DELAYED ANIMATION INITIALIZATION (Only when footer is visible)
  useEffect(() => {
    const currentRef = footerRef.current;
    if (!currentRef) return;

    // Use Intersection Observer to delay GSAP until footer is near viewport
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Lazy load and initialize GSAP only when needed
        getGsap().then(({ gsap, ScrollTrigger }) => {
          gsap.fromTo(currentRef,
            { y: 30, opacity: 0 }, // Reduced initial movement for speed
            {
              y: 0,
              opacity: 1,
              duration: 0.6, // Faster duration
              ease: 'power2.out',
              scrollTrigger: {
                trigger: currentRef,
                start: 'top 90%',
                toggleActions: 'play none none reverse', // Cleaner trigger actions
                markers: false // Disable in production
              }
            }
          );
        });
        if (observerRef.current) {
          observerRef.current.unobserve(currentRef);
        }
      }
    }, { threshold: 0.1, rootMargin: '50px' }); // Start earlier but with minimal load

    observerRef.current.observe(currentRef);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []); // Empty deps since we only need to run once

  // 7. MEMOIZE EVENT HANDLERS (if you had any)
  const handleSubscribe = useCallback((e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle subscription logic
    console.log('Subscribe handler');
  }, []);

  // 8. RENDER LOGIC
  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-black"
    >
      {/* Background gradient with memoized style */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={gradientStyle} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-18">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12 mb-14">
          
          {/* Column 1 - Contact */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-primary/20">
                <Image
                  {...logoConfig}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className={`${bricolageGrotesque.className} text-lg font-semibold mb-1 text-white`}>
                  The Wisdom Church
                </h3>
                <Caption style={{ color: colorScheme.primary }} useThemeColor={false}>
                  Equipping & Empowering for greatness
                </Caption>
              </div>
            </div>
            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                    <item.Icon className="w-4 h-4" style={{ color: colorScheme.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <BodySM className="font-medium text-white mb-1" useThemeColor={false}>
                      {item.title}
                    </BodySM>
                    <Caption className="text-gray-300 break-words leading-relaxed" useThemeColor={false}>
                      {item.text}
                    </Caption>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-6">
            <BodyLG className="font-semibold mb-6 text-white" useThemeColor={false}>
              Quick Links
            </BodyLG>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center gap-2 py-2 hover:translate-x-1 transition-all duration-300" style={{ color: colorScheme.primary }}>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0" style={{ color: colorScheme.primary }} />
                    <Caption className="truncate">{link.label}</Caption>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Service Times */}
          <div className="space-y-6">
            <BodyLG className="font-semibold mb-6 text-white" useThemeColor={false}>
              Service Times
            </BodyLG>
            <div className="space-y-4">
              {serviceTimes.map(s => (
                <div key={s.day} className={`p-3.5 rounded-lg ${s.highlight ? 'border border-primary bg-primary/10' : 'border border-gray-700'}`}>
                  <BodySM className={`font-medium ${s.highlight ? '' : 'text-white'} mb-1`} style={{ color: s.highlight ? colorScheme.primary : undefined }} useThemeColor={false}>
                    {s.day}
                  </BodySM>
                  <Caption className="text-gray-300" useThemeColor={false}>{s.time}</Caption>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 - Newsletter & Social */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <BodyLG className="font-semibold mb-4 text-white" useThemeColor={false}>
                  Stay Inspired
                </BodyLG>
                <Caption className="text-gray-300 mb-6 leading-relaxed" useThemeColor={false}>
                  Get weekly sermons, event updates, and devotionals.
                </Caption>
              </div>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 focus:border-primary focus:outline-none transition-all placeholder:text-gray-500 text-white text-sm" />
                <button type="submit" style={{ backgroundColor: colorScheme.primary, color: colorScheme.black }} className="w-full px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-1.5 text-sm">
                  <BodySM>Subscribe</BodySM>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            </div>
            <div className="pt-6 border-t border-gray-800">
              <div className="text-center">
                <BodyMD className="font-medium mb-4 text-white" useThemeColor={false}>Follow Us</BodyMD>
                <div className="flex justify-center items-center gap-3">
                  {socialLinks.map((social, i) => (
                    <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/10 border border-gray-700 hover:bg-primary/20 hover:border-primary transition-all duration-300 hover:scale-105" aria-label={social.label}>
                      <social.Icon className="w-4 h-4" style={{ color: colorScheme.primary }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with memoized border style */}
        <div className="pt-10 border-t" style={borderStyle}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Caption className="text-gray-400 text-center md:text-left" useThemeColor={false}>
              © {currentYear} The Wisdom House Church. All Rights Reserved.
            </Caption>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors" style={{ color: colorScheme.primary }}>
                <Caption useThemeColor={false}>Privacy Policy</Caption>
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors" style={{ color: colorScheme.primary }}>
                <Caption useThemeColor={false}>Terms of Service</Caption>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// 9. EXPORT MEMOIZED COMPONENT
export default memo(Footer);