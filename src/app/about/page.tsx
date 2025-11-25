/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/about.tsx
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { Banner_1, hero_bg_3, WisdomeHouseLogo } from '@/components/assets';
import { H1, H2, H3, BodyMD, BodyLG, Caption } from '@/components/text';
import CustomButton from '@/components/utils/CustomButton';
import Image from 'next/image';
import { Section, Container, GridboxLayout } from '@/components/layout';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';

const AboutUsPage = () => {
  const { colorScheme } = useTheme();

  // Theme-based styles
  const isDarkMode = colorScheme.background === '#000000';
  const textColor = isDarkMode ? colorScheme.text : colorScheme.text;
  const headingColor = isDarkMode ? colorScheme.heading : colorScheme.heading;
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const borderColor = isDarkMode ? colorScheme.border : colorScheme.border;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="About Us"
        subtitle="A Trans-Generational Movement of Greatness"
        description="Discover the heart, identity, and purpose of The Wisdom House — a vibrant, spirit-filled assembly committed to raising complete believers."
        backgroundImage={hero_bg_3.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Who We Are */}
      <Section className="py-16 lg:py-24 bg-white">
        <Container size="xl" className="px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <H1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-black">
              Who We Are
            </H1>
            <div
              className="p-8 lg:p-12 rounded-2xl shadow-lg border-l-4"
              style={{
                backgroundColor: '#ffffff',
                borderLeftColor: colorScheme.primary,
                border: `1px solid ${colorScheme.border}`,
              }}
            >
              <BodyLG className="text-lg sm:text-xl leading-relaxed text-black mb-6">
                The Wisdom House is a vibrant, spirit-filled assembly committed
                to raising complete believers — men, women, and children — who
                are rooted in Christ, empowered by His wisdom, and established
                in faith.
              </BodyLG>
              <BodyLG className="text-xl sm:text-2xl font-semibold text-black">
                We are a trans-generational movement — a house of light,
                transformation, and greatness.
              </BodyLG>
            </div>
          </div>
        </Container>
      </Section>

      {/* Our Identity */}
      <Section
        className="py-16 lg:py-24"
        style={{ backgroundColor: colorScheme.backgroundSecondary }}
      >
        <Container size="xl" className="px-6 lg:px-8">
          <GridboxLayout
            columns={2}
            gap="lg"
            responsive={{ sm: 1, md: 2 }}
            className="items-center"
          >
            {/* Text Content */}
            <div className="space-y-6">
              <H2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
                style={{ color: headingColor }}
              >
                Our Identity
                <br />
                <span style={{ color: colorScheme.primary }}>
                  The Wave of Greatness
                </span>
              </H2>
              <div className="space-y-4">
                <BodyMD style={{ color: textColor }}>
                  We are not just a church — we are a{' '}
                  <strong>Wisdom House</strong>. A place where greatness is
                  cultivated, excellence is pursued, and dominion is exercised.
                </BodyMD>
                <BodyLG
                  className="font-semibold"
                  style={{ color: headingColor }}
                >
                  Our DNA is greatness. Our culture is wisdom. Our calling is to
                  manifest the fullness of Christ in every sphere of life.
                </BodyLG>
              </div>
            </div>

            {/* Visual Content */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-2xl -z-10 scale-125 opacity-50"
                  style={{ backgroundColor: colorScheme.primaryLight }}
                />
                <div
                  className="w-56 h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden ring-4 shadow-xl"
                  style={{
                    borderColor: colorScheme.primary + '30',
                    backgroundColor: cardBackground,
                  }}
                >
                  <Image
                    src={WisdomeHouseLogo}
                    alt="Wave of Greatness"
                    width={288}
                    height={288}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <H3
                className="mt-6 text-xl lg:text-2xl font-bold"
                style={{ color: colorScheme.primary }}
              >
                Wave of Greatness
              </H3>
            </div>
          </GridboxLayout>
        </Container>
      </Section>

      {/* Membership Meaning */}
      <Section className="py-16 lg:py-24 bg-gray-50">
        <Container size="xl" className="px-6 lg:px-8">
          <div className="text-center mb-12">
            <H2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: headingColor }}
            >
              What It Means to Be a Member
            </H2>
            <BodyMD style={{ color: textColor }}>
              Embracing our identity and living out our purpose
            </BodyMD>
          </div>

          <GridboxLayout
            columns={2}
            gap="md"
            responsive={{ sm: 1, md: 2 }}
            className="mb-12"
          >
            {/* Left Column */}
            <div className="space-y-4">
              {[
                {
                  title: "Embrace God's Sovereignty",
                  desc: "To embrace God's sovereignty and grace in every aspect of life",
                },
                {
                  title: 'Spirit-Filled Living',
                  desc: 'To be Spirit-filled, Spirit-yielded, and Spirit-deep in our walk with God',
                },
                {
                  title: 'Bold Representation',
                  desc: 'To represent Christ boldly in every sphere of influence',
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[100px] flex items-center"
                  style={{
                    borderLeftColor: colorScheme.primary,
                    backgroundColor: cardBackground,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <div className="flex-1">
                    <H3
                      className="text-base font-semibold mb-2"
                      style={{ color: headingColor }}
                    >
                      {item.title}
                    </H3>
                    <Caption style={{ color: textColor }}>{item.desc}</Caption>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {[
                {
                  title: 'Pursue Excellence',
                  desc: 'To pursue excellence and productivity in all endeavors',
                },
                {
                  title: 'Live in Love & Righteousness',
                  desc: 'To live in love, righteousness, and generosity toward others',
                },
                {
                  title: 'Uphold Holiness',
                  desc: 'To reject compromise while upholding holiness in daily life',
                },
              ].map(item => (
                <div
                  key={item.title}
                  className="p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[100px] flex items-center"
                  style={{
                    borderLeftColor: colorScheme.secondary,
                    backgroundColor: cardBackground,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <div className="flex-1">
                    <H3
                      className="text-base font-semibold mb-2"
                      style={{ color: headingColor }}
                    >
                      {item.title}
                    </H3>
                    <Caption style={{ color: textColor }}>{item.desc}</Caption>
                  </div>
                </div>
              ))}
            </div>
          </GridboxLayout>

          {/* Closing Statement */}
          <div className="text-center">
            <div
              className="inline-block p-8 lg:p-12 rounded-2xl shadow-lg"
              style={{
                background: colorScheme.primaryGradient,
              }}
            >
              <BodyLG className="text-white font-medium">
                This is what it means to be part of{' '}
                <span className="font-bold">The Wisdom House</span> — a
                community where God's wisdom transforms ordinary lives into
                extraordinary testimonies of His glory.
              </BodyLG>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section
        className="py-16 lg:py-24"
        style={{ backgroundColor: colorScheme.primary }}
      >
        <Container size="xl" className="text-center px-6 lg:px-8">
          <H2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-white">
            Join Our Family
          </H2>
          <BodyMD className="text-white mb-8 max-w-2xl mx-auto">
            Ready to become part of this trans-generational movement of
            greatness?
          </BodyMD>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CustomButton
              variant="secondary"
              size="md"
              curvature="full"
              elevated
              className="px-8 py-4 font-semibold"
              style={{
                backgroundColor: colorScheme.secondary,
                color: colorScheme.onSecondary,
              }}
            >
              Plan Your First Visit
            </CustomButton>
            <CustomButton
              variant="outline"
              size="md"
              curvature="full"
              elevated
              rightIcon={<ArrowRight className="w-4 h-4 ml-2" />}
              className="px-8 py-4 font-semibold border-2 text-white border-white"
            >
              Learn More About Us
            </CustomButton>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default AboutUsPage;
