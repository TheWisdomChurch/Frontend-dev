'use client';

import React, { useState } from 'react';
import PageHero from '@/features/hero/PageHero';
import { H2, H3, BodyMD, SmallText, Caption } from '@/shared/text';
import { useTheme } from '@/shared/contexts/ThemeContext';
import {
  Container,
  Section,
  PageSection,
  FlexboxLayout,
  Gridbox,
} from '@/shared/layout';
import Button from '@/shared/utils/buttons/CustomButton';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  LucideIcon,
  ArrowUpRight,
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you"
        note="Whether you’re new or part of the family, reach out and we’ll get back quickly."
        chips={['Visit', 'Call', 'Email', 'Connect']}
        compact
      />

      <Section padding="xl" className="relative overflow-hidden bg-[#050505]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            maskImage:
              'radial-gradient(circle at 50% 40%, black 40%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 40%, black 40%, transparent 92%)',
          }}
        />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `${colorScheme.primary}1a` }}
        />

        <Container size="xl" className="relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-[0.94fr_1.06fr] gap-5 sm:gap-6 lg:gap-8">
            <aside className="space-y-4 sm:space-y-5 xl:sticky xl:top-24 h-fit">
              <div
                className="rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-5 lg:p-6"
                style={{
                  background:
                    'linear-gradient(150deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 42%, rgba(0,0,0,0.2) 100%)',
                  boxShadow: '0 16px 42px rgba(0,0,0,0.34)',
                }}
              >
                <H2 className="text-lg sm:text-xl font-semibold mb-1.5 leading-tight">
                  Visit & Reach Us
                </H2>
                <BodyMD className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  Multiple ways to connect with leadership and teams.
                </BodyMD>

                <div className="mt-4 space-y-3">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.title}
                        className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-black/30 p-3.5 sm:p-4"
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-px opacity-70"
                          style={{
                            background: `linear-gradient(90deg, transparent 0%, ${colorScheme.primary}55 50%, transparent 100%)`,
                          }}
                        />
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center border border-white/10"
                              style={{
                                backgroundColor: colorScheme.opacity.primary10,
                              }}
                            >
                              <Icon
                                className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                                style={{ color: colorScheme.primary }}
                              />
                            </div>
                            <div className="hidden sm:block">
                              <Caption className="text-[10px] tracking-[0.18em] text-white/50">
                                {String(index + 1).padStart(2, '0')}
                              </Caption>
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <H3 className="text-sm sm:text-[15px] font-semibold leading-tight">
                              {method.title}
                            </H3>
                            <SmallText className="mt-1 text-white/65 text-[11px] sm:text-xs leading-relaxed">
                              {method.description}
                            </SmallText>

                            <div className="mt-2 space-y-1">
                              {method.details.map(detail => (
                                <SmallText
                                  key={detail}
                                  className="block text-white/70 text-[11px] sm:text-xs leading-relaxed"
                                >
                                  {detail}
                                </SmallText>
                              ))}
                            </div>

                            {method.link ? (
                              <a
                                href={method.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold"
                                style={{ color: colorScheme.primary }}
                              >
                                Reach out
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-5"
                style={{
                  background:
                    'linear-gradient(150deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 45%, rgba(0,0,0,0.16) 100%)',
                }}
              >
                <H3 className="text-sm sm:text-base font-semibold mb-3">
                  Follow us
                </H3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {socialMedia.map(social => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 transition-colors hover:border-white/20"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center border border-white/10"
                            style={{
                              backgroundColor: colorScheme.opacity.primary10,
                            }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: colorScheme.primary }}
                            />
                          </div>
                          <div className="min-w-0">
                            <SmallText className="block text-white/85 text-[11px] sm:text-xs font-medium truncate">
                              {social.platform}
                            </SmallText>
                            <SmallText className="block text-white/55 text-[10px] sm:text-[11px] truncate">
                              {social.handle}
                            </SmallText>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-5 lg:p-6"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 42%, rgba(0,0,0,0.22) 100%)',
                boxShadow: '0 18px 48px rgba(0,0,0,0.36)',
              }}
            >
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(circle at 92% 10%, ${colorScheme.primary}22 0%, transparent 44%)`,
                }}
              />

              <div className="relative">
                <div className="mb-5 sm:mb-6 space-y-1">
                  <H3 className="text-base sm:text-lg font-semibold leading-tight">
                    Send us a message
                  </H3>
                  <SmallText className="text-white/65 text-[11px] sm:text-xs leading-relaxed">
                    We respond within 24 hours on weekdays.
                  </SmallText>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <SmallText className="text-white/70 text-[11px]">
                        First name
                      </SmallText>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        placeholder="John"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <SmallText className="text-white/70 text-[11px]">
                        Last name
                      </SmallText>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <SmallText className="text-white/70 text-[11px]">
                        Email
                      </SmallText>
                      <input
                        type="email"
                        className="w-full rounded-xl border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <SmallText className="text-white/70 text-[11px]">
                        Phone
                      </SmallText>
                      <input
                        type="tel"
                        className="w-full rounded-xl border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        placeholder="+234 706 999 5333"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <SmallText className="text-white/70 text-[11px]">
                      Topic
                    </SmallText>
                    <select className="w-full rounded-xl border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10">
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
                    <SmallText className="text-white/70 text-[11px]">
                      Message
                    </SmallText>
                    <textarea
                      rows={5}
                      className="w-full rounded-xl border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10 resize-y min-h-[120px]"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <div className="flex items-center gap-2 text-white/70">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    <SmallText className="text-[11px] sm:text-xs">
                      We’ll respond by email and phone if provided.
                    </SmallText>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      curvature="xl"
                      className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-black"
                      style={{
                        backgroundColor: colorScheme.primary,
                        color: colorScheme.black,
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      Send Message
                    </Button>

                    {submitted ? (
                      <SmallText
                        className="text-emerald-300 text-[11px] sm:text-xs"
                        aria-live="polite"
                      >
                        Message queued successfully. Our team will respond
                        within 24 hours.
                      </SmallText>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default ContactPage;
