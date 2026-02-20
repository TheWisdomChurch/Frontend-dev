'use client';

import React, { useState } from 'react';
import PageHero from '@/components/ui/PageHero';
import { H2, H3, BodyMD, SmallText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  Section,
  Container,
  GridboxLayout,
} from '@/components/layout';
import Button from '@/components/utils/buttons/CustomButton';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  LucideIcon,
} from 'lucide-react';

// Define types for our data structures
interface ContactMethod {
  title: string;
  description: string;
  details: string[];
  icon: LucideIcon;
  link?: string;
}

interface SocialMedia {
  platform: string;
  handle: string;
  url: string;
  icon: LucideIcon;
}

const ContactPage = () => {
  const { colorScheme } = useTheme();
  const [submitted, setSubmitted] = useState(false);

  const contactMethods: ContactMethod[] = [
    {
      title: 'Visit Us',
      description: 'Come worship with us in person',
      details: [
        'Honors gardens, opposite Dominion Church Headquarters',
        'Alasia bus stop, Lekki Epe expressway',
        'Lagos, Nigeria',
        'Sunday Services: 9:00 AM',
      ],
      icon: MapPin,
    },
    {
      title: 'Call Us',
      description: 'Speak with our church office',
      details: ['Phone: +234 706 999 5333'],
      icon: Phone,
      link: 'https://wa.me/2347069995333',
    },
    {
      title: 'Email Us',
      description: 'Send us a message anytime',
      details: ['wisdomhousehq@gmail.com'],
      icon: Mail,
      link: 'mailto:wisdomhousehq@gmail.com',
    },
  ];

  const socialMedia: SocialMedia[] = [
    {
      platform: 'Instagram',
      handle: '@wisdomhousehq',
      url: 'https://instagram.com/wisdomhousehq',
      icon: Instagram,
    },
    {
      platform: 'Facebook',
      handle: '@wisdomhousehq',
      url: 'https://facebook.com/wisdomhousehq',
      icon: Facebook,
    },
    {
      platform: 'YouTube',
      handle: 'Wisdom House',
      url: 'https://youtube.com/@wisdomhousehq',
      icon: Youtube,
    },
  ];

  // Handle button hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = colorScheme.primaryDark;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = colorScheme.primary;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#050505] text-white">
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you"
        note="Whether you’re new or part of the family, reach out and we’ll get back quickly."
        chips={['Visit', 'Call', 'Email', 'Connect']}
        compact
      />

      <Section padding="xl" className="bg-[#050505]">
        <Container size="xl" className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12">
          {/* Left column: contact and social */}
          <div className="space-y-6 fade-up">
            <div
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-black/60 to-black/80 p-6 sm:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
            >
              <H2 className="text-xl sm:text-2xl font-semibold mb-2">Visit & Reach Us</H2>
              <BodyMD className="text-white/70 text-xs sm:text-sm mb-4">
                Multiple ways to connect with leadership and teams.
              </BodyMD>
              <div className="space-y-4">
                {contactMethods.map(method => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.title}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5"
                    >
                      <div className="mt-0.5 h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colorScheme.opacity.primary10 }}>
                        <Icon className="w-5 h-5" style={{ color: colorScheme.primary }} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <H3 className="text-sm font-semibold">{method.title}</H3>
                        <SmallText className="text-white/65 text-[12px]">{method.description}</SmallText>
                        <div className="space-y-0.5">
                          {method.details.map(detail => (
                            <SmallText key={detail} className="text-white/60 text-[11px]">
                              {detail}
                            </SmallText>
                          ))}
                        </div>
                        {method.link && (
                          <a
                            href={method.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[12px] font-semibold"
                            style={{ color: colorScheme.primary }}
                          >
                            Reach out →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <H3 className="text-base font-semibold mb-3">Follow us</H3>
              <div className="flex flex-wrap gap-3">
                {socialMedia.map(social => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-black/40 hover:border-primary transition"
                    >
                      <Icon className="w-4 h-4" style={{ color: colorScheme.primary }} />
                      <SmallText className="text-white/80">{social.platform}</SmallText>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: form */}
          <div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-black/70 to-black/85 p-5 sm:p-7 lg:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.45)] fade-up"
            style={{ animationDelay: '90ms' }}
          >
            <div className="mb-6 space-y-1">
              <H3 className="text-lg font-semibold">Send us a message</H3>
              <SmallText className="text-white/65 text-[12px]">
                We respond within 24 hours on weekdays.
              </SmallText>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <GridboxLayout columns={2} responsive={{ xs: 1, md: 2 }} gap="sm">
                <div className="space-y-1.5">
                  <SmallText className="text-white/70 text-[11px] sm:text-[12px]">First name</SmallText>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm bg-[#0f0f0f] border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none text-white"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1.5">
                  <SmallText className="text-white/70 text-[11px] sm:text-[12px]">Last name</SmallText>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm bg-[#0f0f0f] border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none text-white"
                    placeholder="Doe"
                  />
                </div>
              </GridboxLayout>

              <GridboxLayout columns={2} responsive={{ xs: 1, md: 2 }} gap="sm">
                <div className="space-y-1.5">
                  <SmallText className="text-white/70 text-[11px] sm:text-[12px]">Email</SmallText>
                  <input
                    type="email"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm bg-[#0f0f0f] border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none text-white"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <SmallText className="text-white/70 text-[11px] sm:text-[12px]">Phone</SmallText>
                  <input
                    type="tel"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm bg-[#0f0f0f] border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none text-white"
                    placeholder="+234 706 999 5333"
                  />
                </div>
              </GridboxLayout>

              <div className="space-y-1.5">
                <SmallText className="text-white/70 text-[11px] sm:text-[12px]">Topic</SmallText>
                <select
                  className="w-full rounded-lg border px-3 py-2.5 text-sm bg-[#0f0f0f] border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none text-white"
                >
                  <option value="">Select a topic</option>
                  <option value="visit">Plan a visit</option>
                  <option value="pastoral">Pastoral care</option>
                  <option value="prayer">Prayer request</option>
                  <option value="serve">Serving / volunteering</option>
                  <option value="events">Events / bookings</option>
                  <option value="media">Media / resources</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <SmallText className="text-white/70 text-[11px] sm:text-[12px]">Message</SmallText>
                <textarea
                  rows={5}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm bg-[#0f0f0f] border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none text-white"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <div className="flex items-center gap-2 text-white/70 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
                <span>We’ll respond by email and phone if provided.</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                curvature="xl"
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: colorScheme.primary, color: colorScheme.black }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Send Message
              </Button>
              {submitted ? (
                <SmallText className="text-emerald-300 text-xs sm:text-sm" aria-live="polite">
                  Message queued successfully. Our team will respond within 24 hours.
                </SmallText>
              ) : null}
            </form>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default ContactPage;
