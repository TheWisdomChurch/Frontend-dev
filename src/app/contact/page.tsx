'use client';

import React from 'react';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, H3, BodyMD, SmallText } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
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

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const sectionBackground = isDarkMode ? colorScheme.black : colorScheme.white;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const cardTextColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const formBackground = isDarkMode
    ? colorScheme.surface
    : colorScheme.backgroundSecondary;
  const borderColor = isDarkMode
    ? colorScheme.border
    : `${colorScheme.primary}40`;
  const inputBackground = isDarkMode ? colorScheme.white : colorScheme.surface;
  const inputBorderColor = isDarkMode
    ? colorScheme.borderLight
    : colorScheme.border;

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

  return (
    <div>
      <HeroSection
        title="Contact Us"
        subtitle="We'd Love to Hear From You"
        description="Whether you're new to our church family or have been with us for years, we're here to help you connect, grow, and serve. Reach out to us through any of the following ways."
        backgroundImage={hero_bg_1.src}
        showButtons={false}
        primaryButtonText="Get Directions"
        secondaryButtonText="Send Message"
        showScrollIndicator={true}
      />

      {/* Contact Methods Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: sectionBackground }}
      >
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-8"
          >
            <H2
              style={{ color: textColor }}
              className="text-2xl sm:text-3xl font-bold"
            >
              Get In Touch
            </H2>
            <BodyMD
              className="max-w-2xl mx-auto"
              style={{ color: secondaryTextColor }}
            >
              Multiple ways to connect with our church family and leadership
            </BodyMD>
          </FlexboxLayout>

          <div className="max-w-6xl mx-auto">
            <GridboxLayout columns={1} responsive={{ md: 2, lg: 3 }} gap="md">
              {contactMethods.map(method => {
                const IconComponent = method.icon;
                return (
                  <div
                    key={method.title}
                    className="rounded-xl p-5 text-center border transition-all duration-300 hover:translate-y-1"
                    style={{
                      backgroundColor: cardBackground,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <div className="flex justify-center mb-3">
                      <IconComponent
                        className="w-8 h-8"
                        style={{ color: colorScheme.primary }}
                      />
                    </div>
                    <H3
                      className="text-lg font-semibold mb-2"
                      style={{ color: cardTextColor }}
                    >
                      {method.title}
                    </H3>
                    <BodyMD
                      className="mb-3 text-sm"
                      style={{ color: secondaryTextColor }}
                    >
                      {method.description}
                    </BodyMD>
                    <div className="space-y-1">
                      {method.details.map(detail => (
                        <SmallText
                          key={detail}
                          className="text-xs"
                          style={{ color: secondaryTextColor }}
                        >
                          {detail}
                        </SmallText>
                      ))}
                    </div>
                    {method.link && (
                      <a
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sm font-medium hover:underline"
                        style={{ color: colorScheme.primary }}
                      >
                        Contact Now →
                      </a>
                    )}
                  </div>
                );
              })}
            </GridboxLayout>
          </div>
        </Container>
      </Section>

      {/* Social Media Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{
          backgroundColor: isDarkMode
            ? colorScheme.surface
            : colorScheme.backgroundSecondary,
        }}
      >
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="text-center mb-8"
            >
              <H2
                style={{ color: textColor }}
                className="text-2xl sm:text-3xl font-bold"
              >
                Follow Us
              </H2>
              <BodyMD
                className="max-w-2xl mx-auto"
                style={{ color: secondaryTextColor }}
              >
                Stay connected with us on social media for updates, events, and
                inspirational content
              </BodyMD>
            </FlexboxLayout>

            <GridboxLayout columns={1} responsive={{ sm: 3 }} gap="md">
              {socialMedia.map(social => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl p-5 text-center border transition-all duration-300 hover:translate-y-1 hover:shadow-md"
                    style={{
                      backgroundColor: cardBackground,
                      border: `1px solid ${borderColor}`,
                      textDecoration: 'none',
                    }}
                  >
                    <div className="flex justify-center mb-3">
                      <IconComponent
                        className="w-8 h-8"
                        style={{ color: colorScheme.primary }}
                      />
                    </div>
                    <H3
                      className="text-lg font-semibold mb-1"
                      style={{ color: cardTextColor }}
                    >
                      {social.platform}
                    </H3>
                    <BodyMD
                      className="text-sm mb-2"
                      style={{ color: secondaryTextColor }}
                    >
                      {social.handle}
                    </BodyMD>
                    <SmallText
                      className="text-xs font-medium hover:underline"
                      style={{ color: colorScheme.primary }}
                    >
                      Follow Us →
                    </SmallText>
                  </a>
                );
              })}
            </GridboxLayout>
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{
          backgroundColor: isDarkMode
            ? colorScheme.surface
            : colorScheme.backgroundSecondary,
        }}
      >
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="text-center mb-8"
            >
              <H2
                style={{ color: textColor }}
                className="text-2xl sm:text-3xl font-bold"
              >
                Send Us a Message
              </H2>
              <BodyMD style={{ color: secondaryTextColor }}>
                Have a question or prayer request? We&apos;re here to help.
              </BodyMD>
            </FlexboxLayout>

            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: formBackground,
                border: `1px solid ${borderColor}`,
              }}
            >
              <form className="space-y-5">
                <GridboxLayout columns={1} responsive={{ md: 2 }} gap="md">
                  <div>
                    <label
                      className="block font-medium mb-2 text-sm"
                      style={{ color: textColor }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                      placeholder="Your first name"
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-medium mb-2 text-sm"
                      style={{ color: textColor }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                      placeholder="Your last name"
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }}
                    />
                  </div>
                </GridboxLayout>

                <GridboxLayout columns={1} responsive={{ md: 2 }} gap="md">
                  <div>
                    <label
                      className="block font-medium mb-2 text-sm"
                      style={{ color: textColor }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                      placeholder="your.email@example.com"
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-medium mb-2 text-sm"
                      style={{ color: textColor }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                      placeholder="(555) 123-4567"
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }}
                    />
                  </div>
                </GridboxLayout>

                <div>
                  <label
                    className="block font-medium mb-2 text-sm"
                    style={{ color: textColor }}
                  >
                    Department
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    style={{
                      backgroundColor: colorScheme.white,
                      borderColor: inputBorderColor,
                      color: colorScheme.black,
                    }}
                  >
                    <option value="">Select a department...</option>
                    <option value="general">General Inquiry</option>
                    <option value="pastoral">Pastoral Care</option>
                    <option value="youth">Youth Ministry</option>
                    <option value="children">Children&apos;s Ministry</option>
                    <option value="worship">Worship & Music</option>
                    <option value="missions">Missions & Outreach</option>
                    <option value="facilities">Facilities & Events</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block font-medium mb-2 text-sm"
                    style={{ color: textColor }}
                  >
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    placeholder="Tell us how we can help you..."
                    style={{
                      backgroundColor: inputBackground,
                      borderColor: inputBorderColor,
                      color: textColor,
                    }}
                  ></textarea>
                </div>

                <FlexboxLayout justify="center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    curvature="full"
                    className="px-6 py-2 font-medium text-sm transition-colors"
                    style={{
                      backgroundColor: colorScheme.primary,
                      color: colorScheme.black,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    Send Message
                  </Button>
                </FlexboxLayout>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default ContactPage;
